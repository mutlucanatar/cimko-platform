import Link from "next/link";

export default function YeniAdayPage() {
  return (
    <main className="container">
      <div style={{ marginBottom: 24 }}>
        <Link href="/adaylar" className="muted">
          ← Adaylar
        </Link>

        <h1 style={{ marginTop: 12 }}>
          Yeni Aday
        </h1>

        <p className="muted">
          Aday havuzuna yeni aday kaydı oluşturun.
        </p>
      </div>

      <div className="card">
        <form
          action="/api/adaylar"
          method="POST"
          style={{
            display: "grid",
            gap: 24,
            maxWidth: 900,
          }}
        >
          <div>
            <h2>Temel Bilgiler</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <div>
                <label
                  htmlFor="firstName"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Ad *
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  required
                  autoComplete="given-name"
                  placeholder="Örn. Ahmet"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Soyad *
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  required
                  autoComplete="family-name"
                  placeholder="Örn. Yılmaz"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="nationalId"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  T.C. Kimlik No
                </label>

                <input
                  id="nationalId"
                  name="nationalId"
                  inputMode="numeric"
                  maxLength={11}
                  placeholder="11 haneli"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="birthDate"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Doğum Tarihi
                </label>

                <input
                  id="birthDate"
                  name="birthDate"
                  type="date"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="gender"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Cinsiyet
                </label>

                <select
                  id="gender"
                  name="gender"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    background: "#fff",
                  }}
                >
                  <option value="">
                    Seçiniz
                  </option>
                  <option value="ERKEK">
                    Erkek
                  </option>
                  <option value="KADIN">
                    Kadın
                  </option>
                  <option value="BELIRTMEK_ISTEMIYOR">
                    Belirtmek istemiyorum
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="city"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Şehir
                </label>

                <input
                  id="city"
                  name="city"
                  placeholder="Gaziantep"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <h2>İletişim Bilgileri</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <div>
                <label
                  htmlFor="phone"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Telefon
                </label>

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="05xx xxx xx xx"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="email"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  E-posta
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  placeholder="ornek@mail.com"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div
                style={{
                  gridColumn: "1 / -1",
                }}
              >
                <label
                  htmlFor="address"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Adres
                </label>

                <textarea
                  id="address"
                  name="address"
                  rows={3}
                  placeholder="Adres bilgisi"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    resize: "vertical",
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <h2>Eğitim ve Mesleki Bilgiler</h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <div>
                <label
                  htmlFor="educationLevel"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Eğitim Seviyesi
                </label>

                <select
                  id="educationLevel"
                  name="educationLevel"
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    background: "#fff",
                  }}
                >
                  <option value="">
                    Seçiniz
                  </option>
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
                    Önlisans
                  </option>
                  <option value="LISANS">
                    Lisans
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="schoolDept"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Bölüm / Branş
                </label>

                <input
                  id="schoolDept"
                  name="schoolDept"
                  placeholder="Elektrik, Makine vb."
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="driverLicense"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Ehliyet
                </label>

                <input
                  id="driverLicense"
                  name="driverLicense"
                  placeholder="B, C, CE vb."
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="militaryStatus"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Askerlik Durumu
                </label>

                <input
                  id="militaryStatus"
                  name="militaryStatus"
                  placeholder="Yapıldı / Tecilli / Muaf"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                  }}
                />
              </div>
            </div>
          </div>

          <div>
            <h2>Başvuru Bilgileri</h2>

            <div
              style={{
                display: "grid",
                gap: 16,
                marginTop: 18,
              }}
            >
              <div>
                <label
                  htmlFor="source"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Aday Kaynağı
                </label>

                <select
                  id="source"
                  name="source"
                  defaultValue="IK_KAYIT"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    background: "#fff",
                  }}
                >
                  <option value="IK_KAYIT">
                    İK Kaydı
                  </option>

                  <option value="ILAN_BASVURU">
                    İlan Başvurusu
                  </option>

                  <option value="GENEL_BASVURU">
                    Genel Başvuru
                  </option>

                  <option value="EXCEL">
                    Excel Aktarımı
                  </option>

                  <option value="REFERANS">
                    Referans
                  </option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="coverLetter"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Aday Açıklaması
                </label>

                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={4}
                  placeholder="Aday hakkında kısa açıklama veya başvuru notu"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border: "1px solid #ccc",
                    resize: "vertical",
                  }}
                />
              </div>

              <label
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 9,
                  cursor: "pointer",
                }}
              >
                <input
                  type="checkbox"
                  name="shiftOk"
                  defaultChecked
                />
                Vardiyalı çalışmaya uygun
              </label>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
              paddingTop: 8,
              borderTop: "1px solid #e5e7eb",
            }}
          >
            <button
              type="submit"
              className="button"
              style={{
                marginTop: 16,
              }}
            >
              Adayı Kaydet
            </button>

            <Link
              href="/adaylar"
              className="muted"
              style={{
                marginTop: 16,
              }}
            >
              Vazgeç
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}