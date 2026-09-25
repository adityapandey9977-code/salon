import { z } from 'zod';
import { PaymentMethodEnum, type PaymentMethod } from './payment.contracts';

export const ItemTypeEnum = z.enum(['SERVICE', 'PRODUCT', 'PACKAGE', 'MEMBERSHIP']);
export type ItemType = z.infer<typeof ItemTypeEnum>;

export const InvoiceStatusEnum = z.enum([
  'DRAFT',
  'PENDING_PAYMENT',
  'PARTIALLY_PAID',
  'PAID',
  'CANCELLED',
  'REFUNDED',
  'PARTIALLY_REFUNDED',
]);
export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;

// Service Category
export const CreateServiceCategoryRequestSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  description: z.string().optional().nullable(),
  sortOrder: z.number().int().default(0),
  imageUrl: z.string().optional().nullable(),
  accentColor: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
export type CreateServiceCategoryRequest = z.infer<typeof CreateServiceCategoryRequestSchema>;

export const UpdateServiceCategoryRequestSchema = CreateServiceCategoryRequestSchema.partial();
export type UpdateServiceCategoryRequest = z.infer<typeof UpdateServiceCategoryRequestSchema>;

// Service Catalogue
export const CreateServiceRequestSchema = z.object({
  categoryId: z.string().uuid(),
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  durationMinutes: z.number().int().positive(),
  bufferBeforeMinutes: z.number().int().nonnegative().default(0),
  bufferAfterMinutes: z.number().int().nonnegative().default(0),
  basePrice: z.number().nonnegative(),
  gstRate: z.number().min(0).max(100).default(18),
  taxCode: z.string().optional().nullable(),
  sacCode: z.string().optional().nullable(),
  requiresConsultation: z.boolean().default(false),
  requiresPatchTest: z.boolean().default(false),
  isActive: z.boolean().default(true),
  isBookableOnline: z.boolean().default(true),
  imageUrl: z.string().optional().nullable(),
  requiredSkill: z.string().optional().nullable(),
  requiredLevel: z.string().optional().nullable(),
  requiredRoomOrChair: z.string().optional().nullable(),
  requiredEquipment: z.string().optional().nullable(),
  pricingMode: z.string().optional().nullable(),
  discountEligible: z.boolean().default(true),
  availableBranches: z.array(z.string()).optional().default([]),
  metadata: z.any().optional().nullable(),
});
export type CreateServiceRequest = z.infer<typeof CreateServiceRequestSchema>;

export const UpdateServiceRequestSchema = CreateServiceRequestSchema.partial();
export type UpdateServiceRequest = z.infer<typeof UpdateServiceRequestSchema>;

export const QueryServicesRequestSchema = z.object({
  categoryId: z.string().uuid().optional(),
  branchId: z.string().uuid().optional(),
  search: z.string().optional(),
  isActive: z.enum(['true', 'false']).optional(),
  isBookableOnline: z.enum(['true', 'false']).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(20),
});
export type QueryServicesRequest = z.infer<typeof QueryServicesRequestSchema>;

// Branch Pricing
export const SetBranchPriceRequestSchema = z.object({
  branchId: z.string().uuid(),
  price: z.number().nonnegative(),
  effectiveFrom: z.string().optional().nullable(),
  effectiveTo: z.string().optional().nullable(),
  isActive: z.boolean().default(true),
});
export type SetBranchPriceRequest = z.infer<typeof SetBranchPriceRequestSchema>;

// Recipe / BOM
export const CreateServiceRecipeRequestSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional().nullable(),
  version: z.number().int().default(1),
  items: z.array(
    z.object({
      skuId: z.string(),
      quantityRequired: z.number().positive(),
      unit: z.string().default('ML'),
    }),
  ),
});
export type CreateServiceRecipeRequest = z.infer<typeof CreateServiceRecipeRequestSchema>;

// Packages
export const CreatePackageRequestSchema = z.object({
  code: z.string().min(1),
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  validityDays: z.number().int().positive().default(365),
  isShared: z.boolean().default(false),
  isActive: z.boolean().default(true),
  durationMins: z.number().int().positive().optional().nullable(),
  salesCount: z.number().int().nonnegative().optional().default(0),
  imageUrl: z.string().optional().nullable(),
  includedServicesText: z.string().optional().nullable(),
  items: z.array(
    z.object({
      serviceId: z.string().uuid(),
      includedQuantity: z.number().int().positive(),
    }),
  ).optional().default([]),
});
export type CreatePackageRequest = z.infer<typeof CreatePackageRequestSchema>;

export const UpdatePackageRequestSchema = CreatePackageRequestSchema.partial();
export type UpdatePackageRequest = z.infer<typeof UpdatePackageRequestSchema>;

