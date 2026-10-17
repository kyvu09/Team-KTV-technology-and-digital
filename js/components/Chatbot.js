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
        <button type="button" class="callout-mic-btn" id="ai-callout-mic-start" title="Nói chuyện trực tiếp với AI bằng giọng nói">
          <i class="fa-solid fa-microphone"></i> Nói chuyện
        </button>
        <button type="button" class="callout-close" id="ai-callout-close" aria-label="Đóng gợi ý">&times;</button>
      </div>

      <!-- Khung hiển thị chế độ hội thoại giọng nói trực tiếp với Icon AI khi khung chat ẩn -->
      <div class="ai-voice-bubble" id="ai-voice-bubble" style="display: none;" aria-live="polite">
        <div class="voice-bubble-header">
          <div class="voice-bubble-status">
            <span class="voice-status-dot"></span>
            <span class="voice-status-text" id="ai-voice-status-text">Đang lắng nghe...</span>
          </div>
          <div class="voice-bubble-tools">
            <button type="button" class="voice-tool-btn" id="ai-voice-btn-chat" title="Mở khung chat đầy đủ">
              <i class="fa-solid fa-message"></i> Mở chat
            </button>
            <button type="button" class="voice-tool-btn voice-tool-close" id="ai-voice-btn-close" title="Tắt chế độ giọng nói">
              <i class="fa-solid fa-xmark"></i>
            </button>
          </div>
        </div>
        <div class="voice-bubble-content" id="ai-voice-bubble-content">
          <p class="voice-bubble-hint">
            <i class="fa-solid fa-microphone-lines"></i> Hãy nói yêu cầu của bạn (Ví dụ: <em>"Tạo thương hiệu trà sữa Boba"</em>, <em>"Đổi sang giao diện Studio"</em>...)
          </p>
        </div>
      </div>

      <button type="button" class="ai-chat-trigger-btn btn-magnetic" id="ai-chat-toggle" aria-expanded="false" aria-label="Mở Trợ lý AI tạo thương hiệu">
        <!-- Vòng sóng âm thanh tỏa ra nhịp nhàng khi AI đang nói / đang nghe -->
        <span class="voice-ripple-ring ring-1"></span>
        <span class="voice-ripple-ring ring-2"></span>

        <div class="trigger-orb">
          <i class="fa-solid fa-wand-magic-sparkles trigger-icon-open"></i>
          <i class="fa-solid fa-xmark trigger-icon-close"></i>
          <i class="fa-solid fa-microphone trigger-icon-mic"></i>
          <!-- Sóng âm thanh nhấp nhô (voice wave bars) khi AI đang nói -->
          <div class="trigger-voice-wave" aria-hidden="true">
            <span class="voice-bar bar-1"></span>
            <span class="voice-bar bar-2"></span>
            <span class="voice-bar bar-3"></span>
            <span class="voice-bar bar-4"></span>
          </div>
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
          <div>
            <h3 class="chat-header-title">AI hỗ trợ tạo thương hiệu</h3>
            <div class="chat-speaking-badge" id="ai-speaking-badge" style="display: none;">
              <span class="badge-wave-bar bar-1"></span>
              <span class="badge-wave-bar bar-2"></span>
              <span class="badge-wave-bar bar-3"></span>
              <span class="badge-text">AI đang nói...</span>
            </div>
          </div>
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
// BẢNG TÊN THƯƠNG HIỆU MẶC ĐỊNH & HÀM NHẬN DIỆN NGÀNH NGHỀ THÔNG MINH
// ============================================================================
export const DEFAULT_BRAND_NAMES = {
  coffee: "Arabica Roastery",
  bakery: "BonAppetit Bakery",
  fashion: "LuxeAura Fashion",
  dental: "Shining Smile Dental",
  medical: "CarePlus Clinic",
  fitness: "IronFit Gym & Fitness",
  realestate: "PrimeLand Real Estate",
  edtech: "EduSpeak English",
  hotel: "Aurora Grand Hotel & Resort",
  logistics: "SwiftLogistics Express",
  pet: "PawPaws Pet Care",
  eco: "GreenFarm Organic",
  gaming: "CyberPulse Gaming",
  finance: "FinTech Core",
  callcenter: "OmniClarity CSKH",
  audio: "ViVoice Studio",
  tech: "NovaTech AI",
};

export function toTitleCase(str = "") {
  return str
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function detectIndustryTopic(rawText = "") {
  const key = (rawText || "").toLowerCase();

  // 1. Cà phê
  if (
    key.includes("cà phê") ||
    key.includes("coffee") ||
    key.includes("cafe") ||
    key.includes("espresso") ||
    key.includes("capuchino") ||
    key.includes("cappuccino")
  ) {
    return "coffee";
  }

  // 2. Tiệm bánh, Trà sữa, Ẩm thực, Nhà hàng, F&B
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
    return "bakery";
  }

  // 3. Thời trang, Spa, Mỹ phẩm, Làm đẹp, Luxury
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
    key.includes("son môi") ||
    key.includes("skincare") ||
    key.includes("luxeaura")
  ) {
    return "fashion";
  }

  // 4. Nha khoa, Răng hàm mặt
  if (
    key.includes("nha khoa") ||
    key.includes("dental") ||
    key.includes("răng") ||
    key.includes("niềng răng") ||
    key.includes("nụ cười")
  ) {
    return "dental";
  }

  // 5. Y tế, Bệnh viện, Bác sĩ, Phòng khám, Dược phẩm
  if (
    key.includes("y tế") ||
    key.includes("bệnh") ||
    key.includes("bác sĩ") ||
    key.includes("medical") ||
    key.includes("clinic") ||
    key.includes("phòng khám") ||
    key.includes("thuốc") ||
    key.includes("dược") ||
    key.includes("sức khỏe") ||
    key.includes("careplus")
  ) {
    return "medical";
  }

  // 6. Gym, Thể thao, Fitness, Yoga
  if (
    key.includes("fitness") ||
    key.includes("gym") ||
    key.includes("thể thao") ||
    key.includes("yoga") ||
    key.includes("workout") ||
    key.includes("thể hình") ||
    key.includes("pilates") ||
    key.includes("ironfit")
  ) {
    return "fitness";
  }

  // 7. Bất động sản, Nhà đất
  if (
    key.includes("bất động sản") ||
    key.includes("nhà đất") ||
    key.includes("căn hộ") ||
    key.includes("chung cư") ||
    key.includes("biệt thự") ||
    key.includes("realestate") ||
    key.includes("property") ||
    key.includes("địa ốc") ||
    key.includes("primeland")
  ) {
    return "realestate";
  }

  // 8. Giáo dục, Khóa học, Trường học, Ngoại ngữ
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
    return "edtech";
  }

  // 9. Khách sạn, Resort, Du lịch, Homestay
  if (
    key.includes("khách sạn") ||
    key.includes("hotel") ||
    key.includes("resort") ||
    key.includes("du lịch") ||
    key.includes("nghỉ dưỡng") ||
    key.includes("tour") ||
    key.includes("homestay") ||
    key.includes("travel")
  ) {
    return "hotel";
  }

  // 10. Logistics, Vận chuyển, Giao hàng, Kho vận
  if (
    key.includes("logistics") ||
    key.includes("vận chuyển") ||
    key.includes("giao hàng") ||
    key.includes("kho vận") ||
    key.includes("chuyển phát") ||
    key.includes("ship") ||
    key.includes("swiftlogistics")
  ) {
    return "logistics";
  }

  // 11. Thú cưng, Thú y
  if (
    key.includes("thú cưng") ||
    key.includes("pet") ||
    key.includes("chó") ||
    key.includes("mèo") ||
    key.includes("thú y") ||
    key.includes("pawpaws")
  ) {
    return "pet";
  }

  // 12. Nông nghiệp, Môi trường, Hữu cơ
  if (
    key.includes("nông nghiệp") ||
    key.includes("môi trường") ||
    key.includes("sinh thái") ||
    key.includes("hữu cơ") ||
    key.includes("organic") ||
    key.includes("eco") ||
    key.includes("cây trồng") ||
    key.includes("xanh") ||
    key.includes("greenfarm")
  ) {
    return "eco";
  }

  // 13. Game, Esports, Metaverse
  if (
    key.includes("game") ||
    key.includes("gaming") ||
    key.includes("esport") ||
    key.includes("metaverse") ||
    key.includes("vr") ||
    key.includes("cybertone") ||
    key.includes("cyberpulse")
  ) {
    return "gaming";
  }

  // 14. Tài chính, Ngân hàng, Fintech, Đầu tư
  if (
    key.includes("tài chính") ||
    key.includes("ngân hàng") ||
    key.includes("finance") ||
    key.includes("đầu tư") ||
    key.includes("chứng khoán") ||
    key.includes("fintech") ||
    key.includes("tiền tệ")
  ) {
    return "finance";
  }

  // 15. CSKH, Tổng đài, Call Center
  if (
    key.includes("cskh") ||
    key.includes("tổng đài") ||
    key.includes("call center") ||
    key.includes("callcenter") ||
    key.includes("hotline") ||
    key.includes("chăm sóc khách hàng") ||
    key.includes("omniclarity")
  ) {
    return "callcenter";
  }

  // 16. Âm thanh, Giọng nói, Podcast, Thu âm
  if (
    key.includes("âm thanh") ||
    key.includes("giọng nói") ||
    key.includes("voice") ||
    key.includes("audio") ||
    key.includes("thu âm") ||
    key.includes("podcast") ||
    key.includes("phòng thu") ||
    key.includes("vivoice")
  ) {
    return "audio";
  }

  return "tech"; // Mặc định SaaS / Công nghệ số
}

