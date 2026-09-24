import Link from "next/link";
import { db } from "@/lib/prisma";

function statusLabel(status: string) {
  switch (status) {
    case "TAMAMLANDI":
      return "Tamamlandı";
    case "DEVAM":
      return "Devam Ediyor";
    case "BASLAMADI":
      return "Başlamadı";
    default:
      return status;
  }
}

function overallStatus(
  tests: { status: string }[]
) {
  if (tests.length === 0) {
    return "Test Yok";
  }

  if (
    tests.every(
      (test) =>
        test.status === "TAMAMLANDI"
    )
  ) {
    return "Tamamlandı";
  }

  if (
    tests.some(
      (test) =>
        test.status === "DEVAM" ||
        test.status === "TAMAMLANDI"
    )
  ) {
    return "Devam Ediyor";
  }

  return "Bekliyor";
}

export default async function SinavAtamalari() {
  const assignments =
    await db.assignment.findMany({
      orderBy: {
        createdAt: "desc",
      },

      include: {
        candidate: true,
        position: true,
        examPackage: true,

        tests: {
          include: {
            testForm: true,
          },
        },
      },
    });

  return (
    <main className="container">
      <div
        style={{
          display: "flex",
          justifyContent:
            "space-between",
          alignItems: "flex-start",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <Link
            href="/sinavlar"
            className="muted"
          >
            ← Sınavlar
          </Link>

          <h1
            style={{
              marginTop: 12,
            }}
          >
            Sınav Atamaları
          </h1>

          <p className="muted">
            Adaylara atanmış sınavların
            durumlarını takip edin.
          </p>
        </div>

        <div
          style={{
            padding: "12px 18px",
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
            }}
          >
            TOPLAM ATAMA
          </div>

          <strong
            style={{
              fontSize: 24,
            }}
          >
            {assignments.length}
          </strong>
        </div>
      </div>

      <div
        className="card"
        style={{
          marginTop: 22,
          padding: 0,
          overflowX: "auto",
        }}
      >
        <table
          style={{
            width: "100%",
            minWidth: 1100,
          }}
        >
          <thead>
            <tr>
              <th>Aday</th>
              <th>Pozisyon</th>
              <th>Sınav Paketi</th>
              <th>Erişim Kodu</th>
              <th>Testler</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {assignments.map(
              (assignment) => {
                const durum =
                  overallStatus(
                    assignment.tests
                  );

                return (
                  <tr
                    key={
                      assignment.id
                    }
                  >
                    <td>
                      <strong>
                        {
                          assignment
                            .candidate
                            .firstName
                        }{" "}
                        {
                          assignment
                            .candidate
                            .lastName
                        }
                      </strong>
                    </td>

                    <td>
                      {assignment
                        .position
                        ?.name ??
                        "-"}
                    </td>

                    <td>
                      {
                        assignment
                          .examPackage
                          .name
                      }
                    </td>

                    <td>
                      <strong>
                        {
                          assignment.accessCode
                        }
                      </strong>
                    </td>

                    <td>
                      <div
                        style={{
                          display:
                            "grid",
                          gap: 6,
                        }}
                      >
                        {assignment.tests.map(
                          (test) => (
                            <div
                              key={
                                test.id
                              }
                              style={{
                                display:
                                  "flex",
                                justifyContent:
                                  "space-between",
                                gap: 12,
                              }}
                            >
                              <span>
                                {
                                  test
                                    .testForm
                                    .name
                                }
                              </span>

                              <span
                                className="muted"
                                style={{
                                  whiteSpace:
                                    "nowrap",
                                }}
                              >
                                {statusLabel(
                                  test.status
                                )}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </td>

                    <td>
                      <span
                        style={{
                          display:
                            "inline-block",
                          padding:
                            "6px 10px",
                          borderRadius:
                            999,
                          fontSize: 13,
                          fontWeight: 600,
                          background:
                            durum ===
                            "Tamamlandı"
                              ? "#ecfdf5"
                              : durum ===
                                  "Devam Ediyor"
                                ? "#eff6ff"
                                : "#f3f4f6",
                        }}
                      >
                        {durum}
                      </span>
                    </td>

                    <td
                      style={{
                        textAlign:
                          "right",
                      }}
                    >
                      <Link
                        href={`/adaylar/${assignment.candidateId}`}
                      >
                        Detay →
                      </Link>
                    </td>
                  </tr>
                );
              }
            )}

            {assignments.length ===
              0 && (
              <tr>
                <td
                  colSpan={7}
                  style={{
                    textAlign:
                      "center",
                    padding: 30,
                  }}
                >
                  Henüz sınav
                  ataması
                  bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}