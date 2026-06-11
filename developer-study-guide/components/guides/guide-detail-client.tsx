"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

import type { GuideDetail, GuideTab } from "@/lib/study-guides";

import { MarkdownArticle } from "./markdown-article";

type GuideDetailClientProps = {
  guide: GuideDetail;
};

const tabs: Array<{ id: GuideTab; label: string; description: string }> = [
  {
    id: "overview",
    label: "Overview",
    description: "Intent, outcomes, and revision notes",
  },
  {
    id: "docs",
    label: "Repo Docs",
    description: "Markdown files loaded directly from your repository",
  },
  {
    id: "code",
    label: "Code",
    description: "Source touchpoint to connect concepts with implementation",
  },
];

export function GuideDetailClient({ guide }: GuideDetailClientProps) {
  const [activeTab, setActiveTab] = useState<GuideTab>(
    guide.documents.length > 1 ? "docs" : "overview",
  );
  const [activeDocumentId, setActiveDocumentId] = useState(
    guide.documents[0]?.id ?? "",
  );
  const activeTabMeta = tabs.find((tab) => tab.id === activeTab) ?? tabs[0];
  const activeDocument = useMemo(
    () =>
      guide.documents.find((document) => document.id === activeDocumentId) ??
      guide.documents[0],
    [activeDocumentId, guide.documents],
  );

  useEffect(() => {
    setActiveDocumentId(guide.documents[0]?.id ?? "");
    setActiveTab(guide.documents.length > 1 ? "docs" : "overview");
  }, [guide.documents, guide.slug]);

  return (
    <div className="grid gap-8 lg:grid-cols-[248px_minmax(0,1fr)] lg:items-start xl:grid-cols-[232px_minmax(0,1fr)]">
      <aside className="rounded-[28px] border border-white/10 bg-white/5 p-5 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:sticky lg:top-24">
        <div className="space-y-5">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Study modes
            </p>
            <div className="mt-4 grid gap-2">
              {tabs.map((tab) => {
                const isActive = tab.id === activeTab;

                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`rounded-2xl border px-4 py-3 text-left transition ${
                      isActive
                        ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                        : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20 hover:bg-white/5"
                    }`}
                  >
                    <span className="block text-sm font-semibold">{tab.label}</span>
                    <span className="mt-1 block text-xs leading-6 text-inherit/80">
                      {tab.description}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Quick facts
            </p>
            <div className="mt-4 space-y-3 text-sm text-slate-300">
              <p>Repo docs: {guide.documents.length} files</p>
              <p>Code source: {guide.codeSource.stats.totalLines} lines</p>
              <p>Audience: {guide.audience}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Core concepts
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {guide.concepts.map((concept) => (
                <span
                  key={concept}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-300"
                >
                  {concept}
                </span>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-950/60 p-4">
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              Related guides
            </p>
            <div className="mt-4 grid gap-2 text-sm text-slate-300">
              {guide.relatedGuides.map((relatedGuide) => (
                <Link
                  key={relatedGuide.slug}
                  href={`/guides/${relatedGuide.slug}`}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                >
                  {relatedGuide.title}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </aside>

      <section className="rounded-[28px] border border-white/10 bg-white/5 p-6 shadow-[0_24px_80px_rgba(2,6,23,0.35)] backdrop-blur-xl lg:p-8">
        <div className="flex flex-col gap-3 border-b border-white/10 pb-6 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
              {activeTabMeta.label}
            </p>
            <h2 className="mt-2 text-3xl font-semibold tracking-tight text-white">
              {activeTabMeta.description}
            </h2>
          </div>
          <div className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-300">
            <span className="font-medium text-slate-100">{guide.duration}</span>
            <span className="mx-2 text-slate-600">/</span>
            <span>{guide.level}</span>
          </div>
        </div>

        {activeTab === "overview" ? (
          <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1fr)_240px]">
            <div className="space-y-8">
              <section className="space-y-4">
                <p className="text-base leading-8 text-slate-300">{guide.summary}</p>
                <p className="text-base leading-8 text-slate-300">{guide.strapline}</p>
              </section>

              <section className="space-y-4">
                <h3 className="text-xl font-semibold text-white">What you should extract</h3>
                <div className="grid gap-3">
                  {guide.outcomes.map((outcome) => (
                    <div
                      key={outcome}
                      className="rounded-2xl border border-white/10 bg-slate-950/60 px-4 py-4 text-sm leading-7 text-slate-300"
                    >
                      {outcome}
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-4 rounded-3xl border border-white/10 bg-slate-950/60 p-5">
              <h3 className="text-lg font-semibold text-white">Source files used here</h3>
              <div className="space-y-3 text-sm text-slate-300">
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Repo docs
                  </p>
                  <p className="mt-2">{guide.documents.length} markdown files loaded</p>
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                    Code file
                  </p>
                  <p className="mt-2 break-all">{guide.codePath}</p>
                </div>
              </div>
            </div>
          </div>
        ) : null}

        {activeTab === "docs" && activeDocument ? (
          <div className="space-y-6 pt-8">
            {guide.documents.length > 1 ? (
              <div className="flex flex-wrap gap-3">
                {guide.documents.map((document) => {
                  const isActive = document.id === activeDocument.id;

                  return (
                    <button
                      key={document.id}
                      type="button"
                      onClick={() => setActiveDocumentId(document.id)}
                      className={`rounded-full border px-4 py-2 text-sm transition ${
                        isActive
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-100"
                          : "border-white/10 bg-slate-950/60 text-slate-300 hover:border-white/20 hover:bg-white/5"
                      }`}
                    >
                      {document.title}
                    </button>
                  );
                })}
              </div>
            ) : null}

            <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_224px] 2xl:grid-cols-[minmax(0,1fr)_240px]">
              <div className="space-y-4">
                <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.28em] text-slate-500">
                      Repository markdown
                    </p>
                    <p className="mt-2 break-all">{activeDocument.filePath}</p>
                  </div>
                  <div className="text-left lg:text-right">
                    <p>{activeDocument.stats.totalLines} total lines</p>
                    <p className="text-slate-500">
                      {activeDocument.sections.length} in-file sections
                    </p>
                  </div>
                </div>

                <div className="rounded-3xl border border-white/10 bg-slate-950/60 p-6">
                  <MarkdownArticle
                    content={activeDocument.content}
                    sections={activeDocument.sections}
                  />
                </div>
              </div>

              <aside className="rounded-3xl border border-white/10 bg-slate-950/60 p-5">
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">
                  In this file
                </p>
                <div className="mt-4 grid gap-2 text-sm text-slate-300">
                  {activeDocument.sections.length > 0 ? (
                    activeDocument.sections.map((section) => (
                      <a
                        key={`${activeDocument.id}-${section.id}`}
                        href={section.anchor}
                        className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                      >
                        {section.label}
                      </a>
                    ))
                  ) : (
                    <div className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-slate-400">
                      No table of contents was detected in this markdown file.
                    </div>
                  )}
                </div>
              </aside>
            </div>
          </div>
        ) : null}

        {activeTab === "code" ? (
          <SourcePanel
            label="Code source"
            path={guide.codeSource.filePath}
            content={guide.codeSource.content}
            totalLines={guide.codeSource.stats.totalLines}
            displayedLines={guide.codeSource.stats.displayedLines}
            truncated={guide.codeSource.stats.truncated}
          />
        ) : null}
      </section>
    </div>
  );
}

type SourcePanelProps = {
  label: string;
  path: string;
  content: string;
  totalLines: number;
  displayedLines: number;
  truncated: boolean;
};

function SourcePanel({
  label,
  path,
  content,
  totalLines,
  displayedLines,
  truncated,
}: SourcePanelProps) {
  return (
    <div className="space-y-4 pt-8">
      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-slate-950/60 p-4 text-sm text-slate-300 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.28em] text-slate-500">{label}</p>
          <p className="mt-2 break-all">{path}</p>
        </div>
        <div className="text-left lg:text-right">
          <p>{displayedLines} visible lines</p>
          <p className="text-slate-500">{totalLines} total lines in file</p>
        </div>
      </div>

      {truncated ? (
        <div className="rounded-2xl border border-amber-400/20 bg-amber-400/10 px-4 py-3 text-sm text-amber-100">
          This view is trimmed for readability. Open the source file directly in the
          repository when you need the full text.
        </div>
      ) : null}

      <pre className="max-h-225 overflow-auto rounded-3xl border border-white/10 bg-[#020617] p-5 text-sm leading-7 text-slate-200">
        {content}
      </pre>
    </div>
  );
}