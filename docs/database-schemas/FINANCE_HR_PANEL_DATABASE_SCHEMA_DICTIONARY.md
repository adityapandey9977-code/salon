#   Salon SaaS — Finance & HR Panel Module Database Schema & UI Field Mapping Dictionary

**Document Version:** 2.8.0  
**Target System:**   Salon SaaS Web Application (`/finance-hr/*` & `/admin/finance`, `/admin/staff`)  
**Scope:** Finance & Human Resources Workspace (GST Invoicing, General Ledger, Payroll, Stylist Commissions & Statutory Compliance)  
**Classification:** Complete Database Dictionary & Technical UI-to-Schema Mapping  

---

## Architecture & Finance/HR Operational Domain Map

The **Finance & HR Panel** operates across **Central Brand Financials** and **Multi-Branch Staff Payroll**. It handles double-entry general ledger accounting, Indian GST tax returns (GSTR-1 / GSTR-3B), stylist commission payroll batches, and statutory deductions (PF, ESI, TDS, PT).

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              FINANCE & HR OPERATIONAL DOMAIN MAP                                       │
├────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────┤
│ 1. Financial Ledger & GST      │ 2. Accounts Payable & Receivable      │ 3. HR, Payroll & Commissions  │
│  • GST Tax Invoices (CGST/SGST)│  • Vendor Bills & Debit Notes         │  • Employee Master & KYC      │
│  • General Ledger Journals     │  • Franchise Royalty Receivables      │  • Monthly Payroll Runs & Slips│
│  • Bank & POS Merchant Gateway │  • Branch Petty Cash Payouts          │  • Stylist Commission Engine  │
│  • GSTR-1 / GSTR-3B Compliance │  • Bank Reconciliations & UTRs        │  • PF, ESI, TDS & PT Filings  │
└────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────┘
```

---

## 1. General Ledger, Chart of Accounts & Financial Journals

### 1.1 UI View: Chart of Accounts & General Ledger Desk
**Primary Database Table:** `chart_of_accounts`  
**Secondary Tables:** `general_ledger_entries`, `journal_vouchers`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Account Code** | `account_code` | `VARCHAR(30)` | `PRIMARY KEY` | Chart of Account Code (e.g. `1001-CASH`, `4001-REV-SRV`) |
| **Brand Tenant Link** | `brand_id` | `VARCHAR(64)` | `NOT NULL, FK -> brands(id)` | Owning Brand Tenant |
| **Account Title** | `account_name` | `VARCHAR(150)` | `NOT NULL` | e.g. "Salon Services Revenue", "Vendor Cost of Goods" |
| **Account Category** | `account_category` | `VARCHAR(40)` | `NOT NULL` | `Asset`, `Liability`, `Equity`, `Revenue`, `Cost of Sales`, `Operating Expense` |
| **Normal Balance** | `normal_balance` | `VARCHAR(10)` | `NOT NULL` | `Debit` or `Credit` |
| **Current Balance (₹)** | `current_balance` | `DECIMAL(14, 2)`| `DEFAULT 0.00` | Real-time computed ledger balance |
| **Is Active** | `is_active` | `BOOLEAN` | `DEFAULT TRUE` | Active ledger account |

---

### 1.2 Table: `journal_vouchers` & `general_ledger_entries` (Double-Entry Bookkeeping)

#### Table: `journal_vouchers`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Voucher ID (e.g. `JV-2026-0881`) |
| `voucher_number` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | Official Voucher Reference |
| `branch_id` | `VARCHAR(64)` | `NULL, FK -> branches(id)` | Associated branch (NULL for HQ central) |
| `posting_date` | `DATE` | `NOT NULL` | Accounting Posting Date |
| `narration` | `TEXT` | `NOT NULL` | Description (e.g. "EOD Sales posting for Indrapuri") |
| `total_debit` | `DECIMAL(14, 2)` | `NOT NULL` | Must equal total credit (Double-Entry) |
| `total_credit` | `DECIMAL(14, 2)` | `NOT NULL` | Must equal total debit |
| `status` | `VARCHAR(20)` | `DEFAULT 'Posted'` | `Draft`, `Posted`, `Reversed` |
| `created_by` | `VARCHAR(100)` | `NOT NULL` | Financial Accountant User |

#### Table: `general_ledger_entries`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Ledger Line ID |
| `journal_voucher_id` | `VARCHAR(64)` | `FK -> journal_vouchers(id)` | Voucher Link |
| `account_code` | `VARCHAR(30)` | `FK -> chart_of_accounts(account_code)` | Target Account Head |
| `debit_amount` | `DECIMAL(14, 2)` | `DEFAULT 0.00` | Debit Transaction Amount |
| `credit_amount` | `DECIMAL(14, 2)` | `DEFAULT 0.00` | Credit Transaction Amount |
| `source_document_ref` | `VARCHAR(80)` | `NULL` | Invoice #, PO #, Settlement # |

---

## 2. GST Invoicing, Tax Ledgers & Statutory Returns

### 2.1 UI View: GST Tax Ledger & Indian Statutory Compliance (GSTR-1 & GSTR-3B)
**Primary Database Table:** `gst_tax_ledgers`  
**Related Table:** `invoices`

| UI Form Field / Report Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Tax Record ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | GST Transaction ID |
| **Branch Outlet** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Branch GSTIN Location |
| **Invoice Reference** | `invoice_id` | `VARCHAR(64)` | `NOT NULL, FK -> invoices(id)` | Associated Tax Invoice |
| **HSN / SAC Code** | `hsn_sac_code` | `VARCHAR(20)` | `NOT NULL` | `999721` (Services) or `33051090` (Goods) |
| **Supply Type** | `supply_type` | `VARCHAR(30)` | `NOT NULL` | `Intra-State Supply` vs `Inter-State Supply` |
| **Taxable Base Value (₹)** | `taxable_value` | `DECIMAL(12, 2)` | `NOT NULL` | Taxable amount (Excl. Tax) |
| **CGST Accrued (9%)** | `cgst_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Central GST Collected |
| **SGST Accrued (9%)** | `sgst_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | State GST Collected |
| **IGST Accrued (18%)** | `igst_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Integrated GST Collected |
| **Input Tax Credit (ITC)** | `itc_claimed_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | GST credit eligible from Vendor POs |
| **Net Tax Liability (₹)** | `net_tax_payable` | `DECIMAL(12, 2)` | `GENERATED ALWAYS AS ((cgst_amount + sgst_amount + igst_amount) - itc_claimed_amount)` | Net GST payable to Govt |
| **Filing Period** | `return_period` | `VARCHAR(10)` | `NOT NULL` | e.g. "08-2026" (August 2026) |
| **GSTR-1 Return Status** | `gstr1_status` | `VARCHAR(20)` | `DEFAULT 'Pending'` | `Pending`, `Filed`, `Verified` |

---

## 3. Accounts Payable (AP) & Vendor Settlements

### 3.1 UI Tab: Vendor Invoices & Payment Disbursals
**Primary Database Table:** `vendor_bills_payable`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Bill ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Bill Record ID |
| **Supplier Vendor** | `supplier_id` | `VARCHAR(64)` | `NOT NULL, FK -> suppliers(id)` | Vendor (e.g. L'Oréal India) |
| **Purchase Order Reference**| `purchase_order_id` | `VARCHAR(64)` | `NOT NULL, FK -> purchase_orders(id)` | Originating PO |
| **Vendor Invoice Number** | `vendor_invoice_number`| `VARCHAR(60)` | `NOT NULL` | Supplier's tax invoice # |
| **Invoice Date** | `bill_date` | `DATE` | `NOT NULL` | Supplier invoice date |
| **Payment Due Date** | `due_date` | `DATE` | `NOT NULL` | Net 30/60 Days due date |
| **Gross Bill Amount (₹)** | `bill_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Total payable amount |
| **TDS Section 194C/J (₹)** | `tds_deducted_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | TDS withheld for Govt deposit |
| **Debit Note Adjustments** | `debit_note_offset` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Reversal for damaged returns |
| **Net Settled Amount (₹)** | `amount_paid` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Cumulative payment released |
| **Bank UTR Number** | `bank_utr_ref` | `VARCHAR(100)` | `NULL` | Corporate bank payment UTR |
| **Settlement Status** | `payment_status` | `VARCHAR(30)` | `DEFAULT 'Unpaid'` | `Unpaid`, `Partially Paid`, `Settled`, `Overdue` |

---

## 4. Human Resources (HR) & Employee Master Directory

### 4.1 UI Page: Employee Master & KYC Vault
**Primary Database Table:** `employees` (or `staff_profiles`)

| UI Form Field / Profile Dossier | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Employee ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Unique Staff ID (`EMP-001`) |
| **Assigned Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Base Salon Branch |
| **Staff Employee Code** | `employee_code` | `VARCHAR(40)` | `UNIQUE, NOT NULL` | Staff Badge ID (e.g. `ATL-EMP-104`) |
| **Full Legal Name** | `full_name` | `VARCHAR(120)` | `NOT NULL` | Staff Member Legal Name |
| **Date of Birth** | `date_of_birth` | `DATE` | `NOT NULL` | KYC Verification |
| **Gender** | `gender` | `VARCHAR(20)` | `NOT NULL` | `Female`, `Male`, `Other` |
| **Aadhaar Number (Masked)** | `aadhaar_masked` | `VARCHAR(20)` | `NOT NULL` | `XXXX-XXXX-1234` |
| **PAN Card Number** | `pan_number` | `VARCHAR(10)` | `NOT NULL` | Income tax PAN number |
| **Designation Tier** | `designation` | `VARCHAR(80)` | `NOT NULL` | `Master Stylist`, `Senior Aesthetician`, `Nail Tech` |
| **Date of Joining (DOJ)** | `date_of_joining` | `DATE` | `NOT NULL` | Employment Start Date |
| **Bank Name** | `bank_name` | `VARCHAR(100)` | `NOT NULL` | Salary Disbursal Bank |
| **Bank Account Number** | `bank_account_number` | `VARCHAR(40)` | `NOT NULL` | Direct Salary Deposit Account |
| **Bank IFSC Code** | `bank_ifsc_code` | `VARCHAR(15)` | `NOT NULL` | 11-digit IFSC Code |
| **UAN (Provident Fund)** | `uan_number` | `VARCHAR(20)` | `NULL` | Universal Account Number (PF) |
| **ESI Insurance IP #** | `esi_insurance_number`| `VARCHAR(20)` | `NULL` | Employees' State Insurance IP |
| **Employment Status** | `status` | `VARCHAR(20)` | `DEFAULT 'Active'` | `Active`, `Probation`, `On Notice`, `Resigned` |

---

## 5. Monthly Payroll Engine, Salary Slips & Stylist Commissions

### 5.1 UI Page: Monthly Payroll Run Batch & Salary Slips
**Primary Database Table:** `payroll_runs`  
**Secondary Table:** `salary_slips`

#### Table: `payroll_runs`
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Payroll Batch ID (e.g. `PAYROLL-202608`) |
| `payroll_month` | `VARCHAR(10)` | `NOT NULL` | Month / Year (e.g. "AUG-2026") |
| `total_employees_count` | `INTEGER` | `NOT NULL` | Total staff in payroll batch |
| `gross_salary_total` | `DECIMAL(14, 2)` | `NOT NULL` | Total gross earnings (₹) |
| `total_commissions_added`| `DECIMAL(14, 2)`| `NOT NULL` | Stylist service & retail commissions |
| `total_statutory_deductions`| `DECIMAL(14, 2)`| `NOT NULL` | PF + ESI + TDS + PT |
| `net_payout_total` | `DECIMAL(14, 2)` | `NOT NULL` | Net bank disbursal total (₹) |
| `disbursal_status` | `VARCHAR(30)` | `DEFAULT 'Draft'` | `Draft`, `Approved by HR`, `Disbursed`, `Settled` |
| `disbursal_date` | `DATE` | `NULL` | Bank Transfer Date (e.g. 1st of month) |

#### Table: `salary_slips` (Individual Employee Monthly Pay Slip)
| Field Name | Data Type | Constraints | Description |
| :--- | :--- | :--- | :--- |
| `id` | `VARCHAR(64)` | `PRIMARY KEY` | Pay Slip Record ID |
| `payroll_run_id` | `VARCHAR(64)` | `NOT NULL, FK -> payroll_runs(id)` | Payroll Batch Link |
| `employee_id` | `VARCHAR(64)` | `NOT NULL, FK -> employees(id)` | Staff Member |
| `total_working_days` | `INTEGER` | `DEFAULT 30` | Calendar days |
| `payable_days_present` | `DECIMAL(4, 1)` | `NOT NULL` | Days worked + Paid Leaves |
| `loss_of_pay_days` | `DECIMAL(4, 1)` | `DEFAULT 0.0` | Unpaid absent days |
| **Earnings: Basic Salary** | `basic_salary_earned` | `DECIMAL(12, 2)` | Base Salary pro-rated |
| **Earnings: HRA** | `house_rent_allowance`| `DECIMAL(12, 2)` | 40% of Basic |
| **Earnings: Special Allowance**| `special_allowance` | `DECIMAL(12, 2)` | Supplementary Allowance |
| **Earnings: Service Commission**| `service_commission_amount`| `DECIMAL(12, 2)`| From `staff_commission_ledger` |
| **Earnings: Retail Commission** | `retail_commission_amount` | `DECIMAL(12, 2)`| From retail product upsells |
| **Earnings: Tips Disbursed** | `tips_amount` | `DECIMAL(12, 2)` | Client gratuities |
| **Gross Earnings Total** | `gross_earnings` | `DECIMAL(12, 2)` | Sum of all earnings components |
| **Deduction: Employee PF (12%)**| `pf_employee_deduction`| `DECIMAL(12, 2)`| 12% of Basic |
| **Deduction: Employee ESI (0.75%)**| `esi_employee_deduction`| `DECIMAL(12, 2)`| 0.75% of Gross |
| **Deduction: Professional Tax (PT)**| `professional_tax` | `DECIMAL(12, 2)`| State PT (e.g. ₹200/month) |
| **Deduction: Income Tax (TDS)** | `tds_income_tax` | `DECIMAL(12, 2)` | Monthly TDS deduction |
| **Total Deductions** | `total_deductions` | `DECIMAL(12, 2)` | Sum of all statutory deductions |
| **Net Salary Payable (₹)** | `net_salary_payable` | `DECIMAL(12, 2)` | `gross_earnings - total_deductions` |
| `salary_slip_pdf_url` | `TEXT` | `NULL` | Downloadable payslip PDF link |

---

## 6. Staff Leave Entitlements & Attendance Summaries

### 6.1 UI Tab: Leave Balance & Approvals Desk
**Primary Database Table:** `employee_leave_balances`  
**Secondary Table:** `employee_leave_requests`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Leave Balance ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Record ID |
| **Employee Link** | `employee_id` | `VARCHAR(64)` | `NOT NULL, FK -> employees(id)` | Staff Member |
| **Calendar Year** | `year` | `INTEGER` | `NOT NULL DEFAULT 2026` | Operating Leave Year |
| **Casual Leave Available** | `casual_leave_balance` | `DECIMAL(4, 1)` | `DEFAULT 12.0` | Paid casual leave days |
| **Sick Leave Available** | `sick_leave_balance` | `DECIMAL(4, 1)` | `DEFAULT 8.0` | Paid medical leave days |
| **Earned / Annual Leave** | `earned_leave_balance` | `DECIMAL(4, 1)` | `DEFAULT 15.0` | Accumulated vacation days |
| **Leave Taken (YTD)** | `leaves_taken_ytd` | `DECIMAL(4, 1)` | `DEFAULT 0.0` | Total leaves utilized |

---

## Summary of Finance & HR Entity Mappings

| Finance & HR UI Module | Primary Database Tables | Key Relations & Scoping | Operational Business Impact |
| :--- | :--- | :--- | :--- |
| **1. Chart of Accounts & General Ledger** | `chart_of_accounts`, `journal_vouchers`, `general_ledger_entries` | `brand_id`, `branch_id`, `account_code` | Double-entry financial accounting, P&L, balance sheet, trial balance |
| **2. GST Tax & Statutory Compliance** | `gst_tax_ledgers`, `invoices` | `branch_id`, `invoice_id`, `hsn_sac_code` | Automated GSTR-1 & GSTR-3B tax calculations, CGST/SGST/IGST, Input Tax Credit (ITC) |
| **3. Accounts Payable (AP)** | `vendor_bills_payable`, `suppliers`, `purchase_orders` | `supplier_id`, `purchase_order_id` | Supplier invoice tracking, Section 194C TDS withholding, debit note adjustments, bank UTR disbursals |
| **4. Employee Master Directory** | `employees`, `branches` | `branch_id`, `employee_code` | Staff KYC verification (Aadhaar, PAN, Bank IFSC, UAN, ESI), salary agreements |
| **5. Payroll & Stylist Commission Engine** | `payroll_runs`, `salary_slips`, `staff_commission_ledger` | `employee_id`, `payroll_run_id` | Automated monthly payroll, stylist service + retail commission merging, PF/ESI/PT/TDS deductions, salary slip generation |
| **6. Leave & Attendance Management** | `employee_leave_balances`, `employee_leave_requests` | `employee_id`, `branch_id` | Leave entitlement tracking, manager approvals, unpaid loss-of-pay (LOP) days deduction |

---
*End of Finance & HR Panel Module Database Schema Specification.*
