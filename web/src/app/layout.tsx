import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import ServiceWorker from "@/components/ServiceWorker";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const DESCRIPTION =
  "Şüpheli SMS, WhatsApp mesajı, bağlantı, telefon numarası ya da IBAN'ı yapıştır; dolandırıcılık izi var mı saniyeler içinde öğren.";

export const metadata: Metadata = {
  // www.yokla.com.tr de açılıyor; Google iki ayrı site sanmasın diye asıl adres bu
  metadataBase: new URL("https://yokla.com.tr"),
  alternates: { canonical: "/" },
  title: "Yokla — Tıklamadan önce bir yokla",
  description: DESCRIPTION,
  keywords: ["dolandırıcılık", "sahte SMS", "dolandırıcı numara sorgula", "IBAN sorgula", "sahte link", "oltalama"],
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "Yokla",
    title: "Yokla — Tıklamadan önce bir yokla",
    description: DESCRIPTION,
    images: [{ url: "/icon-512.png", width: 512, height: 512, alt: "Yokla" }],
  },
  twitter: { card: "summary", title: "Yokla — Tıklamadan önce bir yokla", description: DESCRIPTION, images: ["/icon-512.png"] },
  // Google Search Console sahiplik doğrulaması (.env: GOOGLE_SITE_VERIFICATION)
  ...(process.env.GOOGLE_SITE_VERIFICATION && {
    verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
  }),
  appleWebApp: { capable: true, title: "Yokla", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#0b3c49",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="tr" className={`${geistSans.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col">
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
