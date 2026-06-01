import { NextRequest, NextResponse } from "next/server"
import { initializeTransaction } from "@/lib/paystack"
import { randomUUID } from "crypto"

export async function POST(req: NextRequest) {
  try {
    const { email, amount, metadata } = await req.json()

    if (!email || !amount) {
      return NextResponse.json({ error: "email and amount are required" }, { status: 400 })
    }

    const reference = `DNA-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`
    const data = await initializeTransaction({ email, amount, reference, metadata })

    // data already contains `reference` echoed from Paystack
    return NextResponse.json(data)
  } catch (err) {
    console.error("[paystack/initialize]", err)
    return NextResponse.json({ error: "Failed to initialize payment" }, { status: 500 })
  }
}
