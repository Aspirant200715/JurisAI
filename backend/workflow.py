from typing import TypedDict, Annotated, List
from langgraph.graph import StateGraph, END
from langchain_google_vertexai import ChatVertexAI
from langchain_core.messages import HumanMessage
import os
from dotenv import load_dotenv
import models
import json

load_dotenv(override=True)

# Load Standards
STANDARDS_PATH = os.path.join(os.path.dirname(__file__), "data/standards.json")
try:
    with open(STANDARDS_PATH, "r", encoding="utf-8") as f:
        STANDARDS_DB = json.load(f)
except Exception as e:
    print(f"Warning: Could not load standards.json: {e}")
    STANDARDS_DB = {}

def clean_json(text: str) -> dict:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith(":"):
        text = text[:-1]
    if text.endswith("```"):
        text = text[:-3]
    text = text.strip()
    return json.loads(text, strict=False)

# Initialize LLM with Google Cloud Vertex AI (ADC / IAM Credentials)
load_dotenv(override=True)
llm = ChatVertexAI(
    model_name="gemini-1.5-flash-002",
    temperature=0,
    project=os.getenv("GCP_PROJECT_ID"),
    location=os.getenv("GCP_LOCATION", "us-central1"),
    max_retries=5
)

# Define State Schema
class AgentState(TypedDict):
    document_text: str
    extracted_clauses: List[dict]
    risk_assessments: List[dict]
    adversarial_checks: List[dict]
    user_insights: List[dict]
    privacy_findings: List[dict]
    final_report: dict

# Agent 1: Clause Extractor Node
def extract_clauses_node(state: AgentState):
    print("Agent 1: Extracting clauses...")
    
    prompt = f"""
    You are a legal clause extractor. Identify potentially risky or important clauses.
    Focus on: liability, privacy, termination, IP, payment, renewal, non-compete.
    
    Contract Text:
    {state['document_text'][:6000]}
    
    Return ONLY valid JSON matching this schema:
    {{
        "clauses": [
            {{"text": "clause text", "category": "category_name"}}
        ]
    }}
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        result = clean_json(response.content)
        state['extracted_clauses'] = result.get('clauses', [])
    except Exception as e:
        print(f"Extractor JSON Error: {e}\nContent: {response.content}")
        state['extracted_clauses'] = []
    
    return state

# Agent 2: Risk Assessor Node
def assess_risk_node(state: AgentState):
    print("⚠️ Agent 2: Assessing risks & comparing to benchmarks...")
    
    clauses = state['extracted_clauses']
    if not clauses:
        state['risk_assessments'] = []
        return state
    
    # Convert standards to string for RAG context
    standards_str = json.dumps(STANDARDS_DB, indent=2)
    
    prompt = f"""
    You are a legal risk analyst. Analyze the following clauses.
    For EACH clause, you must:
    1. Score risk (0-10).
    2. Compare it against the 'Industry Standards' provided below.
    3. Calculate a 'Deviation' (Is it worse than standard? By how much?).
    
    <INDUSTRY_STANDARDS>
    {standards_str}
    </INDUSTRY_STANDARDS>
    
    Clauses to analyze:
    {clauses}
    
    Return ONLY valid JSON:
    {{
        "assessments": [
            {{
                "clause_text": "...", 
                "risk_score": 5, 
                "reasoning": "...",
                "benchmark_comparison": "Your clause is more restrictive than the standard because...",
                "deviation_score": 3
            }}
        ]
    }}
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        result = clean_json(response.content)
        state['risk_assessments'] = result.get('assessments', [])
        print(f"✅ Assessed {len(state['risk_assessments'])} clauses with benchmarks")
    except Exception as e:
        print(f"Risk Assessor JSON Error: {e}\nContent: {response.content}")
        state['risk_assessments'] = []
    
    return state

