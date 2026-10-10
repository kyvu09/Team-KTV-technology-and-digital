import { esc } from "../core/esc.js";

/** Hàm sinh HTML danh sách thẻ đánh giá */
function renderCardList(items, offsetIndex = 0) {
  return items
    .map(
      (t, idx) => `
    <article class="testimonial-card" data-index="${offsetIndex + idx}">
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
            ${t.avatar ? `<img src="${esc(t.avatar)}" alt="${esc(t.name)}" class="avatar-img" loading="lazy" />` : esc(t.name.charAt(0))}
          </div>
          <div class="author-meta">
            <strong class="author-name">${esc(t.name)}</strong>
            <span class="author-role">${esc(t.role)}</span>
          </div>
        </div>
      </div>
    </article>`,
    )
    .join("");
}

export function renderTestimonials(s) {
  const items = s.items || [];

  return `
  <section class="section testimonials-section" id="testimonials">
    <div class="container">
      <div class="section-header text-center">
        ${s.eyebrow ? `<p class="eyebrow reveal"><i class="fa-solid fa-comments"></i> ${esc(s.eyebrow)}</p>` : ""}
        <h2 class="section-title reveal">${esc(s.title)}</h2>
        ${s.subtitle ? `<p class="section-sub mx-auto reveal">${esc(s.subtitle)}</p>` : ""}
      </div>
    </div>

    <!-- Khối Băng chuyền chuyển động liên tục và chậm rãi (Infinite Marquee Ticker) -->
    <div class="testimonials-slider-wrapper reveal">
      <!-- Nút điều hướng trước (Lùi thẻ) -->
      <button class="testimonials-nav-btn testimonials-prev btn-magnetic" type="button" aria-label="Cuộn sang phải" title="Cuộn sang phải">
        <i class="fa-solid fa-chevron-left"></i>
      </button>

      <!-- Khung nhìn dải trượt liên tục (Viewport) -->
      <div class="testimonials-marquee-viewport" id="testimonials-viewport" data-lenis-prevent role="region" aria-label="Dải chia sẻ từ cộng đồng">
        <div class="testimonials-marquee-track" id="testimonials-track">
          <!-- Nhóm 1: Các thẻ gốc -->
          <div class="testimonials-marquee-group" id="marquee-group-1">
            ${renderCardList(items, 0)}
          </div>
          <!-- Nhóm 2: Nhân bản tạo vòng lặp vô tận liền mạch 100% -->
          <div class="testimonials-marquee-group" id="marquee-group-2" aria-hidden="true">
            ${renderCardList(items, items.length)}
          </div>
        </div>
      </div>

      <!-- Nút điều hướng tiếp theo (Tiến thẻ) -->
      <button class="testimonials-nav-btn testimonials-next btn-magnetic" type="button" aria-label="Cuộn sang trái" title="Cuộn sang trái">
        <i class="fa-solid fa-chevron-right"></i>
      </button>
    </div>
  </section>`;
}

export function initTestimonialsInteractions() {
  const viewport = document.getElementById("testimonials-viewport");
  const track = document.getElementById("testimonials-track");
  const group1 = document.getElementById("marquee-group-1");
  const prevBtn = document.querySelector(".testimonials-prev");
  const nextBtn = document.querySelector(".testimonials-next");

  if (!viewport || !track || !group1) return;

  // Trạng thái chuyển động liên tục
  let currentX = 0;
  // Tốc độ chậm rãi, êm ái (~0.6px mỗi frame tương đương ~36px/giây tại 60fps)
  const baseSpeed = -0.6;
  let currentSpeed = baseSpeed;
  let isPaused = false;
  let isDragging = false;
  let dragStartX = 0;
  let dragCurrentX = 0;
  let dragDistance = 0;
  let rafId = null;

  // Lấy độ rộng của 1 nhóm thẻ (Group 1) kèm khoảng cách gap
  function getGroupWidth() {
    const gap = 28;
    return group1.offsetWidth + gap;
  }

  // Vòng lặp chuyển động liên tục mượt mà 60fps / 120fps (RequestAnimationFrame)
  function tick() {
    if (!isPaused && !isDragging) {
      currentX += currentSpeed;
    }

    const singleWidth = getGroupWidth();
    if (singleWidth > 0) {
      // Vòng lặp vô tận liền mạch: khi đi hết nhóm 1, đặt lại tọa độ mà không hề bị giật
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

  // Tự động dừng lại khi rê chuột vào để người dùng đọc rõ ràng & tương tác
  viewport.addEventListener("mouseenter", () => {
    isPaused = true;
  });

  viewport.addEventListener("mouseleave", () => {
    if (!isDragging) {
      isPaused = false;
    }
  });

  // Kéo trượt chuột mượt mà (Mouse Drag & Flick)
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

  // Chặn kích hoạt nút nếu người dùng đang thực hiện thao tác kéo chuột
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

  // Vuốt cảm ứng mượt mà trên màn hình cảm ứng di động / tablet
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

  // Nút Prev & Next: Nhấp để chuyển nhanh qua lại một thẻ và điều chỉnh chiều trôi
  const cardStep = 408; // Chiều rộng thẻ 380px + gap 28px
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      currentX += cardStep;
      currentSpeed = Math.abs(baseSpeed); // Chuyển hướng trôi sang phải
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      currentX -= cardStep;
      currentSpeed = -Math.abs(baseSpeed); // Chuyển hướng trôi sang trái
    });
  }

  // Tạm dừng khi chuyển tab trình duyệt để tiết kiệm pin và tránh nhảy bước
  document.addEventListener("visibilitychange", () => {
    isPaused = document.hidden;
  });
}

// ============================================================================
// Web Component <wl-testimonials> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlTestimonials extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderTestimonials(this._config);
      initTestimonialsInteractions();
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderTestimonials(config);
    initTestimonialsInteractions();
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("wl-testimonials")
) {
  customElements.define("wl-testimonials", WlTestimonials);
}
