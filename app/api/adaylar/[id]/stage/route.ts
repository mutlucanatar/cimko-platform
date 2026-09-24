import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const allowedStages = new Set([
  "YENI_BASVURU",
  "ON_INCELEME",
  "TELEFON_GORUSMESI",
  "TEST_BEKLIYOR",
  "TEST_TAMAMLANDI",
  "IK_MULAKATI",
  "TEKNIK_MULAKAT",
  "REFERANS",
  "TEKLIF",
  "ISE_ALINDI",
]);

const allowedStatuses = new Set([
  "AKTIF",
  "YEDEK",
  "OLUMSUZ",
  "ISE_ALINDI",
]);

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export async function POST(
  request: Request,
  { params }: Props
) {
  try {
    const session = await getSession();

    if (!session) {
      return NextResponse.json(
        { error: "Yetkisiz erişim." },
        { status: 401 }
      );
    }

    const { id } = await params;

    const body = await request.json();

    const stage =
      typeof body.stage === "string"
        ? body.stage
        : "";

    const status =
      typeof body.status === "string"
        ? body.status
        : "AKTIF";

    const note =
      typeof body.note === "string"
        ? body.note.trim()
        : "";

    const rejectReason =
      typeof body.rejectReason === "string"
        ? body.rejectReason.trim()
        : "";

    if (!allowedStages.has(stage)) {
      return NextResponse.json(
        { error: "Geçersiz aşama." },
        { status: 400 }
      );
    }

    if (!allowedStatuses.has(status)) {
      return NextResponse.json(
        { error: "Geçersiz durum." },
        { status: 400 }
      );
    }

    const application =
      await db.application.findFirst({
        where: {
          candidateId: id,
        },
        orderBy: {
          appliedAt: "desc",
        },
      });

    if (!application) {
      return NextResponse.json(
        {
          error:
            "Aday için başvuru kaydı bulunamadı.",
        },
        { status: 404 }
      );
    }

    const oldStage =
      application.stage;

    const updated =
      await db.application.update({
        where: {
          id: application.id,
        },
        data: {
          stage,
          status,
          rejectReason:
            status === "OLUMSUZ"
              ? rejectReason
              : "",
        },
      });

    if (oldStage !== stage || note) {
      await db.stageHistory.create({
        data: {
          applicationId:
            application.id,
          fromStage: oldStage,
          toStage: stage,
          userId: session.id,
          note,
        },
      });
    }

    return NextResponse.json({
      success: true,
      application: updated,
    });
  } catch (error) {
    console.error(
      "Aday aşama güncelleme hatası:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Aday aşaması güncellenemedi.",
      },
      { status: 500 }
    );
  }
}