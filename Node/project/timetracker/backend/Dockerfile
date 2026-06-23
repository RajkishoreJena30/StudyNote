# ----------------------------------------------------------------------------
# Build stage — install deps, generate Prisma client, compile every app
# ----------------------------------------------------------------------------
FROM node:20-alpine AS builder
WORKDIR /app

# openssl is required by Prisma's query engine on Alpine (musl).
RUN apk add --no-cache openssl

# Allow Prisma to fetch its engine binaries (query + schema engine) through a
# corporate TLS-intercepting proxy at build time. Build stage only — this is
# never carried into the runtime image below.
ENV NODE_TLS_REJECT_UNAUTHORIZED=0

COPY package*.json ./
RUN npm ci

COPY . .
RUN npx prisma generate --schema=libs/prisma/src/schema.prisma
RUN npm run build
# The seed script is a standalone entrypoint (not part of any nest app build),
# so compile it on its own into dist for the one-shot migrate container.
RUN npx tsc libs/prisma/src/seed.ts \
    --outDir dist/libs/prisma \
    --module commonjs \
    --target ES2021 \
    --moduleResolution node \
    --esModuleInterop \
    --skipLibCheck

# ----------------------------------------------------------------------------
# Runtime stage — slim image that runs a single compiled app (set by command)
# ----------------------------------------------------------------------------
FROM node:20-alpine AS runner
ENV NODE_ENV=production
WORKDIR /app

# openssl is required by Prisma's query engine at runtime on Alpine (musl).
RUN apk add --no-cache openssl

COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/libs/prisma/src/schema.prisma ./libs/prisma/src/schema.prisma
COPY --from=builder /app/package.json ./package.json

# Default to the gateway; docker-compose overrides `command` per service.
EXPOSE 3000
CMD ["node", "dist/apps/api-gateway/apps/api-gateway/src/main"]
