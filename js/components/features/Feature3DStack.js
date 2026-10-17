// ============================================================================
// Feature3DStack.js — Khối Bố cục Tính năng Thẻ 3D Xếp chồng (3D Stack Block)
// Hợp nhất: Danh sách wrapper, từng Thẻ con 3D, hiệu ứng bung mở click & Spotlight
// ============================================================================

import { esc } from "../../core/esc.js";
import { initBentoSpotlight } from "../BentoGrid.js";

/**
 * Render thẻ tính năng xếp chồng 3D
 * @param {Object} item
 * @param {number} i
 * @returns {string} HTML markup
 */
function renderStackCard(item, i = 0) {
  const hasWaveform = Boolean(item.waveform);
  const iconHtml = item.iconHtml
    ? item.iconHtml
    : item.icon && item.icon.startsWith("fa-")
      ? `<i class="${esc(item.icon)}"></i>`
      : `<span class="emoji-icon">${esc(item.icon || "✦")}</span>`;

  return `
    <wl-card class="feature-stack-item" style="--i: ${i};" data-index="${i}">
      <div class="feature-stack-media">
        ${
          item.image
            ? `<img src="${esc(item.image)}" alt="${esc(item.title)}" class="feature-stack-img" loading="lazy" />`
            : ""
        }
        <div class="feature-stack-icon-badge">
          ${iconHtml}
        </div>
      </div>

      <div class="feature-stack-content">
        <div class="feature-stack-header">
          <h3 class="feature-stack-title">${esc(item.title)}</h3>
          ${item.badge ? `<span class="feature-stack-badge">${esc(item.badge)}</span>` : ""}
        </div>
        <p class="feature-stack-desc">${esc(item.text)}</p>
      </div>

      ${
        hasWaveform
          ? `
      <div class="feature-stack-waveform" aria-hidden="true">
        <span></span><span></span><span></span><span></span><span></span>
      </div>`
          : `
      <div class="feature-stack-arrow" aria-hidden="true">
        <i class="fa-solid fa-chevron-right"></i>
      </div>`
      }
    </wl-card>`.trim();
}

/**
 * Render toàn bộ danh sách thẻ 3D xếp chồng
 * @param {Object} props
 * @param {Array<Object>} [props.items=[]]
 * @returns {string} HTML markup
 */
export function renderFeature3DStack({ items = [] } = {}) {
  const cardsMarkup = (items || [])
    .map((item, i) => renderStackCard(item, i))
    .join("");

  return `
    <div class="feature-stack-wrapper reveal">
      <div class="feature-stack-3d" id="feature-stack-3d" role="region" aria-label="Danh sách tính năng 3D">
        ${cardsMarkup}
      </div>
    </div>`.trim();
}

/**
 * Khởi tạo hiệu ứng bung mở thẻ 3D khi click & Spotlight
 */
export function initFeature3DStack() {
  const stack = document.getElementById("feature-stack-3d");
  if (stack) {
    requestAnimationFrame(() => {
      setTimeout(() => {
        stack.classList.add("is-ready");
      }, 100);
    });

    stack.addEventListener("click", () => {
      if (window.innerWidth > 768) {
        stack.classList.toggle("is-unfolded");
      }
    });
  }

  initBentoSpotlight(".feature-stack-item");
}

// Giữ alias tương thích ngược
export {
  renderFeature3DStack as renderFeatureStackList,
  initFeature3DStack as initFeatureStackList,
  renderStackCard as renderFeatureStackCard,
};
