"use client";

import {
  Children,
  isValidElement,
  useEffect,
  useId,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { createPortal } from "react-dom";
import mermaid from "mermaid";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

import type { GuideDocumentSection } from "@/lib/study-guides";

type MarkdownArticleProps = {
  content: string;
  sections: GuideDocumentSection[];
};

export function MarkdownArticle({ content, sections }: MarkdownArticleProps) {
  const anchorLookup = useMemo(() => {
    const entries = new Map<string, string[]>();

    sections.forEach((section) => {
      const key = normalizeHeadingLabel(section.label);
      const current = entries.get(key) ?? [];

      entries.set(key, [...current, section.id]);
    });

    return entries;
  }, [sections]);

  const headingUsage = new Map<string, number>();

  return (
    <article className="space-y-6 text-slate-200">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ children }) => (
            <h1 className="text-3xl font-semibold tracking-tight text-white">
              {children}
            </h1>
          ),
          h2: ({ children }) => {
            const label = extractText(children);
            const id = resolveHeadingId(label, anchorLookup, headingUsage);

            return (
              <h2
                id={id}
                className="scroll-mt-28 border-t border-white/10 pt-8 text-2xl font-semibold text-white"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const label = extractText(children);
            const id = resolveHeadingId(label, anchorLookup, headingUsage);

            return (
              <h3 id={id} className="scroll-mt-28 pt-4 text-xl font-semibold text-white">
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const label = extractText(children);
            const id = resolveHeadingId(label, anchorLookup, headingUsage);

            return (
              <h4 id={id} className="scroll-mt-28 pt-3 text-lg font-semibold text-white">
                {children}
              </h4>
            );
          },
          h5: ({ children }) => {
            const label = extractText(children);
            const id = resolveHeadingId(label, anchorLookup, headingUsage);

            return (
              <h5 id={id} className="scroll-mt-28 pt-3 text-base font-semibold text-white">
                {children}
              </h5>
            );
          },
          h6: ({ children }) => {
            const label = extractText(children);
            const id = resolveHeadingId(label, anchorLookup, headingUsage);

            return (
              <h6
                id={id}
                className="scroll-mt-28 pt-3 text-sm font-semibold uppercase tracking-[0.24em] text-slate-300"
              >
                {children}
              </h6>
            );
          },
          p: ({ children }) => (
            <p className="whitespace-pre-line text-base leading-8 text-slate-300">
              {children}
            </p>
          ),
          ul: ({ children }) => (
            <ul className="list-disc space-y-3 pl-6 text-base leading-8 text-slate-300">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal space-y-3 pl-6 text-base leading-8 text-slate-300">
              {children}
            </ol>
          ),
          li: ({ children }) => <li>{children}</li>,
          strong: ({ children }) => (
            <strong className="font-semibold text-white">{children}</strong>
          ),
          em: ({ children }) => <em className="italic text-slate-100">{children}</em>,
          hr: () => <hr className="border-white/10" />,
          blockquote: ({ children }) => (
            <blockquote className="rounded-2xl border border-cyan-400/20 bg-cyan-400/10 px-5 py-4 text-slate-100">
              {children}
            </blockquote>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="min-w-full border-collapse bg-slate-950/60 text-left text-sm text-slate-300">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => <thead className="bg-white/5 text-slate-100">{children}</thead>,
          th: ({ children }) => <th className="px-4 py-3 font-semibold">{children}</th>,
          td: ({ children }) => <td className="border-t border-white/10 px-4 py-3">{children}</td>,
          a: ({ children, href }) => (
            <a
              href={href}
              className="font-medium text-emerald-200 underline decoration-emerald-200/40 underline-offset-4 transition hover:text-emerald-100"
            >
              {children}
            </a>
          ),
          code: ({ className, children }) => {
            const value = String(children).replace(/\n$/, "");
            const language = className?.replace("language-", "") ?? "";
            const isBlockCode = Boolean(language) || value.includes("\n");

            if (language === "mermaid") {
              return <MermaidDiagram chart={value} />;
            }

            if (isBlockCode) {
              return (
                <pre className="overflow-x-auto rounded-[22px] border border-white/10 bg-[#020617] px-5 py-4 font-mono text-sm leading-7 whitespace-pre text-slate-200">
                  <code className={className}>{value}</code>
                </pre>
              );
            }

            return (
              <code className="rounded bg-white/10 px-1.5 py-1 font-mono text-[0.95em] text-slate-100">
                {children}
              </code>
            );
          },
          pre: ({ children }) => <>{children}</>,
        }}
      >
        {content}
      </ReactMarkdown>
    </article>
  );
}

