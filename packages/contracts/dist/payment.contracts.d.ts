import { z } from 'zod';
export declare const PaymentPurposeEnum: z.ZodEnum<["BOOKING_DEPOSIT", "INVOICE_PAYMENT", "MEMBERSHIP", "PACKAGE", "WALLET_TOPUP", "FRANCHISE_SETTLEMENT", "OTHER"]>;
export type PaymentPurpose = z.infer<typeof PaymentPurposeEnum>;
export declare const PaymentIntentStatusEnum: z.ZodEnum<["CREATED", "PENDING", "REQUIRES_ACTION", "AUTHORIZED", "CAPTURED", "FAILED", "CANCELLED", "EXPIRED"]>;
export type PaymentIntentStatus = z.infer<typeof PaymentIntentStatusEnum>;
export declare const PaymentProviderEnum: z.ZodEnum<["RAZORPAY", "STRIPE", "CASH", "UPI", "POS_TERMINAL", "WALLET", "MOCK"]>;
export type PaymentProvider = z.infer<typeof PaymentProviderEnum>;
export declare const PaymentMethodEnum: z.ZodEnum<["CASH", "CARD", "UPI", "PAYMENT_LINK", "WALLET", "NET_BANKING", "OTHER"]>;
export type PaymentMethod = z.infer<typeof PaymentMethodEnum>;
export declare const RefundStatusEnum: z.ZodEnum<["REQUESTED", "APPROVED", "PROCESSING", "COMPLETED", "FAILED", "REJECTED"]>;
export type RefundStatus = z.infer<typeof RefundStatusEnum>;
export declare const CreatePaymentIntentRequestSchema: z.ZodObject<{
    purpose: z.ZodDefault<z.ZodEnum<["BOOKING_DEPOSIT", "INVOICE_PAYMENT", "MEMBERSHIP", "PACKAGE", "WALLET_TOPUP", "FRANCHISE_SETTLEMENT", "OTHER"]>>;
    referenceType: z.ZodDefault<z.ZodEnum<["INVOICE", "APPOINTMENT", "PACKAGE", "MEMBERSHIP", "WALLET", "OTHER"]>>;
    referenceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    customerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    branchId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    provider: z.ZodDefault<z.ZodEnum<["RAZORPAY", "STRIPE", "CASH", "UPI", "POS_TERMINAL", "WALLET", "MOCK"]>>;
    idempotencyKey: z.ZodString;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
}, "strip", z.ZodTypeAny, {
    purpose: "BOOKING_DEPOSIT" | "INVOICE_PAYMENT" | "MEMBERSHIP" | "PACKAGE" | "WALLET_TOPUP" | "FRANCHISE_SETTLEMENT" | "OTHER";
    referenceType: "MEMBERSHIP" | "PACKAGE" | "OTHER" | "WALLET" | "INVOICE" | "APPOINTMENT";
    amount: number;
    currency: string;
    provider: "RAZORPAY" | "STRIPE" | "CASH" | "UPI" | "POS_TERMINAL" | "WALLET" | "MOCK";
    idempotencyKey: string;
    branchId?: string | null | undefined;
    customerId?: string | null | undefined;
    referenceId?: string | null | undefined;
    metadata?: Record<string, unknown> | null | undefined;
}, {
    amount: number;
    idempotencyKey: string;
    branchId?: string | null | undefined;
    customerId?: string | null | undefined;
    purpose?: "BOOKING_DEPOSIT" | "INVOICE_PAYMENT" | "MEMBERSHIP" | "PACKAGE" | "WALLET_TOPUP" | "FRANCHISE_SETTLEMENT" | "OTHER" | undefined;
    referenceType?: "MEMBERSHIP" | "PACKAGE" | "OTHER" | "WALLET" | "INVOICE" | "APPOINTMENT" | undefined;
    referenceId?: string | null | undefined;
    currency?: string | undefined;
    provider?: "RAZORPAY" | "STRIPE" | "CASH" | "UPI" | "POS_TERMINAL" | "WALLET" | "MOCK" | undefined;
    metadata?: Record<string, unknown> | null | undefined;
}>;
export type CreatePaymentIntentRequest = z.infer<typeof CreatePaymentIntentRequestSchema>;
export declare const VerifyPaymentTokenRequestSchema: z.ZodObject<{
    paymentIntentId: z.ZodString;
    providerTransactionId: z.ZodString;
    providerOrderId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    signature: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    method: z.ZodDefault<z.ZodEnum<["CASH", "CARD", "UPI", "PAYMENT_LINK", "WALLET", "NET_BANKING", "OTHER"]>>;
}, "strip", z.ZodTypeAny, {
    paymentIntentId: string;
    providerTransactionId: string;
    method: "OTHER" | "CASH" | "UPI" | "WALLET" | "CARD" | "PAYMENT_LINK" | "NET_BANKING";
    providerOrderId?: string | null | undefined;
    signature?: string | null | undefined;
}, {
    paymentIntentId: string;
    providerTransactionId: string;
    providerOrderId?: string | null | undefined;
    signature?: string | null | undefined;
    method?: "OTHER" | "CASH" | "UPI" | "WALLET" | "CARD" | "PAYMENT_LINK" | "NET_BANKING" | undefined;
}>;
export type VerifyPaymentTokenRequest = z.infer<typeof VerifyPaymentTokenRequestSchema>;
export declare const CreatePaymentLinkRequestSchema: z.ZodObject<{
    paymentIntentId: z.ZodString;
    customerMobile: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    customerEmail: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    expiresInMinutes: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    paymentIntentId: string;
    expiresInMinutes: number;
    customerMobile?: string | null | undefined;
    customerEmail?: string | null | undefined;
}, {
    paymentIntentId: string;
    customerMobile?: string | null | undefined;
    customerEmail?: string | null | undefined;
    expiresInMinutes?: number | undefined;
}>;
export type CreatePaymentLinkRequest = z.infer<typeof CreatePaymentLinkRequestSchema>;
export declare const RequestRefundRequestSchema: z.ZodObject<{
    paymentTransactionId: z.ZodString;
    amount: z.ZodNumber;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    amount: number;
    paymentTransactionId: string;
}, {
    reason: string;
    amount: number;
    paymentTransactionId: string;
}>;
export type RequestRefundRequest = z.infer<typeof RequestRefundRequestSchema>;
export declare const ReconcilePaymentsRequestSchema: z.ZodObject<{
    provider: z.ZodEnum<["RAZORPAY", "STRIPE", "CASH", "UPI", "POS_TERMINAL", "WALLET", "MOCK"]>;
    settlementDate: z.ZodString;
    totalAmount: z.ZodNumber;
    feeAmount: z.ZodDefault<z.ZodNumber>;
    taxAmount: z.ZodDefault<z.ZodNumber>;
    netAmount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    totalAmount: number;
    provider: "RAZORPAY" | "STRIPE" | "CASH" | "UPI" | "POS_TERMINAL" | "WALLET" | "MOCK";
    settlementDate: string;
    feeAmount: number;
    taxAmount: number;
    netAmount: number;
}, {
    totalAmount: number;
    provider: "RAZORPAY" | "STRIPE" | "CASH" | "UPI" | "POS_TERMINAL" | "WALLET" | "MOCK";
    settlementDate: string;
    netAmount: number;
    feeAmount?: number | undefined;
    taxAmount?: number | undefined;
}>;
export type ReconcilePaymentsRequest = z.infer<typeof ReconcilePaymentsRequestSchema>;
export declare const BookingDepositRequestSchema: z.ZodObject<{
    tenantId: z.ZodString;
    appointmentId: z.ZodString;
    customerId: z.ZodString;
    amount: z.ZodNumber;
    currency: z.ZodDefault<z.ZodString>;
    idempotencyKey: z.ZodString;
}, "strip", z.ZodTypeAny, {
    tenantId: string;
    customerId: string;
    amount: number;
    currency: string;
    idempotencyKey: string;
    appointmentId: string;
}, {
    tenantId: string;
    customerId: string;
    amount: number;
    idempotencyKey: string;
    appointmentId: string;
    currency?: string | undefined;
}>;
export type BookingDepositRequest = z.infer<typeof BookingDepositRequestSchema>;
//# sourceMappingURL=payment.contracts.d.ts.map