export function getTheme() {
  return localStorage.getItem("tm_theme") || "light";
}

export function setTheme(theme) {
  localStorage.setItem("tm_theme", theme);
  document.documentElement.setAttribute("data-theme", theme);
}

export function initTheme() {
  const theme = getTheme();
  document.documentElement.setAttribute("data-theme", theme);
  return theme;
}

export function toggleTheme() {
  const current = getTheme();
  const next = current === "light" ? "dark" : "light";
  setTheme(next);
  return next;
}