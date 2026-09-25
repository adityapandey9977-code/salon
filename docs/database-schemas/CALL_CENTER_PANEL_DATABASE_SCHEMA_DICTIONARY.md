#   Salon SaaS — Call Center Panel Module Database Schema & UI Field Mapping Dictionary

**Document Version:** 3.0.0  
**Target System:**   Salon SaaS Web Application (`/call-center/*` & Central Concierge Desk)  
**Scope:** Call Center & Telephony Workspace (CTI Inbound Popups, Multi-Branch Booking Dispatch, Call Recording Ledgers, Inquiries & Grievance Tickets)  
**Classification:** Complete Database Dictionary & Technical UI-to-Schema Mapping  

---

## Architecture & Telephony Concierge Domain Map

The **Call Center Panel** operates with **Central Multi-Branch Dispatch Authority**. Inbound calls trigger instant **CTI (Computer Telephony Integration) Caller ID Lookups**, displaying the client's CRM history, preferred branches, favourite stylists, and allergy contraindications in real time.

```
┌────────────────────────────────────────────────────────────────────────────────────────────────────────┐
│                              CALL CENTER TELEPHONY DOMAIN MAP                                          │
├────────────────────────────────┬───────────────────────────────────────┬───────────────────────────────┤
│ 1. Inbound CTI & Caller CRM    │ 2. Multi-Branch Booking Dispatch      │ 3. Tickets, Logs & Outreach   │
│  • CTI Telephony Screen-Pop    │  • Cross-Branch Calendar Matrix       │  • Telephony Call Audio Logs  │
│  • Instant Mobile Phone Lookup │  • Real-Time Specialist Availability  │  • Call Intent Dispositions   │
│  • Client VIP & Wallet Status  │  • Instant Booking Confirmation SMS   │  • Grievance & Support Tickets│
│  • Chemical Allergy Alerts     │  • Advance Deposit Payment Links      │  • Outbound Rebooking Queue   │
└────────────────────────────────┴───────────────────────────────────────┴───────────────────────────────┘
```

---

## 1. Inbound CTI Telephony & Agent Status Management

### 1.1 UI Desk: Telephony CTI Bar & Screen-Pop (`CallCenterCTIBar.tsx`)
**Primary Database Table:** `call_center_agents`  
**Secondary Table:** `telephony_active_sessions`

| UI Form Field / Widget | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Agent User ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Agent Record ID (e.g. `AGT-001`) |
| **User Account Link** | `user_id` | `VARCHAR(64)` | `NOT NULL, FK -> users(id)` | Central User Account |
| **Agent Display Name** | `agent_name` | `VARCHAR(120)` | `NOT NULL` | Concierge Executive Name |
| **CTI Telephony Extension #** | `telephony_extension`| `VARCHAR(20)` | `UNIQUE, NOT NULL` | SIP / Softphone Extension Code |
| **Telephony Gateway Provider**| `telephony_provider` | `VARCHAR(40)` | `DEFAULT 'Exotel'` | `Exotel`, `Twilio`, `Knowlarity` |
| **Agent Real-Time Status** | `agent_status` | `VARCHAR(30)` | `DEFAULT 'Available'` | `Available`, `On Call`, `Wrap-Up`, `On Break`, `Offline` |
| **Total Calls Handled Today** | `calls_handled_today`| `INTEGER` | `DEFAULT 0` | Daily handled count |
| **Average Handle Time (Secs)**| `avg_handle_time_secs`| `INTEGER` | `DEFAULT 180` | Performance AHT metric |
| **Inbound Booked Revenue (₹)** | `booked_revenue_today`| `DECIMAL(12, 2)`| `DEFAULT 0.00` | Revenue converted via calls |

---

## 2. Inbound Caller CRM Dossier & Instant Screen-Pop

### 2.1 UI View: Inbound Screen-Pop Caller Dossier (`InboundCallerModal.tsx`)
**Primary Database Table:** `clients`  
**Related Tables:** `appointments`, `invoices`, `client_notes_allergies`

| UI Screen-Pop Element | Database Column / Query Source | Data Type | Constraints | Business Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Caller Phone Number** | `clients.mobile_phone` | `VARCHAR(20)` | `NOT NULL` | Inbound Caller ID (+91 98XXX XXXXX) |
| **Client Full Name** | `CONCAT(clients.first_name, ' ', clients.last_name)` | `VARCHAR(160)` | `NOT NULL` | Customer Given Name & Surname |
| **VIP Tier Level** | `clients.vip_tier` | `VARCHAR(30)` | `DEFAULT 'Regular'` | `Bronze`, `Silver`, `Gold`, `Black Diamond VIP` |
| **Prepaid Wallet Balance** | `clients.wallet_balance` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Current Available Wallet Deposit (₹) |
| **Loyalty Points Available** | `clients.loyalty_points` | `INTEGER` | `DEFAULT 0` | Redeemable Reward Points |
| **Primary Home Branch** | `branches.name` | `VARCHAR(150)` | `NULL` | Most frequented salon outlet |
| **Preferred Master Stylist** | `staff_profiles.full_name` | `VARCHAR(120)` | `NULL` | Favourite stylist for auto-assignment |
| **Chemical Allergies / Notes**| `clients.allergies_notes` | `TEXT` | `NULL` | Critical contraindications (e.g. Ammonia) |
| **Lifetime Gross Spend (₹)** | `clients.lifetime_spend` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Historical customer value |
| **Past No-Show Count** | `COUNT(appointments.id) WHERE status = 'No Show'` | `INTEGER` | `DEFAULT 0` | Risk assessment indicator |

