FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
COPY tsconfig.json nest-cli.json ./
RUN npm install
COPY libs ./libs
COPY apps/booking-service ./apps/booking-service
RUN npx prisma generate --schema=apps/booking-service/prisma/schema.prisma
RUN npx nest build booking-service

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm install --omit=dev && npm install -g prisma@5 && npm cache clean --force
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma-clients ./node_modules/@prisma-clients
COPY --from=builder /app/apps/booking-service/prisma ./apps/booking-service/prisma
RUN apk add --no-cache dumb-init curl
EXPOSE 3002
ENTRYPOINT ["dumb-init", "--"]
CMD ["sh", "-c", "prisma db push --schema=apps/booking-service/prisma/schema.prisma --skip-generate && node dist/apps/booking-service/main.js"]
