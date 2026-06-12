from math import isfinite


def clamp(value, low, high):
    return max(low, min(high, value))


def to_float(value, default=0.0):
    try:
        number = float(value)
        if not isfinite(number):
            return default
        return number
    except Exception:
        return default


def to_int(value, default=0):
    try:
        return int(float(value))
    except Exception:
        return default


def risk_tier_from_credit(credit_score):
    if credit_score >= 760:
        return "Very Low"
    if credit_score >= 690:
        return "Low"
    if credit_score >= 600:
        return "Medium"
    if credit_score >= 500:
        return "High"
    return "Very High"


def readiness_tier_from_score(readiness_score):
    if readiness_score >= 75:
        return "Investment Ready"
    if readiness_score >= 55:
        return "Developing"
    if readiness_score >= 35:
        return "Pre-Readiness"
    return "Not Ready"


def esg_tier_from_score(esg_score):
    if esg_score >= 80:
        return "ESG Leader"
    if esg_score >= 60:
        return "ESG Compliant"
    return "ESG Developing"


def loan_decision_from_scores(credit_score, readiness_score, fraud_flag, anomaly_flag):
    if fraud_flag == "Yes":
        return "REJECT"

    if credit_score >= 680 and readiness_score >= 65 and anomaly_flag == "No":
        return "APPROVE"

    if credit_score >= 570 and readiness_score >= 45:
        return "CONDITIONAL REVIEW"

    return "DECLINE"


def build_loan_matches(sector, credit_score, readiness_score, loan_amount):
    strong = credit_score >= 680 and readiness_score >= 65
    medium = credit_score >= 570 and readiness_score >= 45

    if strong:
        approval_1, approval_2, approval_3 = "84%", "76%", "69%"
        rate_1, rate_2, rate_3 = "8.5% p.a.", "11.0% p.a.", "13.5% p.a."
    elif medium:
        approval_1, approval_2, approval_3 = "67%", "61%", "54%"
        rate_1, rate_2, rate_3 = "11.5% p.a.", "14.0% p.a.", "17.0% p.a."
    else:
        approval_1, approval_2, approval_3 = "42%", "38%", "31%"
        rate_1, rate_2, rate_3 = "16.5% p.a.", "19.0% p.a.", "22.0% p.a."

    requested = max(to_float(loan_amount, 50000), 1000)

    return [
        {
            "rank": 1,
            "lender": "Bank A",
            "loanType": "SME Working Capital Loan",
            "approvalProbability": approval_1,
            "interestRate": rate_1,
            "maxAmount": f"${int(requested * 1.5):,}",
        },
        {
            "rank": 2,
            "lender": "FinTech B",
            "loanType": "Revenue-Based Financing",
            "approvalProbability": approval_2,
            "interestRate": rate_2,
            "maxAmount": f"${int(requested):,}",
        },
        {
            "rank": 3,
            "lender": "MFI C",
            "loanType": f"{sector} SME Support Loan",
            "approvalProbability": approval_3,
            "interestRate": rate_3,
            "maxAmount": f"${int(requested * 0.5):,}",
        },
    ]


def build_investor_matches(sector, risk_tier, esg_score, readiness_score):
    if readiness_score >= 75 and esg_score >= 70:
        match_1, match_2, match_3 = "91%", "84%", "78%"
    elif readiness_score >= 55:
        match_1, match_2, match_3 = "76%", "69%", "62%"
    else:
        match_1, match_2, match_3 = "55%", "49%", "41%"

    return [
        {
            "rank": 1,
            "investorType": "Impact Investment Fund",
            "investmentRange": "$100K-$500K",
            "matchScore": match_1,
            "riskAppetite": "Medium",
            "preferredSectors": f"{sector}, ESG-focused SMEs",
        },
        {
            "rank": 2,
            "investorType": "Angel Investor Network",
            "investmentRange": "$50K-$200K",
            "matchScore": match_2,
            "riskAppetite": "High",
            "preferredSectors": f"{sector}, Retail, Technology",
        },
        {
            "rank": 3,
            "investorType": "Development Finance Institution",
            "investmentRange": "$200K-$1M",
            "matchScore": match_3,
            "riskAppetite": "Low" if risk_tier in ["Very Low", "Low"] else "Medium",
            "preferredSectors": "All sectors, inclusive finance",
        },
    ]


