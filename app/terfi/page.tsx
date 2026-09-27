import Link from "next/link";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function PromotionPage() {
  const session = await getSession();

  if (!session) {
    redirect("/giris");
  }

  const requests =
    await db.promotionRequest.findMany({
      include: {
        currentPosition: true,
        targetPosition: true,
        promotionPeriod: true,
        exams: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

  const total = requests.length;

  const assigned = requests.filter(
    (request) =>
      request.status === "SINAV_ATANDI" ||
      request.status === "SINAVDA" ||
      request.status === "BASARILI" ||
      request.status === "KALDI"
  ).length;

  const successful = requests.filter(
    (request) =>
      request.status === "BASARILI"
  ).length;

  const failed = requests.filter(
    (request) =>
      request.status === "KALDI"
  ).length;

  return (
    <main className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 20,
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
            İnsan Kaynakları
          </div>

          <h1
            style={{
              marginTop: 7,
              marginBottom: 8,
            }}
          >
            Mavi Yaka Terfi
          </h1>

          <p
            className="muted"
            style={{
              margin: 0,
              maxWidth: 720,
              lineHeight: 1.6,
            }}
          >
            Mavi yaka terfi taleplerini,
            sınav süreçlerini ve sonuçlarını
            yönetin.
          </p>
        </div>

        <Link
          href="/terfi/yeni"
          className="btn"
          style={{
            whiteSpace: "nowrap",
          }}
        >
          + Yeni Terfi Talebi
        </Link>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))",
          gap: 14,
          marginBottom: 26,
        }}
      >
        <StatCard
          title="Toplam Talep"
          value={total}
        />

        <StatCard
          title="Sınava Atanan"
          value={assigned}
        />

        <StatCard
          title="Başarılı"
          value={successful}
        />

        <StatCard
          title="Başarısız"
          value={failed}
        />
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 20,
          }}
        >
          <div>
            <h2
              style={{
                margin: 0,
              }}
            >
              Terfi Talepleri
            </h2>

            <p
              className="muted"
              style={{
                marginTop: 6,
                marginBottom: 0,
              }}
            >
              İK tarafından sisteme girilen
              terfi talepleri.
            </p>
          </div>
        </div>

        {requests.length === 0 ? (
          <div
            style={{
              padding: "42px 20px",
              textAlign: "center",
              border:
                "1px dashed #d1d5db",
              borderRadius: 10,
            }}
          >
            <strong>
              Henüz terfi talebi bulunmuyor.
            </strong>

            <p
              className="muted"
              style={{
                marginTop: 8,
                marginBottom: 18,
              }}
            >
              Amirlerden gelen terfi
              taleplerini sisteme kaydederek
              süreci başlatabilirsiniz.
            </p>

            <Link
              href="/terfi/yeni"
              className="btn"
            >
              + Yeni Terfi Talebi
            </Link>
          </div>
        ) : (
          <div
            style={{
              overflowX: "auto",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse:
                  "collapse",
              }}
            >
              <thead>
                <tr>
                  <Th>Sicil</Th>
                  <Th>Çalışan</Th>
                  <Th>Terfi</Th>
                  <Th>Lokasyon</Th>
                  <Th>Dönem</Th>
                  <Th>Talep Eden</Th>
                  <Th>Durum</Th>
                  <Th />
                </tr>
              </thead>

              <tbody>
                {requests.map(
                  (request) => (
                    <tr
                      key={
                        request.id
                      }
                    >
                      <Td>
                        {
                          request.sicilNo
                        }
                      </Td>

                      <Td>
                        <strong>
                          {
                            request.employeeFirstName
                          }{" "}
                          {
                            request.employeeLastName
                          }
                        </strong>
                      </Td>

                      <Td>
                        <div
                          style={{
                            fontSize: 14,
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
                                "0 7px",
                            }}
                          >
                            →
                          </span>

                          <strong>
                            {
                              request
                                .targetPosition
                                .name
                            }
                          </strong>
                        </div>
                      </Td>

                      <Td>
                        {request.facilityName ||
                          "-"}
                      </Td>

                      <Td>
                        {
                          request
                            .promotionPeriod
                            .name
                        }
                      </Td>

                      <Td>
                        {
                          request
                            .requesterName
                        }
                      </Td>

                      <Td>
                        <StatusBadge
                          status={
                            request.status
                          }
                        />
                      </Td>

                      <Td>
                        <Link
                          href={`/terfi/${request.id}`}
                        >
                          Detay
                        </Link>
                      </Td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div
      className="card"
      style={{
        padding: 20,
      }}
    >
      <div
        className="muted"
        style={{
          fontSize: 13,
          marginBottom: 8,
        }}
      >
        {title}
      </div>

      <div
        style={{
          fontSize: 30,
          fontWeight: 800,
        }}
      >
        {value}
      </div>
    </div>
  );
}

function StatusBadge({
  status,
}: {
  status: string;
}) {
  const labels: Record<
    string,
    string
  > = {
    TALEP: "Talep",
    SINAV_ATANDI:
      "Sınav Atandı",
    SINAVDA: "Sınavda",
    BASARILI: "Başarılı",
    KALDI: "Başarısız",
    IPTAL: "İptal",
  };

  return (
    <span
      style={{
        display: "inline-block",
        padding: "5px 9px",
        borderRadius: 999,
        background:
          "#f1f5f9",
        fontSize: 12,
        fontWeight: 700,
      }}
    >
      {labels[status] ??
        status}
    </span>
  );
}

function Th({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <th
      style={{
        textAlign: "left",
        padding:
          "11px 12px",
        borderBottom:
          "1px solid #e5e7eb",
        fontSize: 12,
        color: "#64748b",
      }}
    >
      {children}
    </th>
  );
}

function Td({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <td
      style={{
        padding:
          "14px 12px",
        borderBottom:
          "1px solid #eef2f7",
        verticalAlign:
          "middle",
      }}
    >
      {children}
    </td>
  );
}