// ============================================================================
// HÀM TRÍCH XUẤT TÊN THƯƠNG HIỆU TỰ ĐỘNG TỪ YÊU CẦU NGƯỜI DÙNG
// ============================================================================
export function extractBrandNameFromPrompt(text = "", topicHint = "") {
  const detected = detectIndustryTopic(text || topicHint);
  if (!text) {
    return DEFAULT_BRAND_NAMES[detected] || "NovaTech AI";
  }

  // 1. Khớp theo mẫu "tên là X" hoặc "tên: X" hoặc "tên X"
  let m = text.match(/tên\s*(?:là|:|\s)\s*([A-Za-z0-9_\sÀ-ỹ]+)/i);
  if (m && m[1].trim()) {
    const raw = m[1].trim().split(/[,.!?]/)[0].trim();
    if (raw && raw.length > 1) return toTitleCase(raw);
  }

  // 2. Khớp theo cụm "thương hiệu [ngành nghề] [Tên]"
  const indPrefix = /(?:thương hiệu|brand|quán|tiệm|phòng|trung tâm|cửa hàng|studio)\s+(?:về\s+)?(?:phòng thu âm|thu âm|âm thanh|nông sản hữu cơ|nông nghiệp hữu cơ|nông sản sạch|nông sản|hữu cơ|nông nghiệp|tổng đài cskh|tổng đài|cskh|call center|logistics vận chuyển|vận chuyển|logistics|giao hàng|công nghệ saas|công nghệ phần mềm|công nghệ|phần mềm saas|phần mềm|trà sữa|tiệm bánh|bánh ngọt|quán cà phê|cà phê|cafe|coffee|phòng gym|gym fitness|gym|fitness|nha khoa|răng|thời trang|spa|mỹ phẩm|làm đẹp|du lịch nghỉ dưỡng|khách sạn resort|khách sạn|resort|du lịch|nghỉ dưỡng|thú cưng|bất động sản|nhà đất|tiếng anh|ngoại ngữ|giáo dục|tài chính|ngân hàng|chứng khoán|game|gaming)\s+([A-Za-z0-9_\sÀ-ỹ]+)/i;
  m = text.match(indPrefix);
  if (m && m[1].trim()) {
    const raw = m[1].trim().split(/[,.!?]/)[0].trim();
    const stopCheck = raw.toLowerCase().split(/\s+/)[0];
    const invalidFirstWords = ["cho", "về", "mới", "này", "một", "nào", "của", "giúp", "gì", "tự", "cao", "nghỉ", "dưỡng", "quốc", "tế", "thủ", "công", "sạch", "đẹp"];
    if (!invalidFirstWords.includes(stopCheck) && raw.length > 1) {
      return toTitleCase(raw);
    }
  }

  // 3. Khớp theo từ viết hoa dạng CamelCase (BobaMaster, BonAppetit, ClipVoice, LuxeAura...)
  m = text.match(/\b([A-Z][a-z]+[A-Z][a-zA-Z0-9]*)\b/);
  if (m && m[1].trim()) {
    return m[1].trim();
  }

  // 4. Khớp cụm từ viết hoa tiếng Anh / tên riêng (ví dụ "Arabica Roastery", "CyberCore", "ZenFlow")
  const stopWords = new Set(["Việt", "Nam", "Pháp", "Mỹ", "Đài", "Loan", "Nhật", "Hàn", "Trung", "Quốc", "Anh"]);
  const capitalMatches = text.match(/\b([A-Z][a-zA-Z0-9]+(?:\s+[A-Z][a-zA-Z0-9]+)*)\b/g);
  if (capitalMatches) {
    for (const word of capitalMatches) {
      const parts = word.split(/\s+/);
      if (!parts.every((p) => stopWords.has(p)) && word.length > 2) {
        return word.trim();
      }
    }
  }

  // 5. Khớp theo cụm "brand X", "thương hiệu X"
  m = text.match(/(?:brand|thương hiệu)\s+([A-Za-z0-9_À-ỹ]+(?:\s+[A-Za-z0-9_À-ỹ]+)?)/i);
  if (m && m[1].trim()) {
    const raw = m[1].trim();
    const firstWord = raw.split(/\s+/)[0].toLowerCase();
    if (!["cho", "về", "mới", "này", "một", "nào", "của", "giúp", "gì", "tự"].includes(firstWord)) {
      return toTitleCase(raw);
    }
  }

  // 6. Mặc định trả về tên thương hiệu tiêu biểu chuẩn theo ngành nghề thay vì "Microphone"
  return DEFAULT_BRAND_NAMES[detected] || "NovaTech AI";
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
// HÀM SINH DỰ PHÒNG NỘI BỘ (ĐỒNG BỘ 100% NỘI DUNG THEO 17 NGÀNH NGHỀ)
// ============================================================================
export const INDUSTRY_TEMPLATES = {
  coffee: {
    defaultName: "Arabica Roastery",
    defaultField: "Không gian Cà phê thủ công & Đồ uống sáng tạo",
    defaultSlogan: "Hương vị cà phê nguyên bản từ nông trại cao nguyên Cầu Đất",
    paletteKey: "amber",
    fontHeading: "Playfair Display",
    radius: "20px",
    hero: {
      layout: "centered",
      title: "Hương vị cà phê nguyên bản & Không gian kết nối tại",
      rotatingWords: ["tách Espresso đậm đà", "hạt Robusta chọn lọc", "không gian mộc mạc"],
      subtitle: (name) => `${name} mang đến trải nghiệm cà phê mộc hảo hạng, tuyển chọn từ những quả cà phê chín mọng tại Cầu Đất cùng không gian thư giãn lý tưởng dành cho bạn.`,
      playSample: (name) => `Chào mừng bạn ghé thăm ${name}! Hãy cùng chúng tôi đánh thức mọi giác quan bằng một tách cà phê thơm nồng được pha chế từ những hạt cà phê mộc hảo hạng nhất.`,
      buttons: [{ href: "#features", label: "Thực đơn cà phê", style: "primary" }, { href: "#contact", label: "Liên hệ đặt bàn", style: "secondary" }],
    },
    features: {
      title: "Tinh Hoa Cà Phê Mộc Thủ Công",
      subtitle: (name) => `Từng tách cà phê tại ${name} là sự kết hợp hoàn hảo giữa nông sản Việt Nam chọn lọc và kỹ thuật pha chế tinh tế.`,
      items: [
        { badge: "01 / HẠT CHỌN LỌC", icon: "fa-solid fa-seedling", title: "Hạt Cà Phê Mộc Cầu Đất", desc: "100% tuyển chọn từ nông trại Cầu Đất ở độ cao 1.500m, rang mộc giữ trọn tầng hương phong phú." },
        { badge: "02 / PHA CHẾ THỦ CÔNG", icon: "fa-solid fa-mug-hot", title: "Nghệ Thuật Barista Chuyên Nghiệp", desc: "Từ Espresso chuẩn Ý đến cà phê phin truyền thống đậm vị Việt, chuẩn chỉnh từng giọt." },
        { badge: "03 / KHÔNG GIAN MỘC", icon: "fa-solid fa-couch", title: "Không Gian Làm Việc & Gặp Gỡ", desc: "Bàn làm việc rộng rãi, wifi tốc độ cao và ánh sáng tự nhiên dịu nhẹ cho cảm hứng sáng tạo." },
        { badge: "04 / BÁNH TƯƠI MỖI SÁNG", icon: "fa-solid fa-cake-candles", title: "Thực Đơn Bánh & Đồ Uống Tươi", desc: "Bánh ngọt thủ công nướng mới mỗi sáng, kết hợp hoàn hảo cùng các món trà và cà phê sáng tạo." },
      ]
    },
    about: {
      eyebrow: "CÂU CHUYỆN THƯƠNG HIỆU",
      title: "Hành trình gìn giữ hương vị cà phê đích thực",
      subtitle: (name) => `${name} khởi nguồn từ tình yêu sâu đậm với những hạt cà phê Việt Nam chất lượng cao.`,
      slides: [
        { eyebrow: "01 / NGUỒN GỐC", title: "Tuyển chọn từ nông trại Cầu Đất", description: "Từng quả cà phê chín mọng được hái thủ công, sơ chế tự nhiên giữ trọn vị ngọt mật.", metric: { value: "100%", label: "Nguyên chất" } },
        { eyebrow: "02 / NGHỆ NHÂN", title: "Rang mộc lưu giữ trọn vị tinh túy", description: "Quy trình rang xay tỉ mỉ kiểm soát nhiệt độ nghiêm ngặt tạo nên tầng hương thơm nồng nàn.", metric: { value: "99.8%", label: "Hài lòng" } },
        { eyebrow: "03 / KẾT NỐI", title: "Không gian gắn kết những câu chuyện", description: "Nơi bạn tìm thấy sự bình yên giữa nhịp sống bận rộn, thưởng thức cà phê cùng bạn bè.", metric: { value: "20,000+", label: "Tách cà phê/tháng" } },
      ],
      paragraphs: (name) => [
        `${name} ra đời từ niềm đam mê đem đến cho thực khách những ly cà phê nguyên chất, chuẩn vị từ nông trại đến tách cà phê.`,
        "Chúng tôi tin rằng cà phê ngon không chỉ đánh thức giác quan mà còn là nhịp cầu gắn kết những ý tưởng và câu chuyện đẹp mỗi ngày.",
      ],
      stats: [{ value: "100%", label: "Nguyên liệu tự nhiên" }, { value: "99.8%", label: "Khách hàng hài lòng" }, { value: "20,000+", label: "Tách cà phê / tháng" }],
      badge: { icon: "fa-solid fa-award", value: "Top 1", label: "Cà phê mộc nguyên bản 2026" },
    },
    faq: {
      title: "Câu Hỏi Thường Gặp",
      subtitle: (name) => `Giải đáp những thắc mắc phổ biến về nguồn gốc hạt cà phê và dịch vụ tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Nguyên liệu", icon: "fa-solid fa-seedling", question: "Cà phê có sử dụng hương liệu hay chất tạo màu không?", answer: "Hoàn toàn không. 100% hạt cà phê mộc nguyên chất, không tẩm bơ, hương liệu hay hóa chất công nghiệp." },
        { id: "faq-2", badge: "02", category: "Sản phẩm", icon: "fa-solid fa-box", question: "Quán có bán hạt cà phê đóng gói mang về tự pha không?", answer: "Có. Chúng tôi cung cấp cà phê hạt nguyên chất và hỗ trợ xay mịn miễn phí theo dụng cụ pha chế tại nhà của bạn." },
        { id: "faq-3", badge: "03", category: "Không gian", icon: "fa-solid fa-wifi", question: "Quán có chỗ ngồi làm việc yên tĩnh và wifi mạnh không?", answer: "Có. Toàn bộ các bàn đều có ổ cắm điện, wifi cáp quang tốc độ cao và bàn ghế thiết kế công thái học thoải mái." },
        { id: "faq-4", badge: "04", category: "Đặt bàn", icon: "fa-solid fa-calendar-check", question: "Tôi có thể đặt bàn trước cho nhóm đông người không?", answer: "Có. Bạn có thể gọi hotline hoặc để lại thông tin đặt bàn trước qua website để được chuẩn bị chỗ chu đáo nhất." },
      ]
    },
    contact: {
      title: (name) => `Ghé Thăm & Kết Nối Cùng ${name}`,
      channels: [
        { label: "Hotline", value: "1900 6868 (07:00 - 22:30)" },
        { label: "Email", value: (slug) => `hello@${slug}.vn` },
        { label: "Địa chỉ", value: "Không gian Cà phê Trung tâm, Hà Nội / TP.HCM" },
      ],
      formTitle: "Để lại lời nhắn / Đặt bàn trước",
      formMessage: (name) => `Số lượng người hoặc nhu cầu đặt bàn tại ${name}...`,
      formButton: "Gửi yêu cầu đặt bàn",
    }
  },

  bakery: {
    defaultName: "BonAppetit Bakery",
    defaultField: "Tiệm Bánh Ngọt Thủ Công Pháp & Trà Trái Cây Tươi",
    defaultSlogan: "Vị ngọt thanh tao từ nguyên liệu tự nhiên hảo hạng",
    paletteKey: "amber",
    fontHeading: "Playfair Display",
    radius: "20px",
    hero: {
      layout: "centered",
      title: "Bánh tươi nướng mới mỗi ngày & Vị ngọt thanh tao tại",
      rotatingWords: ["Croissant giòn rụm", "trà búp non thơm ngát", "tráng miệng thủ công"],
      subtitle: (name) => `${name} mang đến những chiếc bánh ngọt thủ công nướng mới mỗi sáng từ bơ Pháp hảo hạng cùng menu trà hoa quả tươi thanh mát.`,
      playSample: (name) => `Chào mừng bạn đến với ${name}! Cùng cảm nhận mùi thơm bơ sữa quyến rũ lan tỏa từ những mẻ bánh nướng giòn rụm vừa ra lò sáng nay.`,
      buttons: [{ href: "#features", label: "Menu bánh & trà", style: "primary" }, { href: "#contact", label: "Đặt bánh giao tận nơi", style: "secondary" }],
    },
    features: {
      title: "Hương Vị Bánh Nướng Thủ Công Pháp",
      subtitle: (name) => `Từng mẻ bánh tại ${name} được chế biến tỉ mỉ từ nguyên liệu hảo hạng nhất nhập khẩu trực tiếp từ châu Âu.`,
      items: [
        { badge: "01 / BƠ PHÁP HẢO HẠNG", icon: "fa-solid fa-bread-slice", title: "Bột Mì & Bơ Tươi Nhập Khẩu", desc: "100% bơ lạt nguyên chất từ Pháp tạo nên những lớp vỏ bánh ngàn lớp giòn tan và thơm ngậy." },
        { badge: "02 / NƯỚNG MỚI MỖI SÁNG", icon: "fa-solid fa-fire-burner", title: "Nướng Tươi Mới Theo Mẻ", desc: "Bánh ra lò đúng 7:30 sáng và 14:00 chiều mỗi ngày, tuyệt đối không bán bánh cũ qua đêm." },
        { badge: "03 / TRÀ BÚP NON TƯƠI", icon: "fa-solid fa-leaf", title: "Trà Trái Cây & Trân Châu Tươi", desc: "Trà ủ lạnh kết hợp trái cây nhiệt đới mọng nước và trân châu thủ công dai mềm tự nhiên." },
        { badge: "04 / SET BÁNH TIỆC TRÀ", icon: "fa-solid fa-cake-candles", title: "Bánh Sinh Nhật & Bánh Sự Kiện", desc: "Thiết kế bánh kem nghệ thuật theo yêu cầu riêng, mẫu mã tinh tế sang trọng cho mọi dịp đặc biệt." },
      ]
    },
    about: {
      eyebrow: "CÂU CHUYỆN LÀM BÁNH",
      title: "Nghệ thuật làm bánh thủ công bằng cả trái tim",
      subtitle: (name) => `${name} ra đời với khát vọng chia sẻ niềm hạnh phúc ngọt ngào qua từng chiếc bánh nướng thơm lành.`,
      slides: [
        { eyebrow: "01 / TINH HOA", title: "Nguyên liệu tự nhiên thượng hạng", description: "Bơ tươi, vani Madagascar và sô-cô-la Bỉ nguyên chất không phụ gia bảo quản.", metric: { value: "100%", label: "Tươi mới" } },
        { eyebrow: "02 / NGHỆ NHÂN", title: "Bàn tay thợ làm bánh kỳ cựu", description: "Kỹ thuật cán bột ngàn lớp chuẩn mực mang lại cấu trúc giòn xốp hoàn hảo.", metric: { value: "15+ năm", label: "Kinh nghiệm" } },
        { eyebrow: "03 / CHIA SẺ", title: "Khoảnh khắc ngọt ngào ấm áp", description: "Điểm hẹn lý tưởng cho những buổi trò chuyện thân mật bên ly trà chiều thanh khiết.", metric: { value: "10,000+", label: "Ổ bánh / tháng" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi trân trọng từng phút giây làm bánh như một tác phẩm nghệ thuật thủ công đầy cảm xúc.`,
        "Sự hài lòng và nụ cười rạng rỡ của bạn khi thưởng thức vị bánh giòn tan chính là niềm hạnh phúc lớn nhất của đội ngũ chúng tôi.",
      ],
      stats: [{ value: "100%", label: "Nguyên liệu tự nhiên" }, { value: "0%", label: "Chất bảo quản" }, { value: "10,000+", label: "Khách hàng thân thiết" }],
      badge: { icon: "fa-solid fa-heart", value: "Artisan", label: "Tiệm bánh thủ công tiêu biểu 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Khách Hàng",
      subtitle: (name) => `Những câu hỏi thường gặp về cách đặt bánh và giao hàng tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Đặt bánh", icon: "fa-solid fa-calendar", question: "Đặt bánh sinh nhật trước bao lâu là tốt nhất?", answer: "Bạn nên đặt trước từ 1 - 2 ngày để đội ngũ thợ bánh chuẩn bị mẫu trang trí tỉ mỉ và nguyên liệu tươi ngon nhất." },
        { id: "faq-2", badge: "02", category: "Bảo quản", icon: "fa-solid fa-snowflake", question: "Bánh tươi bảo quản được trong bao lâu?", answer: "Nên dùng trong ngày để thưởng thức trọn vẹn độ giòn xốp. Nếu để ngăn mát tủ lạnh, bạn có thể bảo quản trong 2-3 ngày." },
        { id: "faq-3", badge: "03", category: "Giao hàng", icon: "fa-solid fa-truck-fast", question: "Tiệm có giao hàng tận nơi không?", answer: "Có. Chúng tôi sử dụng hộp giữ nhiệt chuyên dụng để bánh đến tay bạn luôn nguyên vẹn và thơm ngon." },
        { id: "faq-4", badge: "04", category: "Ăn kiêng", icon: "fa-solid fa-shield-heart", question: "Tiệm có dòng bánh ít đường hoặc Keto không?", answer: "Có. Chúng tôi có riêng dòng bánh sử dụng đường ăn kiêng Isomalt và bột hạnh nhân dành cho người ăn kiêng, tiểu đường." },
      ]
    },
    contact: {
      title: (name) => `Đặt Bánh & Giao Tận Nơi Cùng ${name}`,
      channels: [
        { label: "Hotline đặt bánh", value: "1900 6868 (07:30 - 21:30)" },
        { label: "Email", value: (slug) => `order@${slug}.vn` },
        { label: "Cửa hàng", value: "Khu Phố Ẩm Thực Trung Tâm, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đặt bánh kem / Yêu cầu tiệc trà",
      formMessage: (name) => `Loại bánh, số lượng hoặc lời nhắn viết lên bánh tại ${name}...`,
      formButton: "Gửi đơn đặt bánh ngay",
    }
  },

  fashion: {
    defaultName: "LuxeAura Fashion",
    defaultField: "Thời trang Thiết kế Đương đại & Bộ sưu tập Cao cấp",
    defaultSlogan: "Tôn vinh khí chất thanh lịch và vẻ đẹp vượt thời gian",
    paletteKey: "luxury",
    fontHeading: "Playfair Display",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Ngôn ngữ thiết kế tối giản tôn vinh khí chất tại",
      rotatingWords: ["lụa tơ tằm thượng hạng", "đường cắt may sắc sảo", "phong cách độc bản"],
      subtitle: (name) => `${name} kiến tạo những bộ sưu tập thời trang cao cấp mang đường nét thanh lịch vượt thời gian, tôn vinh khí chất tự tin và bản sắc độc bản của bạn.`,
      playSample: (name) => `Xin chào! Bạn đang chiêm ngưỡng bộ sưu tập mới nhất từ ${name}. Mỗi đường kim mũi chỉ là một lời tuyên ngôn về vẻ đẹp thanh lịch và kiêu hãnh.`,
      buttons: [{ href: "#features", label: "Khám phá bộ sưu tập", style: "primary" }, { href: "#contact", label: "Đặt lịch may đo VIP", style: "secondary" }],
    },
    features: {
      title: "Đặc Quyền Thời Trang May Đo Cao Cấp",
      subtitle: (name) => `Từng thiết kế tại ${name} được chế tác thủ công với tiêu chuẩn may đo Bespoke khắt khe nhất.`,
      items: [
        { badge: "01 / CHẤT LIỆU CAO CẤP", icon: "fa-solid fa-gem", title: "Lụa Tơ Tằm & Vải Thượng Hạng", desc: "Tuyển chọn các dòng lụa tơ tằm tự nhiên, len cashmere và vải tweed dệt thủ công mềm mại, thoáng mát." },
        { badge: "02 / MAY ĐO BESPOKE", icon: "fa-solid fa-scissors", title: "Phom Dáng Chuẩn Đo Ni", desc: "Kỹ thuật dựng phom 3D ôm trọn đường nét cơ thể, tôn vinh tỷ lệ vóc dáng Á Đông thanh thoát." },
        { badge: "03 / BỘ SƯU TẬP GIỚI HẠN", icon: "fa-solid fa-crown", title: "Thiết Kế Độc Bản Giới Hạn", desc: "Mỗi mẫu chỉ sản xuất số lượng giới hạn, khẳng định dấu ấn phong cách độc nhất của chủ nhân." },
        { badge: "04 / TƯ VẤN STYLIST VIP", icon: "fa-solid fa-sparkles", title: "Trải Nghiệm Stylist Riêng", desc: "Phòng thử đồ riêng tư cùng chuyên gia định hình phong cách cá nhân cho sự kiện quan trọng." },
      ]
    },
    about: {
      eyebrow: "TRIẾT LÝ THIẾT KẾ",
      title: "Vẻ đẹp của sự tinh tế vượt thời gian",
      subtitle: (name) => `${name} tin rằng trang phục đẹp là trang phục giúp người mặc tỏa sáng tự tin nhất từ bên trong.`,
      slides: [
        { eyebrow: "01 / NGUYÊN BẢN", title: "Cảm hứng từ thời trang bền vững", description: "Lựa chọn chất liệu tự nhiên thân thiện với môi trường và trường tồn cùng năm tháng.", metric: { value: "100%", label: "Vải tự nhiên" } },
        { eyebrow: "02 / NGHỆ NHÂN", title: "Bàn tay khéo léo của nghệ nhân may đo", description: "Hơn 30 giờ gia công tỉ mỉ cho từng chi tiết đính kết và đường may giấu chỉ tinh xảo.", metric: { value: "30+ Giờ", label: "Chế tác / mẫu" } },
        { eyebrow: "03 / TÔN VINH", title: "Tự tin tỏa sáng trong mọi khoảnh khắc", description: "Đồng hành cùng hàng ngàn phụ nữ thành đạt khẳng định phong thái cuốn hút.", metric: { value: "5,000+", label: "Khách hàng VIP" } },
      ],
      paragraphs: (name) => [
        `${name} được sinh ra để tôn vinh sự thanh lịch, quý phái nhưng không kém phần phóng khoáng của phụ nữ hiện đại.`,
        "Mỗi bộ trang phục là sự kết hợp hoàn mỹ giữa nghệ thuật thị giác đương đại và chuẩn mực may đo thủ công tinh tế bậc nhất.",
      ],
      stats: [{ value: "100%", label: "Thiết kế độc quyền" }, { value: "30+ Giờ", label: "Gia công thủ công" }, { value: "99.5%", label: "Khách hàng hài lòng" }],
      badge: { icon: "fa-solid fa-gem", value: "Haute Couture", label: "Thương hiệu Thiết kế Tiêu biểu 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Thời Trang",
      subtitle: (name) => `Thông tin về quy trình may đo, đổi trả và chăm sóc trang phục tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "May đo", icon: "fa-solid fa-ruler-combined", question: "Quy trình đặt may đo Bespoke tại showroom diễn ra thế nào?", answer: "Bạn sẽ được lấy số đo chi tiết, tư vấn chất liệu và bản vẽ phác thảo. Sản phẩm hoàn thiện trong 5-7 ngày làm việc." },
        { id: "faq-2", badge: "02", category: "Đổi trả", icon: "fa-solid fa-rotate-left", question: "Chính sách đổi size hoặc mẫu sản phẩm sẵn có ra sao?", answer: "Hỗ trợ đổi size hoặc đổi mẫu trong vòng 7 ngày kể từ ngày nhận hàng với sản phẩm còn nguyên tem mác." },
        { id: "faq-3", badge: "03", category: "Giao hàng", icon: "fa-solid fa-box-open", question: "Thời gian giao hàng toàn quốc mất bao lâu?", answer: "Giao hỏa tốc nội thành trong 2-4 giờ và chuyển phát nhanh toàn quốc trong 24-48 giờ với hộp quà sang trọng." },
        { id: "faq-4", badge: "04", category: "Bảo quản", icon: "fa-solid fa-shirt", question: "Lụa tơ tằm và len cashmere nên bảo quản như thế nào?", answer: "Chúng tôi khuyến nghị giặt hấp khô chuyên dụng hoặc giặt tay nhẹ bằng dầu gội để giữ sợi vải luôn mềm mại óng ả." },
      ]
    },
    contact: {
      title: (name) => `Trải Nghiệm Showroom & Đặt Lịch Cùng ${name}`,
      channels: [
        { label: "Hotline VIP", value: "1900 6868 (09:00 - 21:00)" },
        { label: "Email", value: (slug) => `concierge@${slug}.vn` },
        { label: "Showroom", value: "Đại lộ Thời trang Trung tâm, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đặt lịch thử đồ & Tư vấn Stylist riêng",
      formMessage: (name) => `Nhu cầu trang phục (dạ tiệc, công sở, may đo riêng) tại ${name}...`,
      formButton: "Xác nhận lịch hẹn riêng tư",
    }
  },

  dental: {
    defaultName: "Shining Smile Dental",
    defaultField: "Nha khoa Thẩm mỹ Công nghệ cao & Nụ cười Quốc tế",
    defaultSlogan: "Kiến tạo nụ cười rạng rỡ cùng chuẩn mực y khoa quốc tế",
    paletteKey: "medical",
    fontHeading: "Plus Jakarta Sans",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Kiến tạo nụ cười rạng ngời và sức khỏe răng miệng tại",
      rotatingWords: ["dán sứ Veneer siêu mỏng", "niềng răng trong suốt AI", "cấy ghép Implant 3D"],
      subtitle: (name) => `${name} ứng dụng công nghệ chẩn đoán hình ảnh kỹ thuật số và đội ngũ bác sĩ chuyên khoa đầu ngành, mang lại trải nghiệm chăm sóc răng miệng không đau và nụ cười tự tin trọn đời.`,
      playSample: (name) => `Chào mừng bạn đến với ${name}! Nụ cười tự tin là chìa khóa mở lối thành công. Hãy để chúng tôi đồng hành chăm sóc sức khỏe nụ cười của bạn.`,
      buttons: [{ href: "#features", label: "Khám phá dịch vụ", style: "primary" }, { href: "#contact", label: "Đặt lịch khám miễn phí", style: "secondary" }],
    },
    features: {
      title: "Công Nghệ Nha Khoa Tiêu Chuẩn Quốc Tế",
      subtitle: (name) => `Toàn bộ trang thiết bị tại ${name} được nhập khẩu trực tiếp từ Đức và Thụy Sĩ, đảm bảo độ chính xác và an toàn tuyệt đối.`,
      items: [
        { badge: "01 / CHẨN ĐOÁN 3D", icon: "fa-solid fa-microscope", title: "Máy Quét Kỹ Thuật Số Trios 3D", desc: "Lấy dấu răng kỹ thuật số không cần dùng thạch cao, mô phỏng trước kết quả nụ cười sau điều trị." },
        { badge: "02 / RĂNG SỨ CAO CẤP", icon: "fa-solid fa-tooth", title: "Dán Sứ Veneer Không Mài Nhỏ", desc: "Bảo tồn tối đa răng thật, màu sắc trong bóng tự nhiên tựa men răng nguyên bản." },
        { badge: "03 / CHỈNH NHA HIỆN ĐẠI", icon: "fa-solid fa-wand-magic-sparkles", title: "Niềng Răng Trong Suốt AI", desc: "Khay niềng vô hình thẩm mỹ cao, tháo lắp linh hoạt, biết trước lộ trình dịch chuyển răng từng tuần." },
        { badge: "04 / VÔ TRÙNG TUYỆT ĐỐI", icon: "fa-solid fa-shield-halved", title: "Hệ Thống Vô Trùng Class B", desc: "Quy trình vô trùng khép kín theo tiêu chuẩn Bộ Y tế, 1 khách hàng - 1 phòng điều trị - 1 bộ dụng cụ riêng." },
      ]
    },
    about: {
      eyebrow: "TẬN TÂM VÌ NỤ CƯỜI",
      title: "Chăm sóc nụ cười bằng y đức và công nghệ tiên tiến",
      subtitle: (name) => `${name} luôn đặt sức khỏe và sự an tâm tuyệt đối của khách hàng lên hàng đầu trong mọi ca điều trị.`,
      slides: [
        { eyebrow: "01 / Y ĐỨC", title: "Đội ngũ Thạc sĩ - Bác sĩ chuyên khoa", description: "100% bác sĩ tốt nghiệp Đại học Y Dược chính quy với hơn 15 năm kinh nghiệm điều trị thẩm mỹ.", metric: { value: "15+ năm", label: "Kinh nghiệm" } },
        { eyebrow: "02 / CÔNG NGHỆ", title: "Trang thiết bị chuẩn mực Châu Âu", description: "Phòng mổ cấy ghép Implant áp lực dương vô trùng tuyệt đối, máy chụp CT Cone Beam 3D thế hệ mới.", metric: { value: "100%", label: "Vô trùng Class B" } },
        { eyebrow: "03 / ĐỒNG HÀNH", title: "Bảo hành nụ cười điện tử trọn đời", description: "Hơn 50,000 khách hàng trong và ngoài nước tin tưởng trao gửi nụ cười mới rạng rỡ.", metric: { value: "50,000+", label: "Nụ cười kiến tạo" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi hiểu rằng nụ cười đẹp không chỉ giúp bạn tự tin hơn trong giao tiếp mà còn cải thiện rõ rệt chất lượng cuộc sống.`,
        "Với triết lý điều trị can thiệp tối thiểu và bảo tồn tối đa răng thật, chúng tôi cam kết mang lại trải nghiệm êm ái, nhẹ nhàng và an toàn nhất.",
      ],
      stats: [{ value: "50,000+", label: "Nụ cười rạng rỡ" }, { value: "99.8%", label: "Đánh giá 5 sao" }, { value: "100%", label: "Bảo hành chính hãng" }],
      badge: { icon: "fa-solid fa-certificate", value: "Top 1", label: "Nha khoa Thẩm mỹ Uy tín 2026" },
    },
    faq: {
      title: "Câu Hỏi Thường Gặp Về Nha Khoa",
      subtitle: (name) => `Những giải đáp y khoa từ đội ngũ bác sĩ chuyên khoa tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Dán sứ", icon: "fa-solid fa-tooth", question: "Dán sứ Veneer có phải mài nhỏ răng thật không?", answer: "Không. Kỹ thuật Veneer siêu mỏng chỉ làm mịn bề mặt men răng từ 0.2 - 0.5mm, bảo tồn trọn vẹn tủy và thân răng thật." },
        { id: "faq-2", badge: "02", category: "Niềng răng", icon: "fa-solid fa-clock", question: "Thời gian niềng răng trong suốt mất bao lâu?", answer: "Thông thường từ 12 - 24 tháng tùy độ phức tạp của khớp cắn. Bạn sẽ thấy rõ sự thay đổi chỉ sau 3-6 tháng đầu tiên." },
        { id: "faq-3", badge: "03", category: "Chi phí", icon: "fa-solid fa-credit-card", question: "Phòng khám có chương trình trả góp lãi suất 0% không?", answer: "Có. Chúng tôi liên kết hơn 25 ngân hàng hỗ trợ trả góp linh hoạt từ 6-12 tháng không lãi suất." },
        { id: "faq-4", badge: "04", category: "Bảo hành", icon: "fa-solid fa-shield-check", question: "Chế độ bảo hành răng sứ và Implant như thế nào?", answer: "Răng sứ chính hãng bảo hành từ 10 - 15 năm, trụ Implant Thụy Sĩ/Mỹ được bảo hành chính hãng trọn đời trên toàn cầu." },
      ]
    },
    contact: {
      title: (name) => `Đặt Lịch Khám & Tư Vấn Cùng Bác Sĩ ${name}`,
      channels: [
        { label: "Tổng đài tư vấn", value: "1900 6868 (08:00 - 20:00)" },
        { label: "Email", value: (slug) => `info@${slug}.vn` },
        { label: "Cơ sở", value: "Phòng khám Răng Hàm Mặt Quốc tế, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký khám tổng quát & Chụp phim 3D miễn phí",
      formMessage: (name) => `Tình trạng răng miệng (niềng răng, dán sứ, nhổ răng khôn...) tại ${name}...`,
      formButton: "Đặt lịch hẹn ưu tiên",
    }
  },

  medical: {
    defaultName: "CarePlus Clinic",
    defaultField: "Hệ thống Phòng khám Đa khoa Tiêu chuẩn Quốc tế",
    defaultSlogan: "Tận tâm chăm sóc sức khỏe vàng cho bạn và gia đình",
    paletteKey: "medical",
    fontHeading: "Plus Jakarta Sans",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Hệ thống khám chữa bệnh chất lượng cao và chăm sóc tận tâm tại",
      rotatingWords: ["bác sĩ chuyên khoa đầu ngành", "xét nghiệm tự động nhanh chóng", "hồ sơ bệnh án số bảo mật"],
      subtitle: (name) => `${name} mang đến dịch vụ y tế toàn diện với trang thiết bị chẩn đoán hiện đại và đội ngũ y bác sĩ giàu kinh nghiệm, đồng hành bảo vệ sức khỏe cho cả gia đình bạn.`,
      playSample: (name) => `Chào mừng bạn đến với ${name}! Sức khỏe là vốn quý giá nhất. Chúng tôi luôn sẵn sàng lắng nghe và chăm sóc sức khỏe cho bạn và gia đình.`,
      buttons: [{ href: "#features", label: "Dịch vụ khám chữa bệnh", style: "primary" }, { href: "#contact", label: "Đặt lịch khám trực tuyến", style: "secondary" }],
    },
    features: {
      title: "Dịch Vụ Y Tế Đa Khoa Toàn Diện",
      subtitle: (name) => `Hệ thống phòng khám tại ${name} đạt chuẩn mực quốc tế về vô trùng và độ chính xác trong xét nghiệm.`,
      items: [
        { badge: "01 / ĐỘI NGŨ CHUYÊN GIA", icon: "fa-solid fa-user-doctor", title: "Bác Sĩ Chuyên Khoa Giàu Kinh Nghiệm", desc: "Đội ngũ Giáo sư, Tiến sĩ, Bác sĩ tu nghiệp từ các bệnh viện lớn trong nước và quốc tế." },
        { badge: "02 / CHẨN ĐOÁN HÌNH ẢNH", icon: "fa-solid fa-x-ray", title: "Thiết Bị Chẩn Đoán Thế Hệ Mới", desc: "Máy chụp MRI, CT Scanner đa lát cắt và siêu âm màu 4D cho kết quả chẩn đoán chính xác cao." },
        { badge: "03 / XÉT NGHIỆM TỰ ĐỘNG", icon: "fa-solid fa-vial-virus", title: "Phòng Xét Nghiệm Tự Động Hóa", desc: "Trả kết quả xét nghiệm máu, sinh hóa nhanh chóng chỉ sau 45 - 60 phút qua ứng dụng số." },
        { badge: "04 / CHĂM SÓC GIA ĐÌNH", icon: "fa-solid fa-heart-pulse", title: "Gói Khám Sức Khỏe Gia Đình", desc: "Khám tổng quát định kỳ, tầm soát ung thư sớm và tiêm chủng vắc-xin trọn gói an toàn." },
      ]
    },
    about: {
      eyebrow: "SỨ MỆNH Y ĐỨC",
      title: "Chăm sóc sức khỏe cộng đồng bằng cả tấm lòng",
      subtitle: (name) => `${name} được thành lập với mục tiêu mang lại dịch vụ y tế nhân văn, tiện lợi và chuẩn xác cho mọi người dân.`,
      slides: [
        { eyebrow: "01 / Y ĐỨC", title: "Lương y như từ mẫu", description: "Luôn tận tâm lắng nghe, tư vấn cặn kẽ và đồng hành cùng bệnh nhân trong suốt quá trình điều trị.", metric: { value: "100%", label: "Tận tâm" } },
        { eyebrow: "02 / CÔNG NGHỆ", title: "Hồ sơ bệnh án số hóa bảo mật", description: "Tra cứu kết quả khám và đơn thuốc trực tuyến mọi lúc mọi nơi qua hồ sơ số an toàn.", metric: { value: "100%", label: "Số hóa" } },
        { eyebrow: "03 / TIN CẬY", title: "Hơn 100,000 lượt khám mỗi năm", description: "Địa chỉ khám chữa bệnh uy tín được hàng chục ngàn gia đình và doanh nghiệp tin chọn.", metric: { value: "100,000+", label: "Lượt khám / năm" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, mỗi bệnh nhân đều được tiếp đón như người thân trong gia đình với sự chu đáo và chuyên nghiệp nhất.`,
        "Chúng tôi không ngừng nâng cao chất lượng dịch vụ và đầu tư công nghệ y khoa hiện đại để việc chăm sóc sức khỏe trở nên nhẹ nhàng, hiệu quả.",
      ],
      stats: [{ value: "100,000+", label: "Bệnh nhân tin chọn" }, { value: "99.6%", label: "Mức độ hài lòng" }, { value: "24/7", label: "Cấp cứu và tư vấn" }],
      badge: { icon: "fa-solid fa-hospital", value: "Class A", label: "Phòng Khám Quốc Tế Tiêu Biểu 2026" },
    },
    faq: {
      title: "Câu Hỏi Thường Gặp Về Y Tế",
      subtitle: (name) => `Giải đáp các thắc mắc về quy trình khám bệnh và bảo hiểm tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Bảo hiểm", icon: "fa-solid fa-id-card", question: "Phòng khám có áp dụng bảo hiểm y tế tư nhân bảo lãnh trực tiếp không?", answer: "Có. Chúng tôi liên kết bảo lãnh viện phí trực tiếp với hơn 30 hãng bảo hiểm nhân thọ và phi nhân thọ uy tín." },
        { id: "faq-2", badge: "02", category: "Khám bệnh", icon: "fa-solid fa-clock", question: "Khám sức khỏe tổng quát mất thời gian bao lâu?", answer: "Thông thường quy trình khám tổng quát mất từ 2 - 3 giờ. Bạn sẽ nhận được kết quả và bác sĩ tư vấn ngay trong buổi sáng." },
        { id: "faq-3", badge: "03", category: "Tại nhà", icon: "fa-solid fa-house-medical", question: "Phòng khám có dịch vụ lấy mẫu xét nghiệm tại nhà không?", answer: "Có. Điều dưỡng đến tận nhà lấy mẫu xét nghiệm an toàn đúng hẹn và trả kết quả qua điện thoại trong ngày." },
        { id: "faq-4", badge: "04", category: "Đặt lịch", icon: "fa-solid fa-calendar-check", question: "Đặt lịch hẹn trước có phải chờ đợi không?", answer: "Khách hàng đặt lịch hẹn trước qua website được ưu tiên vào phòng khám đúng giờ hẹn mà không cần bốc số chờ đợi." },
      ]
    },
    contact: {
      title: (name) => `Đặt Lịch Khám Cùng Bác Sĩ Chuyên Khoa ${name}`,
      channels: [
        { label: "Cấp cứu & Tư vấn", value: "1900 6868 (24/7)" },
        { label: "Email", value: (slug) => `clinic@${slug}.vn` },
        { label: "Địa chỉ", value: "Trung tâm Y tế & Chăm sóc Sức khỏe Quốc tế, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký khám sức khỏe / Đặt lịch hẹn",
      formMessage: (name) => `Triệu chứng hoặc chuyên khoa cần khám tại ${name}...`,
      formButton: "Xác nhận lịch hẹn khám",
    }
  },

  fitness: {
    defaultName: "IronFit Gym & Fitness",
    defaultField: "Trung tâm Thể hình Thể thao & Huấn luyện Thể chất Cá nhân",
    defaultSlogan: "Bứt phá giới hạn bản thân, kiến tạo vóc dáng lý tưởng",
    paletteKey: "cyber",
    fontHeading: "Space Grotesk",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Bứt phá năng lượng và kiến tạo vóc dáng chuẩn mực tại",
      rotatingWords: ["HLV 1-kèm-1 quốc tế", "máy tập chuẩn Olympic", "dinh dưỡng cá nhân hóa"],
      subtitle: (name) => `${name} cung cấp không gian tập luyện thể thao chuẩn 5 sao với đầy đủ trang thiết bị hiện đại cùng giáo trình huấn luyện khoa học giúp bạn nhanh chóng đạt mục tiêu hình thể.`,
      playSample: (name) => `Chào mừng chiến binh đến với ${name}! Kỷ luật hôm nay là thành công ngày mai. Hãy bắt đầu hành trình thay đổi bản thân ngay bây giờ!`,
      buttons: [{ href: "#features", label: "Gói tập & Dịch vụ", style: "primary" }, { href: "#contact", label: "Nhận 7 ngày tập thử", style: "secondary" }],
    },
    features: {
      title: "Hệ Sinh Thái Tập Luyện Chuyên Nghiệp",
      subtitle: (name) => `Mọi chi tiết tại ${name} được thiết kế tối ưu để khơi nguồn cảm hứng tập luyện bền bỉ mỗi ngày.`,
      items: [
        { badge: "01 / THIẾT BỊ OLYMPIC", icon: "fa-solid fa-dumbbell", title: "Dàn Máy Tập Nhập Khẩu 100%", desc: "Hơn 150+ máy tập kháng lực, giàn tạ tự do và khu cardio thế hệ mới trang bị màn hình thông minh." },
        { badge: "02 / HLV CHUYÊN NGHIỆP", icon: "fa-solid fa-user-ninja", title: "HLV Cá Nhân Chứng Chỉ Quốc Tế", desc: "Thiết kế lộ trình tập luyện và kế hoạch dinh dưỡng chuyên sâu bám sát thể trạng từng học viên." },
        { badge: "03 / LỚP HỌC ĐA DẠNG", icon: "fa-solid fa-fire", title: "Yoga, Boxing & GroupX", desc: "Hơn 50+ lớp học mỗi tuần: Vinyasa Yoga, Kickboxing, BodyCombat và nhảy hiện đại Zumba tràn đầy năng lượng." },
        { badge: "04 / THƯ GIÃN 5 SAO", icon: "fa-solid fa-hot-tub-person", title: "Sauna, Xông Hơi & Tủ Đồ VIP", desc: "Phục hồi cơ bắp với phòng xông hơi khô/ướt cao cấp, khăn tắm sạch và tủ đồ khóa thông minh miễn phí." },
      ]
    },
    about: {
      eyebrow: "TINH THẦN BỨT PHÁ",
      title: "Hành trình xây dựng phiên bản mạnh mẽ nhất của bạn",
      subtitle: (name) => `${name} không chỉ là một phòng gym, đây là ngôi nhà của cộng đồng đam mê lối sống khỏe khoắn và tích cực.`,
      slides: [
        { eyebrow: "01 / KHỞI ĐẦU", title: "Lắng nghe thể trạng và mục tiêu", description: "Đo chỉ số InBody 770 chuyên sâu, phân tích khối lượng mỡ - cơ để lên lộ trình chính xác.", metric: { value: "100%", label: "Khoa học" } },
        { eyebrow: "02 / BỨT PHÁ", title: "Huấn luyện đồng hành sát sao", description: "Từng động tác được chỉnh sửa chuẩn xác giúp bạn tập luyện an toàn, tối đa hóa hiệu quả đốt mỡ.", metric: { value: "98.5%", label: "Đạt mục tiêu" } },
        { eyebrow: "03 / TỎA SÁNG", title: "Duy trì năng lượng sống tràn đầy", description: "Cải thiện sức bền, vóc dáng săn chắc và sự tự tin bền bỉ trong công việc hằng ngày.", metric: { value: "10,000+", label: "Hội viên tích cực" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi tin rằng sức mạnh thể chất là nền tảng vững chắc cho mọi thành công trong cuộc sống.`,
        "Dù mục tiêu của bạn là giảm cân, tăng cơ hay giải tỏa căng thẳng sau giờ làm việc, chúng tôi luôn sẵn sàng tiếp lửa cho bạn.",
      ],
      stats: [{ value: "10,000+", label: "Hội viên năng động" }, { value: "98.5%", label: "Tỷ lệ đạt mục tiêu" }, { value: "150+", label: "Máy tập chuẩn Olympic" }],
      badge: { icon: "fa-solid fa-trophy", value: "Top Fitness", label: "Phòng Gym Chuẩn 5 Sao 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Tập Luyện",
      subtitle: (name) => `Những thông tin bạn cần biết trước khi bắt đầu hành trình thể hình cùng ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Tập thử", icon: "fa-solid fa-ticket", question: "Tôi có được tập thử miễn phí trước khi mua thẻ không?", answer: "Có. Bạn được nhận gói trải nghiệm 7 ngày tập thử miễn phí toàn bộ tiện ích và 1 buổi đo InBody tư vấn HLV." },
        { id: "faq-2", badge: "02", category: "Bảo lưu", icon: "fa-solid fa-pause", question: "Khi đi công tác hoặc bận, tôi có được bảo lưu thẻ không?", answer: "Có. Mọi gói thẻ tập từ 6 tháng trở lên đều được bảo lưu miễn phí linh hoạt từ 30 - 90 ngày." },
        { id: "faq-3", badge: "03", category: "Giờ mở cửa", icon: "fa-solid fa-clock", question: "Phòng tập mở cửa vào những khung giờ nào?", answer: "Chúng tôi mở cửa liên tục từ 05:30 sáng đến 22:30 tối tất cả các ngày trong tuần, kể cả ngày lễ." },
        { id: "faq-4", badge: "04", category: "HLV", icon: "fa-solid fa-user-check", question: "Người mới chưa biết tập có được hướng dẫn máy không?", answer: "Có. Luôn có đội ngũ HLV sàn hỗ trợ hướng dẫn sử dụng máy tập và các bài khởi động an toàn cho người mới." },
      ]
    },
    contact: {
      title: (name) => `Bắt Đầu Thay Đổi Hình Thể Cùng ${name}`,
      channels: [
        { label: "Hotline phòng tập", value: "1900 6868 (05:30 - 22:30)" },
        { label: "Email", value: (slug) => `fitness@${slug}.vn` },
        { label: "Địa chỉ", value: "Tổ hợp Thể thao & Giải trí, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký nhận 7 ngày tập thử & Đo InBody miễn phí",
      formMessage: (name) => `Mục tiêu tập luyện (giảm mỡ, tăng cơ, cải thiện sức bền...) tại ${name}...`,
      formButton: "Nhận vé tập thử ngay",
    }
  },

  realestate: {
    defaultName: "PrimeLand Real Estate",
    defaultField: "Phân phối Bất động sản Cao cấp & Đô thị Sinh thái",
    defaultSlogan: "Nơi an cư thịnh vượng, cơ hội đầu tư sinh lời bền vững",
    paletteKey: "gold",
    fontHeading: "Playfair Display",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Sở hữu không gian sống thượng lưu và quỹ đất sinh lời tại",
      rotatingWords: ["căn hộ view panorama", "biệt thự sinh thái ven sông", "pháp lý minh bạch 100%"],
      subtitle: (name) => `${name} phân phối các dự án bất động sản cao cấp vị trí vàng, tiện ích đồng bộ chuẩn resort cùng tiềm năng tăng giá vượt trội cho nhà đầu tư thông thái.`,
      playSample: (name) => `Kính chào quý khách! ${name} hân hạnh giới thiệu các dự án bất động sản đắt giá nhất hiện nay. Nơi an cư lý tưởng và tích sản sinh lời bền vững cho thế hệ tương lai.`,
      buttons: [{ href: "#features", label: "Dự án nổi bật", style: "primary" }, { href: "#contact", label: "Nhận bảng giá & Tham quan", style: "secondary" }],
    },
    features: {
      title: "Đặc Quyền Bất Động Sản Nghỉ Dưỡng & An Cư",
      subtitle: (name) => `Mỗi sản phẩm bất động sản tại ${name} đều được kiểm định khắt khe về pháp lý và vị thế sinh lời.`,
      items: [
        { badge: "01 / VỊ TRÍ ĐẮC ĐỊA", icon: "fa-solid fa-map-location-dot", title: "Quỹ Đất Vàng Trung Tâm", desc: "Tọa lạc tại các trục giao lộ huyết mạch, kết nối nhanh chóng đến sân bay, trung tâm thương mại và trường học." },
        { badge: "02 / PHÁP LÝ HOÀN CHỈNH", icon: "fa-solid fa-file-shield", title: "Sổ Hồng Lâu Dài Trao Tay", desc: "100% dự án đã có quy hoạch 1/500 hoàn chỉnh, pháp lý minh bạch sẵn sàng bàn giao sổ hồng cho chủ nhân." },
        { badge: "03 / TIỆN ÍCH ALL-IN-ONE", icon: "fa-solid fa-building", title: "Hệ Sinh Thái Tiện Ích Đẳng Cấp", desc: "Hồ bơi tràn bờ, công viên cây xanh ven sông, trung tâm thương mại, khu vui chơi trẻ em và an ninh 24/7." },
        { badge: "04 / CHÍNH SÁCH ƯU ĐÃI", icon: "fa-solid fa-hand-holding-dollar", title: "Hỗ Trợ Vay Lãi Suất 0%", desc: "Ân hạn nợ gốc và hỗ trợ lãi suất 0% trong 24 tháng, chiết khấu thanh toán sớm lên tới 12% giá trị căn hộ." },
      ]
    },
    about: {
      eyebrow: "TẦM NHÌN PHÁT TRIỂN",
      title: "Kiến tạo chuẩn mực sống thịnh vượng cho tương lai",
      subtitle: (name) => `${name} tự hào là đối tác chiến lược của các tập đoàn phát triển bất động sản hàng đầu Việt Nam.`,
      slides: [
        { eyebrow: "01 / QUY HOẠCH", title: "Không gian sống xanh sinh thái", description: "Mật độ xây dựng dưới 25%, dành trọn vẹn không gian cho mảng xanh, hồ cảnh quan và đường dạo bộ.", metric: { value: "75%", label: "Mảng xanh sinh thái" } },
        { eyebrow: "02 / MINH BẠCH", title: "Pháp lý vững vàng và an tâm", description: "Mọi giao dịch mua bán đều được bảo lãnh bởi các ngân hàng quốc doanh uy tín hàng đầu.", metric: { value: "100%", label: "Pháp lý chuẩn mực" } },
        { eyebrow: "03 / TĂNG TRƯỞNG", title: "Biên độ sinh lời bền vững", description: "Tiềm năng tăng giá từ 15 - 25%/năm nhờ hưởng lợi từ hạ tầng giao thông và đô thị hóa nhanh chóng.", metric: { value: "20%+", label: "Lợi nhuận/năm" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi không chỉ bán những ngôi nhà, chúng tôi trao gửi một phong cách sống đỉnh cao và tổ ấm hạnh phúc vững bền.`,
        "Sự an tâm về pháp lý và giá trị tài sản gia tăng theo thời gian của khách hàng chính là kim chỉ nam trong mọi hoạt động tư vấn của chúng tôi.",
      ],
      stats: [{ value: "10,000+", label: "Sản phẩm bàn giao" }, { value: "100%", label: "Minh bạch pháp lý" }, { value: "15-25%", label: "Biên độ tăng giá/năm" }],
      badge: { icon: "fa-solid fa-award", value: "Prime Land", label: "Đơn Vị Phân Phối Bất Động Sản Xuất Sắc 2026" },
    },
    faq: {
      title: "Câu Hỏi Thường Gặp Bất Động Sản",
      subtitle: (name) => `Giải đáp những băn khoăn về quy trình mua bán và pháp lý nhà đất cùng ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Pháp lý", icon: "fa-solid fa-stamp", question: "Khi mua căn hộ/biệt thự thì bao lâu có sổ hồng?", answer: "Chủ đầu tư cam kết bàn giao sổ hồng trong vòng 6 - 9 tháng kể từ ngày bàn giao nhà theo quy định pháp luật." },
        { id: "faq-2", badge: "02", category: "Thanh toán", icon: "fa-solid fa-credit-card", question: "Tiến độ thanh toán các dự án được chia làm mấy đợt?", answer: "Tiến độ chia linh hoạt từ 8 - 12 đợt theo tiến độ thi công thực tế, đợt đầu chỉ cần thanh toán 15% là ký hợp đồng mua bán." },
        { id: "faq-3", badge: "03", category: "Vay vốn", icon: "fa-solid fa-landmark", question: "Ngân hàng hỗ trợ vay tối đa bao nhiêu % giá trị bất động sản?", answer: "Hỗ trợ vay tối đa 70% giá trị hợp đồng trong thời hạn lên đến 25 năm, miễn phí trả nợ trước hạn trong thời gian ưu đãi." },
        { id: "faq-4", badge: "04", category: "Tham quan", icon: "fa-solid fa-car", question: "Tôi có thể xem nhà mẫu thực tế vào ngày nào trong tuần?", answer: "Nhà mẫu mở cửa đón khách tất cả các ngày trong tuần. Chúng tôi có xe đưa đón tận nhà miễn phí cho quý khách đăng ký trước." },
      ]
    },
    contact: {
      title: (name) => `Đăng Ký Nhận Bảng Giá & Tham Quan Cùng ${name}`,
      channels: [
        { label: "Hotline dự án", value: "1900 6868 (24/7)" },
        { label: "Email", value: (slug) => `sales@${slug}.vn` },
        { label: "Văn phòng bán hàng", value: "Khu Đô Thị Mới Cao Cấp, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký nhận bảng giá căn đẹp & Lịch tham quan nhà mẫu",
      formMessage: (name) => `Loại hình quan tâm (căn hộ 2PN, 3PN, biệt thự, shophouse) tại ${name}...`,
      formButton: "Gửi yêu cầu nhận bảng giá",
    }
  },

  edtech: {
    defaultName: "EduSpeak English",
    defaultField: "Học viện Ngôn ngữ Quốc tế & Luyện thi Toàn diện",
    defaultSlogan: "Khai mở tiềm năng tri thức, tự tin vươn ra thế giới",
    paletteKey: "purple",
    fontHeading: "Plus Jakarta Sans",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Lộ trình học tập cá nhân hóa mở lối tương lai tại",
      rotatingWords: ["giáo viên bản ngữ CELTA", "phương pháp phản xạ tự nhiên", "cam kết chuẩn đầu ra"],
      subtitle: (name) => `${name} tiên phong ứng dụng công nghệ nhận diện giọng nói AI và phương pháp tương tác phản xạ chủ động, giúp học viên tự tin giao tiếp tiếng Anh lưu loát chỉ sau 3 tháng.`,
      playSample: (name) => `Xin chào! Chào mừng bạn đến với ${name}. Hãy bắt đầu hành trình chinh phục tiếng Anh với phương pháp học phản xạ tự nhiên chuẩn quốc tế ngay hôm nay!`,
      buttons: [{ href: "#features", label: "Lộ trình khóa học", style: "primary" }, { href: "#contact", label: "Đăng ký kiểm tra đầu vào", style: "secondary" }],
    },
    features: {
      title: "Phương Pháp Đào Tạo Tiên Phong Chuẩn Quốc Tế",
      subtitle: (name) => `Giáo trình tại ${name} được thiết kế bám sát khung tham chiếu Châu Âu CEFR và chuẩn đề thi thực tế.`,
      items: [
        { badge: "01 / GIẢNG VIÊN BẢN NGỮ", icon: "fa-solid fa-chalkboard-user", title: "100% Giáo Viên Bản Ngữ Có Bằng CELTA", desc: "Đội ngũ thầy cô nhiệt huyết đến từ Anh, Mỹ, Úc với hơn 8 năm kinh nghiệm giảng dạy tiếng Anh học thuật." },
        { badge: "02 / CÔNG NGHỆ LUYỆN ÂM AI", icon: "fa-solid fa-microphone-lines", title: "Trợ Lý AI Luyện Phát Âm 1-1", desc: "Phân tích khẩu hình và ngữ điệu từng âm tiết chuẩn xác theo thang điểm quốc tế IPA, sửa lỗi tức thì." },
        { badge: "03 / TƯƠNG TÁC PHẢN XẠ", icon: "fa-solid fa-comments", title: "Lớp Học Tương Tác Quy Mô Nhỏ", desc: "Mô hình lớp chỉ 6 - 8 học viên tối đa hóa thời lượng tương tác nói, phản xạ tự nhiên không dịch từ tiếng Việt." },
        { badge: "04 / CAM KẾT ĐẦU RA", icon: "fa-solid fa-certificate", title: "Cam Kết Bằng Văn Bản", desc: "Cam kết đạt chuẩn IELTS 6.5+ hoặc TOEIC 800+ bằng văn bản. Học lại hoàn toàn miễn phí nếu chưa đạt mục tiêu." },
      ]
    },
    about: {
      eyebrow: "SỨ MỆNH GIÁO DỤC",
      title: "Thắp sáng đam mê và sự tự tin ngôn ngữ cho thế hệ trẻ",
      subtitle: (name) => `${name} tin rằng mỗi học viên đều có tiềm năng học ngoại ngữ xuất sắc khi được tiếp cận đúng phương pháp.`,
      slides: [
        { eyebrow: "01 / PHƯƠNG PHÁP", title: "Học qua trải nghiệm thực tế", description: "Lồng ghép các chủ đề thảo luận thời sự, thuyết trình dự án và debate phản biện sắc bén.", metric: { value: "85%", label: "Thời lượng thực hành nói" } },
        { eyebrow: "02 / THEO SÁT", title: "Trợ giảng hỗ trợ 24/7", description: "Kèm cặp sát sao, chữa bài tập viết luận chi tiết và luyện nói hàng tuần ngoài giờ học chính.", metric: { value: "100%", label: "Kèm cặp 1-1" } },
        { eyebrow: "03 / KẾT QUẢ", title: "Hơn 20,000 học viên đạt điểm cao", description: "Tự tin du học, săn học bổng và làm việc tại các tập đoàn đa quốc gia hàng đầu.", metric: { value: "98.2%", label: "Đạt chuẩn cam kết" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi xóa bỏ nỗi sợ nói tiếng Anh nhờ môi trường học tập cởi mở, thân thiện và giàu tính truyền cảm hứng.`,
        "Tiếng Anh không còn là môn học lý thuyết nhàm chán, mà trở thành công cụ đắc lực mở ra cánh cửa cơ hội toàn cầu cho bạn.",
      ],
      stats: [{ value: "20,000+", label: "Học viên tốt nghiệp" }, { value: "98.2%", label: "Đạt chuẩn đầu ra cam kết" }, { value: "8.0+", label: "IELTS học viên xuất sắc" }],
      badge: { icon: "fa-solid fa-graduation-cap", value: "EdTech Top 1", label: "Học Viện Ngôn Ngữ Tiêu Biểu 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Khóa Học",
      subtitle: (name) => `Những thông tin về lộ trình và chính sách học phí tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Người mới", icon: "fa-solid fa-user", question: "Người mất gốc hoàn toàn có theo học được không?", answer: "Có. Chúng tôi có khóa học nền tảng thiết kế riêng cho người mất gốc, lấy lại phản xạ căn bản và ngữ âm chuẩn chỉ sau 6 tuần." },
        { id: "faq-2", badge: "02", category: "Test đầu vào", icon: "fa-solid fa-clipboard-check", question: "Bài kiểm tra trình độ đầu vào có mất phí không?", answer: "Hoàn toàn miễn phí. Bạn sẽ được làm bài test 4 kỹ năng và được giáo viên chấm chữa, tư vấn lộ trình riêng trong 30 phút." },
        { id: "faq-3", badge: "03", category: "Lịch học", icon: "fa-solid fa-calendar-days", question: "Nếu bận công việc có được đổi ca học không?", answer: "Có. Hệ thống hỗ trợ bảo lưu và học bù linh hoạt các ca sáng/chiều/tối giữa các lớp cùng trình độ trong tuần." },
        { id: "faq-4", badge: "04", category: "Cam kết", icon: "fa-solid fa-file-contract", question: "Chính sách cam kết đầu ra được bảo đảm như thế nào?", answer: "Được ký hợp đồng cam kết đào tạo rõ ràng trước khi nhập học. Học viên được học lại miễn phí 100% nếu không đạt điểm chuẩn." },
      ]
    },
    contact: {
      title: (name) => `Đăng Ký Kiểm Tra Trình Độ & Tư Vấn Cùng ${name}`,
      channels: [
        { label: "Hotline tuyển sinh", value: "1900 6868 (08:00 - 21:30)" },
        { label: "Email", value: (slug) => `admissions@${slug}.edu.vn` },
        { label: "Cơ sở đào tạo", value: "Học viện Trung tâm, Hà Nội / TP.HCM / Đà Nẵng" },
      ],
      formTitle: "Đăng ký test trình độ 4 kỹ năng & Nhận học bổng 30%",
      formMessage: (name) => `Trình độ hiện tại và mục tiêu (IELTS, giao tiếp công việc, du học) tại ${name}...`,
      formButton: "Đăng ký test miễn phí ngay",
    }
  },

  hotel: {
    defaultName: "Aurora Grand Hotel & Resort",
    defaultField: "Khách sạn & Khu nghỉ dưỡng Cao cấp 5 Sao",
    defaultSlogan: "Trải nghiệm kỳ nghỉ trong mơ giữa thiên nhiên tuyệt mỹ",
    paletteKey: "gold",
    fontHeading: "Playfair Display",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Tận hưởng kỳ nghỉ dưỡng thiên đường và ẩm thực 5 sao tại",
      rotatingWords: ["phòng Suite view biển", "hồ bơi vô cực chân mây", "ẩm thực Michelin Á - Âu"],
      subtitle: (name) => `${name} mang đến không gian nghỉ dưỡng thanh bình biệt lập bên bờ biển trong xanh cùng hệ thống dịch vụ tiện ích chuẩn 5 sao quốc tế cho kỳ nghỉ trọn vẹn của bạn và gia đình.`,
      playSample: (name) => `Kính chào quý khách! Chào mừng quý khách đến với ${name}. Hãy thả lỏng tâm trí và tận hưởng từng phút giây thư giãn tuyệt vời giữa thiên nhiên tuyệt mỹ.`,
      buttons: [{ href: "#features", label: "Khám phá hạng phòng", style: "primary" }, { href: "#contact", label: "Đặt phòng nhận ưu đãi 20%", style: "secondary" }],
    },
    features: {
      title: "Tiện Ích Nghỉ Dưỡng Thượng Lưu",
      subtitle: (name) => `Từng khoảnh khắc tại ${name} được kiến tạo để mang lại sự thư thái và tái tạo năng lượng hoàn hảo.`,
      items: [
        { badge: "01 / PHÒNG NGHỈ VIEW BIỂN", icon: "fa-solid fa-bed", title: "Phòng Suite & Villa Sang Trọng", desc: "100% phòng nghỉ hướng biển với ban công riêng rộng rãi, bồn tắm sục Jacuzzi và nội thất gỗ tự nhiên." },
        { badge: "02 / HỒ BƠI VÔ CỰC", icon: "fa-solid fa-water-ladder", title: "Hồ Bơi Chân Mây Hướng Biển", desc: "Hồ bơi nước mặn vô cực nối liền chân trời biển xanh, quầy bar chìm phục vụ cocktail và đồ ăn nhẹ." },
        { badge: "03 / TINH HOA ẨM THỰC", icon: "fa-solid fa-utensils", title: "Nhà Hàng Ẩm Thực Á - Âu", desc: "Hải sản tươi sống đánh bắt trong ngày, buffet sáng phong phú và dạ tiệc BBQ lãng mạn trên bãi cát." },
        { badge: "04 / SPA & WELLNESS", icon: "fa-solid fa-spa", title: "Spa Trị Liệu Thảo Dược", desc: "Liệu trình massage bấm huyệt cổ truyền kết hợp tinh dầu thiên nhiên giúp phục hồi năng lượng và thư giãn sâu." },
      ]
    },
    about: {
      eyebrow: "THIÊN ĐƯỜNG NGHỈ DƯỠNG",
      title: "Nghệ thuật hiếu khách chạm đến trái tim",
      subtitle: (name) => `${name} tọa lạc tại vị trí đắc địa nơi giao hòa giữa núi rừng hùng vĩ và làn nước biển trong xanh như ngọc bích.`,
      slides: [
        { eyebrow: "01 / THIÊN NHIÊN", title: "Hòa quyện cùng thiên nhiên nguyên sơ", description: "Bãi biển riêng trải dài cát trắng mịn, khí hậu quanh năm ấm áp chan hòa ánh nắng.", metric: { value: "100%", label: "View biển nguyên sơ" } },
        { eyebrow: "02 / DỊCH VỤ", title: "Phục vụ tận tâm chuẩn mực 5 sao", description: "Đội ngũ quản gia riêng chu đáo sẵn sàng đáp ứng mọi yêu cầu của kỳ nghỉ thượng lưu.", metric: { value: "24/7", label: "Quản gia riêng" } },
        { eyebrow: "03 / KÝ ỨC", title: "Lưu giữ những khoảnh khắc hạnh phúc", description: "Điểm đến lý tưởng cho tuần trăng mật lãng mạn, kỳ nghỉ gia đình và hội nghị đẳng cấp.", metric: { value: "99.8%", label: "Đánh giá tuyệt vời" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi tin rằng kỳ nghỉ thực sự là khi tâm hồn bạn được hoàn toàn thả lỏng và tìm về sự bình yên vốn có.`,
        "Mỗi nụ cười chào đón nồng hậu và dịch vụ tinh tế của chúng tôi sẽ biến chuyến đi của bạn thành những kỷ niệm khó phai mờ.",
      ],
      stats: [{ value: "99.8%", label: "Khách hàng hài lòng" }, { value: "5 Sao", label: "Tiêu chuẩn quốc tế" }, { value: "100%", label: "Phòng view biển" }],
      badge: { icon: "fa-solid fa-star", value: "5 Star Luxury", label: "Khu Nghỉ Dưỡng Xuất Sắc 2026" },
    },
    faq: {
      title: "Câu Hỏi Thường Gặp Khi Đặt Phòng",
      subtitle: (name) => `Thông tin về thời gian nhận phòng và chính sách dịch vụ tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Thời gian", icon: "fa-solid fa-clock", question: "Thời gian check-in và check-out của khách sạn là mấy giờ?", answer: "Thời gian nhận phòng (check-in) từ 14:00 và trả phòng (check-out) trước 12:00 trưa. Khách sạn hỗ trợ nhận phòng sớm nếu còn phòng trống." },
        { id: "faq-2", badge: "02", category: "Đưa đón", icon: "fa-solid fa-van-shuttle", question: "Khách sạn có xe đưa đón sân bay miễn phí không?", answer: "Có. Tất cả các gói đặt phòng từ 2 đêm trở lên đều được miễn phí xe limousine đưa đón 2 chiều từ sân bay về resort." },
        { id: "faq-3", badge: "03", category: "Ăn uống", icon: "fa-solid fa-bowl-food", question: "Giá phòng đã bao gồm ăn sáng buffet chưa?", answer: "Giá phòng đã bao gồm buffet sáng chuẩn quốc tế hàng ngày cho số lượng người tiêu chuẩn của từng hạng phòng." },
        { id: "faq-4", badge: "04", category: "Hủy phòng", icon: "fa-solid fa-calendar-xmark", question: "Chính sách thay đổi ngày hoặc hủy phòng như thế nào?", answer: "Hỗ trợ đổi ngày hoặc hủy phòng miễn phí trước 7 ngày so với ngày nhận phòng đối với hầu hết các gói đặt phòng tiêu chuẩn." },
      ]
    },
    contact: {
      title: (name) => `Đặt Phòng & Kỳ Nghỉ Trong Mơ Cùng ${name}`,
      channels: [
        { label: "Hotline đặt phòng", value: "1900 6868 (24/7)" },
        { label: "Email", value: (slug) => `reservation@${slug}.vn` },
        { label: "Địa chỉ resort", value: "Bờ Biển Thiên Đường, Nha Trang / Phú Quốc / Đà Nẵng" },
      ],
      formTitle: "Yêu cầu báo giá phòng / Đặt kỳ nghỉ dưỡng",
      formMessage: (name) => `Ngày nhận phòng, trả phòng, số lượng người lớn/trẻ em tại ${name}...`,
      formButton: "Kiểm tra phòng trống & Báo giá",
    }
  },

  logistics: {
    defaultName: "SwiftLogistics Express",
    defaultField: "Giải pháp Vận chuyển Đa phương thức & Kho bãi Thông minh",
    defaultSlogan: "Kết nối mọi hành trình, giao nhận an tâm từng cây số",
    paletteKey: "data",
    fontHeading: "Space Grotesk",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Mạng lưới chuyển phát nhanh và kho bãi thông minh tại",
      rotatingWords: ["giao nhanh nội thành 2h", "tra cứu hành trình Realtime", "bảo hiểm hàng hóa 100%"],
      subtitle: (name) => `${name} cung cấp giải pháp vận tải toàn diện, quản lý chuỗi cung ứng và kho bãi tự động hóa, giúp doanh nghiệp tối ưu chi phí vận hành và tăng tốc giao vận vượt trội.`,
      playSample: (name) => `Xin chào! Bạn đang kết nối với hệ sinh thái giao vận ${name}. Tốc độ, an toàn và minh bạch là cam kết hàng đầu trên từng kiện hàng của bạn.`,
      buttons: [{ href: "#features", label: "Dịch vụ vận chuyển", style: "primary" }, { href: "#contact", label: "Tra cứu cước & Báo giá", style: "secondary" }],
    },
    features: {
      title: "Hạ Tầng Giao Vận Công Nghệ Cao",
      subtitle: (name) => `Hệ thống logistics tại ${name} kết nối thông suốt đường bộ, đường hàng không và đường biển toàn quốc.`,
      items: [
        { badge: "01 / PHỦ KHẮP 63 TỈNH", icon: "fa-solid fa-truck-fast", title: "Mạng Lưới Bưu Cục Toàn Quốc", desc: "Hơn 500+ bưu cục và trung tâm phân loại hàng hóa tự động tốc độ cao tại 63 tỉnh thành." },
        { badge: "02 / THEO DÕI REALTIME", icon: "fa-solid fa-location-crosshairs", title: "Tra Cứu Hành Trình GPS 24/7", desc: "Cập nhật vị trí đơn hàng theo thời gian thực với độ chính xác đến từng phút qua ứng dụng di động." },
        { badge: "03 / KHO VẬN FULFILLMENT", icon: "fa-solid fa-warehouse", title: "Kho Bãi Thông Minh Cho E-commerce", desc: "Lưu kho, đóng gói tự động và giao ngay trong ngày giúp nhà bán hàng giảm 40% chi phí vận hành." },
        { badge: "04 / BẢO HIỂM 100%", icon: "fa-solid fa-shield-check", title: "Bảo Hiểm Hàng Hóa Toàn Diện", desc: "Bảo hiểm đền bù 100% giá trị khai báo khi xảy ra mất mát, hư hỏng trong quá trình vận chuyển." },
      ]
    },
    about: {
      eyebrow: "MẠNG LƯỚI KẾT NỐI",
      title: "Đồng hành bứt phá cùng chuỗi cung ứng số",
      subtitle: (name) => `${name} là cầu nối tin cậy giữa các nhà sản xuất, sàn thương mại điện tử và hàng triệu người tiêu dùng.`,
      slides: [
        { eyebrow: "01 / TỐC ĐỘ", title: "Giao nhận hỏa tốc chuẩn xác", description: "Quy trình phân loại bằng băng chuyền AI tự động giảm thiểu tối đa tỷ lệ nhầm lẫn đơn hàng.", metric: { value: "99.2%", label: "Giao đúng hẹn" } },
        { eyebrow: "02 / ĐỐI SOÁT", title: "Đối soát thu hộ COD nhanh chóng", description: "Thanh toán tiền thu hộ COD linh hoạt 3 lần/tuần, minh bạch dòng tiền kinh doanh của khách hàng.", metric: { value: "24h", label: "Chuyển tiền COD" } },
        { eyebrow: "03 / QUY MÔ", title: "Hơn 1 triệu bưu gửi mỗi ngày", description: "Hạ tầng sẵn sàng đáp ứng lượng đơn tăng vọt trong các đợt cao điểm khuyến mãi mua sắm.", metric: { value: "1,000,000+", label: "Bưu kiện / ngày" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, mỗi kiện hàng đều chứa đựng niềm tin và kỳ vọng của người gửi lẫn người nhận.`,
        "Chúng tôi không ngừng đầu tư phương tiện hiện đại và công nghệ số để hàng hóa luôn lưu thông nhanh chóng, an toàn và tiết kiệm nhất.",
      ],
      stats: [{ value: "1,000,000+", label: "Đơn hàng xử lý / ngày" }, { value: "99.2%", label: "Tỷ lệ giao đúng hẹn" }, { value: "63", label: "Tỉnh thành phủ sóng" }],
      badge: { icon: "fa-solid fa-box", value: "Logistics Pro", label: "Doanh Nghiệp Vận Tải Uy Tín 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Vận Chuyển",
      subtitle: (name) => `Thông tin về bảng cước và thời gian giao hàng tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Thời gian", icon: "fa-solid fa-stopwatch", question: "Thời gian giao hàng nội thành và liên tỉnh mất bao lâu?", answer: "Nội thành giao hỏa tốc từ 2 - 4 giờ. Liên tỉnh từ 24 - 48 giờ tùy tuyến đường bay hoặc đường bộ." },
        { id: "faq-2", badge: "02", category: "COD", icon: "fa-solid fa-hand-holding-dollar", question: "Tiền thu hộ COD được thanh toán như thế nào?", answer: "Tiền COD được chuyển khoản tự động vào tài khoản ngân hàng của bạn vào các ngày thứ 2, 4, 6 hàng tuần." },
        { id: "faq-3", badge: "03", category: "Bảo hiểm", icon: "fa-solid fa-file-invoice", question: "Chính sách đền bù khi hàng hóa bị thất lạc ra sao?", answer: "Đền bù 100% giá trị khai báo đơn hàng có bảo hiểm trong vòng 7 ngày làm việc sau khi xác nhận biên bản sự cố." },
        { id: "faq-4", badge: "04", category: "API", icon: "fa-solid fa-code", question: "Hệ thống có hỗ trợ kết nối API tự động tạo đơn không?", answer: "Có. Chúng tôi cung cấp API mở kết nối nhanh với các nền tảng Shopify, WooCommerce, Haravan, Sapo và phần mềm bán hàng." },
      ]
    },
    contact: {
      title: (name) => `Liên Hệ Báo Giá & Hợp Tác Cùng ${name}`,
      channels: [
        { label: "Tổng đài hỗ trợ", value: "1900 6868 (24/7)" },
        { label: "Email", value: (slug) => `support@${slug}.vn` },
        { label: "Tổng kho", value: "Trung tâm Logistics Quốc tế, Hà Nội / TP.HCM / Đà Nẵng" },
      ],
      formTitle: "Đăng ký tư vấn giải pháp kho vận & Nhận bảng cước ưu đãi",
      formMessage: (name) => `Sản lượng đơn hàng dự kiến mỗi tháng hoặc nhu cầu kho bãi cùng ${name}...`,
      formButton: "Nhận bảng cước doanh nghiệp",
    }
  },

  pet: {
    defaultName: "PawPaws Pet Care",
    defaultField: "Trung tâm Chăm sóc, Spa & Khám bệnh Thú cưng",
    defaultSlogan: "Yêu thương và chăm sóc người bạn nhỏ bốn chân trọn vẹn",
    paletteKey: "amber",
    fontHeading: "Plus Jakarta Sans",
    radius: "20px",
    hero: {
      layout: "centered",
      title: "Dịch vụ spa, dinh dưỡng và y tế tận tâm cho thú cưng tại",
      rotatingWords: ["spa tỉa lông nghệ thuật", "khám chữa bệnh nội trú 24/7", "khách sạn thú cưng 5 sao"],
      subtitle: (name) => `${name} là điểm đến yêu thích của các bé cún và mèo cưng, cung cấp đầy đủ dịch vụ grooming làm đẹp, thăm khám thú y chuyên khoa và khách sạn lưu trú máy lạnh thoáng mát.`,
      playSample: (name) => `Chào mừng bạn và bé cưng đến với ${name}! Các bé bốn chân là thành viên quý giá trong gia đình. Hãy để chúng tôi chăm sóc bé bằng trọn vẹn tình yêu thương.`,
      buttons: [{ href: "#features", label: "Dịch vụ Spa & Khám", style: "primary" }, { href: "#contact", label: "Đặt lịch spa bé cưng", style: "secondary" }],
    },
    features: {
      title: "Chăm Sóc Thú Cưng Chuẩn 5 Sao",
      subtitle: (name) => `Đội ngũ kỹ thuật viên và bác sĩ tại ${name} có chứng chỉ chuyên môn và tình yêu vô bờ với động vật.`,
      items: [
        { badge: "01 / SPA GROOMING", icon: "fa-solid fa-scissors", title: "Cắt Tỉa Lông Nghệ Thuật", desc: "Tắm sục ozone khử mùi, dưỡng lông mềm mượt và cắt tỉa tạo kiểu thời thượng cho từng giống chó mèo." },
        { badge: "02 / BÁC SĨ THÚ Y", icon: "fa-solid fa-stethoscope", title: "Thăm Khám & Tiêm Phòng Định Kỳ", desc: "Phòng khám thú y hiện đại, máy xét nghiệm sinh hóa, siêu âm và tiêm vắc-xin chính hãng an toàn." },
        { badge: "03 / KHÁCH SẠN VIP", icon: "fa-solid fa-hotel", title: "Khách Sạn Lưu Trú Phòng Riêng", desc: "Phòng nghỉ điều hòa riêng biệt, camera theo dõi 24/7 gửi cho chủ nhân, chế độ dinh dưỡng cá nhân hóa." },
        { badge: "04 / PHỤ KIỆN & THỨC ĂN", icon: "fa-solid fa-bone", title: "Dinh Dưỡng Hạt & Đồ Chơi Nhập Khẩu", desc: "Các dòng hạt dinh dưỡng không ngũ cốc, pate tươi và đồ chơi an toàn nhập khẩu từ Hàn Quốc, Nhật Bản." },
      ]
    },
    about: {
      eyebrow: "TÌNH YÊU THƯƠNG",
      title: "Ngôi nhà thứ hai ấm áp của người bạn bốn chân",
      subtitle: (name) => `${name} được xây dựng từ tâm huyết của những người yêu thương động vật sâu sắc.`,
      slides: [
        { eyebrow: "01 / TÂM LÝ", title: "Thấu hiểu hành vi và cảm xúc", description: "Kỹ thuật tiếp cận nhẹ nhàng không gây stress, giúp các bé luôn cảm thấy thư thái và vui vẻ.", metric: { value: "100%", label: "Không gian không stress" } },
        { eyebrow: "02 / VỆ SINH", title: "Khử khuẩn tia cực tím mỗi ngày", description: "Hệ thống lọc không khí và đèn UV khử khuẩn 100% ngăn ngừa lây nhiễm chéo giữa các bé.", metric: { value: "100%", label: "Vô trùng an toàn" } },
        { eyebrow: "03 / ĐỒNG HÀNH", title: "Hơn 15,000 bé cưng được chăm sóc", description: "Địa chỉ tin cậy được hàng ngàn ba mẹ thú cưng trao gửi niềm tin chăm sóc bé mỗi tháng.", metric: { value: "15,000+", label: "Bé cưng / năm" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi tin rằng thú cưng không chỉ là vật nuôi, mà là người bạn tri kỷ mang lại niềm vui bất tận cho mỗi gia đình.`,
        "Sự khỏe mạnh, sạch sẽ và năng động của các bé sau mỗi buổi chăm sóc chính là niềm tự hào lớn nhất của đội ngũ chúng tôi.",
      ],
      stats: [{ value: "15,000+", label: "Bé cưng chăm sóc / năm" }, { value: "99.7%", label: "Ba mẹ hài lòng" }, { value: "24/7", label: "Cấp cứu thú y" }],
      badge: { icon: "fa-solid fa-paw", value: "Pet Top 1", label: "Hệ Thống Pet Care Uy Tín 2026" },
    },
    faq: {
      title: "Câu Hỏi Thường Gặp Của Ba Mẹ",
      subtitle: (name) => `Giải đáp những thắc mắc khi gửi bé cưng làm spa hoặc lưu trú tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Spa", icon: "fa-solid fa-shower", question: "Quy trình tắm và spa cho bé mất thời gian bao lâu?", answer: "Quy trình trọn gói 8 bước (vệ sinh tai, cắt móng, vắt tuyến hôi, tắm sục, sấy đánh bông lông) mất từ 1.5 - 2 giờ." },
        { id: "faq-2", badge: "02", category: "Lưu trú", icon: "fa-solid fa-camera", question: "Khi gửi khách sạn tôi có được xem camera của bé không?", answer: "Có. Ba mẹ được cấp tài khoản xem camera HD 24/7 trực tiếp phòng riêng của bé trên điện thoại mọi lúc mọi nơi." },
        { id: "faq-3", badge: "03", category: "Tiêm phòng", icon: "fa-solid fa-syringe", question: "Bé mấy tháng tuổi thì có thể tiêm phòng và tẩy giun?", answer: "Bé từ 2 tháng tuổi đã có thể tiêm mũi vắc-xin tổng hợp đầu tiên và tẩy giun định kỳ an toàn theo hướng dẫn bác sĩ." },
        { id: "faq-4", badge: "04", category: "Đón trả", icon: "fa-solid fa-car-side", question: "Shop có dịch vụ đưa đón bé cưng tại nhà không?", answer: "Có. Chúng tôi có xe đưa đón thú cưng chuyên dụng thoáng mát, đón bé tại nhà và trả về thơm tho sau buổi spa." },
      ]
    },
    contact: {
      title: (name) => `Đặt Lịch Spa & Chăm Sóc Bé Cưng Cùng ${name}`,
      channels: [
        { label: "Hotline đặt lịch", value: "1900 6868 (08:00 - 20:30)" },
        { label: "Email", value: (slug) => `petcare@${slug}.vn` },
        { label: "Cơ sở", value: "Tổ hợp Chăm sóc Thú cưng, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đặt lịch spa / Khám bệnh / Khách sạn thú cưng",
      formMessage: (name) => `Giống loài (chó/mèo), cân nặng và dịch vụ yêu cầu cho bé tại ${name}...`,
      formButton: "Đặt lịch hẹn cho bé cưng",
    }
  },

  eco: {
    defaultName: "GreenFarm Organic",
    defaultField: "Nông nghiệp Sinh thái & Cung cấp Thực phẩm Hữu cơ",
    defaultSlogan: "Từ đất lành đến bàn ăn, trọn vẹn tinh túy mẹ thiên nhiên",
    paletteKey: "eco",
    fontHeading: "Playfair Display",
    radius: "20px",
    hero: {
      layout: "centered",
      title: "Nông sản sạch thuần khiết từ nông trại sinh thái tuần hoàn tại",
      rotatingWords: ["100% canh tác hữu cơ", "không hóa chất bảo vệ", "thu hoạch giao trong ngày"],
      subtitle: (name) => `${name} canh tác nông nghiệp tự nhiên không phân bón hóa học, không thuốc bảo vệ thực vật, mang đến nguồn thực phẩm tươi lành và trọn vẹn dưỡng chất cho bữa cơm gia đình bạn.`,
      playSample: (name) => `Chào mừng bạn đến với ${name}! Hãy cảm nhận hương vị ngọt lành thuần khiết của rau củ tươi non vừa được thu hoạch từ đất lành mỗi sáng.`,
      buttons: [{ href: "#features", label: "Cửa hàng nông sản", style: "primary" }, { href: "#contact", label: "Đăng ký gói rau tuần", style: "secondary" }],
    },
    features: {
      title: "Chuẩn Mực Nông Nghiệp Hữu Cơ",
      subtitle: (name) => `Nông trại sinh thái tại ${name} tuân thủ nghiêm ngặt quy trình canh tác hữu cơ chuẩn quốc tế.`,
      items: [
        { badge: "01 / ĐẤT LÀNH NGUYÊN BẢN", icon: "fa-solid fa-seedling", title: "100% Canh Tác Tự Nhiên", desc: "Đất trồng được cải tạo hữu cơ bằng trùn quế và phân ủ vi sinh, không kim loại nặng hay hóa chất độc hại." },
        { badge: "02 / NGUỒN NƯỚC TINH KHIẾT", icon: "fa-solid fa-droplet", title: "Nước Tưới Mạch Ngầm Tự Nhiên", desc: "Hệ thống tưới nhỏ giọt công nghệ Israel sử dụng nguồn nước giếng ngầm qua xử lý lọc an toàn." },
        { badge: "03 / THU HOẠCH TƯƠI MỚI", icon: "fa-solid fa-leaf", title: "Hái Sáng Sớm - Giao Trong Ngày", desc: "Rau củ được thu hái đúng 5:00 sáng, sơ chế giữ lạnh và giao tận cửa nhà khách hàng trước bữa trưa." },
        { badge: "04 / TRUY XUẤT NGUỒN GỐC", icon: "fa-solid fa-qrcode", title: "Minh Bạch Nguồn Gốc QR Code", desc: "Mỗi bó rau đều có mã QR tra cứu nhật ký canh tác: ngày gieo hạt, chăm sóc, thu hoạch và hàm lượng dinh dưỡng." },
      ]
    },
    about: {
      eyebrow: "THUẬN TỰ NHIÊN",
      title: "Hành trình chữa lành đất mẹ và mang lại sức khỏe xanh",
      subtitle: (name) => `${name} khởi nguồn từ khát vọng bảo vệ sức khỏe người tiêu dùng và xây dựng nền nông nghiệp bền vững.`,
      slides: [
        { eyebrow: "01 / ĐẤT MẸ", title: "Tái tạo sự sống cho đất", description: "Nói không với thuốc trừ sâu, duy trì hệ sinh thái cân bằng với các loài thiên địch tự nhiên.", metric: { value: "0%", label: "Hóa chất nông nghiệp" } },
        { eyebrow: "02 / TÂM HUYẾT", title: "Bàn tay cần mẫn của người nông dân", description: "Chăm chút từng luống rau, luân canh mùa vụ để giữ trọn độ màu mỡ và ngọt tự nhiên của đất.", metric: { value: "100%", label: "Thuần tự nhiên" } },
        { eyebrow: "03 / SỨC KHỎE", title: "Bữa ăn thanh lành cho mọi nhà", description: "Cung cấp nguồn vitamin và khoáng chất dồi dào, nâng cao sức đề kháng cho trẻ nhỏ và người cao tuổi.", metric: { value: "5,000+", label: "Gia đình tin dùng" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi tin rằng ăn uống lành mạnh là liều thuốc tự nhiên quý giá nhất cho cơ thể.`,
        "Mỗi giỏ rau quả tươi ngon chúng tôi trao gửi đến bạn là kết tinh của tình yêu đất trời và trách nhiệm vì một thế hệ Việt Nam khỏe mạnh.",
      ],
      stats: [{ value: "100%", label: "Chứng nhận hữu cơ" }, { value: "0%", label: "Hóa chất bảo quản" }, { value: "5,000+", label: "Khách hàng thân thiết" }],
      badge: { icon: "fa-solid fa-shield-heart", value: "Organic Certified", label: "Nông Trại Xanh Xuất Sắc 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Nông Sản Sạch",
      subtitle: (name) => `Những băn khoăn về quy trình kiểm nghiệm và giao hàng tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Chứng nhận", icon: "fa-solid fa-certificate", question: "Rau hữu cơ của trang trại có những chứng nhận nào?", answer: "Chúng tôi đạt chứng nhận tiêu chuẩn Nông nghiệp Hữu cơ Quốc gia TCVN 11041 và kiểm nghiệm vi sinh định kỳ mỗi tháng." },
        { id: "faq-2", badge: "02", category: "Gói tuần", icon: "fa-solid fa-basket-shopping", question: "Gói rau giao định kỳ hoạt động như thế nào?", answer: "Bạn có thể đăng ký gói giỏ rau tuần (từ 5 - 8kg rau củ đa dạng theo mùa), giao cố định 2 - 3 lần/tuần tận nhà." },
        { id: "faq-3", badge: "03", category: "Đổi trả", icon: "fa-solid fa-rotate-left", question: "Nếu rau củ bị dập hỏng trong lúc giao thì xử lý ra sao?", answer: "Chúng tôi cam kết hoàn tiền hoặc bù lại phần sản phẩm mới hoàn toàn miễn phí ngay trong chuyến giao tiếp theo." },
        { id: "faq-4", badge: "04", category: "Tham quan", icon: "fa-solid fa-tractor", question: "Gia đình có thể đến tham quan trải nghiệm nông trại không?", answer: "Có. Vào mỗi cuối tuần, nông trại mở cửa đón các gia đình và trẻ em đến trải nghiệm gieo hạt, thu hoạch rau thực tế." },
      ]
    },
    contact: {
      title: (name) => `Đăng Ký Nhận Thực Phẩm Tươi Sạch Cùng ${name}`,
      channels: [
        { label: "Hotline đặt hàng", value: "1900 6868 (07:00 - 21:00)" },
        { label: "Email", value: (slug) => `farm@${slug}.vn` },
        { label: "Nông trại", value: "Nông Trại Sinh Thái Xanh, Đà Lạt / Củ Chi / Ba Vì" },
      ],
      formTitle: "Đăng ký nhận giỏ rau củ hữu cơ tuần này",
      formMessage: (name) => `Số lượng thành viên trong gia đình hoặc nhu cầu thực phẩm tại ${name}...`,
      formButton: "Đăng ký giỏ rau tươi",
    }
  },

  gaming: {
    defaultName: "CyberPulse Gaming",
    defaultField: "Studio Phát triển Game Đồ họa Cao & Vũ trụ ảo Metaverse",
    defaultSlogan: "Thổi bùng đam mê đồ họa đỉnh cao, bước vào thế giới huyền thoại",
    paletteKey: "creative",
    fontHeading: "Space Grotesk",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Đắm chìm vào thế giới game đồ họa đỉnh cao và gameplay tại",
      rotatingWords: ["đồ họa Unreal Engine 5", "cốt truyện tương tác đa chiều", "đấu trường Multiplayer toàn cầu"],
      subtitle: (name) => `${name} kiến tạo những tựa game hành động nhập vai thế hệ mới với đồ họa chân thực nghẹt thở, vật lý tương tác sống động và đấu trường thể thao điện tử đỉnh cao.`,
      playSample: (name) => `Chiến binh chú ý! Bạn vừa bước vào vũ trụ ${name}. Hãy cầm chắc vũ khí, kích hoạt kỹ năng và cùng đồng đội chinh phục đấu trường huyền thoại ngay hôm nay!`,
      buttons: [{ href: "#features", label: "Trải nghiệm Gameplay", style: "primary" }, { href: "#contact", label: "Đăng ký nhận code thử nghiệm", style: "secondary" }],
    },
    features: {
      title: "Công Nghệ Đồ Họa & Engine Đột Phá",
      subtitle: (name) => `Mọi khung hình trong game tại ${name} được tối ưu hóa cho trải nghiệm mượt mà 120 FPS trên PC và Console.`,
      items: [
        { badge: "01 / UNREAL ENGINE 5", icon: "fa-solid fa-vr-cardboard", title: "Đồ Họa Siêu Thực Lumen & Nanite", desc: "Hệ thống ánh sáng thời gian thực và mô hình đa giác vô tận mang lại khung cảnh sống động như phim điện ảnh." },
        { badge: "02 / AI NPC THÔNG MINH", icon: "fa-solid fa-brain", title: "Trí Tuệ Nhân Tạo Phản Ứng Tự Nhiên", desc: "Kẻ địch và đồng đội NPC tự động học hỏi chiến thuật của người chơi, tạo ra các trận combat nghẹt thở không trùng lặp." },
        { badge: "03 / MULTIPLAYER TOÀN CẦU", icon: "fa-solid fa-gamepad", title: "Đấu Trường Xếp Hạng Độ Trễ < 20ms", desc: "Cụm máy chủ chuyên dụng đặt tại các trung tâm dữ liệu toàn cầu đảm bảo kết nối mượt mà không giật lag." },
        { badge: "04 / ÂM THANH VÒM 3D", icon: "fa-solid fa-headphones", title: "Âm Thanh Không Gian Định Vị Chuẩn", desc: "Bắt trọn từng tiếng bước chân, tiếng súng và tiếng gió rít định hướng chính xác 360 độ trong không gian." },
      ]
    },
    about: {
      eyebrow: "VŨ TRỤ GAME",
      title: "Nơi đam mê công nghệ hòa quyện cùng nghệ thuật kể chuyện",
      subtitle: (name) => `${name} là ngôi nhà của những nhà làm game, họa sĩ 3D và lập trình viên đam mê kiến tạo thế giới ảo lay động hàng triệu trái tim.`,
      slides: [
        { eyebrow: "01 / CỐT TRUYỆN", title: "Chiều sâu văn hóa và cảm xúc", description: "Hành trình sử thi lôi cuốn với nhiều nhánh kết thúc phụ thuộc hoàn toàn vào quyết định của người chơi.", metric: { value: "50+ Giờ", label: "Cốt truyện chính" } },
        { eyebrow: "02 / ĐỒ HỌA", title: "Mô phỏng vật lý chân thực", description: "Môi trường có thể phá hủy hoàn toàn, hiệu ứng thời tiết biến thiên theo thời gian thực tế trong game.", metric: { value: "120 FPS", label: "Tối ưu hóa mượt mà" } },
        { eyebrow: "03 / CỘNG ĐỒNG", title: "Hơn 5 triệu game thủ toàn cầu", description: "Hệ sinh thái thể thao điện tử giải đấu chuyên nghiệp và cộng đồng modding sáng tạo không giới hạn.", metric: { value: "5,000,000+", label: "Game thủ kết nối" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi không đơn thuần tạo ra trò chơi, chúng tôi xây dựng những thế giới kỳ ảo nơi bạn thỏa sức sống với ước mơ của mình.`,
        "Sự hào hứng và những kỷ niệm đáng nhớ của cộng đồng người chơi chính là nguồn cảm hứng lớn nhất thúc đẩy chúng tôi liên tục đổi mới.",
      ],
      stats: [{ value: "5,000,000+", label: "Người chơi toàn cầu" }, { value: "9.5/10", label: "Đánh giá từ giới phê bình" }, { value: "120 FPS", label: "Mượt mà trên PC/Console" }],
      badge: { icon: "fa-solid fa-shield-halved", value: "AAA Game", label: "Studio Game Đột Phá 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Game Thủ",
      subtitle: (name) => `Thông tin về cấu hình máy tính và lịch trình phát hành tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Cấu hình", icon: "fa-solid fa-desktop", question: "Cấu hình máy tính tối thiểu để chơi mượt mà là gì?", answer: "Cấu hình tối thiểu: Intel Core i5 / AMD Ryzen 5, 16GB RAM, card đồ họa GTX 1660 hoặc tương đương, ổ cứng SSD trống 50GB." },
        { id: "faq-2", badge: "02", category: "Beta Test", icon: "fa-solid fa-key", question: "Làm thế nào để nhận key thử nghiệm Close Beta?", answer: "Bạn chỉ cần để lại email đăng ký tại website. Chúng tôi sẽ gửi mã kích hoạt key Steam/Epic Games ngẫu nhiên theo từng đợt." },
        { id: "faq-3", badge: "03", category: "Đa nền tảng", icon: "fa-solid fa-mobile-screen", question: "Game có hỗ trợ chơi chéo (Cross-play) giữa PC và Console không?", answer: "Có. Người chơi trên PC, PlayStation và Xbox có thể ghép trận và tổ đội chiến đấu cùng nhau trong mọi chế độ chơi." },
        { id: "faq-4", badge: "04", category: "Bảo mật", icon: "fa-solid fa-shield", question: "Hệ thống chống hack/cheat hoạt động như thế nào?", answer: "Hệ thống AI Anti-cheat cấp nhân kernel phát hiện và khóa tài khoản gian lận tự động chỉ trong vài giây sau khi có dấu hiệu can thiệp." },
      ]
    },
    contact: {
      title: (name) => `Đăng Ký Nhận Code Thử Nghiệm Alpha Test Cùng ${name}`,
      channels: [
        { label: "Discord Community", value: "discord.gg/cyberpulse" },
        { label: "Email", value: (slug) => `community@${slug}.gg` },
        { label: "Studio", value: "Khu Công Nghệ Giải Trí Số, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký nhận code thử nghiệm & Quà tặng độc quyền",
      formMessage: (name) => `Nền tảng bạn thường chơi game (PC, PS5, Xbox) và nickname mong muốn tại ${name}...`,
      formButton: "Nhận Code Close Beta Ngay",
    }
  },

  finance: {
    defaultName: "FinTech Core",
    defaultField: "Giải pháp Quản lý Tài chính Số & Đầu tư Thông minh",
    defaultSlogan: "Quản trị tài chính thông minh, bảo toàn và gia tăng tài sản",
    paletteKey: "gold",
    fontHeading: "Plus Jakarta Sans",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Nền tảng quản lý tài sản và giải pháp đầu tư sinh lời tại",
      rotatingWords: ["lãi suất cạnh tranh", "bảo mật chuẩn ngân hàng", "phân tích danh mục bằng AI"],
      subtitle: (name) => `${name} kết hợp công nghệ tài chính hiện đại và thuật toán học máy để tối ưu hóa danh mục đầu tư, quản lý dòng tiền tự động và bảo toàn tài sản an toàn tuyệt đối cho bạn.`,
      playSample: (name) => `Xin chào! Bạn đang truy cập cổng tài chính số ${name}. Hãy cùng chúng tôi xây dựng kế hoạch tài chính vững vàng và gia tăng tài sản bền vững cho tương lai.`,
      buttons: [{ href: "#features", label: "Khám phá giải pháp đầu tư", style: "primary" }, { href: "#contact", label: "Mở tài khoản tư vấn VIP", style: "secondary" }],
    },
    features: {
      title: "Năng Lực Công Nghệ Tài Chính Tiên Phong",
      subtitle: (name) => `Hệ thống giao dịch tại ${name} được giám sát nghiêm ngặt theo các tiêu chuẩn pháp lý tài chính quốc tế.`,
      items: [
        { badge: "01 / PHÂN TÍCH AI", icon: "fa-solid fa-chart-pie", title: "Cơ Cấu Danh Mục Bằng Trí Tuệ Nhân Tạo", desc: "Thuật toán Robo-advisor tự động phân bổ tài sản thông minh dựa trên khẩu vị rủi ro và mục tiêu tài chính cá nhân." },
        { badge: "02 / BẢO MẬT ĐA TẦNG", icon: "fa-solid fa-vault", title: "Bảo Mật Cấp Ngân Hàng 256-bit", desc: "Xác thực sinh trắc học vân tay/khuôn mặt kết hợp khóa mã hóa phần cứng HSM chống gian lận tuyệt đối." },
        { badge: "03 / KHỚP LỆNH TỨC THÌ", icon: "fa-solid fa-bolt", title: "Độ Trễ Khớp Lệnh Siêu Thấp < 10ms", desc: "Hạ tầng kết nối trực tiếp các sàn giao dịch chứng khoán và quỹ đầu tư, đảm bảo giá khớp lệnh tối ưu nhất." },
        { badge: "04 / CỐ VẤN RIÊNG 1-1", icon: "fa-solid fa-user-tie", title: "Chuyên Gia Tài Chính Đồng Hành", desc: "Đội ngũ chuyên gia có chứng chỉ CFA/CFP hỗ trợ hoạch định kế hoạch hưu trí, thuế và quản trị tài sản gia đình." },
      ]
    },
    about: {
      eyebrow: "MINH BẠCH & AN TOÀN",
      title: "Đồng hành kiến tạo tự do tài chính bền vững",
      subtitle: (name) => `${name} phụng sự khách hàng với triết lý quản trị rủi ro nghiêm cẩn và minh bạch tuyệt đối trong mọi giao dịch.`,
      slides: [
        { eyebrow: "01 / BẢO TOÀN", title: "Ưu tiên bảo toàn vốn hàng đầu", description: "Chiến lược phân bổ đa dạng lớp tài sản giúp giảm thiểu biến động thị trường và sinh lời ổn định.", metric: { value: "100%", label: "Minh bạch tài sản" } },
        { eyebrow: "02 / CÔNG NGHỆ", title: "Tự động hóa thông minh", description: "Báo cáo hiệu suất đầu tư và tái cân bằng danh mục tự động hoàn toàn chỉ với 1 chạm.", metric: { value: "100%", label: "Tự động hóa" } },
        { eyebrow: "03 / TÍN NHIỆM", title: "Quản lý hơn 5,000 tỷ đồng tài sản", description: "Được hàng chục ngàn nhà đầu tư cá nhân và doanh nghiệp tin tưởng trao gửi quản lý dòng tiền.", metric: { value: "5,000+ Tỷ", label: "Tài sản quản lý (AUM)" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi tin rằng ai cũng xứng đáng có được một kế hoạch tài chính rõ ràng, khoa học và hiệu quả.`,
        "Sự thịnh vượng và an tâm tài chính lâu dài của bạn chính là tôn chỉ hoạt động cao nhất của toàn thể đội ngũ chúng tôi.",
      ],
      stats: [{ value: "5,000+ Tỷ", label: "Tài sản quản lý" }, { value: "99.99%", label: "Giao dịch an toàn" }, { value: "12-18%", label: "Lợi nhuận mục tiêu/năm" }],
      badge: { icon: "fa-solid fa-coins", value: "Fintech Leader", label: "Nền Tảng Tài Chính Số Tiêu Biểu 2026" },
    },
    faq: {
      title: "Câu Hỏi Thường Gặp Về Đầu Tư",
      subtitle: (name) => `Những thắc mắc phổ biến về việc gửi tiền, rút vốn và bảo mật tài khoản tại ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Vốn khởi đầu", icon: "fa-solid fa-wallet", question: "Số vốn tối thiểu để bắt đầu đầu tư là bao nhiêu?", answer: "Bạn có thể bắt đầu tích lũy đầu tư chỉ từ 500.000 VNĐ. Hệ thống tự động phân bổ tài sản đều vào các quỹ mở hàng đầu." },
        { id: "faq-2", badge: "02", category: "Rút tiền", icon: "fa-solid fa-money-bill-transfer", question: "Khi cần tiền khẩn cấp tôi có được rút vốn nhanh không?", answer: "Có. Bạn có thể đặt lệnh rút tiền về tài khoản ngân hàng chính chủ bất cứ lúc nào, tiền về tài khoản trong 24 giờ làm việc." },
        { id: "faq-3", badge: "03", category: "Pháp lý", icon: "fa-solid fa-landmark", question: "Tài sản của tôi được lưu ký an toàn ở đâu?", answer: "Toàn bộ tài sản chứng khoán và tiền mặt được lưu ký độc lập tại Ngân hàng Giám sát uy tín theo quy định của Ủy ban Chứng khoán." },
        { id: "faq-4", badge: "04", category: "Thuế", icon: "fa-solid fa-file-invoice-dollar", question: "Ứng dụng có hỗ trợ xuất báo cáo thuế thu nhập cá nhân không?", answer: "Có. Hệ thống tự động tổng hợp chứng từ khấu trừ thuế TNCN cuối năm để bạn nộp quyết toán thuế nhanh chóng." },
      ]
    },
    contact: {
      title: (name) => `Tư Vấn Quản Lý Tài Sản & Mở Tài Khoản Cùng ${name}`,
      channels: [
        { label: "Tổng đài tư vấn VIP", value: "1900 6868 (08:30 - 17:30)" },
        { label: "Email", value: (slug) => `wealth@${slug}.vn` },
        { label: "Trụ sở", value: "Trung tâm Tài chính Quốc tế, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký nhận báo cáo cơ cấu danh mục tài sản",
      formMessage: (name) => `Khẩu vị rủi ro và mục tiêu tài chính của bạn cùng ${name}...`,
      formButton: "Nhận bản tư vấn tài chính",
    }
  },

  callcenter: {
    defaultName: "OmniClarity CSKH",
    defaultField: "Hệ thống Tổng đài Đa kênh & Chăm sóc Khách hàng AI",
    defaultSlogan: "Lắng nghe từng cảm xúc, phản hồi tức thì mọi điểm chạm",
    paletteKey: "data",
    fontHeading: "Space Grotesk",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Hệ thống tổng đài đa kênh tích hợp AI lắng nghe tại",
      rotatingWords: ["định tuyến cuộc gọi thông minh", "nhận diện giọng nói chuẩn xác", "báo cáo phân tích cảm xúc"],
      subtitle: (name) => `${name} cung cấp nền tảng Contact Center đám mây hợp nhất kênh Thoại, Chat, Email và Mạng xã hội, tích hợp Voicebot AI thông minh tự động hóa 80% cuộc gọi lặp lại của doanh nghiệp.`,
      playSample: (name) => `Kính chào quý khách! Bạn đang kết nối với tổng đài thông minh ${name}. Trợ lý AI sẵn sàng giải đáp mọi thắc mắc của bạn tức thì và chuẩn xác nhất.`,
      buttons: [{ href: "#features", label: "Tính năng tổng đài", style: "primary" }, { href: "#contact", label: "Dùng thử miễn phí 14 ngày", style: "secondary" }],
    },
    features: {
      title: "Nền Tảng Contact Center Đa Kênh Toàn Diện",
      subtitle: (name) => `Mọi cuộc gọi và tin nhắn tại ${name} được điều phối tự động đến đúng nhân viên phụ trách chỉ trong 1 giây.`,
      items: [
        { badge: "01 / TRỢ LÝ VOICEBOT AI", icon: "fa-solid fa-headset", title: "Tự Động Trả Lời Cuộc Gọi 24/7", desc: "Voicebot AI nghe máy tự nhiên, giải đáp các câu hỏi thường gặp và tự động đặt lịch hẹn mà không cần nhân viên can thiệp." },
        { badge: "02 / HỢP NHẤT ĐA KÊNH", icon: "fa-solid fa-network-wired", title: "Thoại - Zalo - Facebook - Email", desc: "Gộp toàn bộ lịch sử trò chuyện của khách hàng trên mọi kênh về một màn hình duy nhất cho điện thoại viên." },
        { badge: "03 / GHI ÂM & BÓC BĂNG", icon: "fa-solid fa-file-audio", title: "Chuyển Đổi Giọng Nói Thành Văn Bản", desc: "Tự động ghi âm và chuyển toàn bộ nội dung cuộc gọi thành văn bản tiếng Việt chuẩn xác 98% ngay sau khi cúp máy." },
        { badge: "04 / PHÂN TÍCH CẢM XÚC", icon: "fa-solid fa-face-smile", title: "Báo Cáo Đo Lường Hài Lòng Realtime", desc: "Thuật toán AI tự động chấm điểm thái độ của nhân viên và mức độ hài lòng của khách hàng trên từng cuộc gọi." },
      ]
    },
    about: {
      eyebrow: "TRẢI NGHIỆM KHÁCH HÀNG",
      title: "Nâng tầm dịch vụ chăm sóc khách hàng chuẩn mực quốc tế",
      subtitle: (name) => `${name} giúp doanh nghiệp biến mỗi cuộc gọi hỗ trợ thành một cơ hội gia tăng lòng trung thành của khách hàng.`,
      slides: [
        { eyebrow: "01 / KHÔNG CHỜ ĐỢI", title: "Xóa tan thời gian chờ máy", description: "Hạ tầng chịu tải hàng ngàn cuộc gọi đồng thời không bao giờ báo bận trong giờ cao điểm.", metric: { value: "0 Giây", label: "Thời gian chờ máy" } },
        { eyebrow: "02 / THẤU HIỂU", title: "Hiển thị thông tin khách hàng tức thì", description: "Khi khách gọi đến, màn hình tự động bật popup tên, lịch sử mua hàng và ghi chú từ CRM.", metric: { value: "100%", label: "Nhận diện khách quen" } },
        { eyebrow: "03 / HIỆU QUẢ", title: "Tiết kiệm 50% chi phí vận hành", description: "Giảm tải áp lực công việc cho nhân viên tổng đài và nâng cao năng suất xử lý khiếu nại gấp 3 lần.", metric: { value: "50%", label: "Tiết kiệm chi phí" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi tin rằng dịch vụ khách hàng xuất sắc bắt nguồn từ sự lắng nghe chân thành và phản hồi nhanh chóng.`,
        "Nền tảng công nghệ tổng đài của chúng tôi chính là trợ thủ đắc lực giúp doanh nghiệp của bạn ghi điểm tuyệt đối trong mắt khách hàng.",
      ],
      stats: [{ value: "10,000,000+", label: "Cuộc gọi phục vụ/tháng" }, { value: "98.5%", label: "Tỷ lệ nhận diện giọng nói" }, { value: "50%", label: "Giảm chi phí vận hành" }],
      badge: { icon: "fa-solid fa-phone-volume", value: "Cloud PBX", label: "Tổng Đài Thông Minh Xuất Sắc 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Tổng Đài",
      subtitle: (name) => `Những thông tin về việc cài đặt và tích hợp tổng đài đám mây cùng ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Triển khai", icon: "fa-solid fa-plug", question: "Doanh nghiệp có cần mua phần cứng tổng đài cồng kềnh không?", answer: "Không. Đây là tổng đài đám mây 100%, nhân viên chỉ cần máy tính kết nối tai nghe hoặc điện thoại smartphone là có thể nghe gọi." },
        { id: "faq-2", badge: "02", category: "Tích hợp", icon: "fa-solid fa-code-branch", question: "Tổng đài có kết nối được với CRM như Salesforce, HubSpot không?", answer: "Có. Chúng tôi hỗ trợ tích hợp sẵn với Salesforce, HubSpot, Zoho, Bitrix24 và bất kỳ hệ thống nội bộ nào qua Webhook/API." },
        { id: "faq-3", badge: "03", category: "Đầu số", icon: "fa-solid fa-phone", question: "Tôi có thể dùng đầu số 1900, 1800 hoặc số cố định sẵn có không?", answer: "Có. Hệ thống hỗ trợ đấu nối tất cả các đầu số 1900, 1800, số cố định và số hotline di động của tất cả các nhà mạng Viettel, VNPT, Mobifone." },
        { id: "faq-4", badge: "04", category: "Dùng thử", icon: "fa-solid fa-clock-rotate-left", question: "Chương trình dùng thử miễn phí có bị giới hạn tính năng không?", answer: "Bạn được dùng thử miễn phí 14 ngày đầy đủ toàn bộ tính năng cao cấp của gói Doanh nghiệp cùng đội ngũ kỹ thuật hướng dẫn tận tình." },
      ]
    },
    contact: {
      title: (name) => `Trải Nghiệm Tổng Đài Thông Minh Cùng ${name}`,
      channels: [
        { label: "Hotline kinh doanh", value: "1900 6868 (08:00 - 18:00)" },
        { label: "Email", value: (slug) => `sales@${slug}.vn` },
        { label: "Trụ sở", value: "Trung tâm Viễn thông & Đám mây, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký dùng thử tổng đài 14 ngày miễn phí",
      formMessage: (name) => `Số lượng điện thoại viên hoặc nhu cầu tính năng tổng đài tại ${name}...`,
      formButton: "Kích hoạt dùng thử ngay",
    }
  },

  audio: {
    defaultName: "ViVoice Studio",
    defaultField: "Phần mềm Thu âm Giọng nói Cao cấp & Phòng thu âm AI",
    defaultSlogan: "Chuẩn mực thu âm & xử lý giọng nói chuẩn Studio chuyên nghiệp",
    paletteKey: "cyber",
    fontHeading: "Space Grotesk",
    radius: "16px",
    hero: {
      layout: "voice-studio",
      title: "Phần mềm thu âm giọng nói cao cấp cùng",
      rotatingWords: ["chuẩn Master 96kHz", "lọc ồn AI thời gian thực", "giọng đọc siêu thực"],
      subtitle: (name) => `${name} là giải pháp phòng thu âm số thế hệ mới, tích hợp công nghệ AI tái tạo âm sắc trong trẻo, khử tạp âm tự động và lồng tiếng đa ngôn ngữ chuẩn phát thanh truyền hình.`,
      playSample: (name) => `Xin chào! Bạn đang trải nghiệm chất lượng âm thanh 32-bit floating point được thu và xử lý trực tiếp qua phần mềm ${name}.`,
      buttons: [{ href: "#demo", label: "Trải nghiệm phòng thu", style: "primary" }, { href: "#features", label: "Khám phá tính năng", style: "secondary" }],
    },
    features: {
      title: "Năng Lực Xử Lý Âm Thanh Chuẩn Master",
      subtitle: "Trang bị đầy đủ chuỗi xử lý tín hiệu DSP chuyên sâu, mang cả phòng thu âm triệu đô lên không gian làm việc của bạn.",
      items: [
        { badge: "01 / CHẤT LƯỢNG MASTER", icon: "fa-solid fa-microphone-lines", title: "Ghi Âm Chuẩn 32-bit / 192kHz", desc: "Dải động cực rộng chống méo tiếng tuyệt đối, bắt trọn từng sắc thái biểu cảm và hơi thở tự nhiên nhất." },
        { badge: "02 / KHỬ ỒN AI THÔNG MINH", icon: "fa-solid fa-waveform-lines", title: "Khử Tạp Âm & Vang Phòng Realtime", desc: "Thuật toán học sâu loại bỏ tức thì tiếng ồn quạt gió, tiếng gõ phím và tiếng dội âm chỉ trong 0.05 giây." },
        { badge: "03 / GIỌNG NÓI SIÊU THỰC", icon: "fa-solid fa-wand-magic-sparkles", title: "Hơn 200+ Chất Giọng Cảm Xúc", desc: "Tái tạo giọng đọc tự nhiên với đa dạng âm sắc, từ ấm áp, truyền cảm đến chuyên nghiệp chuẩn phát thanh." },
        { badge: "04 / MASTERING TỰ ĐỘNG", icon: "fa-solid fa-sliders", title: "Tự Động Cân Bằng & Xuất Đa Định Dạng", desc: "Tự động chuẩn hóa âm lượng theo chuẩn phát sóng quốc tế LUFS, xuất file WAV Lossless, FLAC, MP3 320kbps." },
      ]
    },
    about: {
      eyebrow: "CÂU CHUYỆN PHÁT TRIỂN",
      title: "Hành trình đưa âm thanh chuẩn phòng thu đến mọi nhà sáng tạo",
      subtitle: (name) => `${name} ra đời với sứ mệnh xóa nhòa rào cản phòng thu đắt đỏ, giúp podcaster, MC và nhà sáng tạo tự tin cất tiếng nói.`,
      slides: [
        { eyebrow: "01 / KHỞI NGUỒN", title: "Khát vọng âm thanh trung thực", description: "Từng chi tiết âm thanh được tối ưu hóa để giữ trọn vẹn cảm xúc tự nhiên của người nói.", metric: { value: "32-bit", label: "Chuẩn thu Float Point" } },
        { eyebrow: "02 / ĐỘT PHÁ AI", title: "Khử nhiễu chính xác 99.9%", description: "Mô hình nơ-ron học sâu phân tách giọng nói và môi trường với độ chính xác chuẩn phòng thí nghiệm.", metric: { value: "99.9%", label: "Lọc sạch tạp âm" } },
        { eyebrow: "03 / TIN CẬY", title: "Hơn 50,000 giờ thu âm", description: "Được hàng ngàn đài phát thanh, studio lồng tiếng và kênh podcast tin dùng sản xuất hằng ngày.", metric: { value: "50,000+", label: "Giờ thu xuất bản" } },
      ],
      paragraphs: (name) => [
        `${name} khởi nguồn từ khát vọng mang lại chất lượng âm thanh phòng thu hàng đầu cho mọi nhà sáng tạo nội dung mà không đòi hỏi chi phí thiết bị đắt đỏ.`,
        "Chúng tôi kết hợp giữa kỹ thuật xử lý tín hiệu số DSP chuyên sâu và trí tuệ nhân tạo để mọi bản thu của bạn luôn đạt chuẩn mực phát sóng quốc tế.",
      ],
      stats: [{ value: "32-bit", label: "Chuẩn thu Float Point" }, { value: "99.9%", label: "Độ trong trẻo âm thanh" }, { value: "50,000+", label: "Giờ thu xuất bản" }],
      badge: { icon: "fa-solid fa-award", value: "Studio Pro", label: "Giải Vàng Âm Thanh Số 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Thường Gặp",
      subtitle: (name) => `Những câu hỏi phổ biến nhất về cách vận hành và chất lượng thu âm của ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Phần cứng", icon: "fa-solid fa-microphone", question: "Phần mềm có hỗ trợ micro rời và soundcard ngoài không?", answer: "Có. Tự động nhận diện tất cả micro USB, XLR thông qua soundcard và tối ưu hóa tiền khuếch đại (preamp) tự động." },
        { id: "faq-2", badge: "02", category: "Công nghệ", icon: "fa-solid fa-wand-magic-sparkles", question: "Khả năng khử tiếng ồn môi trường hoạt động như thế nào?", answer: "Bộ lọc AI phân tách giọng nói và tạp âm theo thời gian thực với độ trễ cực thấp dưới 5ms, lọc sạch tiếng quạt, bàn phím và tiếng vang phòng." },
        { id: "faq-3", badge: "03", category: "Bản quyền", icon: "fa-solid fa-certificate", question: "Tôi có được cấp toàn quyền thương mại cho bản thu không?", answer: "Có. Bạn sở hữu 100% bản quyền thương mại đối với tất cả các tập podcast, bản lồng tiếng hoặc tệp âm thanh được xuất ra." },
        { id: "faq-4", badge: "04", category: "Định dạng", icon: "fa-solid fa-file-audio", question: "Phần mềm hỗ trợ xuất những định dạng âm thanh nào?", answer: "Hỗ trợ xuất đa dạng định dạng chuẩn phòng thu: WAV Lossless (24/32-bit), FLAC, MP3 320kbps và AAC tương thích mọi nền tảng số." },
      ]
    },
    contact: {
      title: (name) => `Trải Nghiệm & Cấp Bản Quyền ${name}`,
      channels: [
        { label: "Hotline kỹ thuật", value: "1900 6868 (24/7)" },
        { label: "Email", value: (slug) => `studio@${slug}.vn` },
        { label: "Studio", value: "Trung tâm Công nghệ Âm thanh, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký nhận bản dùng thử Studio Pro",
      formMessage: (name) => `Nhu cầu sử dụng thu âm, podcast hoặc lồng tiếng cùng ${name}...`,
      formButton: "Nhận tài khoản trải nghiệm ngay",
    }
  },

  tech: {
    defaultName: "NovaTech AI",
    defaultField: "Nền tảng Chuyển đổi số & Giải pháp Phần mềm Đám mây",
    defaultSlogan: "Tăng tốc đổi mới sáng tạo, bứt phá hiệu suất kinh doanh số",
    paletteKey: "data",
    fontHeading: "Space Grotesk",
    radius: "16px",
    hero: {
      layout: "centered",
      title: "Hệ sinh thái phần mềm đám mây và trí tuệ nhân tạo tại",
      rotatingWords: ["tự động hóa quy trình", "bảo mật điện toán đám mây", "phân tích dữ liệu lớn"],
      subtitle: (name) => `${name} mang đến bộ giải pháp công nghệ số toàn diện, giúp doanh nghiệp tự động hóa vận hành, tối ưu chi phí và gia tăng năng suất vượt bậc trong kỷ nguyên AI.`,
      playSample: (name) => `Xin chào! Bạn đang trải nghiệm giao diện White Label thế hệ mới của ${name}. Nền tảng số được thiết kế linh hoạt sẵn sàng cho mọi nhu cầu bứt phá.`,
      buttons: [{ href: "#features", label: "Khám phá giải pháp", style: "primary" }, { href: "#contact", label: "Nhận tư vấn chuyển đổi số", style: "secondary" }],
    },
    features: {
      title: "Năng Lực Công Nghệ Tiên Phong",
      subtitle: (name) => `Nền tảng kiến trúc microservices tại ${name} đáp ứng hàng triệu giao dịch mỗi giây với độ ổn định 99.99%.`,
      items: [
        { badge: "01 / TỰ ĐỘNG HÓA", icon: "fa-solid fa-robot", title: "Tự Động Hóa Nghiệp Vụ Bằng AI", desc: "Loại bỏ hoàn toàn các thao tác thủ công lặp lại, tiết kiệm 70% thời gian xử lý hồ sơ dữ liệu." },
        { badge: "02 / ĐÁM MÂY LINH HOẠT", icon: "fa-solid fa-cloud", title: "Hạ Tầng Cloud Auto-scaling", desc: "Mở rộng tài nguyên tức thì theo nhu cầu truy cập thực tế, đảm bảo hệ thống không bao giờ gián đoạn." },
        { badge: "03 / DỮ LIỆU THỜI GIAN THỰC", icon: "fa-solid fa-chart-line", title: "Báo Cáo Trực Quan Realtime", desc: "Bảng điều khiển trực quan giúp ban lãnh đạo ra quyết định kinh doanh chính xác dựa trên dữ liệu." },
        { badge: "04 / AN TOÀN BẢO MẬT", icon: "fa-solid fa-lock", title: "Bảo Mật Cấp Doanh Nghiệp ISO", desc: "Mã hóa dữ liệu 256-bit chuẩn ngân hàng và kiểm soát phân quyền truy cập đa tầng nghiêm ngặt." },
      ]
    },
    about: {
      eyebrow: "SỨ MỆNH SỐ HÓA",
      title: "Kiến tạo tương lai số bền vững cho doanh nghiệp",
      subtitle: (name) => `${name} đồng hành cùng các tổ chức tiên phong bứt phá giới hạn nhờ sức mạnh của dữ liệu và trí tuệ nhân tạo.`,
      slides: [
        { eyebrow: "01 / ĐỘI NGŨ", title: "Kỹ sư công nghệ tinh hoa", description: "Tập hợp các chuyên gia đầu ngành trong lĩnh vực Trí tuệ nhân tạo và Điện toán đám mây.", metric: { value: "100+", label: "Chuyên gia công nghệ" } },
        { eyebrow: "02 / TỐC ĐỘ", title: "Triển khai thần tốc và mượt mà", description: "Hệ thống tích hợp nhanh qua API mở, rút ngắn thời gian đưa sản phẩm ra thị trường 3 lần.", metric: { value: "99.99%", label: "Uptime ổn định" } },
        { eyebrow: "03 / GIÁ TRỊ", title: "Tối ưu chi phí và tăng trưởng", description: "Giúp đối tác tăng trưởng 200% doanh thu trực tuyến chỉ sau 6 tháng áp dụng giải pháp.", metric: { value: "500+", label: "Doanh nghiệp tin dùng" } },
      ],
      paragraphs: (name) => [
        `Tại ${name}, chúng tôi biến các thách thức kỹ thuật phức tạp thành những trải nghiệm phần mềm trực quan, dễ sử dụng.`,
        "Sự chuyển mình vượt bậc trong hiệu quả kinh doanh của khách hàng chính là thước đo thành công quý giá nhất của chúng tôi.",
      ],
      stats: [{ value: "500+", label: "Khách hàng Doanh nghiệp" }, { value: "99.99%", label: "Uptime cam kết" }, { value: "24/7", label: "Hỗ trợ chuyên gia" }],
      badge: { icon: "fa-solid fa-award", value: "SaaS Tech", label: "Giải Pháp Số Tiêu Biểu 2026" },
    },
    faq: {
      title: "Giải Đáp Thắc Mắc Giải Pháp Số",
      subtitle: (name) => `Những câu hỏi phổ biến về việc tích hợp và bảo mật hệ thống cùng ${name}.`,
      items: [
        { id: "faq-1", badge: "01", category: "Triển khai", icon: "fa-solid fa-plug", question: "Thời gian triển khai giải pháp vào hệ thống sẵn có mất bao lâu?", answer: "Nhờ kiến trúc Cloud API mở, hầu hết khách hàng hoàn tất tích hợp và chạy thử nghiệm chỉ trong 3 - 5 ngày làm việc." },
        { id: "faq-2", badge: "02", category: "Bảo mật", icon: "fa-solid fa-shield-halved", question: "Dữ liệu doanh nghiệp của tôi có được bảo mật an toàn không?", answer: "Tuyệt đối an toàn. Dữ liệu được mã hóa đầu cuối AES-256, lưu trữ trên cụm máy chủ chuẩn ISO 27001 và sao lưu tự động mỗi ngày." },
        { id: "faq-3", badge: "03", category: "Chi phí", icon: "fa-solid fa-coins", question: "Mô hình tính phí của giải pháp như thế nào?", answer: "Chúng tôi áp dụng mô hình thuê bao linh hoạt theo nhu cầu sử dụng thực tế (SaaS), không đòi hỏi chi phí đầu tư phần cứng ban đầu." },
        { id: "faq-4", badge: "04", category: "Hỗ trợ", icon: "fa-solid fa-headset", question: "Doanh nghiệp có được hỗ trợ kỹ thuật khi gặp sự cố không?", answer: "Có. Đội ngũ kỹ sư hỗ trợ 24/7/365 với cam kết phản hồi sự cố trong vòng 15 phút qua kênh chuyên trách." },
      ]
    },
    contact: {
      title: (name) => `Tư Vấn & Trải Nghiệm Nền Tảng ${name}`,
      channels: [
        { label: "Tổng đài hỗ trợ", value: "1900 6868 (24/7/365)" },
        { label: "Email", value: (slug) => `solutions@${slug}.vn` },
        { label: "Trụ sở", value: "Công viên Phần mềm Công nghệ cao, Hà Nội / TP.HCM" },
      ],
      formTitle: "Đăng ký nhận bản Demo và Báo giá giải pháp",
      formMessage: (name) => `Bài toán kinh doanh hoặc nhu cầu công nghệ số của bạn cùng ${name}...`,
      formButton: "Gửi yêu cầu tư vấn",
    }
  }
};

export function generateBrandJsonOffline({ name, field, slogan, paletteKey, promptQuery }) {
  const combinedContext = [field, promptQuery, name, slogan].filter(Boolean).join(" ");
  const detectedTopic = detectIndustryTopic(combinedContext);
  const tpl = INDUSTRY_TEMPLATES[detectedTopic] || INDUSTRY_TEMPLATES.tech;

  const brandName =
    (name && name.trim()) ||
    extractBrandNameFromPrompt(combinedContext, detectedTopic) ||
    tpl.defaultName;

  const brandField = (field && field.trim()) || tpl.defaultField;
  const brandSlogan = (slogan && slogan.trim()) || tpl.defaultSlogan;

  const slug =
    brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-") || detectedTopic;

  const photos = getDiverseBrandPhotos(detectedTopic, brandName);

  // Phối màu nhận diện chuẩn
  let pal = null;
  if (paletteKey && BRAND_PALETTES[paletteKey]) {
    pal = BRAND_PALETTES[paletteKey];
  } else if (tpl.paletteKey && BRAND_PALETTES[tpl.paletteKey]) {
    pal = BRAND_PALETTES[tpl.paletteKey];
  } else {
    pal = BRAND_PALETTES.data;
  }

  const sections = [
    {
      type: "hero",
      layout: tpl.hero.layout || "centered",
      welcomeMessage: `Chào mừng bạn đến với ${brandName}`,
      welcomeAudio: "",
      title: `${tpl.hero.title} ${brandName}`,
      rotatingWords: tpl.hero.rotatingWords,
      subtitle:
        typeof tpl.hero.subtitle === "function"
          ? tpl.hero.subtitle(brandName)
          : tpl.hero.subtitle,
      playSample:
        typeof tpl.hero.playSample === "function"
          ? tpl.hero.playSample(brandName)
          : tpl.hero.playSample,
      buttons: tpl.hero.buttons,
    },
    {
      type: "features",
      layout: "bento",
      title: tpl.features.title,
      subtitle:
        typeof tpl.features.subtitle === "function"
          ? tpl.features.subtitle(brandName)
          : tpl.features.subtitle,
      items: tpl.features.items.map((it, idx) => ({
        badge: it.badge,
        icon: it.icon,
        title: it.title,
        desc: it.desc,
        text: it.desc,
        image: photos[idx % photos.length],
      })),
    },
    {
      type: "about",
      layout: "sticky-story",
      eyebrow: tpl.about.eyebrow,
      title: tpl.about.title,
      subtitle:
        typeof tpl.about.subtitle === "function"
          ? tpl.about.subtitle(brandName)
          : tpl.about.subtitle,
      image: photos[4] || photos[0],
      scrollStory: {
        enabled: true,
        behavior: "sticky-story",
        slides: tpl.about.slides.map((s, idx) => ({
          image: photos[(idx + 4) % photos.length] || photos[idx % photos.length],
          eyebrow: s.eyebrow,
          title: s.title,
          description: s.description,
          metric: s.metric,
        })),
        animation: {
          imageScaleFrom: 1.08,
          imageScaleTo: 1,
          revealDistance: 28,
          transitionMs: 650,
        },
      },
      paragraphs:
        typeof tpl.about.paragraphs === "function"
          ? tpl.about.paragraphs(brandName)
          : tpl.about.paragraphs,
      stats: tpl.about.stats,
      badge: tpl.about.badge,
    },
    {
      type: "testimonials",
      layout: "marquee",
      title: `Khách Hàng Nói Gì Về ${brandName}`,
      subtitle: `Những đánh giá thực tế từ đối tác và khách hàng tin chọn ${brandName}.`,
      eyebrow: "ĐÁNH GIÁ CHÂN THỰC",
      items: getFallbackTestimonials(detectedTopic, brandName),
    },
    {
      type: "faq",
      layout: "3d-flip-cards",
      title: tpl.faq.title,
      subtitle:
        typeof tpl.faq.subtitle === "function"
          ? tpl.faq.subtitle(brandName)
          : tpl.faq.subtitle,
      items: tpl.faq.items.map((it) => ({
        id: it.id,
        badge: it.badge,
        category: it.category,
        icon: it.icon,
        question: it.question,
        answer: it.answer,
        frontHint: "Bấm để xem câu trả lời",
        backAction: "Quay lại",
      })),
    },
    {
      type: "contact",
      title:
        typeof tpl.contact.title === "function"
          ? tpl.contact.title(brandName)
          : tpl.contact.title,
      channels: tpl.contact.channels.map((c) => ({
        label: c.label,
        value: typeof c.value === "function" ? c.value(slug) : c.value,
      })),
      formTitle: tpl.contact.formTitle,
      formName: "Họ và tên của bạn",
      formEmail: "Số điện thoại / Email",
      formMessage:
        typeof tpl.contact.formMessage === "function"
          ? tpl.contact.formMessage(brandName)
          : tpl.contact.formMessage,
      formButton: tpl.contact.formButton,
      formSuccess: `Cảm ơn bạn! Đội ngũ ${brandName} đã nhận được thông tin và sẽ phản hồi trong vòng 15 phút.`,
    },
  ];

  // Chèn demo console nếu là audio studio
  if (detectedTopic === "audio") {
    sections.splice(1, 0, {
      type: "demo",
      title: "Phòng Thu Âm Tương Tác Trực Tuyến",
      subtitle: `Cảm nhận độ trung thực vượt trội của bộ giải mã âm thanh AI và thử nghiệm trực tiếp cùng ${brandName}.`,
      placeholder: "Nhập văn bản cần thu âm hoặc lồng tiếng thử nghiệm...",
      defaultText: `Xin chào! Đây là bản thu thử nghiệm với công nghệ âm thanh chuẩn Studio 32-bit từ ${brandName}. Mọi chi tiết âm sắc đều được tái hiện chân thực và sắc nét.`,
      speakButtonText: "Kích hoạt thu âm / Nghe thử",
    });
  }

  const base = {
    brand: { name: brandName, slogan: brandSlogan, field: brandField },
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
      fontHeading: tpl.fontHeading || "Space Grotesk",
      fontBody: "Be Vietnam Pro",
      radius: tpl.radius || "16px",
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
  const calloutMicStart = document.getElementById("ai-callout-mic-start");
  const voiceBubble = document.getElementById("ai-voice-bubble");
  const voiceStatusText = document.getElementById("ai-voice-status-text");
  const voiceBubbleContent = document.getElementById("ai-voice-bubble-content");
  const voiceBtnChat = document.getElementById("ai-voice-btn-chat");
  const voiceBtnClose = document.getElementById("ai-voice-btn-close");
  const micBtn = document.getElementById("ai-chat-mic");

  if (!widget || !toggleBtn || !panel) return;

  // ============================================================================
  // QUẢN LÝ CHẾ ĐỘ TRÒ CHUYỆN BẰNG GIỌNG NÓI VỚI ICON AI (VOICE CHAT MODE)
  // ============================================================================
  let isVoiceModeActive = false;
  let isRecognitionActive = false;
  let voiceTranscript = "";
  let recognition = null;
  let voiceRestartTimer = null;

  function updateVoiceBubbleStatus(text, state = "listening") {
    if (voiceStatusText) voiceStatusText.textContent = text;
    if (voiceBubble) {
      voiceBubble.classList.remove("is-processing", "is-speaking", "is-listening");
      voiceBubble.classList.add(`is-${state}`);
    }
    if (toggleBtn) {
      toggleBtn.classList.remove("is-listening", "is-processing");
      if (state === "listening") toggleBtn.classList.add("is-listening");
      if (state === "processing") toggleBtn.classList.add("is-processing");
    }
  }

  function updateVoiceBubbleContent(html) {
    if (voiceBubbleContent) {
      voiceBubbleContent.innerHTML = html;
    }
  }

  function startVoiceListening() {
    if (!recognition) return;
    if (isRecognitionActive) return;
    if (audioState.isPlaying || isGenerating) return;

    try {
      recognition.start();
    } catch (err) {
      console.warn("Speech recognition start warning:", err);
    }
  }

  function stopVoiceListening() {
    if (voiceRestartTimer) {
      clearTimeout(voiceRestartTimer);
      voiceRestartTimer = null;
    }
    if (recognition && isRecognitionActive) {
      try {
        recognition.stop();
      } catch (e) {}
    }
    isRecognitionActive = false;
  }

  function scheduleVoiceListening(delay = 600) {
    if (voiceRestartTimer) clearTimeout(voiceRestartTimer);
    voiceRestartTimer = setTimeout(() => {
      if (isVoiceModeActive && !audioState.isPlaying && !isGenerating && !panel.classList.contains("is-open")) {
        startVoiceListening();
      }
    }, delay);
  }

  function startVoiceChatMode() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRec) {
      alert("Trình duyệt của bạn chưa hỗ trợ nhận diện giọng nói Web Speech API (khuyên dùng Chrome hoặc Edge).");
      return;
    }

    // 1. Tự động ẩn khung chat theo đúng yêu cầu người dùng
    togglePanel(false);

    // 2. Kích hoạt Voice Chat Mode
    isVoiceModeActive = true;
    if (callout) callout.style.display = "none";
    if (voiceBubble) {
      voiceBubble.style.display = "flex";
      requestAnimationFrame(() => voiceBubble.classList.add("is-active"));
    }
    updateVoiceBubbleStatus("Đang lắng nghe...", "listening");
    updateVoiceBubbleContent(
      `<p class="voice-bubble-hint"><i class="fa-solid fa-microphone-lines"></i> Hãy nói yêu cầu của bạn (Ví dụ: <em>"Tạo thương hiệu trà sữa Boba"</em>, <em>"Đổi sang giao diện Studio"</em>...)</p>`
    );

    // 3. Dừng âm thanh cũ và bật microphone
    audioState.stopSpeech();
    startVoiceListening();
  }

  function stopVoiceChatMode() {
    isVoiceModeActive = false;
    stopVoiceListening();
    if (voiceBubble) {
      voiceBubble.classList.remove("is-active");
      setTimeout(() => {
        if (!isVoiceModeActive) voiceBubble.style.display = "none";
      }, 300);
    }
    if (toggleBtn) {
      toggleBtn.classList.remove("is-listening", "is-processing");
    }
  }

  // Tự động nạp Gemini Key từ file .env hoặc LocalStorage
  loadEnvGeminiKey().catch(() => { });

  // Ngăn chặn sự kiện cuộn bị bắt bởi các thư viện cuộn trang (Lenis Smooth Scroll, GSAP)
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
      if (isVoiceModeActive) {
        stopVoiceChatMode();
      }
      const wlSwitcher = document.querySelector(".white-label-switcher");
      if (wlSwitcher) wlSwitcher.classList.remove("open");
      if (callout) callout.style.display = "none";
      // Đọc lời chào mở đầu khi mở chatbox
      audioState.playSpeech("Tôi sẽ hỗ trợ bạn tạo thương hiệu cho chính bạn.");
      setTimeout(() => input && input.focus(), 250);
      scrollToBottom(true);
    } else {
      audioState.stopSpeech();
    }
  }

  // 1.1 Quản lý trạng thái giọng nói của AI (Hiển thị sóng âm thanh nhấp nhô)
  const speakingBadge = document.getElementById("ai-speaking-badge");
  const chatAvatar = panel.querySelector(".chat-avatar");

  function setSpeakingState(speaking) {
    if (speaking) {
      widget.classList.add("is-speaking");
      toggleBtn.classList.add("is-speaking");
      toggleBtn.setAttribute("title", "AI đang nói... Bấm để mở Trợ lý AI");
      if (chatAvatar) chatAvatar.classList.add("is-speaking");
      if (speakingBadge) speakingBadge.style.display = "inline-flex";
    } else {
      widget.classList.remove("is-speaking");
      toggleBtn.classList.remove("is-speaking");
      toggleBtn.setAttribute("title", "Trợ lý AI tạo thương hiệu");
      if (chatAvatar) chatAvatar.classList.remove("is-speaking");
      if (speakingBadge) speakingBadge.style.display = "none";
    }
  }

  if (audioState.isPlaying) {
    setSpeakingState(true);
  }

  // Lắng nghe sự kiện giọng nói từ audioState
  audioState.subscribe((event, data) => {
    if (event === "start" || (data && data.isPlaying)) {
      setSpeakingState(true);
      if (isVoiceModeActive) {
        stopVoiceListening();
        updateVoiceBubbleStatus("AI đang nói...", "speaking");
      }
    } else if (event === "stop" || event === "end" || event === "error" || (data && !data.isPlaying)) {
      setSpeakingState(false);
      if (isVoiceModeActive && !panel.classList.contains("is-open")) {
        updateVoiceBubbleStatus("Đang nghe tiếp...", "listening");
        scheduleVoiceListening(600);
      }
    }
  });

  toggleBtn.addEventListener("click", () => {
    if (isVoiceModeActive) {
      stopVoiceChatMode();
      togglePanel(true);
      return;
    }
    togglePanel();
  });

  if (closeBtn) closeBtn.addEventListener("click", () => togglePanel(false));
  if (calloutClose && callout) {
    calloutClose.addEventListener("click", (e) => {
      e.stopPropagation();
      callout.style.display = "none";
    });
  }
  if (callout) {
    callout.style.cursor = "pointer";
    callout.addEventListener("click", (e) => {
      if (e.target.closest("#ai-callout-close") || e.target.closest("#ai-callout-mic-start")) return;
      togglePanel(true);
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
      const msg = "Chưa có thương hiệu nào được tạo để tinh chỉnh. Bạn hãy nói tên thương hiệu muốn tạo nhé!";
      appendMessage(msg, "bot");
      audioState.playSpeech(msg);
      if (isVoiceModeActive && typeof updateVoiceBubbleContent === "function") {
        updateVoiceBubbleContent(
          `<p class="voice-transcript-ai"><i class="fa-solid fa-robot"></i> ${esc(msg)}</p>`
        );
      }
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
      if (isVoiceModeActive && typeof updateVoiceBubbleContent === "function") {
        updateVoiceBubbleContent(
          `<p class="voice-transcript-ai"><i class="fa-solid fa-robot"></i> ${esc(speechNotice)}</p>`
        );
      }
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

      const derivedTopicHint = detectIndustryTopic(field || promptQuery || name || "tech");
      const derivedBrandName = name || extractBrandNameFromPrompt(promptQuery, derivedTopicHint);
      const curatedPhotos = getDiverseBrandPhotos(derivedTopicHint, derivedBrandName);

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
        const combinedContext = [field, promptQuery, name, slogan].filter(Boolean).join(" ");
        const derivedTopic = detectIndustryTopic(combinedContext);
        const derivedName = name || extractBrandNameFromPrompt(combinedContext, derivedTopic);
        const fallback = generateBrandJsonOffline({
          name: derivedName,
          field: field || promptQuery,
          slogan: slogan,
          paletteKey: paletteKey,
          promptQuery: promptQuery,
        });
        generatedData = enrichAndValidateBrandJson(
          fallback,
          derivedTopic,
        );
      }

      // Tắt typing indicator
      if (typingIndicator) typingIndicator.classList.remove("is-active");

      // Lưu trữ thương hiệu vừa tạo để hỗ trợ tinh chỉnh từng phần
      currentActiveBrandData = generatedData;

      // TỰ ĐỘNG ÁP DỤNG NGAY LẬP TỨC LÊN GIAO DIỆN TRANG WEB
      liveApplyBrand(generatedData);

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
      const speechNotice = `Tôi đã thiết kế xong nhận diện thương hiệu ${brandName} cho bạn. Bạn có muốn đổi màu hay tinh chỉnh mục nào không?`;
      audioState.playSpeech(speechNotice);
      if (isVoiceModeActive && typeof updateVoiceBubbleContent === "function") {
        updateVoiceBubbleContent(
          `<p class="voice-transcript-ai"><i class="fa-solid fa-robot"></i> Tôi đã thiết kế xong nhận diện thương hiệu <strong>${esc(brandName)}</strong> cho bạn!</p>`
        );
      }

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
      const errMsg = "Có lỗi xảy ra khi tạo thương hiệu, bạn hãy nói lại nhé.";
      appendMessage("Có lỗi xảy ra khi tạo thương hiệu. Vui lòng thử lại!", "bot");
      audioState.playSpeech(errMsg);
      if (isVoiceModeActive && typeof updateVoiceBubbleContent === "function") {
        updateVoiceBubbleContent(
          `<p class="voice-transcript-ai"><i class="fa-solid fa-triangle-exclamation"></i> ${errMsg}</p>`
        );
      }
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
  // SỰ KIỆN GỬI YÊU CẦU & XỬ LÝ ĐẦU VÀO (TEXT & VOICE)
  // ============================================================================

  // 1. Gửi tin nhắn từ ô input hoặc trực tiếp từ nhận diện giọng nói
  const handleUserSubmit = (customText = null) => {
    if (isGenerating) return;

    const val = (customText !== null ? customText : (input ? input.value : "")).trim();
    if (!val) return;

    appendMessage(val, "user");
    if (input) input.value = "";
    scrollToBottom(true);

    if (isVoiceModeActive) {
      updateVoiceBubbleStatus("AI đang xử lý yêu cầu...", "processing");
      updateVoiceBubbleContent(
        `<p class="voice-transcript-user"><i class="fa-solid fa-spinner fa-spin"></i> "${esc(val)}"...</p>`
      );
    }

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

  // 2. Tích hợp Microphone nhận diện giọng nói Web Speech API
  const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (SpeechRec) {
    recognition = new SpeechRec();
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.lang = "vi-VN";

    recognition.onstart = () => {
      isRecognitionActive = true;
      voiceTranscript = "";
      if (micBtn) micBtn.classList.add("is-recording");
      updateVoiceBubbleStatus("Đang lắng nghe...", "listening");
    };

    recognition.onresult = (evt) => {
      let interim = "";
      let final = "";
      for (let i = 0; i < evt.results.length; ++i) {
        if (evt.results[i].isFinal) {
          final += evt.results[i][0].transcript;
        } else {
          interim += evt.results[i][0].transcript;
        }
      }
      const currentText = (final || interim).trim();
      if (currentText) {
        voiceTranscript = currentText;
        if (input) input.value = currentText;
        updateVoiceBubbleContent(
          `<p class="voice-transcript-user"><i class="fa-solid fa-microphone"></i> "${esc(currentText)}"</p>`
        );
      }
    };

    recognition.onerror = (evt) => {
      console.warn("Speech recognition error:", evt.error);
      isRecognitionActive = false;
      if (micBtn) micBtn.classList.remove("is-recording");

      if (evt.error === "not-allowed") {
        alert("Vui lòng cấp quyền truy cập Microphone trong trình duyệt để sử dụng chế độ giọng nói.");
        stopVoiceChatMode();
      } else if (evt.error === "no-speech") {
        if (isVoiceModeActive && !isGenerating && !audioState.isPlaying) {
          scheduleVoiceListening(800);
        }
      }
    };

    recognition.onend = () => {
      isRecognitionActive = false;
      if (micBtn) micBtn.classList.remove("is-recording");

      // Khi người dùng dừng nói: Tự động gửi nội dung cho AI xử lý!
      if (voiceTranscript.trim() && isVoiceModeActive) {
        const query = voiceTranscript.trim();
        voiceTranscript = "";
        updateVoiceBubbleStatus("AI đang xử lý yêu cầu...", "processing");
        handleUserSubmit(query);
      } else if (isVoiceModeActive && !isGenerating && !audioState.isPlaying) {
        scheduleVoiceListening(1000);
      }
    };
  }

  // 3. Gắn sự kiện chuyển chế độ Micro sang trò chuyện giọng nói với Icon AI
  if (micBtn) {
    micBtn.addEventListener("click", () => {
      startVoiceChatMode();
    });
  }

  if (calloutMicStart) {
    calloutMicStart.addEventListener("click", (e) => {
      e.stopPropagation();
      startVoiceChatMode();
    });
  }

  if (voiceBtnChat) {
    voiceBtnChat.addEventListener("click", () => {
      stopVoiceChatMode();
      togglePanel(true);
    });
  }

  if (voiceBtnClose) {
    voiceBtnClose.addEventListener("click", () => {
      stopVoiceChatMode();
    });
  }

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
