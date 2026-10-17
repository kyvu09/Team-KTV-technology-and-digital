import {
  renderHeroContent,
  initHeroContent,
} from "../components/hero/HeroContent.js";
import {
  renderHeroVisual,
  initHeroVisual,
} from "../components/hero/HeroVisual.js";
import {
  renderHeroScrollCue,
  initHeroScrollCue,
} from "../components/hero/HeroScrollCue.js";

export function renderHero(s) {
  const isStudio =
    s.layout === "voice-studio" ||
    s.layout === "studio" ||
    s.mediaComponent === "studio";
  const isImageFrame =
    s.layout === "image-frame" ||
    s.layout === "image" ||
    s.mediaComponent === "image" ||
    s.mediaComponent === "image-frame";
  const isSplit = s.layout !== "centered";

  const layoutClass = isStudio
    ? "hero-split hero-layout-studio"
    : isImageFrame
      ? "hero-split hero-layout-image-frame"
      : isSplit
        ? "hero-split"
        : "hero-centered";

  return `
  <wl-hero class="hero ${layoutClass}" id="hero">
    <div class="container hero-inner">
      <!-- Khối bên Trái: Nội dung (Tiêu đề, Chữ xoay, Mô tả, Nút bấm) -->
      ${renderHeroContent(s)}

      <!-- Khối bên Phải: Trực quan (Quả cầu 3D Three.js hoặc Voice Studio Console) -->
      ${renderHeroVisual(s)}
    </div>

    ${renderHeroScrollCue({ target: "#demo", label: "Cuộn để khám phá" })}
  </wl-hero>`;
}

export function initHeroInteractions(s) {
  // 1. Tương tác Khối bên Trái (Chữ xoay luân phiên)
  initHeroContent(s);

  // 2. Tương tác Khối bên Phải (Quả cầu 3D hoặc Voice Studio Console)
  initHeroVisual(s);

  // 3. Nút cuộn khám phá
  initHeroScrollCue({ target: "#demo" });
}

// ============================================================================
// Web Component <wl-hero> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlHero extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderHero(this._config);
      initHeroInteractions(this._config);
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderHero(config);
    initHeroInteractions(config);
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-hero")) {
  customElements.define("wl-hero", WlHero);
}
