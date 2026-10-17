// ============================================================================
// Footer.js — Chân trang sang trọng với Watermark Brand khổng lồ
// ============================================================================

import { esc } from "../core/esc.js";

export function renderFooter(config) {
  const { brand = {}, footer = {} } = config || {};
  const year = new Date().getFullYear();

  const footerEl = document.getElementById("site-footer");
  if (!footerEl) return;

  footerEl.innerHTML = `
    <div class="footer-huge-wordmark" aria-hidden="true">${esc(brand.name || "")}</div>
    <div class="container footer-inner">
      <div class="footer-brand-col">
        <a class="footer-logo" href="#">
          ${brand.logo ? `<img class="logo-img" src="${esc(brand.logo)}" alt="${esc(brand.name || "")}" />` : ""}
          <span class="logo-text">${esc(brand.name || "")}</span>
        </a>
        <p class="footer-tagline">${esc(footer.tagline || brand.slogan || "")}</p>
        <div class="footer-socials">
          <a href="#" aria-label="Facebook"><i class="fa-brands fa-facebook-f"></i></a>
          <a href="#" aria-label="Youtube"><i class="fa-brands fa-youtube"></i></a>
          <a href="#" aria-label="TikTok"><i class="fa-brands fa-tiktok"></i></a>
          <a href="#" aria-label="GitHub"><i class="fa-brands fa-github"></i></a>
        </div>
      </div>

      <div class="footer-links-grid">
        ${(footer.columns || [])
          .map(
            (col) => `
          <div class="footer-col">
            <h4 class="footer-col-title">${esc(col.title)}</h4>
            <ul class="footer-col-links">
              ${(col.links || []).map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join("")}
            </ul>
          </div>`
          )
          .join("")}
      </div>
    </div>

    <div class="footer-bottom-bar">
      <div class="container footer-bottom-inner">
        <p class="copyright">© ${year} ${esc(brand.name || "")}. ${esc(footer.copyright || "")}</p>
        <button class="back-to-top" id="back-to-top" type="button" aria-label="Về đầu trang">
          <span>Lên đầu trang</span>
          <i class="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </div>`;

  const btt = document.getElementById("back-to-top");
  if (btt) {
    btt.addEventListener("click", () => {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
}

// ============================================================================
// Web Component <wl-footer> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlFooter extends (typeof HTMLElement !== "undefined" ? HTMLElement : class {}) {
  connectedCallback() {
    if (this._config) {
      renderFooter(this._config);
    }
  }

  setConfig(config) {
    this._config = config;
    renderFooter(config);
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-footer")) {
  customElements.define("wl-footer", WlFooter);
}
