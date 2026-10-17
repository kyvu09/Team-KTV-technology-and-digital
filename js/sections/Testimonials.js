import { renderSectionHeader } from "../components/common/SectionHeader.js";
import {
  renderTestimonialMarquee,
  initTestimonialMarquee,
} from "../components/testimonials/TestimonialMarquee.js";

export function renderTestimonials(s) {
  const items = s.items || [];

  const headerHtml = renderSectionHeader({
    eyebrow: s.eyebrow,
    eyebrowIcon: "fa-solid fa-comments",
    title: s.title,
    subtitle: s.subtitle,
    centered: true,
  });

  const marqueeHtml = renderTestimonialMarquee({ items });

  return `
  <wl-testimonials class="section testimonials-section" id="testimonials">
    <div class="container">
      ${headerHtml}
    </div>

    ${marqueeHtml}
  </wl-testimonials>`;
}

export function initTestimonialsInteractions() {
  initTestimonialMarquee();
}

// ============================================================================
// Web Component <wl-testimonials> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlTestimonials extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderTestimonials(this._config);
      initTestimonialsInteractions();
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderTestimonials(config);
    initTestimonialsInteractions();
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("wl-testimonials")
) {
  customElements.define("wl-testimonials", WlTestimonials);
}
