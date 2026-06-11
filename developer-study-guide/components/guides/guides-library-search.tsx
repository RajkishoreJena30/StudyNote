"use client";

import { useState } from "react";

import type { StudyGuideSectionWithGuides, StudyGuideSummary } from "@/lib/study-guides";

import { GuideSectionBlock } from "@/components/home/guide-section-block";

type GuidesLibrarySearchProps = {
  sections: StudyGuideSectionWithGuides[];
  initialQuery?: string;
};

export function GuidesLibrarySearch({
  sections,
  initialQuery = "",
}: GuidesLibrarySearchProps) {
  const [query, setQuery] = useState(initialQuery);

  const normalizedQuery = query.trim().toLowerCase();
  const filteredSections = sections
    .map((section) => ({
      ...section,
      guides: section.guides.filter((guide) => matchesGuide(guide, normalizedQuery)),
    }))
    .filter((section) => section.guides.length > 0);

  const guideCount = filteredSections.reduce(
    (total, section) => total + section.guides.length,
    0,
  );

  return (
    <div className="space-y-8">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.36)] backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl space-y-3">
            <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
              Topic Search
            </p>
            <h2 className="text-3xl font-semibold tracking-tight text-white">
              Find a specific topic across your study dashboard
            </h2>
            <p className="text-base leading-8 text-slate-300">
              Search by topic name, concept, section, or keywords like React,
              authentication, routing, backend, or system design.
            </p>
          </div>
          <div className="rounded-3xl border border-emerald-400/20 bg-emerald-400/10 px-4 py-3 text-sm text-emerald-100">
            {normalizedQuery
              ? `${guideCount} topic${guideCount === 1 ? "" : "s"} found`
              : "Search all study topics"}
          </div>
        </div>

        <div className="mt-8 grid gap-4 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <label className="block">
            <span className="mb-3 block text-sm font-medium text-slate-200">
              Search topic
            </span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search topic, concept, or keyword"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/70 px-5 py-4 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-emerald-300/40 focus:ring-2 focus:ring-emerald-300/15"
            />
          </label>
          {normalizedQuery ? (
            <button
              type="button"
              onClick={() => setQuery("")}
              className="inline-flex h-14 items-center justify-center rounded-2xl border border-white/10 bg-white/5 px-5 text-sm font-medium text-slate-200 transition hover:border-white/20 hover:bg-white/10"
            >
              Clear search
            </button>
          ) : null}
        </div>
      </section>

      {filteredSections.length > 0 ? (
        <div className="space-y-8">
          {filteredSections.map((section) => (
            <GuideSectionBlock key={section.id} section={section} />
          ))}
        </div>
      ) : (
        <section className="rounded-4xl border border-dashed border-white/10 bg-white/5 p-10 text-center shadow-[0_24px_80px_rgba(2,6,23,0.28)] backdrop-blur-xl">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
            No matches
          </p>
          <h3 className="mt-4 text-2xl font-semibold text-white">
            No study topic matched "{query}"
          </h3>
          <p className="mt-3 text-base leading-8 text-slate-300">
            Try a broader keyword like frontend, hooks, design, backend, auth,
            performance, or architecture.
          </p>
        </section>
      )}
    </div>
  );
}

function matchesGuide(guide: StudyGuideSummary, query: string) {
  if (!query) {
    return true;
  }

  const searchableText = [
    guide.title,
    guide.strapline,
    guide.section,
    guide.audience,
    guide.summary,
    ...guide.concepts,
    ...guide.outcomes,
  ]
    .join(" ")
    .toLowerCase();

  return searchableText.includes(query);
}