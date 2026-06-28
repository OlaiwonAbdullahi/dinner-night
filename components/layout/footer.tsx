import Link from "next/link";
import { HugeiconsIcon } from "@hugeicons/react";
import {
  SparklesIcon,
  Location01Icon,
  Calendar01Icon,
} from "@hugeicons/core-free-icons";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/voting", label: "Vote" },
  { href: "/tickets", label: "Tickets" },
];

export default function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-10">
          {/* Brand */}
          <div className="sm:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <span className="text-sm font-extrabold tracking-[0.2em] text-white">
                CSC'29
              </span>
            </Link>
            <p className="text-xs text-white/30 leading-relaxed max-w-xs">
              CSC&apos;29 Dinner &amp; Award Night — celebrating excellence,
              talent, and achievement. An unforgettable evening of glamour and
              recognition.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
              Quick Links
            </h4>
            <ul className="space-y-2">
              {quickLinks.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="text-sm text-white/40 hover:text-primary transition-colors"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Event info */}
          <div>
            <h4 className="mb-4 text-xs font-bold tracking-[0.2em] text-white/40 uppercase">
              Event Info
            </h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/40">
                <HugeiconsIcon
                  icon={Calendar01Icon}
                  size={14}
                  color="currentColor"
                  className="text-primary mt-0.5 shrink-0"
                />
                July 4, 2026
              </li>
              <li className="flex items-start gap-2 text-sm text-white/40">
                <HugeiconsIcon
                  icon={Location01Icon}
                  size={14}
                  color="currentColor"
                  className="text-primary mt-0.5 shrink-0"
                />
                Ambassadors event center, Yoaco Ogbomosho{" "}
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/5 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">
            © 2026 CSC'29. All rights reserved.
          </p>
          <p className="text-xs text-white/20">Designed with 💜and☕</p>
        </div>
      </div>
    </footer>
  );
}
