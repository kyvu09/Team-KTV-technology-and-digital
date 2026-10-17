// ============================================================================
// HomeFeatureTeaser.js — Component Tóm tắt Tính năng Tinh gọn cho Trang chủ
// Hiển thị 3 tính năng cốt lõi kèm nút chuyển sang Trang Tính năng chi tiết
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render khối tóm tắt tính năng tinh gọn cho Homepage
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @param {Array<Object>} [props.items=[]]
 * @returns {string} HTML markup
 */
export function renderHomeFeatureTeaser({ title = "", subtitle = "", items = [] } = {}) {
  // Lấy tối đa 3 tính năng tiêu biểu nhất để trang chủ không bị rườm rà
  const previewItems = (items && items.length > 0)
    ? items.slice(0, 3)
    : [
        {
          icon: "fa-solid fa-microphone-lines",
          title: "Giọng nói Neural Siêu thực",
          text: "Ngữ điệu tự nhiên, luyến láy truyền cảm chuẩn xác theo ngữ cảnh tiếng Việt.",
        },
        {
          icon: "fa-solid fa-bolt",
          title: "Độ trễ thời gian thực <80ms",
          text: "Tạo sinh âm thanh tức thì, sẵn sàng tích hợp ứng dụng, game và tổng đài.",
        },
        {
          icon: "fa-solid fa-sliders",
          title: "Tùy biến cao độ & sắc thái",
          text: "Điều chỉnh linh hoạt tốc độ, cao độ và cảm xúc theo từng kịch bản phát sóng.",
        },
      ];

  const cardsHtml = previewItems
    .map(
      (item, idx) => `
    <div class="home-teaser-card reveal" style="--delay: ${idx * 0.1}s">
      <div class="teaser-card-icon">
        <i class="${esc(item.icon || "fa-solid fa-sparkles")}"></i>
      </div>
      <h3 class="teaser-card-title">${esc(item.title)}</h3>
      <p class="teaser-card-desc">${esc(item.text || item.description || "")}</p>
      <a href="#features" class="teaser-card-link" data-page-link="features">
        <span>Xem chi tiết</span>
      </a>
    </div>`,
    )
    .join("");

  const sectionTitle = title || "Công nghệ tạo sinh âm thanh thế hệ mới";
  const sectionSubtitle = subtitle || "Khám phá những điểm mạnh cốt lõi giúp giọng nói AI đạt độ truyền cảm như người thật.";

  return `
    <section class="section home-teaser-section" id="home-features-teaser">
      <div class="container">
        <div class="home-teaser-header reveal text-center">
          <h2 class="section-title">${esc(sectionTitle)}</h2>
          ${sectionSubtitle ? `<p class="section-subtitle">${esc(sectionSubtitle)}</p>` : ""}
        </div>

        <div class="home-teaser-grid">
          ${cardsHtml}
        </div>

        <div class="home-teaser-cta text-center reveal">
          <a href="#features" class="btn btn-outline btn-magnetic" data-page-link="features">
            <span>Xem tất cả tính năng chuyên sâu</span>
          </a>
        </div>
      </div>
    </section>`.trim();
}
