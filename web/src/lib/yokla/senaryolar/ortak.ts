/**
 * Türkiye'de yaygın dolandırıcılık senaryoları.
 *
 * Kalıplar fold() ile sadeleştirilmiş metin üzerinde çalışır: küçük harf,
 * Türkçe karakterler yok (ı→i, ş→s, ğ→g, ü→u, ö→o, ç→c). Bu yüzden
 * buradaki her ifade Türkçe karaktersiz yazılır.
 *
 * Bir senaryo, `groups` içindeki gruplardan en az `minGroups` tanesi
 * eşleşirse tetiklenir. Her grup aynı fikrin farklı söyleniş biçimleridir.
 */
export interface Scenario {
  id: string;
  title: string;
  groups: RegExp[];
  minGroups: number;
  /** Tetiklenince kullanıcıya gösterilecek açıklama */
  explanation: string;
  /** Kullanıcının atması gereken tek adım */
  action: string;
  /** Senaryo için mesajda link bulunması şart mı */
  needsLink?: boolean;
  /** Eşleşirse senaryo tetiklenmez (gerçek kurum mesajlarındaki uyarı cümleleri) */
  exclude?: RegExp;
  /** Birden çok senaryo eşleşirse yüksek öncelikli olan seçilir (varsayılan 0) */
  priority?: number;
}

/**
 * Dolandırıcılık hakkında uyarı yapan duyuru ve haber metinleri. Bunlar
 * dolandırıcıların cümlelerini alıntıladığı için senaryolara takılır;
 * böyle bir metinde senaryo eşleşmesi sayılmaz, link sinyalleri yine sayılır.
 */
export const AWARENESS_TEXT =
  /(kotu niyetli kisi|sahte (sms|e-?posta|mesaj|baglanti)(lar)?(la|a|e)? (dikkat|itibar etmeyin|ile)|(dolandirici|sahte)[^.]{0,60}tespit edilmistir|dolandiricilara karsi|vatandaslarimiz(in|i)? (uyari|dikkat))/;

// Bankaların ve uygulamaların kendi gönderdiği kod/şifre SMS'lerinde geçen uyarılar
export const OFFICIAL_WARNING =
  /(kimseyle paylasma|kimse ile paylasma|paylasmayin|paylasmayiniz|kimseye (vermeyin|soylemeyin)|asla (istemez|sormaz))/;
