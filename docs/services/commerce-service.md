# Service Documentation: Commerce Service (`apps/services/commerce-service`)

> **Service Menu, Service Variants, Service Bundles, Memberships, Retail Products & Gift Vouchers**

---

## 1. Overview & Responsibilities

The **Commerce Service** manages all billable catalog items within the salon chain, including professional service menus, service variant matrices, bundled packages, recurring membership plans, retail products, discount coupons, and gift card cards.

### Key Responsibilities
- **Service Catalog Hierarchy**: Categories (Hair, Facial, Nails, Spa, Aesthetics), subcategories, and services.
- **Service Variants**: Multi-dimensional pricing and durations based on hair length, stylist tier (Junior, Senior, Master Stylist), or product brand used.
- **Bundled Packages & Combos**: Bundles combining multiple services (e.g. Bridal Glow Package) with promotional package pricing.
- **Client Membership Plans**: Monthly/annual subscription passes offering discounted service rates or complimentary monthly credits.
- **Retail Product Catalog**: Shampoo, conditioners, hair serums, beauty kits, SKU codes, and barcodes for POS scanning.
- **Vouchers, Gift Cards & Discounts**: Percentage/flat promo coupons, gift card balance management, and seasonal discount rules.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `COMMERCE_SERVICE_PORT` / `PORT` | `3006` | HTTP listener port |
| **Database URL** | `COMMERCE_DATABASE_URL` | `postgresql://.../commerce_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Cache acceleration |

---

## 3. Database Schema Entities (`commerce_db`)

- **`ServiceCategory`**: `id`, `tenantId`, `name`, `description`, `iconUrl`, `displayOrder`, `status`
- **`Service`**: `id`, `tenantId`, `categoryId`, `name`, `code`, `description`, `baseDurationMinutes`, `basePrice`, `taxRate`, `status`
- **`ServiceVariant`**: `id`, `serviceId`, `name`, `durationMinutes`, `price`, `stylistTier`
- **`Package`**: `id`, `tenantId`, `name`, `code`, `price`, `validityDays`, `status`
- **`PackageItem`**: `id`, `packageId`, `serviceId`, `quantity`
- **`MembershipPlan`**: `id`, `tenantId`, `name`, `fee`, `intervalMonths`, `discountPercentage`, `includedCredits`
- **`Product`**: `id`, `tenantId`, `name`, `sku`, `barcode`, `retailPrice`, `costPrice`, `categoryId`, `brandName`
- **`GiftCard`**: `id`, `tenantId`, `code`, `initialBalance`, `currentBalance`, `recipientEmail`, `expiresAt`, `status`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:menu:tree` (TTL: 600s)
- `tenant:{tenantId}:service:{serviceId}:details` (TTL: 300s)
- `tenant:{tenantId}:packages:active` (TTL: 300s)
- `tenant:{tenantId}:giftcard:{code}` (TTL: 60s)

---

## 5. Key API Endpoints

- `GET /api/v1/commerce/categories`
- `POST /api/v1/commerce/categories`
- `GET /api/v1/commerce/services`
- `POST /api/v1/commerce/services`
- `GET /api/v1/commerce/services/:id`
- `PATCH /api/v1/commerce/services/:id`
- `GET /api/v1/commerce/packages`
- `POST /api/v1/commerce/packages`
- `GET /api/v1/commerce/memberships`
- `POST /api/v1/commerce/memberships`
- `GET /api/v1/commerce/products`
- `POST /api/v1/commerce/products`
- `GET /api/v1/commerce/gift-cards/:code`

---

## 6. Asynchronous Events (RabbitMQ)

- **Published Events**:
  - `salon.events.commerce.service.created`
  - `salon.events.commerce.service.updated`
  - `salon.events.commerce.package.created`
  - `salon.events.commerce.gift_card.redeemed`
