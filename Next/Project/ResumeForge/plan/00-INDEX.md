# ResumeForge — Production Plan Index

> An AI, ATS-aware resume & cover-letter studio — chat your resume past the ATS. **Stack:** React 19 + TypeScript (strict) + Rspack Module Federation micro-frontends. **Architecture:** Module Federation (shell host + editor / assistant / templates / account remotes + BFF). **No Next.js.**

## Deliverables
1. [Project Research](01-Project-Research.md)
2. [Tech Stack](02-Tech-Stack.md)
3. [Architecture](03-Architecture.md)
4. [Product Spec (PO brief + functional)](04-Product-Spec.md)
5. [UI/UX Design System](05-UIUX-Design.md)
   - [UI/UX Static Reference site](../UIUX/index.html) · [README](../UIUX/README.md)
6. [Delivery Plan (Agile)](06-Delivery-Plan.md)
7. [Security & Auth](07-Security-Auth.md)
8. [Testing Strategy](08-Testing-Strategy.md)
9. [Performance](09-Performance.md)
10. [Internationalization](10-Internationalization.md)
11. [Coding Standards](11-Coding-Standards.md)
12. [Starter Template](12-Starter-Template.md)
13. [AI Features (streaming)](13-AI-Features.md)
14. [Production Deployment (cost-optimized)](14-Production-Deployment.md)

## Coverage summary
- **Architecture:** Module Federation (Rspack) — shell host + 4 independently deployable remotes + BFF.
- **Test target:** ≥ 90% (unit + integration + E2E: Vitest + Testing Library + Playwright + MSW).
- **Core Web Vitals:** LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1 (p75) with size-limit + Lighthouse CI gates.
- **i18n:** en, es, fr, de, ar (RTL) — i18next + ICU, per-remote namespaces.
- **Security:** OIDC/OAuth2 + PKCE via BFF, httpOnly cookie sessions, RBAC by plan, CSP, OWASP mitigations, MF remote integrity (SRI/pinning).
- **AI:** streaming via SSE (`fetch` + ReadableStream), token-by-token UI with Stop, Zod-validated generative-UI tool-calls, prompt-injection/PII guardrails.
- **No excluded framework:** Next.js not used anywhere.

## How to proceed
1. Explore the visual prototype → [../UIUX/index.html](../UIUX/index.html) (`python -m http.server`).
2. Build the starter → [12-Starter-Template.md](12-Starter-Template.md).
3. Execute sprints → [06-Delivery-Plan.md](06-Delivery-Plan.md).

