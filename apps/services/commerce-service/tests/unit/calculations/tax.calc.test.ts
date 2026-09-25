import { describe, expect, it } from 'vitest';
import { calculateCartTax } from '../../../src/domain/calculations/tax.calc';

describe('GST & Tax Calculation Engine', () => {
  it('should accurately calculate GST on line items and subtotal', () => {
    const result = calculateCartTax([
      {
        itemType: 'SERVICE',
        unitPrice: 1000,
        quantity: 1,
        discountAmount: 100, // Taxable: 900, 18% GST: 162, Total: 1062
      },
      {
        itemType: 'PRODUCT',
        unitPrice: 500,
        quantity: 2, // Gross: 1000, Taxable: 1000, 18% GST: 180, Total: 1180
      },
    ]);

    expect(result.subtotal).toBe(2000);
    expect(result.discountTotal).toBe(100);
    expect(result.taxableTotal).toBe(1900);
    expect(result.taxTotal).toBe(342); // 162 + 180
    expect(result.grandTotal).toBe(2242);
  });
});
