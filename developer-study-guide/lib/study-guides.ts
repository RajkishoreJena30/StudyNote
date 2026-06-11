import { promises as fs } from "node:fs";
import path from "node:path";

import repoContentMap from "@/data/repo-content-map.json";

export type GuideTab = "overview" | "docs" | "code";

type StudySection = {
  id: string;
  title: string;
  kicker: string;
  description: string;
};

export type StudyGuideSummary = {
  slug: string;
  title: string;
  strapline: string;
  sectionId: string;
  section: string;
  level: "Starter" | "Intermediate" | "Advanced";
  duration: string;
  audience: string;
  summary: string;
  concepts: string[];
  outcomes: string[];
  readmePath: string;
  codePath: string;
  documentPaths?: string[];
  documentGroup?: string;
};

export type StudyGuideSectionWithGuides = StudySection & {
  guides: StudyGuideSummary[];
};

export type GuideDocumentSection = {
  id: string;
  label: string;
  anchor: string;
};

export type GuideDocument = {
  id: string;
  title: string;
  filePath: string;
  content: string;
  stats: SourceStats;
  sections: GuideDocumentSection[];
};

export type GuideCodeSource = {
  filePath: string;
  content: string;
  stats: SourceStats;
};

export type GuideDetail = StudyGuideSummary & {
  documents: GuideDocument[];
  codeSource: GuideCodeSource;
  relatedGuides: StudyGuideSummary[];
};

type SourceStats = {
  totalLines: number;
  displayedLines: number;
  truncated: boolean;
};

type RepoManifestFile = {
  path: string;
  extension: string;
  group: string;
  kind: string;
};

const repositoryRoot = path.join(/* turbopackIgnore: true */ process.cwd(), "..");
const markdownManifestFiles = repoContentMap.markdownFiles as RepoManifestFile[];
const codeManifestFiles = repoContentMap.codeFiles as RepoManifestFile[];

const markdownFileMap = new Map(
  markdownManifestFiles.map((file) => [normalizeRepoPath(file.path), file]),
);

const codeFileMap = new Map(
  codeManifestFiles.map((file) => [normalizeRepoPath(file.path), file]),
);

const sections: StudySection[] = [
  {
    id: "foundations",
    title: "Foundations",
    kicker: "Core Web Thinking",
    description:
      "Start from browser fundamentals, then move into the JavaScript and TypeScript concepts that support production frontend work.",
  },
  {
    id: "frontend-engineering",
    title: "Frontend Engineering",
    kicker: "Modern UI Systems",
    description:
      "Study the React and Next.js material alongside component code so architecture and implementation stay connected.",
  },
  {
    id: "platform-and-architecture",
    title: "Platform and Architecture",
    kicker: "Backend and Systems",
    description:
      "Use these guides to revise backend delivery, integration thinking, and system design patterns that shape senior-level decisions.",
  },
];

