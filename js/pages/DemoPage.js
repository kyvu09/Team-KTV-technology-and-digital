// ============================================================================
// DemoPage.js — Trang Trải nghiệm / Phòng thu Chuyên sâu (Dedicated Studio Page)
// Bố cục gồm 2 phần chính:
// 1. Hero Trải Nghiệm: Dải sách chạy 2 luồng (Marquee Background) + Tiêu đề ngắn gọn
// 2. Bàn điều khiển Studio Console chuyên sâu (Demo Studio)
// ============================================================================

import { renderDemoHero, initDemoHero } from "../components/demo/DemoHero.js";
import { renderDemo, initDemoInteractions } from "../sections/Demo.js";

/**
 * Render Trang Trải nghiệm phòng thu chuyên biệt
 * @param {Object} config
 * @returns {string} HTML markup
 */
export function renderDemoPage(config) {
  const sections = config.sections || [];
  const demoData = sections.find((s) => s.type === "demo") || {};

  return `
    <div class="page-wrapper page-demo" id="page-demo">
      <!-- 1. Hero Trang Trải Nghiệm: Dải sách chạy 2 luồng & Tiêu đề ngắn gọn -->
      ${renderDemoHero({
        title: demoData.pageHeader?.title || demoData.title || `Trải Nghiệm Công Nghệ ${config?.brand?.name || ""}`,
        subtitle:
          demoData.pageHeader?.subtitle ||
          demoData.subtitle ||
          `Trải nghiệm trực tiếp giải pháp và tương tác trong thời gian thực cùng ${config?.brand?.name || ""}.`,
        brand: config?.brand,
        brandKey: config?.brandKey,
        brandName: config?.brand?.name,
        config: config,
      })}

      <!-- 2. Bàn điều khiển Studio Console chuyên sâu (Demo Studio) -->
      ${renderDemo(demoData)}
    </div>`.trim();
}

/**
 * Khởi tạo tương tác phòng thu
 * @param {Object} config
 */
export function initDemoPage(config) {
  const sections = config.sections || [];
  const demoData = sections.find((s) => s.type === "demo") || {};

  // 1. Tương tác cuộn nút CTA của Demo Hero
  try {
    initDemoHero();
  } catch (e) {
    console.error("Lỗi khởi tạo Demo Hero:", e);
  }

  // 2. Tương tác Bàn điều khiển Studio Console (Waveform, Web Speech & Visualizer)
  try {
    initDemoInteractions(demoData);
  } catch (e) {
    console.error("Lỗi khởi tạo Demo tương tác:", e);
  }
}
