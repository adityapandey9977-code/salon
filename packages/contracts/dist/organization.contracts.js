import { z } from 'zod';
export const TenantStatusEnum = z.enum(['ACTIVE', 'SUSPENDED', 'PAST_DUE', 'ARCHIVED']);
export const CreateTenantRequestSchema = z.object({
    code: z.string().optional(),
    slug: z.string().optional(),
    salonName: z.string().optional(),
    name: z.string().optional(),
    legalName: z.string().optional(),
    tradeName: z.string().optional(),
    displayName: z.string().optional(),
    businessEmail: z.string().email().optional(),
    ownerEmail: z.string().email().optional(),
    contactEmail: z.string().email().optional(),
    businessPhone: z.string().optional(),
    ownerPhone: z.string().optional(),
    contactPhone: z.string().optional(),
    ownerName: z.string().optional(),
    gstin: z.string().optional(),
    pan: z.string().optional(),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    region: z.string().optional(),
    postalCode: z.string().optional(),
    country: z.string().default('IN').optional(),
    defaultCurrency: z.string().default('INR').optional(),
    timezone: z.string().default('Asia/Kolkata').optional(),
    activePlans: z.string().optional(),
    branchesCount: z.number().optional(),
    branchesList: z.array(z.string()).optional(),
    customDomain: z.string().optional(),
    primaryColor: z.string().optional(),
    status: z.string().optional(),
    initialPassword: z.string().optional(),
    password: z.string().optional(),
});
export const TenantResponseSchema = z.object({
    id: z.string(),
    code: z.string().nullable().optional(),
    slug: z.string().nullable().optional(),
    salonName: z.string().nullable().optional(),
    name: z.string().nullable().optional(),
    legalName: z.string().nullable().optional(),
    tradeName: z.string().nullable().optional(),
    displayName: z.string().nullable().optional(),
    businessEmail: z.string().nullable().optional(),
    businessPhone: z.string().nullable().optional(),
    ownerName: z.string().nullable().optional(),
    ownerEmail: z.string().nullable().optional(),
    ownerPhone: z.string().nullable().optional(),
    contactEmail: z.string().nullable().optional(),
    contactPhone: z.string().nullable().optional(),
    city: z.string().nullable().optional(),
    state: z.string().nullable().optional(),
    region: z.string().nullable().optional(),
    activePlans: z.string().nullable().optional(),
    revenue: z.string().nullable().optional(),
    branchesCount: z.number().optional(),
    branchesList: z.array(z.string()).optional(),
    customDomain: z.string().nullable().optional(),
    primaryColor: z.string().nullable().optional(),
    gstin: z.string().nullable().optional(),
    pan: z.string().nullable().optional(),
    addressLine1: z.string().nullable().optional(),
    addressLine2: z.string().nullable().optional(),
    postalCode: z.string().nullable().optional(),
    country: z.string().optional(),
    status: z.string().optional(),
    initialPassword: z.string().nullable().optional(),
    password: z.string().nullable().optional(),
    defaultCurrency: z.string().optional(),
    currency: z.string().optional(),
    timezone: z.string().optional(),
    createdAt: z.string().or(z.date()).optional(),
    updatedAt: z.string().or(z.date()).optional(),
});
export const CreateBranchRequestSchema = z.preprocess((val) => {
    if (!val || typeof val !== 'object')
        return val;
    const raw = { ...val };
    const isUuid = (str) => typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    if (!raw.franchiseId && raw.franchisePartnerId) {
        raw.franchiseId = raw.franchisePartnerId;
    }
    if (!isUuid(raw.franchiseId)) {
        delete raw.franchiseId;
    }
    if (!isUuid(raw.primaryManagerEmployeeId)) {
        delete raw.primaryManagerEmployeeId;
    }
    if (raw.email === '' || (typeof raw.email === 'string' && !raw.email.includes('@'))) {
        delete raw.email;
    }
    if (!raw.code) {
        raw.code = `BR-${Math.floor(1000 + Math.random() * 9000)}`;
    }
    else if (typeof raw.code === 'string') {
        raw.code = raw.code.trim().replace(/[^A-Za-z0-9-]/g, '').slice(0, 10).toUpperCase();
        if (raw.code.length < 2) {
            raw.code = `BR-${Math.floor(1000 + Math.random() * 9000)}`;
        }
    }
    return raw;
}, z.object({
    name: z.string().min(1),
    code: z.string().min(2).max(10),
    franchiseId: z.string().uuid().optional(),
    franchisePartnerId: z.string().optional(),
    franchisePartnerName: z.string().optional(),
    addressLine1: z.string().min(1),
    addressLine2: z.string().optional(),
    city: z.string().min(1),
    state: z.string().min(1),
    postalCode: z.string().min(1),
    phone: z.string().min(8),
    email: z.string().email().optional(),
    gstin: z.string().optional(),
    primaryManagerEmployeeId: z.string().uuid().nullable().optional(),
}));
export const CreateResourceRequestSchema = z.object({
    branchId: z.string().uuid(),
    name: z.string().min(1),
    code: z.string().optional(),
    type: z.enum(['ROOM', 'CHAIR', 'EQUIPMENT', 'OTHER']),
    capacity: z.number().int().positive().default(1),
    description: z.string().optional(),
    isAvailable: z.boolean().optional(),
});
export const UpdateResourceRequestSchema = CreateResourceRequestSchema.partial().extend({
    isActive: z.boolean().optional(),
    isAvailable: z.boolean().optional(),
});
