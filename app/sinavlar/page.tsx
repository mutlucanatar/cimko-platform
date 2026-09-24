import Link from "next/link";
import { db } from "@/lib/prisma";

export default async function Sinavlar() {
  const sinavlar = await db.examPackage.findMany({
    orderBy: {
      createdAt: "desc",
    },
    include: {
      _count: {
        select: {
          assignments: true,
          tests: true,
        },
      },
    },
  });

  return (
    <main className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
        }}
      >
        <div>
          <h1>Sınavlar</h1>
          <p className="muted">
            Sınav uygulamalarını ve aday atamalarını yönetin.
          </p>
        </div>
        <Link
  href="/sinavlar/atamalar"
  style={{
    padding: "11px 16px",
    border: "1px solid #1e3a8a",
    borderRadius: 8,
    textDecoration: "none",
    fontWeight: 600,
  }}
>
  Sınav Atamaları →
</Link>
      </div>

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
              <th>Sınav Adı</th>
              <th>Test Sayısı</th>
              <th>Aday Sayısı</th>
              <th>Başlangıç</th>
              <th>Bitiş</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {sinavlar.map((sinav) => (
              <tr key={sinav.id}>
                <td>
                  <strong>{sinav.name}</strong>
                </td>

                <td>{sinav._count.tests}</td>

                <td>{sinav._count.assignments}</td>

                <td>
  {sinav.startsAt
    ? sinav.startsAt.toLocaleDateString("tr-TR")
    : "-"}
</td>

<td>
  {sinav.endsAt
    ? sinav.endsAt.toLocaleDateString("tr-TR")
    : "-"}
</td>

                <td style={{ textAlign: "right" }}>
                  <Link href={`/sinavlar/${sinav.id}`}>
                    Yönet
                  </Link>
                </td>
              </tr>
            ))}

            {sinavlar.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 30 }}>
                  Henüz sınav uygulaması bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}