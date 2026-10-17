// ============================================================================
// DemoConsole.js — Khối Bàn điều khiển Studio Hoàn chỉnh (Studio Console Block)
// Hợp nhất: TopBar macOS, Canvas Waveform Bar, Editor Textarea/Terminal, Controls
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render toàn bộ Bàn điều khiển Studio Console
 * @param {Object} props
 * @param {string} [props.demoType="voice"]
 * @param {string} [props.consoleTitle]
 * @param {string} [props.placeholder]
 * @param {string} [props.defaultText]
 * @param {string} [props.voiceLabel]
 * @param {string} [props.speakLabel]
 * @param {string} [props.stopLabel]
 * @param {string} [props.note]
 * @returns {string} HTML markup
 */
export function renderDemoConsole(props = {}) {
  const demoType = props.demoType || "voice";
  const consoleTitle = props.consoleTitle || "";
  const placeholder = props.placeholder || "";
  const defaultText = props.defaultText || "";
  const voiceLabel = props.voiceLabel || "Cấu hình";
  const speakLabel = props.speakLabel || "Phát giọng nói";
  const stopLabel = props.stopLabel || "Dừng";
  const note = props.note || "";

  // 1. Icon đại diện theo từng loại demo
  let iconClass = "fa-waveform-lines";
  if (demoType === "security") {
    iconClass = "fa-shield-virus";
  } else if (demoType === "sql") {
    iconClass = "fa-database";
  }

  // 2. Topbar macOS
  const topBarHtml = `
    <div class="console-topbar">
      <div class="console-window-dots">
        <span class="dot red"></span>
        <span class="dot yellow"></span>
        <span class="dot green"></span>
      </div>
      ${
        consoleTitle
          ? `
      <div class="console-title">
        <i class="fa-solid ${esc(iconClass)}"></i>
        <span>${esc(consoleTitle)}</span>
      </div>`
          : ""
      }
      <div class="console-live-badge">
        <span class="live-dot"></span>
        <span id="demo-live-status">SẴN SÀNG</span>
      </div>
    </div>`;

  // 3. Visualizer Waveform Bar
  const visualizerHtml =
    demoType === "voice"
      ? `
    <div class="console-visualizer-bar">
      <canvas id="demo-waveform" class="demo-canvas" height="60"></canvas>
    </div>`
      : "";

  // 4. Editor Area / Terminal
  const isTerminal = demoType === "security" || demoType === "sql";
  const outputBoxHTML = isTerminal
    ? '<div class="console-output" id="demo-output" style="display: none; padding: 12px; background: rgba(0,0,0,0.5); font-family: monospace; color: #4ade80; border-radius: 4px; margin-top: 10px; font-size: 13px; white-space: pre-wrap;"></div>'
    : "";

  const editorHtml = `
    <div class="console-editor">
      <textarea id="demo-text" rows="5" placeholder="${esc(placeholder)}">${esc(defaultText || "Chào mừng bạn đến với ViVoice, giải pháp tạo sinh giọng nói AI tiếng Việt chuẩn tự nhiên và truyền cảm.")}</textarea>
      ${outputBoxHTML}
      <div class="editor-footer">
        <span class="char-count" id="demo-char-count">0 ký tự</span>
        <button type="button" class="clear-btn" id="demo-clear-btn" title="Xóa nội dung">
          <i class="fa-solid fa-trash-can"></i> <span>Xóa</span>
        </button>
      </div>
    </div>`;

  // 5. Component điều chỉnh tốc độ đọc bên phải
  const speedWidgetHtml = `
    <div class="console-speed-widget">
      <div class="speed-widget-header">
        <span class="speed-widget-badge">
          <i class="fa-solid fa-gauge-high"></i> TỐC ĐỘ GIỌNG ĐỌC
        </span>
        <div class="speed-widget-number-wrap">
          <span class="speed-widget-val" id="demo-speed-val">1.0</span><span class="speed-widget-unit">x</span>
        </div>
      </div>

      <div class="speed-widget-slider-box">
        <div class="speed-widget-scale">
          <span><i class="fa-solid fa-backward-step"></i> 0.5x</span>
          <span>1.0x</span>
          <span>1.5x</span>
          <span>2.0x <i class="fa-solid fa-forward-fast"></i></span>
        </div>
        <input 
          type="range" 
          id="demo-speed-slider" 
          class="demo-speed-range" 
          min="0.5" 
          max="2.0" 
          step="0.05" 
          value="1.0"
          aria-label="Thanh trượt điều chỉnh tốc độ đọc"
        />
      </div>

      <div class="speed-widget-presets" role="group" aria-label="Tốc độ định sẵn">
        <button type="button" class="demo-speed-btn" data-speed="0.5">0.5x</button>
        <button type="button" class="demo-speed-btn" data-speed="0.75">0.75x</button>
        <button type="button" class="demo-speed-btn active" data-speed="1.0">1.0x</button>
        <button type="button" class="demo-speed-btn" data-speed="1.25">1.25x</button>
        <button type="button" class="demo-speed-btn" data-speed="1.5">1.5x</button>
        <button type="button" class="demo-speed-btn" data-speed="2.0">2.0x</button>
      </div>
    </div>`;

  // 6. Controls
  let voiceOptionsHTML = "";
  let buttonIcon = "fa-play";

  if (demoType !== "voice") {
    let option1 = "Cluster Cấp tốc";
    let option2 = "Cluster Tiêu chuẩn";
    if (demoType === "security") {
      option1 = "Quét toàn diện";
      option2 = "Quét nhanh";
      buttonIcon = "fa-magnifying-glass-chart";
    }

    voiceOptionsHTML = `
      <div class="control-group">
        <label class="demo-field">
          <span class="field-label"><i class="fa-solid fa-gear"></i> ${esc(voiceLabel)}</span>
          <div class="select-wrapper">
            <select id="demo-voice">
              <option>${option1}</option>
              <option>${option2}</option>
            </select>
            <i class="fa-solid fa-chevron-down select-arrow"></i>
          </div>
        </label>
      </div>`;
  }

  const noteHTML = note
    ? `<p class="demo-note"><i class="fa-solid fa-circle-info"></i> ${esc(note)}</p>`
    : "";

  const controlsHtml = `
    <div class="console-controls">
      ${voiceOptionsHTML}

      <div class="console-actions">
        <button class="btn btn-primary btn-magnetic demo-speak-btn" id="demo-speak" type="button" aria-pressed="false">
          <i class="fa-solid fa-play" id="demo-speak-icon"></i>
          <span id="demo-speak-text">${esc(speakLabel)}</span>
        </button>
        <button class="btn btn-ghost" id="demo-stop" type="button" style="display: none;">
          <i class="fa-solid fa-stop"></i>
          <span>${esc(stopLabel)}</span>
        </button>
      </div>
    </div>
    ${noteHTML}`;

  // Bố cục 2 cột nếu là Voice Demo: Bên trái Khung Test, Bên phải Điều chỉnh Tốc độ
  const workspaceHtml = demoType === "voice"
    ? `
      <div class="console-workspace-grid">
        <div class="console-workspace-left">
          ${editorHtml}
        </div>
        <div class="console-workspace-right">
          ${speedWidgetHtml}
        </div>
      </div>`
    : editorHtml;

  return `
    <div class="studio-console reveal" id="demo-widget" data-type="${esc(demoType)}">
      ${topBarHtml}
      ${visualizerHtml}
      ${workspaceHtml}
      ${controlsHtml}
    </div>`.trim();
}
