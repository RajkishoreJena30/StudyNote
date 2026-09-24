# FrontendForge — Activation Guide

> How to run the system end-to-end. You provide only a tech stack; the system asks 2 questions, then generates everything.

---

## Prerequisites
- This folder (`AI/FrontendForge/`) available in your workspace.
- Ability to run PowerShell scripts (for scaffold + validation).

## Step 1 — Start the run
In chat, invoke the init command with your stack:

```
/forge-init React + TypeScript + Micro-Frontend
```

Other valid examples:
- `/forge-init Vue 3 + TypeScript`
- `/forge-init Angular + NgRx`
- `/forge-init Svelte + SvelteKit-free SPA`

> The system never adds a framework you didn't name and never assumes Next.js.

## Step 2 — Answer 2 questions
1. **Architecture** — it proposes 2–3 options with tradeoffs; pick one.
2. **Exclusions** — name any frameworks/tools to avoid.

## Step 3 — Let it run
The orchestrator scaffolds the output folder and runs 11 phases (see [PIPELINE.md](PIPELINE.md)), writing 15 Markdown deliverables. Chat stays quiet — one progress line per phase.

## Step 4 — Review the output
Open the generated `00-INDEX.md` under `Next/Project/<ProjectName>/plan/` and read in order:

1. `01-Project-Research.md` — why this project.
2. `02-Tech-Stack.md` — frameworks + packages.
3. `03-Architecture.md` — diagrams + folder tree.
4. `04-Product-Spec.md` — features, pages, flows.
5. `05-UIUX-Design.md` — tokens, color, type.
6. `06-Delivery-Plan.md` — sprints, 5-hr/day tasks.
7. `07-Security-Auth.md` — auth + OWASP.
8. `08-Testing-Strategy.md` — 90%+ plan.
9. `09-Performance.md` — Core Web Vitals budget.
10. `10-Internationalization.md` — multi-language.
11. `11-Coding-Standards.md` — conventions.
12. `12-Starter-Template.md` — build a working template.
13. `13-AI-Features.md` — streaming events.
14. `14-Production-Deployment.md` — cost-optimized production deployment.

## Step 5 — Build the starter
Follow `12-Starter-Template.md` step by step to get a running project, then execute `06-Delivery-Plan.md` sprint by sprint, then deploy per `14-Production-Deployment.md`.

---

## Worked example (abridged)

**Input:** `React + TypeScript + Micro-Frontend`

**Q1 answer:** Micro-Frontend via Module Federation (Rspack), host + 3 remotes.
**Q2 answer:** No Next.js, no Redux (prefer Zustand + TanStack Query).

**Result:** a "Collaborative Analytics Workspace" project chosen (covers auth, real-time dashboards, virtualization, forms, file upload, AI copilot with SSE), 14 deliverables generated, tasks sliced to 5-hour days, 90%+ test plan, CWV budget, i18n, and an SSE-based AI assistant.

---

## Running individual phases
You can run any phase on its own after `/forge-init` (or to regenerate one file):

```
/forge-research   /forge-techstack   /forge-architecture   /forge-product
/forge-uiux       /forge-sprints      /forge-security       /forge-testing
/forge-perf-i18n  /forge-starter
```

## Validation
At any time:

```powershell
./AI/FrontendForge/Scripts/validate-plan.ps1 -PlanDir "Next/Project/<ProjectName>/plan"
```
