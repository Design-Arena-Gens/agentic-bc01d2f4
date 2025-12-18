import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "NexaForge Pro · Agentic AI Website Builder",
  description:
    "NexaForge Pro orchestrates architect, copywriter, visual, and integration agents to launch production-ready websites powered by Supabase, Stripe, and OpenAI.",
  openGraph: {
    title: "NexaForge Pro · Ultimate AI Website Forge",
    description:
      "Agents collaborate to ship complete site blueprints with Supabase, Stripe, and OpenAI.",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "NexaForge Pro interface preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "NexaForge Pro · Agentic Builder",
    description:
      "Multi-agent workflows that craft industry-calibrated sites in minutes.",
    creator: "@nexaforge",
    images: ["/og.png"],
  },
  metadataBase: new URL("https://agentic-bc01d2f4.vercel.app"),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.15),transparent_55%),radial-gradient(circle_at_bottom,rgba(147,51,234,0.15),transparent_50%)] text-foreground antialiased`}
      >
        <div className="relative flex min-h-screen flex-col">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(59,130,246,0.18),_transparent_45%),radial-gradient(circle_at_bottom_left,_rgba(168,85,247,0.12),_transparent_45%)]" />
          <main className="relative z-10 flex-1">{children}</main>
          <footer className="relative z-10 border-t border-white/10 bg-slate-950/60 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-6 text-xs uppercase tracking-[0.3em] text-muted-foreground md:flex-row">
              <span>© {new Date().getFullYear()} NexaForge Labs</span>
              <span>Supabase · Stripe · OpenAI · Vercel</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
