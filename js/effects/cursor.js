export function initCustomCursor() {
  // Chỉ kích hoạt trên thiết bị có chuột (pointer: fine)
  if (!window.matchMedia("(pointer: fine)").matches) return;

  const cursor = document.getElementById("custom-cursor");
  const dot = document.getElementById("cursor-dot");
  if (!cursor || !dot) return;

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;

  window.addEventListener("mousemove", (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
  });

  // Chuyển động quán tính mượt mà cho vòng ngoài (lerp)
  function renderCursor() {
    cursorX += (mouseX - cursorX) * 0.15;
    cursorY += (mouseY - cursorY) * 0.15;
    cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    requestAnimationFrame(renderCursor);
  }
  requestAnimationFrame(renderCursor);

  // Hiệu ứng tương tác khi hover vào các phần tử
  const updateHoverTargets = () => {
    const interactiveEls = document.querySelectorAll(
      "a, button, input, select, textarea, .feature-card, .play-sample-btn, .audio-pill, summary",
    );

    interactiveEls.forEach((el) => {
      el.addEventListener("mouseenter", () => {
        cursor.classList.add("cursor-hover");
        if (
          el.classList.contains("play-sample-btn") ||
          el.hasAttribute("data-play-audio")
        ) {
          cursor.classList.add("cursor-audio");
        }
      });
      el.addEventListener("mouseleave", () => {
        cursor.classList.remove("cursor-hover", "cursor-audio");
      });
    });
  };

  updateHoverTargets();
  // Cập nhật lại khi DOM thay đổi
  const observer = new MutationObserver(updateHoverTargets);
  const app = document.getElementById("app");
  if (app) observer.observe(app, { childList: true, subtree: true });
}
