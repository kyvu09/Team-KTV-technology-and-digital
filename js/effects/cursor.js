export function initCustomCursor() {
  const cursor = document.getElementById("custom-cursor");
  const dot = document.getElementById("cursor-dot");

  // 1. Chỉ kích hoạt trên thiết bị có chuột (pointer: fine), ẩn hoàn toàn DOM trên thiết bị cảm ứng
  if (!window.matchMedia("(pointer: fine)").matches) {
    if (cursor) cursor.style.display = "none";
    if (dot) dot.style.display = "none";
    return;
  }

  if (!cursor || !dot) return;

  let mouseX = -100;
  let mouseY = -100;
  let cursorX = -100;
  let cursorY = -100;
  let isTouchActive = false;

  // 2. Xử lý thiết bị lai (Laptop màn hình cảm ứng / Surface / iPad bàn phím):
  // Khi chạm tay vào màn hình -> Ẩn ngay con trỏ để không giật lag hoặc xung đột
  window.addEventListener(
    "touchstart",
    () => {
      isTouchActive = true;
      cursor.style.opacity = "0";
      dot.style.opacity = "0";
    },
    { passive: true },
  );

  // Khi người dùng di chuột trở lại -> Bật lại con trỏ mượt mà
  window.addEventListener(
    "mousemove",
    (e) => {
      if (isTouchActive) {
        isTouchActive = false;
        cursor.style.opacity = "1";
        dot.style.opacity = "1";
      }
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    },
    { passive: true },
  );

  // 3. Chuyển động quán tính mượt mà cho vòng ngoài (lerp)
  function renderCursor() {
    if (!isTouchActive) {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0)`;
    }
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
