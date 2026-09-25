# Salon & Spa SaaS Monorepo

Enterprise-grade SaaS platform for Salons and Spas. Built with React 19, Tailwind CSS v4, Express, and TypeScript inside a Turborepo.

## Tech Stack
- **Monorepo**: Turborepo, pnpm
- **Frontend**: React 19, Vite, Tailwind CSS v4, Shadcn UI, RTK, TanStack Query
- **Backend**: Express, MongoDB, Redis, Socket.IO
- **Tooling**: Biome (Lint & Format), Husky, Lint-staged

## Installation Guide

1. Ensure you have Node.js 22+ and pnpm 9+ installed.
2. Clone the repository and install dependencies:
   ```bash
   pnpm install
   ```
3. Create environment files:
   ```bash
   cp .env.example .env
   ```

## Development Guide

Start all development servers concurrently:
```bash
pnpm dev
```

Run linting across all packages:
```bash
pnpm lint
```

## Docker

Run the entire stack (API, Frontend, MongoDB, Redis) via Docker Compose:
```bash
docker-compose up -d --build
```
