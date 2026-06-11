import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const secret = () =>
  new TextEncoder().encode(
    process.env.ADMIN_SECRET ?? "fallback-secret-change-me-in-env",
  );

export async function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (!pathname.startsWith("/admin") || pathname === "/admin/login") {
    return NextResponse.next();
  }

  const token = req.cookies.get("admin_token")?.value;

  if (!token) {
    return NextResponse.redirect(new URL("/admin/login", req.url));
  }

  try {
    await jwtVerify(token, await secret());
    return NextResponse.next();
  } catch {
    const res = NextResponse.redirect(new URL("/admin/login", req.url));
    res.cookies.set("admin_token", "", { maxAge: 0, path: "/" });
    return res;
  }
}

export const config = {
  matcher: ["/admin/:path*"],
};
