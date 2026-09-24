import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { db } from "@/lib/prisma";
import { getSession } from "@/lib/auth";

const allowedRoles = new Set([
  "SISTEM_YONETICISI",
  "IK_YONETICISI",
  "IK_UZMANI",
  "TESIS_YONETICISI",
  "BOLUM_YONETICISI",
  "TEKNIK_DEGERLENDIRICI",
  "ISG_UZMANI",
  "DIS_KULLANICI",
]);

export async function POST(request: Request) {
  try {
    const session = await getSession();

    if (
      !session ||
      session.role !== "SISTEM_YONETICISI"
    ) {
      return NextResponse.json(
        {
          error:
            "Bu işlem için Sistem Yöneticisi yetkisi gereklidir.",
        },
        { status: 403 }
      );
    }

    const formData = await request.formData();

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

    const password = String(
      formData.get("password") ?? ""
    );

    const role = String(
      formData.get("role") ?? ""
    );

    const facilityId =
      String(
        formData.get("facilityId") ?? ""
      ) || null;

    const departmentId =
      String(
        formData.get("departmentId") ?? ""
      ) || null;

    const isActive =
      formData.get("isActive") === "true";

    if (
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !allowedRoles.has(role)
    ) {
      return NextResponse.redirect(
        new URL(
          "/kullanicilar/yeni?hata=bilgileri-kontrol",
          request.url
        ),
        303
      );
    }

    if (password.length < 8) {
      return NextResponse.redirect(
        new URL(
          "/kullanicilar/yeni?hata=sifre",
          request.url
        ),
        303
      );
    }

    const existingUser =
      await db.user.findUnique({
        where: { email },
      });

    if (existingUser) {
      return NextResponse.redirect(
        new URL(
          "/kullanicilar/yeni?hata=email-mevcut",
          request.url
        ),
        303
      );
    }

    /*
     * Bölüm seçilmişse gerçekten seçilen
     * tesise ait olup olmadığını doğrula.
     */
    if (departmentId) {
      const department =
        await db.department.findUnique({
          where: {
            id: departmentId,
          },
        });

      if (!department) {
        return NextResponse.redirect(
          new URL(
            "/kullanicilar/yeni?hata=bolum",
            request.url
          ),
          303
        );
      }

      if (
        facilityId &&
        department.facilityId !== facilityId
      ) {
        return NextResponse.redirect(
          new URL(
            "/kullanicilar/yeni?hata=bolum-tesis",
            request.url
          ),
          303
        );
      }
    }

    if (facilityId) {
      const facility =
        await db.facility.findUnique({
          where: {
            id: facilityId,
          },
        });

      if (!facility) {
        return NextResponse.redirect(
          new URL(
            "/kullanicilar/yeni?hata=tesis",
            request.url
          ),
          303
        );
      }
    }

    const passwordHash =
      await bcrypt.hash(password, 10);

    await db.user.create({
      data: {
        firstName,
        lastName,
        email,
        passwordHash,
        role,
        facilityId,
        departmentId,
        isActive,
      },
    });

    return NextResponse.redirect(
      new URL(
        "/kullanicilar?durum=olusturuldu",
        request.url
      ),
      303
    );
  } catch (error) {
    console.error(
      "Kullanıcı oluşturma hatası:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/kullanicilar/yeni?hata=sistem",
        request.url
      ),
      303
    );
  }
}