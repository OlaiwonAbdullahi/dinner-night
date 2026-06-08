import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { ticketTiers } from "@/lib/data";
import { PrintTicketButton } from "@/components/print-ticket-button";

export default async function TicketReceiptPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  const ticket = await prisma.ticket.findUnique({ where: { reference } });
  if (!ticket || ticket.status !== "paid") notFound();

  const tier = ticketTiers.find((t) => t.id === ticket.tierId);
  const ticketNumber = reference.slice(-8).toUpperCase();
  const appUrl =
    process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "") ??
    "https://dinner.eventsnest.xyz";
  const verificationUrl = `${appUrl}/verify/${encodeURIComponent(reference)}`;
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&color=D4AF37&bgcolor=0d0d0d&data=${encodeURIComponent(verificationUrl)}`;

  return (
    <>
      {/* Print styles */}
      <style>{`
        * {
          -webkit-print-color-adjust: exact !important;
          print-color-adjust: exact !important;
          color-adjust: exact !important;
        }
        @media print {
          .no-print { display: none !important; }
          body { background: #000 !important; }
          .ticket-wrapper {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            width: 100% !important;
            max-width: 500px !important;
            padding: 0 16px !important;
          }
          .ticket-card {
            box-shadow: none !important;
            background: #0d0d0d !important;
            border: 2px solid #D4AF37 !important;
          }
        }
      `}</style>

      {/* Page wrapper */}
      <div className="ticket-wrapper min-h-screen bg-black flex flex-col items-center justify-center px-4 py-12">
        {/* Top nav — hidden on print */}
        <div className="no-print mb-8 flex w-full max-w-lg items-center justify-between">
          <Link
            href="/"
            className="text-xs font-extrabold tracking-widest text-white"
          >
            DINNER <span className="text-primary">NIGHT</span>
          </Link>
          <PrintTicketButton />
        </div>

        {/* Ticket card */}
        <div className="ticket-card w-full max-w-lg overflow-hidden rounded-3xl border border-primary/40 bg-[#0d0d0d] shadow-[0_0_60px_oklch(0.745_0.14_86/0.15)]">
          {/* Header band */}
          <div className="bg-primary px-8 py-6 text-center">
            <span
              className="text-xs font-extrabold tracking-[0.22em] text-white"
              style={{ fontFamily: "var(--font-display)" }}
            >
              CSC&apos;29
            </span>
            <p className="text-[10px] font-bold tracking-[0.3em] text-black/60 uppercase">
              Official Event Ticket
            </p>
            <h1
              className="mt-1 text-2xl font-extrabold tracking-tight text-black"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Dinner &amp; Award Night
            </h1>
            <p className="mt-0.5 text-xs font-semibold text-black/70 tracking-widest uppercase">
              Annual Awards Ceremony 2026
            </p>
          </div>

          {/* Perforated divider */}
          <div className="relative flex items-center">
            <div className="h-px flex-1 border-t border-dashed border-white/10" />
            <div className="absolute -left-4 h-8 w-8 rounded-full bg-black" />
            <div className="absolute -right-4 h-8 w-8 rounded-full bg-black" />
          </div>

          {/* Body */}
          <div className="px-8 py-6">
            <div className="grid grid-cols-2 gap-6">
              {/* Left: details */}
              <div className="space-y-4">
                <Detail label="Attendee" value={ticket.name} />
                <Detail
                  label="Ticket Type"
                  value={tier?.name ?? ticket.tierId}
                  highlight
                />
                <Detail label="Date" value="June 18, 2026" />
                <Detail
                  label="Venue"
                  value="Antimaggies event center, Yoaco Ogbomosho"
                />
                <Detail
                  label="Amount Paid"
                  value={`₦${(ticket.amount / 100).toLocaleString()}`}
                />
                {ticket.department && (
  <Detail label="Department" value={ticket.department} />
)} 
                
              </div>

              {/* Right: QR + ticket no */}
              <div className="flex flex-col items-center justify-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={qrUrl}
                  alt="Ticket QR code"
                  width={160}
                  height={160}
                  className="rounded-xl"
                />
                <p className="text-[10px] text-white/30 text-center">
                  Scan at entrance
                </p>
              </div>
            </div>
          </div>

          {/* Perforated divider */}
          <div className="relative flex items-center">
            <div className="h-px flex-1 border-t border-dashed border-white/10" />
            <div className="absolute -left-4 h-8 w-8 rounded-full bg-black" />
            <div className="absolute -right-4 h-8 w-8 rounded-full bg-black" />
          </div>

          {/* Footer stub */}
          <div className="flex items-center justify-between px-8 py-4">
            <div>
              <p className="text-[10px] text-white/25 uppercase tracking-widest">
                Ticket No.
              </p>
              <p className="font-mono text-sm font-bold text-primary">
                {ticketNumber}
              </p>
            </div>
            <div className="text-right">
              <p className="text-[10px] text-white/25 uppercase tracking-widest">
                Ref
              </p>
              <p className="font-mono text-xs text-white/40">{reference}</p>
            </div>
          </div>
        </div>

        {/* Download button — hidden on print */}
        <div className="no-print mt-6 flex gap-3">
          <PrintTicketButton label="Download Ticket (PDF)" />
          <Link
            href="/"
            className="rounded-xl border border-white/10 px-5 py-2.5 text-sm text-white/40 hover:text-white transition-colors"
          >
            Back to Home
          </Link>
        </div>

        <p className="no-print mt-4 text-xs text-white/20">
          Present this ticket (printed or on your screen) at the entrance.
        </p>
      </div>
    </>
  );
}

function Detail({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div>
      <p className="text-[10px] font-semibold tracking-widest text-white/25 uppercase">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-bold ${highlight ? "text-primary" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}
