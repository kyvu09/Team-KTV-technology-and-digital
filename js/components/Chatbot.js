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
import { applyTheme } from "../theme.js?v=3";
import { renderSite } from "../render.js?v=3";

// API Key Gemini (không lưu cứng trong mã nguồn, tự động nạp từ file .env hoặc LocalStorage)
let DEFAULT_GEMINI_KEY = "";

// Hàm đọc Gemini Key an toàn từ file .env hoặc LocalStorage
async function loadEnvGeminiKey() {
  if (DEFAULT_GEMINI_KEY) return DEFAULT_GEMINI_KEY;

  // 1. Thử đọc từ file .env (hỗ trợ qua Live Server / Local Web Server)
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
    // Không thể đọc .env (ví dụ mở trực tiếp qua file://), sẽ dùng LocalStorage hoặc bộ sinh dự phòng
  }

  // 2. Thử lấy từ LocalStorage
  const stored = localStorage.getItem("viv_gemini_key");
  if (stored && stored.trim()) {
    DEFAULT_GEMINI_KEY = stored.trim();
    return DEFAULT_GEMINI_KEY;
  }

  return "";
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

  if (
    key.includes("video") ||
    key.includes("clip") ||
    key.includes("lồng tiếng") ||
    key.includes("thuyết minh") ||
    key.includes("phim")
  ) {
    return TOPIC_IMAGES.video;
  }
  if (
    key.includes("game") ||
    key.includes("npc") ||
    key.includes("metaverse") ||
    key.includes("vũ trụ") ||
    key.includes("cybertone") ||
    key.includes("vr")
  ) {
    return TOPIC_IMAGES.gaming;
  }
  if (
    key.includes("kiosk") ||
    key.includes("trợ lý") ||
    key.includes("echomind") ||
    key.includes("assistant") ||
    key.includes("điều khiển")
  ) {
    return TOPIC_IMAGES.kiosk;
  }
  if (
    key.includes("edu") ||
    key.includes("giáo") ||
    key.includes("học") ||
    key.includes("sách") ||
    key.includes("ngoại ngữ") ||
    key.includes("eduspeak")
  ) {
    return TOPIC_IMAGES.edtech;
  }
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
  if (
    key.includes("y tế") ||
    key.includes("bệnh") ||
    key.includes("bác sĩ") ||
    key.includes("medical") ||
    key.includes("thuốc") ||
    key.includes("sức khỏe")
  ) {
    return TOPIC_IMAGES.medical;
  }
  if (
    key.includes("tài chính") ||
    key.includes("ngân hàng") ||
    key.includes("finance") ||
    key.includes("đầu tư") ||
    key.includes("chứng khoán")
  ) {
    return TOPIC_IMAGES.finance;
  }
  if (
    key.includes("âm thanh") ||
    key.includes("giọng") ||
    key.includes("voice") ||
    key.includes("audio") ||
    key.includes("podcast")
  ) {
    return TOPIC_IMAGES.audio;
  }

  // Khớp theo tên nhóm danh mục
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

// Bảng màu mặc định dự phòng
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

