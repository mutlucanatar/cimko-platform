import { db } from "@/lib/prisma";

export default async function Aday() {
  const pending = await db.assignment.findMany({ where:{status:"BEKLIYOR"}, include:{application:{include:{candidate:true}}}, take:20 });
  return <main className="container"><h1>Aday Sınav Girişi</h1><p className="muted">Seed sonrası oluşturulan bekleyen sınav atamalarındaki erişim kodları aşağıdaki örnekte görülebilir.</p>
    <div className="card" style={{marginTop:18}}><table><thead><tr><th>Aday</th><th>Erişim Kodu</th><th>Durum</th></tr></thead><tbody>
    {pending.map(a=><tr key={a.id}><td>{a.application.candidate.firstName} {a.application.candidate.lastName}</td><td>{a.accessCode}</td><td>{a.status}</td></tr>)}
    </tbody></table></div>
  </main>;
}
