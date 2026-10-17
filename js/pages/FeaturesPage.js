// ============================================================================
// FeaturesPage.js — Trang Tính năng Chuyên sâu (Dedicated Features Page)
// Bố cục gồm đúng 3 Section hoàn chỉnh theo yêu cầu:
// 1. Section Đa giọng đọc (Kho chất giọng ba miền & trình phát mẫu tương tác)
// 2. Section Tạo giọng đọc đơn giản (Tạo âm thanh từ dữ liệu văn bản)
// 3. Section Tốc độ giọng đọc (Bộ điều khiển tốc độ thời gian thực 0.5x - 2.0x)
// (Không gọi Section Kiểm soát toàn diện trải nghiệm giọng nói AI / Bento Grid)
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
 * Render Trang Tính năng chuyên biệt gồm đúng 3 Section cốt lõi
 * @param {Object} config
 * @returns {string} HTML markup
 */
export function renderFeaturesPage(config) {
  const sections = config.sections || [];
  const featuresData = sections.find((s) => s.type === "features") || {};
  const brandName = config?.brand?.name || "";
  const pageHeaderCfg = featuresData.pageHeader || {};
  const fallbackImg = featuresData.items?.[0]?.image || "";

  const pageHeaderHtml = renderPageHeader({
    title: pageHeaderCfg.title || "Tính Năng Công Nghệ",
    subtitle:
      pageHeaderCfg.subtitle ||
      `Khám phá các đột phá công nghệ và tính năng chuyên sâu của ${brandName}.`,
    bgImage: pageHeaderCfg.bgImage || fallbackImg,
    bgAlt: pageHeaderCfg.bgAlt || `Không gian công nghệ và tính năng ${brandName}`,
    themeClass: "page-header-theme-features",
    breadcrumb: "Tính năng",
  });

  return `
    <div class="page-wrapper page-features" id="page-features">
      <!-- Section Hero: Dùng component chung PageHeader đồng bộ -->
      ${pageHeaderHtml}

      <!-- 1. Section Đa giọng đọc (Bắc - Trung - Nam) -->
      ${renderFeaturesVoicesSection(config)}

      <!-- 2. Section Tạo giọng đọc đơn giản từ văn bản -->
      ${renderFeaturesSimpleGenSection(config)}

      <!-- 3. Section Tốc độ giọng đọc (0.5x - 2.0x) -->
      ${renderFeaturesSpeedSection(config)}
    </div>`.trim();
}

/**
 * Khởi tạo tương tác trang Tính năng cho đúng 3 Section
 * @param {Object} [config]
 */
export function initFeaturesPage(config) {
  // 1. Tương tác Bộ lọc & Phát âm thanh Đa giọng đọc
  try {
    initFeaturesVoicesSection();
  } catch (e) {
    console.error("Lỗi khởi tạo Features Voices:", e);
  }

  // 2. Tương tác Section Tạo giọng đọc đơn giản
  try {
    initFeaturesSimpleGenSection();
  } catch (e) {
    console.error("Lỗi khởi tạo Features Simple Gen:", e);
  }

  // 3. Tương tác Bàn điều khiển Tốc độ đọc 0.5x - 2.0x
  try {
    initFeaturesSpeedSection();
  } catch (e) {
    console.error("Lỗi khởi tạo Features Speed:", e);
  }
}

