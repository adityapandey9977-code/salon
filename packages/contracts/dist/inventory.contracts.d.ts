import { z } from 'zod';
export declare const CreateSkuRequestSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    barcode: z.ZodOptional<z.ZodString>;
    category: z.ZodString;
    unit: z.ZodDefault<z.ZodString>;
    costPrice: z.ZodNumber;
    retailPrice: z.ZodNumber;
    reorderLevel: z.ZodDefault<z.ZodNumber>;
    isRetail: z.ZodDefault<z.ZodBoolean>;
    isConsumable: z.ZodDefault<z.ZodBoolean>;
}, "strip", z.ZodTypeAny, {
    code: string;
    name: string;
    unit: string;
    category: string;
    costPrice: number;
    retailPrice: number;
    reorderLevel: number;
    isRetail: boolean;
    isConsumable: boolean;
    barcode?: string | undefined;
}, {
    code: string;
    name: string;
    category: string;
    costPrice: number;
    retailPrice: number;
    unit?: string | undefined;
    barcode?: string | undefined;
    reorderLevel?: number | undefined;
    isRetail?: boolean | undefined;
    isConsumable?: boolean | undefined;
}>;
export type CreateSkuRequest = z.infer<typeof CreateSkuRequestSchema>;
export declare const StockAdjustmentRequestSchema: z.ZodObject<{
    branchId: z.ZodString;
    skuId: z.ZodString;
    quantityDelta: z.ZodNumber;
    reason: z.ZodString;
    batchNumber: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    branchId: string;
    reason: string;
    skuId: string;
    quantityDelta: number;
    batchNumber?: string | undefined;
}, {
    branchId: string;
    reason: string;
    skuId: string;
    quantityDelta: number;
    batchNumber?: string | undefined;
}>;
export type StockAdjustmentRequest = z.infer<typeof StockAdjustmentRequestSchema>;
//# sourceMappingURL=inventory.contracts.d.ts.map