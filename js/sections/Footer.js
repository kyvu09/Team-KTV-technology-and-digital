import { renderFooterBrand } from "../components/footer/FooterBrand.js";
import { renderFooterNavColumns } from "../components/footer/FooterNavColumns.js";
import {
  renderFooterBottom,
  initFooterBottom,
} from "../components/footer/FooterBottom.js";

export function renderFooter(config) {
  const { brand = {}, footer = {} } = config || {};
  const year = new Date().getFullYear();

  const footerEl = document.getElementById("site-footer");
  if (!footerEl) return;

  const brandHtml = renderFooterBrand({
    brand,
    tagline: footer.tagline || brand.slogan || "",
  });

  const columnsHtml = renderFooterNavColumns(
    footer.links || footer.columns || [],
  );

  const bottomHtml = renderFooterBottom({
    brandName: brand.name || "AI Voice",
    copyright: footer.copyright || "Bảo lưu mọi quyền.",
    year,
  });

  footerEl.innerHTML = `
    <div class="container footer-inner">
      ${brandHtml}
      ${columnsHtml}
    </div>
    ${bottomHtml}`;

  // Kích hoạt tương tác
  initFooterBottom();
}

// ============================================================================
// Web Component <wl-footer> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlFooter extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
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
