import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Unbounded } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
  preload: false,
});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["400", "700", "900"],
  display: "swap",
  preload: false,
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
  preload: false,
});

export const metadata: Metadata = {
  metadataBase: new URL("https://dinner.eventsnest.xyz"),
  title: "Dinner Night Awards 2026",
  description:
    "Vote for your favourite nominees and secure your tickets for the Annual Dinner Night Awards 2026 — An Evening of Excellence & Glamour.",
  openGraph: {
    title: "Dinner Night Awards 2026",
    description:
      "Vote for your favourite nominees and secure your tickets for the Annual Dinner Night Awards 2026 — An Evening of Excellence & Glamour.",
    url: "https://dinner.eventsnest.xyz",
    siteName: "Dinner Night Awards 2026",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Dinner Night Awards 2026",
    description:
      "Vote for your favourite nominees and secure your tickets for the Annual Dinner Night Awards 2026 — An Evening of Excellence & Glamour.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        figtree.variable,
        unbounded.variable
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        {children}
        <Script
          src="https://js.paystack.co/v1/inline.js"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}