#   Salon & Spa SaaS — Agent Standards & Operating Rules

## 1. Direct & Fast Execution
- **Immediate Task Execution**: Implement requested features and bug fixes directly without intermediate planning ceremonies or waiting loops.
- **Trust User-Provided Context**: When the user specifies the exact task, database, table, or field, do NOT perform deep multi-layer audits, secondary investigations, or launch exploratory scripts/queries. Jump directly to the relevant code and apply the fix immediately.
- **Zero Unnecessary Commands**: Do NOT run `typecheck`, `lint`, `test`, `build`, or temporary verification scripts unless explicitly requested by the user. Dev servers are already running with live hot-reloading.
- **No Documentation Overheads**: Do NOT generate PRD walkthrough PDFs, traceability matrices, or markdown walkthrough artifacts unless explicitly asked.

## 2. Microservices Architecture Rules
- **Database-Per-Service**: 12 logical PostgreSQL databases. Strictly NO cross-database joins or cross-service Prisma relations (`@relation`).
- **Logical UUID References**: Foreign service entities are referenced strictly via raw UUID columns.
- **Security & Multi-Tenancy**: Never trust client-provided `tenantId`, `branchId`, or `franchiseId`. All scoping is verified server-side from authenticated JWT claims.
- **Async Messaging**: Cross-service state synchronization uses RabbitMQ topic exchange (`salon.events.topic`).

## 3. UI Standards
- **Clean Business Interface**: Do NOT display developer PRD codes (e.g., `SALO-PR-xxx`) on user-facing buttons, labels, tags, or modals.
- **Button Styling**: Export buttons use `variant="outline"` with purple text/border on light background.
