import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTransaction } from "@/lib/paystack"

export async function POST(req: NextRequest) {
  try {
    const { tierId, quantity, amount, email, name, phone, reference } = await req.json()

    if (!tierId || !email || !name || !reference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const verification = await verifyTransaction(reference)
    if (verification.status !== "success") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 })
    }

    const ticket = await prisma.ticket.upsert({
      where: { reference },
      update: { status: "paid" },
      create: {
        tierId,
        quantity: quantity ?? 1,
        amount,
        email,
        name,
        phone: phone ?? "",
        reference,
        status: "paid",
      },
    })

    return NextResponse.json(ticket, { status: 201 })
  } catch (err) {
    console.error("[tickets POST]", err)
    return NextResponse.json({ error: "Failed to record ticket" }, { status: 500 })
  }
}
