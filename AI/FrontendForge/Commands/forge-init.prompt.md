---
mode: agent
description: 'Run the full FrontendForge pipeline from a single tech-stack input. Asks only about architecture and exclusions, then generates all 14 production-grade deliverables.'
---

# /forge-init

**Input:** the user's tech stack or major framework (e.g., `React + TypeScript + Micro-Frontend`).

## Steps
1. Adopt the orchestrator role from `Agents/00-orchestrator.agent.md`.
2. Confirm the stack. Ask **only two questions**:
   - Which **architecture** (propose 2–3 with tradeoffs)?
   - Which frameworks/tools to **exclude**?
3. Run `Scripts/scaffold-output.ps1 -ProjectName <name>` to create the output folder + empty deliverables.
4. Execute phases 1→10 in order (see `Docs/PIPELINE.md`), delegating to each specialist agent and writing every deliverable per `Docs/OUTPUT-TEMPLATE.md`.
5. Run `Scripts/validate-plan.ps1` and fix any gaps.
6. Write `00-INDEX.md` and reply in chat with only: project name, architecture, index link, coverage summary.

## Guardrails
- Do not introduce Next.js or any unnamed framework.
- Always include AI streaming features (phase 10).
- Keep chat output minimal — everything substantive goes into Markdown files.
