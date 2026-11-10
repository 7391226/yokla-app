import type { Signal } from "./types";

const SHORTENERS = new Set([
  "bit.ly", "tinyurl.com", "cutt.ly", "is.gd", "shorturl.at", "rebrand.ly",
  "t.ly", "s.id", "rb.gy", "tiny.cc", "goo.gl", "ow.ly", "t.co", "kisa.link",
  "shorturl.me", "v.gd", "qr.ae",
]);

const RISKY_TLDS = new Set([
  "xyz", "top", "online", "site", "info", "live", "shop", "click", "icu",
  "cyou", "sbs", "buzz", "cfd", "rest", "monster", "lol", "vip", "today",
  "support", "help", "store", "quest", "bond", "pw", "tk", "ml", "ga", "cf", "gq",
]);

// Türkiye'deki ikinci düzey uzantılar: alan adının "sahibi" bir seviye daha solda.
const TR_SECOND_LEVEL = new Set([
  "com.tr", "gov.tr", "org.tr", "net.tr", "edu.tr", "gen.tr", "web.tr",
  "bel.tr", "k12.tr", "av.tr", "biz.tr", "info.tr", "tv.tr", "pol.tr", "tsk.tr",
  "co.uk", "com.br",
]);

/**
 * Sık taklit edilen markalar. Anahtar kelime alan adında geçip alan adı
 * resmi adreslerden biri değilse, link o markayı taklit ediyor olabilir.
 */
const BRANDS: { name: string; keywords: string[]; official: string[] }[] = [
  { name: "PTT", keywords: ["ptt"], official: ["ptt.gov.tr", "pttkargo.com.tr", "pttavm.com"] },
  { name: "e-Devlet", keywords: ["edevlet", "e-devlet", "turkiyegov", "turkiye-gov"], official: ["turkiye.gov.tr"] },
  { name: "e-Devlet yaş doğrulama", keywords: ["yasdogrula", "yas-dogrula", "yasteyit", "agecheck", "age-verif"], official: ["turkiye.gov.tr"] },
  { name: "UYAP", keywords: ["uyap"], official: ["uyap.gov.tr"] },
  { name: "SGK", keywords: ["sgk"], official: ["sgk.gov.tr"] },
  { name: "Gelir İdaresi", keywords: ["vergiiade", "vergi-iade", "gibportal"], official: ["gib.gov.tr"] },
  { name: "HGS", keywords: ["hgs"], official: ["hgs.com.tr", "ptt.gov.tr"] },
  { name: "Yurtiçi Kargo", keywords: ["yurtici"], official: ["yurticikargo.com"] },
  { name: "Aras Kargo", keywords: ["araskargo", "aras-kargo"], official: ["araskargo.com.tr"] },
  { name: "MNG Kargo", keywords: ["mngkargo", "mng-kargo"], official: ["mngkargo.com.tr"] },
  { name: "Sürat Kargo", keywords: ["suratkargo", "surat-kargo"], official: ["suratkargo.com.tr"] },
  { name: "Trendyol", keywords: ["trendyol"], official: ["trendyol.com"] },
  { name: "Hepsiburada", keywords: ["hepsiburada"], official: ["hepsiburada.com"] },
  { name: "Sahibinden", keywords: ["sahibinden"], official: ["sahibinden.com"] },
  { name: "Ziraat Bankası", keywords: ["ziraat"], official: ["ziraatbank.com.tr", "ziraat.com.tr"] },
  { name: "Garanti BBVA", keywords: ["garantibbva", "garanti-bbva", "garantibank"], official: ["garantibbva.com.tr"] },
  { name: "İş Bankası", keywords: ["isbank", "is-bank", "isbankasi"], official: ["isbank.com.tr"] },
  { name: "Akbank", keywords: ["akbank"], official: ["akbank.com"] },
  { name: "Yapı Kredi", keywords: ["yapikredi", "yapi-kredi"], official: ["yapikredi.com.tr"] },
  { name: "VakıfBank", keywords: ["vakifbank"], official: ["vakifbank.com.tr"] },
  { name: "Halkbank", keywords: ["halkbank"], official: ["halkbank.com.tr"] },
  { name: "Enpara", keywords: ["enpara"], official: ["enpara.com"] },
  { name: "Turkcell", keywords: ["turkcell"], official: ["turkcell.com.tr"] },
  { name: "Vodafone", keywords: ["vodafone"], official: ["vodafone.com.tr"] },
  { name: "Türk Telekom", keywords: ["turktelekom", "turk-telekom"], official: ["turktelekom.com.tr"] },
];

