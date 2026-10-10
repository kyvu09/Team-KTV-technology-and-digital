// ============================================================================
// Pricing.js — Section Bảng giá: Hỗ trợ chuyển đổi Tháng / Năm & Highlight gói Pro
// ============================================================================

import { esc } from "../core/esc.js";
import { initPricingToggle } from "../components/PricingToggle.js";

export function renderPricing(s) {
  return `
  <section class="section pricing-section" id="pricing">
    <div class="container">
      <div class="section-header text-center">
        ${s.eyebrow ? `<p class="eyebrow reveal"><i class="fa-solid fa-tags"></i> ${esc(s.eyebrow)}</p>` : ""}
        <h2 class="section-title reveal">${esc(s.title)}</h2>
        ${s.subtitle ? `<p class="section-sub mx-auto reveal">${esc(s.subtitle)}</p>` : ""}

        <!-- Pricing Toggle -->
        <div class="pricing-toggle-wrap reveal">
          <span class="toggle-label">Thanh toán theo tháng</span>
          <button type="button" class="pricing-toggle" id="pricing-toggle" role="switch" aria-checked="false" aria-label="Đổi sang thanh toán theo năm">
            <span class="toggle-knob"></span>
          </button>
          <span class="toggle-label">
            Thanh toán theo năm 
            <span class="discount-pill">Tiết kiệm 20%</span>
          </span>
        </div>
      </div>

      <div class="pricing-grid reveal">
        ${(s.plans || [])
          .map((p) => {
            const isFeatured = p.featured;
            const priceMonthly = p.price;
            const priceYearly = p.priceYearly || p.price;

            return `
            <article class="price-card ${isFeatured ? "featured" : ""}">
              ${isFeatured ? `<div class="featured-badge">Khuyên dùng</div>` : ""}
              <div class="card-glow" aria-hidden="true"></div>

              <div class="price-card-header">
                <h3 class="plan-name">${esc(p.name)}</h3>
                <div class="price" data-monthly="${esc(priceMonthly)}" data-yearly="${esc(priceYearly)}">
                  ${esc(priceMonthly)}
                  <span class="price-unit">${esc(p.unit || "/tháng")}</span>
                </div>
              </div>

              <div class="plan-divider"></div>

              <ul class="plan-features">
                ${(p.features || [])
                  .map((f) => `
                  <li>
                    <i class="fa-solid fa-circle-check feature-check"></i>
                    <span>${esc(f)}</span>
                  </li>`)
                  .join("")}
              </ul>

              <div class="price-card-footer">
                ${p.cta ? `
                  <a class="btn ${isFeatured ? "btn-primary" : "btn-ghost"} btn-block btn-magnetic" href="${esc(p.cta.href)}">
                    ${esc(p.cta.label)}
                  </a>` : ""}
              </div>
            </article>`;
          })
          .join("")}
      </div>
    </div>
  </section>`;
}

export function initPricingInteractions() {
  initPricingToggle();
}

// ============================================================================
// Web Component <wl-pricing> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlPricing extends (typeof HTMLElement !== "undefined" ? HTMLElement : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderPricing(this._config);
      initPricingInteractions();
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderPricing(config);
    initPricingInteractions();
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-pricing")) {
  customElements.define("wl-pricing", WlPricing);
}

