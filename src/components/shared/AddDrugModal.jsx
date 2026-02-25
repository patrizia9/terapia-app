import { useState } from "react";
import { Icon } from "./Icons";
import { today } from "../../utils/helpers";

export default function AddDrugModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    name: "", dosage: "", totalPills: "", remainingPills: "",
    startDate: today(), durationDays: "30", times: ["08:00"],
  });

  const addTime = () => setForm({ ...form, times: [...form.times, "12:00"] });
  const removeTime = (i) => setForm({ ...form, times: form.times.filter((_, idx) => idx !== i) });
  const updateTime = (i, v) => {
    const t = [...form.times];
    t[i] = v;
    setForm({ ...form, times: t });
  };

  const submit = () => {
    if (!form.name || !form.dosage || !form.totalPills) return;
    onAdd({
      id: Date.now(),
      name: form.name,
      dosage: form.dosage,
      totalPills: parseInt(form.totalPills),
      remainingPills: parseInt(form.remainingPills || form.totalPills),
      startDate: form.startDate,
      durationDays: parseInt(form.durationDays),
      times: form.times.filter(Boolean),
      taken: [],
    });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-title">Aggiungi farmaco</div>

        <div className="scan-placeholder" onClick={() => alert("Scanner barcode: disponibile nell'app nativa")}>
          <Icon.scan />
          <p>Scannerizza il codice a barre</p>
          <span style={{ fontSize: 11, color: "var(--text3)" }}>Tocca per aprire la fotocamera</span>
        </div>

        <div className="or-divider">oppure inserisci manualmente</div>

        <div className="add-form">
          <div className="field">
            <label>Nome farmaco *</label>
            <input placeholder="es. Metformina" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
          </div>
          <div className="field">
            <label>Dosaggio *</label>
            <input placeholder="es. 500mg" value={form.dosage} onChange={(e) => setForm({ ...form, dosage: e.target.value })} />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Compresse totali *</label>
              <input type="number" placeholder="30" value={form.totalPills} onChange={(e) => setForm({ ...form, totalPills: e.target.value })} />
            </div>
            <div className="field">
              <label>Compresse ora</label>
              <input type="number" placeholder="= totali" value={form.remainingPills} onChange={(e) => setForm({ ...form, remainingPills: e.target.value })} />
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <div className="field">
              <label>Data inizio</label>
              <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })} />
            </div>
            <div className="field">
              <label>Durata (giorni)</label>
              <input type="number" value={form.durationDays} onChange={(e) => setForm({ ...form, durationDays: e.target.value })} />
            </div>
          </div>
          <div className="field">
            <label>Orari di assunzione</label>
            <div className="times-builder">
              {form.times.map((t, i) => (
                <div key={i} className="time-row">
                  <input type="time" className="time-input" value={t} onChange={(e) => updateTime(i, e.target.value)} />
                  {form.times.length > 1 && (
                    <button className="remove-time" onClick={() => removeTime(i)}>
                      <Icon.trash />
                    </button>
                  )}
                </div>
              ))}
              <button className="btn btn-secondary btn-sm" onClick={addTime} style={{ width: "fit-content" }}>
                + Aggiungi orario
              </button>
            </div>
          </div>
          <button className="btn btn-primary" onClick={submit}>Salva farmaco</button>
        </div>
      </div>
    </div>
  );
}