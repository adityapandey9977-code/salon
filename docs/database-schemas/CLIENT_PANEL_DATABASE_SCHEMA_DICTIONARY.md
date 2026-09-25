#   Salon SaaS — Client Panel Module Database Schema & UI Field Mapping Dictionary

**Document Version:** 3.2.0  
**Target System:**   Salon SaaS Customer Mobile App & Web Portal (`apps/customer-mobile` & `/client-portal/*`)  
**Scope:** Client / Customer Workspace (Self-Service Booking, Real-Time Appointment Tracking, Digital Wallet & Packages, Service History, Formula Cards & Reviews)  
**Classification:** Complete Database Dictionary & Technical UI-to-Schema Mapping  

---

## Architecture & Client Self-Service Domain Map

The **Client Panel** operates with **Client Self-Service Scoping** (`WHERE client_id = :current_client_id`). Customers discover services across brand outlets, book specialist stylists, manage prepaid wallet balances, track package voucher redemptions, and review digital tax invoices.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                                CLIENT SELF-SERVICE DOMAIN MAP                                          │
├────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────┤
│ 1. Service Discovery & Booking │ 2. Live Appointments & QR Check-In    │ 3. Wallet, Packages & Reviews │
│  • Categorized Service Catalog │  • Upcoming Bookings Schedule         │  • Prepaid Account Wallet (₹) │
│  • Branch & Stylist Selection  │  • Real-Time Appointment Status       │  • Session Package Balances   │
│  • Time-Slot Scheduling Matrix │  • Reschedule & Cancellation Flow     │  • Loyalty Points & VIP Tiers │
│  • Advance Deposit / UPI Pay   │  • Front-Desk QR Code Check-In        │  • 5-Star Reviews & Tips      │
└────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────┘
```

---

## 1. Client Identity, Authentication & Profile Preferences

### 1.1 UI Page: Client Profile & Preferences (`CustomerProfileScreen.tsx`)
**Primary Database Table:** `clients`  
**Secondary Tables:** `client_addresses`, `client_hair_skin_profiles`

| UI Form Field / Profile Element | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Customer ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Client Record ID (e.g. `CLT-001`) |
| **Primary Mobile Number** | `mobile_phone` | `VARCHAR(20)` | `UNIQUE, NOT NULL` | OTP Authentication Login Key |
| **Given First Name** | `first_name` | `VARCHAR(80)` | `NOT NULL` | Client Name |
| **Family Last Name** | `last_name` | `VARCHAR(80)` | `NOT NULL` | Client Surname |
| **Email Address** | `email` | `VARCHAR(150)` | `NULL` | Invoicing & Appointment Reminders |
| **Profile Avatar URL** | `avatar_url` | `TEXT` | `NULL` | Profile Picture Asset Link |
| **Gender** | `gender` | `VARCHAR(20)` | `DEFAULT 'Female'` | `Female`, `Male`, `Other` |
| **Date of Birth** | `birth_date` | `DATE` | `NULL` | Birthday Gift Voucher Trigger |
| **Wedding Anniversary** | `anniversary_date` | `DATE` | `NULL` | Anniversary Promotion Trigger |
| **Preferred Home Branch** | `preferred_branch_id` | `VARCHAR(64)` | `NULL, FK -> branches(id)` | Default booking outlet |
| **Favourite Master Stylist** | `favourite_stylist_id` | `VARCHAR(64)` | `NULL, FK -> staff_profiles(id)`| Quick-booking recommendation |
| **VIP Tier Level** | `vip_tier` | `VARCHAR(30)` | `DEFAULT 'Regular'` | `Bronze`, `Silver`, `Gold`, `Black Diamond VIP` |
| **Chemical Allergies / Notes**| `allergies_notes` | `TEXT` | `NULL` | Known scalp / skin sensitivities |

---

## 2. Service Discovery, Multi-Service Cart & Appointment Booking

### 2.1 UI Page: Service Menu Discovery & Time-Slot Booking (`BookAppointmentScreen.tsx`)
**Primary Database Table:** `appointments`  
**Secondary Tables:** `appointment_line_items`, `services`, `branches`

| UI Booking Step / Field | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Booking Reference ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Booking ID (e.g. `APT-2026-901`) |
| **Selected Salon Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Target Salon Outlet |
| **Client Customer Link** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Current Logged-in Client |
| **Selected Stylist Specialist**| `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)`| Stylist or "Any Available Expert" |
| **Scheduled Start Timestamp** | `scheduled_start_time` | `TIMESTAMPTZ` | `NOT NULL` | Customer Selected Time Slot |
| **Scheduled End Timestamp** | `scheduled_end_time` | `TIMESTAMPTZ` | `NOT NULL` | Sum of Service Durations |
| **Booking Channel** | `booking_channel` | `VARCHAR(30)` | `DEFAULT 'Client Mobile App'` | `Client Mobile App`, `Web Portal` |
| **Total Service Amount (₹)** | `total_estimated_amount`| `DECIMAL(12, 2)`| `NOT NULL` | Gross Cart Value |
| **Advance Deposit Paid (₹)** | `advance_deposit_amount`| `DECIMAL(12, 2)`| `DEFAULT 0.00` | Pre-collected booking token |
| **Booking Confirmation Status**| `status` | `VARCHAR(30)` | `DEFAULT 'Confirmed'` | `Confirmed`, `In Service`, `Completed`, `Cancelled` |
| **Cancellation Reason** | `cancellation_reason` | `VARCHAR(150)` | `NULL` | Client selected cancellation reason |

---

### 2.2 Table: `appointment_line_items` (Multi-Service Cart Items)

| Cart Line Item Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Line Item ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Cart Item ID |
| **Appointment Link** | `appointment_id` | `VARCHAR(64)` | `NOT NULL, FK -> appointments(id)` | Parent Booking |
| **Selected Service** | `service_id` | `VARCHAR(64)` | `NOT NULL, FK -> services(id)` | Service from Menu |
| **Duration (Minutes)** | `duration_minutes` | `INTEGER` | `NOT NULL` | Treatment duration |
| **Service Price (₹)** | `price_amount` | `DECIMAL(12, 2)` | `NOT NULL` | Base service rate |
| **Applied Promo Coupon** | `applied_coupon_code` | `VARCHAR(30)` | `NULL` | e.g. "FIRSTVISIT (15% Off)" |
| **Discount Deduction (₹)** | `discount_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Discount applied |

