/** @author Patrizia Danieli @copyright 2025 TerapiaApp — Tutti i diritti riservati */
import { Icon } from "../shared/Icons";
import { fmtDate, today, pillsPerDay, stockAlert, adherencePercent } from "../../utils/helpers";

export default function DashboardView({ user, drugs }) {
  const alerts = drugs.filter(d => stockAlert(d));
  const totalDrugs = drugs.length;
  const todayDoses = drugs.reduce((a, d) => a + d.times.length, 0);
  const takenToday = drugs.reduce((a, d) =>
    a + d.times.filter(t => (d.taken || []).includes(today() + "_" + t)).length, 0);
  const avgAdherence = drugs.length
    ? Math.round(drugs.reduce((a, d) => a + adherencePercent(d), 0) / drugs.length)
    : 0;

  return (
    <>
      <div className="card" style={{ background: "var(--accent)", color: "white", boxShadow: "none" }}>
        <p style={{ fontSize: "13px", opacity: .7, marginBottom: 4 }}>Buongiorno 👋</p>
        <div style={{ fontSize: "22px", fontWeight: 700, lineHeight: 1.3 }}>
          <span style={{ color: "rgba(255,255,255,.9)" }}>{user.name.split(" ")[0]}</span>
          <br />
          <span style={{ fontWeight: 400, fontSize: "18px" }}>ecco il tuo piano terapeutico</span>
        </div>
        <p style={{ fontSize: 12, opacity: .6, marginTop: 8 }}>{fmtDate(today())}</p>
      </div>

      {alerts.map(d => {
        const daysLeft = Math.round(d.remainingPills / pillsPerDay(d));
        const isCritical = daysLeft <= 3;
        return (
          <div key={d.id} className={`alert-banner ${isCritical ? "alert-danger-banner" : "alert-warn-banner"}`}>
            <Icon.alert />
            <p><strong>{d.name}</strong>: scorta in esaurimento! Solo {d.remainingPills} compresse (~{daysLeft} giorni)</p>
          </div>
        );
      })}

      <div className="stats-row">
        <div className="stat-box">
          <div className="stat-num">{totalDrugs}</div>
          <div className="stat-label">Farmaci attivi</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" style={{ color: takenToday === todayDoses && todayDoses > 0 ? "var(--accent)" : "var(--text)" }}>
            {takenToday}/{todayDoses}
          </div>
          <div className="stat-label">Dosi oggi</div>
        </div>
        <div className="stat-box">
          <div className="stat-num" style={{ color: avgAdherence >= 80 ? "var(--accent)" : avgAdherence >= 50 ? "#8B6914" : "var(--danger)" }}>
            {avgAdherence}%
          </div>
          <div className="stat-label">Aderenza media</div>
        </div>
        <div className="stat-box accent">
          <div className="stat-num">{alerts.length}</div>
          <div className="stat-label">Alert scorta</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-label">Scorte farmaci</span>
        </div>
        {drugs.length === 0
          ? <p style={{ fontSize: 14, color: "var(--text2)", textAlign: "center", padding: "16px 0" }}>Nessun farmaco aggiunto</p>
          : drugs.map(d => {
            const pct = Math.round((d.remainingPills / d.totalPills) * 100);
            const daysLeft = Math.round(d.remainingPills / pillsPerDay(d));
            const fillClass = pct > 50 ? "fill-green" : pct > 20 ? "fill-warn" : "fill-danger";
            return (
              <div key={d.id} style={{ borderBottom: "1px solid var(--border)", paddingBottom: 12, marginBottom: 12 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <div>
                    <div style={{ fontSize: 15, fontWeight: 600 }}>{d.name}</div>
                    <div style={{ fontSize: 12, color: "var(--text2)" }}>{d.dosage} · {d.times.join(", ")}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "'DM Mono',monospace" }}>{d.remainingPills}</div>
                    <div style={{ fontSize: 11, color: "var(--text2)" }}>compresse</div>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className={`progress-fill ${fillClass}`} style={{ width: `${pct}%` }}></div>
                </div>
                <div style={{ fontSize: 11, color: "var(--text2)", marginTop: 4 }}>~{daysLeft} giorni di scorta rimanenti</div>
              </div>
            );
          })}
      </div>
    </>
  );
}