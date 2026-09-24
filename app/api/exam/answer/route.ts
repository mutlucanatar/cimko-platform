import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const {
      assignmentTestId,
      itemId,
      selectedKey,
    } = body;

    if (!assignmentTestId || !itemId || !selectedKey) {
      return NextResponse.json(
        { error: "Eksik bilgi." },
        { status: 400 }
      );
    }

    // Soruyu sunucudan bul.
    // Doğru cevap bilgisi tarayıcıdan alınmıyor.
    const item = await db.item.findUnique({
      where: {
        id: itemId,
      },
      select: {
        correctKey: true,
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Soru bulunamadı." },
        { status: 404 }
      );
    }

    const isCorrect =
      item.correctKey !== null
        ? selectedKey === item.correctKey
        : null;

    const answer = await db.answer.upsert({
      where: {
        assignmentTestId_itemId: {
          assignmentTestId,
          itemId,
        },
      },

      update: {
        selectedKey,
        isCorrect,
        answeredAt: new Date(),
      },

      create: {
        assignmentTestId,
        itemId,
        selectedKey,
        isCorrect,
      },
    });

    // Test ilk kez cevaplanıyorsa DEVAM durumuna geçir.
    await db.assignmentTest.updateMany({
      where: {
        id: assignmentTestId,
        status: "BASLAMADI",
      },
      data: {
        status: "DEVAM",
        startedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      answerId: answer.id,
    });
  } catch (error) {
    console.error("Cevap kaydetme hatası:", error);

    return NextResponse.json(
      { error: "Cevap kaydedilemedi." },
      { status: 500 }
    );
  }
}