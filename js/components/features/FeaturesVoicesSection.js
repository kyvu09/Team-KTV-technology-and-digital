// ============================================================================
// FeaturesVoicesSection.js — Section 2 Trang Tính Năng: Kho Giọng Đọc Chuyên Nghiệp
// Thiết kế Carousel 3D (Coverflow) 5 khung quây xoay vòng lặp vô tận,
// Tích hợp phát các file .mp3 có sẵn trong assets/audio/, thanh sóng âm thanh và mini-player.
// ============================================================================

import { esc } from "../../core/esc.js";
import { audioState } from "../../core/audio-state.js";

/**
 * Danh sách 5 giọng đọc chuẩn ứng với 5 file .mp3 có sẵn trong assets/audio/
 */
export const FEATURE_VOICES = [
  {
    id: "voice-thanh-ha",
    name: "Thanh Hà",
    category: "TIẾNG VIỆT · NỮ MIỀN BẮC",
    role: "Giọng Đọc Audio & Sách Nói",
    description: "Chất giọng phát thanh thanh lịch, chuẩn ngữ điệu Hà Nội, phù hợp cho sách nói, phóng sự và video cảm xúc.",
    audioSrc: "assets/audio/giongDocLamAudio.mp3",
    theme: "theme-green",
    gradient: "radial-gradient(circle at 65% 35%, rgba(134, 239, 172, 0.9) 0%, rgba(74, 222, 128, 0.5) 45%, rgba(240, 253, 244, 0.98) 95%)",
    textColor: "#0f291e",
    waveformColor: "#15803d",
  },
  {
    id: "voice-minh-khoi",
    name: "Minh Khôi",
    category: "TIẾNG VIỆT · NAM TRUYỀN CẢM",
    role: "Giọng Đọc Truyền Cảm",
    description: "Trầm ấm, nội lực vững vàng, chuẩn phát âm chuyên nghiệp phục vụ sản xuất phóng sự, sách nói và podcast dài kỳ.",
    audioSrc: "assets/audio/giongTruyenCam.mp3",
    theme: "theme-amber",
    gradient: "radial-gradient(circle at 45% 45%, rgba(253, 224, 71, 0.9) 0%, rgba(245, 158, 11, 0.5) 50%, rgba(254, 249, 195, 0.98) 95%)",
    textColor: "#332200",
    waveformColor: "#b45309",
  },
  {
    id: "voice-lan-chi",
    name: "Lan Chi",
    category: "TIẾNG VIỆT · NỮ MIỀN TRUNG",
    role: "Lựa Chọn Tối Ưu",
    description: "Ngọt ngào, nhẹ nhàng, giữ trọn sắc thái luyến láy cố đô, thích hợp kể chuyện, thơ ca và video nghệ thuật.",
    audioSrc: "assets/audio/chonGiongPhuHop.mp3",
    theme: "theme-sunset",
    gradient: "radial-gradient(circle at 70% 30%, rgba(251, 146, 60, 0.8) 0%, rgba(244, 114, 182, 0.55) 40%, rgba(147, 197, 253, 0.95) 95%)",
    textColor: "#2b1055",
    waveformColor: "#9333ea",
  },
  {
    id: "voice-tuan-anh",
    name: "Tuấn Anh",
    category: "TIẾNG VIỆT · NAM ĐA PHONG CÁCH",
    role: "Biến Hóa Phong Cách",
    description: "Đĩnh đạc, rõ ràng, dứt khoát, chuyên biệt cho tổng đài tự động hóa, thông báo số dư và chăm sóc khách hàng 24/7.",
    audioSrc: "assets/audio/giongNamHayNu.mp3",
    theme: "theme-rose",
    gradient: "radial-gradient(circle at 35% 35%, rgba(251, 113, 133, 0.85) 0%, rgba(244, 63, 94, 0.5) 45%, rgba(255, 241, 242, 0.98) 95%)",
    textColor: "#3f0a15",
    waveformColor: "#e11d48",
  },
  {
    id: "voice-mai-phuong",
    name: "Mai Phương",
    category: "TIẾNG VIỆT · NỮ CSKH & DOANH NGHIỆP",
    role: "Trợ Lý CSKH & Chào Hỗ Trợ",
    description: "Dịu dàng, chu đáo, phát âm dứt khoát, chuyên biệt cho tổng đài tự động hóa, lời chào hỗ trợ và dịch vụ khách hàng 24/7.",
    audioSrc: "assets/audio/chaoHoTro.mp3",
    theme: "theme-ocean",
    gradient: "radial-gradient(circle at 55% 45%, rgba(56, 189, 248, 0.9) 0%, rgba(14, 165, 233, 0.5) 50%, rgba(240, 249, 255, 0.98) 95%)",
    textColor: "#082f49",
    waveformColor: "#0284c7",
  },
];

