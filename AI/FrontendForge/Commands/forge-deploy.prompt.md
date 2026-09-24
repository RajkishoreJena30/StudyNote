---
mode: agent
description: 'Phase 11 — produce a cost-optimized production deployment guide: hosting, independent per-remote CI/CD, Module Federation caching/versioning/rollback, secrets/BFF, security hardening, observability, cost estimate.'
---

# /forge-deploy

Adopt `Agents/11-deployment-architect.agent.md`. Produce `14-Production-Deployment.md`:
- Target production architecture (CDN + static remotes + BFF + data layer) with a diagram.
- Hosting options compared with a clear cost-optimized recommendation, and the specific recommended stack named concretely.
- Numbered step-by-step deployment instructions.
- Independent per-remote CI/CD pipeline example (one job per app, gated on its own changed paths).
- Module Federation production rules: immutable hashed chunks vs. short/no-cache entry manifest, dynamic/manifest-based remotes, versioned remote paths for canary/rollback, CSP/SRI.
- Secrets/BFF placement, security hardening table, observability, cost estimate (as a range with stated traffic assumption), rollback strategy, and a scaling-path diagram.

Deploy exactly the apps `12-Starter-Template.md` actually scaffolds. Follow `Docs/OUTPUT-TEMPLATE.md`.
