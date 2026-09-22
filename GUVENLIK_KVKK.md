# Güvenlik ve KVKK Kontrol Listesi

## Uygulananlar (MVP)

- [x] **Parola güvenliği:** bcrypt (cost 10) ile saklama; min. 8 karakter politikası (kullanıcı oluşturmada)
- [x] **Oturum:** imzalı JWT (HS256), HTTPOnly + SameSite=Lax çerez, 8 saat personel / 6 saat aday oturumu; üretimde `secure` bayrağı otomatik
- [x] **Rol bazlı erişim:** her sayfa ve server action `requireUser(roller)` ile korunur; aday uçları ayrı aday oturumu ile izole
- [x] **Kapsam kısıtı:** tesis yöneticisi yalnızca kendi tesisinin verilerini görür (`facilityScope`); değerlendirme formlarını yalnızca atanan değerlendirici doldurabilir
- [x] **Sınav güvenliği:** doğru cevap anahtarı ve madde yön bilgisi istemciye gönderilmez; süre sunucu tarafında (`sectionDeadline`) doğrulanır; erişim kodları benzersiz ve tahmine dirençli alfabeyle üretilir; süresi dolan kod reddedilir
- [x] **KVKK:** başvuru ve sınav için ayrı açık rıza kaydı (metin sürümü + zaman damgası); rıza olmadan test başlatılamaz; sağlık/teşhis verisi toplayan soru türleri örnek içerikten çıkarılmıştır; iyi oluş taraması karar puanına katılmaz
- [x] **Denetim kaydı:** giriş/başarısız giriş, aşama taşıma, sınav sıfırlama, süre uzatma, puanlama, dışa aktarım, kullanıcı/ayar değişiklikleri `AuditLog`'a yazılır
- [x] **Ayrımcılık önleme:** cinsiyet/yaş puanlamaya girmez; puanlama formülleri panelden görülebilir ve denetlenebilir; sistem otomatik işe alım/ret kararı vermez (tüm ekranlarda uyarı metni)
- [x] **Girdi doğrulama:** Zod şemaları + Prisma parametreli sorgular (SQL injection'a kapalı); React varsayılan kaçışlama (XSS); server action'lar Next.js origin kontrolüne tabidir
- [x] **Dışa aktarım izleme:** CSV indirmeleri kullanıcı kimliğiyle loglanır

## Üretime Geçmeden Tamamlanması Gerekenler

- [ ] HTTPS zorunluluğu (ters proxy + HSTS) ve `SESSION_SECRET` rotasyonu
- [ ] Çok faktörlü kimlik doğrulama (TOTP) ve Microsoft Entra ID / AD SSO entegrasyonu
- [ ] Parola sıfırlama akışı (e-posta ile) ve hesap kilitleme (art arda başarısız giriş)
- [ ] Oran sınırlama (aday kod girişi ve login uçlarında brute-force koruması) + CAPTCHA
- [ ] Alan düzeyi şifreleme (TC kimlik no gibi hassas kolonlar için)
- [ ] Veri saklama/imha politikası: işe alınmayan aday verilerinin süre sonunda anonimleştirilmesi (zamanlanmış görev)
- [ ] KVKK veri sahibi talep yönetimi ekranı (erişim/silme talepleri)
- [ ] Dosya yükleme modülü açılırken: uzantı/MIME doğrulama, boyut limiti, virüs taraması, imzalı URL ile erişim
- [ ] Yedekleme-geri yükleme prosedürü (PostgreSQL PITR) ve felaket kurtarma testi
- [ ] Sızma testi ve bağımlılık taraması (npm audit / SCA) süreci
