"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function VerifyTicketForm() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        const value = query.trim();
        if (!value) return;
        router.push(`/verify/${encodeURIComponent(value)}`);
      }}
      className="mb-6 rounded-3xl border border-white/10 bg-[#111111]/80 p-6"
    >
      <div className="mb-4">
        <label className="block text-xs font-semibold uppercase tracking-[0.22em] text-white/40">
          Ticket reference
        </label>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Enter reference"
          className="mt-3 w-full rounded-2xl border border-white/10 bg-black/80 px-4 py-3 text-sm text-white outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <button
        type="submit"
        disabled={!query.trim()}
        className="inline-flex w-full items-center justify-center rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-black transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Verify ticket
      </button>
    </form>
  );
}
