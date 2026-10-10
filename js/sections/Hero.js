import { esc } from "../core/esc.js";
import { audioState } from "../core/audio-state.js";

export function renderHero(s) {
    const isSplit = s.layout !== "centered";

    return `
  <section class="hero ${isSplit ? "hero-split" : "hero-centered"}" id="hero">
    <div class="hero-bg-blobs" aria-hidden="true">
      <div class="blob blob-1"></div>
      <div class="blob blob-2"></div>
      <div class="blob blob-3"></div>
    </div>

    <div class="container hero-inner">
      <div class="hero-content">
        ${s.badge ? `
          <div class="badge-wrapper">
            <span class="badge reveal">
              <i class="fa-solid fa-wand-magic-sparkles"></i> ${esc(s.badge)}
            </span>
          </div>` : ""}

        <div class="title-wrapper">
          <h1 class="hero-title reveal">
            ${esc(s.title)}
            ${s.rotatingWords ? `
              <span class="rotating-text-wrapper">
                <span class="rotating-text" id="hero-rotating-word">${esc(s.rotatingWords[0] || "")}</span>
              </span>` : ""}
          </h1>
        </div>

        <p class="lead reveal">${esc(s.subtitle)}</p>

        <div class="hero-cta reveal">
          ${(s.buttons || [])
            .map(
                (b) => `
              <a class="btn ${b.style === "ghost" ? "btn-ghost" : "btn-primary"} btn-magnetic" href="${esc(b.href)}">
                <span>${esc(b.label)}</span>
                <i class="fa-solid fa-arrow-right-long"></i>
              </a>`
            )
            .join("")}
        </div>
      </div>

      <div class="hero-media reveal">
        <div class="orb-stage" id="hero-orb-stage" role="button" tabindex="0" data-play-audio="true" aria-label="Quả cầu giọng nói AI — Bấm để phát hoặc dừng" title="Bấm vào quả cầu để phát hoặc dừng âm thanh">
          <div id="hero-voice-orb" class="voice-orb-container" data-play-audio="true"></div>
          <div class="orb-ring" aria-hidden="true"></div>
          <div class="orb-ring orb-ring-outer" aria-hidden="true"></div>
        </div>
      </div>
    </div>

    <!-- Nút cuộn khám phá âm thanh (Hero Scroll Cue) -->
    <a href="#demo" class="hero-scroll-cue" id="hero-scroll-cue" aria-label="Cuộn xuống để khám phá">
      <span class="scroll-cue-text">Cuộn để khám phá</span>
      <span class="scroll-mouse-icon">
        <span class="scroll-mouse-wheel"></span>
      </span>
      <span class="scroll-sound-waves" aria-hidden="true">
        <i></i><i></i><i></i>
      </span>
    </a>
  </section>`;
}

export function initHeroInteractions(s) {
    // 1. Chữ xoay luân phiên (Rotating Keywords)
    if (s.rotatingWords && s.rotatingWords.length > 1) {
        const wordEl = document.getElementById("hero-rotating-word");
        if (wordEl) {
            let idx = 0;
            setInterval(() => {
                wordEl.style.opacity = "0";
                wordEl.style.transform = "translateY(15px)";
                setTimeout(() => {
                    idx = (idx + 1) % s.rotatingWords.length;
                    wordEl.textContent = s.rotatingWords[idx];
                    wordEl.style.opacity = "1";
                    wordEl.style.transform = "translateY(0)";
                }, 300);
            }, 2800);
        }
    }

    // 3. Nút cuộn khám phá
    const scrollCue = document.getElementById("hero-scroll-cue");
    if (scrollCue) {
        scrollCue.addEventListener("click", (e) => {
            e.preventDefault();
            const target = document.querySelector("#demo") || document.querySelector(".section:nth-of-type(2)");
            if (target) {
                if (window.__lenis) {
                    window.__lenis.scrollTo(target, { offset: -80 });
                } else {
                    target.scrollIntoView({ behavior: "smooth" });
                }
            }
        });
    }

    // 4. Quả cầu 3D — Bấm trực tiếp vào quả cầu để Phát / Dừng âm thanh & Tự động phát khi tải trang
    const orbStage = document.getElementById("hero-orb-stage");
    const orbContainer = document.getElementById("hero-voice-orb");
    const welcomeText = s.welcomeMessage || "Chào mừng bạn đến với website của chúng tôi";
    const welcomeAudio = s.welcomeAudio || "assets/audio/welcome-vivoice.mp3";

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
        setPlayingUI(true);

        const onFinish = () => {
            setPlayingUI(false);
        };

        if (welcomeAudio) {
            const res = audioState.playAudioFile(welcomeAudio, {
                text: welcomeText,
                onEnd: onFinish,
            });

            if (res && res.playPromise) {
                res.playPromise
                    .then(() => {
                        // Tự động phát âm thanh thành công
                    })
                    .catch(() => {
                        // Khi trình duyệt chặn un-prompted sound lúc mới load:
                        // Sẵn sàng kích hoạt ngay khi người dùng chạm, cuộn hoặc click bất kỳ đâu
                        setPlayingUI(false);

                        const unlockEvents = ["pointerdown", "click", "keydown", "wheel", "touchstart", "scroll"];
                        const onUserGesture = () => {
                            playWelcome();
                            unlockEvents.forEach((evt) => {
                                window.removeEventListener(evt, onUserGesture, true);
                            });
                        };

                        unlockEvents.forEach((evt) => {
                            window.addEventListener(evt, onUserGesture, { once: true, capture: true });
                        });
                    });
            }
        } else {
            audioState.playSpeech(welcomeText, { onEnd: onFinish });
        }
    };

    const handleOrbToggle = (e) => {
        if (e) e.stopPropagation();
        if (audioState.isPlaying && orbStage && orbStage.classList.contains("is-playing")) {
            audioState.stopSpeech();
            setPlayingUI(false);
        } else {
            playWelcome();
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

    audioState.subscribe((event) => {
        if (event === "stop" || event === "end") {
            setPlayingUI(false);
        }
    });

    // Tự động phát âm thanh khi F5 (vừa load trang xong)
    const triggerAutoWelcome = () => {
        setTimeout(playWelcome, 250);
    };

    const preloaderEl = document.getElementById("site-preloader");
    if (preloaderEl && preloaderEl.style.display !== "none") {
        window.addEventListener("preloader:finished", triggerAutoWelcome, { once: true });
        setTimeout(triggerAutoWelcome, 1000);
    } else {
        triggerAutoWelcome();
    }
}

// Web Component <wl-hero> theo quy chuẩn thể lệ cuộc thi
export class WlHero extends (typeof HTMLElement !== "undefined" ? HTMLElement : class { }) {
    connectedCallback() {
        // Tự động render nếu được khởi tạo từ HTML hoặc JS
        if (this._config) {
            this.innerHTML = renderHero(this._config);
            initHeroInteractions(this._config);
        }
    }

    setConfig(config) {
        this._config = config;
        this.innerHTML = renderHero(config);
        initHeroInteractions(config);
    }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-hero")) {
    customElements.define("wl-hero", WlHero);
}
