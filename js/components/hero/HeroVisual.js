// ============================================================================
// HeroVisual.js — Khối Trực quan Đa phương tiện bên Phải của Hero (Right Block)
// Hợp nhất: Quả cầu 3D Three.js (HeroMedia) & Bảng điều khiển Voice AI Console (HeroVoiceStudio)
// Tự động phân nhánh linh hoạt theo cấu hình White-Label JSON
// ============================================================================

import { esc } from "../../core/esc.js";
import { audioState } from "../../core/audio-state.js";

// ============================================================================
// 1. GIAO DIỆN CON 1: BẢNG ĐIỀU KHIỂN VOICE AI STUDIO CONSOLE (ViVoice)
// ============================================================================

/**
 * Visualizer sóng âm thanh vạch ngang phản hồi thời gian thực
 */
class StudioDashVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.animId = null;
    this.isPlaying = false;
    this.activeFreq = 0;
    this.numDashes = 28;
    this.heights = new Array(this.numDashes).fill(3);
    this.init();
  }

  init() {
    this.resize();
    this.resizeHandler = () => this.resize();
    window.addEventListener("resize", this.resizeHandler);

    this.unsubscribe = audioState.subscribe((event, data) => {
      if (event === "start") {
        this.isPlaying = true;
      } else if (event === "stop" || event === "end") {
        this.isPlaying = false;
        this.activeFreq = 0;
      } else if (event === "word" || event === "tick") {
        this.isPlaying = true;
        this.activeFreq = data && data.frequency ? data.frequency : 0.8;
      }
    });

    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = Math.max(200, Math.floor(rect.width * dpr));
    this.canvas.height = Math.max(28, Math.floor(rect.height * dpr));
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const w = canvas.width;
    const h = canvas.height;
    const count = this.numDashes;
    const dashGap = w * 0.016;
    const dashWidth = Math.max(6, (w - (count - 1) * dashGap) / count);
    const dpr = window.devicePixelRatio || 1;
    const baseH = 3 * dpr;
    const now = Date.now();

    for (let i = 0; i < count; i++) {
      let targetH = baseH;

      if (this.isPlaying) {
        const wave1 = Math.sin(now * 0.009 + i * 0.35) * 0.5 + 0.5;
        const wave2 = Math.cos(now * 0.006 - i * 0.25) * 0.5 + 0.5;
        const blend = wave1 * 0.7 + wave2 * 0.3;
        const amp = 0.35 + (this.activeFreq || 0.65) * 0.65;
        targetH = baseH + h * 0.6 * blend * amp;
      } else {
        targetH = baseH;
      }

      this.heights[i] += (targetH - this.heights[i]) * 0.22;
      const currentH = Math.max(baseH, this.heights[i]);
      const x = i * (dashWidth + dashGap);
      const y = (h - currentH) / 2;

      ctx.beginPath();
      const radius = Math.min(dashWidth / 2, currentH / 2);
      if (typeof ctx.roundRect === "function") {
        ctx.roundRect(x, y, dashWidth, currentH, radius);
      } else {
        ctx.rect(x, y, dashWidth, currentH);
      }

      const primaryColor =
        getComputedStyle(document.documentElement)
          .getPropertyValue("--primary")
          .trim() || "#38bdf8";
      const opacity = this.isPlaying
        ? 0.75 + 0.25 * Math.sin(now * 0.005 + i * 0.2)
        : 0.85;

      ctx.globalAlpha = opacity;
      ctx.fillStyle = primaryColor;
      ctx.shadowColor = primaryColor;
      ctx.shadowBlur = this.isPlaying ? 10 : 4;
      ctx.fill();
      ctx.globalAlpha = 1;
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
    if (this.resizeHandler)
      window.removeEventListener("resize", this.resizeHandler);
    if (this.unsubscribe) this.unsubscribe();
  }
}

