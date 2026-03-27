/** @author Patrizia Danieli @copyright 2025 TerapiaApp — Tutti i diritti riservati */
import { useState } from "react";
import { Icon } from "./Icons";
import { today } from "../../utils/helpers";
import BarcodeScanner from "./BarcodeScanner";
import DrugScanResult from "./DrugScanResult";

const FORMS = [
  { value: "compressa", label: "💊 Compressa", unit: "mg", quantityLabel: "Compresse", quantityUnit: "cpr" },
  { value: "capsula", label: "🔴 Capsula", unit: "mg", quantityLabel: "Capsule", quantityUnit: "cps" },
  { value: "sciroppo", label: "🍶 Sciroppo", unit: "ml", quantityLabel: "Quantità totale", quantityUnit: "ml" },
  { value: "gocce", label: "💧 Gocce", unit: "gocce", quantityLabel: "Gocce totali", quantityUnit: "gocce" },
  { value: "puntura", label: "💉 Puntura", unit: "mg", quantityLabel: "Fiale totali", quantityUnit: "fiale" },
  { value: "cerotto", label: "🩹 Cerotto", unit: "mcg/h", quantityLabel: "Cerotti totali", quantityUnit: "pz" },
  { value: "spray", label: "💨 Spray", unit: "mcg", quantityLabel: "Dosi totali", quantityUnit: "dosi" },
  { value: "crema", label: "🧴 Crema", unit: "g", quantityLabel: "Quantità totale", quantityUnit: "g" },
];

const DOSE_UNITS = {
  compressa: ["mg", "g"],
  capsula: ["mg", "g"],
  sciroppo: ["ml", "mg/ml", "mg/5ml"],
  gocce: ["gocce", "mg/ml"],
  puntura: ["mg", "ml", "UI"],
  cerotto: ["mcg/h", "mg"],
  spray: ["mcg", "mg"],
  crema: ["g", "mg/g", "%"],
};

