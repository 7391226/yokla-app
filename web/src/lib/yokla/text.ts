import type { Entities } from "./types";

/**
 * Türkçe karakterleri sadeleştirip küçük harfe çevirir.
 * Dolandırıcı mesajları çoğu zaman Türkçe karakter kullanmadan yazılır,
 * bu yüzden kalıplar bu sade biçim üzerinden eşleştirilir.
 */
export function fold(text: string): string {
  return text
    .toLocaleLowerCase("tr")
    .replace(/ı/g, "i")
    .replace(/ş/g, "s")
    .replace(/ğ/g, "g")
    .replace(/ü/g, "u")
    .replace(/ö/g, "o")
    .replace(/ç/g, "c")
    .replace(/â/g, "a")
    .replace(/î/g, "i")
    .replace(/û/g, "u");
}

const URL_RE =
  /\b((?:https?:\/\/|www\.)[^\s<>"'()]+|(?:[a-z0-9-]+\.)+(?:com|net|org|info|xyz|top|online|site|shop|live|click|icu|cyou|sbs|buzz|cfd|rest|vip|store|app|link|io|me|co|tr|ly|gl|at|cc|id|gd|to)(?:\/[^\s<>"'()]*)?)/gi;

const IBAN_RE = /\bTR\s?\d{2}(?:\s?\d{4}){5}\s?\d{2}\b/gi;

// +90 / 0 ile başlayan Türkiye numaraları ve + ile başlayan yabancı numaralar
const PHONE_RE =
  /(?:\+\d{1,3}[\s.-]?)?\(?0?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{2}[\s.-]?\d{2}\b|\b444[\s.-]?\d[\s.-]?\d{3}\b/g;

const EMAIL_RE = /[\w.+-]+@[\w-]+\.[\w.]+/g;

function unique(items: string[]): string[] {
  return [...new Set(items)];
}

export function extractEntities(text: string): Entities {
  const ibans = unique(
    (text.match(IBAN_RE) ?? []).map((s) => s.replace(/\s/g, "").toUpperCase()),
  );

  // IBAN rakamları telefon, e-posta alan adları link gibi okunmasın diye önce çıkarılır.
  const withoutIbans = text.replace(IBAN_RE, " ").replace(EMAIL_RE, " ");

  const urls = unique(
    (withoutIbans.match(URL_RE) ?? [])
      .map((s) => s.replace(/[.,;:!?]+$/, ""))
      .filter((s) => !/^\d+(\.\d+)+$/.test(s)),
  );

  const withoutUrls = withoutIbans.replace(URL_RE, " ");
  const phones = unique(
    (withoutUrls.match(PHONE_RE) ?? [])
      .map((s) => s.replace(/[^\d+]/g, ""))
      .filter((s) => s.replace(/\D/g, "").length >= 7),
  );

  return { urls, phones, ibans };
}

/**
 * Dil modeline gönderilmeden önce kişisel verileri maskeler.
 * Linkler maskelenmez: alan adı analizi için gerekli ve kişisel veri değil.
 */
export function maskPersonalData(text: string): string {
  return text
    .replace(IBAN_RE, "[IBAN]")
    .replace(/\b(?:\d[\s-]?){15}\d\b/g, "[KART_NO]")
    .replace(/\b[1-9]\d{10}\b/g, "[TC_KIMLIK]")
    .replace(PHONE_RE, "[TELEFON]")
    .replace(EMAIL_RE, "[EPOSTA]");
}
