import Link from "next/link";

import type { StudyGuideSummary } from "@/lib/study-guides";

type StudyGuideCardProps = {
  guide: StudyGuideSummary;
};

export function StudyGuideCard({ guide }: StudyGuideCardProps) {
  return (
    <Link
      href={`/guides/${guide.slug}`}
      className="group flex h-full flex-col rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.36)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">
            {guide.section}
          </p>
          <h3 className="mt-3 text-2xl font-semibold tracking-tight text-white">
            {guide.title}
          </h3>
        </div>
        <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-slate-200">
          {guide.level}
        </span>
      </div>

      <p className="mt-4 text-sm leading-7 text-slate-300">{guide.summary}</p>

      <div className="mt-6 flex flex-wrap gap-2">
        {guide.concepts.slice(0, 3).map((concept) => (
          <span
            key={concept}
            className="rounded-full border border-white/10 bg-slate-950/65 px-3 py-1 text-xs text-slate-300"
          >
            {concept}
          </span>
        ))}
      </div>

      <div className="mt-auto pt-8 text-sm text-slate-400">
        <div className="flex items-center justify-between border-t border-white/10 pt-4">
          <span>{guide.duration}</span>
          <span className="font-medium text-emerald-200 transition group-hover:text-emerald-100">
            Open guide
          </span>
        </div>
      </div>
    </Link>
  );
}