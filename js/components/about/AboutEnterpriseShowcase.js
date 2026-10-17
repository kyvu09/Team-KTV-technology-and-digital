// ============================================================================
// AboutEnterpriseShowcase.js — Component Giới thiệu Doanh nghiệp Tinh gọn
// Dành riêng cho Trang Về Chúng Tôi (About Page - Section 2)
// Bao gồm:
// 1. Hồ sơ doanh nghiệp & Tầm nhìn cốt lõi (Gọn gàng)
// 2. Quy trình công nghệ chuẩn hóa 4 bước (Ngắn gọn, súc tích)
// 3. Định hướng tương lai: Tải file MP3/WAV, Voice Cloning, Audiobook, Audio 3D
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * 4 Bước quy trình công nghệ tạo sinh giọng nói AI (Rút gọn súc tích)
 */
export const ENTERPRISE_PROCESS_STEPS = [
  {
    step: "01",
    phase: "BƯỚC 01",
    title: "Phân Tích Ngữ Nghĩa",
    subtitle: "NLP Engine",
    icon: "fa-solid fa-spell-check",
    color: "#38bdf8",
    description: "Chuẩn hóa văn bản tiếng Việt có dấu, quy đổi số liệu và phân tách ngữ cảnh biểu cảm tự động.",
  },
  {
    step: "02",
    phase: "BƯỚC 02",
    title: "Tạo Sinh Âm Phổ",
    subtitle: "Neural Mel",
    icon: "fa-solid fa-brain-circuit",
    color: "#a78bfa",
    description: "Mô phỏng trọn vẹn 6 thanh điệu và nhịp thở tự nhiên của người bản xứ ba miền Bắc — Trung — Nam.",
  },
  {
    step: "03",
    phase: "BƯỚC 03",
    title: "Điều Chế Tốc Độ",
    subtitle: "Dynamic Rate",
    icon: "fa-solid fa-sliders",
    color: "#34d399",
    description: "Kiểm soát tốc độ đọc linh hoạt từ 0.5x đến 2.0x, khóa giữ cao độ và loại bỏ méo tiếng.",
  },
  {
    step: "04",
    phase: "BƯỚC 04",
    title: "Kiểm Thử Âm Học",
    subtitle: "Studio QA",
    icon: "fa-solid fa-shield-halved",
    color: "#f59e0b",
    description: "Chuẩn hóa âm lượng phòng thu tiêu chuẩn LUFS, tối ưu chất lượng âm thanh trên mọi thiết bị phát.",
  },
];

/**
 * 4 Tính năng đột phá trong định hướng tương lai (Rút gọn)
 */
export const FUTURE_ROADMAP_FEATURES = [
  {
    icon: "fa-solid fa-bolt",
    badge: "SẮP RA MẮT",
    badgeClass: "badge-highlight",
    title: "Tối Ưu Hóa Biên & Đám Mây",
    description: "Kiến trúc xử lý lai (Hybrid Edge & Cloud) đưa độ trễ xuống mức tối thiểu và tự động mở rộng theo tải hệ thống.",
    tags: ["Hybrid Edge", "Low Latency", "Auto-scaling"],
  },
  {
    icon: "fa-solid fa-fingerprint",
    badge: "LỘ TRÌNH 2026",
    badgeClass: "badge-purple",
    title: "Cá Nhân Hóa Mô Hình AI",
    description: "Tùy biến và huấn luyện riêng biệt mô hình theo nghiệp vụ đặc thù của từng đối tác doanh nghiệp.",
    tags: ["Custom Fine-tuning", "Domain Adaptation", "Bảo mật cao"],
  },
  {
    icon: "fa-solid fa-shield-halved",
    badge: "DOANH NGHIỆP",
    badgeClass: "badge-blue",
    title: "Bảo Mật Cấp Doanh Nghiệp",
    description: "Tiêu chuẩn bảo mật đa tầng, mã hóa đầu cuối và tuân thủ các quy định khắt khe nhất về an toàn dữ liệu.",
    tags: ["Mã hóa E2E", "ISO 27001", "Kiểm toán bảo mật"],
  },
  {
    icon: "fa-solid fa-network-wired",
    badge: "NGHIÊN CỨU",
    badgeClass: "badge-green",
    title: "Hệ Sinh Thái Tích Hợp Toàn Diện",
    description: "Bộ SDK và API mở rộng đa nền tảng, dễ dàng tích hợp vào mọi hệ thống hiện hữu chỉ trong vài giờ làm việc.",
    tags: ["Open API", "Multi-platform SDK", "Webhooks 24/7"],
  },
];

