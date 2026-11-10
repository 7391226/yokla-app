// Logo değişince uygulama ikonlarını src/app/icon.svg'den yeniden üretir: node scripts/ikonlar.mjs
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const svg = await readFile(new URL("../src/app/icon.svg", import.meta.url), "utf8");
const icerik = svg.replace(/<svg[^>]*>|<\/svg>|<rect[^>]*\/>/g, "");

// Köşeleri işletim sistemi yuvarlar; tam kare zemin. Maskelenebilir ikonda içerik güvenli alana (%80) çekilir.
const kare = (olcek) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><rect width="512" height="512" fill="#0b3c49"/>` +
      `<g transform="translate(256 256) scale(${olcek}) translate(-256 -256)">${icerik}</g></svg>`,
  );

const hedefler = [
  { girdi: Buffer.from(svg), boyut: 192, dosya: "public/icon-192.png" },
  { girdi: Buffer.from(svg), boyut: 512, dosya: "public/icon-512.png" },
  { girdi: kare(0.78), boyut: 512, dosya: "public/icon-512-maskable.png" },
  { girdi: kare(0.86), boyut: 180, dosya: "src/app/apple-icon.png" },
];

for (const { girdi, boyut, dosya } of hedefler) {
  await sharp(girdi).resize(boyut, boyut).png().toFile(fileURLToPath(new URL(`../${dosya}`, import.meta.url)));
  console.log(dosya);
}
