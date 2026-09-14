/* ==========================================================================
   ApexPOS - Cash In / Cash Out & Shift Drawer Reconciliation Engine
   ========================================================================== */

import { store } from '../state/store.js';
import { CartEngine } from '../pos/cartEngine.js';

export class CashDrawerEngine {
  /**
   * Calculate current active shift drawer metrics
   */
  static getDrawerMetrics() {
    const session = store.state.cashSession;
    const opening = Number(session.openingCash || 0);
    const cashSales = Number(session.cashSales || 0);
    const cashIn = Number(session.cashIn || 0);
    const cashOut = Number(session.cashOut || 0);
    const refunds = Number(session.refunds || 0);

    const expectedCash = opening + cashSales + cashIn - cashOut - refunds;

    return {
      opening,
      cashSales,
      cashIn,
      cashOut,
      refunds,
      expectedCash
    };
  }

  /**
   * Record a Cash In transaction
   */
  static recordCashIn(amount, reason, reference = '') {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return false;

    const session = store.state.cashSession;
    session.cashIn = (session.cashIn || 0) + amt;

    const tx = {
      id: `CI-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'IN',
      reason,
      amount: amt,
      user: store.state.currentUser.name,
      method: 'Cash',
      reference: reference || 'CASH-IN'
    };

    store.state.cashTransactions.unshift(tx);
    store.logAudit('CASH_IN', `Added ${CartEngine.formatCurrency(amt)} to drawer. Reason: ${reason}`);
    store.save();
    store.syncCashTransactionToDB(tx);
    return true;
  }

  /**
   * Record a Cash Out transaction
   */
  static recordCashOut(amount, reason, reference = '') {
    const amt = Number(amount);
    if (isNaN(amt) || amt <= 0) return false;

    const session = store.state.cashSession;
    session.cashOut = (session.cashOut || 0) + amt;

    const tx = {
      id: `CO-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'OUT',
      reason,
      amount: amt,
      user: store.state.currentUser.name,
      method: 'Cash',
      reference: reference || 'CASH-OUT'
    };

    store.state.cashTransactions.unshift(tx);
    store.logAudit('CASH_OUT', `Paid out ${CartEngine.formatCurrency(amt)} from drawer. Reason: ${reason}`);
    store.save();
    store.syncCashTransactionToDB(tx);
    return true;
  }

  /**
   * Reconcile Shift & Close Register (End of Day Z-Report)
   */
  static closeShift(actualCash, cashierNotes = '') {
    const metrics = this.getDrawerMetrics();
    const actual = Number(actualCash);
    const difference = actual - metrics.expectedCash;

    const session = store.state.cashSession;
    session.status = 'CLOSED';
    session.closedAt = new Date().toISOString();
    session.closingCash = actual;
    session.expectedCash = metrics.expectedCash;
    session.cashDifference = difference;
    session.cashierNotes = cashierNotes;

    store.logAudit(
      'SHIFT_CLOSED',
      `Shift closed by ${session.cashierName}. Expected: ${CartEngine.formatCurrency(metrics.expectedCash)}, Actual: ${CartEngine.formatCurrency(actual)}, Diff: ${CartEngine.formatCurrency(difference)}`
    );

    store.save();
    if (store.db && store.db.isConnected) {
      store.db.closeCashSession(session.id, { actualCash: actual, user: session.cashierName, notes: cashierNotes });
    }
    return {
      session,
      metrics,
      actual,
      difference
    };
  }

  /**
   * Re-open a fresh shift with new opening float
   */
  static openNewShift(openingFloat) {
    const floatAmt = Number(openingFloat) || 10000;
    store.state.cashSession = {
      id: `CS-${Date.now().toString().slice(-6)}`,
      branchId: store.state.currentBranch.id,
      userId: store.state.currentUser.id,
      cashierName: store.state.currentUser.name,
      status: 'OPEN',
      openedAt: new Date().toISOString(),
      closedAt: null,
      openingCash: floatAmt,
      cashSales: 0,
      cashIn: 0,
      cashOut: 0,
      refunds: 0
    };

    const tx = {
      id: `CT-${Date.now().toString().slice(-4)}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'OPENING',
      reason: 'New Register Opening Balance',
      amount: floatAmt,
      user: store.state.currentUser.name,
      method: 'Cash',
      reference: 'INIT'
    };

    store.state.cashTransactions.unshift(tx);
    store.logAudit('SHIFT_OPENED', `New shift opened with float ${CartEngine.formatCurrency(floatAmt)}`);
    store.save();
    if (store.db && store.db.isConnected) {
      store.db.openCashSession(store.state.cashSession);
      store.db.recordCashTransaction(tx);
    }
  }
}
