import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PromotionDetailPage({
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

  const latestExam = request.exams[0] ?? null;

  const statusLabels: Record<
    string,
    string
  > = {
    TALEP: "Talep",
    SINAV_ATANDI: "Sınav Atandı",
    SINAVDA: "Sınavda",
    BASARILI: "Başarılı",
    KALDI: "Başarısız",
    IPTAL: "İptal",
  };

  const examStatusLabels: Record<
    string,
    string
  > = {
    ATANMADI: "Atanmadı",
    DEVAM_EDIYOR: "Devam Ediyor",
    TAMAMLANDI: "Tamamlandı",
  };

  return (
    <main className="container">
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <Link
          href="/terfi"
          className="muted"
        >
          ← Terfi Talepleri
        </Link>

        <div
          style={{
            display: "flex",
            justifyContent:
              "space-between",
            alignItems: "flex-start",
            gap: 20,
            marginTop: 12,
          }}
        >
          <div>
            <div
              className="muted"
              style={{
                fontSize: 13,
                fontWeight: 700,
                letterSpacing: 1,
                textTransform:
                  "uppercase",
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
              Terfi Talebi
            </h1>

            <p
              className="muted"
              style={{
                margin: 0,
              }}
            >
              {
                request.employeeFirstName
              }{" "}
              {
                request.employeeLastName
              }{" "}
              · Sicil{" "}
              {request.sicilNo}
            </p>
          </div>

          <StatusBadge
            status={request.status}
            labels={statusLabels}
          />
        </div>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(300px, 1fr))",
          gap: 18,
        }}
      >
        <div className="card">
          <h2>Çalışan Bilgileri</h2>

          <InfoGrid>
            <Info
              label="Ad Soyad"
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
          </InfoGrid>
        </div>

        <div className="card">
          <h2>Terfi Bilgileri</h2>

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
              className="muted"
              style={{
                fontSize: 12,
                marginBottom: 7,
              }}
            >
              Mevcut Ünvan
            </div>

            <strong>
              {request.currentPosition.name}
            </strong>

            <div
              style={{
                fontSize: 22,
                margin: "12px 0",
                color: "#64748b",
              }}
            >
              ↓
            </div>

            <div
              className="muted"
              style={{
                fontSize: 12,
                marginBottom: 7,
              }}
            >
              Hedef Ünvan
            </div>

            <strong
              style={{
                fontSize: 18,
              }}
            >
              {request.targetPosition.name}
            </strong>
          </div>

          <InfoGrid>
            <Info
              label="Terfi Dönemi"
              value={
                request
                  .promotionPeriod
                  .name
              }
            />
          </InfoGrid>
        </div>

        <div className="card">
          <h2>Talep Bilgileri</h2>

          <InfoGrid>
            <Info
              label="Talep Eden Amir"
              value={
                request.requesterName
              }
            />

            <Info
              label="Talep Tarihi"
              value={formatDate(
                request.requestDate
              )}
            />
          </InfoGrid>

          <div
            style={{
              marginTop: 20,
            }}
          >
            <div
              className="muted"
              style={{
                fontSize: 12,
                marginBottom: 7,
              }}
            >
              Terfi Talebi Gerekçesi
            </div>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.65,
              }}
            >
              {request.reason || "-"}
            </div>
          </div>

          <div
            style={{
              marginTop: 20,
            }}
          >
            <div
              className="muted"
              style={{
                fontSize: 12,
                marginBottom: 7,
              }}
            >
              İK Notları
            </div>

            <div
              style={{
                whiteSpace: "pre-wrap",
                lineHeight: 1.65,
              }}
            >
              {request.notes || "-"}
            </div>
          </div>
        </div>

        <div className="card">
          <div
            style={{
              display: "flex",
              justifyContent:
                "space-between",
              alignItems: "center",
              gap: 15,
            }}
          >
            <div>
              <h2
                style={{
                  marginBottom: 5,
                }}
              >
                Terfi Sınavı
              </h2>

              <p
                className="muted"
                style={{
                  margin: 0,
                }}
              >
                Bu terfi talebi için
                gerçekleştirilen sınav
                süreci.
              </p>
            </div>

            {!latestExam && (
              <Link
                href={`/terfi/${request.id}/sinav-ata`}
                className="btn"
              >
                Sınav Ata
              </Link>
            )}
          </div>

          {!latestExam ? (
            <div
              style={{
                marginTop: 20,
                padding: 20,
                borderRadius: 10,
                background: "#f8fafc",
                border:
                  "1px dashed #cbd5e1",
                textAlign: "center",
              }}
            >
              <strong>
                Henüz sınav atanmadı.
              </strong>

              <p
                className="muted"
                style={{
                  margin:
                    "7px 0 0",
                }}
              >
                Terfi talebi için
                Genel Yetenek + ÇKE
                sınavlarını atayabilirsiniz.
              </p>
            </div>
          ) : (
            <div
              style={{
                marginTop: 20,
              }}
            >
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(150px, 1fr))",
                  gap: 12,
                  marginBottom: 18,
                }}
              >
                <Metric
                  label="Sınav"
                  value={`Deneme ${latestExam.attemptNo}`}
                />

                <Metric
                  label="Durum"
                  value={
                    examStatusLabels[
                      latestExam.status
                    ] ??
                    latestExam.status
                  }
                />

                <Metric
                  label="Sonuç"
                  value={
                    latestExam.result ||
                    "-"
                  }
                />

                <Metric
                  label="Puan"
                  value={
                    latestExam.score !==
                    null
                      ? `${latestExam.score}/100`
                      : "-"
                  }
                />
              </div>

              <div
                style={{
                  display: "grid",
                  gap: 8,
                }}
              >
                {latestExam.tests.map(
                  (test) => (
                    <div
                      key={test.id}
                      style={{
                        padding:
                          "13px 15px",
                        border:
                          "1px solid #e5e7eb",
                        borderRadius: 9,
                        display: "flex",
                        justifyContent:
                          "space-between",
                        gap: 15,
                      }}
                    >
                      <strong>
                        {
                          test
                            .testForm
                            .name
                        }
                      </strong>

                      <span className="muted">
                        {test.status}
                      </span>
                    </div>
                  )
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

function InfoGrid({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns:
          "repeat(auto-fit, minmax(150px, 1fr))",
        gap: 16,
        marginTop: 18,
      }}
    >
      {children}
    </div>
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

function Metric({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div
      style={{
        padding: 14,
        borderRadius: 9,
        background: "#f8fafc",
        border:
          "1px solid #e5e7eb",
      }}
    >
      <div
        className="muted"
        style={{
          fontSize: 12,
          marginBottom: 5,
        }}
      >
        {label}
      </div>

      <strong>{value}</strong>
    </div>
  );
}

function StatusBadge({
  status,
  labels,
}: {
  status: string;
  labels: Record<string, string>;
}) {
  return (
    <span
      style={{
        display: "inline-block",
        padding:
          "7px 11px",
        borderRadius: 999,
        background: "#eef2ff",
        color: "#1e3a8a",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {labels[status] ??
        status}
    </span>
  );
}

function formatDate(
  value: Date
) {
  return new Intl.DateTimeFormat(
    "tr-TR",
    {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }
  ).format(value);
}