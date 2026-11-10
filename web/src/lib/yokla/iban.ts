import type { Signal } from "./types";

// IBAN'daki 5 haneli banka kodu → banka adı (yaygın bankalar)
const BANK_CODES: Record<string, string> = {
  "00010": "Ziraat Bankası",
  "00012": "Halkbank",
  "00015": "VakıfBank",
  "00032": "TEB",
  "00046": "Akbank",
  "00062": "Garanti BBVA",
  "00064": "İş Bankası",
  "00067": "Yapı Kredi",
  "00099": "ING",
  "00111": "QNB",
  "00134": "DenizBank",
  "00203": "Albaraka Türk",
  "00205": "Kuveyt Türk",
  "00206": "Türkiye Finans",
  "00209": "Ziraat Katılım",
  "00210": "Vakıf Katılım",
};

/** ISO 13616 mod-97 kontrolü */
function checksumOk(iban: string): boolean {
  const rearranged = iban.slice(4) + iban.slice(0, 4);
  const digits = rearranged.replace(/[A-Z]/g, (c) => String(c.charCodeAt(0) - 55));
  let remainder = 0;
  for (const ch of digits) remainder = (remainder * 10 + Number(ch)) % 97;
  return remainder === 1;
}

export function analyzeIban(iban: string): Signal[] {
  const masked = `${iban.slice(0, 4)} … ${iban.slice(-4)}`;

  if (iban.length !== 26 || !checksumOk(iban)) {
    return [
      {
        id: "iban-gecersiz",
        severity: "yuksek",
        message: `IBAN (${masked}) geçerli bir Türkiye IBAN'ı değil; bir rakamı yanlış ya da uydurma.`,
      },
    ];
  }

  const bank = BANK_CODES[iban.slice(4, 9)];
  return [
    {
      id: "iban-gecerli",
      severity: "bilgi",
      message: `IBAN (${masked}) biçim olarak geçerli${bank ? ` (banka: ${bank})` : ""}. Bu, hesabın kime ait olduğunu göstermez: para göndermeden önce bankanın gösterdiği alıcı adına mutlaka bak.`,
    },
  ];
}
