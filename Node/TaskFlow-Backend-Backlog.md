# 🚀 TaskFlow Backend — Product Backlog
### Epic → Feature → Story → Task Breakdown with Planning & Grooming
> **Product**: TaskFlow Backend API — Node.js + Express + MongoDB + PostgreSQL + Redis + Kafka
> **Team Size**: 3 devs (2 Backend, 1 QA) | **Sprint Length**: 2 weeks
> **Total Estimated Effort**: ~28 weeks (14 sprints) | **Scale Target**: 10k–100k users

---

## 📦 Backend Feature Areas Overview

| # | Feature Area | Key Concepts Covered |
|---|---|---|
| 1 | **Project Foundation** | Node.js core, Express architecture, folder structure, env config |
| 2 | **REST API Design** | RESTful conventions, versioning, pagination, filtering, API response |
| 3 | **Authentication** | JWT (access + refresh), Google OAuth, Passport, bcrypt |
| 4 | **Authorization** | RBAC, ABAC, resource ownership, role middleware |
| 5 | **Sessions & Cookies** | express-session, Redis session store, CSRF, httpOnly cookies |
| 6 | **User & Profile APIs** | Controllers, Service layer, CRUD, avatar upload |
| 7 | **MongoDB & Mongoose** | Schema design, indexes, aggregation, transactions, hooks |
| 8 | **PostgreSQL & Prisma** | Relational schema, Prisma ORM, transactions, migrations |
| 9 | **Redis — Caching & More** | Cache middleware, invalidation, rate limiting, Pub/Sub, sessions |
| 10 | **File Upload** | Multer, Cloudinary, AWS S3, validation |
| 11 | **WebSockets & Real-Time** | Socket.io, rooms, auth middleware, Redis adapter scaling |
| 12 | **Message Queues** | Bull/BullMQ, job retry, concurrency, email/image queues |
| 13 | **Kafka — Event Streaming** | Producer, consumer, topics, consumer groups, dead letter queue |
| 14 | **Payment Integration** | Stripe PaymentIntent, webhooks, Razorpay, refunds |
| 15 | **Rate Limiting & Security** | express-rate-limit, helmet, CORS, OWASP checklist, SQL injection |
| 16 | **Validation** | Joi, Zod, express-validator, sanitization |
| 17 | **Error Handling & Logging** | AppError class, global handler, Winston, Morgan, Sentry |
| 18 | **Testing** | Jest, Supertest, MongoMemoryServer, mocking, coverage |
| 19 | **Performance Optimization** | Clustering, Worker threads, DB query optimization, compression |
| 20 | **Microservices & API Gateway** | Service decomposition, Circuit breaker, Saga, gRPC, API Gateway |
| 21 | **Docker & CI/CD** | Dockerfile, docker-compose, GitHub Actions, PM2 |

---

## 🗺️ Roadmap Overview

```
Q1 (Sprint 1–4)   → Core API: Foundation + Auth + User APIs + MongoDB + PostgreSQL
Q2 (Sprint 5–8)   → Infrastructure: Redis + Queues + Kafka + File Upload + WebSockets
Q3 (Sprint 9–11)  → Integration: Payments + Security + Validation + Error Handling
Q4 (Sprint 12–14) → Scale: Testing + Performance + Microservices + Docker + CI/CD
```

---

## 📚 Table of Contents

