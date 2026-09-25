#   Salon SaaS — Call Center Module API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.0.0  
**Target System:**   Salon SaaS — Call Center Workspace (`apps/web/src/modules/call-center`) & Backend Gateway API (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Every Call Center Screen, Lead Pipeline, Multi-Branch Booking, Confirmation Desk, and End-to-End Agent Workflows  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & Telephony Integration

The **Call Center Module** (`apps/web/src/modules/call-center`) empowers centralized customer service representatives, telephone booking agents, and client recovery specialists to handle inbound/outbound calls, schedule appointments across all salon outlets, qualify sales leads, execute win-back campaigns for lost clients, and sell pre-paid treatment packages.

```
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│     Call Center Agent Workspace        │ ──► │  Centralized API Gateway (/api/v1/*)   │
│  (apps/web/src/modules/call-center)    │     │  • /appointments   • /customers        │
│                                        │     │  • /marketing      • /consultations    │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## 2. Agent Authentication & Session APIs

**Base Path:** `/api/v1/auth`  
**Database Entities:** `users`, `user_sessions`, `roles`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Agent Login Screen | Authenticates call center agent credentials and issues JWT session token. | Body: `{ email, password, role: 'CALL_CENTER_AGENT' }` |
| `/api/v1/auth/me` | `GET` | Header & Agent Status Bar | Fetches agent profile, assigned shift queue, total call handling quota, and telephony extension. | Res: `{ user_id, name, agent_extension: '104', shift_status: 'OnCall' }` |

---

## 3. Screen-by-Screen API Endpoint Dictionary

### 3.1 Screen: Agent Dashboard & Call Queue Pulse (`/call-center/`)
* **UI Pages:** `DashboardPage.tsx`
* **Target Entities:** `appointments`, `customers`, `marketing_campaigns`

| Endpoint URI | HTTP Method | Target UI Widget | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/dashboard/call-center-kpis` | `GET` | Overview KPI Cards | Computes calls handled today, appointments booked, lead conversion %, and pending confirmation calls. | Res: `{ callsHandled, appointmentsBooked, leadConversionPct, pendingConfirmations }` |
| `/api/v1/appointments/agent-queue` | `GET` | Priority Call List | Retrieves real-time queue of upcoming unconfirmed appointments requiring agent outbound verification. | Res: `Array<UnconfirmedAppointmentItem>` |

---

### 3.2 Screen: Sales Leads & Qualification Pipeline (`/call-center/leads`)
* **UI Pages:** `LeadsPage.tsx`
* **Target Entities:** `leads`, `customer_segments`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/customers/leads` | `GET` | Leads Pipeline Kanban | Loads inbound phone, website, and Instagram campaign lead inquiries filterable by status (`New`, `Contacted`, `Qualified`, `Booked`). | Query: `?status=New`<br>Res: `Array<LeadObject>` |
| `/api/v1/customers/leads` | `POST` | New Lead Modal | Registers a new sales inquiry with caller contact info, requested services, preferred branch, and source campaign tag. | Body: `{ name, phone, preferred_branch_id, requested_service, lead_source: 'Instagram' }` |
| `/api/v1/customers/leads/:id/status`| `PATCH` | Lead Stage Cards | Updates lead pipeline stage, records call interaction notes, or converts lead into a registered customer profile. | Body: `{ status: 'Qualified', next_followup_date: '2026-08-28T11:00:00Z', notes: 'Interested in Bridal Spa' }` |

---

### 3.3 Screen: Multi-Branch Appointment Booking (`/call-center/appointments`)
* **UI Pages:** `AppointmentsPage.tsx`
* **Target Entities:** `appointments`, `branches`, `staff_schedules`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/appointments/cross-branch` | `GET` | Multi-Branch Calendar | Searches appointment slot availability across all salon locations (Indore, Bhopal, Pune) for phone callers. | Query: `?city=Bhopal&service_id=SRV-01&date=2026-08-28`<br>Res: `{ availableBranches: [...] }` |
| `/api/v1/appointments/tele-book` | `POST` | Phone Reservation Form | Books a phone appointment with advance deposit payment link generation sent via SMS/WhatsApp. | Body: `{ client_id, branch_id, staff_id, start_time, send_payment_link: true }` |

---

### 3.4 Screen: Appointment Confirmation & Reminder Calls (`/call-center/confirmations`)
* **UI Pages:** `ConfirmationsPage.tsx`
* **Target Entities:** `appointments`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/appointments/pending-confirmations`| `GET` | Confirmations Grid | Lists appointments scheduled for tomorrow requiring phone or WhatsApp confirmation to prevent no-shows. | Query: `?date=TOMORROW`<br>Res: `Array<ConfirmationItem>` |
| `/api/v1/appointments/:id/confirm` | `PATCH` | "Confirm Booking" Button | Marks appointment as `Confirmed` by phone call, or logs client reschedule/cancellation request. | Body: `{ action: 'Confirmed', call_disposition: 'Confirmed By Phone' }` |

---

### 3.5 Screen: Lost Client Win-Back Recovery (`/call-center/recovery`)
* **UI Pages:** `LostClientRecoveryPage.tsx`
* **Target Entities:** `customers`, `marketing_campaigns`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/customers/dormant` | `GET` | Inactive Clients List | Identifies high-value clients who have not visited any salon branch in over 90 days. | Query: `?days_inactive=90`<br>Res: `Array<DormantClientObject>` |
| `/api/v1/marketing/winback-offer` | `POST` | Win-Back Coupon Dispatch | Issues an exclusive 25% discount voucher to inactive clients during a win-back recovery phone call. | Body: `{ client_id, coupon_code: 'WINBACK25', valid_days: 14 }` |

---

### 3.6 Screen: Package Sales & Upsell (`/call-center/sales-packages`)
* **UI Pages:** `SalesPackagesPage.tsx`
* **Target Entities:** `packages`, `customer_packages`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/packages/tele-sales` | `POST` | Package Sell Form | Sells bundled treatment plans (e.g., Annual Hydra-Facial Care Pack) to phone clients and dispatches digital invoice payment link. | Body: `{ client_id, package_id, payment_mode: 'PaymentLink' }` |

---

## 4. End-to-End API Integration Workflows

### Flow 4.1: End-to-End Inbound Call Lead Qualification & Booking Flow
```
┌─────────────────────────────────┐
│ 1. GET /customers?phone=...     │ ──► Agent receives call & searches customer profile by caller ID.
└────────────────┬────────────────┘
                 │
                 v
┌─────────────────────────────────┐
│ 2. POST /customers/leads        │ ──► If new caller: Creates lead profile & tags source (e.g. Google Ads).
└────────────────┬────────────────┘
                 │
                 v
┌─────────────────────────────────┐
│ 3. GET /appointments/cross-branch│──► Searches available slots across Indore/Bhopal branches for caller's preferred date.
└────────────────┬────────────────┘
                 │
                 v
┌─────────────────────────────────┐
│ 4. POST /appointments/tele-book │ ──► Reserves appointment & sends Razorpay token deposit link via WhatsApp.
└─────────────────────────────────┘
```

---

## 5. Verification Summary

- **Call Center APIs Documented:** 2 Auth endpoints + 12 operational REST endpoints across all 11 call center screens (`/call-center/*`).
- **End-to-End Workflow Documented:** Complete Inbound Tele-Booking & Lead Qualification Sequence.
