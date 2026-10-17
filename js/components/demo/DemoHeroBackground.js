// ============================================================================
// DemoHeroBackground.js — Component 1: Dải ảnh chạy 2 luồng (Marquee Background)
// Tự động chọn thư viện ảnh nền tương ứng tùy theo thương hiệu (Brand Dynamic Assets):
// - Brand ViVoice: lấy ảnh trong thư mục assets/images/imgvivoice/ebooks/
// - Brand OmniClarity: lấy ảnh trong thư mục assets/images/imgomniclarity/img_omniclarityBook/
// - Brand CyberTone: lấy ảnh trong thư mục assets/images/imgcyberTone/img_cybertonebook/
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * 1. Bộ sưu tập sách nói & tác phẩm kinh điển cho thương hiệu ViVoice (AI Voice Tiếng Việt)
 * Thư mục: assets/images/imgvivoice/ebooks/
 */
export const VIVOICE_BOOKS = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: "assets/images/imgvivoice/ebooks/pride.jpg",
  },
  {
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    image: "assets/images/imgvivoice/ebooks/1.jpg",
  },
  {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    image: "assets/images/imgvivoice/ebooks/sherlock.jpg",
  },
  {
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    image: "assets/images/imgvivoice/ebooks/2.jpg",
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    image: "assets/images/imgvivoice/ebooks/dracula.jpg",
  },
  {
    title: "Tư Duy Nhanh Và Chậm",
    author: "Daniel Kahneman",
    image: "assets/images/imgvivoice/ebooks/3.jpg",
  },
  {
    title: "Alice in Wonderland",
    author: "Lewis Carroll",
    image: "assets/images/imgvivoice/ebooks/alice.jpg",
  },
  {
    title: "Hành Trình Về Phương Đông",
    author: "Baird T. Spalding",
    image: "assets/images/imgvivoice/ebooks/4.jpg",
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    image: "assets/images/imgvivoice/ebooks/frankenstein.jpg",
  },
  {
    title: "Muôn Kiếp Nhân Sinh",
    author: "Nguyên Phong",
    image: "assets/images/imgvivoice/ebooks/5.jpg",
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    image: "assets/images/imgvivoice/ebooks/jane-eyre.jpg",
  },
  {
    title: "Cây Cam Ngọt Của Tôi",
    author: "José Mauro",
    image: "assets/images/imgvivoice/ebooks/6.jpg",
  },
  {
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    image: "assets/images/imgvivoice/ebooks/treasure-island.jpg",
  },
  {
    title: "Sapiens: Lược Sử Loài Người",
    author: "Yuval Noah Harari",
    image: "assets/images/imgvivoice/ebooks/7.jpg",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    image: "assets/images/imgvivoice/ebooks/secret-garden.jpg",
  },
  {
    title: "Hiểu Về Trái Tim",
    author: "Minh Niệm",
    image: "assets/images/imgvivoice/ebooks/8.jpg",
  },
  {
    title: "The Holy Bible",
    author: "Classic Literature",
    image: "assets/images/imgvivoice/ebooks/bible.jpg",
  },
];

/**
 * 2. Bộ sưu tập hồ sơ số, CSKH & y tế chuyên sâu cho thương hiệu OmniClarity
 * Thư mục: assets/images/imgomniclarity/img_omniclarityBook/
 */
export const OMNICLARITY_BOOKS = [
  {
    title: "Hồ Sơ Y Khoa Kỹ Thuật Số",
    author: "OmniClarity Medical Tele-Health",
    image: "assets/images/imgomniclarity/img_omniclarityBook/image-1s.jpg",
  },
  {
    title: "Chẩn Đoán Hình Ảnh AI",
    author: "Diagnostic AI Voice System",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-2.jpg",
  },
  {
    title: "Tổng Đài Tài Chính Chuẩn Xác",
    author: "Financial Banking Voice AI",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-3.jpg",
  },
  {
    title: "Hệ Thống CSKH Thông Minh",
    author: "Smart Clinic & Hospital CSKH",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-4.jpg",
  },
  {
    title: "Bệnh Án Điện Tử Chuẩn HIPAA",
    author: "HIPAA Security Standards",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-5.jpg",
  },
  {
    title: "Dược Điển & Thuốc Đặc Trị",
    author: "Pharma Voice AI Assistant",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-6.jpg",
  },
  {
    title: "Báo Cáo Tín Dụng & Số Dư",
    author: "Wealth Analytics Dispatcher",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-7.jpg",
  },
  {
    title: "Chăm Sóc Sức Khỏe Toàn Diện",
    author: "Primary Care AI Telephony",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-8.jpg",
  },
  {
    title: "Sinh Trắc Học Giọng Nói",
    author: "Voice Biometrics Security",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-9.jpg",
  },
  {
    title: "Tổng Đài Cấp Cứu 24/7",
    author: "Emergency Dispatch Voice",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-10.jpg",
  },
  {
    title: "Trợ Lý Y Khoa Lâm Sàng",
    author: "Clinical Voice Documentation",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-11.jpg",
  },
  {
    title: "Tư Vấn Quyền Lợi Bảo Hiểm",
    author: "Health Insurance Smart Bot",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-12.jpg",
  },
  {
    title: "Cổng Thông Tin Bệnh Nhân",
    author: "Patient Portal Voice Guide",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-13.jpg",
  },
  {
    title: "Chỉ Số Xét Nghiệm Tự Động",
    author: "Quantitative Lab Voice",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-14.jpg",
  },
  {
    title: "Hệ Thống Nhắc Lịch Khám",
    author: "Appointment Auto-Reminder",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-15.jpg",
  },
  {
    title: "Giám Sát Chỉ Số Sinh Tồn",
    author: "Realtime Vital Signs Monitor",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-16.png",
  },
  {
    title: "Tổng Đài CSKH Đa Kênh",
    author: "Omnichannel Contact Center",
    image: "assets/images/imgomniclarity/img_omniclarityBook/images-17.jpg",
  },
];

