import os
from google import genai
from google.genai import types
from dotenv import load_dotenv
import models

load_dotenv()

# Initialize Google Gemini Client
# Make sure to put your GOOGLE_API_KEY in .env
client = genai.Client(api_key=os.getenv("GOOGLE_API_KEY"))

MODEL_NAME = "gemini-2.5-flash" # Fast and cheap for hackathons

def run_agent(model_name, prompt, output_schema):
    """
    Generic runner for all agents. 
    Forces JSON output so we don't get random text.
    """
    try:
        response = client.models.generate_content(
            model=model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=output_schema
            )
        )
        # Validate the JSON against our Pydantic model
        return output_schema.model_validate_json(response.text)
    except Exception as e:
        print(f"Agent Error: {e}")
        # Fallback for safety
        return None

# --- Agent 1: The Extractor ---
def extract_clauses(text: str) -> models.ExtractionResult:
    prompt = f"""
    You are a legal clause extractor. 
    Read the following contract text. Identify clauses that are potentially risky, ambiguous, or exploitative.
    Focus on: Liability, Privacy, Termination, IP, Payments, Auto-Renewal.
    
    Contract Text:
    {text[:4000]} 
    """ # Limited text for speed/safety in 6h window
    return run_agent(MODEL_NAME, prompt, models.ExtractionResult)

# --- Agent 2: The Risk Assessor ---
def assess_risk(clauses: list[dict]) -> models.RiskResult:
    prompt = f"""
    You are a legal risk analyst. 
    Analyze the following clauses. Assign a risk score (0-10) and explain WHY it is risky.
    
    Clauses:
    {clauses}
    """
    return run_agent(MODEL_NAME, prompt, models.RiskResult)

# --- Agent 3: The Devil's Advocate ---
def play_devils_advocate(clauses: list[dict]) -> models.DevilsAdvocateResult:
    prompt = f"""
    You are a strict corporate lawyer representing the company who wrote this contract.
    Look at these clauses. Defend them. Is this industry standard? Why is this fair to the company?
    
    Clauses:
    {clauses}
    """
    return run_agent(MODEL_NAME, prompt, models.DevilsAdvocateResult)

# --- Agent 4: The Translator ---
def translate_to_human(clauses: list[dict]) -> models.UserInsightResult:
    prompt = f"""
    You are a friendly guide helping a non-lawyer understand a contract.
    For these clauses, explain:
    1. What this means in plain English (no jargon).
    2. What is the real-world impact? (e.g., "You could lose your house")
    3. What is a negotiation tip? (e.g., "Ask to limit this to 1 year")
    
    Clauses:
    {clauses}
    """
    return run_agent(MODEL_NAME, prompt, models.UserInsightResult)