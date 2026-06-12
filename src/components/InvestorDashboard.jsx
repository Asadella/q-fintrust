import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import KpiCard from "./KpiCard.jsx";
import Table from "./Table.jsx";

function buildInvestorMatches(sme) {
  if (!sme) return [];

  if (sme.investorMatches?.length) {
    return sme.investorMatches;
  }

  const readiness = Number(sme.readinessScore || 0);
  const esg = Number(sme.esgScore || 0);

  const matchA = readiness >= 75 && esg >= 70 ? "91%" : readiness >= 55 ? "76%" : "55%";
  const matchB = readiness >= 75 ? "84%" : readiness >= 55 ? "69%" : "49%";
  const matchC = esg >= 70 ? "78%" : readiness >= 55 ? "62%" : "41%";

  return [
    {
      rank: 1,
      investorType: "Impact Investment Fund",
      investmentRange: "$100K-$500K",
      matchScore: matchA,
      riskAppetite: "Medium",
      preferredSectors: `${sme.sector}, ESG-focused SMEs`,
    },
    {
      rank: 2,
      investorType: "Angel Investor Network",
      investmentRange: "$50K-$200K",
      matchScore: matchB,
      riskAppetite: "High",
      preferredSectors: `${sme.sector}, Retail, Technology`,
    },
    {
      rank: 3,
      investorType: "Development Finance Institution",
      investmentRange: "$200K-$1M",
      matchScore: matchC,
      riskAppetite: "Low",
      preferredSectors: "All sectors, inclusive finance",
    },
  ];
}

export default function InvestorDashboard({ profiles }) {
  const rankedProfiles = [...profiles].sort(
    (a, b) => Number(b.compositeScore || 0) - Number(a.compositeScore || 0)
  );

  const bestSme = rankedProfiles[0];

  const scatterData = profiles.map((sme) => ({
    name: sme.smeId,
    readiness: Number(sme.readinessScore || 0),
    credit: Number(sme.creditScore || 0),
    composite: Number(sme.compositeScore || 0),
  }));

  const investorMatches = buildInvestorMatches(bestSme);

  const averageReadiness = profiles.length
    ? Math.round(
        profiles.reduce((sum, sme) => sum + Number(sme.readinessScore || 0), 0) /
          profiles.length
      )
    : 0;

  const verifiedCount = profiles.filter(
    (sme) => sme.blockchainVerified === "Yes"
  ).length;

  const esgLeaderCount = profiles.filter(
    (sme) => sme.esgTier === "ESG Leader"
  ).length;

  return (
    <section className="dashboard">
      <div className="sectionHeader">
        <div>
          <p className="eyebrow">Investor View</p>
          <h2>Investor Decision-Support Dashboard</h2>
          <p className="muted">
            Compare SMEs by credit strength, readiness, ESG quality,
            verification status, and risk flags.
          </p>
        </div>
      </div>

      <div className="kpiGrid">
        <KpiCard
          title="Top Candidate"
          value={bestSme?.businessName || "N/A"}
          subtitle={bestSme ? `${bestSme.compositeScore} composite score` : ""}
          tone="positive"
        />

        <KpiCard
          title="Verified SMEs"
          value={verifiedCount}
          subtitle="Blockchain verified"
          tone="neutral"
        />

        <KpiCard
          title="Average Readiness"
          value={averageReadiness}
          subtitle="Across candidates"
          tone="neutral"
        />

        <KpiCard
          title="ESG Leaders"
          value={esgLeaderCount}
          subtitle="High ESG tier"
          tone="positive"
        />
      </div>

      <div className="twoColumn">
        <div className="panel">
          <h3>Q-FinTrust Composite Score Ranking</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={rankedProfiles.slice(0, 8)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="smeId" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="compositeScore" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="panel">
          <h3>Risk-Readiness Map</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                type="number"
                dataKey="readiness"
                name="Readiness Score"
                domain={[0, 100]}
              />
              <YAxis
                type="number"
                dataKey="credit"
                name="Credit Score"
                domain={[300, 850]}
              />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter name="SMEs" data={scatterData} />
            </ScatterChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="panel">
        <h3>SME Candidate Comparison</h3>
        <Table
          columns={[
            { key: "smeId", label: "SME ID" },
            { key: "businessName", label: "Business" },
            { key: "sector", label: "Sector" },
            { key: "creditScore", label: "Credit" },
            { key: "readinessScore", label: "Readiness" },
            { key: "esgScore", label: "ESG" },
            { key: "fraudFlag", label: "Fraud" },
            { key: "anomalyFlag", label: "Anomaly" },
            { key: "loanDecision", label: "Decision" },
            { key: "compositeScore", label: "Composite" },
          ]}
          rows={rankedProfiles}
        />
      </div>

      <div className="panel">
        <h3>
          Investor-SME Matching Example
          {bestSme ? ` — ${bestSme.businessName}` : ""}
        </h3>
        <Table
          columns={[
            { key: "rank", label: "Rank" },
            { key: "investorType", label: "Investor Type" },
            { key: "investmentRange", label: "Investment Range" },
            { key: "matchScore", label: "Match Score" },
            { key: "riskAppetite", label: "Risk Appetite" },
            { key: "preferredSectors", label: "Preferred Sectors" },
          ]}
          rows={investorMatches}
        />
      </div>
    </section>
  );
}