import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

const PROMOTION_PATHS = [
  {
    from: "Yeni Üretim Elemanı",
    to: "Üretim Operatörü",
  },
  {
    from: "Elektrik Bakım Elemanı",
    to: "Elektrik Bakım Ustası",
  },
  {
    from: "Mekanik Bakım Elemanı",
    to: "Mekanik Bakım Ustası",
  },
  {
    from: "Laboratuvar İşçisi",
    to: "Laborant",
  },
];

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const employeeFirstName = String(
      formData.get("employeeFirstName") ?? ""
    ).trim();

    const employeeLastName = String(
      formData.get("employeeLastName") ?? ""
    ).trim();

    const sicilNo = String(
      formData.get("sicilNo") ?? ""
    ).trim();

    const facilityName = String(
      formData.get("facilityName") ?? ""
    ).trim();

    const currentPositionId = String(
      formData.get("currentPositionId") ?? ""
    ).trim();

    const targetPositionId = String(
      formData.get("targetPositionId") ?? ""
    ).trim();

    const promotionPeriodId = String(
      formData.get("promotionPeriodId") ?? ""
    ).trim();

    const requesterName = String(
      formData.get("requesterName") ?? ""
    ).trim();

    const requestDateValue = String(
      formData.get("requestDate") ?? ""
    ).trim();

    const reason = String(
      formData.get("reason") ?? ""
    ).trim();

    const notes = String(
      formData.get("notes") ?? ""
    ).trim();

    if (
      !employeeFirstName ||
      !employeeLastName ||
      !sicilNo ||
      !currentPositionId ||
      !targetPositionId ||
      !promotionPeriodId ||
      !requesterName
    ) {
      return NextResponse.json(
        {
          error:
            "Ad, soyad, sicil no, mevcut ünvan, hedef ünvan, terfi dönemi ve talep eden amir zorunludur.",
        },
        { status: 400 }
      );
    }

    const [currentPosition, targetPosition, promotionPeriod] =
      await Promise.all([
        db.position.findUnique({
          where: {
            id: currentPositionId,
          },
        }),

        db.position.findUnique({
          where: {
            id: targetPositionId,
          },
        }),

        db.promotionPeriod.findUnique({
          where: {
            id: promotionPeriodId,
          },
        }),
      ]);

    if (!currentPosition) {
      return NextResponse.json(
        {
          error:
            "Mevcut pozisyon bulunamadı.",
        },
        { status: 400 }
      );
    }

    if (!targetPosition) {
      return NextResponse.json(
        {
          error:
            "Hedef pozisyon bulunamadı.",
        },
        { status: 400 }
      );
    }

    if (!promotionPeriod) {
      return NextResponse.json(
        {
          error:
            "Terfi dönemi bulunamadı.",
        },
        { status: 400 }
      );
    }

    const validPath =
      PROMOTION_PATHS.some(
        (path) =>
          path.from ===
            currentPosition.name &&
          path.to === targetPosition.name
      );

    if (!validPath) {
      return NextResponse.json(
        {
          error:
            "Seçilen mevcut ve hedef ünvan arasında geçerli bir mavi yaka terfi yolu bulunmuyor.",
        },
        { status: 400 }
      );
    }

    const employee =
      await db.employee.findFirst({
        where: {
          sicilNo,
        },
      });

    let parsedRequestDate = new Date();

    if (requestDateValue) {
      parsedRequestDate = new Date(
        `${requestDateValue}T00:00:00`
      );

      if (
        Number.isNaN(
          parsedRequestDate.getTime()
        )
      ) {
        return NextResponse.json(
          {
            error:
              "Talep tarihi geçersiz.",
          },
          { status: 400 }
        );
      }
    }

    const existingRequest =
      await db.promotionRequest.findFirst({
        where: {
          sicilNo,
          targetPositionId,
          promotionPeriodId,
          status: {
            not: "IPTAL",
          },
        },
      });

    if (existingRequest) {
      return new Response(null, {
        status: 303,
        headers: {
          Location: `/terfi/${existingRequest.id}`,
        },
      });
    }

    const promotionRequest =
      await db.promotionRequest.create({
        data: {
          employeeId:
            employee?.id ?? null,
          employeeFirstName,
          employeeLastName,
          sicilNo,
          facilityName,
          currentPositionId,
          targetPositionId,
          promotionPeriodId,
          requesterName,
          requestDate:
            parsedRequestDate,
          reason,
          notes,
          status: "TALEP",
        },
      });

    return new Response(null, {
      status: 303,
      headers: {
        Location: `/terfi/${promotionRequest.id}`,
      },
    });
  } catch (error) {
    console.error(
      "Terfi talebi oluşturma hatası:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Terfi talebi kaydedilemedi.",
      },
      { status: 500 }
    );
  }
}