// ============================================================================
// render.js — Bộ phận lắp ráp giao diện (Render Engine)
// Dựng toàn bộ các Section động theo dữ liệu cấu hình White-Label JSON
// ============================================================================

import { renderHeader } from "./sections/Header.js";
import { renderFooter } from "./sections/Footer.js";
import { renderHero, initHeroInteractions } from "./sections/Hero.js";
import { renderDemo, initDemoInteractions } from "./sections/Demo.js";
import {
  renderFeatures,
  initFeaturesInteractions,
} from "./sections/Features.js";
import { renderAbout, initAboutScroll } from "./sections/About.js";
import {
  renderTestimonials,
  initTestimonialsInteractions,
} from "./sections/Testimonials.js";
import { renderFaq, initFaqInteractions } from "./sections/Faq.js";
import { renderContact, initContactInteractions } from "./sections/Contact.js";

import { initVoiceOrb } from "./effects/voice-orb.js";
import { initSmoothScroll } from "./effects/smooth-scroll.js";
import { initCustomCursor } from "./effects/cursor.js";
import { initScrollAnimations } from "./effects/scroll-animations.js";
import { initAmbientBackground } from "./effects/ambient-background.js";
import { initChatbot } from "./components/Chatbot.js";

// Bảng từ điển ánh xạ từ loại Section trong file JSON sang Hàm sinh mã HTML tương ứng
const RENDERERS = {
  hero: renderHero,
  demo: renderDemo,
  features: renderFeatures,
  about: renderAbout,
  testimonials: renderTestimonials,
  faq: renderFaq,
  contact: renderContact,
};

// Bảng từ điển ánh xạ từ loại Section sang Hàm khởi tạo sự kiện tương tác
const INTERACTION_HANDLERS = {
  hero: initHeroInteractions,
  demo: initDemoInteractions,
  features: initFeaturesInteractions,
  about: initAboutScroll,
  testimonials: initTestimonialsInteractions,
  faq: initFaqInteractions,
  contact: initContactInteractions,
};

export function renderSite(config) {
  // 1. Tạo thanh điều hướng (Header) phía trên cùng
  renderHeader(config);

  // 2. Tìm khung "app" trong file HTML để render nội dung chính
  const app = document.getElementById("app");
  if (!app) {
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

    if (rendererFunction === undefined) {
      console.warn(`Chưa có code HTML hỗ trợ phần: ${type}`);
    } else {
      fullHTML += rendererFunction(sectionData);
    }
  }

  // Đổ toàn bộ mã HTML vào trong khung "app" trên màn hình
  app.innerHTML = fullHTML;

  // 4. Tạo chân trang (Footer) phía dưới cùng
  renderFooter(config);

  // 5. Gắn sự kiện tương tác (click, audio, hiệu ứng) cho từng section
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

  // 6. Bật các hiệu ứng đồ họa bắt mắt (Animation, 3D, Custom Cursor...)
  const effects = config.effects || {};

  // Bật cuộn chuột mượt Lenis
  if (effects.smoothScroll !== false) {
    initSmoothScroll();
  }

  // Bật con trỏ chuột đặc biệt
  if (effects.cursor !== false) {
    initCustomCursor();
  }

  // Bật quả cầu 3D (nếu có thẻ id="hero-voice-orb")
  const orbElement = document.getElementById("hero-voice-orb");
  if (effects.orb !== false && orbElement !== null) {
    initVoiceOrb("hero-voice-orb");
  }

  // Bật nền hạt bay bay phía sau (Ambient Canvas)
  const bgElement = document.getElementById("ambient-canvas");
  if (effects.ambientBackground !== false && bgElement !== null) {
    initAmbientBackground(config);
  }

  // Khởi tạo Chatbox AI hỗ trợ tạo thương hiệu mới
  initChatbot(config);

  // Đợi 0.1 giây (100 mili-giây) rồi bật hiệu ứng các khối bay từ dưới lên khi cuộn chuột
  setTimeout(function () {
    initScrollAnimations(config);
  }, 100);
}
