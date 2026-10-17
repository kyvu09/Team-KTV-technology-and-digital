// ============================================================================
// ContactInfo.js — Cột thông tin liên hệ và danh sách các kênh kết nối
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render cột thông tin liên hệ và các kênh hotline/email/địa chỉ
 * @param {Object} props
 * @param {string} [props.eyebrow]
 * @param {string} props.title
 * @param {string} [props.description]
 * @param {Array<Object>} [props.channels=[]] - Danh sách { label, value }
 * @returns {string} HTML markup
 */
export function renderContactInfo({
  eyebrow = "",
  title = "",
  description = "Để lại thông tin, đội ngũ chuyên gia của chúng tôi sẽ liên hệ tư vấn giải pháp âm thanh tùy biến cho thương hiệu của bạn.",
  channels = [],
} = {}) {
  const channelsHtml = (channels || [])
    .map((c) => {
      let icon = "fa-solid fa-envelope";
      const lbl = (c.label || "").toLowerCase();
      if (lbl.includes("hotline") || lbl.includes("điện thoại")) {
        icon = "fa-solid fa-phone";
      } else if (lbl.includes("địa chỉ")) {
        icon = "fa-solid fa-location-dot";
      }

      return `
        <li class="channel-item">
          <div class="channel-icon"><i class="${icon}"></i></div>
          <div class="channel-text">
            <span class="channel-label">${esc(c.label)}</span>
            <span class="channel-value">${esc(c.value)}</span>
          </div>
        </li>`;
    })
    .join("");

  return `
    <div class="contact-info-col reveal">
      ${eyebrow ? `<p class="eyebrow"><i class="fa-solid fa-paper-plane"></i> ${esc(eyebrow)}</p>` : ""}
      <h2 class="section-title">${esc(title)}</h2>
      <p class="contact-desc">${esc(description)}</p>

      <ul class="contact-channels">
        ${channelsHtml}
      </ul>
    </div>`.trim();
}
