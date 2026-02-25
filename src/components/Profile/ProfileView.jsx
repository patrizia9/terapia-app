import { useState } from "react";
import { Icon } from "../shared/Icons";
import { adherencePercent } from "../../utils/helpers";
import { requestNotifications, scheduleNotification } from "../../utils/notifications";

export default function ProfileView({ user, drugs, doctor, onLogout, onExportPDF }) {
  const [activeTab, setActiveTab] = useState("account");
  const [notifPerm, setNotifPerm] = useState(() => {
    if (!("Notification" in window)) return "unsupported";
    return Notification.permission;
  });
  const [notifSettings, setNotifSettings] = useState(() => {
    try { return JSON.parse(localStorage.getItem("tm_notif") || '{"reminders":true,"stock":true,"daily":true}'); }
    catch { return { reminders: true, stock: true, daily: true }; }
  });

  const saveNotif = (key, val) => {
    const updated = { ...notifSettings, [key]: val };
    setNotifSettings(updated);
    localStorage.setItem("tm_notif", JSON.stringify(updated));
  };

  const handleEnableNotif = async () => {
    const perm = await requestNotifications();
    setNotifPerm(perm);
    if (perm === "granted") {
      drugs.forEach(d => d.times.forEach(t => scheduleNotification(d, t)));
    }
  };

  return (
    <>
      <div className="card" style={{ textAlign: "center", padding: "24px 16px" }}>
        <div className="profile-avatar">{user.name[0]}</div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.email}</div>
      </div>

      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === "account" ? "active" : ""}`} onClick={() => setActiveTab("account")}>Account</button>
        <button className={`tab-btn ${activeTab === "notif" ? "active" : ""}`} onClick={() => setActiveTab("notif")}>Notifiche</button>
        <button className={`tab-btn ${activeTab === "export" ? "active" : ""}`} onClick={() => setActiveTab("export")}>Esporta</button>
      </div>

      {activeTab === "account" && (
        <div className="card">
          <div className="card-header"><span className="card-label">Riepilogo</span></div>
          <div className="settings-list">
            <div className="settings-item"><span className="settings-label">Farmaci attivi</span><span className="settings-val">{drugs.length}</span></div>
            <div className="settings-item"><span className="settings-label">Dosi registrate</span><span className="settings-val">{drugs.reduce((a, d) => a + (d.taken || []).length, 0)}</span></div>
            <div className="settings-item"><span className="settings-label">Aderenza media</span><span className="settings-val">{drugs.length ? Math.round(drugs.reduce((a, d) => a + adherencePercent(d), 0) / drugs.length) : 0}%</span></div>
            <div className="settings-item"><span className="settings-label">Medico salvato</span><span className="settings-val">{doctor?.name || "—"}</span></div>
            <div className="settings-item"><span className="settings-label">Versione</span><span className="settings-val">2.0.0</span></div>
          </div>
        </div>
      )}

      {activeTab === "notif" && (
        <div className="card">
          <div className="card-header"><span className="card-label">Notifiche push</span></div>

          {notifPerm === "unsupported" && (
            <div className="alert-banner alert-warn-banner" style={{ marginBottom: 12 }}>
              <Icon.alert /><p>Le notifiche non sono supportate su questo browser</p>
            </div>
          )}
          {notifPerm === "denied" && (
            <div className="alert-banner alert-danger-banner" style={{ marginBottom: 12 }}>
              <Icon.alert /><p>Notifiche bloccate. Abilitale dalle impostazioni del browser.</p>
            </div>
          )}
          {notifPerm === "default" && (
            <button className="btn btn-primary" style={{ marginBottom: 12 }} onClick={handleEnableNotif}>
              <Icon.notif /> Abilita notifiche
            </button>
          )}
          {notifPerm === "granted" && (
            <div className="alert-banner alert-ok-banner" style={{ marginBottom: 12 }}>
              <Icon.check /><p>Notifiche attive ✓</p>
            </div>
          )}

          {[
            { key: "reminders", title: "Promemoria farmaci", desc: "Notifica all'orario di assunzione" },
            { key: "stock", title: "Alert scorta bassa", desc: "Avviso quando la scorta è quasi esaurita" },
            { key: "daily", title: "Riepilogo giornaliero", desc: "Sommario mattutino delle dosi del giorno" },
          ].map(item => (
            <div key={item.key} className="toggle-row">
              <div className="toggle-label">
                <div className="toggle-title">{item.title}</div>
                <div className="toggle-desc">{item.desc}</div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={notifSettings[item.key]}
                  onChange={e => saveNotif(item.key, e.target.checked)} />
                <span className="toggle-slider"></span>
              </label>
            </div>
          ))}

          {notifPerm === "granted" && (
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }} onClick={() => {
              drugs.forEach(d => d.times.forEach(t => scheduleNotification(d, t)));
              alert("Promemoria schedulati per oggi!");
            }}>
              <Icon.bell /> Schedula promemoria oggi
            </button>
          )}
        </div>
      )}

      {activeTab === "export" && (
        <div className="card">
          <div className="card-header"><span className="card-label">Esporta piano terapeutico</span></div>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 12 }}>
            Genera un documento completo con farmaci, scorte, dati del medico e aderenza.
          </p>
          <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase" }}>Il PDF includerà:</div>
            {["Piano terapeutico completo", "Dati del medico curante", "Scorte e stato farmaci", "Statistiche di aderenza", "Data di generazione"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13 }}>
                <span style={{ color: "var(--accent)", fontSize: 16 }}>✓</span>{item}
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={onExportPDF}>
            <Icon.download /> Esporta come HTML/PDF
          </button>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 8, textAlign: "center" }}>
            Si aprirà nel browser → usa "Stampa → Salva come PDF"
          </p>
        </div>
      )}

      <button className="btn btn-secondary" onClick={onLogout}>
        <Icon.logout /> Esci dall'account
      </button>
    </>
  );
}