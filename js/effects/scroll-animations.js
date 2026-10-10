export function initScrollAnimations(config = {}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    // Fallback nếu người dùng tắt chuyển động
    document
      .querySelectorAll(".reveal, .reveal-h")
      .forEach((el) => el.classList.add("visible"));
    return;
  }

  const effects = config.effects || {};

  // 1. Khởi tạo thanh tiến trình cuộn trang & Nút cuộn nhanh Back to top
  if (effects.scrollProgress !== false) {
    initScrollProgressBar();
  }
  initBackToTopButton();

  // 2. Fallback IntersectionObserver nếu GSAP không có sẵn
  if (!window.gsap || !window.ScrollTrigger) {
    console.info(
      "GSAP ScrollTrigger không tìm thấy, kích hoạt IntersectionObserver mặc định.",
    );
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 },
    );
    document
      .querySelectorAll(".reveal, .reveal-h")
      .forEach((el) => io.observe(el));
    return;
  }

  const { gsap, ScrollTrigger } = window;
  gsap.registerPlugin(ScrollTrigger);

  // 3. Animate Hero elements khi vừa load xong trang
  const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
  heroTl
    .from(".hero .badge", { opacity: 0, y: -20, duration: 0.6, delay: 0.1 })
    .from(".hero h1", { opacity: 0, y: 30, duration: 0.8 }, "-=0.3")
    .from(".hero .lead", { opacity: 0, y: 20, duration: 0.7 }, "-=0.4")
    .from(
      ".hero-cta .btn",
      { opacity: 0, scale: 0.9, stagger: 0.15, duration: 0.6 },
      "-=0.4",
    )
    .from("#hero-voice-orb", { opacity: 0, scale: 0.8, duration: 1 }, "-=0.8")
    .from("#hero-scroll-cue", { opacity: 0, y: 20, duration: 0.6 }, "-=0.4");

  // 4. Mờ dần nút cuộn Hero Scroll Cue khi người dùng bắt đầu cuộn
  const scrollCue = document.getElementById("hero-scroll-cue");
  if (scrollCue) {
    gsap.to(scrollCue, {
      scrollTrigger: {
        trigger: "#hero",
        start: "top top",
        end: "20% top",
        scrub: true,
      },
      opacity: 0,
      y: 20,
      pointerEvents: "none",
    });
  }

  // 6. Reveal hiệu ứng Tia Laser Sóng Âm (Section Laser Beam) & Tiêu đề
  gsap.utils.toArray(".section").forEach((sec) => {
    const title = sec.querySelector(".section-title");
    const eyebrow = sec.querySelector(".eyebrow");
    const sub = sec.querySelector(".section-sub");

    // Tạo tia laser âm thanh phía dưới tiêu đề nếu chưa có
    if (
      title &&
      !title.nextElementSibling?.classList?.contains("section-laser-beam")
    ) {
      const beam = document.createElement("div");
      beam.className = "section-laser-beam";
      beam.setAttribute("aria-hidden", "true");
      title.parentNode.insertBefore(beam, title.nextSibling);

      gsap.fromTo(
        beam,
        { scaleX: 0, opacity: 0 },
        {
          scaleX: 1,
          opacity: 1,
          duration: 1,
          ease: "power2.out",
          scrollTrigger: {
            trigger: title,
            start: "top 85%",
            toggleActions: "play none none none",
          },
        },
      );
    }

    if (eyebrow) {
      gsap.from(eyebrow, {
        scrollTrigger: { trigger: eyebrow, start: "top 88%" },
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power2.out",
      });
    }

    if (title) {
      gsap.from(title, {
        scrollTrigger: { trigger: title, start: "top 85%" },
        opacity: 0,
        y: 35,
        duration: 0.8,
        ease: "power3.out",
      });
    }

    if (sub) {
      gsap.from(sub, {
        scrollTrigger: { trigger: sub, start: "top 82%" },
        opacity: 0,
        y: 25,
        duration: 0.7,
        delay: 0.1,
        ease: "power2.out",
      });
    }
  });

  // 7. Hiệu ứng nâng khối 3D (3D Perspective Tilt on Scroll) cho Bento, Pricing & Testimonial Cards
  const cardsToTilt = [
    { selector: ".bento-card", stagger: 0.12 },
    { selector: ".price-card", stagger: 0.14 },
    { selector: ".testimonial-card", stagger: 0.12 },
    { selector: ".faq-item", stagger: 0.08 },
    { selector: ".stat-card", stagger: 0.1 },
  ];

  cardsToTilt.forEach(({ selector, stagger }) => {
    const cards = gsap.utils.toArray(selector);
    if (!cards.length) return;

    cards.forEach((card, idx) => {
      gsap.fromTo(
        card,
        {
          opacity: 0,
          y: 50,
          rotationX: 10,
          scale: 0.95,
          transformPerspective: 1000,
          transformOrigin: "50% 100%",
        },
        {
          opacity: 1,
          y: 0,
          rotationX: 0,
          scale: 1,
          duration: 0.85,
          delay: (idx % 3) * stagger,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none none",
          },
          onComplete: () => {
            gsap.set(card, { clearProps: "transform" });
          },
        },
      );
    });
  });

  // 7b. Hiệu ứng vuốt hiện từng item Features xen kẽ: Trái -> Phải -> Trái -> Phải
  // Chuyển động chậm rãi, mượt mà (1.4s), khi vuốt ngược lên trên sẽ thu hồi biến mất ngược lại
  const hCards = gsap.utils.toArray(".feature-horizontal-card");
  if (hCards.length) {
    hCards.forEach((card, idx) => {
      const dir =
        card.getAttribute("data-reveal-dir") ||
        (idx % 2 === 0 ? "left" : "right");
      const fromX = dir === "right" ? 140 : -140;

      gsap.fromTo(
        card,
        {
          opacity: 0,
          x: fromX,
          scale: 0.95,
        },
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 1.4,
          ease: "power2.out",
          scrollTrigger: {
            trigger: card,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        },
      );
    });
  }

  // 8. Studio Console Entrance & Scrub Zoom
  const studioConsole = document.querySelector(".studio-console");
  if (studioConsole) {
    gsap.fromTo(
      studioConsole,
      {
        opacity: 0,
        y: 60,
        scale: 0.93,
        transformPerspective: 1200,
        rotationX: 8,
      },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        rotationX: 0,
        duration: 1,
        ease: "power3.out",
        scrollTrigger: {
          trigger: studioConsole,
          start: "top 85%",
          toggleActions: "play none none none",
        },
      },
    );
  }

  // 9. About Section Image & Floating Badge Parallax
  const aboutImgWrapper = document.querySelector(".about-image-wrapper");
  const aboutBadge = document.querySelector(".about-floating-badge");
  if (aboutImgWrapper && aboutBadge) {
    gsap.from(aboutImgWrapper, {
      scrollTrigger: { trigger: aboutImgWrapper, start: "top 80%" },
      opacity: 0,
      x: -40,
      duration: 1,
      ease: "power3.out",
    });

    gsap.from(aboutBadge, {
      scrollTrigger: { trigger: aboutImgWrapper, start: "top 75%" },
      opacity: 0,
      y: 40,
      scale: 0.9,
      duration: 0.8,
      delay: 0.3,
      ease: "back.out(1.5)",
    });
  }

  // 10. Số liệu đếm tăng (Number Counter Animation)
  document.querySelectorAll("[data-counter]").forEach((counterEl) => {
    const targetVal = parseFloat(counterEl.getAttribute("data-counter")) || 0;
    const suffix = counterEl.getAttribute("data-suffix") || "";
    const prefix = counterEl.getAttribute("data-prefix") || "";
    const isDecimal = String(targetVal).includes(".");

    const counterObj = { val: 0 };
    gsap.to(counterObj, {
      scrollTrigger: {
        trigger: counterEl,
        start: "top 85%",
        once: true,
      },
      val: targetVal,
      duration: 2,
      ease: "power2.out",
      onUpdate: () => {
        counterEl.textContent = `${prefix}${
          isDecimal
            ? counterObj.val.toFixed(1)
            : Math.floor(counterObj.val).toLocaleString("vi-VN")
        }${suffix}`;
      },
    });
  });

  // 11. Hiệu ứng nút bấm từ tính (Magnetic Buttons)
  document.querySelectorAll(".btn-magnetic").forEach((btn) => {
    btn.addEventListener("mousemove", (e) => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(btn, {
        x: x * 0.25,
        y: y * 0.25,
        duration: 0.3,
        ease: "power2.out",
      });
    });
    btn.addEventListener("mouseleave", () => {
      gsap.to(btn, { x: 0, y: 0, duration: 0.5, ease: "elastic.out(1, 0.4)" });
    });
  });
}

/** Khởi tạo thanh tiến trình cuộn trang */
function initScrollProgressBar() {
  const fill = document.getElementById("scroll-progress-fill");
  if (!fill) return;

  function update() {
    const winScroll = window.scrollY || document.documentElement.scrollTop;
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;
    const scrolled = height > 0 ? (winScroll / height) * 100 : 0;
    fill.style.width = `${scrolled}%`;
  }

  window.addEventListener("scroll", update, { passive: true });
  update();
}

/** Khởi tạo nút cuộn nhanh lên đầu trang */
function initBackToTopButton() {
  const topBtn = document.getElementById("scroll-top-btn");
  if (!topBtn) return;

  function checkScroll() {
    const winScroll = window.scrollY || document.documentElement.scrollTop;
    if (winScroll > 450) {
      topBtn.classList.add("is-visible");
    } else {
      topBtn.classList.remove("is-visible");
    }
  }

  window.addEventListener("scroll", checkScroll, { passive: true });
  checkScroll();

  topBtn.addEventListener("click", () => {
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { duration: 1.2 });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  });
}
