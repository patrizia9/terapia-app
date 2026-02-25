export function today() {
  return new Date().toISOString().split("T")[0];
}

export function fmtDate(d) {
  return new Date(d).toLocaleDateString("it-IT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export function daysBetween(d1, d2) {
  return Math.round((new Date(d2) - new Date(d1)) / 86400000);
}

export function endDate(drug) {
  const d = new Date(drug.startDate);
  d.setDate(d.getDate() + drug.durationDays);
  return d.toISOString().split("T")[0];
}

export function daysRemaining(drug) {
  return Math.max(0, daysBetween(today(), endDate(drug)));
}

export function daysActive(drug) {
  return Math.max(0, daysBetween(drug.startDate, today()));
}

export function pillsPerDay(drug) {
  return drug.times.length;
}

export function stockAlert(drug) {
  return drug.remainingPills / pillsPerDay(drug) <= 7;
}

export function adherencePercent(drug) {
  const days = daysActive(drug);
  if (days === 0) return 100;
  const expected = days * pillsPerDay(drug);
  const taken = (drug.taken || []).length;
  return Math.min(100, Math.round((taken / expected) * 100));
}