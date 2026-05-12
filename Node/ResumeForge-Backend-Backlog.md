# 🚀 ResumeForge — Backend Product Backlog
### Epic → Feature → Story → Task Breakdown
> **Product**: ResumeForge Backend API — AI-Powered Resume Builder & Career Coach
> **Stack**: Node.js + Express + TypeScript + MongoDB + PostgreSQL + Redis + BullMQ + OpenAI + Puppeteer + pdflatex + Kafka
> **Team Size**: 3 devs (2 Backend, 1 QA) | **Sprint Length**: 2 weeks
> **Total Estimated Effort**: ~28 weeks (14 sprints) | **Scale Target**: 50k–500k users

---

## 📦 Backend Service Areas Overview

| # | Area | Key Tech |
|---|---|---|
| 1 | **Foundation & Architecture** | Express + TypeScript, folder structure, env validation, graceful shutdown |
| 2 | **Authentication** | JWT rotate, bcrypt, Google OAuth Passport, account lockout, email verify |
| 3 | **Authorization** | RBAC, subscription tier guard, resource ownership |
| 4 | **User & Profile API** | CRUD, avatar upload, onboarding, preferences, session management |
| 5 | **Resume CRUD API** | Create/read/update/delete/clone, version history, share tokens |
| 6 | **Resume Builder Data API** | Section-level PATCH, section reorder, auto-save endpoint |
| 7 | **Template Engine & PDF Export** | Puppeteer PDF, `docx` DOCX, HTML template rendering, LaTeX→PDF |
| 8 | **Resume Scoring Engine** | ATS rule-based scoring, JD keyword match, section weights, score history |
| 9 | **LaTeX Service** | Resume→LaTeX converter, `pdflatex` compile, LaTeX→DOCX via pandoc, LaTeX templates |
| 10 | **AI Integration** | OpenAI streaming, chat context, bullet optimizer, section rewriter, import from LinkedIn |
| 11 | **PDF Upload & Parse** | Multer upload, `pdf-parse`, AI extraction pipeline, async job polling |
| 12 | **Upskilling API** | Skill gap analysis, concept cards CRUD, interview questions bank, mock interview sessions |
| 13 | **File Storage** | Multer + Cloudinary + AWS S3, presigned URLs, avatar management |
| 14 | **Redis — Cache & Queues** | Cache middleware, invalidation, rate limiting, job queues via BullMQ |
| 15 | **Email Service** | BullMQ email queue, Handlebars templates, Nodemailer + SES |
| 16 | **Payment & Subscriptions** | Stripe Checkout, webhooks, subscription tiers, credit system |
| 17 | **Analytics** | Resume view tracking, score history, mock interview history |
| 18 | **Error Handling & Logging** | AppError class, global handler, Winston, Sentry, health endpoints |
| 19 | **Testing** | Jest + Supertest + MongoMemoryServer + mock factories |
| 20 | **Security & Rate Limiting** | helmet, CORS, CSRF, input sanitization, OWASP, IP blacklist |
| 21 | **Docker & CI/CD** | Multi-stage Dockerfile, docker-compose, GitHub Actions, PM2 |

---

## 🗺️ Roadmap Overview

```
Q1 (Sprint 1–4)   → Core: Foundation + Auth + User + Resume CRUD + Builder API
Q2 (Sprint 5–8)   → Engine: Templates + PDF Export + LaTeX + Scoring + AI Chat
Q3 (Sprint 9–11)  → Intelligence: AI Sections + PDF Parse + Upskilling API
Q4 (Sprint 12–14) → Scale: Payments + Redis + Email Queues + Testing + Docker + CI/CD
```

---

## 📚 Table of Contents

