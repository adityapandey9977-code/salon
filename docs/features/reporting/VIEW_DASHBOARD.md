# Feature: Real-Time Reporting, Analytics & Audit Trail

## 1. Multi-Tenant Dashboard Projections (`VIEW_DASHBOARD.md`)
- Projections: `DailyBranchMetrics`, `TenantDailyMetrics`, `StaffPerformanceDaily`, `FranchiseDailyMetrics`, `InventoryDailyMetrics`, `CallCenterDailyMetrics`.
- Fed strictly via asynchronous RabbitMQ domain events. NO cross-database SQL joins.
- Safe Redis read cache with 30-300s TTL.

## 2. Operational & Revenue Reporting (`GENERATE_REPORT.md`)
- Endpoints:
  - `GET /api/v1/reports/executive-summary`
  - `GET /api/v1/reports/operations`
  - `GET /api/v1/reports/revenue`
  - `GET /api/v1/reports/staff`
  - `GET /api/v1/reports/branch-eod`
  - `GET /api/v1/reports/stylist-productivity`

## 3. Asynchronous Report Exports (`EXPORT_REPORT.md`)
- Endpoints: `POST /api/v1/reports/export` & `POST /api/v1/reports/branch-export`.
- Tracked via `ReportExportJob` with download URLs and completion timestamps.

## 4. Append-Only Audit Trail (`QUERY_AUDIT_LOG.md`)
- Sanitizes sensitive tokens, passwords, MFA secrets, and credit card numbers before persistence into `AuditEvent`.
- Endpoints: `GET /api/v1/audit`, `GET /api/v1/super-admin/audit`, `POST /api/v1/super-admin/audit/export`.
