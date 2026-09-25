# Service Documentation: Finance Service (`apps/services/finance-service`)

> **Double-Entry Ledgers, Cash Drawer Reconciliations, Expense Tracking, Payroll & Profit/Loss**

---

## 1. Overview & Responsibilities

The **Finance Service** maintains authoritative financial integrity for the salon enterprise. It provides double-entry chart of accounts, operational expense tracking, end-of-day register/cash drawer balance reconciliations, stylist commission payroll summaries, franchise royalty computations, and financial statement exports (P&L, Balance Sheet).

### Key Responsibilities
- **Chart of Accounts & General Ledger**: Double-entry accounting structure (Assets, Liabilities, Equity, Revenue, Expenses).
- **Cash Drawer & Register Reconciliations**: Shift-opening float counts, end-of-day closing counts, cash drop records, and variance discrepancies.
- **Operating Expense Management**: Vendor payments, utility bills, salon rent, maintenance costs, and recurring expense schedules with receipt attachments.
- **Stylist Payroll & Commissions**: Aggregates service commissions, retail sales incentives, hourly wages, overtime pay, and deductions.
- **Franchise Royalty Settlements**: Automatic calculation of monthly royalty dues owed by franchisee branches to the brand tenant.
- **Tax Ledgers**: Summarized output tax collected vs. input tax paid for regional tax filings.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `FINANCE_SERVICE_PORT` / `PORT` | `3009` | HTTP listener port |
| **Database URL** | `FINANCE_DATABASE_URL` | `postgresql://.../finance_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration |

---

## 3. Database Schema Entities (`finance_db`)

- **`Account`**: `id`, `tenantId`, `code`, `name`, `type` (`ASSET`, `LIABILITY`, `EQUITY`, `REVENUE`, `EXPENSE`), `currency`, `balance`
- **`JournalEntry`**: `id`, `tenantId`, `branchId`, `entryNumber`, `date`, `description`, `referenceType`, `referenceId`, `status`, `createdAt`
- **`JournalEntryLine`**: `id`, `journalEntryId`, `accountId`, `isDebit`, `amount`
- **`CashDrawerSession`**: `id`, `tenantId`, `branchId`, `openedByUserId`, `closedByUserId`, `openingFloat`, `expectedClosingAmount`, `actualClosingAmount`, `variance`, `status` (`OPEN`, `CLOSED`, `RECONCILED`), `openedAt`, `closedAt`
- **`Expense`**: `id`, `tenantId`, `branchId`, `categoryId`, `amount`, `taxAmount`, `paidTo`, `paymentMethod`, `receiptUrl`, `date`, `approvedByUserId`
- **`PayrollPeriod`**: `id`, `tenantId`, `periodStart`, `periodEnd`, `totalPayout`, `status` (`DRAFT`, `APPROVED`, `PAID`)
- **`PayrollEntry`**: `id`, `payrollPeriodId`, `staffMemberId`, `baseSalary`, `commissionAmount`, `tipAmount`, `deductions`, `netPayable`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:branch:{branchId}:register:current` (TTL: 60s)
- `tenant:{tenantId}:finance:pnl:{month}` (TTL: 300s)

---

## 5. Key API Endpoints

- `GET /api/v1/finance/accounts`
- `GET /api/v1/finance/journal-entries`
- `POST /api/v1/finance/journal-entries`
- `GET /api/v1/finance/cash-drawer/current`
- `POST /api/v1/finance/cash-drawer/open`
- `POST /api/v1/finance/cash-drawer/close`
- `GET /api/v1/finance/expenses`
- `POST /api/v1/finance/expenses`
- `GET /api/v1/finance/payroll/periods`
- `POST /api/v1/finance/payroll/generate`
- `GET /api/v1/finance/reports/profit-loss`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.finance.drawer.closed`
  - `salon.events.finance.payroll.processed`
- **Consumed Events**:
  - `salon.events.payment.completed` -> Posts journal entry lines (Debit Cash/Bank, Credit Revenue)
  - `salon.events.inventory.po.received` -> Posts journal entry lines (Debit Inventory Asset, Credit Accounts Payable)
