import { esc } from "../core/esc.js";
import { renderHeaderLogo } from "../components/header/HeaderLogo.js";
import {
  renderHeaderNav,
  initHeaderNav,
} from "../components/header/HeaderNav.js";
import { authState } from "../core/auth-state.js";

/**
 * Sinh mã HTML cho khu vực hành động bên phải Header:
 * - Khi chưa đăng nhập: Hiển thị nút "Đăng nhập"
 * - Khi đã đăng nhập demo: Ẩn nút "Đăng nhập", hiển thị "Xin chào, [Tên]" và Avatar tròn
 * @returns {string} HTML markup
 */
export function renderHeaderAction() {
  const user = authState.getUser();

  if (user && (user.name || user.email)) {
    const displayName = user.name || user.email.split("@")[0] || "Người dùng";
    const initialLetter = displayName.trim().charAt(0).toUpperCase();
    const email = user.email || "";

    return `
      <div class="header-user-menu" id="header-user-menu">
        <button type="button" class="header-user-btn" id="header-user-btn" aria-expanded="false" aria-haspopup="true" title="Tài khoản: ${esc(displayName)}">
          <div class="user-avatar" aria-hidden="true">${esc(initialLetter)}</div>
          <span class="user-greeting">Xin chào, <strong class="user-name">${esc(displayName)}</strong></span>
          <i class="fa-solid fa-chevron-down user-chevron" aria-hidden="true"></i>
        </button>

        <div class="user-dropdown-menu" id="user-dropdown-menu" role="menu" aria-label="Menu tài khoản">
          <div class="user-dropdown-header">
            <div class="user-avatar-lg" aria-hidden="true">${esc(initialLetter)}</div>
            <div class="user-details">
              <div class="user-fullname">${esc(displayName)}</div>
              <div class="user-email">${esc(email)}</div>
            </div>
          </div>
          <div class="user-dropdown-divider"></div>
          <button type="button" class="user-dropdown-item user-logout-item" id="menu-user-logout" role="menuitem">
            <i class="fa-solid fa-arrow-right-from-bracket" aria-hidden="true"></i>
            <span>Đăng xuất</span>
          </button>
        </div>
      </div>
    `.trim();
  }

  // Khi chưa đăng nhập -> Nút "Đăng nhập" chuẩn
  return `<a class="btn btn-sm btn-primary btn-magnetic" href="#auth" id="header-auth-btn" data-page-link="auth">Đăng nhập</a>`;
}

let headerBrandConfig = null;

