# Feature: Create Billing Invoice

## 1. Business Context & Overview
Generates compliant GST tax invoices for salon services and retail items.

## 2. Service Ownership
- **Owner**: `commerce-service`
- **Database**: `commerce_db` (table: `invoices`, `invoice_line_items`)

## 3. API Contract
- **Endpoint**: `POST /api/v1/billing/checkout`
- **Permissions**: `invoice.manage`

## 4. Architecture & Persistence Flow
1. Persist immutable financial line items in `invoices` and `invoice_line_items`.
2. Publish `InvoiceCreated` domain event.
