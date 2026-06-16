# Ecom Microservices — Reference Template

A production-shaped **NestJS + TypeScript** microservices backend for an
e-commerce / event-booking platform. Built to demonstrate real backend
engineering patterns end-to-end.

> Design docs: [HLD](docs/HLD.md) · [LLD](docs/LLD.md)

## What's inside

| Capability                                    | Implemented in                                   |
| --------------------------------------------- | ------------------------------------------------ |
| Microservices architecture (DB-per-service)   | `apps/*`                                          |
| API Gateway + **GraphQL**                     | `apps/api-gateway`                                |
| **Kafka** async messaging / CQRS sync         | `libs/common/src/kafka`, `*/main.ts` consumers   |
| **Elasticsearch** fuzzy search + autocomplete | `apps/search-service`                            |
| **SAGA** distributed transactions             | `libs/common/src/saga`, `apps/booking-service`   |
| **Idempotency** (Redis + DB)                  | `libs/common/src/idempotency`                    |
| Concurrent seat booking + 3 locking strategies| `apps/booking-service/.../seat.repository.ts`    |
| **Adapter pattern** payment gateways          | `apps/payment-service/src/gateways`              |
| Load balancing (Nginx, 2 gateway replicas)    | `nginx/nginx.conf`, `docker-compose.yml`         |
| Graceful shutdown                             | `libs/common/src/shutdown`                        |
| Fault tolerance (retries, DLQ, healthchecks)  | gateway client, kafka, `/health`                 |
| Prisma + PostgreSQL, Redis, pgAdmin, Kafka UI | `docker-compose.yml`                              |

## Stack

NestJS 10 · TypeScript · Prisma 5 · PostgreSQL 16 · Redis 7 · Kafka (KRaft) ·
Elasticsearch 8 · Apollo GraphQL · Docker Compose · Nginx.

## Project layout

```
ecom/
├─ apps/
│  ├─ api-gateway/      # GraphQL edge, proxies to services
│  ├─ user-service/     # accounts (user_db)
│  ├─ booking-service/  # seats, locking, SAGA orchestrator (booking_db)
│  ├─ payment-service/  # adapter-based gateways (payment_db)
│  └─ search-service/   # Elasticsearch read model
├─ libs/common/         # kafka, redis, locking, saga, idempotency, filters...
├─ nginx/nginx.conf     # load balancer
├─ scripts/             # multi-db init
├─ docs/                # HLD + LLD
└─ docker-compose.yml
```

## Run everything (Docker)

```bash
cp .env.example .env
docker compose up --build
```

Services & tooling:

| URL                              | What                          |
| -------------------------------- | ----------------------------- |
| http://localhost:8080/graphql    | GraphQL API (via Nginx LB)    |
| http://localhost:8080/health     | Load-balanced health          |
| http://localhost:5050            | pgAdmin (admin@ecom.dev/admin)|
| http://localhost:8090            | Kafka UI                      |
| http://localhost:9200            | Elasticsearch                 |

> pgAdmin: add a server → host `postgres`, user `ecom`, password `ecom_secret`.

## Local dev (without Docker for the apps)

Start infra only, then run a service in watch mode:

```bash
docker compose up postgres redis kafka elasticsearch pgadmin kafka-ui
npm install
npm run prisma:generate
npm run start:booking      # or start:gateway / start:user / start:payment / start:search
```

## Try it — GraphQL

```graphql
mutation {
  registerUser(input: { email: "a@b.com", name: "Ada", password: "password123" }) {
    id
    email
  }
}

mutation {
  createBooking(
    input: {
      userId: "<user-id>"
      eventInventoryId: "<inventory-id>"
      seatIds: ["<seat-id-1>", "<seat-id-2>"]
      provider: "stripe"
    }
  ) {
    id
    status
    amount
  }
}

query {
  search(q: "ipone")          # fuzzy: still matches "iphone"
  autocomplete(q: "ip")
}
```

> Seed `event_inventory` + `seats` rows in `booking_db` (via pgAdmin or a seed
> script) before creating bookings.

## Concurrency demo

Fire many concurrent `createBooking` calls for the **same** seats — exactly one
succeeds (`CONFIRMED`), the rest get a seat conflict and end `FAILED`, thanks to
the Redis lock + pessimistic DB lock. A charge amount ending in `.13` forces a
payment decline so you can watch the SAGA compensate (seats released).

## Notes

- Payment adapters and password hashing are **mocked** for the template — swap
  in real SDKs (`stripe`, `razorpay`) and `bcrypt`/`argon2` for production.
- Migrations run automatically on container start (`prisma migrate deploy`).
  For first-time local migrations use
  `npx prisma migrate dev --schema=apps/<svc>/prisma/schema.prisma`.
