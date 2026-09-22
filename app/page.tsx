const assignments = [
  {
    id: 1,
    name: "Ayşe Demir",
    status: "BEKLİYOR",
    code: "CMK-4821",
    last: "-",
  },
  {
    id: 2,
    name: "Mehmet Kaya",
    status: "TAMAMLANDI",
    code: "CMK-7354",
    last: "22.09.2026 14:30",
  },
];

export default function Sinavlar() {
  return (
    <main className="container">
      <h1>Sınavlar</h1>
      <p className="muted">Demo sınav atamaları</p>

      <div
        className="card"
        style={{
          marginTop: 18,
          padding: 0,
          overflow: "hidden",
        }}
      >
        <table>
          <thead>
            <tr>
              <th>Aday</th>
              <th>Durum</th>
              <th>Erişim Kodu</th>
              <th>Son Erişim</th>
            </tr>
          </thead>

          <tbody>
            {assignments.map((a) => (
              <tr key={a.id}>
                <td>{a.name}</td>
                <td>{a.status}</td>
                <td>{a.code}</td>
                <td>{a.last}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </main>
  );
}
