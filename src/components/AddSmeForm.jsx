import { useState } from "react";

const emptyForm = {
  smeId: "",
  businessName: "",
  sector: "",
  annualRevenue: "",
  annualIncome: "",
  monthlyRevenue: "",
  revenueGrowthRate: "",
  loanAmount: "",
  debtToIncomeRatio: "",
  businessAgeMonths: "",
  employees: "",
  latePayments12m: "",
  esgScore: "",
  financialDocsScore: "",
  cashFlowStability: "",
  revenueVolatility: "",
  creditUtilization: "",
};

const numericFields = [
  "annualRevenue",
  "annualIncome",
  "monthlyRevenue",
  "revenueGrowthRate",
  "loanAmount",
  "debtToIncomeRatio",
  "businessAgeMonths",
  "employees",
  "latePayments12m",
  "esgScore",
  "financialDocsScore",
  "cashFlowStability",
  "revenueVolatility",
  "creditUtilization",
];

export default function AddSmeForm({ onAddSme, isSubmitting = false }) {
  const [formData, setFormData] = useState(emptyForm);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((current) => ({
      ...current,
      [name]: numericFields.includes(name) ? Number(value) : value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (!formData.smeId || !formData.businessName || !formData.sector) {
      alert("Please fill in SME ID, Business Name, and Sector.");
      return;
    }

    onAddSme(formData);
    setFormData(emptyForm);
  }

  return (
    <section className="panel">
      <p className="eyebrow">Add SME</p>
      <h3>Add New SME Data</h3>
      <p className="muted">
        Enter raw SME business and financial data. The backend calculates credit
        score, readiness score, risk tier, fraud/anomaly flags, loan decision,
        forecast, and recommendations automatically.
      </p>

      <form className="smeForm" onSubmit={handleSubmit}>
        <div className="formGrid">
          <label>
            SME ID
            <input
              name="smeId"
              value={formData.smeId}
              onChange={handleChange}
              placeholder="SME_00101"
            />
          </label>

          <label>
            Business Name
            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Example Retail Co."
            />
          </label>

          <label>
            Sector
            <select
              name="sector"
              value={formData.sector}
              onChange={handleChange}
            >
              <option value="">Select sector</option>
              <option value="Retail">Retail</option>
              <option value="Manufacturing">Manufacturing</option>
              <option value="FinTech">FinTech</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Food">Food</option>
              <option value="Logistics">Logistics</option>
              <option value="AgriTech">AgriTech</option>
              <option value="Textile">Textile</option>
              <option value="Technology">Technology</option>
              <option value="Services">Services</option>
            </select>
          </label>

          <label>
            Annual Revenue
            <input
              type="number"
              name="annualRevenue"
              value={formData.annualRevenue}
              onChange={handleChange}
              placeholder="500000"
            />
          </label>

          <label>
            Annual Income
            <input
              type="number"
              name="annualIncome"
              value={formData.annualIncome}
              onChange={handleChange}
              placeholder="80000"
            />
          </label>

          <label>
            Monthly Revenue
            <input
              type="number"
              name="monthlyRevenue"
              value={formData.monthlyRevenue}
              onChange={handleChange}
              placeholder="42000"
            />
          </label>

          <label>
            Revenue Growth Rate
            <input
              type="number"
              step="0.01"
              name="revenueGrowthRate"
              value={formData.revenueGrowthRate}
              onChange={handleChange}
              placeholder="0.08"
            />
          </label>

          <label>
            Loan Amount
            <input
              type="number"
              name="loanAmount"
              value={formData.loanAmount}
              onChange={handleChange}
              placeholder="100000"
            />
          </label>

          <label>
            Debt-to-Income Ratio
            <input
              type="number"
              step="0.01"
              name="debtToIncomeRatio"
              value={formData.debtToIncomeRatio}
              onChange={handleChange}
              placeholder="0.45"
            />
          </label>

          <label>
            Business Age Months
            <input
              type="number"
              name="businessAgeMonths"
              value={formData.businessAgeMonths}
              onChange={handleChange}
              placeholder="36"
            />
          </label>

          <label>
            Employees
            <input
              type="number"
              name="employees"
              value={formData.employees}
              onChange={handleChange}
              placeholder="12"
            />
          </label>

          <label>
            Late Payments Last 12 Months
            <input
              type="number"
              name="latePayments12m"
              value={formData.latePayments12m}
              onChange={handleChange}
              placeholder="1"
            />
          </label>

          <label>
            ESG Score
            <input
              type="number"
              min="0"
              max="100"
              name="esgScore"
              value={formData.esgScore}
              onChange={handleChange}
              placeholder="70"
            />
          </label>

          <label>
            Financial Docs Score
            <input
              type="number"
              min="0"
              max="100"
              name="financialDocsScore"
              value={formData.financialDocsScore}
              onChange={handleChange}
              placeholder="75"
            />
          </label>

          <label>
            Cash Flow Stability
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              name="cashFlowStability"
              value={formData.cashFlowStability}
              onChange={handleChange}
              placeholder="0.70"
            />
          </label>

          <label>
            Revenue Volatility
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              name="revenueVolatility"
              value={formData.revenueVolatility}
              onChange={handleChange}
              placeholder="0.25"
            />
          </label>

          <label>
            Credit Utilization
            <input
              type="number"
              step="0.01"
              min="0"
              max="1"
              name="creditUtilization"
              value={formData.creditUtilization}
              onChange={handleChange}
              placeholder="0.40"
            />
          </label>
        </div>

        <button className="primaryButton" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Processing SME..." : "Send SME"}
        </button>
      </form>
    </section>
  );
}
