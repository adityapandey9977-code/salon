# Monorepo Folder Structure

This repository is organized as a Turborepo monorepo, containing multiple applications and shared packages.

## Apps (`/apps`)

- **`admin-web/`**: The web application for salon staff and administration.
- **`api/`**: The backend REST API server.
- **`customer-mobile/`**: The mobile application for customers (e.g., React Native).
- **`customer-web/`**: The web application for customers to book appointments.
- **`super-admin/`**: The internal web application for platform administration and multi-tenant management.

## Packages (`/packages`)

- **`config/`**: Shared configuration files (ESLint, Prettier, TypeScript configs, etc.).
- **`constants/`**: Shared constants, enums, and static data used across apps.
- **`types/`**: Shared TypeScript type definitions and interfaces.
- **`ui/`**: Shared UI component library.
- **`utils/`**: Shared utility functions and helpers.
- **`validation/`**: Shared data validation schemas (e.g., Zod schemas).

## Root Level Directories

- **`docker/`**: Dockerfiles and related configuration for containerization.
- **`docs/`**: Documentation files for the repository.
- **`scripts/`**: Utility scripts for build, deployment, and automation tasks.

## Key Configuration Files

- `turbo.json`: Turborepo pipeline configuration.
- `package.json`: Root package.json defining workspace scripts and shared dev dependencies.
- `pnpm-workspace.yaml`: pnpm workspace configuration defining the included apps and packages.
- `biome.json`: Biome configuration for fast formatting and linting.
- `docker-compose.yml`: Docker compose setup for running dependent services (like MongoDB, Redis) locally.
