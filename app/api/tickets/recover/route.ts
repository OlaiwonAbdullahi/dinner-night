import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTransaction } from "@/lib/paystack"

const TIER_PRICES_KOBO: Record<string, number> = {
  regular: 500000,
  volunteer: 1000000,
}

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json()
    if (!reference) {
      return NextResponse.json({ error: "reference required" }, { status: 400 })
    }

    const existing = await prisma.ticket.findUnique({ where: { reference } })
    if (existing) return NextResponse.json(existing)

    const tx = await verifyTransaction(reference)
    if (tx.status !== "success") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 })
    }

    const meta = tx.metadata as {
      tierId?: string
      tierName?: string
      name?: string
      phone?: string
      department?: string
    } | null

    if (!meta?.tierId) {
      return NextResponse.json({ error: "Ticket metadata missing" }, { status: 422 })
    }

    const amount = TIER_PRICES_KOBO[meta.tierId] ?? tx.amount

    const ticket = await prisma.ticket.upsert({
      where: { reference },
      update: { status: "paid" },
      create: {
        reference,
        status: "paid",
        tierId: meta.tierId,
        quantity: 1,
        amount,
        email: tx.customer.email,
        name: meta.name ?? tx.customer.email,
        phone: meta.phone ?? "",
        department: meta.department ?? null,
      },
    })

    return NextResponse.json(ticket)
  } catch (err) {
    console.error("[tickets/recover]", err)
    return NextResponse.json({ error: "Failed to recover ticket" }, { status: 500 })
  }
}