import Link from "next/link";

export default function Home() {
  return <main className="container">
    <section className="hero">
      <h1>Çimko İK Platformu</h1>
      <p>Mavi yaka işe alım, sınav/değerlendirme, yetkinlik ve performans süreçlerini tek platformda toplamak üzere hazırlanan MVP demo arayüzü.</p>
      <div className="actions"><Link className="btn" href="/panel">Demo panele geç</Link><Link className="btn secondary" href="/aday">Aday Sınav Girişi</Link></div>
    </section>
    <div className="grid">
      <div className="card"><h3>Aday Yönetimi</h3><p className="muted">Aday havuzu ve başvuru kayıtlarını görüntüleme.</p></div>
      <div className="card"><h3>Sınavlar</h3><p className="muted">Test paketleri ve bekleyen atamalar için başlangıç ekranı.</p></div>
      <div className="card"><h3>Organizasyon</h3><p className="muted">Tesis → bölüm → pozisyon yapısının Prisma modeli hazırdır.</p></div>
      <div className="card"><h3>Performans</h3><p className="muted">İkinci faz performans iskeleti veri modelinde korunmaktadır.</p></div>
    </div>
  </main>;
}
