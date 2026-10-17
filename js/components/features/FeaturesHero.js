// ============================================================================
// FeaturesHero.js — Section Hero chuyên biệt cho Trang Tính năng (Features Page)
// Thiết kế cao cấp: Badge phát sáng, Tiêu đề Gradient, Thẻ số liệu & Nút điều hướng nhanh
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render Section 1: Hero của Trang Tính Năng
 * @param {Object} config - Cấu hình thương hiệu
 * @returns {string} HTML markup
 */
export function renderFeaturesHero(config = {}) {
  const brandName = config.brand?.name || "AI Voice";

  return `
    <section class="section features-hero-section" id="features-hero">
      <div class="features-hero-glow" aria-hidden="true"></div>
      <div class="container features-hero-container">
        <!-- Khối tiêu đề chính -->
        <div class="features-hero-content text-center reveal">
          <div class="features-hero-badge">
            <i class="fa-solid fa-microchip"></i>
            <span>ĐỘT PHÁ CÔNG NGHỆ TẠO SINH ÂM THANH</span>
          </div>

          <h1 class="features-hero-title">
            Khám Phá Chiều Sâu <span class="gradient-text">Kiến Trúc Giọng Nói AI</span>
          </h1>

          <p class="features-hero-subtitle">
            Hệ thống tạo sinh giọng nói nhân tạo thế hệ mới của ${esc(brandName)}, kết hợp mạng nơ-ron sâu với khả năng tái hiện ngữ điệu tiếng Việt tinh tế và điều khiển tốc độ tức thời.
          </p>

          <!-- Nút điều hướng nhanh đến 2 tính năng chính -->
          <div class="features-hero-nav-actions">
            <a href="#features-voices" class="btn btn-primary btn-magnetic features-quick-link" data-scroll-to="#features-voices">
              <span>1. Khám Phá Đa Giọng Đọc</span>
            </a>
            <a href="#features-speed" class="btn btn-outline btn-magnetic features-quick-link" data-scroll-to="#features-speed">
              <span>2. Thử Nghiệm Tốc Độ Đọc</span>
            </a>
          </div>
        </div>

        <!-- Khối 3 thẻ chỉ số công nghệ nổi bật -->
        <div class="features-hero-metrics reveal">
          <div class="metric-glass-card">
            <div class="metric-icon">
              <i class="fa-solid fa-microphone-lines"></i>
            </div>
            <div class="metric-info">
              <span class="metric-value">20+</span>
              <span class="metric-label">Giọng đọc ba miền Bắc – Trung – Nam</span>
            </div>
          </div>

          <div class="metric-glass-card">
            <div class="metric-icon">
              <i class="fa-solid fa-sliders"></i>
            </div>
            <div class="metric-info">
              <span class="metric-value">0.5x – 2.0x</span>
              <span class="metric-label">Tùy biến tốc độ không méo tiếng</span>
            </div>
          </div>

          <div class="metric-glass-card">
            <div class="metric-icon">
              <i class="fa-solid fa-bolt"></i>
            </div>
            <div class="metric-info">
              <span class="metric-value">&lt; 80ms</span>
              <span class="metric-label">Độ trễ phản hồi Neural Stream tức thì</span>
            </div>
          </div>
        </div>
      </div>
    </section>`.trim();
}

/**
 * Khởi tạo tương tác cuộn nhanh tại Hero của FeaturesPage
 */
export function initFeaturesHero() {
  const quickLinks = document.querySelectorAll(".features-quick-link");
  quickLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetSelector = link.getAttribute("data-scroll-to");
      if (!targetSelector) return;
      const targetEl = document.querySelector(targetSelector);
      if (targetEl) {
        if (window.__lenis) {
          window.__lenis.scrollTo(targetEl, { offset: -80 });
        } else {
          targetEl.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      }
    });
  });
}
