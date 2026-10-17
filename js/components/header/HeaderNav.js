// ============================================================================
// HeaderNav.js — Thanh menu điều hướng với viên thuốc trượt (Pill Indicator)
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render menu điều hướng Header
 * @param {Array<Object>} [nav=[]] - Danh sách đường link { href, label }
 * @returns {string} HTML markup
 */
export function renderHeaderNav(nav = []) {
  const linksHtml = (nav || [])
    .map((item) => {
      const pageKey = (item.href || "").replace(/^#\/?/, "");
      return `<a class="nav-link" href="${esc(item.href)}" data-page-link="${esc(pageKey)}">${esc(item.label)}</a>`;
    })
    .join("");

  return `
    <nav class="nav-menu" id="header-nav">
      <div class="nav-indicator" id="nav-indicator"></div>
      ${linksHtml}
    </nav>`.trim();
}

/**
 * Khởi tạo hiệu ứng "viên thuốc" trượt theo con trỏ chuột khi hover menu
 */
export function initHeaderNav() {
  const nav = document.getElementById("header-nav");
  const indicator = document.getElementById("nav-indicator");

  if (!nav || !indicator) return;

  const links = nav.querySelectorAll(".nav-link");

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => {
      indicator.style.width = link.offsetWidth + "px";
      indicator.style.left = link.offsetLeft + "px";
      indicator.style.opacity = "1";
    });
  });

  nav.addEventListener("mouseleave", () => {
    indicator.style.opacity = "0";
  });
}
