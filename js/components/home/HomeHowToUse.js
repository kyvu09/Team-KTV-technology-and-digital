// ============================================================================
// HomeHowToUse.js — Component Giới Thiệu Quy Trình Sử Dụng Sản Phẩm Đơn Giản
// Thiết kế chuẩn White-Label: Dùng chung cho mọi thương hiệu, 100% nhận qua Props
// - Giới thiệu 3 bước sử dụng trực quan, làm nổi bật sự tiện lợi và đơn giản
// - Nút CTA điều hướng chuyển sang trang Trải Nghiệm (#demo)
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Danh sách 3 bước mẫu chuẩn mực (tự động thích ứng nếu JSON không ghi đè)
 */
export const DEFAULT_HOW_TO_USE_STEPS = [
  {
    step: "01",
    phase: "BƯỚC 01",
    title: "Nhập Kịch Bản Hoặc Văn Bản",
    subtitle: "Dữ Liệu Đầu Vào",
    icon: "fa-solid fa-keyboard",
    description:
      "Dán bất kỳ đoạn kịch bản, bài viết hay tài liệu nội dung số. Hệ thống tự động phân tách dấu câu, số liệu ngày tháng và ngữ cảnh chuẩn xác.",
    tag: "Tự động phân tích",
    snippetType: "editor",
    snippetText: "Chào mừng bạn đến với kỷ nguyên tạo sinh giọng nói AI thế hệ mới...",
  },
  {
    step: "02",
    phase: "BƯỚC 02",
    title: "Chọn Giọng Đọc & Tinh Chỉnh",
    subtitle: "Sắc Thái Biểu Cảm",
    icon: "fa-solid fa-sliders",
    description:
      "Lựa chọn âm sắc vùng miền, giọng nhân vật hoặc tổng đài yêu thích. Điều chỉnh tốc độ từ 0.5x đến 2.0x tự nhiên chỉ với một thao tác kéo thả.",
    tag: "Đa dạng lựa chọn",
    snippetType: "voice",
    snippetVoiceA: "Giọng Nữ Bản Xứ",
    snippetVoiceB: "Giọng Nam Truyền Cảm",
  },
  {
    step: "03",
    phase: "BƯỚC 03",
    title: "Nghe Thử & Xuất Bản Tức Thì",
    subtitle: "Kết Xuất Tốc Độ Cao",
    icon: "fa-solid fa-circle-check",
    description:
      "Chỉ mất dưới 80 mili-giây để xuất bản thu âm phòng thu 48kHz sắc nét. Nghe trực tiếp, tải file MP3/WAV hoặc tích hợp vào hệ thống ngay lập tức.",
    tag: "Độ trễ < 80ms",
    snippetType: "player",
    snippetMeta: "48kHz • Studio Master Quality",
  },
];

/**
 * Render thẻ xem trước mô phỏng thao tác nhỏ gọn (Interactive Mockup Snippet)
 * @param {Object} step
 * @returns {string} HTML markup
 */
function renderStepSnippet(step = {}) {
  const type = step.snippetType || "editor";

  if (type === "voice") {
    return `
      <div class="step-snippet-box step-snippet-voice" aria-hidden="true">
        <div class="step-snippet-row">
          <span class="step-chip-pill active">
            <i class="fa-solid fa-check"></i> ${esc(step.snippetVoiceA || "Giọng Bản Xứ")}
          </span>
          <span class="step-chip-pill">
            <i class="fa-solid fa-microphone"></i> ${esc(step.snippetVoiceB || "Giọng Truyền Cảm")}
          </span>
        </div>
        <div class="step-speed-bar">
          <span class="step-speed-txt">Tốc độ: 1.0x</span>
          <div class="step-speed-line"><span class="step-speed-thumb"></span></div>
        </div>
      </div>`.trim();
  }

  if (type === "player") {
    return `
      <div class="step-snippet-box step-snippet-player" aria-hidden="true">
        <div class="step-player-row">
          <div class="step-play-dot"><i class="fa-solid fa-play"></i></div>
          <div class="step-wave-bars">
            <span></span><span></span><span></span><span></span><span></span><span></span><span></span>
          </div>
          <span class="step-meta-badge">${esc(step.snippetMeta || "48kHz • Studio")}</span>
        </div>
      </div>`.trim();
  }

  // Mặc định là editor
  return `
    <div class="step-snippet-box step-snippet-editor" aria-hidden="true">
      <div class="step-editor-dots">
        <span class="dot dot--red"></span>
        <span class="dot dot--yellow"></span>
        <span class="dot dot--green"></span>
        <span class="step-filename">kich_ban_mau.txt</span>
      </div>
      <div class="step-editor-text">
        "${esc(step.snippetText || "Nhập hoặc dán bất kỳ văn bản nào để trải nghiệm...")}"
      </div>
    </div>`.trim();
}

