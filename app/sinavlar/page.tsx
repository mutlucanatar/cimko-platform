import { db } from "@/lib/prisma";

export default async function Sinavlar() {
  const assignments = await db.assignment.findMany({ include:{application:{include:{candidate:true}}}, orderBy:{createdAt:"desc"}, take:50 });
  return <main className="container"><h1>Sınavlar</h1><p className="muted">Atama ve aday özetleri</p>
  <div className="card" style={{marginTop:18,padding:0,overflow:"hidden"}}><table><thead><tr><th>Aday</th><th>Durum</th><th>Erişim Kodu</th><th>Son Erişim</th></tr></thead><tbody>
  {assignments.map(a=><tr key={a.id}><td>{a.application.candidate.firstName} {a.application.candidate.lastName}</td><td>{a.status}</td><td>{a.accessCode}</td><td>{a.lastAccessAt?.toLocaleString("tr-TR") || "-"}</td></tr>)}
  </tbody></table></div></main>;
}
