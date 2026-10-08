Theo quy định của cuộc thi năm nay, các đội thi bị cấm sử dụng tất cả các framework (ví dụ như React, Vue, Next.js, Tailwind,...)[1].

Cụ thể, các quy định kỹ thuật bắt buộc gồm:

Chỉ sử dụng Vanilla (nguyên bản): Bắt buộc viết mã nguồn bằng HTML, CSS và JavaScript thuần (Vanilla JS).
Thư viện được phép dùng: Chỉ được phép dùng các thư viện hỗ trợ trang trí/hiệu ứng (như thư viện icon, FontAwesome, hiệu ứng 3D, animation) chứ \*\*không được dùng framework.

---

Trong tư duy phát triển trang web dạng White Label bằng Vanilla Stack (HTML/CSS/JS thuần), Component và Section được định nghĩa và tổ chức như sau:

1. Phân biệt Component và Section
   Component (Khối thành phần nhỏ):
   Là khối giao diện độc lập được viết một lần và tái sử dụng ở nhiều nơi.
   Gói sẵn cả HTML, CSS và JavaScript riêng của nó.
   Ví dụ: Nút bấm (<wl-button>), thẻ thông tin/sản phẩm (<wl-card>), danh mục hỏi đáp (<wl-faq>).
   Section (Khối nội dung lớn/trọn vẹn):
   Là một phần nội dung trọn vẹn của trang web, mỗi Section thể hiện một ý cụ thể và xếp nối tiếp từ trên xuống.
   Mỗi Section được ghép lại từ các Component hoặc chứa các Component bên trong.
   Ví dụ: Section Mở đầu (<wl-hero>), Section Lợi ích/Tính năng, Section Hỏi đáp (<wl-faq>), Section Chân trang (<wl-footer>).
   Mối quan hệ: Một trang web hoàn chỉnh là tập hợp các Section xếp chồng lên nhau; khi thay đổi dữ liệu cấu hình, cấu trúc cốt lõi của các Component và Section vẫn được giữ nguyên.
2. Cách viết Component & Section bằng Vanilla JS (Dùng Web Components)
   Vì quy định cuộc thi nghiêm cấm sử dụng các Framework như React, Vue hay Angular, cách viết chuẩn và sạch nhất (Clean Code) để dễ bảo trì là sử dụng Custom Elements (Web Components API) có sẵn trong JavaScript thuần:

Bước 1: Viết Component (Ví dụ: wl-card)
Tạo một Component nhỏ đại diện cho thẻ thông tin/tính năng:

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
Bước 2: Viết Section (Ví dụ: wl-hero)
Tạo một Section lớn chứa các thông điệp mở đầu và nút bấm:

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
Bước 3: Lắp ráp các Section vào trang HTML
Trong file HTML (như index.html), bạn chỉ cần thả các thẻ Custom Element đã định nghĩa mà không cần viết lại cấu trúc giao diện trùng lặp:

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
3. Kết nối với Cơ chế White Label (File JSON Config)
Yêu cầu cốt lõi của White Label là tách biệt hoàn toàn dữ liệu hiển thị khỏi mã nguồn HTML/CSS/JS. Toàn bộ bảng màu và font chữ đặt trong CSS variables, còn nội dung văn bản/hình ảnh được lưu trong file JSON. Script core.js có nhiệm vụ đọc file JSON và nạp thuộc tính vào các Component/Section:

Tệp cấu hình data/brand-a.json:

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
Đoạn code js/core.js nạp dữ liệu động:

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
Điểm mấu chốt khi chấm thi: Khi đổi sang data/brand-b.json, toàn bộ tên sản phẩm, thông điệp, hình ảnh và danh sách tính năng trên trang sẽ tự động thay đổi mà không cần chỉnh sửa bất kỳ dòng mã HTML/CSS/JS gốc nào.

---

