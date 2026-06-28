import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function POST(req: NextRequest) {
  try {
    const { reference } = await req.json()
    if (!reference) {
      return NextResponse.json({ error: "reference required" }, { status: 400 })
    }

    const ticket = await prisma.ticket.findUnique({ where: { reference } })

    if (!ticket) {
      return NextResponse.json({ error: "Ticket not found" }, { status: 404 })
    }

    if (ticket.status !== "paid") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 })
    }

    if (ticket.checkedIn) {
      return NextResponse.json({ ...ticket, alreadyCheckedIn: true })
    }

    const updated = await prisma.ticket.update({
      where: { reference },
      data: { checkedIn: true, checkedInAt: new Date() },
    })

    return NextResponse.json({ ...updated, alreadyCheckedIn: false })
  } catch (err) {
    console.error("[checkin POST]", err)
    return NextResponse.json({ error: "Failed to check in" }, { status: 500 })
  }
}