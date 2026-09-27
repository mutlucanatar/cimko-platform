import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/prisma";

const PROMOTION_EXAMS = [
  {
    current: "Yeni Üretim Elemanı",
    target: "Üretim Operatörü",
    formA: "GY-TRF-URT-A",
  },
  {
    current: "Elektrik Bakım Elemanı",
    target: "Elektrik Bakım Ustası",
    formA: "GY-TRF-ELE-A",
  },
  {
    current: "Mekanik Bakım Elemanı",
    target: "Mekanik Bakım Ustası",
    formA: "GY-TRF-MEK-A",
  },
  {
    current: "Laboratuvar İşçisi",
    target: "Laborant",
    formA: "GY-TRF-KAL-A",
  },
];

function generateAccessCode() {
  return `CMK-${randomBytes(3)
    .toString("hex")
    .slice(0, 4)
    .toUpperCase()}`;
}

async function createUniqueAccessCode() {
  for (let attempt = 0; attempt < 20; attempt++) {
    const accessCode = generateAccessCode();

    const existing =
      await db.promotionExam.findUnique({
        where: {
          accessCode,
        },
      });

    if (!existing) {
      return accessCode;
    }
  }

  throw new Error(
    "Benzersiz terfi sınavı erişim kodu üretilemedi."
  );
}

export async function POST(
  _request: Request,
  context: {
    params: Promise<{ id: string }>;
  }
) {
  try {
    const { id } = await context.params;

    const promotionRequest =
      await db.promotionRequest.findUnique({
        where: {
          id,
        },
        include: {
          currentPosition: true,
          targetPosition: true,
          promotionPeriod: true,
          exams: {
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

    if (!promotionRequest) {
      return NextResponse.json(
        {
          error:
            "Terfi talebi bulunamadı.",
        },
        { status: 404 }
      );
    }

    if (
      promotionRequest.status ===
      "IPTAL"
    ) {
      return NextResponse.json(
        {
          error:
            "İptal edilmiş terfi talebine sınav atanamaz.",
        },
        { status: 400 }
      );
    }

    if (
      promotionRequest.exams.length >
      0
    ) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: `/terfi/${promotionRequest.id}`,
        },
      });
    }

    const examConfig =
      PROMOTION_EXAMS.find(
        (item) =>
          item.current ===
            promotionRequest
              .currentPosition.name &&
          item.target ===
            promotionRequest
              .targetPosition.name
      );

    if (!examConfig) {
      return NextResponse.json(
        {
          error:
            "Bu terfi yolu için sınav tanımlanmamış.",
        },
        { status: 400 }
      );
    }

    const [abilityForm, cke] =
      await Promise.all([
        db.testForm.findUnique({
          where: {
            code: examConfig.formA,
          },
        }),

        db.testForm.findUnique({
          where: {
            code: "CKE-01",
          },
        }),
      ]);

    if (!abilityForm) {
      return NextResponse.json(
        {
          error: `${examConfig.formA} bulunamadı.`,
        },
        { status: 400 }
      );
    }

    if (!cke) {
      return NextResponse.json(
        {
          error:
            "CKE-01 bulunamadı.",
        },
        { status: 400 }
      );
    }

    const accessCode =
      await createUniqueAccessCode();

    await db.$transaction(
      async (tx) => {
        await tx.promotionExam.create({
          data: {
            promotionRequestId:
              promotionRequest.id,

            promotionPeriodId:
              promotionRequest
                .promotionPeriodId,

            attemptNo: 1,

            status:
              "ATANMADI",

            result: "",

            accessCode,
            expiresAt: null,

            tests: {
              create: [
                {
                  testFormId:
                    abilityForm.id,
                  status:
                    "BASLAMADI",
                  currentSection: 0,
                  itemOrder: "[]",
                  resultJson: "{}",
                },
                {
                  testFormId:
                    cke.id,
                  status:
                    "BASLAMADI",
                  currentSection: 0,
                  itemOrder: "[]",
                  resultJson: "{}",
                },
              ],
            },
          },
        });

        await tx.promotionRequest.update({
          where: {
            id: promotionRequest.id,
          },
          data: {
            status:
              "SINAV_ATANDI",
          },
        });
      }
    );

    return new Response(null, {
      status: 303,
      headers: {
        Location: `/terfi/${promotionRequest.id}`,
      },
    });
  } catch (error) {
    console.error(
      "Terfi sınavı atama hatası:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Terfi sınavı atanamadı.",
      },
      { status: 500 }
    );
  }
}