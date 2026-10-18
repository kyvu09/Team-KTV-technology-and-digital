import { renderSectionHeader } from "../components/common/SectionHeader.js";
import { renderFaqFlipCards } from "../components/faq/FaqFlipCards.js";
import {
  renderFaqAccordion,
  initFaqAccordion,
} from "../components/faq/FaqAccordion.js";
import { navigateTo, ROUTES } from "../core/router.js";

export function renderFaq(s) {
  const is3DFlip = s.layout === "3d-flip-cards" || s.layout !== "accordion";

  const headerHtml = renderSectionHeader({
    eyebrow: s.eyebrow,
    eyebrowIcon: "fa-solid fa-circle-question",
    title: s.title || "Câu hỏi thường gặp",
    subtitle: s.subtitle,
    centered: true,
  });

  const ctaButtonHtml = `
    <div class="faq-cta-row text-center reveal">
      <a href="#contact" class="btn btn-primary btn-magnetic faq-contact-btn" data-page-link="contact" id="faq-contact-btn">
        <span>Có thắc mắc khác cần giải đáp</span>
      </a>
    </div>`;

  // ==========================================================================
  // CHẾ ĐỘ 1: THẺ LẬT 3D (4 CỘT NẰM NGANG, LẬT 2 MẶT CÂU HỎI & TRẢ LỜI)
  // ==========================================================================
  if (is3DFlip) {
    const cfg = s.config3D || {};
    const perspective = Number(cfg.perspective) || 1200;
    const duration = Number(cfg.durationMs) || 750;
    const gap = Number(cfg.gap) || 24;
    const minHeight = Number(cfg.cardMinHeight) || 390;
    const frontBg = cfg.frontBg || "rgba(15, 23, 42, 0.78)";
    const backBg = cfg.backBg || "rgba(23, 21, 60, 0.95)";

    const cardsHtml = renderFaqFlipCards({
      items: s.items || [],
      config3D: cfg,
    });

    return `
    <wl-faq class="section faq-section faq-section--3d" id="faq"
      style="--faq-perspective:${perspective}px;--faq-duration:${duration}ms;--faq-gap:${gap}px;--faq-min-height:${minHeight}px;--faq-front-bg:${frontBg};--faq-back-bg:${backBg};">
      <div class="container">
        ${headerHtml}
        ${cardsHtml}
        ${ctaButtonHtml}
      </div>
    </wl-faq>`;
  }

  // ==========================================================================
  // CHẾ ĐỘ 2: FALLBACK ACCORDION DANH SÁCH
  // ==========================================================================
  const accordionHtml = renderFaqAccordion({ items: s.items || [] });

  return `
  <wl-faq class="section faq-section" id="faq">
    <div class="container">
      ${headerHtml}
      ${accordionHtml}
      ${ctaButtonHtml}
    </div>
  </wl-faq>`;
}

export function initFaqInteractions(sectionData = {}) {
  const flipCards = document.querySelectorAll(".faq-card-3d");

  // Xử lý nút chuyển sang trang Liên hệ
  const contactBtn = document.getElementById("faq-contact-btn");
  if (contactBtn) {
    contactBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(ROUTES.CONTACT);
    });
  }

  // Nếu giao diện dùng thẻ lật 3D
  if (flipCards.length > 0) {
    init3DFlipCards(flipCards, sectionData);
  } else {
    // Fallback sang accordion nếu dùng giao diện cũ
    initFaqAccordion();
  }
}

/**
 * Điều khiển lật thẻ 3D và hiệu ứng cuộn xuất hiện lật mặt Stagger
 */
function init3DFlipCards(cards, sectionData = {}) {
  const isReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  const cfg = sectionData.config3D || {};
  const staggerDelay = (Number(cfg.staggerMs) || 150) / 1000;

  cards.forEach((card) => {
    const toggleFlip = (e) => {
      if (e.target.closest(".faq-flip-back-btn")) {
        e.stopPropagation();
        card.classList.remove("is-flipped");
        card.setAttribute("aria-expanded", "false");
        return;
      }
      const isFlipped = card.classList.toggle("is-flipped");
      card.setAttribute("aria-expanded", isFlipped ? "true" : "false");
    };

    card.addEventListener("click", toggleFlip);

    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFlip(e);
      }
    });

    const backBtn = card.querySelector(".faq-flip-back-btn");
    if (backBtn) {
      backBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        card.classList.remove("is-flipped");
        card.setAttribute("aria-expanded", "false");
      });
    }
  });

  if (isReducedMotion) {
    cards.forEach((card) => card.classList.add("is-revealed"));
    return;
  }

  const { gsap, ScrollTrigger } = window;
  if (gsap && ScrollTrigger) {
    const flipAxis =
      (cfg.flipAxis || "Y").toUpperCase() === "X" ? "rotationX" : "rotationY";
    const fromY = cfg.enterFrom === "top" || true ? -110 : 45;
    const animProps = {
      opacity: 0,
      scale: 0.88,
      y: fromY,
    };
    animProps[flipAxis] = -85;

    const toProps = {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 1.05,
      stagger: staggerDelay,
      ease: "back.out(1.3)",
      scrollTrigger: {
        trigger: "#faq-flip-grid",
        start: "top 82%",
        toggleActions: "play none none reverse",
      },
      onComplete: () => {
        cards.forEach((c) => c.classList.add("is-revealed"));
      },
    };
    toProps[flipAxis] = 0;

    gsap.fromTo(cards, animProps, toProps);
  } else {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            cards.forEach((c, idx) => {
              setTimeout(() => {
                c.classList.add("is-revealed");
              }, idx * 150);
            });
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 },
    );
    const grid = document.getElementById("faq-flip-grid");
    if (grid) io.observe(grid);
  }
}

// ============================================================================
// Web Component <wl-faq> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlFaq extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderFaq(this._config);
      initFaqInteractions(this._config);
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderFaq(config);
    initFaqInteractions(config);
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-faq")) {
  customElements.define("wl-faq", WlFaq);
}
