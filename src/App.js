/**
 * @file App.jsx — Componente principale TerapiaApp
 * @author Patrizia Danieli
 * @copyright 2025 Patrizia Danieli. Tutti i diritti riservati.
 * @fingerprint PD-TERAPIAAPP-2025-v2-a8f3c9e1b7d2
 */
import { useState, useEffect } from "react";
import "./styles/global.css";
import { initTheme } from "./utils/theme";
import { getLanguage } from "./utils/i18n";

import { MOCK_DOCTOR } from "./data/mockData";
import { stockAlert } from "./utils/helpers";
import { scheduleNotification } from "./utils/notifications";
import { exportToPDF } from "./utils/pdfExport";

// API
import {
  loginUser, registerUser,
  getDrugs, addDrug, takeDose, deleteDrug,
  getDoctor, saveDoctor,
} from "./api/api";

import AuthScreen from "./components/Auth/AuthScreen";
import DashboardView from "./components/Dashboard/DashboardView";
import TodayView from "./components/Today/TodayView";
import TherapyView from "./components/Therapy/TherapyView";
import ChartsView from "./components/Charts/ChartsView";
import DoctorView from "./components/Doctor/DoctorView";
import ProfileView from "./components/Profile/ProfileView";
import AddDrugModal from "./components/shared/AddDrugModal";
import { Icon } from "./components/shared/Icons";

const TABS = [
  { id: "home",    label: "Home",    icon: "home" },
  { id: "today",   label: "Oggi",    icon: "bell" },
  { id: "therapy", label: "Terapie", icon: "list" },
  { id: "charts",  label: "Grafici", icon: "chart" },
  { id: "profile", label: "Profilo", icon: "user" },
];

const TITLES = {
  home:    { title: "Dashboard",   sub: "" },
  today:   { title: "Promemoria",  sub: "Dosi di oggi" },
  therapy: { title: "Terapie",     sub: "" },
  charts:  { title: "Statistiche", sub: "Grafici e aderenza" },
  profile: { title: "Profilo",     sub: "Impostazioni" },
};

