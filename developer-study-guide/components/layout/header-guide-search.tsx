"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import type { StudyGuideSummary } from "@/lib/study-guides";

type HeaderGuideSearchProps = {
  guides: StudyGuideSummary[];
};

const suggestionLimit = 6;

export function HeaderGuideSearch({ guides }: HeaderGuideSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  const normalizedQuery = query.trim().toLowerCase();
  const suggestions = normalizedQuery
    ? guides
        .filter((guide) => matchesGuide(guide, normalizedQuery))
        .slice(0, suggestionLimit)
    : [];

  const showSuggestions = isFocused && normalizedQuery.length > 0;

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!normalizedQuery) {
      router.push("/guides");
      return;
    }

    router.push(`/guides?q=${encodeURIComponent(query.trim())}`);
  }

  return (
    <div className="relative lg:min-w-90">
      <form
        onSubmit={handleSubmit}
        className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1"
      >
        <input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          onFocus={() => setIsFocused(true)}
          onBlur={() => {
            window.setTimeout(() => setIsFocused(false), 120);
          }}
          placeholder="Search topic"
          className="h-10 min-w-0 flex-1 bg-transparent px-4 text-sm text-white outline-none placeholder:text-slate-500"
        />
        <button
          type="submit"
          className="inline-flex h-10 items-center justify-center rounded-full bg-emerald-400 px-4 text-sm font-medium text-slate-950 transition hover:bg-emerald-300"
        >
          Search
        </button>
      </form>

      {showSuggestions ? (
        <div className="absolute left-0 right-0 top-[calc(100%+0.6rem)] z-50 overflow-hidden rounded-3xl border border-white/10 bg-slate-950/95 shadow-[0_24px_80px_rgba(2,6,23,0.65)] backdrop-blur-xl">
          {suggestions.length > 0 ? (
            <div className="p-2">
              {suggestions.map((guide) => (
                <Link
                  key={guide.slug}
                  href={`/guides/${guide.slug}`}
                  className="block rounded-2xl px-4 py-3 transition hover:bg-white/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm font-medium text-white">{guide.title}</p>
                    <span className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] uppercase tracking-[0.2em] text-slate-300">
                      {guide.section}
                    </span>
                  </div>
                  <p className="mt-1 line-clamp-2 text-sm text-slate-400">
                    {guide.summary}
                  </p>
                </Link>
              ))}
              <Link
                href={`/guides?q=${encodeURIComponent(query.trim())}`}
                className="mt-2 flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-emerald-100 transition hover:border-emerald-300/30 hover:bg-emerald-400/10"
              >
                <span>See all matching topics</span>
                <span className="text-slate-300">{query.trim()}</span>
              </Link>
            </div>
          ) : (
            <div className="px-4 py-5 text-sm text-slate-400">
              No guide matched "{query.trim()}".
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}

function matchesGuide(guide: StudyGuideSummary, query: string) {
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