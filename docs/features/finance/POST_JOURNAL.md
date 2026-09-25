# Feature: Finance, Commission, Payroll & Franchise Royalty

## 1. General Ledger & Double-Entry Accounting (`POST_JOURNAL.md`)
- Endpoint: `POST /api/v1/finance/journals` & `POST /api/v1/finance/journals/:id/post`
- Strict balanced entry rule: $\sum(\text{debit}) = \sum(\text{credit})$.
- Period locks enforce immutability on closed periods; adjustments require reversal journals.

## 2. Staff Commission Calculation Engine (`CALCULATE_COMMISSION.md`)
- Calculation types: `PERCENTAGE`, `FIXED`, `TIERED`, `HYBRID`.
- Listens to `SALE_COMPLETED.v1`, resolves versioned rules, records `CommissionTransaction`, and emits `COMMISSION_CALCULATED.v1`.

## 3. Payroll Runner (`RUN_PAYROLL.md`)
- Endpoint: `POST /api/v1/finance/payroll/execute` & `POST /api/v1/finance/payroll/:id/approve`
- Aggregates base salary, attendance adjustments, overtime, approved commissions, tips, and deductions.

## 4. Franchise Royalty & Settlement Engine (`CALCULATE_FRANCHISE_ROYALTY.md`, `CREATE_FRANCHISE_SETTLEMENT.md`)
- 3-Tier Hierarchy Resolution:
  1. `BranchRoyaltyOverride` (highest priority)
  2. `RoyaltyRule` (franchise partner tier)
  3. Tenant/Brand Default Rule
- Period settlements aggregate gross sales and net royalties into `FranchiseSettlement`.
