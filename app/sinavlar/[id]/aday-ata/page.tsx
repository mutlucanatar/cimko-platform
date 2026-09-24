import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function AdayAtaPage({
  params,
}: Props) {
  const { id } = await params;

  const sinav = await db.examPackage.findUnique({
    where: {
      id,
    },
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
  });

  if (!sinav) {
    notFound();
  }

  const [adaylar, pozisyonlar] = await Promise.all([
    db.candidate.findMany({
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    }),

    db.position.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    }),
  ]);

  return (
    <main className="container">
      <div style={{ marginBottom: 24 }}>
        <Link
          href={`/sinavlar/${sinav.id}`}
          className="muted"
        >
          ← Sınav Yönetimi
        </Link>

        <h1 style={{ marginTop: 10 }}>
          Aday Ata
        </h1>

        <p className="muted">
          {sinav.name}
        </p>
      </div>

      <div className="card">
        <h2>Adaya Sınav Ata</h2>

        <p
          className="muted"
          style={{ marginTop: 8 }}
        >
          Aday seçildiğinde bu sınav paketi içindeki tüm
          testler adaya otomatik olarak atanacaktır.
        </p>

        <form
          action={`/api/sinavlar/${sinav.id}/aday-ata`}
          method="POST"
          style={{
            marginTop: 24,
            display: "grid",
            gap: 20,
            maxWidth: 720,
          }}
        >
          <div>
            <label
              htmlFor="candidateId"
              style={{
                display: "block",
                marginBottom: 8,
                fontWeight: 600,
              }}
            >
              Aday
            </label>

            <select
              id="candidateId"
              name="candidateId"
              required
              defaultValue=""
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
              }}
            >
              <option value="" disabled>
                Aday seçiniz
              </option>

              {adaylar.map((aday) => (
                <option
                  key={aday.id}
                  value={aday.id}
                >
                  {aday.firstName} {aday.lastName}
                  {aday.phone
                    ? ` - ${aday.phone}`
                    : ""}
                </option>
              ))}
            </select>

            {adaylar.length === 0 && (
              <p
                className="muted"
                style={{ marginTop: 8 }}
              >
                Sistemde kayıtlı aday bulunmuyor.
              </p>
            )}
          </div>

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

            <select
              id="positionId"
              name="positionId"
              defaultValue=""
              style={{
                width: "100%",
                padding: 12,
                borderRadius: 8,
                border: "1px solid #ccc",
                background: "#fff",
              }}
            >
              <option value="">
                Pozisyon seçiniz
              </option>

              {pozisyonlar.map((pozisyon) => (
                <option
                  key={pozisyon.id}
                  value={pozisyon.id}
                >
                  {pozisyon.name}
                </option>
              ))}
            </select>
          </div>

          <div className="notice">
            <strong>Sınav İçeriği</strong>

            <div style={{ marginTop: 10 }}>
              {sinav.tests.length === 0 ? (
                <div>
                  Bu sınava henüz test eklenmemiş.
                </div>
              ) : (
                sinav.tests.map((test, index) => (
                  <div
                    key={test.id}
                    style={{ marginTop: 6 }}
                  >
                    {index + 1}.{" "}
                    {test.testForm.name}
                  </div>
                ))
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              gap: 12,
              alignItems: "center",
            }}
          >
            <button
              type="submit"
              className="button"
              disabled={sinav.tests.length === 0}
            >
              Adaya Sınav Ata
            </button>

            <Link
              href={`/sinavlar/${sinav.id}`}
              className="muted"
            >
              Vazgeç
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}