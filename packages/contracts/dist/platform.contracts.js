import { z } from 'zod';
export const ProvisionTenantRequestSchema = z.object({
    name: z.string().min(1),
    subdomain: z.string().min(2).max(50),
    ownerEmail: z.string().email(),
    ownerFirstName: z.string().min(1),
    ownerLastName: z.string().min(1),
    ownerPhone: z.string().min(8),
    planId: z.string().uuid(),
    customDomain: z.string().optional(),
});
