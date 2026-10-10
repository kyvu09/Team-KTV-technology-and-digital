// ============================================================================
// Cta.js — Section Kêu gọi hành động chốt hạ với hiệu ứng Ánh hào quang Aurora
// ============================================================================

import { esc } from "../core/esc.js";

export function renderCta(s) {
  return `
  <section class="cta-section" id="cta">
    <div class="container">
      <div class="cta-card reveal ${s.image ? "has-backdrop" : ""}">
        <div class="cta-aurora" aria-hidden="true"></div>
        ${s.image ? `
        <div class="cta-backdrop-wrap" aria-hidden="true">
          <img class="cta-backdrop-img" src="${esc(s.image)}" alt="Studio backdrop" loading="lazy" />
          <div class="cta-backdrop-overlay"></div>
        </div>` : ""}
        <div class="cta-content">
          <div class="cta-badge">
            <i class="fa-solid fa-bolt"></i> Bắt đầu ngay hôm nay
          </div>
          <h2 class="cta-title">${esc(s.title)}</h2>
          ${s.subtitle ? `<p class="cta-sub">${esc(s.subtitle)}</p>` : ""}

          <div class="cta-actions">
            ${(s.buttons || [])
              .map(
                (b) => `
                <a class="btn btn-primary btn-lg btn-magnetic" href="${esc(b.href)}">
                  <span>${esc(b.label)}</span>
                  <i class="fa-solid fa-arrow-right"></i>
                </a>`
              )
              .join("")}
          </div>
        </div>
      </div>
    </div>
  </section>`;
}

// ============================================================================
// Web Component <wl-cta> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlCta extends (typeof HTMLElement !== "undefined" ? HTMLElement : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderCta(this._config);
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderCta(config);
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-cta")) {
  customElements.define("wl-cta", WlCta);
}

