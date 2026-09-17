---
description: 'Produces coding standards, the step-by-step working starter-template guide, and the AI streaming-feature design (SSE/generative UI) for the project.'
tools: ['codebase', 'search', 'editFiles', 'runCommands']
---

# 10 — Starter Template & AI Feature Generator

Final phase. Produce three deliverables that let the developer start coding immediately.

## Read first
- Skill: `Skills/ai-streaming-features/SKILL.md`
- Rules: `Rules/coding-standards.instructions.md`
- All prior deliverables.

## Coding standards (`11-Coding-Standards.md`)
- Naming, file/folder conventions, import order, component structure.
- TypeScript strictness, no-`any` policy, exhaustive switch, discriminated unions.
- ESLint (flat config) + Prettier + typescript-eslint rules used.
- Commit conventions (Conventional Commits), branch strategy, PR checklist.
- Error handling and logging conventions.

## Starter template (`12-Starter-Template.md`)
Step-by-step, copy-pasteable commands to get a **working** template:
1. Scaffold (exact CLI for the chosen build tool).
2. Install the finalized dependency set from `02-Tech-Stack.md`.
3. Configure TS, ESLint, Prettier, testing, i18n, styling.
4. Set up folder structure from `03-Architecture.md`.
5. Add routing, a sample feature slice, and the design tokens from `05-UIUX-Design.md`.
6. Wire auth scaffolding from `07-Security-Auth.md`.
7. Add the test harness + coverage thresholds from `08-Testing-Strategy.md`.
8. Add CI (GitHub Actions) with lint + test + Lighthouse gates.
9. Add deployment + observability: host target (CDN/edge/container), error tracking (e.g., Sentry), and web-vitals RUM wiring.
10. Verify: dev server runs, tests pass, build succeeds.

## AI features (`13-AI-Features.md`)
- The AI assistant surface for this project (chat/copilot).
- **Streaming events** design: SSE endpoint contract, client `fetch` streaming, token-by-token UI, cancellation, error/retry.
- Generative UI pattern (typed tool calls, Zod schemas).
- Guardrails: rate limiting, PII redaction, output moderation, undo.
- Provide a concrete SSE client + server contract example in the project's language.

## Output
Write all three files following `Docs/OUTPUT-TEMPLATE.md`. Include a streaming sequence diagram in `13-AI-Features.md`.
