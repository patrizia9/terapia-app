import { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import { Icon } from "./Icons";

export default function BarcodeScanner({ onDetected, onClose }) {
  const [scanning, setScanning] = useState(false);
  const [error, setError] = useState("");
  const [manualCode, setManualCode] = useState("");
  const scannerRef = useRef(null);
  const html5QrRef = useRef(null);

  useEffect(() => {
    startScanner();
    return () => stopScanner();
  }, []);

  const startScanner = async () => {
    try {
      setScanning(true);
      setError("");
      html5QrRef.current = new Html5Qrcode("qr-reader");
      await html5QrRef.current.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 250, height: 150 } },
        (decodedText) => {
          stopScanner();
          onDetected(decodedText);
        },
        () => {}
      );
    } catch (err) {
      setScanning(false);
      setError("Non riesco ad accedere alla fotocamera. Usa il codice manuale.");
    }
  };

  const stopScanner = async () => {
    try {
      if (html5QrRef.current) {
        await html5QrRef.current.stop();
        html5QrRef.current = null;
      }
    } catch {}
    setScanning(false);
  };

  const handleManual = () => {
    if (!manualCode.trim()) return;
    stopScanner();
    onDetected(manualCode.trim());
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-handle"></div>
        <div className="modal-title">📷 Scansiona farmaco</div>

        {/* AREA SCANNER */}
        <div style={{
          background: "var(--surface2)", borderRadius: 16,
          overflow: "hidden", position: "relative",
        }}>
          <div id="qr-reader" style={{ width: "100%" }}></div>

          {!scanning && !error && (
            <div style={{
              padding: 32, textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}>
              <Icon.scan />
              <p style={{ fontSize: 14, color: "var(--text2)" }}>Avvio fotocamera...</p>
            </div>
          )}

          {error && (
            <div style={{
              padding: 24, textAlign: "center",
              display: "flex", flexDirection: "column", alignItems: "center", gap: 8,
            }}>
              <div style={{ fontSize: 36 }}>📷</div>
              <p style={{ fontSize: 14, color: "var(--danger)" }}>{error}</p>
            </div>
          )}
        </div>

        {scanning && (
          <div className="alert-banner alert-ok-banner">
            <Icon.scan />
            <p>Inquadra il codice a barre sulla confezione del farmaco</p>
          </div>
        )}

        {/* INSERIMENTO MANUALE */}
        <div className="or-divider">oppure inserisci manualmente</div>

        <div style={{ display: "flex", gap: 8 }}>
          <input
            style={{
              flex: 1, background: "var(--surface2)",
              border: "1.5px solid var(--border)",
              borderRadius: "var(--radius-sm)", padding: "12px 14px",
              fontSize: 15, fontFamily: "inherit", color: "var(--text)", outline: "none",
            }}
            placeholder="Es. 8004796060611"
            value={manualCode}
            onChange={e => setManualCode(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleManual()}
          />
          <button className="btn btn-primary" style={{ padding: "12px 16px" }} onClick={handleManual}>
            Cerca
          </button>
        </div>

        <button className="btn btn-secondary" onClick={() => { stopScanner(); onClose(); }}>
          Annulla
        </button>
      </div>
    </div>
  );
}