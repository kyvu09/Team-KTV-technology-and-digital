import { esc } from "../core/esc.js";

const safeAsset = (path = "") => {
  const value = String(path).trim();
  return /^(javascript:|data:text\/html)/i.test(value) ? "" : value;
};

export function renderAbout(section) {
  const story = section.scrollStory || {};
  let slides = Array.isArray(story.slides) ? story.slides : [];
  // Hỗ trợ tương thích linh hoạt: Nếu AI sinh ra section.story thì tự động dùng làm slides
  if (slides.length === 0 && Array.isArray(section.story)) {
    slides = section.story;
  }
  const isStoryEnabled =
    (story.enabled !== false || Array.isArray(section.story)) &&
    slides.length > 0;

  // ==========================================================================
  // CHẾ ĐỘ 1: SCROLL STORY TƯƠNG TÁC THEO BƯỚC CUỘN (3D STICKY SCROLL STORY)
  // ==========================================================================
  if (isStoryEnabled) {
    const animation = story.animation || section.animation || {};
    const imageScaleFrom = Number(animation.imageScaleFrom) || 1.08;
    const imageScaleTo = Number(animation.imageScaleTo) || 1;
    const revealDistance = Number(animation.revealDistance) || 28;
    const duration = Math.max(100, Number(animation.transitionMs) || 650);

    const slideMarkup = slides
      .map((slide, index) => {
        const metric = slide.metric || {};
        const image = safeAsset(slide.image);
        return `
        <article class="about-story__slide${index === 0 ? " is-active" : ""}"
          data-story-slide="${index}" aria-hidden="${index === 0 ? "false" : "true"}">
          ${image ? `<img class="about-story__image" src="${esc(image)}" alt="${esc(slide.title || "")}" loading="${index === 0 ? "eager" : "lazy"}">` : ""}
          <div class="about-story__shade"></div>
          <div class="about-story__content">
            <span class="about-story__slide-eyebrow">${esc(slide.eyebrow || "")}</span>
            <h3>${esc(slide.title || "")}</h3>
            <p class="about-story__description">${esc(slide.description || "")}</p>
            ${
              metric.value || metric.label
                ? `
              <div class="about-story__metric">
                <span class="about-story__metric-value">${esc(metric.value || "")}</span>
                <span class="about-story__metric-label">${esc(metric.label || "")}</span>
              </div>`
                : ""
            }
          </div>
        </article>`;
      })
      .join("");

    const progress = slides
      .map(
        (_, index) => `
      <div class="about-story__progress-item${index === 0 ? " is-active" : ""}" data-story-progress="${index}">
        <span></span>
      </div>`,
      )
      .join("");

    return `
      <section id="about" class="about-story"
        style="--image-scale-from:${imageScaleFrom};--image-scale-to:${imageScaleTo};--reveal-distance:${revealDistance}px;--story-duration:${duration}ms">
        <div class="about-story__track" data-about-story>
          <div class="about-story__stage">
            <div class="about-story__slides">${slideMarkup}</div>
            <div class="about-story__progress" aria-hidden="true">${progress}</div>
          </div>
          ${slides.map(() => '<div class="about-story__step" aria-hidden="true"></div>').join("")}
        </div>
        <div class="about-story__end" aria-hidden="true"></div>
      </section>`;
  }

  // ==========================================================================
  // CHẾ ĐỘ 2: FALLBACK TĨNH (GRID VỚI HÌNH ẢNH & THỐNG KÊ ĐỘNG - THUẦN WHITE LABEL)
  // ==========================================================================
  const imgSrc = section.image || "";

  return `
  <section class="section about-section" id="about">
    <div class="container about-inner">
      <div class="about-media-col reveal">
        <div class="about-image-wrapper">
          ${imgSrc ? `<img src="${esc(imgSrc)}" alt="${esc(section.title || "")}" class="about-img" loading="lazy" />` : ""}
          <div class="about-glow" aria-hidden="true"></div>
          ${
            section.badge
              ? `
          <div class="about-floating-badge">
            <div class="badge-icon"><i class="${esc(section.badge.icon || "fa-solid fa-star")}"></i></div>
            <div class="badge-text">
              <strong>${esc(section.badge.value || "")}</strong>
              <span>${esc(section.badge.label || "")}</span>
            </div>
          </div>`
              : ""
          }
        </div>
      </div>

      <div class="about-text-col">
        ${section.eyebrow ? `<p class="eyebrow reveal"><i class="fa-solid fa-heart"></i> ${esc(section.eyebrow)}</p>` : ""}
        <h2 class="section-title reveal">${esc(section.title)}</h2>

        <div class="about-paragraphs">
          ${(section.paragraphs || []).map((p) => `<p class="about-p reveal">${esc(p)}</p>`).join("")}
        </div>

        ${
          section.stats && section.stats.length
            ? `
          <div class="stats-grid reveal">
            ${section.stats
              .map((st) => {
                const rawVal = st.value || "";
                const match = rawVal.match(/^([\d.,]+)(.*)$/);
                const numVal = match ? match[1].replace(/,/g, "") : rawVal;
                const suffix = match ? match[2] : "";

                return `
                <div class="stat-card">
                  <div class="stat-number" data-counter="${esc(numVal)}" data-suffix="${esc(suffix)}">${esc(rawVal)}</div>
                  <div class="stat-label">${esc(st.label)}</div>
                </div>`;
              })
              .join("")}
          </div>`
            : ""
        }
      </div>
    </div>
  </section>`;
}

/**
 * Khởi tạo hiệu ứng cuộn mượt cho Scroll Story
 * Tương thích cả khi gọi không đối số, gọi với document, hoặc gọi trong INTERACTION_HANDLERS
 */
export function initAboutScroll(root = document) {
  const domRoot =
    root && typeof root.querySelectorAll === "function" ? root : document;
  const tracks = domRoot.querySelectorAll("[data-about-story]");

  tracks.forEach((track) => {
    if (track.dataset.storyInitialized === "true") return;
    track.dataset.storyInitialized = "true";

    const section = track.closest(".about-story");
    const stage = track.querySelector(".about-story__stage");
    const slides = [...track.querySelectorAll("[data-story-slide]")];
    const progressItems = [...track.querySelectorAll("[data-story-progress]")];
    if (!section || !stage || slides.length < 1) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = track.getBoundingClientRect();
      const trackTop = rect.top + window.scrollY;
      const stageEnd = trackTop + track.offsetHeight - stage.offsetHeight;
      const scrollableDistance = Math.max(1, stageEnd - trackTop);
      const progressed = Math.min(
        0.999999,
        Math.max(0, (window.scrollY - trackTop) / scrollableDistance),
      );
      const activeIndex = Math.min(
        slides.length - 1,
        Math.floor(progressed * slides.length),
      );

      slides.forEach((slide, index) => {
        const active = index === activeIndex;
        slide.classList.toggle("is-active", active);
        slide.setAttribute("aria-hidden", active ? "false" : "true");
      });
      progressItems.forEach((item, index) => {
        item.classList.toggle("is-active", index <= activeIndex);
      });
    };

    const requestUpdate = () => {
      if (!ticking) {
        ticking = true;
        window.requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
    update();
  });
}

// ============================================================================
// Web Component <wl-about> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlAbout extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderAbout(this._config);
      initAboutScroll(this);
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderAbout(config);
    initAboutScroll(this);
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-about")) {
  customElements.define("wl-about", WlAbout);
}
