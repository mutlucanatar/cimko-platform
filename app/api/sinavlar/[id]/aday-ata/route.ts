import { NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { db } from "@/lib/prisma";

type Props = {
  params: Promise<{ id: string }>;
};

function generateAccessCode() {
  return `CMK-${randomBytes(3)
    .toString("hex")
    .toUpperCase()
    .slice(0, 4)}`;
}

export async function POST(
  request: Request,
  { params }: Props
) {
  try {
    const { id } = await params;

    const formData = await request.formData();

    const candidateId = String(
      formData.get("candidateId") || ""
    );

    const positionIdValue = String(
      formData.get("positionId") || ""
    );

    const positionId = positionIdValue || null;

    if (!candidateId) {
      return NextResponse.json(
        { error: "Aday seçimi zorunludur." },
        { status: 400 }
      );
    }

    const examPackage = await db.examPackage.findUnique({
      where: {
        id,
      },
      include: {
        tests: {
          orderBy: {
            order: "asc",
          },
        },
      },
    });

    if (!examPackage) {
      return NextResponse.json(
        { error: "Sınav bulunamadı." },
        { status: 404 }
      );
    }

    if (!examPackage.isActive) {
      return NextResponse.json(
        { error: "Bu sınav aktif değil." },
        { status: 400 }
      );
    }

    if (examPackage.tests.length === 0) {
      return NextResponse.json(
        { error: "Bu sınava henüz test eklenmemiş." },
        { status: 400 }
      );
    }

    const candidate = await db.candidate.findUnique({
      where: {
        id: candidateId,
      },
    });

    if (!candidate) {
      return NextResponse.json(
        { error: "Aday bulunamadı." },
        { status: 404 }
      );
    }

    if (positionId) {
      const position = await db.position.findUnique({
        where: {
          id: positionId,
        },
      });

      if (!position) {
        return NextResponse.json(
          { error: "Pozisyon bulunamadı." },
          { status: 404 }
        );
      }
    }

    const existingAssignment =
      await db.assignment.findFirst({
        where: {
          examPackageId: id,
          candidateId,
        },
      });

    if (existingAssignment) {
      return NextResponse.json(
        {
          error:
            "Bu aday bu sınava daha önce atanmış.",
        },
        { status: 409 }
      );
    }

    let accessCode = "";

    for (let i = 0; i < 10; i++) {
      const candidateCode = generateAccessCode();

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
        { error: "Erişim kodu üretilemedi." },
        { status: 500 }
      );
    }

    await db.$transaction(async (tx) => {
      const assignment =
        await tx.assignment.create({
          data: {
            candidateId,
            examPackageId: id,
            positionId,
            accessCode,
            kvkkAccepted: false,
          },
        });

      for (const packageTest of examPackage.tests) {
        await tx.assignmentTest.create({
          data: {
            assignmentId: assignment.id,
            testFormId: packageTest.testFormId,
            status: "BASLAMADI",
            currentSection: 0,
            resultJson: "{}",
            itemOrder: "[]",
          },
        });
      }
    });

    return new NextResponse(null, {
  status: 303,
  headers: {
    Location: `/sinavlar/${id}`,
  },
});
  } catch (error) {
    console.error("Aday sınav atama hatası:", error);

    return NextResponse.json(
      {
        error:
          "Aday sınav atama sırasında beklenmeyen bir hata oluştu.",
      },
      { status: 500 }
    );
  }
}