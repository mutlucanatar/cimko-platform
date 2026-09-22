import Link from "next/link";

const items = [
  ["Panel", "/panel"],
  ["Adaylar", "/adaylar"],
  ["Sınavlar", "/sinavlar"],
  ["Aday Sınav Girişi", "/aday"],
];

export function Nav() {
  return (
    <nav className="nav">
      <div className="brand">ÇİMKO <span>İK PLATFORMU</span></div>
      <div className="links">
        {items.map(([label, href]) => <Link key={href} href={href}>{label}</Link>)}
        <Link className="login" href="/giris">Kurumsal Giriş</Link>
      </div>
    </nav>
  );
}
