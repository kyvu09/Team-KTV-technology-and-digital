// ============================================================================
// Faq.js — Section Câu hỏi thường gặp với Thẻ lật 3D (3D Flip Cards Grid)
// Hỗ trợ bố cục 4 cột nằm ngang, hiệu ứng lật mặt transform: rotateY/X 3D có chiều sâu
// 100% White Label nạp từ file JSON cấu hình
// ============================================================================

import { esc } from "../core/esc.js";
import { initFaqAccordion } from "../components/FaqAccordion.js";

export function renderFaq(s) {
  const is3DFlip = s.layout === "3d-flip-cards" || s.layout !== "accordion";

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
    const flipAxis = (cfg.flipAxis || "Y").toUpperCase() === "X" ? "X" : "Y";

    const cardsMarkup = (s.items || [])
      .map((item, idx) => {
        const badge = item.badge || `0${idx + 1}`;
        const icon = item.icon || "fa-solid fa-circle-question";
        const category = item.category || "Hỏi đáp";
        const question = item.question || "";
        const answer = item.answer || "";

        return `
      <div class="faq-card-3d" data-faq-index="${idx}" data-flip-axis="${flipAxis}" tabindex="0" role="button" aria-expanded="false" aria-label="${esc(question)}">
        <div class="faq-card-inner">
          <!-- MẶT TRƯỚC: CÂU HỎI -->
          <div class="faq-card-face faq-card-front">
            <div class="faq-card-glow" aria-hidden="true"></div>
            <div class="faq-face-header">
              <span class="faq-badge">${esc(badge)}</span>
              <span class="faq-category">${esc(category)}</span>
              <div class="faq-icon-circle"><i class="${esc(icon)}"></i></div>
            </div>

            <div class="faq-face-content">
              <h3 class="faq-q-title">${esc(question)}</h3>
            </div>
          </div>

          <!-- MẶT SAU: LỜI GIẢI ĐÁP -->
          <div class="faq-card-face faq-card-back">
            <div class="faq-face-header">
              <span class="faq-badge faq-badge--answer"><i class="fa-solid fa-check"></i> Giải đáp</span>
              <span class="faq-category">${esc(category)}</span>
            </div>

            <div class="faq-face-content faq-answer-scroll">
              <p class="faq-a-text">${esc(answer)}</p>
            </div>
          </div>
        </div>
      </div>`;
      })
      .join("");

    return `
    <section class="section faq-section faq-section--3d" id="faq"
      style="--faq-perspective:${perspective}px;--faq-duration:${duration}ms;--faq-gap:${gap}px;--faq-min-height:${minHeight}px;--faq-front-bg:${frontBg};--faq-back-bg:${backBg};">
      <div class="container">
        <div class="section-header text-center">
          ${s.eyebrow ? `<p class="eyebrow reveal"><i class="fa-solid fa-circle-question"></i> ${esc(s.eyebrow)}</p>` : ""}
          <h2 class="section-title reveal">${esc(s.title || "Câu hỏi thường gặp về ViVoice")}</h2>
          ${s.subtitle ? `<p class="section-sub mx-auto reveal">${esc(s.subtitle)}</p>` : ""}
        </div>

        <div class="faq-flip-grid" id="faq-flip-grid">
          ${cardsMarkup}
        </div>
      </div>
    </section>`;
  }

  // ==========================================================================
  // CHẾ ĐỘ 2: FALLBACK ACCORDION DANH SÁCH
  // ==========================================================================
  return `
  <section class="section faq-section" id="faq">
    <div class="container">
      <div class="section-header text-center">
        ${s.eyebrow ? `<p class="eyebrow reveal"><i class="fa-solid fa-circle-question"></i> ${esc(s.eyebrow)}</p>` : ""}
        <h2 class="section-title reveal">${esc(s.title || "Câu hỏi thường gặp")}</h2>
        ${s.subtitle ? `<p class="section-sub mx-auto reveal">${esc(s.subtitle)}</p>` : ""}
      </div>

      <div class="faq-list reveal">
        ${(s.items || [])
          .map(
            (item, idx) => `
          <div class="faq-item ${idx === 0 ? "active" : ""}">
            <button class="faq-question" type="button" aria-expanded="${idx === 0 ? "true" : "false"}">
              <span class="q-text">${esc(item.question)}</span>
              <span class="faq-icon-wrap" aria-hidden="true">
                <i class="fa-solid fa-plus"></i>
              </span>
            </button>
            <div class="faq-answer" ${idx === 0 ? 'style="max-height: 200px;"' : ""}>
              <div class="faq-answer-inner">
                <p>${esc(item.answer)}</p>
              </div>
            </div>
          </div>`,
          )
          .join("")}
      </div>
    </div>
  </section>`;
}

export function initFaqInteractions(sectionData = {}) {
  const flipCards = document.querySelectorAll(".faq-card-3d");

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

  // 1. Gắn sự kiện click & phím bấm lật mặt
  cards.forEach((card) => {
    const toggleFlip = (e) => {
      // Tránh duplicate sự kiện khi click vào nút lật lại
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

  // 2. Kích hoạt hiệu ứng xuất hiện lật mặt 3D khi cuộn đến section
  if (isReducedMotion) {
    cards.forEach((card) => card.classList.add("is-revealed"));
    return;
  }

  const { gsap, ScrollTrigger } = window;
  if (gsap && ScrollTrigger) {
    const flipAxis =
      (cfg.flipAxis || "Y").toUpperCase() === "X" ? "rotationX" : "rotationY";
    const fromY = cfg.enterFrom === "top" || true ? -110 : 45; // Xuất hiện từ trên xuống theo yêu cầu
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
    // Fallback IntersectionObserver
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
