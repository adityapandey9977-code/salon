# Service Documentation: Communication Service (`apps/services/communication-service`)

> **Automated WhatsApp Reminders, SMS, Transactional Emails, Marketing Broadcasts & Push Notifications**

---

## 1. Overview & Responsibilities

The **Communication Service** coordinates all outbound omni-channel messaging across WhatsApp Business API, SMS Gateways (Twilio, Gupshup), Transactional Email (SendGrid, AWS SES), and In-App / Web Push Notifications. It handles appointment reminders, booking confirmations, invoice receipts, feedback requests, and segmented marketing broadcasts.

### Key Responsibilities
- **Omni-Channel Messaging Engine**: Dispatches notifications via WhatsApp, SMS, Email, and Mobile Push.
- **Dynamic Template Engine**: Parameterized templates with variables (`{{customer_name}}`, `{{service_name}}`, `{{appointment_time}}`, `{{branch_name}}`, `{{reschedule_link}}`).
- **Automated Lifecycle Trigger Rules**:
  - Instant booking confirmation on creation.
  - 24-hour and 2-hour appointment reminder alerts.
  - Post-service feedback & review requests.
  - Birthday & anniversary promotional greeting vouchers.
- **Marketing Campaign Broadcasts**: Segmented promotional blasts with opt-out / DND compliance.
- **Delivery Status & Webhook Processing**: Real-time delivery receipts (Sent, Delivered, Read, Failed) from external provider webhooks.

---

## 2. Configuration & Runtime Environment

| Parameter | Environment Variable | Default Value | Description |
|---|---|---|---|
| **Port** | `COMMUNICATION_SERVICE_PORT` / `PORT` | `3010` | HTTP listener port |
| **Database URL** | `COMMUNICATION_DATABASE_URL` | `postgresql://.../communication_db` | Dedicated logical database |
| **Redis URL** | `REDIS_URL` | `redis://localhost:6379` | Queue and cache store |

---

## 3. Database Schema Entities (`communication_db`)

- **`NotificationTemplate`**: `id`, `tenantId`, `name`, `channel` (`WHATSAPP`, `SMS`, `EMAIL`, `PUSH`), `eventType`, `subject`, `bodyTemplate`, `isActive`
- **`MessageLog`**: `id`, `tenantId`, `customerId`, `channel`, `recipient`, `content`, `status` (`QUEUED`, `SENT`, `DELIVERED`, `READ`, `FAILED`), `providerMessageId`, `failureReason`, `sentAt`
- **`Campaign`**: `id`, `tenantId`, `name`, `channel`, `targetSegment`, `templateId`, `scheduledAt`, `status` (`DRAFT`, `SCHEDULED`, `RUNNING`, `COMPLETED`), `totalSent`, `totalDelivered`
- **`CustomerCommunicationPreference`**: `id`, `customerId`, `allowWhatsApp`, `allowSms`, `allowEmail`, `allowPromotional`

---

## 4. Redis Read Projections

- `tenant:{tenantId}:template:{eventType}:{channel}` (TTL: 600s)

---

## 5. Key API Endpoints

- `GET /api/v1/communications/templates`
- `POST /api/v1/communications/templates`
- `PATCH /api/v1/communications/templates/:id`
- `GET /api/v1/communications/messages`
- `POST /api/v1/communications/messages/send-direct`
- `GET /api/v1/communications/campaigns`
- `POST /api/v1/communications/campaigns`
- `POST /api/v1/communications/webhooks/whatsapp`
- `POST /api/v1/communications/webhooks/sms`

---

## 6. Asynchronous Events (RabbitMQ)

- **Consumed Events**:
  - `salon.events.booking.created` -> Dispatches booking confirmation
  - `salon.events.booking.rescheduled` -> Dispatches reschedule alert
  - `salon.events.booking.completed` -> Dispatches invoice PDF link & review request
  - `salon.events.payment.completed` -> Dispatches payment receipt SMS / WhatsApp
