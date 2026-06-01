const BASE = "https://api.paystack.co"

function headers() {
  return {
    Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    "Content-Type": "application/json",
  }
}

export type PaystackInitResult = {
  authorization_url: string
  access_code: string
  reference: string
}

export type PaystackVerifyResult = {
  status: string // "success" | "failed" | "abandoned" | "pending"
  amount: number // kobo
  reference: string
  customer: { email: string }
  metadata: unknown
}

export async function initializeTransaction(params: {
  email: string
  amount: number // kobo
  reference: string
  metadata?: Record<string, unknown>
  callback_url?: string
}): Promise<PaystackInitResult> {
  const res = await fetch(`${BASE}/transaction/initialize`, {
    method: "POST",
    headers: headers(),
    body: JSON.stringify(params),
  })
  const json = await res.json()
  if (!json.status) throw new Error(json.message ?? "Paystack init failed")
  return json.data as PaystackInitResult
}

export async function verifyTransaction(
  reference: string
): Promise<PaystackVerifyResult> {
  const res = await fetch(`${BASE}/transaction/verify/${encodeURIComponent(reference)}`, {
    headers: headers(),
    cache: "no-store",
  })
  const json = await res.json()
  if (!json.status) throw new Error(json.message ?? "Paystack verify failed")
  return json.data as PaystackVerifyResult
}
