# Service Documentation: Reporting Service (`apps/services/reporting-service`)

> **Aggregated Business Analytics, Revenue Intelligence, Stylist Productivity & Report Exports**

---

## 1. Overview & Responsibilities

The **Reporting Service** computes high-performance business intelligence aggregations, revenue trends, service popularity rankings, customer lifetime value distributions, stylist utilization metrics, and automated Excel/PDF/CSV report generation for Salon Admins, Franchisees, and Branch Managers.

### Key Responsibilities
- **Revenue & Sales Analytics**: Daily, weekly, monthly gross revenue, discounts given, tax collected, and net sales per branch.
- **Stylist Productivity & Utilization**: Hours booked vs. working hours, average ticket size, tips earned, and client retention rates.
- **Service & Product Performance**: Top-grossing treatments, slow-moving retail products, and package redemption speeds.
- **Client Retention & Acquisition**: New vs. returning client ratios, churn indicators, and referral source metrics.
- **Multi-Branch Comparative Benchmarking**: Cross-branch performance rankings for Brand Admins and Franchise Owners.
- **Automated Report Generation**: Asynchronous background report generation and export in PDF, Excel (XLSX), and CSV formats.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `REPORTING_SERVICE_PORT` / `PORT` | `3012` | HTTP listener port |
| **Database URL** | `REPORTING_DATABASE_URL` | `postgresql://.../reporting_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration for computed snapshots |

---

## 3. Database Schema Entities (`reporting_db`)

- **`DailyBranchMetricSnapshot`**: `id`, `tenantId`, `branchId`, `date`, `totalRevenue`, `serviceRevenue`, `productRevenue`, `totalBookings`, `completedBookings`, `cancelledBookings`, `noShowCount`, `newClientsCount`, `returningClientsCount`
- **`DailyStylistMetricSnapshot`**: `id`, `tenantId`, `branchId`, `staffMemberId`, `date`, `totalHoursWorked`, `totalHoursBooked`, `utilizationRate`, `serviceSales`, `productSales`, `totalTips`
- **`GeneratedReportJob`**: `id`, `tenantId`, `userId`, `reportType` (`SALES_SUMMARY`, `STYLIST_COMMISSIONS`, `INVENTORY_VALUATION`, `TAX_LIABILITY`), `parametersJson`, `fileUrl`, `status` (`PENDING`, `PROCESSING`, `COMPLETED`, `FAILED`), `createdAt`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:dashboard:executive:{period}` (TTL: 300s)
- `tenant:{tenantId}:branch:{branchId}:kpi:today` (TTL: 60s)

---

## 5. Key API Endpoints

- `GET /api/v1/reporting/dashboard/summary`
- `GET /api/v1/reporting/sales/overview`
- `GET /api/v1/reporting/sales/by-service`
- `GET /api/v1/reporting/sales/by-product`
- `GET /api/v1/reporting/stylists/productivity`
- `GET /api/v1/reporting/clients/retention`
- `POST /api/v1/reporting/exports/request` (Queues background report generation)
- `GET /api/v1/reporting/exports/:jobId` (Checks status & download URL)

---

## 6. Asynchronous Events (RabbitMQ)

- **Consumed Events**:
  - `salon.events.payment.completed` -> Increments daily branch sales and staff revenue counters
  - `salon.events.booking.completed` -> Updates stylist utilization metrics
  - `salon.events.customer.created` -> Increments new client acquisition metrics
