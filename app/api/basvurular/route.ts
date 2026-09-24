import { NextResponse } from "next/server";
import { db } from "@/lib/prisma";
import { randomUUID } from "crypto";
import { mkdir, writeFile } from "fs/promises";
import path from "path";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
]);

export async function POST(request: Request) {
  try {
    const formData = await request.formData();

    const vacancyId = String(
      formData.get("vacancyId") ?? ""
    );

    const slug = String(
      formData.get("slug") ?? ""
    );

    const firstName = String(
      formData.get("firstName") ?? ""
    ).trim();

    const lastName = String(
      formData.get("lastName") ?? ""
    ).trim();

    const email = String(
      formData.get("email") ?? ""
    )
      .trim()
      .toLowerCase();

    const phone = String(
      formData.get("phone") ?? ""
    ).trim();

    const consent =
      formData.get("consent") === "true";

    if (
      !vacancyId ||
      !slug ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !consent
    ) {
      return NextResponse.redirect(
        new URL(
          `/ilanlar/${slug}?basvuru=hata`,
          request.url
        ),
        303
      );
    }

    const vacancy =
      await db.vacancy.findUnique({
        where: {
          id: vacancyId,
        },
      });

    if (
      !vacancy ||
      vacancy.slug !== slug ||
      vacancy.status !== "ACIK"
    ) {
      return NextResponse.redirect(
        new URL(
          `/ilanlar/${slug}?basvuru=hata`,
          request.url
        ),
        303
      );
    }

    let birthDate: Date | null = null;

    const rawBirthDate = String(
      formData.get("birthDate") ?? ""
    );

    if (rawBirthDate) {
      const parsedDate = new Date(
        `${rawBirthDate}T00:00:00`
      );

      if (
        !Number.isNaN(
          parsedDate.getTime()
        )
      ) {
        birthDate = parsedDate;
      }
    }

    const educationLevel =
      String(
        formData.get(
          "educationLevel"
        ) ?? ""
      ) || null;

    const schoolDept =
      String(
        formData.get(
          "schoolDept"
        ) ?? ""
      ).trim() || null;

    const driverLicense =
      String(
        formData.get(
          "driverLicense"
        ) ?? ""
      ).trim() || null;

    const militaryStatus =
      String(
        formData.get(
          "militaryStatus"
        ) ?? ""
      ) || null;

    const city =
      String(
        formData.get("city") ?? ""
      ).trim() || null;

    const address =
      String(
        formData.get("address") ?? ""
      ).trim() || null;

    const coverLetter =
      String(
        formData.get(
          "coverLetter"
        ) ?? ""
      ).trim();

    const shiftOk =
      String(
        formData.get("shiftOk") ?? "true"
      ) === "true";

    /*
     * Aynı e-posta adresiyle daha önce aday
     * kaydı varsa onu kullanıyoruz.
     */
    let candidate =
      await db.candidate.findFirst({
        where: {
          email,
        },
        orderBy: {
          createdAt: "asc",
        },
      });

    if (!candidate) {
      candidate =
        await db.candidate.create({
          data: {
            firstName,
            lastName,
            email,
            phone,
            birthDate,
            educationLevel,
            schoolDept,
            driverLicense,
            militaryStatus,
            city,
            address,
            coverLetter,
            shiftOk,
            source: "ILAN_BASVURU",
          },
        });
    } else {
      candidate =
        await db.candidate.update({
          where: {
            id: candidate.id,
          },
          data: {
            firstName,
            lastName,
            phone,
            birthDate,
            educationLevel,
            schoolDept,
            driverLicense,
            militaryStatus,
            city,
            address,
            coverLetter,
            shiftOk,
            source:
              candidate.source ||
              "ILAN_BASVURU",
          },
        });
    }

    /*
     * Aynı adayın aynı ilana tekrar başvurmasını
     * engelliyoruz.
     */
    const existingApplication =
      await db.application.findFirst({
        where: {
          candidateId: candidate.id,
          vacancyId: vacancy.id,
        },
      });

    if (existingApplication) {
      return NextResponse.redirect(
        new URL(
          `/ilanlar/${slug}?basvuru=basarili`,
          request.url
        ),
        303
      );
    }

    const application =
      await db.application.create({
        data: {
          candidateId: candidate.id,
          positionId:
            vacancy.positionId,
          vacancyId:
            vacancy.id,
          stage: "YENI_BASVURU",
          status: "AKTIF",
        },
      });

    /*
     * KVKK kaydı
     */
    await db.consentRecord.create({
      data: {
        candidateId: candidate.id,
        kind: "KVKK_BASVURU",
        textVersion: "1.0",
        ipAddress:
          request.headers.get(
            "x-forwarded-for"
          ) ??
          request.headers.get(
            "x-real-ip"
          ) ??
          "",
      },
    });

    /*
     * CV yükleme
     */
    const cv = formData.get("cv");

    if (
      cv instanceof File &&
      cv.size > 0
    ) {
      if (
        cv.size > MAX_FILE_SIZE ||
        !ALLOWED_TYPES.has(cv.type)
      ) {
        return NextResponse.redirect(
          new URL(
            `/ilanlar/${slug}?basvuru=hata`,
            request.url
          ),
          303
        );
      }

      const extension =
        path.extname(
          cv.name
        ).toLowerCase();

      const fileName =
        `${candidate.id}-${randomUUID()}${extension}`;

      const uploadDir =
        path.join(
          process.cwd(),
          "public",
          "uploads",
          "cv"
        );

      await mkdir(
        uploadDir,
        { recursive: true }
      );

      const filePath =
        path.join(
          uploadDir,
          fileName
        );

      const bytes =
        await cv.arrayBuffer();

      await writeFile(
        filePath,
        Buffer.from(bytes)
      );

      await db.document.create({
        data: {
          candidateId:
            candidate.id,
          kind: "OZGECMIS",
          fileName: cv.name,
          storedPath:
            `/uploads/cv/${fileName}`,
          mimeType: cv.type,
          sizeBytes: cv.size,
        },
      });
    }

    return NextResponse.redirect(
      new URL(
        `/ilanlar/${slug}?basvuru=basarili`,
        request.url
      ),
      303
    );
} catch (error) {
  console.error(
    "Başvuru oluşturma hatası:",
    error
  );

  return NextResponse.redirect(
    new URL(
      "/?basvuru=hata",
      request.url
    ),
    303
  );
}
}