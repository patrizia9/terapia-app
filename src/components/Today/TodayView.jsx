import { Icon } from "../shared/Icons";
import { today, fmtDate } from "../../utils/helpers";

export default function TodayView({ drugs, onTake }) {
  const timeGroups = {};
  drugs.forEach(d => {
    d.times.forEach(t => {
      if (!timeGroups[t]) timeGroups[t] = [];
      timeGroups[t].push(d);
    });
  });
  const sortedTimes = Object.keys(timeGroups).sort();

  if (sortedTimes.length === 0) return (
    <div className="empty-state">
      <div className="empty-icon"><Icon.bell /></div>
      <h3>Nessun promemoria</h3>
      <p>Aggiungi farmaci per visualizzare i promemoria giornalieri</p>
    </div>
  );

  return (
    <>
      <div className="card" style={{ background: "var(--surface2)", boxShadow: "none", padding: "12px 16px" }}>
        <p style={{ fontSize: 14, color: "var(--text2)" }}>
          📅 Promemoria di oggi, <strong>{fmtDate(today())}</strong>
        </p>
      </div>

      {sortedTimes.map(time => (
        <div key={time} className="today-section">
          <div className="today-time-header">{time}</div>
          {timeGroups[time].map(d => {
            const key = today() + "_" + time;
            const checked = (d.taken || []).includes(key);
            return (
              <div key={d.id} className="reminder-item">
                <button className={`reminder-check ${checked ? "checked" : ""}`} onClick={() => onTake(d.id, key)}>
                  {checked && <Icon.check />}
                </button>
                <div className="reminder-info">
                  <div className="reminder-name">{d.name}</div>
                  <div className="reminder-dose">{d.dosage} — {d.remainingPills} rimaste</div>
                </div>
                {checked && <span className="drug-badge badge-ok" style={{ fontSize: 11 }}>✓ Presa</span>}
              </div>
            );
          })}
        </div>
      ))}
    </>
  );
}