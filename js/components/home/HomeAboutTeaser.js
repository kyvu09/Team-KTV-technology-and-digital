// ============================================================================
// HomeAboutTeaser.js — Component Tóm tắt Câu chuyện Thương hiệu cho Trang chủ
// Hiển thị sứ mệnh ngắn gọn và 3 chỉ số ấn tượng, dẫn sang trang Về chúng tôi
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render khối About Teaser trên Homepage
 * @param {Object} props
 * @param {Object} [props.about]
 * @returns {string} HTML markup
 */
export function renderHomeAboutTeaser(props = {}) {
  const about = props.about || {};
  const stats = about.stats || [
    { value: "99.8%", label: "Độ chính xác ngữ điệu" },
    { value: "<80ms", label: "Độ trễ thời gian thực" },
    { value: "20+", label: "Giọng đọc chuyên biệt" },
  ];

  const statsHtml = stats
    .slice(0, 3)
    .map(
      (s) => `
    <div class="teaser-stat-item">
      <span class="teaser-stat-value">${esc(s.value || s.number || "")}</span>
      <span class="teaser-stat-label">${esc(s.label || "")}</span>
    </div>`,
    )
    .join("");

  return `
    <section class="section home-about-teaser-section" id="home-about-teaser">
      <div class="container">
        <div class="home-about-grid">
          <div class="home-about-info reveal">
            <h2 class="section-title">
              ${esc(about.title || "Kiến tạo tương lai kết nối thông qua âm thanh AI")}
            </h2>
            <p class="section-subtitle" style="text-align: left; margin: 0 0 24px 0;">
              ${esc(about.subtitle || "Chúng tôi phát triển công nghệ giọng nói nhân tạo đỉnh cao, giúp thu hẹp khoảng cách giữa con người và máy tính, mang đến trải nghiệm giao tiếp tự nhiên và cảm xúc nhất.")}
            </p>
            <div class="home-about-actions">
              <a href="#about" class="btn btn-primary btn-magnetic" data-page-link="about">
                <span>Đọc toàn bộ câu chuyện</span>
              </a>
            </div>
          </div>

          <div class="home-about-stats-card reveal">
            <div class="stats-card-inner">
              <h3 class="stats-card-heading">
                <i class="fa-solid fa-chart-line"></i> Con số ấn tượng
              </h3>
              <div class="teaser-stats-row">
                ${statsHtml}
              </div>
              <div class="stats-card-quote">
                <i class="fa-solid fa-quote-left"></i>
                <span>"Giọng nói AI không chỉ là công nghệ phát âm, mà là nghệ thuật truyền tải linh hồn của ngôn từ."</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`.trim();
}