def score_sme(raw):
    sme_id = str(raw.get("smeId", "")).strip()
    business_name = str(raw.get("businessName", "")).strip()
    sector = str(raw.get("sector", "SME")).strip() or "SME"

    annual_revenue = to_float(raw.get("annualRevenue"), 0)
    annual_income = to_float(raw.get("annualIncome"), 0)
    monthly_revenue = to_float(
        raw.get("monthlyRevenue"), annual_revenue / 12 if annual_revenue else 0
    )
    revenue_growth_rate = to_float(raw.get("revenueGrowthRate"), 0)
    loan_amount = to_float(raw.get("loanAmount"), 0)
    debt_to_income_ratio = to_float(raw.get("debtToIncomeRatio"), 0)
    business_age_months = to_int(raw.get("businessAgeMonths"), 0)
    employees = to_int(raw.get("employees"), 1)
    late_payments = to_int(raw.get("latePayments12m"), 0)
    esg_score = int(clamp(to_float(raw.get("esgScore"), 60), 0, 100))

    financial_docs_score = int(
        clamp(to_float(raw.get("financialDocsScore"), 60), 0, 100)
    )
    cash_flow_stability = clamp(to_float(raw.get("cashFlowStability"), 0.6), 0, 1)
    revenue_volatility = clamp(to_float(raw.get("revenueVolatility"), 0.3), 0, 1)
    credit_utilization = clamp(to_float(raw.get("creditUtilization"), 0.4), 0, 1)

    revenue_score = clamp((annual_revenue / 500000) * 100, 0, 100)
    income_score = clamp((annual_income / 120000) * 100, 0, 100)
    maturity_score = clamp((business_age_months / 60) * 100, 0, 100)
    employee_score = clamp((employees / 50) * 100, 0, 100)

    growth_score = clamp(50 + revenue_growth_rate * 100, 0, 100)
    cashflow_score = cash_flow_stability * 100
    volatility_penalty = revenue_volatility * 25
    dti_penalty = clamp(debt_to_income_ratio * 18, 0, 55)
    late_penalty = clamp(late_payments * 8, 0, 45)
    credit_utilization_penalty = credit_utilization * 20

    debt_management_score = clamp(
        100 - dti_penalty - late_penalty - credit_utilization_penalty,
        0,
        100,
    )

    readiness_breakdown = [
        {"dimension": "Financial Documentation", "score": int(financial_docs_score)},
        {"dimension": "Business Maturity", "score": int(maturity_score)},
        {"dimension": "Growth Trajectory", "score": int(growth_score)},
        {
            "dimension": "Governance & Structure",
            "score": int((employee_score + esg_score) / 2),
        },
        {"dimension": "Debt Management", "score": int(debt_management_score)},
    ]

    readiness_score = int(
        clamp(
            0.24 * financial_docs_score
            + 0.18 * maturity_score
            + 0.18 * growth_score
            + 0.15 * cashflow_score
            + 0.15 * debt_management_score
            + 0.10 * esg_score,
            0,
            100,
        )
    )

    credit_score = int(
        clamp(
            300
            + readiness_score * 3.25
            + esg_score * 0.65
            + cashflow_score * 0.75
            + income_score * 0.45
            - dti_penalty * 1.4
            - late_penalty * 1.7
            - volatility_penalty
            - credit_utilization_penalty,
            300,
            850,
        )
    )

    anomaly_flag = (
        "Yes"
        if debt_to_income_ratio > 2.5
        or late_payments >= 3
        or revenue_volatility > 0.7
        or credit_utilization > 0.85
        else "No"
    )

    fraud_flag = (
        "Yes" if loan_amount > annual_revenue * 1.5 and annual_revenue > 0 else "No"
    )

    risk_tier = risk_tier_from_credit(credit_score)
    readiness_tier = readiness_tier_from_score(readiness_score)
    esg_tier = esg_tier_from_score(esg_score)
    loan_decision = loan_decision_from_scores(
        credit_score,
        readiness_score,
        fraud_flag,
        anomaly_flag,
    )

    normalized_credit = ((credit_score - 300) / 550) * 100
    # governance_score combines financial documentation quality and ESG standing
    governance_score = (financial_docs_score + esg_score) / 2
    composite_score = int(
        clamp(
            0.35 * readiness_score
            + 0.30 * normalized_credit
            + 0.20 * esg_score
            + 0.15 * governance_score,
            0,
            100,
        )
    )

    if fraud_flag == "Yes":
        composite_score = max(0, composite_score - 25)
    if anomaly_flag == "Yes":
        composite_score = max(0, composite_score - 10)

    # PD base: 0.0 at credit=850, 1.0 at credit=300; risk flags add penalty (clamped to [0, 1])
    default_probability = round(
        clamp(
            1
            - ((credit_score - 300) / 550)
            + (0.08 if anomaly_flag == "Yes" else 0)
            + (0.12 if fraud_flag == "Yes" else 0),
            0,
            1,
        ),
        2,
    )

    months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ]
    forecast_data = []
    for index, month in enumerate(months):
        projected_readiness = int(clamp(readiness_score + index * 1.2, 0, 100))
        projected_revenue = monthly_revenue * (
            (1 + revenue_growth_rate) ** (index / 12)
        )
        forecast_data.append(
            {
                "month": month,
                "readiness": projected_readiness,
                "revenue": int(max(0, projected_revenue)),
            }
        )

    shap_summary = [
        {
            "factor": "Debt-to-income ratio",
            "value": round(debt_to_income_ratio, 2),
            "effect": (
                "Increases risk" if debt_to_income_ratio > 0.6 else "Decreases risk"
            ),
        },
        {
            "factor": "Late payments in 12 months",
            "value": late_payments,
            "effect": "Increases risk" if late_payments > 0 else "Decreases risk",
        },
        {
            "factor": "Cash flow stability",
            "value": round(cash_flow_stability, 2),
            "effect": (
                "Decreases risk" if cash_flow_stability >= 0.6 else "Increases risk"
            ),
        },
        {
            "factor": "Revenue volatility",
            "value": round(revenue_volatility, 2),
            "effect": (
                "Increases risk" if revenue_volatility > 0.45 else "Decreases risk"
            ),
        },
        {
            "factor": "Credit utilization",
            "value": round(credit_utilization, 2),
            "effect": (
                "Increases risk" if credit_utilization > 0.65 else "Decreases risk"
            ),
        },
    ]

    improvement_plan = [
        {
            "problem": "Debt pressure",
            "rootCause": "Debt-to-income ratio and credit utilization affect credit strength",
            "recommendation": "Reduce short-term liabilities and keep credit utilization below 60%",
            "targetMetric": "DTI <= 0.45 and utilization <= 0.60",
        },
        {
            "problem": "Financial documentation gap",
            "rootCause": "Incomplete documentation reduces lender confidence",
            "recommendation": "Prepare audited financial statements and monthly cash-flow reports",
            "targetMetric": "Documentation score >= 75",
        },
        {
            "problem": "Readiness improvement",
            "rootCause": "Business maturity, growth, and cash-flow stability affect investment readiness",
            "recommendation": "Improve recurring revenue, reduce volatility, and maintain payment discipline",
            "targetMetric": "Readiness score >= 75",
        },
    ]

    return {
        "smeId": sme_id,
        "businessName": business_name,
        "sector": sector,
        "creditScore": credit_score,
        "defaultProbability": default_probability,
        "riskTier": risk_tier,
        "readinessScore": readiness_score,
        "readinessTier": readiness_tier,
        "loanDecision": loan_decision,
        "fraudFlag": fraud_flag,
        "anomalyFlag": anomaly_flag,
        "blockchainVerified": "Pending",
        "esgScore": esg_score,
        "esgTier": esg_tier,
        "rbacStatus": "SME access only / Investor consent required",
        "compositeScore": composite_score,
        "readinessBreakdown": readiness_breakdown,
        "forecastData": forecast_data,
        "shapSummary": shap_summary,
        "improvementPlan": improvement_plan,
        "loanMatches": build_loan_matches(
            sector, credit_score, readiness_score, loan_amount
        ),
        "investorMatches": build_investor_matches(
            sector, risk_tier, esg_score, readiness_score
        ),
    }
