import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { randomBytes } from "crypto";

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
    const { id: candidateId } = await params;

    const formData = await request.formData();

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
      position.examPackage.tests.length === 0
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
     * Aynı adayın aynı pozisyon için zaten
     * aktif bir sınav ataması varsa tekrar oluşturma.
     */
    const existingAssignment =
      await db.assignment.findFirst({
        where: {
          candidateId,
          positionId,
          tests: {
            some: {},
          },
        },
        orderBy: {
          createdAt: "desc",
        },
      });

    if (existingAssignment) {
      return NextResponse.json(
        {
          error:
            "Bu aday için bu pozisyona zaten bir sınav ataması bulunuyor.",
          accessCode:
            existingAssignment.accessCode,
        },
        { status: 409 }
      );
    }

    let accessCode = "";

    for (let attempt = 0; attempt < 20; attempt++) {
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
     * Application kaydı da oluştur.
     * Adayın işe alım sürecindeki pozisyon ilişkisini
     * Assignment'dan bağımsız olarak koruyoruz.
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
                position.examPackage!.id,
              positionId,
              accessCode,
              kvkkAccepted: false,
            },
          });

        for (const packageTest of position
          .examPackage!.tests) {
          await tx.assignmentTest.create({
            data: {
              assignmentId:
                assignment.id,
              testFormId:
                packageTest.testFormId,
              status: "BASLAMADI",
              currentSection: 0,
              resultJson: "{}",
              itemOrder: "[]",
            },
          });
        }
      }
    );

    return new Response(null, {
  status: 303,
  headers: {
    Location: `/adaylar/${candidateId}`,
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