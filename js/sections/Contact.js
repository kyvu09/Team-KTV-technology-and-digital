import { esc } from "../core/esc.js";

export function renderContact(s) {
  return `
  <section class="section contact-section" id="contact">
    <div class="container contact-inner">
      <div class="contact-info-col reveal">
        ${s.eyebrow ? `<p class="eyebrow"><i class="fa-solid fa-paper-plane"></i> ${esc(s.eyebrow)}</p>` : ""}
        <h2 class="section-title">${esc(s.title)}</h2>
        <p class="contact-desc">${esc(s.description || "Để lại thông tin, đội ngũ chuyên gia của chúng tôi sẽ liên hệ tư vấn giải pháp âm thanh tùy biến cho thương hiệu của bạn.")}</p>

        <ul class="contact-channels">
          ${(s.channels || [])
            .map((c) => {
              let icon = "fa-solid fa-envelope";
              const lbl = (c.label || "").toLowerCase();
              if (lbl.includes("hotline") || lbl.includes("điện thoại"))
                icon = "fa-solid fa-phone";
              if (lbl.includes("địa chỉ")) icon = "fa-solid fa-location-dot";

              return `
              <li class="channel-item">
                <div class="channel-icon"><i class="${icon}"></i></div>
                <div class="channel-text">
                  <span class="channel-label">${esc(c.label)}</span>
                  <span class="channel-value">${esc(c.value)}</span>
                </div>
              </li>`;
            })
            .join("")}
        </ul>
      </div>

      <div class="contact-form-col reveal">
        <form class="contact-glass-form" id="contact-form">
          ${s.formTitle ? `<h3 class="form-title">${esc(s.formTitle)}</h3>` : ""}
          <div class="form-group">
            <label for="contact-name" class="visually-hidden">${esc(s.formName || "Họ tên")}</label>
            <input required id="contact-name" placeholder="${esc(s.formName || "Họ và tên của bạn")}" />
          </div>
          <div class="form-group">
            <label for="contact-email" class="visually-hidden">${esc(s.formEmail || "Email")}</label>
            <input required type="email" id="contact-email" placeholder="${esc(s.formEmail || "Địa chỉ Email")}" />
          </div>
          <div class="form-group">
            <label for="contact-message" class="visually-hidden">${esc(s.formMessage || "Nhu cầu")}</label>
            <textarea required id="contact-message" placeholder="${esc(s.formMessage || "Chia sẻ nhu cầu hoặc loại giọng đọc bạn cần...")}" rows="4"></textarea>
          </div>

          <button class="btn btn-primary btn-block btn-magnetic" type="submit">
            <span>${esc(s.formButton || "Gửi yêu cầu")}</span>
            <i class="fa-solid fa-paper-plane"></i>
          </button>

          <p class="form-feedback" id="contact-form-feedback" role="status"></p>
        </form>
      </div>
    </div>
  </section>`;
}

export function initContactInteractions(s) {
  const form = document.getElementById("contact-form");
  if (!form) return;

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const feedback = document.getElementById("contact-form-feedback");
    if (feedback) {
      feedback.textContent =
        s.formSuccess || "Đã gửi thành công! Chúng tôi sẽ phản hồi sớm.";
      feedback.classList.add("is-success");
    }
    form.reset();
  });
}

// ============================================================================
// Web Component <wl-contact> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlContact extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderContact(this._config);
      initContactInteractions(this._config);
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderContact(config);
    initContactInteractions(config);
  }
}

if (
  typeof customElements !== "undefined" &&
  !customElements.get("wl-contact")
) {
  customElements.define("wl-contact", WlContact);
}
