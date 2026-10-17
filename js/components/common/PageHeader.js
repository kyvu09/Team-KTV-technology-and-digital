import { esc } from "../../core/esc.js";

/**
 * Render Header Banner cho từng trang con riêng biệt
 * @param {Object} props
 * @param {string} props.title - Tiêu đề trang
 * @param {string} [props.subtitle] - Mô tả phụ
 * @param {string} [props.badge] - Nhãn huy hiệu nhỏ
 * @param {string} [props.icon] - Biểu tượng FontAwesome
 * @param {string} [props.bgImage] - Đường dẫn ảnh nền Hero
 * @param {string} [props.bgAlt] - Mô tả ảnh nền
 * @param {string} [props.themeClass] - Lớp giao diện màu sắc riêng (theme-features, theme-about, theme-faq, theme-contact)
 * @returns {string} HTML markup
 */
export function renderPageHeader({
  title = "",
  subtitle = "",
  badge = "",
  icon = "",
  bgImage = "",
  bgAlt = "",
  themeClass = "",
} = {}) {
  const badgeTheme = themeClass
    ? `badge-${themeClass.replace("page-header-theme-", "")}`
    : "badge-primary";

  return `
    <section class="page-header-banner ${esc(themeClass)}" aria-label="${esc(title)}">
      ${
        bgImage
          ? `
      <!-- Lớp ảnh nền điện ảnh Hero với hiệu ứng chuyển sắc và ánh sáng tương thích -->
      <div class="page-header-backdrop" aria-hidden="true">
        <img src="${esc(bgImage)}" alt="${esc(bgAlt || title)}" class="page-header-bg-img" loading="eager" decoding="async" />
        <div class="page-header-backdrop-overlay"></div>
        <div class="page-header-backdrop-glow"></div>
      </div>`
          : `
      <div class="page-header-glow" aria-hidden="true"></div>`
      }

      <div class="container page-header-inner text-center">
        <h1 class="page-header-title reveal">${esc(title)}</h1>

        ${
          subtitle
            ? `
        <p class="page-header-subtitle reveal">${esc(subtitle)}</p>`
            : ""
        }
      </div>
    </section>`.trim();
}
