# Q-FinTrust

**Q-FinTrust** is a trustworthy and explainable financing-support platform for Small and Medium Enterprises (SMEs). The project helps SMEs organize financial information, receive financing readiness feedback, and present a clearer risk profile to investors and lenders.

The platform focuses on three main ideas:

1. **Trustworthy financial records**
2. **Explainable financing decisions**
3. **Actionable improvement guidance for SMEs**

Q-FinTrust was developed as a Basic Engineering Design project by Team No. 4.

---

## Live Demo

Frontend demo:

```text
https://q-fintrust.vercel.app/
```

Backend API:

```text
https://q-fintrust-bice.vercel.app/
```

API documentation:

```text
https://q-fintrust-bice.vercel.app/docs
```

---

## Project Motivation

SMEs often face difficulty getting loans or investment because their financial records are scattered, hard to verify, or difficult for reviewers to trust. Traditional financing workflows usually depend on static documents, repeated manual checking, and credit decisions that are not clearly explained to the SME.

Q-FinTrust addresses this problem by giving SMEs, investors, and lenders a shared platform where financing information can be scored, interpreted, and reviewed more transparently.

---

## Core Problem

SME financing decisions can fail when financial information cannot be:

- independently verified,
- clearly explained,
- checked for fraud or anomalies before capital is committed,
- reused across multiple investors or lenders,
- converted into actionable next steps for the SME.

Q-FinTrust is designed to reduce this trust gap by combining scoring, explainability, forecasting, fraud/anomaly flags, and dashboard-based decision support.

---

## Main Features

### SME Dashboard

The SME Dashboard presents a full financial readiness profile for each SME.

It includes:

- credit score,
- default probability,
- risk tier,
- readiness score,
- readiness category,
- ESG score,
- loan decision,
- fraud flag,
- anomaly flag,
- blockchain verification status,
- readiness breakdown,
- 12-month forecast,
- SHAP-style explanation,
- improvement plan,
- loan matches,
- investor matches.

---

### Investor Dashboard

The Investor Dashboard helps reviewers compare SMEs quickly.

It includes:

- SME ranking,
- search and filtering,
- investment-readiness comparison,
- risk tier display,
- ESG and composite score view,
- investor match indicators,
- selected SME profile overview.

---

### Add SME Form

The Add SME form allows users to submit raw SME data such as:

- business name,
- sector,
- annual revenue,
- annual income,
- monthly revenue,
- revenue growth rate,
- loan amount,
- debt-to-income ratio,
- business age,
- number of employees,
- late payments,
- ESG score,
- financial documentation score,
- cash flow stability,
- revenue volatility,
- credit utilization.

The submitted data is sent to the FastAPI backend, where the SME is scored live and returned as a structured profile.

---

## System Architecture

Current system flow:

```text
React Frontend
      ↓
FastAPI Backend
      ↓
Scoring Engine
      ↓
Generated SME Profile
      ↓
Dashboard Display
```

Current backend flow:

```text
POST /api/score-sme
      ↓
Validate SME input
      ↓
Calculate readiness score
      ↓
Calculate credit score
      ↓
Calculate risk tier and default probability
      ↓
Detect anomaly and fraud flags
      ↓
Generate forecast data
      ↓
Generate explanation and improvement plan
      ↓
Return complete SME profile as JSON
```

---

## Technology Stack

### Frontend

- React
- Vite
- JavaScript
- CSS
- Vercel deployment

### Backend

- Python
- FastAPI
- Pydantic
- CORS middleware
- Vercel deployment

### Data / ML / Research Components

- Jupyter Notebook
- XGBoost research module
- Prophet forecasting research module
- SHAP explainability concept
- Blockchain verification prototype
- Fraud and anomaly detection logic
- Synthetic SME datasets

---

## Backend API

### Health Check

```http
GET /api/health
```

Response:

```json
{
  "status": "ok"
}
```

---

### Score SME

```http
POST /api/score-sme
```

Example request:

```json
{
  "smeId": "SME-001",
  "businessName": "Green Bakery",
  "sector": "Food & Retail",
  "annualRevenue": 250000,
  "annualIncome": 60000,
  "monthlyRevenue": 21000,
  "revenueGrowthRate": 0.12,
  "loanAmount": 50000,
  "debtToIncomeRatio": 0.45,
  "businessAgeMonths": 48,
  "employees": 12,
  "latePayments12m": 1,
  "esgScore": 72,
  "financialDocsScore": 80,
  "cashFlowStability": 0.75,
  "revenueVolatility": 0.25,
  "creditUtilization": 0.40
}
```

Example response fields:

```json
{
  "smeId": "SME-001",
  "businessName": "Green Bakery",
  "sector": "Food & Retail",
  "creditScore": 720,
  "defaultProbability": 0.24,
  "riskTier": "Low",
  "readinessScore": 76,
  "readinessTier": "Investment Ready",
  "loanDecision": "APPROVE",
  "fraudFlag": "No",
  "anomalyFlag": "No",
  "blockchainVerified": "Pending",
  "esgScore": 72,
  "esgTier": "ESG Compliant",
  "compositeScore": 78,
  "readinessBreakdown": [],
  "forecastData": [],
  "shapSummary": [],
  "improvementPlan": [],
  "loanMatches": [],
  "investorMatches": []
}
```

---

## Scoring Logic Overview

The current backend calculates SME financing outputs using rule-based scoring formulas.

### Readiness Score

