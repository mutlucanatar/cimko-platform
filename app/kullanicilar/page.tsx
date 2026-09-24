import Link from "next/link";
import { db } from "@/lib/prisma";import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const roleLabels: Record<string, string> = {
  SISTEM_YONETICISI: "Sistem Yöneticisi",
  IK_YONETICISI: "İK Yöneticisi",
  IK_UZMANI: "İK Uzmanı",
  TESIS_YONETICISI: "Tesis Yöneticisi",
  BOLUM_YONETICISI: "Bölüm Yöneticisi",
  TEKNIK_DEGERLENDIRICI: "Teknik Değerlendirici",
  ISG_UZMANI: "İSG Uzmanı",
  DIS_KULLANICI: "Dış Kullanıcı",
};

export default async function Kullanicilar() {
  const session = await getSession();

if (
  !session ||
  session.role !== "SISTEM_YONETICISI"
) {
  redirect("/panel");
}
    const users = await db.user.findMany({
    orderBy: [
      { isActive: "desc" },
      { firstName: "asc" },
      { lastName: "asc" },
    ],
    include: {
      facility: true,
      department: true,
    },
  });

  return (
    <main className="container">
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
          <h1>Kullanıcılar</h1>
          <p className="muted">
            Kurumsal kullanıcı ve yetki yönetimi
          </p>
        </div>

        <Link
          href="/kullanicilar/yeni"
          className="button"
          style={{ textDecoration: "none" }}
        >
          + Yeni Kullanıcı
        </Link>
      </div>

      <div
        className="card"
        style={{
          marginTop: 20,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <table>
          <thead>
            <tr>
              <th>Ad Soyad</th>
              <th>E-posta</th>
              <th>Rol</th>
              <th>Tesis</th>
              <th>Bölüm</th>
              <th>Durum</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {users.map((user) => (
              <tr key={user.id}>
                <td>
                  <strong>
                    {user.firstName}{" "}
                    {user.lastName}
                  </strong>
                </td>

                <td>{user.email}</td>

                <td>
                  {roleLabels[user.role] ??
                    user.role}
                </td>

                <td>
                  {user.facility?.name ?? "Tüm tesisler"}
                </td>

                <td>
                  {user.department?.name ??
                    "Tüm bölümler"}
                </td>

                <td>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "5px 9px",
                      borderRadius: 999,
                      fontSize: 12,
                      fontWeight: 600,
                      background: user.isActive
                        ? "#ecfdf5"
                        : "#f3f4f6",
                    }}
                  >
                    {user.isActive
                      ? "Aktif"
                      : "Pasif"}
                  </span>
                </td>

                <td>
                  <Link
                    href={`/kullanicilar/${user.id}`}
                    style={{
                      textDecoration: "none",
                      fontWeight: 600,
                    }}
                  >
                    Düzenle →
                  </Link>
                </td>
              </tr>
            ))}

            {users.length === 0 && (
              <tr>
                <td colSpan={7}>
                  Henüz kullanıcı bulunmuyor.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </main>
  );
}