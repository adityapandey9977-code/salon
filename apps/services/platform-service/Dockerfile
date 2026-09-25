FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @salon-spa-saas/platform-service prisma:generate
RUN pnpm --filter @salon-spa-saas/platform-service build

EXPOSE 5011
CMD ["node", "apps/services/platform-service/dist/main.js"]
