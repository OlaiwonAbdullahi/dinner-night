import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { verifyTransaction } from "@/lib/paystack"
import { isVotingClosed } from "@/lib/data"   

export async function GET(req: NextRequest) {
  const reference = new URL(req.url).searchParams.get("reference")
  if (!reference) {
    return NextResponse.json({ error: "reference required" }, { status: 400 })
  }

  // Return immediately if already recorded
  const existing = await prisma.vote.findUnique({ where: { reference } })
  if (existing?.status === "paid") return NextResponse.json(existing)

  // Not in DB — verify with Paystack and create from metadata (webhook fallback)
  try {
    const tx = await verifyTransaction(reference)
    if (tx.status !== "success") {
      return NextResponse.json({ error: "Payment not confirmed" }, { status: 402 })
    }

    const meta = tx.metadata as {
      type?: string
      categoryId?: string
      contestantId?: string
      quantity?: number
      name?: string
      phone?: string
    } | null

    if (!meta?.categoryId || !meta?.contestantId) {
      return NextResponse.json({ error: "Vote metadata missing" }, { status: 422 })
    }

    const vote = await prisma.vote.upsert({
      where: { reference },
      update: { status: "paid" },
      create: {
        reference,
        status: "paid",
        categoryId: meta.categoryId,
        contestantId: meta.contestantId,
        quantity: Number(meta.quantity) || 1,
        amount: tx.amount,
        email: tx.customer.email,
        name: meta.name ?? "",
        phone: meta.phone ?? "",
      },
    })
    return NextResponse.json(vote)
  } catch (err) {
    console.error("[votes GET]", err)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    if (isVotingClosed()) {                                          // ← ADD
      return NextResponse.json({ error: "Voting has closed" }, { status: 403 })  // ← ADD
    }  
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