---

## 3. Digital Wallet, Package Vouchers & Loyalty Points

### 3.1 UI Page: Prepaid Wallet & Package Vouchers (`CustomerWalletScreen.tsx`)
**Primary Database Table:** `clients`  
**Secondary Tables:** `client_package_subscriptions`, `client_wallet_transactions`

| UI Wallet Component | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Available Wallet Balance (₹)**| `clients.wallet_balance` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Current Prepaid Balance |
| **Loyalty Points Balance** | `clients.loyalty_points` | `INTEGER` | `DEFAULT 0` | Redeemable Reward Points |
| **Active Packages Count** | `COUNT(client_package_subscriptions.id)` | `INTEGER` | `WHERE status = 'Active'` | Active bundled packages |
| **Package Subscription ID** | `client_package_subscriptions.id`| `VARCHAR(64)` | `PRIMARY KEY` | Package Voucher ID |
| **Package Plan Title** | `packages_memberships.name` | `VARCHAR(150)` | `NOT NULL` | e.g. "Royal Bridal Glow Package" |
| **Total Included Sessions** | `total_sessions` | `INTEGER` | `NOT NULL` | Initial voucher sessions |
| **Remaining Unused Sessions** | `remaining_sessions` | `INTEGER` | `NOT NULL` | Available sessions to redeem |
| **Package Expiry Date** | `expiry_date` | `DATE` | `NOT NULL` | Validity expiration date |

---

## 4. Past Service History, GST Invoices & Stylist Formula Notes

### 4.1 UI Page: Visit History & Invoices (`ServiceHistoryScreen.tsx`)
**Primary Database Table:** `invoices`  
**Secondary Tables:** `client_treatment_formula_cards`, `invoice_payments`

