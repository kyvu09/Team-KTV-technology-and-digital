// ============================================================================
// FeaturesPage.js — Trang Tính năng Chuyên sâu (Dedicated Features Page)
// Tự động thích ứng White-Label theo cấu hình thương hiệu:
// 1. Page Header đồng bộ nhận diện thương hiệu
// 2. Module âm thanh chuyên sâu (Kho giọng đọc, Tạo giọng đơn giản, Tốc độ giọng đọc)
// ============================================================================

import { renderPageHeader } from "../components/common/PageHeader.js";
import {
  renderFeaturesVoicesSection,
  initFeaturesVoicesSection,
} from "../components/features/FeaturesVoicesSection.js";
import {
  renderFeaturesSimpleGenSection,
  initFeaturesSimpleGenSection,
} from "../components/features/FeaturesSimpleGenSection.js";
import {
  renderFeaturesSpeedSection,
  initFeaturesSpeedSection,
} from "../components/features/FeaturesSpeedSection.js";

/**
 * Render Trang Tính năng chuyên biệt cho tất cả các thương hiệu
 * @param {Object} config
 * @returns {string} HTML markup
 */
export function renderFeaturesPage(config = {}) {
  const sections = config.sections || [];
  const featuresData = sections.find((s) => s.type === "features") || {};
  const brandName = config?.brand?.name || "";
  const pageHeaderCfg = featuresData.pageHeader || {};
  const fallbackImg = featuresData.items?.[0]?.image || "";

  const pageHeaderHtml = renderPageHeader({
    title: pageHeaderCfg.title || featuresData.title || "Tính Năng Nổi Bật",
    subtitle:
      pageHeaderCfg.subtitle ||
      featuresData.subtitle ||
      `Khám phá các đột phá và tính năng chuyên sâu của ${brandName}.`,
    bgImage: pageHeaderCfg.bgImage || fallbackImg,
    bgAlt: pageHeaderCfg.bgAlt || `Không gian tính năng ${brandName}`,
    themeClass: "page-header-theme-features",
    breadcrumb: "Tính năng",
  });

  return `
    <div class="page-wrapper page-features" id="page-features">
      <!-- Section 1: Tiêu đề trang dùng component chung PageHeader đồng bộ -->
      ${pageHeaderHtml}

      <!-- Section 3: Kho Đa giọng đọc (Bắc - Trung - Nam) -->
      ${renderFeaturesVoicesSection(config)}

      <!-- Section 4: Tạo giọng đọc đơn giản từ văn bản -->
      ${renderFeaturesSimpleGenSection(config)}

      <!-- Section 5: Tốc độ giọng đọc (0.5x - 2.0x) -->
      ${renderFeaturesSpeedSection(config)}
    </div>`.trim();
}

/**
 * Khởi tạo tương tác trang Tính năng cho tất cả các thương hiệu
 * @param {Object} [config]
 */
export function initFeaturesPage(config = {}) {
  try {
    initFeaturesVoicesSection();
  } catch (e) {
    console.error("Lỗi khởi tạo Features Voices:", e);
  }

  try {
    initFeaturesSimpleGenSection();
  } catch (e) {
    console.error("Lỗi khởi tạo Features Simple Gen:", e);
  }

  try {
    initFeaturesSpeedSection();
  } catch (e) {
    console.error("Lỗi khởi tạo Features Speed:", e);
  }
}


