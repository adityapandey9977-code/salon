export interface TaxCalculationItemInput {
    itemType: 'SERVICE' | 'PRODUCT' | 'PACKAGE' | 'MEMBERSHIP';
    unitPrice: number;
    quantity: number;
    discountAmount?: number;
    customGstRate?: number;
}
export interface TaxCalculationItemResult {
    unitPrice: number;
    quantity: number;
    grossAmount: number;
    discountAmount: number;
    taxableAmount: number;
    taxRate: number;
    taxAmount: number;
    lineTotal: number;
}
export interface TaxCalculationResult {
    items: TaxCalculationItemResult[];
    subtotal: number;
    discountTotal: number;
    taxableTotal: number;
    taxTotal: number;
    grandTotal: number;
}
export declare function calculateCartTax(items: TaxCalculationItemInput[], additionalCouponDiscount?: number): TaxCalculationResult;
//# sourceMappingURL=tax.calc.d.ts.map