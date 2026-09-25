import Link from "next/link";
import { notFound } from "next/navigation";import ExamShareCard from "@/components/exam/ExamShareCard";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import RecruitmentProcess from "@/components/candidate/RecruitmentProcess";
type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdayDetay({
  params,
}: Props) {
  const { id } = await params;
const session = await getSession();
  const candidate = await db.candidate.findUnique({
  where: { id },

  include: {
    applications: {
  orderBy: {
    appliedAt: "desc",
  },
  include: {
    vacancy: {
      include: {
        facility: true,
      },
    },
    position: true,

    history: {
      orderBy: {
        createdAt: "desc",
      },
      include: {
        user: true,
      },
    },
  },
},

    documents: {
      orderBy: {
        uploadedAt: "desc",
      },
    },

    consents: {
      orderBy: {
        acceptedAt: "desc",
      },
    },

    assignments: {
      orderBy: {
        createdAt: "desc",
      },

      include: {
        position: true,
        examPackage: true,

        tests: {
          include: {
            testForm: true,
          },
        },
      },
    },
  },
});
  if (!candidate) {
    notFound();
  }

  const assignment =
    candidate.assignments[0] ?? null;
    const application =
  candidate.applications[0] ?? null;
const assignmentCompleted =
  assignment !== null &&
  assignment.tests.length > 0 &&
  assignment.tests.every(
    (test) => test.status === "TAMAMLANDI"
  );

const latestAbilityTest =
  assignment?.tests.find(
    (test) =>
      test.testForm.kind === "YETENEK"
  ) ?? null;

let latestAbilityResult: {
  passed?: boolean;
  result?: string;
} | null = null;

if (
  latestAbilityTest?.status ===
  "TAMAMLANDI"
) {
  try {
    latestAbilityResult =
      JSON.parse(
        latestAbilityTest.resultJson ||
          "{}"
      );
  } catch {
    latestAbilityResult = null;
  }
}

const abilityFailed =
  latestAbilityResult?.passed === false;

const canAssignExam =
  !assignment ||
  (assignmentCompleted &&
    abilityFailed);
    const isRetryExam =
  assignment !== null &&
  assignmentCompleted &&
  abilityFailed;

let retryAvailableAt: Date | null = null;

if (
  isRetryExam &&
  latestAbilityTest?.completedAt
) {
  retryAvailableAt =
    new Date(
      latestAbilityTest.completedAt
    );

  retryAvailableAt.setMonth(
    retryAvailableAt.getMonth() + 3
  );
}

const isEarlyRetry =
  isRetryExam &&
  retryAvailableAt !== null &&
  new Date() < retryAvailableAt;
const cv =
  candidate.documents.find(
    (document) =>
      document.kind === "OZGECMIS"
  ) ?? null;

const kvkkConsent =
  candidate.consents.find(
    (consent) =>
      consent.kind === "KVKK_BASVURU"
  ) ?? null;

const sourceLabels: Record<string, string> = {
  GENEL_BASVURU: "Genel Başvuru",
  ILAN_BASVURU: "İlan Başvurusu",
  IK_KAYIT: "İK Kaydı",
  EXCEL: "Excel",
  REFERANS: "Referans",
};

const educationLabels: Record<string, string> = {
  ILKOKUL: "İlkokul",
  ORTAOKUL: "Ortaokul",
  LISE: "Lise",
  MESLEK_LISESI: "Meslek Lisesi",
  ONLISANS: "Ön Lisans",
  LISANS: "Lisans",
};

const stageLabels: Record<string, string> = {
  YENI_BASVURU: "Yeni Başvuru",
  ON_INCELEME: "Ön İnceleme",
  TELEFON_GORUSMESI: "Telefon Görüşmesi",
  TEST_BEKLIYOR: "Test Bekliyor",
  TEST_TAMAMLANDI: "Test Tamamlandı",
  IK_MULAKATI: "İK Mülakatı",
  TEKNIK_MULAKAT: "Teknik Mülakat",
};
    const positions = await db.position.findMany({
  where: {
    isActive: true,
    examPackageId: {
      not: null,
    },
  },
  include: {
    examPackage: {
      include: {
        tests: {
          orderBy: {
            order: "asc",
          },
          include: {
            testForm: true,
          },
        },
      },
    },
  },
  orderBy: {
    name: "asc",
  },
});

  const abilityTest =
    assignment?.tests.find(
      (test) =>
        test.testForm.kind === "YETENEK"
    ) ?? null;

  const personalityTest =
    assignment?.tests.find(
      (test) =>
        test.testForm.kind === "KISILIK"
    ) ?? null;

  function parseResult(
    value: string | null
  ): any {
    if (!value) {
      return null;
    }

    try {
      return JSON.parse(value);
    } catch {
      return null;
    }
  }

  const abilityResult =
    parseResult(
      abilityTest?.resultJson ?? null
    );

  const personalityResult =
    parseResult(
      personalityTest?.resultJson ?? null
    );

  const dimensions =
    personalityResult?.dimensions
      ? Object.values(
          personalityResult.dimensions
        )
      : [];

  return (
    <main className="container">
      {/* ÜST BÖLÜM */}

      <div style={{ marginBottom: 24 }}>
        <Link
          href="/adaylar"
          className="muted"
        >
          ← Adaylar
        </Link>

        <h1 style={{ marginTop: 12 }}>
          {candidate.firstName}{" "}
          {candidate.lastName}
        </h1>

        <p className="muted">
          Aday Değerlendirme Sonuçları
        </p>
      </div>
      {/* ADAY DOSYASI */}

<div
  className="card"
  style={{
    marginBottom: 22,
    padding: 28,
  }}
>
  <div
    style={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      gap: 20,
      flexWrap: "wrap",
    }}
  >
    <div>
      <div
  className="muted"
  style={{
    fontSize: 13,
    fontWeight: 700,
    letterSpacing: 0.7,
  }}
>
  ADAY DOSYASI
</div>

      <h2
        style={{
          marginTop: 7,
          marginBottom: 5,
        }}
      >
        {candidate.firstName}{" "}
        {candidate.lastName}
      </h2>

      <div className="muted">
        {application?.vacancy?.title ??
          application?.position?.name ??
          "Genel Başvuru"}
      </div>
    </div>

    <span
      style={{
        padding: "7px 12px",
        borderRadius: 999,
        background: "#eef3fb",
        fontSize: 13,
        fontWeight: 700,
      }}
    >
      {sourceLabels[candidate.source] ??
        candidate.source}
    </span>
  </div>

  {/* İLETİŞİM */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 18,
      marginTop: 28,
    }}
  >
    <div>
      <div className="muted">
        Telefon
      </div>
      <strong>
        {candidate.phone || "-"}
      </strong>
    </div>

    <div>
      <div className="muted">
        E-posta
      </div>
      <strong>
        {candidate.email || "-"}
      </strong>
    </div>

    <div>
      <div className="muted">
        Şehir
      </div>
      <strong>
        {candidate.city || "-"}
      </strong>
    </div>

    <div>
      <div className="muted">
        Doğum Tarihi
      </div>
      <strong>
        {candidate.birthDate
          ? candidate.birthDate.toLocaleDateString(
              "tr-TR"
            )
          : "-"}
      </strong>
    </div>
  </div>

  <hr
    style={{
      margin: "26px 0",
      border: 0,
      borderTop: "1px solid #e5e7eb",
    }}
  />

  {/* EĞİTİM / ÇALIŞMA */}
  <div
    style={{
      display: "grid",
      gridTemplateColumns:
        "repeat(auto-fit, minmax(200px, 1fr))",
      gap: 18,
    }}
  >
    <div>
      <div className="muted">
        Eğitim
      </div>
      <strong>
        {candidate.educationLevel
          ? educationLabels[
              candidate.educationLevel
            ] ??
            candidate.educationLevel
          : "-"}
      </strong>
    </div>

    <div>
      <div className="muted">
        Okul / Bölüm
      </div>
      <strong>
        {candidate.schoolDept || "-"}
      </strong>
    </div>

    <div>
      <div className="muted">
        Askerlik
      </div>
      <strong>
        {candidate.militaryStatus || "-"}
      </strong>
    </div>

    <div>
      <div className="muted">
        Vardiyalı Çalışma
      </div>
      <strong>
        {candidate.shiftOk
          ? "Uygun"
          : "Uygun Değil"}
      </strong>
    </div>
  </div>

  {/* BAŞVURU */}
  <div
    style={{
      marginTop: 28,
      padding: 20,
      borderRadius: 12,
      background: "#f8fafc",
      border: "1px solid #e5e7eb",
    }}
  >
    <h3
      style={{
        marginTop: 0,
        marginBottom: 16,
      }}
    >
      Başvuru Bilgileri
    </h3>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 18,
      }}
    >
      <div>
        <div className="muted">
          Başvuru
        </div>
        <strong>
          {application?.vacancy?.title ??
            "Genel Başvuru"}
        </strong>
      </div>

      <div>
        <div className="muted">
          Aşama
        </div>
        <strong>
          {application
            ? stageLabels[
                application.stage
              ] ?? application.stage
            : "-"}
        </strong>
      </div>

      <div>
        <div className="muted">
          Durum
        </div>
        <strong>
          {application?.status ?? "-"}
        </strong>
      </div>

      <div>
        <div className="muted">
          Başvuru Tarihi
        </div>
        <strong>
          {application
            ? application.appliedAt.toLocaleDateString(
                "tr-TR"
              )
            : "-"}
        </strong>
      </div>
    </div>
  </div>

  {/* ÖN YAZI */}
  {candidate.coverLetter && (
    <div
      style={{
        marginTop: 24,
      }}
    >
      <h3>Ön Yazı / Aday Açıklaması</h3>

      <p
        style={{
          lineHeight: 1.7,
          whiteSpace: "pre-line",
        }}
      >
        {candidate.coverLetter}
      </p>
    </div>
  )}

  {/* CV + KVKK */}
  <div
    style={{
      display: "flex",
      alignItems: "center",
      gap: 12,
      flexWrap: "wrap",
      marginTop: 24,
    }}
  >
    {cv ? (
      <a
        href={cv.storedPath}
        target="_blank"
        rel="noreferrer"
        className="button"
        style={{
          textDecoration: "none",
        }}
      >
        CV Görüntüle
      </a>
    ) : (
      <span className="muted">
        CV yüklenmemiş
      </span>
    )}

    <span
      style={{
        padding: "7px 11px",
        borderRadius: 999,
        background: kvkkConsent
          ? "#ecfdf5"
          : "#f3f4f6",
        fontSize: 12,
        fontWeight: 600,
      }}
    >
      {kvkkConsent
        ? "KVKK onayı mevcut"
        : "KVKK kaydı yok"}
    </span>
  </div>
