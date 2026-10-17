// ============================================================================
// Chatbot.js — Trợ lý AI Sáng tạo Thương hiệu White Label (AI Brand Architect)
// Tích hợp Google Gemini 2.5 Flash + Unsplash Image Engine
// Tuân thủ nghiêm ngặt BRAND_GENERATOR_POLICY.md:
// - Tuyệt đối không can thiệp, không sửa đổi mã nguồn cốt lõi (index.html, css, js).
// - Chỉ tạo dữ liệu cấu hình JSON thương hiệu mới theo đúng chuẩn Schema.
// - Hỗ trợ tải file về máy và xem trước trực tiếp trên giao diện (Live Preview).
// ============================================================================

import { esc } from "../core/esc.js";
import { audioState } from "../core/audio-state.js";
import { applyTheme } from "../theme.js";
import { renderSite } from "../render.js";

// API Key Gemini dự phòng (đồng bộ từ .env, có thể ghi đè qua LocalStorage hoặc file .env)
const FALLBACK_GEMINI_KEY = "AQ.Ab8RN6J0d5p6OzQk7kHiSg_MNOtooYHRRKeJQIdiNwq1IcFpPw";
let DEFAULT_GEMINI_KEY = FALLBACK_GEMINI_KEY;

// Hàm đọc Gemini Key an toàn từ file .env hoặc LocalStorage
async function loadEnvGeminiKey() {
  // 1. Thử lấy từ LocalStorage nếu người dùng đã cấu hình riêng
  try {
    const stored = localStorage.getItem("viv_gemini_key");
    if (stored && stored.trim()) {
      DEFAULT_GEMINI_KEY = stored.trim();
      return DEFAULT_GEMINI_KEY;
    }
  } catch (e) { }

  // 2. Thử đọc từ file .env (hỗ trợ qua Live Server / Local Web Server)
  try {
    const res = await fetch(".env");
    if (res.ok) {
      const text = await res.text();
      const match = text.match(
        /(?:DEFAULT_GEMINI_KEY|GEMINI_API_KEY)\s*=\s*([^;\r\n]+)/,
      );
      if (match && match[1]) {
        const envKey = match[1]
          .trim()
          .replace(/^["']|["'];?$/g, "")
          .replace(/;$/, "");
        if (envKey) {
          DEFAULT_GEMINI_KEY = envKey;
          localStorage.setItem("viv_gemini_key", envKey);
          return envKey;
        }
      }
    }
  } catch (err) {
    // Không thể đọc .env (ví dụ mở trực tiếp qua file://), sẽ dùng FALLBACK_GEMINI_KEY
  }

  return DEFAULT_GEMINI_KEY || FALLBACK_GEMINI_KEY;
}

// ============================================================================
// NẠP PROMPT TỪ FILE PROMPT.MD BÊN NGOÀI (CÓ CACHE VÀ SAFE FALLBACK)
// ============================================================================
let cachedPromptTemplate = null;

const FALLBACK_PROMPT_TEMPLATE = `# AI Brand Architect Prompt Template - White Label 2.0

Bạn là Trợ lý AI Brand Architect hàng đầu cho nền tảng White Label 2.0.
Nhiệm vụ: Dựa trên yêu cầu của người dùng, tạo một đối tượng JSON cấu hình thương hiệu hoàn chỉnh 100% bằng tiếng Việt và phù hợp với mọi ngành nghề (F&B/Ẩm thực/Trà sữa/Bánh, Y tế/Nha khoa/Clinic, Giáo dục/EdTech, Thời trang/Luxury/Spa, Game/Metaverse, Công nghệ/SaaS/Voice AI, Bất động sản, Vận tải/Logistics, Thể thao/Fitness...).

## QUY TẮC THIẾT KẾ & PHỐI MÀU (COLOR THEORY)
- Tự động phối bảng màu thương hiệu chuẩn nhận diện dựa vào ngành nghề và yêu cầu người dùng:
  + Công nghệ / SaaS: Xanh cyan (#06b6d4, #10b981, nền #030c14, surface #071c2e)
  + F&B / Bakery / Cafe: Hổ phách / Nâu ấm (#f59e0b, #d97706, nền #1c1208, surface #2d1d0e)
  + Y tế / Nha khoa: Xanh ngọc y tế (#06b6d4, #0284c7, nền #04151f, surface #082738)
  + Thời trang / Luxury / Spa: Vàng đồng / Rose (#e2b17a, #f43f5e, nền #0f0d0e, surface #1e191a)
  + Giáo dục / EdTech: Tím sáng / Cam (#8b5cf6, #f59e0b, nền #0c071e, surface #180d38)
  + Sinh thái / Organic: Xanh lá mạ / Ngọc lục bảo (#22c55e, #14b8a6, nền #021a12, surface #052e22)
- ĐẶC BIỆT LƯU Ý ĐỘ TƯƠNG PHẢN: Nền tối (Dark Mode) sang trọng, dễ nhìn; màu chữ text và textMuted phải tương phản cao, TUYỆT ĐỐI không để chữ bị chìm hoặc khó đọc. Không dùng nền màu trắng tinh hoặc surface quá sáng đối chọi với nền tối.

## KHO ẢNH 4K UNSPLASH CHUẨN XÁC THEO CHỦ ĐỀ
- Ảnh 1: {{PHOTO_1}}
- Ảnh 2: {{PHOTO_2}}
- Ảnh 3: {{PHOTO_3}}
- Ảnh 4: {{PHOTO_4}}
- Ảnh 5: {{PHOTO_5}}

## CẤU TRÚC JSON SCHEMA BẮT BUỘC TUÂN THỦ:
\`\`\`json
{
  "brand": {
    "name": "Tên thương hiệu",
    "slogan": "Khẩu hiệu ngắn gọn ấn tượng"
  },
  "topic": "{{TOPIC}}",
  "theme": {
    "primary": "#Mã_màu_chính",
    "accent": "#Mã_màu_nhấn",
    "background": "#Mã_màu_nền_tối",
    "surface": "#Mã_màu_bề_mặt_thẻ",
    "text": "#Mã_màu_chữ_chính",
    "textMuted": "#Mã_màu_chữ_phụ",
    "fontHeading": "Space Grotesk hoặc Playfair Display hoặc Plus Jakarta Sans",
    "fontBody": "Be Vietnam Pro",
    "radius": "16px"
  },
  "sections": [
    {
      "type": "hero",
      "layout": "centered hoặc split-right hoặc voice-studio",
      "welcomeMessage": "Chào mừng...",
      "title": "Tiêu đề chính...",
      "rotatingWords": ["từ xoay 1", "từ xoay 2", "từ xoay 3"],
      "subtitle": "Mô tả hấp dẫn...",
      "buttons": [
        { "href": "#features", "label": "Khám phá ngay", "style": "primary" },
        { "href": "#contact", "label": "Liên hệ đặt lịch", "style": "secondary" }
      ]
    },
    {
      "type": "features",
      "layout": "bento hoặc 3d-stack",
      "title": "Tiêu đề danh mục tính năng / sản phẩm",
      "subtitle": "Mô tả phụ...",
      "items": [
        {
          "badge": "01 / ĐIỂM NHẤN",
          "icon": "fa-solid fa-sparkles",
          "title": "Tên tính năng / sản phẩm 1",
          "desc": "Mô tả chi tiết 1",
          "text": "Mô tả chi tiết 1",
          "image": "{{PHOTO_1}}"
        },
        {
          "badge": "02 / ĐIỂM NHẤN",
          "icon": "fa-solid fa-check",
          "title": "Tên tính năng / sản phẩm 2",
          "desc": "Mô tả chi tiết 2",
          "text": "Mô tả chi tiết 2",
          "image": "{{PHOTO_2}}"
        },
        {
          "badge": "03 / ĐIỂM NHẤN",
          "icon": "fa-solid fa-heart",
          "title": "Tên tính năng / sản phẩm 3",
          "desc": "Mô tả chi tiết 3",
          "text": "Mô tả chi tiết 3",
          "image": "{{PHOTO_3}}"
        },
        {
          "badge": "04 / ĐIỂM NHẤN",
          "icon": "fa-solid fa-star",
          "title": "Tên tính năng / sản phẩm 4",
          "desc": "Mô tả chi tiết 4",
          "text": "Mô tả chi tiết 4",
          "image": "{{PHOTO_4}}"
        }
      ]
    },
    {
      "type": "about",
      "layout": "grid hoặc sticky-story",
      "eyebrow": "VỀ CHÚNG TÔI",
      "title": "Câu chuyện thương hiệu...",
      "image": "{{PHOTO_5}}",
      "paragraphs": [
        "Đoạn văn 1 giới thiệu sứ mệnh và tầm nhìn...",
        "Đoạn văn 2 cam kết chất lượng và giá trị mang lại..."
      ],
      "stats": [
        { "value": "10,000+", "label": "Khách hàng" },
        { "value": "99.8%", "label": "Hài lòng" },
        { "value": "24/7", "label": "Phục vụ" }
      ],
      "badge": { "icon": "fa-solid fa-award", "value": "Top 1", "label": "Chất lượng" }
    },
    {
      "type": "testimonials",
      "layout": "marquee",
      "title": "Khách hàng nói gì về chúng tôi",
      "subtitle": "Những phản hồi chân thực từ đối tác và khách hàng.",
      "eyebrow": "ĐÁNH GIÁ CHÂN THỰC",
      "items": [
        { "name": "Nguyễn Văn A", "role": "Khách hàng thân thiết", "quote": "Trải nghiệm dịch vụ tuyệt vời...", "stars": 5 },
        { "name": "Trần Thị B", "role": "Đối tác doanh nghiệp", "quote": "Chất lượng sản phẩm vượt trội...", "stars": 5 }
      ]
    },
    {
      "type": "faq",
      "layout": "accordion hoặc 3d-flip-cards",
      "title": "Câu hỏi thường gặp",
      "subtitle": "Giải đáp các thắc mắc phổ biến",
      "items": [
        { "id": "faq-1", "question": "Câu hỏi 1?", "answer": "Giải đáp chi tiết 1" },
        { "id": "faq-2", "question": "Câu hỏi 2?", "answer": "Giải đáp chi tiết 2" }
      ]
    },
    {
      "type": "contact",
      "title": "Kết nối cùng thương hiệu",
      "channels": [
        { "label": "Hotline", "value": "1900 6868" },
        { "label": "Email", "value": "teamktv8386@gmail.com" },
        { "label": "Địa chỉ", "value": "Hà Nội / TP.HCM" }
      ],
      "formTitle": "Để lại thông tin tư vấn",
      "formButton": "Gửi thông tin ngay"
    }
  ]
}
\`\`\`

## RÀNG BUỘC BẮT BUỘC (STRICT POLICY):
1. BẮT BUỘC giữ nguyên các tên thuộc tính (keys) bằng tiếng Anh chuẩn xác: brand, theme, sections, type, layout, items, v.v. TUYỆT ĐỐI không dịch tên thuộc tính sang tiếng Việt.
2. TUYỆT ĐỐI KHÔNG sinh trường 'favicon' hay 'logo' trong đối tượng 'brand' (hệ thống White Label 2.0 tự động render typography logo vector chuẩn).
3. CHỈ TRẢ VỀ DUY NHẤT ĐỐI TƯỢNG JSON HỢP LỆ, KHÔNG CHỨA BẤT KỲ KÝ TỰ NÀO NGOÀI JSON, KHÔNG BỌC TRONG BẤT KỲ ĐOẠN VĂN MỞ ĐẦU/KẾT THÚC NÀO.
4. Toàn bộ nội dung văn bản (values) viết bằng tiếng Việt tự nhiên, phù hợp sâu sắc với ngành nghề được yêu cầu.
5. Gán chính xác các liên kết ảnh 4K Unsplash đã cung cấp ở trên vào từng mục 'image'. TUYỆT ĐỐI không sinh link chứa dấu ba chấm '...' hoặc link ảnh không tồn tại.

---
YÊU CẦU THƯƠNG HIỆU CỤ THỂ CỦA NGƯỜI DÙNG:
"{{USER_PROMPT}}"`;

export async function loadPromptTemplate() {
  // Thử tải trực tiếp từ file prompt.md bên ngoài
  try {
    const res = await fetch("prompt.md?t=" + Date.now());
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 50) {
        cachedPromptTemplate = text.trim();
        return cachedPromptTemplate;
      }
    }
  } catch (e) { }

  // Thử tải từ config/prompt.md nếu prompt.md được đặt trong thư mục config
  try {
    const res = await fetch("config/prompt.md?t=" + Date.now());
    if (res.ok) {
      const text = await res.text();
      if (text && text.trim().length > 50) {
        cachedPromptTemplate = text.trim();
        return cachedPromptTemplate;
      }
    }
  } catch (e) { }

  return cachedPromptTemplate || FALLBACK_PROMPT_TEMPLATE;
}

export function interpolatePrompt(template, { topic, photos = [], userPrompt = "" }) {
  let prompt = template || FALLBACK_PROMPT_TEMPLATE;

  const photo1 = photos[0] || "";
  const photo2 = photos[1] || "";
  const photo3 = photos[2] || "";
  const photo4 = photos[3] || "";
  const photo5 = photos[4] || photo1;

  prompt = prompt
    .replace(/\{\{TOPIC\}\}/g, topic || "tech")
    .replace(/\{\{TOPIC_HINT\}\}/g, topic || "tech")
    .replace(/\{\{PHOTO_1\}\}/g, photo1)
    .replace(/\{\{PHOTO_2\}\}/g, photo2)
    .replace(/\{\{PHOTO_3\}\}/g, photo3)
    .replace(/\{\{PHOTO_4\}\}/g, photo4)
    .replace(/\{\{PHOTO_5\}\}/g, photo5)
    .replace(/\{\{PHOTO_0\}\}/g, photo1);

  if (prompt.includes("{{USER_PROMPT}}")) {
    prompt = prompt.replace(/\{\{USER_PROMPT\}\}/g, userPrompt);
  } else {
    prompt = `${prompt}\n\nYêu cầu thương hiệu cụ thể của người dùng:\n"${userPrompt}"`;
  }

  return prompt;
}

