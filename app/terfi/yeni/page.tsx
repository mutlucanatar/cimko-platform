import Link from "next/link";
import { db } from "@/lib/prisma";

const PROMOTION_PATHS = [
  {
    from: "Yeni Üretim Elemanı",
    displayFrom: "Üretim Elemanı",
    to: "Üretim Operatörü",
  },
  {
    from: "Elektrik Bakım Elemanı",
    displayFrom: "Elektrik Bakım Elemanı",
    to: "Elektrik Bakım Ustası",
  },
  {
    from: "Mekanik Bakım Elemanı",
    displayFrom: "Mekanik Bakım Elemanı",
    to: "Mekanik Bakım Ustası",
  },
  {
    from: "Laboratuvar İşçisi",
    displayFrom: "Laboratuvar İşçisi",
    to: "Laborant",
  },
];

export const dynamic = "force-dynamic";

export default async function NewPromotionPage() {
  const [
    positions,
    periods,
  ] = await Promise.all([
    db.position.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        name: "asc",
      },
    }),

    db.promotionPeriod.findMany({
      orderBy: [
        {
          year: "desc",
        },
        {
          month: "desc",
        },
      ],
    }),
  ]);

  const allowedSources =
    new Set(
      PROMOTION_PATHS.map(
        (path) => path.from
      )
    );

  const sourcePositions =
    positions.filter((position) =>
      allowedSources.has(
        position.name
      )
    );

  const defaultPeriod =
    periods.find(
      (period) =>
        period.status === "ACIK"
    ) ??
    periods[0] ??
    null;

  return (
    <main className="container">
      <div
        style={{
          marginBottom: 24,
        }}
      >
        <Link
          href="/terfi"
          className="muted"
        >
          ← Terfi Talepleri
        </Link>

        <h1
          style={{
            marginTop: 12,
          }}
        >
          Yeni Terfi Talebi
        </h1>

        <p className="muted">
          Mavi yaka çalışan için İK
          tarafından terfi talebi
          oluşturun.
        </p>
      </div>

      <div className="card">
        <form
          action="/api/terfi"
          method="POST"
          style={{
            display: "grid",
            gap: 28,
            maxWidth: 950,
          }}
        >
          <section>
            <h2>
              Çalışan Bilgileri
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <Field
                id="employeeFirstName"
                name="employeeFirstName"
                label="Ad *"
                placeholder="Örn. Ahmet"
                required
              />

              <Field
                id="employeeLastName"
                name="employeeLastName"
                label="Soyad *"
                placeholder="Örn. Yılmaz"
                required
              />

              <Field
                id="sicilNo"
                name="sicilNo"
                label="Sicil No *"
                placeholder="Örn. 1001"
                required
              />

              <Field
                id="facilityName"
                name="facilityName"
                label="Lokasyon / Fabrika"
                placeholder="Örn. Narlı Fabrika"
              />
            </div>
          </section>

          <section>
            <h2>
              Terfi Bilgileri
            </h2>

            <div
              style={{
                display: "grid",
                gap: 16,
                marginTop: 18,
              }}
            >
              <div>
                <label
                  htmlFor="currentPositionId"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Mevcut Ünvan *
                </label>

                <select
                  id="currentPositionId"
                  name="currentPositionId"
                  required
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border:
                      "1px solid #ccc",
                    background: "#fff",
                  }}
                >
                  <option value="">
                    Seçiniz
                  </option>

                  {sourcePositions.map(
                    (position) => {
                      const path =
                        PROMOTION_PATHS.find(
                          (item) =>
                            item.from ===
                            position.name
                        );

                      return (
                        <option
                          key={
                            position.id
                          }
                          value={
                            position.id
                          }
                        >
                          {path
                            ?.displayFrom ??
                            position.name}
                      </option>
                      );
                    }
                  )}
                </select>
              </div>

              <div
                style={{
                  padding: 16,
                  borderRadius: 10,
                  background: "#f8fafc",
                  border:
                    "1px solid #e5e7eb",
                  fontSize: 14,
                  lineHeight: 1.6,
                }}
              >
                <strong>
                  Geçerli terfi yolları
                </strong>

                <div
                  style={{
                    marginTop: 8,
                    display: "grid",
                    gap: 5,
                  }}
                >
                  {PROMOTION_PATHS.map(
                    (path) => (
                      <div
                        key={
                          `${path.from}-${path.to}`
                        }
                      >
                        {path.displayFrom}
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
                          {path.to}
                        </strong>
                      </div>
                    )
                  )}
                </div>
              </div>

              <div>
                <label
                  htmlFor="targetPositionId"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Hedef Ünvan *
                </label>

                <select
                  id="targetPositionId"
                  name="targetPositionId"
                  required
                  defaultValue=""
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border:
                      "1px solid #ccc",
                    background: "#fff",
                  }}
                >
                  <option value="">
                    Seçiniz
                  </option>

                  {PROMOTION_PATHS.map(
                    (path) => {
                      const target =
                        positions.find(
                          (position) =>
                            position.name ===
                            path.to
                        );

                      if (!target) {
                        return null;
                      }

                      return (
                        <option
                          key={
                            target.id
                          }
                          value={
                            target.id
                          }
                        >
                          {path.to}
                      </option>
                      );
                    }
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="promotionPeriodId"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Terfi Dönemi *
                </label>

                <select
                  id="promotionPeriodId"
                  name="promotionPeriodId"
                  required
                  defaultValue={
                    defaultPeriod?.id ??
                    ""
                  }
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border:
                      "1px solid #ccc",
                    background: "#fff",
                  }}
                >
                  <option value="">
                    Seçiniz
                  </option>

                  {periods.map(
                    (period) => (
                      <option
                        key={
                          period.id
                        }
                        value={
                          period.id
                        }
                      >
                        {period.name}
                      </option>
                    )
                  )}
                </select>
              </div>
            </div>
          </section>

          <section>
            <h2>
              Talep Bilgileri
            </h2>

            <div
              style={{
                display: "grid",
                gridTemplateColumns:
                  "repeat(2, minmax(0, 1fr))",
                gap: 16,
                marginTop: 18,
              }}
            >
              <Field
                id="requesterName"
                name="requesterName"
                label="Talep Eden Amir *"
                placeholder="Örn. Ahmet Demir"
                required
              />

              <div>
                <label
                  htmlFor="requestDate"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Talep Tarihi *
                </label>

                <input
                  id="requestDate"
                  name="requestDate"
                  type="date"
                  required
                  defaultValue={
                    new Date()
                      .toISOString()
                      .slice(
                        0,
                        10
                      )
                  }
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border:
                      "1px solid #ccc",
                  }}
                />
              </div>

              <div
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <label
                  htmlFor="reason"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  Terfi Talebi Gerekçesi
                </label>

                <textarea
                  id="reason"
                  name="reason"
                  rows={5}
                  placeholder="Amir tarafından iletilen terfi talebi gerekçesini giriniz."
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border:
                      "1px solid #ccc",
                    resize:
                      "vertical",
                    font:
                      "inherit",
                  }}
                />
              </div>

              <div
                style={{
                  gridColumn:
                    "1 / -1",
                }}
              >
                <label
                  htmlFor="notes"
                  style={{
                    display: "block",
                    marginBottom: 7,
                    fontWeight: 600,
                  }}
                >
                  İK Notları
                </label>

                <textarea
                  id="notes"
                  name="notes"
                  rows={4}
                  placeholder="Varsa İK tarafından eklenecek notlar."
                  style={{
                    width: "100%",
                    padding: 12,
                    borderRadius: 8,
                    border:
                      "1px solid #ccc",
                    resize:
                      "vertical",
                    font:
                      "inherit",
                  }}
                />
              </div>
            </div>
          </section>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 16,
              paddingTop: 8,
            }}
          >
            <Link
              href="/terfi"
              className="muted"
            >
              Vazgeç
            </Link>

            <button
              type="submit"
              className="btn"
            >
              Terfi Talebini Kaydet
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

function Field({
  id,
  name,
  label,
  placeholder,
  required = false,
}: {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={id}
        style={{
          display: "block",
          marginBottom: 7,
          fontWeight: 600,
        }}
      >
        {label}
      </label>

      <input
        id={id}
        name={name}
        required={required}
        placeholder={placeholder}
        style={{
          width: "100%",
          padding: 12,
          borderRadius: 8,
          border: "1px solid #ccc",
        }}
      />
    </div>
  );
}