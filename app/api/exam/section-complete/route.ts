import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      assignmentTestId,
      currentSection,
    } = body;

    if (!assignmentTestId) {
      return NextResponse.json(
        {
          error: "assignmentTestId gerekli.",
        },
        { status: 400 }
      );
    }

    if (typeof currentSection !== "number") {
      return NextResponse.json(
        {
          error: "currentSection gerekli.",
        },
        { status: 400 }
      );
    }

    const assignmentTest =
      await db.assignmentTest.findUnique({
        where: {
          id: assignmentTestId,
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
                    include: {
                      item: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

    if (!assignmentTest) {
      return NextResponse.json(
        {
          error: "Sınav ataması bulunamadı.",
        },
        { status: 404 }
      );
    }

    if (
      assignmentTest.status === "TAMAMLANDI"
    ) {
      return NextResponse.json(
        {
          error:
            "Bu test daha önce tamamlanmış.",
        },
        { status: 400 }
      );
    }

    const sections =
      assignmentTest.testForm.sections;

    const section =
      sections[currentSection];

    if (!section) {
      return NextResponse.json(
        {
          error: "Sınav bölümü bulunamadı.",
        },
        { status: 404 }
      );
    }

    /*
     * KİŞİLİK ENVANTERİ
     *
     * Mevcut bölümdeki bütün soruların
     * cevaplanmasını zorunlu tutuyoruz.
     */
    if (
      assignmentTest.testForm.kind ===
      "KISILIK"
    ) {
      const sectionItemIds =
        section.items.map(
          (testItem) =>
            testItem.itemId
        );

      const answeredItemIds =
        new Set(
          assignmentTest.answers
            .filter(
              (answer) =>
                answer.selectedKey != null
            )
            .map(
              (answer) =>
                answer.itemId
            )
        );

      const unanswered =
        sectionItemIds.filter(
          (itemId) =>
            !answeredItemIds.has(itemId)
        );

      if (unanswered.length > 0) {
        return NextResponse.json(
          {
            error:
              `Bu bölümde ${unanswered.length} soruyu henüz yanıtlamadınız. ` +
              "Kişilik envanterinde tüm soruların yanıtlanması gerekmektedir.",

            unansweredCount:
              unanswered.length,
          },
          { status: 400 }
        );
      }
    }

    /*
     * Sıradaki bölümün index'i.
     */
    const nextSectionIndex =
      currentSection + 1;

    /*
     * --------------------------------------------------
     * AYNI TEST İÇERİSİNDE BAŞKA BÖLÜM VAR
     * --------------------------------------------------
     */
    if (
      nextSectionIndex < sections.length
    ) {
      const nextSection =
        sections[nextSectionIndex];

      /*
       * Yeni bölüm için yeni süre başlat.
       */
      const nextDeadline =
        new Date(
          Date.now() +
            nextSection.durationMin *
              60 *
              1000
        );

      await db.assignmentTest.update({
        where: {
          id: assignmentTestId,
        },

        data: {
          currentSection:
            nextSectionIndex,

          sectionDeadline:
            nextDeadline,
        },
      });

      return NextResponse.json({
        success: true,

        testCompleted: false,

        nextSection:
          nextSectionIndex,

        totalSections:
          sections.length,

        sectionDeadline:
          nextDeadline.toISOString(),
      });
    }

    /*
     * --------------------------------------------------
     * SON BÖLÜM
     * --------------------------------------------------
     *
     * Burada AssignmentTest'i henüz TAMAMLANDI
     * yapmıyoruz.
     *
     * ExamRunner daha sonra:
     *
     * /api/exam/complete
     *
     * endpoint'ini çağıracak.
     *
     * Puanlama da orada yapılacak.
     */
    return NextResponse.json({
      success: true,

      testCompleted: true,

      nextSection: null,

      totalSections:
        sections.length,
    });
  } catch (error) {
    console.error(
      "Bölüm tamamlama hatası:",
      error
    );

    return NextResponse.json(
      {
        error: "Bölüm tamamlanamadı.",
      },
      { status: 500 }
    );
  }
}