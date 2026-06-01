import { NextRequest, NextResponse } from "next/server"
import { verifyTransaction } from "@/lib/paystack"

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ reference: string }> }
) {
  try {
    const { reference } = await params
    const data = await verifyTransaction(reference)
    return NextResponse.json(data)
  } catch (err) {
    console.error("[paystack/verify]", err)
    return NextResponse.json({ error: "Failed to verify payment" }, { status: 500 })
  }
}
