class AudioStateManager {
  constructor() {
    this.isPlaying = false;
    this.currentText = "";
    this.currentWordIndex = -1;
    this.wordList = [];
    this.listeners = new Set(); //Danh sách các thành phần trên web đang "đăng ký nhận tin tức"
    this.audioFrequencyLevel = 0; // 0..1
    this.animFrame = null;
  }

  //Cho phép các file khác đăng ký
  subscribe(fn) {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  }

  //Khi có sự kiện mới, thông báo cho tất cả các file đã đăng ký
  notify(event, payload = {}) {
    for (const fn of this.listeners) {
      try {
        fn(event, { isPlaying: this.isPlaying, ...payload });
      } catch (e) {
        console.error("AudioState listener error:", e);
      }
    }
  }

  playSpeech(
    text,
    { voiceName = null, rate = 1, onWord = null, onEnd = null } = {},
  ) {
    if (!("speechSynthesis" in window)) {
      console.warn("Web Speech API không được hỗ trợ trên trình duyệt này.");
      return;
    }

    this.stopSpeech();

    const cleanText = (text || "").trim();
    if (!cleanText) return;

    this.currentText = cleanText;
    this.wordList = cleanText.split(/\s+/);
    this.currentWordIndex = -1;
    this.isPlaying = true;

    const utter = new SpeechSynthesisUtterance(cleanText);
    this._currentUtterance = utter;
    utter.rate = rate;
    utter.lang = "vi-VN";

    const voices = window.speechSynthesis.getVoices();
    if (voiceName) {
      const chosen = voices.find((v) => v.name === voiceName);
      if (chosen) utter.voice = chosen;
    } else {
      const vi = voices.find(
        (v) => v.lang && v.lang.toLowerCase().startsWith("vi"),
      );
      if (vi) utter.voice = vi;
    }

    // Sự kiện ngắt từ (karaoke highlight & visualizer kick)
    utter.onboundary = (e) => {
      if (e.name === "word") {
        this.currentWordIndex++;
        this.audioFrequencyLevel = 0.8 + Math.random() * 0.2;
        if (onWord) onWord(this.currentWordIndex, e.charIndex);
        this.notify("word", {
          charIndex: e.charIndex,
          charLength: e.charLength,
          wordIndex: this.currentWordIndex,
          frequency: this.audioFrequencyLevel,
        });
      }
    };

    utter.onstart = () => {
      this.isPlaying = true;
      this._startFreqSimulation();
      this.notify("start", { text: cleanText });
    };

    utter.onend = () => {
      this._currentUtterance = null;
      this.isPlaying = false;
      this.audioFrequencyLevel = 0;
      this._stopFreqSimulation();
      this.notify("end");
      if (onEnd) onEnd();
    };

    utter.onerror = (err) => {
      this._currentUtterance = null;
      this.isPlaying = false;
      this.audioFrequencyLevel = 0;
      this._stopFreqSimulation();
      this.notify("error", { error: err });
      if (onEnd) onEnd();
    };

    this.notify("start", { text: cleanText });
    this._startFreqSimulation();

    setTimeout(() => {
      if ("speechSynthesis" in window) {
        if (window.speechSynthesis.paused) window.speechSynthesis.resume();
        window.speechSynthesis.speak(utter);
      }
    }, 20);
  }

  //HTML5 Audio API
  playAudioFile(src, { text = "", onEnd = null } = {}) {
    this.stopSpeech();

    const audio = new Audio(src);
    this._audio = audio;
    this.isPlaying = true;
    this.currentText = text;

    audio.addEventListener("play", () => {
      this.isPlaying = true;
      this._startFreqSimulation();
      this.notify("start", { text });
    });

    audio.addEventListener("ended", () => {
      this.isPlaying = false;
      this.audioFrequencyLevel = 0;
      this._stopFreqSimulation();
      this.notify("end");
      if (onEnd) onEnd();
    });

    audio.addEventListener("error", (e) => {
      this.isPlaying = false;
      this.audioFrequencyLevel = 0;
      this._stopFreqSimulation();
      this.notify("error", { error: e });
      if (onEnd) onEnd();
    });

    const playPromise = audio.play();
    return { audio, playPromise };
  }

  stopSpeech() {
    this._currentUtterance = null;
    if (this._audio) {
      try {
        this._audio.pause();
        this._audio.currentTime = 0;
      } catch (e) {}
      this._audio = null;
    }
    if ("speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }
    this.isPlaying = false;
    this.audioFrequencyLevel = 0;
    this._stopFreqSimulation();
    this.notify("stop");
  }

  // Tạo dao động tần số tự nhiên khi đang phát giọng nói
  _startFreqSimulation() {
    this._stopFreqSimulation();
    const update = () => {
      if (!this.isPlaying) return;

      // Kiểm tra an toàn: nếu trình duyệt đã đọc xong SpeechSynthesis mà không gọi onend
      if (!this._audio && "speechSynthesis" in window) {
        if (!window.speechSynthesis.speaking && !window.speechSynthesis.pending) {
          this.isPlaying = false;
          this.audioFrequencyLevel = 0;
          this._stopFreqSimulation();
          this.notify("end");
          return;
        }
      }

      this.audioFrequencyLevel = Math.max(
        0.2,
        this.audioFrequencyLevel * 0.92 + Math.random() * 0.15,
      );
      this.notify("tick", { frequency: this.audioFrequencyLevel });
      this.animFrame = requestAnimationFrame(update);
    };
    this.animFrame = requestAnimationFrame(update);
  }

  _stopFreqSimulation() {
    if (this.animFrame) {
      cancelAnimationFrame(this.animFrame);
      this.animFrame = null;
    }
  }
}

export const audioState = new AudioStateManager();
