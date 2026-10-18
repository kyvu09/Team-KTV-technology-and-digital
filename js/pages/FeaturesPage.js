// ============================================================================
// FeaturesPage.js — Trang Tính năng Chuyên sâu (Dedicated Features Page)
// Tự động thích ứng White-Label theo cấu hình thương hiệu:
// 1. Page Header đồng bộ nhận diện thương hiệu
// 2. Section Tính năng cốt lõi (Bento Grid / 3D Stack từ file JSON / AI)
// 3. Module âm thanh chuyên sâu (chỉ hiển thị với thương hiệu AI Voice như ViVoice)
// ============================================================================

import { renderPageHeader } from "../components/common/PageHeader.js";
import {
  renderFeatures,
  initFeaturesInteractions,
} from "../sections/Features.js";
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
 * Kiểm tra xem thương hiệu có phải là thương hiệu Voice / Audio chuyên biệt hay không
 * @param {Object} config
 * @returns {boolean}
 */
function isVoiceStudioBrand(config = {}) {
  const brandName = (config?.brand?.name || "").toLowerCase();
  const brandKey = (config?.brandKey || config?.brand?.id || config?.brand?.key || "").toLowerCase();
  return (
    Boolean(config?.featuresStudio) ||
    Boolean(config?.voices) ||
    brandKey.includes("vivoice") ||
    brandName.includes("vivoice")
  );
}

/**
 * Render Trang Tính năng chuyên biệt
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

  const hasVoiceFeatures = isVoiceStudioBrand(config);

  return `
    <div class="page-wrapper page-features" id="page-features">
      <!-- Section Hero: Dùng component chung PageHeader đồng bộ -->
      ${pageHeaderHtml}

      <!-- Section Tính năng & Đột phá công nghệ / sản phẩm cốt lõi (Bento Grid hoặc 3D Stack từ AI/JSON) -->
      <div class="page-features-core">
        ${renderFeatures(featuresData, "page-features-showcase")}
      </div>

      <!-- Module tính năng âm thanh chuyên sâu (chỉ hiển thị với thương hiệu AI Voice như ViVoice) -->
      ${
        hasVoiceFeatures
          ? `
        <!-- 1. Section Đa giọng đọc (Bắc - Trung - Nam) -->
        ${renderFeaturesVoicesSection(config)}

        <!-- 2. Section Tạo giọng đọc đơn giản từ văn bản -->
        ${renderFeaturesSimpleGenSection(config)}

        <!-- 3. Section Tốc độ giọng đọc (0.5x - 2.0x) -->
        ${renderFeaturesSpeedSection(config)}
      `
          : ""
      }
    </div>`.trim();
}

/**
 * Khởi tạo tương tác trang Tính năng
 * @param {Object} [config]
 */
export function initFeaturesPage(config = {}) {
  // 1. Tương tác Khối tính năng cốt lõi (Bento Grid / 3D Stack)
  try {
    initFeaturesInteractions();
  } catch (e) {
    console.error("Lỗi khởi tạo Features Core:", e);
  }

  // 2. Tương tác các module âm thanh (nếu là thương hiệu AI Voice)
  if (isVoiceStudioBrand(config)) {
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
}