</div>
{application && (
  <RecruitmentProcess
    candidateId={candidate.id}
    initialStage={application.stage}
    initialStatus={application.status}
    initialRejectReason={
      application.rejectReason
    }
  />
)}

{application && application.history.length > 0 && (
  <div
    className="card"
    style={{
      marginBottom: 22,
      padding: 28,
    }}
  >
    <div
      className="muted"
      style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: 0.7,
      }}
    >
      SÜREÇ GEÇMİŞİ
    </div>

    <h2
      style={{
        marginTop: 7,
        marginBottom: 22,
      }}
    >
      İşe Alım Hareketleri
    </h2>

    <div
      style={{
        display: "grid",
        gap: 20,
      }}
    >
      {application.history.map(
        (history) => (
          <div
            key={history.id}
            style={{
              display: "grid",
              gridTemplateColumns:
                "140px 1fr",
              gap: 18,
              paddingBottom: 18,
              borderBottom:
                "1px solid #e5e7eb",
            }}
          >
            <div
              className="muted"
              style={{
                fontSize: 13,
              }}
            >
              {history.createdAt.toLocaleDateString(
                "tr-TR"
              )}

              <div>
                {history.createdAt.toLocaleTimeString(
                  "tr-TR",
                  {
                    hour: "2-digit",
                    minute: "2-digit",
                  }
                )}
              </div>
            </div>

            <div>
              <strong>
                {stageLabels[
                  history.fromStage
                ] ?? history.fromStage}
                {" → "}
                {stageLabels[
                  history.toStage
                ] ?? history.toStage}
              </strong>

              {history.user && (
                <div
                  className="muted"
                  style={{
                    fontSize: 12,
                    marginTop: 5,
                  }}
                >
                  İşlemi yapan:{" "}
                  {history.user.firstName}{" "}
                  {history.user.lastName}
                </div>
              )}

              {history.note && (
                <div
                  style={{
                    marginTop: 8,
                    padding: 10,
                    borderRadius: 8,
                    background: "#f8fafc",
                    fontSize: 14,
                  }}
                >
                  {history.note}
                </div>
              )}
            </div>
          </div>
        )
      )}
    </div>
  </div>
)}
      {/* ADAY ÖZETİ */}

      {assignment && (
        <div
          className="card"
          style={{
            marginBottom: 22,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              gap: 20,
              flexWrap: "wrap",
            }}
          >
            <div>
              <div
                className="muted"
                style={{
                  fontSize: 13,
                  marginBottom: 6,
                }}
              >
                ADAY DEĞERLENDİRME ÖZETİ
              </div>

              <h2 style={{ margin: 0 }}>
                {candidate.firstName}{" "}
                {candidate.lastName}
              </h2>

              <p
                className="muted"
                style={{
                  marginTop: 6,
                }}
              >
                {assignment.position?.name ??
                  "Pozisyon belirtilmemiş"}
              </p>
            </div>

            <div
              style={{
                padding: "8px 14px",
                borderRadius: 999,
                background:
                  assignment.tests.length > 0 &&
                  assignment.tests.every(
                    (test) =>
                      test.status ===
                      "TAMAMLANDI"
                  )
                    ? "#ecfdf5"
                    : "#f3f4f6",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {assignment.tests.length > 0 &&
              assignment.tests.every(
                (test) =>
                  test.status ===
                  "TAMAMLANDI"
              )
                ? "Tüm testler tamamlandı"
                : "Değerlendirme devam ediyor"}
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns:
                "repeat(auto-fit, minmax(210px, 1fr))",
              gap: 14,
              marginTop: 24,
            }}
          >
            {/* Genel Yetenek */}

            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: "#f8fafc",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <div
                className="muted"
                style={{
                  fontSize: 13,
                }}
              >
                Genel Yetenek
              </div>

              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginTop: 5,
                }}
              >
                {abilityTest?.status ===
                "TAMAMLANDI"
                  ? Number(
                      abilityTest.totalScore ??
                        0
                    ).toLocaleString(
                      "tr-TR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )
                  : "-"}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginLeft: 4,
                  }}
                >
                  / 100
                </span>
              </div>

              <div
                className="muted"
                style={{
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                Baraj:{" "}
                {assignment.position
                  ?.cutoffScore ??
                  "-"}
              </div>
            </div>

            {/* ÇKE */}

            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: "#f8fafc",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <div
                className="muted"
                style={{
                  fontSize: 13,
                }}
              >
                ÇKE Profil Karşılaştırması
              </div>

              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginTop: 5,
                }}
              >
                {personalityTest?.status ===
                "TAMAMLANDI"
                  ? Number(
                      personalityResult?.fitPercent ??
                        personalityTest.totalScore ??
                        0
                    ).toLocaleString(
                      "tr-TR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )
                  : "-"}
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    marginLeft: 4,
                  }}
                >
                  %
                </span>
              </div>

              <div
                className="muted"
                style={{
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                Pozisyon hedefleriyle
                karşılaştırma
              </div>
            </div>

            {/* Doğru */}

            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: "#f8fafc",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <div
                className="muted"
                style={{
                  fontSize: 13,
                }}
              >
                Genel Yetenek Doğru
              </div>

              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginTop: 5,
                }}
              >
                {abilityResult?.correct ??
                  "-"}
              </div>

              <div
                className="muted"
                style={{
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                {abilityResult
                  ? `${abilityResult.answered ?? 0} / ${abilityResult.total ?? 0} cevaplandı`
                  : "Sonuç bekleniyor"}
              </div>
            </div>

            {/* Norm */}

            <div
              style={{
                padding: 20,
                borderRadius: 12,
                background: "#f8fafc",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <div
                className="muted"
                style={{
                  fontSize: 13,
                }}
              >
                Pozisyon Norm Puanı
              </div>

              <div
                style={{
                  fontSize: 32,
                  fontWeight: 700,
                  marginTop: 5,
                }}
              >
                {assignment.position
                  ?.normScore ??
                  "-"}
              </div>

              <div
                className="muted"
                style={{
                  marginTop: 6,
                  fontSize: 13,
                }}
              >
                Genel yetenek hedef
                puanı
              </div>
            </div>
          </div>

          {/* Genel Yetenek karşılaştırması */}

          {abilityTest?.status ===
            "TAMAMLANDI" &&
            assignment.position && (
              <div
                style={{
                  marginTop: 18,
                  padding: 16,
                  borderRadius: 10,
                  background: "#f8fafc",
                  border:
                    "1px solid #e5e7eb",
                }}
              >
                <strong>
                  Genel Yetenek – Pozisyon
                  Karşılaştırması
                </strong>

                <p
                  className="muted"
                  style={{
                    marginTop: 6,
                    marginBottom: 0,
                  }}
                >
                  Aday puanı{" "}
                  <strong>
                    {Number(
                      abilityTest.totalScore ??
                        0
                    ).toLocaleString(
                      "tr-TR",
                      {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      }
                    )}
                  </strong>
                  {" / "}
                  Baraj{" "}
                  <strong>
                    {assignment.position.cutoffScore}
                  </strong>
                  {" / "}
                  Norm{" "}
                  <strong>
                    {assignment.position.normScore}
                  </strong>
                </p>
              </div>
            )}
        </div>
      )}
      {/* ADAY / POZİSYON */}

      <div
        className="card"
        style={{
          marginBottom: 22,
        }}
      >
        <h2>Değerlendirme Bilgileri</h2>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 20,
            marginTop: 20,
          }}
        >
          <div>
            <div className="muted">
              Pozisyon
            </div>

            <strong>
              {assignment?.position?.name ??
                "-"}
            </strong>
          </div>

          <div>
            <div className="muted">
              Sınav Paketi
            </div>

            <strong>
              {assignment?.examPackage
                ?.name ?? "-"}
            </strong>
          </div>

          <div>
            <div className="muted">
              Erişim Kodu
            </div>

            <strong>
              {assignment?.accessCode ??
                "-"}
            </strong>
          </div>
        </div>
      </div>

      {canAssignExam && (
  <div
    className="card"
    style={{
      marginBottom: 22,
    }}
  >
    <h2>
  {isRetryExam
    ? "Tekrar Sınavı Ata"
    : "Sınav Ata"}
</h2>

    <p
  className="muted"
  style={{
    marginTop: 8,
    marginBottom: 20,
    lineHeight: 1.6,
  }}
>
  {isRetryExam
    ? "Aday önceki Genel Yetenek sınavında başarısız olduğu için alternatif Genel Yetenek formu ile yeniden değerlendirilecektir."
    : "Adayın değerlendirileceği pozisyonu seçin. Sınav paketi pozisyona göre sistem tarafından otomatik belirlenir."}
</p>

{isRetryExam && latestAbilityTest && (
  <div
    style={{
      marginBottom: 18,
      padding: 16,
      borderRadius: 10,
      background: isEarlyRetry
        ? "#fff7ed"
        : "#ecfdf5",
      border: isEarlyRetry
        ? "1px solid #fed7aa"
        : "1px solid #bbf7d0",
    }}
  >
    <div
      style={{
        fontWeight: 700,
        marginBottom: 8,
      }}
    >
      Önceki Genel Yetenek Sonucu
    </div>

    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(180px, 1fr))",
        gap: 10,
        fontSize: 14,
      }}
    >
      <div>
        <span className="muted">
          Puan
        </span>
        <br />
        <strong>
          {Number(
            latestAbilityTest.totalScore ?? 0
          ).toLocaleString("tr-TR", {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2,
          })}
          /100
        </strong>
      </div>

      <div>
        <span className="muted">
          Sonuç
        </span>
        <br />
        <strong>KALDI</strong>
      </div>

      <div>
        <span className="muted">
          Tekrar hakkı
        </span>
        <br />
        <strong>
          {retryAvailableAt
            ? retryAvailableAt.toLocaleDateString(
                "tr-TR"
              )
            : "-"}
        </strong>
      </div>
    </div>

    {isEarlyRetry && (
      <div
        style={{
          marginTop: 14,
          fontSize: 13,
          lineHeight: 1.6,
        }}
      >
        <strong>
          3 aylık bekleme süresi henüz dolmadı.
        </strong>
        <br />
        Sistem Yöneticisi olarak gerekçe
        girerek erken tekrar sınavı
        atayabilirsiniz.
      </div>
    )}
  </div>
)}

    {positions.length === 0 ? (
      <div
        style={{
          padding: 16,
          borderRadius: 10,
          background: "#fff7ed",
          border: "1px solid #fed7aa",
        }}
      >
        Bu aday için atanabilecek aktif bir
        sınav paketi bulunmuyor.
      </div>
    ) : (
      <form
        action={`/api/adaylar/${candidate.id}/sinav-ata`}
        method="POST"
        style={{
          display: "grid",
          gap: 18,
          maxWidth: 760,
        }}
      >
        <div>
          <label
            htmlFor="positionId"
            style={{
              display: "block",
              marginBottom: 8,
              fontWeight: 600,
            }}
          >
            Pozisyon
          </label>

          {isRetryExam ? (
  <>
    <div
      style={{
        padding: 13,
        borderRadius: 8,
        border: "1px solid #d1d5db",
        background: "#f8fafc",
        fontSize: 15,
      }}
    >
      {assignment?.position?.name ??
        "Pozisyon belirtilmemiş"}
    </div>

    <input
      type="hidden"
      name="positionId"
      value={assignment?.positionId ?? ""}
    />
  </>
) : (
  <select
    id="positionId"
    name="positionId"
    required
    defaultValue=""
    style={{
      width: "100%",
      padding: 13,
      borderRadius: 8,
      border: "1px solid #d1d5db",
      background: "#fff",
      fontSize: 15,
    }}
  >
    <option value="">
      Pozisyon seçiniz
    </option>

    {positions.map((position) => (
      <option
        key={position.id}
        value={position.id}
      >
        {position.name} —{" "}
        {position.examPackage?.name ??
          "Sınav paketi yok"}
      </option>
    ))}
  </select>
)}
        </div>

        <div
          style={{
            padding: 18,
            borderRadius: 10,
            background: "#f8fafc",
            border: "1px solid #e5e7eb",
          }}
        >
          <div
            className="muted"
            style={{
              fontSize: 13,
              marginBottom: 10,
            }}
          >
            POZİSYONLARA BAĞLI SINAV PAKETLERİ
          </div>

          <div
            style={{
              display: "grid",
              gap: 10,
            }}
          >
            {positions.map((position) => (
              <div
                key={position.id}
                style={{
                  display: "flex",
                  justifyContent:
                    "space-between",
                  gap: 20,
                  padding: "10px 0",
                  borderBottom:
                    "1px solid #e5e7eb",
                }}
              >
                <strong>
                  {position.name}
                </strong>

                <span
                  className="muted"
                  style={{
                    textAlign: "right",
                  }}
                >
                  {position.examPackage?.name ??
                    "-"}
                </span>
              </div>
            ))}
          </div>
        </div>
{isEarlyRetry &&
  session?.role ===
    "SISTEM_YONETICISI" && (
    <div>
      <label
        htmlFor="earlyRetryReason"
        style={{
          display: "block",
          marginBottom: 7,
          fontWeight: 600,
        }}
      >
        Erken Tekrar Sınavı Gerekçesi *
      </label>

      <textarea
        id="earlyRetryReason"
        name="earlyRetryReason"
        required
        rows={3}
        placeholder="Erken tekrar sınavı için gerekçeyi yazınız."
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #d1d5db",
          resize: "vertical",
        }}
      />
    </div>
  )}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            marginTop: 4,
          }}
        >
          <button
            type="submit"
            className="button"
          >
            {isRetryExam
  ? "Tekrar Sınavı Ata"
  : "Sınavı Ata"}
          </button>

          <span
            className="muted"
            style={{
              fontSize: 13,
            }}
          >
            {isRetryExam
  ? "Aday için alternatif Genel Yetenek formu ile tekrar sınavı oluşturulur."
  : "Pozisyon seçildiğinde ilgili sınav paketi otomatik atanır."}
          </span>
        </div>
      </form>
    )}
  </div>
)}
{assignment && (
  <ExamShareCard
    candidateName={`${candidate.firstName} ${candidate.lastName}`}
    positionName={
      assignment.position?.name ??
      "Pozisyon belirtilmemiş"
    }
    examPackageName={
      assignment.examPackage?.name ??
      "Sınav paketi"
    }
    accessCode={assignment.accessCode}
  />
)}
      {assignment && (
        <>
          {/* GENEL YETENEK */}

          <div
            className="card"
            style={{
              marginBottom: 22,
            }}
          >
            <h2>Genel Yetenek Testi</h2>

            {!abilityTest ? (
              <p
                className="muted"
                style={{ marginTop: 16 }}
              >
                Genel yetenek testi
                bulunmuyor.
              </p>
            ) : abilityTest.status !==
              "TAMAMLANDI" ? (
              <p
                className="muted"
                style={{ marginTop: 16 }}
              >
                Test henüz
                tamamlanmadı.
              </p>
            ) : (
              <>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns:
                      "repeat(auto-fit, minmax(150px, 1fr))",
                    gap: 14,
                    marginTop: 20,
                  }}
                >
                  <div
                    className="card"
                    style={{ margin: 0 }}
                  >
                    <div className="muted">
                      Puan
                    </div>

                    <div
  style={{
    fontSize: 30,
    fontWeight: 700,
    marginTop: 5,
  }}
>
  {Number(
    abilityTest.totalScore ?? 0
  ).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}
  <span
    style={{
      fontSize: 14,
      fontWeight: 500,
      marginLeft: 5,
    }}
  >
    / 100
  </span>
</div>
                  </div>

                  <div
                    className="card"
                    style={{ margin: 0 }}
                  >
                    <div className="muted">
                      Doğru
                    </div>

                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 700,
                        marginTop: 5,
                      }}
                    >
                      {abilityResult?.correct ??
                        "-"}
                    </div>
                  </div>

                  <div
                    className="card"
                    style={{ margin: 0 }}
                  >
                    <div className="muted">
                      Yanlış
                    </div>

                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 700,
                        marginTop: 5,
                      }}
                    >
                      {abilityResult
                        ? (abilityResult.total ??
                            0) -
                          (abilityResult.correct ??
                            0) -
                          (abilityResult.blank ??
                            0)
                        : "-"}
                    </div>
                  </div>

                  <div
                    className="card"
                    style={{ margin: 0 }}
                  >
                    <div className="muted">
                      Boş
                    </div>

                    <div
                      style={{
                        fontSize: 30,
                        fontWeight: 700,
                        marginTop: 5,
                      }}
                    >
                      {abilityResult?.blank ??
                        "-"}
                    </div>
                  </div>
                </div>

                {abilityResult
                  ?.dimensionScores && (
                  <div
                    style={{
                      marginTop: 28,
                    }}
                  >
                    <h3>
                      Yetenek Boyutları
                    </h3>
<div
  style={{
    marginTop: 18,
    marginBottom: 28,
    display: "grid",
    gap: 14,
  }}
>
  {Object.entries(
    abilityResult.dimensionScores
  ).map(([dimension, score]) => {
    const numericScore = Number(score);

    return (
      <div
        key={dimension}
        style={{
          display: "grid",
          gridTemplateColumns:
            "170px 1fr 75px",
          gap: 16,
          alignItems: "center",
          padding: "14px 16px",
          border: "1px solid #e5e7eb",
          borderRadius: 10,
          background: "#fff",
        }}
      >
        <strong>
  {{
    SAYISAL: "Sayısal",
    SOZEL: "Sözel",
    SOYUT: "Soyut",
    DIKKAT: "Dikkat",
    MEKANIK: "Mekanik",
  }[dimension] ?? dimension}
</strong>

        <div
          style={{
            position: "relative",
            height: 14,
            background: "#e5e7eb",
            borderRadius: 999,
            overflow: "hidden",
          }}
        >
          <div
            style={{
              width: `${Math.max(
                0,
                Math.min(100, numericScore)
              )}%`,
              height: "100%",
              background: "#1e3a8a",
              borderRadius: 999,
            }}
          />
        </div>

        <strong
          style={{
            textAlign: "right",
          }}
        >
          {numericScore.toLocaleString(
            "tr-TR",
            {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            }
          )}
          %
        </strong>
      </div>
    );
  })}
</div>
                    <div
  style={{
    display: "grid",
    gridTemplateColumns:
      "repeat(auto-fit, minmax(150px, 1fr))",
    gap: 14,
    marginTop: 24,
  }}
>
  <div
    style={{
      padding: 16,
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      background: "#f8fafc",
    }}
  >
    <div className="muted">
      Cevaplanma
    </div>

    <strong
      style={{
        display: "block",
        fontSize: 22,
        marginTop: 6,
      }}
    >
      %
      {Number(
        abilityResult?.answeredPercent ?? 0
      ).toLocaleString("tr-TR", {
        maximumFractionDigits: 1,
      })}
    </strong>
  </div>

  <div
    style={{
      padding: 16,
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      background: "#f8fafc",
    }}
  >
    <div className="muted">
      Baraj
    </div>

    <strong
      style={{
        display: "block",
        fontSize: 22,
        marginTop: 6,
      }}
    >
      {abilityResult?.cutoffScore ?? "-"}
    </strong>
  </div>

  <div
    style={{
      padding: 16,
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      background: "#f8fafc",
    }}
  >
    <div className="muted">
      Pozisyon Normu
    </div>

    <strong
      style={{
        display: "block",
        fontSize: 22,
        marginTop: 6,
      }}
    >
      {abilityResult?.normScore ?? "-"}
    </strong>
  </div>

  <div
    style={{
      padding: 16,
      border: "1px solid #e5e7eb",
      borderRadius: 10,
      background:
        abilityResult?.passed
          ? "#ecfdf5"
          : "#fef2f2",
    }}
  >
    <div className="muted">
      Sonuç
    </div>

    <strong
      style={{
        display: "block",
        fontSize: 22,
        marginTop: 6,
      }}
    >
      {abilityResult?.result ??
        (abilityResult?.passed
          ? "GEÇTİ"
          : "KALDI")}
    </strong>
  </div>
</div>
                  </div>
                )}
              </>
            )}
          </div>

          {/* ÇKE */}

          <div className="card">
            <h2>
              ÇKE — Çimko Kişilik
              Envanteri
            </h2>

            {!personalityTest ? (
              <p
                className="muted"
                style={{ marginTop: 16 }}
              >
                Kişilik envanteri
                bulunmuyor.
              </p>
            ) : personalityTest.status !==
              "TAMAMLANDI" ? (
              <p
                className="muted"
                style={{ marginTop: 16 }}
              >
                Envanter henüz
                tamamlanmadı.
              </p>
            ) : (
              <>
                <div
                  style={{
                    marginTop: 20,
                    padding: 22,
                    borderRadius: 12,
                    background:
                      "#f4f6fb",
                  }}
                >
                  <div className="muted">
                    Pozisyon Profili Uyum
                    Göstergesi
                  </div>

                  <div
                    style={{
                      fontSize: 38,
                      fontWeight: 700,
                      marginTop: 6,
                    }}
                  >
                    %
{Number(
  personalityResult?.fitPercent ??
    personalityTest.totalScore ??
    0
).toLocaleString("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
})}
                  </div>

                  <p
                    className="muted"
                    style={{
                      marginTop: 10,
                    }}
                  >
                    Bu gösterge adayın
                    kişilik boyutlarının
                    pozisyon için tanımlanan
                    hedef aralıklarla
                    örtüşme düzeyini
                    göstermektedir.
                  </p>
                </div>

                <div
                  style={{
                    marginTop: 28,
                  }}
                >
                  <h3>
                    Kişilik Boyutları
                  </h3>
<div
  style={{
    marginTop: 18,
    marginBottom: 30,
    border: "1px solid #e5e7eb",
    borderRadius: 12,
    overflow: "hidden",
    background: "#fff",
  }}
>
  {dimensions.map((dimension: any, index: number) => {
    const minScale = 2;
    const maxScale = 10;

    const score = Number(dimension.score);
    const targetMin = Number(dimension.minValue);
    const targetMax = Number(dimension.maxValue);

    const toPercent = (value: number) =>
      Math.max(
        0,
        Math.min(
          100,
          ((value - minScale) /
            (maxScale - minScale)) *
            100
        )
      );

    const scorePosition = toPercent(score);
    const targetStart = toPercent(targetMin);
    const targetEnd = toPercent(targetMax);
    const targetWidth = targetEnd - targetStart;

    return (
      <div
        key={dimension.code}
        style={{
          display: "grid",
          gridTemplateColumns: "190px 1fr 90px 150px",
          gap: 18,
          alignItems: "center",
          minHeight: 76,
          padding: "12px 18px",
          borderBottom:
            index < dimensions.length - 1
              ? "1px solid #e5e7eb"
              : "none",
        }}
      >
        {/* Boyut */}

        <div>
          <strong>
            {dimension.name}
          </strong>

          <div
            className="muted"
            style={{
              fontSize: 12,
              marginTop: 3,
            }}
          >
            Hedef:{" "}
            {targetMin.toLocaleString("tr-TR")}
            {" – "}
            {targetMax.toLocaleString("tr-TR")}
          </div>
        </div>

        {/* Ölçek */}

        <div>
          <div
            style={{
              position: "relative",
              height: 26,
            }}
          >
            <div
              style={{
                position: "absolute",
                left: 0,
                right: 0,
                top: 9,
                height: 7,
                background: "#e5e7eb",
                borderRadius: 999,
              }}
            />

            <div
              style={{
                position: "absolute",
                left: `${targetStart}%`,
                width: `${targetWidth}%`,
                top: 6,
                height: 13,
                background: "#c7d2fe",
                border: "1px solid #818cf8",
                borderRadius: 999,
              }}
            />

            <div
              title={`Aday puanı: ${score}`}
              style={{
                position: "absolute",
                left: `${scorePosition}%`,
                top: 1,
                width: 23,
                height: 23,
                borderRadius: "50%",
                background: dimension.inRange
                  ? "#1e3a8a"
                  : "#b45309",
                border: "3px solid #fff",
                boxShadow:
                  "0 1px 4px rgba(0,0,0,.25)",
                transform: "translateX(-50%)",
              }}
            />
          </div>

          <div
            className="muted"
            style={{
              display: "flex",
              justifyContent: "space-between",
              fontSize: 11,
            }}
          >
            <span>2</span>
            <span>10</span>
          </div>
        </div>

        {/* Aday puanı */}

        <div
          style={{
            textAlign: "center",
          }}
        >
          <strong
            style={{
              fontSize: 18,
            }}
          >
            {score.toLocaleString("tr-TR", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </strong>

          <div
            className="muted"
            style={{
              fontSize: 11,
            }}
          >
            Aday puanı
          </div>
        </div>

        {/* Karşılaştırma */}

        <div
          style={{
            fontSize: 13,
            fontWeight: 600,
          }}
        >
          {dimension.inRange
            ? "Hedef aralıkta"
            : "Hedef aralık dışında"}
        </div>
      </div>
    );
  })}
</div>
                  <table
                    style={{
                      marginTop: 12,
                    }}
                  >
                    <thead>
                      <tr>
                        <th>Boyut</th>
                        <th>
                          Aday Puanı
                        </th>
                        <th>
                          Hedef Aralık
                        </th>
                        <th>Hedef Aralık Karşılaştırması</th>
                      </tr>
                    </thead>

                    <tbody>
                      {dimensions.map(
                        (
                          dimension: any
                        ) => (
                          <tr
                            key={
                              dimension.code
                            }
                          >
                            <td>
                              <strong>
                                {
                                  dimension.name
                                }
                              </strong>
                            </td>

                            <td>
                              {Number(
                                dimension.score
                              ).toFixed(
                                2
                              )}
                            </td>

                            <td>
                              {dimension.minValue ??
                                "-"}
                              {" – "}
                              {dimension.maxValue ??
                                "-"}
                            </td>

                            <td>
                              {dimension.inRange
                                ? "Hedef aralıkta"
                                : "Hedef aralık dışında"}
                            </td>
                          </tr>
                        )
                      )}
                    </tbody>
                  </table>
                </div>

                {personalityResult
                  ?.outsideRange
                  ?.length > 0 && (
                  <div
                    style={{
                      marginTop: 28,
                      padding: 20,
                      border:
                        "1px solid #e5e7eb",
                      borderRadius: 12,
                    }}
                  >
                    <h3>
                      Mülakatta
                      İncelenebilecek
                      Boyutlar
                    </h3>

                    <p
                      className="muted"
                      style={{
                        marginTop: 8,
                      }}
                    >
                      Aşağıdaki boyutlar
                      pozisyon için
                      tanımlanan hedef
                      aralığın dışındadır.
                      Bu sonuç tek başına
                      işe alım kararı
                      değildir.
                    </p>

                    <div
                      style={{
                        marginTop: 14,
                      }}
                    >
                      {personalityResult.outsideRange.map(
                        (
                          item: any
                        ) => (
                          <div
                            key={
                              item.code
                            }
                            style={{
                              padding:
                                "9px 0",
                              borderBottom:
                                "1px solid #eee",
                            }}
                          >
                            <strong>
                              {
                                item.name
                              }
                            </strong>

                            {" — "}

                            Aday:{" "}
                            {Number(
                              item.score
                            ).toFixed(
                              2
                            )}

                            {" | "}

                            Hedef:{" "}
                            {
                              item.minValue
                            }
                            –
                            {
                              item.maxValue
                            }
                          </div>
                        )
                      )}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </>
      )}
    </main>
  );
}