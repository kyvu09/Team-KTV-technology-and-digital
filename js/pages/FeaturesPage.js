// ============================================================================
// FeaturesPage.js — Trang Tính năng Chuyên sâu (Dedicated Features Page)
// Bố cục gồm đúng 3 Section hoàn chỉnh theo yêu cầu:
// 1. Section Hero (Hero trang tính năng & chỉ số công nghệ)
// 2. Section Đa giọng đọc (Kho chất giọng ba miền & trình phát mẫu tương tác)
// 3. Section Tốc độ giọng đọc (Bộ điều khiển tốc độ thời gian thực 0.5x - 2.0x)
// ============================================================================

import { renderPageHeader } from "../components/common/PageHeader.js";
import {
  renderFeatures,
  initFeaturesInteractions,
} from "../sections/Features.js";
import { renderDemo, initDemoInteractions } from "../sections/Demo.js";
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
 * Render Trang Tính năng chuyên biệt
 * 1. Section Hero (Banner nhận diện thương hiệu)
 * 2. Section Đột phá công nghệ cốt lõi của thương hiệu (Bento / 3D Stack từ file JSON)
 * 3. Trình điều khiển tương tác trực tiếp theo từng thương hiệu (hoặc Studio 3 chất giọng đối với ViVoice)
 * @param {Object} config
 * @returns {string} HTML markup
 */
export function renderFeaturesPage(config) {
  const sections = config.sections || [];
  const featuresData = sections.find((s) => s.type === "features") || {};
  const demoData = sections.find((s) => s.type === "demo") || {};
  const brandName = config?.brand?.name || "";
  const pageHeaderCfg = featuresData.pageHeader || {};
  const fallbackImg = featuresData.items?.[0]?.image || "";

  const pageHeaderHtml = renderPageHeader({
    title: pageHeaderCfg.title || featuresData.title || "Tính Năng Công Nghệ",
    subtitle:
      pageHeaderCfg.subtitle ||
      featuresData.subtitle ||
      `Khám phá các đột phá công nghệ và tính năng chuyên sâu của ${brandName}.`,
    bgImage: pageHeaderCfg.bgImage || fallbackImg,
    bgAlt: pageHeaderCfg.bgAlt || `Không gian công nghệ và tính năng ${brandName}`,
    themeClass: "page-header-theme-features",
    breadcrumb: "Tính năng",
  });

  const isVoiceStudioBrand =
    brandName.toLowerCase().includes("vivoice") || Boolean(config.voices);

  return `
    <div class="page-wrapper page-features" id="page-features">
      <!-- 1. Section Hero: Dùng component chung PageHeader đồng bộ -->
      ${pageHeaderHtml}

      <!-- 2. Section Tính năng & Đột phá công nghệ cốt lõi theo từng thương hiệu -->
      <div class="page-features-core">
        ${renderFeatures(featuresData, "page-features-showcase")}
      </div>

      <!-- 3. Bàn điều khiển trải nghiệm tính năng thực tế của từng thương hiệu -->
      ${demoData && !isVoiceStudioBrand ? renderDemo(demoData) : ""}

      <!-- 4. Module tính năng chuyên biệt chỉ dành cho thương hiệu Giọng đọc Studio -->
      ${
        isVoiceStudioBrand
          ? `
        <!-- Section Đa giọng đọc (Bắc - Trung - Nam) -->
        ${renderFeaturesVoicesSection(config)}

        <!-- Section Tạo giọng đọc đơn giản từ văn bản -->
        ${renderFeaturesSimpleGenSection(config)}

        <!-- Section Tốc độ giọng đọc (0.5x - 2.0x) -->
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
export function initFeaturesPage(config) {
  const brandName = config?.brand?.name || "";
  const isVoiceStudioBrand =
    brandName.toLowerCase().includes("vivoice") || Boolean(config?.voices);
  const sections = config?.sections || [];
  const demoData = sections.find((s) => s.type === "demo") || {};

  // 1. Tương tác Khối tính năng cốt lõi (Bento Grid / 3D Stack)
  try {
    initFeaturesInteractions();
  } catch (e) {
    console.error("Lỗi khởi tạo Features Core:", e);
  }

  if (isVoiceStudioBrand) {
    // 2. Tương tác Bộ lọc & Phát âm thanh Đa giọng đọc
    try {
      initFeaturesVoicesSection();
    } catch (e) {
      console.error("Lỗi khởi tạo Features Voices:", e);
    }

    // 3. Tương tác Section Tạo giọng đọc đơn giản
    try {
      initFeaturesSimpleGenSection();
    } catch (e) {
      console.error("Lỗi khởi tạo Features Simple Gen:", e);
    }

    // 4. Tương tác Bàn điều khiển Tốc độ đọc 0.5x - 2.0x
    try {
      initFeaturesSpeedSection();
    } catch (e) {
      console.error("Lỗi khởi tạo Features Speed:", e);
    }
  } else {
    // Tương tác Bàn điều khiển Trải nghiệm Tính năng theo từng thương hiệu
    try {
      initDemoInteractions(demoData);
    } catch (e) {
      console.error("Lỗi khởi tạo Demo Interactions:", e);
    }
  }
}

