import { esc } from "../../core/esc.js";

/**
 * Render khối tiêu đề cho bất kỳ section nào
 * @param {Object} props
 * @param {string} [props.eyebrow] - Dòng chữ nhỏ trên tiêu đề
 * @param {string} [props.eyebrowIcon] - Icon FontAwesome cho eyebrow (mặc định: fa-solid fa-sparkles)
 * @param {string} [props.title] - Tiêu đề chính h2
 * @param {string} [props.subtitle] - Đoạn văn mô tả phụ bên dưới
 * @param {boolean} [props.centered=true] - Căn giữa nội dung hay căn trái
 * @param {string} [props.className=""] - Class CSS bổ sung
 * @returns {string} Chuỗi HTML của header
 */
export function renderSectionHeader({
  eyebrow = "",
  eyebrowIcon = "fa-solid fa-sparkles",
  title = "",
  subtitle = "",
  centered = true,
  className = "",
} = {}) {
  const alignClass = centered ? "text-center" : "text-start";
  const subAlignClass = centered ? "mx-auto" : "";

  return `
    <div class="section-header ${alignClass} ${className}">
      ${
        eyebrow
          ? `<p class="eyebrow reveal"><i class="${esc(eyebrowIcon)}"></i> ${esc(eyebrow)}</p>`
          : ""
      }
      ${title ? `<h2 class="section-title reveal">${esc(title)}</h2>` : ""}
      ${
        subtitle
          ? `<p class="section-sub ${subAlignClass} reveal">${esc(subtitle)}</p>`
          : ""
      }
    </div>`.trim();
}
