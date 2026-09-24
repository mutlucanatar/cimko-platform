import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import {
  scoreAbilityTest,
  scorePersonalityTest,
  scoreAttitudeTest,
} from "../../../../src/lib/scoring";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { assignmentTestId } = body;

    if (!assignmentTestId) {
      return NextResponse.json(
        { error: "assignmentTestId gerekli." },
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

          assignment: {
            include: {
              position: {
                include: {
                  assessmentModel: {
                    include: {
                      tests: true,
                    },
                  },

                  personalityRanges: {
                    include: {
                      dimension: true,
                    },
                  },
                },
              },

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
            },
          },
        },
      });

    if (!assignmentTest) {
      return NextResponse.json(
        { error: "Sınav ataması bulunamadı." },
        { status: 404 }
      );
    }

    const position =
      assignmentTest.assignment.position;

    /*
     * Testteki bütün maddeleri düz listeye çevir.
     */
    const allItems =
      assignmentTest.testForm.sections.flatMap(
        (section) =>
          section.items.map(
            (testItem) => testItem.item
          )
      );

    /*
     * scoring.ts fonksiyonlarının beklediği yapı.
     */
    const scoreItems = allItems.map(
      (item) => ({
        id: item.id,
        type: item.type,
        dimension: item.dimension,
        personalityDimId:
          item.personalityDimId,
        direction: item.direction,
        correctKey: item.correctKey,
        options: item.options,
      })
    );

    const scoreAnswers =
      assignmentTest.answers.map(
        (answer) => ({
          itemId: answer.itemId,
          selectedKey:
            answer.selectedKey,
          isCorrect: answer.isCorrect,
        })
      );

    let totalScore = 0;
    let resultJson = "{}";

    /*
     * -------------------------------------------------------
     * YETENEK TESTİ
     * -------------------------------------------------------
     */
    if (
      assignmentTest.testForm.kind ===
      "YETENEK"
    ) {
      /*
       * Öncelikle yeni AssessmentModelTest
       * yapılandırmasını kullan.
       */
      const assessmentModelTest =
        position?.assessmentModel?.tests.find(
          (modelTest) =>
            modelTest.testFormId ===
            assignmentTest.testFormId
        );

      const cutoffScore =
        assessmentModelTest?.cutoffScore ??
        position?.cutoffScore ??
        50;

      const normScore =
        assessmentModelTest?.normScore ??
        position?.normScore ??
        65;

      const result = scoreAbilityTest(
        scoreItems,
        scoreAnswers,
        cutoffScore,
        normScore
      );

      totalScore = result.totalScore;
      resultJson = JSON.stringify(result);
    }

    /*
     * -------------------------------------------------------
     * KİŞİLİK ENVANTERİ
     * -------------------------------------------------------
     */
    else if (
      assignmentTest.testForm.kind ===
      "KISILIK"
    ) {
      if (!position) {
        return NextResponse.json(
          {
            error:
              "Kişilik değerlendirmesi için adayın hedef pozisyonu bulunamadı.",
          },
          { status: 400 }
        );
      }

      const ranges =
        position.personalityRanges.map(
          (range) => ({
            dimensionId:
              range.dimensionId,
            code: range.dimension.code,
            name: range.dimension.name,
            minValue: range.minValue,
            maxValue: range.maxValue,
          })
        );

      const dimNames = new Map(
        position.personalityRanges.map(
          (range) => [
            range.dimensionId,
            {
              code: range.dimension.code,
              name: range.dimension.name,
            },
          ]
        )
      );

      const result =
        scorePersonalityTest(
          scoreItems,
          scoreAnswers,
          ranges,
          dimNames
        );

      totalScore =
        result.fitPercent ?? 0;

      resultJson =
        JSON.stringify(result);
    }

    /*
     * -------------------------------------------------------
     * TUTUM / DİĞER ÖLÇEKLER
     * -------------------------------------------------------
     */
    else {
      const result =
        scoreAttitudeTest(
          scoreItems,
          scoreAnswers
        );

      totalScore = result.totalScore;
      resultJson =
        JSON.stringify(result);
    }

    /*
     * Testi puanıyla birlikte tamamla.
     */
    if (
      assignmentTest.status !==
      "TAMAMLANDI"
    ) {
      await db.assignmentTest.update({
        where: {
          id: assignmentTest.id,
        },
        data: {
          status: "TAMAMLANDI",
          completedAt: new Date(),
          totalScore,
          resultJson,
        },
      });
    } else {
      /*
       * Test daha önce tamamlanmış olsa bile
       * eski kayıtta puan yoksa yeniden hesaplanan
       * sonucu kaydedebilmek için güncelliyoruz.
       */
      await db.assignmentTest.update({
        where: {
          id: assignmentTest.id,
        },
        data: {
          totalScore,
          resultJson,
        },
      });
    }

    /*
     * -------------------------------------------------------
     * SIRADAKİ TEST
     * -------------------------------------------------------
     */

    const packageTests =
      assignmentTest.assignment
        .examPackage.tests;

    const currentIndex =
      packageTests.findIndex(
        (packageTest) =>
          packageTest.testFormId ===
          assignmentTest.testFormId
      );

    const nextPackageTest =
      currentIndex >= 0
        ? packageTests[
            currentIndex + 1
          ]
        : undefined;

    /*
     * Başka test yoksa bütün sınav tamamlandı.
     */
    if (!nextPackageTest) {
      return NextResponse.json({
        success: true,
        examCompleted: true,
        nextTest: null,
        result: {
          totalScore,
        },
      });
    }

    const nextAssignmentTest =
      await db.assignmentTest.findUnique({
        where: {
          assignmentId_testFormId: {
            assignmentId:
              assignmentTest.assignmentId,
            testFormId:
              nextPackageTest.testFormId,
          },
        },
        include: {
          testForm: true,
        },
      });

    if (!nextAssignmentTest) {
      return NextResponse.json(
        {
          error:
            "Sıradaki test bulundu ancak aday için test ataması bulunamadı.",
        },
        { status: 500 }
      );
    }

    /*
     * Sıradaki test henüz başlamadıysa başlat.
     */
    let startedNextTest =
      nextAssignmentTest;

    if (
      nextAssignmentTest.status ===
      "BASLAMADI"
    ) {
      startedNextTest =
        await db.assignmentTest.update({
          where: {
            id: nextAssignmentTest.id,
          },
          data: {
            status: "DEVAM",
            startedAt: new Date(),
            currentSection: 0,
          },
          include: {
            testForm: true,
          },
        });
    }

    return NextResponse.json({
      success: true,

      examCompleted: false,

      result: {
        totalScore,
      },

      nextTest: {
        assignmentTestId:
          startedNextTest.id,

        testFormId:
          startedNextTest.testFormId,

        testFormName:
          startedNextTest.testForm.name,
      },
    });
  } catch (error) {
    console.error(
      "Sınav tamamlama ve puanlama hatası:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Sınav tamamlanamadı veya puanlanamadı.",
      },
      { status: 500 }
    );
  }
}