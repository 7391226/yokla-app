import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Yokla — Tıklamadan önce bir yokla",
    short_name: "Yokla",
    description: "Şüpheli mesaj, bağlantı, numara ve IBAN'ları dolandırıcılığa karşı yokla.",
    lang: "tr",
    start_url: "/",
    display: "standalone",
    background_color: "#f8fafc",
    theme_color: "#0b3c49",
    icons: [
      { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
      { src: "/icon-512-maskable.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    // Android'de "Paylaş" menüsünde Yokla'nın çıkmasını sağlar.
    share_target: {
      action: "/",
      method: "GET",
      params: { title: "title", text: "text", url: "url" },
    },
  };
}
