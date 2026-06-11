import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { GuideDetailClient } from "@/components/guides/guide-detail-client";
import {
  getAllGuides,
  getGuideBySlug,
  getGuideSummaryBySlug,
} from "@/lib/study-guides";

type GuidePageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return getAllGuides().map((guide) => ({ slug: guide.slug }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideSummaryBySlug(slug);

  if (!guide) {
    return {
      title: "Guide not found | Developer Study Guide",
    };
  }

  return {
    title: `${guide.title} | Developer Study Guide`,
    description: guide.summary,
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = await getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  return (
    <div className="mx-auto flex w-full max-w-screen-2xl flex-col gap-10 px-6 py-10 lg:px-8 lg:py-14">
      <section className="space-y-6 rounded-[32px] border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.52)] backdrop-blur-xl lg:p-10">
        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-400">
          <Link href="/" className="transition hover:text-white">
            Home
          </Link>
          <span>/</span>
          <Link href="/guides" className="transition hover:text-white">
            Library
          </Link>
          <span>/</span>
          <span className="text-slate-200">{guide.title}</span>
        </div>
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_300px]">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs uppercase tracking-[0.28em] text-slate-300">
                {guide.section}
              </span>
              <span className="rounded-full border border-emerald-400/25 bg-emerald-400/10 px-4 py-2 text-xs uppercase tracking-[0.28em] text-emerald-200">
                {guide.level}
              </span>
            </div>
            <div className="space-y-4">
              <h1 className="max-w-4xl text-4xl font-semibold tracking-tight text-white lg:text-5xl">
                {guide.title}
              </h1>
              <p className="max-w-3xl text-lg leading-8 text-slate-300">
                {guide.strapline}
              </p>
            </div>
          </div>
          <div className="grid gap-4 rounded-[28px] border border-white/10 bg-slate-950/65 p-5">
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Estimated time
              </p>
              <p className="mt-2 text-2xl font-semibold text-white">
                {guide.duration}
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                Audience
              </p>
              <p className="mt-2 text-sm leading-7 text-slate-300">{guide.audience}</p>
            </div>
          </div>
        </div>
      </section>

      <GuideDetailClient guide={guide} />
    </div>
  );
}