class AuthStateManager {
  constructor() {
    this.user = this._loadUserFromStorage();
    this.listeners = new Set();
  }

  /**
   * Nạp thông tin người dùng từ storage nếu có
   * @private
   */
  _loadUserFromStorage() {
    try {
      let raw = null;
      if (typeof sessionStorage !== "undefined") {
        raw = sessionStorage.getItem("vivoice_auth_user");
      }
      if (!raw && typeof localStorage !== "undefined") {
        raw = localStorage.getItem("vivoice_auth_user");
      }
      if (!raw) return null;
      const data = JSON.parse(raw);
      if (data && (data.name || data.email)) {
        return data;
      }
    } catch (e) {
      console.warn("Không thể nạp auth user từ storage:", e);
    }
    return null;
  }

  /**
   * Lấy thông tin người dùng hiện tại
   * @returns {Object|null}
   */
  getUser() {
    return this.user;
  }

  /**
   * Kiểm tra người dùng đã đăng nhập chưa
   * @returns {boolean}
   */
  isLoggedIn() {
    return Boolean(this.user && (this.user.name || this.user.email));
  }

  /**
   * Đăng nhập với thông tin người dùng
   * @param {Object} userData - { name, email }
   * @param {boolean} remember - Lưu lâu dài trên localStorage hay chỉ phiên hiện tại
   */
  login(userData = {}, remember = false) {
    const email = (userData.email || "").trim();
    let name = (userData.name || "").trim();

    // Nếu không có tên, tạo tên hiển thị đẹp từ phần đầu của email
    if (!name && email) {
      const part = email.split("@")[0] || "User";
      name = part.charAt(0).toUpperCase() + part.slice(1);
    }

    this.user = {
      name: name || "Người dùng",
      email: email || "",
      loggedInAt: new Date().toISOString(),
    };

    const userJson = JSON.stringify(this.user);

    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.setItem("vivoice_auth_user", userJson);
      } catch (e) {
        console.warn("Lỗi lưu user vào sessionStorage:", e);
      }
    }

    if (remember && typeof localStorage !== "undefined") {
      try {
        localStorage.setItem("vivoice_auth_user", userJson);
      } catch (e) {
        console.warn("Lỗi lưu user vào localStorage:", e);
      }
    }

    this.notify("login", this.user);
  }

  /**
   * Đăng xuất tài khoản
   */
  logout() {
    this.user = null;
    if (typeof sessionStorage !== "undefined") {
      try {
        sessionStorage.removeItem("vivoice_auth_user");
      } catch (e) {
        console.warn("Lỗi xóa user khỏi sessionStorage:", e);
      }
    }
    if (typeof localStorage !== "undefined") {
      try {
        localStorage.removeItem("vivoice_auth_user");
      } catch (e) {
        console.warn("Lỗi xóa user khỏi localStorage:", e);
      }
    }
    this.notify("logout", null);
  }

  /**
   * Đăng ký lắng nghe thay đổi trạng thái xác thực
   * @param {Function} listenerFn - Callback (event, user)
   * @returns {Function} Hàm hủy đăng ký
   */
  subscribe(listenerFn) {
    this.listeners.add(listenerFn);
    return () => this.listeners.delete(listenerFn);
  }

  /**
   * Phát thông báo cho tất cả các thành phần đã đăng ký
   * @param {string} event - 'login' | 'logout'
   * @param {Object|null} payload - Dữ liệu người dùng
   */
  notify(event, payload = null) {
    for (const fn of this.listeners) {
      try {
        fn(event, payload);
      } catch (e) {
        console.error("Lỗi trong AuthState listener:", e);
      }
    }
  }
}

export const authState = new AuthStateManager();
