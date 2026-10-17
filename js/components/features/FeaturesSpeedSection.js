// ============================================================================
// FeaturesSpeedSection.js — Section 3: Tốc Độ Giọng Đọc (Voice Speed Section)
// Giới thiệu thông tin tính năng điều chỉnh tốc độ đọc 0.5x - 2.0x
// (Phần thử nghiệm trực tiếp chuyển sang trang Studio / Trải nghiệm)
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render Section 3: Giới thiệu thông tin Tốc Độ Giọng Đọc
 * @param {Object} [config]
 * @returns {string} HTML markup
 */
export function renderFeaturesSpeedSection(config = {}) {
  return `
    <section class="section features-speed-section" id="features-speed">
      <div class="container">
        <!-- Tiêu đề Section -->
        <div class="section-header text-center reveal">
          <h2 class="section-title">Làm Chủ Tốc Độ Giọng Đọc Thời Gian Thực</h2>
          <p class="section-subtitle">
            Hệ thống cho phép tinh chỉnh tốc độ đọc linh hoạt từ 0.5x đến 2.0x, bảo toàn trọn vẹn cao độ và sắc thái ngữ điệu tiếng Việt tự nhiên mà không bị méo tiếng hay the thé.
          </p>
        </div>

        <!-- Khối giới thiệu thông tin tốc độ trung tâm -->
        <div class="speed-info-console reveal">
          <div class="speed-console-glow" aria-hidden="true"></div>

          <!-- Bảng mô phỏng thang tốc độ trực quan -->
          <div class="speed-showcase-panel">
            <div class="speed-showcase-header">
              <span class="speed-showcase-label"><i class="fa-solid fa-sliders"></i> DẢI TỐC ĐỘ HỖ TRỢ</span>
              <div class="speed-display-number">
                <span id="speed-value-text">1.0</span><span class="speed-unit">x</span>
              </div>
              <div class="speed-status-pill" id="speed-status-pill">
                Tự nhiên • Chuẩn đàm thoại bản xứ
              </div>
            </div>

            <!-- Thanh trượt tốc độ trực quan -->
            <div class="speed-slider-wrapper">
              <div class="slider-labels">
                <span><i class="fa-solid fa-backward-step"></i> 0.5x (Chậm rãi)</span>
                <span><i class="fa-solid fa-play"></i> 1.0x (Chuẩn bản xứ)</span>
                <span><i class="fa-solid fa-forward-fast"></i> 2.0x (Siêu tốc độ)</span>
              </div>
              <input 
                type="range" 
                id="speed-range-slider" 
                class="speed-range-slider" 
                min="0.5" 
                max="2.0" 
                step="0.05" 
                value="1.0"
                aria-label="Thanh trượt xem các mức tốc độ đọc"
              />
            </div>

            <!-- Các nút mốc tốc độ nhanh -->
            <div class="speed-presets-row" role="group" aria-label="Các mốc tốc độ">
              <button type="button" class="speed-preset-btn" data-speed="0.5">0.5x</button>
              <button type="button" class="speed-preset-btn" data-speed="0.75">0.75x</button>
              <button type="button" class="speed-preset-btn active" data-speed="1.0">1.0x</button>
              <button type="button" class="speed-preset-btn" data-speed="1.25">1.25x</button>
              <button type="button" class="speed-preset-btn" data-speed="1.5">1.5x</button>
              <button type="button" class="speed-preset-btn" data-speed="2.0">2.0x</button>
            </div>
          </div>

          <!-- Dải thông số thông tin nổi bật về tốc độ đọc -->
          <div class="speed-specs-grid">
            <div class="speed-spec-item">
              <div class="speed-spec-icon"><i class="fa-solid fa-arrows-left-right"></i></div>
              <div class="speed-spec-content">
                <span class="speed-spec-label">DẢI ĐIỀU CHỈNH</span>
                <strong class="speed-spec-value">0.5x — 2.0x</strong>
                <p class="speed-spec-desc">Bước tinh chỉnh siêu mượt 0.05x đáp ứng mọi mục đích nghe và sản xuất.</p>
              </div>
            </div>

            <div class="speed-spec-item">
              <div class="speed-spec-icon"><i class="fa-solid fa-wave-square"></i></div>
              <div class="speed-spec-content">
                <span class="speed-spec-label">KHÓA CAO ĐỘ AI</span>
                <strong class="speed-spec-value">Pitch-Preserving</strong>
                <p class="speed-spec-desc">Cố định cao độ nguyên bản, loại bỏ hoàn toàn hiện tượng the thé khi tăng tốc.</p>
              </div>
            </div>

            <div class="speed-spec-item">
              <div class="speed-spec-icon"><i class="fa-solid fa-bolt"></i></div>
              <div class="speed-spec-content">
                <span class="speed-spec-label">ĐỘ TRỄ PHẢN HỒI</span>
                <strong class="speed-spec-value">&lt; 80 mili-giây</strong>
                <p class="speed-spec-desc">Xử lý tức thì theo thời gian thực mà không làm gián đoạn luồng phát âm thanh.</p>
              </div>
            </div>

            <div class="speed-spec-item">
              <div class="speed-spec-icon"><i class="fa-solid fa-spell-check"></i></div>
              <div class="speed-spec-content">
                <span class="speed-spec-label">THANH ĐIỆU BẢN XỨ</span>
                <strong class="speed-spec-value">Chuẩn 6 Dấu Thanh</strong>
                <p class="speed-spec-desc">Bảo toàn trọn vẹn ngữ điệu sắc, huyền, hỏi, ngã, nặng ở mọi tốc độ.</p>
              </div>
            </div>
          </div>

          <!-- Kêu gọi trải nghiệm điều chỉnh sang trang Studio -->
          <div class="speed-cta-row text-center">
            <a href="#demo" class="btn btn-primary btn-magnetic" data-page-link="demo">
              <span>Trải nghiệm điều chỉnh tốc độ tại Studio</span>
            </a>
          </div>
        </div>
      </div>
    </section>`.trim();
}