const guides: StudyGuideSummary[] = [
  {
    slug: "html-essentials",
    title: "HTML Essentials",
    strapline:
      "Revisit semantic structure, accessibility basics, and how document thinking shapes better UI foundations.",
    sectionId: "foundations",
    section: "Foundations",
    level: "Starter",
    duration: "18 min",
    audience: "Developers building stronger semantic and accessible markup habits.",
    summary:
      "This module pairs the HTML beginner guide with a practical layout file so learners can map semantic ideas back to app structure.",
    concepts: ["Semantics", "Accessibility", "Document flow", "Structure"],
    outcomes: [
      "Understand how semantic sections improve readability and maintainability.",
      "Review why accessibility starts with clean HTML before components and styling.",
      "Connect content structure with real application shell markup.",
    ],
    readmePath: "HTML/HTML-Beginner-Guide.md",
    codePath: "developer-study-guide/app/layout.tsx",
    documentGroup: "HTML",
  },
  {
    slug: "css-systems",
    title: "CSS Systems",
    strapline:
      "Study visual hierarchy, reusable styling patterns, and how a design system comes alive in global styles.",
    sectionId: "foundations",
    section: "Foundations",
    level: "Starter",
    duration: "24 min",
    audience: "Frontend developers refining visual systems and production styling discipline.",
    summary:
      "The CSS guide is paired with this app's global stylesheet so the learner can review theory and see a live design shell implementation.",
    concepts: ["Cascade", "Design tokens", "Layout", "Visual rhythm"],
    outcomes: [
      "Compare conceptual CSS guidance with actual app-level styling tokens.",
      "Review how background, typography, and spacing decisions define perceived quality.",
      "Use the code tab to inspect a modern dark-theme baseline.",
    ],
    readmePath: "CSS/CSS-Advanced-Guide.md",
    codePath: "developer-study-guide/app/globals.css",
    documentGroup: "CSS",
  },
  {
    slug: "javascript-core",
    title: "JavaScript Revision Track",
    strapline:
      "Read all JavaScript notes in one place, switch between markdown files, and jump inside each file using its own table of contents.",
    sectionId: "foundations",
    section: "Foundations",
    level: "Intermediate",
    duration: "45 min",
    audience: "Developers revising the fundamentals that support React, Node.js, and interview problem solving.",
    summary:
      "This module now reads the full JavaScript folder from the repository, so the user can move across Fundamentals, Core Concepts, ES6, and Advanced notes without opening markdown previews one by one.",
    concepts: ["Closures", "Async thinking", "ES6", "Execution context"],
    outcomes: [
      "Move across all JavaScript markdown notes from a single guide screen.",
      "Use each file's own table of contents as in-app section navigation.",
      "Read diagrams and code examples without opening the raw markdown preview.",
    ],
    readmePath: "JavaScript/JavaScript-Fundamentals-Part-1.md",
    codePath: "Programing/Debounce.js",
    documentGroup: "JavaScript",
  },
  {
    slug: "typescript-practice",
    title: "TypeScript Practice",
    strapline:
      "Strengthen type modeling, API boundaries, and package ergonomics with repository-backed examples.",
    sectionId: "foundations",
    section: "Foundations",
    level: "Intermediate",
    duration: "26 min",
    audience: "Engineers who want safer refactors and clearer component contracts.",
    summary:
      "The TypeScript guide is paired with a package entry point to keep types grounded in a real reusable module surface.",
    concepts: ["Types", "Contracts", "Inference", "API design"],
    outcomes: [
      "Review how strong types reduce ambiguity across teams and packages.",
      "Inspect a TypeScript entry point to connect theory with exported APIs.",
      "Use this module as a bridge from language concepts into product code.",
    ],
    readmePath: "TypeScript/TypeScript-Complete-Guide.md",
    codePath: "Package/toast/src/index.ts",
    documentGroup: "TypeScript",
  },
  {
    slug: "react-advanced",
    title: "React Advanced Guide",
    strapline:
      "Revisit component composition, state architecture, and the patterns that matter in larger frontend systems.",
    sectionId: "frontend-engineering",
    section: "Frontend Engineering",
    level: "Intermediate",
    duration: "30 min",
    audience: "Frontend engineers improving scale, maintainability, and mental models for modern UI work.",
    summary:
      "This guide combines the React advanced notes with an existing practice app so learners can compare conceptual advice with component structure.",
    concepts: ["Composition", "State flow", "Rendering", "Maintainability"],
    outcomes: [
      "Review what makes React code resilient as the interface grows.",
      "Study a practical app surface to understand state and UI composition in context.",
      "Use the tabs to move from architecture notes into implementation detail.",
    ],
    readmePath: "React/React-Advanced-Guide.md",
    codePath: "ReactMachineCoding/redux-toolkit-practice/src/App.tsx",
    documentGroup: "React",
  },
  {
    slug: "next-modern",
    title: "Next.js Modern Patterns",
    strapline:
      "Use the latest Next.js guide alongside the current app-router implementation to revise routing, layouts, and rendering boundaries.",
    sectionId: "frontend-engineering",
    section: "Frontend Engineering",
    level: "Advanced",
    duration: "32 min",
    audience: "Developers shipping production web apps with routing, data loading, and server-client boundaries.",
    summary:
      "The latest Next.js notes are mapped to this study app's own homepage implementation to make the framework guidance immediately tangible.",
    concepts: ["App Router", "Layouts", "Rendering", "Navigation"],
    outcomes: [
      "Review current framework features through the lens of a real app-router project.",
      "Inspect the homepage code to understand how data-driven landing pages are composed.",
      "Use this as a reference for multi-page product UI structure.",
    ],
    readmePath: "Next/NextJS-15-16-Latest-Features-Guide.md",
    codePath: "developer-study-guide/app/page.tsx",
    documentGroup: "Next",
  },
  {
    slug: "node-production",
    title: "Node.js Production Backend",
    strapline:
      "Revise backend expectations, runtime concerns, and service packaging practices used in real teams.",
    sectionId: "platform-and-architecture",
    section: "Platform and Architecture",
    level: "Advanced",
    duration: "27 min",
    audience: "Developers expanding from frontend delivery into backend ownership and service design.",
    summary:
      "This guide pairs production backend notes with a service package manifest to keep systems thinking connected to deployable project structure.",
    concepts: ["Runtime", "Services", "Packaging", "Delivery"],
    outcomes: [
      "Review what changes when Node.js code must run reliably in production.",
      "Understand how service metadata and scripts support operational consistency.",
      "Use the code tab as a lightweight bridge into backend project structure.",
    ],
    readmePath: "Node/NodeJS-Production-Backend-Guide.md",
    codePath: "Node/project/nama-yatra/user-services/package.json",
    documentGroup: "Node",
  },
  {
    slug: "system-design-frontend",
    title: "Frontend System Design",
    strapline:
      "Study scalable frontend architecture, product trade-offs, and the quality bars expected from senior engineers.",
    sectionId: "platform-and-architecture",
    section: "Platform and Architecture",
    level: "Advanced",
    duration: "34 min",
    audience: "Experienced developers preparing for design rounds or leveling up product architecture decisions.",
    summary:
      "This module uses the frontend system design reading alongside a reusable toast implementation to connect architecture thinking with package-level code.",
    concepts: ["Scalability", "Trade-offs", "Communication", "Systems"],
    outcomes: [
      "Rehearse how to break down frontend systems during reviews and interviews.",
      "Connect abstract design principles with a reusable component implementation.",
      "Use this page as a revision surface before architecture discussions.",
    ],
    readmePath: "SystemDesign/Frontend-System-Design-Round.md",
    codePath: "Package/toast/src/toast.ts",
    documentGroup: "SystemDesign",
  },
];

