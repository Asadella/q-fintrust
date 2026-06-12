from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from scoring import score_sme


app = FastAPI(title="Q-FinTrust Backend")


app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


class SmeInput(BaseModel):
    smeId: str = Field(..., min_length=1)
    businessName: str = Field(..., min_length=1)
    sector: str = Field(..., min_length=1)

    annualRevenue: float = 0
    annualIncome: float = 0
    monthlyRevenue: float = 0
    revenueGrowthRate: float = 0
    loanAmount: float = 0
    debtToIncomeRatio: float = 0
    businessAgeMonths: int = 0
    employees: int = 1
    latePayments12m: int = 0
    esgScore: float = 60

    financialDocsScore: float = 60
    cashFlowStability: float = 0.6
    revenueVolatility: float = 0.3
    creditUtilization: float = 0.4


@app.get("/api/health")
def health():
    return {"status": "ok"}


@app.post("/api/score-sme")
def score_sme_endpoint(data: SmeInput):
    try:
        return score_sme(data.model_dump())
    except Exception as error:
        raise HTTPException(status_code=500, detail=str(error))