/**
 * Render toàn bộ component Section 2 của Trang Về chúng tôi (Thiết kế đơn giản, ngắn gọn)
 * @param {Object} [sectionData]
 * @returns {string} HTML markup
 */
export function renderAboutEnterpriseShowcase(sectionData = {}) {
  const slides = sectionData.scrollStory?.slides || [];
  const overviewTitle =
    sectionData.overviewTitle ||
    slides[0]?.title ||
    sectionData.title ||
    "Câu Chuyện Khởi Nguồn & Phát Triển";
  const overviewDesc =
    sectionData.overviewDesc ||
    slides[0]?.description ||
    sectionData.subtitle ||
    (sectionData.paragraphs && sectionData.paragraphs[0]) ||
    "Cam kết mang lại chuẩn mực chất lượng hàng đầu và sự hài lòng dài lâu.";
  const overviewImage =
    sectionData.overviewImage ||
    slides[1]?.image ||
    slides[0]?.image ||
    sectionData.image ||
    "";

  const metric1 = slides[0]?.metric || sectionData.stats?.[0] || { value: "100%", label: "Tiêu chuẩn" };
  const metric2 = slides[1]?.metric || sectionData.stats?.[1] || { value: "99.9%", label: "Hài lòng" };
  const metric3 = slides[2]?.metric || sectionData.stats?.[2] || { value: "24/7", label: "Phục vụ tận tâm" };

  const defaultStepIcons = [
    "fa-solid fa-microchip",
    "fa-solid fa-network-wired",
    "fa-solid fa-sliders",
    "fa-solid fa-shield-halved",
  ];
  const defaultStepColors = ["#38bdf8", "#a78bfa", "#34d399", "#f59e0b"];

  const processSteps =
    sectionData.enterpriseProcess ||
    (slides.length > 0
      ? slides.map((slide, idx) => ({
          step: `0${idx + 1}`,
          phase: slide.eyebrow || `BƯỚC 0${idx + 1}`,
          title: slide.title,
          subtitle: slide.metric ? `${slide.metric.label}: ${slide.metric.value}` : "",
          icon: defaultStepIcons[idx % defaultStepIcons.length],
          color: defaultStepColors[idx % defaultStepColors.length],
          description: slide.description,
        }))
      : ENTERPRISE_PROCESS_STEPS);
  const roadmapCards = sectionData.futureRoadmap || FUTURE_ROADMAP_FEATURES;

  // 1. Render các bước quy trình công nghệ (Gọn gàng)
  const processStepsHtml = processSteps.map(
    (step, idx) => `
      <wl-card class="enterprise-process-card reveal" style="--step-color: ${step.color || "#38bdf8"}; --step-delay: ${(idx * 0.08).toFixed(2)}s">
        <div class="process-card-top">
          <span class="process-number">${step.step || `0${idx + 1}`}</span>
          <span class="process-phase-badge">${step.phase || `BƯỚC 0${idx + 1}`}</span>
          <div class="process-icon-box">
            <i class="${step.icon || "fa-solid fa-microchip"}"></i>
          </div>
        </div>
        <div class="process-card-body">
          <h4 class="process-title">${esc(step.title)}</h4>
          <span class="process-subtitle">${esc(step.subtitle || "")}</span>
          <p class="process-desc">${esc(step.description)}</p>
        </div>
      </wl-card>`,
  ).join("");

  // 2. Render các tính năng lộ trình tương lai (Gọn gàng)
  const roadmapCardsHtml = roadmapCards.map(
    (feature, idx) => `
      <wl-card class="roadmap-card reveal" style="--card-delay: ${(idx * 0.08).toFixed(2)}s">
        <div class="roadmap-card-header">
          <div class="roadmap-icon-wrap">
            <i class="${feature.icon || "fa-solid fa-rocket"}"></i>
          </div>
          <span class="roadmap-badge ${feature.badgeClass || ""}">${feature.badge || "TƯƠNG LAI"}</span>
        </div>
        <h4 class="roadmap-title">${esc(feature.title)}</h4>
        <p class="roadmap-desc">${esc(feature.description)}</p>
        <div class="roadmap-specs">
          ${(feature.tags || []).map((t) => `<span class="roadmap-spec-tag">${esc(t)}</span>`).join("")}
        </div>
      </wl-card>`,
  ).join("");

  return `
    <section class="section about-enterprise-section" id="about-enterprise" aria-label="Giới thiệu Doanh nghiệp & Định hướng Tương lai">
      <div class="container">

        <!-- ==================================================================
             PHẦN 1: TỔNG QUAN DOANH NGHIỆP (NGẮN GỌN)
             ================================================================== -->
        <div class="enterprise-overview-box reveal">
          <div class="enterprise-overview-grid">
            <div class="enterprise-overview-left">
              <div class="section-eyebrow">
                <i class="fa-solid fa-building-flag"></i>
                <span>TẦM NHÌN SỨ MỆNH</span>
              </div>
              <h2 class="enterprise-main-title">
                ${esc(overviewTitle)}
              </h2>
              <p class="enterprise-lead-desc">
                ${esc(overviewDesc)}
              </p>
              <div class="enterprise-metrics-row">
                <div class="enterprise-metric-item">
                  <span class="metric-number">${esc(metric1.value)}</span>
                  <span class="metric-label">${esc(metric1.label)}</span>
                </div>
                <div class="enterprise-metric-item">
                  <span class="metric-number">${esc(metric2.value)}</span>
                  <span class="metric-label">${esc(metric2.label)}</span>
                </div>
                <div class="enterprise-metric-item">
                  <span class="metric-number">${esc(metric3.value)}</span>
                  <span class="metric-label">${esc(metric3.label)}</span>
                </div>
              </div>
            </div>

            <div class="enterprise-overview-right">
              <div class="enterprise-visual-card">
                <img 
                  src="${esc(overviewImage)}" 
                  alt="${esc(overviewTitle)}" 
                  class="enterprise-visual-img"
                  loading="lazy"
                />
                <div class="visual-card-overlay">
                  <div class="visual-card-pill">
                    <span class="pulse-dot"></span>
                    <span>Hoạt động ổn định 99.98%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- ==================================================================
             PHẦN 2: QUY TRÌNH CÔNG NGHỆ 4 BƯỚC (SÚC TÍCH)
             ================================================================== -->
        <div class="enterprise-process-block">
          <div class="section-header text-center reveal">
            <div class="section-eyebrow">
              <i class="fa-solid fa-network-wired"></i>
              <span>QUY TRÌNH CHUẨN HÓA</span>
            </div>
            <h3 class="section-title">Quy Trình Tạo Sinh & Kiểm Soát Chất Lượng</h3>
            <p class="section-subtitle">
              Mỗi câu thoại được xử lý qua chu trình 4 giai đoạn khép kín, đảm bảo tính chuẩn xác và độ truyền cảm cao nhất.
            </p>
          </div>

          <div class="enterprise-process-grid">
            ${processStepsHtml}
          </div>
        </div>

        <!-- ==================================================================
             PHẦN 3: ĐỊNH HƯỚNG TƯƠNG LAI & TÍNH NĂNG MỚI (TẢI MP3, CLONING...)
             ================================================================== -->
        <div class="enterprise-roadmap-block">
          <div class="section-header text-center reveal">
            <div class="section-eyebrow">
              <i class="fa-solid fa-compass-drafting"></i>
              <span>LỘ TRÌNH PHÁT TRIỂN</span>
            </div>
            <h3 class="section-title">Định Hướng Tương Lai & Tính Năng Đột Phá</h3>
            <p class="section-subtitle">
              Không ngừng đổi mới công nghệ, chúng tôi đang tích cực hoàn thiện các công cụ tiên tiến phục vụ sáng tạo nội dung chuyên nghiệp.
            </p>
          </div>

          <div class="enterprise-roadmap-grid">
            ${roadmapCardsHtml}
          </div>
        </div>

      </div>
    </section>`.trim();
}

/**
 * Khởi tạo tương tác cho component Doanh nghiệp & Quy trình
 */
export function initAboutEnterpriseShowcase() {
  // Có thể bổ sung hiệu ứng hover hoặc tương tác đặc thù khi cần
}