The readiness score combines:

- financial documentation quality,
- business maturity,
- revenue growth trajectory,
- cash-flow stability,
- debt management,
- ESG score.

### Credit Score

The credit score is calculated from:

- readiness score,
- ESG score,
- cash-flow stability,
- annual income,
- debt-to-income penalty,
- late-payment penalty,
- revenue volatility penalty,
- credit utilization penalty.

### Risk Tier

The risk tier is determined from the credit score:

```text
760+  → Very Low
690+  → Low
600+  → Medium
500+  → High
<500  → Very High
```

### Loan Decision

The backend returns one of the following decisions:

```text
APPROVE
CONDITIONAL REVIEW
DECLINE
REJECT
```

Fraud-flagged applications are rejected automatically.

---

## Explainability

Q-FinTrust includes SHAP-style explanations to show why the system considers an SME stronger or weaker.

The explanation currently focuses on factors such as:

- debt-to-income ratio,
- late payments,
- cash-flow stability,
- revenue volatility,
- credit utilization.

This helps SMEs understand what affected their result instead of receiving a hidden black-box score.

---

## Forecasting

The system generates 12-month forecast data for dashboard visualization.

The forecast currently includes:

- projected readiness score,
- projected monthly revenue.

This helps SMEs and investors understand how the business may develop over the next year.

---

## Blockchain Verification Concept

The project includes a blockchain verification concept for record integrity.

The intended blockchain role is to:

- register SME identity,
- store document hashes,
- detect tampering,
- preserve audit logs,
- support verification status,
- create a trusted record trail for investors and auditors.

In the current deployed website, blockchain verification is still shown as a prototype status rather than a fully live on-chain verification flow.

---

## Project Modules

### Classical AI / Scoring

Responsible for credit scoring, risk evaluation, readiness calculation, and explainability.

### Forecasting

Responsible for projecting SME readiness and revenue trends.

### Blockchain

Responsible for document integrity, hashing, tamper detection, and audit-trail concepts.

### Privacy and Security

Responsible for access-control thinking, IDS/IPS concepts, secure data handling, and attack-surface analysis.

### Frontend

Responsible for building the user interface, dashboards, SME submission form, investor view, and deployment.

### Integration

Responsible for connecting frontend inputs to backend scoring outputs and preparing the project for live demonstration.

---

## Current Backend Files

Current simplified backend structure:

```text
backend/
├── app.py
└── scoring.py
```

`app.py` defines the FastAPI application, CORS rules, health check route, and SME scoring endpoint.

`scoring.py` contains the current scoring logic and returns the full SME profile used by the frontend.

---

## Recommended Future Backend Structure

For a cleaner production-style backend, the current scoring file can be refactored into modules:

```text
backend/
├── app.py
├── schemas.py
├── database.py
├── services/
│   ├── scoring.py
│   ├── readiness.py
│   ├── forecast.py
│   ├── fraud.py
│   ├── blockchain.py
│   ├── recommendations.py
│   └── matching.py
└── data/
    └── backendProfiles.json
```

This would make the backend easier to maintain, test, explain, and extend.

---

## Current Limitations

The current version is a working prototype, but it still has limitations:

- Added SMEs may still depend on frontend/browser storage if database persistence is not connected.
- Blockchain verification is not yet fully live on-chain in the deployed website.
- The Jupyter notebook is used for research and model development, but not fully converted into backend services.
- Some scoring logic is rule-based rather than fully model-driven.
- Authentication and role-based dashboards are not fully implemented.
- A production database is not yet fully integrated.

---

## Planned Improvements

Future improvements include:

- replace localStorage with Supabase or PostgreSQL,
- save every submitted SME profile in a shared database,
- move notebook logic into backend service modules,
- add user authentication for SME, investor, and admin roles,
- connect real blockchain testnet verification,
- generate downloadable PDF reports,
- add stronger fraud/anomaly testing,
- add live dashboard updates,
- improve frontend search, filtering, and ranking,
- modularize the backend for production-style maintainability.

---

## How to Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/Asadella/q-fintrust.git
cd q-fintrust
```

---

### 2. Run the frontend

```bash
npm install
npm run dev
```

The frontend should run at:

```text
http://localhost:5173
```

---

### 3. Run the backend

Go to the backend folder or wherever `app.py` is located.

Install dependencies:

```bash
pip install fastapi uvicorn pydantic
```

Run FastAPI:

```bash
uvicorn app:app --reload
```

The backend should run at:

```text
http://127.0.0.1:8000
```

API docs:

```text
http://127.0.0.1:8000/docs
```

---

## Environment Variables

For the deployed frontend, set the backend URL:

```env
VITE_API_URL=https://q-fintrust-bice.vercel.app
```

For local development:

```env
VITE_API_URL=http://127.0.0.1:8000
```

---

## Team

Team No. 4

Project members:

- Khan
- Alve
- Thor
- Shokh
- Ikhwan
- Yertai

---

## Project Status

Q-FinTrust is currently a functional academic prototype with:

- deployed frontend,
- deployed FastAPI backend,
- live SME scoring endpoint,
- investor and SME dashboard views,
- explainability output,
- readiness scoring,
- risk tiering,
- forecast visualization,
- prototype blockchain verification concept.

The next major engineering step is to connect a real database and fully modularize the backend so the system can behave more like a production fintech platform.

---

## License

This project was developed for academic purposes as part of a Basic Engineering Design course.