// ============================================================================
// KHO ẢNH CHUYÊN NGÀNH CHẤT LƯỢNG CAO 4K (UNSPLASH TOPIC ASSETS)
// Tự động gán cho từng ngành nghề bất kỳ khi tạo thương hiệu
// ============================================================================
const TOPIC_IMAGES = {
  video: [
    "https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1536240478700-b869070f9279?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518173946687-a4c8a383392e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522869635100-9f4c5e86aa37?auto=format&fit=crop&w=1200&q=80",
  ],
  gaming: [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563089145-599997674d42?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534423861386-85a16f5d13fd?auto=format&fit=crop&w=1200&q=80",
  ],
  kiosk: [
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
  ],
  edtech: [
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1532012164546-f432f2e3edd4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513258496099-48168024aec0?auto=format&fit=crop&w=1200&q=80",
  ],
  callcenter: [
    "https://images.unsplash.com/photo-1549923746-c502d488b3ea?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1521791136064-7986c2920216?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1556745753-b2904692b3cd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534536281715-e28d76689b4d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=1200&q=80",
  ],
  bakery: [
    "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578985545062-69928b1d9587?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511018556340-d16986a1c194?auto=format&fit=crop&w=1200&q=80",
  ],
  coffee: [
    "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1447933601403-0c6688de566e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1509785307050-d4066910ec1e?auto=format&fit=crop&w=1200&q=80",
  ],
  dental: [
    "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598256989800-fe5f95da9787?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1609840114035-3c981b782dfe?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?auto=format&fit=crop&w=1200&q=80",
  ],
  medical: [
    "https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584515979956-d9f6e5d09982?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1532938911079-1b06ac7ceec7?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512678080530-7760d81faba6?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1579684385127-1ef15d508118?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583912267670-6575ad362483?auto=format&fit=crop&w=1200&q=80",
  ],
  finance: [
    "https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1559526324-4b87b5e36e44?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=1200&q=80",
  ],
  fashion: [
    "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1479064555552-3ef4979f8908?auto=format&fit=crop&w=1200&q=80",
  ],
  fitness: [
    "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=1200&q=80",
  ],
  realestate: [
    "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
  ],
  logistics: [
    "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1519003722824-194d4455a60c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1494412574643-ff11b0a5c1c3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1580674684081-7617fbf3d745?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1506015391300-4802dc74de2e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=80",
  ],
  cyber: [
    "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1510511459019-5dda7724fd87?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504639725590-34d0984388bd?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1510915361894-db8b60106cb1?auto=format&fit=crop&w=1200&q=80",
  ],
  data: [
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80",
  ],
  pet: [
    "https://images.unsplash.com/photo-1543466835-00a7907e9de1?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1537151608828-ea2b11777ee8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1548767797-d8c844163c4c?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1450778869180-41d0601e046e?auto=format&fit=crop&w=1200&q=80",
  ],
  hotel: [
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1571896349842-33c89424de2d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=1200&q=80",
  ],
  eco: [
    "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1518531933037-91b2f5f229cc?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
  ],
  audio: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80",
  ],
  tech: [
    "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1531403009284-440f080d1e12?auto=format&fit=crop&w=1200&q=80",
    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1200&q=80",
  ],
};

// Hàm gán ảnh thông minh theo ngữ cảnh từ khóa
function resolveTopicImages(topicKey = "tech") {
  const key = (topicKey || "tech").toLowerCase();

  // 1. F&B - Bánh ngọt, Trà sữa, Ẩm thực, Quán ăn, Đồ uống
  if (
    key.includes("bánh") ||
    key.includes("bakery") ||
    key.includes("trà sữa") ||
    key.includes("boba") ||
    key.includes("ẩm thực") ||
    key.includes("nhà hàng") ||
    key.includes("quán ăn") ||
    key.includes("food") ||
    key.includes("fnb") ||
    key.includes("món ăn") ||
    key.includes("tiệm bánh") ||
    key.includes("đồ ăn") ||
    key.includes("bonappetit")
  ) {
    return TOPIC_IMAGES.bakery;
  }

  // 2. Coffee, Cà phê, Quán nước
  if (
    key.includes("cà phê") ||
    key.includes("coffee") ||
    key.includes("cafe") ||
    key.includes("pha chế") ||
    key.includes("espresso")
  ) {
    return TOPIC_IMAGES.coffee;
  }

  // 3. Thời trang, Luxury, Spa, Làm đẹp, Mỹ phẩm
  if (
    key.includes("thời trang") ||
    key.includes("fashion") ||
    key.includes("luxury") ||
    key.includes("quần áo") ||
    key.includes("may mặc") ||
    key.includes("spa") ||
    key.includes("mỹ phẩm") ||
    key.includes("làm đẹp") ||
    key.includes("beauty") ||
    key.includes("trang sức") ||
    key.includes("nước hoa") ||
    key.includes("luxeaura")
  ) {
    return TOPIC_IMAGES.fashion;
  }

  // 4. Nha khoa, Răng hàm mặt
  if (
    key.includes("nha khoa") ||
    key.includes("dental") ||
    key.includes("răng") ||
    key.includes("niềng răng") ||
    key.includes("nụ cười")
  ) {
    return TOPIC_IMAGES.dental;
  }

  // 5. Y tế, Bác sĩ, Bệnh viện, Phòng khám, Sức khỏe
  if (
    key.includes("y tế") ||
    key.includes("bệnh") ||
    key.includes("bác sĩ") ||
    key.includes("medical") ||
    key.includes("clinic") ||
    key.includes("phòng khám") ||
    key.includes("thuốc") ||
    key.includes("dược") ||
    key.includes("sức khỏe")
  ) {
    return TOPIC_IMAGES.medical;
  }

  // 6. Giáo dục, Khóa học, Trường học, EdTech, Sách
  if (
    key.includes("edu") ||
    key.includes("giáo") ||
    key.includes("học") ||
    key.includes("sách") ||
    key.includes("ngoại ngữ") ||
    key.includes("tiếng anh") ||
    key.includes("trường") ||
    key.includes("khóa học") ||
    key.includes("đào tạo") ||
    key.includes("eduspeak")
  ) {
    return TOPIC_IMAGES.edtech;
  }

  // 7. Thể thao, Gym, Fitness, Yoga
  if (
    key.includes("fitness") ||
    key.includes("gym") ||
    key.includes("thể thao") ||
    key.includes("yoga") ||
    key.includes("workout") ||
    key.includes("thể hình")
  ) {
    return TOPIC_IMAGES.fitness;
  }

  // 8. Bất động sản, Nhà đất, Căn hộ
  if (
    key.includes("bất động sản") ||
    key.includes("nhà đất") ||
    key.includes("căn hộ") ||
    key.includes("chung cư") ||
    key.includes("biệt thự") ||
    key.includes("realestate") ||
    key.includes("property")
  ) {
    return TOPIC_IMAGES.realestate;
  }

  // 9. Vận chuyển, Giao hàng, Logistics, Kho vận
  if (
    key.includes("logistics") ||
    key.includes("vận chuyển") ||
    key.includes("giao hàng") ||
    key.includes("kho vận") ||
    key.includes("chuyển phát") ||
    key.includes("ship")
  ) {
    return TOPIC_IMAGES.logistics;
  }

  // 10. Khách sạn, Resort, Du lịch, Nghỉ dưỡng
  if (
    key.includes("khách sạn") ||
    key.includes("hotel") ||
    key.includes("resort") ||
    key.includes("du lịch") ||
    key.includes("nghỉ dưỡng") ||
    key.includes("tour") ||
    key.includes("homestay")
  ) {
    return TOPIC_IMAGES.hotel;
  }

  // 11. Thú cưng, Thú y
  if (
    key.includes("thú cưng") ||
    key.includes("pet") ||
    key.includes("chó") ||
    key.includes("mèo") ||
    key.includes("thú y")
  ) {
    return TOPIC_IMAGES.pet;
  }

  // 12. Nông nghiệp, Môi trường, Sinh thái, Hữu cơ
  if (
    key.includes("nông nghiệp") ||
    key.includes("môi trường") ||
    key.includes("sinh thái") ||
    key.includes("hữu cơ") ||
    key.includes("organic") ||
    key.includes("eco") ||
    key.includes("cây trồng") ||
    key.includes("xanh")
  ) {
    return TOPIC_IMAGES.eco;
  }

  // 13. Game, Metaverse, Thể thao điện tử
  if (
    key.includes("game") ||
    key.includes("gaming") ||
    key.includes("npc") ||
    key.includes("metaverse") ||
    key.includes("vũ trụ") ||
    key.includes("cybertone") ||
    key.includes("esport") ||
    key.includes("vr")
  ) {
    return TOPIC_IMAGES.gaming;
  }

  // 14. Video, Phim ảnh, Lồng tiếng, Thuyết minh
  if (
    key.includes("video") ||
    key.includes("clip") ||
    key.includes("lồng tiếng") ||
    key.includes("thuyết minh") ||
    key.includes("phim") ||
    key.includes("media")
  ) {
    return TOPIC_IMAGES.video;
  }

  // 15. CSKH, Tổng đài, Call Center
  if (
    key.includes("cskh") ||
    key.includes("tổng đài") ||
    key.includes("call") ||
    key.includes("hotline") ||
    key.includes("khách hàng") ||
    key.includes("omniclarity")
  ) {
    return TOPIC_IMAGES.callcenter;
  }

  // 16. Tài chính, Ngân hàng, Đầu tư, Fintech
  if (
    key.includes("tài chính") ||
    key.includes("ngân hàng") ||
    key.includes("finance") ||
    key.includes("đầu tư") ||
    key.includes("chứng khoán") ||
    key.includes("fintech") ||
    key.includes("tiền")
  ) {
    return TOPIC_IMAGES.finance;
  }

  // 17. Âm thanh, Voice, Giọng nói, Podcast
  if (
    key.includes("âm thanh") ||
    key.includes("giọng") ||
    key.includes("voice") ||
    key.includes("audio") ||
    key.includes("podcast") ||
    key.includes("nhạc")
  ) {
    return TOPIC_IMAGES.audio;
  }

  // 18. Kiosk, Trợ lý thông minh
  if (
    key.includes("kiosk") ||
    key.includes("trợ lý") ||
    key.includes("echomind") ||
    key.includes("assistant") ||
    key.includes("điều khiển")
  ) {
    return TOPIC_IMAGES.kiosk;
  }

  // Khớp theo tên nhóm danh mục trực tiếp
  for (const t of Object.keys(TOPIC_IMAGES)) {
    if (key.includes(t)) {
      return TOPIC_IMAGES[t];
    }
  }
  return TOPIC_IMAGES.tech;
}