export default function App() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tm_user") || "null"); }
    catch { return null; }
  });
  const [drugs, setDrugs] = useState([]);
  const [doctor, setDoctorState] = useState(MOCK_DOCTOR);
  const [tab, setTab] = useState("home");
  const [showAdd, setShowAdd] = useState(false);
  const [loading, setLoading] = useState(false);
  const [theme, setTheme] = useState(() => initTheme());
  const [lang, setLang] = useState(() => getLanguage());

  // Carica i dati dal database quando l'utente è loggato
  useEffect(() => {
    if (user) {
      loadDrugs();
      loadDoctor();
    }
  }, [user]);

  const loadDrugs = async () => {
    try {
      setLoading(true);
      const res = await getDrugs();
      setDrugs(res.data.map(d => ({
        ...d,
        totalPills: d.total_pills,
        remainingPills: d.remaining_pills,
        startDate: d.start_date,
        durationDays: d.duration_days,
        times: d.times || [],
        taken: d.taken || [],
      })));
    } catch (err) {
      console.error("Errore caricamento farmaci:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadDoctor = async () => {
    try {
      const res = await getDoctor();
      setDoctorState(res.data);
    } catch (err) {
      console.error("Errore caricamento medico:", err);
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const res = await loginUser({ email, password });
      const { token, user } = res.data;
      localStorage.setItem("tm_token", token);
      localStorage.setItem("tm_user", JSON.stringify(user));
      setUser(user);
      return { success: true };
    } catch (err) {
      return { success: false, error: err.response?.data?.error || "Errore di connessione." };
    }
  };

  const handleRegister = async (name, email, password, dob, secretQuestion, secretAnswer) => {
  try {
    const res = await registerUser({ name, email, password, dob, secretQuestion, secretAnswer });
    const { token, user } = res.data;
    localStorage.setItem("tm_token", token);
    localStorage.setItem("tm_user", JSON.stringify(user));
    setUser(user);
    return { success: true };
  } catch (err) {
    return { success: false, error: err.response?.data?.error || "Errore di connessione." };
  }
};

  const handleLogout = () => {
    setUser(null);
    setDrugs([]);
    setDoctorState(MOCK_DOCTOR);
    localStorage.removeItem("tm_token");
    localStorage.removeItem("tm_user");
  };

  const handleTake = async (drugId, key) => {
    const drug = drugs.find(d => d.id === drugId);
    const already = (drug.taken || []).includes(key);
    try {
      await takeDose(drugId, { takenKey: key, undo: already });
      setDrugs(prev => prev.map(d => {
        if (d.id !== drugId) return d;
        return {
          ...d,
          taken: already ? d.taken.filter(k => k !== key) : [...d.taken, key],
          remainingPills: already ? d.remainingPills + 1 : Math.max(0, d.remainingPills - 1),
        };
      }));
    } catch (err) {
      console.error("Errore takeDose:", err);
    }
  };

 const handleAdd = async (drug) => {
  try {
    await addDrug({
      name: drug.name,
      drugForm: drug.drugForm,
      dosage: drug.dosage,
      totalPills: drug.totalPills,
      remainingPills: drug.remainingPills,
      startDate: drug.startDate,
      durationDays: drug.durationDays,
      times: drug.times,
      notes: drug.notes || null,
      color: drug.color || "#2D6A4F",
    });
    await loadDrugs();
    if (Notification.permission === "granted") {
      drug.times.forEach(t => scheduleNotification(drug, t));
    }
  } catch (err) {
    console.error("Errore addDrug:", err);
  }
};

  const handleDelete = async (id) => {
    try {
      await deleteDrug(id);
      setDrugs(prev => prev.filter(d => d.id !== id));
    } catch (err) {
      console.error("Errore deleteDrug:", err);
    }
  };

  const handleSaveDoctor = async (data) => {
    try {
      await saveDoctor(data);
      setDoctorState(data);
    } catch (err) {
      console.error("Errore saveDoctor:", err);
    }
  };

  const handleExportPDF = () => exportToPDF(user, drugs, doctor);
  const alertCount = drugs.filter(d => stockAlert(d)).length;
  const showPlus = ["home", "today", "therapy"].includes(tab);

  // Schermata di login
  if (!user) return (
    <div className="app">
      <AuthScreen onLogin={handleLogin} onRegister={handleRegister} />
    </div>
  );

  // Schermata di caricamento
  if (loading) return (
    <div className="app" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", color: "var(--text2)" }}>
        <div style={{ fontSize: 40, marginBottom: 12 }}>💊</div>
        <div style={{ fontSize: 16, fontWeight: 600 }}>Caricamento...</div>
      </div>
    </div>
  );

  return (
    <div className="app">
      {/* TOPBAR */}
      <div className="topbar">
        <div>
          <div className="topbar-title">{TITLES[tab].title}</div>
          <div className="topbar-subtitle">
            {tab === "home" ? `Ciao, ${user.name.split(" ")[0]}` : TITLES[tab].sub}
          </div>
        </div>
        <div className="topbar-actions">
          {showPlus && (
            <button className="icon-btn" style={{ background: "var(--accent)", color: "white" }}
              onClick={() => setShowAdd(true)}>
              <Icon.plus />
            </button>
          )}
          {tab === "profile" && (
            <button className="icon-btn" style={{ background: "var(--accent2-light)", color: "var(--accent2)" }}
              onClick={handleExportPDF}>
              <Icon.download />
            </button>
          )}
        </div>
      </div>

      {/* CONTENUTO */}
<div className="scroll-content">
  {tab === "home" && <DashboardView user={user} drugs={drugs} />}
  {tab === "today" && <TodayView drugs={drugs} onTake={handleTake} />}
  {tab === "therapy" && <TherapyView drugs={drugs} onDelete={handleDelete} />}
  {tab === "charts" && <ChartsView drugs={drugs} />}
  {tab === "profile" && (
    <>
      <DoctorView doctor={doctor} onSave={handleSaveDoctor} />
      <ProfileView
        user={user} drugs={drugs} doctor={doctor}
        onLogout={handleLogout} onExportPDF={handleExportPDF}
        theme={theme} setTheme={setTheme}
        lang={lang} setLang={setLang}
      />
    </>
  )}
</div>

      {/* BOTTOM NAV */}
      <nav className="bottom-nav">
        {TABS.map(t => {
          const I = Icon[t.icon];
          return (
            <button key={t.id} className={`nav-item ${tab === t.id ? "active" : ""}`}
              onClick={() => setTab(t.id)}>
              <div className="nav-item-wrap" style={{ position: "relative" }}>
                <I />
                {t.id === "today" && alertCount > 0 && <span className="badge-dot"></span>}
              </div>
              {t.label}
            </button>
          );
        })}
      </nav>

      {showAdd && <AddDrugModal onClose={() => setShowAdd(false)} onAdd={handleAdd} />}
    </div>
  );
}