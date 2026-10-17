// ============================================================================
// FaqPage.js — Trang Hỏi đáp & Trợ giúp Riêng biệt (Dedicated FAQ Page)
// ============================================================================

import { renderPageHeader } from "../components/common/PageHeader.js";
import { renderFaq, initFaqInteractions } from "../sections/Faq.js";

/**
 * Render Trang Hỏi đáp chuyên biệt
 * @param {Object} config
 * @returns {string} HTML markup
 */
export function renderFaqPage(config) {
  const sections = config.sections || [];
  const faqData = sections.find((s) => s.type === "faq") || {};

  const brandName = config?.brand?.name || "";
  const pageHeaderCfg = faqData.pageHeader || {};
  const aboutSection = sections.find((s) => s.type === "about");
  const fallbackImg =
    aboutSection?.scrollStory?.slides?.[1]?.image ||
    aboutSection?.scrollStory?.slides?.[0]?.image ||
    "";

  const pageHeaderHtml = renderPageHeader({
    title: pageHeaderCfg.title || faqData.title || "Câu Hỏi Thường Gặp",
    subtitle:
      pageHeaderCfg.subtitle ||
      faqData.subtitle ||
      `Giải đáp mọi thắc mắc của bạn về bản quyền, cách tích hợp API và giải pháp của ${brandName}.`,
    bgImage: pageHeaderCfg.bgImage || fallbackImg,
    bgAlt: pageHeaderCfg.bgAlt || `Không gian hỗ trợ trực tuyến ${brandName}`,
    themeClass: "page-header-theme-faq",
    breadcrumb: "Hỏi đáp",
  });

  return `
    <div class="page-wrapper page-faq" id="page-faq">
      <!-- 1. Tiêu đề trang hỏi đáp & trung tâm trợ giúp (Page Header) -->
      ${pageHeaderHtml}

      <!-- 2. Hệ thống câu hỏi thường gặp & thẻ giải đáp (FAQ Section) -->
      ${renderFaq(faqData)}
    </div>`.trim();
}

/**
 * Khởi tạo tương tác trang FAQ
 * @param {Object} config
 */
export function initFaqPage(config) {
  const sections = config.sections || [];
  const faqData = sections.find((s) => s.type === "faq") || {};

  // 1. Tương tác lật thẻ 3D hoặc Accordion câu hỏi thường gặp (FAQ)
  try {
    initFaqInteractions(faqData);
  } catch (e) {
    console.error("Lỗi khởi tạo FAQ:", e);
  }
}
