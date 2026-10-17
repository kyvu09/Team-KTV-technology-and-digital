export function initPreloader(brandName = "") {
  const preloaderEl = document.getElementById("site-preloader");
  if (!preloaderEl) return;

  const brandEl = preloaderEl.querySelector(".preloader-brand");
  if (brandEl && brandName) brandEl.textContent = brandName;

  // Tự động tắt sau khi assets nạp xong hoặc tối đa 1.2s để không cản trở người dùng
  const dismiss = () => {
    preloaderEl.classList.add("fade-out");
    setTimeout(() => {
      preloaderEl.style.display = "none";
      document.body.classList.remove("is-loading");
      window.dispatchEvent(new CustomEvent("preloader:finished"));
    }, 600);
  };

  if (document.readyState === "complete") {
    setTimeout(dismiss, 500);
  } else {
    window.addEventListener("load", () => setTimeout(dismiss, 500));
  }
}
