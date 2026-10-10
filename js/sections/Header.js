import { esc } from "../core/esc.js";
import { audioState } from "../core/audio-state.js";

// HÀM TẠO GIAO DIỆN HEADER
export function renderHeader(config) {
    let brand = config.brand;
    let nav = config.nav;

    if (nav === undefined) {
        nav = []; // Nếu không có menu thì tạo mảng rỗng để không bị lỗi
    }

    // 1. Kiểm tra xem công ty có Logo hình ảnh không, nếu không thì dùng tên dạng chữ
    let logoHTML = "";
    if (brand.logo !== undefined && brand.logo !== "") {
        logoHTML = '<img class="logo-img" src="' + esc(brand.logo) + '" alt="' + esc(brand.name) + '" />';
    } else {
        logoHTML = '<span class="logo-text">' + esc(brand.name) + '</span>';
    }

    // 2. Tạo danh sách các đường link (Menu) bằng vòng lặp for
    let navLinksHTML = "";
    for (let i = 0; i < nav.length; i++) {
        let item = nav[i];
        navLinksHTML = navLinksHTML + '<a class="nav-link" href="' + esc(item.href) + '">' + esc(item.label) + '</a>';
    }

    // 3. Ghép toàn bộ vào khung Header
    let headerElement = document.getElementById("site-header");
    if (headerElement !== null) {
        headerElement.innerHTML = `
      <div class="container header-inner">
        <a class="brand" href="#" aria-label="${esc(brand.name)}">${logoHTML}</a>
        
        <nav class="nav-menu" id="header-nav">
          <div class="nav-indicator" id="nav-indicator"></div>
          ${navLinksHTML}
        </nav>
        
        <div class="header-action">
          <!-- Nút bật/tắt âm thanh giọng đọc thương hiệu -->
          <button type="button" id="header-audio-toggle" class="header-audio-btn" aria-label="Bật hoặc tắt âm thanh" title="Bật giọng đọc giới thiệu">
            <span class="audio-bars" aria-hidden="true">
              <span class="bar bar-1"></span>
              <span class="bar bar-2"></span>
              <span class="bar bar-3"></span>
            </span>
            <span class="audio-btn-label">Âm thanh</span>
          </button>
          
          <a class="btn btn-sm btn-primary btn-magnetic" href="#demo">Trải nghiệm</a>
        </div>
      </div>`;
    }

    // 4. Kích hoạt hiệu ứng "viên thuốc" trượt theo con trỏ chuột
    initNavIndicator();

    // 5. Kích hoạt nút bật/tắt âm thanh
    initHeaderAudio(config);
}

// HÀM TẠO HIỆU ỨNG DI CHUỘT TRÊN MENU
function initNavIndicator() {
    let nav = document.getElementById("header-nav");
    let indicator = document.getElementById("nav-indicator");

    if (nav === null || indicator === null) {
        return;
    }

    let links = nav.querySelectorAll(".nav-link");

    for (let i = 0; i < links.length; i++) {
        let link = links[i];

        link.addEventListener("mouseenter", function () {
            indicator.style.width = link.offsetWidth + "px";
            indicator.style.left = link.offsetLeft + "px";
            indicator.style.opacity = "1";
        });
    }

    nav.addEventListener("mouseleave", function () {
        indicator.style.opacity = "0";
    });
}

// HÀM KHỞI TẠO NÚT BẬT/TẮT ÂM THANH TRÊN HEADER
function initHeaderAudio(config) {
    let audioBtn = document.getElementById("header-audio-toggle");
    if (!audioBtn) return;

    const heroSection = (config.sections || []).find((s) => s.type === "hero");
    const welcomeAudio = heroSection ? heroSection.welcomeAudio : "";
    const sampleText =
        (heroSection && (heroSection.playSample || heroSection.welcomeMessage)) ||
        ("Chào mừng bạn đến với " + (config.brand ? config.brand.name : "thương hiệu của chúng tôi"));

    // Lắng nghe thay đổi trạng thái phát âm thanh toàn trang để đồng bộ nút
    audioState.subscribe((event, data) => {
        let isPlaying = data && data.isPlaying;
        if (isPlaying) {
            audioBtn.classList.add("is-playing");
            audioBtn.setAttribute("title", "Đang phát âm thanh — Bấm để tắt");
            let label = audioBtn.querySelector(".audio-btn-label");
            if (label) label.textContent = "Đang phát";
        } else {
            audioBtn.classList.remove("is-playing");
            audioBtn.setAttribute("title", "Bật giọng đọc giới thiệu");
            let label = audioBtn.querySelector(".audio-btn-label");
            if (label) label.textContent = "Âm thanh";
        }
    });

    // Bấm vào nút để bật / tắt âm thanh
    audioBtn.addEventListener("click", () => {
        if (audioState.isPlaying) {
            audioState.stopSpeech();
        } else {
            if (welcomeAudio) {
                audioState.playAudioFile(welcomeAudio, { text: sampleText });
            } else {
                audioState.playSpeech(sampleText);
            }
        }
    });
}

// Web Component (Yêu cầu nâng cao - Giữ nguyên kiến trúc nhưng viết lại cho dễ hiểu)
export class WlHeader extends (typeof HTMLElement !== "undefined" ? HTMLElement : class { }) {
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

// Đăng ký thẻ HTML tự chế <wl-header>
if (typeof customElements !== "undefined" && !customElements.get("wl-header")) {
    customElements.define("wl-header", WlHeader);
}