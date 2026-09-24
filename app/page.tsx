import Link from "next/link";
import { db } from "@/lib/prisma";

export default async function Home() {
  const vacancies = await db.vacancy.findMany({
    where: {
      status: "ACIK",
    },
    orderBy: {
      publishedAt: "desc",
    },
    take: 6,
    include: {
      facility: true,
    },
  });

  return (
    <main>
      {/* HERO */}
      <section
        style={{
          background:
            "linear-gradient(135deg, #eef3fb 0%, #f8fafc 55%, #ffffff 100%)",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          className="container"
          style={{
            paddingTop: 72,
            paddingBottom: 72,
          }}
        >
          <div
            style={{
              maxWidth: 800,
            }}
          >
            <div
              style={{
                display: "inline-block",
                padding: "7px 12px",
                borderRadius: 999,
                background: "#e8eefc",
                color: "#1e3a8a",
                fontSize: 13,
                fontWeight: 700,
                marginBottom: 18,
              }}
            >
              ÇİMKO KARİYER
            </div>

            <h1
              style={{
                fontSize: "clamp(38px, 6vw, 68px)",
                lineHeight: 1.05,
                margin: 0,
                letterSpacing: "-1.5px",
              }}
            >
              Geleceğini
              <br />
              Çimko ile İnşa Et.
            </h1>

            <p
              className="muted"
              style={{
                fontSize: 20,
                lineHeight: 1.6,
                maxWidth: 680,
                marginTop: 22,
              }}
            >
              Çimento, hazır beton, enerji ve sürdürülebilirlik
              alanlarında büyüyen Çimko ailesinin bir parçası olun.
              Kariyeriniz için yeni fırsatları keşfedin.
            </p>

            <div
              style={{
                display: "flex",
                gap: 12,
                flexWrap: "wrap",
                marginTop: 30,
              }}
            >
              <a
                href="#pozisyonlar"
                className="btn"
              >
                Açık Pozisyonları İncele
              </a>

              <Link
                href="/genel-basvuru"
                className="btn secondary"
              >
                Genel Başvuru
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* AÇIK POZİSYONLAR */}
      <section
        id="pozisyonlar"
        className="container"
        style={{
          paddingTop: 62,
          paddingBottom: 62,
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "end",
            gap: 20,
            flexWrap: "wrap",
            marginBottom: 28,
          }}
        >
          <div>
            <div
              className="muted"
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform: "uppercase",
              }}
            >
              Kariyer Fırsatları
            </div>

            <h2
              style={{
                fontSize: 34,
                marginTop: 8,
                marginBottom: 8,
              }}
            >
              Açık Pozisyonlar
            </h2>

            <p
              className="muted"
              style={{
                margin: 0,
              }}
            >
              Size uygun kariyer fırsatını keşfedin.
            </p>
          </div>

          <div
            style={{
              fontSize: 14,
              fontWeight: 600,
            }}
          >
            {vacancies.length} açık pozisyon
          </div>
        </div>

        {vacancies.length === 0 ? (
          <div
            className="card"
            style={{
              padding: 32,
              textAlign: "center",
            }}
          >
            <h3>Şu anda açık pozisyon bulunmuyor.</h3>
            <p
              className="muted"
              style={{
                marginTop: 8,
              }}
            >
              Genel başvurunuzu bırakarak kariyer
              fırsatlarımızdan haberdar olabilirsiniz.
            </p>

            <div style={{ marginTop: 20 }}>
              <Link
                href="/genel-basvuru"
                className="btn"
              >
                Genel Başvuru
              </Link>
            </div>
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 18,
            }}
          >
            {vacancies.map((vacancy) => (
              <article
                key={vacancy.id}
                className="card"
                style={{
                  display: "flex",
                  flexDirection: "column",
                  minHeight: 250,
                  transition:
                    "transform 0.15s ease",
                }}
              >
                <div
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 12,
                    background: "#eef3fb",
                    color: "#1e3a8a",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontWeight: 800,
                    marginBottom: 18,
                  }}
                >
                  Ç
                </div>

                <div
                  className="muted"
                  style={{
                    fontSize: 13,
                    fontWeight: 600,
                  }}
                >
                  {vacancy.facility.name}
                </div>

                <h3
                  style={{
                    marginTop: 7,
                    marginBottom: 8,
                    fontSize: 22,
                    lineHeight: 1.2,
                  }}
                >
                  {vacancy.title}
                </h3>

                <p
                  className="muted"
                  style={{
                    lineHeight: 1.5,
                    margin: 0,
                  }}
                >
                  {vacancy.facility.city}
                </p>

                <div
                  style={{
                    marginTop: "auto",
                    paddingTop: 24,
                  }}
                >
                  <Link
                    href={`/ilanlar/${vacancy.slug}`}
                    style={{
                      fontWeight: 700,
                      color: "#1e3a8a",
                      textDecoration: "none",
                    }}
                  >
                    İlanı İncele →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {/* ÇİMKO'DA ÇALIŞMAK */}
      <section
  id="cimkoda-yasam"
  style={{
    background: "#f8fafc",
          borderTop: "1px solid #e5e7eb",
          borderBottom: "1px solid #e5e7eb",
        }}
      >
        <div
          className="container"
          style={{
            paddingTop: 64,
            paddingBottom: 64,
          }}
        >
          <div
            style={{
              maxWidth: 720,
              marginBottom: 32,
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
              Çimko'da Yaşam
            </div>

            <h2
              style={{
                fontSize: 34,
                marginTop: 8,
              }}
            >
              Çimko'da Çalışmak
            </h2>

            <p
              className="muted"
              style={{
                fontSize: 17,
                lineHeight: 1.7,
              }}
            >
              İşimizi güvenli, sürdürülebilir ve sürekli
              gelişen bir çalışma kültürüyle birlikte
              büyütüyoruz.
            </p>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(220px, 1fr))",
              gap: 16,
            }}
          >
            {[
              [
                "Gelişim",
                "Kariyer yolculuğunuzu destekleyen gelişim ve öğrenme fırsatları.",
              ],
              [
                "Takım",
                "Farklı uzmanlıkların bir araya geldiği güçlü ekipler.",
              ],
              [
                "Güvenlik",
                "İş sağlığı ve güvenliğini çalışma kültürümüzün merkezinde tutuyoruz.",
              ],
              [
                "Sürdürülebilirlik",
                "Daha sürdürülebilir bir gelecek için bugünden çalışıyoruz.",
              ],
            ].map(([title, text]) => (
              <div
                key={title}
                className="card"
                style={{
                  minHeight: 170,
                }}
              >
                <h3>{title}</h3>
                <p
                  className="muted"
                  style={{
                    lineHeight: 1.6,
                  }}
                >
                  {text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GENÇimko */}
      <section
  id="gencimko"
  className="container"
        style={{
          paddingTop: 64,
          paddingBottom: 64,
        }}
      >
        <div
          className="card"
          style={{
            padding: 38,
            background:
              "linear-gradient(135deg, #eff6ff 0%, #ffffff 100%)",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(280px, 1fr))",
              gap: 35,
              alignItems: "center",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 700,
                  letterSpacing: 1,
                  color: "#1e3a8a",
                }}
              >
                GENÇimko
              </div>

              <h2
                style={{
                  fontSize: 34,
                  marginTop: 8,
                  marginBottom: 12,
                }}
              >
                Kariyer yolculuğun
                genç yaşta başlasın.
              </h2>

              <p
                className="muted"
                style={{
                  lineHeight: 1.7,
                  fontSize: 16,
                }}
              >
                Yaz stajı ve yetenek programlarımızla
                öğrencileri ve yeni mezunları Çimko
                dünyasıyla buluşturuyoruz.
              </p>

              <Link
                href="/genel-basvuru"
                className="btn"
                style={{
                  display: "inline-block",
                  marginTop: 12,
                }}
              >
                Başvurular Hakkında
              </Link>
            </div>

            <div
              style={{
                display: "grid",
                gap: 12,
              }}
            >
              {[
                "Yaz Dönemi Staj Programı",
                "Yetenek Programı",
                "Mentorluk",
                "Kariyer Gelişimi",
              ].map((item) => (
                <div
                  key={item}
                  style={{
                    padding: "14px 16px",
                    border:
                      "1px solid #dbe4f0",
                    borderRadius: 10,
                    background: "#ffffff",
                    fontWeight: 600,
                  }}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ALT CTA */}
      <section
        style={{
          background: "#15254d",
          color: "#ffffff",
        }}
      >
        <div
          className="container"
          style={{
            paddingTop: 56,
            paddingBottom: 56,
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontSize: 34,
              margin: 0,
            }}
          >
            Çimko ailesine katılmaya hazır mısınız?
          </h2>

          <p
            style={{
              marginTop: 12,
              opacity: 0.85,
              fontSize: 17,
            }}
          >
            Açık pozisyonlarımızı inceleyin veya
            genel başvurunuzu bırakın.
          </p>

          <div
            style={{
              marginTop: 24,
              display: "flex",
              justifyContent: "center",
              gap: 12,
              flexWrap: "wrap",
            }}
          >
            <a
              href="#pozisyonlar"
              className="btn"
            >
              Açık Pozisyonlar
            </a>

            <Link
              href="/genel-basvuru"
              className="btn secondary"
            >
              Genel Başvuru
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}