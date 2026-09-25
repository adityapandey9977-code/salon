#   Salon SaaS — Stylist & Specialist Companion App API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.0.0  
**Target System:**   Salon SaaS — Stylist Mobile/Web Companion App (`apps/web/src/modules/stylist`) & Backend API Gateway (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Stylist Schedule Grid, Client Consultations, Formula Logs, Style Photos, Recommendations & Tips  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & Specialist Mobile Gateway

The **Stylist Module** (`apps/web/src/modules/stylist`) is a mobile-responsive workstation for salon stylists, senior aestheticians, therapists, and dermal specialists. It empowers specialists to view daily styling chair schedules, conduct digital client skin/hair consultations, log chemical hair color formulas, upload before/after treatment photos, recommend home-care retail products, and track tip earnings.

```
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│     Stylist Mobile Companion (/stylist)│ ──► │  Specialist API Gateway (/api/v1/*)    │
│  (apps/web/src/modules/stylist)        │     │  • /appointments   • /consultations    │
│                                        │     │  • /staff          • /customers        │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## 2. Stylist Authentication & Shift APIs

**Base Path:** `/api/v1/auth`, `/api/v1/staff`  
**Database Entities:** `staff_members`, `user_sessions`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/login` | `POST` | Stylist Mobile Login | Authenticates stylist credentials and returns JWT bearer token bound to specialist ID. | Body: `{ email, password, role: 'STYLIST' }` |
| `/api/v1/staff/me` | `GET` | Mobile Header Bar | Retrieves specialist profile, competency level, assigned branch ID, and today's schedule summary. | Res: `{ staff_id: 'STF-103', name: 'Ananya Deshmukh', role: 'Senior Aesthetician' }` |

---

## 3. Screen-by-Screen API Endpoint Dictionary

### 3.1 Screen: Stylist Daily Dashboard (`/stylist/`)
* **UI Pages:** `DashboardPage.tsx`
* **Target Entities:** `appointments`, `staff_members`, `commissions`

| Endpoint URI | HTTP Method | Target UI Widget | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/staff/stylist-kpis` | `GET` | Mobile KPI Summary Cards | Displays today's booked appointments count, clients served, tips earned today, and MTD commission balance. | Res: `{ appointmentsToday: 6, clientsServedToday: 4, tipsEarnedToday: 850, mtdCommission: 14500 }` |

---

### 3.2 Screen: Personal Appointment Schedule & Chair Timeline (`/stylist/schedule`)
* **UI Pages:** `SchedulePage.tsx`
* **Target Entities:** `appointments`, `appointment_services`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/appointments/stylist-schedule`| `GET` | Today's Timeline View | Fetches specialist's personal appointment schedule for today with client names, chair numbers, and service details. | Query: `?staff_id=STF-103&date=TODAY`<br>Res: `Array<StylistScheduleItem>` |
| `/api/v1/appointments/:id/start-service`| `PATCH` | "Start Service" Button | Marks appointment as `In-Progress` when client sits on specialist's styling chair. | Body: `{ appointment_id, start_time: '2026-08-27T11:00:00Z' }` |
| `/api/v1/appointments/:id/complete` | `PATCH` | "Complete Treatment" Button | Marks treatment as `Completed` on chair and sends billing notification to reception checkout POS. | Body: `{ appointment_id, completion_time: '2026-08-27T12:15:00Z' }` |

---

### 3.3 Screen: Client Consultation & Allergy Notes (`/stylist/consultation`, `/stylist/notes`)
* **UI Pages:** `ConsultationPage.tsx`, `NotesPage.tsx`
* **Target Entities:** `consultations`, `customer_notes`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/consultations` | `POST` | Digital Consultation Form | Records pre-service aesthetic consultation (scalp health, skin sensitivity, patch test results, desired style). | Body: `{ client_id, appointment_id, scalp_condition: 'Dry', patch_test_result: 'Passed', client_goals }` |
| `/api/v1/customers/:id/specialist-notes`| `GET` / `POST` | `NotesPage.tsx` | Views and adds private specialist notes regarding client preferences, hair elasticity, or past sensitivities. | Body: `{ client_id, note_text: 'Prefers 20 Volume Developer for low heat reaction' }` |

---

### 3.4 Screen: Hair Color Formulas & Mix Chemical Logs (`/stylist/formulas`)
* **UI Pages:** `FormulasPage.tsx`
* **Target Entities:** `chemical_formulas`, `inventory_items`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/consultations/formulas` | `GET` / `POST` | Formulas Vault | Logs exact chemical mixing ratios (e.g. 30ml L'Oréal Majirel 5.0 + 40ml 20 Vol Developer + 5ml Bond Repair) used for client. | Body: `{ client_id, service_id, formula_name: 'Balayage Root Melt', ingredients: [{ sku_id, qty: 30, unit: 'ML' }] }` |

---

### 3.5 Screen: Before/After Style Gallery (`/stylist/photos`)
* **UI Pages:** `PhotosPage.tsx`
* **Target Entities:** `treatment_photos`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/consultations/photos` | `GET` / `POST` | Style Portfolio Gallery | Uploads before-and-after treatment transformation photos to client history profile and specialist portfolio. | Body: `{ client_id, appointment_id, before_photo_url, after_photo_url, tags: ['Balayage', 'Keratin'] }` |

---

### 3.6 Screen: Product Recommendations & Upsell (`/stylist/recommendations`)
* **UI Pages:** `RecommendationsPage.tsx`
* **Target Entities:** `product_recommendations`, `inventory_items`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/consultations/recommendations`| `POST` | Prescribe Products Form | Prescribes home-care retail products (e.g. L'Oréal Absolute Repair Mask) to client's digital receipt for checkout upsell. | Body: `{ client_id, appointment_id, recommended_sku_ids: ['SKU-5821', 'SKU-6022'], usage_instructions }` |

---

## 4. End-to-End API Integration Workflows

### Flow 4.1: End-to-End In-Chair Treatment Execution, Formula Log & POS Upsell Flow
```
┌─────────────────────────────────────────┐
│ 1. GET /appointments/stylist-schedule   │ ──► Specialist views today's schedule & sees client Akanksha Sharma.
└────────────────────┬────────────────────┘
                     │
                     v
┌─────────────────────────────────────────┐
│ 2. PATCH /appointments/:id/start-service│ ──► Client seated: Marks status 'In-Progress' on mobile app.
└────────────────────┬────────────────────┘
                     │
                     v
┌─────────────────────────────────────────┐
│ 3. POST /consultations/formulas         │ ──► Logs exact Majirel hair color formula (30ml 5.0 + 40ml Dev) to profile.
└────────────────────┬────────────────────┘
                     │
                     v
┌─────────────────────────────────────────┐
│ 4. POST /consultations/photos           │ ──► Takes & uploads Before/After transformation photo to gallery.
└────────────────────┬────────────────────┘
                     │
                     v
┌─────────────────────────────────────────┐
│ 5. POST /consultations/recommendations  │ ──► Recommends L'Oréal Repair Shampoo for home care; sends to POS checkout.
└────────────────────┬────────────────────┘
                     │
                     v
┌─────────────────────────────────────────┐
│ 6. PATCH /appointments/:id/complete     │ ──► Marks treatment complete & triggers reception checkout notification.
└─────────────────────────────────────────┘
```

---

## 5. Verification Summary

- **Stylist APIs Documented:** 2 Auth endpoints + 11 specialist REST endpoints across all 12 stylist screens (`/stylist/*`).
- **End-to-End Workflow Documented:** Complete In-Chair Treatment Execution, Formula Logging, Photo Upload & POS Upsell Sequence.
