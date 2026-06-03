import type { Metadata } from "next";
import { Geist, Geist_Mono, Figtree, Unbounded } from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";

const figtree = Figtree({subsets:['latin'],variable:'--font-sans'});

const unbounded = Unbounded({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["300", "400", "500", "600", "700", "800", "900"],
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
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
      suppressHydrationWarning
      className={cn("h-full", "antialiased", geistSans.variable, geistMono.variable, "font-sans", figtree.variable, unbounded.variable)}
    >
      <body suppressHydrationWarning className="min-h-full flex flex-col">
        {children}
      </body>
    </html>
  );
}