export function getAllGuides() {
  return guides;
}

export function getGuideCount() {
  return guides.length;
}

export function getSectionCount() {
  return sections.length;
}

export function getFeaturedGuides() {
  return guides.slice(0, 3);
}

export function getGuideSummaryBySlug(slug: string) {
  return guides.find((guide) => guide.slug === slug);
}

export function getHomeSections(): StudyGuideSectionWithGuides[] {
  return sections.map((section) => ({
    ...section,
    guides: guides.filter((guide) => guide.sectionId === section.id),
  }));
}

export async function getGuideBySlug(slug: string): Promise<GuideDetail | null> {
  const guide = getGuideSummaryBySlug(slug);

  if (!guide) {
    return null;
  }

  const documentPaths = resolveGuideDocumentPaths(guide);
  const primaryReadmePath = documentPaths[0] ?? guide.readmePath;
  const codePath = resolveGuideCodePath(guide.codePath);

  const [documents, codeSource] = await Promise.all([
    Promise.all(documentPaths.map((documentPath) => readGuideDocument(documentPath))),
    readRepositoryFile(codePath),
  ]);

  return {
    ...guide,
    readmePath: primaryReadmePath,
    codePath,
    documents,
    codeSource: {
      filePath: codePath,
      content: codeSource.content,
      stats: codeSource.stats,
    },
    relatedGuides: guides
      .filter(
        (candidate) =>
          candidate.slug !== guide.slug && candidate.sectionId === guide.sectionId,
      )
      .slice(0, 3),
  };
}

function resolveGuideDocumentPaths(guide: StudyGuideSummary) {
  if (guide.documentGroup) {
    const groupedPaths = markdownManifestFiles
      .filter((file) => file.group === guide.documentGroup)
      .map((file) => file.path)
      .sort((leftPath, rightPath) => {
        if (leftPath === guide.readmePath) {
          return -1;
        }

        if (rightPath === guide.readmePath) {
          return 1;
        }

        return leftPath.localeCompare(rightPath);
      });

    if (groupedPaths.length > 0) {
      return groupedPaths;
    }
  }

  if (guide.documentPaths?.length) {
    const explicitPaths = guide.documentPaths
      .map(resolveManifestMarkdownPath)
      .filter((pathValue): pathValue is string => Boolean(pathValue));

    if (explicitPaths.length > 0) {
      return explicitPaths;
    }
  }

  return [resolveManifestMarkdownPath(guide.readmePath)];
}

