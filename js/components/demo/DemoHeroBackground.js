// ============================================================================
// DemoHeroBackground.js — Component 1: Dải sách chạy 2 luồng (Marquee Background)
// Luồng 1: Dải sách chạy ẩn ở phía sau (độ mờ cao, tạo chiều sâu 3D vô tận)
// Luồng 2: Dải sách chạy hiện lên phía trước từ trái qua với màu sắc rõ nét
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Danh sách các tác phẩm văn học và sách nói lấy ảnh thực tế từ thư mục assets/images/ebooks/
 */
export const CLASSIC_BOOKS = [
  {
    title: "Pride and Prejudice",
    author: "Jane Austen",
    image: "assets/images/ebooks/pride.jpg",
  },
  {
    title: "Đắc Nhân Tâm",
    author: "Dale Carnegie",
    image: "assets/images/ebooks/1.jpg",
  },
  {
    title: "Sherlock Holmes",
    author: "Arthur Conan Doyle",
    image: "assets/images/ebooks/sherlock.jpg",
  },
  {
    title: "Nhà Giả Kim",
    author: "Paulo Coelho",
    image: "assets/images/ebooks/2.jpg",
  },
  {
    title: "Dracula",
    author: "Bram Stoker",
    image: "assets/images/ebooks/dracula.jpg",
  },
  {
    title: "Tư Duy Nhanh Và Chậm",
    author: "Daniel Kahneman",
    image: "assets/images/ebooks/3.jpg",
  },
  {
    title: "Alice in Wonderland",
    author: "Lewis Carroll",
    image: "assets/images/ebooks/alice.jpg",
  },
  {
    title: "Hành Trình Về Phương Đông",
    author: "Baird T. Spalding",
    image: "assets/images/ebooks/4.jpg",
  },
  {
    title: "Frankenstein",
    author: "Mary Shelley",
    image: "assets/images/ebooks/frankenstein.jpg",
  },
  {
    title: "Muôn Kiếp Nhân Sinh",
    author: "Nguyên Phong",
    image: "assets/images/ebooks/5.jpg",
  },
  {
    title: "Jane Eyre",
    author: "Charlotte Brontë",
    image: "assets/images/ebooks/jane-eyre.jpg",
  },
  {
    title: "Cây Cam Ngọt Của Tôi",
    author: "José Mauro",
    image: "assets/images/ebooks/6.jpg",
  },
  {
    title: "Treasure Island",
    author: "Robert Louis Stevenson",
    image: "assets/images/ebooks/treasure-island.jpg",
  },
  {
    title: "Sapiens: Lược Sử Loài Người",
    author: "Yuval Noah Harari",
    image: "assets/images/ebooks/7.jpg",
  },
  {
    title: "The Secret Garden",
    author: "Frances Hodgson Burnett",
    image: "assets/images/ebooks/secret-garden.jpg",
  },
  {
    title: "Hiểu Về Trái Tim",
    author: "Minh Niệm",
    image: "assets/images/ebooks/8.jpg",
  },
  {
    title: "The Holy Bible",
    author: "Classic Literature",
    image: "assets/images/ebooks/bible.jpg",
  },
];

export const EBOOK_LIST = CLASSIC_BOOKS;

/**
 * Render thẻ sách đơn lẻ với ảnh bìa thực tế từ assets/images/ebooks, gáy sách 3D và ánh sáng phản chiếu
 */
function renderBookCard(book, streamType = "front") {
  return `
    <div class="demo-book-card demo-book-${streamType}" title="${esc(book.title)}${book.author ? ` — ${esc(book.author)}` : ""}" aria-hidden="true">
      <div class="demo-book-spine"></div>
      <div class="demo-book-cover">
        <img src="${esc(book.image)}" alt="${esc(book.title)}" class="demo-book-img" loading="lazy" />
        <div class="demo-book-sheen"></div>
      </div>
    </div>`;
}

/**
 * Render khối dải sách chạy 2 luồng chuyển động vô tận
 * @returns {string} HTML markup
 */
export function renderDemoHeroBackground() {
  // Nhân đôi mảng sách để tạo vòng lặp chạy mượt mà vô tận (seamless infinite loop)
  const doubleBooks = [...CLASSIC_BOOKS, ...CLASSIC_BOOKS];

  const streamBackHtml = doubleBooks
    .map((b) => renderBookCard(b, "back"))
    .join("");

  const streamFrontHtml = doubleBooks
    .map((b) => renderBookCard(b, "front"))
    .join("");

  return `
    <div class="demo-hero-bg-container" aria-hidden="true">
      <!-- Lớp phủ ánh sáng chuyển màu tạo không gian sâu thẳm -->
      <div class="demo-hero-vignette"></div>

      <!-- Luồng 1: Dải sách chạy ẩn ở phía dưới/sau (mờ ảo, tạo chiều sâu 3D) -->
      <div class="demo-books-stream demo-books-stream--back">
        <div class="demo-books-track demo-books-track--slow">
          ${streamBackHtml}
        </div>
      </div>

      <!-- Luồng 2: Dải sách chạy hiện lên phía trước từ trái qua (rõ nét, sống động) -->
      <div class="demo-books-stream demo-books-stream--front">
        <div class="demo-books-track demo-books-track--normal">
          ${streamFrontHtml}
        </div>
      </div>

      <!-- Lớp phủ Gradient làm tối dần về đáy để nối liền mạch với Studio Console -->
      <div class="demo-hero-bottom-fade"></div>
    </div>`.trim();
}
