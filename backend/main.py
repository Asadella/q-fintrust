from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import math

app = FastAPI(title="Q-FinTrust Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SmeInput(BaseModel):
    smeId: str
    businessName: str
    sector: str

    annualRevenue: float = 0
    annualIncome: float = 0
    loanAmount: float = 0
    debtToIncomeRatio: float = 0.5
    loanDuration: int = 12
    employees: int = 1
    businessAgeMonths: int = 12
    latePayments12m: int = 0
    esgScore: float = 60


def clamp(value, low, high):
    return max(low, min(high, value))


def score_sme(data: SmeInput):
    revenue_score = clamp(data.annualRevenue / 500000 * 100, 0, 100)
    income_score = clamp(data.annualIncome / 100000 * 100, 0, 100)
    age_score = clamp(data.businessAgeMonths / 60 * 100, 0, 100)
    employee_score = clamp(data.employees / 50 * 100, 0, 100)

    dti_penalty = clamp(data.debtToIncomeRatio * 30, 0, 60)
    late_penalty = clamp(data.latePayments12m * 8, 0, 40)
    loan_pressure = clamp((data.loanAmount / max(data.annualRevenue, 1)) * 25, 0, 50)

    readiness_score = round(
        0.30 * revenue_score
        + 0.20 * income_score
        + 0.20 * age_score
        + 0.15 * employee_score
        + 0.15 * data.esgScore
        - dti_penalty
        - late_penalty
        - loan_pressure
    )

    readiness_score = int(clamp(readiness_score, 0, 100))

    credit_score = int(
        300
        + readiness_score * 4.5
        + data.esgScore * 0.8
        - data.latePayments12m * 15
        - data.debtToIncomeRatio * 25
    )
    credit_score = int(clamp(credit_score, 300, 850))

    fraud_flag = "Yes" if data.loanAmount > data.annualRevenue * 2 and data.annualRevenue > 0 else "No"
    anomaly_flag = "Yes" if data.debtToIncomeRatio > 4 or data.latePayments12m >= 5 else "No"

    if fraud_flag == "Yes":
        loan_decision = "REJECT"
    elif credit_score >= 680 and readiness_score >= 65:
        loan_decision = "APPROVE"
    elif credit_score >= 580 and readiness_score >= 45:
        loan_decision = "CONDITIONAL REVIEW"
    else:
        loan_decision = "DECLINE"

    if credit_score >= 760:
        risk_tier = "Very Low"
    elif credit_score >= 690:
        risk_tier = "Low"
    elif credit_score >= 600:
        risk_tier = "Medium"
    elif credit_score >= 500:
        risk_tier = "High"
    else:
        risk_tier = "Very High"

    if readiness_score >= 75:
        readiness_tier = "Investment Ready"
    elif readiness_score >= 55:
        readiness_tier = "Developing"
    elif readiness_score >= 35:
        readiness_tier = "Pre-Readiness"
    else:
        readiness_tier = "Not Ready"

    if data.esgScore >= 80:
        esg_tier = "ESG Leader"
    elif data.esgScore >= 60:
        esg_tier = "ESG Compliant"
    else:
        esg_tier = "ESG Developing"

    composite_score = int(
        0.35 * readiness_score
        + 0.30 * ((credit_score - 300) / 550 * 100)
        + 0.20 * data.esgScore
        + 0.15 * 70
    )

    if fraud_flag == "Yes":
        composite_score -= 25
    if anomaly_flag == "Yes":
        composite_score -= 10

    composite_score = int(clamp(composite_score, 0, 100))

    forecast_start = readiness_score
    forecastData = [
        {
            "month": month,
            "readiness": int(clamp(forecast_start + i * 1.5, 0, 100)),
        }
        for i, month in enumerate(
            ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]
        )
    ]

    readinessBreakdown = [
        {"dimension": "Financial Documentation", "score": int(clamp(income_score, 0, 100))},
        {"dimension": "Business Maturity", "score": int(clamp(age_score, 0, 100))},
        {"dimension": "Growth Trajectory", "score": int(clamp(revenue_score, 0, 100))},
        {"dimension": "Governance & Structure", "score": int(clamp(employee_score, 0, 100))},
        {"dimension": "Debt Management", "score": int(clamp(100 - dti_penalty - late_penalty, 0, 100))},
    ]

    shapSummary = [
        {
            "factor": "Debt-to-income ratio",
            "value": round(data.debtToIncomeRatio, 2),
            "effect": "Increases risk" if data.debtToIncomeRatio > 1 else "Decreases risk",
        },
        {
            "factor": "Late payments in 12 months",
            "value": data.latePayments12m,
            "effect": "Increases risk" if data.latePayments12m > 0 else "Decreases risk",
        },
        {
            "factor": "Annual revenue",
            "value": round(data.annualRevenue, 2),
            "effect": "Decreases risk" if data.annualRevenue > 100000 else "Increases risk",
        },
        {
            "factor": "Business age",
            "value": data.businessAgeMonths,
            "effect": "Decreases risk" if data.businessAgeMonths >= 24 else "Slightly increases risk",
        },
    ]

    improvementPlan = [
        {
            "problem": "Debt pressure",
            "rootCause": "Debt-to-income ratio affects credit strength",
            "recommendation": "Reduce short-term liabilities or increase recurring revenue",
            "targetMetric": "DTI <= 0.45",
        },
        {
            "problem": "Payment history risk",
            "rootCause": "Late payments reduce lender confidence",
            "recommendation": "Automate invoice reminders and repayment tracking",
            "targetMetric": "0 late payments in next 6 months",
        },
        {
            "problem": "Growth readiness",
            "rootCause": "Revenue and maturity affect investment readiness",
            "recommendation": "Improve monthly revenue documentation and business planning",
            "targetMetric": "Readiness score >= 75",
        },
    ]

    return {
        "smeId": data.smeId,
        "businessName": data.businessName,
        "sector": data.sector,
        "creditScore": credit_score,
        "defaultProbability": round(clamp((850 - credit_score) / 550, 0, 1), 2),
        "riskTier": risk_tier,
        "readinessScore": readiness_score,
        "readinessTier": readiness_tier,
        "loanDecision": loan_decision,
        "fraudFlag": fraud_flag,
        "anomalyFlag": anomaly_flag,
        "blockchainVerified": "Pending",
        "esgScore": int(data.esgScore),
        "esgTier": esg_tier,
        "rbacStatus": "SME access only / Investor consent required",
        "compositeScore": composite_score,
        "readinessBreakdown": readinessBreakdown,
        "forecastData": forecastData,
        "shapSummary": shapSummary,
        "improvementPlan": improvementPlan,
    }


@app.post("/api/score-sme")
def score_sme_endpoint(data: SmeInput):
    return score_sme(data)


@app.get("/api/health")
def health():
    return {"status": "ok"}