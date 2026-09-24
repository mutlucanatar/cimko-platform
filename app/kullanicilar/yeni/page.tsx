import Link from "next/link";
import { db } from "@/lib/prisma"; import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

const roleOptions = [
  ["SISTEM_YONETICISI", "Sistem Yöneticisi"],
  ["IK_YONETICISI", "İK Yöneticisi"],
  ["IK_UZMANI", "İK Uzmanı"],
  ["TESIS_YONETICISI", "Tesis Yöneticisi"],
  ["BOLUM_YONETICISI", "Bölüm Yöneticisi"],
  ["TEKNIK_DEGERLENDIRICI", "Teknik Değerlendirici"],
  ["ISG_UZMANI", "İSG Uzmanı"],
  ["DIS_KULLANICI", "Dış Kullanıcı"],
] as const;

export default async function YeniKullanici() {
  const session = await getSession();

if (
  !session ||
  session.role !== "SISTEM_YONETICISI"
) {
  redirect("/panel");
}
    const [facilities, departments] =
    await Promise.all([
      db.facility.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
      }),

      db.department.findMany({
        where: {
          isActive: true,
        },
        orderBy: {
          name: "asc",
        },
        include: {
          facility: true,
        },
      }),
    ]);

  return (
    <main className="container">
      <div
        style={{
          maxWidth: 820,
          margin: "40px auto 80px",
        }}
      >
        <Link
          href="/kullanicilar"
          className="muted"
        >
          ← Kullanıcılar
        </Link>

        <div
          className="card"
          style={{
            marginTop: 20,
            padding: 32,
          }}
        >
          <div
            className="muted"
            style={{
              fontSize: 13,
              fontWeight: 700,
              letterSpacing: 0.7,
            }}
          >
            KULLANICI YÖNETİMİ
          </div>

          <h1
            style={{
              marginTop: 8,
              marginBottom: 8,
            }}
          >
            Yeni Kullanıcı
          </h1>

          <p className="muted">
            Kurumsal sisteme erişecek kullanıcıyı
            ve yetki kapsamını tanımlayın.
          </p>

          <form
            action="/api/kullanicilar"
            method="POST"
            style={{
              display: "grid",
              gap: 20,
              marginTop: 28,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(auto-fit, minmax(240px, 1fr))",
                gap: 16,
              }}
            >
              <div>
                <label
                  htmlFor="firstName"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Ad *
                </label>

                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: 13,
                    borderRadius: 8,
                    border:
                      "1px solid #d1d5db",
                  }}
                />
              </div>

              <div>
                <label
                  htmlFor="lastName"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Soyad *
                </label>

                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  style={{
                    width: "100%",
                    padding: 13,
                    borderRadius: 8,
                    border:
                      "1px solid #d1d5db",
                  }}
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: 7,
                  fontWeight: 600,
                }}
              >
                E-posta *
              </label>

              <input
                id="email"
                name="email"
                type="email"
                required
                placeholder="ornek@cimko.com.tr"
                style={{
                  width: "100%",
                  padding: 13,
                  borderRadius: 8,
                  border:
                    "1px solid #d1d5db",
                }}
              />
            </div>

            <div>
              <label
                htmlFor="password"
                style={{
                  display: "block",
                  marginBottom: 7,
                  fontWeight: 600,
                }}
              >
                Geçici Şifre *
              </label>

              <input
                id="password"
                name="password"
                type="password"
                required
                minLength={8}
                style={{
                  width: "100%",
                  padding: 13,
                  borderRadius: 8,
                  border:
                    "1px solid #d1d5db",
                }}
              />

              <div
                className="muted"
                style={{
                  fontSize: 12,
                  marginTop: 6,
                }}
              >
                En az 8 karakter.
              </div>
            </div>

            <div>
              <label
                htmlFor="role"
                style={{
                  display: "block",
                  marginBottom: 7,
                  fontWeight: 600,
                }}
              >
                Rol *
              </label>

              <select
                id="role"
                name="role"
                required
                defaultValue=""
                style={{
                  width: "100%",
                  padding: 13,
                  borderRadius: 8,
                  border:
                    "1px solid #d1d5db",
                  background: "#fff",
                }}
              >
                <option value="">
                  Rol seçiniz
                </option>

                {roleOptions.map(
                  ([value, label]) => (
                    <option
                      key={value}
                      value={value}
                    >
                      {label}
                    </option>
                  )
                )}
              </select>
            </div>

            <div
              style={{
                padding: 18,
                borderRadius: 10,
                background: "#f8fafc",
                border:
                  "1px solid #e5e7eb",
              }}
            >
              <div
                style={{
                  fontWeight: 700,
                  marginBottom: 6,
                }}
              >
                Yetki Kapsamı
              </div>

              <p
                className="muted"
                style={{
                  fontSize: 13,
                  marginTop: 0,
                  marginBottom: 18,
                }}
              >
                Tesis ve bölüm seçimi, kullanıcı
                rolüne göre erişim kapsamını
                belirler. Boş bırakıldığında tüm
                kapsam anlamına gelir.
              </p>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(260px, 1fr))",
                  gap: 16,
                }}
              >
                <div>
                  <label
                    htmlFor="facilityId"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    Tesis
                  </label>

                  <select
                    id="facilityId"
                    name="facilityId"
                    defaultValue=""
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                      background: "#fff",
                    }}
                  >
                    <option value="">
                      Tüm tesisler
                    </option>

                    {facilities.map(
                      (facility) => (
                        <option
                          key={facility.id}
                          value={facility.id}
                        >
                          {facility.name}
                        </option>
                      )
                    )}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="departmentId"
                    style={{
                      display: "block",
                      marginBottom: 7,
                      fontWeight: 600,
                    }}
                  >
                    Bölüm
                  </label>

                  <select
                    id="departmentId"
                    name="departmentId"
                    defaultValue=""
                    style={{
                      width: "100%",
                      padding: 13,
                      borderRadius: 8,
                      border:
                        "1px solid #d1d5db",
                      background: "#fff",
                    }}
                  >
                    <option value="">
                      Tüm bölümler
                    </option>

                    {departments.map(
                      (department) => (
                        <option
                          key={department.id}
                          value={department.id}
                        >
                          {department.facility.name}
                          {" — "}
                          {department.name}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
            </div>

            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
              }}
            >
              <input
                type="checkbox"
                name="isActive"
                value="true"
                defaultChecked
              />

              <span>
                Kullanıcı aktif olarak oluşturulsun
              </span>
            </label>

            <div
              style={{
                display: "flex",
                gap: 12,
                alignItems: "center",
                flexWrap: "wrap",
                marginTop: 4,
              }}
            >
              <button
                type="submit"
                className="button"
              >
                Kullanıcıyı Oluştur
              </button>

              <Link
                href="/kullanicilar"
                className="button secondary"
                style={{
                  textDecoration: "none",
                }}
              >
                Vazgeç
              </Link>
            </div>
          </form>
        </div>
      </div>
    </main>
  );
}