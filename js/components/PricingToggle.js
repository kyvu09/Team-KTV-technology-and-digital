// ============================================================================
// PricingToggle.js — Chuyển đổi chu kỳ thanh toán Tháng / Năm mượt mà
// ============================================================================

export function initPricingToggle() {
  const toggleBtn = document.getElementById("pricing-toggle");
  if (!toggleBtn) return;

  const priceEls = document.querySelectorAll(".price-card .price");
  let isYearly = false;

  toggleBtn.addEventListener("click", () => {
    isYearly = !isYearly;
    toggleBtn.classList.toggle("is-yearly", isYearly);
    toggleBtn.setAttribute("aria-checked", isYearly ? "true" : "false");

    priceEls.forEach((el) => {
      const monthly = el.getAttribute("data-monthly");
      const yearly = el.getAttribute("data-yearly");
      const unit = el.querySelector(".price-unit");

      // Hiệu ứng đổi số mượt
      el.style.opacity = "0.3";
      el.style.transform = "translateY(5px)";

      setTimeout(() => {
        const valText = isYearly ? yearly || monthly : monthly;
        const mainText = el.childNodes[0];
        if (mainText && mainText.nodeType === Node.TEXT_NODE) {
          mainText.textContent = valText;
        } else {
          el.innerHTML = `${valText} <span class="price-unit">${isYearly ? "/năm" : "/tháng"}</span>`;
        }
        if (unit) {
          unit.textContent = isYearly ? "/năm" : "/tháng";
        }
        el.style.opacity = "1";
        el.style.transform = "translateY(0)";
      }, 150);
    });
  });
}
