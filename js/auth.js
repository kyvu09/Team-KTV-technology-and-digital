import { esc } from "./core/esc.js";
import { navigateTo, ROUTES } from "./core/router.js";
import { authState } from "./core/auth-state.js";

/**
 * Hiển thị bảng thông báo Modal nổi (Auth Modal Dialog) cho người dùng
 * Thay thế việc hiển thị chen chúc vào khung form
 * @param {Object} options
 * @param {string} options.title - Tiêu đề bảng thông báo
 * @param {string} options.message - Nội dung chi tiết
 * @param {'success' | 'error'} options.type - Loại trạng thái (success hoặc error)
 * @param {string} [options.buttonText] - Text trên nút hành động
 * @param {Function} [options.onConfirm] - Hàm gọi lại khi bấm xác nhận hoặc đóng
 */
export function showAuthModal({
  title,
  message,
  type = "success",
  buttonText = "",
  onConfirm = null,
}) {
  let backdrop = document.getElementById("auth-modal-backdrop");
  if (!backdrop) {
    backdrop = document.createElement("div");
    backdrop.id = "auth-modal-backdrop";
    backdrop.className = "auth-modal-backdrop";
    document.body.appendChild(backdrop);
  }

  const isSuccess = type === "success";
  const defaultBtnText = buttonText || (isSuccess ? "Đồng ý" : "Đã hiểu");
  const iconHtml = isSuccess
    ? `<i class="fa-solid fa-circle-check"></i>`
    : `<i class="fa-solid fa-circle-exclamation"></i>`;

  backdrop.innerHTML = `
    <div class="auth-modal-dialog ${type}" role="dialog" aria-modal="true" aria-labelledby="auth-modal-title">
      <button type="button" class="auth-modal-close-x" id="auth-modal-close-btn" aria-label="Đóng">
        <i class="fa-solid fa-xmark"></i>
      </button>
      <div class="auth-modal-icon">${iconHtml}</div>
      <h3 class="auth-modal-title" id="auth-modal-title">${esc(title)}</h3>
      <div class="auth-modal-message">${message}</div>
      <button type="button" class="auth-modal-btn" id="auth-modal-confirm-btn">${esc(defaultBtnText)}</button>
    </div>
  `;

  requestAnimationFrame(() => {
    backdrop.classList.add("open");
  });

  const closeModal = () => {
    backdrop.classList.remove("open");
    if (typeof onConfirm === "function") {
      onConfirm();
    }
  };

  backdrop
    .querySelector("#auth-modal-close-btn")
    ?.addEventListener("click", closeModal);
  backdrop
    .querySelector("#auth-modal-confirm-btn")
    ?.addEventListener("click", closeModal);
  backdrop.onclick = (e) => {
    if (e.target === backdrop) closeModal();
  };
}

export function showAuthToast(message, type = "info") {
  // Thay thế hoàn toàn bằng showAuthModal
  showAuthModal({
    title: type === "error" ? "Thông báo lỗi" : "Thông báo",
    message: esc(message),
    type: type === "error" ? "error" : "success",
  });
}

/**
 * Component 1: Đèn bàn nghệ thuật với dây kéo tương tác (Desk Lamp Component)
 * @param {Object} config - Cấu hình giao diện
 * @returns {string} HTML markup
 */
export function renderLamp(config = {}) {
  const brand = config.brand || {};
  const brandName = brand.name || "ViVoice";

  return `
    <!-- Đèn bàn nghệ thuật với dây kéo tương tác (Desk Lamp) -->
    <div class="lamp-wrapper">
      <svg class="lamp" viewBox="0 0 300 420" role="img" aria-label="Đèn bàn tương tác ${esc(brandName)}">
        <defs>
          <radialGradient id="shadeGrad" cx="50%" cy="30%" r="80%">
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="100%" stop-color="#f5f0e6" />
          </radialGradient>
        </defs>
        <!-- Ánh sáng hắt dưới chao đèn -->
        <ellipse class="inner-glow" cx="150" cy="165" rx="115" ry="26" />
        <!-- Thân & Đế đèn -->
        <rect class="lamp-base" x="132" y="150" width="28" height="235" rx="4" />
        <rect class="lamp-base" x="55" y="370" width="180" height="22" rx="11" />
        <!-- Chao đèn -->
        <path class="lamp-shade" d="M25 150 C25 85 85 45 145 45 C205 45 265 85 265 150 C230 164 60 164 25 150 Z" />
        <!-- Cụm dây kéo công tắc đèn -->
        <g class="cord-group" id="lamp-cord" tabindex="0" role="button" aria-label="Kéo dây để bật hoặc tắt đèn" title="Nhấn hoặc bấm Phím Cách để kéo dây đèn">
          <line class="cord" x1="210" y1="156" x2="210" y2="258" />
          <circle class="cord-knob" cx="210" cy="268" r="11" />
          <!-- Vùng chạm vô hình mở rộng để dễ bấm trên điện thoại -->
          <rect x="185" y="150" width="50" height="135" fill="transparent" />
        </g>
      </svg>
      <p class="lamp-hint" id="lamp-hint">
        <i class="fa-solid fa-hand-pointer"></i> Kéo dây để bật / tắt đèn
      </p>
    </div>
  `.trim();
}

