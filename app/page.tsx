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
{/* ÇİMKO'YU KEŞFET */}
<section
  style={{
    background: "#ffffff",
    borderTop: "1px solid #e5e7eb",
  }}
>
  <div
    className="container"
    style={{
      paddingTop: 70,
      paddingBottom: 70,
    }}
  >
    <div
      style={{
        maxWidth: 760,
        marginBottom: 36,
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
        Çimko'yu Keşfet
      </div>

      <h2
        style={{
          fontSize: 36,
          marginTop: 8,
          marginBottom: 12,
        }}
      >
        Gücümüzü üretimden,
        geleceğimizi insandan alıyoruz.
      </h2>

      <p
        className="muted"
        style={{
          fontSize: 17,
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        Çimento ve hazır beton sektöründeki
        güçlü üretim yapımızla Türkiye'nin
        farklı bölgelerinde faaliyet gösteriyor;
        çalışanlarımızla birlikte büyüyor ve
        geleceği inşa ediyoruz.
      </p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(190px, 1fr))",
        gap: 16,
      }}
    >
      {[
        [
          "3",
          "Entegre Çimento Fabrikası",
          "Narlı, Adıyaman ve Bartın",
        ],
        [
          "1",
          "Öğütme Tesisi",
          "Üretim ağımızın önemli bir parçası",
        ],
        [
          "40",
          "Hazır Beton Tesisi",
          "Geniş operasyon ağı",
        ],
        [
          "13",
          "İlde Operasyon",
          "Türkiye'nin farklı bölgelerinde",
        ],
      ].map(([number, title, text]) => (
        <div
          key={title}
          className="card"
          style={{
            padding: 26,
            minHeight: 175,
          }}
        >
          <div
            style={{
              fontSize: 42,
              fontWeight: 800,
              color: "#1e3a8a",
              lineHeight: 1,
            }}
          >
            {number}
          </div>

          <h3
            style={{
              marginTop: 14,
              marginBottom: 7,
              fontSize: 18,
            }}
          >
            {title}
          </h3>

          <p
            className="muted"
            style={{
              margin: 0,
              lineHeight: 1.5,
              fontSize: 14,
            }}
          >
            {text}
          </p>
        </div>
      ))}
    </div>
  </div>
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
    "İnsan",
    "Çalışanlarımızın gelişimini, birlikte başarmayı ve güçlü ekip kültürünü önemsiyoruz.",
  ],
  [
    "Sürdürülebilirlik",
    "Bugünün ihtiyaçlarını karşılarken gelecek nesillere karşı sorumluluğumuzu gözetiyoruz.",
  ],
  [
    "Kalite",
    "Üretimden hizmete tüm süreçlerimizde yüksek kaliteyi ve sürekli gelişimi hedefliyoruz.",
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

      {/* GENÇ YETENEKLER */}
<section
  id="gencimko"
  className="container"
  style={{
    paddingTop: 72,
    paddingBottom: 72,
  }}
>
  <div
    style={{
      maxWidth: 760,
      marginBottom: 34,
    }}
  >
    <div
      style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 1,
        color: "#1e3a8a",
        textTransform: "uppercase",
      }}
    >
      Genç Yetenekler
    </div>

    <h2
      style={{
        fontSize: 36,
        marginTop: 8,
        marginBottom: 12,
      }}
    >
      Kariyer yolculuğun Çimko&apos;da başlasın.
    </h2>

    <p
      className="muted"
      style={{
        fontSize: 17,
        lineHeight: 1.7,
        margin: 0,
      }}
    >
      Öğrencilerin ve genç yeteneklerin iş
      hayatını yakından tanımalarını, sahada
      deneyim kazanmalarını ve gelişimlerini
      destekliyoruz.
    </p>
  </div>

  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 20,
    }}
  >
    {/* GENÇimko */}
    <div
      className="card"
      style={{
        padding: 34,
        display: "flex",
        flexDirection: "column",
        minHeight: 390,
        background:
          "linear-gradient(145deg, #eff6ff 0%, #ffffff 70%)",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          padding: "7px 11px",
          borderRadius: 999,
          background: "#dbeafe",
          color: "#1e3a8a",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.6,
        }}
      >
        YAZ STAJ PROGRAMI
      </div>

      <h3
        style={{
          fontSize: 30,
          marginTop: 22,
          marginBottom: 6,
        }}
      >
        GENÇimko
      </h3>

      <p
        style={{
          fontSize: 19,
          fontWeight: 600,
          marginTop: 0,
        }}
      >
        Üretimin merkezinde öğren.
      </p>

      <p
        className="muted"
        style={{
          lineHeight: 1.7,
          fontSize: 15,
        }}
      >
        Üniversite öğrencilerinin Çimko&apos;nun
        çalışma ortamını yakından tanıdığı,
        teorik bilgilerini sahada deneyimleme
        fırsatı bulduğu yaz staj programımız.
      </p>

      <div
        style={{
          display: "grid",
          gap: 10,
          marginTop: 12,
        }}
      >
        {[
          "Gerçek iş ortamında deneyim",
          "Saha ve üretim süreçlerini tanıma",
          "Profesyonellerle birlikte öğrenme",
          "Kariyer yolculuğuna güçlü bir başlangıç",
        ].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              gap: 9,
              alignItems: "flex-start",
              fontSize: 14,
            }}
          >
            <span
              style={{
                color: "#1e3a8a",
                fontWeight: 800,
              }}
            >
              ✓
            </span>

            <span>{item}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 26,
        }}
      >
        <Link
          href="/genel-basvuru"
          className="btn secondary"
          style={{
            display: "inline-block",
          }}
        >
          GENÇimko&apos;yu Keşfet
        </Link>
      </div>
    </div>

    {/* GENÇimko+ */}
    <div
      className="card"
      style={{
        padding: 34,
        display: "flex",
        flexDirection: "column",
        minHeight: 390,
        background:
          "linear-gradient(145deg, #15254d 0%, #20386f 100%)",
        color: "#ffffff",
      }}
    >
      <div
        style={{
          display: "inline-flex",
          alignSelf: "flex-start",
          padding: "7px 11px",
          borderRadius: 999,
          background: "rgba(255,255,255,0.14)",
          fontSize: 12,
          fontWeight: 800,
          letterSpacing: 0.6,
        }}
      >
        YETENEK PROGRAMI
      </div>

      <h3
        style={{
          fontSize: 30,
          marginTop: 22,
          marginBottom: 6,
        }}
      >
        GENÇimko+
      </h3>

      <p
        style={{
          fontSize: 19,
          fontWeight: 600,
          marginTop: 0,
        }}
      >
        Deneyimden kariyere.
      </p>

      <p
        style={{
          lineHeight: 1.7,
          fontSize: 15,
          opacity: 0.86,
        }}
      >
        Eylül–Haziran dönemini kapsayan uzun
        soluklu yetenek programımızla genç
        yetenekler gerçek projelerde sorumluluk
        alırken mentor desteğiyle gelişimlerini
        sürdürüyor.
      </p>

      <div
        style={{
          display: "grid",
          gap: 10,
          marginTop: 12,
        }}
      >
        {[
          "Eylül – Haziran program dönemi",
          "Gerçek projelerde sorumluluk",
          "Mentor desteği",
          "İş deneyimi ve kariyer gelişimi",
        ].map((item) => (
          <div
            key={item}
            style={{
              display: "flex",
              gap: 9,
              alignItems: "flex-start",
              fontSize: 14,
            }}
          >
            <span
              style={{
                fontWeight: 800,
              }}
            >
              ✓
            </span>

            <span>{item}</span>
          </div>
        ))}
      </div>

      <div
        style={{
          marginTop: "auto",
          paddingTop: 26,
        }}
      >
        <Link
          href="/genel-basvuru"
          className="btn"
          style={{
            display: "inline-block",
          }}
        >
          GENÇimko+&apos;ı Keşfet
        </Link>
      </div>
    </div>
  </div>
