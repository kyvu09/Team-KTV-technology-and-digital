// ============================================================================
// AuthPage.js — Trang Xác thực (Đăng nhập & Đăng ký Chuyên biệt)
// Chuẩn SPA Router, tích hợp hiệu ứng đèn bàn tương tác & Glassmorphism
// ============================================================================

import { renderAuth, initAuth } from "../auth.js";

/**
 * Render Trang Xác thực (Đăng nhập / Đăng ký)
 * @param {Object} config - Cấu hình White-Label đầy đủ
 * @returns {string} HTML markup
 */
export function renderAuthPage(config) {
  return `
    <div class="page-wrapper page-auth" id="page-auth">
      ${renderAuth(config)}
    </div>
  `.trim();
}

/**
 * Khởi tạo toàn bộ tương tác trên trang Auth
 * @param {Object} config
 */
export function initAuthPage(config) {
  try {
    initAuth(config);
  } catch (e) {
    console.error("Lỗi khi khởi tạo tương tác Auth:", e);
  }
}
