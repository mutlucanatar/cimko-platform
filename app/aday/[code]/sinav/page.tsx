import { notFound } from "next/navigation";
import { db } from "@/lib/prisma";
import ExamRunner from "@/components/exam/ExamRunner";

type Props = {
  params: Promise<{ code: string }>;
  searchParams: Promise<{ test?: string }>;
};

export default async function Sinav({
  params,
  searchParams,
}: Props) {
  const { code } = await params;
  const { test: requestedTestId } = await searchParams;

  const assignment = await db.assignment.findUnique({
    where: {
      accessCode: code,
    },
    include: {
      candidate: true,
      examPackage: {
        include: {
          tests: {
            orderBy: {
              order: "asc",
            },
            include: {
              testForm: true,
            },
          },
        },
      },
      tests: {
        orderBy: {
          id: "asc",
        },
        include: {
          answers: true,
          testForm: {
            include: {
              sections: {
                orderBy: {
                  order: "asc",
                },
                include: {
                  items: {
                    orderBy: {
                      order: "asc",
                    },
                    include: {
                      item: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  if (!assignment) {
    notFound();
  }

  /*
   * Önce URL'deki ?test= parametresini dikkate al.
   *
   * Örnek:
   * /aday/CMK-F1C0/sinav?test=abc123
   *
   * Böylece tamamlanan testten sonra özellikle
   * hangi AssignmentTest açılacağı belli olur.
   */
  let assignmentTest = requestedTestId
    ? assignment.tests.find(
        (test) => test.id === requestedTestId
      )
    : undefined;

  /*
   * URL'de test parametresi yoksa:
   * ilk tamamlanmamış testi aç.
   */
  if (!assignmentTest) {
    assignmentTest = assignment.tests.find(
      (test) => test.status !== "TAMAMLANDI"
    );
  }

  /*
   * Adayın bütün testleri tamamlandıysa
   * nihai tamamlanma ekranını göster.
   */
  if (!assignmentTest) {
    return (
      <main className="container">
        <div
          className="card"
          style={{
            maxWidth: 720,
            margin: "60px auto",
            padding: 36,
            textAlign: "center",
          }}
        >
          <h1>Sınav Süreciniz Tamamlandı</h1>

          <p
            className="muted"
            style={{ marginTop: 16 }}
          >
            Size atanmış tüm testleri tamamladınız.
          </p>

          <p style={{ marginTop: 24 }}>
            Teşekkür ederiz.
          </p>
        </div>
      </main>
    );
  }

  /*
   * URL'den bir test ID geldiyse fakat bu ID,
   * adayın sınavına ait değilse erişimi engelle.
   */
  if (
    requestedTestId &&
    !assignment.tests.some(
      (test) => test.id === requestedTestId
    )
  ) {
    return (
      <main className="container">
        <div
          className="card"
          style={{
            maxWidth: 720,
            margin: "60px auto",
            padding: 36,
            textAlign: "center",
          }}
        >
          <h1>Geçersiz test bağlantısı</h1>

          <p
            className="muted"
            style={{ marginTop: 16 }}
          >
            Bu test bu adayın sınav atamasına ait değil.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Test zaten tamamlanmışsa ve URL üzerinden tekrar
   * açılmaya çalışılıyorsa sonraki tamamlanmamış teste geç.
   */
  if (
    assignmentTest.status === "TAMAMLANDI" &&
    !requestedTestId
  ) {
    const nextTest = assignment.tests.find(
      (test) => test.status !== "TAMAMLANDI"
    );

    if (nextTest) {
      assignmentTest = nextTest;
    } else {
      return (
        <main className="container">
          <div
            className="card"
            style={{
              maxWidth: 720,
              margin: "60px auto",
              padding: 36,
              textAlign: "center",
            }}
          >
            <h1>Sınav Süreciniz Tamamlandı</h1>

            <p
              className="muted"
              style={{ marginTop: 16 }}
            >
              Size atanmış tüm testleri tamamladınız.
            </p>

            <p style={{ marginTop: 24 }}>
              Teşekkür ederiz.
            </p>
          </div>
        </main>
      );
    }
  }

  /*
   * Aktif testin ilk bölümü.
   */
  const section =
    assignmentTest.testForm.sections[
      assignmentTest.currentSection ?? 0
    ] ??
    assignmentTest.testForm.sections[0];

  if (!section) {
    return (
      <main className="container">
        <div
          className="card"
          style={{
            marginTop: 40,
            padding: 30,
          }}
        >
          <h1>Bölüm bulunamadı</h1>

          <p className="muted">
            Bu test için tanımlanmış bölüm bulunmuyor.
          </p>
        </div>
      </main>
    );
  }

  /*
   * Soruları ExamRunner'ın beklediği yapıya dönüştür.
   */
  const items = section.items.map(
    (testItem) => {
      let options: Array<{
        key: string;
        text: string;
        imageUrl?: string;
      }> = [];

      try {
        options = JSON.parse(
          testItem.item.options
        );
      } catch {
        options = [];
      }

      return {
        id: testItem.item.id,
        text: testItem.item.text,
        imageUrl: testItem.item.imageUrl,
        type: testItem.item.type,
        options,
      };
    }
  );

  /*
   * Daha önce verilmiş cevapları tekrar yükle.
   */
  const initialAnswers =
    Object.fromEntries(
      assignmentTest.answers
        .filter(
          (answer) =>
            answer.selectedKey
        )
        .map((answer) => [
          answer.itemId,
          answer.selectedKey as string,
        ])
    );

  /*
   * Test henüz başlamamışsa ExamRunner'a null gönderiyoruz.
   * Başlatma işlemi mevcut /api/exam/start akışı tarafından
   * yönetiliyorsa sayaç oradaki startedAt ile çalışacaktır.
   */
  return (
  <ExamRunner
    assignmentId={assignment.id}
    assignmentTestId={assignmentTest.id}
    startedAt={
      assignmentTest.startedAt?.toISOString() ??
      null
    }
    sectionDeadline={
  assignmentTest.sectionDeadline?.toISOString() ?? null
}
    candidateName={`${assignment.candidate.firstName} ${assignment.candidate.lastName}`}
    testName={assignmentTest.testForm.name}
    testKind={assignmentTest.testForm.kind}
    sectionName={section.name}
    currentSection={assignmentTest.currentSection ?? 0}
    totalSections={assignmentTest.testForm.sections.length}
    durationMin={section.durationMin}
    items={items}
    initialAnswers={initialAnswers}
  />
);
}