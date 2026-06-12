import { useEffect, useState } from "react";
import { Building2, Landmark, PlusCircle, ShieldCheck } from "lucide-react";
import SmeDashboard from "./components/SmeDashboard.jsx";
import InvestorDashboard from "./components/InvestorDashboard.jsx";
import AddSmeForm from "./components/AddSmeForm.jsx";
import backendProfiles from "./data/backendProfiles.json";
import { smeProfiles as demoProfiles } from "./data/mockData.js";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
const initialProfiles = backendProfiles?.length ? backendProfiles : demoProfiles;

export default function App() {
  const [view, setView] = useState("sme");
  const [profiles, setProfiles] = useState(() => {
    const savedProfiles = localStorage.getItem("qfintrust_sme_profiles");
    return savedProfiles ? JSON.parse(savedProfiles) : initialProfiles;
  });
  const [selectedSmeId, setSelectedSmeId] = useState(profiles[0]?.smeId || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    localStorage.setItem("qfintrust_sme_profiles", JSON.stringify(profiles));
  }, [profiles]);

  const selectedSme =
    profiles.find((sme) => sme.smeId === selectedSmeId) || profiles[0];

  async function handleAddSme(newSmeInput) {
    const smeExists = profiles.some((sme) => sme.smeId === newSmeInput.smeId);

    if (smeExists) {
      alert("This SME ID already exists. Please use a different SME ID.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch(`${API_BASE_URL}/api/score-sme`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSmeInput),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.detail || "Backend scoring failed.");
      }

      setProfiles((currentProfiles) => [...currentProfiles, result]);
      setSelectedSmeId(result.smeId);
      setView("sme");
    } catch (error) {
      console.error(error);
      alert(
        "Could not process SME through backend. Make sure FastAPI is running on http://127.0.0.1:8000."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function resetDemoData() {
    localStorage.removeItem("qfintrust_sme_profiles");
    setProfiles(initialProfiles);
    setSelectedSmeId(initialProfiles[0]?.smeId || "");
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">
            <ShieldCheck size={26} />
          </div>
          <div>
            <h1>Q-FinTrust</h1>
            <p>SME Financing Readiness</p>
          </div>
        </div>

        <nav className="nav">
          <button
            className={`navButton ${view === "sme" ? "active" : ""}`}
            onClick={() => setView("sme")}
          >
            <Building2 size={18} />
            SME Dashboard
          </button>

          <button
            className={`navButton ${view === "investor" ? "active" : ""}`}
            onClick={() => setView("investor")}
          >
            <Landmark size={18} />
            Investor Dashboard
          </button>

          <button
            className={`navButton ${view === "add" ? "active" : ""}`}
            onClick={() => setView("add")}
          >
            <PlusCircle size={18} />
            Add SME Data
          </button>
        </nav>

        <div className="sidebarCard">
          <label>Selected SME</label>
          <select
            value={selectedSme?.smeId || ""}
            onChange={(event) => setSelectedSmeId(event.target.value)}
          >
            {profiles.map((sme) => (
              <option key={sme.smeId} value={sme.smeId}>
                {sme.businessName}
              </option>
            ))}
          </select>
        </div>

        <button className="resetButton" onClick={resetDemoData}>
          Reset Backend Data
        </button>

        <div className="note">
          <strong>Prototype status</strong>
          <span>
            Backend-generated profiles are loaded from JSON. New SMEs are sent
            to the FastAPI backend for automatic scoring and reporting.
          </span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Blockchain-Anchored QML Framework</p>
            <h2>SME Financing Readiness & Investor Trust Dashboard</h2>
          </div>
          <span className="presentationBadge">Integrated Prototype</span>
        </header>

        {view === "sme" && selectedSme && <SmeDashboard sme={selectedSme} />}
        {view === "investor" && <InvestorDashboard profiles={profiles} />}
        {view === "add" && (
          <AddSmeForm onAddSme={handleAddSme} isSubmitting={isSubmitting} />
        )}
      </main>
    </div>
  );
}