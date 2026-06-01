import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTransaction } from "@/lib/paystack"

export async function POST(req: NextRequest) {
  try {
    const { categoryId, contestantId, quantity, amount, email, name, phone, reference } =
      await req.json()

    if (!categoryId || !contestantId || !quantity || !email || !name || !reference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Re-verify server-side — never trust the client alone
    const verification = await verifyTransaction(reference)
    if (verification.status !== "success") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 })
    }

    const vote = await prisma.vote.upsert({
      where: { reference },
      update: { status: "paid" },
      create: {
        categoryId,
        contestantId,
        quantity,
        amount,
        email,
        name,
        phone: phone ?? "",
        reference,
        status: "paid",
      },
    })

    return NextResponse.json(vote, { status: 201 })
  } catch (err) {
    console.error("[votes POST]", err)
    return NextResponse.json({ error: "Failed to record vote" }, { status: 500 })
  }
}
