// ============================================================================
// render.js — Bộ phận lắp ráp giao diện (Render Engine)
// Hỗ trợ Kiến trúc Đa trang Hoàn chỉnh (Multi-Page SPA) và Trang chủ Tinh gọn
// Tự động điều phối các trang: Trang chủ, Về chúng tôi, Tính năng, Demo, FAQ, Liên hệ
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

// Import Hệ thống Đa trang (Pages)
import {
  renderHomePage,
  initHomePage,
  renderAboutPage,
  initAboutPage,
  renderFeaturesPage,
  initFeaturesPage,
  renderDemoPage,
  initDemoPage,
  renderFaqPage,
  initFaqPage,
  renderContactPage,
  initContactPage,
  renderAuthPage,
  initAuthPage,
} from "./pages/index.js";

// Import Bộ điều hướng Router
import { initRouter, ROUTES, getCurrentRoute } from "./core/router.js";

let currentSiteConfig = null;
let isRouterReady = false;
let renderTimeout = null;

import { initVoiceOrb } from "./effects/voice-orb.js";
import { initSmoothScroll } from "./effects/smooth-scroll.js";
import { initCustomCursor } from "./effects/cursor.js";
import { initScrollAnimations } from "./effects/scroll-animations.js";
import { initChatbot } from "./components/Chatbot.js";

// Bảng từ điển ánh xạ từ loại Section cũ sang Hàm sinh mã HTML (giữ nguyên không xóa)
export const RENDERERS = {
  hero: renderHero,
  demo: renderDemo,
  features: renderFeatures,
  about: renderAbout,
  testimonials: renderTestimonials,
  faq: renderFaq,
  contact: renderContact,
};

// Bảng từ điển ánh xạ từ loại Section sang Hàm tương tác (giữ nguyên không xóa)
export const INTERACTION_HANDLERS = {
  hero: initHeroInteractions,
  demo: initDemoInteractions,
  features: initFeaturesInteractions,
  about: initAboutScroll,
  testimonials: initTestimonialsInteractions,
  faq: initFaqInteractions,
  contact: initContactInteractions,
};

// Bảng ánh xạ Trang sang Hàm Render
const PAGE_RENDERERS = {
  [ROUTES.HOME]: renderHomePage,
  [ROUTES.ABOUT]: renderAboutPage,
  [ROUTES.FEATURES]: renderFeaturesPage,
  [ROUTES.DEMO]: renderDemoPage,
  [ROUTES.FAQ]: renderFaqPage,
  [ROUTES.CONTACT]: renderContactPage,
  [ROUTES.AUTH]: renderAuthPage,
};

// Bảng ánh xạ Trang sang Hàm Khởi tạo Tương tác
const PAGE_INTERACTIONS = {
  [ROUTES.HOME]: initHomePage,
  [ROUTES.ABOUT]: initAboutPage,
  [ROUTES.FEATURES]: initFeaturesPage,
  [ROUTES.DEMO]: initDemoPage,
  [ROUTES.FAQ]: initFaqPage,
  [ROUTES.CONTACT]: initContactPage,
  [ROUTES.AUTH]: initAuthPage,
};

export function renderSite(config) {
  currentSiteConfig = config;

  // 1. Tạo thanh điều hướng (Header) phía trên cùng
  renderHeader(config);

  // 2. Tạo chân trang (Footer) phía dưới cùng
  renderFooter(config);

  // 3. Tìm khung "app" trong file HTML để render nội dung các trang
  const app = document.getElementById("app");
  if (!app) {
    console.error("Không tìm thấy phần tử #app trong HTML");
    return;
  }

  // 4. Bật các hiệu ứng đồ họa toàn trang một lần (Smooth Scroll, Cursor, Ambient, Chatbot)
  const effects = config.effects || {};

  if (effects.smoothScroll !== false) {
    initSmoothScroll();
  }

  if (effects.cursor !== false) {
    initCustomCursor();
  }

  initChatbot(config);

  // 5. Hàm Render nội dung theo Route (Trang)
  const renderRouteView = (route) => {
    if (renderTimeout) {
      clearTimeout(renderTimeout);
      renderTimeout = null;
    }

    // Hiệu ứng mờ dần nhẹ nhàng khi chuyển trang
    app.style.opacity = "0";
    app.style.transform = "translateY(8px)";
    app.style.transition = "opacity 0.25s ease, transform 0.25s ease";

    // Cập nhật trạng thái view trên thẻ body (ẩn header/footer khi vào Auth)
    if (route === ROUTES.AUTH) {
      document.body.classList.add("is-auth-view");
    } else {
      document.body.classList.remove("is-auth-view", "lamp-on", "on");
    }

    renderTimeout = setTimeout(() => {
      renderTimeout = null;
      const activeCfg = currentSiteConfig || config;

      // Tìm hàm render trang tương ứng, mặc định là HomePage
      const pageRenderer = PAGE_RENDERERS[route] || renderHomePage;
      const pageHTML = pageRenderer(activeCfg);

      // Đổ nội dung HTML của trang vào #app
      app.innerHTML = pageHTML;

      // Khởi tạo các tương tác của trang
      const pageInitializer = PAGE_INTERACTIONS[route] || initHomePage;
      if (typeof pageInitializer === "function") {
        try {
          pageInitializer(activeCfg);
        } catch (err) {
          console.error(`Lỗi khi khởi tạo tương tác trang "${route}":`, err);
        }
      }

      // Bật quả cầu 3D Three.js nếu trang hiện tại có phần tử #hero-voice-orb (chỉ khi không ở Auth)
      const orbElement = document.getElementById("hero-voice-orb");
      if (route !== ROUTES.AUTH && activeCfg?.effects?.orb !== false && orbElement !== null) {
        initVoiceOrb("hero-voice-orb");
      }

      // Khởi tạo hoạt ảnh cuộn xuất hiện (Scroll Animations) cho các section landing page
      if (route !== ROUTES.AUTH) {
        setTimeout(() => {
          initScrollAnimations(activeCfg);
          if (window.ScrollTrigger) {
            window.ScrollTrigger.refresh();
          }
        }, 120);
      }

      // Fade in trang mới
      app.style.opacity = "1";
      app.style.transform = "translateY(0)";
      setTimeout(() => {
        app.style.transform = "";
        app.style.transition = "";
        if (window.ScrollTrigger) {
          window.ScrollTrigger.refresh();
        }
      }, 260);
    }, 120);
  };

  // 6. Khởi động bộ điều hướng Router đa trang (chỉ khởi tạo 1 lần duy nhất)
  if (!isRouterReady) {
    isRouterReady = true;
    initRouter((newRoute) => {
      renderRouteView(newRoute);
    });
  } else {
    // Đã có router: render lại route hiện tại với config mới
    renderRouteView(getCurrentRoute());
  }
}

