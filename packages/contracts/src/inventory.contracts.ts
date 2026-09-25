import { z } from 'zod';

export const CreateSkuRequestSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1),
  barcode: z.string().optional(),
  category: z.string(),
  unit: z.string().default('PIECES'),
  costPrice: z.number().nonnegative(),
  retailPrice: z.number().nonnegative(),
  reorderLevel: z.number().int().nonnegative().default(5),
  isRetail: z.boolean().default(true),
  isConsumable: z.boolean().default(true),
});

export type CreateSkuRequest = z.infer<typeof CreateSkuRequestSchema>;

export const StockAdjustmentRequestSchema = z.object({
  branchId: z.string().uuid(),
  skuId: z.string().uuid(),
  quantityDelta: z.number().int(),
  reason: z.string().min(1),
  batchNumber: z.string().optional(),
});

export type StockAdjustmentRequest = z.infer<typeof StockAdjustmentRequestSchema>;
