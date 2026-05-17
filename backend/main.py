from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import utils, workflow  # Import the new workflow

app = FastAPI(title="LexGuard API", version="0.3.0-LangGraph")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/upload")
async def analyze_contract(file: UploadFile = File(...)):
    try:
        # Extract text
        content = await file.read()
        if not content:
            raise HTTPException(status_code=400, detail="Empty file")
        
        full_text = utils.extract_text(file.filename, content)
        processed_text = full_text[:8000]
        
        # Run LangGraph workflow
        result = workflow.run_analysis(processed_text)
        
        return {
            "status": "success",
            "extraction": {"clauses": result['extracted_clauses']},
            "risk_analysis": {"assessments": result['risk_assessments']},
            "adversarial_check": {"checks": result['adversarial_checks']},
            "user_insights": {"insights": result['user_insights']}
        }
        
    except Exception as e:
        print(f"Error: {e}")
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/health")
def health_check():
    return {"status": "ok", "version": "LangGraph-Enabled"}