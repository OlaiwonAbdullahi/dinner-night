import { NextRequest, NextResponse } from "next/server"
import { verifyTransaction } from "@/lib/paystack"
import { prisma } from "@/lib/prisma"

export type BulkVerifyResult = {
  reference: string
  status: "verified" | "skipped" | "failed"
  paystackStatus?: string
  type?: string
  error?: string
}

export type BulkVerifyResponse = {
  summary: { total: number; verified: number; skipped: number; failed: number }
  results: BulkVerifyResult[]
}

async function processReference(reference: string): Promise<BulkVerifyResult> {
  try {
    const data = await verifyTransaction(reference)

    if (data.status !== "success") {
      return { reference, status: "skipped", paystackStatus: data.status }
    }

    const { amount, customer, metadata } = data
    const meta = metadata as Record<string, unknown> | null

    if (meta?.type === "vote" && meta.categoryId && meta.contestantId) {
      await prisma.vote.upsert({
        where: { reference },
        update: { status: "paid" },
        create: {
          reference,
          status: "paid",
          categoryId: meta.categoryId as string,
          contestantId: meta.contestantId as string,
          quantity: (meta.quantity as number) ?? 1,
          amount,
          email: customer.email,
          name: (meta.name as string) ?? "",
          phone: (meta.phone as string) ?? "",
        },
      })
      return { reference, status: "verified", paystackStatus: "success", type: "vote" }
    }

    if (meta?.type === "ticket" && meta.tierId) {
      await prisma.ticket.upsert({
        where: { reference },
        update: { status: "paid" },
        create: {
          reference,
          status: "paid",
          tierId: meta.tierId as string,
          quantity: (meta.quantity as number) ?? 1,
          amount,
          email: customer.email,
          name: (meta.name as string) ?? "",
          phone: (meta.phone as string) ?? "",
        },
      })
      return { reference, status: "verified", paystackStatus: "success", type: "ticket" }
    }

    // fallback — update any existing record that matches the reference
    const [votes, tickets] = await Promise.all([
      prisma.vote.updateMany({ where: { reference }, data: { status: "paid" } }),
      prisma.ticket.updateMany({ where: { reference }, data: { status: "paid" } }),
    ])
    const type = votes.count > 0 ? "vote" : tickets.count > 0 ? "ticket" : "unknown"
    return { reference, status: "verified", paystackStatus: "success", type }
  } catch (err) {
    return { reference, status: "failed", error: String(err) }
  }
}

function parseReferences(csv: string): string[] {
  const lines = csv.split(/\r?\n/)
  if (lines.length < 2) return []

  // Parse header row — strip BOM, quotes, extra whitespace
  const rawHeader = lines[0].replace(/^﻿/, "")
  const headers = rawHeader
    .split(",")
    .map((h) => h.trim().replace(/^"|"$/g, "").toLowerCase())

  const refIdx = headers.findIndex(
    (h) => h === "reference" || h === "transaction reference" || h === "ref"
  )
  if (refIdx === -1) return []

  const refs: string[] = []
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line) continue
    // Split on commas but respect quoted fields
    const cols = line.match(/("(?:[^"]|"")*"|[^,]*)/g) ?? []
    const ref = cols[refIdx]?.trim().replace(/^"|"$/g, "")
    if (ref) refs.push(ref)
  }
  return refs
}

async function runBatch<T>(
  items: string[],
  concurrency: number,
  fn: (item: string) => Promise<T>
): Promise<T[]> {
  const results: T[] = []
  for (let i = 0; i < items.length; i += concurrency) {
    const chunk = items.slice(i, i + concurrency)
    results.push(...(await Promise.all(chunk.map(fn))))
  }
  return results
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as File | null
    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
    }

    const text = await file.text()
    const references = parseReferences(text)

    if (references.length === 0) {
      return NextResponse.json(
        { error: 'No references found. Ensure the CSV has a "Reference" column.' },
        { status: 400 }
      )
    }

    const results = await runBatch(references, 5, processReference)

    const summary = {
      total: results.length,
      verified: results.filter((r) => r.status === "verified").length,
      skipped: results.filter((r) => r.status === "skipped").length,
      failed: results.filter((r) => r.status === "failed").length,
    }

    return NextResponse.json({ summary, results } satisfies BulkVerifyResponse)
  } catch (err) {
    console.error("[bulk-verify]", err)
    return NextResponse.json({ error: "Bulk verification failed" }, { status: 500 })
  }
}
