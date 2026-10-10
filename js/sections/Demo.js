import { esc } from "../core/esc.js";
import { audioState } from "../core/audio-state.js";
import { WaveformVisualizer } from "../components/Waveform.js";

// HÀM DỰNG GIAO DIỆN (HTML) CHO KHU VỰC DEMO
export function renderDemo(s) {
  // 1. Xác định loại Demo (Mặc định là "voice" nếu không có dữ liệu)
  let demoType = "voice";
  if (s.demoType) {
    demoType = s.demoType;
  }

  // 2. Tạo phần tiêu đề (Header)
  let headerHTML = "";
  if (s.eyebrow) {
    headerHTML =
      headerHTML +
      '<p class="eyebrow reveal"><i class="fa-solid fa-sliders"></i> ' +
      esc(s.eyebrow) +
      "</p>";
  }
  headerHTML =
    headerHTML + '<h2 class="section-title reveal">' + esc(s.title) + "</h2>";
  if (s.subtitle) {
    headerHTML =
      headerHTML +
      '<p class="section-sub mx-auto reveal">' +
      esc(s.subtitle) +
      "</p>";
  }

  // 3. Tạo thanh công cụ phía trên (Top bar)
  let iconClass = "fa-waveform-lines";
  if (demoType === "security") {
    iconClass = "fa-shield-virus";
  } else if (demoType === "sql") {
    iconClass = "fa-database";
  }

  let consoleTitle = s.consoleTitle || "";

  // 4. Tạo giao diện riêng cho từng loại Demo
  let visualizerHTML = "";
  let outputBoxHTML = "";

  if (demoType === "voice") {
    visualizerHTML = `
      <div class="console-visualizer-bar">
        <canvas id="demo-waveform" class="demo-canvas" height="60"></canvas>
      </div>`;
  } else {
    // Nếu là Security hoặc SQL thì tạo một khung màn hình đen (Terminal) để hiển thị chữ
    outputBoxHTML =
      '<div class="console-output" id="demo-output" style="display: none; padding: 12px; background: rgba(0,0,0,0.5); font-family: monospace; color: #4ade80; border-radius: 4px; margin-top: 10px; font-size: 13px; white-space: pre-wrap;"></div>';
  }

  let voiceOptionsHTML = "";
  let buttonIcon = "fa-play";

  if (demoType === "voice") {
    // Không cần chọn module voice: Tự động dùng vi-VN, ẩn dropdown
    voiceOptionsHTML = "";
  } else {
    // Nếu không phải là Voice, thì nút chọn sẽ thành nút Cấu hình
    let option1 = "Cluster Cấp tốc";
    let option2 = "Cluster Tiêu chuẩn";
    if (demoType === "security") {
      option1 = "Quét toàn diện";
      option2 = "Quét nhanh";
      buttonIcon = "fa-magnifying-glass-chart";
    }

    voiceOptionsHTML = `
      <label class="demo-field">
        <span class="field-label"><i class="fa-solid fa-gear"></i> ${esc(s.voiceLabel || "Cấu hình")}</span>
        <div class="select-wrapper">
          <select id="demo-voice">
            <option>${option1}</option>
            <option>${option2}</option>
          </select>
          <i class="fa-solid fa-chevron-down select-arrow"></i>
        </div>
      </label>`;
  }

  // Gắn ghi chú dưới cùng (nếu có)
  let noteHTML = "";
  if (s.note) {
    noteHTML =
      '<p class="demo-note"><i class="fa-solid fa-circle-info"></i> ' +
      esc(s.note) +
      "</p>";
  }

  // 5. Trả về toàn bộ đoạn mã HTML đã lắp ghép
  return `
  <section class="section demo-section" id="demo">
    <div class="container">
      <div class="section-header text-center">
        ${headerHTML}
      </div>

      <div class="studio-console reveal" id="demo-widget" data-type="${esc(demoType)}">
        <!-- Studio Top Bar -->
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
            <i class="fa-solid ${iconClass}"></i>
            <span>${esc(consoleTitle)}</span>
          </div>`
              : ""
          }
          <div class="console-live-badge">
            <span class="live-dot"></span>
            <span id="demo-live-status">SẴN SÀNG</span>
          </div>
        </div>

        ${visualizerHTML}

        <!-- Khu vực nhập chữ -->
        <div class="console-editor">
          <textarea id="demo-text" rows="5" placeholder="${esc(s.placeholder || "")}">${esc(s.defaultText || "")}</textarea>
          
          ${outputBoxHTML}

          <div class="editor-footer">
            <span class="char-count" id="demo-char-count">0 ký tự</span>
            <button type="button" class="clear-btn" id="demo-clear-btn" title="Xóa nội dung"><i class="fa-regular fa-trash-can"></i></button>
          </div>
        </div>

        <!-- Các nút chức năng -->
        <div class="console-controls">
          ${
            voiceOptionsHTML
              ? `
          <div class="control-group">
            ${voiceOptionsHTML}
          </div>`
              : ""
          }

          <div class="console-actions">
            <button class="btn btn-primary btn-magnetic" id="demo-speak" type="button" aria-pressed="false">
              <i class="fa-solid ${buttonIcon}"></i>
              <span>${esc(s.speakLabel || "Phát giọng nói")}</span>
            </button>
            ${
              demoType !== "voice" && s.stopLabel
                ? `
            <button class="btn btn-ghost" id="demo-stop" type="button">
              <i class="fa-solid fa-stop"></i>
              <span>${esc(s.stopLabel || "Dừng")}</span>
            </button>`
                : ""
            }
          </div>
        </div>

        ${noteHTML}
        <p class="demo-status" id="demo-status" role="status"></p>
      </div>
    </div>
  </section>`;
}

// ============================================================================
// HÀM XỬ LÝ SỰ KIỆN (KHI NGƯỜI DÙNG BẤM NÚT, GÕ CHỮ)
// ============================================================================
export function initDemoInteractions(s) {
  let box = document.getElementById("demo-widget");
  if (box === null) {
    return; // Nếu không có giao diện demo thì dừng lại
  }

  let demoType = "voice";
  if (s.demoType) {
    demoType = s.demoType;
  }

  // Lấy các phần tử trên HTML để tương tác
  let status = document.getElementById("demo-status");
  let liveStatus = document.getElementById("demo-live-status");
  let textEl = document.getElementById("demo-text");
  let charCount = document.getElementById("demo-char-count");
  let clearBtn = document.getElementById("demo-clear-btn");
  let voiceEl = document.getElementById("demo-voice");
  let speakBtn = document.getElementById("demo-speak");
  let stopBtn = document.getElementById("demo-stop");
  let outputEl = document.getElementById("demo-output");

  let simulationTimer = null; // Biến dùng để đếm thời gian cho chức năng giả lập

  // HÀM 1: Đếm số lượng ký tự mà người dùng đã gõ
  function updateCount() {
    if (textEl !== null && charCount !== null) {
      let length = textEl.value.length;
      charCount.textContent = length + " ký tự";
    }
  }

  // Chạy hàm đếm ngay lúc ban đầu
  updateCount();

  // Khi người dùng gõ phím vào ô chữ, cập nhật số ký tự
  if (textEl !== null) {
    textEl.addEventListener("input", function () {
      updateCount();
    });
  }

  // HÀM 2: Xóa trắng nội dung ô chữ khi bấm nút thùng rác
  if (clearBtn !== null && textEl !== null) {
    clearBtn.addEventListener("click", function () {
      textEl.value = ""; // Xóa chữ
      if (outputEl !== null) {
        outputEl.style.display = "none"; // Giấu màn hình đen đi
      }
      updateCount(); // Cập nhật lại đếm số
      textEl.focus(); // Đưa con trỏ chuột quay lại ô gõ chữ
    });
  }

  // ============================================================================
  // LOGIC CHO CHỨC NĂNG VOICE (ÂM THANH)
  // ============================================================================
  if (demoType === "voice") {
    // Nếu trình duyệt cũ, không hỗ trợ đọc giọng nói thì báo lỗi
    if (!("speechSynthesis" in window)) {
      if (status !== null) {
        status.textContent = "Trình duyệt của bạn không hỗ trợ đọc giọng nói.";
      }
      return; // Dừng lại
    }

    let visualizer = new WaveformVisualizer("demo-waveform");
    let isSpeaking = false;
    const playText = s.speakLabel || "Phát giọng nói";
    const stopText = s.stopLabel || "Dừng phát";

    function setSpeakingState(speaking) {
      isSpeaking = speaking;
      if (speakBtn) {
        speakBtn.setAttribute("aria-pressed", speaking ? "true" : "false");
        if (speaking) {
          speakBtn.classList.add("is-speaking");
          speakBtn.innerHTML = `<i class="fa-solid fa-stop"></i> <span>${esc(stopText)}</span>`;
        } else {
          speakBtn.classList.remove("is-speaking");
          speakBtn.innerHTML = `<i class="fa-solid fa-play"></i> <span>${esc(playText)}</span>`;
        }
      }
      if (liveStatus !== null) {
        liveStatus.textContent = speaking ? "ĐANG PHÁT..." : "SẴN SÀNG";
        liveStatus.parentElement.classList.toggle("active", speaking);
      }
    }

    // Toggle: Nhấn vào thì phát, nhấn lần nữa thì dừng
    if (speakBtn) {
      speakBtn.addEventListener("click", function () {
        if (isSpeaking) {
          // Nhấn lần nữa thì dừng
          audioState.stopSpeech();
          setSpeakingState(false);
          return;
        }

        // Nhấn vào thì phát
        let text = textEl ? textEl.value.trim() : "";
        if (text === "") {
          text = s.defaultText || "";
        }
        if (!text) return;

        setSpeakingState(true);

        // Tự động tìm giọng đọc tiếng Việt vi-VN trong hệ thống
        let viVoiceName = null;
        if ("speechSynthesis" in window) {
          let voices = window.speechSynthesis.getVoices();
          let vi = voices.find(
            (v) =>
              v.lang === "vi-VN" ||
              v.lang === "vi_VN" ||
              (v.lang && v.lang.toLowerCase().startsWith("vi")),
          );
          if (vi) viVoiceName = vi.name;
        }

        audioState.playSpeech(text, {
          voiceName: viVoiceName,
          rate: 1,
          onEnd: function () {
            setSpeakingState(false);
          },
        });
      });
    }

    // Nếu có nút dừng cũ ở ngoài thì hỗ trợ thêm
    if (stopBtn) {
      stopBtn.addEventListener("click", function () {
        audioState.stopSpeech();
        setSpeakingState(false);
      });
    }
  }

  // ============================================================================
  // LOGIC CHO CHỨC NĂNG GIẢ LẬP BẢO MẬT VÀ SQL (TERMINAL)
  // ============================================================================
  else if (demoType === "security" || demoType === "sql") {
    // Khi bấm nút Thực Thi (Run)
    speakBtn.addEventListener("click", function () {
      // 1. Kiểm tra nếu ô trống thì tự điền dữ liệu mẫu
      if (textEl.value.trim() === "") {
        textEl.value = s.placeholder;
      }

      // 2. Hiện màn hình đen và bắt đầu dòng chữ thông báo đầu tiên
      outputEl.style.display = "block";
      outputEl.innerHTML = "> Khởi chạy trình mô phỏng...\n";
      speakBtn.disabled = true; // Khóa nút bấm để không bấm 2 lần được

      if (liveStatus !== null) {
        liveStatus.textContent = "ĐANG THỰC THI...";
        liveStatus.parentElement.classList.add("active");
      }

      let step = 0;
      let steps = [];
      let inputText = textEl.value.trim();
      let config = s.simulationConfig; // Lấy dữ liệu cấu hình từ file JSON (đã chuyển khỏi hardcode)

      if (demoType === "security") {
        // --- LOGIC CHO BẢO MẬT ---
        // 1. Cắt chuỗi đầu vào lấy 30 ký tự làm tên mục tiêu
        let target = inputText.substring(0, 30);
        if (target === "") {
          target = "hệ thống";
        }

        // 2. Lấy kết quả mặc định từ JSON
        let finalRiskScore = config.defaultRiskScore;
        let finalFinding = config.defaultFinding;

        // 3. Dùng vòng lặp for đơn giản để kiểm tra từng từ khóa trong JSON
        for (let i = 0; i < config.rules.length; i++) {
          let rule = config.rules[i];
          let foundMatch = false;

          // Kiểm tra xem input có chứa từ khóa nào của rule này không
          for (let j = 0; j < rule.keywords.length; j++) {
            if (inputText.includes(rule.keywords[j])) {
              foundMatch = true;
              break; // Dừng vòng lặp từ khóa nếu đã tìm thấy
            }
          }

          if (foundMatch) {
            finalRiskScore = rule.riskScore;
            finalFinding = rule.finding;
            break; // Dừng vòng lặp rule (chỉ lấy cảnh báo đầu tiên tìm thấy)
          }
        }

        // 4. Tạo mảng các bước (steps) bằng cách thay thế biến vào Template từ JSON
        for (let i = 0; i < config.stepsTemplate.length; i++) {
          let line = config.stepsTemplate[i];
          line = line.replace("{target}", target);
          line = line.replace("{finding}", finalFinding);
          line = line.replace("{riskScore}", finalRiskScore);
          steps.push(line); // Thêm dòng chữ vào danh sách các bước
        }
      } else if (demoType === "sql") {
        // --- LOGIC CHO SQL ---
        let query = inputText.toLowerCase();

        // 1. Kiểm tra xem lệnh có đúng chuẩn SQL cơ bản không (có chứa từ khóa SELECT, UPDATE...)
        let isSQL = false;
        if (
          query.includes("select") ||
          query.includes("update") ||
          query.includes("delete") ||
          query.includes("insert")
        ) {
          isSQL = true;
        }

        if (isSQL === false) {
          // Lấy câu báo lỗi từ cấu hình JSON
          steps = config.errorSteps;
        } else {
          // 2. Tìm tên bảng đơn giản (cắt chữ sau từ "from")
          let tableName = "bảng_chưa_rõ";
          let words = query.split(" ");

          for (let i = 0; i < words.length; i++) {
            if (words[i] === "from" && words[i + 1] !== undefined) {
              tableName = words[i + 1];
              break;
            }
          }

          // 3. Sinh số ngẫu nhiên cho kết quả giả lập
          let rowCount = Math.floor(Math.random() * 500) + 15;
          let timeMs = Math.floor(Math.random() * 300) + 40;

          // 4. Lắp ráp dữ liệu vào câu thông báo
          for (let i = 0; i < config.successStepsTemplate.length; i++) {
            let line = config.successStepsTemplate[i];
            line = line.replace("{tableName}", tableName);
            line = line.replace("{rowCount}", rowCount);
            line = line.replace("{timeMs}", timeMs);
            steps.push(line);
          }
        }
      }

      // Bộ hẹn giờ: Cứ mỗi 0.8 giây sẽ in ra màn hình một dòng (để tạo cảm giác hệ thống đang tải)
      simulationTimer = setInterval(function () {
        if (step < steps.length) {
          outputEl.innerHTML = outputEl.innerHTML + "> " + steps[step] + "\n";
          step = step + 1;
        } else {
          // Khi đã in hết các bước, dừng bộ hẹn giờ
          clearInterval(simulationTimer);
          speakBtn.disabled = false; // Mở khóa nút bấm
          if (liveStatus !== null) {
            liveStatus.textContent = "HOÀN TẤT";
            liveStatus.parentElement.classList.remove("active");
          }
        }
      }, 800);
    });

    // Khi bấm nút Dừng tiến trình (Hủy quét / Hủy query)
    stopBtn.addEventListener("click", function () {
      clearInterval(simulationTimer); // Ngưng ngay việc in chữ
      speakBtn.disabled = false; // Mở khóa nút bấm
      if (liveStatus !== null) {
        liveStatus.textContent = "ĐÃ HỦY";
        liveStatus.parentElement.classList.remove("active");
      }
      outputEl.innerHTML =
        outputEl.innerHTML + "\n> [HỦY] Tiến trình đã bị gián đoạn.\n";
    });
  }
}
