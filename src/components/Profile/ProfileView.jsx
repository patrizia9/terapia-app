/** @author Patrizia Danieli @copyright 2025 TerapiaApp — Tutti i diritti riservati */
import { useState } from "react";
import { Icon } from "../shared/Icons";
import { adherencePercent } from "../../utils/helpers";
import { requestNotifications, scheduleNotification } from "../../utils/notifications";
import { toggleTheme } from "../../utils/theme";
import { setLanguage, t } from "../../utils/i18n";

export default function ProfileView({ user, drugs, doctor, onLogout, onExportPDF, theme, setTheme, lang, setLang }) {
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
      drugs.forEach(d => d.times.forEach(ti => scheduleNotification(d, ti)));
    }
  };

  const handleToggleTheme = () => {
    const newTheme = toggleTheme();
    setTheme(newTheme);
  };

  const handleToggleLang = () => {
    const newLang = lang === "it" ? "en" : "it";
    setLanguage(newLang);
    setLang(newLang);
    window.location.reload();
  };

  return (
    <>
      {/* AVATAR */}
      <div className="card" style={{ textAlign: "center", padding: "24px 16px" }}>
        <div className="profile-avatar">{user.name[0]}</div>
        <div className="profile-name">{user.name}</div>
        <div className="profile-email">{user.email}</div>
      </div>

      {/* TAB BAR */}
      <div className="tab-bar">
        <button className={`tab-btn ${activeTab === "account" ? "active" : ""}`}
          onClick={() => setActiveTab("account")}>{t("account")}</button>
        <button className={`tab-btn ${activeTab === "notif" ? "active" : ""}`}
          onClick={() => setActiveTab("notif")}>{t("notifications")}</button>
        <button className={`tab-btn ${activeTab === "export" ? "active" : ""}`}
          onClick={() => setActiveTab("export")}>{t("export")}</button>
      </div>

      {/* ACCOUNT TAB */}
      {activeTab === "account" && (
        <div className="card">
          <div className="card-header"><span className="card-label">{t("account")}</span></div>
          <div className="settings-list">

            <div className="settings-item">
              <span className="settings-label">{t("activeDrugs")}</span>
              <span className="settings-val">{drugs.length}</span>
            </div>
            <div className="settings-item">
              <span className="settings-label">{t("totalDoses")}</span>
              <span className="settings-val">{drugs.reduce((a, d) => a + (d.taken || []).length, 0)}</span>
            </div>
            <div className="settings-item">
              <span className="settings-label">{t("avgAdherence")}</span>
              <span className="settings-val">
                {drugs.length ? Math.round(drugs.reduce((a, d) => a + adherencePercent(d), 0) / drugs.length) : 0}%
              </span>
            </div>
            <div className="settings-item">
              <span className="settings-label">{t("savedDoctor")}</span>
              <span className="settings-val">{doctor?.name || "—"}</span>
            </div>

            {/* DARK MODE TOGGLE */}
            <div className="toggle-row">
              <div className="toggle-label">
                <div className="toggle-title">
                  {theme === "dark" ? "🌙 " : "☀️ "}
                  {theme === "dark" ? t("darkMode") : t("lightMode")}
                </div>
                <div className="toggle-desc">
                  {theme === "dark" ? "Passa alla modalità chiara" : "Passa alla modalità scura"}
                </div>
              </div>
              <label className="toggle">
                <input type="checkbox" checked={theme === "dark"}
                  onChange={handleToggleTheme} />
                <span className="toggle-slider"></span>
              </label>
            </div>

            {/* LINGUA TOGGLE */}
            <div className="toggle-row">
              <div className="toggle-label">
                <div className="toggle-title">
                  {lang === "it" ? "🇮🇹 Italiano" : "🇬🇧 English"}
                </div>
                <div className="toggle-desc">
                  {lang === "it" ? "Switch to English" : "Passa all'italiano"}
                </div>
              </div>
              <button
                onClick={handleToggleLang}
                style={{
                  padding: "6px 14px", borderRadius: 20,
                  background: "var(--accent-light)", color: "var(--accent)",
                  border: "none", fontWeight: 600, fontSize: 13,
                  fontFamily: "inherit", cursor: "pointer",
                }}>
                {lang === "it" ? "EN" : "IT"}
              </button>
            </div>

            <div className="settings-item">
              <span className="settings-label">{t("version")}</span>
              <span className="settings-val">2.0.0</span>
            </div>
          </div>
        </div>
      )}

      {/* NOTIFICHE TAB */}
      {activeTab === "notif" && (
        <div className="card">
          <div className="card-header">
            <span className="card-label">{t("notifications")}</span>
          </div>

          {notifPerm === "unsupported" && (
            <div className="alert-banner alert-warn-banner" style={{ marginBottom: 12 }}>
              <Icon.alert /><p>Le notifiche non sono supportate su questo browser</p>
            </div>
          )}
          {notifPerm === "denied" && (
            <div className="alert-banner alert-danger-banner" style={{ marginBottom: 12 }}>
              <Icon.alert /><p>{t("notifBlocked")}. Abilitale dalle impostazioni del browser.</p>
            </div>
          )}
          {notifPerm === "default" && (
            <button className="btn btn-primary" style={{ marginBottom: 12 }}
              onClick={handleEnableNotif}>
              <Icon.notif /> {t("enableNotif")}
            </button>
          )}
          {notifPerm === "granted" && (
            <div className="alert-banner alert-ok-banner" style={{ marginBottom: 12 }}>
              <Icon.check /><p>{t("notifActive")}</p>
            </div>
          )}

          {[
            { key: "reminders", title: t("reminderNotif"), desc: t("reminderNotifDesc") },
            { key: "stock", title: t("stockNotif"), desc: t("stockNotifDesc") },
            { key: "daily", title: t("dailyNotif"), desc: t("dailyNotifDesc") },
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
            <button className="btn btn-secondary btn-sm" style={{ marginTop: 8 }}
              onClick={() => {
                drugs.forEach(d => d.times.forEach(ti => scheduleNotification(d, ti)));
                alert(t("scheduleToday"));
              }}>
              <Icon.bell /> {t("scheduleToday")}
            </button>
          )}
        </div>
      )}

      {/* EXPORT TAB */}
      {activeTab === "export" && (
        <div className="card">
          <div className="card-header">
            <span className="card-label">{t("exportTitle")}</span>
          </div>
          <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6, marginBottom: 12 }}>
            {t("exportDesc")}
          </p>
          <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 14, marginBottom: 16 }}>
            {["Piano terapeutico completo", "Dati del medico curante",
              "Scorte e stato farmaci", "Statistiche di aderenza",
              "Data di generazione"].map(item => (
              <div key={item} style={{ display: "flex", alignItems: "center", gap: 8, padding: "4px 0", fontSize: 13 }}>
                <span style={{ color: "var(--accent)", fontSize: 16 }}>✓</span>{item}
              </div>
            ))}
          </div>
          <button className="btn btn-primary" onClick={onExportPDF}>
            <Icon.download /> {t("exportBtn")}
          </button>
          <p style={{ fontSize: 11, color: "var(--text3)", marginTop: 8, textAlign: "center" }}>
            {t("exportNote")}
          </p>
        </div>
      )}

      <button className="btn btn-secondary" onClick={onLogout}>
        <Icon.logout /> {t("logout")}
      </button>
    </>
  );
}