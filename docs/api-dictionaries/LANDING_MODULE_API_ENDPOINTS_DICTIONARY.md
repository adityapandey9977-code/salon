#   Salon SaaS — Public Landing & Lead Generation API Endpoint Dictionary & Screen Mapping

**Document Version:** 2.0.0  
**Target System:**   Salon SaaS — Public Landing & Franchise Inquiry Page (`apps/web/src/modules/landing`) & Backend API Gateway (`apps/api/src/modules`)  
**Scope:** Exhaustive Endpoint Inventory for Public Brand Showcase, Franchise Opportunity Inquiries, Newsletter Subscriptions, Public Salon Directory, and Auth Modal  
**Classification:** Technical Architecture Specification & Complete API Mapping Dictionary  

---

## 1. Architectural Overview & Public Access Gateway

The **Landing Module** (`apps/web/src/modules/landing`) serves as the brand's public-facing marketing and lead-generation portal. It showcases salon couture services, luxury outlets across India, franchise partnership opportunities, client testimonials, and provides an authentication modal for existing clients and staff to log in.

```
┌────────────────────────────────────────┐     ┌────────────────────────────────────────┐
│    Public Landing Web Page (/)         │ ──► │  Public API Gateway (/api/v1/public/*) │
│  (apps/web/src/modules/landing)        │     │  • /public/inquiries  • /public/salons  │
└────────────────────────────────────────┘     └────────────────────────────────────────┘
```

---

## 2. Public & Auth Modal APIs

**Base Path:** `/api/v1/public`, `/api/v1/auth`

| Endpoint URI | HTTP Method | Target UI Component | Business Rationale & Purpose | Request / Response Payload Highlights |
| :--- | :--- | :--- | :--- | :--- |
| `/api/v1/public/franchise-inquiry` | `POST` | `SalonLandingPage.tsx` | Captures public franchise application inquiries from prospective franchise partners. | Body: `{ full_name, phone, email, proposed_city, proposed_investment_capex, message }` |
| `/api/v1/public/newsletter-subscribe`| `POST` | Landing Footer | Subscribes website visitors to seasonal beauty, hair care, and promo newsletter updates. | Body: `{ email }` |
| `/api/v1/public/brand-salons` | `GET` | Salon Locations Section | Fetches public list of active flagship salon outlets, phone numbers, and addresses for public display. | Res: `Array<{ branch_name, city, address, phone, GoogleMapsUrl }>` |
| `/api/v1/auth/login` | `POST` | `AuthModal.tsx` | Authenticates existing clients, stylists, branch managers, or superadmins from the landing modal. | Body: `{ email_or_phone, password_or_otp, login_type }` |

---

## 3. End-to-End Public Lead Generation Flow

```
┌─────────────────────────────────────┐
│ 1. GET /public/brand-salons         │ ──► Visitor browses brand outlets & luxury treatment menu.
└──────────────────┬──────────────────┘
                   │
                   v
┌─────────────────────────────────────┐
│ 2. POST /public/franchise-inquiry   │ ──► Visitor submits Franchise Inquiry form.
└──────────────────┬──────────────────┘
                   │
                   v
┌─────────────────────────────────────┐
│ 3. POST /customers/leads (Internal) │ ──► Inquiry automatically ingested into Call Center Lead Queue (`/call-center/leads`).
└─────────────────────────────────────┘
```

---

## 4. Verification Summary

- **Landing APIs Documented:** 4 Public & Auth endpoints mapped across `SalonLandingPage.tsx` and `AuthModal.tsx`.
- **End-to-End Workflow Documented:** Complete Public Lead Capture & Call Center Integration Sequence.
