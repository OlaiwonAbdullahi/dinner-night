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
    data: {
      reference: string
      status: string
      amount: number
      customer: { email: string }
      metadata?: {
        type?: string
        categoryId?: string
        contestantId?: string
        quantity?: number
        name?: string
        phone?: string
        tierId?: string
        department?: string
      }
    }
  }

  if (event.event === "charge.success") {
    const { reference, amount, customer, metadata } = event.data

    if (metadata?.type === "vote" && metadata.categoryId && metadata.contestantId) {
      await prisma.vote.upsert({
        where: { reference },
        update: { status: "paid" },
        create: {
          reference,
          status: "paid",
          categoryId: metadata.categoryId,
          contestantId: metadata.contestantId,
          quantity: metadata.quantity ?? 1,
          amount,
          email: customer.email,
          name: metadata.name ?? "",
          phone: metadata.phone ?? "",
        },
      })
    } else if (metadata?.type === "ticket" && metadata.tierId) {
      await prisma.ticket.upsert({
        where: { reference },
        update: { status: "paid" },
        create: {
          reference,
          status: "paid",
          tierId: metadata.tierId,
          quantity: metadata.quantity ?? 1,
          amount,
          email: customer.email,
          name: metadata.name ?? "",
          phone: metadata.phone ?? "",
          department: metadata.department ?? null,
        },
      })
    } else {
      // fallback for any records already in DB without metadata
      await Promise.all([
        prisma.vote.updateMany({ where: { reference }, data: { status: "paid" } }),
        prisma.ticket.updateMany({ where: { reference }, data: { status: "paid" } }),
      ])
    }
  }

  // Always return 200 quickly so Paystack does not retry
  return NextResponse.json({ received: true })
}
