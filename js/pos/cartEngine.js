/* ==========================================================================
   ApexPOS - Cart Calculation & Financial Tender Math Engine
   ========================================================================== */

export class CartEngine {
  static formatCurrency(amount) {
    const formatted = Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `Rs.\u00A0${formatted}`;
  }

  static calculateTotals(cart) {
    const items = cart.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

    // Discounts
    const discountPercent = cart.discountPercent || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Tax (e.g. 16% GST on food service)
    const taxPercent = cart.taxPercent || 16;
    const taxAmount = (discountedSubtotal * taxPercent) / 100;

    // Delivery Surcharge
    const deliveryFee = cart.orderType === 'delivery' ? 150 : 0;

    // Grand Total
    const grandTotal = Math.round(discountedSubtotal + taxAmount + deliveryFee);

    return {
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      deliveryFee,
      grandTotal,
      itemCount: items.reduce((acc, item) => acc + item.qty, 0)
    };
  }

  static calculateChange(tenderAmount, totalAmount) {
    return Math.max(0, Number(tenderAmount || 0) - Number(totalAmount || 0));
  }
}
