// ============================================================================
// ambient-background.js — Nền động đa tầng: Hạt năng lượng, Sóng âm & Lưới không gian
// Giúp website không còn màu xanh đơn điệu mà tràn ngập chiều sâu công nghệ
// ============================================================================

export function initAmbientBackground(config = {}) {
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const canvas = document.getElementById("ambient-canvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });
  if (!ctx) return;

  // 1. Phân tích màu sắc động từ CSS Variables (Chuẩn White Label)
  function getThemeColors() {
    const style = getComputedStyle(document.documentElement);
    const primaryHex = style.getPropertyValue("--primary").trim() || "#38bdf8";
    const accentHex = style.getPropertyValue("--accent").trim() || "#a78bfa";

    function parseColor(val) {
      if (val.startsWith("#")) {
        let hex = val.replace("#", "");
        if (hex.length === 3) hex = hex.split("").map((c) => c + c).join("");
        const num = parseInt(hex, 16);
        return {
          r: (num >> 16) & 255,
          g: (num >> 8) & 255,
          b: num & 255,
        };
      }
      return { r: 56, g: 189, b: 248 };
    }

    return {
      primary: parseColor(primaryHex),
      accent: parseColor(accentHex),
    };
  }

  let colors = getThemeColors();
  window.addEventListener("theme-changed", () => {
    colors = getThemeColors();
  });

  // 2. Thiết lập kích thước Canvas theo DPR (Retina/High-DPI)
  let width = 0;
  let height = 0;
  let dpr = 1;

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);
  }

  resize();
  window.addEventListener("resize", resize, { passive: true });

  // 3. Khởi tạo mảng Hạt năng lượng âm thanh (Sound Energy Specks)
  const PARTICLE_COUNT = Math.min(Math.floor((width * height) / 32000), 45);
  const particles = [];

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.45,
      vy: (Math.random() - 0.5) * 0.45,
      radius: Math.random() * 2 + 1,
      baseAlpha: Math.random() * 0.35 + 0.15,
      alpha: 0.2,
      pulseSpeed: Math.random() * 0.03 + 0.01,
      pulseAngle: Math.random() * Math.PI * 2,
      isAccent: Math.random() > 0.5,
    });
  }

  // 4. Theo dõi tốc độ cuộn chuột (Scroll Velocity) để kích hoạt hiệu ứng Doppler sóng âm
  let lastScrollY = window.scrollY;
  let scrollVelocity = 0;
  let scrollVelocityDampened = 0;
  let scrollTicking = false;

  window.addEventListener(
    "scroll",
    () => {
      const currentScrollY = window.scrollY;
      const delta = Math.abs(currentScrollY - lastScrollY);
      scrollVelocity = Math.min(delta * 0.08, 4.0);
      lastScrollY = currentScrollY;

      if (!scrollTicking) {
        requestAnimationFrame(() => {
          scrollTicking = false;
        });
        scrollTicking = true;
      }
    },
    { passive: true }
  );

  // 5. Theo dõi con trỏ chuột tương tác nhẹ
  let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000 };
  window.addEventListener(
    "mousemove",
    (e) => {
      mouse.targetX = e.clientX;
      mouse.targetY = e.clientY;
    },
    { passive: true }
  );

  // 6. Sóng âm đa tần (Harmonic Audio Sine Waves)
  const waves = [
    {
      amplitude: 28,
      frequency: 0.0018,
      speed: 0.012,
      offset: 0,
      yFactor: 0.35,
      alpha: 0.18,
      useAccent: false,
    },
    {
      amplitude: 38,
      frequency: 0.0012,
      speed: 0.009,
      offset: 2,
      yFactor: 0.55,
      alpha: 0.15,
      useAccent: true,
    },
    {
      amplitude: 45,
      frequency: 0.0009,
      speed: 0.007,
      offset: 4,
      yFactor: 0.75,
      alpha: 0.12,
      useAccent: false,
    },
  ];

  // 7. Vòng lặp Render 60 FPS
  let isRunning = true;
  let time = 0;

  function render() {
    if (!isRunning) return;

    // Giảm dần vận tốc cuộn về 0 (Damping)
    scrollVelocityDampened += (scrollVelocity - scrollVelocityDampened) * 0.06;
    scrollVelocity *= 0.94;

    // Làm mượt toạ độ chuột
    mouse.x += (mouse.targetX - mouse.x) * 0.1;
    mouse.y += (mouse.targetY - mouse.y) * 0.1;

    // Xoá khung hình
    ctx.clearRect(0, 0, width, height);

    time += 0.016 + scrollVelocityDampened * 0.008;

    // --- A. Vẽ các dải sóng âm Harmonic phía sau (Audio Frequency Ribbons) ---
    waves.forEach((wave) => {
      ctx.beginPath();
      const waveY = height * wave.yFactor;
      const amp = wave.amplitude * (1 + scrollVelocityDampened * 0.7);
      const c = wave.useAccent ? colors.accent : colors.primary;

      // Gradient sáng ở giữa, mờ dần sang 2 cạnh màn hình
      const grad = ctx.createLinearGradient(0, 0, width, 0);
      grad.addColorStop(0, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);
      grad.addColorStop(0.3, `rgba(${c.r}, ${c.g}, ${c.b}, ${wave.alpha * 0.7})`);
      grad.addColorStop(0.5, `rgba(${c.r}, ${c.g}, ${c.b}, ${wave.alpha * 1.3})`);
      grad.addColorStop(0.7, `rgba(${c.r}, ${c.g}, ${c.b}, ${wave.alpha * 0.7})`);
      grad.addColorStop(1, `rgba(${c.r}, ${c.g}, ${c.b}, 0)`);

      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;

      for (let x = 0; x <= width; x += 12) {
        const sine1 = Math.sin(x * wave.frequency + time * wave.speed * 60 + wave.offset);
        const sine2 = Math.cos(x * wave.frequency * 1.6 - time * 0.5);
        const y = waveY + (sine1 * amp) + (sine2 * amp * 0.4);

        if (x === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      }
      ctx.stroke();
    });

    // --- B. Vẽ các hạt năng lượng & sợi nối liên kết (Audio Constellation) ---
    const len = particles.length;
    for (let i = 0; i < len; i++) {
      const p = particles[i];

      // Di chuyển hạt (gia tốc thêm khi cuộn)
      p.x += p.vx * (1 + scrollVelocityDampened * 1.2);
      p.y += p.vy * (1 + scrollVelocityDampened * 1.2);

      // Nhấp nháy nhẹ nhàng
      p.pulseAngle += p.pulseSpeed;
      p.alpha = p.baseAlpha + Math.sin(p.pulseAngle) * 0.12;

      // Đẩy nhẹ khi chuột lại gần
      const dx = p.x - mouse.x;
      const dy = p.y - mouse.y;
      const distMouse = Math.hypot(dx, dy);
      if (distMouse < 100) {
        const force = (100 - distMouse) / 100;
        p.x += (dx / distMouse) * force * 1.5;
        p.y += (dy / distMouse) * force * 1.5;
      }

      // Xuyên biên màn hình (Wrap around)
      if (p.x < -10) p.x = width + 10;
      if (p.x > width + 10) p.x = -10;
      if (p.y < -10) p.y = height + 10;
      if (p.y > height + 10) p.y = -10;

      // Vẽ hạt
      const c = p.isAccent ? colors.accent : colors.primary;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${Math.max(0.05, p.alpha)})`;
      ctx.fill();

      // Nối dây vi lượng giữa các hạt gần nhau (tạo hiệu ứng lưới tần số âm thanh)
      for (let j = i + 1; j < len; j++) {
        const p2 = particles[j];
        const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
        const maxDist = 110;

        if (dist < maxDist) {
          const lineAlpha = (1 - dist / maxDist) * 0.15;
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(${c.r}, ${c.g}, ${c.b}, ${lineAlpha})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }
    }

    requestAnimationFrame(render);
  }

  // Tạm dừng vẽ khi tab bị ẩn để tiết kiệm pin/CPU
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
      isRunning = false;
    } else {
      isRunning = true;
      requestAnimationFrame(render);
    }
  });

  requestAnimationFrame(render);
}