- [EPIC 1 — Project Foundation & Express Architecture](#epic-1--project-foundation--express-architecture)
- [EPIC 2 — REST API Design](#epic-2--rest-api-design)
- [EPIC 3 — Authentication](#epic-3--authentication)
- [EPIC 4 — Authorization (RBAC)](#epic-4--authorization-rbac)
- [EPIC 5 — Sessions & Cookies](#epic-5--sessions--cookies)
- [EPIC 6 — User & Project APIs (Controllers + Services)](#epic-6--user--project-apis)
- [EPIC 7 — MongoDB & Mongoose](#epic-7--mongodb--mongoose)
- [EPIC 8 — PostgreSQL & Prisma](#epic-8--postgresql--prisma)
- [EPIC 9 — Redis (Caching, Pub/Sub, Rate Limiting)](#epic-9--redis)
- [EPIC 10 — File Upload](#epic-10--file-upload)
- [EPIC 11 — WebSockets & Real-Time](#epic-11--websockets--real-time)
- [EPIC 12 — Message Queues (Bull / BullMQ)](#epic-12--message-queues)
- [EPIC 13 — Kafka Event Streaming](#epic-13--kafka-event-streaming)
- [EPIC 14 — Payment Integration](#epic-14--payment-integration)
- [EPIC 15 — Security & Rate Limiting](#epic-15--security--rate-limiting)
- [EPIC 16 — Validation](#epic-16--validation)
- [EPIC 17 — Error Handling & Logging](#epic-17--error-handling--logging)
- [EPIC 18 — Testing](#epic-18--testing)
- [EPIC 19 — Performance Optimization](#epic-19--performance-optimization)
- [EPIC 20 — Microservices & API Gateway](#epic-20--microservices--api-gateway)
- [EPIC 21 — Docker & CI/CD](#epic-21--docker--cicd)
- [Sprint Plan Summary](#sprint-plan-summary)
- [Definition of Ready & Done](#definition-of-ready--done)

---

---

# EPIC 1 — Project Foundation & Express Architecture

> **Goal**: Establish a production-grade Express.js project with proper structure, environment config, and the Node.js core concepts correctly applied.
> **Priority**: 🔴 P0 — Must have (Sprint 1)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**
> **Node.js Concepts**: Event Loop, libuv, Streams, Cluster, Worker Threads, Express middleware pipeline

---

## Feature 1.1 — Project Scaffold & Folder Structure

**Description**: Set up the full production folder structure, TypeScript config, linting, and base Express app following the MVC + Service layer pattern.

**Acceptance Criteria**:
- [ ] Folder structure matches production pattern: `controllers/`, `services/`, `models/`, `routes/`, `middleware/`, `jobs/`, `sockets/`, `utils/`, `config/`
- [ ] TypeScript configured with strict mode and path aliases
- [ ] ESLint + Prettier configured and enforced
- [ ] `app.ts` vs `server.ts` separation (app = Express config, server = listen + DB connect)
- [ ] Graceful shutdown on `SIGTERM` / `SIGINT`

---

### Story 1.1.1 — Express App Initialization

> **As a** backend developer,
> **I want to** have a clean production-ready Express boilerplate,
> **so that** all features are built on a solid, consistent foundation.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Init TypeScript project with `tsconfig.json` | BE Dev | 1h | `strict: true`, `paths: { "@/*": ["src/*"] }`, `outDir: dist`, `module: CommonJS` |
| T2 | Create full folder structure | BE Dev | 0.5h | All directories with `.gitkeep`, match production pattern |
| T3 | `app.ts` — Express setup with middleware chain | BE Dev | 2h | `helmet`, `cors`, `morgan`, `express.json`, `compression`, `express.urlencoded`, route mounts, 404 handler |
| T4 | `server.ts` — HTTP server + graceful shutdown | BE Dev | 2h | `http.createServer(app)`, connect DB, `process.on('SIGTERM')` → close server → close DB → exit |
| T5 | ESLint + Prettier configuration | BE Dev | 1h | `.eslintrc`, `.prettierrc`, `lint-staged`, `husky` pre-commit hook |
| T6 | `package.json` scripts | BE Dev | 0.5h | `dev` (tsx watch), `build` (tsc), `start` (node dist), `lint`, `test` |

---

### Story 1.1.2 — Environment Config with Validation

> **As a** developer,
> **I want to** validate all environment variables on startup,
> **so that** the app fails fast with a clear error if config is missing.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `config/env.ts` — Zod schema for all env vars | BE Dev | 2h | `z.object({ PORT, NODE_ENV, MONGO_URI, POSTGRES_URI, REDIS_URL, JWT_SECRET, ... })` — `process.exit(1)` on failure |
| T2 | `.env.example` with all required keys | BE Dev | 0.5h | Document every variable, group by service |
| T3 | Different configs per environment | BE Dev | 1h | `NODE_ENV=development` → verbose logging; `production` → JSON logs only |
| T4 | Secrets rotation strategy docs | BE Dev | 0.5h | Comment in env.ts: how to rotate JWT_SECRET without downtime |

---

## Feature 1.2 — Node.js Core Concepts Implementation

**Description**: Correctly apply Node.js core concepts — Cluster for multi-core, Worker Threads for CPU tasks, Streams for large data processing.

---

### Story 1.2.1 — Cluster Mode for Multi-Core Utilization

> **As a** DevOps engineer,
> **I want to** run the Node.js app in cluster mode,
> **so that** all CPU cores are utilized for handling HTTP requests.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `cluster.ts` — master/worker setup | BE Dev | 2h | `cluster.isPrimary` → fork `os.cpus().length` workers. Worker restart on `exit` event |
| T2 | Graceful shutdown per worker | BE Dev | 2h | On `SIGTERM` → stop accepting new connections → finish in-flight → exit |
| T3 | PM2 ecosystem config | BE Dev | 1h | `ecosystem.config.js` with `exec_mode: 'cluster'`, `instances: 'max'`, env vars |
| T4 | Health check endpoint | BE Dev | 1h | `GET /health` → `{ status, uptime, memory, pid, timestamp }` |
| T5 | Load test with autocannon | QA | 2h | `autocannon -c 100 -d 30 http://localhost:3000/health` — verify all workers handle load |

---

### Story 1.2.2 — Worker Threads for CPU-Intensive Tasks

> **As a** backend developer,
> **I want to** offload CPU-heavy tasks (CSV export, image processing metadata) to Worker Threads,
> **so that** the main event loop is never blocked.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `workers/csvExportWorker.ts` | BE Dev | 3h | Receives `{ tasks[] }` via `workerData`, builds CSV string, posts result back via `parentPort` |
| T2 | Worker pool utility | BE Dev | 3h | `WorkerPool` class — maintain N workers, queue tasks, round-robin dispatch |
| T3 | `GET /tasks/export` endpoint | BE Dev | 1h | Controller calls WorkerPool → streams CSV back to client with `Content-Disposition: attachment` |
| T4 | Streams for large file response | BE Dev | 2h | Use `Readable.from()` to stream CSV without buffering entire file in memory |

---

### Story 1.2.3 — Event Emitter Pattern

> **As a** backend developer,
> **I want to** use Node.js EventEmitter for internal domain events,
> **so that** services are decoupled and side effects (email, notifications) are handled separately.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `events/taskEvents.ts` — typed EventEmitter | BE Dev | 1h | `class TaskEventEmitter extends EventEmitter` — typed events: `task:created`, `task:assigned` |
| T2 | Emit events from TaskService | BE Dev | 1h | After `createTask()` → `taskEmitter.emit('task:created', task)` |
| T3 | Listener: send notification on task assignment | BE Dev | 1h | `taskEmitter.on('task:assigned', async ({ task, assignee }) => { ... send push/email })` |
| T4 | Error handling in async event listeners | BE Dev | 1h | Wrap listener in `try/catch` — emit `error` event on failure, never crash the process |

---

---

# EPIC 2 — REST API Design

> **Goal**: All API endpoints follow RESTful conventions, return consistent response shapes, support pagination/filtering/sorting, and are versioned.
> **Priority**: 🔴 P0 (Sprint 1)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 2.1 — API Response Standard & Versioning

---

### Story 2.1.1 — Consistent API Response Shape

> **As a** frontend developer,
> **I want to** receive a consistent JSON response structure from every endpoint,
> **so that** I can handle success and errors uniformly.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `utils/apiResponse.ts` utility | BE Dev | 1h | `success<T>(res, data, statusCode, meta?)` and `error(res, message, statusCode, errors?)` helpers |
| T2 | Apply response utility across all routes | BE Dev | 1h | Refactor all controllers to use `apiResponse` instead of inline `res.json()` |
| T3 | API versioning via URL prefix | BE Dev | 0.5h | All routes under `/api/v1/`. Router mounted in `app.ts` per version |
| T4 | `meta` field for pagination | BE Dev | 1h | `{ page, limit, total, totalPages, hasNext, hasPrev }` in every list response |

---

## Feature 2.2 — Pagination, Filtering & Sorting

---

### Story 2.2.1 — Reusable Query Builder Utility

> **As a** developer,
> **I want to** have a reusable query-building utility for MongoDB queries,
> **so that** every list endpoint supports pagination, filtering, and sorting without duplicated logic.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `utils/QueryBuilder.ts` class | BE Dev | 3h | Chain: `.filter()` (strip reserved keys, apply MongoDB operators) → `.sort()` → `.paginate()` → `.fields()` (projection). Returns `{ query, meta }` |
| T2 | Apply to `GET /tasks` | BE Dev | 1h | `?page=2&limit=20&sort=-createdAt&status=todo&priority=high&fields=title,status` |
| T3 | Apply to `GET /projects` and `GET /users` | BE Dev | 1h | Same QueryBuilder applied to all list endpoints |
| T4 | Cursor-based pagination option | BE Dev | 2h | `?cursor=<lastId>` for infinite scroll — more efficient than skip/limit on large collections |
| T5 | Tests | QA | 2h | Test each query param combination, test edge cases (page > total), test cursor pagination |

---

### Story 2.2.2 — Full-Text Search Endpoint

> **As a** user,
> **I want to** search tasks by keyword across title and description,
> **so that** I can find any task quickly.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | MongoDB text index on Task | BE Dev | 0.5h | `taskSchema.index({ title: 'text', description: 'text' })` |
| T2 | `GET /search?q=keyword` endpoint | BE Dev | 2h | `$text: { $search: q }` with score projection `{ score: { $meta: 'textScore' } }`, sorted by score |
| T3 | Multi-collection search | BE Dev | 2h | Search Tasks + Projects in parallel with `Promise.all`, merge results with type label |
| T4 | Highlight matched terms | BE Dev | 1h | Return matched snippet field showing context around the keyword |
| T5 | Tests | QA | 1h | Test search relevance, empty results, special chars |

---

---

# EPIC 3 — Authentication

> **Goal**: Secure, production-grade auth with JWT access/refresh token rotation, Google OAuth, and account protection (email verify, account lock).
> **Priority**: 🔴 P0 (Sprint 1–2)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**

---

## Feature 3.1 — JWT Authentication

**Description**: Register + Login with email/password. JWT access token (15min, in-memory) + refresh token (7d, httpOnly cookie). Auto-rotation on refresh.

---

### Story 3.1.1 — Register & Email Verification

> **As a** new user,
> **I want to** register and verify my email,
> **so that** my account is created securely.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /auth/register` controller + service | BE Dev | 2h | Validate body, check duplicate email, `bcrypt.hash(password, 12)`, create User, generate email verification token |
| T2 | Email verification token | BE Dev | 1h | `crypto.randomBytes(32).toString('hex')` stored hashed in DB with 24h expiry |
| T3 | Send verification email via Bull queue | BE Dev | 2h | Push `{ type: 'verify-email', to, token }` to email queue — async, non-blocking |
| T4 | `GET /auth/verify-email/:token` endpoint | BE Dev | 1h | Find user by hashed token, check expiry, set `isVerified: true`, clear token |
| T5 | `POST /auth/resend-verification` | BE Dev | 1h | Rate-limited (1 email per 60s per user) — generate new token, queue email |
| T6 | Tests | QA | 3h | Register flow, duplicate email 409, verify token, expired token, resend rate limit |

---

### Story 3.1.2 — Login with JWT Tokens

> **As a** registered user,
> **I want to** log in and receive tokens,
> **so that** I can make authenticated API requests.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /auth/login` controller + service | BE Dev | 2h | Find user by email (select +password), `bcrypt.compare`, check `isVerified`, check not locked |
| T2 | Access + Refresh token generation | BE Dev | 1h | `signAccessToken({ id, role }, '15m')`, `signRefreshToken({ id }, '7d')`, `jwtid` claim for blacklisting |
| T3 | Refresh token in `httpOnly` cookie | BE Dev | 1h | `res.cookie('refreshToken', token, { httpOnly, secure, sameSite:'strict', maxAge: 7d, path:'/api/auth/refresh' })` |
| T4 | `POST /auth/refresh` endpoint | BE Dev | 2h | Read cookie → verify refresh token → check not blacklisted in Redis → issue new access + refresh token pair (rotation) |
| T5 | `POST /auth/logout` endpoint | BE Dev | 1h | Add `jwtid` of refresh token to Redis blacklist (TTL = remaining token lifetime) → clear cookie |
| T6 | Account lockout after 5 failed logins | BE Dev | 2h | Track `loginAttempts` + `lockUntil` in User model. Lock for 15 min. Reset on success |
| T7 | Tests | QA | 3h | Login success, wrong password (attempts), locked account, refresh rotation, logout blacklist |

---

### Story 3.1.3 — Forgot / Reset Password

> **As a** user who forgot their password,
> **I want to** reset my password via email link,
> **so that** I can regain access to my account.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /auth/forgot-password` | BE Dev | 1h | Find user by email, generate reset token (crypto), hash & store with 1h expiry, queue email |
| T2 | `POST /auth/reset-password/:token` | BE Dev | 2h | Verify unhashed token matches stored hash, check expiry, bcrypt new password, clear reset token, invalidate all refresh tokens |
| T3 | Password history check | BE Dev | 1h | Store last 3 password hashes — reject if new password matches any previous |
| T4 | Tests | QA | 2h | Full reset flow, expired token, invalid token, password reuse rejection |

---

## Feature 3.2 — Google OAuth

---

### Story 3.2.1 — Passport Google OAuth Strategy

> **As a** user,
> **I want to** sign in with Google,
> **so that** I don't need a separate password.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Install + configure `passport-google-oauth20` | BE Dev | 1h | `GoogleStrategy` with `clientID`, `clientSecret`, `callbackURL` |
| T2 | Strategy callback — find or create user | BE Dev | 2h | Find by `googleId` OR `email`. If email match → link Google to existing account. Else → create new user |
| T3 | `GET /auth/google` and callback routes | BE Dev | 1h | Initiate OAuth redirect, handle callback, generate JWT pair |
| T4 | Return tokens after OAuth | BE Dev | 1h | On callback success → set refresh token cookie → redirect to frontend with access token in query (short-lived) or post-message |
| T5 | Handle Google auth errors | BE Dev | 1h | `failureRedirect`, profile photo save on first login |
| T6 | Tests | QA | 2h | Mock Google profile, test user creation, test account linking, test callback redirect |

---

---

# EPIC 4 — Authorization (RBAC)

> **Goal**: Role-based access control throughout all API routes. Roles: `admin`, `member`, `viewer`.
> **Priority**: 🔴 P0 (Sprint 2)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 4.1 — Middleware-Based Role Guards

---

### Story 4.1.1 — authenticate & authorize Middleware

> **As a** system,
> **I want to** verify JWT and check user roles on every protected route,
> **so that** unauthorized users cannot access or modify resources.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `authenticate.ts` middleware | BE Dev | 2h | Extract Bearer token, `jwt.verify`, find user in DB (or Redis cache), attach to `req.user`. Handle expired/invalid tokens with typed errors |
| T2 | `authorize(...roles)` middleware | BE Dev | 1h | Check `req.user.role` in allowed roles array. Throw `AppError('Forbidden', 403)` if not |
| T3 | `checkOwnership(Model)` middleware | BE Dev | 2h | Find resource by `req.params.id`, compare `resource.createdBy` with `req.user.id`. Admins bypass ownership check |
| T4 | Route-level application | BE Dev | 1h | Apply `authenticate` + `authorize` + `checkOwnership` on all protected routes |
| T5 | Tests | QA | 2h | Test each role on each route type, test ownership check, test admin bypass |

---

## Feature 4.2 — ABAC (Attribute-Based Access Control)

---

### Story 4.2.1 — Project-Level Permission System

> **As a** project admin,
> **I want to** control what each project member can do within their project,
> **so that** viewers cannot accidentally modify tasks.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ProjectMember` schema | BE Dev | 1h | `{ userId, projectId, role: 'admin'\|'member'\|'viewer', joinedAt }` in Prisma |
| T2 | `checkProjectPermission(action)` middleware | BE Dev | 3h | Load `ProjectMember` record, compare action against permission matrix. Actions: `read`, `create`, `edit`, `delete`, `manage-members` |
| T3 | Permission matrix definition | BE Dev | 1h | `const PERMISSIONS = { admin: ['*'], member: ['read','create','edit'], viewer: ['read'] }` |
| T4 | Apply to all task/project routes | BE Dev | 2h | Replace simple `authorize` with `checkProjectPermission('edit')` etc. |
| T5 | Tests | QA | 2h | Each role attempting each action, cross-project access denied |

---

---

# EPIC 5 — Sessions & Cookies

> **Goal**: Implement session-based auth for web dashboard (admin panel), secure cookie handling, CSRF protection.
> **Priority**: 🟡 P1 (Sprint 3)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 5.1 — Redis Session Store

---

### Story 5.1.1 — express-session with Redis Store

> **As a** system,
> **I want to** store user sessions in Redis,
> **so that** sessions work correctly across multiple server instances.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Install `express-session` + `connect-redis` | BE Dev | 0.5h | Configure `RedisStore` with existing Redis client |
| T2 | Session config in `app.ts` | BE Dev | 1h | `secret` from env, `resave: false`, `saveUninitialized: false`, `cookie: { secure, httpOnly, maxAge: 24h }` |
| T3 | Session-based login route (admin panel) | BE Dev | 2h | `POST /admin/login` → verify password → `req.session.userId = user.id` → return success |
| T4 | Session middleware — populate `req.user` | BE Dev | 1h | `if (req.session.userId) req.user = await User.findById(req.session.userId)` |
| T5 | `POST /admin/logout` | BE Dev | 0.5h | `req.session.destroy()` + clear session cookie |
| T6 | Tests | QA | 2h | Login → session created in Redis, logout → session deleted, session expiry |

---

## Feature 5.2 — CSRF Protection

---

### Story 5.2.1 — CSRF Token for Cookie-Based Auth

> **As a** security engineer,
> **I want to** implement CSRF protection on all state-changing endpoints,
> **so that** malicious sites cannot make authenticated requests on behalf of users.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `csurf` middleware setup | BE Dev | 1h | `csrf({ cookie: true })` — attach to all non-GET routes that use cookie auth |
| T2 | `GET /csrf-token` endpoint | BE Dev | 0.5h | Returns `{ csrfToken: req.csrfToken() }` — called by SPA on init |
| T3 | Frontend must send token in header | BE Dev | 0.5h | Document: `X-CSRF-Token` header required on POST/PUT/PATCH/DELETE |
| T4 | Double-submit cookie pattern | BE Dev | 2h | Alternative: set CSRF token in non-httpOnly cookie + read from JS + send in header |
| T5 | CSRF bypass for API clients (JWT) | BE Dev | 1h | CSRF only applies to cookie-auth routes. JWT Bearer routes exempt (SameSite + Origin check instead) |
| T6 | Tests | QA | 2h | Missing CSRF token → 403, valid token → passes, JWT routes unaffected |

---

---

# EPIC 6 — User & Project APIs (Controllers + Services)

> **Goal**: Full CRUD APIs for users, projects, and tasks following the Controller → Service → Model pattern.
> **Priority**: 🔴 P0 (Sprint 2–3)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 6.1 — User API

---

### Story 6.1.1 — User CRUD Endpoints

> **As a** developer,
> **I want to** implement full User CRUD via Controller/Service pattern,
> **so that** user management is testable, maintainable, and follows separation of concerns.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `UserController.ts` — thin layer | BE Dev | 2h | `getMe`, `updateMe`, `deleteMe`, `getAllUsers` (admin), `getUserById`. All call UserService, return `apiResponse` |
| T2 | `UserService.ts` — business logic | BE Dev | 3h | `getUserById` (throw if not found), `updateUser` (validate fields, exclude password), `deleteUser` (soft delete + cascade), `getAllUsers` (with QueryBuilder) |
| T3 | `asyncHandler` wrapper utility | BE Dev | 1h | `(fn) => (req, res, next) => Promise.resolve(fn(req,res,next)).catch(next)` |
| T4 | `GET /users/me` → full profile | BE Dev | 1h | Return user with project memberships, task stats |
| T5 | `PATCH /users/me` → update profile | BE Dev | 1h | Allow: name, bio, timezone, avatar URL. Block: email, password (separate endpoints) |
| T6 | Soft delete `DELETE /users/me` | BE Dev | 1h | Set `deletedAt` timestamp. Cron job permanently deletes after 30 days. Anonymize data |
| T7 | Tests | QA | 3h | Each CRUD endpoint, auth guard, admin vs user access |

---

## Feature 6.2 — Task API

---

### Story 6.2.1 — Task CRUD with Full Business Logic

> **As a** developer,
> **I want to** implement the Task CRUD API,
> **so that** the frontend Kanban board is fully powered.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `TaskController.ts` | BE Dev | 2h | `createTask`, `getTasks`, `getTask`, `updateTask`, `deleteTask`, `bulkUpdateTasks`, `reorderTasks` |
| T2 | `TaskService.ts` | BE Dev | 4h | Business logic: validate assignee is project member, emit `task:created` event, invalidate Redis cache on mutation, update `updatedAt` |
| T3 | `POST /tasks/bulk` endpoint | BE Dev | 2h | Accept `{ ids[], operation: 'status'\|'assignee'\|'priority', value }`. Transaction-wrapped update |
| T4 | `PATCH /tasks/reorder` endpoint | BE Dev | 2h | Accept `{ taskId, newIndex, targetColumnStatus }` — update `sortOrder` field, respond with updated order |
| T5 | Task activity log | BE Dev | 2h | On every task update: write to `TaskActivity` collection `{ taskId, actor, action, changes, timestamp }` |
| T6 | Tests | QA | 3h | All CRUD, bulk update, reorder, activity log creation, permission checks |

---

---

# EPIC 7 — MongoDB & Mongoose

> **Goal**: Production-grade Mongoose schemas with proper indexes, aggregation pipelines, and transactions.
> **Priority**: 🔴 P0 (Sprint 2–3)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 7.1 — Schema Design & Indexes

---

### Story 7.1.1 — Task & User Mongoose Schemas

> **As a** developer,
> **I want to** design optimized MongoDB schemas with proper indexes,
> **so that** queries are fast and the data model is correct.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `Task.model.ts` — full schema | BE Dev | 3h | Fields: `title`, `description`, `status(enum)`, `priority(enum)`, `assignee(ref:User)`, `project(ref:Project)`, `tags[]`, `dueDate`, `sortOrder`, `attachments[]`, `subTasks[]`, `deletedAt`. Timestamps |
| T2 | Compound indexes | BE Dev | 1h | `{ project: 1, status: 1 }`, `{ project: 1, assignee: 1 }`, `{ dueDate: 1, status: 1 }`, text index on `{ title: 'text', description: 'text' }` |
| T3 | Pre-save hooks | BE Dev | 1h | `pre('save')` — auto-generate `slug` from title, validate `dueDate` not in past |
| T4 | Virtual fields | BE Dev | 1h | `subTasksCompleted` (count done sub-tasks), `isOverdue` (dueDate < now && status !== done) |
| T5 | Instance methods | BE Dev | 1h | `task.addActivity(actor, action, changes)`, `task.softDelete()` |
| T6 | Statics | BE Dev | 1h | `Task.getByProject(projectId, filters)`, `Task.getOverdue()`, `Task.getDueSoon(days)` |
| T7 | Tests | QA | 2h | Schema validation, index creation, hooks, virtuals |

---

## Feature 7.2 — Aggregation Pipelines

---

### Story 7.2.1 — Analytics Aggregation Queries

> **As a** developer,
> **I want to** implement MongoDB aggregation pipelines for dashboard analytics,
> **so that** the frontend can display charts without N+1 queries.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `GET /projects/:id/analytics/summary` | BE Dev | 2h | Aggregate: total tasks, grouped by status, grouped by priority, overdue count, completion rate % |
| T2 | `GET /projects/:id/analytics/burndown` | BE Dev | 3h | Group tasks by completion date, compute cumulative completed vs total. Output `{ date, completed, total }[]` for last 30 days |
| T3 | `GET /projects/:id/analytics/workload` | BE Dev | 2h | `$lookup` users, `$group` by assignee, count tasks by status per member |
| T4 | `GET /users/me/analytics` | BE Dev | 2h | Personal stats: tasks completed per day (last 30d for heatmap), streak count, average completion time |
| T5 | Index coverage check | BE Dev | 1h | Run `explain("executionStats")` on each aggregation — ensure no `COLLSCAN` |
| T6 | Cache aggregation results in Redis | BE Dev | 1h | `cache(300)` middleware on analytics endpoints — 5-min TTL acceptable for dashboards |
| T7 | Tests | QA | 2h | Seed test data, assert aggregation output shape and values |

---

## Feature 7.3 — Transactions

---

### Story 7.3.1 — Multi-Document Transactions

> **As a** developer,
> **I want to** use MongoDB transactions for operations that span multiple documents,
> **so that** data integrity is maintained even if one step fails.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `deleteProject` with cascading cleanup | BE Dev | 3h | Transaction: delete Project + all Tasks + all ProjectMembers + remove from User.projects[]. Rollback all on any failure |
| T2 | `transferOwnership` transaction | BE Dev | 2h | Transaction: update old owner role → `member`, set new owner role → `admin`. Atomic |
| T3 | Transaction helper utility | BE Dev | 1h | `withTransaction(async (session) => { ... })` wrapper — auto commit/abort/endSession |
| T4 | Tests | QA | 2h | Simulate failure mid-transaction, verify full rollback |

---

---

# EPIC 8 — PostgreSQL & Prisma

> **Goal**: Use PostgreSQL + Prisma for relational data — payments, billing, audit logs, analytics events.
> **Priority**: 🟡 P1 (Sprint 4)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 8.1 — Prisma Schema & Migrations

---

### Story 8.1.1 — Prisma Schema Design

> **As a** developer,
> **I want to** design the PostgreSQL schema using Prisma,
> **so that** relational data (payments, subscriptions, audit logs) is strongly typed and migrated safely.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `schema.prisma` — User + Subscription | BE Dev | 2h | `User { id, email, name, stripeCustomerId, subscriptionId }`, `Subscription { id, userId, plan, status, periodEnd }` |
| T2 | `Payment` model | BE Dev | 1h | `{ id, userId, amount, currency, status, stripePaymentIntentId, metadata }` |
| T3 | `AuditLog` model | BE Dev | 1h | `{ id, actorId, action, entityType, entityId, changes(Json), ipAddress, userAgent, createdAt }` |
| T4 | `prisma migrate dev` workflow | BE Dev | 1h | Document migration naming convention, run seed script with `prisma db seed` |
| T5 | Typed Prisma client with logging | BE Dev | 1h | `new PrismaClient({ log: ['query','warn','error'] })` in dev, JSON log in prod |
| T6 | Tests | QA | 2h | Prisma seed, migration idempotency, constraint violations return correct errors |

---

## Feature 8.2 — Prisma Transactions & Advanced Queries

---

### Story 8.2.1 — $transaction for Payment + Subscription

> **As a** developer,
> **I want to** use Prisma `$transaction` for payment operations,
> **so that** payment and subscription records are always consistent.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /payments/confirm` with `$transaction` | BE Dev | 3h | `$transaction([ createPayment, updateSubscription, createAuditLog ])` — all succeed or all rollback |
| T2 | `interactive transactions` for complex logic | BE Dev | 2h | `$transaction(async (tx) => { const sub = await tx.subscription.findUnique(...); if (!sub) throw; ... })` |
| T3 | Prisma middleware for audit logging | BE Dev | 2h | `prisma.$use(async (params, next) => { before = ...; result = await next(params); if mutate → write AuditLog })` |
| T4 | Pagination with Prisma `cursor` | BE Dev | 1h | `findMany({ take: 20, skip: 1, cursor: { id: lastId } })` for efficient pagination |
| T5 | Tests | QA | 3h | Simulate payment failure mid-transaction, verify rollback, audit log written |

---

### Story 8.2.2 — Dual Database Strategy (MongoDB + PostgreSQL)

> **As a** developer,
> **I want to** clearly define which data lives in MongoDB vs PostgreSQL,
> **so that** each database is used for what it's best at.

**Story Points**: 3 | **Estimate**: 1.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Document data model decision | BE Dev | 1h | MongoDB: Tasks, Projects, Comments, ActivityFeed (flexible, document-like). PostgreSQL: Users, Payments, Subscriptions, AuditLogs (relational, ACID) |
| T2 | Cross-DB join utility | BE Dev | 2h | `getUserWithTasks(userId)` — fetch User from Prisma, fetch Tasks from Mongoose, merge in service layer |
| T3 | Sync user creation to both DBs | BE Dev | 2h | On `auth/register`: create Mongoose User (for tasks/projects) + Prisma User (for billing). Wrap in a saga/compensation pattern |

---

---

# EPIC 9 — Redis

> **Goal**: Redis used for caching API responses, storing sessions, rate limiting, Pub/Sub for real-time events, and job queue backing.
> **Priority**: 🔴 P0 (Sprint 3–4)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 9.1 — Cache Middleware

---

### Story 9.1.1 — Response Caching Middleware

> **As a** developer,
> **I want to** cache expensive API responses in Redis,
> **so that** repeated reads return in < 5ms without hitting the database.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `middleware/cache.ts` — generic cache middleware | BE Dev | 2h | `cache(ttl)` — key = `cache:${req.user.id}:${req.originalUrl}`, check Redis, serve or store |
| T2 | `redisHelper.get<T>()` and `set<T>()` | BE Dev | 1h | Typed wrappers: `get<T>(key): Promise<T\|null>`, `set<T>(key, val, ttl)` — JSON serialize/deserialize |
| T3 | `invalidatePattern(pattern)` | BE Dev | 1h | `SCAN` with match pattern → `DEL` matching keys. Used after mutations |
| T4 | Apply cache to analytics & task list | BE Dev | 1h | `router.get('/tasks', authenticate, cache(60), getTasks)` |
| T5 | Cache key strategy | BE Dev | 0.5h | Document: include `userId` in key (avoid cache poisoning), include query string hash |
| T6 | Tests | QA | 2h | Cache hit returns faster, cache miss fetches DB, mutation invalidates cache |

---

## Feature 9.2 — Redis Rate Limiting

---

### Story 9.2.1 — IP + User Rate Limiting

> **As a** security engineer,
> **I want to** rate-limit API requests using Redis,
> **so that** abuse, brute-force, and DDoS attempts are throttled.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Global rate limiter (IP-based) | BE Dev | 1h | `express-rate-limit` with `rate-limit-redis` store — 100 req/15min per IP |
| T2 | Auth route limiter | BE Dev | 1h | `/auth/login` — 10 attempts/15min per IP. Return `Retry-After` header |
| T3 | User-based limiter | BE Dev | 1h | For authenticated users: 1000 req/hour. Key: `ratelimit:user:${userId}` |
| T4 | Custom Redis `INCR` + `EXPIRE` limiter | BE Dev | 2h | Manual implementation: `INCR key` → if `== 1` set `EXPIRE`. Compare against limit. Return `429` with `X-RateLimit-*` headers |
| T5 | Rate limit headers | BE Dev | 0.5h | `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset` in every response |
| T6 | Tests | QA | 2h | Exhaust limit, verify 429, verify header values, verify reset after window |

---

## Feature 9.3 — Redis Pub/Sub for Notifications

---

### Story 9.3.1 — Pub/Sub for Cross-Instance Real-Time Events

> **As a** developer,
> **I want to** use Redis Pub/Sub to broadcast events across server instances,
> **so that** WebSocket notifications work correctly in a multi-node deployment.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `config/redisPubSub.ts` — separate pub and sub clients | BE Dev | 1h | Redis requires separate client connections for pub vs sub (sub client is blocked) |
| T2 | Publish notification after task creation | BE Dev | 1h | `publisher.publish('notifications', JSON.stringify({ userId, type, payload }))` |
| T3 | Subscribe on server startup | BE Dev | 2h | `subscriber.subscribe('notifications', (msg) => { const { userId } = JSON.parse(msg); io.to(userId).emit('notification', ...) })` |
| T4 | Publish task events for socket broadcast | BE Dev | 1h | After `updateTask` → publish to `task-events:${projectId}` channel → all instances broadcast to project room |
| T5 | Redis Streams vs Pub/Sub decision doc | BE Dev | 0.5h | Document: Pub/Sub = fire-and-forget (no persistence). Streams = persistent log. Use Streams for audit if needed |
| T6 | Tests | QA | 2h | Publish event → verify all socket.io connections receive it (simulate multi-instance) |

---

---

# EPIC 10 — File Upload

> **Goal**: Handle file uploads (avatars, task attachments) via Multer, with Cloudinary for images and S3 for documents.
> **Priority**: 🟡 P1 (Sprint 5)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 10.1 — Multer + Cloudinary for Images

---

### Story 10.1.1 — Avatar & Attachment Upload

> **As a** user,
> **I want to** upload images for my avatar and task attachments,
> **so that** visual content is associated with my account and tasks.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `config/multer.ts` — memory storage + file filter | BE Dev | 1h | `memoryStorage()`, filter: allow only `jpeg\|png\|gif\|webp\|pdf\|docx`, max 10MB |
| T2 | `utils/cloudinary.ts` — stream-based upload | BE Dev | 2h | `streamifier.createReadStream(buffer).pipe(cloudinary.uploader.upload_stream({ folder }, callback))` — no temp file written to disk |
| T3 | `POST /users/me/avatar` | BE Dev | 1h | `upload.single('avatar')` → validate → upload → update User.avatar URL → delete old Cloudinary asset |
| T4 | `POST /tasks/:id/attachments` | BE Dev | 2h | `upload.array('files', 10)` → upload all → push `{ url, publicId, name, size, type }` to task.attachments |
| T5 | `DELETE /tasks/:id/attachments/:attachmentId` | BE Dev | 1h | Remove from task.attachments array, delete from Cloudinary by `publicId` |
| T6 | Signed Cloudinary URLs for private assets | BE Dev | 1h | Generate short-lived signed URL for sensitive attachments (`cloudinary.url(publicId, { sign_url: true, expires_at: ... })`) |
| T7 | Tests | QA | 2h | Upload avatar, attachment, delete, file type rejection, size rejection |

---

## Feature 10.2 — AWS S3 for Documents

---

### Story 10.2.1 — S3 Upload for Large Documents

> **As a** user,
> **I want to** attach large documents (PDF, XLSX) to tasks,
> **so that** all task-related files are accessible from one place.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `utils/s3.ts` — AWS SDK v3 upload | BE Dev | 2h | `PutObjectCommand` with `{ Bucket, Key: uuid-filename, Body: buffer, ContentType }`. Return public or presigned URL |
| T2 | Presigned GET URLs | BE Dev | 1h | `GetObjectCommand` → `getSignedUrl(s3, command, { expiresIn: 3600 })` — files never directly public |
| T3 | Route: upload → S3 for docs, Cloudinary for images | BE Dev | 1h | Decision in controller based on `file.mimetype` — images → Cloudinary, documents → S3 |
| T4 | S3 lifecycle policy | BE Dev | 0.5h | Document: configure S3 lifecycle rule to delete files for deleted tasks after 90 days |

---

---

# EPIC 11 — WebSockets & Real-Time

> **Goal**: Socket.io for real-time task updates, collaboration indicators, and notifications. Redis adapter for multi-node scaling.
> **Priority**: 🟡 P1 (Sprint 5–6)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 11.1 — Socket.io Server

---

### Story 11.1.1 — Authenticated Socket.io Setup

> **As a** developer,
> **I want to** set up Socket.io with JWT authentication middleware,
> **so that** only authenticated users can connect and join project rooms.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `sockets/index.ts` — Server init | BE Dev | 2h | `new Server(httpServer, { cors, transports: ['websocket', 'polling'] })` |
| T2 | Auth middleware on socket | BE Dev | 2h | `io.use(async (socket, next) => { verify token from socket.handshake.auth.token → attach socket.data.user → next() })` |
| T3 | Connection handler | BE Dev | 1h | On `connection`: auto-join `user:${userId}` room for personal notifications, log connect |
| T4 | `join:project` / `leave:project` events | BE Dev | 1h | Validate user is project member before joining project room |
| T5 | Emit helpers | BE Dev | 1h | `emitToUser(userId, event, data)`, `emitToProject(projectId, event, data)`, `emitToAll(event, data)` |
| T6 | Disconnect cleanup | BE Dev | 1h | On `disconnect`: emit `user:left` to their project rooms, clear presence in Redis |
| T7 | Tests | QA | 2h | Connect with valid/invalid token, join project room, receive task event |

---

## Feature 11.2 — Redis Adapter for Horizontal Scaling

---

### Story 11.2.1 — Socket.io Redis Adapter

> **As a** DevOps engineer,
> **I want to** use Socket.io Redis adapter,
> **so that** events emitted on one server instance are received by clients connected to any instance.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Install `@socket.io/redis-adapter` | BE Dev | 0.5h | Create pub + sub Redis clients (separate from main client) |
| T2 | `io.adapter(createAdapter(pubClient, subClient))` | BE Dev | 1h | Configure before server listens |
| T3 | Sticky sessions in Nginx (if using polling) | BE Dev | 1h | `ip_hash` in Nginx upstream for long-polling fallback. WebSocket doesn't need this |
| T4 | Test multi-instance emit | BE Dev | 2h | Run 2 server instances, connect clients to different instances, verify events received cross-instance |
| T5 | Presence tracking in Redis | BE Dev | 2h | `SADD presence:project:${projectId} ${userId}` on join, `SREM` on leave. `SMEMBERS` to get online users |

---

## Feature 11.3 — Real-Time Task Events

---

### Story 11.3.1 — Emit Task Events from Service Layer

> **As a** developer,
> **I want to** emit Socket.io events after every task mutation,
> **so that** all connected collaborators see updates instantly.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Inject `io` into TaskService | BE Dev | 1h | Pass `io` via constructor or use `app.get('io')` in service. Avoid circular deps |
| T2 | Emit `task:created` after create | BE Dev | 1h | `io.to('project:${task.projectId}').emit('task:created', { task, actorId })` |
| T3 | Emit `task:updated` with diff | BE Dev | 1h | Compute diff `{ field, oldValue, newValue }[]` before save, emit with task + diff |
| T4 | Emit `task:deleted` | BE Dev | 0.5h | Emit `{ taskId, projectId }` — frontend removes from board |
| T5 | Emit `user:typing` for comments | BE Dev | 1h | Throttled emit when user is typing in comment box — `debounce(emit, 500)` |

---

---

# EPIC 12 — Message Queues (Bull / BullMQ)

> **Goal**: Async background job processing for emails, image processing, notifications, and scheduled tasks using BullMQ.
> **Priority**: 🔴 P0 (Sprint 4–5)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 12.1 — Email Queue

---

### Story 12.1.1 — Transactional Email Queue

> **As a** developer,
> **I want to** process all transactional emails via a BullMQ queue,
> **so that** email sending never blocks an API response and failed emails are retried.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `jobs/queues/emailQueue.ts` | BE Dev | 1h | `new Queue('email', { connection, defaultJobOptions: { attempts: 3, backoff: { type:'exponential', delay:2000 } } })` |
| T2 | `jobs/workers/emailWorker.ts` | BE Dev | 2h | `new Worker('email', async (job) => { switch(job.name) { case 'verify-email': ...; case 'reset-password': ...; case 'task-assigned': ... } }, { connection, concurrency: 5 })` |
| T3 | Email templates with Handlebars | BE Dev | 3h | `templates/verify-email.hbs`, `task-assigned.hbs`, `digest.hbs` — compile with `handlebars.compile()` |
| T4 | Nodemailer transport | BE Dev | 1h | SES in prod (`aws-sdk`), Mailtrap in dev. `transporter.sendMail({ from, to, subject, html })` |
| T5 | Dead letter queue | BE Dev | 1h | After 3 failed attempts → move to `email-failed` queue with full error. Alert on-call via Slack webhook |
| T6 | Bull Board UI for monitoring | BE Dev | 1h | `@bull-board/express` mounted at `/admin/queues` (admin-only) — visual job monitoring |
| T7 | Tests | QA | 2h | Add job, process, retry on failure, dead letter, worker event listeners |

---

## Feature 12.2 — Scheduled Jobs (CRON)

---

### Story 12.2.1 — Recurring Background Jobs

> **As a** system,
> **I want to** run scheduled background jobs,
> **so that** tasks like due-date reminders and cleanup happen automatically.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | CRON: Due date reminder (daily 8 AM) | BE Dev | 2h | `queue.add('due-date-reminder', {}, { repeat: { cron: '0 8 * * *' } })` — find tasks due tomorrow, queue notification email for each assignee |
| T2 | CRON: Overdue task alert (daily 9 AM) | BE Dev | 1h | Find tasks past due date, not done → push notification + email to assignee + project admin |
| T3 | CRON: Weekly digest (Monday 7 AM) | BE Dev | 2h | Per user: compile task stats for last week, render digest template, queue email |
| T4 | CRON: Purge soft-deleted data (weekly) | BE Dev | 1h | Delete Users/Tasks/Projects with `deletedAt` older than 30 days |
| T5 | CRON: Clean expired tokens (daily) | BE Dev | 0.5h | Remove expired `passwordResetToken`, `emailVerificationToken` from User documents |
| T6 | Ensure CRON runs only on 1 instance | BE Dev | 1h | In cluster mode, only master process schedules CRON jobs. Flag: `if (cluster.isPrimary)` |
| T7 | Tests | QA | 2h | Mock timers, verify job triggered, verify correct data fetched |

---

## Feature 12.3 — Notification Queue

---

### Story 12.3.1 — Push Notification Queue

> **As a** developer,
> **I want to** queue push notifications through BullMQ,
> **so that** push delivery is reliable and retried on failure.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `jobs/queues/notificationQueue.ts` | BE Dev | 0.5h | Separate queue for push notifications |
| T2 | `jobs/workers/notificationWorker.ts` | BE Dev | 2h | Use `web-push` library — `webpush.sendNotification(subscription, payload)`. Handle `410 Gone` → delete subscription from DB |
| T3 | Batch push to multiple subscribers | BE Dev | 1h | For project-wide events: `Promise.allSettled(subscriptions.map(sub => sendPush(sub, payload)))` |
| T4 | Notification preferences check | BE Dev | 1h | Before queuing: check `user.notificationPrefs.taskAssigned === true`. Respect user preferences |

---

---

# EPIC 13 — Kafka Event Streaming

> **Goal**: Kafka for high-throughput event streaming between services. Task lifecycle events, audit log streaming, analytics pipeline.
> **Priority**: 🟡 P1 (Sprint 6–7)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 13.1 — Kafka Producer

---

### Story 13.1.1 — Task Event Producer

> **As a** developer,
> **I want to** publish task lifecycle events to Kafka topics,
> **so that** downstream services (analytics, audit) can consume them without coupling.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `config/kafka.ts` — KafkaJS client | BE Dev | 1h | `new Kafka({ clientId: 'taskflow-api', brokers: [...], ssl, sasl })` — connect with retry |
| T2 | `OrderTopic` / `TaskTopic` enum | BE Dev | 0.5h | `enum TaskTopic { CREATED = 'task.created', UPDATED = 'task.updated', DELETED = 'task.deleted', ASSIGNED = 'task.assigned' }` |
| T3 | `TaskProducer` class | BE Dev | 2h | Singleton producer with lazy `connect()`. `publish(topic, key, value)` — serialize to JSON, include `eventId` (UUID), `timestamp`, `version` in envelope |
| T4 | Partition by `projectId` | BE Dev | 1h | Set `key: projectId` — all events for same project go to same partition, preserving order |
| T5 | Idempotent producer config | BE Dev | 0.5h | `idempotent: true` + `transactionalId` — exactly-once delivery guarantee |
| T6 | Produce after each task mutation | BE Dev | 1h | In TaskService: after DB write → `taskProducer.publish(TaskTopic.UPDATED, task.projectId, { taskId, changes, actorId })` |
| T7 | Tests | QA | 2h | Mock producer, verify message shape, verify key/topic |

---

## Feature 13.2 — Kafka Consumer

---

### Story 13.2.1 — Analytics & Audit Log Consumer

> **As a** developer,
> **I want to** consume Kafka task events in dedicated consumer services,
> **so that** analytics and audit are decoupled from the main API.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `TaskAnalyticsConsumer` — consumer group | BE Dev | 2h | `groupId: 'analytics-service'`, subscribe to all `task.*` topics, write to time-series analytics collection |
| T2 | `AuditLogConsumer` — consumer group | BE Dev | 2h | `groupId: 'audit-service'`, subscribe to all topics, write to PostgreSQL `AuditLog` via Prisma |
| T3 | Consumer error handling | BE Dev | 1h | Wrap message handler in `try/catch`. On error: log + commit offset anyway (avoid infinite loop). Route to dead letter topic |
| T4 | Dead letter topic | BE Dev | 1h | Unprocessable messages → `task.events.dlq` topic. Separate consumer logs and alerts |
| T5 | `eachBatchAutoResolve` for throughput | BE Dev | 2h | Process messages in batches of 100 rather than one-by-one — 10x throughput improvement |
| T6 | Consumer lag monitoring | BE Dev | 1h | Expose `/metrics/kafka-lag` endpoint — current offset vs latest offset per partition |
| T7 | Tests | QA | 2h | Publish test event, verify consumer processes, verify audit log created |

---

## Feature 13.3 — Saga Pattern for Distributed Transactions

---

### Story 13.3.1 — Order/Payment Saga

> **As a** developer,
> **I want to** implement the Saga pattern for the subscription upgrade flow,
> **so that** partial failures across services are handled with compensating transactions.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Define Saga steps | BE Dev | 1h | Upgrade flow: `CreatePaymentIntent` → `ChargePayment` → `UpdateSubscription` → `SendEmail`. Each step has compensation |
| T2 | Choreography-based Saga via Kafka | BE Dev | 3h | Each service listens for its trigger event, processes, emits next event or compensation event on failure |
| T3 | Saga state machine | BE Dev | 2h | Track saga state in Redis `HASH`: `{ sagaId, step, status, compensations[] }` |
| T4 | Compensation handlers | BE Dev | 2h | If `UpdateSubscription` fails after payment: emit `payment.refund` event → PaymentService refunds Stripe charge |

---

---

# EPIC 14 — Payment Integration

> **Goal**: Stripe integration for subscriptions (Pro plan), one-time payments, webhooks, and refunds.
> **Priority**: 🟡 P1 (Sprint 7–8)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 14.1 — Stripe Subscriptions

---

### Story 14.1.1 — Subscription Checkout

> **As a** user,
> **I want to** upgrade to the Pro plan,
> **so that** I can access unlimited projects and advanced features.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /payments/create-checkout-session` | BE Dev | 2h | Create Stripe Checkout Session with `mode: 'subscription'`, `price_id`, `success_url`, `cancel_url` |
| T2 | `POST /payments/create-customer` | BE Dev | 1h | Create Stripe Customer on first payment, save `stripeCustomerId` to Prisma User |
| T3 | `POST /payments/create-payment-intent` | BE Dev | 1h | For one-time payments: `stripe.paymentIntents.create({ amount, currency, customer, metadata: { userId, plan } })` |
| T4 | `GET /payments/subscription` | BE Dev | 1h | Return current subscription status, plan, renewal date, payment method last 4 |
| T5 | Customer portal session | BE Dev | 1h | `stripe.billingPortal.sessions.create` — redirect user to Stripe portal to manage billing |
| T6 | Tests | QA | 3h | Mock Stripe SDK, test checkout session creation, test customer creation |

---

## Feature 14.2 — Stripe Webhooks

---

### Story 14.2.1 — Webhook Handler with Prisma Transaction

> **As a** developer,
> **I want to** handle Stripe webhook events reliably,
> **so that** subscription status, payments, and access are always in sync with Stripe.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /payments/webhook` endpoint (raw body) | BE Dev | 1h | Must use `express.raw({ type: 'application/json' })` before JSON parser for this route |
| T2 | Stripe signature verification | BE Dev | 1h | `stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET)` — throw if invalid |
| T3 | Idempotency: check processed events | BE Dev | 1h | Store `stripeEventId` in DB. Check before processing. Return 200 immediately if already processed |
| T4 | Handle `checkout.session.completed` | BE Dev | 2h | `$transaction`: create Payment record, update Subscription to `active`, unlock Pro features, queue welcome email |
| T5 | Handle `invoice.payment_failed` | BE Dev | 1h | Update subscription to `past_due`, email user, restrict Pro features after grace period |
| T6 | Handle `customer.subscription.deleted` | BE Dev | 1h | Downgrade to Free plan, update DB, notify user |
| T7 | Webhook replay / retry strategy | BE Dev | 1h | Stripe retries on 5xx. Idempotency key ensures safe retry. Log all events to AuditLog |
| T8 | Tests | QA | 3h | Simulate each webhook event type, verify DB changes, verify idempotency |

---

## Feature 14.3 — Refunds

---

### Story 14.3.1 — Refund Processing

> **As an** admin,
> **I want to** process refunds for payments,
> **so that** customer service can handle billing disputes.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `POST /payments/:paymentId/refund` (admin only) | BE Dev | 2h | `stripe.refunds.create({ payment_intent: paymentIntentId, amount?, reason })` |
| T2 | Prisma transaction on refund | BE Dev | 1h | Update Payment status to `refunded`, create AuditLog, downgrade subscription if full refund |
| T3 | Partial refund support | BE Dev | 1h | `amount` in cents optional — if omitted, full refund. Validate amount ≤ original |
| T4 | Tests | QA | 1h | Mock Stripe refund, verify Payment updated, audit log created |

---

---

# EPIC 15 — Security & Rate Limiting

> **Goal**: OWASP Top 10 mitigations, security headers, input sanitization, comprehensive rate limiting.
> **Priority**: 🔴 P0 — Cross-cutting (Sprint 1 + ongoing)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 15.1 — Security Hardening

---

### Story 15.1.1 — OWASP Top 10 Mitigation

> **As a** security engineer,
> **I want to** apply all OWASP Top 10 mitigations,
> **so that** the API is protected against the most common attack vectors.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `helmet()` — security headers | BE Dev | 0.5h | CSP, HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy. Configure CSP allow-list |
| T2 | CORS configuration | BE Dev | 1h | Whitelist `ALLOWED_ORIGINS` from env. Reject others with 403. Allow specific methods/headers only |
| T3 | SQL/NoSQL injection prevention | BE Dev | 1h | `express-mongo-sanitize` — strip `$` and `.` from req.body/params. Prisma parameterized queries for PostgreSQL |
| T4 | XSS prevention | BE Dev | 1h | `xss-clean` middleware — sanitize all input. `DOMPurify` on any HTML fields. `Content-Security-Policy` header |
| T5 | Parameter pollution prevention | BE Dev | 0.5h | `hpp()` middleware — strip duplicate query params, keep last value |
| T6 | Request size limits | BE Dev | 0.5h | `express.json({ limit: '10kb' })` for API, `50mb` for file upload routes only |
| T7 | Dependency audit in CI | BE Dev | 0.5h | `npm audit --audit-level=high` in GitHub Actions — fail on high severity |
| T8 | Security headers test | QA | 2h | `nmap --script=http-security-headers` + manual check with securityheaders.com |

---

### Story 15.1.2 — IP Allowlist & Suspicious Activity Detection

> **As a** security engineer,
> **I want to** detect and block suspicious activity patterns,
> **so that** the API is protected against automated attacks.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | IP blacklist middleware | BE Dev | 1h | Maintain Redis `SET blacklisted-ips`. Check on every request. Block with 403 |
| T2 | Auto-blacklist on 429 burst | BE Dev | 2h | If IP exceeds 1000 req/min → auto-add to blacklist for 1 hour, alert admin via Slack |
| T3 | Suspicious pattern detection | BE Dev | 2h | Detect: many login attempts across different accounts from same IP → block IP, alert |
| T4 | Audit all auth events | BE Dev | 1h | Log to AuditLog: every login attempt, success, failure, IP, user-agent, timestamp |

---

---

# EPIC 16 — Validation

> **Goal**: All incoming request data validated and sanitized using Zod before reaching controllers.
> **Priority**: 🔴 P0 (Sprint 1 + ongoing)
> **Total Estimate**: **5 Story Points** | ~**1 week**

---

## Feature 16.1 — Request Validation Middleware

---

### Story 16.1.1 — Zod Validation Middleware

> **As a** developer,
> **I want to** validate all request bodies, params, and query strings with Zod,
> **so that** invalid data never reaches business logic.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `middleware/validate.ts` | BE Dev | 1h | `validate(schema, target: 'body'\|'params'\|'query')` — parse with `schema.safeParse()`, throw `AppError` with field errors on failure |
| T2 | `validators/taskValidators.ts` | BE Dev | 2h | `createTaskSchema`, `updateTaskSchema`, `taskQuerySchema` (with `.transform()` for coercion) |
| T3 | `validators/authValidators.ts` | BE Dev | 1h | `registerSchema`, `loginSchema`, `resetPasswordSchema` |
| T4 | Apply validators to all routes | BE Dev | 1h | `router.post('/tasks', authenticate, validate(createTaskSchema, 'body'), createTask)` |
| T5 | Zod error → user-friendly format | BE Dev | 1h | Transform Zod `ZodError` to `{ field: 'title', message: 'Title is required' }[]` |
| T6 | Tests | QA | 2h | Submit invalid data to each endpoint, verify 400 with field-level errors |

---

### Story 16.1.2 — Sanitization

> **As a** developer,
> **I want to** sanitize all string inputs,
> **so that** XSS and injection attacks are prevented at the input level.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Custom Zod `.transform()` for sanitization | BE Dev | 1h | `.transform(s => s.trim())` on all string fields. Strip HTML tags on description field with `sanitize-html` |
| T2 | URL validation for attachment links | BE Dev | 0.5h | `z.string().url()` — reject non-URL strings in URL fields |
| T3 | Enum validation | BE Dev | 0.5h | `z.nativeEnum(TaskStatus)` — reject invalid enum values with clear error message |

---

---

# EPIC 17 — Error Handling & Logging

> **Goal**: Centralized error handling with custom error classes, structured logging with Winston, and Sentry for production error tracking.
> **Priority**: 🔴 P0 (Sprint 1)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 17.1 — Error Handling Architecture

---

### Story 17.1.1 — AppError Class & Global Error Handler

> **As a** developer,
> **I want to** have a custom error class and global error handler,
> **so that** all errors are caught, formatted consistently, and returned to the client appropriately.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `utils/AppError.ts` class | BE Dev | 1h | `class AppError extends Error { statusCode, status ('fail'\|'error'), isOperational }`. Constructor sets all fields |
| T2 | `middleware/errorHandler.ts` — global handler | BE Dev | 3h | Handle: `AppError` (operational), `ValidationError` (Mongoose), `CastError` (invalid ObjectId), `ZodError`, `JsonWebTokenError`, `TokenExpiredError`, `PrismaClientKnownRequestError` (P2002=unique), `MongoServerError` (11000=duplicate) |
| T3 | Dev vs Prod error response | BE Dev | 1h | Dev: full stack trace + error details. Prod: sanitized message only. Never leak stack in prod |
| T4 | Unhandled rejection + exception handlers | BE Dev | 1h | `process.on('unhandledRejection', ...)` + `process.on('uncaughtException', ...)` → log + graceful shutdown |
| T5 | Tests | QA | 2h | Throw each error type, verify correct status code and message shape |

---

## Feature 17.2 — Structured Logging

---

### Story 17.2.1 — Winston + Morgan Logging

> **As a** DevOps engineer,
> **I want to** have structured JSON logs with Winston,
> **so that** logs can be indexed and searched in CloudWatch / Datadog.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `utils/logger.ts` — Winston setup | BE Dev | 2h | Transports: `Console` (colorized in dev, JSON in prod), `DailyRotateFile` (error.log + combined.log, 14d retention) |
| T2 | Log levels | BE Dev | 0.5h | `error`, `warn`, `info`, `http`, `debug`. `LOG_LEVEL` env controls minimum level |
| T3 | Morgan HTTP access log | BE Dev | 0.5h | `morgan('combined', { stream: { write: msg => logger.http(msg.trim()) } })` |
| T4 | Request ID middleware | BE Dev | 1h | `uuid()` per request → `req.requestId` → added to every log entry in that request's context |
| T5 | Sentry integration | BE Dev | 1h | `@sentry/node` — `Sentry.init()` in app.ts, `Sentry.captureException(err)` in error handler for production `isOperational: false` errors |
| T6 | Log sensitive data masking | BE Dev | 1h | Never log passwords, tokens, credit card numbers. `logger.info({ user: { id, email } })` — never log full user object |

---

## Feature 17.3 — Health Monitoring

---

### Story 17.3.1 — Health Check & Metrics Endpoint

> **As a** DevOps engineer,
> **I want to** expose health check and metrics endpoints,
> **so that** load balancers and monitoring tools can verify service health.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `GET /health` — liveness check | BE Dev | 0.5h | Returns `{ status: 'ok', uptime, timestamp }` — always 200 if process is alive |
| T2 | `GET /health/ready` — readiness check | BE Dev | 1h | Check: MongoDB connected, Redis connected, PostgreSQL connected. Return `{ status, checks: { mongo, redis, postgres } }`. 503 if any fail |
| T3 | `GET /metrics` — Prometheus format | BE Dev | 2h | `prom-client` — expose: `http_requests_total`, `http_request_duration_ms`, `active_connections`, `queue_depth` |

---

---

# EPIC 18 — Testing

> **Goal**: 80%+ test coverage with unit tests (Jest), integration tests (Supertest), and proper mocking.
> **Priority**: 🟡 P1 (Sprint 8–9)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 18.1 — Unit Testing

---

### Story 18.1.1 — Service Layer Unit Tests

> **As a** developer,
> **I want to** unit test all service functions in isolation,
> **so that** business logic is verified without database dependencies.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Jest + ts-jest setup | BE Dev | 1h | `jest.config.ts` — `preset: 'ts-jest'`, path aliases, coverage provider v8 |
| T2 | Mock factories | QA | 2h | `factories/user.factory.ts`, `task.factory.ts` — `faker.js` generated test data |
| T3 | `AuthService` unit tests | QA | 3h | Test: register (mock User.findOne, bcrypt, emit), login (wrong password, locked account), refresh token (blacklist check) |
| T4 | `TaskService` unit tests | QA | 3h | Test: createTask (mock Task.create, emit, cache invalidate), updateTask (diff calculation), deleteTask (cascade) |
| T5 | `UserService` unit tests | QA | 2h | Test: getUserById (not found throws), updateUser (restricted fields blocked) |
| T6 | Coverage report | QA | 1h | `--coverage` — assert ≥ 80% lines, ≥ 75% branches in CI |

---

## Feature 18.2 — Integration Testing

---

### Story 18.2.1 — Supertest API Integration Tests

> **As a** developer,
> **I want to** write integration tests using Supertest + MongoMemoryServer,
> **so that** full request/response cycles are tested against a real in-memory database.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `MongoMemoryServer` setup | QA | 1h | `globalSetup.ts` — start in-memory MongoDB, set `MONGO_URI`, stop in `globalTeardown.ts` |
| T2 | Test DB reset between tests | QA | 1h | `beforeEach` → `mongoose.connection.dropDatabase()` — clean state per test |
| T3 | Auth integration tests | QA | 3h | `POST /auth/register` (201, 409 duplicate), `POST /auth/login` (200, 401, lockout), `POST /auth/refresh` (rotation) |
| T4 | Task CRUD integration tests | QA | 3h | Full flow: register → login → create project → create task → update → delete. Assert DB state after each |
| T5 | Protected route tests | QA | 2h | No token → 401, wrong role → 403, valid token → 200 |
| T6 | Pagination tests | QA | 1h | Seed 50 tasks, assert `GET /tasks?page=2&limit=10` returns correct slice and meta |

---

## Feature 18.3 — Mocking External Services

---

### Story 18.3.1 — Mock Redis, Stripe, Email in Tests

> **As a** developer,
> **I want to** mock all external dependencies in tests,
> **so that** tests are fast, deterministic, and don't cost money.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Mock Redis with `ioredis-mock` | QA | 1h | `jest.mock('../config/redis', () => require('ioredis-mock'))` |
| T2 | Mock Stripe with `stripe-mock` | QA | 1h | Run `stripe/stripe-mock` Docker image in CI. Point `STRIPE_BASE_URL` to it in test env |
| T3 | Mock email sending | QA | 0.5h | `jest.spyOn(transporter, 'sendMail').mockResolvedValue({ messageId: 'mock-id' })` |
| T4 | Mock Cloudinary upload | QA | 0.5h | `jest.mock('../utils/cloudinary', () => ({ uploadToCloudinary: jest.fn().mockResolvedValue({ url: 'mock-url', publicId: 'mock-id' }) }))` |
| T5 | Mock BullMQ queue | QA | 1h | `jest.mock('bullmq')` — mock `Queue.add()` to be a no-op, assert it was called with correct args |

---

---

# EPIC 19 — Performance Optimization

> **Goal**: API responds in < 100ms p95. Handles 10k concurrent users. No event loop blocking.
> **Priority**: 🟡 P1 (Sprint 9–10)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 19.1 — Database Query Optimization

---

### Story 19.1.1 — Index Optimization & Query Analysis

> **As a** developer,
> **I want to** analyze and optimize all slow database queries,
> **so that** the API meets p95 < 100ms response time targets.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Enable slow query logging | BE Dev | 0.5h | Mongoose: `mongoose.set('debug', true)`. Log queries taking > 100ms in prod |
| T2 | `.explain()` on all major query paths | BE Dev | 2h | Run `explain("executionStats")` on getTasks, getProjects, search. Ensure `IXSCAN` not `COLLSCAN` |
| T3 | Add missing indexes | BE Dev | 1h | Based on explain output — add compound indexes as needed |
| T4 | `.lean()` on read-only queries | BE Dev | 1h | Replace `Task.find()` with `Task.find().lean()` on list endpoints — 2-3x faster, no Mongoose document overhead |
| T5 | `select('-__v -updatedAt')` projection | BE Dev | 0.5h | Only fetch needed fields, reduce document size |
| T6 | Connection pool tuning | BE Dev | 0.5h | `mongoose.connect(uri, { maxPoolSize: 10, minPoolSize: 5 })` for MongoDB. `Pool({ max: 20 })` for pg |
| T7 | Load test | QA | 2h | `autocannon -c 200 -d 60 http://api/tasks` — target < 100ms p95 |

---

## Feature 19.2 — Response Compression & HTTP/2

---

### Story 19.2.1 — Compression & Payload Optimization

> **As a** developer,
> **I want to** compress API responses and reduce payload sizes,
> **so that** bandwidth usage is minimized and response times improve on slow networks.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `compression` middleware | BE Dev | 0.5h | `app.use(compression({ threshold: 1024 }))` — compress responses > 1KB |
| T2 | Brotli compression in Nginx | BE Dev | 0.5h | Nginx handles Brotli (better than gzip) for static assets. Node handles dynamic responses |
| T3 | HTTP/2 via Nginx | BE Dev | 0.5h | `listen 443 ssl http2;` in Nginx config — multiplexing, header compression |
| T4 | Etag + Conditional GET | BE Dev | 1h | Express sets ETag by default. Add `If-None-Match` support — return 304 for unchanged resources |
| T5 | Response time header | BE Dev | 0.5h | `X-Response-Time` header via `response-time` middleware — visible in API responses |

---

## Feature 19.3 — Event Loop Monitoring

---

### Story 19.3.1 — Event Loop Lag Monitoring

> **As a** DevOps engineer,
> **I want to** monitor event loop lag,
> **so that** I can detect blocking operations before they degrade performance.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `toobusy-js` — event loop lag guard | BE Dev | 1h | Return 503 immediately if event loop lag > 70ms — "Server too busy" with `Retry-After` |
| T2 | Custom event loop lag metric | BE Dev | 2h | `setInterval` ping every 500ms, compare actual vs expected — expose as Prometheus gauge |
| T3 | Block detection via `blocked` package | BE Dev | 1h | Alert (log + Slack) if any tick takes > 100ms |
| T4 | CPU profiling on demand | BE Dev | 1h | `GET /admin/profile/start` + `GET /admin/profile/stop` (admin only) — generate V8 CPU profile for analysis |

---

---

# EPIC 20 — Microservices & API Gateway

> **Goal**: Decompose the monolith into microservices, add API Gateway, implement Circuit Breaker and service discovery.
> **Priority**: 🟢 P2 — Nice to have at scale (Sprint 11–12)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

## Feature 20.1 — API Gateway

---

### Story 20.1.1 — Express API Gateway

> **As a** DevOps engineer,
> **I want to** build a lightweight Express API Gateway,
> **so that** clients have a single entry point and cross-cutting concerns are centralized.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `gateway/app.ts` — dedicated gateway service | BE Dev | 2h | Separate Express app on port 8080. Routes: `/tasks/*` → task-service, `/auth/*` → auth-service, `/payments/*` → payment-service |
| T2 | `http-proxy-middleware` for routing | BE Dev | 2h | `createProxyMiddleware({ target: SERVICE_URL, changeOrigin: true, pathRewrite })` per service |
| T3 | Correlation ID middleware | BE Dev | 1h | Generate `X-Correlation-ID` (UUID) per request → forward to all upstream services → log in all services |
| T4 | Gateway auth middleware | BE Dev | 1h | Verify JWT once at gateway → forward `x-user-id`, `x-user-role` headers downstream. Services trust gateway headers |
| T5 | BFF (Backend for Frontend) aggregation | BE Dev | 3h | `GET /dashboard` — gateway calls tasks-service + analytics-service + notifications-service in parallel → merge response |
| T6 | Health aggregation endpoint | BE Dev | 1h | `GET /health` — calls each service health endpoint in parallel → aggregate status |
| T7 | Tests | QA | 2h | Test routing to correct service, correlation ID propagation, auth header forwarding |

---

## Feature 20.2 — Circuit Breaker

---

### Story 20.2.1 — opossum Circuit Breaker

> **As a** developer,
> **I want to** implement circuit breakers for inter-service calls,
> **so that** a failing downstream service doesn't cascade failures to the gateway.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `opossum` circuit breaker per service | BE Dev | 2h | Wrap each proxy with `new CircuitBreaker(fn, { timeout: 3000, errorThresholdPercentage: 50, resetTimeout: 30000 })` |
| T2 | Fallback responses | BE Dev | 2h | `breaker.fallback(() => ({ error: 'Service unavailable', status: 503 }))` — return cached or empty response |
| T3 | Circuit state metrics | BE Dev | 1h | `breaker.on('open'/'close'/'halfOpen')` → emit Prometheus metrics, Slack alert on open |
| T4 | Circuit breaker dashboard | BE Dev | 2h | `GET /admin/circuit-breakers` — return state of each circuit: `{ service, state, failures, successes, lastFailure }` |
| T5 | Tests | QA | 2h | Simulate service failure → circuit opens → fallback returned → service recovers → circuit closes |

---

## Feature 20.3 — Service Decomposition

---

### Story 20.3.1 — Extract Auth Service

> **As a** developer,
> **I want to** extract authentication into a dedicated service,
> **so that** auth can be scaled, deployed, and maintained independently.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `services/auth-service/` — new package | BE Dev | 1h | Copy auth routes/controllers/services, own package.json, own port (3001) |
| T2 | Shared types package | BE Dev | 1h | `packages/shared/` — `User` type, `ApiResponse` type, `JwtPayload` type — used by all services |
| T3 | JWT verification library | BE Dev | 1h | Auth service signs tokens. Other services verify with public key (RS256 asymmetric). Never share private key |
| T4 | Docker Compose multi-service | BE Dev | 2h | `docker-compose.yml` — api-gateway, auth-service, task-service, notification-service, all with network + env config |

---

---

# EPIC 21 — Docker & CI/CD

> **Goal**: Fully containerized app with multi-stage Dockerfile, GitHub Actions CI/CD pipeline, PM2 for production process management.
> **Priority**: 🟡 P1 (Sprint 10–11)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

## Feature 21.1 — Docker

---

### Story 21.1.1 — Multi-Stage Dockerfile

> **As a** DevOps engineer,
> **I want to** build a lean production Docker image,
> **so that** the image is small, secure, and fast to pull.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Multi-stage `Dockerfile` | BE Dev | 2h | Stage 1 `builder`: `node:20-alpine`, install all deps, `tsc`. Stage 2 `runner`: copy only `dist/` + `node_modules` (prod only). `USER node` (non-root) |
| T2 | `.dockerignore` | BE Dev | 0.5h | Exclude `node_modules`, `.env`, `*.test.ts`, `coverage/`, `.git` |
| T3 | `docker-compose.yml` for local dev | BE Dev | 2h | Services: `api`, `mongodb`, `postgres`, `redis`, `kafka`, `zookeeper`. Health checks on each. Named volumes |
| T4 | Docker layer caching optimization | BE Dev | 0.5h | `COPY package*.json ./` → `npm ci` → `COPY . .` → build. Layer order maximizes cache hits |
| T5 | Image scan for vulnerabilities | BE Dev | 0.5h | `docker scan` or `trivy` in CI pipeline — fail on critical CVEs |

---

## Feature 21.2 — GitHub Actions CI/CD

---

### Story 21.2.1 — CI/CD Pipeline

> **As a** DevOps engineer,
> **I want to** automate test → build → push → deploy via GitHub Actions,
> **so that** every merge to main is automatically deployed after passing all checks.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `.github/workflows/ci.yml` — test pipeline | BE Dev | 2h | Trigger: push/PR to main. Steps: checkout → setup Node → npm ci → lint → type-check → test (with coverage) → upload to Codecov |
| T2 | `.github/workflows/cd.yml` — deploy pipeline | BE Dev | 2h | Trigger: push to main (after CI passes). Steps: Docker build → push to ECR/GHCR → SSH to server → `docker-compose pull` → `docker-compose up -d` |
| T3 | Environment secrets in GitHub | BE Dev | 0.5h | Store all secrets in GitHub Secrets: `MONGO_URI`, `JWT_SECRET`, `STRIPE_SECRET`, `DOCKER_REGISTRY_TOKEN`, `SSH_PRIVATE_KEY` |
| T4 | PM2 ecosystem config | BE Dev | 1h | `ecosystem.config.js` — `name: 'taskflow-api'`, `exec_mode: 'cluster'`, `instances: 'max'`, `watch: false`, env per environment |
| T5 | Zero-downtime deploy | BE Dev | 1h | `pm2 reload ecosystem.config.js --env production` — rolling restart, no downtime |
| T6 | Rollback strategy | BE Dev | 1h | Keep last 3 Docker images tagged. On deploy failure → `docker-compose up -d previous-image`. Auto-rollback on health check fail |
| T7 | Tests | QA | 2h | Verify CI fails on lint error, test failure, type error. Verify CD deploys only after CI green |

---

---

# Sprint Plan Summary

| Sprint | Duration | Epics / Focus | Key Deliverables | Velocity |
|---|---|---|---|---|
| **Sprint 1** | Wk 1–2 | Epic 1 + 2 + 17 | Express scaffold, env validation, cluster mode, API response standard, Winston logging, error handler | 13 SP |
| **Sprint 2** | Wk 3–4 | Epic 3 + 4 | Register, Login, JWT rotation, Google OAuth, RBAC middleware, ABAC project permissions | 21 SP |
| **Sprint 3** | Wk 5–6 | Epic 5 + 6 + 16 | Sessions/CSRF, User API, Task API, Zod validation middleware | 13 SP |
| **Sprint 4** | Wk 7–8 | Epic 7 + 8 | Mongoose schemas + indexes + aggregation + transactions, Prisma schema + migrations | 21 SP |
| **Sprint 5** | Wk 9–10 | Epic 9 + 10 | Redis cache + rate limit + Pub/Sub, File upload (Multer + Cloudinary + S3) | 21 SP |
| **Sprint 6** | Wk 11–12 | Epic 11 + 12 start | Socket.io auth + rooms + Redis adapter, Email queue + CRON jobs | 18 SP |
| **Sprint 7** | Wk 13–14 | Epic 12 complete + 13 start | Notification queue, Kafka producer + consumer | 16 SP |
| **Sprint 8** | Wk 15–16 | Epic 13 complete + 14 | Kafka Saga, Stripe subscriptions + webhooks + refunds | 18 SP |
| **Sprint 9** | Wk 17–18 | Epic 15 + 16 | OWASP hardening, IP blacklist, Zod sanitization | 13 SP |
| **Sprint 10** | Wk 19–20 | Epic 18 | Unit tests + integration tests + mocking all external services | 13 SP |
| **Sprint 11** | Wk 21–22 | Epic 19 + 21 start | Query optimization, compression, event loop monitoring, Dockerfile | 13 SP |
| **Sprint 12** | Wk 23–24 | Epic 21 complete + 20 start | GitHub Actions CI/CD, PM2, API Gateway, Circuit Breaker | 16 SP |
| **Sprint 13** | Wk 25–26 | Epic 20 complete | Service decomposition, Docker Compose multi-service, gRPC | 13 SP |
| **Sprint 14** | Wk 27–28 | Hardening + Launch | Load testing, security audit, monitoring setup, runbook, launch | 8 SP |

---

## Story Point Reference

| Points | Complexity | Time Estimate |
|---|---|---|
| **1 SP** | Trivial — config change, comment update | < 2 hours |
| **2 SP** | Simple — single utility or config module | 0.5–1 day |
| **3 SP** | Medium — single feature, clear requirements | 1–2 days |
| **5 SP** | Complex — multi-layer, API + service + test | 2–4 days |
| **8 SP** | Very complex — cross-service, significant unknowns | 4–6 days |
| **13 SP** | Too large — must be decomposed | Decompose! |

---

## Definition of Ready (DoR)

- [ ] User story written in `As a... I want... So that...` format
- [ ] Acceptance criteria as testable checklist
- [ ] API contract defined (endpoint, request/response shape, error codes, HTTP status)
- [ ] Story points estimated by team
- [ ] External dependencies resolved (third-party API keys available for dev)
- [ ] DB schema design approved by tech lead
- [ ] Security implications reviewed (new auth/data handling requires security review)
- [ ] Story ≤ 8 SP (if larger, decompose)

---

## Definition of Done (DoD)

- [ ] All acceptance criteria met
- [ ] Code reviewed + merged to `develop`
- [ ] Unit tests written — all service functions covered
- [ ] Integration tests passing in CI
- [ ] No new TypeScript errors (`tsc --noEmit` passes)
- [ ] No new ESLint errors
- [ ] No new `npm audit --audit-level=high` vulnerabilities
- [ ] Swagger/OpenAPI docs updated for new/changed endpoints
- [ ] Performance: new endpoint responds in < 100ms p95 under 100 concurrent users
- [ ] Logging: all new actions logged with appropriate level
- [ ] PM / Tech Lead sign-off in Sprint Review

---

## Grooming Checklist

```
Grooming Agenda (Every Wednesday, 60 min max)
──────────────────────────────────────────────────────
✅ 1. Sprint health check (10 min)
   - Are we on track?
   - Any blocked stories? Need BE/FE alignment?

✅ 2. Refine top backlog items (30 min)
   - Read story aloud — does everyone understand it?
   - Is the API contract clear?
   - Are there security implications?
   - Is there a DB migration involved? Any downtime risk?
   - Split any story > 8 SP

✅ 3. Story point voting (15 min)
   - Planning Poker with Fibonacci (1,2,3,5,8,13)
   - Align on outlier estimates
   - Flag stories needing a Spike (research task)

✅ 4. Priority confirmation (5 min)
   - Next sprint stories all have DoR met?
   - Any tech debt to address this sprint?

Grooming Outputs
──────────────────────────────────────────────────────
→ Top 15 stories refined + estimated
→ API contracts documented in Swagger
→ Security risks flagged to tech lead
→ DB migration stories identified and planned early
```

---

## Risk Register

| Risk | Impact | Probability | Mitigation |
|---|---|---|---|
| MongoDB transactions require replica set | High | High | Use MongoDB Atlas (replica set by default) or local replica set in Docker |
| Kafka setup complexity in dev | Medium | High | Docker Compose with `bitnami/kafka` — one-command local setup |
| Stripe webhook secret mismatch in test | Medium | Medium | `stripe-mock` Docker image in CI test env |
| Redis memory exhaustion from unbounded cache | High | Medium | Set `maxmemory` + `allkeys-lru` eviction policy in Redis config |
| JWT secret rotation breaks active sessions | High | Low | RS256 asymmetric keys — rotate private key, old tokens still valid with old public key until expiry |
| Worker Thread crash brings down cluster worker | Medium | Low | Worker Thread errors caught in `worker.on('error')` — never propagate to main thread |
| Prisma migration fails on prod DB | High | Medium | Always run `prisma migrate deploy --preview-feature` with dry-run in staging first |
| Kafka consumer lag in high-traffic | High | Medium | Monitor consumer lag, add consumer instances, partition count matches consumer count |
