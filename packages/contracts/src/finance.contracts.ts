import { z } from 'zod';

export const CalculateCommissionRequestSchema = z.object({
  branchId: z.string().uuid(),
  staffId: z.string().uuid(),
  invoiceId: z.string().uuid(),
  serviceAmount: z.number().nonnegative(),
  productAmount: z.number().nonnegative(),
});

export type CalculateCommissionRequest = z.infer<typeof CalculateCommissionRequestSchema>;

export const FranchiseSettlementSummarySchema = z.object({
  franchiseId: z.string().uuid(),
  periodStart: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  periodEnd: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  totalGrossRevenue: z.number().nonnegative(),
  royaltyPercentage: z.number().nonnegative(),
  totalRoyaltyDue: z.number().nonnegative(),
  marketingFeeDue: z.number().nonnegative().default(0),
  netPayableToPlatform: z.number().nonnegative(),
});

export type FranchiseSettlementSummary = z.infer<typeof FranchiseSettlementSummarySchema>;
