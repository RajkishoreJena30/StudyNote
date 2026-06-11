import Link from "next/link";

import type { StudyGuideSectionWithGuides } from "@/lib/study-guides";

import { StudyGuideCard } from "./study-guide-card";

type GuideSectionBlockProps = {
  section: StudyGuideSectionWithGuides;
};

export function GuideSectionBlock({ section }: GuideSectionBlockProps) {
  return (
    <section className="rounded-[32px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.36)] backdrop-blur-xl lg:p-8">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div className="max-w-2xl space-y-3">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
            {section.kicker}
          </p>
          <h3 className="text-3xl font-semibold tracking-tight text-white">
            {section.title}
          </h3>
          <p className="text-base leading-8 text-slate-300">{section.description}</p>
        </div>
        <Link
          href={`/guides/${section.guides[0]?.slug ?? "javascript-core"}`}
          className="inline-flex items-center text-sm font-medium text-emerald-200 transition hover:text-emerald-100"
        >
          Start this track
        </Link>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2 xl:grid-cols-3">
        {section.guides.map((guide) => (
          <StudyGuideCard key={guide.slug} guide={guide} />
        ))}
      </div>
    </section>
  );
}