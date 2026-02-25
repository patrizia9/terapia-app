import { useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from "recharts";
import { Icon } from "../shared/Icons";
import { adherencePercent, pillsPerDay, daysRemaining } from "../../utils/helpers";
import { CHART_COLORS } from "../../data/mockData";

export default function ChartsView({ drugs }) {
  const [activeChart, setActiveChart] = useState("adherence");

  if (drugs.length === 0) return (
    <div className="empty-state">
      <div className="empty-icon"><Icon.chart /></div>
      <h3>Nessun dato</h3>
      <p>Aggiungi farmaci e inizia a registrare le dosi per visualizzare i grafici</p>
    </div>
  );

  const adherenceData = drugs.map((d, i) => ({
    name: d.name.split(" ")[0],
    valore: adherencePercent(d),
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const stockData = drugs.map((d, i) => ({
    name: d.name.split(" ")[0],
    rimanenti: d.remainingPills,
    totali: d.totalPills,
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  const daysData = drugs.map((d, i) => ({
    name: d.name.split(" ")[0],
    "Giorni scorta": Math.round(d.remainingPills / pillsPerDay(d)),
    "Giorni terapia": daysRemaining(d),
    color: CHART_COLORS[i % CHART_COLORS.length],
  }));

  return (
    <>
      <div className="tab-bar">
        <button className={`tab-btn ${activeChart === "adherence" ? "active" : ""}`} onClick={() => setActiveChart("adherence")}>Aderenza</button>
        <button className={`tab-btn ${activeChart === "stock" ? "active" : ""}`} onClick={() => setActiveChart("stock")}>Scorte</button>
        <button className={`tab-btn ${activeChart === "days" ? "active" : ""}`} onClick={() => setActiveChart("days")}>Giorni</button>
      </div>

      {activeChart === "adherence" && (
        <div className="card">
          <div className="card-header"><span className="card-label">Aderenza alla terapia (%)</span></div>
          <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>
            Percentuale di dosi prese rispetto alle dosi previste
          </p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={adherenceData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(v) => [`${v}%`, "Aderenza"]} />
                <Bar dataKey="valore" radius={[6, 6, 0, 0]}>
                  {adherenceData.map((entry, i) => (
                    <Cell key={i} fill={entry.valore >= 80 ? "#2D6A4F" : entry.valore >= 50 ? "#E9C46A" : "#E63946"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div style={{ display: "flex", gap: 12, marginTop: 8, flexWrap: "wrap" }}>
            <div className="legend-item"><div className="legend-dot" style={{ background: "#2D6A4F" }}></div>≥80% Ottima</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "#E9C46A" }}></div>50-79% Media</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "#E63946" }}></div>&lt;50% Bassa</div>
          </div>
          {drugs.map((d, i) => (
            <div key={d.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "10px 0", borderBottom: "1px solid var(--border)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: CHART_COLORS[i % CHART_COLORS.length], flexShrink: 0 }}></div>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600 }}>{d.name}</div>
                  <div style={{ fontSize: 11, color: "var(--text2)" }}>{(d.taken || []).length} dosi registrate</div>
                </div>
              </div>
              <div style={{ fontSize: 18, fontWeight: 700, fontFamily: "'DM Mono',monospace", color: adherencePercent(d) >= 80 ? "var(--accent)" : adherencePercent(d) >= 50 ? "#8B6914" : "var(--danger)" }}>
                {adherencePercent(d)}%
              </div>
            </div>
          ))}
        </div>
      )}

      {activeChart === "stock" && (
        <div className="card">
          <div className="card-header"><span className="card-label">Scorte rimanenti</span></div>
          <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>
            Compresse rimaste rispetto alla quantità iniziale
          </p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stockData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="totali" fill="#E5E4DE" radius={[4, 4, 0, 0]} name="Totali" />
                <Bar dataKey="rimanenti" radius={[4, 4, 0, 0]} name="Rimanenti">
                  {stockData.map((entry, i) => {
                    const pct = (entry.rimanenti / entry.totali) * 100;
                    return <Cell key={i} fill={pct > 50 ? "#2D6A4F" : pct > 20 ? "#E9C46A" : "#E63946"} />;
                  })}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: "#E5E4DE" }}></div>Totali</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "#2D6A4F" }}></div>Rimanenti</div>
          </div>
        </div>
      )}

      {activeChart === "days" && (
        <div className="card">
          <div className="card-header"><span className="card-label">Giorni rimanenti</span></div>
          <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 8 }}>
            Confronto tra giorni di scorta e giorni di terapia rimasti
          </p>
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={daysData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="Giorni scorta" fill="#2D6A4F" radius={[4, 4, 0, 0]} />
                <Bar dataKey="Giorni terapia" fill="#A8DADC" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: "#2D6A4F" }}></div>Scorta</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: "#A8DADC" }}></div>Terapia</div>
          </div>
        </div>
      )}
    </>
  );
}