type MermaidDiagramProps = {
  chart: string;
};

function MermaidDiagram({ chart }: MermaidDiagramProps) {
  const uniqueId = useId().replace(/:/g, "-");
  const [svg, setSvg] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    let isActive = true;

    mermaid.initialize({
      startOnLoad: false,
      theme: "dark",
      securityLevel: "loose",
    });

    void mermaid
      .render(`mermaid-${uniqueId}`, chart)
      .then((result) => {
        if (!isActive) {
          return;
        }

        setSvg(result.svg);
        setError("");
      })
      .catch(() => {
        if (!isActive) {
          return;
        }

        setError("Unable to render this Mermaid diagram.");
      });

    return () => {
      isActive = false;
    };
  }, [chart, uniqueId]);

  useEffect(() => {
    if (!isPreviewOpen) {
      return undefined;
    }

    const { overflow } = document.body.style;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsPreviewOpen(false);
      }
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = overflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isPreviewOpen]);

  if (error) {
    return (
      <div className="rounded-[22px] border border-amber-400/20 bg-amber-400/10 px-5 py-4 text-sm text-amber-100">
        {error}
      </div>
    );
  }

  return (
    <>
      <div className="space-y-3 rounded-[22px] border border-white/10 bg-[#020617] p-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">
            Mermaid diagram preview
          </p>
          <button
            type="button"
            onClick={() => setIsPreviewOpen(true)}
            className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-4 py-2 text-xs font-medium text-cyan-100 transition hover:border-cyan-300/40 hover:bg-cyan-400/15"
          >
            Open large preview
          </button>
        </div>
        <div className="overflow-x-auto">
          {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
        </div>
      </div>

      {isMounted && isPreviewOpen
        ? createPortal(
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-label="Mermaid diagram preview"
            >
              <button
                type="button"
                aria-label="Close diagram preview"
                onClick={() => setIsPreviewOpen(false)}
                className="absolute inset-0 bg-slate-950/85 backdrop-blur-md"
              />

              <div className="relative z-10 flex h-[92vh] w-full max-w-[96vw] flex-col overflow-hidden rounded-[28px] border border-white/10 bg-slate-950 shadow-[0_32px_120px_rgba(2,6,23,0.75)]">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 px-5 py-4 lg:px-6">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-500">
                      Diagram viewer
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Drag the scrollbars or trackpad to move left and right across the diagram.
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setIsPreviewOpen(false)}
                      className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-200 transition hover:border-white/20 hover:bg-white/10 hover:text-white"
                    >
                      Close preview
                    </button>
                  </div>
                </div>

                <div className="flex-1 overflow-auto bg-[#020617] p-4 lg:p-6">
                  <div className="min-w-max rounded-3xl border border-white/10 bg-slate-950/70 p-4 lg:p-6">
                    {svg ? <div dangerouslySetInnerHTML={{ __html: svg }} /> : null}
                  </div>
                </div>
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}

function extractText(children: ReactNode): string {
  return Children.toArray(children)
    .map((child) => {
      if (typeof child === "string" || typeof child === "number") {
        return String(child);
      }

      if (isValidElement<{ children?: ReactNode }>(child)) {
        return extractText(child.props.children);
      }

      return "";
    })
    .join(" ")
    .trim();
}

function normalizeHeadingLabel(value: string) {
  return value.toLowerCase().replace(/[`*_>#-]/g, "").replace(/\s+/g, " ").trim();
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+={}\[\]|\\:;"'<>,.?/]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function resolveHeadingId(
  label: string,
  anchorLookup: Map<string, string[]>,
  headingUsage: Map<string, number>,
) {
  const key = normalizeHeadingLabel(label);
  const matches = anchorLookup.get(key);

  if (!matches || matches.length === 0) {
    return slugifyHeading(label);
  }

  const currentIndex = headingUsage.get(key) ?? 0;
  const resolved = matches[Math.min(currentIndex, matches.length - 1)];

  headingUsage.set(key, currentIndex + 1);

  return resolved;
}