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
    // Dọn dẹp ScrollTrigger cũ nếu đã tồn tại
    if (track._storyScrollTrigger) {
      try {
        track._storyScrollTrigger.kill();
      } catch (e) { }
      track._storyScrollTrigger = null;
    }

    const section = track.closest(".about-story");
    const stage = track.querySelector(".about-story__stage");
    const slides = [...track.querySelectorAll("[data-story-slide]")];
    const progressItems = [...track.querySelectorAll("[data-story-progress]")];
    if (!section || !stage || slides.length < 1) return;

    const numSlides = slides.length;
    // Mỗi slide được cấp 85vh hành trình cuộn để người dùng xem trọn vẹn từng slide
    const scrollPerSlide = Math.max(500, window.innerHeight * 0.85);
    const totalPinDistance = Math.round(scrollPerSlide * (numSlides - 0.1));

    let currentActiveIdx = -1;

    const updateSlidesAndProgress = (progress) => {
      const clampedProgress = Math.min(0.999999, Math.max(0, progress));
      const activeIndex = Math.min(
        numSlides - 1,
        Math.floor(clampedProgress * numSlides),
      );

      // Kích hoạt slide tương ứng
      if (activeIndex !== currentActiveIdx) {
        currentActiveIdx = activeIndex;
        slides.forEach((slide, idx) => {
          const isActive = idx === activeIndex;
          slide.classList.toggle("is-active", isActive);
          slide.setAttribute("aria-hidden", isActive ? "false" : "true");
        });
      }

      // Cập nhật   iên tục theo nhịp cuộn
      const slot = 1 / numSlides;
      progressItems.forEach((item, idx) => {
        const span = item.querySelector("span");
        if (idx < activeIndex) {
          item.classList.add("is-active");
          if (span) span.style.width = "100%";
        } else if (idx === activeIndex) {
          item.classList.add("is-active");
          const slideProgress = Math.min(
            1,
            Math.max(0, (clampedProgress - idx * slot) / slot),
          );
          if (span) span.style.width = `${(slideProgress * 100).toFixed(1)}%`;
        } else {
          item.classList.remove("is-active");
          if (span) span.style.width = "0%";
        }
      });
    };

    // Đặt trạng thái ban đầu: Slide 0 kích hoạt sẵn sàng
    updateSlidesAndProgress(0);

    // DÙNG GSAP SCROLLTRIGGER ĐỂ DỪNG MÀN HÌNH (PIN) CHO TỚI KHI LƯỚT HẾT CÁC MỤC
    if (window.gsap && window.ScrollTrigger) {
      const { gsap, ScrollTrigger } = window;
      gsap.registerPlugin(ScrollTrigger);

      const st = ScrollTrigger.create({
        trigger: track,
        start: "top top",
        end: `+=${totalPinDistance}`,
        pin: stage,
        pinSpacing: true,
        anticipatePin: 1,
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          updateSlidesAndProgress(self.progress);
        },
        onLeave: () => {
          updateSlidesAndProgress(1);
        },
        onLeaveBack: () => {
          updateSlidesAndProgress(0);
        },
      });

      track._storyScrollTrigger = st;

      // Cho phép bấm trực tiếp vào từng vạch để nhảy đến slide tương ứng
      progressItems.forEach((item, idx) => {
        item.setAttribute("role", "button");
        item.setAttribute("tabindex", "0");
        item.setAttribute("aria-label", `Chuyển tới slide ${idx + 1}`);

        const handleJump = (e) => {
          e.preventDefault();
          e.stopPropagation();
          const targetFraction = (idx + 0.05) / numSlides;
          const targetScroll = st.start + targetFraction * totalPinDistance;
          if (window.__lenis) {
            window.__lenis.scrollTo(targetScroll, { duration: 0.8 });
          } else {
            window.scrollTo({ top: targetScroll, behavior: "smooth" });
          }
        };

        item.addEventListener("click", handleJump);
        item.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") handleJump(e);
        });
      });

      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    } else {
      // Fallback nếu GSAP không có: lắng nghe cuộn tự nhiên
      let ticking = false;
      const onScrollFallback = () => {
        ticking = false;
        const rect = track.getBoundingClientRect();
        const scrollY = window.scrollY || window.pageYOffset;
        const trackTop = rect.top + scrollY;
        const rawProgress = (scrollY - trackTop) / totalPinDistance;
        updateSlidesAndProgress(rawProgress);
      };
      window.addEventListener("scroll", () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(onScrollFallback);
        }
      }, { passive: true });
    }
  });
}

// ============================================================================
// Web Component <wl-about> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlAbout extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class { }) {
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
