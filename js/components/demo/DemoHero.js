// ============================================================================
// DemoHero.js — Khối Hero Hoàn Chỉnh cho Trang Trải nghiệm (Demo Page Hero)
// Hợp nhất:
// - Component 1: DemoHeroBackground (Dải sách chạy 2 luồng liên tục)
// - Component 2: DemoHeroContent (Tiêu đề ngắn gọn & nút bắt đầu trải nghiệm)
// ============================================================================

import { renderDemoHeroBackground } from "./DemoHeroBackground.js";
import { renderDemoHeroContent } from "./DemoHeroContent.js";

/**
 * Render toàn bộ Hero Section cho Trang Trải Nghiệm
 * @param {Object} props
 * @returns {string} HTML markup
 */
export function renderDemoHero(props = {}) {
  const bgHtml = renderDemoHeroBackground();
  const contentHtml = renderDemoHeroContent(props);

  return `
    <section class="section demo-hero-section" id="demo-hero" aria-label="Giới thiệu trang Trải nghiệm">
      ${bgHtml}
      <div class="container demo-hero-container">
        ${contentHtml}
      </div>
    </section>`.trim();
}

/**
 * Khởi tạo tương tác cuộn mượt xuống bàn điều khiển Studio cho nút CTA
 */
export function initDemoHero() {
  const scrollBtn = document.getElementById("demo-start-action-btn");
  if (scrollBtn) {
    scrollBtn.addEventListener("click", (e) => {
      e.preventDefault();
      const target = document.getElementById("demo");
      if (target) {
        if (window.__lenis) {
          window.__lenis.scrollTo(target, { offset: -60, duration: 1.0 });
        } else {
          target.scrollIntoView({ behavior: "smooth" });
        }
      }
    });
  }
}
