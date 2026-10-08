"""
Công cụ tạo file audio.mp3 từ văn bản tiếng Việt (Text-to-Speech)
Sử dụng Microsoft Neural TTS (vi-VN-NamMinhNeural / vi-VN-HoaiMyNeural).
Hoạt động độc lập bằng Python, không sử dụng Node.js, không có node_modules, tuân thủ quy chế thi.

Cách dùng:
  python generate_audio.py
  python generate_audio.py "Văn bản của bạn ở đây" "duong_dan_file.mp3" "nu"
"""

import sys
import asyncio
import edge_tts

# Cấu hình UTF-8 cho Windows console
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

VOICES = {
    "nam": "vi-VN-NamMinhNeural",
    "nu": "vi-VN-HoaiMyNeural"
}

async def text_to_speech(text: str, output_file: str = "audio.mp3", voice_choice: str = "nam"):
    voice = VOICES.get(voice_choice.lower(), VOICES["nam"])
    print(f"--- ViVoice Audio Generator ---")
    print(f"[i] Giọng đọc: {voice}")
    print(f"[i] Nội dung: {text}")
    print(f"[i] Đang xử lý tạo file {output_file}...")
    
    try:
        communicate = edge_tts.Communicate(text, voice)
        await communicate.save(output_file)
        print(f"[✓] Thành công (Microsoft Neural Engine)! File đã được tạo tại: {output_file}")
    except Exception as e:
        print(f"[!] Microsoft Edge TTS không phản hồi ({e}), tự động chuyển sang Google TTS...")
        import urllib.request
        import urllib.parse
        encoded_text = urllib.parse.quote(text)
        url = f"https://translate.google.com/translate_tts?ie=UTF-8&tl=vi&client=tw-ob&q={encoded_text}"
        req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0"})
        with urllib.request.urlopen(req) as resp, open(output_file, "wb") as f:
            f.write(resp.read())
        print(f"[✓] Thành công (Google TTS Engine)! File đã được tạo tại: {output_file}")

def main():
    default_text = "Chào mừng bạn đến với ViVoice. Nền tảng chuyển đổi văn bản thành giọng nói tiếng Việt tự nhiên và giàu cảm xúc."
    default_output = "audio.mp3"
    default_voice = "nam" # 'nam' hoặc 'nu'

    text = sys.argv[1] if len(sys.argv) > 1 else default_text
    output = sys.argv[2] if len(sys.argv) > 2 else default_output
    voice = sys.argv[3] if len(sys.argv) > 3 else default_voice

    asyncio.run(text_to_speech(text, output, voice))

if __name__ == "__main__":
    main()
