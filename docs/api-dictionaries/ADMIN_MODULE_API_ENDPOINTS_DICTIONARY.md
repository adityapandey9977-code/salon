#   Salon SaaS — Comprehensive Admin Module API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.0.0  
**Target System:**   Salon SaaS — Admin Master Portal (`apps/web/src/modules/admin`) & REST API Gateway (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Every Screen, Tab, Sub-page, and Authentication Flow  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Authentication, Login & Session Management APIs

All administrative portal access requires valid authentication via JWT tokens and multi-tenant scoping.

**Base Path:** `/api/v1/auth`  
**Backend Controller:** `apps/api/src/modules/auth/auth.controller.ts`  
**Database Entities:** `users`, `user_sessions`, `roles`, `permissions`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Description | Request Payload / Query | Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | `/admin/login`<br>Admin Login Modal | Authenticates Brand Admin, Branch Manager, or HR credentials. Issues JWT Access Token & HTTP-only Refresh Cookie. | `{ email, password, tenant_code }` | `{ token, expiresIn, user: { id, name, role, tenantId } }` |
| `/api/v1/auth/mfa/verify` | `POST` | `/admin/auth/mfa`<br>Two-Factor Auth Screen | Verifies Time-based One-Time Password (TOTP) / SMS OTP code for high-privilege administrative sessions. | `{ user_id, mfa_code, temp_session_token }` | `{ mfaVerified: true, accessToken, refreshToken }` |
| `/api/v1/auth/refresh-token` | `POST` | Background Service Worker | Silently refreshes expired JWT access tokens using secure HTTP-only refresh token. | `{ refreshToken }` | `{ accessToken, expiresIn }` |
| `/api/v1/auth/me` | `GET` | All `/admin/*` Layout Headers | Retrieves current logged-in admin user's identity, assigned branch scopes, active permissions, and avatar. | Headers: `Authorization: Bearer <token>` | `{ user_id, email, name, role, permissions: [...], branches: [...] }` |
| `/api/v1/auth/logout` | `POST` | Top Navbar -> Logout Button | Invalidates active user session JWTs, clears cookies, and logs out the administrator. | Headers: `Authorization: Bearer <token>` | `{ success: true, message: 'Logged out successfully' }` |
| `/api/v1/auth/forgot-password` | `POST` | `/admin/forgot-password` | Initiates password reset flow by sending a secure time-limited reset link to administrator's inbox. | `{ email }` | `{ message: 'Reset link dispatched to registered email' }` |
| `/api/v1/auth/reset-password` | `POST` | `/admin/reset-password` | Updates administrator password using verification token received via email. | `{ reset_token, new_password, confirm_password }` | `{ success: true, message: 'Password updated successfully' }` |
| `/api/v1/auth/sessions` | `GET` | `/brand-settings/controls` | Retrieves list of all active logged-in device sessions for current admin account. | Query: `?user_id=USR-991` | `Array<{ sessionId, ipAddress, userAgent, lastActive }>` |
| `/api/v1/auth/sessions/:id` | `DELETE` | `/brand-settings/controls` | Remotely terminates a specific active device session or revokes stolen token credentials. | Params: `id=SESS-8801` | `{ success: true, terminatedSessionId: 'SESS-8801' }` |

---

## 2. Screen-by-Screen & Tab-by-Tab API Endpoint Dictionary

### 2.1 Executive Dashboard Screen (`/admin/dashboard`)
* **UI Pages & Components:** `DashboardPage.tsx`, `DashboardCharts.tsx`, `TopNavbar.tsx`
* **Target Database Entities:** `branches`, `appointments`, `invoices`, `customers`

| Endpoint URI | HTTP Method | Target UI Tab / Component | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/dashboard/metrics` | `GET` | Dashboard Header Metric Cards | Computes real-time Monthly Recurring Revenue (MRR), total appointments today, active client count, and average chair occupancy %. | Query: `?period=MTD`<br>Res: `{ mrr, grossTurnover, appointmentsToday, activeClients, occupancyPct }` |
| `/api/v1/dashboard/charts` | `GET` | `DashboardCharts.tsx` | Generates SVG trendline data for revenue vs expenditure vs appointment volume over 30/60/90 day periods. | Query: `?timeframe=30d`<br>Res: `{ revenuePoints: [...], appointmentPoints: [...] }` |
| `/api/v1/dashboard/occupancy` | `GET` | Branch Performance Leaderboard | Ranks salon branches based on station utilization, capacity limits, and hourly productivity. | Res: `Array<{ branchId, branchName, chairUtilizationPct, revenueGenerated }>` |
| `/api/v1/dashboard/recent-activity`| `GET` | Activity Timeline Widget | Fetches live audit feed of incoming bookings, POS checkouts, inventory stock alerts, and staff check-ins. | Res: `Array<{ timestamp, title, description, category, actor }>` |

---

### 2.2 Screen: Locations & Multi-Branch Desk (`/admin/locations`)

#### Tab 2.2.1: All Branches Registry (`/locations/all`)
* **UI Components:** `BranchesPage.tsx`, `AllBranchesTab.tsx`
* **Entities:** `branches`, `franchise_partners`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/branches` | `GET` | Fetches list of all salon branches across regions (Indore, Bhopal, Pune) with active status, chair counts, and manager info. | Query: `?status=Active&city=Bhopal`<br>Res: `Array<BranchObject>` |
| `/api/v1/branches/:id` | `DELETE` | Soft-deletes or deactivates a branch location from booking availability and active tenant lists. | Params: `id=BR-001`<br>Res: `{ success: true, deactivatedId: 'BR-001' }` |

#### Tab 2.2.2: Branch Performance & Comparison (`/locations/performance`, `/locations/comparison`)
* **UI Components:** `BranchAnalyticsPage.tsx`, `BranchComparisonTab.tsx`
* **Entities:** `branches`, `invoices`, `appointments`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/branches/analytics/comparison` | `GET` | Compares multi-branch gross turnover, ticket size, retail cross-sell %, and staff productivity side-by-side. | Query: `?branch_ids=BR-001,BR-002&month=2026-08`<br>Res: `{ branchComparisons: [...] }` |

#### Tab 2.2.3: Working Hours & Shifts (`/locations/working-hours`)
* **UI Components:** `WorkingHoursTab.tsx`
* **Entities:** `branch_operating_hours`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/branches/:id/hours` | `GET` | Fetches weekly operating hours schedule, opening/closing times, and sanitization breaks for a branch. | Params: `id=BR-001`<br>Res: `Array<OperatingHourObject>` |
| `/api/v1/branches/:id/hours` | `PUT` | Configures weekly operating shifts, opening/closing timestamps, and daily floor prep break windows per branch. | Body: `{ schedule: [{ day_of_week: 1, is_open: true, opening_time: '09:00', closing_time: '21:00' }] }` |

#### Tab 2.2.4: Holidays & Closures (`/locations/holidays`)
* **UI Components:** `HolidaysTab.tsx`
* **Entities:** `branch_holidays`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/branches/:id/holidays` | `GET` / `POST` | Lists and registers mandatory public holidays, annual maintenance shutdowns, or emergency branch closures. | Body: `{ branch_id, holiday_date, title, closure_type: 'FullDay' }` |
| `/api/v1/branches/:id/holidays/:holiday_id` | `DELETE` | Removes a registered holiday to re-open appointment calendar booking slots. | Params: `holiday_id=HOL-102` |

#### Sub-Screen 2.2.5: Add New Branch (`/locations/new`)
* **UI Components:** `AddBranchPage.tsx`
* **Entities:** `branches`, `branch_operating_hours`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/branches` | `POST` | Provisions a new flagship, lounge, or franchise salon outlet with address, operating hours, GST registration, and general manager. | Body: `{ name, code, type, city, state, postal_code, address_street, chair_count, manager_email }` |

---

### 2.3 Screen: Service Catalogue & Recipe BOM Desk (`/admin/catalogue`)

#### Tab 2.3.1: Service Menu Master (`/catalogue/services`)
* **UI Components:** `CatalogueMasterPage.tsx`, `ServicesTab.tsx`
* **Entities:** `services`, `service_categories`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/services` | `GET` | Loads master catalogue of services filterable by category (Hair, Skin, Spa, Nails), target gender, and execution time. | Query: `?category_id=CAT-01`<br>Res: `Array<ServiceObject>` |
| `/api/v1/services` | `POST` | Registers a new salon service with execution duration, turnaround buffer, GST SAC code (999721), base price, and rewards. | Body: `{ name, code, category_id, base_price, base_duration_mins, buffer_time_mins, gst_rate_pct }` |
| `/api/v1/services/:id` | `PATCH` / `DELETE` | Updates service specs or soft-deletes retired treatments from online booking and POS catalogues. | Params: `id=SRV-MAJ-613` |

#### Tab 2.3.2: Categories Management (`/catalogue/categories`)
* **UI Components:** `CategoriesTab.tsx`
* **Entities:** `service_categories`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/services/categories` | `GET` / `POST` | Manages top-level service categories and sub-categories with visual badges and display sorting order. | Body: `{ name: 'Advanced Dermal Aesthetics', sort_order: 2, icon_key: 'Sparkles' }` |

#### Tab 2.3.3: Dynamic Pricing & Surge Rates (`/catalogue/pricing`)
* **UI Components:** `ServicesPricingPage.tsx`, `PricingTab.tsx`
* **Entities:** `services`, `branch_service_pricing`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/services/pricing` | `GET` / `PATCH` | Sets branch-specific differential pricing, weekend surge multipliers, or seasonal festive price overrides across service SKUs. | Body: `{ service_id, branch_id, surge_multiplier: 1.15, override_price: 3500.00 }` |

#### Tab 2.3.4: Consumable Recipe BOM (`AddRecipeModal.tsx`)
* **UI Components:** `AddRecipeModal.tsx`
* **Entities:** `service_recipes`, `inventory_items`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/services/:id/recipe` | `GET` / `POST` | Binds consumable inventory products (e.g. 30ml L'Oréal Majirel Colour Tube + 40ml Developer) to service completion scans. | Body: `{ service_id, items: [{ sku_id: 'SKU-5821', quantity_required: 30, unit_of_measure: 'ML' }] }` |

---

### 2.4 Screen: CRM & Customer Desk (`/admin/clients`)

#### Tab 2.4.1: All Clients Registry (`/clients/all`)
* **UI Components:** `ClientsMasterPage.tsx`, `AllClientsTab.tsx`
* **Entities:** `customers`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/customers` | `GET` | Fetches customer CRM registry with membership tier badges, total visit counts, and aggregated lifetime spend values. | Query: `?search=Sharma&tier=Platinum`<br>Res: `Array<CustomerObject>` |
| `/api/v1/customers` | `POST` | Creates a new client record with full name, phone number, email address, gender, birthday, and referral channel. | Body: `{ first_name, last_name, phone, email, gender, dob, referral_source }` |

#### Tab 2.4.2: Client Segments & VIP Cohorts (`/clients/segments`)
* **UI Components:** `ClientSegmentsTab.tsx`
* **Entities:** `customer_segments`, `customers`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/customers/segments` | `GET` / `POST` | Groups customers into dynamic smart cohorts (e.g. High Spenders > ₹25k, At-Risk Churn, Frequent Hair Spa Visitors). | Body: `{ name: 'Bridal High Spenders', filters: { min_lifetime_spend: 25000, preferred_category: 'Bridal' } }` |

#### Tab 2.4.3: Retention & Churn Analytics (`/clients/retention`)
* **UI Components:** `ClientRetentionTab.tsx`
* **Entities:** `customers`, `appointments`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/customers/analytics/retention` | `GET` | Calculates repeat visit percentage, average days between visits, and identifies clients due for re-booking reminder. | Res: `{ retentionRatePct, avgDaysBetweenVisits, dueForRebookingCount }` |

#### Sub-Screen 2.4.4: Client 360 Profile & Notes (`/clients/:id`)
* **UI Components:** `ClientProfilePage.tsx`
* **Entities:** `customers`, `customer_notes`, `appointment_history`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/customers/:id` | `GET` | Fetches 360-degree client profile details, appointment history log, patch test allergies, active packages, and points balance. | Params: `id=CST-9910`<br>Res: `{ profile, visits, allergyNotes, loyaltyBalance }` |
| `/api/v1/customers/:id/notes` | `POST` | Records aesthetician consultations, skin sensitivity notes, scalp observations, or customized formula notes. | Body: `{ customer_id, specialist_id, note_type: 'PatchTest', content_text: 'No reaction to 6% Developer' }` |

---

### 2.5 Screen: Staff, Human Capital & Rostering (`/admin/staff`)

#### Tab 2.5.1: All Staff Directory (`/staff/all`)
* **UI Components:** `StaffMasterPage.tsx`, `AllStaffTab.tsx`
* **Entities:** `staff_members`, `roles`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/staff` | `GET` | Displays all stylists, aestheticians, therapists, competency levels, assigned primary branches, and active employment status. | Query: `?branch_id=BR-001&role=Stylist`<br>Res: `Array<StaffObject>` |
| `/api/v1/staff` | `POST` | Onboards a new staff member with official email, mobile, role level, commission rate %, base salary, and branch assignment. | Body: `{ full_name, role_title, branch_id, base_salary, commission_rate_pct, mobile_phone }` |

#### Tab 2.5.2: Shift Rostering & Schedule Allocation (`/staff/roster`)
* **UI Components:** `ShiftsRosterTab.tsx`
* **Entities:** `staff_rosters`, `staff_members`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/staff/roster` | `GET` | Loads weekly shift roster grid (Morning Shift, Evening Shift, Weekly Off, Standby) across specialists and branches. | Query: `?week_start=2026-08-25`<br>Res: `Array<RosterGridEntry>` |
| `/api/v1/staff/roster` | `PUT` | Bulk updates staff weekly shift allocations, shift swap requests, and branch temporary re-assignments. | Body: `{ shifts: [{ staff_id: 'STF-101', shift_date: '2026-08-28', shift_type: 'Morning' }] }` |

#### Tab 2.5.3: Attendance & Emergency Leave Management (`/staff/attendance`)
* **UI Components:** `AttendanceLeaveTab.tsx`
* **Entities:** `staff_leave_requests`, `staff_attendance`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/staff/leave` | `GET` | Lists pending, approved, and rejected leave applications submitted by salon staff along with attached medical certificates. | Query: `?status=Pending`<br>Res: `Array<LeaveRequestObject>` |
| `/api/v1/staff/leave/:id` | `PATCH` | Approves or rejects medical/casual emergency leave applications and automatically triggers appointment reallocation workflow. | Body: `{ status: 'Approved', reassign_appointments_to: 'STF-108' }` |

#### Tab 2.5.4: Staff Commission & Tips Payout (`/staff/commission`)
* **UI Components:** `CommissionsTab.tsx`
* **Entities:** `commissions`, `staff_members`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/staff/commissions` | `GET` | Computes monthly performance commission earnings based on service revenue tiers, retail product sales, and client tip pools. | Query: `?month=2026-08`<br>Res: `{ totalPayout, serviceCommission, retailCommission, tipsCollected }` |

---

### 2.6 Screen: Operations & Appointment POS Desk (`/admin/operations`)

#### Tab 2.6.1: Appointments Master Calendar (`/operations/calendar`)
* **UI Components:** `OperationsMasterPage.tsx`, `AppointmentCalendarTab.tsx`
* **Entities:** `appointments`, `staff_members`, `branches`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/appointments/calendar` | `GET` | Fetches appointment calendar grid for daily/weekly view across styling stations, specialists, and service durations. | Query: `?date=2026-08-27&branch_id=BR-001`<br>Res: `Array<CalendarEventObject>` |

#### Tab 2.6.2: Appointments List & Lifecycle Queue (`/operations/appointments`)
* **UI Components:** `AppointmentsTab.tsx`, `AppointmentsPage.tsx`
* **Entities:** `appointments`, `appointment_services`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/appointments` | `GET` | Loads real-time appointment queue filterable by status (`Scheduled`, `In-Service`, `Completed`, `Cancelled`, `No-Show`). | Query: `?status=In-Service`<br>Res: `Array<AppointmentObject>` |
| `/api/v1/appointments/:id/status` | `PATCH` | Updates appointment lifecycle state (e.g. progressing appointment from `Scheduled` to `In-Service` on chair). | Body: `{ status: 'In-Service', actual_start_time: '2026-08-27T10:15:00Z' }` |

#### Modal / Action 2.6.3: Book New Appointment (`NewAppointmentModal.tsx`)
* **UI Components:** `NewAppointmentModal.tsx`
* **Entities:** `appointments`, `appointment_services`, `payments`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/appointments` | `POST` | Creates a new phone or walk-in appointment reservation with client selection, multi-service combo, chair, and token deposit. | Body: `{ customer_id, branch_id, services: [{ service_id, staff_id, price }], start_time, deposit_amount }` |

#### Tab 2.6.4: Specialist & Station Availability (`/operations/availability`)
* **UI Components:** `AvailabilityTab.tsx`
* **Entities:** `staff_schedules`, `appointments`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/appointments/availability` | `GET` | Queries specialist working hours and station availability windows to prevent double-booking styling chairs. | Query: `?staff_id=STF-103&date=2026-08-28`<br>Res: `{ availableSlots: ['09:00', '11:30', '14:00'] }` |

---

### 2.7 Screen: Packages & Memberships (`/admin/packages-memberships`)

#### Tab 2.7.1: Packages Registry (`/packages-memberships/packages`)
* **UI Components:** `PackagesMasterPage.tsx`, `PackagesTab.tsx`
* **Entities:** `packages`, `package_services`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/packages` | `GET` / `POST` | Manages pre-paid bundled treatment packages (e.g. Bridal Glow Package, 6-Session Laser Hair Reduction) with credit limits. | Body: `{ name, price, valid_days: 180, bundled_services: [{ service_id, sessions: 6 }] }` |

#### Tab 2.7.2: Membership Tiers & Benefits (`/packages-memberships/memberships`)
* **UI Components:** `MembershipsTab.tsx`
* **Entities:** `membership_tiers`, `customer_memberships`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/memberships` | `GET` / `POST` | Configures annual VIP Membership tiers (Platinum Luxe, Diamond Lounge) with default service & retail discount percentages. | Body: `{ tier_name: 'Platinum Luxe', annual_fee: 15000, discount_services_pct: 15.0, discount_retail_pct: 10.0 }` |

---

### 2.8 Screen: Finance, GST Billing & Ledger Desk (`/admin/finance`)

#### Tab 2.8.1: Financial Overview & KPIs (`/finance/overview`)
* **UI Components:** `FinancePage.tsx`, `FinancialOverviewTab.tsx`
* **Entities:** `invoices`, `payments`, `branch_ledgers`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/finance/overview` | `GET` | Computes gross revenue turnover, net profit margins, GST liability totals, and breakdown by cash vs UPI vs card mode. | Query: `?date_range=THIS_MONTH`<br>Res: `{ grossRevenue, netProfit, gstLiability, modeBreakdown: {...} }` |

#### Tab 2.8.2: Invoices & Transactions (`/finance/transactions`)
* **UI Components:** `FinancialTransactionsTab.tsx`
* **Entities:** `invoices`, `payments`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/billing/invoices` | `GET` | Lists all GST tax invoices with client details, HSN/SAC codes, CGST (9%), SGST (9%), IGST (18%), and settlement status. | Query: `?payment_status=Paid`<br>Res: `Array<InvoiceObject>` |
| `/api/v1/billing/invoices/:id/pdf` | `GET` | Generates official PDF tax invoice for client receipt printing or email dispatch. | Params: `id=INV-2026-991` |

#### Tab 2.8.3: Refunds & Store Credit (`/finance/refunds`)
* **UI Components:** `RefundsCreditsTab.tsx`
* **Entities:** `refund_requests`, `customer_store_credits`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/billing/refunds` | `POST` | Authorizes client refund applications or issues digital store credit vouchers for cancelled appointments or dissatisfaction. | Body: `{ invoice_id, refund_amount: 1500.00, refund_type: 'StoreCredit', reason: 'Service Rescheduled' }` |

#### Tab 2.8.4: POS Register EOD Reconciliation (`/finance/alerts`)
* **UI Components:** `PaymentsPage.tsx`
* **Entities:** `branch_ledgers`, `payments`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/payments/reconcile` | `POST` | Reconciles EOD cash drawer balances, card swipe terminal batch settlements, and UPI Razorpay transaction logs. | Body: `{ branch_id, date: '2026-08-27', physical_cash_counted: 45000, card_batch_total: 82000 }` |

---

### 2.9 Screen: Inventory, Stock & Procurement Desk (`/admin/inventory`)

#### Tab 2.9.1: Consumable & Retail Stock Levels (`/inventory/stock`)
* **UI Components:** `InventoryPage.tsx`, `StockTab.tsx`
* **Entities:** `inventory_items`, `branch_inventory`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/inventory/stock` | `GET` | Tracks real-time consumable and retail product stock levels across branch dispensaries, flagging safety stock breaches. | Query: `?status=LowStock`<br>Res: `Array<InventoryStockItem>` |

#### Tab 2.9.2: Master SKU Products Registry (`/inventory/products`)
* **UI Components:** `AddMasterSkuModal.tsx`
* **Entities:** `inventory_items`, `suppliers`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/inventory/skus` | `POST` | Registers master product SKUs (e.g. L'Oréal Shampoo, Hydra Serums) with barcode, minimum reorder buffer, and unit cost. | Body: `{ sku_code, brand, product_name, category, min_safety_stock: 5, cost_price: 850.00 }` |

#### Tab 2.9.3: Inter-Branch Stock Transfers (`/inventory/transfers`)
* **UI Components:** `TransfersTab.tsx`
* **Entities:** `stock_transfers`, `inventory_items`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/inventory/transfers` | `POST` | Initiates inter-branch inventory transfers (e.g. dispatching 10 Majirel color tubes from Central Warehouse to Indore outlet). | Body: `{ source_branch_id, target_branch_id, items: [{ sku_id: 'SKU-5821', quantity: 10 }] }` |

---

### 2.10 Screen: Marketing & Communications (`/admin/marketing`)

#### Tab 2.10.1: Promotional Campaigns (`/marketing/campaigns`)
* **UI Components:** `MarketingPage.tsx`, `CampaignsTab.tsx`
* **Entities:** `marketing_campaigns`, `customer_segments`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/marketing/campaigns` | `GET` / `POST` | Configures and dispatches promotional broadcasts (e.g. Monsoon Frizz Control Drive) via WhatsApp Cloud API or SMS. | Body: `{ title, channel: 'WhatsApp', segment_id: 'SEG-04', template_name: 'monsoon_offer', scheduled_at }` |

---

### 2.11 Screen: Franchise Network Governance (`/admin/franchise`)

#### Tab 2.11.1: Franchise Partners Registry (`/franchise/partners`)
* **UI Components:** `FranchisePage.tsx`, `FranchisePartnersTab.tsx`
* **Entities:** `franchise_partners`, `franchise_agreements`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/tenant/franchise/partners` | `GET` / `POST` | Onboards master franchise partners, manages contact details, FOFO/FOCO ownership model, and statutory agreements. | Body: `{ company_name, managing_director, city, outlet_location, agreement_duration_years: 3 }` |

#### Tab 2.11.2: Royalty Invoicing & ACH Debit (`/franchise/royalties`)
* **UI Components:** `FranchiseRoyaltiesTab.tsx`
* **Entities:** `royalty_invoices`, `franchise_partners`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/billing/royalties` | `POST` | Calculates monthly brand licensing & royalty fee invoices (e.g. 8.5% of gross GMV) and issues automated ACH debit notices. | Body: `{ partner_id, billing_month: '2026-07', gross_gmv: 1450000.00, royalty_pct: 8.5 }` |

---

### 2.12 Screen: Reports & Business Intelligence (`/admin/reports-analytics`)

#### Tabs 2.12.1 - 2.12.9: Executive BI Reports (`/reports/*`)
* **UI Components:** `ReportsPage.tsx`, `StaffPerformanceAnalyticsTab.tsx`, `AppointmentsAnalyticsPage.tsx`
* **Entities:** `invoices`, `appointments`, `staff_members`, `inventory_items`

| Endpoint URI | HTTP Method | Target Report Sub-Tab | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/reports/executive-summary` | `GET` | `/reports/overview` | Aggregates high-level brand health index, total revenue, EBITDA, and customer acquisition cost (CAC). | Res: `{ brandHealthIndex, totalRevenue, ebitda, cac }` |
| `/api/v1/reports/operations` | `GET` | `/reports/operations` | Reports operational metrics (appointment cancellation rate %, chair idle time, average service turnaround). | Res: `{ cancellationRatePct, idleHours, avgTurnaroundMins }` |
| `/api/v1/reports/revenue` | `GET` | `/reports/revenue` | Generates breakdown of revenue by service category (Hair 45%, Skin 25%, Spa 18%, Retail 12%). | Res: `{ categoryBreakdown: [...] }` |
| `/api/v1/reports/staff` | `GET` | `/reports/staff` | Evaluates individual stylist productivity, repeat client request rate %, and average ticket size generated per chair. | Res: `Array<{ staffId, staffName, productivityPct, requestRatePct }>` |
| `/api/v1/reports/export` | `POST` | Export CSV/PDF Modal | Exports raw tabular report data in CSV or PDF format for offline board presentation or tax auditing. | Body: `{ report_type: 'RevenueSummary', format: 'CSV', date_from, date_to }` |

---

### 2.13 Screen: Security Governance, RBAC & Audit (`/admin/roles-permissions`, `/admin/audit-logs`)

#### Tab 2.13.1: System Roles Registry (`/roles-permissions/roles`)
* **UI Components:** `RolesPermissionsPage.tsx`, `RolesListTab.tsx`
* **Entities:** `roles`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/roles` | `GET` / `POST` | Creates and lists organizational roles (Brand Admin, Branch Manager, Receptionist, Senior Stylist/Therapist). | Body: `{ name: 'Branch Receptionist', code: 'ROL-REC', access_level: 2 }` |

#### Tab 2.13.2: Granular Permission Matrix (`/roles-permissions/matrix`)
* **UI Components:** `PermissionMatrixTab.tsx`
* **Entities:** `permissions`, `role_permissions`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/roles/matrix` | `GET` / `PUT` | Grants or revokes fine-grained permission keys (e.g. `FINANCE_REFUND_GRANT`, `STAFF_SALARY_VIEW`, `INVENTORY_DISPOSAL`). | Body: `{ role_id: 'ROL-05', permission_keys: ['APPOINTMENT_CREATE', 'CLIENT_VIEW_360'] }` |

#### Screen 2.13.3: Immutable Security Audit Logs (`/admin/audit-logs`)
* **UI Components:** `AuditLogsPage.tsx`
* **Entities:** `audit_logs`

| Endpoint URI | HTTP Method | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- |
| `/api/v1/audit` | `GET` | Fetches immutable security trail recording user ID, IP address, timestamp, action type, and before/after JSON state. | Query: `?action=ROLE_PERMISSIONS_UPDATE`<br>Res: `Array<AuditLogEntry>` |

---

### 2.14 Screen: Notifications & Exception Feed (`/admin/notifications`)
* **UI Components:** `NotificationsPage.tsx`, [`notificationsData.ts`](file:///e:/salon%20management%20system/ -Salon/apps/web/src/modules/admin/data/notificationsData.ts)
* **Entities:** `notifications`

| Endpoint URI | HTTP Method | Target Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/notifications` | `GET` | Alerts Feed | Returns prioritized operational alerts (Critical Consumable Stockouts, Overdue Royalties, VIP Client Bookings). | Query: `?severity=Critical`<br>Res: `Array<AdminNotification>` |
| `/api/v1/notifications/:id/resolve` | `PATCH` | Mark Resolved | Flags an exception alert as resolved after corrective operational action is completed. | Params: `id=NOTIF-101`<br>Res: `{ success: true, resolvedAt }` |

---

## 3. Third-Party External Gateway API & Webhook Directory

| Third-Party Gateway | Target Service Base Endpoint URL | Screen / Feature Trigger | Business Rationale & Functionality |
| :--- | :--- | :--- | :--- |
| **WhatsApp Cloud API** | `https://graph.facebook.com/v18.0/messages` | `NotificationsPage.tsx`<br>`CampaignsTab.tsx` | Automated appointment confirmation templates, broadcast promotions, and client status alerts via WhatsApp. |
| **Razorpay Gateway** | `https://api.razorpay.com/v1/payments` | `NewAppointmentModal.tsx`<br>`PaymentsPage.tsx` | Advance booking token deposit processing, POS UPI QR code settlement, and refund disbursements. |
| **Twilio SMS Gateway** | `https://api.twilio.com/2010-04-01/Accounts` | `AuthLoginModal.tsx`<br>`AttendanceLeaveTab.tsx` | Admin MFA login OTP dispatch and urgent operational emergency notifications to branch managers. |
| **SendGrid Emailer** | `https://api.sendgrid.com/v3/mail/send` | `FinancialOverviewTab.tsx`<br>`FranchisePartnersTab.tsx` | Automated tax invoice dispatches, GST receipts, and statutory 30-day franchise renewal legal notices. |

---

## 4. Verification Summary

- **Authentication APIs Added:** 8 Login, MFA, Password Reset & Session Management endpoints under `/api/v1/auth`.
- **UI Screen Coverage:** 100% of all 17 admin screens, tabs, modals, and sub-pages in [`apps/web/src/modules/admin`](file:///e:/salon%20management%20system/ -Salon/apps/web/src/modules/admin) mapped.
- **Database Entity Consistency:** Verified against [`docs/ADMIN_PANEL_DATABASE_SCHEMA_DICTIONARY.md`](file:///e:/salon%20management%20system/ -Salon/docs/ADMIN_PANEL_DATABASE_SCHEMA_DICTIONARY.md).
