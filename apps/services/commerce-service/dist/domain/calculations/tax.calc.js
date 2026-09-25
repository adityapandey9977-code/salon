export function calculateCartTax(items, additionalCouponDiscount = 0) {
    let subtotal = 0;
    let itemDiscountsTotal = 0;
    let taxTotal = 0;
    const calculatedItems = items.map((item) => {
        const grossAmount = item.unitPrice * item.quantity;
        const discountAmount = item.discountAmount || 0;
        const taxableAmount = Math.max(0, grossAmount - discountAmount);
        const taxRate = item.customGstRate !== undefined ? item.customGstRate : 18.0;
        const taxAmount = Number(((taxableAmount * taxRate) / 100).toFixed(2));
        const lineTotal = Number((taxableAmount + taxAmount).toFixed(2));
        subtotal += grossAmount;
        itemDiscountsTotal += discountAmount;
        taxTotal += taxAmount;
        return {
            unitPrice: item.unitPrice,
            quantity: item.quantity,
            grossAmount,
            discountAmount,
            taxableAmount,
            taxRate,
            taxAmount,
            lineTotal,
        };
    });
    const totalDiscounts = itemDiscountsTotal + additionalCouponDiscount;
    const taxableTotal = Math.max(0, subtotal - totalDiscounts);
    const grandTotal = Number((taxableTotal + taxTotal).toFixed(2));
    return {
        items: calculatedItems,
        subtotal: Number(subtotal.toFixed(2)),
        discountTotal: Number(totalDiscounts.toFixed(2)),
        taxableTotal: Number(taxableTotal.toFixed(2)),
        taxTotal: Number(taxTotal.toFixed(2)),
        grandTotal,
    };
}
