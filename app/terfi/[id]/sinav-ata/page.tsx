import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const PROMOTION_EXAMS = [
  {
    current: "Yeni Üretim Elemanı",
    target: "Üretim Operatörü",
    formA: "GY-TRF-URT-A",
    formB: "GY-TRF-URT-B",
  },
  {
    current: "Elektrik Bakım Elemanı",
    target: "Elektrik Bakım Ustası",
    formA: "GY-TRF-ELE-A",
    formB: "GY-TRF-ELE-B",
  },
  {
    current: "Mekanik Bakım Elemanı",
    target: "Mekanik Bakım Ustası",
    formA: "GY-TRF-MEK-A",
    formB: "GY-TRF-MEK-B",
  },
  {
    current: "Laboratuvar İşçisi",
    target: "Laborant",
    formA: "GY-TRF-KAL-A",
    formB: "GY-TRF-KAL-B",
  },
];

export default async function PromotionExamAssignPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const request =
    await db.promotionRequest.findUnique({
      where: {
        id,
      },
      include: {
        currentPosition: true,
        targetPosition: true,
        promotionPeriod: true,
        exams: {
          orderBy: {
            createdAt: "desc",
          },
          include: {
            tests: {
              include: {
                testForm: true,
              },
            },
          },
        },
      },
    });

  if (!request) {
    notFound();
  }

  const latestExam =
    request.exams[0] ?? null;

  const examConfig =
    PROMOTION_EXAMS.find(
      (item) =>
        item.current ===
          request.currentPosition.name &&
        item.target ===
          request.targetPosition.name
    );

  const firstForm =
    examConfig
      ? await db.testForm.findUnique({
          where: {
            code: examConfig.formA,
          },
        })
      : null;

  const cke =
    await db.testForm.findUnique({
      where: {
        code: "CKE-01",
      },
    });

  const canAssign =
    latestExam === null &&
    examConfig !== undefined &&
    firstForm !== null &&
    cke !== null;

  return (
    <main className="container">
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <Link
          href={`/terfi/${request.id}`}
          className="muted"
        >
          ← Terfi Talebine Dön
        </Link>

        <div
          className="muted"
          style={{
            marginTop: 18,
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          Mavi Yaka Terfi
        </div>

        <h1
          style={{
            marginTop: 7,
            marginBottom: 8,
          }}
        >
          Terfi Sınavı Ata
        </h1>

        <p
          className="muted"
          style={{
            margin: 0,
          }}
        >
          {request.employeeFirstName}{" "}
          {request.employeeLastName} · Sicil{" "}
          {request.sicilNo}
        </p>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(320px, 1fr))",
          gap: 18,
        }}
      >
        <div className="card">
          <h2>Terfi Bilgileri</h2>

          <div
            style={{
              marginTop: 18,
              display: "grid",
              gap: 17,
            }}
          >
            <Info
              label="Çalışan"
              value={`${request.employeeFirstName} ${request.employeeLastName}`}
            />

            <Info
              label="Sicil No"
              value={request.sicilNo}
            />

            <Info
              label="Lokasyon / Fabrika"
              value={
                request.facilityName || "-"
              }
            />

            <Info
              label="Mevcut Ünvan"
              value={
                request.currentPosition.name
              }
            />

            <Info
              label="Hedef Ünvan"
              value={
                request.targetPosition.name
              }
            />

            <Info
              label="Terfi Dönemi"
              value={
                request.promotionPeriod.name
              }
            />
          </div>
        </div>

        <div className="card">
          <h2>Atanacak Sınav</h2>

          {latestExam ? (
            <div
              style={{
                marginTop: 18,
                padding: 18,
                borderRadius: 10,
                background: "#f8fafc",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <strong>
                Bu terfi talebine ait sınav
                zaten atanmış.
              </strong>

              <p
                className="muted"
                style={{
                  marginBottom: 0,
                }}
              >
                Önceki sınav kaydını kontrol
                ediniz.
              </p>
            </div>
          ) : !examConfig ? (
            <div
              style={{
                marginTop: 18,
                padding: 18,
                borderRadius: 10,
                background: "#fff7ed",
                border:
                  "1px solid #fed7aa",
              }}
            >
              <strong>
                Bu terfi yolu için sınav
                tanımlanmamış.
              </strong>

              <p
                className="muted"
                style={{
                  marginBottom: 0,
                }}
              >
                Önce ilgili Genel Yetenek
                sınav formlarını oluşturmanız
                gerekiyor.
              </p>
            </div>
          ) : !firstForm || !cke ? (
            <div
              style={{
                marginTop: 18,
                padding: 18,
                borderRadius: 10,
                background: "#fff7ed",
                border:
                  "1px solid #fed7aa",
              }}
            >
              <strong>
                Sınav formu eksik.
              </strong>

              <p
                className="muted"
                style={{
                  marginBottom: 0,
                }}
              >
                Genel Yetenek veya ÇKE formu
                bulunamadı.
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  marginTop: 18,
                  padding: 18,
                  borderRadius: 10,
                  background: "#f8fafc",
                  border:
                    "1px solid #e5e7eb",
                }}
              >
                <div
                  style={{
                    fontWeight: 700,
                    fontSize: 18,
                    marginBottom: 14,
                  }}
                >
                  İlk Terfi Sınavı
                </div>

                <div
                  style={{
                    display: "grid",
                    gap: 10,
                  }}
                >
                  <ExamRow
                    label="Genel Yetenek"
                    value={
                      firstForm.name
                    }
                    code={
                      firstForm.code
                    }
                  />

                  <ExamRow
                    label="Kişilik"
                    value={
                      cke.name
                    }
                    code="CKE-01"
                  />
                </div>
              </div>

              <div
                style={{
                  marginTop: 18,
                  padding: 15,
                  borderRadius: 9,
                  background:
                    "#eff6ff",
                  border:
                    "1px solid #bfdbfe",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                <strong>
                  Terfi sınavı kuralı
                </strong>

                <div
                  style={{
                    marginTop: 6,
                  }}
                >
                  İlk sınavda Form A
                  kullanılacaktır. Aday başarısız
                  olursa bir sonraki terfi
                  döneminde alternatif Form B
                  uygulanacaktır.
                </div>
              </div>

              <form
                action={`/api/terfi/${request.id}/sinav-ata`}
                method="POST"
                style={{
                  marginTop: 22,
                }}
              >
                <button
                  type="submit"
                  className="btn"
                  style={{
                    width: "100%",
                  }}
                >
                  Terfi Sınavını Ata
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </main>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <div
        className="muted"
        style={{
          fontSize: 12,
          marginBottom: 6,
        }}
      >
        {label}
      </div>

      <strong>{value}</strong>
    </div>
  );
}

function ExamRow({
  label,
  value,
  code,
}: {
  label: string;
  value: string;
  code: string;
}) {
  return (
    <div
      style={{
        display: "flex",
        justifyContent:
          "space-between",
        gap: 14,
        alignItems: "center",
        padding:
          "12px 13px",
        border:
          "1px solid #e5e7eb",
        borderRadius: 8,
        background: "#fff",
      }}
    >
      <div>
        <div
          className="muted"
          style={{
            fontSize: 12,
            marginBottom: 4,
          }}
        >
          {label}
        </div>

        <strong>{value}</strong>
      </div>

      <span
        style={{
          fontSize: 12,
          fontWeight: 700,
          padding:
            "5px 8px",
          borderRadius: 999,
          background:
            "#f1f5f9",
        }}
      >
        {code}
      </span>
    </div>
  );
}