/**
 * Component 2: Khung xác thực kính mờ (Auth Glassmorphism Card Component)
 * @param {Object} config - Cấu hình giao diện
 * @returns {string} HTML markup
 */
export function renderAuthCard(config = {}) {
  return `
    <!-- Thẻ xác thực kính mờ (Auth Glassmorphism Card) -->
    <div class="auth-card" id="auth-card">
      <!-- Phần đầu thẻ (Đã bỏ icon / mascot theo yêu cầu) -->
      <div class="auth-card-header">
        <h1 class="auth-card-title" id="auth-title">Chào mừng trở lại</h1>
        <p class="auth-card-desc" id="auth-desc">Đăng nhập vào tài khoản của bạn để tiếp tục.</p>
      </div>

      <!-- Thanh chọn Tab: Đăng nhập | Đăng ký -->
      <div class="auth-tabs" role="tablist" aria-label="Chế độ xác thực">
        <button type="button" class="auth-tab-btn active" id="tab-login" role="tab" aria-selected="true" aria-controls="view-login">
          Đăng nhập
        </button>
        <button type="button" class="auth-tab-btn" id="tab-register" role="tab" aria-selected="false" aria-controls="view-register">
          Đăng ký
        </button>
      </div>


      <!-- Khung chứa 2 Form chuyển đổi qua lại -->
      <div class="auth-forms-viewport">
        
        <!-- FORM 1: ĐĂNG NHẬP (LOGIN) -->
        <form class="auth-form-view active" id="form-login" novalidate autocomplete="on">
          <div class="auth-group">
            <label for="login-email">Email</label>
            <div class="auth-input-wrapper">
              <input type="email" id="login-email" name="email" placeholder="ten@congty.com" autocomplete="email" required />
              <i class="fa-regular fa-envelope auth-input-icon"></i>
            </div>
            <span class="auth-field-error" id="err-login-email"></span>
          </div>

          <div class="auth-group">
            <label for="login-password">Mật khẩu</label>
            <div class="auth-input-wrapper">
              <input type="password" id="login-password" name="password" placeholder="••••••••" autocomplete="current-password" required />
              <i class="fa-solid fa-lock auth-input-icon"></i>
              <button type="button" class="auth-toggle-pwd" data-target="login-password" aria-label="Hiển thị hoặc ẩn mật khẩu">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
            <span class="auth-field-error" id="err-login-password"></span>
          </div>

          <button type="submit" class="auth-submit-btn" id="btn-login-submit">
            <span class="btn-text">Đăng nhập</span>
          </button>

          <p class="auth-switch-prompt">
            Chưa có tài khoản?
            <button type="button" class="auth-link" id="link-goto-register">Đăng ký ngay</button>
          </p>
        </form>

        <!-- FORM 2: ĐĂNG KÝ (REGISTER) -->
        <form class="auth-form-view" id="form-register" novalidate autocomplete="on">
          <div class="auth-group">
            <label for="reg-name">Họ và tên</label>
            <div class="auth-input-wrapper">
              <input type="text" id="reg-name" name="name" placeholder="Nguyễn Văn A" autocomplete="name" required />
              <i class="fa-regular fa-user auth-input-icon"></i>
            </div>
            <span class="auth-field-error" id="err-reg-name"></span>
          </div>

          <div class="auth-group">
            <label for="reg-email">Email</label>
            <div class="auth-input-wrapper">
              <input type="email" id="reg-email" name="email" placeholder="tennguoidung@gmail.com" autocomplete="email" required />
              <i class="fa-regular fa-envelope auth-input-icon"></i>
            </div>
            <span class="auth-field-error" id="err-reg-email"></span>
          </div>

          <div class="auth-group">
            <label for="reg-password">Mật khẩu</label>
            <div class="auth-input-wrapper">
              <input type="password" id="reg-password" name="password" placeholder="Tối thiểu 8 ký tự (Hoa, thường, số, ký tự đặc biệt)" autocomplete="new-password" required />
              <i class="fa-solid fa-lock auth-input-icon"></i>
              <button type="button" class="auth-toggle-pwd" data-target="reg-password" aria-label="Hiển thị hoặc ẩn mật khẩu">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
            <span class="auth-field-error" id="err-reg-password"></span>
          </div>

          <div class="auth-group">
            <label for="reg-confirm">Xác nhận mật khẩu</label>
            <div class="auth-input-wrapper">
              <input type="password" id="reg-confirm" name="confirmPassword" placeholder="Nhập lại mật khẩu" autocomplete="new-password" required />
              <i class="fa-solid fa-shield-halved auth-input-icon"></i>
              <button type="button" class="auth-toggle-pwd" data-target="reg-confirm" aria-label="Hiển thị hoặc ẩn mật khẩu">
                <i class="fa-regular fa-eye"></i>
              </button>
            </div>
            <span class="auth-field-error" id="err-reg-confirm"></span>
          </div>

          <button type="submit" class="auth-submit-btn" id="btn-reg-submit">
            <span class="btn-text">Tạo tài khoản</span>
          </button>

          <p class="auth-switch-prompt">
            Đã có tài khoản?
            <button type="button" class="auth-link" id="link-goto-login">Đăng nhập ngay</button>
          </p>
        </form>

      </div>
    </div>
  `.trim();
}

