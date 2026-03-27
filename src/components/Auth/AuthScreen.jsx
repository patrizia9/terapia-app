/** @author Patrizia Danieli @copyright 2025 TerapiaApp — Tutti i diritti riservati */
import { useState } from "react";
import { Icon } from "../shared/Icons";
import RecoveryScreen from "./RecoveryScreen";
import { TermsModal } from "./TermsModal";

const QUESTIONS = [
  "Come si chiamava il tuo primo animale domestico?",
  "In quale città sei nato/a?",
  "Qual è il nome da nubile di tua madre?",
  "Come si chiamava la tua scuola elementare?",
  "Qual è il tuo cibo preferito?",
  "Come si chiama il tuo migliore amico d'infanzia?",
];

export default function AuthScreen({ onLogin, onRegister }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState({
    name: "", email: "", password: "", dob: "",
    secretQuestion: QUESTIONS[0], secretAnswer: "",
    acceptedTerms: false, acceptedPrivacy: false,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showRecovery, setShowRecovery] = useState(false);
  const [showTerms, setShowTerms] = useState(false);

  if (showRecovery) return <RecoveryScreen onBack={() => setShowRecovery(false)} />;

  const handleLogin = async () => {
    if (!form.email || !form.password) { setError("Compila tutti i campi."); return; }
    setLoading(true);
    const res = await onLogin(form.email, form.password);
    if (!res.success) setError(res.error);
    setLoading(false);
  };

  const handleRegister = async () => {
    if (!form.name || !form.email || !form.password) { setError("Compila tutti i campi."); return; }
    if (!form.secretAnswer) { setError("Inserisci la risposta alla domanda segreta."); return; }
    if (form.password.length < 6) { setError("La password deve essere di almeno 6 caratteri."); return; }
    if (!form.acceptedTerms || !form.acceptedPrivacy) { setError("Devi accettare i termini e la privacy policy per continuare."); return; }
    setLoading(true);
    const res = await onRegister(
      form.name, form.email, form.password, form.dob,
      form.secretQuestion, form.secretAnswer,
      form.acceptedTerms, form.acceptedPrivacy
    );
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

        {/* NOME — solo in registrazione */}
        {mode === "register" && (
          <div className="field">
            <label>Nome completo</label>
            <input placeholder="Mario Rossi" value={form.name}
              onChange={e => { setForm({ ...form, name: e.target.value }); setError(""); }} />
          </div>
        )}

        {/* EMAIL */}
        <div className="field">
          <label>Email</label>
          <input type="email" placeholder="nome@email.com" value={form.email}
            onChange={e => { setForm({ ...form, email: e.target.value }); setError(""); }} />
        </div>

        {/* PASSWORD */}
        <div className="field">
          <label>Password</label>
          <input type="password" placeholder="Minimo 6 caratteri" value={form.password}
            onChange={e => { setForm({ ...form, password: e.target.value }); setError(""); }} />
        </div>

        {/* CAMPI SOLO REGISTRAZIONE */}
        {mode === "register" && (
          <>
            {/* DATA DI NASCITA */}
            <div className="field">
              <label>Data di nascita</label>
              <input type="date" value={form.dob}
                onChange={e => setForm({ ...form, dob: e.target.value })} />
            </div>

            {/* DOMANDA SEGRETA */}
            <div style={{ background: "var(--surface2)", borderRadius: 12, padding: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: "var(--text2)", marginBottom: 8, textTransform: "uppercase", letterSpacing: "0.4px" }}>
                🔐 Domanda segreta (per recupero account)
              </div>
              <div className="field">
                <label>Scegli una domanda</label>
                <select value={form.secretQuestion}
                  onChange={e => setForm({ ...form, secretQuestion: e.target.value })}
                  style={{
                    background: "var(--surface)", border: "1.5px solid var(--border)",
                    borderRadius: "var(--radius-sm)", padding: "12px 14px",
                    fontSize: 14, fontFamily: "inherit", color: "var(--text)",
                    outline: "none", cursor: "pointer", width: "100%",
                  }}>
                  {QUESTIONS.map(q => <option key={q} value={q}>{q}</option>)}
                </select>
              </div>
              <div className="field" style={{ marginTop: 8 }}>
                <label>La tua risposta</label>
                <input placeholder="Risposta segreta..." value={form.secretAnswer}
                  onChange={e => { setForm({ ...form, secretAnswer: e.target.value }); setError(""); }} />
              </div>
            </div>

            {/* CHECKBOX TERMINI */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <input type="checkbox" id="terms"
                  checked={form.acceptedTerms}
                  onChange={e => setForm({ ...form, acceptedTerms: e.target.checked })}
                  style={{ marginTop: 3, width: 18, height: 18, cursor: "pointer", accentColor: "var(--accent)" }} />
                <label htmlFor="terms" style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, cursor: "pointer" }}>
                  Ho letto e accetto i{" "}
                  <button onClick={() => setShowTerms(true)}
                    style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontSize: 13, fontFamily: "inherit", cursor: "pointer", padding: 0 }}>
                    Termini e Condizioni
                  </button>
                  {" "}e la{" "}
                  <button onClick={() => setShowTerms(true)}
                    style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontSize: 13, fontFamily: "inherit", cursor: "pointer", padding: 0 }}>
                    Privacy Policy
                  </button>
                  {" "}*
                </label>
              </div>

              <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                <input type="checkbox" id="privacy"
                  checked={form.acceptedPrivacy}
                  onChange={e => setForm({ ...form, acceptedPrivacy: e.target.checked })}
                  style={{ marginTop: 3, width: 18, height: 18, cursor: "pointer", accentColor: "var(--accent)" }} />
                <label htmlFor="privacy" style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5, cursor: "pointer" }}>
                  Acconsento al trattamento dei miei{" "}
                  <strong>dati sanitari</strong>{" "}
                  ai sensi dell'Art. 9 GDPR *
                </label>
              </div>

              <p style={{ fontSize: 11, color: "var(--text3)" }}>
                * Campi obbligatori per la registrazione
              </p>
            </div>
          </>
        )}

        {/* BOTTONE PRINCIPALE */}
        <button className="btn btn-primary"
          onClick={mode === "login" ? handleLogin : handleRegister}
          disabled={loading}>
          {loading ? "Attendere..." : mode === "login" ? "Accedi" : "Crea account"}
        </button>

        {/* LINK RECUPERO PASSWORD */}
        {mode === "login" && (
          <button style={{ background: "none", border: "none", color: "var(--text2)", fontSize: 13, fontFamily: "inherit", cursor: "pointer", textAlign: "center" }}
            onClick={() => setShowRecovery(true)}>
            🔑 Password o email dimenticata?
          </button>
        )}
      </div>

      {/* SWITCH LOGIN/REGISTRAZIONE */}
      <div className="auth-switch">
        {mode === "login"
          ? <p>Non hai un account? <button onClick={() => { setMode("register"); setError(""); }}>Registrati</button></p>
          : <p>Hai già un account? <button onClick={() => { setMode("login"); setError(""); }}>Accedi</button></p>
        }
      </div>

      {/* MODAL TERMINI */}
      {showTerms && <TermsModal onClose={() => setShowTerms(false)} />}
    </div>
  );
}