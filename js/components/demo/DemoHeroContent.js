// ============================================================================
// DemoHeroContent.js — Component 2: Tiêu đề & Nội dung ngắn gọn phần Trải nghiệm
// Gồm: Tiêu đề ngắn gọn, mô tả súc tích và nút Bắt đầu trải nghiệm ngay (không có icon)
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render khối nội dung tiêu đề của trang Trải nghiệm
 * @param {Object} props
 * @param {string} [props.title]
 * @param {string} [props.subtitle]
 * @returns {string} HTML markup
 */
export function renderDemoHeroContent(props = {}) {
  const title = props.title || "Trải Nghiệm Phòng Thu AI";
  const subtitle =
    props.subtitle ||
    "Chuyển đổi văn bản thành giọng nói tự nhiên với mạng nơ-ron tạo sinh chất lượng phòng thu.";

  return `
    <div class="demo-hero-content-wrapper text-center reveal">
      <h1 class="demo-hero-main-title">
        ${esc(title)}
      </h1>
      <p class="demo-hero-main-desc">
        ${esc(subtitle)}
      </p>
      <div class="demo-hero-action-row">
        <a href="#demo" class="btn btn-primary btn-magnetic demo-start-action-btn" id="demo-start-action-btn" data-scroll-to="#demo">
          <span>Bắt đầu trải nghiệm ngay</span>
        </a>
      </div>
    </div>`.trim();
}
