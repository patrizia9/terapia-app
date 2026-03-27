import { useState } from "react";
import { Icon } from "../shared/Icons";
import emailjs from "@emailjs/browser";
import { getSecretQuestion, verifySecretAnswer, resetPassword } from "../../api/api";

const EMAILJS_SERVICE = "service_174enb8";
const EMAILJS_TEMPLATE = "template_sren078";
const EMAILJS_PUBLIC_KEY = "Ldjmpnoje2gOHJFzx";

const QUESTIONS = [
  "Come si chiamava il tuo primo animale domestico?",
  "In quale città sei nato/a?",
  "Qual è il nome da nubile di tua madre?",
  "Come si chiamava la tua scuola elementare?",
  "Qual è il tuo cibo preferito?",
  "Come si chiama il tuo migliore amico d'infanzia?",
];

export default function RecoveryScreen({ onBack }) {
  const [step, setStep] = useState(1);
  const [method, setMethod] = useState(null);
  const [form, setForm] = useState({ email: "", answer: "", newPassword: "", confirmPassword: "" });
  const [secretQuestion, setSecretQuestion] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [userName, setUserName] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // STEP 1 — Scegli metodo
  if (step === 1) return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="auth-logo-icon"><Icon.pill /></div>
        <h1>TerapiaApp</h1>
        <p>Recupero credenziali</p>
      </div>

      <div className="auth-card">
        <h2>Come vuoi recuperare?</h2>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.5 }}>
          Scegli il metodo di recupero che preferisci
        </p>

        <button className="btn btn-primary" onClick={() => { setMethod("email"); setStep(2); }}>
          <Icon.mail /> Recupera tramite Email
        </button>
        <button className="btn btn-secondary" onClick={() => { setMethod("secret"); setStep(2); }}>
          <Icon.check /> Domanda Segreta
        </button>
      </div>

      <div className="auth-switch">
        <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
          ← Torna al login
        </button>
      </div>
    </div>
  );

  // STEP 2 — Inserisci email
  if (step === 2) return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="auth-logo-icon"><Icon.pill /></div>
        <h1>TerapiaApp</h1>
        <p>{method === "email" ? "Recupero via Email" : "Domanda Segreta"}</p>
      </div>

      <div className="auth-card">
        <h2>Inserisci la tua email</h2>
        {error && <div className="error-msg">{error}</div>}

        <div className="field">
          <label>Email account</label>
          <input type="email" placeholder="nome@email.com" value={form.email}
            onChange={e => { setForm({ ...form, email: e.target.value }); setError(""); }} />
        </div>

        <button className="btn btn-primary" disabled={loading} onClick={async () => {
          if (!form.email) { setError("Inserisci la tua email."); return; }
          setLoading(true);
          try {
            if (method === "email") {
              // Invia email con link reset
              const res = await getSecretQuestion({ email: form.email });
              // Genera token temporaneo
              const tempToken = Math.random().toString(36).substring(2);
              setResetToken(tempToken);
              setUserName(form.email.split("@")[0]);

              await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
                to_name: form.email.split("@")[0],
                to_email: form.email,
                message: `Il tuo link per reimpostare la password è:\n\nhttp://localhost:3000/reset/${tempToken}\n\nIl link scade tra 1 ora.`,
              }, EMAILJS_PUBLIC_KEY);

              setStep(4);
            } else {
              // Domanda segreta
              const res = await getSecretQuestion({ email: form.email });
              setSecretQuestion(res.data.secretQuestion);
              setUserName(form.email.split("@")[0]);
              setStep(3);
            }
          } catch (err) {
            setError(err.response?.data?.error || "Email non trovata.");
          }
          setLoading(false);
        }}>
          {loading ? "Attendere..." : "Continua"}
        </button>
      </div>

      <div className="auth-switch">
        <button onClick={() => setStep(1)} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
          ← Indietro
        </button>
      </div>
    </div>
  );

  // STEP 3 — Risposta domanda segreta
  if (step === 3) return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="auth-logo-icon"><Icon.pill /></div>
        <h1>TerapiaApp</h1>
        <p>Domanda Segreta</p>
      </div>

      <div className="auth-card">
        <h2>Rispondi alla domanda</h2>
        {error && <div className="error-msg">{error}</div>}

        <div style={{ background: "var(--accent-light)", borderRadius: 12, padding: 14 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)", marginBottom: 4 }}>
            La tua domanda segreta:
          </div>
          <div style={{ fontSize: 14, color: "var(--text)", fontWeight: 500 }}>
            {secretQuestion}
          </div>
        </div>

        <div className="field">
          <label>La tua risposta</label>
          <input placeholder="Risposta..." value={form.answer}
            onChange={e => { setForm({ ...form, answer: e.target.value }); setError(""); }} />
        </div>

        <button className="btn btn-primary" disabled={loading} onClick={async () => {
          if (!form.answer) { setError("Inserisci la risposta."); return; }
          setLoading(true);
          try {
            const res = await verifySecretAnswer({ email: form.email, answer: form.answer });
            setResetToken(res.data.resetToken);

            // Invia email di conferma
            await emailjs.send(EMAILJS_SERVICE, EMAILJS_TEMPLATE, {
              to_name: res.data.name,
              to_email: form.email,
              message: `Hai risposto correttamente alla domanda segreta.\n\nPuoi ora reimpostare la tua password nell'app.`,
            }, EMAILJS_PUBLIC_KEY);

            setStep(5);
          } catch (err) {
            setError(err.response?.data?.error || "Risposta non corretta.");
          }
          setLoading(false);
        }}>
          {loading ? "Verifica..." : "Verifica risposta"}
        </button>
      </div>

      <div className="auth-switch">
        <button onClick={() => setStep(2)} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
          ← Indietro
        </button>
      </div>
    </div>
  );

  // STEP 4 — Email inviata
  if (step === 4) return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="auth-logo-icon" style={{ background: "var(--accent)" }}>
          <Icon.mail />
        </div>
        <h1>Email inviata!</h1>
        <p>Controlla la tua casella email</p>
      </div>

      <div className="auth-card">
        <div className="alert-banner alert-ok-banner">
          <Icon.check />
          <p>Abbiamo inviato le istruzioni a <strong>{form.email}</strong></p>
        </div>
        <p style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.6 }}>
          Controlla la tua email e segui le istruzioni per reimpostare la password. 
          Controlla anche la cartella spam!
        </p>
        <button className="btn btn-primary" onClick={() => setStep(5)}>
          Ho ricevuto l'email → Reimposta password
        </button>
      </div>

      <div className="auth-switch">
        <button onClick={onBack} style={{ background: "none", border: "none", color: "var(--accent)", fontWeight: 600, fontFamily: "inherit", cursor: "pointer" }}>
          ← Torna al login
        </button>
      </div>
    </div>
  );

  // STEP 5 — Nuova password
  if (step === 5) return (
    <div className="auth-screen">
      <div className="auth-logo">
        <div className="auth-logo-icon"><Icon.pill /></div>
        <h1>TerapiaApp</h1>
        <p>Reimposta password</p>
      </div>

      <div className="auth-card">
        <h2>Nuova password</h2>
        {error && <div className="error-msg">{error}</div>}
        {success && <div className="success-msg">{success}</div>}

        <div className="field">
          <label>Nuova password</label>
          <input type="password" placeholder="Minimo 6 caratteri" value={form.newPassword}
            onChange={e => { setForm({ ...form, newPassword: e.target.value }); setError(""); }} />
        </div>
        <div className="field">
          <label>Conferma password</label>
          <input type="password" placeholder="Ripeti la password" value={form.confirmPassword}
            onChange={e => { setForm({ ...form, confirmPassword: e.target.value }); setError(""); }} />
        </div>

        <button className="btn btn-primary" disabled={loading} onClick={async () => {
          if (!form.newPassword || form.newPassword.length < 6) {
            setError("La password deve essere di almeno 6 caratteri."); return;
          }
          if (form.newPassword !== form.confirmPassword) {
            setError("Le password non coincidono."); return;
          }
          setLoading(true);
          try {
            await resetPassword({ resetToken, newPassword: form.newPassword });
            setSuccess("Password aggiornata con successo!");
            setTimeout(() => onBack(), 2000);
          } catch (err) {
            setError(err.response?.data?.error || "Errore durante il reset.");
          }
          setLoading(false);
        }}>
          {loading ? "Attendere..." : "Salva nuova password"}
        </button>
      </div>
    </div>
  );
}