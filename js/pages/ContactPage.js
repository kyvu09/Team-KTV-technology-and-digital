// ============================================================================
// ContactPage.js — Trang Liên hệ & Hợp tác Riêng biệt (Dedicated Contact Page)
// ============================================================================

import { renderPageHeader } from "../components/common/PageHeader.js";
import {
  renderContact,
  initContactInteractions,
} from "../sections/Contact.js";

/**
 * Render Trang Liên hệ chuyên biệt
 * @param {Object} config
 * @returns {string} HTML markup
 */
export function renderContactPage(config) {
  const sections = config.sections || [];
  const contactData = sections.find((s) => s.type === "contact") || {};

  const brandName = config?.brand?.name || "";
  const pageHeaderCfg = contactData.pageHeader || {};
  const featuresSection = sections.find((s) => s.type === "features");
  const fallbackImg = featuresSection?.items?.[0]?.image || "";

  const pageHeaderHtml = renderPageHeader({
    title: pageHeaderCfg.title || contactData.title || "Liên Hệ & Hợp Tác",
    subtitle:
      pageHeaderCfg.subtitle ||
      contactData.subtitle ||
      `Đội ngũ chuyên gia ${brandName} luôn sẵn sàng tư vấn và đồng hành cùng dự án của bạn 24/7.`,
    bgImage: pageHeaderCfg.bgImage || fallbackImg,
    bgAlt: pageHeaderCfg.bgAlt || `Không gian làm việc & kết nối đối tác ${brandName}`,
    themeClass: "page-header-theme-contact",
    breadcrumb: "Liên hệ",
  });

  return `
    <div class="page-wrapper page-contact" id="page-contact">
      <!-- 1. Tiêu đề trang liên hệ & hợp tác (Page Header) -->
      ${pageHeaderHtml}

      <!-- 2. Khối thông tin liên hệ & biểu mẫu hợp tác (Contact Section) -->
      ${renderContact(contactData)}
    </div>`.trim();
}

/**
 * Khởi tạo tương tác trang Liên hệ
 */
export function initContactPage(config = {}) {
  // 1. Tương tác biểu mẫu gửi thông tin & hiệu ứng nút nam châm (Contact Form)
  try {
    const sections = config?.sections || [];
    const contactData = sections.find((s) => s.type === "contact") || {};
    initContactInteractions(contactData);
  } catch (e) {
    console.error("Lỗi khởi tạo Contact:", e);
  }
}