// Hàm xáo trộn và phân phối ảnh độc bản không trùng lặp cho từng thương hiệu
export function getDiverseBrandPhotos(topicKey = "tech", seedString = "") {
  let pool = resolveTopicImages(topicKey);
  if (!Array.isArray(pool) || pool.length === 0) {
    pool = TOPIC_IMAGES.tech;
  }

  let shuffled = [...pool];

  // Tính toán seed dựa trên tên thương hiệu
  let seed = 0;
  let str = (seedString || "Brand") + "-" + (topicKey || "tech");
  for (let i = 0; i < str.length; i++) {
    seed = (seed << 5) - seed + str.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  // Thuật toán xáo trộn Fisher-Yates có định hướng
  for (let i = shuffled.length - 1; i > 0; i--) {
    let j = (seed + i * 23 + 11) % (i + 1);
    let temp = shuffled[i];
    shuffled[i] = shuffled[j];
    shuffled[j] = temp;
  }

  return shuffled;
}

// Bảng màu mặc định dự phòng chuẩn theo tâm lý màu sắc chuyên ngành
const BRAND_PALETTES = {
  cyber: {
    primary: "#10b981",
    accent: "#06b6d4",
    background: "#030c14",
    surface: "#071c2e",
    text: "#ecfeff",
    textMuted: "#64748b",
  },
  data: {
    primary: "#6366f1",
    accent: "#38bdf8",
    background: "#05071a",
    surface: "#0c1133",
    text: "#f8fafc",
    textMuted: "#94a3b8",
  },
  creative: {
    primary: "#f43f5e",
    accent: "#a855f7",
    background: "#0f051d",
    surface: "#1a0b36",
    text: "#faf5ff",
    textMuted: "#a8a29e",
  },
  gold: {
    primary: "#eab308",
    accent: "#f97316",
    background: "#0c0a09",
    surface: "#1c1917",
    text: "#fefce8",
    textMuted: "#a8a29e",
  },
  amber: {
    primary: "#f59e0b",
    accent: "#d97706",
    background: "#1c1208",
    surface: "#2d1d0e",
    text: "#fffbeb",
    textMuted: "#d97706",
  },
  medical: {
    primary: "#06b6d4",
    accent: "#0284c7",
    background: "#04151f",
    surface: "#082738",
    text: "#f0fdfa",
    textMuted: "#94a3b8",
  },
  luxury: {
    primary: "#e2b17a",
    accent: "#f43f5e",
    background: "#0f0d0e",
    surface: "#1e191a",
    text: "#fdf8f6",
    textMuted: "#a8a29e",
  },
  purple: {
    primary: "#8b5cf6",
    accent: "#f59e0b",
    background: "#0c071e",
    surface: "#180d38",
    text: "#fdf4ff",
    textMuted: "#c084fc",
  },
  eco: {
    primary: "#22c55e",
    accent: "#14b8a6",
    background: "#021a12",
    surface: "#052e22",
    text: "#f0fdf4",
    textMuted: "#86efac",
  },
};

// Kho avatar chất lượng cao cho đánh giá khách hàng (Testimonials)
const TESTIMONIAL_AVATARS = [
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=200&q=80",
  "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=200&q=80",
];

// Hàm sinh danh sách nhận xét chân thực phù hợp từng ngành nghề
export function getFallbackTestimonials(topicKey = "tech", brandName = "Thương hiệu") {
  const key = (topicKey || "tech").toLowerCase();

  if (
    key.includes("bake") ||
    key.includes("bánh") ||
    key.includes("coffee") ||
    key.includes("cà phê") ||
    key.includes("ẩm thực") ||
    key.includes("fnb")
  ) {
    return [
      {
        quote: `Bánh tươi ra lò mỗi ngày tại ${brandName} luôn giữ trọn vị bơ Pháp thơm ngậy. Khách hàng của chúng tôi khen ngợi hết lời!`,
        name: "Lê Hoàng Yến",
        role: "Blogger Ẩm thực",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[0],
      },
      {
        quote: `Hương vị đồ uống và phong cách phục vụ tại ${brandName} đạt chuẩn 5 sao. Không gian ấm cúng là điểm hẹn lý tưởng mỗi cuối tuần.`,
        name: "Trần Minh Quân",
        role: "Kiến trúc sư & Khách quen",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[1],
      },
      {
        quote: `Dịch vụ tiệc trà và bánh sự kiện của ${brandName} rất chuyên nghiệp. Đúng giờ, đóng gói tinh tế và vị ngon khó cưỡng.`,
        name: "Phạm Thảo Vy",
        role: "Quản lý Sự kiện",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[2],
      },
      {
        quote: `Nguyên liệu hữu cơ tươi sạch, từng chiếc bánh thủ công đều chứa đựng tâm huyết. Rất xứng đáng là điểm đến hàng đầu!`,
        name: "Nguyễn Hải Đăng",
        role: "Chuyên gia F&B",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[3],
      },
    ];
  }

  if (
    key.includes("dental") ||
    key.includes("nha khoa") ||
    key.includes("răng") ||
    key.includes("medical") ||
    key.includes("y tế") ||
    key.includes("clinic")
  ) {
    return [
      {
        quote: `Đội ngũ bác sĩ tại ${brandName} có chuyên môn cao và nhẹ nhàng. Quy trình vô trùng tuyệt đối làm tôi hoàn toàn an tâm.`,
        name: "Bác sĩ Đặng Quốc Bảo",
        role: "Cố vấn Y khoa",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[1],
      },
      {
        quote: `Nụ cười mới giúp tôi tự tin hơn rất nhiều trong công việc. Cảm ơn sự tận tâm và trang thiết bị tối tân của ${brandName}!`,
        name: "Hoàng Mỹ Linh",
        role: "Giám đốc Marketing",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[0],
      },
      {
        quote: `Dịch vụ chăm sóc sau khám rất chu đáo, nhắc lịch hẹn tự động và giải đáp tận tình mọi băn khoăn. Rất hài lòng!`,
        name: "Vũ Đình Trọng",
        role: "Doanh nhân",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[3],
      },
      {
        quote: `Tiêu chuẩn quốc tế ngay tại Việt Nam. Không gian phòng khám sang trọng, không có cảm giác sợ hãi khi khám chữa.`,
        name: "Trần Thu Hà",
        role: "Khách hàng thân thiết",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[4],
      },
    ];
  }

  if (
    key.includes("edu") ||
    key.includes("học") ||
    key.includes("giáo dục") ||
    key.includes("ngoại ngữ")
  ) {
    return [
      {
        quote: `Phương pháp học tương tác cùng giáo trình âm thanh của ${brandName} giúp học viên của tôi tăng 40% khả năng ghi nhớ từ vựng.`,
        name: "ThS. Nguyễn Mai Phương",
        role: "Giảng viên Ngôn ngữ học",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[2],
      },
      {
        quote: `Con tôi tiến bộ rõ rệt chỉ sau 2 tháng. Các bài giảng rất sinh động, phát âm chuẩn tự nhiên và truyền cảm hứng.`,
        name: "Phan Văn Hưng",
        role: "Phụ huynh học sinh",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[3],
      },
      {
        quote: `Nền tảng số của ${brandName} là trợ thủ đắc lực cho trung tâm chúng tôi trong việc số hóa lộ trình đào tạo chuẩn quốc tế.`,
        name: "Lê Cẩm Tú",
        role: "Giám đốc Trung tâm Anh ngữ",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[4],
      },
    ];
  }

  if (
    key.includes("fashion") ||
    key.includes("thời trang") ||
    key.includes("luxury") ||
    key.includes("sang trọng")
  ) {
    return [
      {
        quote: `Từng đường kim mũi chỉ của ${brandName} toát lên vẻ sang trọng quý phái. Chất liệu lụa tự nhiên mang lại cảm giác nhẹ tựa mây.`,
        name: "Vũ Ngọc Diệp",
        role: "Biên tập viên Thời trang",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[0],
      },
      {
        quote: `Dịch vụ may đo bespoke của ${brandName} tinh tế đến từng chi tiết. Bộ trang phục hoàn hảo cho các dạ tiệc quan trọng.`,
        name: "Đỗ Quốc Khánh",
        role: "Nhà sưu tầm & Khách VIP",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[1],
      },
      {
        quote: `Bộ sưu tập mới mang ngôn ngữ thiết kế tối giản nhưng đầy quyền lực. Luôn là lựa chọn ưu tiên của tôi!`,
        name: "Trịnh Thùy Linh",
        role: "Creative Director",
        stars: 5,
        avatar: TESTIMONIAL_AVATARS[4],
      },
    ];
  }

  // Mặc định công nghệ / SaaS / chung
  return [
    {
      quote: `Giải pháp từ ${brandName} giúp doanh nghiệp chúng tôi tự động hóa 80% quy trình và tăng gấp đôi tỷ lệ hài lòng của khách hàng.`,
      name: "Nguyễn Thành Long",
      role: "CTO & Co-founder TechCorp",
      stars: 5,
      avatar: TESTIMONIAL_AVATARS[1],
    },
    {
      quote: `Giao diện trực quan, kiến trúc White Label dễ dàng tùy biến theo mọi thương hiệu chỉ trong tích tắc. Một sản phẩm tuyệt vời!`,
      name: "Đặng Phương Dung",
      role: "Product Lead tại AlphaHub",
      stars: 5,
      avatar: TESTIMONIAL_AVATARS[0],
    },
    {
      quote: `Độ trễ xử lý cực thấp, hoạt động ổn định và hỗ trợ khách hàng 24/7 nhiệt tình. Chúng tôi hoàn toàn tin tưởng ${brandName}.`,
      name: "Trần Viết Bách",
      role: "Trưởng phòng Chuyển đổi số",
      stars: 5,
      avatar: TESTIMONIAL_AVATARS[3],
    },
  ];
}

export function renderChatbot(config = {}) {
  const currentBrand = (config.brand && config.brand.name) || "ViVoice";

  return `
  <div class="ai-chat-widget" id="ai-chat-widget" aria-label="Trợ lý AI tạo thương hiệu mới">
    <!-- Nút kích hoạt nổi ở góc phải (nằm dưới nút mũi tên cuộn lên) -->
    <div class="ai-chat-trigger-wrap">
      <div class="ai-chat-callout" id="ai-chat-callout">
        <span>Tôi sẽ hỗ trợ bạn <strong>tạo thương hiệu cho chính bạn!</strong></span>
        <button type="button" class="callout-close" id="ai-callout-close" aria-label="Đóng gợi ý">&times;</button>
      </div>

      <button type="button" class="ai-chat-trigger-btn btn-magnetic" id="ai-chat-toggle" aria-expanded="false" aria-label="Mở Trợ lý AI tạo thương hiệu">
        <div class="trigger-orb">
          <i class="fa-solid fa-wand-magic-sparkles trigger-icon-open"></i>
          <i class="fa-solid fa-xmark trigger-icon-close"></i>
        </div>
        <span class="online-indicator" title="Gemini 2.5 Flash kết nối"></span>
      </button>
    </div>

    <!-- Khung cửa sổ tương tác Chatbot -->
    <div class="ai-chat-panel" id="ai-chat-panel" data-lenis-prevent aria-hidden="true">
      <!-- Chat Header (Tối giản chuẩn theo thiết kế trong ảnh) -->
      <div class="chat-header">
        <div class="chat-header-info">
          <div class="chat-avatar">
            <i class="fa-solid fa-robot"></i>
            <span class="avatar-status-dot"></span>
          </div>
          <h3 class="chat-header-title">AI hỗ trợ tạo thương hiệu</h3>
        </div>
        <button type="button" class="chat-header-close" id="ai-chat-close" title="Thu nhỏ cửa sổ">
          <i class="fa-solid fa-xmark"></i>
        </button>
      </div>

      <!-- Thân Chatbot (Body) -->
      <div class="ai-chat-body" id="ai-chat-body" data-lenis-prevent>
        <!-- Nút cuộn nhanh xuống đáy khi người dùng đang cuộn lên xem lịch sử -->
        <button type="button" class="chat-scroll-bottom-btn" id="ai-chat-scroll-bottom" title="Cuộn xuống tin nhắn mới nhất" style="display: none;">
          <i class="fa-solid fa-arrow-down"></i> Tin nhắn mới
        </button>

        <!-- Khu vực hiển thị tin nhắn trò chuyện trực tiếp -->
        <div class="chat-messages" id="ai-chat-messages" data-lenis-prevent role="log" aria-live="polite">
          <div class="chat-msg bot-msg">
            <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
            <div class="msg-bubble">
              <p style="font-weight: 700; margin-bottom: 6px; font-size: 0.92rem; color: #fff;">
                <i class="fa-solid fa-wand-magic-sparkles" style="color: var(--primary);"></i> Trợ lý AI Brand Architect
              </p>
              <p style="margin: 0; font-size: 0.86rem; color: #e2e8f0; line-height: 1.55;">
                Hãy nhập <strong>tên thương hiệu</strong>, <strong>ngành nghề/sản phẩm</strong> hoặc <strong>mô tả mong muốn</strong> của bạn (bằng tin nhắn hoặc bấm micro để nói).
              </p>
              <p style="margin: 8px 0 0; font-size: 0.81rem; color: #94a3b8; line-height: 1.45;">
                AI sẽ tự động thiết kế trọn gói file JSON chuẩn White Label: tự động đổi tên, phối bảng màu nhận diện, sáng tạo nội dung văn bản và chọn liên kết hình ảnh 4K tương ứng!
              </p>
            </div>
          </div>
        </div>

        <!-- Typing Indicator khi AI đang soạn thảo / sinh JSON -->
        <div class="chat-typing-indicator" id="ai-typing-indicator">
          <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="typing-text" id="ai-typing-text">AI đang thiết kế nhận diện thương hiệu &amp; tạo file JSON...</span>
        </div>
      </div>

      <!-- Form nhập tin nhắn trò chuyện tự do (Kèm nút Micro STT) -->
      <form class="chat-input-bar" id="ai-chat-form">
        <div class="chat-input-pill">
          <input type="text" id="ai-chat-input" placeholder="Nhập mong muốn hoặc bấm mic để nói..." autocomplete="off" maxlength="300" />
          <button type="button" class="chat-mic-btn" id="ai-chat-mic" title="Nói qua micro (Voice-to-Text)" aria-label="Nói qua micro">
            <i class="fa-solid fa-microphone"></i>
          </button>
          <button type="submit" class="chat-send-btn" id="ai-chat-send" aria-label="Gửi yêu cầu">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  </div>`;
}

// ============================================================================
// HÀM TRÍCH XUẤT TÊN THƯƠNG HIỆU TỰ ĐỘNG TỪ YÊU CẦU NGƯỜI DÙNG
// ============================================================================
export function extractBrandNameFromPrompt(text = "") {
  if (!text) return "Microphone";

  // 1. Khớp theo mẫu "tên là X" hoặc "tên: X"
  let m = text.match(/tên\s*(?:là|:)\s*([A-Za-z0-9_\sÀ-ỹ]+)/i);
  if (m && m[1].trim()) {
    return m[1].trim().split(/[,.!?]/)[0].trim();
  }

  // 2. Khớp theo từ viết hoa dạng CamelCase (BobaMaster, BonAppetit, ClipVoice, LuxeAura...)
  m = text.match(/\b([A-Z][a-z]+[A-Z][a-zA-Z0-9]*)\b/);
  if (m && m[1].trim()) {
    return m[1].trim();
  }

  // 3. Khớp cụm từ viết hoa tiếng Anh / tên riêng (ví dụ "Arabica Roastery", "CyberCore", "ZenFlow")
  const stopWords = new Set(["Việt", "Nam", "Pháp", "Mỹ", "Đài", "Loan", "Nhật", "Hàn", "Trung", "Quốc", "Anh"]);
  const capitalMatches = text.match(/\b([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*)\b/g);
  if (capitalMatches) {
    for (const word of capitalMatches) {
      const parts = word.split(/\s+/);
      if (!parts.every((p) => stopWords.has(p))) {
        return word.trim();
      }
    }
  }

  // 4. Khớp theo cụm "brand X", "thương hiệu X"
  m = text.match(/(?:brand|thương hiệu)\s+([A-Za-z0-9_À-ỹ]+(?:\s+[A-Za-z0-9_À-ỹ]+)?)/i);
  if (m && m[1].trim()) {
    const firstWord = m[1].trim().split(/\s+/)[0].toLowerCase();
    if (!["cho", "về", "mới", "này", "một", "nào", "của", "giúp", "gì", "tự"].includes(firstWord)) {
      return m[1].trim();
    }
  }

  // 5. Khớp từ viết hoa ở cuối câu
  m = text.match(/([A-Z][A-Za-z0-9_]+)\s*$/);
  if (m && m[1].trim()) {
    return m[1].trim();
  }

  return "Microphone";
}

// ============================================================================
// HÀM KIỂM ĐỊNH VÀ BỔ SUNG ẢNH CHUYÊN NGÀNH (STRICT SCHEMA & IMAGE ENRICHER)
// ============================================================================
export function enrichAndValidateBrandJson(data, topicHint = "tech") {
  if (!data || typeof data !== "object") {
    throw new Error("Dữ liệu trả về không phải là JSON hợp lệ.");
  }

  // 1. Chuẩn hóa thương hiệu (brand) phòng thủ
  if (!data.brand || typeof data.brand !== "object") {
    data.brand = {
      name: data.brandName || data.name || data.title || extractBrandNameFromPrompt(topicHint),
      slogan: data.slogan || data.tagline || "Kiến tạo giá trị mới",
    };
  } else {
    data.brand.name = data.brand.name || data.brandName || data.name || extractBrandNameFromPrompt(topicHint);
    data.brand.slogan = data.brand.slogan || data.slogan || "Kiến tạo giá trị mới";
    delete data.brand.logo;
    delete data.brand.favicon;
  }
  delete data.logo;
  delete data.favicon;

  // Chuẩn hóa sections (chuyển đổi nếu là object hoặc mảng thiếu type)
  let rawSections = data.sections;
  if (!Array.isArray(rawSections)) {
    if (rawSections && typeof rawSections === "object") {
      rawSections = Object.entries(rawSections).map(([k, v]) => {
        if (typeof v === "object" && v !== null) {
          if (!v.type) v.type = v.name || v.id || k;
          return v;
        }
        return { type: k };
      });
    } else {
      rawSections = [];
    }
  }

  // Đảm bảo tất cả các section có thuộc tính 'type' chữ thường hợp lệ
  rawSections.forEach((s) => {
    if (!s.type) {
      s.type = s.name || s.sectionType || s.id || "unknown";
    }
    s.type = String(s.type).toLowerCase();
  });
  data.sections = rawSections;

  // Chuẩn hóa theme
  if (!data.theme || typeof data.theme !== "object") {
    data.theme = {};
  }

  const brandName = data.brand.name || "Microphone";
  const slug =
    brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-") || "microphone";

  // Xác định chủ đề ảnh phù hợp và xáo trộn mảng ảnh đa dạng độc bản cho thương hiệu
  const detectedTopic = (data.topic || topicHint || "tech").toLowerCase();
  const photoPool = getDiverseBrandPhotos(detectedTopic, brandName);

  // 2. Bảo đảm effects đầy đủ
  data.effects = {
    smoothScroll: true,
    cursor: true,
    preloader: true,
    orb: true,
    ambientBackground: true,
    scrollProgress: true,
    ...(data.effects || {}),
  };

  // 3. Chuẩn hóa các sections và gán ảnh Unsplash 4K tương ứng
  const sections = data.sections;

  // Tự động sinh thanh điều hướng (data.nav) ĐỘNG theo đúng thứ tự các section xuất hiện trên trang
  const navMap = {
    hero: { href: "#hero", label: "Trang chủ" },
    features: { href: "#features", label: "Tính năng" },
    demo: { href: "#demo", label: "Trải nghiệm" },
    about: { href: "#about", label: "Về chúng tôi" },
    testimonials: { href: "#testimonials", label: "Đánh giá" },
    faq: { href: "#faq", label: "Hỏi đáp" },
    contact: { href: "#contact", label: "Liên hệ" },
  };

  data.nav = sections
    .filter(
      (s) =>
        s.type &&
        navMap[s.type] &&
        s.disabled !== true &&
        s.visible !== false,
    )
    .map((s) => navMap[s.type]);

  // Nếu vì lý do nào đó nav rỗng, fallback sang nav chuẩn
  if (data.nav.length === 0) {
    data.nav = [
      { href: "#hero", label: "Trang chủ" },
      { href: "#features", label: "Tính năng" },
      { href: "#about", label: "Về chúng tôi" },
      { href: "#faq", label: "Hỏi đáp" },
      { href: "#contact", label: "Liên hệ" },
    ];
  }

  // Hero
  const hero = sections.find((s) => s.type === "hero");
  if (hero) {
    // Giữ layout nếu có: "split-right", "voice-studio", "centered"
    hero.layout = hero.layout || "split-right";
    hero.welcomeMessage =
      hero.welcomeMessage || `Chào mừng đến với ${brandName}`;
    hero.welcomeAudio = hero.welcomeAudio || "";
    hero.title = hero.title || `Khám phá giải pháp cùng ${brandName} cho`;
    if (!Array.isArray(hero.rotatingWords) || hero.rotatingWords.length < 2) {
      hero.rotatingWords = ["doanh nghiệp", "chuyên gia số", "tương lai"];
    }
    if (!hero.buttons || hero.buttons.length === 0) {
      if (hero.ctaPrimary || hero.ctaSecondary) {
        hero.buttons = [];
        if (hero.ctaPrimary) {
          hero.buttons.push({
            href: hero.ctaPrimary.link || hero.ctaPrimary.href || "#features",
            label: hero.ctaPrimary.text || hero.ctaPrimary.label || "Khám phá ngay",
            style: "primary",
          });
        }
        if (hero.ctaSecondary) {
          hero.buttons.push({
            href: hero.ctaSecondary.link || hero.ctaSecondary.href || "#contact",
            label: hero.ctaSecondary.text || hero.ctaSecondary.label || "Liên hệ",
            style: "secondary",
          });
        }
      } else {
        const hasDemo = sections.some(
          (s) => s.type === "demo" && s.visible !== false,
        );
        hero.buttons = [
          {
            href: hasDemo ? "#demo" : "#features",
            label: "Khám phá ngay",
            style: "primary",
          },
          { href: "#contact", label: "Liên hệ", style: "secondary" },
        ];
      }
    }
    if (!hero.playSample) {
      hero.playSample = `Xin chào! Bạn đang trải nghiệm giao diện White Label hoàn toàn mới của thương hiệu ${brandName}.`;
    }
  }

  // Hàm kiểm tra link ảnh Unsplash thực tế (không phải placeholder có '...' hoặc ảnh assets cũ)
  const isRealUnsplash = (url) => {
    if (!url || typeof url !== "string") return false;
    const clean = url.trim();
    if (clean.includes("...") || clean.startsWith("assets/images/")) return false;
    return clean.startsWith("https://images.unsplash.com/photo-") && clean.includes("w=1200");
  };

  // Features (Lưới Bento hoặc 3D stack cards)
  const features = sections.find((s) => s.type === "features");
  if (features) {
    if (!Array.isArray(features.items)) {
      features.items = features.features || features.cards || features.list || [];
    }
    features.layout = features.layout || "bento";
    features.items.forEach((item, idx) => {
      // Đảm bảo tương thích cả FeatureBentoGrid (item.text) và Feature3DStack (item.desc)
      const descVal =
        item.desc ||
        item.text ||
        item.description ||
        `Trải nghiệm tính năng vượt trội cùng ${brandName}.`;
      item.desc = descVal;
      item.text = descVal;
      item.title = item.title || item.name || `Tính năng 0${idx + 1}`;
      item.badge = item.badge || `0${idx + 1} / ĐIỂM NHẤN`;
      item.icon = item.icon || "fa-solid fa-sparkles";

      // Gán ảnh Unsplash 4K chất lượng cao đúng chuyên ngành nếu thiếu hoặc là placeholder
      if (!isRealUnsplash(item.image)) {
        item.image = photoPool[idx % photoPool.length];
      }
    });
  }

  // About (Hỗ trợ cả 2 bố cục: 3D Sticky Scroll Story và Grid & Stats Block)
  const about = sections.find((s) => s.type === "about");
  if (about) {
    about.layout =
      about.layout ||
      (detectedTopic.includes("tech") || detectedTopic.includes("game")
        ? "sticky-story"
        : "grid");

    const rawSlides =
      about.scrollStory && Array.isArray(about.scrollStory.slides)
        ? about.scrollStory.slides
        : Array.isArray(about.story)
          ? about.story
          : [];

    const slides = (
      rawSlides.length > 0
        ? rawSlides
        : [
          {
            eyebrow: "01 / TIN CẬY",
            title: "Đồng hành cùng khách hàng",
            description: `Xây dựng giải pháp ${brandName} lấy sự hài lòng của người dùng làm trung tâm.`,
            metric: { value: "10,000+", label: "Khách hàng tin chọn" },
          },
          {
            eyebrow: "02 / QUY MÔ",
            title: "Quy chuẩn chất lượng cao",
            description:
              "Quy trình vận hành tối ưu sẵn sàng mở rộng đáp ứng mọi nhu cầu khắt khe.",
            metric: { value: "99.9%", label: "Mức độ hài lòng" },
          },
          {
            eyebrow: "03 / TÂM HUYẾT",
            title: "Cam kết giá trị bền vững",
            description:
              "Chất lượng dịch vụ đạt chuẩn mực cao nhất, mang lại sự an tâm tuyệt đối.",
            metric: { value: "5.0/5", label: "Đánh giá xuất sắc" },
          },
        ]
    ).map((item, idx) => ({
      image: isRealUnsplash(item.image)
        ? item.image
        : photoPool[(idx + 4) % photoPool.length],
      eyebrow: item.eyebrow || `0${idx + 1} / ĐIỂM NHẤN`,
      title: item.title || "Giá trị thương hiệu",
      description:
        item.description || "Cam kết mang lại chuẩn mực chất lượng hàng đầu.",
      metric: item.metric || { value: "100%", label: "Tin cậy" },
    }));

    // Chuẩn hóa dữ liệu cho cả bố cục Grid
    about.paragraphs =
      Array.isArray(about.paragraphs) && about.paragraphs.length > 0
        ? about.paragraphs
        : [
          `${brandName} khởi nguồn từ khát vọng mang lại trải nghiệm tối ưu, kết hợp giữa tiêu chuẩn quốc tế và sự am hiểu sâu sắc nhu cầu khách hàng.`,
          `Chúng tôi không ngừng đổi mới để mỗi dịch vụ đều là một cam kết về chất lượng, sự tận tâm và sự hài lòng dài lâu.`,
        ];

    about.stats =
      Array.isArray(about.stats) && about.stats.length > 0
        ? about.stats
        : [
          { value: "10,000+", label: "Khách hàng tin chọn" },
          { value: "99.8%", label: "Mức độ hài lòng" },
          { value: "24/7", label: "Hỗ trợ tận tâm" },
        ];

    about.badge = about.badge || {
      icon: "fa-solid fa-medal",
      value: "Top 1",
      label: "Chuẩn mực chất lượng",
    };

    about.image = isRealUnsplash(about.image)
      ? about.image
      : photoPool[4 % photoPool.length] || photoPool[0];

    // Điều khiển scrollStory theo layout đã chọn
    if (about.layout === "grid") {
      about.scrollStory = { enabled: false, slides: slides };
    } else {
      about.scrollStory = {
        enabled: true,
        behavior: "sticky-story",
        slides: slides,
        animation: {
          imageScaleFrom: 1.08,
          imageScaleTo: 1,
          revealDistance: 28,
          transitionMs: 650,
        },
      };
      about.story = slides;
    }
  }

  // Testimonials (Đánh giá khách hàng - Dải trượt vô tận Marquee)
  const testimonials = sections.find((s) => s.type === "testimonials");
  if (testimonials) {
    if (!Array.isArray(testimonials.items)) {
      testimonials.items = testimonials.testimonials || testimonials.reviews || testimonials.feedback || [];
    }
    testimonials.layout = "marquee";
    testimonials.title =
      testimonials.title || `Khách hàng nói gì về ${brandName}`;
    testimonials.subtitle =
      testimonials.subtitle ||
      "Những phản hồi chân thực từ khách hàng và đối tác đã đồng hành cùng chúng tôi.";
    testimonials.eyebrow = testimonials.eyebrow || "ĐÁNH GIÁ CHÂN THỰC";

    if (testimonials.items.length === 0) {
      testimonials.items = getFallbackTestimonials(detectedTopic, brandName);
    } else {
      testimonials.items.forEach((t, idx) => {
        t.avatar =
          t.avatar && !t.avatar.startsWith("assets/images/")
            ? t.avatar
            : TESTIMONIAL_AVATARS[idx % TESTIMONIAL_AVATARS.length];
        t.stars = t.stars || 5;
        t.quote = t.quote || t.content || t.comment || "Dịch vụ tuyệt vời!";
        t.name = t.name || t.author || "Khách hàng";
        t.role = t.role || t.position || "Khách hàng thân thiết";
      });
    }
  }

  // Demo (Phòng thu âm / Trải nghiệm tương tác)
  const demo = sections.find((s) => s.type === "demo");
  if (demo) {
    demo.speakButtonText = demo.speakButtonText || "Kích hoạt trải nghiệm";
    demo.placeholder =
      demo.placeholder || `Nhập văn bản tương tác cùng ${brandName}...`;
    demo.defaultText =
      demo.defaultText ||
      `Xin chào! Bạn đang trải nghiệm thương hiệu ${brandName}.`;
  }

  // FAQ (Hỏi đáp - Thẻ lật 3D hoặc Accordion)
  const faq = sections.find((s) => s.type === "faq");
  if (faq) {
    if (!Array.isArray(faq.items)) {
      faq.items = faq.faqs || faq.questions || [];
    }
    faq.layout =
      faq.layout ||
      (detectedTopic.includes("tech") || detectedTopic.includes("game")
        ? "3d-flip-cards"
        : "accordion");
    faq.items.forEach((item, idx) => {
      item.id = item.id || `faq-${idx + 1}`;
      item.badge = item.badge || `0${idx + 1}`;
      item.question = item.question || item.q || "Câu hỏi thường gặp?";
      item.answer = item.answer || item.a || "Câu trả lời chi tiết.";
      item.frontHint =
        item.frontHint || "Bấm hoặc rê chuột để lật xem giải đáp";
      item.backAction = item.backAction || "Quay lại";
    });
  }

  // Contact
  const contact = sections.find((s) => s.type === "contact");
  if (contact) {
    contact.title = contact.title || `Kết nối cùng ${brandName}`;
    contact.formButton = contact.formButton || "Gửi thông tin liên hệ";
    contact.formSuccess =
      contact.formSuccess ||
      `Cảm ơn bạn! Đội ngũ của ${brandName} sẽ phản hồi trong vòng 24 giờ.`;
  }

  // Theme & Typography
  const isFnbOrLuxury =
    detectedTopic.includes("bake") ||
    detectedTopic.includes("bánh") ||
    detectedTopic.includes("coffee") ||
    detectedTopic.includes("cà phê") ||
    detectedTopic.includes("fashion") ||
    detectedTopic.includes("luxury") ||
    detectedTopic.includes("fnb") ||
    detectedTopic.includes("ẩm thực") ||
    detectedTopic.includes("quán") ||
    detectedTopic.includes("tiệm") ||
    detectedTopic.includes("trà");

  const isMedical =
    detectedTopic.includes("dental") ||
    detectedTopic.includes("nha khoa") ||
    detectedTopic.includes("medical") ||
    detectedTopic.includes("clinic") ||
    detectedTopic.includes("y tế") ||
    detectedTopic.includes("bác sĩ");

  const isEdtech =
    detectedTopic.includes("edtech") ||
    detectedTopic.includes("edu") ||
    detectedTopic.includes("giáo") ||
    detectedTopic.includes("học") ||
    detectedTopic.includes("ngoại ngữ");

  // Đảm bảo tông màu nền phù hợp với phong cách dark theme / glassmorphism
  let defaultBg = "#070c1e";
  let defaultSurface = "#0f1a36";
  if (isFnbOrLuxury) {
    defaultBg = detectedTopic.includes("luxury") ? "#0f0d0e" : "#1c1208";
    defaultSurface = detectedTopic.includes("luxury") ? "#1e191a" : "#2d1d0e";
  } else if (isMedical) {
    defaultBg = "#04151f";
    defaultSurface = "#082738";
  } else if (isEdtech) {
    defaultBg = "#0c071e";
    defaultSurface = "#180d38";
  }

  let bg = data.theme.background || defaultBg;
  if (/^#f[0-9a-f]{5}$/i.test(bg) || bg.toLowerCase() === "#ffffff" || bg.toLowerCase() === "white") {
    bg = defaultBg;
  }
  let surface = data.theme.surface || defaultSurface;
  if (/^#f[0-9a-f]{5}$/i.test(surface) || surface.toLowerCase() === "#ffffff") {
    surface = defaultSurface;
  }

  data.theme = {
    primary: data.theme.primary || (isFnbOrLuxury ? "#f59e0b" : isMedical ? "#06b6d4" : "#38bdf8"),
    accent: data.theme.accent || (isFnbOrLuxury ? "#d97706" : isMedical ? "#0284c7" : "#a78bfa"),
    background: bg,
    surface: surface,
    text: data.theme.text || "#f1f5f9",
    textMuted: data.theme.textMuted || "#94a3b8",
    fontHeading:
      data.theme.fontHeading ||
      (isFnbOrLuxury
        ? "Playfair Display"
        : (isMedical || isEdtech)
          ? "Plus Jakarta Sans"
          : "Space Grotesk"),
    fontBody: data.theme.fontBody || "Be Vietnam Pro",
    radius:
      data.theme.radius ||
      (isFnbOrLuxury ? "20px" : isMedical ? "12px" : "16px"),
  };

  // Footer sản phẩm sinh động theo các section đang kích hoạt
  const productLinks = [];
  if (sections.some((s) => s.type === "features" && s.visible !== false)) {
    productLinks.push({ href: "#features", label: "Tính năng nổi bật" });
  }
  if (sections.some((s) => s.type === "demo" && s.visible !== false)) {
    productLinks.push({ href: "#demo", label: "Trải nghiệm tương tác" });
  }
  if (sections.some((s) => s.type === "about" && s.visible !== false)) {
    productLinks.push({ href: "#about", label: "Câu chuyện thương hiệu" });
  }
  if (sections.some((s) => s.type === "testimonials" && s.visible !== false)) {
    productLinks.push({ href: "#testimonials", label: "Đánh giá khách hàng" });
  }
  if (sections.some((s) => s.type === "faq" && s.visible !== false)) {
    productLinks.push({ href: "#faq", label: "Hỏi đáp & Hỗ trợ" });
  }

  data.footer = {
    tagline: `${brandName} — ${data.brand.slogan || "Kiến tạo chuẩn mực mới."}`,
    columns: [
      {
        title: "Sản phẩm",
        links:
          productLinks.length > 0
            ? productLinks
            : [{ href: "#hero", label: "Trang chủ" }],
      },
      {
        title: "Liên kết",
        links: [
          { href: "#", label: "Tài liệu giới thiệu" },
          { href: "#", label: "Hồ sơ năng lực" },
        ],
      },
      {
        title: "Pháp lý",
        links: [
          { href: "#contact", label: "Liên hệ trực tiếp" },
          { href: "#", label: "Chính sách bảo mật" },
        ],
      },
    ],
    copyright: `© Bản quyền thuộc về ${brandName}. Kiến trúc White Label 2.0.`,
  };

  return data;
}

// ============================================================================
// HÀM SINH DỰ PHÒNG NỘI BỘ (ĐỒNG BỘ 100% NỘI DUNG THEO CHỦ ĐỀ)
// ============================================================================
export function generateBrandJsonOffline({ name, field, slogan, paletteKey }) {
  const rawTopic = (field || name || "").toLowerCase();
  const isCoffee =
    rawTopic.includes("cafe") ||
    rawTopic.includes("cà phê") ||
    rawTopic.includes("coffee") ||
    rawTopic.includes("ẩm thực") ||
    rawTopic.includes("bánh") ||
    rawTopic.includes("trà") ||
    rawTopic.includes("food") ||
    rawTopic.includes("quán");

  const brandName =
    (name && name.trim()) ||
    (isCoffee ? "Arabica Roastery" : "Microphone");

  const brandField =
    (field && field.trim()) ||
    (isCoffee
      ? "Không gian Cà phê thủ công & Đồ uống sáng tạo"
      : "Phần mềm thu âm giọng nói cao cấp & Phòng thu âm AI");

  const brandSlogan =
    (slogan && slogan.trim()) ||
    (isCoffee
      ? "Hương vị cà phê nguyên bản từ nông trại cao nguyên Cầu Đất"
      : "Chuẩn mực thu âm & xử lý giọng nói chuẩn Studio chuyên nghiệp");

  const slug =
    brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-") || (isCoffee ? "arabica-coffee" : "microphone");

  const detectedTopic = isCoffee ? "coffee" : "audio";
  const photos = getDiverseBrandPhotos(detectedTopic, brandName);

  // Phối màu nhận diện chuẩn
  let pal = null;
  if (paletteKey && BRAND_PALETTES[paletteKey]) {
    pal = BRAND_PALETTES[paletteKey];
  } else if (isCoffee) {
    pal = BRAND_PALETTES.amber || {
      primary: "#f59e0b",
      accent: "#d97706",
      background: "#1c1208",
      surface: "#2d1d0e",
      text: "#f8fafc",
      textMuted: "#e2e8f0",
    };
  } else {
    pal = {
      primary: "#06b6d4",
      accent: "#38bdf8",
      background: "#030712",
      surface: "#0b1222",
      text: "#f8fafc",
      textMuted: "#94a3b8",
    };
  }

  let sections = [];

  if (isCoffee) {
    // ========================================================================
    // CẤU TRÚC 100% CÀ PHÊ / F&B ĐỒNG BỘ TOÀN DIỆN
    // ========================================================================
    sections = [
      {
        type: "hero",
        layout: "centered",
        welcomeMessage: `Chào mừng bạn đến với ${brandName}`,
        welcomeAudio: "",
        title: "Hương vị cà phê nguyên bản & Không gian kết nối tại",
        rotatingWords: [
          "tách Espresso đậm đà",
          "hạt Robusta chọn lọc",
          "không gian mộc mạc",
        ],
        subtitle: `${brandName} mang đến trải nghiệm cà phê mộc hảo hạng, tuyển chọn từ những quả cà phê chín mọng tại Cầu Đất cùng không gian thư giãn lý tưởng dành cho bạn.`,
        playSample: `Chào mừng bạn ghé thăm ${brandName}! Hãy cùng chúng tôi đánh thức mọi giác quan bằng một tách cà phê thơm nồng được pha chế từ những hạt cà phê mộc hảo hạng nhất.`,
        buttons: [
          { href: "#features", label: "Thực đơn cà phê", style: "primary" },
          { href: "#contact", label: "Liên hệ đặt bàn", style: "secondary" },
        ],
      },
      {
        type: "features",
        layout: "bento",
        title: "Tinh Hoa Cà Phê Mộc Thủ Công",
        subtitle: `Từng tách cà phê tại ${brandName} là sự kết hợp hoàn hảo giữa nông sản Việt Nam chọn lọc và kỹ thuật pha chế tinh tế.`,
        items: [
          {
            badge: "01 / HẠT CHỌN LỌC",
            icon: "fa-solid fa-seedling",
            title: "Hạt Cà Phê Mộc Cầu Đất",
            desc: "100% tuyển chọn từ nông trại Cầu Đất ở độ cao 1.500m, rang mộc giữ trọn tầng hương phong phú.",
            text: "100% tuyển chọn từ nông trại Cầu Đất ở độ cao 1.500m, rang mộc giữ trọn tầng hương phong phú.",
            image: photos[0],
          },
          {
            badge: "02 / PHA CHẾ THỦ CÔNG",
            icon: "fa-solid fa-mug-hot",
            title: "Nghệ Thuật Barista Chuyên Nghiệp",
            desc: "Từ Espresso chuẩn Ý đến cà phê phin truyền thống đậm vị Việt, chuẩn chỉnh từng giọt.",
            text: "Từ Espresso chuẩn Ý đến cà phê phin truyền thống đậm vị Việt, chuẩn chỉnh từng giọt.",
            image: photos[1],
          },
          {
            badge: "03 / KHÔNG GIAN MỘC",
            icon: "fa-solid fa-couch",
            title: "Không Gian Làm Việc & Gặp Gỡ",
            desc: "Bàn làm việc rộng rãi, wifi tốc độ cao và ánh sáng tự nhiên dịu nhẹ cho cảm hứng sáng tạo.",
            text: "Bàn làm việc rộng rãi, wifi tốc độ cao và ánh sáng tự nhiên dịu nhẹ cho cảm hứng sáng tạo.",
            image: photos[2],
          },
          {
            badge: "04 / BÁNH TƯƠI MỖI SÁNG",
            icon: "fa-solid fa-cake-candles",
            title: "Thực Đơn Bánh & Đồ Uống Tươi",
            desc: "Bánh ngọt thủ công nướng mới mỗi sáng, kết hợp hoàn hảo cùng các món trà và cà phê sáng tạo.",
            text: "Bánh ngọt thủ công nướng mới mỗi sáng, kết hợp hoàn hảo cùng các món trà và cà phê sáng tạo.",
            image: photos[3],
          },
        ],
      },
      {
        type: "about",
        layout: "sticky-story",
        eyebrow: "CÂU CHUYỆN THƯƠNG HIỆU",
        title: "Hành trình gìn giữ hương vị cà phê đích thực",
        subtitle: `${brandName} khởi nguồn từ tình yêu sâu đậm với những hạt cà phê Việt Nam chất lượng cao.`,
        image: photos[4] || photos[0],
        scrollStory: {
          enabled: true,
          behavior: "sticky-story",
          slides: [
            {
              image: photos[4] || photos[0],
              eyebrow: "01 / NGUỒN GỐC",
              title: "Tuyển chọn từ nông trại Cầu Đất",
              description: "Từng quả cà phê chín mọng được hái thủ công, sơ chế theo phương pháp tự nhiên giữ trọn vị ngọt mật.",
              metric: { value: "100%", label: "Nguyên chất" },
            },
            {
              image: photos[5] || photos[1],
              eyebrow: "02 / NGHỆ NHÂN",
              title: "Rang mộc lưu giữ trọn vị tinh túy",
              description: "Quy trình rang xay tỉ mỉ kiểm soát nhiệt độ nghiêm ngặt tạo nên tầng hương thơm nồng nàn và hậu vị ngọt sâu.",
              metric: { value: "99.8%", label: "Đánh giá xuất sắc" },
            },
            {
              image: photos[6] || photos[2],
              eyebrow: "03 / KẾT NỐI",
              title: "Không gian gắn kết những câu chuyện",
              description: "Nơi bạn tìm thấy sự bình yên giữa nhịp sống bận rộn, thưởng thức cà phê và trò chuyện cùng những người bạn tâm giao.",
              metric: { value: "20,000+", label: "Tách cà phê / tháng" },
            },
          ],
          animation: {
            imageScaleFrom: 1.08,
            imageScaleTo: 1,
            revealDistance: 28,
            transitionMs: 650,
          },
        },
        paragraphs: [
          `${brandName} ra đời từ niềm đam mê đem đến cho thực khách những ly cà phê nguyên chất, chuẩn vị từ nông trại đến tách cà phê.`,
          "Chúng tôi tin rằng cà phê ngon không chỉ đánh thức giác quan mà còn là nhịp cầu gắn kết những ý tưởng và câu chuyện đẹp mỗi ngày.",
        ],
        stats: [
          { value: "100%", label: "Nguyên liệu tự nhiên" },
          { value: "99.8%", label: "Khách hàng hài lòng" },
          { value: "20,000+", label: "Tách cà phê / tháng" },
        ],
        badge: {
          icon: "fa-solid fa-award",
          value: "Top 1",
          label: "Cà phê mộc nguyên bản 2026",
        },
      },
      {
        type: "testimonials",
        layout: "marquee",
        title: "Khách Hàng Nói Gì Về Chúng Tôi",
        subtitle: `Những phản hồi chân thực từ những tín đồ cà phê đã chọn ${brandName} làm điểm hẹn quen thuộc.`,
        eyebrow: "ĐÁNH GIÁ CHÂN THỰC",
        items: [
          {
            quote: `Hương vị cà phê tại ${brandName} thực sự khác biệt, đậm đà nhưng êm dịu, không hề bị gắt hay khét mùi hương liệu công nghiệp.`,
            name: "Lê Hoàng Yến",
            role: "Blogger Ẩm thực",
            stars: 5,
            avatar: TESTIMONIAL_AVATARS[0],
          },
          {
            quote: `Không gian quán yên tĩnh và mộc mạc, rất phù hợp cho những buổi làm việc tập trung hoặc trò chuyện cùng đối tác.`,
            name: "Trần Minh Quân",
            role: "Kiến trúc sư & Khách quen",
            stars: 5,
            avatar: TESTIMONIAL_AVATARS[1],
          },
          {
            quote: `Tách Cappuccino bọt sữa sánh mịn, bánh sừng bò nướng nóng hổi giòn rụm mỗi sáng. Dịch vụ luôn niềm nở và ấm áp.`,
            name: "Phạm Thảo Vy",
            role: "Quản lý Sáng tạo",
            stars: 5,
            avatar: TESTIMONIAL_AVATARS[2],
          },
          {
            quote: `Hạt cà phê Cầu Đất rang mộc ở đây pha phin hay pha máy đều tuyệt vời. Tôi đã mua thêm cả hạt đóng gói về tự pha tại nhà.`,
            name: "Nguyễn Hải Đăng",
            role: "Chuyên gia F&B",
            stars: 5,
            avatar: TESTIMONIAL_AVATARS[3],
          },
        ],
      },
      {
        type: "faq",
        layout: "3d-flip-cards",
        title: "Câu Hỏi Thường Gặp",
        subtitle: `Giải đáp những thắc mắc phổ biến về nguồn gốc hạt cà phê và dịch vụ tại ${brandName}.`,
        items: [
          {
            id: "faq-1",
            badge: "01",
            category: "Nguồn gốc",
            icon: "fa-solid fa-seedling",
            question: `Cà phê của ${brandName} có nguồn gốc từ đâu?`,
            answer: "Chúng tôi sử dụng 100% hạt cà phê Robusta và Arabica được thu hoạch từ các nông trại canh tác tự nhiên tại Cầu Đất và Buôn Ma Thuột.",
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-2",
            badge: "02",
            category: "Rang xay",
            icon: "fa-solid fa-fire",
            question: `${brandName} có sử dụng chất bảo quản hay hương liệu không?`,
            answer: "Hoàn toàn không. Chúng tôi cam kết rang mộc 100%, không tẩm ướp bơ nhân tạo hay bất kỳ phụ gia nào để bảo toàn vị ngon tự nhiên.",
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-3",
            badge: "03",
            category: "Giao hàng",
            icon: "fa-solid fa-truck-fast",
            question: "Quán có hỗ trợ giao hàng tận nơi và đặt tiệc teabreak không?",
            answer: "Có. Chúng tôi hỗ trợ giao đồ uống tận nơi trong bán kính 7km và nhận đặt tiệc bánh trà teabreak cho văn phòng, sự kiện.",
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-4",
            badge: "04",
            category: "Không gian",
            icon: "fa-solid fa-wifi",
            question: "Quán có không gian yên tĩnh và ổ cắm điện làm việc không?",
            answer: "Có. Không gian quán được trang bị bàn làm việc rộng, ổ cắm điện đầy đủ tại từng bàn và đường truyền wifi tốc độ cao.",
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
        ],
      },
      {
        type: "contact",
        title: `Ghé Thăm & Kết Nối Cùng ${brandName}`,
        channels: [
          { label: "Hotline", value: "1900 6868 (07:00 - 22:30)" },
          { label: "Email", value: `hello@${slug}.vn` },
          { label: "Địa chỉ", value: "Không gian Cà phê Trung tâm, Hà Nội / TP.HCM" },
        ],
        formTitle: "Để lại lời nhắn / Đặt bàn trước",
        formName: "Họ và tên của bạn",
        formEmail: "Số điện thoại / Email",
        formMessage: `Số lượng người hoặc nhu cầu đặt bàn tại ${brandName}...`,
        formButton: "Gửi yêu cầu đặt bàn",
        formSuccess: `Cảm ơn bạn! Đội ngũ ${brandName} đã nhận được thông tin và sẽ gọi xác nhận trong vòng 15 phút.`,
      },
    ];
  } else {
    // ========================================================================
    // CẤU TRÚC 100% PHẦN MỀM THU ÂM GIỌNG NÓI CAO CẤP
    // ========================================================================
    sections = [
      {
        type: "hero",
        layout: "voice-studio",
        welcomeMessage: `Chào mừng bạn đến với ${brandName}`,
        welcomeAudio: "",
        title: "Phần mềm thu âm giọng nói cao cấp cùng",
        rotatingWords: [
          "chuẩn Master 96kHz",
          "lọc ồn AI thời gian thực",
          "giọng đọc siêu thực",
        ],
        subtitle: `${brandName} là giải pháp phòng thu âm số thế hệ mới, tích hợp công nghệ AI tái tạo âm sắc trong trẻo, khử tạp âm tự động và lồng tiếng đa ngôn ngữ chuẩn phát thanh truyền hình.`,
        playSample: `Xin chào! Bạn đang trải nghiệm chất lượng âm thanh 32-bit floating point được thu và xử lý trực tiếp qua phần mềm ${brandName}.`,
        buttons: [
          { href: "#demo", label: "Trải nghiệm phòng thu", style: "primary" },
          { href: "#features", label: "Khám phá tính năng", style: "secondary" },
        ],
      },
      {
        type: "demo",
        title: "Phòng Thu Âm Tương Tác Trực Tuyến",
        subtitle: `Cảm nhận độ trung thực vượt trội của bộ giải mã âm thanh AI và thử nghiệm lồng tiếng trực tiếp cùng ${brandName}.`,
        placeholder: "Nhập văn bản cần thu âm hoặc lồng tiếng thử nghiệm...",
        defaultText: `Xin chào! Đây là bản thu thử nghiệm với công nghệ âm thanh chuẩn Studio 32-bit từ ${brandName}. Mọi chi tiết âm sắc đều được tái hiện chân thực và sắc nét.`,
        speakButtonText: "Kích hoạt thu âm / Nghe thử",
      },
      {
        type: "features",
        layout: "bento",
        title: "Năng Lực Xử Lý Âm Thanh Chuẩn Master",
        subtitle: "Trang bị đầy đủ chuỗi xử lý tín hiệu DSP chuyên sâu, mang cả phòng thu âm triệu đô lên không gian làm việc của bạn.",
        items: [
          {
            badge: "01 / CHẤT LƯỢNG MASTER",
            icon: "fa-solid fa-microphone-lines",
            title: "Ghi Âm Chuẩn 32-bit / 192kHz",
            desc: "Dải động cực rộng chống méo tiếng tuyệt đối, bắt trọn từng sắc thái biểu cảm và hơi thở tự nhiên nhất.",
            text: "Dải động cực rộng chống méo tiếng tuyệt đối, bắt trọn từng sắc thái biểu cảm và hơi thở tự nhiên nhất.",
            image: photos[0],
          },
          {
            badge: "02 / KHỬ ỒN AI THÔNG MINH",
            icon: "fa-solid fa-waveform-lines",
            title: "Khử Tạp Âm & Vang Phòng Realtime",
            desc: "Thuật toán học sâu loại bỏ tức thì tiếng ồn quạt gió, tiếng gõ phím và tiếng dội âm chỉ trong 0.05 giây.",
            text: "Thuật toán học sâu loại bỏ tức thì tiếng ồn quạt gió, tiếng gõ phím và tiếng dội âm chỉ trong 0.05 giây.",
            image: photos[1],
          },
          {
            badge: "03 / GIỌNG NÓI SIÊU THỰC",
            icon: "fa-solid fa-wand-magic-sparkles",
            title: "Hơn 200+ Chất Giọng Cảm Xúc",
            desc: "Tái tạo giọng đọc tự nhiên với đa dạng âm sắc, từ ấm áp, truyền cảm đến chuyên nghiệp chuẩn phát thanh.",
            text: "Tái tạo giọng đọc tự nhiên với đa dạng âm sắc, từ ấm áp, truyền cảm đến chuyên nghiệp chuẩn phát thanh.",
            image: photos[2],
          },
          {
            badge: "04 / MASTERING TỰ ĐỘNG",
            icon: "fa-solid fa-sliders",
            title: "Tự Động Cân Bằng & Xuất Đa Định Dạng",
            desc: "Tự động chuẩn hóa âm lượng theo chuẩn phát sóng quốc tế LUFS, xuất file WAV Lossless, FLAC, MP3 320kbps.",
            text: "Tự động chuẩn hóa âm lượng theo chuẩn phát sóng quốc tế LUFS, xuất file WAV Lossless, FLAC, MP3 320kbps.",
            image: photos[3],
          },
        ],
      },
      {
        type: "about",
        layout: "sticky-story",
        eyebrow: "CÂU CHUYỆN PHÁT TRIỂN",
        title: "Hành trình đưa âm thanh chuẩn phòng thu đến mọi nhà sáng tạo",
        subtitle: `${brandName} ra đời với sứ mệnh xóa nhòa rào cản phòng thu đắt đỏ, giúp podcaster, MC và nhà sáng tạo tự tin cất tiếng nói.`,
        image: photos[4] || photos[0],
        scrollStory: {
          enabled: true,
          behavior: "sticky-story",
          slides: [
            {
              image: photos[4] || photos[0],
              eyebrow: "01 / KHỞI NGUỒN",
              title: "Khát vọng âm thanh trung thực",
              description: `Từng chi tiết âm thanh tại ${brandName} được tối ưu hóa để giữ trọn vẹn cảm xúc tự nhiên của người nói.`,
              metric: { value: "32-bit", label: "Chuẩn thu Float Point" },
            },
            {
              image: photos[5] || photos[1],
              eyebrow: "02 / ĐỘT PHÁ AI",
              title: "Khử nhiễu chính xác 99.9%",
              description: "Mô hình nơ-ron học sâu phân tách giọng nói và môi trường với độ chính xác chuẩn phòng thí nghiệm.",
              metric: { value: "99.9%", label: "Lọc sạch tạp âm" },
            },
            {
              image: photos[6] || photos[2],
              eyebrow: "03 / TIN CẬY",
              title: "Hơn 50,000 giờ thu âm",
              description: "Được hàng ngàn đài phát thanh, studio lồng tiếng và kênh podcast tin dùng sản xuất hằng ngày.",
              metric: { value: "50,000+", label: "Giờ thu xuất bản" },
            },
          ],
          animation: {
            imageScaleFrom: 1.08,
            imageScaleTo: 1,
            revealDistance: 28,
            transitionMs: 650,
          },
        },
        paragraphs: [
          `${brandName} khởi nguồn từ khát vọng mang lại chất lượng âm thanh phòng thu hàng đầu cho mọi nhà sáng tạo nội dung mà không đòi hỏi chi phí thiết bị đắt đỏ.`,
          "Chúng tôi kết hợp giữa kỹ thuật xử lý tín hiệu số DSP chuyên sâu và trí tuệ nhân tạo để mọi bản thu của bạn luôn đạt chuẩn mực phát sóng quốc tế.",
        ],
        stats: [
          { value: "32-bit", label: "Chuẩn thu Float Point" },
          { value: "99.9%", label: "Độ trong trẻo âm thanh" },
          { value: "50,000+", label: "Giờ thu xuất bản" },
        ],
        badge: {
          icon: "fa-solid fa-award",
          value: "Studio Pro",
          label: "Giải Vàng Âm Thanh Số 2026",
        },
      },
      {
        type: "testimonials",
        layout: "marquee",
        title: "Các Podcaster & Nhà Sản Xuất Nói Gì Về Chúng Tôi",
        subtitle: `Những đánh giá thực tế từ các biên tập viên âm thanh, nhà sản xuất podcast và nghệ sĩ lồng tiếng tin chọn ${brandName}.`,
        eyebrow: "ĐÁNH GIÁ CHÂN THỰC",
        items: [
          {
            quote: `Chất lượng âm thanh 32-bit của ${brandName} thực sự vượt trội. Khả năng khử ồn và bắt dải động âm sắc ấn tượng hơn nhiều phần mềm đắt tiền.`,
            name: "Đặng Nhật Quang",
            role: "Giám đốc Sản xuất Âm nhạc",
            stars: 5,
            avatar: TESTIMONIAL_AVATARS[1],
          },
          {
            quote: "Tôi thu âm podcast ngay tại bàn làm việc mà giọng đọc trong trẻo như trong cabin cách âm chuyên nghiệp. Tiết kiệm 80% thời gian lọc ồn!",
            name: "Hoàng Mai Linh",
            role: "Host Podcast & Sáng tạo nội dung",
            stars: 5,
            avatar: TESTIMONIAL_AVATARS[0],
          },
          {
            quote: `Bộ giải mã giọng đọc AI của ${brandName} giữ nguyên được ngữ điệu và hơi thở tự nhiên, hoàn toàn đáp ứng chuẩn phát thanh quốc tế.`,
            name: "Vũ Đình Phong",
            role: "Nghệ sĩ Lồng tiếng Phim",
            stars: 5,
            avatar: TESTIMONIAL_AVATARS[3],
          },
          {
            quote: "Giao diện trực quan, tính năng tự động cân bằng âm lượng LUFS giúp đội ngũ biên tập của chúng tôi xuất bản sản phẩm nhanh chóng.",
            name: "Trần Thu Trang",
            role: "Biên tập viên Đa phương tiện",
            stars: 5,
            avatar: TESTIMONIAL_AVATARS[2],
          },
        ],
      },
      {
        type: "faq",
        layout: "3d-flip-cards",
        title: "Giải Đáp Thắc Mắc Thường Gặp",
        subtitle: `Những câu hỏi phổ biến nhất về cách vận hành và chất lượng thu âm của ${brandName}.`,
        items: [
          {
            id: "faq-1",
            badge: "01",
            category: "Phần cứng",
            icon: "fa-solid fa-microphone",
            question: `${brandName} có hỗ trợ micro rời và soundcard ngoài không?`,
            answer: `Có. ${brandName} tự động nhận diện tất cả micro USB, XLR thông qua soundcard và tối ưu hóa tiền khuếch đại (preamp) tự động.`,
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-2",
            badge: "02",
            category: "Công nghệ",
            icon: "fa-solid fa-wand-magic-sparkles",
            question: "Khả năng khử tiếng ồn môi trường hoạt động như thế nào?",
            answer: "Bộ lọc AI phân tách giọng nói và tạp âm theo thời gian thực với độ trễ cực thấp dưới 5ms, lọc sạch tiếng quạt, bàn phím và tiếng vang phòng.",
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-3",
            badge: "03",
            category: "Bản quyền",
            icon: "fa-solid fa-certificate",
            question: "Tôi có được cấp toàn quyền thương mại cho bản thu không?",
            answer: `Có. Bạn sở hữu 100% bản quyền thương mại đối với tất cả các tập podcast, bản lồng tiếng hoặc tệp âm thanh được xuất ra từ ${brandName}.`,
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-4",
            badge: "04",
            category: "Định dạng",
            icon: "fa-solid fa-file-audio",
            question: `${brandName} hỗ trợ xuất những định dạng âm thanh nào?`,
            answer: "Hỗ trợ xuất đa dạng định dạng chuẩn phòng thu: WAV Lossless (24/32-bit), FLAC, MP3 320kbps và AAC tương thích mọi nền tảng số.",
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
        ],
      },
      {
        type: "contact",
        title: `Trải Nghiệm & Cấp Bản Quyền ${brandName}`,
        channels: [
          { label: "Hotline", value: "1900 6868 (24/7)" },
          { label: "Email", value: `studio@${slug}.vn` },
          {
            label: "Studio",
            value: "Trung tâm Công nghệ Âm thanh, Hà Nội / TP.HCM",
          },
        ],
        formTitle: "Đăng ký nhận bản dùng thử Studio Pro",
        formName: "Họ và tên của bạn",
        formEmail: "Email công việc / cá nhân",
        formMessage: `Nhu cầu sử dụng thu âm, podcast hoặc lồng tiếng cùng ${brandName}...`,
        formButton: "Nhận tài khoản trải nghiệm ngay",
        formSuccess: `Cảm ơn bạn! Đội ngũ ${brandName} đã gửi thông tin kích hoạt bản quyền thử nghiệm vào email của bạn.`,
      },
    ];
  }

  const base = {
    brand: { name: brandName, slogan: brandSlogan },
    topic: detectedTopic,
    effects: {
      smoothScroll: true,
      cursor: true,
      preloader: true,
      orb: true,
      ambientBackground: true,
      scrollProgress: true,
    },
    sections: sections,
    theme: {
      primary: pal.primary,
      accent: pal.accent,
      background: pal.background,
      surface: pal.surface,
      text: pal.text,
      textMuted: pal.textMuted,
      fontHeading: isCoffee ? "Playfair Display" : "Space Grotesk",
      fontBody: "Be Vietnam Pro",
      radius: isCoffee ? "20px" : "16px",
    },
  };

  return enrichAndValidateBrandJson(base, detectedTopic);
}

// ============================================================================
// KHỞI TẠO LOGIC TƯƠNG TÁC CHATBOT
// ============================================================================
export function initChatbot(config = {}) {
  const root = document.getElementById("ai-chat-root");
  if (!root) return;

  // Nếu widget đã tồn tại trong DOM thì giữ nguyên lịch sử và trạng thái
  if (document.getElementById("ai-chat-widget")) {
    return;
  }

  root.innerHTML = renderChatbot(config);

  const widget = document.getElementById("ai-chat-widget");
  const toggleBtn = document.getElementById("ai-chat-toggle");
  const panel = document.getElementById("ai-chat-panel");
  const closeBtn = document.getElementById("ai-chat-close");
  const callout = document.getElementById("ai-chat-callout");
  const calloutClose = document.getElementById("ai-callout-close");
  const messagesContainer = document.getElementById("ai-chat-messages");
  const typingIndicator = document.getElementById("ai-typing-indicator");
  const typingText = document.getElementById("ai-typing-text");
  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-chat-input");
  const sendBtn = document.getElementById("ai-chat-send");
  const scrollBottomBtn = document.getElementById("ai-chat-scroll-bottom");

  if (!widget || !toggleBtn || !panel) return;

  // Tự động nạp Gemini Key từ file .env hoặc LocalStorage
  loadEnvGeminiKey().catch(() => { });

  // Ngăn chặn sự kiện cuộn bị bắt bởi các thư viện cuộn trang (Lenis Smooth Scroll, GSAP)
  // để người dùng hoàn toàn tự do cuộn lên đọc lại các tin nhắn và phản hồi trước đó
  const stopScrollPropagation = (e) => {
    e.stopPropagation();
  };
  panel.addEventListener("wheel", stopScrollPropagation, { passive: true });
  panel.addEventListener("touchmove", stopScrollPropagation, { passive: true });
  if (messagesContainer) {
    messagesContainer.addEventListener("wheel", stopScrollPropagation, { passive: true });
    messagesContainer.addEventListener("touchmove", stopScrollPropagation, { passive: true });
  }

  // 1. Quản lý Mở / Đóng Panel Chat
  function togglePanel(open) {
    const isOpen =
      open !== undefined ? open : !panel.classList.contains("is-open");
    panel.classList.toggle("is-open", isOpen);
    panel.setAttribute("aria-hidden", isOpen ? "false" : "true");
    toggleBtn.classList.toggle("is-active", isOpen);
    toggleBtn.setAttribute("aria-expanded", isOpen ? "true" : "false");

    if (isOpen) {
      const wlSwitcher = document.querySelector(".white-label-switcher");
      if (wlSwitcher) wlSwitcher.classList.remove("open");
      if (callout) callout.style.display = "none";
      // Đọc lời chào mở đầu khi mở chatbox
      audioState.playSpeech("Tôi sẽ hỗ trợ bạn tạo thương hiệu cho chính bạn.");
      setTimeout(() => input && input.focus(), 250);
      scrollToBottom(true);
    }
  }

  toggleBtn.addEventListener("click", () => togglePanel());
  if (closeBtn) closeBtn.addEventListener("click", () => togglePanel(false));
  if (calloutClose && callout) {
    calloutClose.addEventListener("click", (e) => {
      e.stopPropagation();
      callout.style.display = "none";
    });
  }

  // Hiển thị Callout sau 2.5 giây để mời người dùng
  setTimeout(() => {
    if (callout && !panel.classList.contains("is-open")) {
      callout.classList.add("is-visible");
    }
  }, 2500);

  // Kiểm tra người dùng có đang chủ động cuộn lên xem lịch sử phía trên hay không
  function isUserScrolledUp() {
    if (!messagesContainer) return false;
    const distanceToBottom =
      messagesContainer.scrollHeight -
      messagesContainer.scrollTop -
      messagesContainer.clientHeight;
    return distanceToBottom > 70;
  }

  // Cuộn tin nhắn xuống cuối (chỉ cuộn nếu force=true hoặc người dùng đang ở sát đáy)
  function scrollToBottom(force = false) {
    if (!messagesContainer) return;
    if (force || !isUserScrolledUp()) {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      });
    }
  }

  // Lắng nghe sự kiện người dùng cuộn xem lịch sử chat phía trên
  if (messagesContainer) {
    messagesContainer.addEventListener(
      "scroll",
      () => {
        if (scrollBottomBtn) {
          if (isUserScrolledUp()) {
            scrollBottomBtn.style.display = "flex";
          } else {
            scrollBottomBtn.style.display = "none";
          }
        }
      },
      { passive: true },
    );
  }

  if (scrollBottomBtn) {
    scrollBottomBtn.addEventListener("click", () => {
      messagesContainer.scrollTo({
        top: messagesContainer.scrollHeight,
        behavior: "smooth",
      });
      scrollBottomBtn.style.display = "none";
    });
  }

  // Thêm tin nhắn vào khung chat
  function appendMessage(content, sender = "bot", metaButtons = "") {
    const timeStr = new Date().toLocaleTimeString("vi-VN", {
      hour: "2-digit",
      minute: "2-digit",
    });
    const msgDiv = document.createElement("div");
    msgDiv.className = `chat-msg ${sender}-msg`;

    if (sender === "user") {
      msgDiv.innerHTML = `
        <div class="msg-bubble">
          <p>${esc(content)}</p>
          <span class="msg-time">${timeStr}</span>
        </div>`;
    } else {
      msgDiv.innerHTML = `
        <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
        <div class="msg-bubble">
          ${content}
          <div class="msg-meta">
            <span class="msg-time">${timeStr}</span>
            ${metaButtons}
          </div>
        </div>`;
    }

    messagesContainer.appendChild(msgDiv);
    // Tin nhắn của user luôn cuộn xuống đáy; tin nhắn của bot không cướp vị trí nếu user đang đọc phía trên
    scrollToBottom(sender === "user");
    return msgDiv;
  }

  // Tải file JSON xuống máy tính
  function downloadJsonFile(brandData, filename) {
    const jsonStr = JSON.stringify(brandData, null, 2);
    const blob = new Blob([jsonStr], {
      type: "application/json;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  // Áp dụng trực tiếp cấu hình thương hiệu lên trang web (Live Preview)
  function liveApplyBrand(brandData) {
    try {
      // 1. Dừng ngay toàn bộ âm thanh và giọng đọc cũ
      audioState.stopSpeech();

      // 2. Chuyển URL hash về #hero để đảm bảo hiển thị đúng Hero section
      if (window.location.hash !== "#hero" && window.location.hash !== "" && window.location.hash !== "#home") {
        window.location.hash = "#hero";
      }

      // 3. Áp dụng bảng màu và giao diện mới
      applyTheme(brandData);
      renderSite(brandData);

      // 4. Cuộn mượt lên đỉnh đầu trang để xem Hero
      if (window.__lenis) {
        window.__lenis.scrollTo(0, { immediate: true });
      } else {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }

      // 5. Cập nhật tên thương hiệu trên thanh White Label Switcher nếu có
      const wlBrandNameEl = document.getElementById("wl-brand-name");
      if (wlBrandNameEl && brandData.brand) {
        wlBrandNameEl.textContent = brandData.brand.name;
      }
    } catch (err) {
      console.error("Lỗi khi áp dụng thương hiệu mới:", err);
      alert("Không thể áp dụng trực tiếp: " + err.message);
    }
  }

  // Biến lưu giữ cấu hình thương hiệu hiện tại để hỗ trợ tinh chỉnh từng phần (Section Refinement)
  let currentActiveBrandData = null;

  // ============================================================================
  // HÀM TINH CHỈNH TỪNG PHẦN THEO YÊU CẦU (LIVE SECTION CUSTOMIZER)
  // ============================================================================
  async function handleRefineSection(sectionKey, subAction = "", customPrompt = "") {
    if (!currentActiveBrandData) {
      appendMessage("Chưa có thương hiệu nào được tạo để tinh chỉnh. Vui lòng tạo thương hiệu trước!", "bot");
      return;
    }

    const brand = currentActiveBrandData;
    const sections = brand.sections || [];
    let updatedSectionName = "";
    let speechNotice = "";

    // 1. Tinh chỉnh Layout hoặc Nội dung theo sectionKey
    if (sectionKey === "hero") {
      updatedSectionName = "Trang chủ (Hero)";
      const hero = sections.find((s) => s.type === "hero");
      if (hero) {
        if (subAction === "centered") {
          hero.layout = "centered";
          speechNotice = "Đã chuyển đổi Trang chủ sang dạng căn giữa đối xứng sang trọng.";
        } else if (subAction === "split") {
          hero.layout = "split-right";
          speechNotice = "Đã chuyển đổi Trang chủ sang dạng chia đôi tương tác 3D.";
        } else if (subAction === "studio") {
          hero.layout = "voice-studio";
          speechNotice = "Đã chuyển đổi Trang chủ sang dạng bảng điều khiển Voice Studio.";
        } else if (customPrompt) {
          hero.title = customPrompt;
          speechNotice = `Đã cập nhật tiêu đề Trang chủ thành: ${customPrompt}`;
        }
      }
    } else if (sectionKey === "features") {
      updatedSectionName = "Tính năng (Features)";
      const feat = sections.find((s) => s.type === "features");
      if (feat) {
        if (subAction === "bento") {
          feat.layout = "bento";
          speechNotice = "Đã chuyển đổi Tính năng sang dạng lưới Bento Grid hiện đại.";
        } else if (subAction === "stack") {
          feat.layout = "3d-stack";
          speechNotice = "Đã chuyển đổi Tính năng sang dạng thẻ xếp tầng không gian 3D.";
        } else if (subAction === "rewrite" || customPrompt) {
          feat.title = customPrompt || `Hệ sinh thái Đột phá của ${brand.brand.name}`;
          speechNotice = "Đã làm mới nội dung các trụ cột tính năng.";
        }
      }
    } else if (sectionKey === "about") {
      updatedSectionName = "Về chúng tôi (About)";
      const ab = sections.find((s) => s.type === "about");
      if (ab) {
        if (subAction === "grid") {
          ab.layout = "grid";
          if (ab.scrollStory) ab.scrollStory.enabled = false;
          speechNotice = "Đã chuyển đổi Về chúng tôi sang dạng Lưới thống kê & Đoạn văn.";
        } else if (subAction === "story") {
          ab.layout = "sticky-story";
          if (ab.scrollStory) ab.scrollStory.enabled = true;
          speechNotice = "Đã chuyển đổi Về chúng tôi sang dạng Cuộn 3D Sticky Scroll Story.";
        } else if (customPrompt) {
          ab.title = customPrompt;
          speechNotice = `Đã cập nhật câu chuyện thương hiệu theo mong muốn của bạn.`;
        }
      }
    } else if (sectionKey === "testimonials") {
      updatedSectionName = "Đánh giá (Testimonials)";
      let testSection = sections.find((s) => s.type === "testimonials");
      if (!testSection) {
        testSection = {
          type: "testimonials",
          layout: "marquee",
          title: `Khách hàng nói gì về ${brand.brand.name}`,
          subtitle: "Những phản hồi chân thực từ đối tác và khách hàng tin chọn.",
          eyebrow: "ĐÁNH GIÁ CHÂN THỰC",
          items: getFallbackTestimonials(brand.topic, brand.brand.name),
        };
        // Chèn vào trước faq hoặc contact
        const contactIdx = sections.findIndex((s) => s.type === "contact");
        if (contactIdx >= 0) {
          sections.splice(contactIdx, 0, testSection);
        } else {
          sections.push(testSection);
        }
        speechNotice = "Đã thêm phần Đánh giá khách hàng dạng dải trượt Marquee vô tận.";
      } else {
        testSection.items = getFallbackTestimonials(brand.topic, brand.brand.name);
        speechNotice = "Đã làm mới danh sách nhận xét khách hàng.";
      }
    } else if (sectionKey === "faq") {
      updatedSectionName = "Hỏi đáp (FAQ)";
      const f = sections.find((s) => s.type === "faq");
      if (f) {
        if (subAction === "accordion") {
          f.layout = "accordion";
          speechNotice = "Đã chuyển đổi Hỏi đáp sang dạng Accordion đóng mở truyền thống.";
        } else if (subAction === "3d-flip") {
          f.layout = "3d-flip-cards";
          speechNotice = "Đã chuyển đổi Hỏi đáp sang dạng Thẻ lật 3D hai mặt.";
        }
      }
    } else if (sectionKey === "theme") {
      updatedSectionName = "Bảng màu nhận diện";
      const pal = BRAND_PALETTES[subAction] || BRAND_PALETTES.cyber;
      brand.theme.primary = pal.primary;
      brand.theme.accent = pal.accent;
      brand.theme.background = pal.background;
      brand.theme.surface = pal.surface;
      speechNotice = `Đã chuyển đổi tông màu thương hiệu sang bộ nhận diện mới.`;
    }

    // 2. Tái kiểm định và cập nhật cấu trúc
    currentActiveBrandData = enrichAndValidateBrandJson(brand, brand.topic);

    // 3. Áp dụng ngay lập tức lên trang web (Live Preview)
    liveApplyBrand(currentActiveBrandData);

    // 4. Cuộn trực tiếp và làm nổi bật section vừa chỉnh
    setTimeout(() => {
      const targetId = sectionKey === "theme" ? "hero" : sectionKey;
      const targetEl =
        document.getElementById(targetId) ||
        document.getElementById(`home-${targetId}`);
      if (targetEl) {
        targetEl.scrollIntoView({ behavior: "smooth", block: "center" });
        targetEl.classList.add("section-highlight-pulse");
        setTimeout(() => targetEl.classList.remove("section-highlight-pulse"), 2500);
      }
    }, 300);

    // 5. Đọc giọng nói phản hồi
    if (speechNotice) {
      audioState.playSpeech(speechNotice);
    }

    // 6. Gửi tin nhắn thông báo trong Chatbot
    const filename = `brand-${brand.brand.name.toLowerCase().replace(/[^a-z0-9]/g, "-")}.json`;
    const noticeHtml = `
      <div class="brand-result-box">
        <div class="brand-result-badge">
          <i class="fa-solid fa-wand-magic-sparkles"></i> Đã tinh chỉnh: ${esc(updatedSectionName)}
        </div>
        <p style="margin: 4px 0; font-size: 0.84rem; color: var(--text);">
          ${esc(speechNotice || "Đã cập nhật theo yêu cầu của bạn.")}
        </p>
        <div class="brand-actions-row" style="margin-top: 6px;">
          <button type="button" class="btn-brand-action btn-brand-download" data-filename="${filename}">
            <i class="fa-solid fa-download"></i> Tải lại file ${filename}
          </button>
        </div>
      </div>
    `;

    const msgEl = appendMessage(noticeHtml, "bot");
    const dlBtn = msgEl.querySelector(".btn-brand-download");
    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        downloadJsonFile(currentActiveBrandData, filename);
      });
    }
  }

  let isGenerating = false;

  // ============================================================================
  // XỬ LÝ GỌI GEMINI 2.5 FLASH VÀ SINH FILE JSON THƯƠNG HIỆU
  // ============================================================================
  async function handleCreateBrand({
    name,
    field,
    slogan,
    paletteKey,
    promptQuery,
  }) {
    if (isGenerating) return;
    isGenerating = true;
    if (sendBtn) {
      sendBtn.disabled = true;
      sendBtn.style.opacity = "0.5";
      sendBtn.style.cursor = "not-allowed";
    }

    try {
      // 1. Bật typing indicator
      if (typingIndicator) {
        typingIndicator.classList.add("is-active");
        if (typingText)
          typingText.innerText = "Đang khởi tạo, vui lòng chờ 20-30 giây.....";
        scrollToBottom(true);
      }

      const currentKey =
        (await loadEnvGeminiKey()) ||
        localStorage.getItem("viv_gemini_key") ||
        DEFAULT_GEMINI_KEY;
      let generatedData = null;
      let isGeminiPowered = false;

      // Chuẩn bị câu yêu cầu
      const userPrompt =
        promptQuery ||
        `Tên: ${name || ""}, Ngành nghề: ${field || ""}, Slogan: ${slogan || ""}, Tông màu: ${paletteKey || "tự động phối"}`;

      const derivedTopicHint = (field || promptQuery || name || "tech").toLowerCase();
      const curatedPhotos = getDiverseBrandPhotos(derivedTopicHint, name || "Microphone");

      // Tải và điền biến vào prompt template từ file prompt.md bên ngoài
      const promptTemplate = await loadPromptTemplate();
      const finalPrompt = interpolatePrompt(promptTemplate, {
        topic: derivedTopicHint,
        photos: curatedPhotos,
        userPrompt: userPrompt,
      });

      // Gọi Gemini AI với cơ chế tự động thử các model ổn định nhất
      if (currentKey) {
        const candidateModels = [
          "gemini-2.5-flash",
          "gemini-3.7-flash",
          "gemini-3.8-flash",
        ];

        for (const modelName of candidateModels) {
          try {
            const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${currentKey}`;
            const resp = await fetch(geminiEndpoint, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                contents: [
                  {
                    parts: [
                      {
                        text: finalPrompt,
                      },
                    ],
                  },
                ],
                generationConfig: {
                  responseMimeType: "application/json",
                },
              }),
            });

            if (resp.ok) {
              const result = await resp.json();
              let rawJson =
                result?.candidates?.[0]?.content?.parts?.[0]?.text || "";
              rawJson = rawJson
                .replace(/```json/g, "")
                .replace(/```/g, "")
                .trim();
              const parsed = JSON.parse(rawJson);
              generatedData = enrichAndValidateBrandJson(
                parsed,
                parsed.topic || derivedTopicHint || promptQuery,
              );
              isGeminiPowered = true;
              break;
            } else {
              console.warn(
                `Gemini model ${modelName} phản hồi lỗi:`,
                resp.status,
                await resp.text(),
              );
            }
          } catch (err) {
            console.warn(
              `Lỗi khi kết nối Gemini model ${modelName}:`,
              err,
            );
          }
        }
      }

      // Nếu không kết nối được Gemini (mất mạng hoặc lỗi), tự động dùng bộ sinh dự phòng nội bộ
      if (!generatedData) {
        await new Promise((r) => setTimeout(r, 650));
        const derivedName = name || extractBrandNameFromPrompt(promptQuery) || "Microphone";
        const fallback = generateBrandJsonOffline({
          name: derivedName,
          field: field || promptQuery,
          slogan: slogan,
          paletteKey: paletteKey,
        });
        generatedData = enrichAndValidateBrandJson(
          fallback,
          promptQuery || "audio",
        );
      }

      // Tắt typing indicator
      if (typingIndicator) typingIndicator.classList.remove("is-active");

      // Lưu trữ thương hiệu vừa tạo để hỗ trợ tinh chỉnh từng phần
      currentActiveBrandData = generatedData;

      const brandName = generatedData.brand.name;
      const slug =
        brandName
          .toLowerCase()
          .replace(/[^a-z0-9]/g, "-")
          .replace(/-+/g, "-") || "brand-new";
      const filename = `brand-${slug}.json`;
      const jsonString = JSON.stringify(generatedData, null, 2);

      // Thu thập các hình ảnh đã chọn để hiển thị thumbnail
      const previewImages = [];
      const featSection = generatedData.sections.find(
        (s) => s.type === "features",
      );
      if (featSection && featSection.items) {
        featSection.items.slice(0, 3).forEach((it) => {
          if (it.image) previewImages.push(it.image);
        });
      }

      // Xây dựng thẻ kết quả hiển thị trong khung chat
      const resultHtml = `
      <div class="brand-result-box">
        <div class="brand-result-badge">
          <i class="fa-solid fa-circle-check"></i> ${isGeminiPowered ? "Đã tạo bởi Gemini 2.5 Flash & Unsplash 4K" : "Đã tạo bởi Bộ sinh AI Nội bộ"}
        </div>
        <h4 class="brand-result-title">${esc(brandName)}</h4>
        <p class="brand-result-slogan"><em>"${esc(generatedData.brand.slogan)}"</em></p>
        
        <div class="brand-palette-preview">
          <span class="color-swatch" style="background: ${generatedData.theme.primary};" title="Primary: ${generatedData.theme.primary}"></span>
          <span class="color-swatch" style="background: ${generatedData.theme.accent};" title="Accent: ${generatedData.theme.accent}"></span>
          <span class="color-swatch" style="background: ${generatedData.theme.surface};" title="Surface: ${generatedData.theme.surface}"></span>
          <span class="palette-label">Tông màu: ${generatedData.theme.primary} • ${generatedData.theme.accent}</span>
        </div>

        ${previewImages.length > 0
          ? `
        <div class="brand-preview-gallery" style="display: flex; gap: 6px; margin: 6px 0;">
          ${previewImages
            .map(
              (img) => `
            <img src="${esc(img)}" alt="Brand Photo" style="width: 32%; height: 56px; object-fit: cover; border-radius: 6px; border: 1px solid rgba(255,255,255,0.15);" loading="lazy" />
          `,
            )
            .join("")}
        </div>`
          : ""
        }

        <div class="brand-policy-notice">
          <i class="fa-solid fa-shield-halved"></i> <span>Chỉ tạo file JSON <code>config/${filename}</code>. Giữ nguyên 100% mã nguồn website theo quy định tại <strong>BRAND_GENERATOR_POLICY.md</strong>.</span>
        </div>

        <!-- Khung xem trước JSON thu gọn -->
        <details class="brand-json-details">
          <summary><i class="fa-solid fa-code"></i> Xem trước mã nguồn JSON (${filename})</summary>
          <pre class="brand-json-code"><code>${esc(jsonString)}</code></pre>
        </details>

        <!-- Các nút hành động chính -->
        <div class="brand-actions-row">
          <button type="button" class="btn-brand-action btn-brand-download" data-filename="${filename}" title="Tải file JSON này về máy">
            <i class="fa-solid fa-download"></i> Tải file ${filename}
          </button>
          <button type="button" class="btn-brand-action btn-brand-apply" title="Xem trước giao diện thương hiệu này trực tiếp trên trang web">
            <i class="fa-solid fa-eye"></i> Xem trước ngay (Live Preview)
          </button>
          <button type="button" class="btn-brand-action btn-brand-copy" title="Sao chép nội dung JSON">
            <i class="fa-solid fa-copy"></i> Copy JSON
          </button>
        </div>

        <!-- Khung Tinh chỉnh riêng từng phần (Live Section Customizer) -->
        <div class="brand-refine-box" id="brand-refine-box">
          <div class="brand-refine-title">
            <i class="fa-solid fa-sliders"></i> Tinh chỉnh riêng từng phần (Bạn có thể chat hoặc bấm nút):
          </div>
          <div class="brand-refine-chips">
            <button type="button" class="btn-refine-chip" data-refine="hero"><i class="fa-solid fa-house"></i> Trang chủ</button>
            <button type="button" class="btn-refine-chip" data-refine="features"><i class="fa-solid fa-wand-magic-sparkles"></i> Tính năng</button>
            <button type="button" class="btn-refine-chip" data-refine="about"><i class="fa-solid fa-book-open"></i> Về chúng tôi</button>
            <button type="button" class="btn-refine-chip" data-refine="testimonials"><i class="fa-solid fa-star"></i> Đánh giá</button>
            <button type="button" class="btn-refine-chip" data-refine="faq"><i class="fa-solid fa-circle-question"></i> Hỏi đáp</button>
            <button type="button" class="btn-refine-chip" data-refine="theme"><i class="fa-solid fa-palette"></i> Đổi màu</button>
          </div>
          <div class="brand-refine-prompt-wrap" id="brand-refine-prompt-wrap" style="display:none;"></div>
        </div>
      </div>
    `;

      const msgElement = appendMessage(resultHtml, "bot");

      // Gắn sự kiện cho các nút hành động trong tin nhắn vừa tạo
      const dlBtn = msgElement.querySelector(".btn-brand-download");
      const applyBtn = msgElement.querySelector(".btn-brand-apply");
      const copyBtn = msgElement.querySelector(".btn-brand-copy");

      if (dlBtn) {
        dlBtn.addEventListener("click", () => {
          downloadJsonFile(currentActiveBrandData || generatedData, filename);
        });
      }

      if (applyBtn) {
        applyBtn.addEventListener("click", () => {
          liveApplyBrand(currentActiveBrandData || generatedData);
        });
      }

      if (copyBtn) {
        copyBtn.addEventListener("click", () => {
          const curJson = JSON.stringify(currentActiveBrandData || generatedData, null, 2);
          navigator.clipboard.writeText(curJson).then(() => {
            copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Đã sao chép!`;
            setTimeout(() => {
              copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy JSON`;
            }, 2000);
          });
        });
      }

      // Gắn sự kiện cho các nút tinh chỉnh từng phần
      const refineChips = msgElement.querySelectorAll(".btn-refine-chip");
      const promptWrap = msgElement.querySelector("#brand-refine-prompt-wrap");

      refineChips.forEach((chip) => {
        chip.addEventListener("click", () => {
          const rType = chip.getAttribute("data-refine");
          if (!promptWrap) return;

          promptWrap.style.display = "flex";
          if (rType === "hero") {
            promptWrap.innerHTML = `
            <span class="brand-refine-prompt-label">Chọn kiểu bố cục cho Trang chủ (Hero):</span>
            <div class="brand-refine-subactions">
              <button type="button" class="btn-subaction-chip" data-sec="hero" data-act="centered">Căn giữa đối xứng (Centered)</button>
              <button type="button" class="btn-subaction-chip" data-sec="hero" data-act="split">Chia đôi 3D (Split Right)</button>
              <button type="button" class="btn-subaction-chip" data-sec="hero" data-act="studio">Voice Studio Console</button>
            </div>
          `;
          } else if (rType === "features") {
            promptWrap.innerHTML = `
            <span class="brand-refine-prompt-label">Chọn kiểu bố cục cho Tính năng (Features):</span>
            <div class="brand-refine-subactions">
              <button type="button" class="btn-subaction-chip" data-sec="features" data-act="bento">Lưới Bento Grid</button>
              <button type="button" class="btn-subaction-chip" data-sec="features" data-act="stack">Thẻ xếp tầng 3D Stack</button>
              <button type="button" class="btn-subaction-chip" data-sec="features" data-act="rewrite">Làm mới 4 tính năng</button>
            </div>
          `;
          } else if (rType === "about") {
            promptWrap.innerHTML = `
            <span class="brand-refine-prompt-label">Chọn kiểu bố cục cho Về chúng tôi (About):</span>
            <div class="brand-refine-subactions">
              <button type="button" class="btn-subaction-chip" data-sec="about" data-act="grid">Lưới Thống Kê & Ảnh (Grid)</button>
              <button type="button" class="btn-subaction-chip" data-sec="about" data-act="story">Cuộn 3D Sticky Scroll Story</button>
            </div>
          `;
          } else if (rType === "testimonials") {
            promptWrap.innerHTML = `
            <span class="brand-refine-prompt-label">Tùy biến phần Đánh giá khách hàng:</span>
            <div class="brand-refine-subactions">
              <button type="button" class="btn-subaction-chip" data-sec="testimonials" data-act="refresh">Làm mới các đánh giá</button>
            </div>
          `;
          } else if (rType === "faq") {
            promptWrap.innerHTML = `
            <span class="brand-refine-prompt-label">Chọn kiểu bố cục cho Hỏi đáp (FAQ):</span>
            <div class="brand-refine-subactions">
              <button type="button" class="btn-subaction-chip" data-sec="faq" data-act="accordion">Accordion Danh sách</button>
              <button type="button" class="btn-subaction-chip" data-sec="faq" data-act="3d-flip">Thẻ lật 3D hai mặt</button>
            </div>
          `;
          } else if (rType === "theme") {
            promptWrap.innerHTML = `
            <span class="brand-refine-prompt-label">Chọn bảng màu nhận diện thương hiệu:</span>
            <div class="brand-refine-subactions">
              <button type="button" class="btn-subaction-chip" data-sec="theme" data-act="amber">Hổ phách & Nâu ấm (Ẩm thực)</button>
              <button type="button" class="btn-subaction-chip" data-sec="theme" data-act="medical">Xanh Y tế & Cyan (Nha khoa)</button>
              <button type="button" class="btn-subaction-chip" data-sec="theme" data-act="luxury">Vàng Champagne (Thời trang)</button>
              <button type="button" class="btn-subaction-chip" data-sec="theme" data-act="cyber">Xanh Lục bảo (Cyber / Game)</button>
              <button type="button" class="btn-subaction-chip" data-sec="theme" data-act="data">Indigo & Cyan (Tech / SaaS)</button>
              <button type="button" class="btn-subaction-chip" data-sec="theme" data-act="purple">Tím Violet (Giáo dục)</button>
            </div>
          `;
          }

          // Bắt sự kiện bấm vào nút subaction
          promptWrap.querySelectorAll(".btn-subaction-chip").forEach((btn) => {
            btn.addEventListener("click", () => {
              const sec = btn.getAttribute("data-sec");
              const act = btn.getAttribute("data-act");
              handleRefineSection(sec, act);
            });
          });

          scrollToBottom();
        });
      });
    } catch (err) {
      console.error("Lỗi khi tạo thương hiệu:", err);
      appendMessage("Có lỗi xảy ra khi tạo thương hiệu. Vui lòng thử lại!", "bot");
    } finally {
      if (typingIndicator) typingIndicator.classList.remove("is-active");
      isGenerating = false;
      if (sendBtn) {
        sendBtn.disabled = false;
        sendBtn.style.opacity = "";
        sendBtn.style.cursor = "pointer";
      }
      if (input) input.focus();
    }
  }

  // ============================================================================
  // TÍCH HỢP MICROPHONE NHẬN DIỆN GIỌNG NÓI (SPEECH-TO-TEXT)
  // ============================================================================
  const micBtn = document.getElementById("ai-chat-mic");
  if (micBtn && input) {
    const SpeechRec =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRec) {
      const recognition = new SpeechRec();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = "vi-VN";
      let isRecording = false;

      recognition.onstart = () => {
        isRecording = true;
        micBtn.classList.add("is-recording");
        input.placeholder = "Đang lắng nghe giọng nói của bạn...";
      };

      recognition.onresult = (evt) => {
        const transcript = Array.from(evt.results)
          .map((r) => r[0].transcript)
          .join("");
        input.value = transcript;
      };

      recognition.onerror = (evt) => {
        console.warn("Speech recognition error:", evt.error);
        isRecording = false;
        micBtn.classList.remove("is-recording");
        input.placeholder = "Nhập mong muốn hoặc bấm mic để nói...";
      };

      recognition.onend = () => {
        isRecording = false;
        micBtn.classList.remove("is-recording");
        input.placeholder = "Nhập mong muốn hoặc bấm mic để nói...";
        if (input.value.trim()) {
          input.focus();
        }
      };

      micBtn.addEventListener("click", () => {
        if (isRecording) {
          recognition.stop();
        } else {
          try {
            recognition.start();
          } catch (err) {
            console.warn("Speech recognition start error:", err);
          }
        }
      });
    } else {
      micBtn.addEventListener("click", () => {
        alert(
          "Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech API (khuyên dùng Chrome hoặc Edge).",
        );
      });
    }
  }

  // ============================================================================
  // SỰ KIỆN GỬI YÊU CẦU & CHỌN THẺ Ý TƯỞNG
  // ============================================================================

  // 1. Gửi tin nhắn tự do từ ô input (Hỗ trợ cả yêu cầu tạo mới lẫn tinh chỉnh bằng ngôn ngữ tự nhiên)
  const handleUserSubmit = () => {
    if (isGenerating) return;
    if (!input) return;

    const val = input.value.trim();
    if (!val) return;

    appendMessage(val, "user");
    input.value = "";
    scrollToBottom(true);

    const lowerVal = val.toLowerCase();

    // Kiểm tra nếu người dùng có ý định tạo thương hiệu mới:
    const isCreateIntent =
      lowerVal.startsWith("tạo") ||
      lowerVal.startsWith("làm") ||
      lowerVal.startsWith("muốn tạo") ||
      lowerVal.startsWith("hãy tạo") ||
      lowerVal.startsWith("khởi tạo") ||
      lowerVal.startsWith("xây dựng") ||
      lowerVal.startsWith("thiết kế") ||
      lowerVal.includes("brand mới") ||
      lowerVal.includes("thương hiệu mới") ||
      lowerVal.includes("tạo brand") ||
      lowerVal.includes("tạo thương hiệu") ||
      lowerVal.includes("tạo một") ||
      lowerVal.includes("làm một");

    // Chỉ thực hiện tinh chỉnh nhanh nếu ĐÃ có brand VÀ người dùng KHÔNG có ý định tạo brand mới
    if (currentActiveBrandData && !isCreateIntent) {
      if (lowerVal.includes("bento")) {
        handleRefineSection("features", "bento");
        return;
      }
      if (lowerVal.includes("stack") || lowerVal.includes("xếp tầng")) {
        handleRefineSection("features", "stack");
        return;
      }
      if (lowerVal.includes("căn giữa") || lowerVal.includes("centered")) {
        handleRefineSection("hero", "centered");
        return;
      }
      if (lowerVal.includes("chia đôi") || lowerVal.includes("split")) {
        handleRefineSection("hero", "split");
        return;
      }
      if (lowerVal.includes("studio")) {
        handleRefineSection("hero", "studio");
        return;
      }
      if (lowerVal.includes("accordion")) {
        handleRefineSection("faq", "accordion");
        return;
      }
      if (lowerVal.includes("thẻ lật") || lowerVal.includes("flip")) {
        handleRefineSection("faq", "3d-flip");
        return;
      }
      if (lowerVal.includes("thêm đánh giá") || lowerVal.includes("review") || lowerVal.includes("nhận xét")) {
        handleRefineSection("testimonials", "refresh");
        return;
      }
      if (lowerVal.includes("đổi màu") || lowerVal.includes("tông màu")) {
        if (lowerVal.includes("xanh") || lowerVal.includes("lục")) {
          handleRefineSection("theme", "cyber");
        } else if (lowerVal.includes("vàng") || lowerVal.includes("amber")) {
          handleRefineSection("theme", "amber");
        } else if (lowerVal.includes("tím")) {
          handleRefineSection("theme", "purple");
        } else if (lowerVal.includes("hồng") || lowerVal.includes("rose")) {
          handleRefineSection("theme", "luxury");
        } else {
          handleRefineSection("theme", "data");
        }
        return;
      }
    }

    // Ngược lại, tạo thương hiệu mới
    handleCreateBrand({ promptQuery: val });
  };

  if (form) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      handleUserSubmit();
    });
  }

  if (sendBtn) {
    sendBtn.addEventListener("click", (e) => {
      e.preventDefault();
      handleUserSubmit();
    });
  }

  if (input) {
    input.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleUserSubmit();
      }
    });
  }
}
