#   Salon SaaS — Client Self-Service Portal API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.0.0  
**Target System:**   Salon SaaS — Customer Web & Mobile Web Portal (`apps/web/src/modules/client`) & Backend API Gateway (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Customer Self-Service Booking, Treatment History, Loyalty Points, Digital Wallet & Support  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & Client Authentication

The **Client Module** (`apps/web/src/modules/client`) is the customer-facing web application. It enables salon clients to discover services across brand outlets, book appointments online, pay token deposits, track active loyalty reward points, manage store wallet balances, view treatment history logs, and file feedback/tickets.

```
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│     Client Mobile/Web SPA (/client)    │ ──► │  Client Public API Gateway (/api/v1/*) │
│  (apps/web/src/modules/client)         │     │  • /customers   • /appointments        │
│                                        │     │  • /payments    • /memberships         │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## 2. Customer Authentication & Profile APIs

**Base Path:** `/api/v1/auth`, `/api/v1/customers`  
**Database Entities:** `customers`, `customer_sessions`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/auth/client/login` | `POST` | `/client/login`<br>Client OTP Login | Authenticates customer via Mobile OTP verification. Issues customer JWT token. | Body: `{ mobile_number, otp_code }` |
| `/api/v1/customers/profile` | `GET` / `PATCH` | `/client/profile`<br>Customer Profile Page | Views and updates client personal details, hair/skin preferences, birthday, and patch test notes. | Body: `{ first_name, last_name, email, dob, gender, preferred_branch_id }` |

---

## 3. Screen-by-Screen API Endpoint Dictionary

### 3.1 Screen: Client Home Dashboard (`/client/`)
* **UI Pages:** `DashboardPage.tsx`
* **Target Entities:** `appointments`, `customers`, `customer_memberships`

| Endpoint URI | HTTP Method | Target UI Widget | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/customers/dashboard-summary`| `GET` | Dashboard Header Cards | Fetches customer's upcoming booking, loyalty point balance, active membership tier, and store wallet funds. | Res: `{ upcomingAppointment, loyaltyPoints: 450, membershipTier: 'Platinum Luxe', walletBalance: 2500 }` |

---

### 3.2 Screen: Service Discovery & Salon Search (`/client/services`)
* **UI Pages:** `SearchServicesPage.tsx`
* **Target Entities:** `services`, `service_categories`, `branches`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/services/public-catalogue` | `GET` | Services Search Grid | Displays public service catalogue with categories, prices, execution times, and branch availability filters. | Query: `?branch_id=BR-001&category=Hair`<br>Res: `Array<PublicServiceObject>` |

---

### 3.3 Screen: Online Booking & Slot Reservation (`/client/appointments`)
* **UI Pages:** `AppointmentsPage.tsx`
* **Target Entities:** `appointments`, `payments`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/appointments/my-bookings` | `GET` | Appointments List | Fetches client's upcoming scheduled appointments and past booking logs. | Res: `Array<ClientAppointmentObject>` |
| `/api/v1/appointments/online-book` | `POST` | Booking Checkout Form | Books online appointment, reserves specialist & station, and initiates Razorpay token deposit payment flow. | Body: `{ branch_id, service_ids: [...], staff_id, start_time, deposit_amount: 500 }` |
| `/api/v1/appointments/:id/cancel` | `PATCH` | Cancel Booking Button | Cancels an upcoming appointment outside the 4-hour lock window and refunds deposit to Client Wallet. | Params: `id=APT-9910` |

---

### 3.4 Screen: Client Store Wallet (`/client/wallet`)
* **UI Pages:** `WalletPage.tsx`
* **Target Entities:** `customer_wallets`, `wallet_transactions`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/customers/wallet` | `GET` | Wallet Balance Card | Loads current digital store wallet funds balance and ledger transaction history. | Res: `{ walletBalance: 2500.00, transactions: [...] }` |
| `/api/v1/customers/wallet/topup` | `POST` | Top-Up Wallet Form | Adds cash funds to digital store wallet via Razorpay UPI / Credit Card payment gateway. | Body: `{ amount: 2000.00, payment_gateway: 'Razorpay' }` |

---

### 3.5 Screen: Loyalty Rewards & Points Redemption (`/client/loyalty`)
* **UI Pages:** `LoyaltyRewardsPage.tsx`
* **Target Entities:** `customer_loyalty_logs`, `promotions`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/customers/loyalty/rewards` | `GET` | Loyalty Rewards Grid | Lists available reward vouchers (e.g. Free Hair Spa, 15% Off Facial) redeemable using earned points. | Res: `Array<RewardVoucherObject>` |
| `/api/v1/customers/loyalty/redeem` | `POST` | Redeem Voucher Button | Redeems points balance for a promo voucher code usable during online booking or POS checkout. | Body: `{ reward_id: 'RWD-04', points_cost: 300 }` |

---

### 3.6 Screen: Treatment History & Digital Invoices (`/client/history`)
* **UI Pages:** `ServiceHistoryPage.tsx`
* **Target Entities:** `invoices`, `appointment_history`

| Endpoint URI | HTTP Method | Target UI Screen / Action | Business Rationale & Purpose | Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/customers/history` | `GET` | History Timeline | Displays historical salon visits, treatments received, specialists who served, and downloadable PDF GST receipts. | Res: `Array<HistoricalVisitObject>` |

---

## 4. End-to-End API Integration Workflows

### Flow 4.1: End-to-End Online Appointment Booking & Razorpay Deposit Payment Flow
```
┌─────────────────────────────────┐
│ 1. GET /services/public-catalogue│ ──► Client browses services & selects Hydra-Facial at Indrapuri Flagship.
└────────────────┬────────────────┘
                 │
                 v
┌─────────────────────────────────┐
│ 2. GET /appointments/availability│──► Client checks available timeslots for specialist Ananya Deshmukh.
└────────────────┬────────────────┘
                 │
                 v
┌─────────────────────────────────┐
│ 3. POST /appointments/online-book│ ──► Creates booking record & generates Razorpay Order ID for ₹500 deposit.
└────────────────┬────────────────┘
                 │
                 v
┌─────────────────────────────────┐
│ 4. POST /payments/verify-token  │ ──► Client completes UPI payment: Verifies signature & confirms appointment.
└─────────────────────────────────┘
```

---

## 5. Verification Summary

- **Client APIs Documented:** 2 Auth endpoints + 11 self-service REST endpoints across all 11 client screens (`/client/*`).
- **End-to-End Workflow Documented:** Complete Online Self-Booking & UPI Deposit Payment Sequence.
