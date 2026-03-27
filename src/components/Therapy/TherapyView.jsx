/** @author Patrizia Danieli @copyright 2025 TerapiaApp — Tutti i diritti riservati */
import { Icon } from "../shared/Icons";
import { fmtDate, endDate, daysActive, daysRemaining, pillsPerDay } from "../../utils/helpers";

export default function TherapyView({ drugs, onDelete }) {
  if (drugs.length === 0) return (
    <div className="empty-state">
      <div className="empty-icon"><Icon.pill /></div>
      <h3>Nessun farmaco</h3>
      <p>Aggiungi il tuo primo farmaco usando il pulsante + in alto</p>
    </div>
  );

  return (
    <>
      {drugs.map(d => {
        const pct = Math.round((d.remainingPills / d.totalPills) * 100);
        const daysLeft = Math.round(d.remainingPills / pillsPerDay(d));
        const fillClass = pct > 50 ? "fill-green" : pct > 20 ? "fill-warn" : "fill-danger";
        const badgeClass = pct > 50 ? "badge-ok" : pct > 20 ? "badge-warn" : "badge-danger";
        const badgeText = pct > 50 ? "Scorta ok" : pct > 20 ? "Scorta bassa" : "⚠ Urgente";
        const cardClass = pct <= 20 ? "drug-card alert-danger" : pct <= 50 ? "drug-card alert-warn" : "drug-card";

        return (
          <div key={d.id} className={cardClass} style={{
            borderLeft: `4px solid ${d.color || "var(--accent)"}`,
          }}>
            <div className="drug-header">
              <div>
                <div className="drug-name">{d.name}</div>
                <div className="drug-dose">
                  {d.dosage} · {d.form === "compressa" ? "💊" : d.form === "sciroppo" ? "🍶" : d.form === "puntura" ? "💉" : d.form === "capsula" ? "🔴" : d.form === "gocce" ? "💧" : "🩹"} {d.form}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                <span className={`drug-badge ${badgeClass}`}>{badgeText}</span>
                <button className="icon-btn"
                  style={{ width: 30, height: 30, background: "var(--danger-light)", color: "var(--danger)" }}
                  onClick={() => onDelete(d.id)}>
                  <Icon.trash />
                </button>
              </div>
            </div>

            <div className="times-row">
              {d.times.map(t => (
                <div key={t} className="time-chip"><Icon.clock />{t}</div>
              ))}
            </div>

            <div className="progress-wrap">
              <div className="progress-row">
                <span className="progress-label">Scorta</span>
                <span className="progress-val">{d.remainingPills}/{d.totalPills}</span>
              </div>
              <div className="progress-bar">
                <div className={`progress-fill ${fillClass}`} style={{ width: `${pct}%` }}></div>
              </div>
            </div>

            <div className="drug-meta">
              <div className="meta-item">
                <div className="meta-val">{daysActive(d)}</div>
                <div className="meta-label">giorni in corso</div>
              </div>
              <div className="meta-item">
                <div className="meta-val">{daysRemaining(d)}</div>
                <div className="meta-label">giorni al termine</div>
              </div>
              <div className="meta-item">
                <div className="meta-val">{daysLeft}</div>
                <div className="meta-label">giorni scorta</div>
              </div>
              <div className="meta-item">
                <div className="meta-val" style={{ fontSize: 12 }}>{fmtDate(endDate(d))}</div>
                <div className="meta-label">fine terapia</div>
              </div>
            </div>

            {/* NOTE PERSONALI */}
            {d.notes && (
              <div style={{
                background: "var(--surface2)", borderRadius: 10,
                padding: "10px 12px", fontSize: 13,
                color: "var(--text2)", lineHeight: 1.5,
              }}>
                💬 {d.notes}
              </div>
            )}

          </div>
        );
      })}
    </>
  );
}