/**
 * Render một thẻ giọng đọc hoàn chỉnh
 */
function renderCustomVoiceCard(voice, index) {
  // 18 thanh sóng âm thanh mô phỏng
  const waveHeights = [14, 24, 38, 20, 46, 30, 16, 28, 44, 32, 18, 42, 26, 36, 22, 40, 16, 28];
  const waveBarsHtml = waveHeights
    .map(
      (h, i) =>
        `<span class="wave-bar wave-bar-${i}" style="--bar-h: ${h}px; --bar-delay: ${(i * 0.06).toFixed(2)}s"></span>`,
    )
    .join("");

  return `
    <article class="custom-voice-card ${voice.theme}" data-voice-id="${esc(voice.id)}" data-index="${index}" role="group" aria-label="Giọng đọc ${esc(voice.name)}">
      <!-- Nền chuyển mờ nghệ thuật Mesh Gradient -->
      <div class="card-mesh-bg" style="background: ${voice.gradient};" aria-hidden="true"></div>

      <!-- Thẻ chứa nội dung chi tiết -->
      <div class="card-inner-content">
        <!-- Khối tiêu đề trên cùng: Thể loại, Tên và Phong cách -->
        <div class="card-top-header">
          <span class="card-category-tag">${esc(voice.category)}</span>
          <h3 class="card-voice-name">${esc(voice.name)}</h3>
          <span class="card-voice-role">${esc(voice.role)}</span>
        </div>

        <!-- Khối giữa: Sóng âm thanh & Nút phát tròn to ở giữa -->
        <div class="card-center-stage">
          <div class="card-waveform-bars" aria-hidden="true">
            ${waveBarsHtml}
          </div>

          <!-- Nút phát chính giữa -->
          <button class="card-center-play-btn" type="button" aria-label="Phát giọng đọc ${esc(voice.name)}" data-play-trigger="${esc(voice.id)}">
            <span class="play-icon-shape">
              <svg class="icon-play" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <polygon points="6 3 20 12 6 21 6 3"></polygon>
              </svg>
              <svg class="icon-pause" width="22" height="22" viewBox="0 0 24 24" fill="currentColor">
                <rect x="5" y="4" width="4" height="16" rx="1"></rect>
                <rect x="15" y="4" width="4" height="16" rx="1"></rect>
              </svg>
            </span>
          </button>
        </div>

        <!-- Mô tả phong cách giọng đọc -->
        <p class="card-voice-desc">${esc(voice.description)}</p>

        <!-- Thanh điều khiển Mini Player ở đáy thẻ -->
        <div class="card-bottom-player">
          <button class="mini-player-play-btn" type="button" aria-label="Phát hoặc tạm dừng" data-play-trigger="${esc(voice.id)}">
            <svg class="mini-icon-play" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <polygon points="6 3 20 12 6 21 6 3"></polygon>
            </svg>
            <svg class="mini-icon-pause" width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
              <rect x="5" y="4" width="4" height="16" rx="1"></rect>
              <rect x="15" y="4" width="4" height="16" rx="1"></rect>
            </svg>
          </button>

          <div class="mini-player-track-wrap" data-seek-trigger="${esc(voice.id)}" title="Nhấn để tua âm thanh">
            <div class="mini-player-track-bg"></div>
            <div class="mini-player-progress-bar" style="width: 0%"></div>
          </div>

          <span class="mini-player-time">0:00 / 0:00</span>
        </div>
      </div>
    </article>`.trim();
}

/**
 * Render Section 2: Kho Giọng Đọc Chuyên Nghiệp (Custom Voices Carousel)
 * @param {Object} [config]
 * @returns {string} HTML markup
 */
