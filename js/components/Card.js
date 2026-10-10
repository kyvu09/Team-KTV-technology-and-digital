// ============================================================================
// Card.js — Web Component <wl-card> chuẩn theo quy định quy-tac-code.md
// ============================================================================

import { esc } from "../core/esc.js";

export class WlCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const desc = this.getAttribute("desc") || "";
    const icon = this.getAttribute("icon") || "✦";
    const badge = this.getAttribute("badge") || "";

    this.innerHTML = `
      <div class="feature-card bento-card">
        <div class="card-glow" aria-hidden="true"></div>
        <div class="card-header-icon">
          <div class="feature-icon">
            ${icon.startsWith("fa-") ? `<i class="${esc(icon)}"></i>` : `<span class="emoji-icon">${esc(icon)}</span>`}
          </div>
          ${badge ? `<span class="card-pill">${esc(badge)}</span>` : ""}
        </div>
        <div class="card-body">
          <h3>${esc(title)}</h3>
          <p>${esc(desc)}</p>
        </div>
      </div>
    `;
  }
}

if (!customElements.get("wl-card")) {
  customElements.define("wl-card", WlCard);
}
