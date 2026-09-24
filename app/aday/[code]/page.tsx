import StartExamButton from "@/components/exam/StartExamButton";
import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";

type Props = {
  params: Promise<{ code: string }>;
};

export default async function AdaySinav({ params }: Props) {
  const { code } = await params;

  const assignment = await db.assignment.findUnique({
    where: {
      accessCode: code,
    },
    include: {
      candidate: true,
      examPackage: true,
      tests: true,
    },
  });

  if (!assignment) {
    notFound();
  }
const nextTest = assignment.tests.find(
  (test) => test.status !== "TAMAMLANDI"
);
  return (
    <main className="container">
      <div
        className="card"
        style={{
          maxWidth: 720,
          margin: "60px auto",
          padding: 36,
        }}
      >
        <h1>Sınav Başlangıcı</h1>

        <p className="muted">
          Erişim kodunuz doğrulandı.
        </p>

        <hr style={{ margin: "24px 0" }} />

        <p>
          <strong>Aday:</strong>{" "}
          {assignment.candidate.firstName}{" "}
          {assignment.candidate.lastName}
        </p>

        <p>
          <strong>Sınav:</strong>{" "}
          {assignment.examPackage.name}
        </p>

        <p>
          <strong>Erişim Kodu:</strong>{" "}
          {assignment.accessCode}
        </p>

        <p>
          <strong>Test Sayısı:</strong>{" "}
          {assignment.tests.length}
        </p>
     {nextTest ? (
  <StartExamButton
    assignmentTestId={nextTest.id}
    href={`/aday/${assignment.accessCode}/sinav`}
    started={nextTest.status === "DEVAM"}
  />
) : (
  <div
    style={{
      marginTop: 24,
      padding: 18,
      borderRadius: 8,
      background: "#f3f4f6",
      textAlign: "center",
    }}
  >
    <strong>Sınav süreciniz tamamlandı.</strong>
    <p className="muted" style={{ marginTop: 8 }}>
      Size atanmış tüm testleri tamamladınız.
    </p>
  </div>
)}
      </div>
    </main>
  );
}