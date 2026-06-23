# Plan: AI Safety & Ethics SaaS — "AI Trust Layer"

Two deliverables: **(1)** a research/strategy guide in the StudyNote repo covering the five areas requested, then **(2)** a production-grade MVP build plan for an **AI Trust Layer** platform (combined governance + runtime agent security + red-team + observability + posture/training) for AI platform engineering teams, on Next.js + NestJS microservices + Prisma/Postgres + Redis + Docker + nginx.

---

## Phase 1 — Research/Strategy Doc (`AI-Safety/` folder, markdown)

New folder matching the existing guide style; add an index entry to `README.md`.

1. **Overview** — `AI-Safety/AI-Safety-and-Ethics-for-Organizations.md`: exec summary, "why now" (agent proliferation), table of contents.
2. **Landscape & Frameworks** — `01-Landscape-and-Frameworks.md`: NIST AI RMF (Govern/Map/Measure/Manage) + GenAI Profile (AI-600-1); ISO/IEC 42001 AIMS, 42005 impact assessment, 27001; EU AI Act risk tiers, Art.4 literacy, Art.50 transparency, GPAI Code of Practice; OECD principles; academic survey.
3. **AI-Agent Attack Vectors** — `02-AI-Agent-Attack-Vectors.md`: OWASP GenAI Top 10 (2025) each with mitigations; MITRE ATLAS agentic techniques (tool invocation, context/RAG/tool poisoning, jailbreak, prompt self-replication, memory poisoning, excessive agency).
4. **Governance, Policies & Playbooks** — `03-Governance-Policies-Playbooks.md`: operating model + RACI, AI review board, acceptable-use policy, model/agent lifecycle gates, incident-response playbooks (prompt injection / data exfil / model poisoning), third-party/vendor risk.
5. **Controls, Monitoring & Training** — `04-Technical-Controls-Monitoring-Training.md`: preventive/detective controls, guardrails, GenAI DLP, agent identity, monitoring KPIs, role-based AI-literacy training program.
6. **Product Vision** — `05-AI-Trust-Layer-Product-Vision.md`: bridges doc → product (problem, ICP, modules, value).

## Phase 2 — MVP Build Plan: "AI Trust Layer" (monorepo at `Node/project/ai-trust-layer/`)

**Backend — NestJS microservices** (TCP for inter-service, REST via gateway):

| Service | Transport | Module | Responsibility |
|---|---|---|---|
| `gateway-bff` | HTTP | — | Public REST API, auth guard, aggregation (behind nginx) |
| `auth-svc` | TCP | — | Orgs, users, RBAC, API keys, JWT, multi-tenant |
| `registry-svc` | TCP | A | AI asset registry + risk assessments mapped to NIST/ISO/EU AI Act |
| `policy-svc` | TCP | A | Policies, guardrail configs, tool-authorization rules |
| `proxy-svc` | HTTP (data-plane) | B | OpenAI-compatible runtime gateway/"AI firewall", scaled |
| `guard-svc` | TCP | B | Prompt-injection / PII redaction / jailbreak / output validation |
| `redteam-svc` | TCP + BullMQ | C | Adversarial suites mapped to ATLAS/OWASP, regression scoring |
| `observability-svc` | TCP | D | Groundedness/hallucination/bias/toxicity scoring |
| `posture-svc` | TCP | E | Shadow-AI discovery, acceptable-use checks, training |
| `audit-svc` | event | — | Append-only audit log (Redis Streams), evidence export |
| `notification-svc` | event | — | Alerts/webhooks |

**Frontend — Next.js (App Router):** asset registry, compliance/control-mapping dashboards, policy/guardrail editor, live proxy traffic + incident feed, red-team reports, observability dashboards, training portal. Server Components + typed client to `gateway-bff`.

**Data & Infra:** Postgres (schema/DB-per-service) via Prisma; Redis (rate-limit, cache, pub/sub, BullMQ, sessions); Docker Compose (nginx LB + replicated `proxy-svc`, postgres, redis, all services, Next app); OpenTelemetry → Prometheus/Grafana/Jaeger; pino logging; GitHub Actions CI.

**Production concepts demonstrated:** health/readiness probes, graceful shutdown, circuit breaker + retries/timeouts (proxy→provider), rate limiting/quotas, idempotency keys, correlation/trace IDs, RBAC + tenant isolation, secrets management, DB migrations, horizontal scaling of the data-plane, audit immutability, PII handling.

**MVP phasing (build order):**
1. **Core wedge** — auth + registry + policy + proxy + guard + audit + dashboard shell (working "AI firewall + governance").
2. Red-team module. *(depends on 1)*
3. Observability module. *(parallel with 2)*
4. Posture/training module. *(parallel with 2)*
5. Production hardening + full observability stack.

---

## Relevant references in the repo
- `Node/project/nama-yatra/` — layered service structure / Prisma / Redis conventions to mirror (adapt Express→NestJS).
- `developer-study-guide/` — Next.js App Router patterns for the dashboard.
- `README.md` — add index entries for the new `AI-Safety/` guides.

## Verification
1. **Doc:** each of the 5 files renders, cross-links resolve, framework claims cite NIST/ISO/EU AI Act/OWASP/ATLAS accurately.
2. **Build:** `docker compose up` brings up nginx + all services + Postgres + Redis + Next app healthy; Prisma migrations apply.
3. **Functional smoke:** a chat/agent request through `proxy-svc` gets guardrail-checked, tool-call authorized via `policy-svc`, logged in `audit-svc`, and visible in the Next dashboard.
4. **Security:** a prompt-injection + PII-leak test case is blocked/redacted; a red-team run produces an ATLAS/OWASP-mapped score.

## Decisions & scope
- **Included:** all 5 modules, but MVP delivers the core wedge first; rest scaffolded then filled per phasing.
- **Excluded (initially):** training real ML detection models (use rules + optional hosted-model calls), SSO/enterprise IdP, billing, and cloud/k8s deployment (Docker Compose only for MVP).

## Further considerations
1. **Monorepo tool:** Nx (better for NestJS + Next, generators, caching) vs. plain pnpm workspaces (lighter). *Recommend Nx.*
2. **Guard detection depth for MVP:** rules/heuristics only, or also call a hosted moderation/LLM model for injection/groundedness? *Recommend rules + pluggable model adapter.*
3. **Doc granularity:** the 5-file split above, or one comprehensive single guide? *Recommend the 5-file split to match the repo's per-topic style.*
