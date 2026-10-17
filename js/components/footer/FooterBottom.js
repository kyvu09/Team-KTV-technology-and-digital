// ============================================================================
// FooterBottom.js — Thanh chân trang đáy cùng và nút cuộn lên đầu (Back to Top)
// ============================================================================

import { esc } from "../../core/esc.js";

/**
 * Render thanh đáy cùng chân trang
 * @param {Object} props
 * @param {string} [props.brandName=""]
 * @param {string} [props.copyright=""]
 * @param {number} [props.year]
 * @returns {string} HTML markup
 */
export function renderFooterBottom({
  brandName = "",
  copyright = "",
  year = new Date().getFullYear(),
} = {}) {
  return `
    <div class="footer-bottom-bar">
      <div class="container footer-bottom-inner">
        <p class="copyright">© ${year} ${esc(brandName)}. ${esc(copyright)}</p>
        <button class="back-to-top" id="back-to-top" type="button" aria-label="Về đầu trang">
          <span>Lên đầu trang</span>
        </button>
      </div>
    </div>`.trim();
}

/**
 * Khởi tạo sự kiện cuộn mượt lên đầu trang khi bấm nút Back To Top
 */
export function initFooterBottom() {
  const btt = document.getElementById("back-to-top");
  if (btt) {
    btt.addEventListener("click", () => {
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { duration: 1.2 });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    });
  }
}
