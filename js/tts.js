export class TTSController {
  constructor() {
    this.synth = window.speechSynthesis;
    this.voices = [];
    this.currentUtterance = null;
    this.isPlaying = false;
    this.initVoices();
  }

  initVoices() {
    if (!this.synth) return;
    const updateVoices = () => {
      this.voices = this.synth.getVoices();
    };
    updateVoices();
    if (this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = updateVoices;
    }
  }

  getVietnameseVoices() {
    return this.voices.filter(
      (v) =>
        v.lang.toLowerCase().includes("vi") ||
        v.name.toLowerCase().includes("vietnam") ||
        v.name.toLowerCase().includes("namminh") ||
        v.name.toLowerCase().includes("hoaimy"),
    );
  }

  speak(
    text,
    {
      voiceGender = "nam",
      rate = 1.0,
      pitch = 1.0,
      onStart,
      onEnd,
      onError,
    } = {},
  ) {
    if (!this.synth) {
      if (onError)
        onError(new Error("Trình duyệt không hỗ trợ Web Speech API"));
      return;
    }

    this.stop();

    const utterance = new SpeechSynthesisUtterance(text);
    const viVoices = this.getVietnameseVoices();

    if (viVoices.length > 0) {
      let selectedVoice = null;
      if (voiceGender === "nam") {
        selectedVoice =
          viVoices.find(
            (v) =>
              v.name.toLowerCase().includes("nam") ||
              v.name.toLowerCase().includes("male"),
          ) || viVoices[0];
      } else {
        selectedVoice =
          viVoices.find(
            (v) =>
              v.name.toLowerCase().includes("hoaimy") ||
              v.name.toLowerCase().includes("nu") ||
              v.name.toLowerCase().includes("female"),
          ) || viVoices[0];
      }
      utterance.voice = selectedVoice;
    }

    utterance.lang = "vi-VN";
    utterance.rate = rate;
    utterance.pitch = voiceGender === "nam" ? pitch * 0.9 : pitch * 1.15;

    utterance.onstart = () => {
      this.isPlaying = true;
      if (onStart) onStart();
    };

    utterance.onend = () => {
      this.isPlaying = false;
      if (onEnd) onEnd();
    };

    utterance.onerror = (e) => {
      this.isPlaying = false;
      if (onError) onError(e);
    };

    this.currentUtterance = utterance;
    this.synth.speak(utterance);
  }

  stop() {
    if (this.synth && this.synth.speaking) {
      this.synth.cancel();
      this.isPlaying = false;
    }
  }
}
