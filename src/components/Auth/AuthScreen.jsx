import { useState } from "react";
import { Icon } from "../shared/Icons";

export default function AuthScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({ name: "", email: "", password: "", dob: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Compila tutti i campi."); return; }
    setLoading(true);
    const res = await onLogin(form.email, form.password);
    if (!res.success) setError(res.error);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError("Compila tutti i campi."); return; }
    setLoading(true);
    const res = await onRegister(form.name, form.email, form.password, form.dob);
    if (!res.success) setError(res.error);
    setLoading(false);
  };

  return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="auth-logo-icon"><Icon.pill /></div>
        <h1>TerapiaApp</h1>
        <p>Gestione piani terapeutici</p>
      </div>

      <div className="auth-card">
        <h2>{mode === "login" ? "Accedi" : "Registrati"}</h2>
        {error && <div className="error-msg">{error}</div>}

        {mode === "register" && (
          <div className="field">
            <label>Nome completo</label>
            <input placeholder="Mario Rossi" value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); setError(""); }} />
          </div>
        )}
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="nome@email.com" value={form.email}
            onChange={e => { setForm({ ...form, email: e.target.value }); setError(""); }} />
        </div>
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="••••••" value={form.password}
            onChange={e => { setForm({ ...form, password: e.target.value }); setError(""); }} />
        </div>
        {mode === "register" && (
          <div className="field">
            <label>Data di nascita</label>
            <input type="date" value={form.dob}
              onChange={e => setForm({ ...form, dob: e.target.value })} />
          </div>
        )}

        <button className="btn btn-primary" onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}>
          {loading ? "Attendere..." : mode === "login" ? "Accedi" : "Crea account"}
        </button>
      </div>

      <div className="auth-switch">
        {mode === "login"
          ? <p>Non hai un account? <button onClick={() => { setMode("register"); setError(""); }}>Registrati</button></p>
          : <p>Hai già un account? <button onClick={() => { setMode("login"); setError(""); }}>Accedi</button></p>
        }
      </div>
    </div>
  );
}