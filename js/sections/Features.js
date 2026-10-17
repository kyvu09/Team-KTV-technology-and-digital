import { esc } from "../core/esc.js";
import { initBentoSpotlight } from "../components/BentoGrid.js";

export function renderFeatures(s) {
  // Nếu layout được yêu cầu cụ thể là bento
  if (s.layout === "bento") {
    return renderBentoFeatures(s);
  }

  // Mặc định hoặc khi layout === "3d-stack": Hiệu ứng 3D Stack Cards
  const cardsMarkup = (s.items || [])
    .map((item, i) => {
      const hasWaveform = Boolean(item.waveform);
      const iconHtml = item.iconHtml
        ? item.iconHtml
        : item.icon && item.icon.startsWith("fa-")
          ? `<i class="${esc(item.icon)}"></i>`
          : `<span class="emoji-icon">${esc(item.icon || "✦")}</span>`;

      return `
      <li class="feature-stack-item" style="--i: ${i};" data-index="${i}">
        <div class="feature-stack-media">
          ${item.image ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" class="feature-stack-img" loading="lazy" />` : ""}
          <div class="feature-stack-icon-badge">
            ${iconHtml}
          </div>
        </div>

        <div class="feature-stack-content">
          <div class="feature-stack-header">
            <h3 class="feature-stack-title">${esc(item.title)}</h3>
            ${item.badge ? `<span class="feature-stack-badge">${esc(item.badge)}</span>` : ""}
          </div>
          <p class="feature-stack-desc">${esc(item.text)}</p>
        </div>

        ${hasWaveform ? `
        <div class="feature-stack-waveform" aria-hidden="true">
          <span></span><span></span><span></span><span></span><span></span>
        </div>` : `
        <div class="feature-stack-arrow" aria-hidden="true">
          <i class="fa-solid fa-chevron-right"></i>
        </div>`}
      </li>`;
    })
    .join("");

  return `
  <section class="section features-section features-section--stack" id="features">
    <div class="container">
      <div class="section-header text-center">
        ${s.eyebrow ? `<p class="eyebrow reveal"><i class="fa-solid fa-sparkles"></i> ${esc(s.eyebrow)}</p>` : ""}
        <h2 class="section-title reveal">${esc(s.title)}</h2>
        ${s.subtitle ? `<p class="section-sub mx-auto reveal">${esc(s.subtitle)}</p>` : ""}
      </div>

      <div class="feature-stack-wrapper reveal">
        <ul class="feature-stack-3d" id="feature-stack-3d" aria-label="Danh sách tính năng 3D">
          ${cardsMarkup}
        </ul>
      </div>
    </div>
  </section>`;
}

function renderBentoFeatures(s) {
  return `
  <section class="section features-section" id="features">
    <div class="container">
      <div class="section-header text-center">
        ${s.eyebrow ? `<p class="eyebrow reveal"><i class="fa-solid fa-sparkles"></i> ${esc(s.eyebrow)}</p>` : ""}
        <h2 class="section-title reveal">${esc(s.title)}</h2>
        ${s.subtitle ? `<p class="section-sub mx-auto reveal">${esc(s.subtitle)}</p>` : ""}
      </div>

      <div class="features-grid bento-grid">
        ${(s.items || [])
      .map((item, i) => {
        const isLarge = i === 0 || i === 3;
        const hasImage = Boolean(item.image);
        const hasWaveform = Boolean(item.waveform);
        return `
            <article class="feature-card bento-card ${isLarge ? "bento-span-2" : ""} ${hasImage ? "has-image" : ""} reveal">
              <div class="card-glow" aria-hidden="true"></div>
              ${item.image ? `
                <div class="card-visual-preview">
                  <img src="${esc(item.image)}" alt="${esc(item.title)}" class="card-visual-img" loading="lazy" />
                  <div class="card-visual-overlay"></div>
                </div>` : ""}
              <div class="card-header-icon">
                <div class="feature-icon">
                  ${item.iconHtml ? item.iconHtml : (item.icon && item.icon.startsWith("fa-") ? `<i class="${esc(item.icon)}"></i>` : `<span class="emoji-icon">${esc(item.icon || "✦")}</span>`)}
                </div>
                ${item.badge ? `<span class="card-pill">${esc(item.badge)}</span>` : ""}
              </div>
              <div class="card-body">
                <h3>${esc(item.title)}</h3>
                <p>${esc(item.text)}</p>
              </div>
              ${hasWaveform ? `
                <div class="card-interactive-preview" aria-hidden="true">
                  <div class="mini-waveform">
                    <span></span><span></span><span></span><span></span><span></span><span></span>
                  </div>
                </div>` : ""}
            </article>`;
      })
      .join("")}
      </div>
    </div>
  </section>`;
}

export function initFeaturesInteractions() {
  const stack = document.getElementById("feature-stack-3d");
  if (stack) {
    // Kích hoạt class is-ready sau nhịp render đầu để không bị nhảy giật animation khi vừa nạp trang
    requestAnimationFrame(() => {
      setTimeout(() => {
        stack.classList.add("is-ready");
      }, 100);
    });

    stack.addEventListener("click", () => {
      // Chỉ kích hoạt bung mở 3D trên màn hình Desktop (> 768px)
      if (window.innerWidth > 768) {
        stack.classList.toggle("is-unfolded");
      }
    });
  }
  initBentoSpotlight(".feature-stack-item, .bento-card");
}

// ============================================================================
// Web Component <wl-features> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlFeatures extends (typeof HTMLElement !== "undefined" ? HTMLElement : class { }) {
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

if (typeof customElements !== "undefined" && !customElements.get("wl-features")) {
  customElements.define("wl-features", WlFeatures);
}
