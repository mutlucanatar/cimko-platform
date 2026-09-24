import Link from "next/link";
import { db } from "@/lib/prisma";

type Props = {
  searchParams: Promise<{
    kaynak?: string;
  }>;
};

const sourceLabels: Record<string, string> = {
  GENEL_BASVURU: "Genel Başvuru",
  ILAN_BASVURU: "İlan Başvurusu",
  IK_KAYIT: "İK Kaydı",
  EXCEL: "Excel",
  REFERANS: "Referans",
};

export default async function Adaylar({
  searchParams,
}: Props) {
  const { kaynak } = await searchParams;

  const where =
    kaynak === "GENEL_BASVURU"
      ? { source: "GENEL_BASVURU" }
      : kaynak === "ILAN_BASVURU"
        ? { source: "ILAN_BASVURU" }
        : {};

  const candidates =
    await db.candidate.findMany({
      where,
      orderBy: {
        createdAt: "desc",
      },
      take: 50,
    include: {
  applications: {
    orderBy: {
      appliedAt: "desc",
    },
    take: 1,
    include: {
      vacancy: true,
      position: true,
    },
  },
},
    });

  const filterLink = (value?: string) => {
    if (!value) {
      return "/adaylar";
    }

    return `/adaylar?kaynak=${encodeURIComponent(
      value
    )}`;
  };

  return (
    <main className="container">
      {/* BAŞLIK */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          gap: 20,
          flexWrap: "wrap",
        }}
      >
        <div>
          <h1>Adaylar</h1>

          <p className="muted">
            Son 50 aday kaydı
          </p>
        </div>

        <Link
          href="/adaylar/yeni"
          className="button"
          style={{
            textDecoration: "none",
            whiteSpace: "nowrap",
          }}
        >
          + Yeni Aday
        </Link>
      </div>

      {/* FİLTRELER */}
      <div
        style={{
          display: "flex",
          gap: 10,
          flexWrap: "wrap",
          marginTop: 22,
        }}
      >
        <Link
          href={filterLink()}
          className={
            !kaynak
              ? "button"
              : "button secondary"
          }
          style={{
            textDecoration: "none",
          }}
        >
          Tümü
        </Link>

        <Link
          href={filterLink(
            "ILAN_BASVURU"
          )}
          className={
            kaynak === "ILAN_BASVURU"
              ? "button"
              : "button secondary"
          }
          style={{
            textDecoration: "none",
          }}
        >
          İlan Başvuruları
        </Link>

        <Link
          href={filterLink(
            "GENEL_BASVURU"
          )}
          className={
            kaynak === "GENEL_BASVURU"
              ? "button"
              : "button secondary"
          }
          style={{
            textDecoration: "none",
          }}
        >
          Genel Başvurular
        </Link>
      </div>

      {/* TABLO */}
      <div
        className="card"
        style={{
          marginTop: 18,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>Başvuru</th>
              <th>Telefon</th>
              <th>E-posta</th>
              <th>Kaynak</th>
              <th>Kayıt Tarihi</th>
              <th>Değerlendirme</th>
            </tr>
          </thead>

          <tbody>
            {candidates.map((candidate) => {
              const application =
                candidate.applications[0];

              const applicationLabel =
                application?.vacancy?.title ??
                "Genel Başvuru";

              const sourceLabel =
                sourceLabels[
                  candidate.source
                ] ??
                candidate.source ??
                "-";

              return (
                <tr key={candidate.id}>
                  {/* AD SOYAD */}
                  <td>
                    <strong>
                      {candidate.firstName}{" "}
                      {candidate.lastName}
                    </strong>
                  </td>

                  {/* BAŞVURU */}
                  <td>
                    <div>
                      <strong>
                        {applicationLabel}
                      </strong>
                    </div>

                    {application?.position &&
                      applicationLabel !==
                        "Genel Başvuru" && (
                        <div
                          className="muted"
                          style={{
                            fontSize: 12,
                            marginTop: 4,
                          }}
                        >
                          {application.position.name}
                        </div>
                      )}
                  </td>

                  {/* TELEFON */}
                  <td>
                    {candidate.phone || "-"}
                  </td>

                  {/* E-POSTA */}
                  <td>
                    {candidate.email || "-"}
                  </td>

                  {/* KAYNAK */}
                  <td>
                    <span
                      style={{
                        display:
                          "inline-block",
                        padding:
                          "5px 9px",
                        borderRadius: 999,
                        fontSize: 12,
                        fontWeight: 600,
                        background:
                          candidate.source ===
                          "GENEL_BASVURU"
                            ? "#eef3fb"
                            : "#f3f4f6",
                      }}
                    >
                      {sourceLabel}
                    </span>
                  </td>

                  {/* TARİH */}
                  <td>
                    {new Intl.DateTimeFormat(
                      "tr-TR",
                      {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                      }
                    ).format(
                      new Date(
                        candidate.createdAt
                      )
                    )}
                  </td>

                  {/* DEĞERLENDİRME */}
                  <td>
                    <Link
                      href={`/adaylar/${candidate.id}`}
                      style={{
                        fontWeight: 600,
                        textDecoration:
                          "none",
                      }}
                    >
                      Sonuçları Gör →
                    </Link>
                  </td>
                </tr>
              );
            })}

            {candidates.length === 0 && (
              <tr>
                <td colSpan={7}>
                  Bu filtreye uygun aday
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