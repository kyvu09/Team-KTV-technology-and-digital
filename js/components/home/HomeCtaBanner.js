// ============================================================================
// HomeCtaBanner.js — Component Banner Kêu gọi Hành động Tinh gọn cho Trang chủ
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render khối Banner kêu gọi hành động cho Homepage
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @returns {string} HTML markup
 */
export function renderHomeCtaBanner(props = {}) {
  const title =
    props.title || "Sẵn sàng cách mạng hóa giọng nói kỹ thuật số cùng chúng tôi?";
  const subtitle =
    props.subtitle ||
    "Hơn 10,000+ nhà sáng tạo nội dung, doanh nghiệp và nhà phát triển đã lựa chọn giải pháp giọng nói AI thế hệ mới.";

  return `
    <section class="section home-cta-banner-section" id="home-cta-banner">
      <div class="container">
        <div class="home-cta-box reveal">
          <div class="cta-glow-bg" aria-hidden="true"></div>
          <h2 class="home-cta-title">${esc(title)}</h2>
          <p class="home-cta-desc">${esc(subtitle)}</p>
          <div class="home-cta-buttons">
            <a href="#demo" class="btn btn-primary btn-lg btn-magnetic" data-page-link="demo">
              <span>Trải nghiệm phòng thu AI</span>
            </a>
          </div>
        </div>
      </div>
    </section>`.trim();
}
