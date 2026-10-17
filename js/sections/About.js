import { renderAbout3DStory } from "../components/about/About3DStory.js";
import { renderAboutGrid } from "../components/about/AboutGrid.js";

export function renderAbout(section, sectionId = "about") {
  const story = section.scrollStory || {};
  let slides = Array.isArray(story.slides) ? story.slides : [];
  if (slides.length === 0 && Array.isArray(section.story)) {
    slides = section.story;
  }
  const isStoryEnabled =
    (story.enabled !== false || Array.isArray(section.story)) &&
    slides.length > 0;

  return isStoryEnabled
    ? renderAbout3DStory(section, sectionId)
    : renderAboutGrid(section, sectionId);
}

/**
 * Khởi tạo hiệu ứng cuộn mượt cho Scroll Story
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
    let lastActiveIndex = -1;
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

      if (activeIndex !== lastActiveIndex) {
        lastActiveIndex = activeIndex;
        slides.forEach((slide, index) => {
          const active = index === activeIndex;
          slide.classList.toggle("is-active", active);
          slide.setAttribute("aria-hidden", active ? "false" : "true");
        });
        progressItems.forEach((item, index) => {
          item.classList.toggle("is-active", index <= activeIndex);
        });
      }
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
