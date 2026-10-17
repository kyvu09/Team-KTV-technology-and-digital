// ============================================================================
// main.js — Điểm khởi đầu của website (White Label Entry)
// Đã được viết lại thân thiện với người mới học (Beginner Friendly)
// ============================================================================

import { loadConfig, normalizeBrandKey } from "./config-loader.js";
import { applyTheme } from "./theme.js";
import { renderSite } from "./render.js";
import { initPreloader } from "./effects/preloader.js";
import "./components/Card.js";

// HÀM CHÍNH KHỞI CHẠY TRANG WEB
async function startApp() {
  // 1. Tìm xem người dùng đang muốn mở giao diện nào dựa vào tham số ?brand= trên URL hoặc LocalStorage
  const params = new URLSearchParams(window.location.search);
  let rawBrand = params.get("brand");
  if (!rawBrand && typeof localStorage !== "undefined") {
    rawBrand = localStorage.getItem("vivoice_current_brand");
  }
  const brandName = normalizeBrandKey(rawBrand);
  if (typeof localStorage !== "undefined" && brandName) {
    localStorage.setItem("vivoice_current_brand", brandName);
  }

  try {
    // 2. Tải cấu hình từ file JSON tương ứng
    const config = await loadConfig(brandName);

    // 3. Áp dụng màu sắc, phông chữ (từ file theme.js)
    applyTheme(config);

    // 4. Bật màn hình chờ sóng âm (Preloader)
    const preloaderEl = document.getElementById("site-preloader");
    if (config.effects !== undefined && config.effects.preloader !== false) {
      initPreloader(config.brand.name);
    } else {
      if (preloaderEl !== null) {
        preloaderEl.style.display = "none";
      }
      document.body.classList.remove("is-loading");
    }

    // 5. In giao diện Header và các Section ra màn hình (từ file render.js)
    renderSite(config);

    // Cập nhật tên thương hiệu đang hiển thị trên nút White Label Switcher nếu có
    const wlBrandNameEl = document.getElementById("wl-brand-name");
    if (wlBrandNameEl && config.brand) {
      wlBrandNameEl.textContent = config.brand.name;
    }

    // 6. Tự động cuộn đến 1 phần nào đó nếu link có chứa ?scroll=
    const scrollTarget = params.get("scroll");
    if (scrollTarget !== null) {
      setTimeout(function () {
        const el = document.getElementById(scrollTarget);
        if (el !== null) {
          if (window.__lenis !== undefined) {
            window.__lenis.scrollTo(el, { immediate: true, offset: -40 });
          } else {
            el.scrollIntoView({ block: "start" });
          }
        }
      }, 800);
    }
  } catch (err) {
    // 7. Nếu bị lỗi thì tắt màn hình chờ và hiện thông báo hướng dẫn
    const preloaderEl = document.getElementById("site-preloader");
    if (preloaderEl !== null) {
      preloaderEl.style.display = "none";
    }

    const errorHTML = `
      <div class="container" style="padding: 80px 20px;">
        <h1>Không tải được website</h1>
        <p>${err.message}</p>
        <p>Kiểm tra lại tên file trong thư mục <code>config/</code> và chữ <code>?brand=</code> trên link.</p>
      </div>`;
    const appEl = document.getElementById("app");
    if (appEl) appEl.innerHTML = errorHTML;
    console.error(err);
  }
}

// Khởi chạy ứng dụng
startApp();

// ============================================================================
// CHỨC NĂNG MENU ĐỔI WHITE LABEL (GÓC DƯỚI TRÁI)
// ============================================================================
const wlSwitcher = document.querySelector(".white-label-switcher");
const wlToggleBtn = document.getElementById("wl-toggle-btn");
const wlMenuItems = document.querySelectorAll(".wl-menu-item");

if (wlToggleBtn !== null && wlSwitcher !== null) {
  // Khi bấm nút mở menu
  wlToggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    wlSwitcher.classList.toggle("open");
  });

  // Khi bấm ra ngoài menu thì đóng lại
  document.addEventListener("click", function (e) {
    if (!wlSwitcher.contains(e.target)) {
      wlSwitcher.classList.remove("open");
    }
  });

  // Lấy brand hiện tại từ đường link
  const params = new URLSearchParams(window.location.search);
  const currentBrand = normalizeBrandKey(params.get("brand"));

  // Duyệt qua tất cả các lựa chọn trong menu
  wlMenuItems.forEach(function (item) {
    if (item.dataset.brand === currentBrand) {
      item.classList.add("active");
    }

    item.addEventListener("click", function () {
      const newBrand = item.dataset.brand;
      if (typeof localStorage !== "undefined" && newBrand) {
        localStorage.setItem("vivoice_current_brand", newBrand);
      }
      const newParams = new URLSearchParams(window.location.search);
      newParams.set("brand", newBrand);
      window.location.href = window.location.pathname + "?" + newParams.toString() + window.location.hash;
    });
  });
}
