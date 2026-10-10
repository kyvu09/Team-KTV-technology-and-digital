import { audioState } from "../core/audio-state.js";

export class WaveformVisualizer {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    this.bars = 32;
    this.barHeights = new Array(this.bars).fill(4);
    this.animId = null;
    this.isPlaying = false;
    this.activeFrequency = 0;

    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());

    // Đăng ký nhận xung nhịp âm thanh
    audioState.subscribe((event, data) => {
      if (event === "start") {
        this.isPlaying = true;
      } else if (event === "stop" || event === "end") {
        this.isPlaying = false;
        this.activeFrequency = 0;
      } else if (event === "word" || event === "tick") {
        this.isPlaying = true;
        this.activeFrequency = data.frequency || 0.8;
      }
    });

    this.animate();
  }

  resize() {
    if (!this.canvas) return;
    const rect = this.canvas.getBoundingClientRect();
    this.canvas.width = rect.width * (window.devicePixelRatio || 1);
    this.canvas.height = rect.height * (window.devicePixelRatio || 1);
  }

  animate() {
    this.animId = requestAnimationFrame(() => this.animate());
    const { ctx, canvas } = this;
    if (!ctx || !canvas) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const computedStyle = getComputedStyle(document.documentElement);
    const primary =
      computedStyle.getPropertyValue("--primary").trim() || "#38bdf8";
    const accent =
      computedStyle.getPropertyValue("--accent").trim() || "#a78bfa";

    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / (this.bars * 1.6);
    const gap = (width - this.bars * barWidth) / (this.bars - 1);

    const gradient = ctx.createLinearGradient(0, height, 0, 0);
    gradient.addColorStop(0, primary);
    gradient.addColorStop(1, accent);
    ctx.fillStyle = gradient;

    for (let i = 0; i < this.bars; i++) {
      let targetHeight = 4;
      if (this.isPlaying) {
        const factor = Math.sin(Date.now() * 0.008 + i * 0.3) * 0.5 + 0.5;
        targetHeight =
          6 + height * 0.8 * factor * (this.activeFrequency * 0.8 + 0.2);
      } else {
        // Nhịp thở nhẹ khi chờ (idle pulse)
        targetHeight = 4 + Math.sin(Date.now() * 0.003 + i * 0.2) * 3;
      }

      this.barHeights[i] += (targetHeight - this.barHeights[i]) * 0.18;
      const x = i * (barWidth + gap);
      const y = (height - this.barHeights[i]) / 2;

      ctx.beginPath();
      ctx.roundRect(
        x,
        y,
        barWidth,
        Math.max(2, this.barHeights[i]),
        barWidth / 2,
      );
      ctx.fill();
    }
  }

  destroy() {
    if (this.animId) cancelAnimationFrame(this.animId);
  }
}
