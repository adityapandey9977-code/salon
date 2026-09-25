import { z } from 'zod';

export const PaymentPurposeEnum = z.enum([
  'BOOKING_DEPOSIT',
  'INVOICE_PAYMENT',
  'MEMBERSHIP',
  'PACKAGE',
  'WALLET_TOPUP',
  'FRANCHISE_SETTLEMENT',
  'OTHER',
]);
export type PaymentPurpose = z.infer<typeof PaymentPurposeEnum>;

export const PaymentIntentStatusEnum = z.enum([
  'CREATED',
  'PENDING',
  'REQUIRES_ACTION',
  'AUTHORIZED',
  'CAPTURED',
  'FAILED',
  'CANCELLED',
  'EXPIRED',
]);
export type PaymentIntentStatus = z.infer<typeof PaymentIntentStatusEnum>;

export const PaymentProviderEnum = z.enum(['RAZORPAY', 'STRIPE', 'CASH', 'UPI', 'POS_TERMINAL', 'WALLET', 'MOCK']);
export type PaymentProvider = z.infer<typeof PaymentProviderEnum>;

export const PaymentMethodEnum = z.enum(['CASH', 'CARD', 'UPI', 'PAYMENT_LINK', 'WALLET', 'NET_BANKING', 'OTHER']);
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;

export const RefundStatusEnum = z.enum([
  'REQUESTED',
  'APPROVED',
  'PROCESSING',
  'COMPLETED',
  'FAILED',
  'REJECTED',
]);
export type RefundStatus = z.infer<typeof RefundStatusEnum>;

export const CreatePaymentIntentRequestSchema = z.object({
  purpose: PaymentPurposeEnum.default('INVOICE_PAYMENT'),
  referenceType: z.enum(['INVOICE', 'APPOINTMENT', 'PACKAGE', 'MEMBERSHIP', 'WALLET', 'OTHER']).default('INVOICE'),
  referenceId: z.string().uuid().optional().nullable(),
  customerId: z.string().uuid().optional().nullable(),
  branchId: z.string().uuid().optional().nullable(),
  amount: z.number().positive(),
  currency: z.string().default('INR'),
  provider: PaymentProviderEnum.default('RAZORPAY'),
  idempotencyKey: z.string().min(1),
  metadata: z.record(z.unknown()).optional().nullable(),
});
export type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentRequestSchema>;

export const VerifyPaymentTokenRequestSchema = z.object({
  paymentIntentId: z.string().uuid(),
  providerTransactionId: z.string().min(1),
  providerOrderId: z.string().optional().nullable(),
  signature: z.string().optional().nullable(),
  method: PaymentMethodEnum.default('CARD'),
});
export type VerifyPaymentTokenRequest = z.infer<typeof VerifyPaymentTokenRequestSchema>;

export const CreatePaymentLinkRequestSchema = z.object({
  paymentIntentId: z.string().uuid(),
  customerMobile: z.string().optional().nullable(),
  customerEmail: z.string().email().optional().nullable(),
  expiresInMinutes: z.number().int().positive().default(1440),
});
export type CreatePaymentLinkRequest = z.infer<typeof CreatePaymentLinkRequestSchema>;

export const RequestRefundRequestSchema = z.object({
  paymentTransactionId: z.string().uuid(),
  amount: z.number().positive(),
  reason: z.string().min(1),
});
export type RequestRefundRequest = z.infer<typeof RequestRefundRequestSchema>;

export const ReconcilePaymentsRequestSchema = z.object({
  provider: PaymentProviderEnum,
  settlementDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalAmount: z.number().nonnegative(),
  feeAmount: z.number().nonnegative().default(0),
  taxAmount: z.number().nonnegative().default(0),
  netAmount: z.number().nonnegative(),
});
export type ReconcilePaymentsRequest = z.infer<typeof ReconcilePaymentsRequestSchema>;

export const BookingDepositRequestSchema = z.object({
  tenantId: z.string().uuid(),
  appointmentId: z.string().uuid(),
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  currency: z.string().default('INR'),
  idempotencyKey: z.string().min(1),
});
export type BookingDepositRequest = z.infer<typeof BookingDepositRequestSchema>;