---

## 3. Multi-Branch Cross-Outlet Booking Dispatch

### 3.1 UI Page: Cross-Branch Appointment Booking Engine (`CentralBookingDesk.tsx`)
**Primary Database Table:** `appointments`  
**Secondary Tables:** `appointment_line_items`, `payment_gateway_links`

| UI Booking Form Field | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Booking Reference Code** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Booking ID (e.g. `APT-2026-901`) |
| **Target Salon Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Outlet where appointment booked |
| **Booked Customer** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Client Profile |
| **Call Center Agent ID** | `booked_by_agent_id` | `VARCHAR(64)` | `NOT NULL, FK -> call_center_agents(id)` | Agent executing the booking |
| **Assigned Specialist** | `staff_id` | `VARCHAR(64)` | `NOT NULL, FK -> staff_profiles(id)` | Performing Stylist |
| **Scheduled Start Slot** | `scheduled_start_time` | `TIMESTAMPTZ` | `NOT NULL` | Selected service start time |
| **Scheduled End Slot** | `scheduled_end_time` | `TIMESTAMPTZ` | `NOT NULL` | Auto-calculated duration end time |
| **Booking Source Channel** | `booking_channel` | `VARCHAR(30)` | `DEFAULT 'Call Center Inbound'` | `Call Center Inbound`, `WhatsApp Concierge` |
| **Estimated Ticket Value (₹)**| `total_estimated_amount`| `DECIMAL(12, 2)`| `NOT NULL` | Sum of booked service lines |
| **Advance Deposit Paid (₹)** | `advance_deposit_amount`| `DECIMAL(12, 2)`| `DEFAULT 0.00` | Pre-collected confirmation deposit |
| **Payment Link Reference** | `payment_link_id` | `VARCHAR(100)` | `NULL` | Razorpay / PayU booking link URL |
| **Confirmation Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Confirmed'` | `Confirmed`, `Pending Deposit`, `Cancelled` |

---

## 4. Telephony Call Logs, Audio Recordings & Dispositions

### 4.1 UI Page: Telephony Call Logs & Audio Playback (`CallLogsDesk.tsx`)
**Primary Database Table:** `telephony_call_logs`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Business Purpose & Mapping |
| :--- | :--- | :--- | :--- | :--- |
| **Call Log ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Call ID (e.g. `CALL-20260825-081`) |
| **Telephony Gateway Session**| `gateway_session_id` | `VARCHAR(100)` | `NOT NULL` | Exotel / Twilio Call SID |
| **Handling Agent** | `agent_id` | `VARCHAR(64)` | `NOT NULL, FK -> call_center_agents(id)` | Attending Agent |
| **Client Phone Number** | `customer_phone` | `VARCHAR(20)` | `NOT NULL` | Caller Number |
| **Client Profile Link** | `client_id` | `VARCHAR(64)` | `NULL, FK -> clients(id)` | Resolved Client CRM Profile |
| **Target Branch Inquired** | `inquired_branch_id` | `VARCHAR(64)` | `NULL, FK -> branches(id)` | Branch inquired about |
| **Call Direction** | `direction` | `VARCHAR(20)` | `NOT NULL` | `Inbound` or `Outbound` |
| **Call Start Timestamp** | `call_start_time` | `TIMESTAMPTZ` | `NOT NULL` | Call Connection Timestamp |
| **Call Duration (Seconds)** | `duration_seconds` | `INTEGER` | `NOT NULL` | Total conversation duration |
| **Call Recording Audio URL** | `recording_audio_url` | `TEXT` | `NULL` | S3 Secure Audio Recording Link |
| **Call Intent Disposition** | `disposition_category` | `VARCHAR(60)` | `NOT NULL` | `Appointment Booked`, `Reschedule Request`, `Price Inquiry`, `Cancellation`, `Complaint/Grievance` |
| **Detailed Agent Notes** | `agent_notes` | `TEXT` | `NULL` | Summary of conversation |
| **Resulting Appointment ID** | `resulting_appointment_id`| `VARCHAR(64)` | `NULL, FK -> appointments(id)` | Linked converted booking |

---

## 5. Customer Inquiries, Support Tickets & Grievance Redressal

