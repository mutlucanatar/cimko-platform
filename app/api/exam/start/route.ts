import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

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

    const assignmentTest = await db.assignmentTest.findUnique({
      where: {
        id: assignmentTestId,
      },
    });

    if (!assignmentTest) {
      return NextResponse.json(
        { error: "Sınav ataması bulunamadı." },
        { status: 404 }
      );
    }

    // Sınav zaten başladıysa başlangıç zamanını değiştirme.
    if (assignmentTest.status === "DEVAM") {
      return NextResponse.json({
        success: true,
        startedAt: assignmentTest.startedAt,
        alreadyStarted: true,
      });
    }

    // Sınav tamamlandıysa tekrar başlatma.
    if (assignmentTest.status === "TAMAMLANDI") {
      return NextResponse.json(
        { error: "Bu sınav daha önce tamamlandı." },
        { status: 400 }
      );
    }

    const startedAt = new Date();

    const updated = await db.assignmentTest.update({
      where: {
        id: assignmentTestId,
      },
      data: {
        status: "DEVAM",
        startedAt,
      },
    });

    return NextResponse.json({
      success: true,
      startedAt: updated.startedAt,
    });
  } catch (error) {
    console.error("Sınav başlatma hatası:", error);

    return NextResponse.json(
      { error: "Sınav başlatılamadı." },
      { status: 500 }
    );
  }
}