function renderStudioMarkup() {
  return `
    <div class="hero-voice-studio reveal" id="hero-voice-studio">
      <div class="studio-console-card studio-simple-card">
        <!-- Header Console: macOS dots & Status badge -->
        <div class="studio-card-header">
          <div class="studio-mac-dots" aria-hidden="true">
            <span class="mac-dot mac-dot--red"></span>
            <span class="mac-dot mac-dot--yellow"></span>
            <span class="mac-dot mac-dot--green"></span>
          </div>
          <div class="studio-status-badge" id="studio-status-badge">
            <span class="status-pulse-dot"></span>
            <span class="status-text">SẴN SÀNG</span>
          </div>
        </div>

        <!-- Dải sóng âm thanh dạng vạch ngang -->
        <div class="studio-waveform-strip" id="studio-waveform-strip">
          <canvas id="hero-studio-waveform" class="hero-studio-waveform" height="32"></canvas>
        </div>

        <!-- Khung nhập nội dung văn bản đọc thử (để trống mặc định) -->
        <div class="studio-text-box-wrap">
          <textarea 
            id="studio-text-input" 
            class="studio-text-input" 
            rows="3" 
            spellcheck="false" 
            aria-label="Văn bản đọc thử giọng nói AI"
            placeholder="Nhập văn bản cần đọc..."></textarea>
        </div>

        <!-- Thanh phụ: Đếm số ký tự & Nút thùng rác -->
        <div class="studio-text-subbar">
          <span class="studio-char-count" id="studio-char-count">0 ký tự</span>
          <button class="studio-trash-btn" id="studio-clear-btn" type="button" aria-label="Xóa nội dung" title="Xóa nội dung">
            <span>Xóa</span>
          </button>
        </div>

        <!-- Nút hành động chính: Phát giọng nói -->
        <div class="studio-action-center">
          <button class="studio-pill-play-btn" id="hero-studio-play-btn" type="button" aria-label="Phát giọng nói">
            <span id="hero-studio-play-label">Phát giọng nói</span>
          </button>
        </div>
      </div>
    </div>`.trim();
}

let currentVisualizerInstance = null;
let currentAutoWelcomeCleanup = null;
let currentWelcomeTimeout = null;

export function clearPendingWelcome() {
  if (currentWelcomeTimeout) {
    clearTimeout(currentWelcomeTimeout);
    currentWelcomeTimeout = null;
  }
  if (typeof currentAutoWelcomeCleanup === "function") {
    currentAutoWelcomeCleanup();
    currentAutoWelcomeCleanup = null;
  }
}

