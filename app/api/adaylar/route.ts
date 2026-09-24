import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const firstName = String(
      formData.get("firstName") ?? ""
    ).trim();

    const lastName = String(
      formData.get("lastName") ?? ""
    ).trim();

    const nationalIdValue = String(
      formData.get("nationalId") ?? ""
    ).trim();

    const emailValue = String(
      formData.get("email") ?? ""
    ).trim();

    const phoneValue = String(
      formData.get("phone") ?? ""
    ).trim();

    const genderValue = String(
      formData.get("gender") ?? ""
    ).trim();

    const birthDateValue = String(
      formData.get("birthDate") ?? ""
    ).trim();

    const educationLevelValue = String(
      formData.get("educationLevel") ?? ""
    ).trim();

    const schoolDeptValue = String(
      formData.get("schoolDept") ?? ""
    ).trim();

    const driverLicenseValue = String(
      formData.get("driverLicense") ?? ""
    ).trim();

    const militaryStatusValue = String(
      formData.get("militaryStatus") ?? ""
    ).trim();

    const cityValue = String(
      formData.get("city") ?? ""
    ).trim();

    const addressValue = String(
      formData.get("address") ?? ""
    ).trim();

    const sourceValue = String(
      formData.get("source") ?? "IK_KAYIT"
    ).trim();

    const coverLetterValue = String(
      formData.get("coverLetter") ?? ""
    ).trim();

    const shiftOk =
      formData.get("shiftOk") === "on";

    if (!firstName || !lastName) {
      return NextResponse.json(
        {
          error: "Ad ve soyad zorunludur.",
        },
        { status: 400 }
      );
    }

    if (nationalIdValue) {
      const existingCandidate =
        await db.candidate.findFirst({
          where: {
            nationalId: nationalIdValue,
          },
        });

      if (existingCandidate) {
        return NextResponse.json(
          {
            error:
              "Bu T.C. kimlik numarası ile kayıtlı bir aday zaten bulunuyor.",
          },
          { status: 409 }
        );
      }
    }

    let birthDate: Date | null = null;

    if (birthDateValue) {
      const parsedDate = new Date(
        `${birthDateValue}T00:00:00`
      );

      if (Number.isNaN(parsedDate.getTime())) {
        return NextResponse.json(
          {
            error:
              "Doğum tarihi geçersiz.",
          },
          { status: 400 }
        );
      }

      birthDate = parsedDate;
    }

    const candidate =
      await db.candidate.create({
        data: {
          firstName,
          lastName,
          nationalId:
            nationalIdValue || null,
          email:
            emailValue || null,
          phone:
            phoneValue || null,
          gender:
            genderValue || null,
          birthDate,
          educationLevel:
            educationLevelValue || null,
          schoolDept:
            schoolDeptValue || null,
          driverLicense:
            driverLicenseValue || null,
          militaryStatus:
            militaryStatusValue || null,
          city:
            cityValue || null,
          address:
            addressValue || null,
          source:
            sourceValue || "IK_KAYIT",
          coverLetter:
            coverLetterValue,
          shiftOk,
        },
      });

    /*
     * GitHub Codespaces / proxy ortamında request.url
     * localhost:3000 olabilir.
     *
     * Öncelikle tarayıcının Origin bilgisini,
     * ardından forwarded host bilgisini kullanıyoruz.
     */

        return new Response(null, {
  status: 303,
  headers: {
    Location: `/adaylar/${candidate.id}`,
  },
});
  } catch (error) {
    console.error(
      "Aday oluşturma hatası:",
      error
    );

    return NextResponse.json(
      {
        error: "Aday kaydedilemedi.",
      },
      { status: 500 }
    );
  }
}