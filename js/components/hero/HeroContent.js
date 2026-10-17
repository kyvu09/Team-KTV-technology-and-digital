// ============================================================================
// HeroContent.js — Khối Nội dung bên Trái của Hero (Left Block)
// Hợp nhất: Badge, Tiêu đề h1, Từ khóa xoay luân phiên, Đoạn mô tả Lead & Nút CTA
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render toàn bộ khối nội dung bên trái của Hero
 * @param {Object} props
 * @param {string} [props.badge]
 * @param {string} [props.title]
 * @param {Array<string>} [props.rotatingWords=[]]
 * @param {string} [props.subtitle]
 * @param {Array<Object>} [props.buttons=[]]
 * @returns {string} HTML markup
 */
export function renderHeroContent(props = {}) {
  const {
    badge = "",
    title = "",
    rotatingWords = [],
    subtitle = "",
    buttons = [],
  } = props;

  const firstWord =
    rotatingWords && rotatingWords.length > 0 ? rotatingWords[0] : "";

  const buttonsHtml = (buttons || [])
    .map((b) => {
      const isGhost = b.style === "ghost";
      const btnClass = isGhost ? "btn-ghost" : "btn-primary";
      return `
        <a class="btn ${btnClass} btn-magnetic" href="${esc(b.href || "#")}">
          <span>${esc(b.label || "Tìm hiểu thêm")}</span>
        </a>`;
    })
    .join("");

  return `
    <div class="hero-content">
      ${
        badge
          ? `
        <div class="badge-wrapper">
          <span class="badge reveal">
            <i class="fa-solid fa-wand-magic-sparkles"></i> ${esc(badge)}
          </span>
        </div>`
          : ""
      }

      <div class="title-wrapper">
        <h1 class="hero-title reveal">
          ${esc(title)}
          ${
            firstWord
              ? `
            <span class="rotating-text-wrapper">
              <span class="rotating-text" id="hero-rotating-word">${esc(firstWord)}</span>
            </span>`
              : ""
          }
        </h1>
      </div>

      ${subtitle ? `<p class="lead reveal">${esc(subtitle)}</p>` : ""}

      ${
        buttonsHtml
          ? `
        <div class="hero-cta reveal">
          ${buttonsHtml}
        </div>`
          : ""
      }
    </div>`.trim();
}

/**
 * Khởi tạo tương tác khối bên trái (Xoay từ khóa luân phiên)
 * @param {Object} props
 * @param {Array<string>} [props.rotatingWords=[]]
 * @param {number} [interval=2800]
 */
let rotatingInterval = null;

export function initHeroContent(props = {}, interval = 2800) {
  if (rotatingInterval) {
    clearInterval(rotatingInterval);
    rotatingInterval = null;
  }

  const rotatingWords = props.rotatingWords || [];
  if (!rotatingWords || rotatingWords.length <= 1) return;

  const wordEl = document.getElementById("hero-rotating-word");
  if (!wordEl) return;

  let idx = 0;
  rotatingInterval = setInterval(() => {
    wordEl.style.opacity = "0";
    wordEl.style.transform = "translateY(15px)";
    setTimeout(() => {
      idx = (idx + 1) % rotatingWords.length;
      wordEl.textContent = rotatingWords[idx];
      wordEl.style.opacity = "1";
      wordEl.style.transform = "translateY(0)";
    }, 300);
  }, interval);
}
