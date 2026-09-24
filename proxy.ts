import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "cimko_session";

function getSecret() {
  const secret = process.env.AUTH_SECRET;

  if (!secret) {
    throw new Error("AUTH_SECRET tanımlı değil.");
  }

  return new TextEncoder().encode(secret);
}

async function isAuthenticated(
  request: NextRequest
) {
  const token =
    request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  try {
    await jwtVerify(
      token,
      getSecret()
    );

    return true;
  } catch {
    return false;
  }
}

export async function proxy(
  request: NextRequest
) {
  const authenticated =
    await isAuthenticated(request);

  if (authenticated) {
    return NextResponse.next();
  }

  const redirectUrl = new URL(
    request.url
  );

  const forwardedHost =
    request.headers.get(
      "x-forwarded-host"
    );

  const forwardedProto =
    request.headers.get(
      "x-forwarded-proto"
    );

  if (forwardedHost) {
    const hostParts =
      forwardedHost.split(":");

    redirectUrl.hostname =
      hostParts[0];

    if (hostParts.length > 1) {
      redirectUrl.port =
        hostParts[1];
    } else {
      redirectUrl.port = "";
    }
  } else {
    redirectUrl.hostname =
      "localhost";
    redirectUrl.port = "";
  }

  if (forwardedProto) {
    redirectUrl.protocol =
      `${forwardedProto}:`;
  }

  redirectUrl.pathname = "/giris";
  redirectUrl.search = `?redirect=${encodeURIComponent(
    request.nextUrl.pathname
  )}`;

  return NextResponse.redirect(
    redirectUrl
  );
}

export const config = {
  matcher: [
    "/panel/:path*",
    "/adaylar/:path*",
    "/sinavlar/:path*",
    "/kullanicilar/:path*",
  ],
};