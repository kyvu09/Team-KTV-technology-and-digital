// ============================================================================
// FeatureBentoGrid.js — Khối Bố cục Tính năng Lưới Bento Grid (Bento Block)
// Hợp nhất: Lưới Bento Grid, từng Thẻ Bento con và hiệu ứng Spotlight rọi sáng
// ============================================================================

import { esc } from "../../core/esc.js";
import { initBentoSpotlight } from "../BentoGrid.js";

import "../Card.js";

/**
 * Render một thẻ Bento trong lưới sử dụng Web Component <wl-card>
 * @param {Object} item
 * @param {number} i
 * @returns {string} HTML markup
 */
function renderBentoCard(item, i = 0) {
  const isLarge = i === 0 || i === 3;
  const hasImage = Boolean(item.image);
  const hasWaveform = Boolean(item.waveform);
  const iconHtml = item.iconHtml
    ? item.iconHtml
    : item.icon && item.icon.startsWith("fa-")
      ? `<i class="${esc(item.icon)}"></i>`
      : `<span class="emoji-icon">${esc(item.icon || "✦")}</span>`;

  return `
    <wl-card class="feature-card bento-card ${isLarge ? "bento-span-2" : ""} ${hasImage ? "has-image" : ""} reveal" title="${esc(item.title)}" desc="${esc(item.text)}">
      <div class="card-glow" aria-hidden="true"></div>
      ${
        item.image
          ? `
        <div class="card-visual-preview">
          <img src="${esc(item.image)}" alt="${esc(item.title)}" class="card-visual-img" loading="lazy" />
          <div class="card-visual-overlay"></div>
        </div>`
          : ""
      }
      <div class="card-header-icon">
        <div class="feature-icon">
          ${iconHtml}
        </div>
        ${item.badge ? `<span class="card-pill">${esc(item.badge)}</span>` : ""}
      </div>
      <div class="card-body">
        <h3>${esc(item.title)}</h3>
        <p>${esc(item.text)}</p>
      </div>
      ${
        hasWaveform
          ? `
        <div class="card-interactive-preview" aria-hidden="true">
          <div class="mini-waveform">
            <span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
        </div>`
          : ""
      }
    </wl-card>`.trim();
}

/**
 * Render toàn bộ lưới thẻ Bento
 * @param {Object} props
 * @param {Array<Object>} [props.items=[]]
 * @returns {string} HTML markup
 */
export function renderFeatureBentoGrid({ items = [] } = {}) {
  const cardsMarkup = (items || [])
    .map((item, i) => renderBentoCard(item, i))
    .join("");

  return `
    <div class="features-grid bento-grid">
      ${cardsMarkup}
    </div>`.trim();
}

/**
 * Khởi tạo hiệu ứng Spotlight rọi sáng thẻ Bento theo chuột
 */
export function initFeatureBentoGrid() {
  initBentoSpotlight(".bento-card");
}

// Giữ alias tương thích ngược
export { renderBentoCard as renderFeatureBentoCard };
