/* ==========================================================================
   ApexPOS - Inventory & Automated Recipe Depletion Engine
   ========================================================================== */

import { store } from '../state/store.js';

export class RecipeEngine {
  /**
   * Automatically deducts raw ingredients from inventory when an order is finalized.
   * e.g. Burger -> Bun (1) + Beef Patty (1) + Cheese Slice (1) + Sauce (20ml)
   */
  static depleteForOrder(cartItems) {
    const rawMaterials = store.state.rawMaterials;
    const depletedList = [];

    cartItems.forEach(cartItem => {
      if (!cartItem.recipe || !Array.isArray(cartItem.recipe)) return;

      cartItem.recipe.forEach(ingredient => {
        const rawMat = rawMaterials.find(rm => rm.id === ingredient.rawId);
        if (rawMat) {
          const totalUsage = ingredient.qty * cartItem.qty;
          rawMat.currentStock = Math.max(0, rawMat.currentStock - totalUsage);

          depletedList.push({
            name: rawMat.name,
            deducted: totalUsage,
            unit: rawMat.unit,
            remaining: rawMat.currentStock,
            isLow: rawMat.currentStock <= rawMat.minStock
          });
        }
      });
    });

    // Check for low stock items and notify
    const lowStockItems = rawMaterials.filter(rm => rm.currentStock <= rm.minStock);
    if (lowStockItems.length > 0) {
      store.logAudit(
        "LOW_STOCK_ALERT",
        `${lowStockItems.length} raw ingredients below minimum threshold (${lowStockItems.map(i => i.name).slice(0, 3).join(', ')})`
      );
    }

    return depletedList;
  }

  /**
   * Log raw material wastage (damaged, expired, burned in kitchen)
   */
  static recordWastage(rawId, qty, reason) {
    const raw = store.state.rawMaterials.find(r => r.id === rawId);
    if (!raw) return false;

    raw.currentStock = Math.max(0, raw.currentStock - qty);
    store.logAudit(
      "INVENTORY_WASTAGE",
      `Discarded ${qty} ${raw.unit} of ${raw.name}. Reason: ${reason}`
    );
    store.save();
    return true;
  }

  /**
   * Manual Stock Adjustment / Restock In
   */
  static adjustStock(rawId, newQty, reason = "Manual Audit Adjustment") {
    const raw = store.state.rawMaterials.find(r => r.id === rawId);
    if (!raw) return false;

    const oldQty = raw.currentStock;
    raw.currentStock = Number(newQty);
    store.logAudit(
      "STOCK_ADJUSTMENT",
      `Adjusted ${raw.name} from ${oldQty} to ${newQty} ${raw.unit}. Reason: ${reason}`
    );
    store.save();
    return true;
  }
}
