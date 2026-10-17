// ============================================================================
// voice-orb.js — Quả cầu giọng nói 3D (Three.js) phản ứng theo âm thanh & con trỏ
// ============================================================================

import { audioState } from "../core/audio-state.js";

export function initVoiceOrb(containerId = "hero-voice-orb") {
  const container = document.getElementById(containerId);
  if (!container) return null;

  if (typeof window.THREE === "undefined") {
    console.warn("Three.js chưa tải, sử dụng fallback CSS Orb.");
    container.classList.add("orb-fallback");
    return null;
  }

  const THREE = window.THREE;
  const width = container.clientWidth || 450;
  const height = container.clientHeight || 450;

  // Lấy màu sắc từ theme CSS variables
  const computedStyle = getComputedStyle(document.documentElement);
  const primaryColorHex = computedStyle.getPropertyValue("--primary").trim() || "#38bdf8";
  const accentColorHex = computedStyle.getPropertyValue("--accent").trim() || "#a78bfa";

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
  camera.position.z = 6;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.innerHTML = "";
  container.appendChild(renderer.domElement);

  // 1. Nhóm chứa tất cả thành phần để xoay theo tương tác chuột
  const orbGroup = new THREE.Group();
  scene.add(orbGroup);

  // 2. Khối cầu chính dạng lưới Icosahedron với shader / wireframe phát sáng
  const geometry = new THREE.IcosahedronGeometry(1.6, 32);
  const originalPositions = geometry.attributes.position.clone();

  const material = new THREE.MeshBasicMaterial({
    color: new THREE.Color(primaryColorHex),
    wireframe: true,
    transparent: true,
    opacity: 0.35,
  });
  const coreMesh = new THREE.Mesh(geometry, material);
  orbGroup.add(coreMesh);

  // 3. Đám mây hạt phát sáng (Particle Starfield Cloud)
  const particleCount = 700;
  const particleGeo = new THREE.BufferGeometry();
  const particlePos = new Float32Array(particleCount * 3);
  const particleColors = new Float32Array(particleCount * 3);

  const c1 = new THREE.Color(primaryColorHex);
  const c2 = new THREE.Color(accentColorHex);

  for (let i = 0; i < particleCount; i++) {
    const phi = Math.acos(-1 + (2 * i) / particleCount);
    const theta = Math.sqrt(particleCount * Math.PI) * phi;
    const r = 1.9 + (Math.random() - 0.5) * 0.4;

    const x = r * Math.cos(theta) * Math.sin(phi);
    const y = r * Math.sin(theta) * Math.sin(phi);
    const z = r * Math.cos(phi);

    particlePos[i * 3] = x;
    particlePos[i * 3 + 1] = y;
    particlePos[i * 3 + 2] = z;

    const lerpColor = c1.clone().lerp(c2, Math.random());
    particleColors[i * 3] = lerpColor.r;
    particleColors[i * 3 + 1] = lerpColor.g;
    particleColors[i * 3 + 2] = lerpColor.b;
  }

  particleGeo.setAttribute("position", new THREE.BufferAttribute(particlePos, 3));
  particleGeo.setAttribute("color", new THREE.BufferAttribute(particleColors, 3));

  const particleMat = new THREE.PointsMaterial({
    size: 0.045,
    vertexColors: true,
    transparent: true,
    opacity: 0.85,
    blending: THREE.AdditiveBlending,
  });

  const particleSystem = new THREE.Points(particleGeo, particleMat);
  orbGroup.add(particleSystem);

  // 4. Vòng hào quang bên trong (Inner Glow Sphere)
  const innerGeo = new THREE.SphereGeometry(1.2, 24, 24);
  const innerMat = new THREE.MeshBasicMaterial({
    color: new THREE.Color(accentColorHex),
    transparent: true,
    opacity: 0.15,
    blending: THREE.AdditiveBlending,
  });
  const innerMesh = new THREE.Mesh(innerGeo, innerMat);
  orbGroup.add(innerMesh);

  // Tương tác chuột
  let targetRotationX = 0;
  let targetRotationY = 0;
  let mouseX = 0;
  let mouseY = 0;

  const onMouseMove = (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / width) * 2 - 1;
    mouseY = -(((e.clientY - rect.top) / height) * 2 - 1);
    targetRotationY = mouseX * 0.6;
    targetRotationX = -mouseY * 0.6;
  };
  window.addEventListener("mousemove", onMouseMove);

  // Biến phục vụ rung sóng âm (Wave displacement)
  let time = 0;
  let audioIntensity = 0;

  audioState.subscribe((event, data) => {
    if (event === "word" || event === "tick") {
      audioIntensity = data.frequency || 0.8;
    } else if (event === "stop" || event === "end") {
      audioIntensity = 0;
    }
  });

  // Tối ưu hiệu năng: Tạm dừng render Three.js khi quả cầu cuộn ra khỏi màn hình
  let isVisible = true;
  let observer = null;
  if ("IntersectionObserver" in window) {
    observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          isVisible = entry.isIntersecting;
          if (isVisible && !animationFrameId) {
            animate();
          }
        });
      },
      { threshold: 0.05 },
    );
    observer.observe(container);
  }

  // Vòng lặp Render (60fps)
  let animationFrameId = null;
  function animate() {
    if (!isVisible) {
      animationFrameId = null;
      return;
    }
    animationFrameId = requestAnimationFrame(animate);
    time += 0.015;

    // Giảm dần cường độ âm thanh về mức nghỉ (idle)
    audioIntensity *= 0.94;
    const baseWave = 0.08 + audioIntensity * 0.4;

    // Xoay nhẹ nhàng kết hợp nghiêng theo con trỏ
    orbGroup.rotation.y += (targetRotationY - orbGroup.rotation.y) * 0.05 + 0.003;
    orbGroup.rotation.x += (targetRotationX - orbGroup.rotation.x) * 0.05;
    particleSystem.rotation.y -= 0.002;
    particleSystem.rotation.z += 0.001;

    // Biến dạng bề mặt khối cầu theo hàm sóng Sin (Harmonic noise)
    const pos = geometry.attributes.position;
    const orig = originalPositions;
    for (let i = 0; i < pos.count; i++) {
      const u = orig.getX(i);
      const v = orig.getY(i);
      const w = orig.getZ(i);

      const length = Math.sqrt(u * u + v * v + w * w);
      const wave = Math.sin(u * 3 + time * 3) * Math.cos(v * 3 + time * 2) * baseWave;
      const factor = (length + wave) / length;

      pos.setXYZ(i, u * factor, v * factor, w * factor);
    }
    pos.needsUpdate = true;

    // Hiệu ứng phồng nở khi có giọng nói
    const scaleFactor = 1 + audioIntensity * 0.18;
    orbGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);

    renderer.render(scene, camera);
  }
  animate();

  // Resize handler
  const onResize = () => {
    if (!container) return;
    const newW = container.clientWidth || 400;
    const newH = container.clientHeight || 400;
    camera.aspect = newW / newH;
    camera.updateProjectionMatrix();
    renderer.setSize(newW, newH);
  };
  window.addEventListener("resize", onResize);

  return {
    destroy: () => {
      if (observer) observer.disconnect();
      if (animationFrameId) cancelAnimationFrame(animationFrameId);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      renderer.dispose();
    },
  };
}
