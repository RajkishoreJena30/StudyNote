# NexusDesk — Production Plan Index

> An AI-native, multi-tenant customer support & operations platform, built to master **basic→advanced** frontend concepts. **Stack:** React 19 + TypeScript. **Architecture:** Runtime **Module Federation** (Rspack) micro-frontends — host `shell` + remotes `inbox`, `analytics`, `knowledge`, `admin`. **No Next.js.**

## Deliverables
1. [Project Research](01-Project-Research.md) — why NexusDesk + concept-coverage matrix
2. [Tech Stack](02-Tech-Stack.md) — frameworks, packages, MF shared singletons
3. [Architecture](03-Architecture.md) — context/module/sequence diagrams + folder tree
4. [Product Spec](04-Product-Spec.md) — roles, features, pages, flows, requirements
5. [UI/UX Design](05-UIUX-Design.md) — IA, color, type, tokens, components, a11y
6. [Delivery Plan](06-Delivery-Plan.md) — sprints, Epic→Feature→Story→Task (5h/day), LLD
7. [Security & Auth](07-Security-Auth.md) — OIDC+PKCE, RBAC/ABAC, OWASP, CSP
8. [Testing Strategy](08-Testing-Strategy.md) — ≥90% coverage, unit + E2E + streaming
9. [Performance](09-Performance.md) — Core Web Vitals budget + MFE dedup
10. [Internationalization](10-Internationalization.md) — i18next, ICU, RTL, en/es/ar
11. [Coding Standards](11-Coding-Standards.md) — TS strict, boundaries, commits
12. [Starter Template](12-Starter-Template.md) — working monorepo + MF host/remote
13. [AI Features](13-AI-Features.md) — SSE streaming copilot + generative UI

## Coverage summary
- **Test target:** ≥ 90% (unit + integration + E2E) + MF contract tests
- **Core Web Vitals:** LCP ≤ 2.5s / INP ≤ 200ms / CLS ≤ 0.1 (p75), enforced in CI
- **i18n:** en, es, ar (RTL) via shared i18next singleton
- **Security:** OIDC/OAuth2 + PKCE via BFF, httpOnly cookies, RBAC/ABAC, strict CSP
- **AI:** streaming copilot over **SSE** (cancel/retry) + typed generative UI
- **Architecture:** Rspack Module Federation, host + 4 independently deployable remotes

## How to proceed
1. Build the working skeleton → [12-Starter-Template.md](12-Starter-Template.md).
2. Execute sprint by sprint → [06-Delivery-Plan.md](06-Delivery-Plan.md), starting with S0 (foundation) and S1 (auth + inbox).
3. Keep every PR green against the gates in [08-Testing-Strategy.md](08-Testing-Strategy.md) and [09-Performance.md](09-Performance.md).

