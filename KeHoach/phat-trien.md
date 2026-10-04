### 1\. Những thứ ĐƯỢC PHÉP LÀM (Permitted Stack)

- **Công nghệ nền tảng:** Sử dụng **Vanilla Stack** gồm HTML, CSS, và JavaScript thuần .
- **Thư viện tiện ích (Utility/Tooling Libraries):**
  - CSS Utilities như Tailwind CSS bản gốc .
  - Thư viện Icon (FontAwesome, Lucide...), hiệu ứng 3D/Animation như GSAP, Three.js, AOS .
  - Sử dụng API gọi trực tiếp từ trình duyệt (`fetch`, `XMLHttpRequest`) .
- **Cấu trúc mã nguồn &amp; Kiến trúc:**
  - Tách biệt hoàn toàn giữa dữ liệu cấu hình (`JSON`, `CSS Variables`) và giao diện hiển thị .
  - Chia nhỏ giao diện thành các `Component` và `Section` độc lập, có thể tái sử dụng .
- **Sử dụng AI hỗ trợ:** Được phép dùng AI để lập kế hoạch, viết nội dung, lên ý tưởng hiệu ứng, hỗ trợ sửa lỗi hoặc tạo file cấu hình — miễn là đội thi nắm vững và **giải thích được toàn bộ mã nguồn** .
- **Tài nguyên tham khảo:** Được tham khảo ý tưởng/mã nguồn từ bên ngoài (nhưng phải tự viết lại) và sử dụng tài nguyên hình ảnh miễn phí có bản quyền hợp lệ (như Unsplash) .

---

### 2\. Những thứ KHÔNG ĐƯỢC PHÉP LÀM &amp; VI PHẠM (Prohibited &amp; Penalties)

| Hành vi vi phạm                                                                                                                                       | Mức phạt / Xử lý                                                            |
| ----------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| **Dùng Frontend Framework** (React, Vue, Angular, Svelte...) hoặc **UI Kit dựng sẵn** (Bootstrap, DaisyUI, Tailwind UI, Flowbite, MUI, Ant Design...) | **Trừ 20 điểm** (Nếu dựng toàn bộ trên UI kit: **Bị loại khỏi cuộc thi**) . |
| **Dùng công cụ cần build/biên dịch** (Node.js build step, Webpack, Vite...) hoặc **tự viết Backend**                                                  | **Không hợp lệ** theo quy định công nghệ .                                  |
| **Dùng thương hiệu thật** thay vì doanh nghiệp giả tưởng                                                                                              | **Trừ 10 điểm** .                                                           |
| **Sao chép &gt; 60%** giao diện/mã nguồn của đội khác hoặc dự án có sẵn                                                                               | **Loại khỏi cuộc thi** .                                                    |
| **Dùng AI sinh code nhưng không giải thích được** khi BGK hỏi (từ 2/3 đoạn code trở lên)                                                              | **0 điểm tiêu chí AI** (Nếu hoàn toàn không giải thích được: **Bị loại**) . |
| **Báo cáo dùng AI không trung thực** / Mâu thuẫn với lịch sử Git commit                                                                               | **Trừ 15 điểm** .                                                           |
| Thành viên **không có lịch sử đóng góp (commit) trên Git**                                                                                            | **Trừ toàn bộ điểm Teamwork** của đội .                                     |
| **Tài nguyên lậu, crack** hoặc không có bản quyền hợp lệ                                                                                              | **Cảnh cáo** (Tái phạm: **Trừ 10 điểm** &amp; buộc gỡ bỏ) .                 |
| **Nộp bài trễ hạn**                                                                                                                                   | **Trừ 5 điểm / mỗi 30 phút** (Trễ quá 2 giờ: Không nhận bài) .              |

---

### 3\. Những thứ KHUYẾN KHÍCH MỞ RỘNG (Điểm cộng lớn với BGK)

- **Tích hợp AI tương tác trực tiếp (Live AI Generation):**
  - Tích hợp gọi API AI (như Gemini/OpenAI API) trực tiếp trên giao diện trình duyệt .
  - _Ví dụ nâng cao:_ Dựng một khung Chatbot hoặc Form nhập liệu đơn giản, cho phép người dùng/BGK nhập yêu cầu -&gt; Gọi AI tự động sinh file cấu hình `JSON` mới -&gt; **Cập nhật ngay giao diện Landing Page mới trực tiếp lúc demo** mà không cần sửa code tay .
- **Cơ chế White Label nâng cao (Dynamic Layout):**
  - Không chỉ đổi tên, logo, màu sắc hay font chữ , mà tệp `JSON` còn có thể điều khiển **thứ tự ẩn/hiện, sắp xếp lại vị trí các** **Section** hoặc căn chỉnh vị trí `Component` trên trang .
- **Trải nghiệm UX/UI &amp; Animation chuyển động:**
  - Đầu tư hiệu ứng cuộn/tương tác mượt mà bằng GSAP/Three.js (sáng tạo, có chủ đích, không bị "AI slop" rập khuôn) .
  - Tối ưu hiển thị Responsive hoàn hảo trên cả 3 thiết bị: Laptop, Tablet, và Mobile .
- **Quy trình Git &amp; Clean Code chuẩn chỉnh:**
  - Code đóng gói gọn gàng, chia file rõ ràng và tất cả thành viên trong đội đều có lịch sử commit đồng đều trên GitHub .
