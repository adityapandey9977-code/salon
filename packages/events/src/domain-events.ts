import type { EventEnvelope } from './envelope';

// Event Name Constants
export const DOMAIN_EVENTS = {
  TENANT_CREATED: 'TenantCreated',
  TENANT_ACTIVATED: 'TenantActivated',
  BRANCH_CREATED: 'BranchCreated',
  CLIENT_CREATED: 'ClientCreated',
  LEAD_CONVERTED: 'LeadConverted',
  APPOINTMENT_CREATED: 'AppointmentCreated',
  APPOINTMENT_CONFIRMED: 'AppointmentConfirmed',
  APPOINTMENT_CANCELLED: 'AppointmentCancelled',
  APPOINTMENT_COMPLETED: 'AppointmentCompleted',
  SERVICE_COMPLETED: 'ServiceCompleted',
  INVOICE_CREATED: 'InvoiceCreated',
  PAYMENT_COMPLETED: 'PaymentCompleted',
  PAYMENT_FAILED: 'PaymentFailed',
  REFUND_COMPLETED: 'RefundCompleted',
  SALE_COMPLETED: 'SaleCompleted',
  STOCK_RECEIVED: 'StockReceived',
  STOCK_CONSUMED: 'StockConsumed',
  STOCK_TRANSFERRED: 'StockTransferred',
  STOCK_LOW: 'StockLow',
  COMMISSION_CALCULATED: 'CommissionCalculated',
  FRANCHISE_ROYALTY_CALCULATED: 'FranchiseRoyaltyCalculated',
  FRANCHISE_SETTLEMENT_CREATED: 'FranchiseSettlementCreated',
  MEMBERSHIP_ACTIVATED: 'MembershipActivated',
  PACKAGE_REDEEMED: 'PackageRedeemed',
  LOYALTY_POINTS_EARNED: 'LoyaltyPointsEarned',
  NOTIFICATION_REQUESTED: 'NotificationRequested',
  // Staff & People Domain Events
  EMPLOYEE_CREATED: 'EmployeeCreated',
  EMPLOYEE_UPDATED: 'EmployeeUpdated',
  EMPLOYEE_ACTIVATED: 'EmployeeActivated',
  EMPLOYEE_DEACTIVATED: 'EmployeeDeactivated',
  STAFF_BRANCH_ASSIGNED: 'StaffBranchAssigned',
  STAFF_BRANCH_REMOVED: 'StaffBranchRemoved',
  STAFF_SKILL_UPDATED: 'StaffSkillUpdated',
  ROSTER_UPDATED: 'RosterUpdated',
  ATTENDANCE_CLOCKED_IN: 'AttendanceClockedIn',
  ATTENDANCE_CLOCKED_OUT: 'AttendanceClockedOut',
  LEAVE_REQUESTED: 'LeaveRequested',
  LEAVE_APPROVED: 'LeaveApproved',
  LEAVE_REJECTED: 'LeaveRejected',
  // Customer Domain Events
  CUSTOMER_CREATED: 'CustomerCreated',
  CUSTOMER_UPDATED: 'CustomerUpdated',
  CUSTOMER_DELETED: 'CustomerDeleted',
  CUSTOMER_BECAME_DORMANT: 'CustomerBecameDormant',
  CUSTOMER_SEGMENT_UPDATED: 'CustomerSegmentUpdated',
  LEAD_CREATED: 'LeadCreated',
  LEAD_STATUS_CHANGED: 'LeadStatusChanged',
  // Commerce Domain Events
  SERVICE_CREATED: 'ServiceCreated',
  SERVICE_UPDATED: 'ServiceUpdated',
  SERVICE_DELETED: 'ServiceDeleted',
  SERVICE_PRICE_UPDATED: 'ServicePriceUpdated',
  SERVICE_RECIPE_UPDATED: 'ServiceRecipeUpdated',
  PACKAGE_PURCHASED: 'PackagePurchased',
  WALLET_TRANSACTION_POSTED: 'WalletTransactionPosted',
  LOYALTY_POINTS_REDEEMED: 'LoyaltyPointsRedeemed',
  // Booking Domain Events
  APPOINTMENT_RESCHEDULED: 'AppointmentRescheduled',
  APPOINTMENT_CHECKED_IN: 'AppointmentCheckedIn',
  SERVICE_STARTED: 'ServiceStarted',
  APPOINTMENT_NO_SHOW: 'AppointmentNoShow',
  // Payment Domain Events
  PAYMENT_INTENT_CREATED: 'PaymentIntentCreated',
  PAYMENT_AUTHORIZED: 'PaymentAuthorized',
  PAYMENT_CANCELLED: 'PaymentCancelled',
  REFUND_REQUESTED: 'RefundRequested',
  REFUND_FAILED: 'RefundFailed',
  PAYMENT_RECONCILED: 'PaymentReconciled',
} as const;

export type DomainEventName = (typeof DOMAIN_EVENTS)[keyof typeof DOMAIN_EVENTS];

// Event Payload Definitions
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

// Staff & People Event Payloads
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

// Concrete Event Envelope Types
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

