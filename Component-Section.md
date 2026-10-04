Trong tư duy phát triển trang web dạng **White Label** bằng Vanilla Stack (HTML/CSS/JS thuần), **Component** và **Section** được định nghĩa và tổ chức như sau:

---

### 1. Phân biệt Component và Section

- **Component (Khối thành phần nhỏ):**
  - Là khối giao diện độc lập được **viết một lần và tái sử dụng ở nhiều nơi**.
  - Gói sẵn cả HTML, CSS và JavaScript riêng của nó.
  - **Ví dụ:** Nút bấm (`<wl-button>`), thẻ thông tin/sản phẩm (`<wl-card>`), danh mục hỏi đáp (`<wl-faq>`).
- **Section (Khối nội dung lớn/trọn vẹn):**
  - Là một phần nội dung trọn vẹn của trang web, **mỗi Section thể hiện một ý cụ thể** và xếp nối tiếp từ trên xuống.
  - Mỗi Section được **ghép lại từ các Component** hoặc chứa các Component bên trong.
  - **Ví dụ:** Section Mở đầu (`<wl-hero>`), Section Lợi ích/Tính năng, Section Hỏi đáp (`<wl-faq>`), Section Chân trang (`<wl-footer>`).
- **Mối quan hệ:** Một trang web hoàn chỉnh là **tập hợp các Section xếp chồng lên nhau**; khi thay đổi dữ liệu cấu hình, cấu trúc cốt lõi của các Component và Section vẫn được giữ nguyên.

---

### 2. Cách viết Component & Section bằng Vanilla JS (Dùng Web Components)

Vì quy định cuộc thi **nghiêm cấm sử dụng các Framework** như React, Vue hay Angular, cách viết chuẩn và sạch nhất (`Clean Code`) để dễ bảo trì là sử dụng **Custom Elements (Web Components API)** có sẵn trong JavaScript thuần:

#### Bước 1: Viết Component (Ví dụ: `wl-card`)

Tạo một Component nhỏ đại diện cho thẻ thông tin/tính năng:

```javascript
// js/components/Card.js
class WlCard extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "";
    const desc = this.getAttribute("desc") || "";
    const icon = this.getAttribute("icon") || "🚀";

    this.innerHTML = `
      <div class="card-item p-6 bg-white rounded-xl shadow-md border border-gray-100">
        <div class="icon text-3xl mb-3">${icon}</div>
        <h3 class="font-bold text-xl mb-2 text-primary">${title}</h3>
        <p class="text-gray-600">${desc}</p>
      </div>
    `;
  }
}
customElements.define("wl-card", WlCard);
```

#### Bước 2: Viết Section (Ví dụ: `wl-hero`)

Tạo một Section lớn chứa các thông điệp mở đầu và nút bấm:

```javascript
// js/sections/Hero.js
class WlHero extends HTMLElement {
  connectedCallback() {
    const title = this.getAttribute("title") || "Tiêu đề mặc định";
    const subtitle = this.getAttribute("subtitle") || "";

    this.innerHTML = `
      <section class="hero-section py-16 text-center bg-gray-50">
        <div class="container mx-auto px-4">
          <h1 class="text-4xl font-extrabold mb-4 text-primary">${title}</h1>
          <p class="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">${subtitle}</p>
          <button class="btn-cta px-6 py-3 bg-primary text-white font-bold rounded-lg shadow-lg">
            Khám phá ngay
          </button>
        </div>
      </section>
    `;
  }
}
customElements.define("wl-hero", WlHero);
```

#### Bước 3: Lắp ráp các Section vào trang HTML

Trong file HTML (như `index.html`), bạn chỉ cần thả các thẻ Custom Element đã định nghĩa mà **không cần viết lại cấu trúc giao diện trùng lặp**:

```html
<!DOCTYPE html>
<html lang="vi">
  <head>
    <meta charset="UTF-8" />
    <link rel="stylesheet" href="css/base.css" />
  </head>
  <body>
    <!-- Thả các Section cần dùng -->
    <wl-header></wl-header>

    <main>
      <wl-hero id="hero-sec"></wl-hero>

      <section class="container mx-auto py-12 px-4">
        <div
          class="grid grid-cols-1 md:grid-cols-3 gap-6"
          id="features-container"
        >
          <!-- Các Component wl-card sẽ được render động tại đây -->
        </div>
      </section>
    </main>

    <wl-footer></wl-footer>

    <!-- Script nạp Component & Core -->
    <script src="js/components/Card.js"></script>
    <script src="js/sections/Hero.js"></script>
    <script src="js/core.js"></script>
  </body>
</html>
```

---

### 3. Kết nối với Cơ chế White Label (File JSON Config)

Yêu cầu cốt lõi của White Label là **tách biệt hoàn toàn dữ liệu hiển thị khỏi mã nguồn HTML/CSS/JS**. Toàn bộ bảng màu và font chữ đặt trong CSS variables, còn nội dung văn bản/hình ảnh được lưu trong file `JSON`. Script `core.js` có nhiệm vụ đọc file `JSON` và nạp thuộc tính vào các Component/Section:

- **Tệp cấu hình `data/brand-a.json`:**

  ```json
  {
    "name": "AI Solutions",
    "hero": {
      "title": "Nền tảng Quản trị AI Thông minh",
      "subtitle": "Tối ưu hóa quy trình tự động cho doanh nghiệp."
    },
    "features": [
      {
        "title": "Tự động hóa",
        "desc": "Tiết kiệm 80% thời gian xử lý",
        "icon": "⚡"
      },
      {
        "title": "Bảo mật cao",
        "desc": "Mã hóa dữ liệu chuẩn quốc tế",
        "icon": "🛡️"
      }
    ]
  }
  ```

- **Đoạn code `js/core.js` nạp dữ liệu động:**

  ```javascript
  async function loadBrandConfig(jsonPath) {
    const response = await fetch(jsonPath);
    const data = await response.json();

    // 1. Nạp dữ liệu vào Section Hero
    const heroEl = document.querySelector("wl-hero");
    if (heroEl) {
      heroEl.setAttribute("title", data.hero.title);
      heroEl.setAttribute("subtitle", data.hero.subtitle);
    }

    // 2. Render danh sách các Component Card
    const container = document.getElementById("features-container");
    if (container) {
      container.innerHTML = data.features
        .map(
          (f) =>
            `<wl-card title="${f.title}" desc="${f.desc}" icon="${f.icon}"></wl-card>`,
        )
        .join("");
    }
  }

  // Khởi chạy cấu hình cho thương hiệu A
  loadBrandConfig("data/brand-a.json");
  ```

---

**Điểm mấu chốt khi chấm thi:** Khi đổi sang `data/brand-b.json`, toàn bộ tên sản phẩm, thông điệp, hình ảnh và danh sách tính năng trên trang sẽ tự động thay đổi mà **không cần chỉnh sửa bất kỳ dòng mã HTML/CSS/JS gốc nào**.
