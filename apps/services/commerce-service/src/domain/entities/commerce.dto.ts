import type { InvoiceStatus, ItemType } from '../../infrastructure/prisma/generated-client';

export interface ServiceCategoryDto {
  id: string;
  tenantId: string;
  name: string;
  code: string;
  description: string | null;
  sortOrder: number;
  imageUrl?: string | null;
  accentColor?: string | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CachedServiceMaster {
  id: string;
  tenantId: string;
  categoryId: string;
  code: string;
  name: string;
  description: string | null;
  durationMinutes: number;
  bufferBeforeMinutes: number;
  bufferAfterMinutes: number;
  basePrice: number;
  gstRate: number;
  taxCode: string | null;
  sacCode: string | null;
  requiresConsultation: boolean;
  requiresPatchTest: boolean;
  isActive: boolean;
  isBookableOnline: boolean;
  imageUrl?: string | null;
  requiredSkill?: string | null;
  requiredLevel?: string | null;
  requiredRoomOrChair?: string | null;
  requiredEquipment?: string | null;
  pricingMode?: string | null;
  discountEligible?: boolean;
  availableBranches?: string[];
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  branchPrices?: Array<{
    branchId: string;
    price: number;
    isActive: boolean;
  }>;
}

export interface PackageItemDto {
  serviceId: string;
  includedQuantity: number;
}

export interface PackageMasterDto {
  id: string;
  tenantId: string;
  code: string;
  name: string;
  description?: string | null;
  price: number;
  validityDays: number;
  isShared: boolean;
  isActive: boolean;
  durationMins?: number | null;
  salesCount: number;
  imageUrl?: string | null;
  includedServicesText?: string | null;
  createdAt: Date;
  updatedAt: Date;
  items?: PackageItemDto[];
}

export interface MembershipMasterDto {
  id: string;
  tenantId: string;
  name: string;
  description?: string | null;
  price: number;
  billingPeriod: string;
  discountPercentage: number;
  benefitsJson?: any | null;
  isActive: boolean;
  pointsMultiplier?: number | null;
  membersCount: number;
  perksText?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface InvoiceDto {
  id: string;
  tenantId: string;
  branchId: string;
  customerId: string | null;
  appointmentId: string | null;
  invoiceNumber: string;
  subtotal: number;
  discountTotal: number;
  taxTotal: number;
  grandTotal: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  issuedAt: string;
  createdAt: string;
  items: Array<{
    id: string;
    itemType: ItemType;
    itemId: string;
    skuId: string | null;
    staffId: string | null;
    description: string | null;
    quantity: number;
    unitPrice: number;
    discountAmount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
  }>;
}
