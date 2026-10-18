// ============================================================================
// DemoSpeechService.js — Dịch vụ Âm thanh & Giọng đọc AI Đa nền tảng
// Tối ưu hóa: Web Speech API (Chrome/Edge/Safari iOS/Android) + Autoplay Unlock + Fallback MP3
// ============================================================================

import { audioState } from "../../core/audio-state.js";

class DemoSpeechService {
  constructor() {
    this._isUnlocked = false;
    this._heartbeatInterval = null;
    this._fallbackAudio = null;
    this._currentUtterance = null;
    this._initAutoplayUnlock();
  }

  /**
   * Mở khóa chính sách Autoplay Policy trên iOS Safari & Android
   * Lắng nghe tương tác chạm / click đầu tiên của người dùng để kích hoạt AudioContext & Speech
   */
  _initAutoplayUnlock() {
    const unlock = () => {
      if (this._isUnlocked) return;
      this._isUnlocked = true;

      // 1. Kích hoạt Web Speech API
      if ("speechSynthesis" in window) {
        try {
          window.speechSynthesis.resume();
        } catch (e) {}
      }

      // 2. Kích hoạt Web AudioContext nếu có
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        if (AudioCtx) {
          const ctx = new AudioCtx();
          if (ctx.state === "suspended") {
            ctx.resume();
          }
        }
      } catch (e) {}

      // Gỡ bỏ listeners sau khi đã mở khóa thành công
      window.removeEventListener("touchstart", unlock, true);
      window.removeEventListener("touchend", unlock, true);
      window.removeEventListener("click", unlock, true);
    };

