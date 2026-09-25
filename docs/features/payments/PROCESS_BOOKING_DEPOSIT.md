# Feature: Process Booking Deposit

## 1. Business Context & Overview
Handles advance deposit creation requested asynchronously or via internal RPC from `booking-service`.

## 2. Service Ownership
- **Owner**: `payment-service`
- **Database**: `payment_db` (table: `payment_intents`)

## 3. API Contract
- **Endpoint**: `POST /internal/v1/payments/booking-deposit`
- **Auth**: Service Internal Secret (`x-internal-service-secret`)

## 4. Architecture & Persistence Flow
1. Verify internal service secret and tenant header.
2. Create `PaymentIntent` with `purpose = BOOKING_DEPOSIT`.
3. Return `paymentIntentId`, status, and payment gateway reference.
