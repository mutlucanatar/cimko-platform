import { db } from "@/lib/prisma";

export default async function Adaylar() {
  const candidates = await db.candidate.findMany({ orderBy:{createdAt:"desc"}, take:50 });
  return <main className="container"><h1>Adaylar</h1><p className="muted">Son 50 aday kaydı</p>
    <div className="card" style={{marginTop:18, padding:0, overflow:"hidden"}}><table><thead><tr><th>Ad Soyad</th><th>Telefon</th><th>E-posta</th><th>Kaynak</th><th>Durum</th></tr></thead><tbody>
      {candidates.map(c=><tr key={c.id}><td>{c.firstName} {c.lastName}</td><td>{c.phone || "-"}</td><td>{c.email || "-"}</td><td>{c.source}</td><td>{c.status}</td></tr>)}
    </tbody></table></div>
  </main>;
}
