import { VerifyTicketForm } from "@/components/verify-ticket-form";

export default function VerifyLookupPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-md">
        <div className="rounded-[2.25rem] border border-white/10 bg-[#0d0d0d] p-8 shadow-[0_0_50px_rgba(0,0,0,0.35)]">
          <div className="mb-6 text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-white/30">
              Ticket verification
            </p>
            <h1 className="mt-4 text-3xl font-extrabold tracking-tight text-white">
              Scan or enter a ticket reference
            </h1>
            <p className="mt-3 text-sm text-white/50">
              Use this page to verify tickets manually when the QR code is not
              available.
            </p>
          </div>

          <VerifyTicketForm />

          <p className="mt-6 text-center text-xs text-white/30">
            Enter the ticket reference from the receipt.
          </p>
        </div>
      </div>
    </div>
  );
}
