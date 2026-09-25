FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @salon-spa-saas/booking-service prisma:generate
RUN pnpm --filter @salon-spa-saas/booking-service build

EXPOSE 4006
CMD ["node", "apps/services/booking-service/dist/main.js"]