    window.addEventListener("touchstart", unlock, { passive: true, capture: true });
    window.addEventListener("touchend", unlock, { passive: true, capture: true });
    window.addEventListener("click", unlock, { passive: true, capture: true });
  }

  /**
   * Kiểm tra xem trình duyệt có hỗ trợ Web Speech API không
   * @returns {boolean}
   */
  isSupported() {
    return "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
  }

  /**
   * Lấy danh sách voice tiếng Việt tốt nhất trên hệ điều hành hiện tại
   * @param {string|null} preferredVoiceName
   * @returns {Promise<SpeechSynthesisVoice|null>}
   */
  async getVoice(preferredVoiceName = null) {
    if (!this.isSupported()) return null;

    let voices = window.speechSynthesis.getVoices();
    if (!voices || voices.length === 0) {
      await new Promise((resolve) => {
        const onVoicesChanged = () => {
          voices = window.speechSynthesis.getVoices();
          window.speechSynthesis.removeEventListener("voiceschanged", onVoicesChanged);
          resolve();
        };
        window.speechSynthesis.addEventListener("voiceschanged", onVoicesChanged);
        setTimeout(resolve, 300);
      });
    }

    if (!voices || voices.length === 0) return null;

    if (preferredVoiceName) {
      const match = voices.find((v) => v.name === preferredVoiceName);
      if (match) return match;
    }

    // Tìm giọng tiếng Việt (vi-VN hoặc lang bắt đầu bằng vi)
    return (
      voices.find((v) => v.lang && v.lang.toLowerCase().replace("_", "-").startsWith("vi")) ||
      voices.find((v) => v.name && v.name.toLowerCase().includes("vietnam")) ||
      null
    );
  }

  /**
   * Đọc văn bản tiếng Việt qua Web Speech API
   * Tự động xử lý lỗi đóng băng 15s của iOS/Chrome và fallback MP3 nếu bị chặn
   * @param {string} text
   * @param {Object} options
   */
  async speak(text, options = {}) {
    const {
      rate = 1.0,
      pitch = 1.0,
      voiceName = null,
      fallbackAudioUrl = "assets/audio/welcome-vivoice.mp3",
      onStart = null,
      onWord = null,
      onEnd = null,
      onError = null,
    } = options;

    this.stop();

    const cleanText = (text || "").trim();
    if (!cleanText) return;

    // Nếu không hỗ trợ TTS hoặc trên trình duyệt bị chặn, phát file âm thanh mẫu
    if (!this.isSupported()) {
      console.warn("Trình duyệt không hỗ trợ Web Speech API, chuyển sang phát Audio mẫu.");
      return this.playFallback(fallbackAudioUrl, { text: cleanText, onStart, onEnd, onError });
    }

    try {
      // Đảm bảo trạng thái speech không bị tạm dừng trên Safari iOS
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      const voice = await this.getVoice(voiceName);
      const utter = new SpeechSynthesisUtterance(cleanText);
      this._currentUtterance = utter;

      utter.lang = "vi-VN";
      utter.rate = Math.max(0.5, Math.min(rate, 2.0));
      utter.pitch = Math.max(0.5, Math.min(pitch, 1.5));
      if (voice) utter.voice = voice;

      // Xử lý sự kiện ngắt từ
      let wordIdx = -1;
      utter.onboundary = (e) => {
        if (e.name === "word") {
          wordIdx++;
          if (onWord) onWord(wordIdx, e.charIndex);
        }
      };

      utter.onstart = () => {
        // Bật heartbeat resume định kỳ mỗi 8s để tránh bug dừng phát ngẫu nhiên trên Chrome/Safari
        this._startHeartbeat();
        if (onStart) onStart();
      };

      utter.onend = () => {
        this._stopHeartbeat();
        this._currentUtterance = null;
        if (onEnd) onEnd();
      };

      utter.onerror = (err) => {
        this._stopHeartbeat();
        this._currentUtterance = null;
        console.warn("Lỗi SpeechSynthesis, thử phát Audio fallback:", err);

        // Fallback tự động khi TTS bị chặn (Autoplay restricted)
        if (fallbackAudioUrl) {
          this.playFallback(fallbackAudioUrl, { text: cleanText, onStart, onEnd, onError });
        } else {
          if (onError) onError(err);
          if (onEnd) onEnd();
        }
      };

      // Đưa vào hàng phát của trình duyệt
      window.speechSynthesis.speak(utter);
    } catch (err) {
      console.error("Không thể phát giọng đọc TTS:", err);
      if (fallbackAudioUrl) {
        this.playFallback(fallbackAudioUrl, { text: cleanText, onStart, onEnd, onError });
      } else {
        if (onError) onError(err);
        if (onEnd) onEnd();
      }
    }
  }

  /**
   * Phát tệp âm thanh MP3 fallback dự phòng
   * @param {string} audioUrl
   * @param {Object} options
   */
  playFallback(audioUrl, options = {}) {
    const { onStart, onEnd, onError } = options;
    this.stop();

    if (!audioUrl) {
      if (onEnd) onEnd();
      return;
    }

    const audio = new Audio(audioUrl);
    this._fallbackAudio = audio;

    audio.addEventListener("play", () => {
      if (onStart) onStart();
    });

    audio.addEventListener("ended", () => {
      this._fallbackAudio = null;
      if (onEnd) onEnd();
    });

    audio.addEventListener("error", (e) => {
      this._fallbackAudio = null;
      if (onError) onError(e);
      if (onEnd) onEnd();
    });

    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch((err) => {
        console.warn("Autoplay audio bị chặn bởi chính sách trình duyệt di động:", err);
        if (onError) onError(err);
        if (onEnd) onEnd();
      });
    }
  }

  /**
   * Dừng toàn bộ âm thanh và giọng đọc ngay lập tức
   */
  stop() {
    this._stopHeartbeat();
    this._currentUtterance = null;

    if (this._fallbackAudio) {
      try {
        this._fallbackAudio.pause();
        this._fallbackAudio.currentTime = 0;
      } catch (e) {}
      this._fallbackAudio = null;
    }

    if ("speechSynthesis" in window) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) {}
    }
  }

  _startHeartbeat() {
    this._stopHeartbeat();
    this._heartbeatInterval = setInterval(() => {
      if ("speechSynthesis" in window && window.speechSynthesis.speaking) {
        window.speechSynthesis.pause();
        window.speechSynthesis.resume();
      }
    }, 8000);
  }

  _stopHeartbeat() {
    if (this._heartbeatInterval) {
      clearInterval(this._heartbeatInterval);
      this._heartbeatInterval = null;
    }
  }
}

export const demoSpeechService = new DemoSpeechService();
