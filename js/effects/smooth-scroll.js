export function initSmoothScroll() {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return null;
  }

  if (typeof window.Lenis === "undefined") {
    console.info("Lenis không tìm thấy, sử dụng cuộn gốc trình duyệt.");
    return null;
  }

  const lenis = new window.Lenis({
    duration: 1.0,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: "vertical",
    smoothWheel: true,
    wheelMultiplier: 1.0,
    touchMultiplier: 1.5,
  });

  // Tích hợp với GSAP ScrollTrigger nếu có
  if (window.gsap && window.ScrollTrigger) {
    lenis.on("scroll", window.ScrollTrigger.update);
    window.gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });
    // Bật lagSmoothing mượt mà thay vì tắt bằng 0 (tránh giật khựng khi tải nặng)
    window.gsap.ticker.lagSmoothing(500, 33);
  } else {
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // Hỗ trợ nhảy mượt khi bấm link #anchor
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId && targetId !== "#") {
        const targetEl = document.querySelector(targetId);
        if (targetEl) {
          e.preventDefault();
          lenis.scrollTo(targetEl, { offset: -80 });
        }
      }
    });
  });

  window.__lenis = lenis;
  return lenis;
}

export function scrollToTarget(target, offset = -80) {
  if (window.__lenis) {
    window.__lenis.scrollTo(target, { offset });
  } else if (typeof target === "string") {
    const el = document.querySelector(target);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  } else if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
  } else if (target instanceof HTMLElement) {
    target.scrollIntoView({ behavior: "smooth" });
  }
}
