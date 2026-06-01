import { prisma } from "@/lib/prisma";
import { ticketTiers } from "@/lib/data";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  CheckmarkCircle01Icon,
  CancelCircleIcon,
  Calendar01Icon,
  Location01Icon,
  Ticket01Icon,
  UserIcon,
} from "@hugeicons/core-free-icons";
import { VerifyTicketForm } from "@/components/verify-ticket-form";

export const dynamic = "force-dynamic";

export default async function VerifyPage({
  params,
}: {
  params: Promise<{ reference: string }>;
}) {
  const { reference } = await params;

  const ticket = await prisma.ticket.findUnique({ where: { reference } });
  const tier = ticket ? ticketTiers.find((t) => t.id === ticket.tierId) : null;
  const isValid = !!ticket && ticket.status === "paid";

  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4 py-12">
      <div className="w-full max-w-sm">
        <VerifyTicketForm />

        {/* Status banner */}
        <div
          className={`mb-6 flex flex-col items-center gap-3 rounded-3xl p-8 text-center border ${
            isValid
              ? "border-green-500/30 bg-green-500/10"
              : "border-red-500/30 bg-red-500/10"
          }`}
        >
          <div
            className={`flex h-20 w-20 items-center justify-center rounded-full ${
              isValid ? "bg-green-500/20" : "bg-red-500/20"
            }`}
          >
            <HugeiconsIcon
              icon={isValid ? CheckmarkCircle01Icon : CancelCircleIcon}
              size={44}
              color="currentColor"
              className={isValid ? "text-green-400" : "text-red-400"}
            />
          </div>
          <div>
            <p
              className={`text-2xl font-extrabold tracking-tight ${
                isValid ? "text-green-400" : "text-red-400"
              }`}
            >
              {isValid ? "VALID TICKET" : "INVALID TICKET"}
            </p>
            <p className="mt-1 text-sm text-white/40">
              {isValid
                ? "Admit this attendee"
                : ticket
                  ? "Payment not completed"
                  : "Ticket not found"}
            </p>
          </div>
        </div>

        {/* Ticket details — only show if valid */}
        {isValid && ticket && (
          <div className="rounded-2xl border border-white/8 bg-[#0d0d0d] overflow-hidden">
            {/* Gold header */}
            <div className="bg-primary px-5 py-3 flex items-center justify-between">
              <span
                className="text-xs font-extrabold tracking-widest text-black"
                style={{ fontFamily: "var(--font-display)" }}
              >
                CSC&apos;29
              </span>
              <span className="rounded-full bg-black/20 px-3 py-0.5 text-[10px] font-bold tracking-wider text-black uppercase">
                {tier?.name ?? ticket.tierId}
              </span>
            </div>

            {/* Details */}
            <div className="divide-y divide-white/5 px-5 py-2">
              <Row icon={UserIcon} label="Attendee" value={ticket.name} />
              <Row
                icon={Ticket01Icon}
                label="Ticket Type"
                value={tier?.name ?? ticket.tierId}
                highlight
              />
              <Row icon={Calendar01Icon} label="Date" value="June 18, 2026" />
              <Row
                icon={Location01Icon}
                label="Venue"
                value="Antimaggies event center, Yoaco Ogbomosho"
              />
            </div>

            {/* Reference */}
            <div className="border-t border-white/5 px-5 py-3 flex items-center justify-between">
              <span className="text-[10px] text-white/25 uppercase tracking-widest">
                Ref
              </span>
              <span className="font-mono text-xs text-white/30">
                {reference}
              </span>
            </div>
          </div>
        )}

        {/* Branding */}
        <p className="mt-6 text-center text-[10px] text-white/20 tracking-wider uppercase">
          Dinner &amp; Award Night · 2026
        </p>
      </div>
    </div>
  );
}

function Row({
  icon,
  label,
  value,
  highlight,
}: {
  icon: typeof UserIcon;
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-start gap-3 py-3">
      <HugeiconsIcon
        icon={icon}
        size={15}
        color="currentColor"
        className="text-primary mt-0.5 shrink-0"
      />
      <div className="min-w-0">
        <p className="text-[10px] text-white/25 uppercase tracking-widest">
          {label}
        </p>
        <p
          className={`text-sm font-semibold mt-0.5 ${highlight ? "text-primary" : "text-white"}`}
        >
          {value}
        </p>
      </div>
    </div>
  );
}
