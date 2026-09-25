import { z } from 'zod';
export declare const ItemTypeEnum: z.ZodEnum<["SERVICE", "PRODUCT", "PACKAGE", "MEMBERSHIP"]>;
export type ItemType = z.infer<typeof ItemTypeEnum>;
export declare const InvoiceStatusEnum: z.ZodEnum<["DRAFT", "PENDING_PAYMENT", "PARTIALLY_PAID", "PAID", "CANCELLED", "REFUNDED", "PARTIALLY_REFUNDED"]>;
export type InvoiceStatus = z.infer<typeof InvoiceStatusEnum>;
export declare const CreateServiceCategoryRequestSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sortOrder: z.ZodDefault<z.ZodNumber>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    accentColor: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    sortOrder: number;
    isActive: boolean;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    accentColor?: string | null | undefined;
}, {
    code: string;
    name: string;
    description?: string | null | undefined;
    sortOrder?: number | undefined;
    imageUrl?: string | null | undefined;
    accentColor?: string | null | undefined;
    isActive?: boolean | undefined;
}>;
export type CreateServiceCategoryRequest = z.infer<typeof CreateServiceCategoryRequestSchema>;
export declare const UpdateServiceCategoryRequestSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    sortOrder: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    accentColor: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    sortOrder?: number | undefined;
    imageUrl?: string | null | undefined;
    accentColor?: string | null | undefined;
    isActive?: boolean | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    sortOrder?: number | undefined;
    imageUrl?: string | null | undefined;
    accentColor?: string | null | undefined;
    isActive?: boolean | undefined;
}>;
export type UpdateServiceCategoryRequest = z.infer<typeof UpdateServiceCategoryRequestSchema>;
export declare const CreateServiceRequestSchema: z.ZodObject<{
    categoryId: z.ZodString;
    code: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    durationMinutes: z.ZodNumber;
    bufferBeforeMinutes: z.ZodDefault<z.ZodNumber>;
    bufferAfterMinutes: z.ZodDefault<z.ZodNumber>;
    basePrice: z.ZodNumber;
    gstRate: z.ZodDefault<z.ZodNumber>;
    taxCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    sacCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    requiresConsultation: z.ZodDefault<z.ZodBoolean>;
    requiresPatchTest: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    isBookableOnline: z.ZodDefault<z.ZodBoolean>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    requiredSkill: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    requiredLevel: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    requiredRoomOrChair: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    requiredEquipment: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    pricingMode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    discountEligible: z.ZodDefault<z.ZodBoolean>;
    availableBranches: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>;
    metadata: z.ZodNullable<z.ZodOptional<z.ZodAny>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    durationMinutes: number;
    isActive: boolean;
    categoryId: string;
    bufferBeforeMinutes: number;
    bufferAfterMinutes: number;
    basePrice: number;
    gstRate: number;
    requiresConsultation: boolean;
    requiresPatchTest: boolean;
    isBookableOnline: boolean;
    discountEligible: boolean;
    availableBranches: string[];
    description?: string | null | undefined;
    metadata?: any;
    imageUrl?: string | null | undefined;
    taxCode?: string | null | undefined;
    sacCode?: string | null | undefined;
    requiredSkill?: string | null | undefined;
    requiredLevel?: string | null | undefined;
    requiredRoomOrChair?: string | null | undefined;
    requiredEquipment?: string | null | undefined;
    pricingMode?: string | null | undefined;
}, {
    code: string;
    name: string;
    durationMinutes: number;
    categoryId: string;
    basePrice: number;
    description?: string | null | undefined;
    metadata?: any;
    imageUrl?: string | null | undefined;
    isActive?: boolean | undefined;
    bufferBeforeMinutes?: number | undefined;
    bufferAfterMinutes?: number | undefined;
    gstRate?: number | undefined;
    taxCode?: string | null | undefined;
    sacCode?: string | null | undefined;
    requiresConsultation?: boolean | undefined;
    requiresPatchTest?: boolean | undefined;
    isBookableOnline?: boolean | undefined;
    requiredSkill?: string | null | undefined;
    requiredLevel?: string | null | undefined;
    requiredRoomOrChair?: string | null | undefined;
    requiredEquipment?: string | null | undefined;
    pricingMode?: string | null | undefined;
    discountEligible?: boolean | undefined;
    availableBranches?: string[] | undefined;
}>;
export type CreateServiceRequest = z.infer<typeof CreateServiceRequestSchema>;
export declare const UpdateServiceRequestSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    durationMinutes: z.ZodOptional<z.ZodNumber>;
    bufferBeforeMinutes: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    bufferAfterMinutes: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    basePrice: z.ZodOptional<z.ZodNumber>;
    gstRate: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    taxCode: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    sacCode: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    requiresConsultation: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    requiresPatchTest: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isBookableOnline: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    requiredSkill: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    requiredLevel: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    requiredRoomOrChair: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    requiredEquipment: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    pricingMode: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    discountEligible: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    availableBranches: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodString, "many">>>>;
    metadata: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodAny>>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    durationMinutes?: number | undefined;
    metadata?: any;
    imageUrl?: string | null | undefined;
    isActive?: boolean | undefined;
    categoryId?: string | undefined;
    bufferBeforeMinutes?: number | undefined;
    bufferAfterMinutes?: number | undefined;
    basePrice?: number | undefined;
    gstRate?: number | undefined;
    taxCode?: string | null | undefined;
    sacCode?: string | null | undefined;
    requiresConsultation?: boolean | undefined;
    requiresPatchTest?: boolean | undefined;
    isBookableOnline?: boolean | undefined;
    requiredSkill?: string | null | undefined;
    requiredLevel?: string | null | undefined;
    requiredRoomOrChair?: string | null | undefined;
    requiredEquipment?: string | null | undefined;
    pricingMode?: string | null | undefined;
    discountEligible?: boolean | undefined;
    availableBranches?: string[] | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    durationMinutes?: number | undefined;
    metadata?: any;
    imageUrl?: string | null | undefined;
    isActive?: boolean | undefined;
    categoryId?: string | undefined;
    bufferBeforeMinutes?: number | undefined;
    bufferAfterMinutes?: number | undefined;
    basePrice?: number | undefined;
    gstRate?: number | undefined;
    taxCode?: string | null | undefined;
    sacCode?: string | null | undefined;
    requiresConsultation?: boolean | undefined;
    requiresPatchTest?: boolean | undefined;
    isBookableOnline?: boolean | undefined;
    requiredSkill?: string | null | undefined;
    requiredLevel?: string | null | undefined;
    requiredRoomOrChair?: string | null | undefined;
    requiredEquipment?: string | null | undefined;
    pricingMode?: string | null | undefined;
    discountEligible?: boolean | undefined;
    availableBranches?: string[] | undefined;
}>;
export type UpdateServiceRequest = z.infer<typeof UpdateServiceRequestSchema>;
export declare const QueryServicesRequestSchema: z.ZodObject<{
    categoryId: z.ZodOptional<z.ZodString>;
    branchId: z.ZodOptional<z.ZodString>;
    search: z.ZodOptional<z.ZodString>;
    isActive: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    isBookableOnline: z.ZodOptional<z.ZodEnum<["true", "false"]>>;
    page: z.ZodDefault<z.ZodNumber>;
    limit: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    page: number;
    limit: number;
    branchId?: string | undefined;
    isActive?: "true" | "false" | undefined;
    categoryId?: string | undefined;
    isBookableOnline?: "true" | "false" | undefined;
    search?: string | undefined;
}, {
    branchId?: string | undefined;
    page?: number | undefined;
    limit?: number | undefined;
    isActive?: "true" | "false" | undefined;
    categoryId?: string | undefined;
    isBookableOnline?: "true" | "false" | undefined;
    search?: string | undefined;
}>;
export type QueryServicesRequest = z.infer<typeof QueryServicesRequestSchema>;
export declare const SetBranchPriceRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    price: z.ZodNumber;
    effectiveFrom: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    effectiveTo: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    branchId: string;
    price: number;
    isActive: boolean;
    effectiveFrom?: string | null | undefined;
    effectiveTo?: string | null | undefined;
}, {
    branchId: string;
    price: number;
    isActive?: boolean | undefined;
    effectiveFrom?: string | null | undefined;
    effectiveTo?: string | null | undefined;
}>;
export type SetBranchPriceRequest = z.infer<typeof SetBranchPriceRequestSchema>;
export declare const CreateServiceRecipeRequestSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    version: z.ZodDefault<z.ZodNumber>;
    items: z.ZodArray<z.ZodObject<{
        skuId: z.ZodString;
        quantityRequired: z.ZodNumber;
        unit: z.ZodDefault<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        skuId: string;
        quantityRequired: number;
        unit: string;
    }, {
        skuId: string;
        quantityRequired: number;
        unit?: string | undefined;
    }>, "many">;
}, "strip", z.ZodTypeAny, {
    items: {
        skuId: string;
        quantityRequired: number;
        unit: string;
    }[];
    version: number;
    name?: string | undefined;
    description?: string | null | undefined;
}, {
    items: {
        skuId: string;
        quantityRequired: number;
        unit?: string | undefined;
    }[];
    name?: string | undefined;
    description?: string | null | undefined;
    version?: number | undefined;
}>;
export type CreateServiceRecipeRequest = z.infer<typeof CreateServiceRecipeRequestSchema>;
export declare const CreatePackageRequestSchema: z.ZodObject<{
    code: z.ZodString;
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    price: z.ZodNumber;
    validityDays: z.ZodDefault<z.ZodNumber>;
    isShared: z.ZodDefault<z.ZodBoolean>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    durationMins: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    salesCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    imageUrl: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    includedServicesText: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        serviceId: z.ZodString;
        includedQuantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        serviceId: string;
        includedQuantity: number;
    }, {
        serviceId: string;
        includedQuantity: number;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    price: number;
    items: {
        serviceId: string;
        includedQuantity: number;
    }[];
    isActive: boolean;
    validityDays: number;
    isShared: boolean;
    salesCount: number;
    description?: string | null | undefined;
    imageUrl?: string | null | undefined;
    durationMins?: number | null | undefined;
    includedServicesText?: string | null | undefined;
}, {
    code: string;
    name: string;
    price: number;
    description?: string | null | undefined;
    items?: {
        serviceId: string;
        includedQuantity: number;
    }[] | undefined;
    imageUrl?: string | null | undefined;
    isActive?: boolean | undefined;
    validityDays?: number | undefined;
    isShared?: boolean | undefined;
    durationMins?: number | null | undefined;
    salesCount?: number | undefined;
    includedServicesText?: string | null | undefined;
}>;
export type CreatePackageRequest = z.infer<typeof CreatePackageRequestSchema>;
export declare const UpdatePackageRequestSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodString>;
    name: z.ZodOptional<z.ZodString>;
    description: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    price: z.ZodOptional<z.ZodNumber>;
    validityDays: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isShared: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    isActive: z.ZodOptional<z.ZodDefault<z.ZodBoolean>>;
    durationMins: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodNumber>>>;
    salesCount: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodNumber>>>;
    imageUrl: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    includedServicesText: z.ZodOptional<z.ZodNullable<z.ZodOptional<z.ZodString>>>;
    items: z.ZodOptional<z.ZodDefault<z.ZodOptional<z.ZodArray<z.ZodObject<{
        serviceId: z.ZodString;
        includedQuantity: z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        serviceId: string;
        includedQuantity: number;
    }, {
        serviceId: string;
        includedQuantity: number;
    }>, "many">>>>;
}, "strip", z.ZodTypeAny, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    price?: number | undefined;
    items?: {
        serviceId: string;
        includedQuantity: number;
    }[] | undefined;
    imageUrl?: string | null | undefined;
    isActive?: boolean | undefined;
    validityDays?: number | undefined;
    isShared?: boolean | undefined;
    durationMins?: number | null | undefined;
    salesCount?: number | undefined;
    includedServicesText?: string | null | undefined;
}, {
    code?: string | undefined;
    name?: string | undefined;
    description?: string | null | undefined;
    price?: number | undefined;
    items?: {
        serviceId: string;
        includedQuantity: number;
    }[] | undefined;
    imageUrl?: string | null | undefined;
    isActive?: boolean | undefined;
    validityDays?: number | undefined;
    isShared?: boolean | undefined;
    durationMins?: number | null | undefined;
    salesCount?: number | undefined;
    includedServicesText?: string | null | undefined;
}>;
export type UpdatePackageRequest = z.infer<typeof UpdatePackageRequestSchema>;
export declare const CreateMembershipRequestSchema: z.ZodObject<{
    name: z.ZodString;
    description: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    price: z.ZodNumber;
    billingPeriod: z.ZodDefault<z.ZodEnum<["MONTHLY", "QUARTERLY", "HALF_YEARLY", "ANNUAL"]>>;
    discountPercentage: z.ZodDefault<z.ZodNumber>;
    benefitsJson: z.ZodNullable<z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    pointsMultiplier: z.ZodNullable<z.ZodOptional<z.ZodNumber>>;
    membersCount: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    perksText: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    name: string;
    price: number;
    isActive: boolean;
    billingPeriod: "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "ANNUAL";
    discountPercentage: number;
    membersCount: number;
    description?: string | null | undefined;
    benefitsJson?: Record<string, unknown> | null | undefined;
    pointsMultiplier?: number | null | undefined;
    perksText?: string | null | undefined;
}, {
    name: string;
    price: number;
    description?: string | null | undefined;
    isActive?: boolean | undefined;
    billingPeriod?: "MONTHLY" | "QUARTERLY" | "HALF_YEARLY" | "ANNUAL" | undefined;
    discountPercentage?: number | undefined;
    benefitsJson?: Record<string, unknown> | null | undefined;
    pointsMultiplier?: number | null | undefined;
    membersCount?: number | undefined;
    perksText?: string | null | undefined;
}>;
export type CreateMembershipRequest = z.infer<typeof CreateMembershipRequestSchema>;
export declare const RedeemPackageRequestSchema: z.ZodObject<{
    customerPackageId: z.ZodString;
    serviceId: z.ZodString;
    appointmentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    quantity: z.ZodDefault<z.ZodNumber>;
    clientName: z.ZodOptional<z.ZodString>;
    branchName: z.ZodOptional<z.ZodString>;
    staffName: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    serviceId: string;
    customerPackageId: string;
    quantity: number;
    appointmentId?: string | null | undefined;
    clientName?: string | undefined;
    branchName?: string | undefined;
    staffName?: string | undefined;
}, {
    serviceId: string;
    customerPackageId: string;
    appointmentId?: string | null | undefined;
    quantity?: number | undefined;
    clientName?: string | undefined;
    branchName?: string | undefined;
    staffName?: string | undefined;
}>;
export type RedeemPackageRequest = z.infer<typeof RedeemPackageRequestSchema>;
export declare const CreateMembershipBenefitSchema: z.ZodObject<{
    membershipPlanId: z.ZodOptional<z.ZodString>;
    perkName: z.ZodString;
    category: z.ZodDefault<z.ZodString>;
    discountValue: z.ZodString;
    applicableScope: z.ZodDefault<z.ZodString>;
    usageLimit: z.ZodDefault<z.ZodString>;
    status: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    status: string;
    perkName: string;
    category: string;
    discountValue: string;
    applicableScope: string;
    usageLimit: string;
    membershipPlanId?: string | undefined;
}, {
    perkName: string;
    discountValue: string;
    status?: string | undefined;
    membershipPlanId?: string | undefined;
    category?: string | undefined;
    applicableScope?: string | undefined;
    usageLimit?: string | undefined;
}>;
export type CreateMembershipBenefit = z.infer<typeof CreateMembershipBenefitSchema>;
export declare const RenewMembershipRequestSchema: z.ZodObject<{
    customerMembershipId: z.ZodString;
    renewalMonths: z.ZodDefault<z.ZodNumber>;
    paymentMethod: z.ZodDefault<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    customerMembershipId: string;
    renewalMonths: number;
    paymentMethod: string;
}, {
    customerMembershipId: string;
    renewalMonths?: number | undefined;
    paymentMethod?: string | undefined;
}>;
export type RenewMembershipRequest = z.infer<typeof RenewMembershipRequestSchema>;
export declare const WalletTopupRequestSchema: z.ZodObject<{
    customerId: z.ZodString;
    amount: z.ZodNumber;
    notes: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    amount: number;
    notes?: string | null | undefined;
}, {
    customerId: string;
    amount: number;
    notes?: string | null | undefined;
}>;
export type WalletTopupRequest = z.infer<typeof WalletTopupRequestSchema>;
export declare const LoyaltyRedeemRequestSchema: z.ZodObject<{
    customerId: z.ZodString;
    pointsToRedeem: z.ZodNumber;
    invoiceId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    customerId: string;
    pointsToRedeem: number;
    invoiceId?: string | null | undefined;
}, {
    customerId: string;
    pointsToRedeem: number;
    invoiceId?: string | null | undefined;
}>;
export type LoyaltyRedeemRequest = z.infer<typeof LoyaltyRedeemRequestSchema>;
export declare const POSCartItemSchema: z.ZodObject<{
    itemType: z.ZodEnum<["SERVICE", "PRODUCT", "PACKAGE", "MEMBERSHIP"]>;
    itemId: z.ZodString;
    skuId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    staffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    description: z.ZodOptional<z.ZodString>;
    quantity: z.ZodDefault<z.ZodNumber>;
    unitPrice: z.ZodNumber;
    discountAmount: z.ZodDefault<z.ZodNumber>;
}, "strip", z.ZodTypeAny, {
    quantity: number;
    itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
    itemId: string;
    unitPrice: number;
    discountAmount: number;
    description?: string | undefined;
    staffId?: string | null | undefined;
    skuId?: string | null | undefined;
}, {
    itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
    itemId: string;
    unitPrice: number;
    description?: string | undefined;
    staffId?: string | null | undefined;
    skuId?: string | null | undefined;
    quantity?: number | undefined;
    discountAmount?: number | undefined;
}>;
export type POSCartItem = z.infer<typeof POSCartItemSchema>;
export declare const CheckoutCartRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    customerId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    appointmentId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    items: z.ZodArray<z.ZodObject<{
        itemType: z.ZodEnum<["SERVICE", "PRODUCT", "PACKAGE", "MEMBERSHIP"]>;
        itemId: z.ZodString;
        skuId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        staffId: z.ZodNullable<z.ZodOptional<z.ZodString>>;
        description: z.ZodOptional<z.ZodString>;
        quantity: z.ZodDefault<z.ZodNumber>;
        unitPrice: z.ZodNumber;
        discountAmount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
        itemId: string;
        unitPrice: number;
        discountAmount: number;
        description?: string | undefined;
        staffId?: string | null | undefined;
        skuId?: string | null | undefined;
    }, {
        itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
        itemId: string;
        unitPrice: number;
        description?: string | undefined;
        staffId?: string | null | undefined;
        skuId?: string | null | undefined;
        quantity?: number | undefined;
        discountAmount?: number | undefined;
    }>, "many">;
    couponCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
    walletAmountToRedeem: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    loyaltyPointsToRedeem: z.ZodDefault<z.ZodOptional<z.ZodNumber>>;
    paymentMethod: z.ZodDefault<z.ZodEnum<["CASH", "CARD", "UPI", "PAYMENT_LINK", "WALLET", "NET_BANKING", "OTHER"]>>;
}, "strip", z.ZodTypeAny, {
    branchId: string;
    items: {
        quantity: number;
        itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
        itemId: string;
        unitPrice: number;
        discountAmount: number;
        description?: string | undefined;
        staffId?: string | null | undefined;
        skuId?: string | null | undefined;
    }[];
    paymentMethod: "OTHER" | "CASH" | "UPI" | "WALLET" | "CARD" | "PAYMENT_LINK" | "NET_BANKING";
    walletAmountToRedeem: number;
    loyaltyPointsToRedeem: number;
    customerId?: string | null | undefined;
    appointmentId?: string | null | undefined;
    couponCode?: string | null | undefined;
}, {
    branchId: string;
    items: {
        itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
        itemId: string;
        unitPrice: number;
        description?: string | undefined;
        staffId?: string | null | undefined;
        skuId?: string | null | undefined;
        quantity?: number | undefined;
        discountAmount?: number | undefined;
    }[];
    customerId?: string | null | undefined;
    appointmentId?: string | null | undefined;
    paymentMethod?: "OTHER" | "CASH" | "UPI" | "WALLET" | "CARD" | "PAYMENT_LINK" | "NET_BANKING" | undefined;
    couponCode?: string | null | undefined;
    walletAmountToRedeem?: number | undefined;
    loyaltyPointsToRedeem?: number | undefined;
}>;
export type CheckoutCartRequest = z.infer<typeof CheckoutCartRequestSchema>;
export declare const CalculateTaxRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    items: z.ZodArray<z.ZodObject<{
        itemType: z.ZodEnum<["SERVICE", "PRODUCT", "PACKAGE", "MEMBERSHIP"]>;
        itemId: z.ZodString;
        unitPrice: z.ZodNumber;
        quantity: z.ZodDefault<z.ZodNumber>;
        discountAmount: z.ZodDefault<z.ZodNumber>;
    }, "strip", z.ZodTypeAny, {
        quantity: number;
        itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
        itemId: string;
        unitPrice: number;
        discountAmount: number;
    }, {
        itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
        itemId: string;
        unitPrice: number;
        quantity?: number | undefined;
        discountAmount?: number | undefined;
    }>, "many">;
    couponCode: z.ZodNullable<z.ZodOptional<z.ZodString>>;
}, "strip", z.ZodTypeAny, {
    branchId: string;
    items: {
        quantity: number;
        itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
        itemId: string;
        unitPrice: number;
        discountAmount: number;
    }[];
    couponCode?: string | null | undefined;
}, {
    branchId: string;
    items: {
        itemType: "MEMBERSHIP" | "PACKAGE" | "SERVICE" | "PRODUCT";
        itemId: string;
        unitPrice: number;
        quantity?: number | undefined;
        discountAmount?: number | undefined;
    }[];
    couponCode?: string | null | undefined;
}>;
export type CalculateTaxRequest = z.infer<typeof CalculateTaxRequestSchema>;
export declare const RequestRefundSchema: z.ZodObject<{
    invoiceId: z.ZodString;
    amount: z.ZodNumber;
    reason: z.ZodString;
}, "strip", z.ZodTypeAny, {
    reason: string;
    amount: number;
    invoiceId: string;
}, {
    reason: string;
    amount: number;
    invoiceId: string;
}>;
export type RequestRefund = z.infer<typeof RequestRefundSchema>;
//# sourceMappingURL=commerce.contracts.d.ts.map