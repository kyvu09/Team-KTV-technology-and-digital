export function renderHeader(config) {
  const header = document.getElementById("site-header");
  if (!header) return;

  const brandName = config.brand?.name || "Brand";
  const slogan = config.brand?.slogan || "";

  header.innerHTML = `
    <div class="navbar-container" style="max-width: 1200px; margin: 0 auto; padding: 24px 20px; display: flex; justify-content: space-between; align-items: center;">
      <div class="navbar-brand" style="display: flex; align-items: baseline; gap: 12px;">
        <a href="." style="font-family: var(--font-heading); font-size: 1.5rem; font-weight: 700; color: var(--text); text-decoration: none;">
          ${brandName}
        </a>
        ${slogan ? `<span style="font-size: 0.85rem; color: var(--text-muted);">${slogan}</span>` : ""}
      </div>
      <nav class="navbar-menu" style="display: flex; gap: 20px; align-items: center;">
        <a href="?brand=vi-voice" style="color: var(--text); text-decoration: none; font-size: 0.95rem;">ViVoice</a>
        <a href="?brand=edu-ai" style="color: var(--text); text-decoration: none; font-size: 0.95rem;">EduMind</a>
        <a href="?brand=travel-ai" style="color: var(--text); text-decoration: none; font-size: 0.95rem;">VietGo AI</a>
      </nav>
    </div>
  `;
}

export function renderHero(hero) {
  if (!hero) return "";

  return `
    <section class="hero">
      <div class="hero-container" style="max-width: 1200px; margin: 0 auto; padding: 0 20px; width: 100%;">
        <div class="hero-inner">
          <div class="hero-content">
            ${
              hero.badge
                ? `<div class="hero-badge" style="display: inline-block; padding: 6px 16px; border-radius: 999px; background: color-mix(in srgb, var(--primary) 15%, transparent); color: var(--primary); font-size: 0.85rem; font-weight: 600; margin-bottom: 20px;">
                    ${hero.badge}
                  </div>`
                : ""
            }
            <h1 style="font-family: var(--font-heading); font-size: clamp(2rem, 5vw, 3.2rem); font-weight: 700; line-height: 1.2; margin-bottom: 20px; color: var(--text);">
              ${hero.title || ""}
              <span style="background: linear-gradient(135deg, var(--primary), var(--accent)); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                ${hero.highlight || ""}
              </span>
            </h1>
            <p style="font-size: 1.1rem; line-height: 1.6; color: var(--text-muted); margin-bottom: 30px; max-width: 540px;">
              ${hero.description || ""}
            </p>
            <div class="hero-actions" style="display: flex; gap: 16px; align-items: center; flex-wrap: wrap; margin-bottom: 24px;">
              ${
                hero.primaryButton
                  ? `<a href="${hero.primaryButton.link}" class="btn btn-primary">${hero.primaryButton.text}</a>`
                  : ""
              }
              ${
                hero.secondaryButton
                  ? `<a href="${hero.secondaryButton.link}" class="btn" style="border: 1px solid rgba(255, 255, 255, 0.2); color: var(--text);">${hero.secondaryButton.text}</a>`
                  : ""
              }
            </div>
            ${
              hero.trust
                ? `<p style="font-size: 0.85rem; color: var(--text-muted);">✓ ${hero.trust}</p>`
                : ""
            }
          </div>

          ${
            hero.visual
              ? `
          <div class="hero-visual" style="background: var(--surface); border-radius: var(--radius); padding: 40px; border: 1px solid rgba(255, 255, 255, 0.1); box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);">
            ${
              hero.visual.version
                ? `<div style="font-size: 0.85rem; font-weight: 700; color: var(--primary); text-transform: uppercase; margin-bottom: 10px;">Version ${hero.visual.version}</div>`
                : ""
            }
            <h3 style="font-family: var(--font-heading); font-size: 1.8rem; margin-bottom: 16px; color: var(--text);">${hero.visual.title || ""}</h3>
            <div style="display: inline-flex; align-items: center; gap: 8px; color: var(--text-muted); font-size: 0.9rem;">
              <span style="width: 8px; height: 8px; border-radius: 50%; background: #10B981; display: inline-block;"></span>
              ${hero.visual.status || ""}
            </div>
          </div>
          `
              : ""
          }
        </div>
      </div>
    </section>
  `;
}

