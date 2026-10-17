// ============================================================================
// TestimonialMarquee.js — Dải trượt nhận xét vô tận (Infinite Marquee Slider)
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render một thẻ nhận xét trong dải băng chuyền
 */
function renderCard(t, idx = 0) {
  const avatarHtml = t.avatar
    ? `<img src="${esc(t.avatar)}" alt="${esc(t.name)}" class="avatar-img" loading="lazy" />`
    : esc((t.name || "A").charAt(0));

  return `
    <wl-card class="testimonial-card" data-index="${idx}">
      <div class="testimonial-card-header">
        <div class="testimonial-stars" aria-label="5 sao">
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
          <i class="fa-solid fa-star"></i>
        </div>
        <div class="testimonial-quote-icon" aria-hidden="true">
          <i class="fa-solid fa-quote-right"></i>
        </div>
      </div>

      <blockquote class="testimonial-quote">“${esc(t.quote)}”</blockquote>

      <div class="testimonial-footer">
        <div class="testimonial-author">
          <div class="author-avatar">
            ${avatarHtml}
          </div>
          <div class="author-meta">
            <strong class="author-name">${esc(t.name)}</strong>
            <span class="author-role">${esc(t.role)}</span>
          </div>
        </div>
      </div>
    </wl-card>`.trim();
}

/**
 * Render dải băng chuyền các thẻ đánh giá
 * @param {Object} props
 * @param {Array<Object>} [props.items=[]] - Danh sách nhận xét
 * @returns {string} HTML markup
 */
export function renderTestimonialMarquee({ items = [] } = {}) {
  const renderCards = (list, offset = 0) =>
    list.map((item, idx) => renderCard(item, offset + idx)).join("");

  return `
    <div class="testimonials-slider-wrapper reveal">
      <button class="testimonials-nav-btn testimonials-prev btn-magnetic" type="button" aria-label="Cuộn sang phải" title="Cuộn sang phải">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <div class="testimonials-marquee-viewport" id="testimonials-viewport" data-lenis-prevent role="region" aria-label="Dải chia sẻ từ cộng đồng">
        <div class="testimonials-marquee-track" id="testimonials-track">
          <!-- Nhóm 1: Các thẻ gốc -->
          <div class="testimonials-marquee-group" id="marquee-group-1">
            ${renderCards(items, 0)}
          </div>
          <!-- Nhóm 2: Nhân bản tạo vòng lặp vô tận liền mạch -->
          <div class="testimonials-marquee-group" id="marquee-group-2" aria-hidden="true">
            ${renderCards(items, items.length)}
          </div>
        </div>
      </div>

      <button class="testimonials-nav-btn testimonials-next btn-magnetic" type="button" aria-label="Cuộn sang trái" title="Cuộn sang trái">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>`.trim();
}

/**
 * Khởi tạo tương tác dải băng chuyền (chạy tự động, kéo chuột, vuốt chạm, nút điều hướng)
 */
export function initTestimonialMarquee() {
  const viewport = document.getElementById("testimonials-viewport");
  const track = document.getElementById("testimonials-track");
  const group1 = document.getElementById("marquee-group-1");
  const prevBtn = document.querySelector(".testimonials-prev");
  const nextBtn = document.querySelector(".testimonials-next");

  if (!viewport || !track || !group1) return;

  let currentX = 0;
  const baseSpeed = -0.6;
  let currentSpeed = baseSpeed;
  let isPaused = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragCurrentX = 0;
  let dragDistance = 0;
  let rafId = null;

  function getGroupWidth() {
    const gap = 28;
    return group1.offsetWidth + gap;
  }

  function tick() {
    if (!isPaused && !isDragging) {
      currentX += currentSpeed;
    }

    const singleWidth = getGroupWidth();
    if (singleWidth > 0) {
      if (currentX <= -singleWidth) {
        currentX += singleWidth;
      } else if (currentX >= 0) {
        currentX -= singleWidth;
      }
    }

    track.style.transform = `translate3d(${currentX}px, 0, 0)`;
    rafId = requestAnimationFrame(tick);
  }

  rafId = requestAnimationFrame(tick);

  viewport.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  viewport.addEventListener("mouseleave", () => {
    if (!isDragging) {
      isPaused = false;
    }
  });

  viewport.addEventListener("mousedown", (e) => {
    isDragging = true;
    dragDistance = 0;
    dragStartX = e.pageX;
    dragCurrentX = currentX;
    viewport.classList.add("is-dragging");
  });

  window.addEventListener("mouseup", () => {
    if (!isDragging) return;
    isDragging = false;
    viewport.classList.remove("is-dragging");
    setTimeout(() => {
      dragDistance = 0;
    }, 50);
  });

  window.addEventListener("mousemove", (e) => {
    if (!isDragging) return;
    const diff = (e.pageX - dragStartX) * 1.35;
    dragDistance += Math.abs(diff);
    currentX = dragCurrentX + diff;
  });

  viewport.addEventListener(
    "click",
    (e) => {
      if (dragDistance > 8) {
        e.preventDefault();
        e.stopPropagation();
      }
    },
    true,
  );

  viewport.addEventListener(
    "touchstart",
    (e) => {
      if (!e.touches.length) return;
      isDragging = true;
      dragDistance = 0;
      dragStartX = e.touches[0].pageX;
      dragCurrentX = currentX;
    },
    { passive: true },
  );

  viewport.addEventListener(
    "touchmove",
    (e) => {
      if (!isDragging || !e.touches.length) return;
      const diff = (e.touches[0].pageX - dragStartX) * 1.25;
      dragDistance += Math.abs(diff);
      currentX = dragCurrentX + diff;
    },
    { passive: true },
  );

  viewport.addEventListener("touchend", () => {
    isDragging = false;
    setTimeout(() => {
      dragDistance = 0;
    }, 50);
  });

  const cardStep = 408;
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentX += cardStep;
      currentSpeed = Math.abs(baseSpeed);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentX -= cardStep;
      currentSpeed = -Math.abs(baseSpeed);
    });
  }

  document.addEventListener("visibilitychange", () => {
    isPaused = document.hidden;
  });
}
