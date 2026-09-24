import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
  searchParams: Promise<{
    basvuru?: string;
  }>;
};

export default async function IlanDetay({
  params,
  searchParams,
}: Props) {
  const { slug } = await params;
  const { basvuru } = await searchParams;

  const vacancy = await db.vacancy.findUnique({
    where: {
      slug,
    },
    include: {
      facility: true,
      position: true,
    },
  });

  if (!vacancy || vacancy.status !== "ACIK") {
    notFound();
  }

  const success =
    basvuru === "basarili";

  const error =
    basvuru === "hata";

  return (
    <main className="container">
      <div
        style={{
          maxWidth: 1000,
          margin: "45px auto 80px",
        }}
      >
        <Link
          href="/#pozisyonlar"
          className="muted"
        >
          ← Açık Pozisyonlar
        </Link>

        {/* İLAN ÜST BÖLÜMÜ */}
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
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {vacancy.facility.name}
          </div>

          <h1
            style={{
              marginTop: 10,
              marginBottom: 8,
            }}
          >
            {vacancy.title}
          </h1>

          <div
            style={{
              display: "flex",
              gap: 24,
              flexWrap: "wrap",
              marginTop: 18,
            }}
          >
            <div>
              <div
                className="muted"
                style={{ fontSize: 13 }}
              >
                Lokasyon
              </div>

              <strong>
                {vacancy.facility.city}
              </strong>
            </div>

            <div>
              <div
                className="muted"
                style={{ fontSize: 13 }}
              >
                Pozisyon
              </div>

              <strong>
                {vacancy.position.name}
              </strong>
            </div>
          </div>

          <hr
            style={{
              margin: "30px 0",
              border: 0,
              borderTop:
                "1px solid #e5e7eb",
            }}
          />

          {/* İLAN HAKKINDA */}
          <section>
            <h2>İlan Hakkında</h2>

            <p
              style={{
                lineHeight: 1.8,
                whiteSpace: "pre-line",
                marginTop: 14,
              }}
            >
              {vacancy.description ||
                "Pozisyon hakkında detaylı bilgi paylaşılacaktır."}
            </p>
          </section>

          {/* NİTELİKLER */}
          <section
            style={{
              marginTop: 36,
            }}
          >
            <h2>Aranan Nitelikler</h2>

            <p
              style={{
                lineHeight: 1.8,
                whiteSpace: "pre-line",
                marginTop: 14,
              }}
            >
              {vacancy.requirements ||
                "Aranan nitelikler ayrıca belirtilecektir."}
            </p>
          </section>
        </div>

        {/* BAŞVURU */}
        <div
          className="card"
          style={{
            marginTop: 24,
            padding: 38,
          }}
        >
          <div
            style={{
              maxWidth: 700,
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
              Kariyer Fırsatı
            </div>

            <h2
              style={{
                fontSize: 32,
                marginTop: 8,
              }}
            >
              Bu Pozisyona Başvur
            </h2>

            <p
              className="muted"
              style={{
                lineHeight: 1.6,
                marginTop: 8,
              }}
            >
              Aşağıdaki bilgileri doldurarak
              başvurunuzu Çimko İnsan Kaynakları'na
              iletebilirsiniz.
            </p>
          </div>

          {success && (
            <div
              style={{
                marginTop: 24,
                padding: 18,
                borderRadius: 10,
                background: "#ecfdf5",
                border:
                  "1px solid #a7f3d0",
                color: "#065f46",
              }}
            >
              <strong>
                Başvurunuz başarıyla alındı.
              </strong>

              <div style={{ marginTop: 5 }}>
                İlginiz için teşekkür ederiz.
                Başvurunuz İnsan Kaynakları
                tarafından değerlendirilecektir.
              </div>
            </div>
          )}

          {error && (
            <div
              style={{
                marginTop: 24,
                padding: 18,
                borderRadius: 10,
                background: "#fef2f2",
                border:
                  "1px solid #fecaca",
                color: "#991b1b",
              }}
            >
              Başvuru sırasında bir hata oluştu.
              Lütfen bilgilerinizi kontrol ederek
              tekrar deneyin.
            </div>
          )}

          {!success && (
            <form
              action="/api/basvurular"
              method="POST"
              encType="multipart/form-data"
              style={{
                display: "grid",
                gap: 18,
                marginTop: 28,
              }}
            >
              <input
                type="hidden"
                name="vacancyId"
                value={vacancy.id}
              />

              <input
                type="hidden"
                name="slug"
                value={vacancy.slug}
              />

              {/* AD SOYAD */}
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
                    type="text"
                    required
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
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
                    type="text"
                    required
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                    }}
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
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    E-posta *
                  </label>

                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    Telefon *
                  </label>

                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    required
                    placeholder="05XX XXX XX XX"
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                    }}
                  />
                </div>
              </div>

              {/* KİŞİSEL BİLGİLER */}
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
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                    }}
                  />
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
                    type="text"
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                    }}
                  />
                </div>

                <div>
                  <label
                    htmlFor="educationLevel"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    Eğitim Durumu
                  </label>

                  <select
                    id="educationLevel"
                    name="educationLevel"
                    defaultValue=""
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
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
                      Ön Lisans
                    </option>
                    <option value="LISANS">
                      Lisans
                    </option>
                  </select>
                </div>
              </div>

              {/* OKUL / BÖLÜM */}
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
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    Okul / Bölüm
                  </label>

                  <input
                    id="schoolDept"
                    name="schoolDept"
                    type="text"
                    placeholder="Örn. Makine Teknolojisi"
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
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
                    type="text"
                    placeholder="Örn. B, C, D"
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                    }}
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
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    Askerlik Durumu
                  </label>

                  <select
                    id="militaryStatus"
                    name="militaryStatus"
                    defaultValue=""
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                      background: "#fff",
                    }}
                  >
                    <option value="">
                      Seçiniz
                    </option>
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
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    Vardiyalı Çalışma
                  </label>

                  <select
                    id="shiftOk"
                    name="shiftOk"
                    defaultValue="true"
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
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
                  style={{
                    width: "100%",
                    padding: 13,
                    borderRadius: 8,
                    border:
                      "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* ÖN YAZI */}
              <div>
                <label
                  htmlFor="coverLetter"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Ön Yazı / Kendiniz Hakkında
                </label>

                <textarea
                  id="coverLetter"
                  name="coverLetter"
                  rows={6}
                  placeholder="Kendiniz, deneyimleriniz ve bu pozisyona başvuru motivasyonunuz hakkında kısaca bilgi verebilirsiniz."
                  style={{
                    width: "100%",
                    padding: 13,
                    borderRadius: 8,
                    border:
                      "1px solid #d1d5db",
                    resize: "vertical",
                  }}
                />
              </div>

              {/* CV */}
              <div>
                <label
                  htmlFor="cv"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Özgeçmiş / CV
                </label>

                <input
                  id="cv"
                  name="cv"
                  type="file"
                  accept=".pdf,.doc,.docx"
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border:
                      "1px solid #d1d5db",
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
                  PDF, DOC veya DOCX.
                  Maksimum 5 MB.
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
                  border:
                    "1px solid #e5e7eb",
                }}
              >
                <input
                  type="checkbox"
                  name="consent"
                  value="true"
                  required
                  style={{
                    marginTop: 3,
                  }}
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
                  marginTop: 8,
                }}
              >
                <button
                  type="submit"
                  className="button"
                  style={{
                    padding:
                      "13px 28px",
                    fontWeight: 700,
                  }}
                >
                  Başvuruyu Gönder
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}