export function renderExperience(config) {
  const brandName = config.brand?.name || "ViVoice";
  return `
    <section class="experience-section" id="experience">
      <div class="container">
        <h2 class="section-title">Trải nghiệm ${brandName} AI Studio</h2>
        <p class="section-subtitle">Chuyển đổi văn bản thành giọng nói tiếng Việt tự nhiên, nghe thử trực tiếp hoặc tạo và tải về file audio.mp3.</p>

        <div class="studio-card">
          <div class="quick-prompts">
            <span class="prompt-chip" data-prompt="Chào mừng bạn đến với ViVoice - Nền tảng chuyển đổi văn bản thành giọng nói tiếng Việt tự nhiên và giàu cảm xúc.">🎙️ Lời chào ViVoice</span>
            <span class="prompt-chip" data-prompt="Trí tuệ nhân tạo đang thay đổi cách con người sáng tạo nội dung số, giúp tiết kiệm thời gian và nâng cao hiệu suất.">💡 Khám phá AI</span>
            <span class="prompt-chip" data-prompt="Dự báo thời tiết hôm nay trời nắng nhẹ, nhiệt độ từ 24 đến 28 độ C, rất thích hợp cho các hoạt động ngoài trời.">📰 Bản tin thời sự</span>
          </div>

          <textarea id="tts-input" class="studio-textarea" rows="4" placeholder="Nhập văn bản tiếng Việt bạn muốn chuyển thành giọng nói tại đây...">Chào mừng bạn đến với ViVoice. Nền tảng chuyển đổi văn bản thành giọng nói tiếng Việt tự nhiên và giàu cảm xúc.</textarea>

          <div class="studio-controls">
            <div class="control-group">
              <label class="control-label" for="tts-voice">Giọng đọc</label>
              <select id="tts-voice" class="studio-select">
                <option value="nam">🎙️ Giọng Nam (Nam Minh - Trầm ấm)</option>
                <option value="nu">🎙️ Giọng Nữ (Hoài My - Truyền cảm)</option>
              </select>
            </div>

            <div class="control-group">
              <label class="control-label" for="tts-rate">Tốc độ đọc: <span id="rate-val">1.0x</span></label>
              <input type="range" id="tts-rate" class="studio-range" min="0.6" max="1.6" step="0.1" value="1.0">
            </div>
          </div>

          <div class="studio-visualizer-container">
            <canvas id="tts-visualizer" class="visualizer-canvas" width="600" height="50"></canvas>
          </div>

          <div class="studio-actions">
            <button id="btn-tts-speak" class="btn btn-primary">
              <span id="btn-speak-icon">▶</span> <span id="btn-speak-text">Nghe thử giọng nói</span>
            </button>
            <button id="btn-tts-export" class="btn btn-secondary">
              📥 Tạo & Tải file audio.mp3
            </button>
          </div>

          <div id="tts-status" class="studio-status"></div>
        </div>
      </div>
    </section>
  `;
}

export function renderSite(config) {
  // 1. Render Header
  renderHeader(config);

  // 2. Lấy khu vực #app
  const app = document.getElementById("app");
  if (!app) {
    console.error("Không tìm thấy #app");
    return;
  }

  // 3. Render Hero & Experience
  app.innerHTML = `
    ${renderHero(config.hero)}
    ${renderExperience(config)}
  `;

  // 4. Khởi tạo tương tác TTS
  initTTSInteractions();
}

let activeVisualizerAnim = null;

