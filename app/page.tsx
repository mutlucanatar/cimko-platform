import { db } from "@/lib/prisma";

export default async function Sinavlar() {
  const assignments = await db.assignment.findMany({
    include: {
      candidate: true,
      examPackage: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 50,
  });

  return (
    <main className="container">
      <h1>Sınavlar</h1>
      <p className="muted">Atama ve aday özetleri</p>

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
              <th>Aday</th>
              <th>Sınav Paketi</th>
              <th>Erişim Kodu</th>
              <th>Durum</th>
              <th>Oluşturulma</th>
              <th>Son Tarih</th>
            </tr>
          </thead>

          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td>
                  {a.candidate.firstName} {a.candidate.lastName}
                </td>

                <td>{a.examPackage.name}</td>

                <td>{a.accessCode}</td>

                <td>{a.kvkkAccepted ? "KVKK Onaylı" : "KVKK Bekliyor"}</td>

                <td>
                  {a.createdAt.toLocaleString("tr-TR")}
                </td>

                <td>
                  {a.expiresAt
                    ? a.expiresAt.toLocaleString("tr-TR")
                    : "-"}
                </td>
              </tr>
            ))}

            {assignments.length === 0 && (
              <tr>
                <td colSpan={6} style={{ textAlign: "center", padding: 24 }}>
                  Henüz sınav ataması bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}
