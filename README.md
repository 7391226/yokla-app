# Yokla — Tıklamadan önce bir yokla

**[Türkçe](#türkçe) · [English](#english)**

Canlı site / Live site: **https://yokla.com.tr**

---

## Türkçe

Yokla, şüpheli bir mesajın dolandırıcılık olup olmadığına bakan ücretsiz bir web uygulamasıdır.
SMS, WhatsApp mesajı, bağlantı, telefon numarası ya da IBAN yapıştırırsın; Yokla sana kısa ve sade bir cevap verir.

Yokla en çok yaşlılar ve dijital deneyimi az olan kişiler için yapıldı. Bu yüzden cevaplar kısadır ve her zaman **tek bir şey yap** der.

### Ne yapar?

- Mesajı bilinen dolandırıcılık kalıplarıyla karşılaştırır (sahte kargo, sahte icra, "numaram değişti", kod isteme…).
- Bağlantılara bakar: marka taklidi, adres kısaltıcı, riskli uzantı, alan adının yaşı.
- IBAN'ın doğru yazılıp yazılmadığına ve hangi bankaya ait olduğuna bakar.
- Telefon numarasının türüne bakar.
- Ekran görüntüsündeki yazıyı okur. Bu okuma telefonda ya da bilgisayarda yapılır; resim hiçbir yere gönderilmez.
- Üç sonuçtan birini verir: **dolandırıcı**, **şüpheli** ya da **iz yok**. Yokla hiçbir zaman "güvenli" demez.

### Gizlilik

- Yapıştırılan metin hiçbir yerde saklanmaz.
- Yokla, mesajdaki bağlantıları **açmaz**. Yalnız alan adının ne zaman alındığını sorar (RDAP).
- Dil modeli (Claude) isteğe bağlıdır. Açıksa, kişisel bilgiler (telefon, IBAN, kart numarası, T.C. kimlik no, e-posta) maskelenip gönderilir. Dil modeli riski düşüremez, yalnız yükseltebilir.

### Kurallar hakkında

Bu depoda yalnız **örnek** senaryolar var (`web/src/lib/yokla/senaryolar/ornek.ts`).
yokla.com.tr'de çalışan asıl liste gizlidir. Sebebi: dolandırıcılar kuralları okuyup mesajlarını onlara göre değiştirmesin.
Kural motoru, bağlantı, IBAN ve telefon incelemesi, arayüz ve bütün öteki kodlar açıktır.

### Kendi bilgisayarında çalıştır

Gerekenler: Node.js 20.9 ya da daha yeni.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

Canlıya yakın sürüm için: `npm run build && npm start`

Ayarlar isteğe bağlıdır. `web/.env.example` dosyasını `web/.env` adıyla kopyala:

- `ANTHROPIC_API_KEY`: Boşsa Yokla yalnız kural motoruyla çalışır.
- `GOOGLE_SITE_VERIFICATION`: Yalnız kendi alan adın için Google Search Console kullanacaksan.

Windows notu: Komutları klasörün diskteki gerçek adıyla (büyük/küçük harf aynı) çalıştır. Yoksa Next.js derlemesi "Invalid hook call" hatası verebilir.

Kendi sunucunda yayına almak için örnek dosyalar: `web/kurulum-ornek/`.

### Katkı

Katkılar memnuniyetle karşılanır:

- **Yeni dolandırıcılık türü mü gördün?** Bir konu (issue) aç. Mesajın örneğini ekle ama önce içindeki kişisel bilgileri (ad, telefon, IBAN, adres) sil.
- **Yanlış sonuç mu aldın?** Gerçek bir kurumun mesajına "dolandırıcı" dendiyse ya da tersi olduysa, bunu da konu olarak yaz.
- **Kod katkısı:** Değişiklikten sonra `npm run build` ve `npm run lint` çalıştır.

Yokla uygulamada kullanıcıya kolay Türkçe konuşur: kısa cümleler, günlük sözcükler. Yeni metin yazarken buna dikkat et.

### İletişim

- Öneri, soru ya da hata için GitHub'da bir konu (issue) aç.
- Güvenlik açığı bulduysan herkese açık yazma. GitHub'daki **Security → Report a vulnerability** düğmesiyle gizli bildir.

Agah Ceylan

### Lisans

MIT. Bkz. [`LICENSE`](LICENSE). Başka projelerden alınan parçalar: [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).

Acil bir durumdaysan **112**'yi ara. Siber dolandırıcılık ihbarı için: https://siberguvenlik.gov.tr

---

## English

Yokla ("check it" in Turkish) is a free web app that tells you whether a suspicious message looks like a scam.
You paste an SMS, a WhatsApp message, a link, a phone number or an IBAN, and Yokla gives a short, plain answer in Turkish.

It is built for people in Turkey, especially older people and people with little digital experience. Answers are short and always end with **one thing to do**.

### What it does

- Matches the message against known Turkish scam patterns (fake parcel delivery, fake debt collection, "my number changed", asking for a verification code…).
- Checks links: brand impersonation, URL shorteners, risky file extensions, domain age.
- Validates IBANs (mod-97) and identifies the bank.
- Classifies phone numbers.
- Reads text from screenshots (OCR with tesseract.js). OCR runs on the device; the image is never uploaded.
- Gives one of three verdicts: **scam**, **suspicious** or **no sign found**. Yokla never says "safe".

### Privacy

- Pasted text is never stored.
- Yokla **never opens** the links in a message. It only looks up the domain's registration date (RDAP).
- The language model layer (Claude) is optional. When it is on, personal data (phone numbers, IBANs, card numbers, national ID numbers, email addresses) is masked before sending. The model can only raise the risk, never lower it.

### About the rules

This repository contains only **sample** scenarios (`web/src/lib/yokla/senaryolar/ornek.ts`).
The full list that runs on yokla.com.tr is kept private, so scammers cannot read the rules and work around them.
Everything else is open: the rule engine, link, IBAN and phone checks, and the user interface.

### Run it locally

Requires Node.js 20.9 or newer.

```bash
cd web
npm install
npm run dev        # http://localhost:3000
```

Production build: `npm run build && npm start`

Settings are optional. Copy `web/.env.example` to `web/.env`:

- `ANTHROPIC_API_KEY`: if empty, Yokla runs on the rule engine only.
- `GOOGLE_SITE_VERIFICATION`: only if you use Google Search Console for your own domain.

Windows note: run commands from the folder's real on-disk path (same letter case). Otherwise the Next.js build may fail with "Invalid hook call".

Example files for self-hosting (systemd, nginx): `web/kurulum-ornek/`.

Tech stack: Next.js 16 (App Router), React 19, Tailwind CSS 4, TypeScript, zod, tesseract.js, Anthropic SDK.

### Contributing

Contributions are welcome:

- **Seen a new kind of scam?** Open an issue with an example message. Remove personal data (names, phone numbers, IBANs, addresses) first.
- **Got a wrong result?** If a real company's message was marked as a scam, or the other way round, please open an issue.
- **Code:** run `npm run build` and `npm run lint` before sending a pull request.

User-facing text is in simple Turkish (short sentences, everyday words). Please keep that style.

### Contact

- For ideas, questions or bugs, open an issue on GitHub.
- Found a security problem? Please do not post it publicly. Use **Security → Report a vulnerability** on GitHub to report it privately.

Agah Ceylan

### License

MIT. See [`LICENSE`](LICENSE). Third-party parts: [`THIRD-PARTY-NOTICES.md`](THIRD-PARTY-NOTICES.md).
