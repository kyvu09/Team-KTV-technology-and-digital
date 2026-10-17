// ============================================================================
// FaqAccordion.js — Khối Bố cục FAQ Accordion Đóng Mở (Accordion Block)
// Hợp nhất: Danh sách Accordion, từng Thẻ câu hỏi con và logic click mở rộng
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render một mục câu hỏi thường gặp dạng đóng/mở
 */
function renderAccordionItem(item, idx = 0) {
  const isActive = idx === 0;

  return `
    <div class="faq-item ${isActive ? "active" : ""}">
      <button class="faq-question" type="button" aria-expanded="${isActive ? "true" : "false"}">
        <span class="q-text">${esc(item.question)}</span>
        <span class="faq-icon-wrap" aria-hidden="true">
          <i class="fa-solid fa-plus"></i>
        </span>
      </button>
      <div class="faq-answer" ${isActive ? 'style="max-height: 200px;"' : ""}>
        <div class="faq-answer-inner">
          <p>${esc(item.answer)}</p>
        </div>
      </div>
    </div>`.trim();
}

/**
 * Render toàn bộ danh sách FAQ Accordion
 * @param {Object} props
 * @param {Array<Object>} [props.items=[]]
 * @returns {string} HTML markup
 */
export function renderFaqAccordion({ items = [] } = {}) {
  const itemsMarkup = (items || [])
    .map((item, idx) => renderAccordionItem(item, idx))
    .join("");

  return `
    <div class="faq-accordion" id="faq-accordion">
      ${itemsMarkup}
    </div>`.trim();
}

/**
 * Khởi tạo hiệu ứng đóng/mở Accordion
 */
export function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-question");
    const content = item.querySelector(".faq-answer");
    if (!trigger || !content) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      faqItems.forEach((other) => {
        if (other !== item) {
          other.classList.remove("active");
          const otherTrigger = other.querySelector(".faq-question");
          const otherContent = other.querySelector(".faq-answer");
          if (otherTrigger) otherTrigger.setAttribute("aria-expanded", "false");
          if (otherContent) otherContent.style.maxHeight = null;
        }
      });

      if (isOpen) {
        item.classList.remove("active");
        trigger.setAttribute("aria-expanded", "false");
        content.style.maxHeight = null;
      } else {
        item.classList.add("active");
        trigger.setAttribute("aria-expanded", "true");
        content.style.maxHeight = `${content.scrollHeight + 20}px`;
      }
    });
  });
}

// Giữ alias tương thích ngược
export { renderAccordionItem as renderFaqAccordionItem };
