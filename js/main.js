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

    // Cập nhật tên thương hiệu đang hiển thị trên nút White Label Switcher
    const wlBrandNameEl = document.getElementById("wl-brand-name");
    if (wlBrandNameEl) {
      wlBrandNameEl.textContent = "Đổi thương hiệu";
    }

    // Khởi tạo White Label Modal chọn thương hiệu
    initBrandModal(brandName);

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
    } else if (window.location.hash === "#hero" || window.location.hash === "" || window.location.hash === "#home") {
      // Đảm bảo khi tải trang chủ hoặc ấn #hero thì trang luôn bắt đầu từ đỉnh đầu Hero
      if (typeof history !== "undefined" && "scrollRestoration" in history) {
        history.scrollRestoration = "manual";
      }
      window.scrollTo(0, 0);
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
// CHỨC NĂNG MODAL ĐỔI THƯƠNG HIỆU WHITE LABEL (UI CHUẨN DEMO-WD-26)
// ============================================================================

const BRANDS_METADATA = [
  {
    key: "brand-vivoice",
    name: "ViVoice",
    category: "Công nghệ · Giọng nói AI",
    slogan: "Điện thoại & trợ lý ảo cho người thích kể chuyện bằng giọng nói tự nhiên.",
    titleColor: "#38bdf8",
    image: "assets/images/imgvivoice/feature-neural-voice.jpg",
    palette: ["#38bdf8", "#818cf8", "#ffffff", "#131b2e"]
  },
  {
    key: "brand-cybertone",
    name: "CyberTone",
    category: "Công nghệ · Game NPC",
    slogan: "Laptop & Engine thời gian thực: êm như mèo, phản xạ nhanh như báo (< 40ms).",
    titleColor: "#a855f7",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-3.jpg",
    palette: ["#8b5cf6", "#ec4899", "#ffffff", "#180d38"]
  },
  {
    key: "brand-omniclarity",
    name: "OmniClarity",
    category: "Doanh nghiệp · Tổng đài & Y tế",
    slogan: "Tự động hóa tổng đài CSKH, phát âm chuẩn xác số liệu tài chính & y tế.",
    titleColor: "#10b981",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-13.jpg",
    palette: ["#10b981", "#06b6d4", "#ffffff", "#052e22"]
  }
];

function initBrandModal(currentBrandKey) {
  const wlToggleBtn = document.getElementById("wl-toggle-btn");
  const modalBackdrop = document.getElementById("wl-modal-backdrop");
  const modalCloseBtn = document.getElementById("wl-modal-close");
  const modalGrid = document.getElementById("wl-modal-grid");

  if (!wlToggleBtn || !modalBackdrop || !modalGrid) return;

  // Lấy danh sách 3 thương hiệu mặc định + thương hiệu AI tuỳ chỉnh nếu có
  const brandList = [...BRANDS_METADATA];

  try {
    const customBrandRaw = localStorage.getItem("viv_custom_brand_json");
    if (customBrandRaw) {
      const customData = JSON.parse(customBrandRaw);
      if (customData && customData.brand && customData.brand.name) {
        const customKey = customData.brandKey || customData.brand.id || customData.brand.key || "custom-ai-brand";
        const customHero = (customData.sections && customData.sections[0] && customData.sections[0].image) || "assets/images/imgvivoice/feature-neural-voice.jpg";
        const customColor = (customData.theme && customData.theme.primary) || "#f59e0b";
        brandList.push({
          key: customKey,
          name: customData.brand.name,
          category: customData.topic || "AI Brand Architect",
          slogan: customData.brand.slogan || "Thương hiệu độc bản được khởi tạo bởi AI.",
          titleColor: customColor,
          image: customHero,
          palette: [
            customColor,
            (customData.theme && customData.theme.accent) || "#d97706",
            "#ffffff",
            (customData.theme && customData.theme.surface) || "#1f140a"
          ],
          isCustom: true
        });
      }
    }
  } catch (e) { }

  // Render danh sách thương hiệu vào Modal Grid
  modalGrid.innerHTML = brandList.map(brand => {
    const isActive = brand.key === currentBrandKey;
    const dotsHtml = (brand.palette || []).map(color =>
      `<span class="wl-palette-dot" style="background-color: ${color};" title="${color}"></span>`
    ).join("");

    return `
      <div class="wl-brand-card ${isActive ? 'active' : ''}" data-brand="${brand.key}" role="button" tabindex="0">
        <div class="wl-brand-card-thumb">
          <img src="${brand.image}" alt="${brand.name}" loading="lazy" />
          ${isActive ? '<span class="wl-brand-badge-active">Đang xem</span>' : ''}
        </div>
        <div class="wl-brand-card-content">
          <div class="wl-brand-card-category">${brand.category}</div>
          <div class="wl-brand-card-title" style="color: ${brand.titleColor};">${brand.name}</div>
          <div class="wl-brand-card-desc">${brand.slogan}</div>
          <div class="wl-brand-card-palette">
            ${dotsHtml}
          </div>
        </div>
      </div>
    `;
  }).join("");

  // Hàm mở Modal
  function openModal() {
    modalBackdrop.classList.add("open");
    modalBackdrop.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  // Hàm đóng Modal
  function closeModal() {
    modalBackdrop.classList.remove("open");
    modalBackdrop.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  }

  // Bấm nút Đổi thương hiệu để mở Modal
  wlToggleBtn.addEventListener("click", function (e) {
    e.stopPropagation();
    openModal();
  });

  // Bấm nút đóng (X)
  if (modalCloseBtn) {
    modalCloseBtn.addEventListener("click", function (e) {
      e.stopPropagation();
      closeModal();
    });
  }

  // Bấm ra ngoài nền mờ để đóng Modal
  modalBackdrop.addEventListener("click", function (e) {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  // Bấm phím Escape để đóng Modal
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && modalBackdrop.classList.contains("open")) {
      closeModal();
    }
  });

  // Gắn sự kiện chuyển đổi thương hiệu khi chọn thẻ
  const cards = modalGrid.querySelectorAll(".wl-brand-card");
  cards.forEach(card => {
    const handleSelect = () => {
      const selectedBrand = card.dataset.brand;
      if (selectedBrand === currentBrandKey) {
        closeModal();
        return;
      }
      if (typeof localStorage !== "undefined" && selectedBrand) {
        localStorage.setItem("vivoice_current_brand", selectedBrand);
      }
      const newParams = new URLSearchParams(window.location.search);
      newParams.set("brand", selectedBrand);
      window.location.href = window.location.pathname + "?" + newParams.toString() + window.location.hash;
    };

    card.addEventListener("click", handleSelect);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleSelect();
      }
    });
  });
}
