import { z } from 'zod';
export declare const ProvisionTenantRequestSchema: z.ZodObject<{
    name: z.ZodString;
    subdomain: z.ZodString;
    ownerEmail: z.ZodString;
    ownerFirstName: z.ZodString;
    ownerLastName: z.ZodString;
    ownerPhone: z.ZodString;
    planId: z.ZodString;
    customDomain: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    name: string;
    ownerEmail: string;
    ownerPhone: string;
    subdomain: string;
    ownerFirstName: string;
    ownerLastName: string;
    planId: string;
    customDomain?: string | undefined;
}, {
    name: string;
    ownerEmail: string;
    ownerPhone: string;
    subdomain: string;
    ownerFirstName: string;
    ownerLastName: string;
    planId: string;
    customDomain?: string | undefined;
}>;
export type ProvisionTenantRequest = z.infer<typeof ProvisionTenantRequestSchema>;
//# sourceMappingURL=platform.contracts.d.ts.map