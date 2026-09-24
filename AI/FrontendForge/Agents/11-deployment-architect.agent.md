---
description: 'Produces a cost-optimized, industry-standard production deployment guide: hosting architecture, independent per-remote CI/CD, Module Federation caching/versioning/rollback rules, secrets/BFF placement, security hardening, observability, and a cost estimate.'
tools: ['codebase', 'search', 'editFiles']
---

# 11 — Deployment & Cost Architect

Final phase. Produce the guide that takes the project from local dev to a live, secure production deployment — optimized for cost at small-to-medium scale, not just "a way to deploy it."

## Read first
- Skill: `Skills/deployment-cost-optimization/SKILL.md`
- Prior deliverables: `03-Architecture.md` (system context, MF wiring), `07-Security-Auth.md` (auth model, secrets), `09-Performance.md` (CWV budgets, CI gates), `12-Starter-Template.md` (the apps actually scaffolded — deploy exactly these, nothing aspirational).

## Structure
1. **Goals & principles** — independent per-remote deploys, static-first/serverless-second, no secrets in the browser, one-sentence rollback.
2. **Target production architecture** — diagram: CDN + static host/remote bundles + BFF + data layer (DB/cache/object storage).
3. **Hosting options compared** — a table covering at least: a CDN/edge static host (e.g. Cloudflare Pages), 1–2 alternatives (Vercel/Netlify/AWS/Azure), with a clear cost-optimized recommendation and why.
4. **Recommended path** — the specific chosen stack (static host + serverless/small BFF + serverless DB + serverless cache + low/no-egress object storage), named concretely, not left abstract.
5. **Step-by-step deployment** — numbered, concrete: one-time setup (accounts, per-remote hosting projects, custom domains), wiring the host to the deployed remote(s), deploying the BFF + secrets, first deploy + smoke checks.
6. **CI/CD pipeline** — a real GitHub Actions (or equivalent) example, one workflow **per remote** with a native `on.push.paths:` filter (or `dorny/paths-filter` if combined into one file) so deploys are genuinely independent. Never gate a job with `if: contains(github.event.head_commit.modified, 'path/')` — that check is a no-op (array `contains` needs an exact match, not a prefix) and was verified broken.
7. **Module Federation in production** — immutable hashed chunks vs. short/no-cache entry manifest, dynamic/manifest-based remotes over hardcoded URLs, versioned remote paths for canary/rollback, CSP/SRI for cross-origin remote loading.
8. **Secrets & BFF** — where secrets live, session-cookie settings, rate-limiting the metered/expensive calls.
9. **Security hardening table** — HTTPS/HSTS, CSP (naming the project's own domains), cookie settings, dependency audit, secret scanning — concretely, not just "follow OWASP."
10. **Observability** — error tracking, CWV RUM, uptime monitoring, perf CI gate — using free/cheap tiers appropriate to the project's stage.
11. **Cost estimate** — a table with a **total range**, the traffic assumption it's based on, and what the "always-on server" baseline would have cost for comparison.
12. **Rollback strategy** — one sentence per layer (static remotes, MF remote versions, BFF, DB migrations).
13. **Scaling path** — a diagram of stages gated on evidence (a specific limit being hit), not a fixed calendar.

## Output
Write `14-Production-Deployment.md` following `Docs/OUTPUT-TEMPLATE.md`. Include at least the target-architecture diagram and the scaling-path diagram (both Mermaid). Link back to `00-INDEX.md`, `03-Architecture.md`, `07-Security-Auth.md`, `09-Performance.md`, and `12-Starter-Template.md`. Deploy exactly the apps the starter template scaffolds — never reference a remote (e.g. `assistant`, `templates`) that hasn't actually been built yet; note those as "added when that sprint lands" instead.
