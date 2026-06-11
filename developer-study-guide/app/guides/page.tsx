import { GuidesLibrarySearch } from "@/components/guides/guides-library-search";
import { getHomeSections } from "@/lib/study-guides";

type GuidesPageProps = {
  searchParams?: Promise<{
    q?: string;
  }>;
};

export default async function GuidesPage({ searchParams }: GuidesPageProps) {
  const sections = getHomeSections();
  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const initialQuery = resolvedSearchParams?.q?.trim() ?? "";

  return (
    <div className="mx-auto flex w-full max-w-7xl flex-col gap-12 px-6 py-10 lg:px-8 lg:py-14">
      <section className="rounded-4xl border border-white/10 bg-white/5 p-8 shadow-[0_24px_80px_rgba(2,6,23,0.52)] backdrop-blur-xl lg:p-10">
        <div className="max-w-3xl space-y-4">
          <p className="text-sm uppercase tracking-[0.32em] text-slate-500">
            Study Library
          </p>
          <h1 className="text-4xl font-semibold tracking-tight text-white lg:text-5xl">
            Browse each learning path as a dedicated page.
          </h1>
          <p className="text-base leading-8 text-slate-300 lg:text-lg">
            Each guide page includes a structured overview, a README-style reading
            tab, a code tab pulled from the repository, and related topics for the
            next revision step.
          </p>
        </div>
      </section>

      <GuidesLibrarySearch sections={sections} initialQuery={initialQuery} />
    </div>
  );
}