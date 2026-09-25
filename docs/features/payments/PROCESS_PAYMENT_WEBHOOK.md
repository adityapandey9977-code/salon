# Feature: Process Payment Gateway Webhook

## 1. Business Context & Overview
Ingests asynchronous server-to-server notifications from Razorpay and Stripe with HMAC signature verification and deduplication.

## 2. Service Ownership
- **Owner**: `payment-service`
- **Database**: `payment_db` (table: `provider_webhook_events`, `payment_transactions`, `payment_intents`)

## 3. API Contract
- **Razorpay Webhook**: `POST /api/v1/webhooks/payments/razorpay`
- **Stripe Webhook**: `POST /api/v1/webhooks/payments/stripe`

## 4. Architecture & Persistence Flow
1. Verify cryptographic HMAC signature (`x-razorpay-signature` or `stripe-signature`).
2. Insert into `provider_webhook_events` (fails on duplicate `providerEventId`).
3. Update `payment_intents` status to `CAPTURED` and insert `payment_transactions`.
4. Publish `PaymentCompleted` domain event to RabbitMQ.
