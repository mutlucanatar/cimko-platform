import Link from "next/link";

type Props = {
  searchParams: Promise<{
    basvuru?: string;
  }>;
};

export default async function GenelBasvuru({
  searchParams,
}: Props) {
  const { basvuru } = await searchParams;

  const success = basvuru === "basarili";
  const error = basvuru === "hata";

  const inputStyle = {
    width: "100%",
    padding: 13,
    borderRadius: 8,
    border: "1px solid #d1d5db",
  };

  const labelStyle = {
    display: "block",
    marginBottom: 7,
    fontWeight: 600,
  };

  return (
    <main className="container">
      <div
        style={{
          maxWidth: 1000,
          margin: "45px auto 80px",
        }}
      >
        <Link href="/" className="muted">
          ← Çimko Kariyer
        </Link>

        <div
          className="card"
          style={{
            marginTop: 20,
            padding: 38,
          }}
        >
          <div
            className="muted"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 1,
              textTransform: "uppercase",
            }}
          >
            Çimko Yetenek Havuzu
          </div>

          <h1
            style={{
              fontSize: 38,
              marginTop: 8,
              marginBottom: 12,
            }}
          >
            Genel Başvuru
          </h1>

          <p
            className="muted"
            style={{
              fontSize: 17,
              lineHeight: 1.7,
              maxWidth: 760,
            }}
          >
            Açık pozisyonlarımız arasında size uygun
            bir fırsat bulamadıysanız özgeçmişinizi
            bizimle paylaşabilirsiniz. Genel
            başvurunuz, uygun kariyer fırsatları
            oluştuğunda Çimko İnsan Kaynakları
            tarafından değerlendirilecektir.
          </p>

          {success && (
            <div
              style={{
                marginTop: 26,
                padding: 20,
                borderRadius: 10,
                background: "#ecfdf5",
                border: "1px solid #a7f3d0",
                color: "#065f46",
              }}
            >
              <strong>
                Genel başvurunuz başarıyla alındı.
              </strong>

              <div style={{ marginTop: 6 }}>
                Çimko'ya gösterdiğiniz ilgi için
                teşekkür ederiz. Profiliniz uygun
                kariyer fırsatlarında
                değerlendirilecektir.
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 26,
                padding: 20,
                borderRadius: 10,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
              }}
            >
              Başvurunuz kaydedilemedi. Lütfen
              bilgilerinizi kontrol ederek tekrar
              deneyin.
            </div>
          )}

          {!success && (
            <form
              action="/api/genel-basvuru"
              method="POST"
              encType="multipart/form-data"
              style={{
                display: "grid",
                gap: 20,
                marginTop: 32,
              }}
            >
              {/* AD / SOYAD */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    htmlFor="firstName"
                    style={labelStyle}
                  >
                    Ad *
                  </label>

                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="lastName"
                    style={labelStyle}
                  >
                    Soyad *
                  </label>

                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    required
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* İLETİŞİM */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    htmlFor="email"
                    style={labelStyle}
                  >
                    E-posta *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    style={labelStyle}
                  >
                    Telefon *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* DOĞUM / ŞEHİR / EĞİTİM */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(220px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    htmlFor="birthDate"
                    style={labelStyle}
                  >
                    Doğum Tarihi
                  </label>

                  <input
                    id="birthDate"
                    name="birthDate"
                    type="date"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="city"
                    style={labelStyle}
                  >
                    Şehir
                  </label>

                  <input
                    id="city"
                    name="city"
                    type="text"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="educationLevel"
                    style={labelStyle}
                  >
                    Eğitim Durumu
                  </label>

                  <select
                    id="educationLevel"
                    name="educationLevel"
                    defaultValue=""
                    style={{
                      ...inputStyle,
                      background: "#fff",
                    }}
                  >
                    <option value="">Seçiniz</option>
                    <option value="ILKOKUL">
                      İlkokul
                    </option>
                    <option value="ORTAOKUL">
                      Ortaokul
                    </option>
                    <option value="LISE">
                      Lise
                    </option>
                    <option value="MESLEK_LISESI">
                      Meslek Lisesi
                    </option>
                    <option value="ONLISANS">
                      Ön Lisans
                    </option>
                    <option value="LISANS">
                      Lisans
                    </option>
                  </select>
                </div>
              </div>

              {/* OKUL / EHLİYET */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    htmlFor="schoolDept"
                    style={labelStyle}
                  >
                    Okul / Bölüm
                  </label>

                  <input
                    id="schoolDept"
                    name="schoolDept"
                    type="text"
                    style={inputStyle}
                  />
                </div>

                <div>
                  <label
                    htmlFor="driverLicense"
                    style={labelStyle}
                  >
                    Ehliyet
                  </label>

                  <input
                    id="driverLicense"
                    name="driverLicense"
                    type="text"
                    placeholder="Örn. B, C, D"
                    style={inputStyle}
                  />
                </div>
              </div>

              {/* ASKERLİK / VARDİYA */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    htmlFor="militaryStatus"
                    style={labelStyle}
                  >
                    Askerlik Durumu
                  </label>

                  <select
                    id="militaryStatus"
                    name="militaryStatus"
                    defaultValue=""
                    style={{
                      ...inputStyle,
                      background: "#fff",
                    }}
                  >
                    <option value="">Seçiniz</option>
                    <option value="YAPILDI">
                      Yapıldı
                    </option>
                    <option value="MUAF">
                      Muaf
                    </option>
                    <option value="TECILLI">
                      Tecilli
                    </option>
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="shiftOk"
                    style={labelStyle}
                  >
                    Vardiyalı Çalışma
                  </label>

                  <select
                    id="shiftOk"
                    name="shiftOk"
                    defaultValue="true"
                    style={{
                      ...inputStyle,
                      background: "#fff",
                    }}
                  >
                    <option value="true">
                      Uygun
                    </option>
                    <option value="false">
                      Uygun değil
                    </option>
                  </select>
                </div>
              </div>

              {/* ADRES */}
              <div>
                <label
                  htmlFor="address"
                  style={labelStyle}
                >
                  Adres
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* ÖN YAZI */}
              <div>
                <label
                  htmlFor="coverLetter"
                  style={labelStyle}
                >
                  Kendiniz Hakkında
                </label>

                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={6}
                  placeholder="Deneyiminiz, ilgi alanlarınız ve Çimko'da değerlendirilmek istediğiniz çalışma alanları hakkında kısaca bilgi verebilirsiniz."
                  style={{
                    ...inputStyle,
                    resize: "vertical",
                  }}
                />
              </div>

              {/* CV */}
              <div>
                <label
                  htmlFor="cv"
                  style={labelStyle}
                >
                  Özgeçmiş / CV
                </label>

                <input
                  id="cv"
                  name="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{
                    ...inputStyle,
                    background: "#fff",
                  }}
                />

                <div
                  className="muted"
                  style={{
                    fontSize: 12,
                    marginTop: 6,
                  }}
                >
                  PDF, DOC veya DOCX. Maksimum 5 MB.
                </div>
              </div>

              {/* KVKK */}
              <label
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: 16,
                  borderRadius: 10,
                  background: "#f8fafc",
                  border: "1px solid #e5e7eb",
                }}
              >
                <input
                  type="checkbox"
                  name="consent"
                  value="true"
                  required
                  style={{ marginTop: 3 }}
                />

                <span
                  style={{
                    fontSize: 14,
                    lineHeight: 1.5,
                  }}
                >
                  Kişisel verilerimin iş başvurusu
                  kapsamında işlenmesine ilişkin
                  aydınlatma metnini okudum ve kabul
                  ediyorum. *
                </span>
              </label>

              <div
                style={{
                  display: "flex",
                  justifyContent: "flex-end",
                }}
              >
                <button
                  type="submit"
                  className="button"
                  style={{
                    padding: "13px 28px",
                    fontWeight: 700,
                  }}
                >
                  Genel Başvuruyu Gönder
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}