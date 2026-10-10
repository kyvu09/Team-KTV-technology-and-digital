export function initFaqAccordion() {
  const faqItems = document.querySelectorAll(".faq-item");

  faqItems.forEach((item) => {
    const trigger = item.querySelector(".faq-question");
    const content = item.querySelector(".faq-answer");
    if (!trigger || !content) return;

    trigger.addEventListener("click", () => {
      const isOpen = item.classList.contains("active");

      // Tùy chọn đóng các thẻ khác để tập trung
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
