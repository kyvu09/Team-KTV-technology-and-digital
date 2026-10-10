// ============================================================================
// render.js — Bộ phận lắp ráp giao diện (Render Engine)
// Đã được viết lại thân thiện với người mới học (Beginner Friendly)
// ============================================================================

import { renderHeader } from "./sections/Header.js";
import { renderHero, initHeroInteractions } from "./sections/Hero.js";
import { initVoiceOrb } from "./effects/voice-orb.js";

// Bảng từ điển giúp chuyển đổi từ tên loại trong JSON sang Hàm tạo HTML tương ứng
const RENDERERS = {
  "hero": renderHero,
};

// Bảng từ điển giúp gọi Hàm kích hoạt nút bấm tương ứng
const INTERACTION_HANDLERS = {
  "hero": initHeroInteractions,
};

export function renderSite(config) {
  // 1. Tạo thanh điều hướng (Header) phía trên cùng
  renderHeader(config);

  // 2. Tìm khung "app" trong file HTML để nhét giao diện vào
  const app = document.getElementById("app");
  if (app === null) {
    console.error("Không tìm thấy phần tử #app trong HTML");
    return;
  }

  // 3. Đọc từng phần (section) trong config.sections và ghép code HTML
  let fullHTML = "";
  const sections = config.sections || [];

  for (let i = 0; i < sections.length; i++) {
    const sectionData = sections[i];
    const type = sectionData.type;

    // Tìm hàm tạo HTML cho loại này
    const rendererFunction = RENDERERS[type];

    if (rendererFunction !== undefined) {
      // Nối mã HTML vào chuỗi chung
      fullHTML += rendererFunction(sectionData);
    } else {
      // Chưa triển khai các section này (Features, About, FAQ...) -> tạm bỏ qua để không lỗi
      console.log(`[White Label] Section "${type}" chưa được triển khai, tạm thời bỏ qua.`);
    }
  }

  // Đổ toàn bộ mã HTML vào trong khung "app" trên màn hình
  app.innerHTML = fullHTML;

  // 4. Gắn sự kiện tương tác (click, audio, hiệu ứng) cho từng section
  for (let i = 0; i < sections.length; i++) {
    const sectionData = sections[i];
    const type = sectionData.type;

    const handlerFunction = INTERACTION_HANDLERS[type];

    if (handlerFunction !== undefined) {
      try {
        handlerFunction(sectionData);
      } catch (err) {
        console.error(`Bị lỗi khi cài đặt tương tác cho section: ${type}`, err);
      }
    }
  }

  // 6. Khởi tạo hiệu ứng Quả cầu 3D (nếu có thư viện Three.js)
  if (config.effects?.orb !== false) {
    try {
      initVoiceOrb("hero-voice-orb");
    } catch (e) {
      console.warn("Không khởi tạo được Voice Orb:", e);
    }
  }
}