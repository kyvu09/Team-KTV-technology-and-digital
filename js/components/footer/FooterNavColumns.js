// ============================================================================
// FooterNavColumns.js — Liên kết điều hướng tinh gọn chân trang (Footer Quick Nav)
// Chỉ giữ lại 4 liên kết chức năng cốt lõi có tác dụng điều hướng thực tế:
// 1. [Trải nghiệm Studio] -> #demo
// 2. [Tính năng công nghệ] -> #features
// 3. [Câu hỏi thường gặp]  -> #faq
// 4. [Liên hệ hỗ trợ]      -> #contact
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Danh sách 4 liên kết hữu dụng mặc định của chân trang
 */
export const DEFAULT_FOOTER_NAV_LINKS = [
  {
    href: "#demo",
    label: "Trải nghiệm Studio",
    icon: "fa-solid fa-wand-magic-sparkles",
  },
  {
    href: "#features",
    label: "Tính năng công nghệ",
    icon: "fa-solid fa-layer-group",
  },
  {
    href: "#faq",
    label: "Câu hỏi thường gặp",
    icon: "fa-solid fa-circle-question",
  },
  {
    href: "#contact",
    label: "Liên hệ hỗ trợ",
    icon: "fa-solid fa-headset",
  },
];

/**
 * Render khối 4 liên kết điều hướng chân trang dạng pill grid hiện đại
 * @param {Array<Object>} [linksOrColumns] - Danh sách liên kết hoặc cấu hình footer
 * @returns {string} HTML markup
 */
export function renderFooterNav(linksOrColumns) {
  let navItems = DEFAULT_FOOTER_NAV_LINKS;

  // Nếu truyền vào mảng các link hợp lệ (đủ 4 liên kết hoặc đã lọc)
  if (Array.isArray(linksOrColumns) && linksOrColumns.length > 0) {
    // Trường hợp truyền mảng cột cũ: lấy ra các link hợp lệ
    if (linksOrColumns[0] && linksOrColumns[0].links) {
      const flattened = [];
      linksOrColumns.forEach((col) => {
        if (Array.isArray(col.links)) {
          col.links.forEach((l) => {
            if (l.href && l.href !== "#") flattened.push(l);
          });
        }
      });
      if (flattened.length >= 4) {
        navItems = flattened.slice(0, 4);
      }
    } else if (linksOrColumns.length === 4) {
      navItems = linksOrColumns;
    }
  }

  const linksHtml = navItems
    .map(
      (item) => `
      <a href="${esc(item.href)}" class="footer-nav-link" data-route-link="${esc((item.href || "").replace(/^#\/?/, ""))}">
        <span class="footer-nav-text">${esc(item.label)}</span>
      </a>`,
    )
    .join("");

  return `
    <nav class="footer-nav-wrap" aria-label="Điều hướng nhanh chân trang">
      <div class="footer-nav-grid">
        ${linksHtml}
      </div>
    </nav>`.trim();
}

// Giữ lại alias export tương thích ngược hoàn toàn
export const renderFooterNavColumns = renderFooterNav;
