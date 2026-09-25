import type { EventEnvelope } from './envelope';
export declare const DOMAIN_EVENTS: {
    readonly TENANT_CREATED: "TenantCreated";
    readonly TENANT_ACTIVATED: "TenantActivated";
    readonly BRANCH_CREATED: "BranchCreated";
    readonly CLIENT_CREATED: "ClientCreated";
    readonly LEAD_CONVERTED: "LeadConverted";
    readonly APPOINTMENT_CREATED: "AppointmentCreated";
    readonly APPOINTMENT_CONFIRMED: "AppointmentConfirmed";
    readonly APPOINTMENT_CANCELLED: "AppointmentCancelled";
    readonly APPOINTMENT_COMPLETED: "AppointmentCompleted";
    readonly SERVICE_COMPLETED: "ServiceCompleted";
    readonly INVOICE_CREATED: "InvoiceCreated";
    readonly PAYMENT_COMPLETED: "PaymentCompleted";
    readonly PAYMENT_FAILED: "PaymentFailed";
    readonly REFUND_COMPLETED: "RefundCompleted";
    readonly SALE_COMPLETED: "SaleCompleted";
    readonly STOCK_RECEIVED: "StockReceived";
    readonly STOCK_CONSUMED: "StockConsumed";
    readonly STOCK_TRANSFERRED: "StockTransferred";
    readonly STOCK_LOW: "StockLow";
    readonly COMMISSION_CALCULATED: "CommissionCalculated";
    readonly FRANCHISE_ROYALTY_CALCULATED: "FranchiseRoyaltyCalculated";
    readonly FRANCHISE_SETTLEMENT_CREATED: "FranchiseSettlementCreated";
    readonly MEMBERSHIP_ACTIVATED: "MembershipActivated";
    readonly PACKAGE_REDEEMED: "PackageRedeemed";
    readonly LOYALTY_POINTS_EARNED: "LoyaltyPointsEarned";
    readonly NOTIFICATION_REQUESTED: "NotificationRequested";
    readonly EMPLOYEE_CREATED: "EmployeeCreated";
    readonly EMPLOYEE_UPDATED: "EmployeeUpdated";
    readonly EMPLOYEE_ACTIVATED: "EmployeeActivated";
    readonly EMPLOYEE_DEACTIVATED: "EmployeeDeactivated";
    readonly STAFF_BRANCH_ASSIGNED: "StaffBranchAssigned";
    readonly STAFF_BRANCH_REMOVED: "StaffBranchRemoved";
    readonly STAFF_SKILL_UPDATED: "StaffSkillUpdated";
    readonly ROSTER_UPDATED: "RosterUpdated";
    readonly ATTENDANCE_CLOCKED_IN: "AttendanceClockedIn";
    readonly ATTENDANCE_CLOCKED_OUT: "AttendanceClockedOut";
    readonly LEAVE_REQUESTED: "LeaveRequested";
    readonly LEAVE_APPROVED: "LeaveApproved";
    readonly LEAVE_REJECTED: "LeaveRejected";
    readonly CUSTOMER_CREATED: "CustomerCreated";
    readonly CUSTOMER_UPDATED: "CustomerUpdated";
    readonly CUSTOMER_DELETED: "CustomerDeleted";
    readonly CUSTOMER_BECAME_DORMANT: "CustomerBecameDormant";
    readonly CUSTOMER_SEGMENT_UPDATED: "CustomerSegmentUpdated";
    readonly LEAD_CREATED: "LeadCreated";
    readonly LEAD_STATUS_CHANGED: "LeadStatusChanged";
    readonly SERVICE_CREATED: "ServiceCreated";
    readonly SERVICE_UPDATED: "ServiceUpdated";
    readonly SERVICE_DELETED: "ServiceDeleted";
    readonly SERVICE_PRICE_UPDATED: "ServicePriceUpdated";
    readonly SERVICE_RECIPE_UPDATED: "ServiceRecipeUpdated";
    readonly PACKAGE_PURCHASED: "PackagePurchased";
    readonly WALLET_TRANSACTION_POSTED: "WalletTransactionPosted";
    readonly LOYALTY_POINTS_REDEEMED: "LoyaltyPointsRedeemed";
    readonly APPOINTMENT_RESCHEDULED: "AppointmentRescheduled";
    readonly APPOINTMENT_CHECKED_IN: "AppointmentCheckedIn";
    readonly SERVICE_STARTED: "ServiceStarted";
    readonly APPOINTMENT_NO_SHOW: "AppointmentNoShow";
    readonly PAYMENT_INTENT_CREATED: "PaymentIntentCreated";
    readonly PAYMENT_AUTHORIZED: "PaymentAuthorized";
    readonly PAYMENT_CANCELLED: "PaymentCancelled";
    readonly REFUND_REQUESTED: "RefundRequested";
    readonly REFUND_FAILED: "RefundFailed";
    readonly PAYMENT_RECONCILED: "PaymentReconciled";
};
export type DomainEventName = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];
export interface TenantCreatedPayload {
    tenantId: string;
    name: string;
    subdomain: string;
    ownerEmail: string;
    planId: string;
}
export interface TenantActivatedPayload {
    tenantId: string;
    activatedAt: string;
    status: string;
}
export interface BranchCreatedPayload {
    tenantId: string;
    branchId: string;
    franchiseId?: string | null;
    name: string;
    code: string;
    city: string;
}
export interface ClientCreatedPayload {
    tenantId: string;
    clientId: string;
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    branchId?: string;
}
export interface LeadConvertedPayload {
    tenantId: string;
    leadId: string;
    clientId: string;
    convertedAt: string;
}
export interface AppointmentCreatedPayload {
    tenantId: string;
    branchId: string;
    appointmentId: string;
    clientId: string;
    serviceId: string;
    staffId: string;
    startTime: string;
    endTime: string;
    totalPrice: number;
    depositRequired: boolean;
    depositAmount?: number;
}
export interface AppointmentConfirmedPayload {
    tenantId: string;
    branchId: string;
    appointmentId: string;
    confirmedAt: string;
}
export interface AppointmentCancelledPayload {
    tenantId: string;
    branchId: string;
    appointmentId: string;
    reason: string;
    cancelledByUserId?: string;
}
export interface AppointmentCompletedPayload {
    tenantId: string;
    branchId: string;
    appointmentId: string;
    completedAt: string;
    durationMinutes: number;
}
export interface ServiceCompletedPayload {
    tenantId: string;
    branchId: string;
    appointmentId: string;
    serviceId: string;
    staffId: string;
    clientId: string;
    price: number;
    completedAt: string;
    recipeBomId?: string;
}
export interface InvoiceCreatedPayload {
    tenantId: string;
    branchId: string;
    invoiceId: string;
    invoiceNumber: string;
    clientId: string;
    subtotal: number;
    taxAmount: number;
    discountAmount: number;
    grandTotal: number;
    items: Array<{
        itemId: string;
        itemType: 'SERVICE' | 'PRODUCT' | 'PACKAGE' | 'MEMBERSHIP';
        quantity: number;
        unitPrice: number;
        staffId?: string;
    }>;
}
export interface PaymentCompletedPayload {
    tenantId: string;
    branchId: string;
    paymentId: string;
    invoiceId?: string;
    appointmentId?: string;
    amount: number;
    currency: string;
    method: 'CASH' | 'CARD' | 'UPI' | 'WALLET' | 'ONLINE';
    gatewayTransactionId?: string;
    paidAt: string;
}
export interface PaymentFailedPayload {
    tenantId: string;
    paymentId: string;
    invoiceId?: string;
    amount: number;
    reason: string;
}
export interface RefundCompletedPayload {
    tenantId: string;
    refundId: string;
    paymentId: string;
    invoiceId?: string;
    amount: number;
    reason: string;
}
export interface SaleCompletedPayload {
    tenantId: string;
    branchId: string;
    franchiseId?: string | null;
    invoiceId: string;
    clientId: string;
    grandTotal: number;
    paymentId: string;
    items: Array<{
        itemId: string;
        itemType: 'SERVICE' | 'PRODUCT' | 'PACKAGE' | 'MEMBERSHIP';
        skuId?: string;
        quantity: number;
        unitPrice: number;
        staffId?: string;
    }>;
    completedAt: string;
}
export interface StockReceivedPayload {
    tenantId: string;
    branchId: string;
    purchaseOrderId?: string;
    supplierId: string;
    items: Array<{
        skuId: string;
        batchNumber?: string;
        quantity: number;
        costPrice: number;
    }>;
}
export interface StockConsumedPayload {
    tenantId: string;
    branchId: string;
    serviceId?: string;
    appointmentId?: string;
    items: Array<{
        skuId: string;
        quantity: number;
        batchNumber?: string;
    }>;
}
export interface StockTransferredPayload {
    tenantId: string;
    fromBranchId: string;
    toBranchId: string;
    transferId: string;
    items: Array<{
        skuId: string;
        quantity: number;
    }>;
}
export interface StockLowPayload {
    tenantId: string;
    branchId: string;
    skuId: string;
    currentStock: number;
    reorderLevel: number;
}
export interface CommissionCalculatedPayload {
    tenantId: string;
    branchId: string;
    staffId: string;
    invoiceId: string;
    amount: number;
    calculatedAt: string;
}
export interface FranchiseRoyaltyCalculatedPayload {
    tenantId: string;
    franchiseId: string;
    branchId: string;
    invoiceId: string;
    royaltyAmount: number;
    percentage: number;
}
export interface FranchiseSettlementCreatedPayload {
    tenantId: string;
    franchiseId: string;
    settlementId: string;
    periodStart: string;
    periodEnd: string;
    totalGrossSales: number;
    totalRoyaltyDue: number;
    netPayable: number;
}
export interface MembershipActivatedPayload {
    tenantId: string;
    branchId: string;
    clientId: string;
    membershipId: string;
    planName: string;
    expiresAt: string;
}
export interface PackageRedeemedPayload {
    tenantId: string;
    branchId: string;
    clientId: string;
    packageId: string;
    serviceId: string;
    remainingCredits: number;
}
export interface LoyaltyPointsEarnedPayload {
    tenantId: string;
    clientId: string;
    pointsEarned: number;
    currentBalance: number;
    invoiceId?: string;
}
export interface NotificationRequestedPayload {
    tenantId: string;
    channel: 'WHATSAPP' | 'SMS' | 'EMAIL' | 'PUSH';
    recipient: string;
    templateCode: string;
    variables: Record<string, string | number>;
}
export interface EmployeeCreatedPayload {
    tenantId: string;
    employeeId: string;
    employeeCode: string;
    identityUserId?: string | null;
    displayName: string;
    jobTitle: string;
    primaryBranchId?: string | null;
    createdAt: string;
}
export interface EmployeeUpdatedPayload {
    tenantId: string;
    employeeId: string;
    updatedFields: string[];
    updatedAt: string;
}
export interface EmployeeStatusChangedPayload {
    tenantId: string;
    employeeId: string;
    previousStatus: string;
    newStatus: string;
    reason?: string;
    changedAt: string;
}
export interface StaffBranchAssignedPayload {
    tenantId: string;
    employeeId: string;
    branchId: string;
    isPrimary: boolean;
    assignedAt: string;
}
export interface StaffBranchRemovedPayload {
    tenantId: string;
    employeeId: string;
    branchId: string;
    removedAt: string;
}
export interface StaffSkillUpdatedPayload {
    tenantId: string;
    employeeId: string;
    serviceId: string;
    skillLevel: string;
    updatedAt: string;
}
export interface RosterUpdatedPayload {
    tenantId: string;
    employeeId: string;
    branchId: string;
    rosterDate: string;
    status: string;
    updatedAt: string;
}
export interface AttendanceClockedInPayload {
    tenantId: string;
    employeeId: string;
    branchId: string;
    attendanceDate: string;
    clockInAt: string;
    method: string;
}
export interface AttendanceClockedOutPayload {
    tenantId: string;
    employeeId: string;
    branchId: string;
    attendanceDate: string;
    clockOutAt: string;
    workedMinutes: number;
    overtimeMinutes: number;
    lateMinutes: number;
}
export interface LeaveRequestedPayload {
    tenantId: string;
    employeeId: string;
    leaveRequestId: string;
    leaveType: string;
    startDate: string;
    endDate: string;
    requestedAt: string;
}
export interface LeaveDecisionPayload {
    tenantId: string;
    employeeId: string;
    leaveRequestId: string;
    status: 'APPROVED' | 'REJECTED';
    decidedBy?: string | null;
    decidedAt: string;
    reviewNote?: string;
}
export type TenantCreatedEvent = EventEnvelope<TenantCreatedPayload>;
export type AppointmentCreatedEvent = EventEnvelope<AppointmentCreatedPayload>;
export type AppointmentCompletedEvent = EventEnvelope<AppointmentCompletedPayload>;
export type ServiceCompletedEvent = EventEnvelope<ServiceCompletedPayload>;
export type SaleCompletedEvent = EventEnvelope<SaleCompletedPayload>;
export type PaymentCompletedEvent = EventEnvelope<PaymentCompletedPayload>;
export type NotificationRequestedEvent = EventEnvelope<NotificationRequestedPayload>;
export type EmployeeCreatedEvent = EventEnvelope<EmployeeCreatedPayload>;
export type EmployeeUpdatedEvent = EventEnvelope<EmployeeUpdatedPayload>;
export type StaffBranchAssignedEvent = EventEnvelope<StaffBranchAssignedPayload>;
export type AttendanceClockedInEvent = EventEnvelope<AttendanceClockedInPayload>;
export type AttendanceClockedOutEvent = EventEnvelope<AttendanceClockedOutPayload>;
export type LeaveRequestedEvent = EventEnvelope<LeaveRequestedPayload>;
export type LeaveDecisionEvent = EventEnvelope<LeaveDecisionPayload>;
//# sourceMappingURL=domain-events.d.ts.map