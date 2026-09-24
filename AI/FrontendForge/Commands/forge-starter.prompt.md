---
mode: agent
description: 'Phase 10 — produce coding standards, a working starter-template (single scaffold script, verified by actually running it), and the AI streaming-feature design.'
---

# /forge-starter

Adopt `Agents/10-starter-template-generator.agent.md`. Produce three files:
- `11-Coding-Standards.md`: conventions, TS strictness, ESLint/Prettier, commits, PR checklist.
- `12-Starter-Template.md`: a single cross-platform Node.js scaffold script (see `Skills/starter-template-scaffolding/SKILL.md`) covering scaffold → deps → config → structure → auth → tests → CI → verify. Run the verification loop (install/build/test/typecheck/lint, plus a dev-server browser click-through if there's a UI) before finalizing the doc, and fix any bug found.
- `13-AI-Features.md`: AI assistant surface + SSE streaming contract, client streaming example, token UX (cancel/retry), generative UI schema, guardrails, streaming sequence diagram.

Follow `Docs/OUTPUT-TEMPLATE.md`.
