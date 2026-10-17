// ============================================================================
// FeaturesSimpleGenSection.js — Section Tạo Giọng Đọc Đơn Giản Tức Thì
// Giới thiệu quy trình tinh gọn: Chỉ cần nhập dữ liệu văn bản, hệ thống sẽ
// tự động phân tích và tạo ra âm thanh sống động, tự nhiên không cần cấu hình phức tạp.
// Không có phần thử nghiệm/test gõ text (phần test thuộc trang Trải nghiệm).
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render Section Tạo Giọng Đọc Đơn Giản từ dữ liệu
 * @param {Object} [config]
 * @returns {string} HTML markup
 */
export function renderFeaturesSimpleGenSection(config = {}) {
  const brandName = config?.brand?.name || "AI Voice";
  const filePrefix = (config?.brand?.key || "ai-voice").toLowerCase().replace(/[^a-z0-9]/g, "-");

  return `
    <section class="section features-simple-gen-section" id="features-simple-gen" aria-label="Tạo giọng đọc đơn giản">
      <div class="container">
        <!-- Tiêu đề Section căn giữa hoàn chỉnh -->
        <div class="section-header text-center reveal">
          <div class="simple-gen-badge-wrapper">
            <span class="badge badge-primary">
              <i class="fa-solid fa-wand-magic-sparkles" aria-hidden="true"></i> TẠO GIỌNG NÓI TỨC THÌ
            </span>
          </div>
          <h2 class="section-title">Chỉ Cần Nhập Dữ Liệu, Chúng Tôi Sẽ Tạo Âm Thanh Cho Bạn</h2>
          <p class="section-subtitle">
            Không cần thiết bị phòng thu đắt đỏ hay kỹ thuật âm thanh phức tạp. Bạn chỉ việc cung cấp văn bản, trí tuệ nhân tạo sẽ tự động phân tích ngữ cảnh, ngắt nghỉ câu và kết xuất bản thu âm sống động trong vài giây.
          </p>
        </div>

        <!-- Khối Mô phỏng Quy Trình Chuyển Đổi Dữ Liệu Thành Âm Thanh (Visual Pipeline) -->
        <div class="simple-gen-pipeline reveal">
          <div class="pipeline-card pipeline-input">
            <div class="pipeline-card-header">
              <div class="pipeline-step-badge">BƯỚC 1</div>
              <span class="pipeline-card-tag"><i class="fa-solid fa-file-lines"></i> Dữ liệu đầu vào</span>
            </div>
            <h3 class="pipeline-card-title">Nhập hoặc Dán Văn Bản</h3>
            <p class="pipeline-card-desc">
              Cung cấp bất kỳ tài liệu nào: kịch bản video, bài báo, sách nói hay tài liệu học tập.
            </p>
            <div class="pipeline-snippet-box">
              <div class="snippet-header">
                <span class="snippet-dot red"></span>
                <span class="snippet-dot yellow"></span>
                <span class="snippet-dot green"></span>
                <span class="snippet-filename">kich_ban_thuyet_minh.txt</span>
              </div>
              <div class="snippet-body">
                <code>
                  "${esc(brandName)} tự động xử lý toàn bộ câu từ, phát hiện dấu câu, số liệu ngày tháng và từ viết tắt tiếng Việt một cách chuẩn xác..."
                </code>
              </div>
              <div class="snippet-footer">
                <span><i class="fa-solid fa-align-left"></i> 148 từ</span>
                <span><i class="fa-solid fa-check-double"></i> Đã nhận diện tiếng Việt</span>
              </div>
            </div>
          </div>

          <!-- Mũi tên kết nối năng lượng AI (Flow Connection) -->
          <div class="pipeline-connector">
            <div class="pipeline-core-indicator">
              <div class="core-pulse-ring"></div>
              <div class="core-icon-box">
                <i class="fa-solid fa-bolt-lightning"></i>
              </div>
              <span class="core-label">AI XỬ LÝ SIÊU TỐC</span>
              <span class="core-time">&lt; 200ms</span>
            </div>
          </div>

          <div class="pipeline-card pipeline-output">
            <div class="pipeline-card-header">
              <div class="pipeline-step-badge step-completed">BƯỚC 2</div>
              <span class="pipeline-card-tag tag-success"><i class="fa-solid fa-circle-check"></i> Kết quả tức thì</span>
            </div>
            <h3 class="pipeline-card-title">Nhận Âm Thanh Sống Động</h3>
            <p class="pipeline-card-desc">
              Bản ghi âm hoàn chỉnh chuẩn phòng thu sẵn sàng nghe trực tiếp, ứng dụng vào nội dung số hoặc tích hợp qua hệ thống API.
            </p>
            <div class="pipeline-audio-mockup">
              <div class="audio-mockup-header">
                <div class="audio-avatar">
                  <i class="fa-solid fa-waveform-lines"></i>
                </div>
                <div class="audio-meta">
                  <div class="audio-title">${esc(filePrefix)}-master-output.mp3</div>
                  <div class="audio-specs">48kHz • 320kbps • Studio Quality</div>
                </div>
              </div>
              <!-- Dải sóng âm mô phỏng chuyển động -->
              <div class="audio-waveform-bars" aria-hidden="true">
                <span class="bar" style="--h: 40%; --d: 0.1s"></span>
                <span class="bar" style="--h: 75%; --d: 0.3s"></span>
                <span class="bar" style="--h: 90%; --d: 0.15s"></span>
                <span class="bar" style="--h: 60%; --d: 0.4s"></span>
                <span class="bar" style="--h: 100%; --d: 0.2s"></span>
                <span class="bar" style="--h: 80%; --d: 0.35s"></span>
                <span class="bar" style="--h: 45%; --d: 0.25s"></span>
                <span class="bar" style="--h: 85%; --d: 0.1s"></span>
                <span class="bar" style="--h: 95%; --d: 0.3s"></span>
                <span class="bar" style="--h: 70%; --d: 0.45s"></span>
                <span class="bar" style="--h: 50%; --d: 0.15s"></span>
                <span class="bar" style="--h: 88%; --d: 0.28s"></span>
                <span class="bar" style="--h: 65%; --d: 0.38s"></span>
                <span class="bar" style="--h: 35%; --d: 0.18s"></span>
              </div>
              <div class="audio-mockup-footer">
                <span class="audio-duration"><i class="fa-regular fa-clock"></i> 00:32 / 00:32</span>
                <span class="audio-status-ready"><i class="fa-solid fa-circle-check"></i> Sẵn sàng sử dụng</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 3 Lợi thế khi tạo giọng đọc đơn giản -->
        <div class="simple-gen-features-grid reveal">
          <div class="simple-feat-card">
            <div class="simple-feat-icon">
              <i class="fa-solid fa-gauge-high"></i>
            </div>
            <h4 class="simple-feat-title">Tạo Ngay Sau 1 Click</h4>
            <p class="simple-feat-desc">
              Chỉ cần dán văn bản và nhấn tạo. Không phải thiết lập phức tạp, không mất thời gian chờ đợi render âm thanh.
            </p>
          </div>

          <div class="simple-feat-card">
            <div class="simple-feat-icon icon-cyan">
              <i class="fa-solid fa-microchip"></i>
            </div>
            <h4 class="simple-feat-title">Tự Động Chuẩn Hóa Tiếng Việt</h4>
            <p class="simple-feat-desc">
              Xử lý mượt mà ngày tháng năm, ký hiệu tiền tệ, số điện thoại, viết hoa và ngữ điệu câu hỏi, câu cảm thán.
            </p>
          </div>

          <div class="simple-feat-card">
            <div class="simple-feat-icon icon-emerald">
              <i class="fa-solid fa-sliders"></i>
            </div>
            <h4 class="simple-feat-title">Tùy Chọn Đa Dạng Giọng Đọc</h4>
            <p class="simple-feat-desc">
              Kết hợp dễ dàng với mọi chất giọng Bắc - Trung - Nam và tùy chỉnh tốc độ đọc phù hợp với từng mục đích xuất bản.
            </p>
          </div>
        </div>
      </div>
    </section>
  `.trim();
}

/**
 * Khởi tạo tương tác cho Section Tạo Giọng Đọc Đơn Giản (nếu có)
 */
export function initFeaturesSimpleGenSection() {
  // Có thể bổ sung tương tác hover hoặc animation kích hoạt nếu cần
}
