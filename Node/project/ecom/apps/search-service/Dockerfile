FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json nest-cli.json ./
RUN npm install
COPY libs ./libs
COPY apps/search-service ./apps/search-service
RUN npx nest build search-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev && npm cache clean --force
COPY --from=builder /app/dist ./dist
RUN apk add --no-cache dumb-init curl
EXPOSE 3004
ENTRYPOINT ["dumb-init", "--"]
CMD ["node", "dist/apps/search-service/main.js"]