export function renderChatbot(config = {}) {
  const currentBrand = (config.brand && config.brand.name) || "ViVoice";

  return `
  <div class="ai-chat-widget" id="ai-chat-widget" aria-label="Trợ lý AI tạo thương hiệu mới">
    <!-- Nút kích hoạt nổi ở góc phải (nằm dưới nút mũi tên cuộn lên) -->
    <div class="ai-chat-trigger-wrap">
      <div class="ai-chat-callout" id="ai-chat-callout">
        <span class="callout-wave">✨</span>
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
    <div class="ai-chat-panel" id="ai-chat-panel" aria-hidden="true">
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
      <div class="ai-chat-body" id="ai-chat-body">
        <!-- Khung Ý TƯỞNG MẪU (Mặc định hiển thị đúng 4 thẻ như trong ảnh) -->
        <div class="ai-ideas-view" id="ai-ideas-view">
          <div class="ideas-heading">
            <span class="ideas-bulb">💡</span> Ý TƯỞNG MẪU :
          </div>

          <div class="ideas-list">
            <!-- Thẻ 1: ClipVoice -->
            <div class="idea-card" data-preset="clipvoice" role="button" tabindex="0">
              <div class="card-icon-box icon-clipvoice">
                <i class="fa-solid fa-sliders"></i>
              </div>
              <div class="card-content">
                <h4 class="card-title">ClipVoice</h4>
                <p class="card-desc">Lồng tiếng video bằng AI, tạo lời thuyết minh và bản địa hóa nội dung đa ngôn ngữ.</p>
              </div>
            </div>

            <!-- Thẻ 2: EduSpeak -->
            <div class="idea-card" data-preset="eduspeak" role="button" tabindex="0">
              <div class="card-icon-box icon-eduspeak">
                <i class="fa-solid fa-graduation-cap"></i>
              </div>
              <div class="card-content">
                <h4 class="card-title">EduSpeak</h4>
                <p class="card-desc">Biến giáo trình thành bài học âm thanh, hỗ trợ luyện nghe, phát âm và học ngoại ngữ.</p>
              </div>
            </div>

            <!-- Thẻ 3: EchoMind -->
            <div class="idea-card" data-preset="echomind" role="button" tabindex="0">
              <div class="card-icon-box icon-echomind">
                <i class="fa-solid fa-podcast"></i>
              </div>
              <div class="card-content">
                <h4 class="card-title">EchoMind</h4>
                <p class="card-desc">Cung cấp giọng nói cho trợ lý ảo, kiosk thông minh và ứng dụng điều khiển bằng giọng nói.</p>
              </div>
            </div>

            <!-- Thẻ 4: Điền Form tạo thương hiệu nhanh -->
            <div class="idea-card idea-card--form" id="btn-toggle-wizard" role="button" tabindex="0">
              <div class="card-icon-box icon-form">
                <i class="fa-solid fa-file-signature"></i>
              </div>
              <div class="card-content">
                <h4 class="card-title text-teal">Điền Form tạo thương hiệu nhanh</h4>
                <p class="card-desc">Khởi tạo đầy đủ tên, logo style, palette màu và chiến lược</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Khung Form điền tạo nhanh (Brand Wizard) -->
        <div class="brand-wizard-card" id="ai-brand-wizard" style="display: none;">
          <div class="wizard-header">
            <div class="wizard-title"><i class="fa-solid fa-file-pen"></i> Điền Form tạo thương hiệu</div>
            <button type="button" class="wizard-close-btn" id="wz-close-btn">&times;</button>
          </div>
          <div class="wizard-field">
            <label>Tên thương hiệu:</label>
            <input type="text" id="wz-name" placeholder="Ví dụ: ClipVoice, SoundWave..." />
          </div>
          <div class="wizard-field">
            <label>Lĩnh vực / Sản phẩm:</label>
            <input type="text" id="wz-field" placeholder="Ví dụ: Lồng tiếng AI, E-learning, Kiosk..." />
          </div>
          <div class="wizard-field">
            <label>Khẩu hiệu (Slogan):</label>
            <input type="text" id="wz-slogan" placeholder="Ví dụ: Đột phá âm thanh tương lai..." />
          </div>
          <div class="wizard-field">
            <label>Tông màu nhận diện:</label>
            <select id="wz-palette">
              <option value="auto">✨ Để Gemini tự phối màu chuẩn tâm lý</option>
              <option value="data">🔵 Indigo &amp; Cyan (Công nghệ, Dữ liệu, Video)</option>
              <option value="purple">🟣 Tím Violet &amp; Hổ phách (Giáo dục, E-learning)</option>
              <option value="creative">🔴 Hồng Rose &amp; Magenta (Trợ lý ảo, Trực quan)</option>
              <option value="cyber">🟢 Xanh Lục Bảo &amp; Cyber (Game, Bảo mật)</option>
              <option value="gold">🟡 Vàng Gold &amp; Amber (Ẩm thực, Sang trọng)</option>
            </select>
          </div>
          <div class="wizard-actions">
            <button type="button" class="wizard-submit-btn" id="wz-submit-btn">
              <i class="fa-solid fa-wand-magic-sparkles"></i> Tạo Thương Hiệu Với AI
            </button>
          </div>
        </div>

        <!-- Khu vực hiển thị tin nhắn kết quả khi tạo -->
        <div class="chat-messages" id="ai-chat-messages" style="display: none;" role="log" aria-live="polite">
          <div class="messages-top-bar">
            <button type="button" class="btn-back-ideas" id="btn-back-ideas">
              <i class="fa-solid fa-arrow-left"></i> <span>Quay lại ý tưởng mẫu</span>
            </button>
          </div>
        </div>

        <!-- Typing Indicator khi AI đang soạn thảo / sinh JSON -->
        <div class="chat-typing-indicator" id="ai-typing-indicator">
          <div class="msg-avatar"><i class="fa-solid fa-robot"></i></div>
          <div class="typing-dots">
            <span></span><span></span><span></span>
          </div>
          <span class="typing-text" id="ai-typing-text">Gemini 2.5 Flash đang sáng tạo nội dung & chọn ảnh Unsplash 4K...</span>
        </div>
      </div>

      <!-- Form nhập tin nhắn trò chuyện tự do (Khung input dạng pill y hệt ảnh) -->
      <form class="chat-input-bar" id="ai-chat-form">
        <div class="chat-input-pill">
          <input type="text" id="ai-chat-input" placeholder="Nhập mong muốn của bạn........" autocomplete="off" maxlength="300" />
          <button type="submit" class="chat-send-btn" id="ai-chat-send" aria-label="Gửi yêu cầu">
            <i class="fa-solid fa-paper-plane"></i>
          </button>
        </div>
      </form>
    </div>
  </div>`;
}

