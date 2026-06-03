import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET() {
  try {
    const votes = await prisma.vote.groupBy({
      by: ["categoryId", "contestantId"],
      where: { status: "paid" },
      _sum: { quantity: true },
    })

    // Shape: { [categoryId]: { [contestantId]: totalVotes } }
    const results: Record<string, Record<string, number>> = {}
    for (const v of votes) {
      if (!results[v.categoryId]) results[v.categoryId] = {}
      results[v.categoryId][v.contestantId] = v._sum.quantity ?? 0
    }

    return NextResponse.json(results, {
      headers: { "Cache-Control": "no-store" },
    })
  } catch (err) {
    console.error("[votes/results]", err)
    return NextResponse.json({}, {
      headers: { "Cache-Control": "no-store" },
    })
  }
}
