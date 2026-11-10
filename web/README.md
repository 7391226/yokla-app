# Yokla — web uygulaması

Kurulum, ayarlar ve katkı için depo kökündeki [README.md](../README.md) dosyasına bak.

| Ne | Dosya |
| --- | --- |
| Metinden bağlantı, telefon ve IBAN ayıklama; kişisel veri maskeleme | `src/lib/yokla/text.ts` |
| Senaryolar: ortak tip ve örnek liste (asıl liste gizli) | `src/lib/yokla/senaryolar/` |
| Bağlantı analizi: marka taklidi, kısaltıcı, riskli uzantı, alan adı yaşı (RDAP) | `src/lib/yokla/url.ts` |
| IBAN doğrulama (mod-97, banka kodu) ve telefon sınıflandırma | `src/lib/yokla/iban.ts`, `phone.ts` |
| Sinyalleri puanlayıp karar verme, cevabı oluşturma | `src/lib/yokla/engine.ts` |
| İsteğe bağlı dil modeli katmanı (riski düşüremez, yalnız yükseltebilir) | `src/lib/yokla/llm.ts` |
| API ucu (`POST /api/yokla`), saatlik sınır | `src/app/api/yokla/route.ts` |
| Arayüz, ekran görüntüsü okuma (cihaz içinde), uyarı paylaşma | `src/components/YoklaForm.tsx` |
| Ana ekrana ekleme ve Paylaş menüsü | `src/app/manifest.ts`, `public/sw.js` |

## Bilinen sınırlar

- Saatlik istek sınırı bellekte tutulur; sunucu yeniden başlayınca sıfırlanır.
- Paylaş menüsü yalnız Android'de ve HTTPS üzerinden çalışır (iPhone web uygulamalarına izin vermiyor).
- Test seti yok; değişiklikten sonra `npm run build` ve `npm run lint` çalıştır.