- [EPIC 1 — Foundation & Express Architecture](#epic-1--foundation--express-architecture)
- [EPIC 2 — Authentication](#epic-2--authentication)
- [EPIC 3 — Authorization & Subscription Guards](#epic-3--authorization--subscription-guards)
- [EPIC 4 — User & Profile API](#epic-4--user--profile-api)
- [EPIC 5 — Resume CRUD & Share API](#epic-5--resume-crud--share-api)
- [EPIC 6 — Resume Builder Data API](#epic-6--resume-builder-data-api)
- [EPIC 7 — Template Engine & Export (PDF / DOCX)](#epic-7--template-engine--export)
- [EPIC 8 — Resume Scoring Engine](#epic-8--resume-scoring-engine)
- [EPIC 9 — LaTeX Service](#epic-9--latex-service)
- [EPIC 10 — AI Integration (OpenAI)](#epic-10--ai-integration-openai)
- [EPIC 11 — PDF Upload & Parse Pipeline](#epic-11--pdf-upload--parse-pipeline)
- [EPIC 12 — Upskilling & Career API](#epic-12--upskilling--career-api)
- [EPIC 13 — File Storage (Cloudinary / S3)](#epic-13--file-storage)
- [EPIC 14 — Redis Caching & BullMQ Queues](#epic-14--redis-caching--bullmq-queues)
- [EPIC 15 — Email Service](#epic-15--email-service)
- [EPIC 16 — Payments & Subscription (Stripe)](#epic-16--payments--subscription-stripe)
- [EPIC 17 — Analytics & Tracking](#epic-17--analytics--tracking)
- [EPIC 18 — Error Handling & Logging](#epic-18--error-handling--logging)
- [EPIC 19 — Testing](#epic-19--testing)
- [EPIC 20 — Security & Rate Limiting](#epic-20--security--rate-limiting)
- [EPIC 21 — Docker & CI/CD](#epic-21--docker--cicd)
- [Sprint Plan Summary](#sprint-plan-summary)
- [Definition of Ready & Done](#definition-of-ready--done)

---

---

# EPIC 1 — Foundation & Express Architecture

> **Goal**: Production-grade Express.js boilerplate with TypeScript strict mode, service layer pattern, env validation, graceful shutdown, and Node.js core concepts correctly applied.
> **Priority**: 🔴 P0 (Sprint 1)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**
> **Concepts**: Event Loop, Streams, Cluster, Worker Threads, EventEmitter, Express middleware chain

---

## Feature 1.1 — Project Scaffold & Folder Structure

**Acceptance Criteria**:
- [ ] `src/` structure: `controllers/`, `services/`, `models/`, `routes/`, `middleware/`, `jobs/`, `workers/`, `utils/`, `config/`, `types/`
- [ ] TypeScript `strict: true`, path aliases `@/*` = `src/*`
- [ ] `app.ts` (Express setup) separate from `server.ts` (listen + DB connect)
- [ ] Graceful shutdown on `SIGTERM` / `SIGINT`
- [ ] ESLint + Prettier + Husky pre-commit hooks

---

### Story 1.1.1 — Express App Initialization

> **As a** backend developer, **I want to** have a clean production-ready boilerplate, **so that** all features are built on a solid foundation.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Init project: `tsconfig.json` strict + path aliases | BE Dev | 1h | `strict: true`, `paths: { "@/*": ["src/*"] }`, `outDir: dist`, `esModuleInterop: true` |
| T2 | Full folder structure + `.gitkeep` | BE Dev | 0.5h | All dirs. Root: `src/`, `tests/`, `docker/`, `.github/` |
| T3 | `app.ts` — middleware chain | BE Dev | 2h | `helmet`, `cors` (allowlist), `morgan`, `express.json({limit:'10mb'})`, `compression`, route mounts, 404 handler, global error handler |
| T4 | `server.ts` — HTTP + graceful shutdown | BE Dev | 2h | `http.createServer(app)`, connect Mongo + Postgres + Redis, `process.on('SIGTERM')` → `server.close()` → DB close → `process.exit(0)` |
| T5 | ESLint + Prettier + Husky | BE Dev | 1h | `eslint-config-airbnb-typescript`, `.prettierrc`, `lint-staged` on pre-commit |
| T6 | `package.json` scripts | BE Dev | 0.5h | `dev` (tsx watch), `build` (tsc), `start` (node dist/server), `test`, `lint`, `typecheck` |

---

### Story 1.1.2 — Environment Config with Zod Validation

> **As a** developer, **I want to** validate all environment variables on startup with Zod, **so that** the app fails fast with a clear error if config is missing.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `config/env.ts` — Zod schema | BE Dev | 2h | `z.object({ PORT, NODE_ENV, MONGO_URI, POSTGRES_URI, REDIS_URL, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, OPENAI_API_KEY, STRIPE_SECRET_KEY, AWS_S3_BUCKET, SENDGRID_API_KEY, ... })`. `process.exit(1)` on parse failure |
| T2 | `.env.example` with all required keys | BE Dev | 0.5h | Document every variable, grouped by service |
| T3 | Environment-specific config overrides | BE Dev | 0.5h | `development`: verbose logs, `production`: JSON logs, `test`: in-memory DBs |

---

## Feature 1.2 — Node.js Core: Cluster, Worker Threads, EventEmitter

---

### Story 1.2.1 — Cluster Mode + PM2

> **As a** DevOps engineer, **I want to** run the app in cluster mode, **so that** all CPU cores handle HTTP traffic.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `cluster.ts` — master/worker fork | BE Dev | 2h | `cluster.isPrimary` → fork `os.cpus().length` workers. `cluster.on('exit')` → restart crashed workers |
| T2 | Per-worker graceful shutdown | BE Dev | 1h | Worker receives `SIGTERM` → stop accepting connections → drain in-flight → exit |
| T3 | PM2 ecosystem config | BE Dev | 1h | `ecosystem.config.js` — `exec_mode: 'cluster'`, `instances: 'max'`, `watch: false`, env injection |
| T4 | `GET /health` endpoint | BE Dev | 1h | Returns `{ status:'ok', uptime, memoryMB, pid, version, env }` |

---

### Story 1.2.2 — Worker Threads for CPU-Intensive Tasks

> **As a** developer, **I want to** offload PDF text extraction and LaTeX→PDF compilation to Worker Threads, **so that** the event loop is never blocked.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `workers/pdfParseWorker.ts` | BE Dev | 2h | Receives `{ pdfBuffer }` via `workerData`, runs `pdf-parse`, posts structured text back via `parentPort` |
| T2 | `workers/latexCompileWorker.ts` | BE Dev | 2h | Receives `{ latexSource }`, spawns `pdflatex` child process, posts `{ pdfBuffer, errors }` back |
| T3 | `utils/WorkerPool.ts` | BE Dev | 3h | Pool of N workers, task queue, round-robin dispatch, promise-based API: `pool.run(data)` |
| T4 | Stream large PDF response | BE Dev | 1h | `Readable.from(pdfBuffer)` → `res.pipe()` — never buffer full PDF in memory for response |

---

### Story 1.2.3 — Domain Event Emitter

> **As a** backend developer, **I want to** use a typed EventEmitter for internal domain events, **so that** services are decoupled (email, score update, analytics on same event).

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `events/resumeEvents.ts` typed emitter | BE Dev | 1h | `class ResumeEventEmitter extends EventEmitter` — events: `resume:created`, `resume:exported`, `resume:score-updated`, `resume:shared` |
| T2 | Emit from service layer | BE Dev | 0.5h | `resumeEmitter.emit('resume:exported', { userId, resumeId, format })` |
| T3 | Listeners: analytics + notifications | BE Dev | 1h | `resumeEmitter.on('resume:exported', trackExport)`, `resumeEmitter.on('resume:shared', sendShareNotification)` |
| T4 | Async listener error handling | BE Dev | 0.5h | Wrap all async listeners in `try/catch` — `emitter.on('error', logger.error)` — never crash process |

---

---

# EPIC 2 — Authentication

> **Goal**: Secure auth with JWT access/refresh rotation, Google OAuth, email verification, account lockout, and password reset.
> **Priority**: 🔴 P0 (Sprint 1–2)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**
> **Concepts**: JWT (RS256/HS256), bcrypt, Passport.js, crypto, httpOnly cookies, Redis blacklist

---

## Feature 2.1 — JWT Auth (Register / Login / Refresh / Logout)

**Acceptance Criteria**:
- [ ] Access token: 15min, signed HS256, in-memory on client
- [ ] Refresh token: 7 days, httpOnly cookie, `jwtid` claim for blacklisting
- [ ] On refresh: rotate both tokens, blacklist old refresh token in Redis
- [ ] Logout: add refresh `jwtid` to Redis blacklist with TTL = remaining lifetime
- [ ] Account lock after 5 failed logins for 15 minutes

---

### Story 2.1.1 — Register & Email Verification

> **As a** new user, **I want to** register and verify my email, **so that** my account is secure.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /auth/register` controller + service | BE Dev | 2h | Validate body (Zod), check duplicate email, `bcrypt.hash(password, 12)`, create User in MongoDB, emit `user:registered` event |
| T2 | Email verification token | BE Dev | 1h | `crypto.randomBytes(32).toString('hex')` — store hashed with `SHA-256` in User, 24h expiry |
| T3 | Queue verification email | BE Dev | 1h | Push `{ type:'verify-email', to, token }` to BullMQ `emailQueue` — async, non-blocking |
| T4 | `GET /auth/verify-email/:token` | BE Dev | 1h | Hash incoming token → find User → check expiry → set `isVerified: true`, clear token fields |
| T5 | `POST /auth/resend-verification` | BE Dev | 1h | Rate-limited (1 per 60s per email via Redis) — generate new token, queue email |
| T6 | Tests | QA | 3h | Register success, duplicate 409, unverified login 403, verify token, expired token 400, resend rate limit 429 |

---

### Story 2.1.2 — Login with Token Rotation

> **As a** registered user, **I want to** log in and receive a token pair, **so that** I can make authenticated API calls.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /auth/login` controller + service | BE Dev | 2h | Find user `+password`, `bcrypt.compare`, check `isVerified`, check `lockUntil`, generate token pair |
| T2 | `signTokens(userId, role)` utility | BE Dev | 1h | `signAccessToken` (15m, `{ id, role, jti }`) + `signRefreshToken` (7d, `{ id, jti }`) |
| T3 | Refresh token httpOnly cookie | BE Dev | 1h | `res.cookie('refreshToken', token, { httpOnly, secure: prod, sameSite:'strict', maxAge: 7d, path:'/api/auth' })` |
| T4 | `POST /auth/refresh` — token rotation | BE Dev | 2h | Read cookie → `jwt.verify` → check Redis blacklist for `jti` → blacklist old `jti` (TTL=remaining) → issue new pair |
| T5 | `POST /auth/logout` | BE Dev | 1h | Add refresh token `jti` to Redis blacklist → `res.clearCookie('refreshToken')` |
| T6 | Account lockout: 5 failed attempts | BE Dev | 2h | Increment `loginAttempts` on fail. If ≥5 → set `lockUntil: now + 15min`. On success → reset attempts. Return `attemptsRemaining` in error |
| T7 | Tests | QA | 3h | Login success, wrong password (attempt count), locked account, refresh rotation, logout blacklist idempotency |

---

### Story 2.1.3 — Forgot / Reset Password

> **As a** user, **I want to** reset my password via secure email link, **so that** I can regain access.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /auth/forgot-password` | BE Dev | 1h | Find by email, generate reset token (crypto), hash + store with 1h expiry, queue email. Always return 200 (prevent email enumeration) |
| T2 | `POST /auth/reset-password/:token` | BE Dev | 2h | Hash token → find user → check expiry → bcrypt new password → check against last 3 hashes (prevent reuse) → invalidate all refresh tokens for user |
| T3 | Password history model | BE Dev | 1h | Store `passwordHistory: [{ hash, createdAt }]` (last 3) in User schema |
| T4 | Tests | QA | 2h | Full reset flow, expired token 400, invalid token 400, password reuse 400 |

---

## Feature 2.2 — Google OAuth (Passport.js)

---

### Story 2.2.1 — Passport Google Strategy

> **As a** user, **I want to** sign in with Google, **so that** I don't need a separate password.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Configure `passport-google-oauth20` strategy | BE Dev | 1h | `GoogleStrategy` — `clientID`, `clientSecret`, `callbackURL`. Profile fields: email, name, photo |
| T2 | Strategy callback — find or create user | BE Dev | 2h | Find by `googleId` → OR find by `email` → link Google to existing account → OR create new user (`isVerified: true` auto-set for OAuth) |
| T3 | `GET /auth/google` + callback route | BE Dev | 1h | Initiate OAuth. On callback → generate JWT pair → set refresh cookie → redirect to frontend with access token in short-lived query param |
| T4 | Save Google profile photo | BE Dev | 1h | If new user: download Google photo → upload to S3 → save `avatarUrl` |
| T5 | Tests | QA | 2h | Mock `passport.authenticate`, test user creation, test account linking, test callback redirect |

---

### Story 2.2.2 — `authenticate` + `authorize` Middleware

> **As a** system, **I want to** verify JWT on every protected route, **so that** unauthorized users cannot call APIs.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `middleware/authenticate.ts` | BE Dev | 2h | Extract `Authorization: Bearer <token>` → `jwt.verify` → find user in Redis cache (fallback: DB) → `req.user = user` → typed `RequestWithUser` interface |
| T2 | `middleware/authorize(...roles)` | BE Dev | 1h | Check `req.user.role` in allowed roles. Throw `AppError('Forbidden', 403)` |
| T3 | `middleware/checkSubscription(tier)` | BE Dev | 1h | Check `req.user.subscriptionTier` — `free | pro | enterprise`. Throw `AppError('Upgrade required', 402)` if insufficient |
| T4 | Apply to all protected routes | BE Dev | 0.5h | All routes except `/auth/*`, `/r/:token`, `/health` require `authenticate` |
| T5 | Tests | QA | 2h | Valid token, expired token 401, wrong role 403, insufficient tier 402 |

---

---

# EPIC 3 — Authorization & Subscription Guards

> **Goal**: Resource ownership, subscription tier gating for AI/premium features, rate limiting per tier.
> **Priority**: 🔴 P0 (Sprint 2)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 3.1.1 — Resource Ownership Middleware

> **As a** system, **I want to** ensure users can only modify their own resources, **so that** cross-user data access is impossible.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `checkOwnership(Model)` middleware factory | BE Dev | 2h | Load resource by `req.params.id` → compare `resource.userId` with `req.user.id` → throw `AppError(403)` if mismatch → admins bypass |
| T2 | Apply to resume, session, application routes | BE Dev | 1h | `router.put('/resumes/:id', authenticate, checkOwnership(Resume), updateResume)` |
| T3 | Tests | QA | 2h | Owner access, non-owner 403, admin bypass |

---

### Story 3.1.2 — Subscription Tier Feature Flags

> **As a** product, **I want to** gate premium features behind subscription tiers, **so that** monetization works correctly.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `FEATURE_LIMITS` config map | BE Dev | 1h | `{ free: { maxResumes: 3, aiCreditsPerMonth: 10, latexEditor: false, pdfUpload: false }, pro: { maxResumes: 20, aiCreditsPerMonth: 200, latexEditor: true, pdfUpload: true }, enterprise: { maxResumes: Infinity, ... } }` |
| T2 | `checkFeatureLimit(feature)` middleware | BE Dev | 2h | Look up `FEATURE_LIMITS[user.tier][feature]` → if limit is boolean false → `AppError(402)` → if numeric → check current usage vs limit |
| T3 | AI credits usage tracking | BE Dev | 2h | Increment `user.aiCreditsUsed` in Redis on each AI call. Monthly reset via CRON job. Check limit before each AI endpoint |
| T4 | BYOK (Bring Your Own Key) bypass | BE Dev | 1h | If `user.openaiApiKey` is set → skip credits check, use user's key for OpenAI calls |
| T5 | Tests | QA | 2h | Free tier AI limit 402, pro tier access, BYOK bypass |

---

---

# EPIC 4 — User & Profile API

> **Goal**: Full CRUD for user profiles, onboarding data, preferences, active sessions management.
> **Priority**: 🔴 P0 (Sprint 2)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 4.1.1 — User Profile CRUD

> **As a** user, **I want to** read and update my profile, **so that** my information stays current.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `GET /users/me` — profile with computed fields | BE Dev | 1h | Return user + `aiCreditsRemaining`, `resumeCount`, `subscriptionStatus` |
| T2 | `PATCH /users/me` — update name, timezone, bio | BE Dev | 1h | Zod schema, partial update, invalidate Redis user cache |
| T3 | `PATCH /users/me/password` — change password | BE Dev | 1h | Verify current password with `bcrypt.compare` → hash new → check history → save → invalidate all sessions |
| T4 | `DELETE /users/me` — soft delete + GDPR | BE Dev | 2h | Set `deletedAt`, anonymize PII (email, name), mark for hard-delete after 30 days via CRON |
| T5 | Tests | QA | 2h | Profile read, update, password change validation, delete + anonymization |

---

### Story 4.1.2 — Onboarding & Preferences API

> **As a** user, **I want to** save my career preferences, **so that** resume suggestions are personalized.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `PATCH /users/onboarding` | BE Dev | 1h | Schema: `{ currentRole, targetRole, industry, experienceLevel, techStack[] }`. Set `onboardingComplete: true` |
| T2 | `PATCH /users/preferences` | BE Dev | 1h | Schema: `{ theme, language, notifications{ taskAssigned, weeklyDigest, resumeViewed }, emailFrequency }`. Debounce-safe (idempotent) |
| T3 | `GET/PATCH /users/learning-path` | BE Dev | 1h | Array of `{ skill, addedAt, completedConcepts[], status }`. Upsert per skill |
| T4 | `PATCH /users/ai-key` | BE Dev | 1h | Encrypt `openaiApiKey` with AES-256 before saving. Never return raw key — return `{ hasCustomKey: true }` only |

---

### Story 4.1.3 — Active Sessions Management

> **As a** user, **I want to** see and revoke my active login sessions, **so that** I can secure my account.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Session metadata saved on login | BE Dev | 1h | Store `{ jti, userId, device(UA parse), ip, createdAt, lastActiveAt }` in Redis with 7d TTL |
| T2 | `GET /auth/sessions` | BE Dev | 0.5h | Return all active sessions for `req.user.id` from Redis |
| T3 | `DELETE /auth/sessions/:jti` | BE Dev | 1h | Blacklist the specific `jti` → session immediately invalidated |
| T4 | `DELETE /auth/sessions` — revoke all | BE Dev | 0.5h | Blacklist all `jti`s for user except current session |

---

---

# EPIC 5 — Resume CRUD & Share API

> **Goal**: Full resume lifecycle — create, clone, delete, version history, public share tokens.
> **Priority**: 🔴 P0 (Sprint 2–3)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

### Story 5.1.1 — Resume CRUD Endpoints

> **As a** user, **I want to** create, read, update, and delete resumes, **so that** I can manage multiple versions.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Resume Mongoose schema | BE Dev | 2h | `{ userId, name, templateId, data: ResumeData, shareToken, shareEnabled, viewCount, atsScore, latexSource, versions[], deletedAt, tags[] }` — compound index on `{ userId, deletedAt }` |
| T2 | `POST /resumes` — create | BE Dev | 1h | Default data structure, assign `templateId: 'ClassicPro'`, return full resume |
| T3 | `GET /resumes` — paginated list (QueryBuilder) | BE Dev | 1h | Filter by `tags`, `deletedAt: null`. Sort by `updatedAt`. Lean query for list view (exclude `latexSource`, `versions`) |
| T4 | `GET /resumes/:id` — full detail | BE Dev | 0.5h | Full resume with `latexSource` |
| T5 | `PATCH /resumes/:id` — update name/template/tags | BE Dev | 1h | Partial update, Zod validated. Invalidate resume cache |
| T6 | `DELETE /resumes/:id` — soft delete | BE Dev | 0.5h | Set `deletedAt`. Check 30-day hard-delete CRON. Return 204 |
| T7 | `POST /resumes/:id/clone` | BE Dev | 1h | Deep clone resume doc, suffix name with "(Copy)", assign new `_id`, clear `shareToken` |
| T8 | Tests | QA | 2h | CRUD cycle, soft delete, clone, list pagination, unauthorized access 403 |

---

### Story 5.1.2 — Version History

> **As a** user, **I want to** see and restore previous versions of my resume, **so that** I can undo major changes.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Auto-snapshot on save | BE Dev | 2h | `resumeSchema.pre('save')` hook → if `data` modified → push `{ snapshot: data, savedAt: now }` to `versions[]` (max 20, FIFO) |
| T2 | `GET /resumes/:id/versions` | BE Dev | 0.5h | Return `versions[]` list with `savedAt` timestamps |
| T3 | `POST /resumes/:id/versions/:index/restore` | BE Dev | 1h | Set `resume.data = resume.versions[index].snapshot`. Save (triggers new snapshot of current state) |
| T4 | Tests | QA | 1h | Auto-snapshot on save, restore, max 20 versions rolling |

---

### Story 5.1.3 — Public Share Link

> **As a** user, **I want to** generate a public link to my resume, **so that** recruiters can view it without a file attachment.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /resumes/:id/share` — generate token | BE Dev | 1h | `crypto.randomBytes(16).toString('hex')` → save as `shareToken`. Set `shareEnabled: true` |
| T2 | `GET /resumes/share/:token` — public access (no auth) | BE Dev | 1h | Find resume by `shareToken`, check `shareEnabled: true` → return `{ data, templateId }`. Increment `viewCount`. Emit `resume:viewed` event |
| T3 | `DELETE /resumes/:id/share` — revoke link | BE Dev | 0.5h | Set `shareEnabled: false`, clear `shareToken` |
| T4 | Rate limit share endpoint | BE Dev | 0.5h | 60 requests/hour per IP on public share endpoint |
| T5 | Tests | QA | 1h | Share link access, revoked link 404, view count increment |

---

---

# EPIC 6 — Resume Builder Data API

> **Goal**: Section-level PATCH endpoints for the builder, section reorder, and auto-save debounce endpoint optimized for frequent writes.
> **Priority**: 🔴 P0 (Sprint 3)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 6.1.1 — Section-Level PATCH APIs

> **As a** frontend, **I want to** update individual sections of a resume, **so that** only changed data is transmitted instead of the full document.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `PATCH /resumes/:id/sections/personal` | BE Dev | 1h | Validate `PersonalInfoDto` (Zod). `Resume.findByIdAndUpdate({ 'data.personalInfo': body })`. Return updated section |
| T2 | `PATCH /resumes/:id/sections/summary` | BE Dev | 0.5h | Max 600 chars validation. Update `data.summary` |
| T3 | `PATCH /resumes/:id/sections/experience` | BE Dev | 1h | Array of `ExperienceDto`. Validate each entry. Replace `data.experience` |
| T4 | `PATCH /resumes/:id/sections/education` | BE Dev | 0.5h | Array of `EducationDto`. Date validation: endYear ≥ startYear |
| T5 | `PATCH /resumes/:id/sections/skills` | BE Dev | 0.5h | Categorized skills object. Max 100 total skills |
| T6 | `PATCH /resumes/:id/sections/projects` | BE Dev | 0.5h | Array of `ProjectDto`. URL validation |
| T7 | `PATCH /resumes/:id/sections/certifications` | BE Dev | 0.5h | Array of `CertificationDto` |
| T8 | `PATCH /resumes/:id/sections/custom` | BE Dev | 0.5h | Free-form section `{ sectionName, entries[] }` |

---

### Story 6.1.2 — Auto-Save & Section Reorder

> **As a** frontend, **I want to** auto-save and reorder sections, **so that** the builder is persistent and flexible.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `PATCH /resumes/:id/autosave` — debounce-safe | BE Dev | 2h | Accepts full `data` object. Uses MongoDB `$set` instead of full document replace (atomic). Returns `{ savedAt }`. No version snapshot (auto-save is not a version) |
| T2 | `PATCH /resumes/:id/section-order` | BE Dev | 1h | Body: `{ sectionOrder: ['experience', 'education', 'skills', ...] }`. Save `sectionOrder` field on resume |
| T3 | Conflict detection on auto-save | BE Dev | 1h | Optimistic concurrency: `version` field (number). Client sends `version`, reject if `version` mismatch with 409 |
| T4 | Tests | QA | 1h | Auto-save, section reorder, version conflict 409 |

---

---

# EPIC 7 — Template Engine & Export (PDF / DOCX)

> **Goal**: Server-side PDF generation with Puppeteer (pixel-perfect), DOCX export with `docx` library, HTML template rendering per template ID.
> **Priority**: 🔴 P0 (Sprint 4–5)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**
> **Concepts**: Puppeteer, child_process, Streams, Worker Threads for heavy rendering

---

## Feature 7.1 — HTML Template Rendering

---

### Story 7.1.1 — Resume HTML Renderer

> **As a** backend, **I want to** render resume data to HTML using template definitions, **so that** Puppeteer can produce a PDF from it.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `services/templateEngine.ts` | BE Dev | 3h | `renderResumeHtml(data: ResumeData, templateId: string): string` — imports template definition, renders HTML string |
| T2 | Template definitions (10 templates) | BE Dev | 5h | Each template is a `(data: ResumeData) => string` function returning full HTML + inline CSS. Templates: ClassicPro, ModernBlue, MinimalWhite, CreativeGrid, TechStack, ElegantSide, BoldHeader, AcademicCV, StartupVibe, ExecutiveSuite |
| T3 | Template registry | BE Dev | 1h | `TEMPLATE_REGISTRY: Record<TemplateId, TemplateRenderer>` — import all templates, validate at startup |
| T4 | Handlebars-based sub-templates | BE Dev | 2h | Use Handlebars for reusable partials (ExperienceEntry, EducationEntry, SkillTag) within each template |

---

### Story 7.1.2 — Puppeteer PDF Generation

> **As a** user, **I want to** download a pixel-perfect PDF of my resume, **so that** it looks exactly like the preview.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Puppeteer browser pool | BE Dev | 3h | `services/puppeteerPool.ts` — maintain pool of 3 Chromium instances (reuse for performance). `BrowserPool.acquire()` / `release()` |
| T2 | `services/pdfExport.ts` | BE Dev | 2h | `page.setContent(html, { waitUntil: 'networkidle0' })` → `page.pdf({ format:'A4', printBackground:true, margin:{top:'10mm',...} })` → return Buffer |
| T3 | `GET /resumes/:id/export?format=pdf` | BE Dev | 1h | Render HTML → Puppeteer PDF → stream Buffer as `application/pdf`. Set `Content-Disposition: attachment; filename="resume.pdf"` |
| T4 | PDF caching in Redis | BE Dev | 2h | Cache rendered PDF with key `pdf:${resumeId}:${templateId}:${dataHash}`. TTL 5min. Invalidate on auto-save |
| T5 | Worker Thread for Puppeteer | BE Dev | 1h | Run Puppeteer in Worker Thread — never block event loop during PDF gen |
| T6 | Tests | QA | 2h | PDF download, cache hit/miss, worker thread, A4 format |

---

### Story 7.1.3 — DOCX Export

> **As a** user, **I want to** download my resume as a Word document, **so that** I can edit it in Microsoft Word.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `services/docxExport.ts` using `docx` library | BE Dev | 4h | Programmatically build DOCX: `Document`, `Paragraph`, `TextRun`, `Table` (two-column templates). Map all resume sections to DOCX elements |
| T2 | Template-aware DOCX builder | BE Dev | 2h | Different DOCX layouts per template type (single-col vs two-col) |
| T3 | `GET /resumes/:id/export?format=docx` | BE Dev | 0.5h | `Packer.toBuffer(doc)` → stream as `application/vnd.openxmlformats-officedocument.wordprocessingml.document` |
| T4 | Font embedding | BE Dev | 1h | Embed common fonts (Calibri, Times New Roman, Arial) in DOCX for consistent rendering |

---

### Story 7.1.4 — Public Share Export

> **As a** public user, **I want to** download a resume from a shared link, **so that** I can save it without logging in.

**Story Points**: 3 | **Estimate**: 1.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `GET /resumes/share/:token/export?format=pdf` | BE Dev | 1h | Public endpoint — find by share token → render PDF → stream |
| T2 | Rate limit public export | BE Dev | 0.5h | 10 PDF downloads per hour per IP on public endpoints |
| T3 | Download tracking | BE Dev | 0.5h | Increment `downloadCount` on resume document |

---

---

# EPIC 8 — Resume Scoring Engine

> **Goal**: ATS rule-based scoring, job description keyword matching, section-level scoring, score history persistence, industry-specific rules.
> **Priority**: 🔴 P0 (Sprint 5–6)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**

---

## Feature 8.1 — ATS Scoring Rules

---

### Story 8.1.1 — Core Scoring Engine

> **As a** system, **I want to** compute an ATS score from a resume, **so that** users know how well their resume performs.

**Story Points**: 8 | **Estimate**: 1 week

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `services/scoringEngine.ts` | BE Dev | 4h | `scoreResume(data: ResumeData, options: ScoringOptions): ScoreResult` — pure function, no side effects |
| T2 | Section weight config | BE Dev | 1h | `SECTION_WEIGHTS = { personalInfo: 15, summary: 20, experience: 30, skills: 20, education: 10, other: 5 }` — configurable per industry |
| T3 | Contact info rules | BE Dev | 1h | Checks: email present (5pts), phone present (3pts), LinkedIn URL (3pts), GitHub/Portfolio (2pts each), no photo in US/UK resumes (flag) |
| T4 | Summary scoring rules | BE Dev | 1h | Length check (150–400 chars = full marks), keyword density, starts with role title, no first-person pronouns ("I", "my") |
| T5 | Experience scoring rules | BE Dev | 2h | Min 3 experiences (for 3+ yr roles), each bullet starts with action verb (regex: 200-verb list), quantified achievements (regex for numbers/%), no gaps > 6 months (warn) |
| T6 | Skills scoring rules | BE Dev | 1h | Min 5 skills, no generic skills (MS Office, etc. penalize), skills match experience (overlap check), skill density |
| T7 | Issue severity classification | BE Dev | 1h | Each failed rule → `{ severity: 'critical'|'warning'|'suggestion', section, message, points }` |
| T8 | Tests | QA | 3h | Score computation per rule, edge cases (empty sections, max values), total score = sum of section scores |

---

### Story 8.1.2 — JD Keyword Match Scoring

> **As a** user, **I want to** match my resume against a job description, **so that** I know how well I fit the role.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /score/jd-match` | BE Dev | 1h | Body: `{ resumeId, jobDescription }`. Extract keywords from JD |
| T2 | JD keyword extraction | BE Dev | 3h | Tokenize JD → remove stop words → TF-IDF weighting for important terms → extract tech skills (regex + known skills list) → required qualifications (regex for "required", "must have") |
| T3 | Resume keyword extraction | BE Dev | 2h | Same pipeline on resume text (flatten all text fields) |
| T4 | Match scoring | BE Dev | 1h | `matchScore = (matchedKeywords.length / requiredKeywords.length) * 100` |
| T5 | Response: matched / missing keywords | BE Dev | 1h | `{ matchScore, matchedKeywords: [], missingKeywords: [], suggestedAdditions: [] }` |
| T6 | Tests | QA | 2h | Keyword extraction accuracy, score calculation, empty JD handling |

---

### Story 8.1.3 — Score History & Analytics

> **As a** user, **I want to** see my score history over time, **so that** I can track improvement.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ScoreHistory` MongoDB collection | BE Dev | 1h | `{ resumeId, userId, score, sections, issues, industry, snapshotAt }` — TTL index: keep last 90 days |
| T2 | `POST /score/analyze` — analyze + save history | BE Dev | 1h | Run `scoreResume` → save to `ScoreHistory` → update `resume.atsScore` → emit `resume:score-updated` |
| T3 | `GET /score/history/:resumeId` | BE Dev | 1h | Return last 10 snapshots, sorted by date. Aggregate min/max/avg score |
| T4 | Industry-specific scoring | BE Dev | 2h | `INDUSTRY_RULES` map: Tech (weight skills higher), Finance (quantified achievements critical), Design (portfolio URL critical). Switch active ruleset per `options.industry` |
| T5 | Tests | QA | 1h | History save, retrieve, industry rule switch |

---

---

# EPIC 9 — LaTeX Service

> **Goal**: Convert resume JSON → LaTeX source, compile LaTeX → PDF via `pdflatex`, convert LaTeX → DOCX via `pandoc`, manage multiple LaTeX templates.
> **Priority**: 🟡 P1 (Sprint 6–7)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**
> **Concepts**: child_process, Streams, Worker Threads, temp file management, security (LaTeX injection)

---

## Feature 9.1 — Resume → LaTeX Conversion

---

### Story 9.1.1 — LaTeX Generator Service

> **As a** system, **I want to** convert resume JSON to LaTeX source, **so that** users can edit their resume in LaTeX.

**Story Points**: 8 | **Estimate**: 1 week

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `services/latexGenerator.ts` | BE Dev | 3h | `generateLatex(data: ResumeData, template: LatexTemplate): string` — pure function |
| T2 | LaTeX template: Jake's Resume | BE Dev | 3h | Most popular CS resume template. Full implementation: header, experience with bullet env, education, skills columns |
| T3 | LaTeX template: AltaCV | BE Dev | 3h | Two-column layout. Sidebar: contact + skills. Main: experience timeline |
| T4 | LaTeX template: Awesome-CV | BE Dev | 3h | Modern color-accent template. Section dividers, colored header |
| T5 | LaTeX template: Academic CV | BE Dev | 2h | Long-form, publications section, awards, references |
| T6 | LaTeX special char escaping | BE Dev | 2h | Escape all user input: `&` → `\&`, `%` → `\%`, `$` → `\$`, `#` → `\#`, `_` → `\_`, `{` → `\{`, `}` → `\}`. **Critical security step** |
| T7 | `GET /resumes/:id/latex` | BE Dev | 0.5h | Generate LaTeX from current resume data. Cache in Redis (key: `latex:${resumeId}:${template}:${dataHash}`, TTL 10min) |
| T8 | `PATCH /resumes/:id/latex` — save custom LaTeX | BE Dev | 0.5h | User edits in Monaco → save `latexSource` to resume document |

---

### Story 9.1.2 — LaTeX Compilation Service (pdflatex)

> **As a** user, **I want to** compile LaTeX to PDF on the server, **so that** my edited LaTeX produces a downloadable PDF.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /latex/compile` | BE Dev | 1h | Body: `{ latexSource }`. Dispatches to Worker Thread. Returns `{ pdfBase64 }` or `{ errors: [{line, message}] }` |
| T2 | Worker Thread: `latexCompileWorker.ts` | BE Dev | 3h | Write LaTeX to temp file in `/tmp/resume-${uuid}/` → `child_process.spawn('pdflatex', ['-interaction=nonstopmode', 'resume.tex'], { cwd: tmpDir })` → pipe stdout → read output PDF → cleanup temp dir |
| T3 | Error parsing from pdflatex output | BE Dev | 2h | Regex parse pdflatex stdout: `! LaTeX Error: ...` / `l.XX ...` → extract `{ lineNumber, errorMessage }` array |
| T4 | Compilation timeout | BE Dev | 1h | Kill pdflatex process after 30s — `AbortController` or `setTimeout` + `child.kill()` |
| T5 | Temp dir cleanup | BE Dev | 1h | `finally` block removes temp dir. `CRON` cleans up any orphaned temp dirs older than 1h |
| T6 | LaTeX injection prevention | BE Dev | 2h | Sanitize all user-provided LaTeX content: disallow `\write18`, `\input{/etc}`, `\include`, `\usepackage{shellesc}` — blocklist check before compilation |
| T7 | Tests | QA | 2h | Valid LaTeX compiles, error parsing, injection attempt blocked, timeout handling |

---

### Story 9.1.3 — LaTeX → DOCX via Pandoc

> **As a** user, **I want to** convert my LaTeX resume to DOCX, **so that** I can open it in Word.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `GET /resumes/:id/latex/export/docx` | BE Dev | 1h | Fetch `latexSource` → spawn `pandoc resume.tex -o resume.docx` → stream DOCX |
| T2 | Pandoc child_process wrapper | BE Dev | 2h | `services/pandocConverter.ts` — spawn pandoc, pipe stdin (LaTeX string), collect stdout (DOCX buffer), error handling |
| T3 | Fallback if pandoc not available | BE Dev | 1h | If pandoc spawn fails → fall back to `docx` library DOCX generation from resume JSON |

---

### Story 9.1.4 — LaTeX Template Switching

> **As a** user, **I want to** switch LaTeX templates and regenerate my LaTeX, **so that** I can choose the best LaTeX style.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `GET /resumes/:id/latex?template=altacv` | BE Dev | 1h | `template` query param → `generateLatex(data, template)` |
| T2 | Available templates endpoint | BE Dev | 0.5h | `GET /latex/templates` → returns list of `{ id, name, description, preview_url }` |
| T3 | LaTeX template preview images | BE Dev | 2h | Pre-generated preview images for each template stored in S3 |

---

---

# EPIC 10 — AI Integration (OpenAI)

> **Goal**: Streaming OpenAI integration for chat, bullet optimizer, section rewriter, summary generator, skill suggester, and JD-tailoring.
> **Priority**: 🟡 P1 (Sprint 7–8)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**
> **Concepts**: OpenAI streaming, SSE, credit tracking, BYOK, prompt engineering, context injection

---

## Feature 10.1 — AI Chat with Resume Context

---

### Story 10.1.1 — Streaming AI Chat Endpoint

> **As a** user, **I want to** chat with an AI assistant that knows my resume, **so that** I get personalized resume advice.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /ai/chat` — streaming SSE endpoint | BE Dev | 2h | `res.setHeader('Content-Type', 'text/event-stream')`. Stream `openai.chat.completions.create({ stream: true })` tokens as `data: {"token":"..."}` SSE events |
| T2 | Resume context injection | BE Dev | 2h | System prompt: `You are a resume expert assistant. The user's resume is: ${JSON.stringify(resumeData)}`. Truncate to fit within context window (4096 tokens max for context) |
| T3 | `getOpenAIClient(user)` factory | BE Dev | 1h | If `user.openaiApiKey` → use BYOK key (decrypt AES). Else → use platform key + deduct credits |
| T4 | Chat history support | BE Dev | 1h | Accept `messages: ChatMessage[]` in body. Last 10 messages sent as conversation history |
| T5 | Credit deduction per token | BE Dev | 1h | After stream ends → count `usage.total_tokens` from final chunk → `user.aiCreditsUsed += Math.ceil(tokens / 1000)` |
| T6 | Tests | QA | 2h | SSE stream mock, credit deduction, BYOK routing, context injection |

---

## Feature 10.2 — Resume AI Operations

---

### Story 10.2.1 — Bullet Point Optimizer

> **As a** user, **I want to** get AI-improved bullet points, **so that** my experience descriptions are stronger.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /ai/improve-bullet` | BE Dev | 1h | Body: `{ bullet, context: { role, company, industry } }`. Returns 3 improved variants |
| T2 | Prompt engineering | BE Dev | 2h | System: "You are a resume expert. Generate 3 improved versions of this bullet: more quantified, more concise, higher impact. Output as JSON array". Temperature: 0.7 |
| T3 | Streaming 3 variants | BE Dev | 1h | Stream variants progressively — each variant prefixed with `data: {"variant":1,"text":"..."}` |
| T4 | Tests | QA | 1h | Bullet improvement, JSON parse from stream, credit deduction |

---

### Story 10.2.2 — Section Rewriter

> **As a** user, **I want to** rewrite an entire resume section with AI, **so that** it's professionally polished.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /ai/rewrite-section` | BE Dev | 1h | Body: `{ sectionType, content, tone: 'professional'|'concise'|'creative'|'technical', targetRole }`. Stream response |
| T2 | Section-specific prompts | BE Dev | 2h | Different system prompts per section: summary (focus on value prop), experience (action verbs + quantification), skills (ATS-friendly grouping) |
| T3 | Diff generation | BE Dev | 1h | After rewrite → compute word-level diff between original and rewritten → return `{ original, rewritten, diff: [{type, text}] }` |

---

### Story 10.2.3 — AI Summary Generator

> **As a** user, **I want to** generate a professional summary from my experience, **so that** I have a strong opening statement.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /ai/generate-summary` | BE Dev | 1h | Body: `{ experience[], skills[], targetRole, tone }`. Generates 150–400 char professional summary |
| T2 | Stream summary generation | BE Dev | 0.5h | SSE stream — typewriter effect on frontend |
| T3 | Multiple length variants | BE Dev | 0.5h | Optional param `length: 'short'|'medium'|'long'` — short (100 words), medium (150 words), long (250 words) |

---

### Story 10.2.4 — Skill Suggester

> **As a** user, **I want to** get AI-suggested skills based on my experience, **so that** I don't miss important keywords.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /ai/suggest-skills` | BE Dev | 1h | Body: `{ experience[], currentSkills[], targetRole }`. Returns `{ suggested: [{skill, reason, demandScore}] }` |
| T2 | Dedup against existing skills | BE Dev | 0.5h | Filter out skills already in `currentSkills` array |
| T3 | Demand score enrichment | BE Dev | 1h | Cross-reference suggested skills against `SkillDemand` MongoDB collection (pre-populated from job market data) |

---

### Story 10.2.5 — ATS Auto-Improve

> **As a** user, **I want to** auto-improve low-scoring sections with AI, **so that** my ATS score increases quickly.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /ai/auto-improve` | BE Dev | 2h | Body: `{ resumeId, issues[] }`. For each critical issue → call appropriate AI endpoint → collect improvements → return structured changes |
| T2 | Estimated score delta | BE Dev | 1h | After generating improvements → `scoreResume(improvedData)` → return `{ currentScore, estimatedScore, improvements[] }` |
| T3 | Tests | QA | 1h | Auto-improve flow, score delta calculation |

---

### Story 10.2.6 — LinkedIn Profile Import

> **As a** user, **I want to** import my LinkedIn profile to auto-fill my resume, **so that** I save hours of manual entry.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /ai/import-linkedin` | BE Dev | 1h | Body: `{ profileText }` (user pastes exported LinkedIn text or summary). AI extracts structured `ResumeData` |
| T2 | LinkedIn → ResumeData extraction prompt | BE Dev | 2h | System: "Extract resume data from this LinkedIn profile. Return valid JSON matching the ResumeData schema: ...". JSON mode enabled (`response_format: { type: 'json_object' }`) |
| T3 | Confidence scoring | BE Dev | 1h | For each extracted field → include `confidence: 0–1` in response. Low confidence fields flagged for user review |
| T4 | Zod validation of AI output | BE Dev | 0.5h | Parse AI JSON response with `ResumeDataSchema.safeParse()` — handle partial data |

---

---

# EPIC 11 — PDF Upload & Parse Pipeline

> **Goal**: Accept PDF upload, extract text with pdf-parse, use AI to structure the data, async job tracking, confidence scoring.
> **Priority**: 🟡 P1 (Sprint 8–9)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**
> **Concepts**: Multer, BullMQ async jobs, Worker Threads, pdf-parse, OpenAI JSON extraction

---

### Story 11.1.1 — PDF Upload Endpoint & Job Queue

> **As a** user, **I want to** upload my PDF resume and get structured data extracted, **so that** I don't have to re-enter all my information.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /resumes/import/pdf` — Multer upload | BE Dev | 1h | `multer({ storage: memoryStorage(), limits: { fileSize: 5MB }, fileFilter: PDF only })`. Validate MIME: `application/pdf` |
| T2 | Upload to S3 first | BE Dev | 1h | Store uploaded PDF in S3 (`uploads/pdf/${userId}/${uuid}.pdf`) — process from S3, not memory |
| T3 | Add to BullMQ `pdfParseQueue` | BE Dev | 1h | `{ jobId: uuid, userId, s3Key, resumeId? }` → return `{ jobId }` to client immediately (202 Accepted) |
| T4 | `GET /jobs/:jobId/status` — polling endpoint | BE Dev | 1h | Query BullMQ job status: `waiting | active | completed | failed` → if completed return result |
| T5 | Redis job result cache | BE Dev | 1h | Store job result in Redis for 30min after completion — polling endpoint reads from Redis |
| T6 | Tests | QA | 2h | PDF upload, non-PDF rejection, job creation, status polling |

---

### Story 11.1.2 — PDF Text Extraction Worker

> **As a** system, **I want to** extract text from uploaded PDFs, **so that** AI can structure the resume data.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | BullMQ processor: `pdfParseProcessor.ts` | BE Dev | 2h | Worker subscribes to `pdfParseQueue` → download PDF from S3 → run in Worker Thread |
| T2 | Worker Thread: `pdfParseWorker.ts` | BE Dev | 2h | `pdf-parse(pdfBuffer)` → extract text → basic section detection (regex headers: "EXPERIENCE", "EDUCATION") → post `{ rawText, sections }` |
| T3 | AI extraction from raw text | BE Dev | 3h | `POST` to OpenAI with: "Extract resume data as JSON from: ${rawText}". Full `ResumeData` JSON schema provided in system prompt. `json_object` response mode |
| T4 | Confidence scoring per field | BE Dev | 1h | Prompt: "For each field, include a confidence score (0–1)". Post-process: low confidence fields flagged |
| T5 | LaTeX generation from parsed data | BE Dev | 1h | After extraction → `generateLatex(parsedData, 'jake')` → include in result |
| T6 | Cleanup S3 PDF after 7 days | BE Dev | 0.5h | Set S3 object lifecycle rule: expire `uploads/pdf/` prefix after 7 days |
| T7 | Tests | QA | 2h | Text extraction, AI parse mock, confidence scores, LaTeX generation |

---

### Story 11.1.3 — Import Review & Apply

> **As a** user, **I want to** review parsed data before it applies to my resume, **so that** errors don't overwrite my existing data.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /resumes/import/apply` | BE Dev | 1h | Body: `{ resumeId, parsedData, selectedSections[] }`. Merge selected sections into resume |
| T2 | Section-level merge strategy | BE Dev | 1h | `overwrite`: replace section entirely. `merge`: append new entries, keep existing. Param per section |
| T3 | `POST /resumes/import/new` | BE Dev | 1h | Create brand new resume from parsed data instead of merging |

---

---

# EPIC 12 — Upskilling & Career API

> **Goal**: Skill gap analysis, concept cards CRUD, interview questions bank, mock interview session management and AI evaluation.
> **Priority**: 🟡 P1 (Sprint 9–11)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**

---

## Feature 12.1 — Skill Gap Analysis

---

### Story 12.1.1 — Skill Gap Computation

> **As a** user, **I want to** see the gap between my current skills and my target role's requirements, **so that** I know what to learn.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `RoleRequirements` MongoDB collection | BE Dev | 2h | Pre-populated: `{ role, industry, requiredSkills: [{skill, demandScore, weight}], niceToHaveSkills[] }` — seeded with 50+ common roles |
| T2 | `SkillDemand` collection | BE Dev | 1h | `{ skill, demandScore, avgSalaryImpact, topCompanies[], trend: 'rising'|'stable'|'declining' }` — updated monthly |
| T3 | `GET /upskill/gap-analysis` | BE Dev | 2h | Params: `{ targetRole, industry }`. Load `RoleRequirements` → compare against `user.resume.skills` → compute `{ missingSkills[], matchingSkills[], demandScores }` |
| T4 | Personalized skill ranking | BE Dev | 1h | Sort missing skills by: `(demandScore * 0.6) + (1/difficultyScore * 0.4)` — surface highest-value, easiest-to-learn skills first |
| T5 | Tests | QA | 1h | Gap computation, skill ranking, empty skill set |

---

## Feature 12.2 — Concept Cards API

---

### Story 12.2.1 — Concept Cards CRUD & Search

> **As a** user, **I want to** access bite-sized concept explanations, **so that** I can study skills directly in the app.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ConceptCard` MongoDB schema | BE Dev | 1h | `{ skill, title, content (Markdown), codeExamples[], difficulty, readTimeMinutes, tags[], furtherReadingLinks[], authorId }` |
| T2 | `GET /upskill/concepts` | BE Dev | 1h | QueryBuilder: filter by `skill`, `tags`, `difficulty`. Sort by `readTimeMinutes`. Paginated |
| T3 | `GET /upskill/concepts/:id` | BE Dev | 0.5h | Full card with Markdown content. Cache in Redis 24h (ISR equivalent) |
| T4 | `POST/PATCH/DELETE /upskill/concepts` (admin only) | BE Dev | 1h | Admin-only CRUD. Role check: `authorize('admin')` |

---

## Feature 12.3 — Interview Questions Bank

---

### Story 12.3.1 — Questions API & Progress Tracking

> **As a** user, **I want to** access interview questions and track my practice progress, **so that** I'm prepared for technical interviews.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `InterviewQuestion` schema | BE Dev | 1h | `{ skill, category: 'conceptual'|'coding'|'behavioral'|'system-design', question, hint, sampleAnswer, difficulty, tags[] }` |
| T2 | `GET /upskill/questions` | BE Dev | 0.5h | Filter by `skill`, `category`, `difficulty`. Paginated |
| T3 | `POST /upskill/questions/:id/status` | BE Dev | 1h | Body: `{ status: 'not-tried'|'practicing'|'confident' }`. Upsert `UserQuestionStatus` document |
| T4 | `POST /upskill/questions/:id/evaluate` | BE Dev | 1h | Body: `{ answer }`. AI evaluates answer: `{ score: 1-10, strengths[], improvements[], betterAnswer }`. Stream response |

---

## Feature 12.4 — Mock Interview Sessions

---

### Story 12.4.1 — Mock Session CRUD & AI Evaluation

> **As a** user, **I want to** run timed mock interview sessions with AI evaluation, **so that** I can practice under realistic conditions.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `MockSession` schema | BE Dev | 2h | `{ userId, category, difficulty, duration, questions[{ questionId, userAnswer, aiEvaluation:{ score, feedback }, timeTaken }], overallScore, status: 'in-progress'|'completed', startedAt, completedAt }` |
| T2 | `POST /mock-sessions` — create session | BE Dev | 1h | Select N questions matching `{ category, difficulty }`. Shuffle. Save session |
| T3 | `PATCH /mock-sessions/:id/answers/:questionIndex` — submit answer | BE Dev | 1h | Save `userAnswer`, trigger AI evaluation job (BullMQ `aiEvalQueue`), return job ID |
| T4 | AI evaluation processor | BE Dev | 3h | BullMQ worker: OpenAI `POST /ai/evaluate-answer` with question + user answer → returns `{ score, feedback, betterAnswer }` → update session document |
| T5 | `POST /mock-sessions/:id/complete` — finish session | BE Dev | 1h | Calculate `overallScore = avg(question.aiEvaluation.score)`. Compute weak areas. Save. Emit `mockSession:completed` event |
| T6 | `GET /mock-sessions` — history | BE Dev | 0.5h | List completed sessions with score + category + date |
| T7 | Tests | QA | 2h | Session creation, answer submit, AI eval job, complete + score calculation |

---

### Story 12.4.2 — AI Question Generation (Dynamic)

> **As a** user, **I want to** get AI-generated follow-up questions based on my answers, **so that** the interview feels realistic.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /mock-sessions/:id/next-question` | BE Dev | 2h | If previous answer was weak → generate follow-up question on same topic. Else → advance to next in question bank |
| T2 | Adaptive difficulty | BE Dev | 2h | Track running score → if score < 5 → reduce difficulty of next question. If > 8 → increase difficulty |
| T3 | Post-session learning plan | BE Dev | 2h | After session complete → identify weak topics → `GET /upskill/concepts?skill=weakTopics` → return `{ learningPlan: [{ topic, conceptCards[], questions[] }] }` |

---

---

# EPIC 13 — File Storage (Cloudinary / S3)

> **Goal**: Avatar upload to Cloudinary, resume PDF/DOCX export to S3, presigned URLs, lifecycle policies.
> **Priority**: 🔴 P0 (Sprint 3–4)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 13.1.1 — Avatar Upload (Cloudinary)

> **As a** user, **I want to** upload my profile photo, **so that** teammates recognize me.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /files/avatar` | BE Dev | 1h | Multer `memoryStorage` → validate: image type (JPEG/PNG/WebP), max 2MB |
| T2 | Cloudinary upload stream | BE Dev | 2h | `cloudinary.uploader.upload_stream(options, callback)` — pipe `req.file.buffer` to stream. Options: `folder: 'avatars'`, `transformation: [{ width: 400, height: 400, crop: 'fill', gravity: 'face' }]` |
| T3 | Delete old avatar | BE Dev | 1h | If user has existing `avatarPublicId` → `cloudinary.uploader.destroy(publicId)` before uploading new |
| T4 | Update user `avatarUrl` | BE Dev | 0.5h | `PATCH /users/me` with new Cloudinary URL. Invalidate user Redis cache |

---

### Story 13.1.2 — S3 for PDF/DOCX Exports & Uploads

> **As a** system, **I want to** store generated PDFs and uploaded files in S3, **so that** they're durable and accessible.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `services/s3Service.ts` | BE Dev | 2h | `uploadBuffer(key, buffer, mimeType)`, `getPresignedUrl(key, expiry)`, `deleteObject(key)`, `downloadBuffer(key)` |
| T2 | Store exported PDFs in S3 | BE Dev | 1h | After Puppeteer generates PDF → `s3.uploadBuffer('exports/pdf/${userId}/${resumeId}.pdf', buffer)` → return presigned URL (15min) |
| T3 | S3 lifecycle policies | BE Dev | 1h | `exports/` prefix: expire after 7 days. `uploads/pdf/` prefix: expire after 7 days |
| T4 | Presigned URL for large downloads | BE Dev | 1h | For DOCX: generate presigned GET URL (valid 15min) → return URL to frontend → client downloads directly from S3 (bypass server) |
| T5 | Tests | QA | 1h | Upload mock, presigned URL generation, lifecycle policy config |

---

---

# EPIC 14 — Redis Caching & BullMQ Queues

> **Goal**: Cache middleware for resume/user reads, cache invalidation, BullMQ for email, PDF export, AI eval, PDF parse queues.
> **Priority**: 🔴 P0 (Sprint 4–5)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

### Story 14.1.1 — Redis Cache Middleware

> **As a** developer, **I want to** cache frequent read endpoints, **so that** DB load is minimized.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `middleware/cache.ts` — generic cache middleware | BE Dev | 2h | `cache(ttlSeconds)` — key: `${req.method}:${req.path}:${req.user.id}:${stableStringify(req.query)}`. Check Redis first → if hit → `res.json(cached)`. Else → `res.json = (data) => { redis.setEx(key, ttl, JSON.stringify(data)); originalJson(data) }` |
| T2 | Apply to frequent reads | BE Dev | 1h | `GET /resumes` (TTL 60s), `GET /resumes/:id` (TTL 30s), `GET /users/me` (TTL 120s), `GET /upskill/concepts` (TTL 3600s) |
| T3 | `invalidatePattern(pattern)` utility | BE Dev | 1h | `redis.keys(pattern)` → `pipeline.del()` each. Used after mutations to clear stale cache |
| T4 | Cache invalidation on resume save | BE Dev | 1h | After `PATCH /resumes/:id/autosave` → `invalidatePattern(`GET:*/resumes/${resumeId}*`)` |
| T5 | Tests | QA | 1h | Cache hit/miss, invalidation after update, TTL behavior |

---

### Story 14.1.2 — BullMQ Queue Definitions

> **As a** developer, **I want to** process heavy tasks asynchronously via queues, **so that** API responses are fast.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `jobs/emailQueue.ts` | BE Dev | 1h | BullMQ queue + processor. `{ type, to, templateData }`. Retry 3x. Dead letter on failure |
| T2 | `jobs/pdfExportQueue.ts` | BE Dev | 1h | `{ resumeId, userId, templateId }`. Puppeteer in worker. Result saved to S3. Notify user via SSE when done |
| T3 | `jobs/pdfParseQueue.ts` | BE Dev | 1h | `{ jobId, userId, s3Key }`. pdf-parse → AI extraction → result in Redis |
| T4 | `jobs/aiEvalQueue.ts` | BE Dev | 1h | `{ sessionId, questionIndex, answer }`. AI evaluation → update mock session |
| T5 | BullMQ Board (Bull Board UI) | BE Dev | 1h | Mount `@bull-board/express` at `/admin/queues` (admin auth required) — monitor queue health |
| T6 | Dead letter queue handler | BE Dev | 1h | On job failure after max retries → move to `deadLetterQueue` → alert via Slack/email (Winston) |
| T7 | Tests | QA | 1h | Queue job creation, retry behavior, dead letter |

---

### Story 14.1.3 — Rate Limiting Per User & Tier

> **As a** system, **I want to** rate-limit API endpoints per user and subscription tier, **so that** no single user can abuse the system.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `express-rate-limit` with Redis store | BE Dev | 1h | `RedisStore` (`rate-limit-redis`) for distributed rate limiting across cluster workers |
| T2 | Tiered rate limits | BE Dev | 1h | Global API: Free=100 req/15min, Pro=500 req/15min, Enterprise=2000/15min. AI endpoints: Free=10/hour, Pro=100/hour |
| T3 | Per-endpoint overrides | BE Dev | 0.5h | PDF export: 10/hour all tiers. LaTeX compile: 30/hour. Login: 10/15min |
| T4 | Rate limit headers | BE Dev | 0.5h | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` in response headers |

---

---

# EPIC 15 — Email Service

> **Goal**: Templated transactional emails via BullMQ queue, Handlebars templates, Nodemailer + SES.
> **Priority**: 🟡 P1 (Sprint 5)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 15.1.1 — Email Template Engine & Queue Processor

> **As a** system, **I want to** send templated transactional emails asynchronously, **so that** auth and notifications work reliably.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `services/emailService.ts` | BE Dev | 2h | `sendEmail({ type, to, data })` → push to `emailQueue`. `types`: `verify-email`, `reset-password`, `invite`, `resume-viewed`, `weekly-digest` |
| T2 | Handlebars templates | BE Dev | 3h | One `.hbs` file per email type. Responsive HTML. Brand-consistent design. Variables: `{{ userName }}`, `{{ verifyLink }}`, etc. |
| T3 | Nodemailer + AWS SES transport | BE Dev | 1h | `nodemailer.createTransport` with SES config for prod, Ethereal (fake SMTP) for dev/test |
| T4 | BullMQ email processor | BE Dev | 1h | Process email jobs: compile Handlebars → `transporter.sendMail()`. Retry 3x on failure. Log sent emails |
| T5 | Unsubscribe link in all emails | BE Dev | 1h | Append `?unsubscribe=true&token=...` to all marketing emails. `GET /users/unsubscribe/:token` sets `emailOptOut: true` |
| T6 | Tests | QA | 1h | Email queue push, template compilation, unsubscribe flow |

---

### Story 15.1.2 — Weekly Upskilling Digest

> **As a** user, **I want to** receive a weekly email digest with upskilling suggestions, **so that** I stay motivated to learn.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Weekly CRON job (Sunday 9AM UTC) | BE Dev | 1h | BullMQ `cron` scheduler: `{ repeat: { cron: '0 9 * * 0' } }` → trigger `weeklyDigestJob` |
| T2 | Digest content generation | BE Dev | 2h | Per user: top 3 missing skills from gap analysis → top concept card per skill → 1 interview question to try → mock session streak |
| T3 | Respect email preferences | BE Dev | 0.5h | Only send if `user.preferences.weeklyDigest: true` and `!user.emailOptOut` |

---

---

# EPIC 16 — Payments & Subscription (Stripe)

> **Goal**: Stripe Checkout for Pro/Enterprise plans, webhook-based subscription management, AI credit top-up, invoice history.
> **Priority**: 🟡 P1 (Sprint 11–12)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

### Story 16.1.1 — Stripe Checkout & Subscription

> **As a** user, **I want to** upgrade to Pro with Stripe, **so that** I can access premium features.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /payments/create-checkout-session` | BE Dev | 2h | Create Stripe `checkout.session` with `price_id`, `customer_email`, `metadata: { userId }`, success/cancel URLs |
| T2 | Stripe webhook `POST /webhooks/stripe` | BE Dev | 3h | Verify `stripe-signature` header. Handle: `checkout.session.completed` → set `subscriptionTier: 'pro'`, `customer.subscription.deleted` → downgrade to free, `invoice.payment_failed` → send email |
| T3 | Idempotency on webhook | BE Dev | 1h | Store processed `eventId` in Redis (TTL 48h). Check before processing → prevent double-processing on Stripe retries |
| T4 | `GET /payments/portal` | BE Dev | 1h | Stripe Customer Portal session → return URL for self-serve billing management (upgrade/downgrade/cancel) |
| T5 | AI Credit top-up | BE Dev | 1h | Separate Stripe payment for `credits_pack_100` / `credits_pack_500`. On `checkout.session.completed` → `user.aiCreditsUsed -= creditsAdded` |

---

### Story 16.1.2 — Billing History & Invoice API

> **As a** user, **I want to** see my billing history, **so that** I can track my payments.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `GET /payments/invoices` | BE Dev | 1h | `stripe.invoices.list({ customer: user.stripeCustomerId })` → return formatted invoice list |
| T2 | `GET /payments/invoices/:id/download` | BE Dev | 1h | Redirect to Stripe-hosted invoice PDF URL |
| T3 | Subscription status endpoint | BE Dev | 1h | `GET /payments/subscription` → `{ tier, status, currentPeriodEnd, cancelAtPeriodEnd, aiCreditsRemaining }` |

---

### Story 16.1.3 — Grace Period & Downgrade Handling

> **As a** system, **I want to** gracefully handle subscription cancellations, **so that** users don't lose data immediately.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `cancelAtPeriodEnd` flow | BE Dev | 1h | Stripe webhook `customer.subscription.updated` with `cancel_at_period_end: true` → show "Subscription ends on XX/XX/XXXX" in UI |
| T2 | Feature access during grace period | BE Dev | 1h | Until `currentPeriodEnd` → maintain `pro` access even after cancel |
| T3 | Downgrade data cleanup | BE Dev | 2h | After downgrade: if `resumeCount > 3` → archive excess resumes (not delete) → user sees "3 active, X archived" |
| T4 | Win-back email | BE Dev | 1h | On `customer.subscription.deleted` → queue "We miss you" email with discount offer code |

---

---

# EPIC 17 — Analytics & Tracking

> **Goal**: Resume view tracking, export tracking, score history, mock session analytics, platform-level aggregates.
> **Priority**: 🟢 P2 (Sprint 12)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 17.1.1 — Resume View & Export Analytics

> **As a** user, **I want to** see how many people viewed my shared resume, **so that** I can measure recruiter interest.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ResumeView` MongoDB collection | BE Dev | 1h | `{ resumeId, userId, viewerIp (hashed), userAgent, country (GeoIP), device, viewedAt }`. TTL index: keep 90 days |
| T2 | Track view on share page access | BE Dev | 0.5h | `resumeEmitter.on('resume:viewed', async (data) => ResumeView.create(data))` |
| T3 | `GET /resumes/:id/analytics` | BE Dev | 2h | Aggregate: `totalViews`, `uniqueViews` (distinct IPs), `viewsByDay[]` (last 30 days), `deviceBreakdown`, `countryBreakdown` |
| T4 | View spike notification | BE Dev | 1h | Check: if views in last 24h > 3 → emit `user:resume-spike` → push notification / in-app notification |
| T5 | Tests | QA | 1h | View tracking, aggregation, spike detection |

---

---

# EPIC 18 — Error Handling & Logging

> **Goal**: `AppError` class, global error handler covering all error types, Winston structured logging, Sentry integration, health + metrics endpoints.
> **Priority**: 🔴 P0 (Sprint 2 — ongoing)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 18.1.1 — Global Error Handler & AppError

> **As a** developer, **I want to** have a consistent error handling pipeline, **so that** all errors return typed, safe responses.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `utils/AppError.ts` class | BE Dev | 1h | `class AppError extends Error { statusCode, isOperational, code }`. Factory: `AppError.notFound()`, `AppError.unauthorized()`, `AppError.forbidden()`, `AppError.validation(errors)` |
| T2 | `middleware/globalErrorHandler.ts` | BE Dev | 3h | Handle: `AppError` (operational), `ZodError` (400 + field errors), `JsonWebTokenError` (401), `TokenExpiredError` (401), `MongooseValidationError` (400), `MongoDuplicateKeyError` (409), `MulterError` (400), `StripeError` (402/400), unhandled (500 generic). Never leak stack trace in production |
| T3 | `asyncHandler` wrapper | BE Dev | 1h | `const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next)` — wrap all async controllers |
| T4 | Tests | QA | 2h | Each error type → correct status code + response shape |

---

### Story 18.1.2 — Winston Logging + Sentry

> **As a** team, **I want to** have structured logs and error tracking, **so that** production issues are detected and debugged quickly.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `config/logger.ts` — Winston setup | BE Dev | 2h | Transports: Console (colorize, dev), File (`logs/error.log` — error only), File (`logs/combined.log`), Cloud (CloudWatch in prod). Format: JSON with `{ timestamp, level, message, service, ...meta }` |
| T2 | Morgan → Winston integration | BE Dev | 0.5h | `morgan('combined', { stream: { write: (msg) => logger.http(msg) } })` |
| T3 | Sentry integration | BE Dev | 1h | `@sentry/node` init in `server.ts`. `Sentry.captureException(err)` in global error handler for 5xx errors |
| T4 | `GET /metrics` endpoint | BE Dev | 1h | Returns: `{ requestsPerSecond, avgResponseTimeMs, errorRate, dbConnectionCount, redisConnected, queueDepths }` — basic Prometheus-compatible format |

---

---

# EPIC 19 — Testing

> **Goal**: Unit + integration tests, mock factories, MongoMemoryServer, coverage ≥80% on critical paths.
> **Priority**: 🔴 P0 (Sprint 2 — ongoing)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

### Story 19.1.1 — Test Infrastructure Setup

> **As a** developer, **I want to** have a fast, isolated test environment, **so that** tests run consistently in CI.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Jest + ts-jest configuration | BE Dev | 1h | `jest.config.ts` — `preset: 'ts-jest'`, `testEnvironment: 'node'`, coverage thresholds (80%), path aliases |
| T2 | MongoMemoryServer setup | BE Dev | 1h | `tests/setup.ts` — `beforeAll`: start in-memory Mongo, connect Mongoose. `afterAll`: disconnect + stop. `afterEach`: clear all collections |
| T3 | Mock Redis (`ioredis-mock`) | BE Dev | 1h | Replace Redis client in tests with `ioredis-mock`. Inject via dependency injection |
| T4 | Test factory functions with `@faker-js/faker` | BE Dev | 2h | `factories/userFactory.ts`, `factories/resumeFactory.ts`, `factories/questionFactory.ts` — generate realistic test data |
| T5 | Mock OpenAI client | BE Dev | 1h | `jest.mock('openai')` — mock `chat.completions.create` to return predefined response |
| T6 | Mock Stripe client | BE Dev | 1h | `jest.mock('stripe')` — mock checkout session, webhook event construction |

---

### Story 19.1.2 — Critical Path Integration Tests

> **As a** developer, **I want to** have integration tests for all critical flows, **so that** regressions are caught before deploy.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Auth flow tests (Supertest) | QA | 3h | Register → verify → login → refresh → logout. Wrong password (attempts). Locked account. Google OAuth mock |
| T2 | Resume CRUD flow tests | QA | 2h | Create → update sections → auto-save → version snapshot → clone → delete → share link |
| T3 | PDF export tests | QA | 2h | Mock Puppeteer → verify PDF Buffer returned → correct Content-Type header |
| T4 | Scoring engine unit tests | QA | 2h | 20+ test cases for scoring rules — empty resume, perfect resume, edge cases per section |
| T5 | Payment webhook tests | QA | 2h | Simulate Stripe webhook events: subscription created, deleted, invoice failed → verify user tier updated |
| T6 | Rate limiting tests | QA | 1h | Hammer endpoint > limit → verify 429 response + `X-RateLimit-Remaining: 0` |

---

### Story 19.1.3 — Test Coverage & CI Integration

> **As a** team, **I want to** enforce test coverage in CI, **so that** new code without tests cannot be merged.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Coverage thresholds in `jest.config.ts` | BE Dev | 0.5h | `coverageThreshold: { global: { branches: 80, functions: 80, lines: 80 } }` |
| T2 | GitHub Actions test step | BE Dev | 1h | `npm test -- --coverage --ci` in CI pipeline. Upload coverage to Codecov |
| T3 | Pre-commit test hook | BE Dev | 0.5h | `husky pre-commit` → run `jest --testPathPattern=changed` (only changed files) |

---

---

# EPIC 20 — Security & Rate Limiting

> **Goal**: OWASP Top 10 compliance, input sanitization, CSRF, helmet, CORS allowlist, IP blacklisting, LaTeX injection prevention.
> **Priority**: 🔴 P0 (Sprint 2 — ongoing)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 20.1.1 — OWASP Security Hardening

> **As a** system, **I want to** implement OWASP Top 10 protections, **so that** the app is resistant to common attacks.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | helmet.js full configuration | BE Dev | 1h | `helmet()` with `contentSecurityPolicy`, `hsts`, `noSniff`, `xssFilter`, `frameguard` |
| T2 | CORS allowlist | BE Dev | 0.5h | `cors({ origin: [env.FRONTEND_URL], credentials: true })` — explicit allowlist, no `*` |
| T3 | `mongo-sanitize` + `express-mongo-sanitize` | BE Dev | 0.5h | Strip `$` and `.` from request body/query/params — prevent NoSQL injection |
| T4 | `hpp` (HTTP Parameter Pollution) | BE Dev | 0.5h | `hpp()` middleware — strip duplicate query params |
| T5 | Input sanitization with `xss-clean` | BE Dev | 0.5h | Sanitize all string inputs — strip `<script>`, event handlers |
| T6 | SQL injection via Prisma parameterization | BE Dev | 0.5h | Only use Prisma query builder — never raw SQL string concatenation. Document rule in code review checklist |
| T7 | Zod validation on ALL endpoints | BE Dev | 1h | Every controller uses `validate(schema, 'body' | 'query' | 'params')` middleware before handler |
| T8 | IP auto-blacklist for abuse | BE Dev | 2h | Track failed auth attempts per IP in Redis. If >20 in 1h → add to blacklist. Check blacklist in middleware before all routes |

---

### Story 20.1.2 — CSRF Protection

> **As a** system, **I want to** protect against CSRF attacks, **so that** malicious sites cannot make authenticated requests.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | CSRF double-submit cookie pattern | BE Dev | 2h | On login: set `XSRF-TOKEN` cookie (non-httpOnly). Require `X-XSRF-TOKEN` header on state-changing requests (POST/PATCH/DELETE). Validate match |
| T2 | Exempt webhooks from CSRF | BE Dev | 0.5h | `/webhooks/*` paths excluded from CSRF — use Stripe signature verification instead |
| T3 | Tests | QA | 1h | Request without CSRF token → 403. Request with mismatched token → 403. Valid token → passes |

---

---

# EPIC 21 — Docker & CI/CD

> **Goal**: Multi-stage Dockerfile, `docker-compose` for full stack, GitHub Actions CI/CD pipeline, zero-downtime PM2 deployment.
> **Priority**: 🟡 P1 (Sprint 13–14)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

### Story 21.1.1 — Dockerfile & Docker Compose

> **As a** DevOps engineer, **I want to** containerize the app and all services, **so that** deployment is reproducible.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Multi-stage Dockerfile | BE Dev | 3h | Stage 1 `builder`: `node:20-alpine`, install deps, `tsc` compile. Stage 2 `runner`: copy `dist/` only, `npm ci --only=production`, expose 3000. Non-root user `node` |
| T2 | Install pdflatex in Docker image | BE Dev | 2h | Add `texlive-latex-base texlive-fonts-recommended texlive-fonts-extra texlive-latex-extra` in Dockerfile. Install pandoc |
| T3 | `docker-compose.yml` — full stack | BE Dev | 3h | Services: `api` (custom image), `mongo` (7.0), `postgres` (16), `redis` (7.2), `kafka` + `zookeeper`, `mailhog` (dev email). Named volumes for data persistence |
| T4 | `docker-compose.override.yml` — development | BE Dev | 1h | Mount `src/` as volume for hot-reload with `tsx watch`. Override env with dev values |
| T5 | Health checks in compose | BE Dev | 1h | `healthcheck` for each service. `api` depends_on `mongo` (healthy), `redis` (healthy) |

---

### Story 21.1.2 — GitHub Actions CI/CD Pipeline

> **As a** team, **I want to** have automated CI/CD, **so that** every PR is tested and main deploys automatically.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | CI workflow: `.github/workflows/ci.yml` | BE Dev | 2h | Trigger: PR to `main`. Steps: checkout → Node 20 → `npm ci` → `npm run typecheck` → `npm run lint` → `npm test -- --coverage --ci` → upload coverage |
| T2 | Docker build workflow | BE Dev | 1h | On CI pass: `docker build` → tag with `git sha` → push to ECR/GHCR |
| T3 | CD workflow: `.github/workflows/deploy.yml` | BE Dev | 2h | Trigger: push to `main` (after CI pass). Steps: SSH to server → `docker pull` new image → `docker-compose up -d --no-deps api` → health check → rollback on failure |
| T4 | Environment secrets in GitHub | BE Dev | 0.5h | Document all required secrets: `MONGO_URI`, `REDIS_URL`, `JWT_SECRET`, `STRIPE_SECRET`, etc. in `.github/secrets.md` |
| T5 | Slack notification on deploy | BE Dev | 0.5h | Post to `#deployments` channel on deploy success/failure via Slack webhook |

---

### Story 21.1.3 — PM2 Zero-Downtime + Rollback

> **As a** DevOps engineer, **I want to** deploy with zero downtime, **so that** users are not affected by deployments.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | PM2 `ecosystem.config.js` | BE Dev | 1h | `exec_mode: 'cluster'`, `instances: 'max'`, `wait_ready: true`, `listen_timeout: 10000`, `kill_timeout: 5000` |
| T2 | Graceful reload in deploy script | BE Dev | 1h | `pm2 reload ecosystem.config.js --update-env` — rolling restart, zero dropped connections |
| T3 | Rollback script | BE Dev | 1h | Keep last 2 Docker image tags. On health check failure → `docker tag previous :current` → reload PM2 |
| T4 | Database migration strategy | BE Dev | 1h | Prisma: `prisma migrate deploy` runs before `pm2 reload`. Backward-compatible migrations only (additive, never remove columns) |

---

---

# 🗓️ Sprint Plan Summary

| Sprint | Focus | Key Deliverables | SP |
|---|---|---|---|
| **Sprint 1** | Foundation + Auth (Part 1) | Boilerplate, env config, Cluster, EventEmitter, Register, Email verify | 13 SP |
| **Sprint 2** | Auth (Part 2) + Error Handling | Login/Refresh/Logout, Account lock, OAuth, AppError, Winston, Sentry | 16 SP |
| **Sprint 3** | Authorization + User API + Resume CRUD | Ownership, subscription guards, User CRUD, Resume CRUD, Share link | 18 SP |
| **Sprint 4** | Builder API + File Storage + Redis Cache | Section PATCH, auto-save, Cloudinary, S3, cache middleware | 18 SP |
| **Sprint 5** | Template Engine + PDF Export | 10 HTML templates, Puppeteer pool, Worker Thread PDF, DOCX export | 21 SP |
| **Sprint 6** | Scoring Engine + BullMQ Queues | ATS scoring rules, JD match, Email queue, PDF export queue | 18 SP |
| **Sprint 7** | LaTeX Service (Part 1) + AI Chat | LaTeX generator, 4 LaTeX templates, pdflatex compile worker, AI streaming chat | 21 SP |
| **Sprint 8** | AI Resume Operations + PDF Upload | Bullet optimizer, rewriter, summary gen, PDF upload + BullMQ parse queue | 18 SP |
| **Sprint 9** | PDF Parse Pipeline + Upskilling API (Part 1) | AI extraction worker, gap analysis, concept cards CRUD | 16 SP |
| **Sprint 10** | Upskilling API (Part 2) | Interview Q&A bank, mock session CRUD, AI evaluation processor | 18 SP |
| **Sprint 11** | Payments + Email Service | Stripe Checkout, webhooks, subscription tiers, email templates | 18 SP |
| **Sprint 12** | Analytics + Security Hardening | Resume view tracking, OWASP, CSRF, IP blacklist, rate limiting | 16 SP |
| **Sprint 13** | Testing + Docker | Full test suite, mock factories, Dockerfile, docker-compose | 18 SP |
| **Sprint 14** | CI/CD + PM2 + Launch | GitHub Actions, zero-downtime deploy, rollback, performance audit | 13 SP |

---

# ✅ Definition of Ready (DoR)

A story is ready when:
- [ ] User story written in "As a / I want to / So that" format
- [ ] Acceptance criteria with testable conditions defined
- [ ] API contract (request/response types) agreed with frontend team
- [ ] Shared TypeScript DTO types updated in `src/types/`
- [ ] Database schema changes reviewed and Zod + Mongoose/Prisma schemas ready
- [ ] Dependencies (external services, env vars) identified and available
- [ ] Story fits within single sprint (≤8 SP). Larger ones split
- [ ] Story points assigned via planning poker (Fibonacci)

---

# ✅ Definition of Done (DoD)

A story is done when:
- [ ] All acceptance criteria pass
- [ ] Code reviewed and approved (≥1 reviewer)
- [ ] Unit + integration tests written with ≥80% coverage for critical paths
- [ ] `tsc --noEmit` passes (no TypeScript errors)
- [ ] ESLint + Prettier pass with no errors
- [ ] All new endpoints documented (JSDoc or OpenAPI comment)
- [ ] No secrets or credentials committed (GitGuardian check in CI)
- [ ] Security: input validated with Zod, output sanitized
- [ ] Merged to `main` via PR, deployed to staging, smoke tests passed
- [ ] API contract fulfilled — frontend team confirmed integration working

---

# ⚠️ Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| pdflatex unavailable in prod | Medium | High | Docker image includes texlive. CI tests compilation. Fallback: Puppeteer PDF |
| OpenAI rate limits / cost overrun | High | High | User-level credit limits, BYOK option, response caching, exponential backoff |
| PDF parsing inaccuracy (multi-column PDFs) | High | Medium | Confidence scores, user review step, fallback to manual entry |
| Puppeteer memory in cluster mode | Medium | High | Browser pool (max 3), Worker Thread isolation, memory monitoring + restart |
| LaTeX injection via user content | Medium | High | Command blocklist, special char escaping, Docker sandbox with no network access |
| Stripe webhook replay attacks | Low | High | Idempotency key (eventId in Redis), timestamp tolerance check (5-min window) |
| pdflatex compilation DoS (complex LaTeX) | Medium | Medium | 30s timeout, Worker Thread kill, queue-based processing with concurrency limit |

---

*ResumeForge Backend Backlog — Node.js + Express + TypeScript + MongoDB + PostgreSQL + Redis + BullMQ + OpenAI + Puppeteer + pdflatex*
*Scale Target: 50k–500k users | 14 Sprints | ~28 weeks*