/**
 * 3. Bộ sưu tập hình nền game, NPC & vũ trụ ảo cho thương hiệu CyberTone
 * Thư mục: assets/images/imgcyberTone/img_cybertonebook/
 */
export const CYBERTONE_BOOKS = [
  {
    title: "Chiến Binh Tiền Tuyến",
    author: "Battlefield NPC Combatant",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-1.jpg",
  },
  {
    title: "Sát Thủ Bóng Đêm",
    author: "Shadow Assassin Stealth Lore",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-2.jpg",
  },
  {
    title: "Kỵ Sĩ Ánh Sáng",
    author: "Paladin of Dawn RPG",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-3.jpg",
  },
  {
    title: "Thợ Săn Không Gian",
    author: "Cyber Hunter Metaverse",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-4.jpg",
  },
  {
    title: "Chiến Thần Đột Kích",
    author: "Titan Raider Ultra-Low Latency",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-5.jpg",
  },
  {
    title: "Hắc Hiệp Sĩ",
    author: "Dark Knight Dark Lore",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-6.jpg",
  },
  {
    title: "Thủ Lĩnh Tinh Anh",
    author: "Apex Commander Tactical Line",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-7.jpg",
  },
  {
    title: "Phù Thủy Hư Không",
    author: "Void Sorcerer Mystic Voice",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-8.jpg",
  },
  {
    title: "Đặc Vụ Cyberpunk",
    author: "Neon Operative Synthesized Voice",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-9.jpg",
  },
  {
    title: "Chiến Binh Khải Huyền",
    author: "Apocalypse Warrior Battle Cry",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-10.jpg",
  },
  {
    title: "Du Mục Sa Mạc",
    author: "Desert Nomad Open-World",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-11.jpg",
  },
  {
    title: "Xạ Thủ Tầm Xa",
    author: "Sniper Elite Dialogue",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-12.jpg",
  },
  {
    title: "Thần Kiếm Huyền Huyễn",
    author: "Blademaster Fantasy Lore",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-13.jpg",
  },
  {
    title: "Người Bảo Vệ Thiên Hà",
    author: "Galaxy Sentinel Sci-Fi Lore",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-14.jpg",
  },
  {
    title: "Bóng Ma Đấu Trường",
    author: "Arena Phantom PvP Announcer",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-15.jpg",
  },
  {
    title: "Chỉ Huy Chiến Dịch",
    author: "Tactical Officer Radio Comms",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-16.jpg",
  },
  {
    title: "Huyền Thoại Trỗi Dậy",
    author: "Mythic Awakening Cinematic Voice",
    image: "assets/images/imgcyberTone/img_cybertonebook/hinh-nen-game-17.jpg",
  },
];

/**
 * Bản đồ liên kết ảnh nền theo mã nhận diện Brand (White Label Mapping)
 */
export const BRAND_HERO_BOOKS = {
  "brand-vivoice": VIVOICE_BOOKS,
  "brand-omniclarity": OMNICLARITY_BOOKS,
  "brand-cybertone": CYBERTONE_BOOKS,
};

// Giữ lại các alias cũ để đảm bảo tương thích ngược 100%
export const CLASSIC_BOOKS = VIVOICE_BOOKS;
export const EBOOK_LIST = VIVOICE_BOOKS;

/**
 * Xác định chính xác Brand Key từ các thông tin props/config/URL/LocalStorage
 * @param {Object|string} brandOrOptions
 * @returns {"brand-vivoice"|"brand-omniclarity"|"brand-cybertone"}
 */
