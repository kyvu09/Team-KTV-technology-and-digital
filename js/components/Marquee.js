// ============================================================================
// Marquee.js — Dải trượt vô tận hai chiều cho Đối tác & Đánh giá
// ============================================================================

export function initMarquee(selector = ".marquee-track") {
  const tracks = document.querySelectorAll(selector);

  tracks.forEach((track) => {
    // Nhân bản nội dung nếu chưa đủ độ rộng để chạy liên tục không đứt đoạn
    const content = track.innerHTML;
    track.innerHTML = content + content;

    track.addEventListener("mouseenter", () => {
      track.style.animationPlayState = "paused";
    });
    track.addEventListener("mouseleave", () => {
      track.style.animationPlayState = "running";
    });
  });
}
