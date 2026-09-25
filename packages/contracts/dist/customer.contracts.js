import { z } from 'zod';
export const CustomerStatusEnum = z.enum(['ACTIVE', 'INACTIVE', 'DORMANT', 'BLOCKED', 'ARCHIVED']);
export const CustomerSourceEnum = z.enum([
    'WALK_IN',
    'ONLINE',
    'CALL_CENTER',
    'REFERRAL',
    'SOCIAL',
    'CAMPAIGN',
    'OTHER',
]);
export const GenderEnum = z.enum(['MALE', 'FEMALE', 'OTHER', 'UNSPECIFIED']);
export const CautionSeverityEnum = z.enum(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']);
export const LeadStatusEnum = z.enum(['NEW', 'CONTACTED', 'QUALIFIED', 'BOOKING_PENDING', 'CONVERTED', 'LOST']);
// Customer Request Schemas
export const CreateCustomerRequestSchema = z
    .object({
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().optional().nullable(),
    displayName: z.string().optional().nullable(),
    mobilePhone: z.string().min(8, 'Mobile phone is required'),
    email: z
        .string()
        .email()
        .or(z.literal(''))
        .optional()
        .nullable(),
    alternatePhone: z.string().optional().nullable(),
    avatarUrl: z.string().optional().nullable(),
    gender: z
        .preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), GenderEnum.or(z.string()))
        .optional()
        .default('UNSPECIFIED'),
    dateOfBirth: z.string().optional().nullable(),
    status: z
        .preprocess((val) => (typeof val === 'string' ? val.toUpperCase() : val), CustomerStatusEnum.or(z.string()))
        .optional()
        .default('ACTIVE'),
    preferredBranchId: z.string().uuid().or(z.literal('')).optional().nullable(),
    franchiseId: z.string().uuid().or(z.literal('')).optional().nullable(),
    source: z.union([CustomerSourceEnum, z.string()]).optional().default('WALK_IN'),
    notes: z.string().max(2000).optional().nullable(),
    segment: z.string().optional().nullable(),
    address: z
        .object({
        type: z.enum(['HOME', 'WORK', 'BILLING', 'OTHER']).default('HOME'),
        addressLine1: z.string().optional().nullable(),
        addressLine2: z.string().optional().nullable(),
        city: z.string().optional().nullable(),
        state: z.string().optional().nullable(),
        postalCode: z.string().optional().nullable(),
        country: z.string().default('IN'),
        isDefault: z.boolean().default(true),
    })
        .optional(),
    preferences: z
        .object({
        preferredStaffId: z.string().uuid().optional().nullable(),
        preferredCommunicationChannel: z.string().default('WHATSAPP'),
        language: z.string().default('en'),
        appointmentReminderEnabled: z.boolean().default(true),
        marketingConsent: z.boolean().default(true),
    })
        .optional(),
    cautions: z
        .array(z.object({
        type: z.enum(['ALLERGY', 'SKIN_SENSITIVITY', 'HAIR_CHEMICAL_HISTORY', 'MEDICAL_CAUTION', 'SERVICE_RESTRICTION', 'OTHER']),
        title: z.string().min(1),
        description: z.string().optional().nullable(),
        severity: CautionSeverityEnum.default('MEDIUM'),
    }))
        .optional(),
    tags: z.array(z.string()).optional(),
})
    .passthrough();
export const UpdateCustomerRequestSchema = CreateCustomerRequestSchema.partial().passthrough();
export const QueryCustomersRequestSchema = z.object({
    search: z.string().optional(),
    mobilePhone: z.string().optional(),
    email: z.string().optional(),
    status: CustomerStatusEnum.optional(),
    branchId: z.string().uuid().optional(),
    franchiseId: z.string().uuid().optional(),
    hasFranchise: z.preprocess((val) => val === 'true' || val === true, z.boolean()).optional(),
    source: CustomerSourceEnum.optional(),
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().positive().max(100).default(20),
    sortBy: z.enum(['createdAt', 'displayName', 'totalVisits', 'lastVisitAt']).default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).default('desc'),
});
// Notes
export const CreateCustomerNoteRequestSchema = z.object({
    noteType: z.enum(['GENERAL', 'PREFERENCE', 'FEEDBACK', 'COMPLAINT', 'BILLING']).default('GENERAL'),
    content: z.string().min(1).max(2000),
    isPinned: z.boolean().default(false),
});
// Cautions
export const CreateCustomerCautionRequestSchema = z.object({
    type: z.enum(['ALLERGY', 'SKIN_SENSITIVITY', 'HAIR_CHEMICAL_HISTORY', 'MEDICAL_CAUTION', 'SERVICE_RESTRICTION', 'OTHER']),
    title: z.string().min(1),
    description: z.string().optional().nullable(),
    severity: CautionSeverityEnum.default('MEDIUM'),
    active: z.boolean().default(true),
});
export const UpdateCustomerCautionRequestSchema = CreateCustomerCautionRequestSchema.partial();
// Leads
export const CreateLeadRequestSchema = z.object({
    firstName: z.string().min(1),
    lastName: z.string().optional().nullable(),
    mobilePhone: z.string().min(8),
    email: z.string().email().optional().nullable(),
    source: CustomerSourceEnum.default('WALK_IN'),
    preferredBranchId: z.string().uuid().optional().nullable(),
    interestedServiceId: z.string().uuid().optional().nullable(),
    assignedIdentityUserId: z.string().uuid().optional().nullable(),
    inquiryNotes: z.string().optional().nullable(),
});
export const UpdateLeadStatusRequestSchema = z.object({
    status: LeadStatusEnum,
    notes: z.string().optional().nullable(),
});
export const ConvertLeadRequestSchema = z.object({
    notes: z.string().optional().nullable(),
    preferredBranchId: z.string().uuid().optional().nullable(),
});
// Customer Segments
export const CreateCustomerSegmentRequestSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional().nullable(),
    segmentType: z.enum(['STATIC', 'DYNAMIC', 'RETENTION', 'SPEND_TIER', 'VISIT_FREQUENCY']).default('STATIC'),
    isDynamic: z.boolean().default(false),
    criteriaJson: z.record(z.unknown()).optional().nullable(),
});
// Response DTO Schemas
export const CustomerSummaryResponseSchema = z.object({
    id: z.string().uuid(),
    tenantId: z.string().uuid(),
    customerCode: z.string(),
    firstName: z.string(),
    lastName: z.string().nullable(),
    displayName: z.string(),
    mobilePhone: z.string(),
    email: z.string().nullable(),
    gender: GenderEnum,
    status: CustomerStatusEnum,
    preferredBranchId: z.string().uuid().nullable(),
    totalVisits: z.number().int().nonnegative(),
    totalSpent: z.number().nonnegative(),
    lastVisitAt: z.string().nullable(),
    firstVisitAt: z.string().nullable(),
    createdAt: z.string(),
});
