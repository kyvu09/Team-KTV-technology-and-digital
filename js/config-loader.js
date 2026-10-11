// ============================================================================
// config-loader.js — Chịu trách nhiệm nạp file cấu hình (JSON)
// Đã được viết lại thân thiện với người mới học (Beginner Friendly)
// ============================================================================

// Bảng ánh xạ bí danh (Aliases) để tương thích ngược mọi đường link cũ/mới
const BRAND_ALIASES = {
  "brand-datasphere": "brand-omniclarity",
  "datasphere": "brand-omniclarity",
  "brand-cyberguard": "brand-cybertone",
  "cyberguard": "brand-cybertone",
  "vivoice": "brand-vivoice",
  "cybertone": "brand-cybertone",
  "omniclarity": "brand-omniclarity",
  "vi-voice": "brand-vivoice",
  "edu-ai": "brand-cybertone",
  "travel-ai": "brand-omniclarity"
};

// Hàm chuẩn hóa tên file brand
export function normalizeBrandKey(rawName) {
  if (!rawName) return "brand-vivoice";
  let clean = rawName.trim().toLowerCase();

  // 1. Kiểm tra bảng ánh xạ bí danh
  if (BRAND_ALIASES[clean]) {
    return BRAND_ALIASES[clean];
  }

  // 2. Tự động thêm tiền tố "brand-" nếu người dùng gõ thiếu (ví dụ ?brand=cybertone)
  if (!clean.startsWith("brand-")) {
    let prefixed = "brand-" + clean;
    if (BRAND_ALIASES[prefixed]) {
      return BRAND_ALIASES[prefixed];
    }
    return prefixed;
  }

  return clean;
}

// Hàm này giúp tạo ra đường dẫn tới file json
function configPath(brandName) {
  let currentTime = Date.now();
  return "config/" + brandName + ".json?t=" + currentTime;
}

// Hàm tải file cấu hình JSON từ thư mục config kèm cơ chế Fallback an toàn
export async function loadConfig(rawBrandName) {
  let brandName = normalizeBrandKey(rawBrandName);
  let path = configPath(brandName);

  try {
    let res = await fetch(path);

    // Nếu không tìm thấy file yêu cầu (404), tự động chuyển về brand mặc định thay vì báo lỗi đứng trang
    if (!res.ok) {
      console.warn(`Không tìm thấy file "${path}". Tự động nạp cấu hình mặc định "brand-vivoice"...`);
      let fallbackPath = configPath("brand-vivoice");
      let fallbackRes = await fetch(fallbackPath);
      if (!fallbackRes.ok) {
        throw new Error("Không tìm thấy file cấu hình: " + path);
      }
      let fallbackConfig = await fallbackRes.json();
      validateConfig(fallbackConfig);
      return fallbackConfig;
    }

    let config = await res.json();
    validateConfig(config);
    return config;
  } catch (err) {
    console.error("Lỗi khi nạp config:", err);
    // Cố gắng cứu vãn bằng cách nạp vivoice nếu chưa phải vivoice
    if (brandName !== "brand-vivoice") {
      try {
        let fbRes = await fetch(configPath("brand-vivoice"));
        if (fbRes.ok) {
          let fbConfig = await fbRes.json();
          validateConfig(fbConfig);
          return fbConfig;
        }
      } catch (e) { }
    }
    throw err;
  }
}

// Hàm kiểm tra cấu trúc file JSON
function validateConfig(config) {
  let requiredKeys = ["brand", "theme", "sections"];
  for (let i = 0; i < requiredKeys.length; i++) {
    let key = requiredKeys[i];
    if (config[key] === undefined) {
      throw new Error('File config thiếu phần bắt buộc: "' + key + '"');
    }
  }
}