### 5.1 UI Page: Customer Support Tickets & Escalation Desk (`SupportTicketsDesk.tsx`)
**Primary Database Table:** `customer_support_tickets`  
**Secondary Table:** `ticket_timeline_messages`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Support Ticket ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Ticket ID (e.g. `TCK-2026-042`) |
| **Client Link** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Complainant Client |
| **Affected Salon Branch** | `branch_id` | `VARCHAR(64)` | `NOT NULL, FK -> branches(id)` | Outlet where incident occurred |
| **Linked Invoice / Service** | `invoice_id` | `VARCHAR(64)` | `NULL, FK -> invoices(id)` | Disputed Billing / Service |
| **Ticket Issue Category** | `issue_category` | `VARCHAR(60)` | `NOT NULL` | `Service Quality Defect`, `Billing Overcharge`, `Staff Behavior`, `Appointment Delay`, `Allergy Reaction` |
| **SLA Severity Level** | `priority_level` | `VARCHAR(20)` | `DEFAULT 'Medium'` | `Low`, `Medium`, `High`, `Critical (Urgent)` |
| **Assigned Escalation User** | `assigned_to_user_id` | `VARCHAR(64)` | `NULL, FK -> users(id)` | Branch General Manager / HQ QA |
| **Compensation Voucher (₹)** | `compensation_credit` | `DECIMAL(12, 2)` | `DEFAULT 0.00` | Goodwill wallet credit issued |
| **Ticket Resolution Status** | `status` | `VARCHAR(30)` | `DEFAULT 'Open'` | `Open`, `Under Investigation`, `Escalated`, `Resolved`, `Closed` |
| **Resolution Summary Notes** | `resolution_notes` | `TEXT` | `NULL` | Final outcome explanation |
| **Resolved Timestamp** | `resolved_at` | `TIMESTAMPTZ` | `NULL` | Ticket closure timestamp |

---

## 6. Outbound Tele-Calling Campaigns & Lapsed Client Rebooking

### 6.1 UI Page: Outbound Calling Campaigns & Rebooking Queue (`OutboundCampaignsDesk.tsx`)
**Primary Database Table:** `outbound_campaign_leads`

| UI Form Field / Table Column | Database Column Name | Data Type | Constraints / Default | Description |
| :--- | :--- | :--- | :--- | :--- |
| **Lead Queue Record ID** | `id` | `VARCHAR(64)` | `PRIMARY KEY` | Lead ID (e.g. `LEAD-2026-901`) |
| **Campaign Name** | `campaign_name` | `VARCHAR(120)` | `NOT NULL` | e.g. "Lapsed 60-Day Rebooking", "Bridal Season Outreach" |
| **Client Customer** | `client_id` | `VARCHAR(64)` | `NOT NULL, FK -> clients(id)` | Target Client |
| **Client Mobile Number** | `mobile_phone` | `VARCHAR(20)` | `NOT NULL` | Dialing number |
| **Last Service Received** | `last_service_name` | `VARCHAR(150)` | `NOT NULL` | e.g. "Keratin Hair Spa" |
| **Days Since Last Visit** | `days_inactive` | `INTEGER` | `NOT NULL` | Days inactive (e.g. 68 days) |
| **Promotional Offer Attached**| `promo_coupon_code` | `VARCHAR(30)` | `NULL` | e.g. "REVIVE20 (20% Off)" |
| **Assigned Calling Agent** | `assigned_agent_id` | `VARCHAR(64)` | `NOT NULL, FK -> call_center_agents(id)`| Calling Executive |
| **Call Attempt Count** | `call_attempts_count` | `INTEGER` | `DEFAULT 0` | Times dialed (Max 3) |
| **Lead Conversion Status** | `lead_status` | `VARCHAR(30)` | `DEFAULT 'Queued'` | `Queued`, `Ringing / No Answer`, `Not Interested`, `Booked / Converted` |

---

## Summary of Call Center Panel Entity Mappings

| Call Center UI Module | Primary Database Tables | Key Relations & Scoping | Operational Business Impact |
| :--- | :--- | :--- | :--- |
| **1. CTI Telephony & Screen-Pop** | `call_center_agents`, `clients` | `user_id`, `mobile_phone` | Real-time CTI popup on inbound ring, agent status tracking, instant VIP/allergy dossier |
| **2. Multi-Branch Booking Engine** | `appointments`, `appointment_line_items` | `branch_id`, `client_id`, `staff_id` | Cross-branch booking matrix, preferred specialist locking, advance deposit collection |
| **3. Call Logs & Audio Vault** | `telephony_call_logs` | `agent_id`, `client_id`, `resulting_appointment_id` | Full telephony session audit trail, cloud audio recording playback, disposition tracking |
| **4. Inquiries & Support Tickets** | `customer_support_tickets` | `client_id`, `branch_id`, `invoice_id` | Incident logging, SLA tracking, branch manager escalation, goodwill voucher issuance |
| **5. Outbound Rebooking Queue** | `outbound_campaign_leads` | `client_id`, `assigned_agent_id` | Automated rebooking queue for lapsed clients (60+ days), promotional offer conversion |

---
*End of Call Center Panel Module Database Schema Specification.*
