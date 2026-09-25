# Service Documentation: Customer Service (`apps/services/customer-service`)

> **Client 360 Profiles, Skin/Hair Diagnostics, Allergies, Treatment History, Loyalty Balances & Tags**

---

## 1. Overview & Responsibilities

The **Customer Service** provides a unified 360-degree customer intelligence record. It stores demographic data, skin/scalp condition histories, treatment formulas (e.g. hair dye mixtures), allergy alerts, customer tags/segments (e.g. VIP, High Spender, At Risk), and reward loyalty points.

### Key Responsibilities
- **Client Directory**: Profile, contact details, date of birth (for birthday campaigns), preferred stylists, preferred branch.
- **Consultation & Diagnostics**: Scalp condition, skin type, patch test results, and medical/allergy precautions.
- **Treatment Formula Notes**: Exact hair dye color codes, developer volumes, facial serums used in previous appointments.
- **Loyalty & Rewards Program**: Point balance, tier status (Silver, Gold, Platinum), lifetime spend, and redemption logs.
- **Customer Segmentation**: Automatic tagging based on recency, frequency, and monetary metrics (RFM analysis).
- **Communication Preferences**: Opt-ins/opt-outs for WhatsApp, SMS, and Email promotional notifications.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `CUSTOMER_SERVICE_PORT` / `PORT` | `3004` | HTTP listener port |
| **Database URL** | `CUSTOMER_DATABASE_URL` | `postgresql://.../customer_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration |

---

## 3. Database Schema Entities (`customer_db`)

- **`Customer`**: `id`, `tenantId`, `userId`, `fullName`, `email`, `phone`, `gender`, `birthDate`, `preferredBranchId`, `preferredStaffId`, `status`, `totalSpend`, `visitCount`
- **`CustomerConsultation`**: `id`, `customerId`, `skinType`, `hairTexture`, `allergies`, `notes`, `contraindications`
- **`TreatmentFormulaNote`**: `id`, `customerId`, `appointmentId`, `formulaCode`, `brandName`, `mixingRatio`, `notes`, `recordedByStaffId`
- **`LoyaltyAccount`**: `id`, `customerId`, `tenantId`, `tier`, `pointsBalance`, `lifetimePoints`
- **`LoyaltyTransaction`**: `id`, `loyaltyAccountId`, `points`, `transactionType` (`EARNED`, `REDEEMED`, `EXPIRED`), `referenceId`
- **`CustomerTag`**: `id`, `tenantId`, `name`, `colorHex`
- **`CustomerTagAssignment`**: `customerId`, `tagId`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:customer:{customerId}:summary` (TTL: 300s)
- `tenant:{tenantId}:customer:{customerId}:loyalty` (TTL: 180s)
- `tenant:{tenantId}:customer-phone:{phone}` (TTL: 300s)

---

## 5. Key API Endpoints

- `GET /api/v1/customers`
- `POST /api/v1/customers`
- `GET /api/v1/customers/:id`
- `PATCH /api/v1/customers/:id`
- `GET /api/v1/customers/:id/consultations`
- `POST /api/v1/customers/:id/consultations`
- `GET /api/v1/customers/:id/formulas`
- `POST /api/v1/customers/:id/formulas`
- `GET /api/v1/customers/:id/loyalty`
- `POST /api/v1/customers/:id/loyalty/adjust`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.customer.created`
  - `salon.events.customer.updated`
  - `salon.events.customer.loyalty.points_updated`
- **Consumed Events**:
  - `salon.events.payment.completed` -> Accrues loyalty points based on invoice total
