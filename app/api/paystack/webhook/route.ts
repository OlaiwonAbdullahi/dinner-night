import { NextRequest, NextResponse } from "next/server"
import { createHmac } from "crypto"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  // Must read raw body BEFORE JSON.parse to preserve bytes for HMAC
  const rawBody = await req.text()
  const signature = req.headers.get("x-paystack-signature") ?? ""

  const hash = createHmac("sha512", process.env.PAYSTACK_SECRET_KEY ?? "")
    .update(rawBody)
    .digest("hex")

  if (hash !== signature) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = JSON.parse(rawBody) as {
    event: string
    data: { reference: string; status: string }
  }

  if (event.event === "charge.success") {
    const { reference } = event.data
    await Promise.all([
      prisma.vote.updateMany({ where: { reference }, data: { status: "paid" } }),
      prisma.ticket.updateMany({ where: { reference }, data: { status: "paid" } }),
    ])
  }

  // Always return 200 quickly so Paystack does not retry
  return NextResponse.json({ received: true })
}