/**
 * Render mã HTML cho trang Xác thực (kết hợp Component Đèn bàn + Khung Đăng nhập)
 * @param {Object} config - Cấu hình White-Label đầy đủ
 * @returns {string} HTML markup
 */
export function renderAuth(config = {}) {
  return `
    <div class="auth-page-wrapper" id="auth-page-root">
      <!-- Ánh sáng phòng phản chiếu từ đèn bàn nguyên bản -->
      <div class="auth-glow-bg" aria-hidden="true"></div>

      <!-- 1. Thanh điều hướng đỉnh trang: Nút Quay lại trang chủ (đã bỏ mũi tên) -->
      <header class="auth-top-bar">
        <a href="#hero" class="auth-back-btn" id="auth-back-btn" data-page-link="home">
          <span>Quay lại trang chủ</span>
        </a>
      </header>

      <!-- 2. Khu vực trung tâm: 2 component Đèn bàn thông minh + Thẻ Glassmorphism -->
      <main class="auth-main-container">
        ${renderLamp(config)}
        ${renderAuthCard(config)}
      </main>
    </div>
  `.trim();
}

// ============================================================================
// Quản lý Dữ liệu Tài khoản & Xác thực Cục bộ (Local Storage & Password Hash)
// Tuân thủ quy chuẩn bảo mật: không lưu mật khẩu thô dạng plaintext
// ============================================================================
export const STORAGE_USERS_KEY = "vivoice_local_users";
export const STORAGE_REMEMBER_KEY = "vivoice_remember_email";

/**
 * Mã hóa mật khẩu một chiều bằng Web Crypto API SHA-256 + salt
 * @param {string} password
 * @returns {Promise<string>} Chuỗi hash hex an toàn
 */
export async function hashPassword(password) {
  if (typeof crypto !== "undefined" && crypto.subtle && crypto.subtle.digest) {
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(password + "_vivoice_salt_2025");
      const hashBuffer = await crypto.subtle.digest("SHA-256", data);
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
    } catch (e) {
      console.warn("Lỗi SubtleCrypto, chuyển sang fallback hash:", e);
    }
  }
  // Fallback an toàn nếu chạy trong môi trường không có Web Crypto API
  let h = 0;
  for (let i = 0; i < password.length; i++) {
    h = (h << 5) - h + password.charCodeAt(i);
    h |= 0;
  }
  return "v_hash_" + Math.abs(h).toString(16);
}

/**
 * Lấy danh sách toàn bộ người dùng từ localStorage
 * @returns {Array<Object>} Danh sách tài khoản
 */
