export function renderSite(config) {

  // 1. Render Header
  renderHeader(config);

  // 2. Lấy khu vực #app
  const app = document.getElementById("app");

  if (!app) {
    console.error("Không tìm thấy #app");
    return;
  }

  // 3. Render Hero
  app.innerHTML = renderHero(config.hero);
}