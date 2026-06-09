import { useEffect, useState } from "react";
import { Building2, Landmark, ShieldCheck, PlusCircle } from "lucide-react";
import SmeDashboard from "./components/SmeDashboard.jsx";
import InvestorDashboard from "./components/InvestorDashboard.jsx";
import AddSmeForm from "./components/AddSmeForm.jsx";
import backendProfiles from "./data/backendProfiles.json";
import { smeProfiles as demoProfiles } from "./data/mockData.js";

const initialProfiles = backendProfiles?.length ? backendProfiles : demoProfiles;

export default function App() {
  const [view, setView] = useState("sme");
  const [profiles, setProfiles] = useState(() => {
    const savedProfiles = localStorage.getItem("qfintrust_sme_profiles");
    return savedProfiles ? JSON.parse(savedProfiles) : initialProfiles;
  });

  const [selectedSmeId, setSelectedSmeId] = useState(profiles[0]?.smeId || "");

  useEffect(() => {
    localStorage.setItem("qfintrust_sme_profiles", JSON.stringify(profiles));
  }, [profiles]);

  const selectedSme =
    profiles.find((sme) => sme.smeId === selectedSmeId) || profiles[0];

  function handleAddSme(newSme) {
    const smeExists = profiles.some((sme) => sme.smeId === newSme.smeId);

    if (smeExists) {
      alert("This SME ID already exists. Please use a different SME ID.");
      return;
    }

    setProfiles((currentProfiles) => [...currentProfiles, newSme]);
    setSelectedSmeId(newSme.smeId);
    setView("sme");
  }

  function resetDemoData() {
    localStorage.removeItem("qfintrust_sme_profiles");
    setProfiles(initialProfiles);
    setSelectedSmeId(initialProfiles[0].smeId);
  }

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand">
          <div className="brandIcon">
            <ShieldCheck size={28} />
          </div>
          <div>
            <h1>Q-FinTrust</h1>
          </div>
        </div>

        <nav className="nav">
          <button
            className={view === "sme" ? "navButton active" : "navButton"}
            onClick={() => setView("sme")}
          >
            <Building2 size={18} />
            SME Dashboard
          </button>

          <button
            className={view === "investor" ? "navButton active" : "navButton"}
            onClick={() => setView("investor")}
          >
            <Landmark size={18} />
            Investor Dashboard
          </button>

          <button
            className={view === "add" ? "navButton active" : "navButton"}
            onClick={() => setView("add")}
          >
            <PlusCircle size={18} />
            Add SME Data
          </button>
        </nav>

        <div className="sidebarCard">
          <label htmlFor="sme-select">Selected SME</label>
          <select
            id="sme-select"
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
          Reset Demo Data
        </button>

        <div className="note">
          <strong>Prototype status:</strong>
          <span>
            This frontend uses placeholder integrated data. Added SME data is saved locally in the browser.
          </span>
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div>
            <p className="eyebrow">Blockchain-Anchored QML Framework</p>
            <h2>SME Financing Readiness & Investor Trust Dashboard</h2>
          </div>
        </header>

        {view === "sme" && selectedSme && <SmeDashboard sme={selectedSme} />}

        {view === "investor" && <InvestorDashboard profiles={profiles} />}

        {view === "add" && <AddSmeForm onAddSme={handleAddSme} />}
      </main>
    </div>
  );
}