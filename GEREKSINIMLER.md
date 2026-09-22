# Çimko Mavi Yaka İşe Alım, Yetkinlik ve Performans Platformu

## Ürün Gereksinimleri Dokümanı (PRD) — v1.0

Tarih: 18.07.2026 · Durum: Onaylı (kullanıcı kararlarıyla)

---

## 1. Amaç ve Kapsam

Çimko'nun mavi yaka işe alım, test/değerlendirme, yetkinlik ve performans süreçlerini tek platformda toplamak. Mevcut Pozitif İK (PİK Online) sisteminin işlevsel mantığı korunup iyileştirilecek; telifli içerik (soru metinleri, MYKE maddeleri, rapor metinleri) **kopyalanmayacak**, aynı yapıda özgün içerik üretilecek.

### Onaylı ürün kararları

| # | Karar | Seçim |
|---|---|---|
| 1 | MVP kapsamı | İşe alım + sınav motoru önce; performans modülü ikinci faz (iskeleti MVP'de) |
| 2 | Çalışma ortamı | Yerel demo (SQLite), Docker + PostgreSQL'e taşınabilir mimari |
| 3 | Test içeriği | Çimento sektörüne özgü özgün örnek sorular; Çimko sonradan düzenler |
| 4 | Organizasyon | Kurgusal yapı: 2 çimento fabrikası (Adıyaman, Narlı) + hazır beton tesisleri |
| 5 | Mekanik Yetenek boyutu | Pozisyon bazında seçilebilir; varsayılan v2 revizyonu (Üretim'de yok; Bakım, Depo-Sevkiyat, Hazır Beton'da var) |
| 6 | BTÖ/PTÖ ölçekleri | Sağlık (teşhis/ilaç) soruları OLMADAN dahil; sonuçlar yalnızca yetkili İK'ya görünür, karar puanına katılmaz |
| 7 | İşe alım panosu | 14 aşamalı tam set varsayılan; yönetim panelinden düzenlenebilir |
| 8 | Başvuru kanalı | Çift kanal: self-servis ilan başvurusu + İK elle/Excel ekleme ve kodla test daveti |

## 2. Analizden Gelen Temel Ölçüm Modeli (seed verisine esas)

- **Genel Yetenek Testi:** pozisyona özel form, 40 soru / 25 dk, 5 şık, yanlış götürmez, soru atlanabilir, tek hak. Boyutlar: Sayısal, Sözel, Soyut Kavrama, Görsel Dikkat (+ opsiyonel Mekanik Kavrama). Puan = doğru %. Baraj 50 (tüm pozisyonlar), Norm 65 (İlk Seviye ve Depo-Sevkiyat: 60).
- **Kişilik Envanteri (Çimko'ya özgü "ÇKE" olarak yeniden adlandırılır):** 3 bölüm (Likert-3'lü ifadeler, sıfat listesi, ikili zorunlu seçim), soru atlanamaz, süre bölüm bazlı. 10 boyut, 1–10 ölçek; pozisyon başına [alt–üst] ideal aralık → **profil uyum yüzdesi**.
- **Pozisyon profilleri:** 6 pozisyonun baraj/norm ve 10 boyutlu kişilik aralıkları klasör analizinden aynen seed edilir.
- **Raporlar:** yetenek (GEÇTİ/KALDI + baraj/norm/grup ort. + boyut kırılımı), kişilik (uyum % + bant grafiği + puan bandına göre metin kütüphanesi), cevap analizi.

## 3. Kullanıcı Rolleri (MVP)

| Rol | MVP yetkisi |
|---|---|
| SISTEM_YONETICISI | Tüm sistem + kullanıcı/rol + organizasyon + ayarlar |
| IK_YONETICISI | İşe alım uçtan uca, profil/ağırlık düzenleme, tüm raporlar, dönem yönetimi |
| IK_UZMANI | Aday/başvuru işlemleri, test atama, mülakat kaydı, aday raporları |
| TESIS_YONETICISI | Kendi tesisinin adayları/sonuçları (salt okuma + onay), karşılaştırma |
| BOLUM_YONETICISI | Kendi bölümü; mülakat/teknik değerlendirme girişi |
| TEKNIK_DEGERLENDIRICI | Atandığı adaylar için teknik değerlendirme formu |
| ISG_UZMANI | İSG değerlendirme girişi, güvenlik davranışı görünümü |
| ADAY | Kod ile giriş → KVKK onayı → test çözme; self-servis başvuru (hesapsız) |
| CALISAN (faz 2) | Öz değerlendirme, sonuç görüntüleme |

Veri erişimi tesis/bölüm bazlı filtrelenir (satır düzeyi yetki).

## 4. MVP Fonksiyonel Kapsam

1. **Kimlik/Yetki:** e-posta+şifre girişi, rol bazlı menü ve API koruması, oturum yönetimi, denetim kaydı.
2. **Organizasyon:** Tesis → Bölüm → Pozisyon hiyerarşisi CRUD; pozisyon profili (eğitim/deneyim şartı, vardiya, boyut seti, baraj/norm, kişilik aralıkları, yetkinlikler).
3. **Yetkinlik kütüphanesi:** 23 mavi yaka yetkinliği seed; seviye tanımları (1–5), davranış göstergeleri, pozisyon eşleme.
4. **Aday yönetimi:** çift kanal kayıt, aday havuzu, mükerrer kontrol (TC/ad+doğum), KVKK açık rıza kaydı, belge yükleme, iletişim/işlem geçmişi.
5. **İlan + başvuru portalı:** açık pozisyon ilanı, mobil uyumlu başvuru formu (hesapsız), KVKK aydınlatma.
6. **İşe alım panosu:** 14 aşama, sürükle-bırak, aşama geçmişi (tarih+kullanıcı+not), olumsuz/yedek nedenleri.
7. **Sınav motoru:** madde bankası (test bağımsız; çoktan seçmeli 3/5 şık, görsel, Likert, ikili zorunlu seçim, sıfat listesi; uyaran grubu), test formu tanımı (bölümler, süre, atlama kuralı, karıştırma), sınav paketi (çoklu test), atama + erişim kodu üretimi, aday sınav ekranı (sayaç, ilerleme, eksik soru kontrolü), otomatik puanlama, kesinti telafisi (süre güncelleme).
8. **Değerlendirme:** İK mülakat formu, teknik değerlendirme, İSG değerlendirme, uygulamalı değerlendirme kontrol listesi; ağırlıklı **işe uygunluk puanı** (ağırlıklar panelden düzenlenir, toplam %100 kontrolü).
9. **Karşılaştırma:** pozisyon bazında çoklu aday yan yana (test, kişilik uyum, mülakat, uygunluk %, eksik belgeler).
10. **Raporlama:** işe alım hunisi, test başarı dağılımı, tesis/pozisyon kırılımı, aday raporu (yazdırılabilir/PDF), CSV/Excel dışa aktarım.
11. **Performans iskeleti (faz 2 önizlemesi):** dönem tanımı + amir değerlendirme formu (yetkinlik bazlı) + basit sonuç ekranı.

## 5. Fonksiyonel Olmayan Gereksinimler

- Türkçe arayüz; masaüstü/tablet/mobil duyarlı; açık/koyu tema; Çimko kimliği (lacivert `#283371`, kırmızı `#E5142D`).
- Güvenlik: bcrypt parola, HTTPOnly oturum çerezi, rol+kapsam kontrolü her API'de, denetim kaydı, dosya yükleme doğrulaması, XSS/CSRF/SQLi koruması (Prisma + Next.js varsayılanları + doğrulama).
- KVKK: açık rıza kaydı (metin sürümü + zaman damgası), veri dışa aktarma logu, silme/anonimleştirme ucu, sağlık verisi toplanmaz.
- AI özellikleri karar destek amaçlı ve insan onaylı (faz 2; MVP'de kural tabanlı öneri iskeleti).
- Sistem tek başına işe alım/işten çıkarma kararı vermez; tüm nihai kararlar kullanıcı onaylıdır.

## 6. Teknoloji

Next.js (App Router) + React + TypeScript + Tailwind CSS · Prisma ORM · SQLite (demo) / PostgreSQL (üretim, docker-compose hazır) · jose JWT oturum + bcrypt · Zod doğrulama · Recharts grafikler. Enum'lar Postgres uyumluluğu için string alan + TS sabitleriyle modellenir.

## 7. Kabul Kriterleri

Kullanıcı talimatındaki 16 kabul kriteri geçerlidir; MVP'de performans tarafı "dönem başlatılabilir + amir değerlendirmesi girilebilir + raporlanabilir" düzeyinde karşılanır, tam performans yönetimi faz 2'dedir.
