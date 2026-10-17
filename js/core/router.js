/**
 * Danh sách các route được hỗ trợ
 */
export const ROUTES = {
  HOME: "home",
  FEATURES: "features",
  DEMO: "demo",
  ABOUT: "about",
  FAQ: "faq",
  CONTACT: "contact",
  AUTH: "auth",
};

/**
 * Lấy mã route hiện tại từ window.location.hash
 * @returns {string} Mã trang ('home' | 'features' | 'demo' | 'about' | 'faq' | 'contact')
 */
export function getCurrentRoute() {
  const hash = (window.location.hash || "")
    .replace(/^#\/?/, "")
    .toLowerCase()
    .trim();

  if (!hash || hash === "hero" || hash === "home") {
    return ROUTES.HOME;
  }
  if (hash.startsWith("about")) {
    return ROUTES.ABOUT;
  }
  if (hash.startsWith("feature")) {
    return ROUTES.FEATURES;
  }
  if (hash.startsWith("demo")) {
    return ROUTES.DEMO;
  }
  if (hash.startsWith("faq")) {
    return ROUTES.FAQ;
  }
  if (hash.startsWith("contact")) {
    return ROUTES.CONTACT;
  }
  if (
    hash.startsWith("auth") ||
    hash.startsWith("login") ||
    hash.startsWith("register")
  ) {
    return ROUTES.AUTH;
  }

  // Mặc định là Trang chủ nếu hash không khớp
  return ROUTES.HOME;
}

/**
 * Chuyển trang qua mã JavaScript
 * @param {string} routeName - Tên route trong ROUTES
 */
export function navigateTo(routeName) {
  const targetHash = routeName === ROUTES.HOME ? "#hero" : `#${routeName}`;
  if (window.location.hash !== targetHash) {
    window.location.hash = targetHash;
  } else {
    // Nếu hash giống nhau thì kích hoạt thủ công
    window.dispatchEvent(new HashChangeEvent("hashchange"));
  }
}

/**
 * Cập nhật trạng thái active trên thanh menu Header và thanh viên thuốc
 * @param {string} currentRoute
 */
export function updateActiveNav(currentRoute) {
  const headerNav = document.getElementById("header-nav");
  if (!headerNav) return;

  const links = headerNav.querySelectorAll(".nav-link");
  const indicator = document.getElementById("nav-indicator");

  let activeLink = null;

  links.forEach((link) => {
    const href = (link.getAttribute("href") || "")
      .replace(/^#\/?/, "")
      .toLowerCase();
    const isHome =
      (href === "hero" || href === "home" || href === "") &&
      currentRoute === ROUTES.HOME;
    const isMatch = href === currentRoute || href.startsWith(currentRoute);

    if (isHome || isMatch) {
      link.classList.add("active");
      activeLink = link;
    } else {
      link.classList.remove("active");
    }
  });

  // Di chuyển viên thuốc indicator đến tab đang active
  if (indicator && activeLink) {
    indicator.style.width = activeLink.offsetWidth + "px";
    indicator.style.left = activeLink.offsetLeft + "px";
    indicator.style.opacity = "1";
  }
}

/**
 * Khởi tạo bộ định tuyến Router và gắn lắng nghe sự kiện
 * @param {Function} onRouteChanged - Callback nhận vào (newRoute, previousRoute)
 */
export function initRouter(onRouteChanged) {
  let currentRoute = getCurrentRoute();

  const handleRouteTransition = () => {
    const newRoute = getCurrentRoute();
    const previousRoute = currentRoute;
    currentRoute = newRoute;

    // Cuộn mượt lên đầu trang khi chuyển trang
    if (window.__lenis) {
      window.__lenis.scrollTo(0, { immediate: true });
    } else {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }

    // Cập nhật menu nav
    updateActiveNav(newRoute);

    // Kích hoạt render lại view
    if (typeof onRouteChanged === "function") {
      onRouteChanged(newRoute, previousRoute);
    }
  };

  // Lắng nghe sự kiện hashchange của trình duyệt (hỗ trợ nút Back / Forward)
  window.addEventListener("hashchange", handleRouteTransition);

  // Bắt các cú click link có data-page-link hoặc href dạng hash để chuyển trang ngay
  document.addEventListener("click", (e) => {
    const targetLink = e.target.closest("a[href^='#']");
    if (!targetLink) return;

    const rawHref = targetLink.getAttribute("href") || "";
    const cleanHash = rawHref.replace(/^#\/?/, "").toLowerCase();

    // Các liên kết chuyển trang
    const validRoutes = [
      "hero",
      "home",
      "features",
      "demo",
      "about",
      "faq",
      "contact",
      "auth",
      "login",
      "register",
    ];
    if (validRoutes.includes(cleanHash)) {
      e.preventDefault();
      const targetRoute =
        cleanHash === "hero"
          ? ROUTES.HOME
          : cleanHash === "login" || cleanHash === "register"
            ? ROUTES.AUTH
            : cleanHash;
      navigateTo(targetRoute);
    }
  });

  // Chạy lần đầu lúc tải trang
  updateActiveNav(currentRoute);
  if (typeof onRouteChanged === "function") {
    onRouteChanged(currentRoute, null);
  }
}
