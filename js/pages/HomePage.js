// ============================================================================
// HomePage.js — Trang chủ Tinh gọn & Cốt lõi (Core 4-Section Homepage)
// Bố cục Trang chủ gồm đúng 4 Section chính:
// 1. Hero: Quả cầu 3D Three.js & Giới thiệu âm thanh thương hiệu
// 2. Features: Các tính năng đột phá & Bento Grid
// 3. How To Use / Demo: Giới thiệu quy trình sử dụng 3 bước đơn giản & nút CTA chuyển sang trang Trải nghiệm (#demo)
// 4. About: Câu chuyện thương hiệu dạng cuộn 3D (không kèm component đánh giá)
//
// LƯU Ý QUAN TRỌNG:
// - Trang chủ chỉ gọi đúng 4 Section trên.
// - KHÔNG gọi Section Đánh giá (Testimonials) và Liên hệ (Contact) tại Homepage.
// - Section Về chúng tôi (About) tại Homepage chỉ hiển thị câu chuyện thương hiệu,
//   hoàn toàn không gọi component đánh giá (Testimonials đã thuộc riêng trang AboutPage).
// ============================================================================

import { renderHero, initHeroInteractions } from "../sections/Hero.js";
import {
  renderFeatures,
  initFeaturesInteractions,
} from "../sections/Features.js";
import { renderDemo, initDemoInteractions } from "../sections/Demo.js";
import {
  renderHomeHowToUse,
  initHomeHowToUse,
} from "../components/home/HomeHowToUse.js";
import { renderAbout, initAboutScroll } from "../sections/About.js";

/**
 * Các Section tiêu chuẩn được phép xuất hiện trên Trang chủ
 */
const HOMEPAGE_ALLOWED_SECTIONS = [
  "hero",
  "features",
  "how-to-use",
  "demo",
  "about",
];

/**
 * Render giao diện Trang chủ tinh gọn với đúng 4 Section cốt lõi
 * @param {Object} config - Cấu hình White-Label đầy đủ
 * @returns {string} HTML markup
 */
export function renderHomePage(config) {
  const sections = config.sections || [];

  // Lọc chỉ giữ lại đúng 4 Section cho Homepage theo thứ tự khai báo
  const sectionHtmlList = sections
    .filter(
      (s) =>
        s.disabled !== true &&
        s.visible !== false &&
        HOMEPAGE_ALLOWED_SECTIONS.includes(s.type),
    )
    .map((s) => {
      switch (s.type) {
        case "hero":
          return renderHero({ ...s, brandName: config.brand?.name });

        case "features":
          return renderFeatures(s, "home-features");

        case "how-to-use":
          return renderHomeHowToUse({ ...s, brandName: config.brand?.name });

        case "demo":
          // Section thứ 3 trên Homepage: Thay thế bằng component dùng chung HowToUse
          // Có nút CTA điều hướng người dùng chuyển qua trang Trải nghiệm (#demo)
          if (s.layout === "console") {
            return renderDemo(s);
          }
          return renderHomeHowToUse({ ...s, brandName: config.brand?.name });

        case "about":
          // Section Về chúng tôi chỉ hiển thị câu chuyện 3D Scroll Story / Grid, không kèm component đánh giá
          return renderAbout(s, "home-about");

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
 * Khởi tạo tương tác cho đúng các Section trên Trang chủ
 * @param {Object} config
 */
export function initHomePage(config) {
  const sections = config.sections || [];

  sections
    .filter(
      (s) =>
        s.disabled !== true &&
        s.visible !== false &&
        HOMEPAGE_ALLOWED_SECTIONS.includes(s.type),
    )
    .forEach((s) => {
      try {
        switch (s.type) {
          case "hero":
            initHeroInteractions({ ...s, brandName: config.brand?.name });
            break;
          case "features":
            initFeaturesInteractions();
            break;
          case "how-to-use":
            initHomeHowToUse();
            break;
          case "demo":
            if (s.layout === "console") {
              initDemoInteractions(s);
            } else {
              initHomeHowToUse();
            }
            break;
          case "about":
            initAboutScroll(
              document.getElementById("home-about") ||
                document.getElementById("about") ||
                document,
            );
            break;
        }
      } catch (e) {
        console.error(`Lỗi khởi tạo tương tác section "${s.type}":`, e);
      }
    });
}
