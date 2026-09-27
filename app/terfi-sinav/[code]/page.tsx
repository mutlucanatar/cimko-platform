import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function PromotionExamEntryPage({
  params,
}: {
  params: Promise<{ code: string }>;
}) {
  const { code } = await params;

  const accessCode = code.trim().toUpperCase();

  const exam =
    await db.promotionExam.findUnique({
      where: {
        accessCode,
      },
      include: {
        promotionRequest: {
          include: {
            currentPosition: true,
            targetPosition: true,
            promotionPeriod: true,
          },
        },
        tests: {
          orderBy: {
            id: "asc",
          },
          include: {
            testForm: true,
          },
        },
      },
    });

  if (!exam) {
    notFound();
  }

  const request =
    exam.promotionRequest;

  const abilityTest =
    exam.tests.find(
      (test) =>
        test.testForm.kind ===
        "YETENEK"
    );

  const personalityTest =
    exam.tests.find(
      (test) =>
        test.testForm.kind ===
        "KISILIK"
    );

  const completedTests =
    exam.tests.filter(
      (test) =>
        test.status ===
        "TAMAMLANDI"
    ).length;

  const examStarted =
    exam.status ===
    "DEVAM_EDIYOR";

  const examCompleted =
    exam.status ===
    "TAMAMLANDI";

  return (
    <main className="container">
      <div
        className="card"
        style={{
          maxWidth: 780,
          margin: "55px auto",
          padding: 36,
        }}
      >
        <div
          className="muted"
          style={{
            fontSize: 13,
            fontWeight: 700,
            letterSpacing: 1,
            textTransform:
              "uppercase",
            marginBottom: 8,
          }}
        >
          Çimko
        </div>

        <h1
          style={{
            marginTop: 0,
            marginBottom: 8,
          }}
        >
          Mavi Yaka Terfi Sınavı
        </h1>

        <p
          className="muted"
          style={{
            marginTop: 0,
            marginBottom: 28,
          }}
        >
          Terfi değerlendirmesi için
          size atanmış sınav bilgileri
          aşağıdadır.
        </p>

        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(220px, 1fr))",
            gap: 16,
          }}
        >
          <Info
            label="Çalışan"
            value={`${request.employeeFirstName} ${request.employeeLastName}`}
          />

          <Info
            label="Sicil No"
            value={
              request.sicilNo
            }
          />

          <Info
            label="Lokasyon"
            value={
              request.facilityName ||
              "-"
            }
          />

          <Info
            label="Terfi Dönemi"
            value={
              request
                .promotionPeriod
                .name
            }
          />
        </div>

        <div
          style={{
            marginTop: 24,
            padding: 20,
            borderRadius: 10,
            background:
              "#f8fafc",
            border:
              "1px solid #e5e7eb",
          }}
        >
          <div
            className="muted"
            style={{
              fontSize: 12,
              marginBottom: 8,
            }}
          >
            Terfi
          </div>

          <div
            style={{
              fontSize: 17,
              fontWeight: 700,
            }}
          >
            {
              request
                .currentPosition
                .name
            }

            <span
              className="muted"
              style={{
                margin:
                  "0 10px",
              }}
            >
              →
            </span>

            {
              request
                .targetPosition
                .name
            }
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
          }}
        >
          <h2>
            Sınavlarınız
          </h2>

          <div
            style={{
              display: "grid",
              gap: 10,
              marginTop: 14,
            }}
          >
            {exam.tests.map(
              (test) => (
                <div
                  key={test.id}
                  style={{
                    display: "flex",
                    justifyContent:
                      "space-between",
                    alignItems:
                      "center",
                    gap: 16,
                    padding:
                      "14px 16px",
                    border:
                      "1px solid #e5e7eb",
                    borderRadius: 9,
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
                      {
                        test
                          .testForm
                          .kind ===
                        "YETENEK"
                          ? "Genel Yetenek"
                          : "Kişilik"
                      }
                    </div>

                    <strong>
                      {
                        test
                          .testForm
                          .name
                      }
                    </strong>
                  </div>

                  <Status
                    status={
                      test.status
                    }
                  />
                </div>
              )
            )}
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            padding: 16,
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
            Sınav erişim kodu
          </strong>

          <div
            style={{
              marginTop: 7,
              fontSize: 20,
              letterSpacing: 2,
              fontWeight: 800,
            }}
          >
            {exam.accessCode}
          </div>
        </div>

        <div
          style={{
            marginTop: 24,
            display: "flex",
            justifyContent:
              "space-between",
            alignItems:
              "center",
            gap: 16,
          }}
        >
          <div className="muted">
            Tamamlanan test:{" "}
            {completedTests}/
            {exam.tests.length}
          </div>

          {examCompleted ? (
            <div
              style={{
                padding:
                  "10px 14px",
                borderRadius: 8,
                background:
                  "#f1f5f9",
                fontWeight: 700,
              }}
            >
              Sınav tamamlandı
            </div>
          ) : (
            <Link
              href={`/terfi-sinav/${exam.accessCode}/sinav`}
              className="btn"
            >
              {examStarted
                ? "Sınava Devam Et"
                : "Sınava Başla"}
            </Link>
          )}
        </div>

        {abilityTest &&
          personalityTest && (
            <div
              className="muted"
              style={{
                marginTop: 20,
                fontSize: 13,
                lineHeight: 1.6,
              }}
            >
              Bu terfi sınavı Genel
              Yetenek ve ÇKE testlerinden
              oluşmaktadır. Her iki testin
              de tamamlanması gerekir.
            </div>
          )}
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

function Status({
  status,
}: {
  status: string;
}) {
  const labels: Record<
    string,
    string
  > = {
    BASLAMADI:
      "Başlamadı",
    DEVAM:
      "Devam Ediyor",
    DEVAM_EDIYOR:
      "Devam Ediyor",
    TAMAMLANDI:
      "Tamamlandı",
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding:
          "5px 9px",
        borderRadius: 999,
        background:
          "#f1f5f9",
        fontSize: 12,
        fontWeight: 700,
        whiteSpace:
          "nowrap",
      }}
    >
      {labels[status] ??
        status}
    </span>
  );
}