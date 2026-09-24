# FrontendForge — Output Template

> The canonical structure every generated deliverable must follow. Keeps all 14 files consistent, senior-level, and diagram-rich.

---

## Universal skeleton

```markdown
# <Deliverable Title>

> One-line summary of what this document decides/defines.

## Table of Contents   <!-- include when > 3 sections -->

## 1. <Section>
...content: definition → detail → rationale → example...

## N. <Section>

## Diagrams
```mermaid
%% at least one diagram where the deliverable calls for it
```

## Checklist
- [ ] key decision 1
- [ ] key decision 2

## Next deliverable
→ [<next-file>.md](<next-file>.md)
```

---

## Rules for content
- **Definition → Detail → Rationale → Example** for each concept.
- Tables over prose for comparisons and decisions.
- Every recommendation has a **one-line why**.
- Code/config snippets are **typed and copy-pasteable**.
- Diagrams are **Mermaid only** (no external images).
- Cross-link sibling deliverables with relative paths.

---

## Per-file required elements

| File | Must contain |
|------|--------------|
| `01-Project-Research.md` | candidate table, concept-coverage matrix, scope tiers |
| `02-Tech-Stack.md` | toolchain table + package.json preview + architecture options |
| `03-Architecture.md` | context + module + sequence diagrams + folder tree |
| `04-Product-Spec.md` | **Part A PO brief** (vision, OKRs, personas, MoSCoW, roadmap, risks, pricing, glossary) + **Part B** roles, feature list, page inventory, sitemap + ≥3 flows |
| `05-UIUX-Design.md` | color/type/spacing tables + CSS token block + a11y checklist |
| `<Project>/UIUX/` (Phase 5b) | static reference site — `index.html`, ≥4 screen pages, `assets/tokens.css`, `assets/app.js`, `README.md`; hero has a streaming caret + Stop |
| `06-Delivery-Plan.md` | ID scheme (Jira/TFS mapping) + Gantt + **every sprint fully carded** (goal, capacity, every story with AC/points/depends-on/task table ≤5h) + 1 LLD per epic + DoR/DoD + flat backlog export table with totals |
| `07-Security-Auth.md` | auth model, ≥1 sequence diagram, OWASP table, CSP |
| `08-Testing-Strategy.md` | pyramid, coverage config (≥90%), 3 example tests |
| `09-Performance.md` | CWV targets, budget table, levers, CRP diagram, CI gate |
| `10-Internationalization.md` | library setup, ICU, locale routing, RTL, Intl, diagram |
| `11-Coding-Standards.md` | TS/lint/naming/commit conventions, PR checklist |
| `12-Starter-Template.md` | numbered, copy-pasteable commands to a working app |
| `13-AI-Features.md` | SSE contract, client streaming code, guardrails, sequence diagram |
| `00-INDEX.md` | links to all 13 + coverage summary + how to proceed |

---

## `00-INDEX.md` template

```markdown
# <ProjectName> — Production Plan Index

> <one-line vision>. Stack: <stack>. Architecture: <architecture>.

## Deliverables
1. [Project Research](01-Project-Research.md)
... (all 13) ...

## Coverage summary
- Test target: ≥ 90% (unit + E2E)
- Core Web Vitals: LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1
- i18n: <locales>
- Security: <auth model>
- AI: streaming (<transport>)

## How to proceed
1. Build the starter → `12-Starter-Template.md`.
2. Execute sprints → `06-Delivery-Plan.md`.
```
