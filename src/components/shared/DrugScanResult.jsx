import { useState, useEffect } from "react";
import { Icon } from "./Icons";
import { lookupDrug, lookupDrugByName } from "../../utils/drugLookup";

const FORMS = [
  { value: "compressa", label: "💊 Compressa" },
  { value: "capsula", label: "🔴 Capsula" },
  { value: "sciroppo", label: "🍶 Sciroppo" },
  { value: "gocce", label: "💧 Gocce" },
  { value: "puntura", label: "💉 Puntura" },
  { value: "cerotto", label: "🩹 Cerotto" },
  { value: "spray", label: "💨 Spray" },
  { value: "crema", label: "🧴 Crema" },
];

export default function DrugScanResult({ barcode, onAddDrug, onClose }) {
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("info");
  const [manualName, setManualName] = useState("");
  const [searching, setSearching] = useState(false);
  const [form, setForm] = useState({
    totalQuantity: "", remainingQuantity: "",
    durationDays: "30", times: ["08:00"],
    drugForm: "compressa", dosageAmount: "", dosageUnit: "mg",
  });

  useEffect(() => {
    const search = async () => {
      setLoading(true);
      const res = await lookupDrug(barcode);
      setResult(res);
      setLoading(false);
    };
    search();
  }, [barcode]);

  const handleManualSearch = async () => {
    if (!manualName.trim()) return;
    setSearching(true);
    const res = await lookupDrugByName(manualName);
    setResult({ ...res, name: manualName });
    setSearching(false);
  };

  const addTime = () => setForm({ ...form, times: [...form.times, "12:00"] });
  const removeTime = (i) => setForm({ ...form, times: form.times.filter((_, idx) => idx !== i) });
  const updateTime = (i, v) => { const t = [...form.times]; t[i] = v; setForm({ ...form, times: t }); };

  const handleAdd = () => {
    if (!form.totalQuantity) return;
    onAddDrug({
      id: Date.now(),
      name: result.name,
      drugForm: form.drugForm,
      dosage: `${form.dosageAmount} ${form.dosageUnit}`,
      totalPills: parseInt(form.totalQuantity),
      remainingPills: parseInt(form.remainingQuantity || form.totalQuantity),
      startDate: new Date().toISOString().split("T")[0],
      durationDays: parseInt(form.durationDays),
      times: form.times.filter(Boolean),
      taken: [],
    });
    onClose();
  };

  // SCHERMATA CARICAMENTO
  if (loading) return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-handle"></div>
        <div style={{ textAlign: "center", padding: "32px 0" }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🔍</div>
          <div style={{ fontSize: 16, fontWeight: 600 }}>Ricerca farmaco...</div>
          <div style={{ fontSize: 13, color: "var(--text2)", marginTop: 6 }}>
            Codice: {barcode}
          </div>
          <div style={{ fontSize: 12, color: "var(--text3)", marginTop: 4 }}>
            Consultando i database farmaceutici...
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"></div>

        {/* ── FARMACO TROVATO ── */}
        {result?.found ? (
          <>
            {/* HEADER FARMACO */}
            <div style={{
              background: "var(--accent-light)", borderRadius: 14, padding: 16,
              display: "flex", gap: 12, alignItems: "flex-start",
            }}>
              {result.thumbnail ? (
                <img src={result.thumbnail} alt={result.name}
                  style={{ width: 56, height: 56, borderRadius: 10, objectFit: "cover", flexShrink: 0 }} />
              ) : (
                <div style={{
                  width: 56, height: 56, borderRadius: 12,
                  background: "var(--accent)", color: "white",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: 28, flexShrink: 0,
                }}>💊</div>
              )}
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 18, fontWeight: 700, lineHeight: 1.3 }}>
                  {result.name}
                </div>
                {result.brand && result.brand !== result.name && (
                  <div style={{ fontSize: 12, color: "var(--text2)", marginTop: 2 }}>
                    🏭 {result.brand}
                  </div>
                )}
                {result.formula && (
                  <div style={{ fontSize: 12, color: "var(--accent)", marginTop: 4, fontWeight: 600 }}>
                    🧪 Formula: {result.formula}
                  </div>
                )}
              </div>
            </div>

            {/* INFO TAB */}
            {mode === "info" && (
              <>
                {/* DESCRIZIONE WIKIPEDIA */}
                {result.description ? (
                  <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", textTransform: "uppercase", letterSpacing: "0.4px" }}>
                      📋 Informazioni
                    </div>
                    <div style={{
                      fontSize: 13, color: "var(--text2)", lineHeight: 1.7,
                      background: "var(--surface2)", borderRadius: 12, padding: 14,
                      maxHeight: 180, overflowY: "auto",
                    }}>
                      {result.description}
                    </div>
                    {result.wikiUrl && (
                      <a href={result.wikiUrl} target="_blank" rel="noreferrer"
                        style={{ fontSize: 12, color: "var(--accent)", textDecoration: "none", fontWeight: 600 }}>
                        📖 Leggi di più su Wikipedia →
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="alert-banner alert-warn-banner">
                    <Icon.alert />
                    <p>Nessuna informazione trovata per questo farmaco nei database italiani.</p>
                  </div>
                )}

                {/* AVVISO MEDICO */}
                <div className="alert-banner alert-warn-banner">
                  <Icon.alert />
                  <p>⚠️ Consulta sempre il tuo medico prima di assumere qualsiasi farmaco.</p>
                </div>

                {/* BOTTONI */}
                <button className="btn btn-primary" onClick={() => setMode("add")}>
                  <Icon.plus /> Aggiungi alla terapia
                </button>
                <button className="btn btn-secondary" onClick={onClose}>
                  Chiudi
                </button>
              </>
            )}

            {/* ADD TAB */}
            {mode === "add" && (
              <>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>

                  {/* FORMA FARMACEUTICA */}
                  <div className="field">
                    <label>Forma farmaceutica</label>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 6 }}>
                      {FORMS.map(f => (
                        <button key={f.value} type="button"
                          onClick={() => setForm({ ...form, drugForm: f.value })}
                          style={{
                            padding: "8px 6px", borderRadius: 10, border: "1.5px solid",
                            borderColor: form.drugForm === f.value ? "var(--accent)" : "var(--border)",
                            background: form.drugForm === f.value ? "var(--accent-light)" : "var(--surface2)",
                            color: form.drugForm === f.value ? "var(--accent)" : "var(--text2)",
                            fontSize: 12, fontWeight: 600, fontFamily: "inherit", cursor: "pointer",
                          }}>
                          {f.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* DOSAGGIO */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="field">
                      <label>Dosaggio</label>
                      <input type="number" placeholder="es. 500"
                        value={form.dosageAmount}
                        onChange={e => setForm({ ...form, dosageAmount: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>Unità</label>
                      <select value={form.dosageUnit}
                        onChange={e => setForm({ ...form, dosageUnit: e.target.value })}
                        style={{
                          background: "var(--surface2)", border: "1.5px solid var(--border)",
                          borderRadius: "var(--radius-sm)", padding: "12px 10px",
                          fontSize: 14, fontFamily: "inherit", color: "var(--text)", outline: "none",
                        }}>
                        {["mg", "ml", "g", "UI", "mcg", "gocce"].map(u => (
                          <option key={u} value={u}>{u}</option>
                        ))}
                      </select>
                    </div>
                  </div>

                  {/* QUANTITÀ */}
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    <div className="field">
                      <label>Quantità totale *</label>
                      <input type="number" placeholder="es. 30"
                        value={form.totalQuantity}
                        onChange={e => setForm({ ...form, totalQuantity: e.target.value })} />
                    </div>
                    <div className="field">
                      <label>Durata (giorni)</label>
                      <input type="number" value={form.durationDays}
                        onChange={e => setForm({ ...form, durationDays: e.target.value })} />
                    </div>
                  </div>

                  {/* ORARI */}
                  <div className="field">
                    <label>Orari assunzione</label>
                    <div className="times-builder">
                      {form.times.map((t, i) => (
                        <div key={i} className="time-row">
                          <input type="time" className="time-input" value={t}
                            onChange={e => updateTime(i, e.target.value)} />
                          {form.times.length > 1 && (
                            <button className="remove-time" onClick={() => removeTime(i)}>
                              <Icon.trash />
                            </button>
                          )}
                        </div>
                      ))}
                      <button className="btn btn-secondary btn-sm" onClick={addTime}
                        style={{ width: "fit-content" }}>
                        + Aggiungi orario
                      </button>
                    </div>
                  </div>
                </div>

                <button className="btn btn-primary" onClick={handleAdd}
                  disabled={!form.totalQuantity}>
                  <Icon.check /> Salva farmaco
                </button>
                <button className="btn btn-secondary" onClick={() => setMode("info")}>
                  ← Torna alle info
                </button>
              </>
            )}
          </>
        ) : (
          /* ── FARMACO NON TROVATO ── */
          <>
            <div style={{
              textAlign: "center", padding: "16px 0",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 12,
            }}>
              <div style={{ fontSize: 48 }}>🔍</div>
              <div style={{ fontSize: 17, fontWeight: 700 }}>Prodotto non trovato</div>
              <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
                Il codice <strong>{barcode}</strong> non è stato trovato.
                Prova a cercare per nome:
              </div>
            </div>

            {/* RICERCA MANUALE PER NOME */}
            <div style={{ display: "flex", gap: 8 }}>
              <input
                style={{
                  flex: 1, background: "var(--surface2)",
                  border: "1.5px solid var(--border)",
                  borderRadius: "var(--radius-sm)", padding: "12px 14px",
                  fontSize: 15, fontFamily: "inherit", color: "var(--text)", outline: "none",
                }}
                placeholder="Es. Tachipirina, Moment..."
                value={manualName}
                onChange={e => setManualName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleManualSearch()}
              />
              <button className="btn btn-primary" style={{ padding: "12px 16px" }}
                onClick={handleManualSearch} disabled={searching}>
                {searching ? "..." : "Cerca"}
              </button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <button className="btn btn-secondary" onClick={onClose}>
                <Icon.plus /> Inserisci manualmente
              </button>
              <button className="btn btn-secondary" onClick={onClose}>
                Annulla
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}