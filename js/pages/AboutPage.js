// ============================================================================
// AboutPage.js — Trang Về chúng tôi Riêng biệt (Dedicated About Page)
// Tái sử dụng nguyên vẹn toàn bộ Section About (Story Slide, Progress, Stats)
// và Testimonials để tạo thành trang giới thiệu chuyên sâu hoàn chỉnh
// ============================================================================

import { renderPageHeader } from "../components/common/PageHeader.js";
import {
  renderAboutEnterpriseShowcase,
  initAboutEnterpriseShowcase,
} from "../components/about/AboutEnterpriseShowcase.js";
import {
  renderTestimonials,
  initTestimonialsInteractions,
} from "../sections/Testimonials.js";

/**
 * Render Trang Về chúng tôi chuyên biệt
 * @param {Object} config
 * @returns {string} HTML markup
 */
export function renderAboutPage(config) {
  const sections = config.sections || [];
  const aboutData = sections.find((s) => s.type === "about") || {};
  const testimonialsData = sections.find((s) => s.type === "testimonials") || {};

  const brandName = config?.brand?.name || "Chúng tôi";
  const pageHeaderCfg = aboutData.pageHeader || {};

  const pageHeaderHtml = renderPageHeader({
    title: pageHeaderCfg.title || "Về Chúng Tôi",
    subtitle:
      pageHeaderCfg.subtitle ||
      aboutData.subtitle ||
      (aboutData.paragraphs && aboutData.paragraphs[0]) ||
      `Khám phá câu chuyện phát triển và giá trị cốt lõi cùng ${brandName}.`,
    bgImage:
      pageHeaderCfg.bgImage ||
      aboutData.scrollStory?.slides?.[0]?.image ||
      aboutData.items?.[0]?.image ||
      "",
    bgAlt: pageHeaderCfg.bgAlt || `Hành trình và không gian làm việc của ${brandName}`,
    themeClass: "page-header-theme-about",
    breadcrumb: "Về chúng tôi",
  });

  return `
    <div class="page-wrapper page-about" id="page-about">
      <!-- 1. Tiêu đề trang giới thiệu (Page Header) -->
      ${pageHeaderHtml}

      <!-- 2. Giới thiệu Doanh nghiệp, Quy trình công nghệ & Định hướng tương lai (Enterprise Showcase) -->
      ${renderAboutEnterpriseShowcase(aboutData)}

      <!-- 3. Đánh giá & Phản hồi từ khách hàng (Testimonials Marquee) -->
      ${renderTestimonials(testimonialsData)}
    </div>`.trim();
}

/**
 * Khởi tạo tương tác trang Về chúng tôi
 * @param {Object} config
 */
export function initAboutPage(config) {
  const sections = config.sections || [];
  const testimonialsData = sections.find((s) => s.type === "testimonials") || {};

  // 1. Tương tác component Doanh nghiệp, Quy trình & Định hướng tương lai
  try {
    initAboutEnterpriseShowcase();
  } catch (e) {
    console.error("Lỗi khởi tạo AboutEnterpriseShowcase:", e);
  }

  // 2. Tương tác dải băng chuyền nhận xét (Testimonials Marquee)
  try {
    initTestimonialsInteractions(testimonialsData);
  } catch (e) {
    console.error("Lỗi khởi tạo Testimonials:", e);
  }
}
