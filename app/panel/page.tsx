import { db } from "@/lib/prisma";

export default async function Panel() {
  const [candidates, vacancies, users, assignments] = await Promise.all([
    db.candidate.count(), db.vacancy.count(), db.user.count(), db.assignment.count()
  ]);
  return <main className="container">
    <h1>Panel</h1><p className="muted">Demo veritabanındaki özet göstergeler.</p>
    <div className="grid" style={{marginTop:18}}>
      {[["Aday", candidates],["İlan", vacancies],["Kullanıcı", users],["Sınav Ataması", assignments]].map(([label,val])=><div className="card" key={String(label)}><div className="muted">{label}</div><div className="metric">{val}</div></div>)}
    </div>
    <div className="notice">Bu sürüm, mevcut belgelerde tanımlanan MVP'nin yeniden ayağa kaldırılması için hazırlanmış bir başlangıç uygulamasıdır. Rol bazlı kimlik doğrulama ve tüm CRUD ekranları sonraki adımda genişletilebilir.</div>
  </main>;
}