| UI History Element | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **GST Tax Invoice Number** | `invoice_number` | `VARCHAR(50)` | `UNIQUE, NOT NULL` | e.g. `INV-ATL-26-0881` |
| **Visited Salon Branch** | `branches.name` | `VARCHAR(150)` | `NOT NULL` | Salon Outlet Location |
| **Attending Stylist Name** | `staff_profiles.full_name` | `VARCHAR(120)` | `NOT NULL` | Performing Specialist |
| **Visit Checkout Date** | `invoices.created_at` | `TIMESTAMPTZ` | `NOT NULL` | Date & Time of visit |
| **Total Billed Amount (₹)** | `invoices.total_payable_amount`| `DECIMAL(12, 2)`| `NOT NULL` | Final Gross Total Paid |
| **Payment Mode Used** | `invoice_payments.payment_mode`| `VARCHAR(30)` | `NOT NULL` | `UPI`, `Card`, `Wallet`, `Cash` |
| **Download Tax Invoice PDF** | `invoice_pdf_url` | `TEXT` | `NULL` | Downloadable GST Tax Invoice |
| **Hair / Skin Shade Used** | `client_treatment_formula_cards.target_shade_level`| `VARCHAR(50)`| `NULL` | e.g. "Level 7 Caramel Blonde" |

---

## 5. Client Reviews, Star Ratings & Stylist Digital Tipping

### 5.1 UI Modal: Rate Service & Tip Stylist (`RateAndTipModal.tsx`)
**Primary Database Table:** `service_reviews_ratings`

| UI Review & Tip Field | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Review Record ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Review ID (e.g. `REV-2026-081`) |
| **Appointment Link** | `appointment_id` | `VARCHAR(64)` | `NOT NULL, FK -> appointments(id)` | Rated Visit |
| **Client Author Link** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Reviewer Client |
| **Rated Stylist Link** | `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Beneficiary Stylist |
| **Star Rating Score** | `star_rating` | `SMALLINT` | `NOT NULL (1 to 5 Stars)` | 5-Star Experience Rating |
| **Compliment Tags** | `compliment_tags` | `TEXT[]` | `NULL` | `['Great Consultation', 'Gentle Touch', 'Perfect Shade']` |
| **Client Review Comments** | `feedback_text` | `TEXT` | `NULL` | Client qualitative review |
| **Digital Tip Amount (₹)** | `stylist_tip_amount` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | e.g. ₹100, ₹200 via UPI/Card |
| **Is Published Publicly** | `is_public` | `BOOLEAN` | `DEFAULT TRUE` | Visible on stylist portfolio |

---

## Summary of Client Panel Entity Mappings

| Client Mobile UI Workflow | Primary Database Tables | Key Relations & Scoping | Client Experience & Business Value |
| :--- | :--- | :--- | :--- |
| **1. Profile & Skin/Hair Health** | `clients`, `client_hair_skin_profiles` | `client_id`, `preferred_branch_id` | Seamless OTP login, personal beauty preferences, chemical allergy alerts |
| **2. Self-Service Booking Matrix** | `appointments`, `appointment_line_items` | `client_id`, `branch_id`, `staff_id` | 24/7 self-service scheduling, specialist stylist selection, multi-service cart |
| **3. Live Appointment Tracking** | `appointments`, `branches` | `client_id`, `appointment_id` | Live status updates (*Confirmed, In Service*), digital QR code check-in |
| **4. Wallet, Packages & Loyalty** | `clients`, `client_package_subscriptions` | `client_id`, `packages_memberships` | Prepaid wallet balance, remaining session package vouchers, loyalty point tracking |
| **5. History & GST Invoices** | `invoices`, `invoice_payments` | `client_id`, `invoice_id` | Complete visit archives, downloadable GST tax invoices, formula shades |
| **6. Ratings & Stylist Tipping** | `service_reviews_ratings` | `appointment_id`, `client_id`, `staff_id` | 5-star ratings, qualitative feedback, instant digital tipping via UPI/Card |

---
*End of Client Panel Module Database Schema Specification.*
