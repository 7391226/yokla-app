import type { Signal } from "./types";

export function analyzePhone(phone: string): Signal[] {
  const digits = phone.replace(/\D/g, "");

  if (phone.startsWith("+") && !phone.startsWith("+90")) {
    return [
      {
        id: "tel-yabanci",
        severity: "orta",
        message: `Numara (${phone.slice(0, 4)}…) Türkiye dışından. Tanıdık gibi yazan yabancı numaralar dolandırıcılarda yaygın.`,
      },
    ];
  }

  // 0850 ve 444 numaraları kurumsal hatlardır; tek başına risk değildir.
  if (digits.startsWith("444") || digits.replace(/^90/, "").replace(/^0/, "").startsWith("850")) {
    return [
      {
        id: "tel-kurumsal",
        severity: "bilgi",
        message: "Numara kurumsal bir hat (0850 / 444). Kurumun resmi numarası olup olmadığına kendi sitesinden bak.",
      },
    ];
  }

  return [];
}
