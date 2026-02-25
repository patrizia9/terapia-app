export function requestNotifications() {
  if (!("Notification" in window)) return Promise.resolve("unsupported");
  return Notification.requestPermission();
}

export function scheduleNotification(drug, time) {
  if (Notification.permission !== "granted") return;
  const [h, m] = time.split(":").map(Number);
  const now = new Date();
  const next = new Date();
  next.setHours(h, m, 0, 0);
  if (next <= now) next.setDate(next.getDate() + 1);
  const ms = next - now;
  setTimeout(() => {
    new Notification(`💊 TerapiaApp — Ora di prendere ${drug.name}`, {
      body: `${drug.dosage} — ${time}`,
      icon: "/favicon.ico",
    });
  }, ms);
}