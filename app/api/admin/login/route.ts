import { NextRequest, NextResponse } from "next/server"
import { SignJWT } from "jose"

const secret = () => new TextEncoder().encode(process.env.ADMIN_SECRET ?? "fallback-secret-change-me-in-env")

export async function POST(req: NextRequest) {
  try {
    const { password } = await req.json()

    if (!password || password !== process.env.ADMIN_PASSWORD) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 })
    }

    const token = await new SignJWT({ role: "admin" })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("8h")
      .setIssuedAt()
      .sign(await secret())

    const res = NextResponse.json({ ok: true })
    res.cookies.set("admin_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 8,
      path: "/",
    })

    return res
  } catch (err) {
    console.error("[admin/login]", err)
    return NextResponse.json({ error: "Login failed" }, { status: 500 })
  }
}