export function parseHost(raw: string): string | null {
  try {
    const withScheme = /^https?:\/\//i.test(raw) ? raw : `http://${raw}`;
    return new URL(withScheme).hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}

/** "a.b.ornek.com.tr" → "ornek.com.tr" (yaklaşık; tam bir son ek listesi kullanmaz) */
export function registrableDomain(host: string): string {
  const parts = host.split(".");
  if (parts.length <= 2) return host;
  const lastTwo = parts.slice(-2).join(".");
  const take = TR_SECOND_LEVEL.has(lastTwo) ? 3 : 2;
  return parts.slice(-take).join(".");
}

function isOfficial(host: string, official: string[]): boolean {
  return official.some((d) => host === d || host.endsWith(`.${d}`));
}

/** Link, listedeki markalardan birinin ya da bir devlet kurumunun resmi adresi mi? */
export function isKnownOfficialUrl(raw: string): boolean {
  const host = parseHost(raw);
  if (!host) return false;
  return host.endsWith(".gov.tr") || BRANDS.some((b) => isOfficial(host, b.official));
}

/** Alan adının kayıt tarihini RDAP üzerinden sorgular; bulunamazsa null. */
async function domainAgeDays(domain: string): Promise<number | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      signal: AbortSignal.timeout(3500),
      headers: { accept: "application/rdap+json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { events?: { eventAction?: string; eventDate?: string }[] };
    const reg = data.events?.find((e) => e.eventAction === "registration")?.eventDate;
    if (!reg) return null;
    const ms = Date.now() - Date.parse(reg);
    return Number.isFinite(ms) ? Math.floor(ms / 86_400_000) : null;
  } catch {
    return null;
  }
}

export async function analyzeUrl(raw: string): Promise<Signal[]> {
  const signals: Signal[] = [];
  const host = parseHost(raw);
  if (!host) return signals;
  const domain = registrableDomain(host);

  if (/^\d{1,3}(\.\d{1,3}){3}$/.test(host)) {
    signals.push({
      id: "url-ip",
      severity: "yuksek",
      message: "Bağlantı bir alan adı yerine yalnızca rakamlardan oluşan bir adrese (IP) gidiyor; gerçek kurumlar böyle bağlantı göndermez.",
    });
    return signals;
  }

  if (host.includes("xn--")) {
    signals.push({
      id: "url-punycode",
      severity: "yuksek",
      message: `Bağlantı (${host}) bilinen bir adrese benzemek için başka bir alfabeden harfler kullanıyor olabilir.`,
    });
  }

  if (SHORTENERS.has(host)) {
    signals.push({
      id: "url-kisaltici",
      severity: "orta",
      message: `Bağlantı kısaltılmış (${host}); gerçekte nereye gittiğini gizliyor.`,
    });
  }

  if (/@/.test(raw.replace(/^https?:\/\//i, "").split("/")[0] ?? "")) {
    signals.push({
      id: "url-at",
      severity: "yuksek",
      message: "Bağlantıda \"@\" işareti var; tarayıcı seni göründüğünden başka bir adrese götürür.",
    });
  }

  for (const brand of BRANDS) {
    const compact = host.replace(/\./g, "");
    const mentions = brand.keywords.some((k) => compact.includes(k.replace(/\./g, "")));
    if (mentions && !isOfficial(host, brand.official)) {
      signals.push({
        id: `url-taklit-${brand.name}`,
        severity: "yuksek",
        message: `Bağlantı ${brand.name} adını kullanıyor ama gittiği adres (${domain}) resmi ${brand.name} adresi değil.`,
      });
      break;
    }
  }

  const tld = host.split(".").pop() ?? "";
  if (RISKY_TLDS.has(tld)) {
    signals.push({
      id: "url-uzanti",
      severity: "orta",
      message: `Bağlantının uzantısı (.${tld}) dolandırıcıların sık kullandığı ucuz bir uzantı.`,
    });
  }

  if (/^http:\/\//i.test(raw)) {
    signals.push({
      id: "url-http",
      severity: "dusuk",
      message: "Bağlantı şifreli değil (https kullanmıyor).",
    });
  }

  if (!SHORTENERS.has(host)) {
    const age = await domainAgeDays(domain);
    if (age !== null && age < 30) {
      signals.push({
        id: "url-yeni",
        severity: "yuksek",
        message: `Bağlantının gittiği alan adı (${domain}) yalnızca ${age} gün önce alınmış.`,
      });
    } else if (age !== null && age < 180) {
      signals.push({
        id: "url-genc",
        severity: "orta",
        message: `Bağlantının gittiği alan adı (${domain}) yaklaşık ${Math.max(1, Math.round(age / 30))} ay önce alınmış.`,
      });
    }
  }

  if (host.endsWith(".gov.tr") && signals.length === 0) {
    signals.push({
      id: "url-gov",
      severity: "bilgi",
      message: `Bağlantı bir devlet adresine (${domain}) gidiyor; yine de adresi harf harf incele.`,
    });
  }

  return signals;
}
