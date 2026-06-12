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
};

export default function AddSmeForm({ onAddSme }) {
  const [formData, setFormData] = useState(emptyForm);

  function handleChange(event) {
    const { name, value } = event.target;

    const numericFields = [
      "creditScore",
      "defaultProbability",
      "readinessScore",
      "esgScore",
      "compositeScore"
    ];

    setFormData((current) => ({
      ...current,
      [name]: numericFields.includes(name) ? Number(value) : value
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
      <h3>Add New SME Data</h3>
      <p className="muted">
        Add a new SME profile to test the frontend dashboard. This is saved in browser local storage.
      </p>

      <form className="smeForm" onSubmit={handleSubmit}>
        <div className="formGrid">
          <label>
            SME ID
            <input
              name="smeId"
              value={formData.smeId}
              onChange={handleChange}
              placeholder="SME_004"
            />
          </label>

          <label>
            Business Name
            <input
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              placeholder="Delta Foods Ltd."
            />
          </label>

          <label>
            Sector
            <input
              name="sector"
              value={formData.sector}
              onChange={handleChange}
              placeholder="Retail, Tech, Manufacturing..."
            />
          </label>

          <label>
            Credit Score
            <input
              type="number"
              name="creditScore"
              value={formData.creditScore}
              onChange={handleChange}
              min="300"
              max="1000"
            />
          </label>

          <label>
            Default Probability
            <input
              type="number"
              name="defaultProbability"
              value={formData.defaultProbability}
              onChange={handleChange}
              min="0"
              max="1"
              step="0.01"
            />
          </label>

          <label>
            Risk Tier
            <select name="riskTier" value={formData.riskTier} onChange={handleChange}>
              <option>Very Low</option>
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
              <option>Very High</option>
            </select>
          </label>

          <label>
            Readiness Score
            <input
              type="number"
              name="readinessScore"
              value={formData.readinessScore}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </label>

          <label>
            Readiness Tier
            <select
              name="readinessTier"
              value={formData.readinessTier}
              onChange={handleChange}
            >
              <option>Investment Ready</option>
              <option>Developing</option>
              <option>Pre-Readiness</option>
              <option>Not Ready</option>
            </select>
          </label>

          <label>
            Loan Decision
            <select
              name="loanDecision"
              value={formData.loanDecision}
              onChange={handleChange}
            >
              <option>APPROVE</option>
              <option>CONDITIONAL REVIEW</option>
              <option>REJECT</option>
            </select>
          </label>

          <label>
            Fraud Flag
            <select name="fraudFlag" value={formData.fraudFlag} onChange={handleChange}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            Anomaly Flag
            <select name="anomalyFlag" value={formData.anomalyFlag} onChange={handleChange}>
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            Blockchain Verified
            <select
              name="blockchainVerified"
              value={formData.blockchainVerified}
              onChange={handleChange}
            >
              <option>No</option>
              <option>Yes</option>
            </select>
          </label>

          <label>
            ESG Score
            <input
              type="number"
              name="esgScore"
              value={formData.esgScore}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </label>

          <label>
            ESG Tier
            <select name="esgTier" value={formData.esgTier} onChange={handleChange}>
              <option>ESG Leader</option>
              <option>ESG Compliant</option>
              <option>ESG Developing</option>
              <option>ESG Risk</option>
            </select>
          </label>

          <label>
            Composite Score
            <input
              type="number"
              name="compositeScore"
              value={formData.compositeScore}
              onChange={handleChange}
              min="0"
              max="100"
            />
          </label>
        </div>

        <button className="primaryButton" type="submit">
          Add SME to Dashboard
        </button>
      </form>
    </section>
  );
}