// HÀM TẠO GIAO DIỆN HEADER
export function renderHeader(config) {
  headerBrandConfig = config;
  const brand = config.brand || {};
  const nav = config.nav || [];

  const logoHTML = renderHeaderLogo(brand);
  const navLinksHTML = renderHeaderNav(nav);
  const actionHTML = renderHeaderAction();

  const headerElement = document.getElementById("site-header");
  if (headerElement) {
    headerElement.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="#hero" aria-label="${esc(brand.name || "")}" data-page-link="home">${logoHTML}</a>
        
        ${navLinksHTML}
        
        <div class="header-action" id="header-action-root">
          ${actionHTML}
        </div>
      </div>`;
  }

  // Khởi tạo tương tác menu điều hướng
  initHeaderNav();

  // Khởi tạo tương tác menu người dùng
  initHeaderUserMenu();
}

/**
 * Hiển thị Modal Thông tin tài khoản người dùng
 * @param {Object} user
 */
function showUserInfoModal(user) {
  let modal = document.getElementById("user-info-modal-backdrop");
  if (!modal) {
    modal = document.createElement("div");
    modal.id = "user-info-modal-backdrop";
    modal.className = "user-info-modal-backdrop";
    document.body.appendChild(modal);
  }

  const brandName = headerBrandConfig?.brand?.name || "AI Voice";
  const emailDomain =
    brandName.toLowerCase().replace(/[^a-z0-9]/g, "") || "aivoice";
  const displayName = user?.name || user?.email?.split("@")[0] || "Người dùng";
  const initialLetter = displayName.trim().charAt(0).toUpperCase();
  const email = user?.email || `demo@${emailDomain}.vn`;

  modal.innerHTML = `
    <div class="user-info-modal-card" role="dialog" aria-modal="true" aria-labelledby="user-info-modal-title">
      <div class="user-info-modal-header">
        <h3 id="user-info-modal-title"><i class="fa-regular fa-id-badge" style="margin-right: 8px;"></i>Thông tin tài khoản</h3>
        <button type="button" class="user-info-modal-close" id="user-info-modal-close-btn" aria-label="Đóng"><i class="fa-solid fa-xmark"></i></button>
      </div>
      <div class="user-info-modal-profile">
        <div class="user-info-modal-avatar">${esc(initialLetter)}</div>
        <div class="user-info-modal-user">
          <h4>${esc(displayName)}</h4>
          <p>${esc(email)}</p>
          <span class="user-info-modal-badge"><i class="fa-solid fa-circle-check"></i> Đã xác thực Demo</span>
        </div>
      </div>
      <div class="user-info-modal-fields">
        <div class="user-info-modal-row">
          <span class="label">Họ và tên:</span>
          <span class="val">${esc(displayName)}</span>
        </div>
        <div class="user-info-modal-row">
          <span class="label">Email liên hệ:</span>
          <span class="val">${esc(email)}</span>
        </div>
        <div class="user-info-modal-row">
          <span class="label">Gói thành viên:</span>
          <span class="val">${esc(brandName)} Studio (Demo)</span>
        </div>
        <div class="user-info-modal-row">
          <span class="label">Trạng thái:</span>
          <span class="val" style="color: #4ade80;"><i class="fa-solid fa-circle-check"></i> Đang hoạt động</span>
        </div>
      </div>
      <div class="user-info-modal-actions">
        <button type="button" class="btn btn-sm btn-primary" id="user-info-modal-ok-btn">Đóng</button>
      </div>
    </div>
  `;

  requestAnimationFrame(() => {
    modal.classList.add("open");
  });

  const closeModal = () => {
    modal.classList.remove("open");
  };

  modal
    .querySelector("#user-info-modal-close-btn")
    ?.addEventListener("click", closeModal);
  modal
    .querySelector("#user-info-modal-ok-btn")
    ?.addEventListener("click", closeModal);
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });
}

/**
 * Gắn các sự kiện click cho menu tài khoản và đăng xuất
 */
function bindHeaderUserEvents() {
  const userMenu = document.getElementById("header-user-menu");
  const userBtn = document.getElementById("header-user-btn");
  const btnLogout = document.getElementById("menu-user-logout");

  if (!userMenu || !userBtn) return;

  // Toggle mở / đóng menu nhỏ
  userBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    const isOpen = userMenu.classList.toggle("open");
    userBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  // Đóng khi click ngoài menu
  document.addEventListener("click", (e) => {
    if (!userMenu.contains(e.target)) {
      userMenu.classList.remove("open");
      userBtn.setAttribute("aria-expanded", "false");
    }
  });

  // Mục "Đăng xuất"
  if (btnLogout) {
    btnLogout.addEventListener("click", () => {
      userMenu.classList.remove("open");
      userBtn.setAttribute("aria-expanded", "false");
      authState.logout();
    });
  }
}

let isAuthSubscribed = false;

/**
 * Khởi tạo tương tác menu tài khoản và đăng ký lắng nghe thay đổi trạng thái
 */
export function initHeaderUserMenu() {
  bindHeaderUserEvents();

  if (!isAuthSubscribed) {
    isAuthSubscribed = true;
    // Tự động cập nhật lại khu vực nút hành động Header khi người dùng đăng nhập hoặc đăng xuất
    authState.subscribe(() => {
      const actionRoot = document.getElementById("header-action-root");
      if (actionRoot) {
        actionRoot.innerHTML = renderHeaderAction();
        bindHeaderUserEvents();
      }
    });
  }
}

// ============================================================================
// Web Component <wl-header> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlHeader extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config !== undefined) {
      renderHeader(this._config);
    }
  }

  setConfig(config) {
    this._config = config;
    renderHeader(config);
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-header")) {
  customElements.define("wl-header", WlHeader);
}
