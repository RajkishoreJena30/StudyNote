---
description: 'Produces coding standards, a step-by-step working starter-template guide (scaffolded and verified by actually running it), and the AI streaming-feature design (SSE/generative UI) for the project.'
tools: ['codebase', 'search', 'editFiles', 'runCommands']
---

# 10 — Starter Template & AI Feature Generator

Final phase. Produce three deliverables that let the developer start coding immediately. Default to full depth on every run: a starter template that was only reviewed on paper, never actually scaffolded and run, is an incomplete deliverable — see the verification loop below.

## Read first
- Skill: `Skills/starter-template-scaffolding/SKILL.md` (scaffold-script pattern, MF config checklist, entry-point convention, verification loop)
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
Deliver as a **single cross-platform Node.js scaffold script** (see the skill) that writes every file needed to run — not a list of commands that assume folders/`package.json`s already exist:
1. Prerequisites (OS-independent — Node + Corepack only).
2. The scaffold script itself: root + per-app/package `package.json`s, complete build-tool config (e.g. full Module Federation config on every side, not a fragment), TS/ESLint/Prettier config, source files, and one test per app.
3. `pnpm install` (single command — no manual `pnpm add` steps into folders that didn't exist).
4. Explain what got configured (TS/ESLint/Prettier).
5. Module Federation section: the complete-config checklist from the skill, plus the `eager` + async-boundary gotcha.
6. Entry-point convention (`index.ts → bootstrap.tsx → App/exposed-component`), applied identically to every app.
7. Build-tool workspace config (e.g. Turborepo v2 `"tasks"`, not the deprecated `"pipeline"` key).
8. Folder structure produced.
9. Test harness + coverage thresholds from `08-Testing-Strategy.md`, including how to unit-test a Module-Federation host in isolation (resolve alias to a stub, not a late `vi.mock`).
10. CI (GitHub Actions) — matrix must match the apps the scaffold **actually creates**, not future/aspirational ones.
11. Deployment + observability: host target (CDN/edge/container), error tracking (e.g., Sentry), and web-vitals RUM wiring.
12. **Verify**: concrete pass/fail commands (`pnpm build`, `pnpm test`, `pnpm typecheck`, `pnpm lint`, `pnpm dev` + a browser click-through) — these are not optional narration, they must have actually been run this session (see Verification loop below).
13. OS-specific troubleshooting table.

### Verification loop (mandatory, not optional)
Before writing the final version of `12-Starter-Template.md`: extract/run the scaffold script into a scratch folder, `pnpm install`, then run build/test/typecheck/lint and (if there's a UI) start the dev server and click through the primary flow in a browser. Fix every bug found in the deliverable itself (the script/config, not just the scratch copy), then re-run the full loop once more from a clean extraction to confirm the fix holds. Only then write/update the doc to match the verified state.

## AI features (`13-AI-Features.md`)
- The AI assistant surface for this project (chat/copilot).
- **Streaming events** design: SSE endpoint contract, client `fetch` streaming, token-by-token UI, cancellation, error/retry.
- Generative UI pattern (typed tool calls, Zod schemas).
- Guardrails: rate limiting, PII redaction, output moderation, undo.
- Provide a concrete SSE client + server contract example in the project's language.

## Output
Write all three files following `Docs/OUTPUT-TEMPLATE.md`. Include a streaming sequence diagram in `13-AI-Features.md`. Treat the verification loop as the bar for "done" on `12-Starter-Template.md` — do not ship a version that hasn't actually been run.
