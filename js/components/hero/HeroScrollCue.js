// ============================================================================
// HeroScrollCue.js — Nút chỉ dẫn cuộn trang với hiệu ứng sóng âm (Scroll Cue)
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render nút chỉ dẫn cuộn xuống khám phá
 * @param {Object} props
 * @param {string} [props.target="#demo"] - Phần tử mục tiêu khi click cuộn
 * @param {string} [props.label="Cuộn để khám phá"] - Dòng chữ hướng dẫn
 * @returns {string} HTML markup
 */
export function renderHeroScrollCue({ target = "#demo", label = "Cuộn để khám phá" } = {}) {
  return `
    <a href="${esc(target)}" class="hero-scroll-cue" id="hero-scroll-cue" aria-label="${esc(label)}">
      <span class="scroll-cue-text">${esc(label)}</span>
      <span class="scroll-mouse-icon">
        <span class="scroll-mouse-wheel"></span>
      </span>
      <span class="scroll-sound-waves" aria-hidden="true">
        <i></i><i></i><i></i>
      </span>
    </a>`.trim();
}

/**
 * Khởi tạo sự kiện cuộn mượt khi click nút chỉ dẫn
 * @param {Object} props
 * @param {string} [props.target="#demo"]
 */
export function initHeroScrollCue({ target = "#demo" } = {}) {
  const scrollCue = document.getElementById("hero-scroll-cue");
  if (!scrollCue) return;

  scrollCue.addEventListener("click", (e) => {
    e.preventDefault();
    const targetEl =
      document.querySelector(target) ||
      document.querySelector("#demo") ||
      document.querySelector(".section:nth-of-type(2)");

    if (targetEl) {
      if (window.__lenis) {
        window.__lenis.scrollTo(targetEl, { offset: -80 });
      } else {
        targetEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  });
}
