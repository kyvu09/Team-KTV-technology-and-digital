// ============================================================================
// HeaderLogo.js — Component Logo nhận diện thương hiệu trên Header
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render logo nhận diện thương hiệu dạng typography chữ gradient
 * @param {Object} brand - Cấu hình thương hiệu { name, slogan }
 * @returns {string} HTML markup
 */
export function renderHeaderLogo(brand = {}) {
  const brandName = brand.name || "Brand";
  return `<span class="logo-text">${esc(brandName)}</span>`;
}