# Agent 3: Devil's Advocate Node
def devils_advocate_node(state: AgentState):
    print("Agent 3: Playing devil's advocate...")
    
    clauses = state['extracted_clauses']
    if not clauses:
        state['adversarial_checks'] = []
        return state
    
    prompt = f"""
    You are a corporate lawyer defending these clauses.
    Are they standard? Why are they fair to the company?
    
    Clauses:
    {clauses}
    
    Return ONLY valid JSON:
    {{
        "checks": [
            {{"clause_text": "...", "is_standard": true, "counter_argument": "..."}}
        ]
    }}
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        result = clean_json(response.content)
        state['adversarial_checks'] = result.get('checks', [])
    except Exception as e:
        print(f"Devils Advocate JSON Error: {e}\nContent: {response.content}")
        state['adversarial_checks'] = []
    
    return state

# Agent 4: Plain Language Translator Node
def translate_node(state: AgentState):
    print("Agent 4: Translating to plain English...")
    
    clauses = state['extracted_clauses']
    if not clauses:
        state['user_insights'] = []
        return state
    
    prompt = f"""
    You are a friendly guide explaining contracts to non-lawyers.
    For each clause, explain in plain English, real-world impact, and negotiation tips.
    
    Clauses:
    {clauses}
    
    Return ONLY valid JSON:
    {{
        "insights": [
            {{
                "clause_text": "...",
                "plain_english": "...",
                "real_world_impact": "...",
                "negotiation_tip": "..."
            }}
        ]
    }}
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        result = clean_json(response.content)
        state['user_insights'] = result.get('insights', [])
    except Exception as e:
        print(f"Translator JSON Error: {e}\nContent: {response.content}")
        state['user_insights'] = []
    return state

# Agent 5: Privacy & Compliance Scanner Node
def privacy_scan_node(state: AgentState):
    print("🛡️ Agent 5: Scanning for Privacy & Compliance risks...")
    
    prompt = f"""
    You are a Data Privacy Officer (DPO). Analyze the document for data privacy and compliance risks.
    Focus on:
    1. **Data Collection**: What personal data is collected? Is it excessive?
    2. **Third-Party Sharing**: Is data sold or shared?
    3. **User Rights**: Are rights like deletion (GDPR) or opt-out (CCPA) mentioned?
    4. **Security**: Is there a mention of encryption or security standards?
    
    Document Text:
    {state['document_text'][:6000]}
    
    Return ONLY valid JSON matching this schema:
    {{
        "findings": [
            {{
                "category": "collection|sharing|rights|security",
                "issue": "Brief description of the issue",
                "severity": "High|Medium|Low",
                "recommendation": "What the user should look for or ask"
            }}
        ]
    }}
    """
    
    response = llm.invoke([HumanMessage(content=prompt)])
    try:
        result = clean_json(response.content)
        state['privacy_findings'] = result.get('findings', [])
        print(f"✅ Found {len(state['privacy_findings'])} privacy findings")
    except Exception as e:
        print(f"Privacy Scanner JSON Error: {e}\nContent: {response.content}")
        state['privacy_findings'] = []
        
    return state

# Build the Graph
def create_workflow():
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("extractor", extract_clauses_node)
    workflow.add_node("risk_assessor", assess_risk_node)
    workflow.add_node("devils_advocate", devils_advocate_node)
    workflow.add_node("translator", translate_node)
    workflow.add_node("privacy_scan", privacy_scan_node)
    
    # Define edges (sequential flow)
    workflow.set_entry_point("extractor")
    workflow.add_edge("extractor", "risk_assessor")
    workflow.add_edge("risk_assessor", "devils_advocate")
    workflow.add_edge("devils_advocate", "translator")
    workflow.add_edge("translator", "privacy_scan")
    workflow.add_edge("privacy_scan", END)
    
    return workflow.compile()

# Main execution function
def run_analysis(document_text: str):
    workflow = create_workflow()
    
    initial_state = {
        "document_text": document_text,
        "extracted_clauses": [],
        "risk_assessments": [],
        "adversarial_checks": [],
        "user_insights": [],
        "privacy_findings": [],
        "final_report": {}
    }
    
    result = workflow.invoke(initial_state)
    return result