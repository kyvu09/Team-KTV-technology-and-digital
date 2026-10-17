// ============================================================================
// HeroImageFrame.js — Khối Khung Ảnh 3D Nghệ Thuật bên Phải Hero (Generic Reusable)
// Dùng chung cho mọi thương hiệu (White-Label), hoàn toàn không hardcode:
// - Nhận đường dẫn ảnh trực tiếp từ file JSON cấu hình (props.image hoặc props.heroImage)
// - Khung viền công nghệ cao với góc HUD Brackets sắc nét & vầng hào quang Neon
// - Tương tác nghiêng 3D mượt mà theo chuyển động chuột (3D Perspective Mouse Tilt)
// - Tuyệt đối không chèn chữ hay thông tin đè lên ảnh
// ============================================================================

import { esc } from "../../core/esc.js";

let tiltMoveHandler = null;
let tiltLeaveHandler = null;

/**
 * Render khối khung ảnh 3D cao cấp bên phải Hero
 * @param {Object} props Cấu hình hero từ file JSON (props.image, props.imageAlt)
 * @returns {string} HTML markup
 */
export function renderHeroImageFrame(props = {}) {
  const image = props.image || props.heroImage || "";
  const imageAlt = props.imageAlt || props.title || "Hero Image";

  if (!image) {
    return "";
  }

  return `
    <div class="hero-image-frame-wrapper" id="hero-image-frame-wrapper">
      <!-- Sân khấu nghiêng 3D (3D Interactive Tilt Stage) -->
      <div class="hero-image-frame-stage" id="hero-image-frame-stage">

        <!-- Lớp hào quang Neon RGB phản chiếu phía sau (Ambient Aura Glow) -->
        <div class="hero-image-ambient-aura" aria-hidden="true"></div>

        <!-- Khối thẻ Frame chính -->
        <div class="hero-image-cyber-card" id="hero-image-cyber-card">

          <!-- 4 Góc viền công nghệ (HUD Corner Brackets) -->
          <span class="cyber-corner cyber-corner--tl" aria-hidden="true"></span>
          <span class="cyber-corner cyber-corner--tr" aria-hidden="true"></span>
          <span class="cyber-corner cyber-corner--bl" aria-hidden="true"></span>
          <span class="cyber-corner cyber-corner--br" aria-hidden="true"></span>

          <!-- Dải quét Holographic Scanline & Hiệu ứng lưới quang học -->
          <div class="cyber-scanline" aria-hidden="true"></div>
          <div class="cyber-grid-overlay" aria-hidden="true"></div>

          <!-- Khung ảnh chính sắc nét -->
          <div class="hero-image-container">
            <img src="${esc(image)}" alt="${esc(imageAlt)}" class="hero-image-img" id="hero-main-image-el" loading="eager" />
            
            <!-- Lớp phủ ánh sáng chiều sâu bóng loáng -->
            <div class="hero-image-sheen" aria-hidden="true"></div>
          </div>

        </div>
      </div>
    </div>`.trim();
}

/**
 * Khởi tạo tương tác nghiêng 3D theo chuột cho Khối khung ảnh
 */
export function initHeroImageFrame() {
  const wrapper = document.getElementById("hero-image-frame-wrapper");
  const card = document.getElementById("hero-image-cyber-card");

  if (!wrapper || !card) return;

  if (tiltMoveHandler) {
    wrapper.removeEventListener("mousemove", tiltMoveHandler);
  }
  if (tiltLeaveHandler) {
    wrapper.removeEventListener("mouseleave", tiltLeaveHandler);
  }

  tiltMoveHandler = (e) => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 đến 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5;

    const rotY = (x * 16).toFixed(2);
    const rotX = (-y * 16).toFixed(2);

    card.style.transform = `perspective(1000px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale3d(1.02, 1.02, 1.02)`;
    card.style.transition = "transform 0.08s ease-out";
  };

  tiltLeaveHandler = () => {
    card.style.transform =
      "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
    card.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
  };

  wrapper.addEventListener("mousemove", tiltMoveHandler, { passive: true });
  wrapper.addEventListener("mouseleave", tiltLeaveHandler, { passive: true });
}

// Export alias tương thích ngược
export const renderHeroCyberFrame = renderHeroImageFrame;
export const initHeroCyberFrame = initHeroImageFrame;