function initStudioInteractions(props = {}) {
  const container = document.getElementById("hero-voice-studio");
  if (!container) return;

  const playBtn = document.getElementById("hero-studio-play-btn");
  const playIcon = document.getElementById("hero-studio-play-icon");
  const playLabel = document.getElementById("hero-studio-play-label");
  const statusBadge = document.getElementById("studio-status-badge");
  const statusText = statusBadge
    ? statusBadge.querySelector(".status-text")
    : null;
  const textInput = document.getElementById("studio-text-input");
  const charCount = document.getElementById("studio-char-count");
  const clearBtn = document.getElementById("studio-clear-btn");

  const brandName = props.brandName || "";
  const welcomeMessage =
    props.welcomeMessage ||
    (brandName ? `Chào mừng bạn đến với ${brandName}` : "Chào mừng đến website của chúng tôi");
  const welcomeAudio =
    typeof props.welcomeAudio === "string" ? props.welcomeAudio.trim() : "";

  // Visualizer sóng âm (dọn dẹp visualizer cũ nếu có)
  if (currentVisualizerInstance) {
    try {
      currentVisualizerInstance.destroy();
    } catch (e) {}
    currentVisualizerInstance = null;
  }
  try {
    currentVisualizerInstance = new StudioDashVisualizer("hero-studio-waveform");
  } catch (err) {
    console.warn("Lỗi khởi tạo StudioDashVisualizer:", err);
  }

  let autoWelcomeTriggered = false;

  const updateCharCount = () => {
    if (charCount && textInput) {
      charCount.textContent = `${textInput.value.length} ký tự`;
    }
  };

  if (textInput) {
    textInput.addEventListener("input", () => {
      updateCharCount();
      autoWelcomeTriggered = true;
    });
  }

  if (clearBtn && textInput) {
    clearBtn.addEventListener("click", () => {
      textInput.value = "";
      updateCharCount();
      textInput.focus();
    });
  }

  const setPlayingState = (isPlaying) => {
    if (isPlaying) {
      container.classList.add("is-active-playing");
      if (playIcon) playIcon.className = "fa-solid fa-pause";
      if (playLabel) playLabel.textContent = "Dừng phát";
      if (statusBadge) statusBadge.classList.add("is-live");
      if (statusText) statusText.textContent = "ĐANG PHÁT";
    } else {
      container.classList.remove("is-active-playing");
      if (playIcon) playIcon.className = "fa-solid fa-play";
      if (playLabel) playLabel.textContent = "Phát giọng nói";
      if (statusBadge) statusBadge.classList.remove("is-live");
      if (statusText) statusText.textContent = "SẴN SÀNG";
    }
  };

  const togglePlayAudio = () => {
    if (audioState.isPlaying) {
      audioState.stopSpeech();
      setPlayingState(false);
      return;
    }

    const currentText = textInput ? textInput.value.trim() : "";
    if (!currentText) {
      if (textInput) textInput.focus();
      return;
    }

    if (audioState.isMuted) audioState.setMuted(false);
    setPlayingState(true);

    audioState.playSpeech(currentText, {
      onEnd: () => setPlayingState(false),
    });
  };

  if (playBtn) {
    playBtn.addEventListener("click", (e) => {
      e.stopPropagation();
      togglePlayAudio();
    });
  }

  audioState.subscribe((event, data) => {
    if (event === "stop" || event === "end") {
      setPlayingState(false);
    } else if (event === "start") {
      setPlayingState(true);
    } else if (event === "mute_change" && data && data.isMuted) {
      setPlayingState(false);
    }
  });

  // Tự động phát âm thanh chào mừng duy nhất của thương hiệu hiện tại
  const playWelcome = () => {
    if (autoWelcomeTriggered) return;
    if (audioState.isPlaying) return;
    if (audioState.isMuted) return;
    if (textInput && textInput.value.trim().length > 0) return;

    autoWelcomeTriggered = true;
    const onFinish = () => setPlayingState(false);

    if (welcomeAudio) {
      setPlayingState(true);
      const res = audioState.playAudioFile(welcomeAudio, {
        text: welcomeMessage,
        onEnd: onFinish,
      });

      if (res && res.playPromise) {
        res.playPromise
          .then(() => {})
          .catch(() => {
            setPlayingState(false);
            const unlockEvents = [
              "pointerdown",
              "click",
              "keydown",
              "wheel",
              "touchstart",
              "scroll",
            ];
            const onUserGesture = (evt) => {
              if (playBtn && playBtn.contains(evt.target)) return;
              if (textInput && textInput.contains(evt.target)) return;
              clearPendingWelcome();
              if (!audioState.isPlaying && (!textInput || !textInput.value.trim())) {
                playWelcome();
              }
            };
            unlockEvents.forEach((evtName) => {
              window.addEventListener(evtName, onUserGesture, {
                once: true,
                capture: true,
              });
            });
            currentAutoWelcomeCleanup = () => {
              unlockEvents.forEach((evtName) => {
                window.removeEventListener(evtName, onUserGesture, true);
              });
            };
          });
      }
    } else if (welcomeMessage) {
      setPlayingState(true);
      audioState.playSpeech(welcomeMessage, { onEnd: onFinish });
    }
  };

  const triggerAutoWelcome = () => {
    currentWelcomeTimeout = setTimeout(playWelcome, 250);
  };
  const preloaderEl = document.getElementById("site-preloader");
  if (preloaderEl && preloaderEl.style.display !== "none") {
    window.addEventListener("preloader:finished", triggerAutoWelcome, {
      once: true,
    });
    currentWelcomeTimeout = setTimeout(triggerAutoWelcome, 1200);
  } else {
    triggerAutoWelcome();
  }
}

// ============================================================================
// 2. GIAO DIỆN CON 2: SÂN KHẤU QUẢ CẦU 3D THREE.JS (HeroMedia)
// ============================================================================

function renderOrbMarkup() {
  return `
    <div class="hero-media reveal">
      <div class="orb-stage" id="hero-orb-stage" role="button" tabindex="0" data-play-audio="true" aria-label="Quả cầu giọng nói AI — Bấm để phát hoặc dừng" title="Bấm vào quả cầu để phát hoặc dừng âm thanh">
        <div id="hero-voice-orb" class="voice-orb-container" data-play-audio="true"></div>
        <div class="orb-ring" aria-hidden="true"></div>
        <div class="orb-ring orb-ring-outer" aria-hidden="true"></div>
      </div>
    </div>`.trim();
}

