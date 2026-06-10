import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { AlertTriangle, CheckCircle2, LockKeyhole, ShieldCheck } from "lucide-react";
import KpiCard from "./KpiCard.jsx";
import Table from "./Table.jsx";
import {
  forecastData,
  improvementPlan,
  loanMatches,
  readinessBreakdown,
  shapSummary
} from "../data/mockData.js";

export default function SmeDashboard({ sme }) {
    const readinessBreakdownData = sme.readinessBreakdown || readinessBreakdown;
    const forecastDataForSme = sme.forecastData || forecastData;
    const shapSummaryData = sme.shapSummary || shapSummary;
    const improvementPlanData = sme.improvementPlan || improvementPlan;
    const loanMatchesData = sme.loanMatches || loanMatches;
    const riskTone =
    sme.riskTier === "Very Low" || sme.riskTier === "Low"
      ? "positive"
      : sme.riskTier === "Medium"
      ? "warning"
      : "danger";

  const decisionTone =
    sme.loanDecision === "APPROVE"
      ? "positive"
      : sme.loanDecision === "CONDITIONAL REVIEW"
      ? "warning"
      : "danger";

  return (
    <section className="dashboard">
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">SME View</p>
          <h2>{sme.businessName}</h2>
          <p className="muted">
            Sector: {sme.sector} · SME ID: {sme.smeId}
          </p>
        </div>
        <div className={`decisionPill ${decisionTone}`}>{sme.loanDecision}</div>
      </div>

      <div className="kpiGrid">
        <KpiCard title="Credit Score" value={sme.creditScore} subtitle={sme.riskTier} tone={riskTone} />
        <KpiCard title="Readiness Score" value={sme.readinessScore} subtitle={sme.readinessTier} tone="positive" />
        <KpiCard title="ESG Score" value={sme.esgScore} subtitle={sme.esgTier} tone="neutral" />
        <KpiCard title="Composite Score" value={sme.compositeScore} subtitle="Q-FinTrust score" tone="positive" />
      </div>

      <div className="statusGrid">
        <div className="statusCard">
          <ShieldCheck />
          <div>
            <strong>Blockchain Verified</strong>
            <span>{sme.blockchainVerified}</span>
          </div>
        </div>
        <div className="statusCard">
          <CheckCircle2 />
          <div>
            <strong>Fraud Flag</strong>
            <span>{sme.fraudFlag}</span>
          </div>
        </div>
        <div className="statusCard">
          <AlertTriangle />
          <div>
            <strong>Anomaly Flag</strong>
            <span>{sme.anomalyFlag}</span>
          </div>
        </div>
        <div className="statusCard">
          <LockKeyhole />
          <div>
            <strong>RBAC / Privacy Status</strong>
            <span>{sme.rbacStatus}</span>
          </div>
        </div>
      </div>

      <div className="twoColumn">
        <div className="panel">
          <h3>Readiness Dimension Breakdown</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={readinessBreakdownData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="dimension" tick={{ fontSize: 11 }} />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar dataKey="score" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>12-Month Readiness Forecast</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={forecastDataForSme}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="readiness" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3>SHAP-style Credit Risk Explanation</h3>
        <Table
          columns={[
            { key: "factor", label: "Factor" },
            { key: "value", label: "Value" },
            { key: "effect", label: "Effect on Risk" }
          ]}
          rows={shapSummaryData}
        />
      </div>

      <div className="panel">
        <h3>Financing Readiness Improvement Plan</h3>
        <Table
          columns={[
            { key: "problem", label: "Problem" },
            { key: "rootCause", label: "Root Cause" },
            { key: "recommendation", label: "Recommendation" },
            { key: "targetMetric", label: "Target Metric" }
          ]}
          rows={improvementPlanData}
        />
      </div>

      <div className="panel">
        <h3>Top Loan Matches</h3>
        <Table
          columns={[
            { key: "rank", label: "Rank" },
            { key: "lender", label: "Lender" },
            { key: "loanType", label: "Loan Type" },
            { key: "approvalProbability", label: "Approval Probability" },
            { key: "interestRate", label: "Interest Rate" },
            { key: "maxAmount", label: "Max Amount" }
          ]}
          rows={loanMatchesData}
        />
      </div>
    </section>
  );
}
