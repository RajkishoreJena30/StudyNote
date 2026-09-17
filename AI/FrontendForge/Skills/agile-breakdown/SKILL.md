---
name: agile-breakdown
description: 'Knowledge pack for decomposing a product into Epic → Feature → Story → Task with INVEST stories, Given/When/Then acceptance criteria, LLD detail, and slicing tasks to fit a 5-hour focused workday. Use when building a delivery/sprint plan.'
---

# Skill: Agile Breakdown (5 hrs/day)

## Hierarchy
- **Epic** — a large business outcome (weeks). Example: "Authentication & Accounts".
- **Feature** — a shippable capability under an epic. Example: "Social login".
- **Story** — user-visible increment, INVEST-compliant. Example: "As a user I can sign in with Google".
- **Task** — technical step ≤ 5 hours. Example: "Add Google OIDC button + callback route".

## INVEST for stories
Independent, Negotiable, Valuable, Estimable, Small, Testable.

## Story template
```
### Story <ID>: <title>
As a <role>, I want <capability>, so that <benefit>.

Acceptance Criteria (Given/When/Then):
- Given ... When ... Then ...

Story points: <1/2/3/5/8>
Tasks (each ≤ 5h):
1. [ ] ...
2. [ ] ... (unit tests)
3. [ ] ... (E2E test)
Definition of Done: lint clean, tests pass, coverage ≥ 90%, a11y checked, reviewed.
```

## Sizing to a 5-hour day
- Assume **5 focused hours/day**, ~4 productive after overhead.
- 2-week sprint ≈ 50 hours capacity.
- A **1-point** story ≈ half a day; **8-point** story must be split.
- Every task must be completable in **one sitting (≤ 5h)**; if not, split it.
- Each story bundles its **test tasks** so coverage never lags.

## LLD per representative story
For at least one story per epic, specify:
- Component tree + props/types (TypeScript interfaces).
- State (kind + tool) and data-fetching calls.
- API contract (request/response types).
- Error/loading/empty states.
- Test list (unit + integration + E2E).

## Sequencing
- Sprint 0: foundation (repo, CI, design tokens, auth shell, architecture skeleton).
- Front-load cross-cutting concerns (auth, i18n, error boundaries).
- Draw a Mermaid Gantt + dependency graph so nothing blocks.

## Deliverable must include
Release plan, epics list, ≥1 fully worked Epic→Feature→Story→Task→LLD, DoR/DoD, Gantt.
