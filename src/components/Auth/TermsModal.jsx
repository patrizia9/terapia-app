import { useState } from "react";
import { Icon } from "../shared/Icons";

export function TermsModal({ onClose }) {
  const [activeTab, setActiveTab] = useState("terms");

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxHeight: "90vh" }}>
        <div className="modal-handle"></div>
        <div className="modal-title">Documenti legali</div>

        <div className="tab-bar">
          <button className={`tab-btn ${activeTab === "terms" ? "active" : ""}`}
            onClick={() => setActiveTab("terms")}>Termini</button>
          <button className={`tab-btn ${activeTab === "privacy" ? "active" : ""}`}
            onClick={() => setActiveTab("privacy")}>Privacy</button>
        </div>

        {activeTab === "terms" && (
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                Termini e Condizioni di Utilizzo
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                Ultimo aggiornamento: gennaio 2025
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>1. Accettazione dei termini</div>
              <p>Utilizzando TerapiaApp accetti integralmente i presenti Termini e Condizioni. Se non accetti, ti preghiamo di non utilizzare l'applicazione.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>2. Descrizione del servizio</div>
              <p>TerapiaApp è un'applicazione di supporto alla gestione dei piani terapeutici personali. Il servizio consente di registrare farmaci, impostare promemoria e monitorare l'aderenza alle terapie.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>3. Uso personale e non medico</div>
              <p>⚠️ TerapiaApp è uno strumento di supporto personale e NON sostituisce il parere medico professionale. Le informazioni inserite nell'app non costituiscono diagnosi o prescrizione medica. Consulta sempre il tuo medico per decisioni sulla salute.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>4. Responsabilità dell'utente</div>
              <p>L'utente è responsabile della correttezza delle informazioni inserite, della sicurezza delle proprie credenziali di accesso e dell'uso appropriato dell'applicazione.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>5. Limitazione di responsabilità</div>
              <p>TerapiaApp non è responsabile per eventuali danni derivanti dall'uso improprio dell'applicazione, da errori nelle informazioni inserite dall'utente o da decisioni mediche basate sui dati dell'app.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>6. Modifiche al servizio</div>
              <p>Ci riserviamo il diritto di modificare o interrompere il servizio in qualsiasi momento, con o senza preavviso.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>7. Legge applicabile</div>
              <p>I presenti termini sono regolati dalla legge italiana. Per qualsiasi controversia è competente il Foro di Milano.</p>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div style={{ fontSize: 13, color: "var(--text2)", lineHeight: 1.8, display: "flex", flexDirection: "column", gap: 16 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: "var(--text)", marginBottom: 6 }}>
                Informativa sulla Privacy
              </div>
              <div style={{ fontSize: 11, color: "var(--text3)" }}>
                Ai sensi del Regolamento UE 2016/679 (GDPR) — Ultimo aggiornamento: gennaio 2025
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>1. Titolare del trattamento</div>
              <p>Il titolare del trattamento dei dati personali è il gestore di TerapiaApp. Per esercitare i tuoi diritti puoi contattarci tramite l'app.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>2. Dati raccolti</div>
              <p>Raccogliamo i seguenti dati personali:</p>
              <div style={{ background: "var(--surface2)", borderRadius: 10, padding: 12, marginTop: 6 }}>
                <div>• <strong>Dati anagrafici:</strong> nome, email, data di nascita</div>
                <div>• <strong>Dati sanitari:</strong> farmaci, dosaggi, piani terapeutici</div>
                <div>• <strong>Dati di utilizzo:</strong> orari assunzione, aderenza terapia</div>
                <div>• <strong>Dati del medico:</strong> nome, contatti (facoltativi)</div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>3. Base giuridica e finalità</div>
              <p>I dati sono trattati sulla base del tuo consenso esplicito (Art. 6 e Art. 9 GDPR) per le seguenti finalità:</p>
              <div style={{ background: "var(--surface2)", borderRadius: 10, padding: 12, marginTop: 6 }}>
                <div>• Gestione del tuo piano terapeutico personale</div>
                <div>• Invio di promemoria per l'assunzione farmaci</div>
                <div>• Monitoraggio dell'aderenza alla terapia</div>
                <div>• Recupero delle credenziali di accesso</div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>4. Dati sanitari — Categoria speciale</div>
              <p>⚠️ I dati relativi ai farmaci e alle terapie costituiscono <strong>dati sanitari</strong> ai sensi dell'Art. 9 GDPR. Questi dati sono trattati esclusivamente per le finalità indicate e con il tuo consenso esplicito.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>5. Conservazione dei dati</div>
              <p>I tuoi dati sono conservati per tutta la durata dell'utilizzo dell'app e per un massimo di 12 mesi dalla cancellazione dell'account, salvo obblighi di legge.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>6. I tuoi diritti GDPR</div>
              <div style={{ background: "var(--surface2)", borderRadius: 10, padding: 12, marginTop: 6 }}>
                <div>• <strong>Accesso:</strong> richiedere copia dei tuoi dati</div>
                <div>• <strong>Rettifica:</strong> correggere dati errati</div>
                <div>• <strong>Cancellazione:</strong> richiedere la cancellazione</div>
                <div>• <strong>Portabilità:</strong> ricevere i dati in formato leggibile</div>
                <div>• <strong>Opposizione:</strong> opporti al trattamento</div>
                <div>• <strong>Revoca:</strong> revocare il consenso in qualsiasi momento</div>
              </div>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>7. Sicurezza</div>
              <p>I tuoi dati sono protetti tramite crittografia delle password, autenticazione sicura con token JWT e accesso limitato ai soli dati dell'utente autenticato.</p>
            </div>

            <div>
              <div style={{ fontWeight: 600, color: "var(--text)", marginBottom: 4 }}>8. Contatti</div>
              <p>Per esercitare i tuoi diritti o per informazioni sul trattamento dei dati, contattaci tramite la sezione Profilo dell'app.</p>
            </div>
          </div>
        )}

        <button className="btn btn-primary" onClick={onClose}>
          <Icon.check /> Ho letto e capito
        </button>
      </div>
    </div>
  );
}