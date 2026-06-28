import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTransaction } from "@/lib/paystack"

export async function GET(req: NextRequest) {
  try {
    const reference = req.nextUrl.searchParams.get("reference")
    if (!reference) {
      return NextResponse.json({ error: "Missing reference" }, { status: 400 })
    }

    const ticket = await prisma.ticket.findUnique({ where: { reference } })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    if (ticket.status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed yet" }, { status: 402 })
    }

    return NextResponse.json(ticket)
  } catch (err) {
    console.error("[tickets GET]", err)
    return NextResponse.json({ error: "Failed to fetch ticket" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
const { tierId, quantity, amount, email, name, phone, department, reference } = await req.json()
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
        department: department ?? null,  
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