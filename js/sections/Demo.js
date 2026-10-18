import { esc } from "../core/esc.js";
import { audioState } from "../core/audio-state.js";
import { WaveformVisualizer } from "../components/Waveform.js";
import { renderSectionHeader } from "../components/common/SectionHeader.js";
import { renderDemoConsole } from "../components/demo/DemoConsole.js";
import {
  renderHeroVoiceStudio,
  initHeroVoiceStudio,
  clearPendingWelcome,
} from "../components/hero/HeroVisual.js";

// HÀM DỰNG GIAO DIỆN (HTML) CHO KHU VỰC DEMO
export function renderDemo(s) {
  const headerHtml = renderSectionHeader({
    eyebrow: s.eyebrow,
    eyebrowIcon: "fa-solid fa-sliders",
    title: s.title,
    subtitle: s.subtitle,
    centered: true,
  });

  const isVoiceStudio = s.layout === "voice-studio";
  const consoleHtml = isVoiceStudio
    ? renderHeroVoiceStudio({ ...s, idPrefix: "demo" })
    : renderDemoConsole(s);

  return `
  <wl-demo class="section demo-section" id="demo">
    <div class="container">
      ${headerHtml}
      ${consoleHtml}
    </div>
  </wl-demo>`;
}

// ============================================================================
// HÀM XỬ LÝ SỰ KIỆN (KHI NGƯỜI DÙNG BẤM NÚT, GÕ CHỮ)
// ============================================================================
export function initDemoInteractions(s) {
  if (s.layout === "voice-studio") {
    initHeroVoiceStudio({ ...s, idPrefix: "demo", autoWelcome: false });
    return;
  }

  const box = document.getElementById("demo-widget");
  if (!box) return;

  const demoType = s.demoType || "voice";

  const status = document.getElementById("demo-status");
  const liveStatus = document.getElementById("demo-live-status");
  const textEl = document.getElementById("demo-text");
  const charCount = document.getElementById("demo-char-count");
  const clearBtn = document.getElementById("demo-clear-btn");
  const speakBtn = document.getElementById("demo-speak");
  const stopBtn = document.getElementById("demo-stop");
  const outputEl = document.getElementById("demo-output");

  let simulationTimer = null;

  // HÀM 1: Đếm số lượng ký tự
  function updateCount() {
    if (textEl && charCount) {
      charCount.textContent = textEl.value.length + " ký tự";
    }
  }

  updateCount();

  if (textEl) {
    textEl.addEventListener("input", updateCount);
  }

  // HÀM 2: Xóa trắng nội dung
  if (clearBtn && textEl) {
    clearBtn.addEventListener("click", () => {
      textEl.value = "";
      if (outputEl) {
        outputEl.style.display = "none";
      }
      updateCount();
      textEl.focus();
    });
  }

  // ==========================================================================
  // LOGIC CHO CHỨC NĂNG VOICE (ÂM THANH)
  // ==========================================================================
  if (demoType === "voice") {
    const hasSpeechSynthesis = "speechSynthesis" in window;
    if (!hasSpeechSynthesis && status) {
      status.textContent = "Chế độ Audio Mẫu (Hỗ trợ trình duyệt di động)";
    }

    new WaveformVisualizer("demo-waveform");
    let isSpeaking = false;
    let currentSpeedRate = 1.0;
    const playText = s.speakLabel || "Phát giọng nói";
    const stopText = s.stopLabel || "Dừng phát";

    // Các thành phần điều chỉnh tốc độ
    const speedSlider = document.getElementById("demo-speed-slider");
    const speedVal = document.getElementById("demo-speed-val");
    const speedPresetBtns = document.querySelectorAll(".demo-speed-btn");
    const chipBtns = document.querySelectorAll(".chip-btn");
    const speakIcon = document.getElementById("demo-speak-icon");
    const speakText = document.getElementById("demo-speak-text");

    const updateDemoSpeed = (rate) => {
      currentSpeedRate = parseFloat(rate);
      if (speedVal) {
        speedVal.textContent = currentSpeedRate.toFixed(
          currentSpeedRate % 1 === 0 ? 1 : 2,
        );
      }
      if (speedSlider) {
        speedSlider.value = currentSpeedRate;
        const pct = ((currentSpeedRate - 0.5) / (2.0 - 0.5)) * 100;
        speedSlider.style.background = `linear-gradient(to right, var(--primary, #38bdf8) 0%, var(--accent, #a78bfa) ${pct}%, rgba(255, 255, 255, 0.15) ${pct}%)`;
      }
      speedPresetBtns.forEach((btn) => {
        const bSpeed = parseFloat(btn.getAttribute("data-speed"));
        btn.classList.toggle(
          "active",
          Math.abs(bSpeed - currentSpeedRate) < 0.03,
        );
      });
      if (speakText && !isSpeaking) {
        speakText.textContent = playText;
      }
    };

    if (speedSlider) {
      speedSlider.addEventListener("input", (e) => {
        updateDemoSpeed(e.target.value);
      });
    }

    speedPresetBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const speed = parseFloat(btn.getAttribute("data-speed"));
        updateDemoSpeed(speed);
      });
    });

    updateDemoSpeed(1.0);

    // Xử lý các nút chọn câu mẫu nhanh (nếu có)
    chipBtns.forEach((chip) => {
      chip.addEventListener("click", () => {
        chipBtns.forEach((c) => c.classList.remove("active"));
        chip.classList.add("active");
        const sample = chip.getAttribute("data-sample");
        if (sample && textEl) {
          textEl.value = sample;
          updateCount();
          textEl.focus();
        }
      });
    });

    function setSpeakingState(speaking) {
      isSpeaking = speaking;
      if (speakBtn) {
        speakBtn.setAttribute("aria-pressed", speaking ? "true" : "false");
        speakBtn.classList.toggle("is-speaking", speaking);
        if (speakIcon) {
          speakIcon.className = speaking
            ? "fa-solid fa-square"
            : "fa-solid fa-play";
        }
        if (speakText) {
          speakText.textContent = speaking ? stopText : playText;
        }
      }
      if (liveStatus) {
        liveStatus.textContent = speaking ? "ĐANG PHÁT..." : "SẴN SÀNG";
        liveStatus.parentElement.classList.toggle("active", speaking);
      }
    }

    if (speakBtn) {
      speakBtn.addEventListener("click", () => {
        clearPendingWelcome();
        if (isSpeaking) {
          audioState.stopSpeech();
          setSpeakingState(false);
          return;
        }

        let text = textEl ? textEl.value.trim() : "";
        if (!text) {
          text = s.defaultText || "";
        }
        if (!text) return;

        setSpeakingState(true);

        let viVoiceName = null;
        if ("speechSynthesis" in window) {
          const voices = window.speechSynthesis.getVoices();
          const vi = voices.find(
            (v) =>
              v.lang === "vi-VN" ||
              v.lang === "vi_VN" ||
              (v.lang && v.lang.toLowerCase().startsWith("vi")),
          );
          if (vi) viVoiceName = vi.name;
        }

        audioState.playSpeech(text, {
          voiceName: viVoiceName,
          rate: currentSpeedRate,
          fallbackAudioUrl: s.sampleAudio || s.welcomeAudio || null,
          onEnd: () => setSpeakingState(false),
        });
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        clearPendingWelcome();
        audioState.stopSpeech();
        setSpeakingState(false);
      });
    }
  }

  // ==========================================================================
  // LOGIC CHO CHỨC NĂNG GIẢ LẬP BẢO MẬT VÀ SQL (TERMINAL)
  // ==========================================================================
  else if (demoType === "security" || demoType === "sql") {
    if (speakBtn) {
      speakBtn.addEventListener("click", () => {
        if (textEl && textEl.value.trim() === "") {
          textEl.value = s.placeholder || "";
        }

        if (outputEl) {
          outputEl.style.display = "block";
          outputEl.innerHTML = "> Khởi chạy trình mô phỏng...\n";
        }
        speakBtn.disabled = true;

        if (liveStatus) {
          liveStatus.textContent = "ĐANG THỰC THI...";
          liveStatus.parentElement.classList.add("active");
        }

        let step = 0;
        let steps = [];
        const inputText = textEl ? textEl.value.trim() : "";
        const config = s.simulationConfig || {};

        if (demoType === "security") {
          let target = inputText.substring(0, 30) || "hệ thống";
          let finalRiskScore = config.defaultRiskScore || "Thấp";
          let finalFinding =
            config.defaultFinding || "Không phát hiện mối nguy hiểm";

          const rules = config.rules || [];
          for (let i = 0; i < rules.length; i++) {
            const rule = rules[i];
            let foundMatch = false;
            for (let j = 0; j < (rule.keywords || []).length; j++) {
              if (inputText.includes(rule.keywords[j])) {
                foundMatch = true;
                break;
              }
            }
            if (foundMatch) {
              finalRiskScore = rule.riskScore;
              finalFinding = rule.finding;
              break;
            }
          }

          const templates = config.stepsTemplate || [];
          for (let i = 0; i < templates.length; i++) {
            let line = templates[i];
            line = line.replace("{target}", target);
            line = line.replace("{finding}", finalFinding);
            line = line.replace("{riskScore}", finalRiskScore);
            steps.push(line);
          }
        } else if (demoType === "sql") {
          const query = inputText.toLowerCase();
          const isSQL =
            query.includes("select") ||
            query.includes("update") ||
            query.includes("delete") ||
            query.includes("insert");

          if (!isSQL) {
            steps = config.errorSteps || ["Lỗi: Cú pháp SQL không hợp lệ."];
          } else {
            let tableName = "bảng_chưa_rõ";
            const words = query.split(" ");
            for (let i = 0; i < words.length; i++) {
              if (words[i] === "from" && words[i + 1] !== undefined) {
                tableName = words[i + 1];
                break;
              }
            }
            const rowCount = Math.floor(Math.random() * 500) + 15;
            const timeMs = Math.floor(Math.random() * 300) + 40;

            const templates = config.successStepsTemplate || [];
            for (let i = 0; i < templates.length; i++) {
              let line = templates[i];
              line = line.replace("{tableName}", tableName);
              line = line.replace("{rowCount}", rowCount);
              line = line.replace("{timeMs}", timeMs);
              steps.push(line);
            }
          }
        }

        simulationTimer = setInterval(() => {
          if (step < steps.length) {
            if (outputEl) outputEl.innerHTML += "> " + steps[step] + "\n";
            step++;
          } else {
            clearInterval(simulationTimer);
            speakBtn.disabled = false;
            if (liveStatus) {
              liveStatus.textContent = "HOÀN TẤT";
              liveStatus.parentElement.classList.remove("active");
            }
          }
        }, 800);
      });
    }

    if (stopBtn) {
      stopBtn.addEventListener("click", () => {
        clearInterval(simulationTimer);
        if (speakBtn) speakBtn.disabled = false;
        if (liveStatus) {
          liveStatus.textContent = "ĐÃ HỦY";
          liveStatus.parentElement.classList.remove("active");
        }
        if (outputEl) {
          outputEl.innerHTML += "\n> [HỦY] Tiến trình đã bị gián đoạn.\n";
        }
      });
    }
  }
}

// ============================================================================
// Web Component <wl-demo> theo quy chuẩn thể lệ cuộc thi
// ============================================================================
export class WlDemo extends (typeof HTMLElement !== "undefined"
  ? HTMLElement
  : class {}) {
  connectedCallback() {
    if (this._config) {
      this.innerHTML = renderDemo(this._config);
      initDemoInteractions(this._config);
    }
  }

  setConfig(config) {
    this._config = config;
    this.innerHTML = renderDemo(config);
    initDemoInteractions(config);
  }
}

if (typeof customElements !== "undefined" && !customElements.get("wl-demo")) {
  customElements.define("wl-demo", WlDemo);
}
