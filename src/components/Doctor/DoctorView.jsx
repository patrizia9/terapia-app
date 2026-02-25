import { useState } from "react";
import { Icon } from "../shared/Icons";

export default function DoctorView({ doctor, onSave }) {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState(doctor);
  const [saved, setSaved] = useState(false);

  const hasData = doctor.name || doctor.phone || doctor.email;

  const handleSave = () => {
    onSave(form);
    setEditing(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (editing) return (
    <>
      <div className="card">
        <div className="card-header"><span className="card-label">Dati medico curante</span></div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div className="field"><label>Nome e Cognome</label><input placeholder="Dott. Mario Bianchi" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
          <div className="field"><label>Specialità</label><input placeholder="Medico di Base / Cardiologo..." value={form.specialty} onChange={e => setForm({ ...form, specialty: e.target.value })} /></div>
          <div className="field"><label>Telefono</label><input type="tel" placeholder="+39 02 1234567" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
          <div className="field"><label>Email</label><input type="email" placeholder="dottore@email.com" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
          <div className="field"><label>Indirizzo studio</label><input placeholder="Via Roma 1, Milano" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })} /></div>
          <div className="field"><label>Note</label><textarea placeholder="Note o istruzioni particolari..." value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <button className="btn btn-secondary" onClick={() => setEditing(false)}>Annulla</button>
        <button className="btn btn-primary" onClick={handleSave}><Icon.check /> Salva</button>
      </div>
    </>
  );

  return (
    <>
      {saved && (
        <div className="alert-banner alert-ok-banner">
          <Icon.check /><p>Dati del medico salvati con successo!</p>
        </div>
      )}
      <div className="card">
        <div className="card-header">
          <span className="card-label">Il tuo medico</span>
          <button className="btn btn-secondary btn-sm" onClick={() => setEditing(true)}>
            <Icon.edit /> Modifica
          </button>
        </div>

        {!hasData ? (
          <div className="empty-state" style={{ padding: "24px 0" }}>
            <div className="empty-icon"><Icon.doctor /></div>
            <h3>Nessun medico salvato</h3>
            <p>Aggiungi i dati del tuo medico curante per averli sempre a portata di mano</p>
            <button className="btn btn-primary btn-sm" onClick={() => setEditing(true)}>
              <Icon.plus /> Aggiungi medico
            </button>
          </div>
        ) : (
          <div>
            {doctor.name && (
              <div className="doctor-info-row">
                <div className="doctor-icon"><Icon.doctor /></div>
                <div className="doctor-info-content">
                  <div className="doctor-info-label">Medico</div>
                  <div className="doctor-info-val">{doctor.name}</div>
                  {doctor.specialty && <div style={{ fontSize: 12, color: "var(--text2)" }}>{doctor.specialty}</div>}
                </div>
              </div>
            )}
            {doctor.phone && (
              <div className="doctor-info-row">
                <div className="doctor-icon"><Icon.phone /></div>
                <div className="doctor-info-content">
                  <div className="doctor-info-label">Telefono</div>
                  <div className="doctor-info-val">{doctor.phone}</div>
                </div>
              </div>
            )}
            {doctor.email && (
              <div className="doctor-info-row">
                <div className="doctor-icon"><Icon.mail /></div>
                <div className="doctor-info-content">
                  <div className="doctor-info-label">Email</div>
                  <div className="doctor-info-val">{doctor.email}</div>
                </div>
              </div>
            )}
            {doctor.address && (
              <div className="doctor-info-row">
                <div className="doctor-icon"><Icon.doc /></div>
                <div className="doctor-info-content">
                  <div className="doctor-info-label">Studio</div>
                  <div className="doctor-info-val">{doctor.address}</div>
                </div>
              </div>
            )}
            {doctor.notes && (
              <div className="doctor-info-row">
                <div className="doctor-icon"><Icon.list /></div>
                <div className="doctor-info-content">
                  <div className="doctor-info-label">Note</div>
                  <div className="doctor-info-val" style={{ fontSize: 13 }}>{doctor.notes}</div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasData && doctor.phone && (
        <a href={`tel:${doctor.phone}`} className="btn btn-primary" style={{ textDecoration: "none" }}>
          <Icon.phone /> Chiama il medico
        </a>
      )}
    </>
  );
}