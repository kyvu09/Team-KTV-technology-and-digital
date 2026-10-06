export function applyTheme(config) {
  const root = document.documentElement;
  const theme = config.theme;

    const vars = {
        "--primary": theme.primary,
        "--accent": theme.accent,
        "--background": theme.background,
        "--surface": theme.surface,
        "--text": theme.text,
        "--text-muted": theme.textMuted,
        "--font-heading": `'${theme.fontHeading}', sans-serif`,
        "--font-body": `'${theme.fontBody}', sans-serif`,
        "--radius": theme.radius || "12px",
    };
  for (const [name, value] of Object.entries(vars)) {
    if (value) root.style.setProperty(name, value);
  }

  loadGoogleFonts([theme.fontHeading, theme.fontBody]);

  document.title = `${config.brand.name} — ${config.brand.slogan || ""}`;
  if (config.brand.favicon) {
    let link = document.querySelector("link[rel='icon']");
    if (!link) {
      link = document.createElement("link");
      link.rel = "icon";
      document.head.appendChild(link);
    }
    link.href = config.brand.favicon;
  }
}

function loadGoogleFonts(families) {
  const unique = [...new Set(families.filter(Boolean))];
  if (unique.length === 0) return;
  const href =
    "https://fonts.googleapis.com/css2?" +
    unique.map((f) => `family=${encodeURIComponent(f)}:wght@400;600;700`).join("&") +
    "&display=swap";
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}
