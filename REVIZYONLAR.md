# Revizyon Kayıtları — Çimko Geri Bildirim Turu 1

Tarih: 08.09.2026 · Kaynak: Çimko İK ekibi toplantı notları (25 madde)
Durum: Tamamlandı ve test edildi

---

## Sınav ve Envanter İşlemleri

| # | Talep | Yapılan |
|---|---|---|
| 1 | Yeni Sınav Ataması ekranında isimle arama | Aday seçimi, arama kutulu listeye dönüştürüldü (`components/candidate-picker.tsx`). Ad veya telefon ile Türkçe karakter duyarlı arama yapılır, seçilen aday kart olarak gösterilir. |
| 2 | Envanter testini tamamlayan adaylar görüntülenebilmeli | Sınavlar ekranına **Envanter Testi Takibi** bölümü eklendi; aday, pozisyon, envanter adı, durum, tamamlanma tarihi ve profil uyum yüzdesi listelenir. |
| 3 | Tamamlayan/tamamlamayan ayrı filtrelenebilmeli | Bölüme **Tamamlayanlar / Tamamlamayanlar / Tümü** filtreleri ve aday adı araması eklendi (sayılar filtre butonlarında görünür). |

## Portal ve Kurumsal Giriş

| # | Talep | Yapılan |
|---|---|---|
| 4 | Kurum dışı yetkili kullanıcı girişi | Yeni rol: **Dış Yetkili Kullanıcı** (`DIS_KULLANICI`). Kurumsal Giriş ekranından giriş yapar. |
| 5 | Bu kullanıcı Açık Pozisyonlar ekranına erişebilmeli | Yeni panel ekranı `/acik-pozisyonlar`. Dış kullanıcı giriş sonrası doğrudan buraya yönlenir ve menüsünde yalnızca bu ekran görünür. Aday/rapor/sınav ekranlarına erişimi engellenir. |
| 6 | Aktif/Pasif durumuna göre görüntüleme ve filtreleme | Ekranda Aktif / Pasif / Tümü filtreleri, sayaçlar, durum rozeti ve ilan-tesis araması var. |
| 7 | Adaylar yetkili kullanıcılarca silinebilmeli | Adaylar listesine **Sil** işlemi eklendi (yalnızca İK Yöneticisi ve Sistem Yöneticisi). Onay sorulur; başvuru, sınav, cevap, KVKK onayı ve CV dosyaları birlikte silinir, işlem denetim kaydına yazılır. Çalışan kaydına dönüşmüş adaylar korunur. |

## Raporlar ve Göstergeler

| # | Talep | Yapılan |
|---|---|---|
| 8 | Hangi adayın hangi pozisyona başvurduğu görülmeli | Raporlar ekranına **Başvurular** tablosu eklendi: aday, cep telefonu, başvurduğu pozisyon (+tesis), tarih, durum, aşama, CV. |
| 9, 11 | Excel'e aktarma ve indirme | `/api/rapor/excel` — gerçek `.xlsx` çıktısı (SheetJS), başlık satırı otomatik filtreli, sütun genişlikleri ayarlı. Ekrandaki **Excel İndir (.xlsx)** butonu seçili filtreleri de aktarır. |
| 10 | Excel içeriği | Sütunlar: Adı Soyadı · Cep Telefonu · Başvurduğu Pozisyon · Tesis · Başvuru Tarihi · Başvuru Durumu · İşe Alım Aşaması · Başvuru Kaynağı · CV Görüntüle · CV İndir. |
| 12 | CV için bağlantı | CV dosyası Excel'e gömülemediğinden iki tıklanabilir bağlantı üretilir: görüntüleme ve indirme. Bağlantılar oturum açmış yetkili kullanıcı gerektirir (`/api/cv/[id]`). |

## İlan ve Başvuru Formu

