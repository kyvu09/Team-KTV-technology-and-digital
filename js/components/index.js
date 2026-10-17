// ============================================================================
// js/components/index.js — Điểm tập kết các Khối Component thống nhất của dự án
// Cấu trúc tinh gọn theo các khối chức năng hoàn chỉnh (Unified Functional Blocks)
// ============================================================================

// 1. Common Components
export * from "./common/SectionHeader.js";
export * from "./common/PageHeader.js";

// 2. Hero Blocks (2 khối thống nhất: Khối Nội dung bên Trái & Khối Trực quan bên Phải)
export * from "./hero/HeroContent.js";
export * from "./hero/HeroVisual.js";
export * from "./hero/HeroScrollCue.js";

// 3. Features Blocks (Các biến thể bố cục hoàn chỉnh: 3D Stack, Bento Grid, Hero, Voices & Speed)
export * from "./features/Feature3DStack.js";
export * from "./features/FeatureBentoGrid.js";
export * from "./features/FeaturesHero.js";
export * from "./features/FeaturesVoicesSection.js";
export * from "./features/FeaturesSpeedSection.js";

// 4. Demo / Studio Block (Bàn điều khiển Console tích hợp)
export * from "./demo/DemoConsole.js";

// 5. About Blocks (Bố cục 3D Scroll Story & Bố cục Grid & Stats)
export * from "./about/About3DStory.js";
export * from "./about/AboutGrid.js";

// 6. Testimonials Block (Dải băng chuyền nhận xét vô tận)
export * from "./testimonials/TestimonialMarquee.js";

// 7. FAQ Blocks (Biến thể 3D Flip Cards & Biến thể Accordion)
export * from "./faq/FaqFlipCards.js";
export * from "./faq/FaqAccordion.js";

// 8. Contact Blocks (2 khối Trái - Phải: Thông tin & Biểu mẫu)
export * from "./contact/ContactInfo.js";
export * from "./contact/ContactForm.js";

// 9. Header & Footer Blocks
export * from "./header/HeaderLogo.js";
export * from "./header/HeaderNav.js";
export * from "./footer/FooterBrand.js";
export * from "./footer/FooterNavColumns.js";
export * from "./footer/FooterBottom.js";

// 10. Interactive Core Components
export * from "./Card.js";
export * from "./BentoGrid.js";
export * from "./Waveform.js";
export * from "./Chatbot.js";

// 11. Homepage Teaser Blocks (Trang chủ Tinh gọn)
export * from "./home/HomeFeatureTeaser.js";
export * from "./home/HomeStudioTeaser.js";
export * from "./home/HomeAboutTeaser.js";
export * from "./home/HomeCtaBanner.js";
