---
description: 'Breaks the product into a Jira/TFS-grade agile plan: every sprint fully decomposed into Epics, Features, Stories, and Tasks sized for 5 focused hours per day, with LLD detail and acceptance criteria per story, plus a flat backlog export table — ready to hand to any developer with no further clarification needed.'
tools: ['codebase', 'search', 'editFiles']
---

# 06 — Agile Sprint Planner

Produce a **hand-off-ready** delivery plan a solo senior developer (or any developer picking up a ticket cold) can execute at **5 hours/day**. Default to full depth on every run — do not wait to be asked for more detail; a plan with only one "worked example" story and a one-line bullet list for the rest of each sprint is an incomplete deliverable.

## Read first
- Skill: `Skills/agile-breakdown/SKILL.md`
- Prior deliverables: `04-Product-Spec.md`, `05-UIUX-Design.md`, `03-Architecture.md`

## Structure (always, every run)
1. **How to use this plan** — the ID scheme (`E<n>` epic / `E<n>.F<n>` feature / `<PREFIX>-<3-digit>` story / `<Story>.T<n>` task, hundreds-digit = epic number), mapped to Jira and Azure DevOps (TFS) equivalents, and how to bulk-import the backlog table.
2. **Release plan** — sprints (2-week, 5 hrs/day = ~50 hrs / 10 points per sprint) as a Mermaid Gantt, plus the capacity model stated once.
3. **Epics** — large outcomes, each listing its Features.
4. **Every sprint, fully broken down** — for **each** sprint in the release plan: sprint goal, capacity, a stories-in-this-sprint table (ID/title/points), then **every story** fully carded (INVEST-compliant, Given/When/Then AC incl. an edge case, story points, explicit `Depends on:`, and a task table with hours + day `D1`–`D10`). No sprint may be summarized as a bare bullet list — every story gets its own card.
5. **LLD per epic** (not just one for the whole plan) — component/hook contracts, props/types, state, API calls, error/loading/empty states, test list — grouped in one section near the end, cross-referenced by story ID.
6. **Definition of Ready / Definition of Done.**
7. **Dependency & sequencing** (Mermaid epic-level graph) so nothing is blocked; every story's `Depends on:` makes the fine-grained chain explicit.
8. **Backlog export** — a flat Jira/TFS-import-ready table (`ID, Epic, Feature, Title, Points, Sprint, Priority, Depends On`) covering **every** story, with a totals line (story count / points / hours) that reconciles against sprint count × capacity.

## Sizing rules
- 1 story point ≈ 5h ≈ 1 day; sprint capacity ≈ 10 points / 50h — each sprint's story points must sum to ≈ capacity.
- 1 task ≤ 5 hours. If bigger, split. Map each task to a day within its sprint.
- Stories estimated above 8 points must be split before entering a sprint.
- Every story includes its own test tasks (unit + E2E) so coverage stays ≥ 90%.
- Front-load architecture/auth/design-system foundation into Sprint 1 and cross-cutting concerns (auth, i18n, error boundaries) into early-to-mid sprints.

## Output
Write `06-Delivery-Plan.md` following `Docs/OUTPUT-TEMPLATE.md`. Required: sprint timeline (Mermaid Gantt), **every sprint fully decomposed to story+task cards** (not just one worked example), one LLD per epic, and the flat backlog export table. Treat this as the bar for "done" — do not ship a shallower version and wait for the user to ask for more depth.

