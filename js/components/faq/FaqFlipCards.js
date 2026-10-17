// ============================================================================
// FaqFlipCards.js — Khối Bố cục FAQ Thẻ Lật 3D (3D Flip Cards Block)
// Hợp nhất: Lưới 3D Flip Grid và toàn bộ Thẻ lật 2 mặt (Mặt trước: Câu hỏi, Mặt sau: Trả lời)
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render một thẻ lật 3D
 */
function renderFlipCard(item, idx = 0, flipAxis = "Y") {
  const badge = item.badge || `0${idx + 1}`;
  const icon = item.icon || "fa-solid fa-circle-question";
  const category = item.category || "Hỏi đáp";
  const question = item.question || "";
  const answer = item.answer || "";

  return `
    <wl-card class="faq-card-3d" data-faq-index="${idx}" data-flip-axis="${flipAxis}" tabindex="0" role="button" aria-expanded="false" aria-label="${esc(question)}">
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
    </wl-card>`.trim();
}

/**
 * Render toàn bộ lưới thẻ lật 3D FAQ
 * @param {Object} props
 * @param {Array<Object>} [props.items=[]]
 * @param {Object} [props.config3D={}]
 * @returns {string} HTML markup
 */
export function renderFaqFlipCards({ items = [], config3D = {} } = {}) {
  const flipAxis = (config3D.flipAxis || "Y").toUpperCase() === "X" ? "X" : "Y";

  const cardsMarkup = (items || [])
    .map((item, idx) => renderFlipCard(item, idx, flipAxis))
    .join("");

  return `
    <div class="faq-flip-grid" id="faq-flip-grid">
      ${cardsMarkup}
    </div>`.trim();
}

// Giữ alias tương thích ngược
export { renderFlipCard as renderFaqFlipCard };