export function getStoredUsers() {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_USERS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Tự động dọn sạch tài khoản demo cũ nếu còn sót lại trong localStorage
    const filtered = parsed.filter(
      (u) => (u.email || "").toLowerCase() !== "demo@vivoice.vn",
    );
    if (filtered.length !== parsed.length) {
      saveStoredUsers(filtered);
    }
    return filtered;
  } catch (e) {
    console.error("Lỗi đọc danh sách users từ localStorage:", e);
    return [];
  }
}

/**
 * Lưu danh sách người dùng vào localStorage
 * @param {Array<Object>} users
 */
export function saveStoredUsers(users) {
  if (typeof localStorage === "undefined") return;
  try {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  } catch (e) {
    console.error("Lỗi lưu users vào localStorage:", e);
  }
}

/**
 * Khởi tạo toàn bộ tương tác trên trang Auth:
 * - Kéo dây bật / tắt đèn
 * - Chuyển đổi mượt giữa Đăng nhập & Đăng ký
 * - Ẩn / hiện mật khẩu
 * - Kiểm tra hợp lệ dữ liệu (Form Validation)
 * - Xử lý lưu trữ và xác thực tài khoản trực tiếp trên LocalStorage
 * @param {Object} config
 */
export function initAuth(config = {}) {
  const brand = config.brand || {};
  const brandName = brand.name || "ViVoice";

  // Đảm bảo body có class định danh
  document.body.classList.add("is-auth-view");

  // 1. Quản lý trạng thái Đèn bàn (Lamp State)
  // Mặc định bật đèn khi vào để form sẵn sàng tương tác ngay
  let isLampOn = true;
  document.body.classList.add("lamp-on", "on");
  document.documentElement.style.setProperty("--on", "1");

  const cord = document.getElementById("lamp-cord");
  const authCard = document.getElementById("auth-card");
  const lampHint = document.getElementById("lamp-hint");

  function setFormInteractive(enabled) {
    if (!authCard) return;
    const focusable = authCard.querySelectorAll("input, button, [tabindex]");
    focusable.forEach((el) => {
      el.tabIndex = enabled ? 0 : -1;
    });
  }

  function toggleLamp() {
    isLampOn = !isLampOn;
    document.body.classList.toggle("lamp-on", isLampOn);
    document.body.classList.toggle("on", isLampOn);
    document.documentElement.style.setProperty("--on", isLampOn ? "1" : "0");

    // Khởi động lại hoạt ảnh kéo dây
    if (cord) {
      cord.classList.remove("pulled");
      void cord.getBoundingClientRect(); // Buộc trình duyệt reflow
      cord.classList.add("pulled");
    }

    setFormInteractive(isLampOn);

    if (isLampOn) {
      if (lampHint)
        lampHint.innerHTML = `<i class="fa-solid fa-lightbulb"></i> Đèn đang bật. Kéo dây để tắt`;
      const firstInput = document.querySelector(".auth-form-view.active input");
      if (firstInput) {
        setTimeout(() => firstInput.focus({ preventScroll: true }), 400);
      }
    } else {
      if (lampHint)
        lampHint.innerHTML = `<i class="fa-solid fa-hand-pointer"></i> Kéo dây để bật đèn`;
    }
  }

  if (cord) {
    cord.addEventListener("click", toggleLamp);
    cord.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleLamp();
      }
    });
  }

  setFormInteractive(isLampOn);

  // 2. Chuyển đổi chế độ Đăng nhập / Đăng ký (Tab Switching)
  const tabLogin = document.getElementById("tab-login");
  const tabRegister = document.getElementById("tab-register");
  const formLogin = document.getElementById("form-login");
  const formRegister = document.getElementById("form-register");
  const authTitle = document.getElementById("auth-title");
  const authDesc = document.getElementById("auth-desc");

  const linkGotoRegister = document.getElementById("link-goto-register");
  const linkGotoLogin = document.getElementById("link-goto-login");

  function switchMode(mode) {
    clearAllErrors();

    if (mode === "login") {
      tabLogin.classList.add("active");
      tabLogin.setAttribute("aria-selected", "true");
      tabRegister.classList.remove("active");
      tabRegister.setAttribute("aria-selected", "false");

      formLogin.classList.add("active");
      formRegister.classList.remove("active");

      if (authTitle) authTitle.textContent = "Chào mừng trở lại";
      if (authDesc)
        authDesc.textContent = "Đăng nhập vào tài khoản của bạn để tiếp tục.";

      const input = document.getElementById("login-email");
      if (input && isLampOn) input.focus();
    } else {
      tabRegister.classList.add("active");
      tabRegister.setAttribute("aria-selected", "true");
      tabLogin.classList.remove("active");
      tabLogin.setAttribute("aria-selected", "false");

      formRegister.classList.add("active");
      formLogin.classList.remove("active");

      if (authTitle) authTitle.textContent = "Tạo tài khoản mới";
      if (authDesc)
        authDesc.textContent = "Điền thông tin bên dưới để tạo tài khoản mới.";

      const input = document.getElementById("reg-name");
      if (input && isLampOn) input.focus();
    }
  }

  if (tabLogin) tabLogin.addEventListener("click", () => switchMode("login"));
  if (tabRegister)
    tabRegister.addEventListener("click", () => switchMode("register"));
  if (linkGotoRegister)
    linkGotoRegister.addEventListener("click", () => switchMode("register"));
  if (linkGotoLogin)
    linkGotoLogin.addEventListener("click", () => switchMode("login"));

  // 3. Xử lý Ẩn / Hiện mật khẩu (Password Visibility Toggles)
  const toggleButtons = document.querySelectorAll(".auth-toggle-pwd");
  toggleButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute("data-target");
      const input = document.getElementById(targetId);
      if (!input) return;

      const isPassword = input.type === "password";
      input.type = isPassword ? "text" : "password";

      const icon = btn.querySelector("i");
      if (icon) {
        icon.className = isPassword
          ? "fa-regular fa-eye-slash"
          : "fa-regular fa-eye";
      }
    });
  });

  // 4. Tiện ích kiểm tra tính hợp lệ của Form (Form Validation)
  function showFieldError(inputId, errorId, message) {
    const input = document.getElementById(inputId);
    const errEl = document.getElementById(errorId);
    if (input) input.classList.add("has-error");
    if (errEl) {
      errEl.textContent = message;
      errEl.classList.add("visible");
    }
  }

  function clearFieldError(inputId, errorId) {
    const input = document.getElementById(inputId);
    const errEl = document.getElementById(errorId);
    if (input) input.classList.remove("has-error");
    if (errEl) {
      errEl.textContent = "";
      errEl.classList.remove("visible");
    }
  }

  function clearAllErrors() {
    document
      .querySelectorAll(".auth-input-wrapper input")
      .forEach((i) => i.classList.remove("has-error"));
    document.querySelectorAll(".auth-field-error").forEach((e) => {
      e.textContent = "";
      e.classList.remove("visible");
    });
  }

  function isValidEmail(email) {
    if (!email || typeof email !== "string") return false;
    const cleanEmail = email.trim();
    // Regex chuẩn RFC: Ký tự hợp lệ @ Tên miền . Đuôi miền tối thiểu 2 ký tự
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(cleanEmail)) return false;
    // Nếu là địa chỉ gmail thì phải chuẩn đuôi @gmail.com
    const lower = cleanEmail.toLowerCase();
    if (lower.includes("gmail") && !lower.endsWith("@gmail.com")) {
      return false;
    }
    return true;
  }

  function isStrongPassword(password) {
    if (!password || password.length < 8) return false;
    const hasUpper = /[A-Z]/.test(password);
    const hasLower = /[a-z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecial = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/.test(password);
    return hasUpper && hasLower && hasNumber && hasSpecial;
  }

  // Gắn sự kiện xóa lỗi khi người dùng gõ
  const allInputs = document.querySelectorAll(".auth-input-wrapper input");
  allInputs.forEach((input) => {
    input.addEventListener("input", () => {
      input.classList.remove("has-error");
      const parentGroup = input.closest(".auth-group");
      if (parentGroup) {
        const err = parentGroup.querySelector(".auth-field-error");
        if (err) {
          err.textContent = "";
          err.classList.remove("visible");
        }
      }
    });
  });

  // Tự động điền email nếu đã ghi nhớ trước đó
  try {
    const rememberedEmail =
      typeof localStorage !== "undefined"
        ? localStorage.getItem(STORAGE_REMEMBER_KEY)
        : null;
    const loginEmailInput = document.getElementById("login-email");
    if (rememberedEmail && loginEmailInput) {
      loginEmailInput.value = rememberedEmail;
    }
  } catch (e) {}

  // 5. Xử lý gửi Form ĐĂNG NHẬP (Login Submit) với LocalStorage
  if (formLogin) {
    formLogin.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAllErrors();

      const emailInput = document.getElementById("login-email");
      const passwordInput = document.getElementById("login-password");
      const email = (emailInput?.value || "").trim();
      const password = passwordInput?.value || "";
      const remember = false;

      let hasError = false;

      if (!email) {
        showFieldError(
          "login-email",
          "err-login-email",
          "Vui lòng nhập địa chỉ email.",
        );
        hasError = true;
      } else if (!isValidEmail(email)) {
        showFieldError(
          "login-email",
          "err-login-email",
          "Định dạng email chưa đúng (VD: ten@domain.com).",
        );
        hasError = true;
      }

      if (!password) {
        showFieldError(
          "login-password",
          "err-login-password",
          "Vui lòng nhập mật khẩu.",
        );
        hasError = true;
      } else if (password.length < 6) {
        showFieldError(
          "login-password",
          "err-login-password",
          "Mật khẩu phải có ít nhất 6 ký tự.",
        );
        hasError = true;
      }

      if (hasError) return;

      // Trạng thái đang kiểm tra (Loading Spinner)
      const submitBtn = document.getElementById("btn-login-submit");
      const originalText = submitBtn.innerHTML;
      submitBtn.classList.add("is-loading");
      submitBtn.innerHTML = `<span class="auth-spinner"></span> <span>Đang xác thực...</span>`;

      // Kiểm tra trong LocalStorage
      const users = getStoredUsers();
      const normalizedEmail = email.toLowerCase();
      const foundUser = users.find(
        (u) => (u.email || "").toLowerCase() === normalizedEmail,
      );

      setTimeout(async () => {
        submitBtn.classList.remove("is-loading");
        submitBtn.innerHTML = originalText;

        // 1. Kiểm tra tài khoản có tồn tại không
        if (!foundUser) {
          showFieldError(
            "login-email",
            "err-login-email",
            "Tài khoản không tồn tại trên hệ thống.",
          );
          showAuthModal({
            title: "Tài khoản không tồn tại",
            message: `Email <strong>${esc(email)}</strong> chưa được đăng ký trên hệ thống. Vui lòng kiểm tra lại hoặc chuyển sang Đăng ký.`,
            type: "error",
          });
          return;
        }

        // 2. Kiểm tra mật khẩu (so khớp hash)
        const inputHash = await hashPassword(password);
        if (inputHash !== foundUser.passwordHash) {
          showFieldError(
            "login-password",
            "err-login-password",
            "Mật khẩu không chính xác.",
          );
          showAuthModal({
            title: "Mật khẩu không chính xác",
            message: "Mật khẩu bạn vừa nhập không đúng. Vui lòng kiểm tra lại.",
            type: "error",
          });
          return;
        }

        // 3. Xử lý ghi nhớ tài khoản
        try {
          if (typeof localStorage !== "undefined") {
            if (remember) {
              localStorage.setItem(STORAGE_REMEMBER_KEY, foundUser.email);
            } else {
              localStorage.removeItem(STORAGE_REMEMBER_KEY);
            }
          }
        } catch (e) {}

        // 4. Cập nhật trạng thái đăng nhập toàn trang
        authState.login(
          { name: foundUser.name, email: foundUser.email },
          remember,
        );

        showAuthModal({
          title: "Đăng nhập thành công",
          message: `Chào mừng <strong>${esc(foundUser.name)}</strong> đã quay trở lại!`,
          type: "success",
          buttonText: "Vào trang chủ",
          onConfirm: () => {
            navigateTo(ROUTES.HOME);
          },
        });

        // Tự động chuyển về trang chủ sau 1.2s nếu người dùng chưa bấm nút
        setTimeout(() => {
          const backdrop = document.getElementById("auth-modal-backdrop");
          if (backdrop?.classList.contains("open")) {
            backdrop.classList.remove("open");
            navigateTo(ROUTES.HOME);
          }
        }, 1200);
      }, 400);
    });
  }

  // 6. Xử lý gửi Form ĐĂNG KÝ (Register Submit) với LocalStorage
  if (formRegister) {
    formRegister.addEventListener("submit", async (e) => {
      e.preventDefault();
      clearAllErrors();

      const nameInput = document.getElementById("reg-name");
      const emailInput = document.getElementById("reg-email");
      const passwordInput = document.getElementById("reg-password");
      const confirmInput = document.getElementById("reg-confirm");

      const name = (nameInput?.value || "").trim();
      const email = (emailInput?.value || "").trim();
      const password = passwordInput?.value || "";
      const confirm = confirmInput?.value || "";

      let hasError = false;

      if (!name) {
        showFieldError(
          "reg-name",
          "err-reg-name",
          "Vui lòng nhập họ và tên của bạn.",
        );
        hasError = true;
      }

      if (!email) {
        showFieldError("reg-email", "err-reg-email", "Vui lòng nhập email.");
        hasError = true;
      } else if (!isValidEmail(email)) {
        showFieldError(
          "reg-email",
          "err-reg-email",
          "Email chưa chuẩn định dạng (VD: tennguoidung@gmail.com).",
        );
        hasError = true;
      }

      if (!password) {
        showFieldError(
          "reg-password",
          "err-reg-password",
          "Vui lòng thiết lập mật khẩu.",
        );
        hasError = true;
      } else if (password.length < 8) {
        showFieldError(
          "reg-password",
          "err-reg-password",
          "Mật khẩu độ bảo mật cao: Cần tối thiểu 8 ký tự.",
        );
        hasError = true;
      } else if (!isStrongPassword(password)) {
        showFieldError(
          "reg-password",
          "err-reg-password",
          "Mật khẩu phải bao gồm cả chữ HOA, chữ thường, số và ký tự đặc biệt (!@#$%...).",
        );
        hasError = true;
      }

      if (!confirm) {
        showFieldError(
          "reg-confirm",
          "err-reg-confirm",
          "Vui lòng nhập lại mật khẩu.",
        );
        hasError = true;
      } else if (confirm !== password) {
        showFieldError(
          "reg-confirm",
          "err-reg-confirm",
          "Mật khẩu xác nhận không trùng khớp.",
        );
        hasError = true;
      }

      if (hasError) return;

      // Nạp danh sách tài khoản hiện tại
      const users = getStoredUsers();
      const normalizedEmail = email.toLowerCase();
      const emailExists = users.some(
        (u) => (u.email || "").toLowerCase() === normalizedEmail,
      );

      // Kiểm tra trùng lặp email trên localhost
      if (emailExists) {
        showFieldError(
          "reg-email",
          "err-reg-email",
          "Email này đã được đăng ký trên hệ thống.",
        );
        showAuthModal({
          title: "Email đã tồn tại",
          message: `Email <strong>${esc(email)}</strong> đã có tài khoản trên hệ thống. Vui lòng chuyển sang Đăng nhập hoặc sử dụng email khác.`,
          type: "error",
        });
        return;
      }

      // Trạng thái đang xử lý (Loading Simulation)
      const submitBtn = document.getElementById("btn-reg-submit");
      const originalText = submitBtn.innerHTML;
      submitBtn.classList.add("is-loading");
      submitBtn.innerHTML = `<span class="auth-spinner"></span> <span>Đang khởi tạo tài khoản...</span>`;

      const passwordHash = await hashPassword(password);

      setTimeout(() => {
        submitBtn.classList.remove("is-loading");
        submitBtn.innerHTML = originalText;

        // Lưu tài khoản mới vào localStorage
        const newUser = {
          id: "usr_" + Date.now(),
          name: name,
          email: normalizedEmail,
          passwordHash: passwordHash,
          createdAt: new Date().toISOString(),
        };
        users.push(newUser);
        saveStoredUsers(users);

        // Reset form đăng ký
        formRegister.reset();

        // Chuyển sang form Đăng nhập và tự động điền sẵn cả Email & Mật khẩu vừa tạo
        switchMode("login");
        const loginEmail = document.getElementById("login-email");
        const loginPassword = document.getElementById("login-password");
        if (loginEmail) loginEmail.value = email;
        if (loginPassword) loginPassword.value = password;

        showAuthModal({
          title: "Đăng ký thành công",
          message: `Chúc mừng bạn đã tạo thành công tài khoản <strong>${esc(email)}</strong>! Thông tin đăng nhập đã được điền sẵn, bạn chỉ cần bấm nút <strong>Đăng nhập</strong>.`,
          type: "success",
          buttonText: "Đăng nhập ngay",
          onConfirm: () => {
            const loginSubmitBtn = document.getElementById("btn-login-submit");
            if (loginSubmitBtn) loginSubmitBtn.focus();
          },
        });
      }, 400);
    });
  }
}
