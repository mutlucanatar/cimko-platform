import Link from "next/link";
import Image from "next/image";
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

export async function Nav() {
  const session = await getSession();

  return (
    <nav className="nav">
      {/* LOGO */}
      <Link
        href="/"
        style={{
          display: "flex",
          alignItems: "center",
          textDecoration: "none",
          flexShrink: 0,
        }}
      >
        <Image
          src="/images/CIMKO_LOGO.jpg"
          alt="Çimko"
          width={110}
          height={97}
          priority
          style={{
            width: 82,
            height: "auto",
            objectFit: "contain",
          }}
        />
      </Link>

      <div className="links">
        {session ? (
          <>
            {/* KURUMSAL MENÜ */}
            <Link href="/panel">
              Panel
            </Link>

            <Link href="/adaylar">
              Adaylar
            </Link>

            <Link href="/sinavlar">
              Sınavlar
            </Link>
{session.role === "SISTEM_YONETICISI" && (
  <Link href="/kullanicilar">
    Kullanıcılar
  </Link>
)}
            <Link href="/aday">
              Aday Sınav Girişi
            </Link>

            {/* KULLANICI */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                lineHeight: 1.2,
                marginLeft: 12,
                textAlign: "right",
              }}
            >
              <strong
                style={{
                  fontSize: 13,
                }}
              >
                {session.firstName}{" "}
                {session.lastName}
              </strong>

              <span
                className="muted"
                style={{
                  fontSize: 11,
                }}
              >
                {roleLabels[session.role] ??
                  session.role}
              </span>
            </div>

            <form
              action="/api/auth/logout"
              method="POST"
              style={{ margin: 0 }}
            >
              <button
                type="submit"
                className="login"
                style={{
                  cursor: "pointer",
                  background: "transparent",
                  font: "inherit",
                }}
              >
                Çıkış Yap
              </button>
            </form>
          </>
        ) : (
          <>
            {/* KARİYER PORTALI MENÜSÜ */}
            <Link href="/#pozisyonlar">
              Açık Pozisyonlar
            </Link>

            <Link href="/#gencimko">
              GENÇimko
            </Link>

            <Link href="/#cimkoda-yasam">
              Çimko&apos;da Yaşam
            </Link>

            <Link href="/aday">
              Aday Sınav Girişi
            </Link>

            <Link
              className="login"
              href="/giris"
            >
              Kurumsal Giriş
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}