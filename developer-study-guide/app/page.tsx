import Link from "next/link";

import { GuidesLibrarySearch } from "@/components/guides/guides-library-search";
import { StudyGuideCard } from "@/components/home/study-guide-card";
import {
  getFeaturedGuides,
  getGuideCount,
  getHomeSections,
  getSectionCount,
} from "@/lib/study-guides";

export default function Home() {
  const featuredGuides = getFeaturedGuides();
  const sections = getHomeSections();

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-20 px-6 py-10 lg:px-8 lg:py-16">
      <section className="grid gap-8 lg:grid-cols-[minmax(0,1.25fr)_minmax(320px,0.75fr)] lg:items-end">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-3 rounded-full border border-emerald-400/20 bg-emerald-400/10 px-4 py-2 text-sm text-emerald-100">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-300" />
            Production-grade learning workspace for new and experienced developers
          </div>
          <div className="space-y-6">
            <h1 className="max-w-4xl text-5xl font-semibold leading-[1.04] tracking-tight text-white md:text-6xl">
              Study architecture, frontend systems, and hands-on code from one
              structured developer hub.
            </h1>
            <p className="max-w-3xl text-lg leading-8 text-slate-300 md:text-xl">
              The homepage surfaces the strongest material already present in the
              repository, then routes each topic into a dedicated study page with
              overview notes, README-style content, and real code references.
            </p>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row">
            <Link
              href="/guides"
              className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-slate-950 transition hover:bg-slate-100"
            >
              Browse the library
            </Link>
            <Link
              href={`/guides/${featuredGuides[0]?.slug ?? "javascript-core"}`}
              className="inline-flex items-center justify-center rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-slate-100 transition hover:border-white/30 hover:bg-white/10"
            >
              Open a featured guide
            </Link>
          </div>
        </div>

        <div className="grid gap-4 rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.55)] backdrop-blur-xl">
          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-slate-950/65 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Modules
              </p>
              <p className="mt-4 text-4xl font-semibold text-white">{getGuideCount()}</p>
              <p className="mt-2 text-sm text-slate-400">Curated from across the repo</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/65 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Tracks
              </p>
              <p className="mt-4 text-4xl font-semibold text-white">{getSectionCount()}</p>
              <p className="mt-2 text-sm text-slate-400">Foundations to architecture</p>
            </div>
            <div className="rounded-3xl border border-white/10 bg-slate-950/65 p-5">
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Study Mode
              </p>
              <p className="mt-4 text-xl font-semibold text-white">Read, compare, revise</p>
              <p className="mt-2 text-sm text-slate-400">
                Switch between overview, markdown notes, and source code.
              </p>
            </div>
          </div>
          <div className="rounded-[28px] border border-white/10 bg-linear-to-br from-white/8 via-white/4 to-transparent p-6">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              What this app solves
            </p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-slate-300">
              <p>
                A new developer gets guided entry points and friendly summaries.
              </p>
              <p>
                An experienced developer gets fast revision tabs, code touchpoints,
                and focused section navigation.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="space-y-6">
        <div className="flex items-end justify-between gap-6">
          <div className="space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Featured Guides
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Start with the highest-leverage revision paths
            </h2>
          </div>
          <Link
            href="/guides"
            className="hidden text-sm font-medium text-emerald-200 transition hover:text-emerald-100 md:inline-flex"
          >
            View the full library
          </Link>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {featuredGuides.map((guide) => (
            <StudyGuideCard key={guide.slug} guide={guide} />
          ))}
        </div>
      </section>

      <section className="space-y-8">
        <div className="space-y-3">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
            Search And Explore
          </p>
          <h2 className="text-3xl font-semibold tracking-tight text-white">
            Search specific topics from the dashboard
          </h2>
        </div>
        <GuidesLibrarySearch sections={sections} />
      </section>
    </div>
  );
}
