import { createWriteStream } from "node:fs";
import { pipeline } from "node:stream/promises";
import msedgeTts from "msedge-tts";

const { MsEdgeTTS, OUTPUT_FORMAT } = msedgeTts;

async function main() {
    const tts = new MsEdgeTTS();
    const filePath = "./conCac.mp3";
    const text = "";
    text = document.getElementById("cac")
    let v = text.valueOf;

    console.log("Dang chuyen doi van ban...");

    try {
        await tts.setMetadata("vi-VN-NamMinhNeural", OUTPUT_FORMAT.AUDIO_24KHZ_48KBITRATE_MONO_MP3);

        const { audioStream } = tts.toStream(text);
        await pipeline(audioStream, createWriteStream(filePath));

        console.log(`Thanh cong! File da duoc luu tai: ${filePath}`);
    } catch (error) {
        console.error("Loi khi goi API:", error);
        process.exitCode = 1;
    } finally {
        tts.close();
    }
}

main();