function initTTSInteractions() {
  import("./tts.js").then(({ TTSController }) => {
    const tts = new TTSController();

    const inputEl = document.getElementById("tts-input");
    const voiceEl = document.getElementById("tts-voice");
    const rateEl = document.getElementById("tts-rate");
    const rateValEl = document.getElementById("rate-val");
    const btnSpeak = document.getElementById("btn-tts-speak");
    const btnSpeakIcon = document.getElementById("btn-speak-icon");
    const btnSpeakText = document.getElementById("btn-speak-text");
    const btnExport = document.getElementById("btn-tts-export");
    const statusEl = document.getElementById("tts-status");
    const canvas = document.getElementById("tts-visualizer");
    const chips = document.querySelectorAll(".prompt-chip");

    if (!inputEl || !btnSpeak || !btnExport) return;

    // Cập nhật nhãn tốc độ
    rateEl?.addEventListener("input", (e) => {
      if (rateValEl) rateValEl.textContent = `${parseFloat(e.target.value).toFixed(1)}x`;
    });

    // Bấm chọn câu mẫu
    chips.forEach((chip) => {
      chip.addEventListener("click", () => {
        const prompt = chip.getAttribute("data-prompt");
        if (prompt) inputEl.value = prompt;
      });
    });

    // Vẽ hiệu ứng sóng âm trên Canvas
    const ctx = canvas?.getContext("2d");
    function drawVisualizer(isPlaying) {
      if (!ctx || !canvas) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const bars = 40;
      const barWidth = canvas.width / bars;
      
      for (let i = 0; i < bars; i++) {
        let height = 4;
        if (isPlaying) {
          const time = Date.now() * 0.005;
          height = Math.sin(time + i * 0.4) * 16 + Math.cos(time * 0.7 + i * 0.2) * 8 + 18;
          height = Math.max(4, Math.min(height, 46));
        }
        
        ctx.fillStyle = isPlaying ? "var(--primary)" : "rgba(255, 255, 255, 0.15)";
        ctx.fillRect(i * barWidth + 2, (canvas.height - height) / 2, barWidth - 4, height);
      }

      if (isPlaying) {
        activeVisualizerAnim = requestAnimationFrame(() => drawVisualizer(true));
      }
    }
    drawVisualizer(false);

    // Sự kiện Nghe thử (Play / Stop)
    btnSpeak.addEventListener("click", () => {
      const text = inputEl.value.trim();
      if (!text) {
        if (statusEl) statusEl.textContent = "Vui lòng nhập văn bản trước khi nghe thử.";
        return;
      }

      if (tts.isPlaying) {
        tts.stop();
        if (btnSpeakIcon) btnSpeakIcon.textContent = "▶";
        if (btnSpeakText) btnSpeakText.textContent = "Nghe thử giọng nói";
        if (activeVisualizerAnim) cancelAnimationFrame(activeVisualizerAnim);
        drawVisualizer(false);
        if (statusEl) statusEl.textContent = "Đã dừng phát.";
      } else {
        const rate = parseFloat(rateEl?.value || "1.0");
        const voiceGender = voiceEl?.value || "nam";

        if (statusEl) statusEl.textContent = "Đang phát giọng đọc...";
        if (btnSpeakIcon) btnSpeakIcon.textContent = "⏹";
        if (btnSpeakText) btnSpeakText.textContent = "Dừng lại";
        drawVisualizer(true);

        tts.speak(text, {
          voiceGender,
          rate,
          onStart: () => {
            if (btnSpeakIcon) btnSpeakIcon.textContent = "⏹";
            if (btnSpeakText) btnSpeakText.textContent = "Dừng lại";
          },
          onEnd: () => {
            if (btnSpeakIcon) btnSpeakIcon.textContent = "▶";
            if (btnSpeakText) btnSpeakText.textContent = "Nghe thử giọng nói";
            if (activeVisualizerAnim) cancelAnimationFrame(activeVisualizerAnim);
            drawVisualizer(false);
            if (statusEl) statusEl.textContent = "Đã phát xong.";
          },
          onError: (err) => {
            if (btnSpeakIcon) btnSpeakIcon.textContent = "▶";
            if (btnSpeakText) btnSpeakText.textContent = "Nghe thử giọng nói";
            if (activeVisualizerAnim) cancelAnimationFrame(activeVisualizerAnim);
            drawVisualizer(false);
            if (statusEl) statusEl.textContent = "Không thể phát: " + (err.message || "Lỗi âm thanh");
          }
        });
      }
    });

    // Sự kiện Tạo & Tải file audio.mp3
    btnExport.addEventListener("click", async () => {
      const text = inputEl.value.trim();
      if (!text) {
        if (statusEl) statusEl.textContent = "Vui lòng nhập văn bản cần tạo audio.";
        return;
      }

      try {
        btnExport.disabled = true;
        btnExport.textContent = "⏳ Đang tạo file audio.mp3...";
        if (statusEl) statusEl.textContent = "Đang tổng hợp dữ liệu âm thanh...";

        const result = await tts.exportAudio(text, "audio.mp3");

        if (statusEl) {
          statusEl.textContent = "✓ Đã tạo thành công file audio.mp3 và bắt đầu tải xuống!";
        }
      } catch (err) {
        if (statusEl) {
          statusEl.textContent = "Lỗi khi tạo file audio: " + err.message;
        }
      } finally {
        btnExport.disabled = false;
        btnExport.textContent = "📥 Tạo & Tải file audio.mp3";
      }
    });
  }).catch((err) => {
    console.error("Lỗi khởi tạo TTS Studio:", err);
  });
}