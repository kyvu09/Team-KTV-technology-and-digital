// ============================================================================
// HomeStudioTeaser.js — Component Section 3 Trang chủ (Bố cục 2 khối song song)
// - Bên trái: Thẻ Chuyển Đổi Sách Điện Tử Thành Sách Nói AI
// - Bên phải: Trích đoạn truyện "Cô Bé Quàng Khăn Đỏ" và nút phát nằm giữa (Web Speech API)
// ============================================================================

import { esc } from "../../core/esc.js";
import { audioState } from "../../core/audio-state.js";
import { navigateTo, ROUTES } from "../../core/router.js";

/**
 * Đoạn văn trích dẫn ngắn trong truyện "Cô bé quàng khăn đỏ"
 */
export const STORY_EXCERPT_TEXT =
  "Ngày xửa ngày xưa, có một cô bé rất ngoan ngoãn và đáng yêu. Bà ngoại may tặng cô một chiếc khăn quàng bằng nhung đỏ, cô thích lắm đi đâu cũng quàng, nên mọi người gọi cô là Cô Bé Quàng Khăn Đỏ.";

/**
 * Render Section 3 trên Trang chủ gồm 2 component cân xứng
 * @param {Object} props
 * @param {string} [props.storyTitle]
 * @param {string} [props.storyText]
 * @returns {string} HTML markup
 */
export function renderHomeStudioTeaser(props = {}) {
  const storyTitle = props.storyTitle || "Cô Bé Quàng Khăn Đỏ";
  const storyText = props.storyText || STORY_EXCERPT_TEXT;

  return `
    <section class="section home-studio-teaser-section" id="home-studio-teaser">
      <div class="container">
        <!-- Tiêu đề dẫn xuất Section 3 -->
        <div class="home-studio-header text-center reveal">
          <h2 class="section-title">Nhập văn bản. Cảm nhận giọng nói.</h2>
          <p class="section-subtitle">Trải nghiệm trực tiếp khả năng chuyển đổi văn bản tiếng Việt thành giọng nói với tốc độ nhanh và ngữ điệu tự nhiên.</p>
        </div>

        <!-- Lưới 2 component song song cân đối -->
        <div class="home-studio-two-cols reveal">
          <!-- 1. Component bên trái: Chuyển đổi Sách Điện Tử Thành Sách Nói AI -->
          <div class="home-audiobook-card">
            <div class="audiobook-card-visual">
              <img 
                src="assets/images/imgvivoice/audiobook-showcase.jpg" 
                alt="Chuyển Đổi Sách Điện Tử Thành Sách Nói AI" 
                class="audiobook-card-img" 
                loading="lazy" 
              />
            </div>
            <div class="audiobook-card-body">
              <h3 class="audiobook-card-title">Chuyển Đổi Sách Điện Tử Thành Sách Nói AI</h3>
              <p class="audiobook-card-desc">
                Phòng thí nghiệm nâng cao hỗ trợ tải lên file PDF, EPUB, TXT, DOCX, tự động trích xuất chương hồi, chọn hơn 400+ giọng đọc phòng thu và xuất file MP3 chất lượng cao.
              </p>
              <div class="audiobook-card-action">
                <a href="#demo" class="btn-audiobook-studio" id="home-audiobook-open-btn" data-page-link="demo">
                  <span>Mở Studio Trải Nghiệm Toàn Diện</span>
                </a>
              </div>
            </div>
          </div>

          <!-- 2. Component bên phải: Đoạn trích truyện Cô Bé Quàng Khăn Đỏ & Nút phát ở giữa -->
          <div class="home-sample-card">
            <div class="studio-quick-card story-reader-card">
              <!-- Tên truyện (Thay thế cho Bản phát thanh mẫu & Web Speech API) -->
              <div class="story-card-header">
                <h3 class="story-card-title">
                  <i class="fa-solid fa-book-bookmark"></i>
                  <span>${esc(storyTitle)}</span>
                </h3>
              </div>
              
              <!-- Đoạn trích truyện ngắn -->
              <div class="quick-card-content-wrap story-content-wrap">
                <div class="story-excerpt-box">
                  <p class="story-excerpt-text" id="home-story-text">
                    "${esc(storyText)}"
                  </p>
                </div>

                <!-- Dải sóng âm thanh Visualizer sống động khi phát giọng nói -->
                <div class="quick-card-soundwaves" id="home-teaser-soundwaves" aria-hidden="true">
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                  <span class="wave-bar"></span>
                </div>
              </div>

              <!-- Nút phát nằm ở giữa để người dùng trải nghiệm đọc bằng Web Speech API -->
              <div class="story-card-footer">
                <button class="quick-play-btn story-play-btn" id="home-quick-play-btn" type="button" aria-label="Phát giọng đọc">
                  <span id="home-quick-play-text">Phát giọng đọc</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>`.trim();
}

/**
 * Khởi tạo tương tác cho Section 3 Trang chủ:
 * 1. Chuyển sang DemoPage khi bấm nút "Mở Studio Trải Nghiệm Toàn Diện"
 * 2. Đọc đoạn trích truyện Cô bé quàng khăn đỏ bằng Web Speech API khi bấm nút phát ở giữa
 * @param {Object} props
 */
export function initHomeStudioTeaser(props = {}) {
  // 1. Tương tác nút Mở Studio Trải Nghiệm Toàn Diện
  const openStudioBtn = document.getElementById("home-audiobook-open-btn");
  if (openStudioBtn) {
    openStudioBtn.addEventListener("click", (e) => {
      e.preventDefault();
      navigateTo(ROUTES.DEMO);
    });
  }

  // 2. Tương tác phát giọng đọc truyện bằng Web Speech API cho card bên phải
  const btn = document.getElementById("home-quick-play-btn");
  const icon = document.getElementById("home-quick-play-icon");
  const text = document.getElementById("home-quick-play-text");
  const soundwaves = document.getElementById("home-teaser-soundwaves");

  if (!btn) return;

  const storyText = props.storyText || STORY_EXCERPT_TEXT;

  const setPlaying = (isPlaying) => {
    if (isPlaying) {
      if (icon) icon.className = "fa-solid fa-pause";
      if (text) text.textContent = "Dừng phát";
      if (soundwaves) soundwaves.classList.add("is-active");
    } else {
      if (icon) icon.className = "fa-solid fa-play";
      if (text) text.textContent = "Phát giọng đọc";
      if (soundwaves) soundwaves.classList.remove("is-active");
    }
  };

  btn.addEventListener("click", () => {
    if (audioState.isPlaying) {
      audioState.stopSpeech();
      setPlaying(false);
      return;
    }

    setPlaying(true);
    const onEnd = () => setPlaying(false);

    // Sử dụng Web Speech API trực tiếp để đọc đoạn trích truyện Cô Bé Quàng Khăn Đỏ
    audioState.playSpeech(storyText, {
      rate: 1.0,
      onEnd,
    });
  });

  audioState.subscribe((event) => {
    if (event === "stop" || event === "end") {
      setPlaying(false);
    }
  });
}
