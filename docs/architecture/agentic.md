# Agentic Development Guidelines

This document outlines the rules and conventions for AI agents operating within this monorepo. Agents should refer to these guidelines when generating, modifying, or reviewing code.

## 1. Monorepo Architecture
- **Workspace Tooling**: We use `pnpm` as our package manager and `Turborepo` for our build system. Always use `pnpm` for installing dependencies.
- **Shared Packages**: When creating features that span multiple apps (e.g., a type used in both `api` and `admin-web`), extract the shared logic into the appropriate package inside `/packages` (e.g., `/packages/types`, `/packages/utils`).
- **Imports**: Favor importing from local packages using their workspace names (e.g., `@sms/ui`, `@sms/types`) rather than relative paths traversing outside of an app.

## 2. Tech Stack Conventions
- **Frontend**: Apps use React 19 and Tailwind CSS v4.
  - Utilize modern React patterns (e.g., Server Components where applicable, hooks).
  - Use Tailwind utility classes for styling. Do not write custom CSS unless necessary.
- **Backend**: The API uses Express, MongoDB, and Redis.
  - Structure API routes by feature (e.g., `/users`, `/appointments`).
  - Keep route handlers thin; delegate business logic to services.

## 3. Code Quality & Standards
- **TypeScript**: The entire repository is strictly typed. Always provide proper type definitions. Avoid using `any`.
- **Linting & Formatting**: We use Biome for linting and formatting. Run formatting before finalizing code changes.
- **Modularity**: Keep components, functions, and files small and focused on a single responsibility.

## 4. Agent Tool Usage
- When making file edits, prefer the most specific tool (e.g., `replace_file_content`) over generalized bash commands using `sed` or `echo`.
- Always read the contents of a file before attempting to modify it.
- Before running a command, verify the current working directory and ensure the command is tailored for Windows/PowerShell where applicable.

## 5. Collaboration & Review
- Document complex logic, significant architecture decisions, and non-obvious code paths.
- Create or update `.md` files in the `/docs` folder when introducing major new features or architectural changes.
- When generating UI components, focus on a high-quality, premium aesthetic that feels responsive and modern.
