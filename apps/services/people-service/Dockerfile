FROM node:20-alpine AS base
WORKDIR /app
RUN corepack enable && corepack prepare pnpm@9.9.0 --activate

COPY . .
RUN pnpm install --frozen-lockfile=false
RUN pnpm --filter @salon-spa-saas/people-service prisma:generate
RUN pnpm --filter @salon-spa-saas/people-service build

EXPOSE 3003
CMD ["node", "apps/services/people-service/dist/main.js"]
