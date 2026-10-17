// ============================================================================
// AboutGrid.js — Khối Bố cục Giới thiệu dạng Lưới (Grid & Stats Block)
// Hợp nhất: Hình ảnh minh họa (Media Card), Đoạn văn giới thiệu & Lưới chỉ số thống kê
// ============================================================================

import { esc } from "../../core/esc.js";
import { renderSectionHeader } from "../common/SectionHeader.js";

/**
 * Render khối hình ảnh giới thiệu kèm huy hiệu nổi bật
 */
function renderMediaCard({ image = "", title = "", badge = null } = {}) {
  return `
    <div class="about-media-col reveal">
      <div class="about-image-wrapper">
        ${
          image
            ? `<img src="${esc(image)}" alt="${esc(title)}" class="about-img" loading="lazy" />`
            : ""
        }
        <div class="about-glow" aria-hidden="true"></div>
        ${
          badge
            ? `
        <div class="about-floating-badge">
          <div class="badge-icon"><i class="${esc(badge.icon || "fa-solid fa-star")}"></i></div>
          <div class="badge-text">
            <strong>${esc(badge.value || "")}</strong>
            <span>${esc(badge.label || "")}</span>
          </div>
        </div>`
            : ""
        }
      </div>
    </div>`.trim();
}

/**
 * Render lưới số liệu thống kê tự động tăng
 */
function renderStatsGrid({ stats = [] } = {}) {
  if (!stats || stats.length === 0) return "";

  const statsHtml = stats
    .map((st) => {
      const rawVal = st.value || "";
      const match = rawVal.match(/^([\d.,]+)(.*)$/);
      const numVal = match ? match[1].replace(/,/g, "") : rawVal;
      const suffix = match ? match[2] : "";

      return `
        <div class="stat-card">
          <div class="stat-number" data-counter="${esc(numVal)}" data-suffix="${esc(suffix)}">${esc(rawVal)}</div>
          <div class="stat-label">${esc(st.label)}</div>
        </div>`;
    })
    .join("");

  return `
    <div class="stats-grid reveal">
      ${statsHtml}
    </div>`.trim();
}

/**
 * Render toàn bộ khối About dạng Grid
 * @param {Object} section
 * @returns {string} HTML markup
 */
export function renderAboutGrid(section = {}, sectionId = "about") {
  const mediaCardHtml = renderMediaCard({
    image: section.image || "",
    title: section.title || "",
    badge: section.badge || null,
  });

  const headerHtml = renderSectionHeader({
    eyebrow: section.eyebrow,
    eyebrowIcon: "fa-solid fa-heart",
    title: section.title,
    subtitle: "",
    centered: false,
  });

  const paragraphsHtml = (section.paragraphs || [])
    .map((p) => `<p class="about-p reveal">${esc(p)}</p>`)
    .join("");

  const statsHtml = renderStatsGrid({
    stats: section.stats || [],
  });

  return `
  <wl-about class="section about-section" id="${sectionId}">
    <div class="container about-inner">
      ${mediaCardHtml}

      <div class="about-text-col">
        ${headerHtml}

        <div class="about-paragraphs">
          ${paragraphsHtml}
        </div>

        ${statsHtml}
      </div>
    </div>
  </wl-about>`.trim();
}

// Giữ alias tương thích ngược
export {
  renderMediaCard as renderAboutMediaCard,
  renderStatsGrid as renderAboutStatsGrid,
};
