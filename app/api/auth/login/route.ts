import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";

import { db } from "@/lib/prisma";
import { createSession } from "@/lib/auth";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export async function POST(request: Request) {
  console.log("REQUEST URL:", request.url);
  console.log(
    "HOST:",
    request.headers.get("host")
  );
  console.log(
    "X-FORWARDED-HOST:",
    request.headers.get("x-forwarded-host")
  );
  console.log(
    "X-FORWARDED-PROTO:",
    request.headers.get("x-forwarded-proto")
  );
  console.log(
    "X-FORWARDED-PORT:",
    request.headers.get("x-forwarded-port")
  );

  try {
    const formData = await request.formData();
const redirectTarget = formData.get("redirect");

const safeRedirect =
  typeof redirectTarget === "string" &&
  redirectTarget.startsWith("/") &&
  !redirectTarget.startsWith("//")
    ? redirectTarget
    : "/panel";
    const parsed = schema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!parsed.success) {
      return NextResponse.redirect(
        new URL(
          "/giris?hata=bilgileri-kontrol",
          request.url
        ),
        303
      );
    }

    const email = parsed.data.email
      .trim()
      .toLowerCase();

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user || !user.isActive) {
      return NextResponse.redirect(
        new URL(
          "/giris?hata=gecersiz",
          request.url
        ),
        303
      );
    }

    const valid = await bcrypt.compare(
      parsed.data.password,
      user.passwordHash
    );

    if (!valid) {
      return NextResponse.redirect(
        new URL(
          "/giris?hata=gecersiz",
          request.url
        ),
        303
      );
    }

    await createSession({
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      facilityId: user.facilityId,
      departmentId: user.departmentId,
    });

    return new NextResponse(null, {
  status: 303,
  headers: {
    Location: "/panel",
  },
});
  } catch (error) {
    console.error(
      "Login error:",
      error
    );

    return NextResponse.redirect(
      new URL(
        "/giris?hata=sistem",
        request.url
      ),
      303
    );
  }
}