FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @salon-spa-saas/commerce-service prisma:generate
RUN pnpm --filter @salon-spa-saas/commerce-service build

EXPOSE 4005
CMD ["node", "apps/services/commerce-service/dist/main.js"]