| # | Talep | Yapılan |
|---|---|---|
| 13 | Her ilanın altında "Başvur" butonu | Ana sayfadaki her ilan kartında **Başvur** (forma gider) ve **Detay** butonları var. |
| 14 | "Özgeçmiş Bırak" ile genel başvuru | Üst menüde ve ana sayfada **Özgeçmiş Bırak** (`/basvuru`). Pozisyonsuz başvuru olarak kaydedilir; listelerde "Genel Başvuru" görünür. |
| 15 | Referans forma göre hazırlanmalı | `cimsakariyerim.com.tr` adresi DNS'te çözülmediğinden erişilemedi. Form, 16–22 maddelerinde sayılan alanlar ve standart Türkçe kariyer formu düzeni esas alınarak hazırlandı. |
| 16 | Ad Soyad alanı | Tek alan olarak eklendi; ilk kelime ad, kalanı soyad olarak ayrıştırılır (çok kelimeli soyadlar desteklenir). |
| 17 | Açıklama / ön yazı alanı | Çok satırlı metin alanı eklendi; aday detay ekranında "Adayın Ön Yazısı" olarak görünür. |
| 18 | CV yükleme alanı | Dosya yükleme eklendi; dosyalar `uploads/cv/` altında rastgele adla saklanır (public dizinde değil). |
| 19 | Yalnızca PDF ve Word | Hem tarayıcı (`accept`) hem sunucu tarafında uzantı ve MIME kontrolü; 5 MB sınırı. Geçersiz dosya reddedilir. |
| 20 | Cep telefonu zorunlu | Zorunlu alan; sunucu tarafında en az 10 rakam doğrulaması. |
| 21 | KVKK onay kutusu | Zorunlu onay kutusu; onaysız başvuru sunucu tarafında reddedilir, onay kaydı sürüm bilgisiyle saklanır. |
| 22 | KVKK metni bağlantısı | Onay kutusunun içinde `/kvkk` sayfasına bağlantı (yeni sekmede açılır). |

## İşe Alım Süreci ve Aday Takibi

| # | Talep | Yapılan |
|---|---|---|
| 23 | Sağa doğru genişleyen açılır liste değiştirilmeli | İşe Alım ekranının **varsayılan görünümü dikey listeye** çevrildi. Yatay sürükle-bırak pano isteğe bağlı ikinci görünüm olarak korundu ("Pano Görünümü" butonu). |
| 24 | Aşamalar listbox/checkbox ile alt alta | Sol panelde aşamalar onay kutularıyla alt alta listelenir; seçim yapıldığında yalnızca işaretli aşamalar gösterilir. Aynı yapı Raporlar ekranında da kullanılır. |
| 25 | Süreç bu aşamalardan takip edilmeli | **İK Mülakatı, Teknik Mülakat, Sağlık Süreci, Evrak Süreci** "Ana Takip Aşamaları" olarak ayrı gruplandı ve vurgulandı. Önceki birleşik "Sağlık ve Evrak" aşaması ikiye ayrıldı. Her adayın satırındaki açılır listeden aşama değiştirilebilir; değişiklik tarih ve kullanıcı bilgisiyle kaydedilir. |

---

## Teknik Notlar

- **Veri modeli:** `Application.positionId` artık isteğe bağlı (genel başvurular için); `Candidate.coverLetter` alanı eklendi; aşama listesine `SAGLIK_SURECI` ve `EVRAK_SURECI` eklendi.
- **Dosya güvenliği:** CV'ler public dizinde tutulmaz, yalnızca oturumlu kullanıcıya sunulur; dosya adları rastgele üretilir, yol dizin dışına çıkamaz (path traversal koruması). Her görüntüleme/indirme denetim kaydına yazılır.
- **Yetkilendirme:** Dış kullanıcı, kurum içi ekranlardan `INTERNAL_ROLES` kontrolüyle ayrılır; yetkisiz erişimde kendi ana sayfasına yönlendirilir.

## Test Edilenler

Başvuru gönderimi (ilan ve genel), geçersiz dosya türü reddi, eksik telefon reddi, KVKK onayı olmadan gönderim reddi, CV'nin oturumsuz erişime kapalı olması, Excel çıktısının içeriği ve CV bağlantıları, dış kullanıcının kısıtlı erişimi, aday silme (dosya ve denetim kaydı dahil), aşama filtreleri ve liste görünümünden aşama değişikliği.
