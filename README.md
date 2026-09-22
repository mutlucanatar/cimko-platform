# Çimko İK Platformu

Çimko için geliştirilmiş **Mavi Yaka İşe Alım, Yetkinlik ve Performans Yönetimi Platformu** (MVP).

> Bu bir demo/MVP sürümüdür. Tüm kişiler, adaylar ve veriler **kurgusaldır**; gerçek kişisel veri içermez. Test soruları bu proje için özgün olarak üretilmiştir — hiçbir ticari testin içeriği kopyalanmamıştır.

## Hızlı Başlangıç (Yerel Demo)

Gereksinim: Node.js 20.9+ (öneri: 22)

```bash
cd cimko-platform
npm install
npx prisma db push      # SQLite veritabanını oluşturur (prisma/dev.db)
npm run db:seed         # örnek verileri yükler
npm run dev             # http://localhost:3000
```

### Demo hesapları (şifre: `Cimko2026!`)

| Rol | E-posta |
|---|---|
| Sistem Yöneticisi | admin@cimko.com.tr |
| İK Yöneticisi | ik.yonetici@cimko.com.tr |
| İK Uzmanı | ik.uzman@cimko.com.tr |
| Tesis Yöneticisi (Adıyaman) | tesis.adiyaman@cimko.com.tr |
| Bölüm Yöneticisi (Üretim) | bolum.uretim@cimko.com.tr |
| Teknik Değerlendirici | teknik.degerlendirici@cimko.com.tr |
| İSG Uzmanı | isg.uzman@cimko.com.tr |
| Dış Yetkili Kullanıcı | dis.kullanici@tedarikci.com.tr |

**Aday girişi:** ana sayfa → "Aday Sınav Girişi" (`/aday`) → erişim kodu. Kodlar Sınavlar ekranında görünür; seed sonrası bekleyen atamalar için kodu `Sınavlar` sayfasından okuyabilirsiniz.

**Aday başvurusu:** ana sayfa → ilan kartındaki "Başvur" veya üst menüdeki "Özgeçmiş Bırak" (`/basvuru`). CV yalnızca PDF/Word kabul edilir, KVKK onayı zorunludur.

**Dış yetkili kullanıcı:** Kurumsal Giriş ekranından giriş yapar ve yalnızca "Açık Pozisyonlar" ekranını görür; aday, rapor ve sınav verilerine erişemez.

## Modüller

- **Panel** — rol bazlı ana sayfa ve KPI'lar
- **Adaylar** — çift kanal kayıt (İK + self-servis ilan başvurusu), mükerrer kontrol, KVKK rıza kayıtları, iletişim geçmişi, kara liste
- **İşe Alım Panosu** — 14 aşamalı sürükle-bırak pano; her taşıma tarih/kullanıcı/not ile `StageHistory`'ye yazılır
- **Sınavlar** — sınav paketleri (çoklu test), atama + benzersiz erişim kodu, son erişim tarihi, sıfırlama, kesinti telafisi (+dk)
- **Sınav motoru (aday)** — kod ile şifresiz giriş, KVKK onayı zorunlu, bölüm bazlı süre, kişilikte soru atlama engeli, yetenekte serbest gezinme + soru navigatörü, cevap bazlı otomatik kayıt, otomatik puanlama
- **Soru Bankası** — testlerden bağımsız madde havuzu (boyut, zorluk, kullanım sayısı)
- **Değerlendirmeler** — İK/Teknik/İSG/Uygulamalı mülakat formları (kriter bazlı 1–5), yalnızca atanan değerlendirici doldurabilir
- **Aday Karşılaştırma** — pozisyon bazlı yan yana karşılaştırma, uygunluk sıralı
- **Raporlar** — işe alım hunisi, test puan dağılımı, pozisyon kırılımı, CSV (Excel uyumlu) dışa aktarım, yazdırılabilir aday raporu (PDF)
- **Organizasyon** — tesis → bölüm → pozisyon; pozisyon profili: baraj/norm, yetenek boyut seti, 10 boyutlu kişilik aralıkları (1–10), yetkinlik eşleme
- **Yetkinlikler** — 23 mavi yaka yetkinliği, davranış göstergeleri, 1–5 seviye tanımları
- **Performans (Faz 2 iskeleti)** — dönem yönetimi, yetkinlik bazlı amir değerlendirmesi, gelişim alanı önerisi
- **Ayarlar** — kullanıcı yönetimi, işe uygunluk ağırlıkları (%100 kontrolü), denetim kayıtları

## Puanlama Modeli (PİK analizinden aktarılan)

- **Yetenek:** puan = doğru / soru × 100; yanlış götürmez. Baraj 50 (eleme), pozisyon normu 60–65.
- **Kişilik:** boyut ham puanı → 1–10; pozisyon başına [alt–üst] ideal aralık; aralık içi = uygun, ±1 = kısmen (0,5), dışı = 0 → **profil uyum yüzdesi**.
- **İşe uygunluk:** `Σ bileşen × ağırlık` (varsayılan: yetenek 35 + kişilik 20 + İK mülakat 15 + teknik 15 + uygulamalı 10 + İSG 5 = %100, panelden düzenlenir; eksik bileşen ağırlığı mevcutlara oranlanır).
- İyi oluş (tutum) taraması karar puanına **katılmaz**, yalnızca yetkili İK görür; sağlık/teşhis sorusu **yoktur** (KVKK).

## Üretime Geçiş (PostgreSQL + Docker)

1. `prisma/schema.prisma` → `provider = "postgresql"` yapın (şema Postgres uyumlu tasarlandı; enum yok, JSON'lar String).
2. `.env` → `DATABASE_URL=postgresql://cimko:***@db:5432/cimko` ve güçlü `SESSION_SECRET`.
3. `docker compose up --build` (bkz. `docker-compose.yml`).
4. İlk kurulumda: `npx prisma db push && npm run db:seed` (veya gerçek veri içe aktarımı).
5. Ters proxy arkasında **HTTPS zorunlu**; `SESSION_SECRET` üretimde mutlaka değiştirilmeli.

Ayrıntılar: [docs/GEREKSINIMLER.md](docs/GEREKSINIMLER.md) · [docs/KULLANICI_KILAVUZU.md](docs/KULLANICI_KILAVUZU.md) · [docs/VERI_MODELI.md](docs/VERI_MODELI.md) · [docs/GUVENLIK_KVKK.md](docs/GUVENLIK_KVKK.md)

## Komutlar

| Komut | Açıklama |
|---|---|
| `npm run dev` | Geliştirme sunucusu |
| `npm run build` / `npm start` | Üretim derlemesi ve çalıştırma |
| `npm run db:push` | Şemayı veritabanına uygular |
| `npm run db:seed` | Örnek verileri yükler (mevcut veriyi temizler) |
