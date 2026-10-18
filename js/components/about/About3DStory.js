// ============================================================================
// About3DStory.js — Khối Bố cục Câu chuyện Thương hiệu Cuộn 3D (Scroll Story Block)
// Hợp nhất: Các Slide câu chuyện, Sân khấu Sticky Stage & Thanh tiến trình cuộn trang
// ============================================================================

import { esc } from "../../core/esc.js";

const safeAsset = (path = "") => {
  const value = String(path).trim();
  return /^(javascript:|data:text\/html)/i.test(value) ? "" : value;
};

/**
 * Render một slide kể chuyện cuộn trang
 */
function renderSlide(slide, index = 0) {
  const metric = slide.metric || {};
  const image = safeAsset(slide.image);

  return `
    <article class="about-story__slide"
      data-story-slide="${index}" aria-hidden="true">
      ${
        image
          ? `<img class="about-story__image" src="${esc(image)}" alt="${esc(slide.title || "")}" loading="eager" decoding="async">`
          : ""
      }
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
    </article>`.trim();
}

/**
 * Render thanh đo tiến trình cuộn tương ứng số slide
 */
function renderProgress(slides = []) {
  return slides
    .map(
      (_, index) => `
    <div class="about-story__progress-item" data-story-progress="${index}" role="button" tabindex="0" aria-label="Slide ${index + 1}">
      <span></span>
    </div>`,
    )
    .join("");
}

/**
 * Render toàn bộ khối 3D Sticky Scroll Story
 * @param {Object} section
 * @returns {string} HTML markup
 */
export function renderAbout3DStory(section = {}, sectionId = "about") {
  const story = section.scrollStory || {};
  let slides = Array.isArray(story.slides) ? story.slides : [];
  if (slides.length === 0 && Array.isArray(section.story)) {
    slides = section.story;
  }

  const animation = story.animation || section.animation || {};
  const imageScaleFrom = Number(animation.imageScaleFrom) || 1.08;
  const imageScaleTo = Number(animation.imageScaleTo) || 1;
  const revealDistance = Number(animation.revealDistance) || 28;
  const duration = Math.max(100, Number(animation.transitionMs) || 650);

  // Nạp sẵn toàn bộ ảnh vào bộ nhớ đệm trình duyệt ngay lập tức
  if (typeof Image !== "undefined") {
    slides.forEach((s) => {
      const src = safeAsset(s.image);
      if (src) {
        const preloadImg = new Image();
        preloadImg.src = src;
      }
    });
  }

  const slideMarkup = slides
    .map((slide, index) => renderSlide(slide, index))
    .join("");

  const progressMarkup = renderProgress(slides);

  return `
    <wl-about id="${sectionId}" class="about-story"
      style="--image-scale-from:${imageScaleFrom};--image-scale-to:${imageScaleTo};--reveal-distance:${revealDistance}px;--story-duration:${duration}ms">
      <div class="about-story__track" data-about-story>
        <div class="about-story__stage">
          <div class="about-story__slides">${slideMarkup}</div>
          <div class="about-story__progress" aria-hidden="true">${progressMarkup}</div>
        </div>
        ${slides.map(() => '<div class="about-story__step" aria-hidden="true"></div>').join("")}
      </div>
      <div class="about-story__end" aria-hidden="true"></div>
    </wl-about>`.trim();
}

// Giữ alias tương thích ngược
export {
  renderSlide as renderAboutStorySlide,
  renderProgress as renderAboutStoryProgress,
};
