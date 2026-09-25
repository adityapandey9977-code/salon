import { z } from 'zod';
export declare const CalculateCommissionRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    staffId: z.ZodString;
    invoiceId: z.ZodString;
    serviceAmount: z.ZodNumber;
    productAmount: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    branchId: string;
    staffId: string;
    invoiceId: string;
    serviceAmount: number;
    productAmount: number;
}, {
    branchId: string;
    staffId: string;
    invoiceId: string;
    serviceAmount: number;
    productAmount: number;
}>;
export type CalculateCommissionRequest = z.infer<typeof CalculateCommissionRequestSchema>;
export declare const FranchiseSettlementSummarySchema: z.ZodObject<{
    franchiseId: z.ZodString;
    periodStart: z.ZodString;
    periodEnd: z.ZodString;
    totalGrossRevenue: z.ZodNumber;
    royaltyPercentage: z.ZodNumber;
    totalRoyaltyDue: z.ZodNumber;
    marketingFeeDue: z.ZodDefault<z.ZodNumber>;
    netPayableToPlatform: z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    franchiseId: string;
    periodStart: string;
    periodEnd: string;
    totalGrossRevenue: number;
    royaltyPercentage: number;
    totalRoyaltyDue: number;
    marketingFeeDue: number;
    netPayableToPlatform: number;
}, {
    franchiseId: string;
    periodStart: string;
    periodEnd: string;
    totalGrossRevenue: number;
    royaltyPercentage: number;
    totalRoyaltyDue: number;
    netPayableToPlatform: number;
    marketingFeeDue?: number | undefined;
}>;
export type FranchiseSettlementSummary = z.infer<typeof FranchiseSettlementSummarySchema>;
//# sourceMappingURL=finance.contracts.d.ts.map