export default function AddDrugModal({ onClose, onAdd }) {
  const [showScanner, setShowScanner] = useState(false);
  const [scannedBarcode, setScannedBarcode] = useState(null);
  const [form, setForm] = useState({
  name: "",
  drugForm: "compressa",
  dosageAmount: "",
  dosageUnit: "mg",
  totalQuantity: "",
  remainingQuantity: "",
  startDate: today(),
  durationDays: "30",
  times: ["08:00"],
  notes: "",
  color: "#2D6A4F",
});

  const currentForm = FORMS.find(f => f.value === form.drugForm);
  const currentUnits = DOSE_UNITS[form.drugForm] || ["mg"];

  const handleFormChange = (newForm) => {
    const units = DOSE_UNITS[newForm] || ["mg"];
    setForm({ ...form, drugForm: newForm, dosageUnit: units[0] });
  };

  const addTime = () => setForm({ ...form, times: [...form.times, "12:00"] });
  const removeTime = (i) => setForm({ ...form, times: form.times.filter((_, idx) => idx !== i) });
  const updateTime = (i, v) => {
    const t = [...form.times];
    t[i] = v;
    setForm({ ...form, times: t });
  };

  const submit = () => {
  if (!form.name || !form.dosageAmount || !form.totalQuantity) return;
  onAdd({
    id: Date.now(),
    name: form.name,
    drugForm: form.drugForm,
    dosage: `${form.dosageAmount} ${form.dosageUnit}`,
    totalPills: parseInt(form.totalQuantity),
    remainingPills: parseInt(form.remainingQuantity || form.totalQuantity),
    startDate: form.startDate,
    durationDays: parseInt(form.durationDays),
    times: form.times.filter(Boolean),
    notes: form.notes,
    color: form.color,
    taken: [],
  });
  onClose();
};

  // Se scanner attivo mostra BarcodeScanner
  if (showScanner) return (
    <BarcodeScanner
      onDetected={(barcode) => {
        setShowScanner(false);
        setScannedBarcode(barcode);
      }}
      onClose={() => setShowScanner(false)}
    />
  );

  // Se codice scansionato mostra risultato
  if (scannedBarcode) return (
    <DrugScanResult
      barcode={scannedBarcode}
      onAddDrug={(drug) => {
        onAdd(drug);
        onClose();
      }}
      onClose={() => setScannedBarcode(null)}
    />
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-title">Aggiungi farmaco</div>

        {/* SCANNER */}
        <div className="scan-placeholder" onClick={() => setShowScanner(true)}>
          <Icon.scan />
          <p>Scannerizza il codice a barre</p>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>
            Tocca per aprire la fotocamera
          </span>
        </div>

        <div className="or-divider">oppure inserisci manualmente</div>

        <div className="add-form">

          {/* NOME */}
          <div className="field">
            <label>Nome farmaco *</label>
            <input placeholder="es. Metformina" value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>

          {/* FORMA FARMACEUTICA */}
          <div className="field">
            <label>Forma farmaceutica *</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {FORMS.map(f => (
                <button key={f.value} type="button" onClick={() => handleFormChange(f.value)}
                  style={{
                    padding: "10px 8px", borderRadius: 10, border: "1.5px solid",
                    borderColor: form.drugForm === f.value ? "var(--accent)" : "var(--border)",
                    background: form.drugForm === f.value ? "var(--accent-light)" : "var(--surface2)",
                    color: form.drugForm === f.value ? "var(--accent)" : "var(--text2)",
                    fontSize: 13, fontWeight: 600, fontFamily: "inherit",
                    cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                  }}>
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* DOSAGGIO + UNITÀ */}
          <div className="field">
            <label>Dosaggio per dose *</label>
            <div style={{ display: "flex", gap: 8 }}>
              <input type="number" placeholder="es. 500"
                value={form.dosageAmount}
                onChange={(e) => setForm({ ...form, dosageAmount: e.target.value })}
                style={{ flex: 2 }} />
              <select value={form.dosageUnit}
                onChange={(e) => setForm({ ...form, dosageUnit: e.target.value })}
                style={{
                  flex: 1, background: "var(--surface2)", border: "1.5px solid transparent",
                  borderRadius: "var(--radius-sm)", padding: "12px 10px",
                  fontSize: 15, fontFamily: "inherit", color: "var(--text)",
                  outline: "none", cursor: "pointer",
                }}>
                {currentUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
          </div>

          {/* QUANTITÀ */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>{currentForm?.quantityLabel} totali *</label>
              <div style={{ position: "relative" }}>
                <input type="number" placeholder="es. 30"
                  value={form.totalQuantity}
                  onChange={(e) => setForm({ ...form, totalQuantity: e.target.value })} />
                <span style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  fontSize: 11, color: "var(--text3)", fontWeight: 600,
                }}>
                  {currentForm?.quantityUnit}
                </span>
              </div>
            </div>
            <div className="field">
              <label>{currentForm?.quantityLabel} ora</label>
              <div style={{ position: "relative" }}>
                <input type="number" placeholder="= totali"
                  value={form.remainingQuantity}
                  onChange={(e) => setForm({ ...form, remainingQuantity: e.target.value })} />
                <span style={{
                  position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
                  fontSize: 11, color: "var(--text3)", fontWeight: 600,
                }}>
                  {currentForm?.quantityUnit}
                </span>
              </div>
            </div>
          </div>

          {/* DATE */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Data inizio</label>
              <input type="date" value={form.startDate}
                onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="field">
              <label>Durata (giorni)</label>
              <input type="number" value={form.durationDays}
                onChange={(e) => setForm({ ...form, durationDays: e.target.value })} />
            </div>
          </div>

          {/* ORARI */}
          <div className="field">
            <label>Orari di assunzione</label>
            <div className="times-builder">
              {form.times.map((t, i) => (
                <div key={i} className="time-row">
                  <input type="time" className="time-input" value={t}
                    onChange={(e) => updateTime(i, e.target.value)} />
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
{/* COLORE */}
<div className="field">
  <label>Colore identificativo</label>
  <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
    {["#2D6A4F","#E76F51","#E9C46A","#457B9D","#9B5DE5","#E63946","#F72585","#4CC9F0"].map(c => (
      <button key={c} type="button"
        onClick={() => setForm({ ...form, color: c })}
        style={{
          width: 32, height: 32, borderRadius: "50%",
          background: c,
          border: form.color === c ? "3px solid var(--text)" : "3px solid transparent",
          cursor: "pointer", transition: "all 0.2s",
        }}
      />
    ))}
  </div>
</div>

{/* NOTE */}
<div className="field">
  <label>Note personali</label>
  <textarea
    placeholder="Es. Prendere a stomaco pieno, evitare alcol..."
    value={form.notes}
    onChange={e => setForm({ ...form, notes: e.target.value })}
    style={{ minHeight: 80 }}
  />
</div>
          {/* RIEPILOGO */}
          {form.name && form.dosageAmount && form.totalQuantity && (
            <div style={{
              background: "var(--accent-light)", borderRadius: 12,
              padding: 14, display: "flex", flexDirection: "column", gap: 4,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", marginBottom: 4 }}>
                📋 Riepilogo
              </div>
              <div style={{ fontSize: 13, color: "var(--text)" }}>
                <strong>{form.name}</strong> — {currentForm?.label}
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>
                Dose: {form.dosageAmount} {form.dosageUnit} · {form.times.length}x al giorno
              </div>
              <div style={{ fontSize: 13, color: "var(--text2)" }}>
                Scorta: {form.totalQuantity} {currentForm?.quantityUnit} · {form.durationDays} giorni
              </div>
            </div>
          )}

          <button className="btn btn-primary" onClick={submit}>
            Salva farmaco
          </button>
        </div>
      </div>
    </div>
  );
}