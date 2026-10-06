export function renderHeader(config) {
  const header = document.getElementById("site-header");
  if (!header) return;

  const brandName = config.brand?.name || "Brand";
  const slogan = config.brand?.slogan || "";

  header.innerHTML = `
    <div class="navbar-container" style="max-width: 1200px; margin: 0 auto; padding: 24px 20px; display: flex; justify-content: space-between; align-items: center;">
      <div class="navbar-brand" style="display: flex; align-items: baseline; gap: 12px;">
        <a href="." style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--text); text-decoration: none;">
          ${brandName}
        </a>
        ${slogan ? `<span style="font-size: 0.85rem; color: var(--text-muted);">${slogan}</span>` : ""}
      </div>
      <nav class="navbar-menu" style="display: flex; gap: 20px; align-items: center;">
        <a href="?brand=vi-voice" style="color: var(--text); text-decoration: none; font-size: 0.95rem;">ViVoice</a>
        <a href="?brand=edu-ai" style="color: var(--text); text-decoration: none; font-size: 0.95rem;">EduMind</a>
        <a href="?brand=travel-ai" style="color: var(--text); text-decoration: none; font-size: 0.95rem;">VietGo AI</a>
      </nav>
    </div>
  `;
}

export function renderHero(hero) {
  if (!hero) return "";

  return `
    <section class="hero">
      <div class="hero-container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%;">
        <div class="hero-inner">
          <div class="hero-content">
            ${
              hero.badge
                ? `<div class="hero-badge" style="display: inline-block; padding: 6px 16px; border-radius: 999px; background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); font-size: 0.85rem; font-weight: 600; margin-bottom: 20px;">
                    ${hero.badge}
                  </div>`
                : ""
            }
            <h1 style="font-family: var(--font-heading); font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.2; margin-bottom: 20px; color: var(--text);">
              ${hero.title || ""}
              <span style="background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${hero.highlight || ""}
              </span>
            </h1>
            <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 30px; max-width: 540px;">
              ${hero.description || ""}
            </p>
            <div class="hero-actions" style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-bottom: 24px;">
              ${
                hero.primaryButton
                  ? `<a href="${hero.primaryButton.link}" class="btn btn-primary">${hero.primaryButton.text}</a>`
                  : ""
              }
              ${
                hero.secondaryButton
                  ? `<a href="${hero.secondaryButton.link}" class="btn" style="border: 1px solid rgba(255, 255, 255, 0.2); color: var(--text);">${hero.secondaryButton.text}</a>`
                  : ""
              }
            </div>
            ${
              hero.trust
                ? `<p style="font-size: 0.85rem; color: var(--text-muted);">✓ ${hero.trust}</p>`
                : ""
            }
          </div>

          ${
            hero.visual
              ? `
          <div class="hero-visual" style="background: var(--surface); border-radius: var(--radius); padding: 40px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);">
            ${
              hero.visual.version
                ? `<div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 10px;">Version ${hero.visual.version}</div>`
                : ""
            }
            <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 16px; color: var(--text);">${hero.visual.title || ""}</h3>
            <div style="display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.9rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
              ${hero.visual.status || ""}
            </div>
          </div>
          `
              : ""
          }
        </div>
      </div>
    </section>
  `;
}

export function renderSite(config) {
  // 1. Render Header
  renderHeader(config);

  // 2. Lấy khu vực #app
  const app = document.getElementById("app");

  if (!app) {
    console.error("Không tìm thấy #app");
    return;
  }

  // 3. Render Hero
  app.innerHTML = renderHero(config.hero);
}