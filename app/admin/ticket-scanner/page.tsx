"use client"

import { useEffect, useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  QrCode01Icon,
  Refresh01Icon,
  Alert01Icon,
} from "@hugeicons/core-free-icons"
import { ticketTiers } from "@/lib/data"

type ScanResult = {
  reference: string
  valid: boolean
  alreadyCheckedIn?: boolean
  name?: string
  tierId?: string
  department?: string
  amount?: number
  checkedInAt?: string
  error?: string
}

export default function TicketScannerPage() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [scanning, setScanning] = useState(false)
  const [result, setResult] = useState<ScanResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [cameraError, setCameraError] = useState<string | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const processingRef = useRef(false)

  async function startCamera() {
    setCameraError(null)
    setResult(null)
    processingRef.current = false
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        await videoRef.current.play()
      }
      setScanning(true)
      startScanning()
    } catch {
      setCameraError("Camera access denied. Please allow camera permission and try again.")
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach((t) => t.stop())
    streamRef.current = null
    if (intervalRef.current) clearInterval(intervalRef.current)
    setScanning(false)
  }

  function startScanning() {
    // @ts-ignore
    if (!("BarcodeDetector" in window)) return
    // @ts-ignore
    const detector = new BarcodeDetector({ formats: ["qr_code"] })

    intervalRef.current = setInterval(async () => {
      if (!videoRef.current || processingRef.current) return
      try {
        // @ts-ignore
        const codes = await detector.detect(videoRef.current)
        if (codes.length > 0) {
          processingRef.current = true
          const raw: string = codes[0].rawValue
          const match = raw.match(/\/verify\/([^/?#]+)/)
          const reference = match ? decodeURIComponent(match[1]) : raw
          if (intervalRef.current) clearInterval(intervalRef.current)
          await checkIn(reference)
        }
      } catch {
        // ignore detector errors
      }
    }, 500)
  }

  async function checkIn(reference: string) {
    setLoading(true)
    try {
      const res = await fetch("/api/admin/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reference }),
      })
      const data = await res.json()

      if (!res.ok) {
        setResult({ reference, valid: false, error: data.error ?? "Invalid ticket" })
      } else {
        setResult({
          reference,
          valid: true,
          alreadyCheckedIn: data.alreadyCheckedIn,
          name: data.name,
          tierId: data.tierId,
          department: data.department,
          amount: data.amount,
          checkedInAt: data.checkedInAt,
        })
      }
    } catch {
      setResult({ reference, valid: false, error: "Network error" })
    } finally {
      setLoading(false)
      processingRef.current = false
    }
  }

  function handleReset() {
    setResult(null)
    processingRef.current = false
    startScanning()
  }

  useEffect(() => {
    return () => stopCamera()
  }, [])

  const tier = result?.tierId ? ticketTiers.find((t) => t.id === result.tierId) : null

  const resultColor = !result?.valid
    ? "border-red-500/30 bg-red-500/10"
    : result.alreadyCheckedIn
    ? "border-yellow-500/30 bg-yellow-500/10"
    : "border-green-500/30 bg-green-500/10"

  const resultIcon = !result?.valid
    ? CancelCircleIcon
    : result.alreadyCheckedIn
    ? Alert01Icon
    : CheckmarkCircle01Icon

  const resultIconColor = !result?.valid
    ? "text-red-400"
    : result.alreadyCheckedIn
    ? "text-yellow-400"
    : "text-green-400"

  const resultTitle = !result?.valid
    ? "INVALID TICKET"
    : result.alreadyCheckedIn
    ? "ALREADY CHECKED IN"
    : "CHECKED IN ✓"

  return (
    <div className="p-6 md:p-8 max-w-lg">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Ticket Scanner</h1>
        <p className="mt-1 text-sm text-white/40">
          Scan attendee QR codes at the entrance to check them in.
        </p>
      </div>

      {/* Camera view */}
      <div className="relative mb-6 overflow-hidden rounded-2xl border border-white/10 bg-black aspect-square">
        <video ref={videoRef} className="h-full w-full object-cover" muted playsInline />

        {scanning && !result && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="relative h-48 w-48">
              <div className="absolute top-0 left-0 h-8 w-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
              <div className="absolute top-0 right-0 h-8 w-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
              <div className="absolute bottom-0 left-0 h-8 w-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
              <div className="absolute bottom-0 right-0 h-8 w-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
              <div className="absolute inset-x-4 top-1/2 h-0.5 bg-primary/70 animate-bounce" />
            </div>
            <p className="mt-4 text-xs font-semibold text-white/50">Point camera at QR code</p>
          </div>
        )}

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          </div>
        )}

        {!scanning && !loading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3">
            <HugeiconsIcon icon={QrCode01Icon} size={40} color="currentColor" className="text-white/20" />
            <p className="text-sm text-white/30">Camera not started</p>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="mb-4 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          {cameraError}
        </div>
      )}

      {/* Controls */}
      <div className="mb-6 flex gap-3">
        {!scanning ? (
          <button
            onClick={startCamera}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-bold text-black hover:bg-primary/80 transition-colors"
          >
            <HugeiconsIcon icon={QrCode01Icon} size={16} color="currentColor" />
            Start Scanner
          </button>
        ) : (
          <button
            onClick={stopCamera}
            className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white/50 hover:text-white transition-colors"
          >
            Stop Scanner
          </button>
        )}

        {result && (
          <button
            onClick={handleReset}
            className="flex items-center gap-2 rounded-xl border border-primary/30 px-4 py-3 text-sm font-semibold text-primary hover:bg-primary/10 transition-colors"
          >
            <HugeiconsIcon icon={Refresh01Icon} size={16} color="currentColor" />
            Scan Next
          </button>
        )}
      </div>

      {/* Result */}
      {result && (
        <div className={`rounded-2xl border p-6 ${resultColor}`}>
          <div className="flex items-center gap-3 mb-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-full bg-white/10`}>
              <HugeiconsIcon icon={resultIcon} size={28} color="currentColor" className={resultIconColor} />
            </div>
            <div>
              <p className={`text-xl font-extrabold tracking-tight ${resultIconColor}`}>
                {resultTitle}
              </p>
              <p className="text-xs text-white/40 font-mono">{result.reference}</p>
            </div>
          </div>

          {result.valid && (
            <div className="space-y-2 border-t border-white/10 pt-4">
              <Row label="Attendee" value={result.name ?? "—"} />
              <Row label="Ticket Type" value={tier?.name ?? result.tierId ?? "—"} highlight />
              {result.department && <Row label="Department" value={result.department} />}
              <Row label="Amount Paid" value={`₦${((result.amount ?? 0) / 100).toLocaleString()}`} />
              {result.alreadyCheckedIn && result.checkedInAt && (
                <Row
                  label="Checked in at"
                  value={new Date(result.checkedInAt).toLocaleTimeString("en-NG")}
                />
              )}
            </div>
          )}

          {!result.valid && (
            <p className="text-sm text-red-400/70">{result.error ?? "Ticket not found or payment not completed."}</p>
          )}
        </div>
      )}
    </div>
  )
}

function Row({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-xs text-white/30 uppercase tracking-widest">{label}</span>
      <span className={`text-sm font-semibold ${highlight ? "text-primary" : "text-white"}`}>{value}</span>
    </div>
  )
}