export function renderFeaturesVoicesSection(config = {}) {
  const cardsHtml = FEATURE_VOICES.map((voice, idx) =>
    renderCustomVoiceCard(voice, idx),
  ).join("");

  const dotsHtml = FEATURE_VOICES.map(
    (_, idx) =>
      `<button class="carousel-dot${idx === 0 ? " is-active" : ""}" data-index="${idx}" type="button" aria-label="Chuyển đến giọng ${idx + 1}"></button>`,
  ).join("");

  return `
    <section class="section features-voices-section" id="features-voices" aria-label="Kho Giọng Đọc Chuyên Nghiệp">
      <div class="container">
        <!-- Khối tiêu đề căn giữa tiếng Việt -->
        <div class="voices-header-row text-center reveal">
          <div class="voices-header-center mx-auto">
            <div class="voices-header-badge-wrapper" style="margin-bottom: 14px;">
              <span class="badge badge-primary">
                <i class="fa-solid fa-earth-asia" aria-hidden="true"></i> HỆ THỐNG 20+ CHẤT GIỌNG
              </span>
            </div>
            <h2 class="voices-main-title">Kho Giọng Đọc Đa Dạng Vùng Miền</h2>
            <p class="voices-main-desc">
              Trải nghiệm 5 chất giọng tiêu biểu đại diện cho hệ sinh thái hơn 20+ giọng đọc Bắc — Trung — Nam của ViVoice, tái hiện trọn vẹn cảm xúc và ngữ điệu tự nhiên.
            </p>
          </div>
        </div>

        <!-- Khung sân khấu Carousel 3D (Quây đi quây lại 5 khung) -->
        <div class="voices-carousel-viewport reveal" id="voices-carousel-viewport">
          <!-- Nút điều hướng Trái -->
          <button class="carousel-nav-btn carousel-nav-prev" id="voices-prev-btn" type="button" aria-label="Giọng trước đó">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M15 18l-6-6 6-6"/>
            </svg>
          </button>

          <!-- Vùng xoay vòng 5 thẻ -->
          <div class="voices-carousel-stage" id="voices-carousel-stage">
            ${cardsHtml}
          </div>

          <!-- Nút điều hướng Phải -->
          <button class="carousel-nav-btn carousel-nav-next" id="voices-next-btn" type="button" aria-label="Giọng tiếp theo">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <path d="M9 18l6-6-6-6"/>
            </svg>
          </button>
        </div>

        <!-- Thanh phân trang chấm tròn & Nút kêu gọi hành động dưới cùng -->
        <div class="voices-carousel-footer text-center reveal">
          <div class="voices-carousel-dots" id="voices-carousel-dots" role="tablist" aria-label="Chọn giọng đọc">
            ${dotsHtml}
          </div>

          <div class="voices-cta-wrap">
            <a href="#demo" class="btn-create-custom-voice" data-page-link="demo">
              <span>Trải nghiệm ngay</span>
            </a>
          </div>
        </div>
      </div>
    </section>`.trim();
}

/**
 * Định dạng số giây sang mm:ss
 */
