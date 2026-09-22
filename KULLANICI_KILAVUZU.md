# Çimko İK Platformu — Kullanıcı Kılavuzu

## 1. İK Kullanıcıları İçin Uçtan Uca Akış

### Adım 1 — Aday kaydı (iki yol)
- **Self-servis:** Aday, ana sayfadaki açık ilana girer (`/ilanlar/<ilan>`), formu doldurur, KVKK açık rızasını onaylar → aday otomatik "Yeni Başvuru" aşamasıyla panoya düşer. Aynı ilana mükerrer başvuru engellenir.
- **İK kaydı:** Adaylar → "Yeni Aday Kaydı". TC girilirse mükerrer kontrol yapılır; mevcut kayıt varsa ona yönlendirilir.

### Adım 2 — Ön inceleme ve pano
İşe Alım Panosu'nda aday kartını sürükleyerek aşama değiştirin (Ön İnceleme → Telefon Görüşmesi → ...). Her taşıma tarih + kullanıcı + not ile kayıt altına alınır; kart üzerinde uygunluk puanı ve test durumu rozetleri görünür.

### Adım 3 — Sınav atama
Sınavlar → "Yeni Sınav Ataması": aday + sınav paketi seçin (ör. Üretim Operatörü = ÇKE Kişilik + Genel Yetenek Üretim), isterseniz son erişim tarihi verin → **Ata ve Kod Üret**. Sistem benzersiz bir erişim kodu üretir (ör. `98-MT5C`) ve başvuruyu otomatik "Test Bekliyor" aşamasına taşır. Kodu adaya SMS/telefonla iletin.

### Adım 4 — Adayın sınavı çözmesi
Aday `/aday` sayfasından kodla girer (şifre gerekmez) → KVKK sınav rızasını onaylar (onaysız test açılmaz) → testleri sırasıyla çözer:
- **Kişilik envanteri:** 3 bölüm, bölüm bazlı süre, sıralı kilit, **soru atlanamaz** (eksik soru uyarısı + işaretleme).
- **Yetenek testi:** 40 soru / 25 dk, tek soru ekranı + soru navigatörü, boş bırakılabilir, süre bitince otomatik teslim. Yanlış götürmez.
- Bağlantı koparsa aday aynı kodla devam eder; gerekirse İK, Sınavlar ekranından **+dk** ile kesinti telafisi verir veya testi **Sıfırla**r.
Tüm testler bitince başvuru otomatik "Test Tamamlandı" aşamasına geçer ve puanlar anında hesaplanır.

### Adım 5 — Mülakat ve saha değerlendirmeleri
Aday sayfası → "Mülakat & Değerlendirmeler → + Planla": tür (İK / Teknik / İSG / Uygulamalı) + değerlendirici + tarih. Değerlendirici kendi "Değerlendirmelerim" ekranından kriter bazlı 1–5 puan ve görüş girer. Yalnızca atanan değerlendirici doldurabilir.

### Adım 6 — Karşılaştırma ve karar
Aday Karşılaştırma → pozisyon seçin: adaylar işe uygunluk puanına göre sıralı; test, kişilik uyumu, riskli boyutlar, mülakat ortalamaları yan yana. Kararı pano üzerinde **Teklif → İşe Alındı** (veya Olumsuz / Yedek Aday) sürüklemesiyle kayıt altına alın. Sistem hiçbir aşamada otomatik karar vermez.

### Adım 7 — Raporlama
Raporlar: huni, test puan dağılımı, pozisyon ortalamaları; **Excel/CSV İndir** ile dışa aktarım (dışa aktarım denetim kaydına yazılır). Aday sayfası → "Değerlendirme Raporu" → **Yazdır / PDF Kaydet** ile kişiye özel rapor.

## 2. Yönetici İşlemleri
- **Organizasyon:** tesis/bölüm/pozisyon ekleme; pozisyon adına tıklayarak profil düzenleme (baraj, norm, yetenek boyutları, kişilik aralıkları, yetkinlikler).
- **Ayarlar (Sistem Yöneticisi):** kullanıcı oluşturma/pasife alma, işe uygunluk ağırlıkları (toplam %100 zorunlu — sistem kontrol eder), denetim kayıtları.
- **Performans:** dönem başlat → çalışan listesinden "Değerlendir" → pozisyonun yetkinlik setiyle amir değerlendirmesi; beklenti altı yetkinlikler gelişim önerisi olarak işaretlenir.

## 3. Roller ve Yetkiler (özet)

| İşlem | Sistem Yön. | İK Yön. | İK Uzm. | Tesis Yön. | Bölüm Yön. | Teknik Değ. | İSG |
|---|---|---|---|---|---|---|---|
| Kullanıcı/ayar yönetimi | ✓ | ağırlıklar | — | — | — | — | — |
| Organizasyon/profil/yetkinlik | ✓ | ✓ | — | — | — | — | — |
| Aday kaydı, pano, sınav atama | ✓ | ✓ | ✓ | — | — | — | — |
| Kendine atanan değerlendirme | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| Karşılaştırma/raporlar | ✓ | ✓ | ✓ | kendi tesisi | kendi tesisi | ✓ | ✓ |
| Performans dönemi | ✓ | ✓ | — | görüntüleme + değerlendirme | değerlendirme | — | — |

## 4. Sık Sorulanlar
- **Aday kodu kaybederse?** Sınavlar ekranında kod her atamanın yanında görünür; tekrar iletebilirsiniz.
- **Aday yanlışlıkla testi bitirirse?** Sınavlar → ilgili test → Sıfırla (cevaplar silinir, denetim kaydına yazılır).
- **Ağırlıklar pozisyona göre değişir mi?** Varsayılan genel set Ayarlar'dadır; veri modeli pozisyon bazlı ağırlığı destekler (ScoreWeight.positionId), pozisyon bazlı arayüz Faz 2 kapsamındadır.
