"use client"

import { useRef, useState } from "react"
import { HugeiconsIcon } from "@hugeicons/react"
import {
  Upload01Icon,
  CheckmarkCircle01Icon,
  Cancel01Icon,
  InformationCircleIcon,
  Loading03Icon,
} from "@hugeicons/core-free-icons"
import type { BulkVerifyResponse, BulkVerifyResult } from "@/app/api/admin/bulk-verify/route"

type State = "idle" | "loading" | "done" | "error"

function StatusBadge({ status }: { status: BulkVerifyResult["status"] }) {
  const map = {
    verified: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
    skipped: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    failed: "bg-red-500/10 text-red-400 border-red-500/20",
  }
  return (
    <span className={`inline-flex items-center rounded-md border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${map[status]}`}>
      {status}
    </span>
  )
}

export default function BulkVerifyPage() {
  const inputRef = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [state, setState] = useState<State>("idle")
  const [error, setError] = useState<string | null>(null)
  const [response, setResponse] = useState<BulkVerifyResponse | null>(null)
  const [dragging, setDragging] = useState(false)

  function pickFile(f: File) {
    if (!f.name.endsWith(".csv")) {
      setError("Only CSV files are supported.")
      return
    }
    setFile(f)
    setError(null)
    setResponse(null)
    setState("idle")
  }

  async function handleSubmit() {
    if (!file) return
    setState("loading")
    setError(null)
    try {
      const fd = new FormData()
      fd.append("file", file)
      const res = await fetch("/api/admin/bulk-verify", { method: "POST", body: fd })
      const json = await res.json()
      if (!res.ok) {
        setError(json.error ?? "Unknown error")
        setState("error")
        return
      }
      const full = json as BulkVerifyResponse
      // Filter to tickets only
      const ticketResults = full.results.filter((r) => r.type === "ticket" || r.status === "failed")
      const summary = {
        total: ticketResults.length,
        verified: ticketResults.filter((r) => r.status === "verified").length,
        skipped: ticketResults.filter((r) => r.status === "skipped").length,
        failed: ticketResults.filter((r) => r.status === "failed").length,
      }
      setResponse({ summary, results: ticketResults })
      setState("done")
    } catch (err) {
      setError(String(err))
      setState("error")
    }
  }

  const summary = response?.summary
  const results = response?.results ?? []

  return (
    <div className="p-6 md:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-extrabold tracking-tight text-white">Bulk Verify Tickets</h1>
        <p className="mt-1 text-sm text-white/40">
          Export ticket transactions from Paystack, upload the CSV, and sync them to the database.
        </p>
      </div>

      <div
        className={`mb-6 flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed p-10 transition-colors cursor-pointer ${
          dragging ? "border-primary/60 bg-primary/5" : "border-white/10 bg-white/2 hover:border-white/20"
        }`}
        onDragOver={(e) => { e.preventDefault(); setDragging(true) }}
        onDragLeave={() => setDragging(false)}
        onDrop={(e) => { e.preventDefault(); setDragging(false); const f = e.dataTransfer.files[0]; if (f) pickFile(f) }}
        onClick={() => inputRef.current?.click()}
      >
        <input ref={inputRef} type="file" accept=".csv" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) pickFile(f) }} />
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/5">
          <HugeiconsIcon icon={Upload01Icon} size={22} color="currentColor" className="text-white/40" />
        </div>
        {file ? (
          <div className="text-center">
            <p className="text-sm font-semibold text-white">{file.name}</p>
            <p className="text-xs text-white/30">{(file.size / 1024).toFixed(1)} KB — click to replace</p>
          </div>
        ) : (
          <div className="text-center">
            <p className="text-sm font-semibold text-white/60">Drop your Paystack CSV here</p>
            <p className="text-xs text-white/25">or click to browse</p>
          </div>
        )}
      </div>

      {error && (
        <div className="mb-4 flex items-start gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
          <HugeiconsIcon icon={Cancel01Icon} size={15} color="currentColor" className="mt-0.5 shrink-0" />
          {error}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!file || state === "loading"}
        className="mb-8 flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-black transition-opacity disabled:opacity-40"
      >
        {state === "loading" ? (
          <><HugeiconsIcon icon={Loading03Icon} size={15} color="currentColor" className="animate-spin" />Verifying…</>
        ) : (
          <><HugeiconsIcon icon={CheckmarkCircle01Icon} size={15} color="currentColor" />Run Verification</>
        )}
      </button>

      {summary && (
        <div className="mb-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {[
            { label: "Total", value: summary.total, color: "text-white" },
            { label: "Verified", value: summary.verified, color: "text-emerald-400" },
            { label: "Skipped", value: summary.skipped, color: "text-yellow-400" },
            { label: "Failed", value: summary.failed, color: "text-red-400" },
          ].map(({ label, value, color }) => (
            <div key={label} className="rounded-2xl border border-white/8 bg-card p-4">
              <p className="text-[10px] font-bold uppercase tracking-widest text-white/30">{label}</p>
              <p className={`mt-1 text-3xl font-extrabold tabular-nums ${color}`}>{value}</p>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-2xl border border-white/8 bg-card overflow-hidden">
          <div className="border-b border-white/5 px-4 py-3 flex items-center gap-2">
            <HugeiconsIcon icon={InformationCircleIcon} size={14} color="currentColor" className="text-white/30" />
            <span className="text-xs font-bold text-white/40 uppercase tracking-wide">Ticket Results</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-white/5">
                  <th className="px-4 py-2.5 text-left font-bold text-white/25 uppercase tracking-wider">Reference</th>
                  <th className="px-4 py-2.5 text-left font-bold text-white/25 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-2.5 text-left font-bold text-white/25 uppercase tracking-wider">Detail</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {results.map((r) => (
                  <tr key={r.reference} className="hover:bg-white/2 transition-colors">
                    <td className="px-4 py-2.5 font-mono text-white/60 max-w-[200px] truncate">{r.reference}</td>
                    <td className="px-4 py-2.5"><StatusBadge status={r.status} /></td>
                    <td className="px-4 py-2.5 text-white/30 max-w-[280px] truncate">{r.error ?? r.paystackStatus ?? "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}