/**
 * Render toàn bộ component Giới thiệu quy trình sử dụng siêu đơn giản
 * @param {Object} props
 * @returns {string} HTML markup
 */
export function renderHomeHowToUse(props = {}) {
  const brandName = props.brandName || "";
  const eyebrow = props.eyebrow || props.badge || "";
  const title =
    props.howToUseTitle ||
    (props.type === "how-to-use" ? props.title : null) ||
    "Sử Dụng Dễ Dàng Chỉ Với 3 Bước";
  const subtitle =
    props.howToUseSubtitle ||
    (props.type === "how-to-use" ? props.subtitle : null) ||
    `Không cần thiết bị phòng thu đắt đỏ hay kỹ thuật âm thanh phức tạp. Khám phá cách ${brandName ? brandName + " " : ""}tạo ra giọng nói AI sống động chỉ trong vài giây.`;
  const buttonText =
    props.buttonText ||
    props.actionText ||
    props.ctaText ||
    "Trải Nghiệm Ngay Miễn Phí";
  const buttonHref = props.buttonHref || "#demo";
  const hintText = props.hintText || "";

  const rawSteps =
    Array.isArray(props.steps) && props.steps.length > 0
      ? props.steps
      : Array.isArray(props.howToUseSteps) && props.howToUseSteps.length > 0
        ? props.howToUseSteps
        : DEFAULT_HOW_TO_USE_STEPS;

  const stepsHtml = rawSteps
    .map(
      (step, idx) => `
      <div class="how-to-use-card reveal" style="--step-delay: ${(idx * 0.12).toFixed(2)}s">
        <div class="how-to-use-card-glow" aria-hidden="true"></div>
        
        <div class="how-to-use-card-top">
          <div class="step-badge-wrapper">
            <span class="step-number-pill">${esc(step.step || `0${idx + 1}`)}</span>
            <span class="step-phase-label">${esc(step.phase || `BƯỚC 0${idx + 1}`)}</span>
          </div>
          <div class="step-icon-wrap" aria-hidden="true">
            <i class="${esc(step.icon || "fa-solid fa-wand-magic-sparkles")}"></i>
          </div>
        </div>

        <div class="how-to-use-card-content">
          <h3 class="step-card-title">${esc(step.title)}</h3>
          <p class="step-card-desc">${esc(step.description || step.text || "")}</p>
        </div>

        ${renderStepSnippet(step)}
      </div>`,
    )
    .join("");

  return `
    <section class="section home-how-to-use-section" id="how-to-use" aria-label="Hướng dẫn sử dụng đơn giản">
      <div class="container">
        <!-- Khối tiêu đề căn giữa -->
        <div class="section-header text-center reveal">
          ${
            eyebrow
              ? `
          <div class="how-to-use-badge-pill">
            <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i>
            <span>${esc(eyebrow)}</span>
          </div>`
              : ""
          }
          <h2 class="section-title">${esc(title)}</h2>
          <p class="section-subtitle">${esc(subtitle)}</p>
        </div>

        <!-- Lưới 3 bước sử dụng trực quan -->
        <div class="how-to-use-grid">
          ${stepsHtml}
        </div>

        <!-- Khối nút bấm CTA điều hướng sang trang Trải nghiệm -->
        <div class="how-to-use-cta-block text-center reveal">
          <div class="how-to-use-cta-glow" aria-hidden="true"></div>
          <div class="how-to-use-btn-wrapper">
            <a href="${esc(buttonHref)}" class="btn btn-primary btn-lg btn-magnetic how-to-use-action-btn" data-page-link="demo" id="how-to-use-start-btn">
              <span>${esc(buttonText)}</span>
            </a>
          </div>
          ${
            hintText
              ? `
          <p class="how-to-use-hint">
            <i class="fa-solid fa-bolt" aria-hidden="true"></i>
            <span>${esc(hintText)}</span>
          </p>`
              : ""
          }
        </div>
      </div>
    </section>`.trim();
}

/**
 * Khởi tạo tương tác cho Component How To Use
 */
export function initHomeHowToUse() {
  const btn = document.getElementById("how-to-use-start-btn");
  if (!btn) return;

  // Tương tác nút bấm đã được router.js tự động xử lý mượt mà qua data-page-link="demo"
}
