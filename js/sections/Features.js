import { renderSectionHeader } from "../components/common/SectionHeader.js";
import {
  renderFeature3DStack,
  initFeature3DStack,
} from "../components/features/Feature3DStack.js";
import {
  renderFeatureBentoGrid,
  initFeatureBentoGrid,
} from "../components/features/FeatureBentoGrid.js";

export function renderFeatures(s, sectionId = "features") {
  const isBento = s.layout === "bento";

  const headerHtml = renderSectionHeader({
    eyebrow: s.eyebrow,
    eyebrowIcon: "fa-solid fa-sparkles",
    title: s.title,
    subtitle: s.subtitle,
    centered: true,
  });

  const contentHtml = isBento
    ? renderFeatureBentoGrid({ items: s.items })
    : renderFeature3DStack({ items: s.items });

  const sectionClass = isBento
    ? "section features-section"
    : "section features-section features-section--stack";

  return `
  <wl-features class="${sectionClass}" id="${sectionId}">
    <div class="container">
      ${headerHtml}
      ${contentHtml}
    </div>
  </wl-features>`;
}

export function initFeaturesInteractions() {
  initFeature3DStack();
  initFeatureBentoGrid();
}

// ============================================================================
// Web Component <wl-features> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlFeatures extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderFeatures(this._config);
      initFeaturesInteractions();
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderFeatures(config);
    initFeaturesInteractions();
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("wl-features")
) {
  customElements.define("wl-features", WlFeatures);
}