/**
 * Khởi tạo tương tác hiển thị thang tốc độ trực quan
 */
export function initFeaturesSpeedSection() {
  const slider = document.getElementById("speed-range-slider");
  const valueText = document.getElementById("speed-value-text");
  const statusPill = document.getElementById("speed-status-pill");
  const presetBtns = document.querySelectorAll(".speed-preset-btn");

  if (!slider || !valueText) return;

  const getSpeedDescription = (rate) => {
    if (rate <= 0.6) return "Chậm rãi • Học ngoại ngữ & Luyện phát âm";
    if (rate <= 0.85) return "Thư thả • Sách thiếu nhi & Kể chuyện";
    if (rate <= 1.15) return "Tự nhiên • Chuẩn đàm thoại bản xứ";
    if (rate <= 1.4) return "Nhanh nhẹn • Phù hợp Podcast & Tin tức";
    if (rate <= 1.75) return "Tốc độ cao • Tóm tắt sách & Học nhanh";
    return "Siêu tốc độ • Rà soát & Lắng nghe lướt";
  };

  const updateSpeedUI = (rate) => {
    const currentRate = parseFloat(rate);
    valueText.textContent = currentRate.toFixed(rate % 1 === 0 ? 1 : 2);
    slider.value = currentRate;

    if (statusPill) {
      statusPill.textContent = getSpeedDescription(currentRate);
    }

    presetBtns.forEach((btn) => {
      const btnSpeed = parseFloat(btn.getAttribute("data-speed"));
      if (Math.abs(btnSpeed - currentRate) < 0.03) {
        btn.classList.add("active");
      } else {
        btn.classList.remove("active");
      }
    });

    const percentage = ((currentRate - 0.5) / (2.0 - 0.5)) * 100;
    slider.style.background = `linear-gradient(to right, var(--primary, #38bdf8) 0%, var(--accent, #a78bfa) ${percentage}%, rgba(255, 255, 255, 0.15) ${percentage}%)`;
  };

  slider.addEventListener("input", (e) => {
    updateSpeedUI(e.target.value);
  });

  presetBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const speed = parseFloat(btn.getAttribute("data-speed"));
      updateSpeedUI(speed);
    });
  });

  updateSpeedUI(1.0);
}