</section>
{/* ÜRETİMİN KALBİNDE ÖĞRENME */}
<section
  style={{
    background: "#f8fafc",
    borderTop: "1px solid #e5e7eb",
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
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(300px, 1fr))",
        gap: 44,
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
            textTransform: "uppercase",
          }}
        >
          Üniversite – Sanayi İş Birliği
        </div>

        <h2
          style={{
            fontSize: 36,
            lineHeight: 1.15,
            marginTop: 9,
            marginBottom: 16,
          }}
        >
          Üretimin Kalbinde Öğrenme
        </h2>

        <p
          className="muted"
          style={{
            fontSize: 17,
            lineHeight: 1.75,
            margin: 0,
          }}
        >
          Üniversite öğrencilerini üretim
          tesislerimizde ağırlayarak çimento
          üretim süreçlerini sahada
          deneyimlemelerine ve sektör
          profesyonelleriyle bir araya
          gelmelerine fırsat sunuyoruz.
        </p>
      </div>

      <div
        className="card"
        style={{
          padding: 30,
          background: "#ffffff",
        }}
      >
        {[
          [
            "01",
            "Üretimi Tanı",
            "Hammadde hazırlamadan klinker ve çimento üretimine kadar süreci yerinde gör.",
          ],
          [
            "02",
            "Sahayı Deneyimle",
            "Paketleme, sevkiyat ve üretim operasyonlarının gerçek çalışma ortamını keşfet.",
          ],
          [
            "03",
            "Profesyonellerle Buluş",
            "Alanında deneyimli Çimko çalışanlarından sektör ve kariyer hakkında bilgi edin.",
          ],
        ].map(([number, title, text], index) => (
          <div
            key={title}
            style={{
              display: "grid",
              gridTemplateColumns: "46px 1fr",
              gap: 14,
              padding:
                index === 0
                  ? "0 0 20px"
                  : "20px 0",
              borderBottom:
                index === 2
                  ? "none"
                  : "1px solid #e5e7eb",
            }}
          >
            <div
              style={{
                fontSize: 13,
                fontWeight: 800,
                color: "#1e3a8a",
              }}
            >
              {number}
            </div>

            <div>
              <strong
                style={{
                  fontSize: 17,
                }}
              >
                {title}
              </strong>

              <p
                className="muted"
                style={{
                  marginTop: 6,
                  marginBottom: 0,
                  lineHeight: 1.6,
                  fontSize: 14,
                }}
              >
                {text}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>

{/* SOSYAL ETKİ */}
<section
  className="container"
  style={{
    paddingTop: 72,
    paddingBottom: 72,
  }}
>
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(300px, 1fr))",
      gap: 24,
    }}
  >
    <div
      style={{
        padding: "12px 10px 12px 0",
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
        Sosyal Etki
      </div>

      <h2
        style={{
          fontSize: 36,
          marginTop: 8,
          marginBottom: 14,
        }}
      >
        Birlikte üretiyor,
        <br />
        birlikte değer yaratıyoruz.
      </h2>

      <p
        className="muted"
        style={{
          fontSize: 17,
          lineHeight: 1.75,
          margin: 0,
        }}
      >
        Faaliyet gösterdiğimiz bölgelerde
        eğitim, gençlerin gelişimi ve toplumsal
        faydayı destekleyen çalışmalarla
        bulunduğumuz çevreye değer katmayı
        önemsiyoruz.
      </p>
    </div>

    <div
      className="card"
      style={{
        padding: 32,
        background:
          "linear-gradient(145deg, #eef3fb 0%, #ffffff 100%)",
      }}
    >
      <div
        style={{
          width: 48,
          height: 48,
          borderRadius: 12,
          background: "#1e3a8a",
          color: "#ffffff",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontWeight: 800,
          marginBottom: 20,
        }}
      >
        +
      </div>

      <h3
        style={{
          fontSize: 23,
          marginBottom: 10,
        }}
      >
        Geleceğe Yatırım
      </h3>

      <p
        className="muted"
        style={{
          lineHeight: 1.7,
          marginBottom: 0,
        }}
      >
        Gençlerin öğrenme, üretme ve
        yeteneklerini geliştirme fırsatlarına
        erişimini destekleyen sosyal
        sorumluluk çalışmalarında yer alıyoruz.
      </p>
    </div>
  </div>
</section>

{/* YAN HAKLAR */}
<section
  style={{
    background: "#f8fafc",
    borderTop: "1px solid #e5e7eb",
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
        textAlign: "center",
        maxWidth: 720,
        margin: "0 auto 36px",
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
        Çimko&apos;da Yaşam
      </div>

      <h2
  style={{
    fontSize: 36,
    marginTop: 8,
    marginBottom: 12,
  }}
>
  Çimko&apos;da Seni Neler Bekliyor?
</h2>

      <p
  className="muted"
  style={{
    fontSize: 17,
    lineHeight: 1.7,
    margin: 0,
  }}
>
  Öğrenebileceğin, gelişebileceğin, farklı
  deneyimler kazanabileceğin ve geleceğin
  üretim dünyasına katkı sağlayabileceğin
  bir kariyer ortamı.
</p>
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(210px, 1fr))",
        gap: 14,
      }}
    >
      {[
  [
    "Sanko Akademi",
    "Online eğitimlerle sürekli öğrenme ve gelişim",
  ],
  [
    "Kariyer & Gelişim",
    "Yetkinliklerini geliştir, kariyer yolculuğunu şekillendir",
  ],
  [
    "Rotasyon & Deneyim",
    "Farklı görev ve süreçlerde deneyim kazan",
  ],
  [
    "Sağlık & İyi Oluş",
    "Özel sağlık sigortası ve çalışan destekleri",
  ],
  [
    "Sürdürülebilir Gelecek",
    "Düşük karbonlu üretim ve dönüşümün parçası ol",
  ],
  [
    "Sosyal Etki",
    "Topluma değer katan projelerde yer al",
  ],
].map(([title, text]) => (
        <div
          key={title}
          className="card"
          style={{
            padding: 24,
            minHeight: 145,
          }}
        >
          <div
            style={{
              width: 36,
              height: 4,
              borderRadius: 999,
              background: "#1e3a8a",
              marginBottom: 18,
            }}
          />

          <h3
            style={{
              marginTop: 0,
              marginBottom: 7,
              fontSize: 17,
            }}
          >
            {title}
          </h3>

          <p
            className="muted"
            style={{
              margin: 0,
              fontSize: 14,
              lineHeight: 1.55,
            }}
          >
            {text}
          </p>
        </div>
      ))}
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