function initOrbInteractions({ welcomeMessage = "", welcomeAudio = "", brandName = "" } = {}) {
  const orbStage = document.getElementById("hero-orb-stage");
  const orbContainer = document.getElementById("hero-voice-orb");
  const welcomeText =
    welcomeMessage ||
    (brandName ? `Chào mừng bạn đến với ${brandName}` : "Chào mừng đến website của chúng tôi");
  const audioFile =
    typeof welcomeAudio === "string" ? welcomeAudio.trim() : "";

  let autoWelcomeTriggered = false;

  const setPlayingUI = (playing) => {
    if (orbStage) {
      if (playing) {
        orbStage.classList.add("is-playing");
      } else {
        orbStage.classList.remove("is-playing");
      }
    }
  };

  const playWelcome = () => {
    if (autoWelcomeTriggered) return;
    if (audioState.isPlaying) return;
    autoWelcomeTriggered = true;

    if (audioState.isMuted) audioState.setMuted(false);
    setPlayingUI(true);

    const onFinish = () => setPlayingUI(false);

    if (audioFile) {
      const res = audioState.playAudioFile(audioFile, {
        text: welcomeText,
        onEnd: onFinish,
      });

      if (res && res.playPromise) {
        res.playPromise
          .then(() => {})
          .catch(() => {
            setPlayingUI(false);
            const unlockEvents = [
              "pointerdown",
              "click",
              "keydown",
              "wheel",
              "touchstart",
              "scroll",
            ];
            const onUserGesture = (evt) => {
              if (orbStage && orbStage.contains(evt.target)) return;
              clearPendingWelcome();
              if (!audioState.isPlaying) {
                playWelcome();
              }
            };
            unlockEvents.forEach((evt) => {
              window.addEventListener(evt, onUserGesture, {
                once: true,
                capture: true,
              });
            });
            currentAutoWelcomeCleanup = () => {
              unlockEvents.forEach((evt) => {
                window.removeEventListener(evt, onUserGesture, true);
              });
            };
          });
      }
    } else if (welcomeText) {
      audioState.playSpeech(welcomeText, { onEnd: onFinish });
    }
  };

  const handleOrbToggle = (e) => {
    if (e) e.stopPropagation();
    if (
      audioState.isPlaying &&
      orbStage &&
      orbStage.classList.contains("is-playing")
    ) {
      audioState.stopSpeech();
      setPlayingUI(false);
    } else {
      autoWelcomeTriggered = true;
      if (audioState.isMuted) audioState.setMuted(false);
      setPlayingUI(true);
      const onFinish = () => setPlayingUI(false);
      if (audioFile) {
        audioState.playAudioFile(audioFile, { text: welcomeText, onEnd: onFinish });
      } else if (welcomeText) {
        audioState.playSpeech(welcomeText, { onEnd: onFinish });
      }
    }
  };

  if (orbStage) {
    orbStage.addEventListener("click", handleOrbToggle);
    orbStage.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        handleOrbToggle(e);
      }
    });
  }

  if (orbContainer && orbContainer !== orbStage) {
    orbContainer.addEventListener("click", handleOrbToggle);
  }

  audioState.subscribe((event, data) => {
    if (event === "stop" || event === "end") {
      setPlayingUI(false);
    } else if (event === "mute_change" && data && data.isMuted) {
      setPlayingUI(false);
    }
  });

  const triggerAutoWelcome = () => {
    currentWelcomeTimeout = setTimeout(playWelcome, 250);
  };
  const preloaderEl = document.getElementById("site-preloader");
  if (preloaderEl && preloaderEl.style.display !== "none") {
    window.addEventListener("preloader:finished", triggerAutoWelcome, {
      once: true,
    });
    currentWelcomeTimeout = setTimeout(triggerAutoWelcome, 1200);
  } else {
    triggerAutoWelcome();
  }
}

// ============================================================================
// 3. HÀM XUẤT RA TOÀN BỘ KHỐI TRỰC QUAN BÊN PHẢI (HERO VISUAL BLOCK)
// ============================================================================

/**
 * Render khối trực quan bên phải của Hero (Tự động chọn Studio hoặc 3D Orb)
 * @param {Object} props
 * @returns {string} HTML markup
 */
export function renderHeroVisual(props = {}) {
  const isStudio =
    props.layout === "voice-studio" ||
    props.layout === "studio" ||
    props.mediaComponent === "studio";

  return isStudio ? renderStudioMarkup(props) : renderOrbMarkup(props);
}

/**
 * Khởi tạo tương tác âm thanh & hiệu ứng cho khối bên phải
 * @param {Object} props
 */
export function initHeroVisual(props = {}) {
  // Dọn dẹp bất kỳ âm thanh / cử chỉ / hẹn giờ chào mừng cũ nào trước đó
  clearPendingWelcome();
  audioState.stopSpeech();

  const isStudio =
    props.layout === "voice-studio" ||
    props.layout === "studio" ||
    props.mediaComponent === "studio";

  if (isStudio) {
    initStudioInteractions(props);
  } else {
    initOrbInteractions({
      welcomeMessage: props.welcomeMessage,
      welcomeAudio: props.welcomeAudio,
      brandName: props.brandName,
    });
  }
}

// Tương thích ngược nếu các file khác gọi trực tiếp
export {
  renderStudioMarkup as renderHeroVoiceStudio,
  initStudioInteractions as initHeroVoiceStudio,
  renderOrbMarkup as renderHeroMedia,
  initOrbInteractions as initHeroMedia,
};
