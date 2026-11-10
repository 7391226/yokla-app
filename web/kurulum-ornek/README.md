# Kendi sunucunda çalıştırma (örnek)

Bu klasördeki dosyalar örnektir. Kendi sunucuna göre değiştir.

1. Derle: `npm ci && npm run build`
2. Sunucuya kopyala (`/opt/yokla`):
   - `.next/standalone/` içindekiler → `/opt/yokla/`
   - `.next/static/` → `/opt/yokla/.next/static/`
   - `public/` → `/opt/yokla/public/`
   - Yerel `.env` dosyasını **kopyalama**.
3. Kullanıcı aç: `useradd --system --home /opt/yokla --shell /usr/sbin/nologin yokla`
4. Ayar dosyası `/etc/yokla.env` (izin: `chmod 640`):
   ```
   NODE_ENV=production
   PORT=3100
   HOSTNAME=127.0.0.1
   ANTHROPIC_API_KEY=
   ```
   `ANTHROPIC_API_KEY` boşsa Yokla yalnız kural motoruyla çalışır.
5. Servis: `yokla.service` dosyasını `/etc/systemd/system/` içine koy, `systemctl enable --now yokla`.
6. nginx: `nginx-yokla.conf` dosyasını uyarla, `nginx -t && systemctl reload nginx`.

Yokla yapıştırılan metni hiçbir yere kaydetmez. Günlüğe (journald) yalnız sonuç türü yazılır.