export function resolveBrandKey(brandOrOptions = {}) {
  if (typeof brandOrOptions === "string") {
    const s = brandOrOptions.trim().toLowerCase();
    if (s.includes("cyber")) return "brand-cybertone";
    if (s.includes("omni")) return "brand-omniclarity";
    return "brand-vivoice";
  }

  const rawKey =
    brandOrOptions?.brandKey ||
    brandOrOptions?.brand?.id ||
    brandOrOptions?.brand?.key ||
    brandOrOptions?.brand?.name ||
    brandOrOptions?.brandName ||
    brandOrOptions?.config?.brandKey ||
    brandOrOptions?.config?.brand?.key ||
    brandOrOptions?.config?.brand?.name ||
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("vivoice_current_brand")) ||
    (typeof window !== "undefined" &&
      new URLSearchParams(window.location.search).get("brand")) ||
    "";

  const s = String(rawKey).trim().toLowerCase();
  if (s.includes("cyber")) return "brand-cybertone";
  if (s.includes("omni")) return "brand-omniclarity";
  return "brand-vivoice";
}

/**
 * Lấy danh sách ảnh nền theo thương hiệu hiện tại
 * @param {Object|string} brandOrOptions
 * @returns {Array<{title: string, author?: string, image: string}>}
 */
export function getHeroBooksByBrand(brandOrOptions = {}) {
  // Cho phép can thiệp ghi đè ảnh tùy biến nếu có cấu hình trực tiếp
  if (Array.isArray(brandOrOptions?.books) && brandOrOptions.books.length > 0) {
    return brandOrOptions.books;
  }
  if (
    Array.isArray(brandOrOptions?.config?.demoHeroBackgroundBooks) &&
    brandOrOptions.config.demoHeroBackgroundBooks.length > 0
  ) {
    return brandOrOptions.config.demoHeroBackgroundBooks;
  }

  const brandKey = resolveBrandKey(brandOrOptions);
  return BRAND_HERO_BOOKS[brandKey] || VIVOICE_BOOKS;
}

/**
 * Render thẻ đơn lẻ với ảnh bìa thực tế theo thương hiệu, gáy sách 3D và ánh sáng phản chiếu
 */
function renderBookCard(book, streamType = "front", brandKey = "") {
  return `
    <div class="demo-book-card demo-book-${streamType}" data-brand="${esc(brandKey)}" title="${esc(book.title || "")}${book.author ? ` — ${esc(book.author)}` : ""}" aria-hidden="true">
      <div class="demo-book-spine"></div>
      <div class="demo-book-cover">
        <img src="${esc(book.image)}" alt="${esc(book.title || "")}" class="demo-book-img" loading="lazy" />
        <div class="demo-book-sheen"></div>
      </div>
    </div>`;
}

/**
 * Render khối dải ảnh chạy 2 luồng chuyển động vô tận theo thương hiệu
 * @param {Object|string} [options={}] Thông tin cấu hình hoặc brand key
 * @returns {string} HTML markup
 */
export function renderDemoHeroBackground(options = {}) {
  const books = getHeroBooksByBrand(options);
  const brandKey = resolveBrandKey(options);

  // Nhân đôi mảng thẻ để tạo vòng lặp chạy mượt mà vô tận (seamless infinite loop)
  const doubleBooks = [...books, ...books];

  const streamBackHtml = doubleBooks
    .map((b) => renderBookCard(b, "back", brandKey))
    .join("");

  const streamFrontHtml = doubleBooks
    .map((b) => renderBookCard(b, "front", brandKey))
    .join("");

  return `
    <div class="demo-hero-bg-container demo-hero-bg--${esc(brandKey)}" data-hero-brand="${esc(brandKey)}" aria-hidden="true">
      <!-- Lớp phủ ánh sáng chuyển màu tạo không gian sâu thẳm -->
      <div class="demo-hero-vignette"></div>

      <!-- Luồng 1: Dải thẻ chạy ẩn ở phía dưới/sau (mờ ảo, tạo chiều sâu 3D) -->
      <div class="demo-books-stream demo-books-stream--back">
        <div class="demo-books-track demo-books-track--slow">
          ${streamBackHtml}
        </div>
      </div>

      <!-- Luồng 2: Dải thẻ chạy hiện lên phía trước từ trái qua (rõ nét, sống động) -->
      <div class="demo-books-stream demo-books-stream--front">
        <div class="demo-books-track demo-books-track--normal">
          ${streamFrontHtml}
        </div>
      </div>

      <!-- Lớp phủ Gradient làm tối dần về đáy để nối liền mạch với Studio Console -->
      <div class="demo-hero-bottom-fade"></div>
    </div>`.trim();
}
