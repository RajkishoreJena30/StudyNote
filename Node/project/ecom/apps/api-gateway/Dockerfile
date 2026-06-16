# --- Multi-stage build shared shape for every service in the monorepo ---
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json nest-cli.json ./
RUN npm install
COPY libs ./libs
COPY apps/api-gateway ./apps/api-gateway
RUN npx nest build api-gateway

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
# dumb-init forwards signals -> enables graceful shutdown inside the container
RUN apk add --no-cache dumb-init curl
EXPOSE 3000
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/apps/api-gateway/main.js"]
