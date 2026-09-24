import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

function durumLabel(status: string) {
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

export default async function SinavYonetimi({ params }: Props) {
  const { id } = await params;

  const sinav = await db.examPackage.findUnique({
    where: {
      id,
    },
    include: {
      tests: {
        include: {
          testForm: true,
        },
      },
      assignments: {
        orderBy: {
          createdAt: "desc",
        },
        include: {
          candidate: true,
          tests: {
            include: {
              testForm: true,
            },
          },
        },
      },
    },
  });

  if (!sinav) {
    notFound();
  }

  return (
    <main className="container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 16,
          marginBottom: 24,
        }}
      >
        <div>
          <Link href="/sinavlar" className="muted">
            ← Sınavlar
          </Link>

          <h1 style={{ marginTop: 10 }}>{sinav.name}</h1>

          <p className="muted">
            Sınav uygulaması ve aday yönetimi
          </p>
        </div>

        <Link
          href={`/sinavlar/${sinav.id}/aday-ata`}
          className="button"
        >
          Aday Ata
        </Link>
      </div>

      <div
        className="grid"
        style={{
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          marginBottom: 24,
        }}
      >
        <div className="card">
          <div className="muted">Test Sayısı</div>
          <div className="metric">{sinav.tests.length}</div>
        </div>

        <div className="card">
          <div className="muted">Atanan Aday</div>
          <div className="metric">
            {sinav.assignments.length}
          </div>
        </div>

        <div className="card">
          <div className="muted">Durum</div>
          <div className="metric">
            {sinav.isActive ? "Aktif" : "Pasif"}
          </div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 24 }}>
        <h2>Testler</h2>

        <table style={{ marginTop: 16 }}>
          <thead>
            <tr>
              <th>Sıra</th>
              <th>Test</th>
              <th>Tür</th>
            </tr>
          </thead>

          <tbody>
            {sinav.tests.map((test) => (
              <tr key={test.id}>
                <td>{test.order}</td>

                <td>
                  <strong>{test.testForm.name}</strong>
                </td>

                <td>{test.testForm.kind}</td>
              </tr>
            ))}

            {sinav.tests.length === 0 && (
              <tr>
                <td colSpan={3}>
                  Bu sınava henüz test tanımlanmamış.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="card">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
          }}
        >
          <div>
            <h2>Adaylar</h2>

            <p className="muted">
              Bu sınava atanmış adaylar ve test durumları
            </p>
          </div>

          <Link
            href={`/sinavlar/${sinav.id}/aday-ata`}
            className="button"
          >
            + Aday Ata
          </Link>
        </div>

        <div style={{ marginTop: 18 }}>
          {sinav.assignments.length === 0 ? (
            <div className="notice">
              Bu sınava henüz aday atanmamış.
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Aday</th>

                  {sinav.tests.map((test) => (
                    <th key={test.id}>
                      {test.testForm.name}
                    </th>
                  ))}

                  <th>Erişim Kodu</th>
                </tr>
              </thead>

              <tbody>
                {sinav.assignments.map((assignment) => (
                  <tr key={assignment.id}>
                    <td>
                      <strong>
                        {assignment.candidate.firstName}{" "}
                        {assignment.candidate.lastName}
                      </strong>
                    </td>

                    {sinav.tests.map((packageTest) => {
                      const assignmentTest =
                        assignment.tests.find(
                          (test) =>
                            test.testFormId ===
                            packageTest.testFormId
                        );

                      return (
                        <td key={packageTest.id}>
                          {assignmentTest
                            ? durumLabel(
                                assignmentTest.status
                              )
                            : "Atanmadı"}
                        </td>
                      );
                    })}

                    <td>
                      <strong>
                        {assignment.accessCode}
                      </strong>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </main>
  );
}