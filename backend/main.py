from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import agents, models, utils

app = FastAPI(title="LexGuard API", version="0.2.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow all for local dev
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def analyze_contract(file: UploadFile = File(...)):
    try:
        # 1. Read and Extract Text
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file")
        
        full_text = utils.extract_text(file.filename, content)
        
        # Safety limit: LLMs have context limits. We'll take the first 8000 chars.
        # In production, you'd use a chunking strategy.
        processed_text = full_text[:8000] 

        # 2. Run Multi-Agent Pipeline
        
        # Agent 1: Extract
        print("Running Agent 1: Extractor...")
        extraction_result = agents.extract_clauses(processed_text)
        
        # Convert extraction to list of dicts for next agents
        clauses_data = [clause.model_dump() for clause in extraction_result.clauses]
        
        # Agent 2: Risk Assessment
        print("Running Agent 2: Risk Assessor...")
        risk_result = agents.assess_risk(clauses_data)
        
        # Agent 3: Devil's Advocate
        print("Running Agent 3: Devil's Advocate...")
        advocate_result = agents.play_devils_advocate(clauses_data)
        
        # Agent 4: Plain Language Translator
        print("Running Agent 4: Translator...")
        insight_result = agents.translate_to_human(clauses_data)

        # 3. Return Combined Result
        return {
            "status": "success",
            "extraction": extraction_result.model_dump(),
            "risk_analysis": risk_result.model_dump(),
            "adversarial_check": advocate_result.model_dump(),
            "user_insights": insight_result.model_dump()
        }

    except Exception as e:
        print(f"Error in /upload: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok"}