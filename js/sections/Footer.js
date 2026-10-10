// ============================================================================
// Footer.js — Chân trang sang trọng với Watermark Brand khổng lồ
// ============================================================================

import { esc } from "../core/esc.js";

export function renderFooter(config) {
  const { brand, footer = {} } = config;
  // Lấy năm hiện tại để hiển thị Copyright luôn tự động cập nhật
  const year = new Date().getFullYear();

  document.getElementById("site-footer").innerHTML = `
    <div class="footer-huge-wordmark" aria-hidden="true">${esc(brand.name)}</div>
    <div class="container footer-inner">
      <div class="footer-brand-col">
        <a class="footer-logo" href="#">
          <span class="logo-text">${esc(brand.name)}</span>
        </a>
        <p class="footer-tagline">${esc(footer.tagline || brand.slogan || "")}</p>
       
      </div>

      <div class="footer-links-grid">
        ${(footer.columns || [])
          .map(
            (col) => `
          <div class="footer-col">
            <h4 class="footer-col-title">${esc(col.title)}</h4>
            <ul class="footer-col-links">
              ${(col.links || []).map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`).join("")}
            </ul>
          </div>`,
          )
          .join("")}
      </div>
    </div>

    <div class="footer-bottom-bar">
      <div class="container footer-bottom-inner">
        <p class="copyright">© ${year} ${esc(brand.name)}. ${esc(footer.copyright || "")}</p>
        <button class="back-to-top" id="back-to-top" type="button" aria-label="Về đầu trang">
          <span>Lên đầu trang</span>
          <i class="fa-solid fa-arrow-up"></i>
        </button>
      </div>
    </div>`;
          
  // Gắn sự kiện cho nút "Lên đầu trang"
  const btt = document.getElementById("back-to-top");
  if (btt) {
    btt.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
}
