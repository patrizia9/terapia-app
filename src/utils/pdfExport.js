/** @author Patrizia Danieli @copyright 2025 TerapiaApp — Tutti i diritti riservati */
import { fmtDate, today, endDate, daysActive, daysRemaining, pillsPerDay, adherencePercent } from "./helpers";

export function exportToPDF(user, drugs, doctor) {
  const content = `
<!DOCTYPE html>
<html lang="it">
<head>
<meta charset="UTF-8">
<style>
  body { font-family: Arial, sans-serif; color: #1A1916; margin: 0; padding: 24px; font-size: 13px; }
  h1 { font-size: 22px; color: #2D6A4F; margin-bottom: 4px; }
  h2 { font-size: 15px; color: #2D6A4F; margin: 20px 0 8px; border-bottom: 2px solid #D8EDDF; padding-bottom: 4px; }
  .header { display: flex; justify-content: space-between; margin-bottom: 20px; }
  table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  th { background: #2D6A4F; color: white; padding: 8px 10px; text-align: left; font-size: 11px; }
  td { padding: 8px 10px; border-bottom: 1px solid #E5E4DE; font-size: 12px; }
  tr:nth-child(even) td { background: #F7F6F2; }
  .badge { display: inline-block; padding: 2px 8px; border-radius: 10px; font-size: 10px; font-weight: bold; }
  .ok { background: #D8EDDF; color: #2D6A4F; }
  .warn { background: #FDF6DC; color: #8B6914; }
  .danger { background: #FDEAEA; color: #E63946; }
  .footer { margin-top: 32px; font-size: 10px; color: #A8A7A2; text-align: center; border-top: 1px solid #E5E4DE; padding-top: 12px; }
  .info-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 8px; }
  .info-box { background: #F0EFE9; border-radius: 8px; padding: 10px 12px; }
  .info-label { font-size: 10px; color: #6B6A65; text-transform: uppercase; }
  .info-val { font-size: 14px; font-weight: bold; margin-top: 2px; }
</style>
</head>
<body>
<div class="header">
  <div>
    <h1>💊 TerapiaApp</h1>
    <div>Piano Terapeutico di <strong>${user.name}</strong></div>
    ${user.dob ? `<div style="font-size:11px;color:#A8A7A2">Nato il: ${fmtDate(user.dob)}</div>` : ""}
  </div>
  <div style="text-align:right;font-size:11px;color:#6B6A65">
    <div>Generato il ${fmtDate(today())}</div>
    <div>TerapiaApp v2.0</div>
  </div>
</div>

${doctor?.name ? `
<h2>👨‍⚕️ Medico Curante</h2>
<div class="info-grid">
  ${doctor.name ? `<div class="info-box"><div class="info-label">Nome</div><div class="info-val">${doctor.name}</div></div>` : ""}
  ${doctor.specialty ? `<div class="info-box"><div class="info-label">Specialità</div><div class="info-val">${doctor.specialty}</div></div>` : ""}
  ${doctor.phone ? `<div class="info-box"><div class="info-label">Telefono</div><div class="info-val">${doctor.phone}</div></div>` : ""}
  ${doctor.email ? `<div class="info-box"><div class="info-label">Email</div><div class="info-val">${doctor.email}</div></div>` : ""}
</div>` : ""}

<h2>📋 Farmaci in Terapia (${drugs.length})</h2>
<table>
  <thead>
    <tr><th>Farmaco</th><th>Dosaggio</th><th>Orari</th><th>Scorta</th><th>Inizio</th><th>Fine</th><th>Stato</th></tr>
  </thead>
  <tbody>
    ${drugs.map((d) => {
      const pct = Math.round((d.remainingPills / d.totalPills) * 100);
      const cls = pct > 50 ? "ok" : pct > 20 ? "warn" : "danger";
      const txt = pct > 50 ? "OK" : pct > 20 ? "Bassa" : "Urgente";
      return `<tr>
        <td><strong>${d.name}</strong></td>
        <td>${d.dosage}</td>
        <td>${d.times.join(", ")}</td>
        <td>${d.remainingPills}/${d.totalPills} (${pct}%)</td>
        <td>${fmtDate(d.startDate)}</td>
        <td>${fmtDate(endDate(d))}</td>
        <td><span class="badge ${cls}">${txt}</span></td>
      </tr>`;
    }).join("")}
  </tbody>
</table>

<h2>📊 Aderenza alla Terapia</h2>
<table>
  <thead>
    <tr><th>Farmaco</th><th>Giorni in corso</th><th>Giorni rimanenti</th><th>Dosi prese</th><th>Aderenza</th></tr>
  </thead>
  <tbody>
    ${drugs.map((d) => {
      const adh = adherencePercent(d);
      const cls = adh >= 80 ? "ok" : adh >= 50 ? "warn" : "danger";
      return `<tr>
        <td><strong>${d.name}</strong></td>
        <td>${daysActive(d)} gg</td>
        <td>${daysRemaining(d)} gg</td>
        <td>${(d.taken || []).length}</td>
        <td><span class="badge ${cls}">${adh}%</span></td>
      </tr>`;
    }).join("")}
  </tbody>
</table>

<div class="footer">
  Generato da TerapiaApp — ${fmtDate(today())} — Solo per uso informativo. Consultare sempre il medico.
</div>
</body>
</html>`;

  const blob = new Blob([content], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `piano_terapeutico_${user.name.replace(" ", "_")}_${today()}.html`;
  a.click();
  URL.revokeObjectURL(url);
}