---
name: agile-breakdown
description: 'Knowledge pack for decomposing a product into Epic → Feature → Story → Task with INVEST stories, Given/When/Then acceptance criteria, LLD detail, and slicing tasks to fit a 5-hour focused workday. Produces a Jira/TFS-grade backlog covering every sprint, not just one worked example. Use when building a delivery/sprint plan.'
---

# Skill: Agile Breakdown (5 hrs/day, Jira/TFS-grade)

> **Default depth (always, without being asked):** every sprint in the plan gets its own fully worked Epic→Feature→Story→Task breakdown — not just one representative example. A plan with only one worked story and the rest as a one-line "key stories" bullet list **fails this skill's bar** and must be expanded before the deliverable is considered done.

## Hierarchy & ID scheme (mirrors Jira / Azure DevOps / TFS)
- **Epic** `E<n>` — a large business outcome (weeks). Example: `E3` "AI Assistant". (Jira: Epic · TFS: Epic)
- **Feature** `E<n>.F<n>` — a shippable capability under an epic. Example: `E3.F1` "Streaming suggestions". (Jira: epic-level label/component · TFS: Feature)
- **Story** `<PREFIX>-<3-digit>` — user-visible increment, INVEST-compliant, where the hundreds digit = epic number (e.g. `RF-3xx` = Epic 3). Example: `RF-301`. (Jira: Story · TFS: Product Backlog Item)
- **Task** `<Story>.T<n>` — technical step ≤ 5 hours. Example: `RF-301.T1`. (Jira: Sub-task · TFS: Task)

Pick a 2-3 letter project prefix (e.g. project initials) once and use it consistently for every story ID across the whole plan.

## INVEST for stories
Independent, Negotiable, Valuable, Estimable, Small, Testable.

## Story card template (used for **every** story in **every** sprint)
```
### <PREFIX>-XXX — <Title>                              [Epic Ex.Fy · N pts]
As a <role>, I want <capability>, so that <benefit>.

Acceptance Criteria (Given/When/Then):
- Given ... When ... Then ...
- Given ... When ... Then ... (at least 2 AC per story: happy path + 1 edge/error case)

Depends on: <story IDs or "none">
Tasks (≤5h each):
| Task ID        | Task                          | Hours | Day |
|----------------|--------------------------------|------:|:---:|
| <Story>.T1     | ...                             | Xh    | Dn  |

Definition of Done: see the DoR/DoD section.
```

## Sizing to a 5-hour day
- Assume **5 focused hours/day**, 2-week sprint = 10 working days = 50 hours = **10 story points/sprint** (1 point ≈ 5h ≈ 1 day).
- A **1-point** story ≈ half a day; anything estimated above **8 points must be split** into multiple stories before it enters a sprint.
- Every task must be completable in **one sitting (≤5h)** and mapped to a day (`D1`–`D10`) within its sprint; if a task doesn't fit, split it.
- Each story bundles its **own test tasks** (unit + integration/E2E) so coverage never lags.
- Every sprint's story points must sum to ≈ the sprint capacity (10 pts / 50h); show this as a per-sprint total.

## LLD coverage
- Produce **one LLD per epic** (not just one for the whole plan): component/hook contracts, props/types, state (kind + tool), API/data-fetching calls, error/loading/empty states, and a test list.
- Place all LLDs together in a dedicated section near the end of the document, cross-referenced by story ID.

## Sequencing
- Sprint 1: foundation (repo, CI, design tokens/UI primitives, MF/app shell skeleton).
- Front-load cross-cutting concerns (auth, i18n, error boundaries) into early-to-mid sprints so later features aren't blocked.
- Every story lists an explicit `Depends on:` (story IDs or "none") so the plan can be re-sequenced safely.
- Draw a Mermaid Gantt (per sprint) + an epic-level dependency graph so nothing is blocked.

## Backlog export (always include)
End the plan with a **flat backlog table** — one row per story — with columns `ID, Epic, Feature, Title, Points, Sprint, Priority, Depends On`, explicitly labeled as copy-pasteable into a `.csv` for Jira/Azure DevOps bulk import. Include a totals line (story count, point total, hour total) that reconciles against sprint count × capacity.

## Deliverable must include (all required, every run)
- Release plan (Gantt) + capacity model explained once.
- Epics table (with their Features listed).
- **Every sprint** broken down into: sprint goal, capacity, stories table (ID/title/points), then each story fully carded per the template above (AC, depends-on, task table with hours+day).
- One LLD per epic.
- DoR/DoD.
- Dependency & sequencing diagrams.
- Flat backlog export table with totals.
- A short "How to use this plan" section explaining the ID scheme and how to import into Jira/TFS.