function formatAudioTime(seconds) {
  if (isNaN(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? "0" : ""}${s}`;
}

/**
 * Khởi tạo toàn bộ tương tác cho Carousel 5 khung xoay vòng & Phát file .mp3
 */
export function initFeaturesVoicesSection() {
  const stage = document.getElementById("voices-carousel-stage");
  if (!stage) return;

  const cards = Array.from(stage.querySelectorAll(".custom-voice-card"));
  const prevBtn = document.getElementById("voices-prev-btn");
  const nextBtn = document.getElementById("voices-next-btn");
  const dotsContainer = document.getElementById("voices-carousel-dots");
  const dots = dotsContainer ? Array.from(dotsContainer.querySelectorAll(".carousel-dot")) : [];

  const totalCards = cards.length;
  let currentIndex = 0; // Thẻ ở giữa đang active

  // Quản lý bộ phát âm thanh HTML5 cho 5 thẻ
  const audioMap = new Map();
  let currentlyPlayingId = null;

  FEATURE_VOICES.forEach((v) => {
    const audio = new Audio(v.audioSrc);
    audio.preload = "metadata";

    const card = stage.querySelector(`.custom-voice-card[data-voice-id="${v.id}"]`);
    const timeDisplay = card?.querySelector(".mini-player-time");
    const progressBar = card?.querySelector(".mini-player-progress-bar");

    audio.addEventListener("loadedmetadata", () => {
      if (timeDisplay) {
        timeDisplay.textContent = `0:00 / ${formatAudioTime(audio.duration)}`;
      }
    });

    audio.addEventListener("timeupdate", () => {
      if (audio.duration && progressBar && timeDisplay) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progressBar.style.width = `${pct}%`;
        timeDisplay.textContent = `${formatAudioTime(audio.currentTime)} / ${formatAudioTime(audio.duration)}`;
      }
    });

    audio.addEventListener("ended", () => {
      stopCardPlayback(v.id);
    });

    audio.addEventListener("pause", () => {
      if (currentlyPlayingId === v.id && audio.currentTime < audio.duration) {
        setCardPlayingUI(v.id, false);
      }
    });

    audioMap.set(v.id, audio);
  });

  function setCardPlayingUI(voiceId, isPlaying) {
    const card = stage.querySelector(`.custom-voice-card[data-voice-id="${voiceId}"]`);
    if (!card) return;
    card.classList.toggle("is-playing", isPlaying);
  }

  function stopCardPlayback(voiceId) {
    const audio = audioMap.get(voiceId);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setCardPlayingUI(voiceId, false);
    const card = stage.querySelector(`.custom-voice-card[data-voice-id="${voiceId}"]`);
    const progressBar = card?.querySelector(".mini-player-progress-bar");
    const timeDisplay = card?.querySelector(".mini-player-time");
    if (progressBar) progressBar.style.width = "0%";
    if (timeDisplay && audio) {
      timeDisplay.textContent = `0:00 / ${formatAudioTime(audio.duration)}`;
    }
    if (currentlyPlayingId === voiceId) {
      currentlyPlayingId = null;
    }
  }

  function stopAllAudios() {
    FEATURE_VOICES.forEach((v) => stopCardPlayback(v.id));
  }

  function togglePlayVoice(voiceId) {
    const audio = audioMap.get(voiceId);
    if (!audio) return;

    if (currentlyPlayingId === voiceId && !audio.paused) {
      audio.pause();
      setCardPlayingUI(voiceId, false);
      currentlyPlayingId = null;
      return;
    }

    if (currentlyPlayingId && currentlyPlayingId !== voiceId) {
      stopCardPlayback(currentlyPlayingId);
    }

    // Nếu toàn trang đang bật âm thanh Web Speech hoặc âm thanh khác thì dừng lại
    audioState.stopSpeech();

    currentlyPlayingId = voiceId;
    setCardPlayingUI(voiceId, true);

    audio.play().catch((err) => {
      console.warn("Không thể phát âm thanh tự động:", err);
      setCardPlayingUI(voiceId, false);
      currentlyPlayingId = null;
    });
  }

  // Gắn sự kiện nút phát (nút tròn to ở giữa & nút mini player ở đáy)
  cards.forEach((card) => {
    const voiceId = card.getAttribute("data-voice-id");
    const playTriggers = card.querySelectorAll(`[data-play-trigger="${voiceId}"]`);
    playTriggers.forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        togglePlayVoice(voiceId);
      });
    });

    // Tua thanh thời lượng (Seekbar)
    const seekTrack = card.querySelector(`[data-seek-trigger="${voiceId}"]`);
    if (seekTrack) {
      seekTrack.addEventListener("click", (e) => {
        e.stopPropagation();
        const audio = audioMap.get(voiceId);
        if (!audio || !audio.duration) return;
        const rect = seekTrack.getBoundingClientRect();
        const clickRatio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
        audio.currentTime = clickRatio * audio.duration;
      });
    }

    // Nhấn vào thẻ bên cạnh để xoay sang thẻ đó
    card.addEventListener("click", () => {
      const idx = parseInt(card.getAttribute("data-index"), 10);
      if (idx !== currentIndex) {
        updateCarousel(idx);
      }
    });
  });

  /**
   * Cập nhật vị trí 5 thẻ theo chu trình xoay vòng (Coverflow loop)
   */
  function updateCarousel(newIndex) {
    currentIndex = (newIndex + totalCards) % totalCards;

    cards.forEach((card, idx) => {
      // Tính độ lệch vòng tròn từ -2 đến +2
      let diff = (idx - currentIndex + totalCards) % totalCards;
      if (diff > 2) diff -= totalCards;

      card.classList.remove("is-active", "is-prev", "is-next", "is-far-prev", "is-far-next");

      if (diff === 0) {
        card.classList.add("is-active");
      } else if (diff === -1) {
        card.classList.add("is-prev");
      } else if (diff === 1) {
        card.classList.add("is-next");
      } else if (diff === -2) {
        card.classList.add("is-far-prev");
      } else if (diff === 2) {
        card.classList.add("is-far-next");
      }
    });

    // Cập nhật chấm tròn phân trang
    dots.forEach((dot, idx) => {
      dot.classList.toggle("is-active", idx === currentIndex);
    });
  }

  // Điều hướng nút Prev / Next
  if (prevBtn) {
    prevBtn.addEventListener("click", () => {
      updateCarousel(currentIndex - 1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", () => {
      updateCarousel(currentIndex + 1);
    });
  }

  // Điều hướng khi bấm vào chấm tròn
  dots.forEach((dot, idx) => {
    dot.addEventListener("click", () => {
      updateCarousel(idx);
    });
  });

  // Hỗ trợ vuốt chạm trên màn hình cảm ứng / chuột
  let touchStartX = 0;
  let touchEndX = 0;
  stage.addEventListener("touchstart", (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  stage.addEventListener("touchend", (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) updateCarousel(currentIndex - 1);
      else updateCarousel(currentIndex + 1);
    }
  }, { passive: true });

  // Khởi động vị trí mặc định ban đầu
  updateCarousel(0);

  // Đăng ký đồng bộ dừng âm thanh khi người dùng kích hoạt âm thanh ở phần khác
  audioState.subscribe((event) => {
    if (event === "stop" || event === "mute_change") {
      stopAllAudios();
    }
  });
}
