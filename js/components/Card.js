import { esc } from "../core/esc.js";

export class WlCard extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    // Nếu chưa có nội dung con được truyền vào thì tự sinh giao diện từ thuộc tính
    if (!this.innerHTML.trim()) {
      const title = this.getAttribute("title") || "";
      const desc = this.getAttribute("desc") || this.getAttribute("text") || "";
      const icon = this.getAttribute("icon") || "🚀";
      const badge = this.getAttribute("badge") || "";

      this.innerHTML = `
        <div class="card-inner-box">
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
}

if (typeof customElements !== "undefined" && !customElements.get("wl-card")) {
  customElements.define("wl-card", WlCard);
}
