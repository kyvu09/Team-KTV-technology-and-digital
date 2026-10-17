// ============================================================================
// ContactForm.js — Biểu mẫu liên hệ kính mờ Glassmorphism (Contact Form)
// ============================================================================

import { esc } from "../../core/esc.js";
import { authState } from "../../core/auth-state.js";
import { navigateTo, ROUTES } from "../../core/router.js";
import { showAuthModal } from "../../auth.js";

let unsubscribeContactAuth = null;

/**
 * Render khối biểu mẫu liên hệ
 * @param {Object} props
 * @param {string} [props.formTitle]
 * @param {string} [props.formName]
 * @param {string} [props.formEmail]
 * @param {string} [props.formMessage]
 * @param {string} [props.formButton]
 * @returns {string} HTML markup
 */
export function renderContactForm({
  formTitle = "",
  formName = "Họ và tên của bạn",
  formEmail = "Địa chỉ Email",
  formMessage = "Chia sẻ nhu cầu hoặc loại giọng đọc bạn cần...",
  formButton = "Gửi yêu cầu",
} = {}) {
  return `
    <div class="contact-form-col reveal">
      <form class="contact-glass-form" id="contact-form">
        ${formTitle ? `<h3 class="form-title">${esc(formTitle)}</h3>` : ""}
        <div class="form-group">
          <label for="contact-name" class="visually-hidden">${esc(formName)}</label>
          <input required id="contact-name" placeholder="${esc(formName)}" />
        </div>
        <div class="form-group">
          <label for="contact-email" class="visually-hidden">${esc(formEmail)}</label>
          <input required type="email" id="contact-email" placeholder="${esc(formEmail)}" />
        </div>
        <div class="form-group">
          <label for="contact-message" class="visually-hidden">${esc(formMessage)}</label>
          <textarea required id="contact-message" placeholder="${esc(formMessage)}" rows="4"></textarea>
        </div>

        <button class="btn btn-primary btn-block btn-magnetic" type="submit">
          <span>${esc(formButton)}</span>
        </button>

        <p class="form-feedback" id="contact-form-feedback" role="status"></p>
      </form>
    </div>`.trim();
}

/**
 * Khởi tạo sự kiện gửi form liên hệ kèm kiểm tra đăng nhập
 * @param {Object} props
 * @param {string} [props.formSuccess] - Thông điệp khi gửi thành công
 */
export function initContactForm({ formSuccess = "Yêu cầu của bạn đã được gửi, chúng tôi sẽ liên hệ nhanh nhất cho bạn." } = {}) {
  const form = document.getElementById("contact-form");
  if (!form) return;

  const syncContactIdentity = (user, clearOnLogout = false) => {
    const nameInput = form.querySelector("#contact-name");
    const emailInput = form.querySelector("#contact-email");
    if (!nameInput || !emailInput) return;

    const isLoggedIn = Boolean(user && (user.name || user.email));
    nameInput.readOnly = isLoggedIn;
    emailInput.readOnly = isLoggedIn;

    if (isLoggedIn) {
      nameInput.value = user.name || "";
      emailInput.value = user.email || "";
    } else if (clearOnLogout) {
      nameInput.value = "";
      emailInput.value = "";
    }
  };

  syncContactIdentity(authState.getUser());
  if (unsubscribeContactAuth) unsubscribeContactAuth();
  unsubscribeContactAuth = authState.subscribe((event, user) => {
    syncContactIdentity(user, event === "logout");
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    // 1. Kiểm tra người dùng đã đăng nhập chưa
    if (!authState.isLoggedIn()) {
      showAuthModal({
        title: "Yêu cầu đăng nhập",
        message: "Bạn chưa đăng nhập tài khoản. Vui lòng đăng nhập trước khi gửi yêu cầu liên hệ hoặc đăng ký tư vấn.",
        type: "error",
        buttonText: "Đăng nhập ngay",
        onConfirm: () => {
          navigateTo(ROUTES.AUTH);
        }
      });
      return;
    }

    // 2. Đã đăng nhập -> Hiển thị bảng thông báo thành công
    showAuthModal({
      title: "Gửi yêu cầu thành công",
      message: "Yêu cầu của bạn đã được gửi, chúng tôi sẽ liên hệ nhanh nhất cho bạn.",
      type: "success",
      buttonText: "Đồng ý"
    });

    const feedback = document.getElementById("contact-form-feedback");
    if (feedback) {
      feedback.textContent = formSuccess;
      feedback.classList.remove("is-error");
      feedback.classList.add("is-success");
    }

    form.reset();

    // Giữ lại và khóa thông tin tài khoản sau khi gửi thành công
    const userAfterReset = authState.getUser();
    syncContactIdentity(userAfterReset);
  });
}
