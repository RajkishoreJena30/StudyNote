---
description: "Use when working in the Nama Yatra microservice backend (Node + TypeScript + Express 5 + Prisma 7 + Redis). Covers service architecture, layered folder structure, ESM conventions, error handling, OTP/auth flow, Prisma 7 config, Redis singleton, and how to scaffold new services from the user-services template."
name: "Nama Yatra Backend Conventions"
applyTo: "Node/project/nama-yatra/**"
---

# Nama Yatra Backend — Engineering Conventions

IRCTC-style train booking platform built as independent microservices behind a load balancer. `user-services` is the reference implementation; **every new service (booking, payment, search) must mirror its structure and conventions.**

## Architecture

- **Independent microservices**, one Express app per service, each with its own port and its own database (DB-per-service). Services do **not** share a database or import each other's code.
- **Shared infrastructure** runs via the root `docker-compose.yml`: PostgreSQL 15, Redis Stack, pgAdmin. Start with `docker compose up`.
- Services are stateless and horizontally scalable; sessions/OTP/rate-limit state lives in **Redis**, never in process memory.
- `ALLOWED_ORIGINS` is comma-separated and includes the load balancer / gateway origins.

```
nama-yatra/
  docker-compose.yml          # shared postgres + redis + pgadmin
  user-services/              # REFERENCE TEMPLATE — copy this shape
  booking-services/
  payment-services/
  serch-services/
```

## Tech Stack (pin to these)

- Node 20, **ESM** (`"type": "module"`), TypeScript (strict), Express 5
- Prisma 7 with `@prisma/adapter-pg` (driver adapter, not the binary engine)
- `ioredis` for Redis, `winston` for logging, `zod` for validation
- `helmet`, `cors`, `cookie-parser` for HTTP hardening
- `nodemailer` for email, `bcrypt` for password hashing, `otp-generator` + `crypto` HMAC for OTP

## Per-Service Folder Structure

```
src/
  app.ts            # express app: middleware order + route mounting + errorHandler LAST
  server.ts         # startServer(): app.listen, logs, process.exit(1) on failure
  config/           # env.ts, logger.ts, prisma.ts, redis.ts (singletons)
  controllers/      # *.controller.ts — parse/validate req, call service, send response
  services/         # *.service.ts — business logic, DB/redis access, returns typed results
  routes/           # *.routes.ts — express.Router, export default
  middleware/       # corsHandler, errorHandler, requestHandler
  utils/            # asyncHandler, error (AppError classes), otp, email
  types/            # index.ts — shared interfaces/enums (no `any`)
```

## Layering Rules (strict)

`routes → controllers → services → config (prisma/redis)`

- **Controllers** throw errors; they never `try/catch` for error responses. Wrap every controller in `asyncHandler` so rejections reach `errorHandler`.
- **Services** hold business logic, return typed results, and throw `AppError` subclasses (e.g. `ConflictError`) — never send HTTP responses.
- **Never skip a layer** (e.g. routes calling Prisma directly).

## TypeScript Conventions

- **No `any`.** Declare request bodies, service results, and Redis payloads as interfaces/enums in `src/types/index.ts`.
- Type request bodies with `req.body as SomeRequestBody`.
- Use ESM `import`/`export` everywhere — **never** `require` / `module.exports`.
- Path aliases are configured (`@/*`, `@config/*`, `@controllers/*`, `@services/*`, `@middleware/*`, `@utils/*`, `@types/*`). Prefer relative imports within a layer; aliases are acceptable.
- Validate that `npx tsc --noEmit` passes before considering work done.
- For an untyped dependency, prefer `@types/<pkg>`; only add a local `*.d.ts` if no types package exists.

## Configuration & Env

- All env access goes through `config/env.ts` — a single typed `config` object with sane defaults. **Never read `process.env` outside this file** (Prisma config is the only exception).
- `config/env.ts` keys: `SERVICE_NAME`, `PORT`, `NODE_ENV`, `LOG_LEVEL`, `ALLOWED_ORIGINS`, `REDIS_URL`, `DATABASE_URL`, SMTP\_\*, `MAIL_FROM`, `MINUTES_TO_EXPIRE`, OTP\_\*.
- Each service uses a unique `PORT` and a dedicated `DATABASE_URL` database name (e.g. `user_service_database`).

## Prisma 7

- Connection URL lives in `prisma.config.ts` (`datasource.url = process.env.DATABASE_URL!`), **not** in `schema.prisma`. Putting `url` in the schema is a Prisma 7 error.
- `config/prisma.ts` is a global singleton using `PrismaPg` adapter with `log: ["error", "warn"]`.
- Migrations: `npx prisma migrate dev --name <change>` then `npx prisma generate`.

## Redis

- Access through the `RedisSingleton` in `config/redis.ts` (single shared `ioredis` client with retry strategy + connection logging). Import the default export; never `new Redis()` elsewhere.
- Key naming uses colon namespaces with **no spaces**: `otp:session:<id>`, `otp:rate:<email>`.
- Always set a TTL (`"EX", seconds`) on transient keys.

## Error Handling

- Use the `AppError` hierarchy in `utils/error.ts` (`BadRequestError` 400, `UnauthorizedError` 401, `ForbiddenError` 403, `NotFoundError` 404, `ConflictError` 409, `TooManyRequestError` 429, `InternalServerError` 500). Each carries `statusCode` + machine-readable `code`.
- Throw a specific `AppError` subclass; let the central `errorHandler` format the response `{ success: false, error, code }`.
- `errorHandler` is the **last** `app.use`. Non-`AppError` errors are logged and returned as 500.

## Auth / OTP Flow (reference pattern)

1. Controller validates body, hands off to `authService`.
2. Service checks for existing user, `bcrypt.hash`es the password, calls `generateAndStoreOtp(meta)`.
3. `otp.ts` enforces a Redis rate limit, generates the OTP, stores an HMAC (`crypto.createHmac`, secret from config) keyed by a `crypto.randomUUID()` session id, and emails the OTP via `utils/email.ts` (nodemailer).
4. Controller sets the session id in an httpOnly, secure, `sameSite: "strict"` cookie.
- **Never** store raw OTPs or raw passwords — store bcrypt hashes and HMAC digests only.

## Middleware Order (in `app.ts`)

`helmet` → `corsHandler` → `requestHandler` (logging) → `express.json` → `cookieParser` → routes (`/api/v1/...`) → `errorHandler` (last).

## Scaffolding a New Service

1. Copy the `user-services` skeleton (config, middleware, utils, types, error classes, asyncHandler).
2. Give it a unique `PORT`, a dedicated database, and its own `prisma/schema.prisma`.
3. Add it to `docker-compose.yml` if it needs new infra; reuse shared Postgres/Redis otherwise.
4. Keep routes under `/api/v1/<domain>` and reuse the same error/response envelope.
