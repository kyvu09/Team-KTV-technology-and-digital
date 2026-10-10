export function initBentoSpotlight(selector = ".bento-card, .feature-card") {
  const cards = document.querySelectorAll(selector);

  cards.forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      // Cập nhật vị trí chuột vào CSS variables của thẻ cho hiệu ứng spotlight phát sáng
      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--mouse-x", `-500px`);
      card.style.setProperty("--mouse-y", `-500px`);
    });
  });
}
