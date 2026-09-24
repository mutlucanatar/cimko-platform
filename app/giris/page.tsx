type Props = {
  searchParams: Promise<{
    hata?: string;
    redirect?: string;
  }>;
};

export default async function Giris({
  searchParams,
}: Props) {
  const { hata, redirect } = await searchParams;

  const hataMesaji =
    hata === "gecersiz"
      ? "E-posta veya şifre hatalı."
      : hata === "bilgileri-kontrol"
        ? "Lütfen e-posta ve şifre bilgilerini kontrol edin."
        : hata === "sistem"
          ? "Giriş sırasında bir hata oluştu."
          : null;

  const redirectTarget =
    redirect &&
    redirect.startsWith("/") &&
    !redirect.startsWith("//")
      ? redirect
      : "/panel";

  return (
    <main className="container">
      <div
        style={{
          maxWidth: 460,
          margin: "70px auto",
        }}
      >
        <div className="card">
          <h1>Kurumsal Giriş</h1>

          <p
            className="muted"
            style={{ marginTop: 8 }}
          >
            Çimko İK Platformu
          </p>

          {hataMesaji && (
            <div
              style={{
                marginTop: 18,
                padding: 12,
                borderRadius: 8,
                background: "#fef2f2",
                border: "1px solid #fecaca",
                color: "#991b1b",
              }}
            >
              {hataMesaji}
            </div>
          )}

          <form
            action="/api/auth/login"
            method="POST"
            style={{
              display: "grid",
              gap: 16,
              marginTop: 24,
            }}
          >
            <input
              type="hidden"
              name="redirect"
              value={redirectTarget}
            />

            <div>
              <label
                htmlFor="email"
                style={{
                  display: "block",
                  marginBottom: 7,
                  fontWeight: 600,
                }}
              >
                E-posta
              </label>

              <input
                id="email"
                name="email"
                type="email"
                autoComplete="username"
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
                Şifre
              </label>

              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
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

            <button
              className="button"
              type="submit"
              style={{
                marginTop: 4,
              }}
            >
              Giriş Yap
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}