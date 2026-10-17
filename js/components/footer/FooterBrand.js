// ============================================================================
// FooterBrand.js — Cột nhận diện thương hiệu chân trang tinh gọn
// Loại bỏ watermark khổng lồ và mạng xã hội ngoài lề theo yêu cầu thiết kế mới
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render khối thương hiệu chân trang gọn gàng, tinh tế
 * @param {Object} props
 * @param {Object} [props.brand={}] - Thông tin thương hiệu
 * @param {string} [props.tagline=""] - Slogan chân trang
 * @returns {string} HTML markup
 */
export function renderFooterBrand({ brand = {}, tagline = "" } = {}) {
  const brandName = brand.name || "ViVoice";
  const slogan = tagline || brand.slogan || "Công nghệ giọng nói AI thế hệ mới dành riêng cho tiếng Việt.";

  return `
    <div class="footer-brand-col">
      <a class="footer-logo" href="#hero" aria-label="Về đầu trang ${esc(brandName)}">
        <span class="logo-text">${esc(brandName)}</span>
      </a>
      <p class="footer-tagline">${esc(slogan)}</p>
    </div>`.trim();
}

