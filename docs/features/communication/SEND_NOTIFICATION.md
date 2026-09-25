# Feature: Multi-Channel Communication & Telephony Orchestration

## 1. Notification Templates & Multi-Channel Dispatch (`SEND_NOTIFICATION.md`)
- Channels: `WHATSAPP`, `SMS`, `EMAIL`, `PUSH`, `IN_APP`.
- Template interpolation with variable tokens (`{{clientName}}`, `{{serviceName}}`, `{{time}}`, `{{amount}}`).
- Event-triggered notifications for appointments, invoices, low stock alerts, and franchise settlements.

## 2. Marketing Campaigns & Winback Automation (`CREATE_CAMPAIGN.md`)
- Endpoint: `POST /api/v1/marketing/campaigns` & `POST /api/v1/marketing/winback-offer`.
- Multi-recipient dispatch with simulated delivery adapters and conversion tracking.

## 3. Telephony Integration & Call Center Orchestration (`PROCESS_INBOUND_CALL.md`, `RECORD_CALL_DISPOSITION.md`)
- Endpoints: `GET /api/v1/call-center/calls`, `POST /api/v1/call-center/calls/:id/disposition`, `GET /api/v1/call-center/customer-context`.
- Dual customer lookup (existing customer vs new lead creation) without duplicating customer/booking tables.
- Call dispositions: `BOOKED`, `FOLLOW_UP`, `NO_ANSWER`, `BUSY`, `NOT_INTERESTED`, `CALLBACK_REQUESTED`, `LEAD_CREATED`.
