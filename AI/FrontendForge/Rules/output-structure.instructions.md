---
description: 'Structure and quality rules for every Markdown deliverable FrontendForge generates. Opt-in: referenced by the agents, not auto-applied workspace-wide.'
applyTo: '**/Project/**/plan/**/*.md'
---

# Output Structure Rules (FrontendForge deliverables)

> **Scope note:** Narrowed to `**/Project/**/plan/**` so it cannot accidentally match unrelated docs such as `Node/plan/`. This file is referenced by the agents, not auto-loaded (only `.github/instructions/` is auto-applied).

## Every deliverable must
1. Start with an H1 title matching its purpose and a one-line summary blockquote.
2. Include a short Table of Contents when > 3 sections.
3. Follow the canonical section order in `Docs/OUTPUT-TEMPLATE.md`.
4. Use **Mermaid** for all diagrams (no image links).
5. End with a **Checklist** and a **"Next deliverable"** pointer.

## Style
- Concise, senior-level. Tables over prose where possible.
- Every recommendation has a one-line rationale.
- Real, copy-pasteable code/config snippets (typed).
- File cross-links use relative paths to sibling deliverables.

## Consistency
- The tech stack chosen in `02-Tech-Stack.md` must be used verbatim in all later files.
- Terminology (feature names, roles, routes) must match `04-Product-Spec.md`.
- Do not introduce a framework outside the finalized stack or on the exclusion list.

## Completeness gates (must all be true before `00-INDEX.md`)
- [ ] 14 deliverables exist and are non-empty.
- [ ] Test plan targets ≥ 90% coverage.
- [ ] Core Web Vitals budget defined (LCP/INP/CLS).
- [ ] i18n plan present.
- [ ] Security + auth covered with ≥1 diagram.
- [ ] AI streaming feature designed with a sequence diagram.
- [ ] Sprint tasks each ≤ 5 hours.
