import { renderHeader } from "./sections/Header.js";
import { renderHero, initHeroInteractions } from "./sections/Hero.js";
import { initVoiceOrb } from "./effects/voice-orb.js";
import {
  renderFeatures,
  initFeaturesInteractions,
} from "./sections/Features.js";
import { renderDemo, initDemoInteractions } from "./sections/Demo.js";
import { renderAbout, initAboutScroll } from "./sections/About.js";
import {
  renderTestimonials,
  initTestimonialsInteractions,
} from "./sections/Testimonials.js";
import { renderFaq, initFaqInteractions } from "./sections/Faq.js";
import { renderContact, initContactInteractions } from "./sections/Contact.js";
import { initSmoothScroll } from "./effects/smooth-scroll.js";
import { initCustomCursor } from "./effects/cursor.js";
import { initScrollAnimations } from "./effects/scroll-animations.js";

// Bảng từ điển giúp chuyển đổi từ tên loại trong JSON sang Hàm tạo HTML tương ứng
const RENDERERS = {
  hero: renderHero,
  features: renderFeatures,
  demo: renderDemo,
  about: renderAbout,
  testimonials: renderTestimonials,
  faq: renderFaq,
  contact: renderContact,
};

// Bảng từ điển giúp gọi Hàm kích hoạt nút bấm tương ứng
const INTERACTION_HANDLERS = {
  hero: initHeroInteractions,
  features: initFeaturesInteractions,
  demo: initDemoInteractions,
  about: initAboutScroll,
  testimonials: initTestimonialsInteractions,
  faq: initFaqInteractions,
  contact: initContactInteractions,
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
  const sections = config.sections;

  for (let i = 0; i < sections.length; i++) {
    const sectionData = sections[i];
    const type = sectionData.type;

    // Tìm hàm tạo HTML cho loại này
    const rendererFunction = RENDERERS[type];

    if (rendererFunction !== undefined) {
      // Nối mã HTML vào chuỗi chung
      fullHTML += rendererFunction(sectionData);
    } else {
      let htmlOfThisSection = rendererFunction(sectionData);
      fullHTML = fullHTML + htmlOfThisSection;
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

  //Bật các hiệu ứng đồ họa bắt mắt (Animation, 3D, Custom Cursor...)
  let effects = config.effects;
  if (effects === undefined) {
    effects = {}; // Đảm bảo effects không bị rỗng để tránh lỗi
  }

  // Bật cuộn chuột mượt
  if (effects.smoothScroll !== false) {
    initSmoothScroll();
  }

  // Bật con trỏ chuột đặc biệt
  if (effects.cursor !== false) {
    initCustomCursor();
  }

  let orbElement = document.getElementById("hero-voice-orb");
  if (effects.orb !== false && orbElement !== null) {
    initVoiceOrb("hero-voice-orb");
  }

  // Đợi 0.1 giây (100 mili-giây) rồi bật hiệu ứng các khối bay từ dưới lên khi cuộn chuột
  setTimeout(function () {
    initScrollAnimations(config);
  }, 100);
}
