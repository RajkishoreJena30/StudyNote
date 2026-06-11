import type { Metadata } from "next";
import Link from "next/link";
import { DM_Sans, IBM_Plex_Mono } from "next/font/google";

import { HeaderGuideSearch } from "@/components/layout/header-guide-search";
import { getAllGuides } from "@/lib/study-guides";

import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

const ibmPlexMono = IBM_Plex_Mono({
  variable: "--font-ibm-plex-mono",
  weight: ["400", "500", "600"],
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Developer Study Guide",
  description:
    "A production-style study hub for beginner and experienced developers to revise architecture, frameworks, and core engineering topics.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const guides = getAllGuides();

  return (
    <html
      lang="en"
      className={`${dmSans.variable} ${ibmPlexMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <div className="relative min-h-screen overflow-x-clip">
          <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top,rgba(63,94,251,0.12),transparent_32%),radial-gradient(circle_at_20%_20%,rgba(16,185,129,0.12),transparent_28%),linear-gradient(180deg,rgba(15,23,42,0.88),rgba(2,6,23,1))]" />
          <header className="sticky top-0 z-40 border-b border-white/10 bg-slate-950/75 backdrop-blur-xl">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-4 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <Link href="/" className="flex items-center gap-3">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-emerald-400/25 bg-emerald-400/10 text-sm font-semibold text-emerald-200">
                  DS
                </span>
                <span>
                  <span className="block text-sm uppercase tracking-[0.32em] text-slate-400">
                    Revision Hub
                  </span>
                  <span className="block text-lg font-semibold text-slate-50">
                    Developer Study Guide
                  </span>
                </span>
              </Link>
              <div className="flex w-full flex-col gap-3 lg:w-auto lg:flex-row lg:items-center">
                <nav className="flex items-center gap-3 text-sm text-slate-300">
                  <Link
                    href="/"
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    Home
                  </Link>
                  <Link
                    href="/guides"
                    className="rounded-full border border-white/10 px-4 py-2 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    Library
                  </Link>
                </nav>
                <HeaderGuideSearch guides={guides} />
              </div>
            </div>
          </header>
          <main className="relative z-10">{children}</main>
          <footer className="relative z-10 border-t border-white/10 bg-slate-950/70">
            <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-6 text-sm text-slate-400 lg:flex-row lg:items-center lg:justify-between lg:px-8">
              <p>
                Built for fast revision, deeper rereads, and practical code study
                from the repository.
              </p>
              <p>Multi-page, dark, and focused on beginner-to-senior learning paths.</p>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