// ============================================================================
// HÀM KIỂM ĐỊNH VÀ BỔ SUNG ẢNH CHUYÊN NGÀNH (STRICT SCHEMA & IMAGE ENRICHER)
// ============================================================================
function enrichAndValidateBrandJson(data, topicHint = "tech") {
  if (!data || typeof data !== "object") {
    throw new Error("Dữ liệu trả về không phải là JSON hợp lệ.");
  }

  // 1. Kiểm tra các khóa gốc bắt buộc
  if (!data.brand || !data.theme || !data.sections) {
    throw new Error(
      "JSON thiếu các khóa bắt buộc: brand, theme hoặc sections.",
    );
  }

  const brandName = data.brand.name || "BrandNew";
  const slug =
    brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-") || "brand-new";

  // Xác định chủ đề ảnh phù hợp và xáo trộn mảng ảnh đa dạng độc bản cho thương hiệu
  const detectedTopic = (data.topic || topicHint || "tech").toLowerCase();
  const photoPool = getDiverseBrandPhotos(detectedTopic, brandName);

  // 2. Bảo đảm effects và nav đầy đủ
  data.effects = {
    smoothScroll: true,
    cursor: true,
    preloader: true,
    orb: true,
    ambientBackground: true,
    scrollProgress: true,
    ...(data.effects || {}),
  };

  data.nav = [
    { href: "#hero", label: "Trang chủ" },
    { href: "#features", label: "Tính năng" },
    { href: "#demo", label: "Trải nghiệm" },
    { href: "#about", label: "Về chúng tôi" },
    { href: "#faq", label: "Hỏi đáp" },
    { href: "#contact", label: "Liên hệ" },
  ];

  // 3. Chuẩn hóa các sections và gán ảnh 4K tương ứng
  const sections = Array.isArray(data.sections) ? data.sections : [];

  // Hero
  const hero = sections.find((s) => s.type === "hero");
  if (hero) {
    hero.layout = "split-right";
    if (!hero.buttons) {
      hero.buttons = [
        { href: "#demo", label: "Khám phá ngay", style: "primary" },
        { href: "#features", label: "Xem chi tiết", style: "secondary" },
      ];
    }
  }

  // Features (4 thẻ tính năng 3D stack cards)
  const features = sections.find((s) => s.type === "features");
  if (features && Array.isArray(features.items)) {
    features.items.forEach((item, idx) => {
      // Gán ảnh Unsplash chất lượng cao nếu chưa có hoặc ảnh cục bộ
      if (!item.image || item.image.startsWith("assets/images/")) {
        item.image = photoPool[idx % photoPool.length];
      }
    });
  }

  // About (3 mốc câu chuyện thương hiệu & 3D Sticky Scroll Story)
  const about = sections.find((s) => s.type === "about");
  if (about) {
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
              title: "Xử lý dữ liệu quy mô lớn",
              description:
                "Hệ thống điện toán phân tán sẵn sàng mở rộng đáp ứng hàng triệu tác vụ.",
              metric: { value: "99.99%", label: "Thời gian hoạt động" },
            },
            {
              eyebrow: "03 / CHẤT LƯỢNG",
              title: "Đánh giá xuất sắc",
              description:
                "Chất lượng dịch vụ đạt chuẩn quốc tế, mang lại sự an tâm tuyệt đối.",
              metric: { value: "4.9/5", label: "Mức độ hài lòng" },
            },
          ]
    ).map((item, idx) => ({
      image:
        item.image && !item.image.startsWith("assets/images/")
          ? item.image
          : photoPool[(idx + 4) % photoPool.length],
      eyebrow: item.eyebrow || `0${idx + 1} / ĐIỂM NHẤN`,
      title: item.title || "Giá trị thương hiệu",
      description:
        item.description || "Cam kết mang lại chuẩn mực chất lượng hàng đầu.",
      metric: item.metric || { value: "100%", label: "Tin cậy" },
    }));

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
    about.story = slides; // Tương thích cả 2 chuẩn
  }

  // Demo
  const demo = sections.find((s) => s.type === "demo");
  if (demo && !demo.speakButtonText) {
    demo.speakButtonText = "Kích hoạt trải nghiệm";
  }

  // FAQ (4 thẻ lật 3D)
  const faq = sections.find((s) => s.type === "faq");
  if (faq && Array.isArray(faq.items)) {
    faq.items.forEach((item, idx) => {
      item.id = item.id || `faq-${idx + 1}`;
      item.badge = item.badge || `0${idx + 1}`;
      item.frontHint =
        item.frontHint || "Bấm hoặc rê chuột để lật xem giải đáp";
      item.backAction = item.backAction || "Quay lại";
    });
  }

  // Theme
  data.theme = {
    primary: data.theme.primary || "#38bdf8",
    accent: data.theme.accent || "#a78bfa",
    background: data.theme.background || "#070c1e",
    surface: data.theme.surface || "#0f1a36",
    text: data.theme.text || "#f1f5f9",
    textMuted: data.theme.textMuted || "#94a3b8",
    fontHeading: data.theme.fontHeading || "Space Grotesk",
    fontBody: data.theme.fontBody || "Be Vietnam Pro",
    radius: "16px",
  };

  // Footer
  if (!data.footer) {
    data.footer = {
      tagline: `${brandName} — ${data.brand.slogan || "Kiến tạo chuẩn mực mới."}`,
      columns: [
        {
          title: "Sản phẩm",
          links: [
            { href: "#demo", label: "Trải nghiệm" },
            { href: "#features", label: "Tính năng" },
            { href: "#faq", label: "Hỏi đáp" },
          ],
        },
        {
          title: "Liên kết",
          links: [
            { href: "#", label: "Tài liệu giới thiệu" },
            { href: "#", label: "Báo cáo năng lực" },
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
      copyright: `© Bản quyền thuộc về ${brandName}. Tạo tự động bởi Gemini 2.5 Flash.`,
    };
  }

  return data;
}

// ============================================================================
// HÀM SINH DỰ PHÒNG NỘI BỘ (FALLBACK KHI MẤT MẠNG HOẶC HẾT QUOTA)
// ============================================================================
export function generateBrandJsonOffline({ name, field, slogan, paletteKey }) {
  const brandName = (name && name.trim()) || "NewBrand";
  const brandSlogan =
    (slogan && slogan.trim()) || `Kiến tạo giá trị khác biệt cùng ${brandName}`;
  const slug =
    brandName
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-") || "brand-new";
  const pal = BRAND_PALETTES[paletteKey] || BRAND_PALETTES.cyber;
  const brandField =
    (field && field.trim()) || "Giải pháp công nghệ số thông minh";
  const photos = getDiverseBrandPhotos(field || name || "tech", brandName);

  const base = {
    brand: { favicon: "", logo: "", name: brandName, slogan: brandSlogan },
    topic: "tech",
    effects: {
      smoothScroll: true,
      cursor: true,
      preloader: true,
      orb: true,
      ambientBackground: true,
      scrollProgress: true,
    },
    nav: [
      { href: "#hero", label: "Trang chủ" },
      { href: "#features", label: "Tính năng" },
      { href: "#demo", label: "Trải nghiệm" },
      { href: "#about", label: "Về chúng tôi" },
      { href: "#faq", label: "Hỏi đáp" },
      { href: "#contact", label: "Liên hệ" },
    ],
    sections: [
      {
        type: "hero",
        layout: "split-right",
        welcomeMessage: `Chào mừng bạn đến với ${brandName}`,
        welcomeAudio: "",
        title: `Định hình tương lai cùng ${brandName} cho`,
        rotatingWords: ["doanh nghiệp", "chuyên gia số", "hệ sinh thái mới"],
        subtitle: `${brandName} ứng dụng trí tuệ nhân tạo thế hệ mới tối ưu hóa ${brandField}. Mang lại hiệu suất vượt trội và trải nghiệm trực quan.`,
        playSample: `Xin chào! Bạn đang trải nghiệm giao diện White Label hoàn toàn mới của thương hiệu ${brandName}.`,
        buttons: [
          { href: "#demo", label: "Khám phá ngay", style: "primary" },
          { href: "#features", label: "Xem tính năng", style: "secondary" },
        ],
      },
      {
        type: "features",
        title: "Năng lực cốt lõi vượt trội",
        subtitle: `Khám phá các trụ cột công nghệ giúp ${brandName} dẫn đầu trong lĩnh vực ${brandField}.`,
        items: [
          {
            badge: "01 / HIỆU NĂNG TỐI ĐA",
            icon: "fa-solid fa-bolt",
            title: "Xử lý Siêu tốc",
            desc: "Kiến trúc luồng xử lý tối ưu với độ trễ thấp, tăng tốc quy trình làm việc gấp 5 lần.",
            image: photos[0],
          },
          {
            badge: "02 / AN TOÀN TUYỆT ĐỐI",
            icon: "fa-solid fa-shield-halved",
            title: "Bảo mật Toàn diện",
            desc: "Bảo vệ toàn vẹn tài sản kỹ thuật số và dữ liệu riêng tư của bạn mọi lúc.",
            image: photos[1],
          },
          {
            badge: "03 / TÍCH HỢP LINH HOẠT",
            icon: "fa-solid fa-network-wired",
            title: "Kết nối Đồng bộ",
            desc: "Dễ dàng kết nối vào bất kỳ nền tảng Web hoặc Mobile chỉ với vài thao tác.",
            image: photos[2],
          },
          {
            badge: "04 / TÙY BIẾN ĐỘC BẢN",
            icon: "fa-solid fa-palette",
            title: "Cá nhân hóa 100%",
            desc: "Bảng màu và thông điệp truyền thông được tinh chỉnh riêng biệt phù hợp với nhận diện của bạn.",
            image: photos[3],
          },
        ],
      },
      {
        type: "demo",
        title: "Trải nghiệm Không gian Công nghệ",
        subtitle: `Tương tác trực tiếp và cảm nhận sức mạnh của hệ sinh thái ${brandName}.`,
        placeholder: `Nhập văn bản hoặc yêu cầu thử nghiệm cho ${brandName}...`,
        defaultText: `Xin chào! Tôi đang trải nghiệm thương hiệu ${brandName} - ${brandSlogan}.`,
        speakButtonText: "Kích hoạt trải nghiệm",
      },
      {
        type: "about",
        eyebrow: "CÂU CHUYỆN THƯƠNG HIỆU",
        title: `Hành trình kiến tạo chuẩn mực mới của ${brandName}`,
        subtitle: `Chúng tôi tin rằng giải pháp tiên tiến phải đi liền với trải nghiệm người dùng tinh tế.`,
        scrollStory: {
          enabled: true,
          behavior: "sticky-story",
          slides: [
            {
              image: photos[4] || photos[0],
              eyebrow: "01 / TIN CẬY",
              title: "Đồng hành cùng khách hàng",
              description: `Xây dựng giải pháp ${brandField} lấy sự hài lòng của người dùng làm trung tâm.`,
              metric: { value: "10,000+", label: "Khách hàng tin chọn" },
            },
            {
              image: photos[5] || photos[1],
              eyebrow: "02 / QUY MÔ",
              title: "Xử lý dữ liệu quy mô lớn",
              description:
                "Hệ thống điện toán phân tán sẵn sàng mở rộng đáp ứng hàng triệu tác vụ.",
              metric: { value: "99.99%", label: "Thời gian hoạt động" },
            },
            {
              image: photos[6] || photos[2],
              eyebrow: "03 / CHẤT LƯỢNG",
              title: "Đánh giá xuất sắc",
              description:
                "Chất lượng dịch vụ đạt chuẩn quốc tế, mang lại sự an tâm tuyệt đối.",
              metric: { value: "4.9/5", label: "Mức độ hài lòng" },
            },
          ],
          animation: {
            imageScaleFrom: 1.08,
            imageScaleTo: 1,
            revealDistance: 28,
            transitionMs: 650,
          },
        },
        story: [
          {
            image: photos[4] || photos[0],
            eyebrow: "01 / TIN CẬY",
            title: "Đồng hành cùng khách hàng",
            description: `Xây dựng giải pháp ${brandField} lấy sự hài lòng của người dùng làm trung tâm.`,
            metric: { value: "10,000+", label: "Khách hàng tin chọn" },
          },
          {
            image: photos[5] || photos[1],
            eyebrow: "02 / QUY MÔ",
            title: "Xử lý dữ liệu quy mô lớn",
            description:
              "Hệ thống điện toán phân tán sẵn sàng mở rộng đáp ứng hàng triệu tác vụ.",
            metric: { value: "99.99%", label: "Thời gian hoạt động" },
          },
          {
            image: photos[6] || photos[2],
            eyebrow: "03 / CHẤT LƯỢNG",
            title: "Đánh giá xuất sắc",
            description:
              "Chất lượng dịch vụ đạt chuẩn quốc tế, mang lại sự an tâm tuyệt đối.",
            metric: { value: "4.9/5", label: "Mức độ hài lòng" },
          },
        ],
        animation: {
          imageScaleFrom: 1.08,
          imageScaleTo: 1,
          revealDistance: 28,
          transitionMs: 650,
        },
      },
      {
        type: "faq",
        title: "Giải đáp Thắc mắc Thường gặp",
        subtitle: `Những câu hỏi phổ biến nhất về cách vận hành và quyền lợi của ${brandName}.`,
        items: [
          {
            id: "faq-1",
            badge: "01",
            category: "Bản quyền & Sử dụng",
            icon: "fa-solid fa-certificate",
            question: `${brandName} có cấp toàn quyền thương mại không?`,
            answer: `Có. Bạn sở hữu 100% bản quyền thương mại đối với toàn bộ tài sản được tạo ra qua nền tảng ${brandName}.`,
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-2",
            badge: "02",
            category: "Tích hợp",
            icon: "fa-solid fa-code",
            question: `Làm thế nào để tích hợp ${brandName} vào hệ thống hiện tại?`,
            answer: `Chúng tôi cung cấp hệ thống API với tài liệu mẫu đầy đủ, kết nối nhanh chóng chỉ trong vài phút.`,
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-3",
            badge: "03",
            category: "Bảo mật",
            icon: "fa-solid fa-shield-virus",
            question: `Dữ liệu của tôi được bảo vệ như thế nào?`,
            answer:
              "Mọi dữ liệu truyền tải đều được mã hóa SSL/TLS 256-bit và lưu trữ trên cụm máy chủ an toàn cao.",
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
          {
            id: "faq-4",
            badge: "04",
            category: "Chính sách Dùng thử",
            icon: "fa-solid fa-gift",
            question: `Tôi có thể dùng thử miễn phí các tính năng không?`,
            answer:
              "Hoàn toàn có thể! Bạn có thể sử dụng trực tiếp mô đun trải nghiệm trên website này.",
            frontHint: "Bấm để xem câu trả lời",
            backAction: "Quay lại",
          },
        ],
      },
      {
        type: "contact",
        title: `Kết nối cùng Đội ngũ ${brandName}`,
        channels: [
          { label: "Email", value: `support@${slug}.vn` },
          { label: "Hotline", value: "0901 888 999 (24/7)" },
          {
            label: "Địa chỉ",
            value: "Trung tâm Đổi mới Sáng tạo, Hà Nội / TP.HCM",
          },
        ],
        formTitle: "Để lại lời nhắn tư vấn",
        formName: "Họ và tên của bạn",
        formEmail: "Email công việc",
        formMessage: `Nhu cầu hợp tác cùng ${brandName}...`,
        formButton: "Gửi thông tin liên hệ",
        formSuccess: `Cảm ơn bạn! Chuyên viên của ${brandName} sẽ liên hệ lại trong vòng 24 giờ.`,
      },
    ],
    theme: {
      primary: pal.primary,
      accent: pal.accent,
      background: pal.background,
      surface: pal.surface,
      text: pal.text,
      textMuted: pal.textMuted,
      fontHeading: "Space Grotesk",
      fontBody: "Be Vietnam Pro",
      radius: "16px",
    },
    footer: {
      tagline: `${brandName} — ${brandSlogan}.`,
      columns: [
        {
          title: "Sản phẩm",
          links: [
            { href: "#demo", label: "Trải nghiệm tính năng" },
            { href: "#features", label: "Năng lực công nghệ" },
            { href: "#faq", label: "Câu hỏi thường gặp" },
          ],
        },
        {
          title: "Hệ thống",
          links: [
            { href: "#", label: "Tài liệu hướng dẫn" },
            { href: "#", label: "Cộng đồng hỗ trợ" },
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
      copyright: `© Bản quyền thuộc về ${brandName}. Tạo tự động bởi AI Brand Architect.`,
    },
  };

  return base;
}

// ============================================================================
// KHỞI TẠO LOGIC TƯƠNG TÁC CHATBOT
// ============================================================================
export function initChatbot(config = {}) {
  const root = document.getElementById("ai-chat-root");
  if (!root) return;

  root.innerHTML = renderChatbot(config);

  const widget = document.getElementById("ai-chat-widget");
  const toggleBtn = document.getElementById("ai-chat-toggle");
  const panel = document.getElementById("ai-chat-panel");
  const closeBtn = document.getElementById("ai-chat-close");
  const callout = document.getElementById("ai-chat-callout");
  const calloutClose = document.getElementById("ai-callout-close");
  const ideasView = document.getElementById("ai-ideas-view");
  const messagesContainer = document.getElementById("ai-chat-messages");
  const typingIndicator = document.getElementById("ai-typing-indicator");
  const typingText = document.getElementById("ai-typing-text");
  const form = document.getElementById("ai-chat-form");
  const input = document.getElementById("ai-chat-input");
  const wizardCard = document.getElementById("ai-brand-wizard");
  const wzCloseBtn = document.getElementById("wz-close-btn");
  const toggleWizardBtn = document.getElementById("btn-toggle-wizard");
  const wzSubmitBtn = document.getElementById("wz-submit-btn");
  const backIdeasBtn = document.getElementById("btn-back-ideas");

  if (!widget || !toggleBtn || !panel) return;

  // Tự động nạp Gemini Key từ file .env hoặc LocalStorage
  loadEnvGeminiKey().catch(() => {});

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
      scrollToBottom();
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

  function showIdeasView() {
    if (wizardCard) wizardCard.style.display = "none";
    if (messagesContainer) messagesContainer.style.display = "none";
    if (ideasView) ideasView.style.display = "block";
    scrollToBottom();
  }

  function showWizardView() {
    if (ideasView) ideasView.style.display = "none";
    if (messagesContainer) messagesContainer.style.display = "none";
    if (wizardCard) wizardCard.style.display = "flex";
    scrollToBottom();
  }

  function showMessagesView() {
    if (ideasView) ideasView.style.display = "none";
    if (wizardCard) wizardCard.style.display = "none";
    if (messagesContainer) messagesContainer.style.display = "flex";
    scrollToBottom();
  }

  if (toggleWizardBtn)
    toggleWizardBtn.addEventListener("click", showWizardView);
  if (wzCloseBtn) wzCloseBtn.addEventListener("click", showIdeasView);
  if (backIdeasBtn) backIdeasBtn.addEventListener("click", showIdeasView);

  // Cuộn tin nhắn xuống cuối
  function scrollToBottom() {
    if (messagesContainer) {
      messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }
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
    scrollToBottom();
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
      applyTheme(brandData);
      renderSite(brandData);
      window.scrollTo({ top: 0, behavior: "smooth" });
      audioState.playSpeech(
        `Đã chuyển đổi giao diện sang thương hiệu ${brandData.brand.name} thành công!`,
      );
    } catch (err) {
      console.error("Lỗi khi áp dụng thương hiệu mới:", err);
      alert("Không thể áp dụng trực tiếp: " + err.message);
    }
  }

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
    // 1. Ẩn gợi ý và form wizard
    const quickReplies = document.getElementById("ai-quick-replies");
    if (quickReplies) quickReplies.style.display = "none";
    if (wizardCard) wizardCard.style.display = "none";

    // 2. Bật typing indicator
    if (typingIndicator) {
      typingIndicator.classList.add("is-active");
      if (typingText)
        typingText.innerText = "Đang khởi tạo, vui lòng chờ 20-30 giây.....";
      scrollToBottom();
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

    // Prompt hệ thống ràng buộc nghiêm ngặt chỉ sinh JSON theo schema White Label
    const systemInstruction = `Bạn là Trợ lý AI Brand Architect hàng đầu cho nền tảng White Label.
Nhiệm vụ: Dựa trên yêu cầu của người dùng, tạo một đối tượng JSON cấu hình thương hiệu hoàn chỉnh 100% bằng tiếng Việt và phù hợp với mọi ngành nghề.
RÀNG BUỘC BẮT BUỘC (STRICT POLICY):
1. CHỈ TRẢ VỀ DUY NHẤT ĐỐI TƯỢNG JSON HỢP LỆ, KHÔNG CHỨA BẤT KỲ KÝ TỰ NÀO NGOÀI JSON, KHÔNG BỌC TRONG MARKDOWN.
2. Cấu trúc JSON BẮT BUỘC gồm các trường:
   - "brand": { "name": string, "slogan": string, "logo": "", "favicon": "" }
   - "topic": từ tiếng Anh đại diện chủ đề (ví dụ: bakery, coffee, dental, medical, fashion, fitness, realestate, logistics, education, cyber, data, pet, hotel, eco, audio, tech...)
   - "sections": [
       { "type": "hero", "layout": "split-right", "welcomeMessage": string, "welcomeAudio": "", "title": string, "rotatingWords": [3 từ ngắn luân phiên], "subtitle": string, "playSample": string, "buttons": [{ "href": "#demo", "label": "Khám phá ngay", "style": "primary" }, { "href": "#features", "label": "Xem tính năng", "style": "secondary" }] },
       { "type": "features", "title": string, "subtitle": string, "items": [4 mục gồm: "badge", "icon" (FontAwesome fa-solid fa-...), "title", "desc", "image": ""] },
       { "type": "demo", "title": string, "subtitle": string, "placeholder": string, "defaultText": string, "speakButtonText": "Kích hoạt trải nghiệm" },
       { "type": "about", "eyebrow": string, "title": string, "subtitle": string, "scrollStory": { "enabled": true, "behavior": "sticky-story", "slides": [3 mục gồm: "image": "", "eyebrow", "title", "description", "metric": { "value": string, "label": string }], "animation": { "imageScaleFrom": 1.08, "imageScaleTo": 1, "revealDistance": 28, "transitionMs": 650 } } },
       { "type": "faq", "title": string, "subtitle": string, "items": [4 mục gồm: "id", "badge", "category", "icon", "question", "answer", "frontHint": "Bấm để xem câu trả lời", "backAction": "Quay lại"] },
       { "type": "contact", "title": string, "channels": [{ "label": "Email", "value": string }, { "label": "Hotline", "value": string }, { "label": "Địa chỉ", "value": string }], "formTitle": string, "formName": "Họ và tên của bạn", "formEmail": "Email liên hệ", "formMessage": string, "formButton": "Gửi yêu cầu", "formSuccess": "Cảm ơn bạn! Đội ngũ tư vấn sẽ liên hệ lại trong vòng 24 giờ." }
     ]
   - "theme": {
       "primary": mã màu hex chính phù hợp tâm lý ngành nghề,
       "accent": mã màu hex nhấn tương phản đẹp,
       "background": mã màu hex nền tối sang trọng (ví dụ: #050a18, #0a0518, #030d07, #0d0a03...),
       "surface": mã màu hex thẻ bóng kính (#0b1428, #180b28, #071c12, #1a1408...),
       "text": "#f8fafc",
       "textMuted": "#94a3b8",
       "fontHeading": "Space Grotesk",
       "fontBody": "Be Vietnam Pro",
       "radius": "16px"
     }
   - "footer": { "tagline": string, "columns": [...], "copyright": string }
3. Toàn bộ câu từ phải đậm chất doanh nghiệp, trang trọng, tự nhiên và đúng phong thái của ngành nghề đó.`;

    // Gọi Gemini 2.5 Flash
    if (currentKey) {
      try {
        const geminiEndpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${currentKey}`;
        const resp = await fetch(geminiEndpoint, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [
                  {
                    text: `${systemInstruction}\n\nYêu cầu thương hiệu cụ thể của người dùng: "${userPrompt}"`,
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
            parsed.topic || promptQuery,
          );
          isGeminiPowered = true;
        } else {
          console.warn(
            "Gemini API phản hồi lỗi:",
            resp.status,
            await resp.text(),
          );
        }
      } catch (err) {
        console.warn(
          "Lỗi khi kết nối Gemini API, kích hoạt bộ sinh nội bộ:",
          err,
        );
      }
    }

    // Nếu không kết nối được Gemini (mất mạng hoặc lỗi), tự động dùng bộ sinh dự phòng nội bộ
    if (!generatedData) {
      await new Promise((r) => setTimeout(r, 650));
      const fallback = generateBrandJsonOffline({
        name: name,
        field: field || promptQuery,
        slogan: slogan,
        paletteKey: paletteKey,
      });
      generatedData = enrichAndValidateBrandJson(
        fallback,
        promptQuery || "tech",
      );
    }

    // Tắt typing indicator
    if (typingIndicator) typingIndicator.classList.remove("is-active");

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

        ${
          previewImages.length > 0
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
          <button type="button" class="btn-brand-action btn-brand-back" title="Quay lại danh sách ý tưởng mẫu">
            <i class="fa-solid fa-arrow-left"></i> Thử ý tưởng khác
          </button>
        </div>
      </div>
    `;

    const msgElement = appendMessage(resultHtml, "bot");

    // Phát âm thanh đọc lời xác nhận
    audioState.playSpeech(
      `Thương hiệu ${brandName} đã được Gemini khởi tạo thành công với hình ảnh 4K và cấu hình JSON hoàn chỉnh. Bạn có thể tải file hoặc bấm xem trước ngay.`,
    );

    // Gắn sự kiện cho các nút hành động trong tin nhắn vừa tạo
    const dlBtn = msgElement.querySelector(".btn-brand-download");
    const applyBtn = msgElement.querySelector(".btn-brand-apply");
    const copyBtn = msgElement.querySelector(".btn-brand-copy");
    const backBtn = msgElement.querySelector(".btn-brand-back");

    if (dlBtn) {
      dlBtn.addEventListener("click", () => {
        downloadJsonFile(generatedData, filename);
      });
    }

    if (applyBtn) {
      applyBtn.addEventListener("click", () => {
        liveApplyBrand(generatedData);
      });
    }

    if (copyBtn) {
      copyBtn.addEventListener("click", () => {
        navigator.clipboard.writeText(jsonString).then(() => {
          copyBtn.innerHTML = `<i class="fa-solid fa-check"></i> Đã sao chép!`;
          setTimeout(() => {
            copyBtn.innerHTML = `<i class="fa-solid fa-copy"></i> Copy JSON`;
          }, 2000);
        });
      });
    }

    if (backBtn) {
      backBtn.addEventListener("click", () => {
        showIdeasView();
      });
    }
  }

  // ============================================================================
  // SỰ KIỆN GỬI YÊU CẦU & CHỌN THẺ Ý TƯỞNG
  // ============================================================================

  // 1. Gửi tin nhắn tự do từ ô input
  if (form && input) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const val = input.value.trim();
      if (!val) return;

      showMessagesView();
      appendMessage(val, "user");
      input.value = "";

      handleCreateBrand({ promptQuery: val });
    });
  }

  // 2. Bấm chọn thẻ ý tưởng mẫu chuẩn theo ảnh (ClipVoice, EduSpeak, EchoMind)
  if (ideasView) {
    ideasView.addEventListener("click", (e) => {
      const card = e.target.closest(".idea-card[data-preset]");
      if (card) {
        const preset = card.getAttribute("data-preset");
        let req = {};
        if (preset === "clipvoice") {
          req = {
            name: "ClipVoice",
            field:
              "video, lồng tiếng video bằng AI, tạo lời thuyết minh và bản địa hóa nội dung đa ngôn ngữ.",
            slogan: "Lồng tiếng video bằng AI đa ngôn ngữ chuẩn bản địa",
            paletteKey: "data",
            promptQuery:
              "ClipVoice: Lồng tiếng video bằng AI, tạo lời thuyết minh và bản địa hóa nội dung đa ngôn ngữ.",
          };
        } else if (preset === "eduspeak") {
          req = {
            name: "EduSpeak",
            field:
              "edtech, giáo dục số, biến giáo trình thành bài học âm thanh, hỗ trợ luyện nghe, phát âm và học ngoại ngữ.",
            slogan: "Biến giáo trình thành bài học âm thanh thông minh",
            paletteKey: "purple",
            promptQuery:
              "EduSpeak: Biến giáo trình thành bài học âm thanh, hỗ trợ luyện nghe, phát âm và học ngoại ngữ.",
          };
        } else if (preset === "echomind") {
          req = {
            name: "EchoMind",
            field:
              "kiosk, trợ lý ảo, cung cấp giọng nói cho trợ lý ảo, kiosk thông minh và ứng dụng điều khiển bằng giọng nói.",
            slogan: "Giọng nói AI thông minh cho trợ lý ảo và kiosk",
            paletteKey: "creative",
            promptQuery:
              "EchoMind: Cung cấp giọng nói cho trợ lý ảo, kiosk thông minh và ứng dụng điều khiển bằng giọng nói.",
          };
        }

        if (req.name) {
          showMessagesView();
          appendMessage(
            `Tôi muốn tạo thương hiệu ${req.name}: ${req.field}`,
            "user",
          );
          handleCreateBrand(req);
        }
      }
    });
  }

  // 3. Gửi từ Form Wizard
  if (wzSubmitBtn) {
    wzSubmitBtn.addEventListener("click", () => {
      const wzName = document.getElementById("wz-name")?.value.trim();
      const wzField = document.getElementById("wz-field")?.value.trim();
      const wzSlogan = document.getElementById("wz-slogan")?.value.trim();
      const wzPalette = document.getElementById("wz-palette")?.value;

      if (!wzName) {
        alert("Vui lòng nhập tên thương hiệu!");
        return;
      }

      showMessagesView();
      appendMessage(
        `Tạo thương hiệu: ${wzName} | Ngành: ${wzField || "Doanh nghiệp số"} | Slogan: ${wzSlogan || "Đột phá"}`,
        "user",
      );
      handleCreateBrand({
        name: wzName,
        field: wzField,
        slogan: wzSlogan,
        paletteKey: wzPalette,
        promptQuery: `Tên: ${wzName}, Ngành: ${wzField || ""}, Slogan: ${wzSlogan || ""}`,
      });
    });
  }
}