// Memberships
export const CreateMembershipRequestSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional().nullable(),
  price: z.number().nonnegative(),
  billingPeriod: z.enum(['MONTHLY', 'QUARTERLY', 'HALF_YEARLY', 'ANNUAL']).default('ANNUAL'),
  discountPercentage: z.number().min(0).max(100).default(0),
  benefitsJson: z.record(z.unknown()).optional().nullable(),
  isActive: z.boolean().default(true),
  pointsMultiplier: z.number().nonnegative().optional().nullable(),
  membersCount: z.number().int().nonnegative().optional().default(0),
  perksText: z.string().optional().nullable(),
});
export type CreateMembershipRequest = z.infer<typeof CreateMembershipRequestSchema>;

// Package Usage & Redemptions
export const RedeemPackageRequestSchema = z.object({
  customerPackageId: z.string().uuid(),
  serviceId: z.string().uuid(),
  appointmentId: z.string().uuid().optional().nullable(),
  quantity: z.number().int().positive().default(1),
  clientName: z.string().optional(),
  branchName: z.string().optional(),
  staffName: z.string().optional(),
});
export type RedeemPackageRequest = z.infer<typeof RedeemPackageRequestSchema>;

// Membership Benefits
export const CreateMembershipBenefitSchema = z.object({
  membershipPlanId: z.string().uuid().optional(),
  perkName: z.string().min(1),
  category: z.string().default('SERVICE_DISCOUNT'),
  discountValue: z.string(),
  applicableScope: z.string().default('ALL_SERVICES'),
  usageLimit: z.string().default('UNLIMITED'),
  status: z.string().default('ACTIVE'),
});
export type CreateMembershipBenefit = z.infer<typeof CreateMembershipBenefitSchema>;

// Membership Renewals
export const RenewMembershipRequestSchema = z.object({
  customerMembershipId: z.string().uuid(),
  renewalMonths: z.number().int().positive().default(12),
  paymentMethod: z.string().default('CASH'),
});
export type RenewMembershipRequest = z.infer<typeof RenewMembershipRequestSchema>;

// Wallet & Loyalty Topup / Redeem
export const WalletTopupRequestSchema = z.object({
  customerId: z.string().uuid(),
  amount: z.number().positive(),
  notes: z.string().optional().nullable(),
});
export type WalletTopupRequest = z.infer<typeof WalletTopupRequestSchema>;

export const LoyaltyRedeemRequestSchema = z.object({
  customerId: z.string().uuid(),
  pointsToRedeem: z.number().int().positive(),
  invoiceId: z.string().uuid().optional().nullable(),
});
export type LoyaltyRedeemRequest = z.infer<typeof LoyaltyRedeemRequestSchema>;

// POS Checkout
export const POSCartItemSchema = z.object({
  itemType: ItemTypeEnum,
  itemId: z.string().uuid(),
  skuId: z.string().uuid().optional().nullable(),
  staffId: z.string().uuid().optional().nullable(),
  description: z.string().optional(),
  quantity: z.number().int().positive().default(1),
  unitPrice: z.number().nonnegative(),
  discountAmount: z.number().nonnegative().default(0),
});
export type POSCartItem = z.infer<typeof POSCartItemSchema>;

export const CheckoutCartRequestSchema = z.object({
  branchId: z.string().uuid(),
  customerId: z.string().uuid().optional().nullable(),
  appointmentId: z.string().uuid().optional().nullable(),
  items: z.array(POSCartItemSchema).min(1),
  couponCode: z.string().optional().nullable(),
  walletAmountToRedeem: z.number().nonnegative().optional().default(0),
  loyaltyPointsToRedeem: z.number().int().nonnegative().optional().default(0),
  paymentMethod: PaymentMethodEnum.default('CASH'),
});
export type CheckoutCartRequest = z.infer<typeof CheckoutCartRequestSchema>;

export const CalculateTaxRequestSchema = z.object({
  branchId: z.string().uuid(),
  items: z.array(
    z.object({
      itemType: ItemTypeEnum,
      itemId: z.string().uuid(),
      unitPrice: z.number().nonnegative(),
      quantity: z.number().int().positive().default(1),
      discountAmount: z.number().nonnegative().default(0),
    }),
  ),
  couponCode: z.string().optional().nullable(),
});
export type CalculateTaxRequest = z.infer<typeof CalculateTaxRequestSchema>;

export const RequestRefundSchema = z.object({
  invoiceId: z.string().uuid(),
  amount: z.number().positive(),
  reason: z.string().min(1),
});
export type RequestRefund = z.infer<typeof RequestRefundSchema>;
