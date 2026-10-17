// ============================================================================
// HomePage.js — Trang chủ Động & Linh Hoạt (Config-Driven Homepage)
// Tự động render và sắp xếp các Section theo đúng thứ tự mảng config.sections
// Cho phép hoán đổi vị trí, bật/tắt section tùy biến theo tiêu chuẩn White Label Nâng cao
// ============================================================================

import { renderHero, initHeroInteractions } from "../sections/Hero.js";
import {
  renderFeatures,
  initFeaturesInteractions,
} from "../sections/Features.js";
import { renderDemo, initDemoInteractions } from "../sections/Demo.js";
import { renderAbout, initAboutScroll } from "../sections/About.js";
import {
  renderTestimonials,
  initTestimonialsInteractions,
} from "../sections/Testimonials.js";
import { renderFaq, initFaqInteractions } from "../sections/Faq.js";
import { renderContact, initContactInteractions } from "../sections/Contact.js";
import {
  renderHomeStudioTeaser,
  initHomeStudioTeaser,
} from "../components/home/HomeStudioTeaser.js";
import { navigateTo, ROUTES } from "../core/router.js";

/**
 * Render toàn bộ giao diện Trang chủ động theo mảng config.sections
 * @param {Object} config - Cấu hình White-Label đầy đủ
 * @returns {string} HTML markup
 */
export function renderHomePage(config) {
  const sections = config.sections || [];

  // Duyệt và render từng Section theo đúng thứ tự mảng config.sections
  const sectionHtmlList = sections
    .map((s) => {
      if (s.disabled === true || s.visible === false) return "";

      switch (s.type) {
        case "hero":
          return renderHero({ ...s, brandName: config.brand?.name });

        case "features":
          return renderFeatures(s, "home-features");

        case "demo":
          return renderDemo(s);

        case "about":
          return renderAbout(s, "home-about");

        case "testimonials":
          return renderTestimonials(s);

        case "faq":
          return renderFaq(s);

        case "contact":
          return renderContact(s);

        case "studio-teaser":
          return renderHomeStudioTeaser(s);

        default:
          return "";
      }
    })
    .filter(Boolean);

  return `
    <div class="page-wrapper page-home" id="page-home">
      ${sectionHtmlList.join("\n")}
    </div>`.trim();
}

/**
 * Khởi tạo toàn bộ tương tác trên Trang chủ theo các section có mặt
 * @param {Object} config
 */
export function initHomePage(config) {
  const sections = config.sections || [];

  // Duyệt qua từng section để kích hoạt tương tác tương ứng
  sections.forEach((s) => {
    if (s.disabled === true || s.visible === false) return;

    try {
      switch (s.type) {
        case "hero":
          initHeroInteractions({ ...s, brandName: config.brand?.name });
          break;
        case "features":
          initFeaturesInteractions();
          break;
        case "demo":
          initDemoInteractions(s);
          break;
        case "about":
          initAboutScroll(
            document.getElementById("home-about") ||
              document.getElementById("about") ||
              document,
          );
          break;
        case "testimonials":
          initTestimonialsInteractions(s);
          break;
        case "faq":
          initFaqInteractions(s);
          break;
        case "contact":
          initContactInteractions(s);
          break;
        case "studio-teaser":
          initHomeStudioTeaser();
          break;
      }
    } catch (e) {
      console.error(`Lỗi khởi tạo tương tác section "${s.type}":`, e);
    }
  });
}
