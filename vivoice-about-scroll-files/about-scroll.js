/**
 * About scroll-story: render dữ liệu JSON thành section cuộn ảnh + chữ.
 * Dùng HTML/CSS/JS thuần. Gọi renderAbout(section) trong renderer hiện tại.
 */
const escapeHTML = (value = "") =>
  String(value).replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));

const safeAsset = (path = "") => {
  // Chấp nhận đường dẫn tương đối trong config; không cho javascript: URL.
  const value = String(path).trim();
  return /^(javascript:|data:text\/html)/i.test(value) ? "" : value;
};

function renderAbout(section) {
  const story = section.scrollStory || {};
  const slides = Array.isArray(story.slides) ? story.slides : [];
  const paragraphs = (section.paragraphs || [])
    .map((text) => `<p>${escapeHTML(text)}</p>`).join("");

  if (!story.enabled || slides.length === 0) {
    return `
      <section id="about" class="about-story about-story--static">
        <div class="about-story__intro">
          <div><span class="about-story__eyebrow">${escapeHTML(section.eyebrow || "")}</span>
          <h2>${escapeHTML(section.title || "")}</h2></div>
          <div class="about-story__copy">${paragraphs}</div>
        </div>
      </section>`;
  }

  const animation = story.animation || {};
  const imageScaleFrom = Number(animation.imageScaleFrom) || 1.08;
  const imageScaleTo = Number(animation.imageScaleTo) || 1;
  const revealDistance = Number(animation.revealDistance) || 28;
  const duration = Math.max(100, Number(animation.transitionMs) || 650);

  const slideMarkup = slides.map((slide, index) => {
    const metric = slide.metric || {};
    const image = safeAsset(slide.image);
    return `
      <article class="about-story__slide${index === 0 ? " is-active" : ""}"
        data-story-slide="${index}" aria-hidden="${index === 0 ? "false" : "true"}">
        ${image ? `<img class="about-story__image" src="${escapeHTML(image)}" alt="${escapeHTML(slide.title || "")}" loading="${index === 0 ? "eager" : "lazy"}">` : ""}
        <div class="about-story__shade"></div>
        <div class="about-story__content">
          <span class="about-story__slide-eyebrow">${escapeHTML(slide.eyebrow || "")}</span>
          <h3>${escapeHTML(slide.title || "")}</h3>
          <p class="about-story__description">${escapeHTML(slide.description || "")}</p>
          ${metric.value || metric.label ? `
            <div class="about-story__metric">
              <span class="about-story__metric-value">${escapeHTML(metric.value || "")}</span>
              <span class="about-story__metric-label">${escapeHTML(metric.label || "")}</span>
            </div>` : ""}
        </div>
      </article>`;
  }).join("");

  const progress = slides.map((_, index) => `
    <div class="about-story__progress-item${index === 0 ? " is-active" : ""}" data-story-progress="${index}">
      <span></span>
    </div>`).join("");

  return `
    <section id="about" class="about-story"
      style="--image-scale-from:${imageScaleFrom};--image-scale-to:${imageScaleTo};--reveal-distance:${revealDistance}px;--story-duration:${duration}ms">
      <div class="about-story__intro">
        <div>
          <span class="about-story__eyebrow">${escapeHTML(section.eyebrow || "")}</span>
          <h2>${escapeHTML(section.title || "")}</h2>
        </div>
        <div class="about-story__copy">${paragraphs}</div>
      </div>
      <div class="about-story__track" data-about-story>
        <div class="about-story__step" aria-hidden="true"></div>
        <div class="about-story__stage">
          <div class="about-story__slides">${slideMarkup}</div>
          <div class="about-story__progress" aria-hidden="true">${progress}</div>
        </div>
        ${slides.slice(1).map(() => '<div class="about-story__step" aria-hidden="true"></div>').join("")}
      </div>
      <div class="about-story__end" aria-hidden="true"></div>
    </section>`;
}

/**
 * Gọi sau khi chèn HTML vào DOM. Hiệu ứng đổi slide dựa trên vị trí cuộn
 * trong track; mỗi bước cuộn tương ứng một ảnh/nội dung.
 */
function initAboutScroll(root = document) {
  const tracks = root.querySelectorAll("[data-about-story]");
  tracks.forEach((track) => {
    if (track.dataset.storyInitialized === "true") return;
    track.dataset.storyInitialized = "true";

    const section = track.closest(".about-story");
    const stage = track.querySelector(".about-story__stage");
    const slides = [...track.querySelectorAll("[data-story-slide]")];
    const progressItems = [...track.querySelectorAll("[data-story-progress]")];
    const steps = [...track.querySelectorAll(".about-story__step")];
    if (!section || !stage || slides.length < 1) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = track.getBoundingClientRect();
      const trackTop = rect.top + window.scrollY;
      const firstStepHeight = steps[0] ? steps[0].offsetHeight : 0;
      const stageStart = trackTop + firstStepHeight;
      const stageEnd = trackTop + track.offsetHeight - stage.offsetHeight;
      const scrollableDistance = Math.max(1, stageEnd - stageStart);
      const progressed = Math.min(0.999999, Math.max(0, (window.scrollY - stageStart) / scrollableDistance));
      const activeIndex = Math.min(slides.length - 1, Math.floor(progressed * slides.length));

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

// Dùng với script type="module":
// import { renderAbout, initAboutScroll } from "./about-scroll.js";
// document.querySelector("#sections").insertAdjacentHTML("beforeend", renderAbout(aboutConfig));
// initAboutScroll(document);
export { renderAbout, initAboutScroll };