function resolveGuideCodePath(codePath: string) {
  return codeFileMap.get(normalizeRepoPath(codePath))?.path ?? codePath;
}

function resolveManifestMarkdownPath(readmePath: string) {
  return markdownFileMap.get(normalizeRepoPath(readmePath))?.path ?? readmePath;
}

async function readGuideDocument(relativePath: string): Promise<GuideDocument> {
  const source = await readRepositoryFile(relativePath);
  const content = source.content;

  return {
    id: createDocumentId(relativePath),
    title: getDocumentTitle(relativePath, content),
    filePath: relativePath,
    content,
    stats: source.stats,
    sections: getDocumentSections(content),
  };
}

async function readRepositoryFile(relativePath: string) {
  const absolutePath = path.join(repositoryRoot, relativePath);

  try {
    const content = await fs.readFile(absolutePath, "utf8");
    return toDisplaySource(content, Number.POSITIVE_INFINITY);
  } catch {
    const fallback = `Unable to load ${relativePath}. Confirm that the file exists in the repository.`;

    return toDisplaySource(fallback, Number.POSITIVE_INFINITY);
  }
}

function toDisplaySource(source: string, maxLines = 240) {
  const normalized = source.replace(/\r\n/g, "\n");
  const lines = normalized.split("\n");
  const truncated = lines.length > maxLines;
  const displayLines = truncated ? lines.slice(0, maxLines) : lines;

  return {
    content: truncated
      ? `${displayLines.join("\n")}\n\n... trimmed for the study view ...`
      : normalized,
    stats: {
      totalLines: lines.length,
      displayedLines: displayLines.length,
      truncated,
    },
  };
}

function createDocumentId(relativePath: string) {
  return relativePath
    .replace(/\\/g, "/")
    .replace(/[^a-zA-Z0-9/.-]/g, "")
    .replace(/[/.]+/g, "-")
    .toLowerCase();
}

function getDocumentTitle(relativePath: string, source: string) {
  const firstHeading = source.match(/^#\s+(.+)$/m)?.[1]?.trim();

  if (firstHeading) {
    return firstHeading;
  }

  return path
    .basename(relativePath, path.extname(relativePath))
    .replace(/[-_]+/g, " ")
    .trim();
}

function getDocumentSections(source: string): GuideDocumentSection[] {
  const fromTableOfContents = extractTableOfContents(source);

  if (fromTableOfContents.length > 0) {
    return fromTableOfContents;
  }

  return extractHeadings(source);
}

function extractTableOfContents(source: string): GuideDocumentSection[] {
  const lines = source.replace(/\r\n/g, "\n").split("\n");
  const tocStartIndex = lines.findIndex((line) =>
    /^##\s+.*table of contents/i.test(line.trim()),
  );

  if (tocStartIndex === -1) {
    return [];
  }

  const items: GuideDocumentSection[] = [];

  for (let index = tocStartIndex + 1; index < lines.length; index += 1) {
    const line = lines[index].trim();

    if (!line) {
      continue;
    }

    if (line === "---" && items.length > 0) {
      break;
    }

    if (/^#{2,}\s+/.test(line) && items.length > 0) {
      break;
    }

    const match = line.match(/^\d+\.\s+\[(.+?)\]\((#.+?)\)$/);

    if (!match) {
      continue;
    }

    const [, label, anchor] = match;

    items.push({
      id: anchor.slice(1),
      label: label.trim(),
      anchor,
    });
  }

  return items;
}

function extractHeadings(source: string): GuideDocumentSection[] {
  return source
    .replace(/\r\n/g, "\n")
    .split("\n")
    .map((line) => line.match(/^(#{2,4})\s+(.+)$/))
    .filter((match): match is RegExpMatchArray => Boolean(match))
    .map((match) => {
      const label = match[2].trim();
      const id = slugifyHeading(label);

      return {
        id,
        label,
        anchor: `#${id}`,
      };
    })
    .filter((item) => !/table of contents/i.test(item.label));
}

function slugifyHeading(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[`~!@#$%^&*()+={}\[\]|\\:;"'<>,.?/]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function normalizeRepoPath(relativePath: string) {
  return relativePath.replace(/\\/g, "/");
}