Header Section () Nội dung: Logo thương hiệu, menu điều hướng nhanh đến các phần trên trang (Features, Pricing, FAQ) và 1 nút CTA phụ (ví dụ: "Đăng nhập" hoặc "Dùng thử"). Vai trò: Định vị thương hiệu ngay lập tức và giúp người dùng di chuyển mượt mà trên trang .
Hero Section () — Section quan trọng nhất Nội dung: Thông điệp chính (Main Headline) gây ấn tượng mạnh ngay đầu màn hình, câu mô tả giải pháp ngắn gọn (Sub-headline), hình ảnh/mô phỏng sản phẩm bắt mắt và nút kêu gọi hành động lớn (CTA - ví dụ: "Khám phá ngay", "Đăng ký trải nghiệm") . Vai trò: Nêu rõ vấn đề & giải pháp trong 3 giây đầu tiên để giữ chân người dùng .
Benefits & Features Section (Lợi ích & Tính năng nổi bật) Nội dung: Sử dụng danh sách các thẻ Component Card () để trình bày 3–6 tính năng hoặc lợi ích cốt lõi của sản phẩm . Trình bày: Ưu tiên nhiều hình ảnh/biểu tượng (icon)/animation, ít chữ .
Showcase / Demonstration Section (Trình diễn Sản phẩm) Nội dung: Hình ảnh minh họa chi tiết, video/hiệu ứng tương tác hoặc mô phỏng cách sản phẩm công nghệ vận hành thực tế . Vai trò: Cho người dùng thấy được giá trị trực quan của giải pháp.
Social Proof / Numbers Section (Bằng chứng uy tín) Nội dung: Các con số ấn tượng (ví dụ: 10,000+ người tin dùng, 99.9% Uptime), logo đối tác hoặc phản hồi (Testimonials) từ khách hàng giả tưởng. Vai trò: Xây dựng niềm tin (Trust) cho thương hiệu.
Pricing / Plans Section (Bảng giá & Chi tiết gói dịch vụ) Nội dung: Các cột bảng giá (Gói Miễn phí, Pro, Enterprise...) so sánh tính năng và nút chọn mua/đăng ký cho từng gói.
FAQ Section () — Thắc mắc thường gặp Nội dung: Khối dạng danh sách thả xuống (Accordion) giải đáp 4–5 câu hỏi phổ biến nhất về chính sách, cách dùng hoặc hỗ trợ .
Final CTA Section (Kêu gọi hành động chốt hạ) Nội dung: Khối nội dung nổi bật ở cuối trang lặp lại thông điệp chính kèm form nhập Email hoặc nút bấm CTA lớn . Vai trò: Kích thích người dùng thực hiện hành động (đăng ký/mua) trước khi rời trang .
Footer Section () Nội dung: Thông tin liên hệ của doanh nghiệp giả tưởng, bản quyền (Copyright), các liên kết phụ và mạng xã hội .

---

Cơ chế White Label là một trong những tiêu chí chấm điểm chính của cuộc thi (đặc biệt ở Vòng loại)[1]. Mặc dù Ban tổ chức không đưa ra con số phần trăm điểm số cụ thể trong buổi sinh hoạt[1], tiêu chí này được Ban giám khảo đánh giá qua các mức độ hoàn thiện kỹ thuật và tiêu chí sau:

1. Phân mức Độ Hoàn thiện Kỹ thuật White Label
   Mức cơ bản (Yêu cầu tối thiểu): Trang web đọc dữ liệu từ file cấu hình (JSON hoặc CSS)[2] và tự động thay đổi động các thành phần cơ bản: tên thương hiệu, logo, màu sắc, phông chữ, hình ảnh và nội dung văn bản[3].
   Mức nâng cao (Đánh giá cao & Tối ưu điểm số):
   Cho phép \*\*thay đổi thứ tự hiển thị các khối (Section/Component) hoặc thêm/bớt các khối nội dung và trang mới thông qua cấu hình[3].
   Cho phép tùy chỉnh sâu về bố cục (layout) của từng phần (ví dụ: chuyển đổi bố cục căn trái/căn phải tùy theo doanh nghiệp)[3].
2. Tiêu chí Clean Code & Tổ chức Mã nguồn
   Ban giám khảo chấm điểm dựa trên khả năng tổ chức mã nguồn sạch (Clean Code)[1].
   Mã nguồn phải được chia nhỏ thành các Component (khối giao diện độc lập như button, header, footer) và Section (khối nội dung lớn chứa các component)[4][5].
   Cấu trúc code phải dễ đọc, dễ bảo trì, giúp người khác khi nhìn vào có thể dễ dàng hiểu và chỉnh sửa file cấu hình để phát sinh trang web mới[1].
3. Điểm cộng Tích hợp AI (Demo Trực tiếp, hiện tại chưa code bây giờ)
   Thay vì chỉ chuẩn bị sẵn 3 file cấu hình cố định, nếu đội thi xây dựng giao diện nhập liệu (Form/Chatbot) cho người dùng -> gọi API AI (như Google Gemini API) tự động tạo file cấu hình -> sinh ra ngay một giao diện landing page mới trực tiếp trên sân khấu, đội thi sẽ nhận được điểm cộng rất lớn.
