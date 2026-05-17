from pydantic import BaseModel, Field
from typing import List, Literal

# --- 1. Clause Extractor Schema ---
class ExtractedClause(BaseModel):
    text: str = Field(description="The exact text of the clause found in the document.")
    category: Literal["liability", "privacy", "termination", "intellectual_property", "payment", "renewal", "other"] = Field(description="The category of this clause.")

class ExtractionResult(BaseModel):
    clauses: List[ExtractedClause] = Field(description="List of all potentially risky clauses found.")

# --- 2. Risk Assessor Schema ---
class RiskAssessment(BaseModel):
    clause_text: str
    risk_score: int = Field(ge=0, le=10, description="Risk score from 0 (Safe) to 10 (Critical/Exploitative).")
    reasoning: str = Field(description="Legal reasoning why this is risky.")

class RiskResult(BaseModel):
    assessments: List[RiskAssessment]

# --- 3. Devil's Advocate Schema (Adversarial Check) ---
class DevilsAdvocateCheck(BaseModel):
    clause_text: str
    is_standard: bool = Field(description="Is this clause common/standard in this industry?")
    counter_argument: str = Field(description="How could a lawyer argue this is actually fair or enforceable?")

class DevilsAdvocateResult(BaseModel):
    checks: List[DevilsAdvocateCheck]

# --- 4. Plain Language Translator Schema (For Users) ---
class UserInsight(BaseModel):
    clause_text: str
    plain_english: str = Field(description="Simple explanation for a layperson (Young/Old friendly).")
    real_world_impact: str = Field(description="What happens in real life if this clause is triggered?")
    negotiation_tip: str = Field(description="What should the user ask to change this clause?")

class UserInsightResult(BaseModel):
    insights: List[UserInsight]