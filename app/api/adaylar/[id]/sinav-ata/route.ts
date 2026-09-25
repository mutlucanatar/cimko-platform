import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { randomBytes } from "crypto";
import { getSession } from "@/lib/auth";
import { getExamRetryConfig } from "@/lib/exam-retry-config";

type Params = {
  params: Promise<{ id: string }>;
};

function generateAccessCode() {
  return `CMK-${randomBytes(3)
    .toString("hex")
    .slice(0, 4)
    .toUpperCase()}`;
}

export async function POST(
  request: Request,
  { params }: Params
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        {
          error:
            "Kurumsal giriş yapmanız gerekiyor.",
        },
        { status: 401 }
      );
    }

    const { id: candidateId } =
      await params;

    const formData =
      await request.formData();

    const positionId = String(
      formData.get("positionId") ?? ""
    ).trim();

    if (!positionId) {
      return NextResponse.json(
        {
          error: "Pozisyon seçiniz.",
        },
        { status: 400 }
      );
    }

    const candidate =
      await db.candidate.findUnique({
        where: {
          id: candidateId,
        },
      });

    if (!candidate) {
      return NextResponse.json(
        {
          error: "Aday bulunamadı.",
        },
        { status: 404 }
      );
    }

    const position =
      await db.position.findUnique({
        where: {
          id: positionId,
        },
        include: {
          examPackage: {
            include: {
              tests: {
                orderBy: {
                  order: "asc",
                },
              },
            },
          },
        },
      });

    if (!position) {
      return NextResponse.json(
        {
          error: "Pozisyon bulunamadı.",
        },
        { status: 404 }
      );
    }

    if (!position.isActive) {
      return NextResponse.json(
        {
          error:
            "Seçilen pozisyon aktif değil.",
        },
        { status: 400 }
      );
    }

    if (!position.examPackage) {
      return NextResponse.json(
        {
          error:
            "Bu pozisyon için sınav paketi tanımlanmamış.",
        },
        { status: 400 }
      );
    }

    if (
      position.examPackage.tests.length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "Bu sınav paketinde test bulunmuyor.",
        },
        { status: 400 }
      );
    }

    /*
     * Pozisyon için tekrar sınavı konfigürasyonu.
     *
     * Örnek:
     * Yeni Üretim Elemanı
     * GY-YUR -> GY-YUR-B
     */
    const retryConfig =
      getExamRetryConfig(
        position.name
      );

    /*
     * -------------------------------------------------------
     * SINAV GEÇMİŞİ
     * -------------------------------------------------------
     */

    const previousAssignments =
      await db.assignment.findMany({
        where: {
          candidateId,
          positionId,
        },
        include: {
          tests: {
            include: {
              testForm: true,
            },
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    /*
     * Devam eden atama varsa yeni atama
     * oluşturma.
     */
    const activeAssignment =
      previousAssignments.find(
        (assignment) =>
          assignment.tests.length > 0 &&
          assignment.tests.some(
            (test) =>
              test.status !==
              "TAMAMLANDI"
          )
      );

    if (activeAssignment) {
      return NextResponse.json(
        {
          error:
            "Bu aday için bu pozisyonda devam eden bir sınav ataması bulunuyor.",
          accessCode:
            activeAssignment.accessCode,
        },
        { status: 409 }
      );
    }

    /*
     * Tamamlanmış yetenek testlerini bul.
     */
    const abilityTests =
      previousAssignments.flatMap(
        (assignment) =>
          assignment.tests
            .filter(
              (test) =>
                test.testForm.kind ===
                  "YETENEK" &&
                test.status ===
                  "TAMAMLANDI" &&
                test.completedAt !==
                  null
            )
            .map((test) => ({
              test,
              assignment,
            }))
      );

    const latestAbilityTest =
      abilityTests.sort(
        (a, b) =>
          b.test.completedAt!.getTime() -
          a.test.completedAt!.getTime()
      )[0];

    /*
     * Başlangıçta pozisyonun normal paketi.
     */
    let selectedPackageId =
      position.examPackage.id;

    let isEarlyRetry = false;
    let earlyRetryReason = "";

    /*
     * -------------------------------------------------------
     * İLK FORM / TEKRAR FORMU
     * -------------------------------------------------------
     */

    if (
      latestAbilityTest &&
      retryConfig
    ) {
      const latestAbilityFormCode =
        latestAbilityTest.test.testForm.code;

      /*
       * Tekrar formu daha önce tamamlandıysa
       * yeni bir tekrar ataması yok.
       */
      if (
        latestAbilityFormCode ===
        retryConfig.retryFormCode
      ) {
        return NextResponse.json(
          {
            error:
              "Aday alternatif Genel Yetenek tekrar sınavını daha önce tamamlamış. Yeni bir alternatif form henüz tanımlanmamıştır.",
          },
          { status: 409 }
        );
      }

      /*
       * İlk form üzerinden tekrar süreci.
       */
      if (
        latestAbilityFormCode ===
        retryConfig.firstFormCode
      ) {
        let result: {
          passed?: boolean;
          result?: string;
        } = {};

        try {
          result = JSON.parse(
            latestAbilityTest.test
              .resultJson || "{}"
          );
        } catch {
          result = {};
        }

        /*
         * İlk Genel Yetenek sınavı başarılıysa
         * tekrar sınavı açılmaz.
         */
        if (result.passed === true) {
          return NextResponse.json(
            {
              error:
                "Bu adayın bu pozisyon için Genel Yetenek sınavı başarılıdır. Yeni sınav atanamaz.",
            },
            { status: 409 }
          );
        }

        /*
         * İlk sınav başarısız.
         */
        if (
          result.passed === false
        ) {
          const completedAt =
            latestAbilityTest.test
              .completedAt;

          if (!completedAt) {
            return NextResponse.json(
              {
                error:
                  "Tamamlanmış Genel Yetenek sınavının tamamlanma tarihi bulunamadı.",
              },
              { status: 500 }
            );
          }

          const retryDate =
            new Date(completedAt);

          retryDate.setMonth(
            retryDate.getMonth() +
              retryConfig.waitMonths
          );

          const now = new Date();

          /*
           * 3 ay dolmamışsa:
           * normal kullanıcı engellenir.
           */
          if (now < retryDate) {
            if (
              session.role !==
              "SISTEM_YONETICISI"
            ) {
              return NextResponse.json(
                {
                  error:
                    "Adayın tekrar sınav hakkı henüz oluşmadı.",
                  retryDate:
                    retryDate.toISOString(),
                },
                { status: 403 }
              );
            }

            /*
             * Sistem yöneticisi erken tekrar
             * verebilir. Gerekçe zorunlu.
             */
            earlyRetryReason =
              String(
                formData.get(
                  "earlyRetryReason"
                ) ?? ""
              ).trim();

            if (!earlyRetryReason) {
              return NextResponse.json(
                {
                  error:
                    "3 aylık süre dolmadan tekrar sınavı atamak için gerekçe girilmelidir.",
                },
                { status: 400 }
              );
            }

            isEarlyRetry = true;
          }

          /*
           * Uygun tekrar paketini bul.
           */
          const retryPackage =
            await db.examPackage.findFirst(
              {
                where: {
                  name:
                    retryConfig.retryPackageName,
                  isActive: true,
                },
              }
            );

          if (!retryPackage) {
            return NextResponse.json(
              {
                error:
                  `${position.name} için tekrar sınav paketi bulunamadı.`,
              },
              { status: 500 }
            );
          }

          selectedPackageId =
            retryPackage.id;
        }
      }
    }

    /*
     * -------------------------------------------------------
     * SEÇİLEN PAKET
     * -------------------------------------------------------
     */

    const selectedPackage =
      await db.examPackage.findUnique({
        where: {
          id: selectedPackageId,
        },
        include: {
          tests: {
            orderBy: {
              order: "asc",
            },
          },
        },
      });

    if (!selectedPackage) {
      return NextResponse.json(
        {
          error:
            "Seçilen sınav paketi bulunamadı.",
        },
        { status: 500 }
      );
    }

    if (
      selectedPackage.tests.length ===
      0
    ) {
      return NextResponse.json(
        {
          error:
            "Seçilen sınav paketinde test bulunmuyor.",
        },
        { status: 500 }
      );
    }

    /*
     * -------------------------------------------------------
     * ERİŞİM KODU
     * -------------------------------------------------------
     */

    let accessCode = "";

    for (
      let attempt = 0;
      attempt < 20;
      attempt++
    ) {
      const candidateCode =
        generateAccessCode();

      const existingCode =
        await db.assignment.findUnique({
          where: {
            accessCode: candidateCode,
          },
        });

      if (!existingCode) {
        accessCode = candidateCode;
        break;
      }
    }

    if (!accessCode) {
      return NextResponse.json(
        {
          error:
            "Benzersiz erişim kodu üretilemedi.",
        },
        { status: 500 }
      );
    }

    /*
     * -------------------------------------------------------
     * ATAMA + APPLICATION + AUDIT
     * -------------------------------------------------------
     */

    await db.$transaction(
      async (tx) => {
        await tx.application.create({
          data: {
            candidateId,
            positionId,
            stage: "TEST_BEKLIYOR",
            status: "AKTIF",
          },
        });

        const assignment =
          await tx.assignment.create({
            data: {
              candidateId,
              examPackageId:
                selectedPackage.id,
              positionId,
              accessCode,
              kvkkAccepted: false,
            },
          });

        for (
          const packageTest of
            selectedPackage.tests
        ) {
          await tx.assignmentTest.create(
            {
              data: {
                assignmentId:
                  assignment.id,
                testFormId:
                  packageTest.testFormId,
                status:
                  "BASLAMADI",
                currentSection: 0,
                resultJson: "{}",
                itemOrder: "[]",
              },
            }
          );
        }

        /*
         * Erken tekrar işlemi ile atama
         * aynı transaction içinde audit edilir.
         */
        if (isEarlyRetry) {
          await tx.auditLog.create({
            data: {
              userId: session.id,
              actorType: "USER",
              action: "CREATE",
              entity: "Assignment",
              entityId:
                assignment.id,
              detail:
                JSON.stringify({
                  type:
                    "EARLY_RETRY_EXAM",
                  candidateId,
                  positionId,
                  assignmentId:
                    assignment.id,
                  previousAssignmentId:
                    latestAbilityTest
                      ?.assignment.id ?? "",
                  previousTestFormId:
                    latestAbilityTest
                      ?.test.testFormId ?? "",
                  reason:
                    earlyRetryReason,
                }),
            },
          });
        }
      }
    );

    return new Response(null, {
      status: 303,
      headers: {
        Location:
          `/adaylar/${candidateId}`,
      },
    });
  } catch (error) {
    console.error(
      "Sınav atama hatası:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Sınav atanırken bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}