import { loadConfig } from "./config-loader.js";
import { applyTheme } from "./theme.js";
import { renderSite } from "./render.js";

// Brand mặc định khi không có ?brand= trên URL
const params = new URLSearchParams(window.location.search);
const brandName = params.get("brand") || "vi-voidce";

try {
  const config = await loadConfig(brandName);
  applyTheme(config);

  if (config.effects?.preloader !== false) {
    initPreloader(config.brand.name);
  } else {
    const preloaderEl = document.getElementById("site-preloader");
    if (preloaderEl) preloaderEl.style.display = "none";
  }

  renderSite(config);
} catch (err) {
  const preloaderEl = document.getElementById("site-preloader");
  if (preloaderEl) preloaderEl.style.display = "none";

  document.getElementById("app").innerHTML = `
    <div class="container" style="padding: 80px 20px;">
      <h1>Không tải được website</h1>
      <p>${err.message}</p>
      <p>Kiểm tra lại tên file trong thư mục <code>config/</code> và param <code>?brand=</code> trên URL.</p>
    </div>`;
  console.error(err);
}
