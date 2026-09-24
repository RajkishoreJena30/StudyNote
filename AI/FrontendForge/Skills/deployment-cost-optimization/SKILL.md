---
name: deployment-cost-optimization
description: 'Knowledge pack for taking a frontend (especially micro-frontend/Module Federation) project from local dev to a live, secure, cost-optimized production deployment. Covers static-first/serverless-first hosting choices, independent per-remote CI/CD, MF-specific caching and versioning, secrets/BFF placement, observability, cost estimation, and rollback strategy. Use when building a production deployment guide.'
---

# Skill: Deployment & Cost Optimization

## Core principle: static-first, serverless-second
- Every frontend bundle (host + each remote) should build to **static, hashed, immutable files** served from a CDN/edge network — there is no cheaper or more reliable tier than "files on a CDN."
- The **only** server-side compute is for things that genuinely need it: auth token exchange, secret-holding API proxies (BFF), and any stateful session logic. Put that in a function/small container that **scales to zero when idle** — never an always-on VM for a mostly-static frontend.
- Managed, pay-per-use data services (serverless Postgres, serverless Redis, S3-compatible object storage with low/no egress) beat self-hosted databases at small-to-medium scale on both cost and operational burden.

## Hosting decision matrix
| Need | Cheapest good option | Why |
|------|----------------------|-----|
| Static bundle hosting (per remote) | Cloudflare Pages / Netlify / Vercel free tiers | Free unlimited static requests; global CDN by default |
| BFF / auth proxy | Cloudflare Workers, Vercel/Netlify Functions, or a $2–5/mo always-warm micro-container (Fly.io/Railway) if you need full Node APIs | Pay-per-invocation or near-zero idle cost |
| Relational data | Neon / Supabase (serverless Postgres) | Scales to zero compute between requests |
| Cache / sessions / rate limits | Upstash (serverless Redis) | Pay-per-request, free tier covers small apps |
| Object storage (uploads/exports) | Cloudflare R2 | S3-compatible with **zero egress fees** |
| Errors/RUM | Sentry free tier + `web-vitals` to a cheap endpoint | Avoid paid APM until traffic justifies it |

Always compare against the "always-on VM/container" baseline: an idle $20+/mo server for a bursty, frontend-heavy workload is almost never the cheapest option at small-to-medium scale.

## Module-Federation-specific production concerns
- **Cache asymmetry is the key trick:** hashed content chunks get `Cache-Control: immutable, max-age=1y`; the **entry manifest** (`remoteEntry.js` / MF manifest) must be short-cached or `no-cache` — it's the pointer that lets consumers discover the *current* hashed chunks without a host rebuild.
- **Independent deploys need independent CI jobs.** Gate each remote's deploy on only its own changed paths (plus shared packages it depends on) so a fix in one remote doesn't force a redeploy — or even a test run — of every other remote. **Use a separate workflow file per remote with a native `on.push.paths:` filter**, or the community `dorny/paths-filter` action for a single combined workflow. Do **not** hand-roll this with `if: contains(github.event.head_commit.modified, 'some/path/')` inside one workflow — `contains()` on that array checks for an exact element match, not a path-prefix/substring match, so the condition is effectively always false; it also only reflects the last commit of a push, silently missing earlier ones.
- **Prefer dynamic/manifest-based remote resolution** over hardcoding a remote's URL into the host's build — this turns "ship a new remote version" into a config/manifest change instead of a host rebuild+redeploy.
- **Version remotes at a path** (e.g. `/v2026-09-24/remoteEntry.js`) so canary and rollback are just repointing a manifest entry, not rebuilding anything.
- Treat cross-origin remote loading as a security boundary: strict CSP `script-src` allow-listing your own domains only, HTTPS everywhere, and consider SRI/signed manifests for remote entries.

## Secrets & BFF placement
- Nothing that must stay secret (OIDC client secret, LLM API keys, DB credentials, signing keys) ever goes in a static bundle or a client-visible env var — only in the BFF's runtime, sourced from the platform's secret manager.
- Session cookies: httpOnly, Secure, SameSite, rotated signing secret.
- Rate-limit any metered/expensive backend call (AI, email, etc.) at the BFF — this is usually the single biggest lever against cost blowouts, not infra choice.

## Cost estimation methodology
1. List each component (static hosting, compute, DB, cache, storage, observability, domain).
2. For each, find the **free-tier ceiling** and the **next paid tier's price**, and estimate whether current expected traffic sits under or over that ceiling.
3. Present a total as a **range**, not a single number, and state the traffic assumption it's based on.
4. Note the **first thing that will need to change** as traffic grows (usually: BFF free-tier request limit, or DB free-tier compute-hours) so the reader knows what to watch, not just what to pay today.

## Rollback & scaling path
- Rollback should always be **describable in one sentence and take effect in seconds**: "promote the previous static deployment" / "repoint the remote manifest" / "redeploy the previous BFF version." If a rollback plan requires a rebuild, it's not a real rollback plan.
- Present scaling as **stages gated on evidence** (a specific free-tier limit actually being hit), not a fixed timeline — don't recommend provisioning ahead of real, measured traffic.

## Deliverable must include
Target architecture diagram (CDN + static remotes + BFF + data layer), a hosting comparison table with a clear cost-optimized recommendation, numbered step-by-step deployment instructions, an independent-per-remote CI/CD pipeline example, the MF cache/versioning/rollback rules above, a secrets/BFF section, a security-hardening table, an observability section, a cost estimate (as a range, with the traffic assumption stated), a rollback section, and a scaling-path diagram.
