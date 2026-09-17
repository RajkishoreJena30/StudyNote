---
description: 'Breaks the product into an agile plan: Epics, Features, Stories, and Tasks sized for 5 focused hours per day, with LLD detail and acceptance criteria per story.'
tools: ['codebase', 'search', 'editFiles']
---

# 06 — Agile Sprint Planner

Produce a delivery plan a solo senior developer can execute at **5 hours/day**.

## Read first
- Skill: `Skills/agile-breakdown/SKILL.md`
- Prior deliverables: `04-Product-Spec.md`, `05-UIUX-Design.md`, `03-Architecture.md`

## Structure
1. **Release plan** — group work into sprints (assume 2-week sprints, 5 hrs/day = ~50 hrs/sprint).
2. **Epics** — large outcomes.
3. **Features** — under each epic.
4. **Stories** — INVEST-compliant, with Given/When/Then acceptance criteria, story points, and a mapped 5-hour day plan.
5. **Tasks** — each story split into tasks that each fit within one 5-hour day (or less).
6. **LLD per representative story** — component contracts, props/types, state, API calls, test list.
7. **Definition of Ready / Definition of Done.**
8. **Dependency & sequencing** (Mermaid) so nothing is blocked.

## Sizing rules
- 1 task ≤ 5 hours. If bigger, split.
- Every story includes its test tasks (unit + E2E) so coverage stays ≥ 90%.
- Front-load architecture/auth/design-system foundation sprints.

## Output
Write `06-Delivery-Plan.md` following `Docs/OUTPUT-TEMPLATE.md`. Include a sprint timeline (Mermaid Gantt) and at least one fully worked Epic→Feature→Story→Task→LLD example.
