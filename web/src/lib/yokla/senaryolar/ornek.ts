/**
 * Örnek senaryolar. Yokla'nın asıl listesi (yokla.com.tr'de çalışan) gizlidir:
 * dolandırıcılar kuralları okuyup mesajlarını değiştirmesin diye.
 *
 * Kendi senaryonu eklemek için bu dosyayı örnek al. Yeni senaryo önerisi
 * için depoda bir konu (issue) aç; dolandırıcılık mesajı örneğindeki kişisel
 * bilgileri sil.
 */
import { OFFICIAL_WARNING, type Scenario } from "./ortak";

export const SCENARIOS: Scenario[] = [
  {
    id: "kargo",
    title: "sahte kargo bildirimi",
    groups: [
      /\b(kargo(nuz|n)?|gonderi(niz)?|paket(iniz)?|teslimat)\b/,
      /(teslim edilemedi|adres(iniz)? (eksik|hatali|dogrulan)|gumruk (ucreti|vergisi)|ek ucret|depoda bekl|iade edil)/,
      /(odeme|ucret|tikla|guncelle|dogrula|link)/,
    ],
    minGroups: 2,
    needsLink: true,
    explanation:
      "Sahte kargo mesajları \"adresini güncelle\" ya da \"küçük bir ücret öde\" diyerek seni kargo şirketine benzeyen bir sayfaya götürür; orada yazdığın kimlik ve kart bilgileri çalınır. Gerçek kargo şirketinin bağlantısı kendi adresinden gelir.",
    action:
      "Bağlantıya tıklama. Kargonu şirketin kendi uygulamasından ya da sitesine kendin girerek takip et.",
  },
  {
    id: "icra",
    title: "sahte icra / e-Devlet uyarısı",
    groups: [
      /(icra|haciz|dava dosya|e-?devlet|uyap|mahkeme|tebligat|ceza(niz)? (karari|kesildi))/,
      /(odeme|borc(unuz)?|tikla|goruntule|itiraz|son gun|24 saat|kapatilmasi)/,
    ],
    minGroups: 2,
    needsLink: true,
    explanation:
      "İcra ve dava tebligatları SMS bağlantısıyla gelmez; e-Devlet'e sadece turkiye.gov.tr adresinden girilir.",
    action:
      "Bağlantıya tıklama. Dosyan olup olmadığına e-Devlet'e (turkiye.gov.tr) kendin girerek bak.",
  },
  {
    id: "kart-bilgisi",
    title: "kart / şifre bilgisi isteme",
    groups: [
      /(sifre(niz|ni)?|parola|kart (bilgi|numara)|cvv|cvc|son kullanma|guvenlik kodu)/,
      /(gir(in|iniz)|paylas|yaz|bildir|dogrula|guncelle|gonder)/,
    ],
    minGroups: 2,
    exclude: OFFICIAL_WARNING,
    explanation:
      "Hiçbir banka, kurum ya da şirket şifreni veya kartının arkasındaki kodu mesajla istemez.",
    action: "Hiçbir bilgi verme. Bilgi verdiysen hemen bankanı ara ve kartını kapattır.",
  },
];
