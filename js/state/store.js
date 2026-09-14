/* ==========================================================================
   ApexPOS - Central Reactive State Store
   ========================================================================== */

import {
  INITIAL_CATEGORIES,
  INITIAL_PRODUCTS,
  INITIAL_RAW_MATERIALS,
  INITIAL_CASH_SESSION,
  INITIAL_CASH_TRANSACTIONS,
  INITIAL_KDS_ORDERS,
  INITIAL_USERS
} from './mockData.js';
import { dbAdapter } from './dbAdapter.js';

class StateStore {
  constructor() {
    this.storageKey = 'FASTFOOD_POS_V3';
    this.listeners = new Set();
    this.db = dbAdapter;
    this.state = this.loadState();
    this.checkAuth();
    this.initDatabaseSync();
  }

  async initDatabaseSync() {
    try {
      const connected = await this.db.checkConnection();
      if (connected) {
        // 1. Categories
        const dbCategories = await this.db.fetchCategories();
        if (dbCategories && dbCategories.length > 0) {
          this.state.categories = dbCategories;
        }

        // 2. Products
        const dbProducts = await this.db.fetchProducts();
        if (dbProducts && dbProducts.length > 0) {
          this.state.products = dbProducts;
        }

        // 3. Raw Materials (BOM Inventory)
        const dbInventory = await this.db.fetchInventory();
        if (dbInventory && dbInventory.length > 0) {
          this.state.rawMaterials = dbInventory;
        }

        // 4. Completed Orders
        const dbOrders = await this.db.fetchOrders();
        if (dbOrders) {
          this.state.completedOrders = dbOrders;
        }

        // 5. Active KDS Kitchen Tickets
        const dbKds = await this.db.fetchKdsTickets();
        if (dbKds && dbKds.length > 0) {
          this.state.kdsOrders = dbKds;
        }

        // 6. Active Cash Shift Session
        const dbSession = await this.db.fetchCashSession();
        if (dbSession && dbSession.status === 'OPEN') {
          this.state.cashSession = {
            id: dbSession.id,
            branchId: dbSession.branch_id || 'branch-01',
            userId: dbSession.user_id || 'u-ali',
            cashierName: dbSession.cashier_name || 'Ali (Cashier)',
            status: dbSession.status,
            openedAt: dbSession.opened_at,
            openingCash: Number(dbSession.opening_cash || 0),
            cashSales: Number(dbSession.cash_sales || 0),
            cashIn: Number(dbSession.cash_in || 0),
            cashOut: Number(dbSession.cash_out || 0),
            refunds: Number(dbSession.refunds || 0)
          };
        }

        // 7. Cash Transactions
        const dbTxs = await this.db.fetchCashTransactions();
        if (dbTxs && dbTxs.length > 0) {
          this.state.cashTransactions = dbTxs;
        }

        this.save();
      }
    } catch (e) {
      console.warn("Database sync notice:", e);
    }
  }

  loadState() {
    const saved = localStorage.getItem(this.storageKey);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (!parsed.products || parsed.products.length === 0) parsed.products = INITIAL_PRODUCTS;
        if (!parsed.categories || parsed.categories.length === 0) parsed.categories = INITIAL_CATEGORIES;
        if (!parsed.rawMaterials || parsed.rawMaterials.length === 0) parsed.rawMaterials = INITIAL_RAW_MATERIALS;
        return parsed;
      } catch (e) {
        console.error("Failed to parse saved state, resetting to defaults", e);
      }
    }

    return {
      activeView: 'dashboard',
      auth: {
        isAuthenticated: true,
        user: { id: 'u-ali', name: 'Ali', role: 'Cashier' }
      },
      users: INITIAL_USERS,
      currentUser: { id: 'u-ali', name: 'Ali', role: 'Cashier' },
      currentBranch: { id: 'b-01', name: 'Downtown Flagship' },
      categories: INITIAL_CATEGORIES,
      products: INITIAL_PRODUCTS,
      rawMaterials: INITIAL_RAW_MATERIALS,
      cart: {
        token: this.generateToken(),
        orderType: 'dine-in', // dine-in, takeaway, delivery
        customer: { name: 'Walk-in Guest', phone: '0300-1234567' },
        items: [],
        discountPercent: 0,
        couponCode: '',
        taxPercent: 16
      },
      heldOrders: [],
      kdsOrders: [],
      cashSession: INITIAL_CASH_SESSION,
      cashTransactions: [],
      completedOrders: [],
      auditLogs: []
    };
  }

  save() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.state));
    this.notify();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.state);
      } catch (err) {
        console.error("Store listener execution error:", err);
      }
    }
  }

  generateToken() {
    const num = Math.floor(100 + Math.random() * 900);
    return `T-${num}`;
  }

  // View Navigation
  setView(viewName) {
    this.state.activeView = viewName;
    this.save();
  }

  // Cashier Session & Operator Switcher (Direct Access - No Passwords)
  checkAuth() {
    const user = this.state.currentUser || INITIAL_USERS[0];
    this.state.currentUser = user;
    this.state.auth = { isAuthenticated: true, user: user };
    return true;
  }

  switchUser() {
    const currentId = this.state.currentUser?.id;
    const nextUser = currentId === 'u-ali' ? INITIAL_USERS[1] : INITIAL_USERS[0];
    this.state.currentUser = nextUser;
    this.state.auth = { isAuthenticated: true, user: nextUser };
    this.logAudit("SWITCH_USER", `Switched active cashier to ${nextUser.name} (${nextUser.role})`);
    this.save();
    this.notify();
    return nextUser;
  }

  login(email, password) {
    const user = this.state.currentUser || INITIAL_USERS[0];
    return { success: true, user };
  }

  logout() {
    this.notify();
  }

  // Branch Switching
  setBranch(branch) {
    this.state.currentBranch = branch;
    this.logAudit("SWITCH_BRANCH", `Changed active location to ${branch.name}`);
    this.save();
  }

  // Cart Operations
  addToCart(product, variation = null, modifiers = []) {
    const unitPrice = product.price + (variation ? variation.priceDelta : 0);
    const modTotal = modifiers.reduce((acc, m) => acc + m.price, 0);
    const linePrice = unitPrice + modTotal;

    const existingIndex = this.state.cart.items.findIndex(item => 
      item.productId === product.id &&
      item.variationName === (variation ? variation.name : null) &&
      JSON.stringify(item.modifiers.map(m => m.id).sort()) === JSON.stringify(modifiers.map(m => m.id).sort())
    );

    if (existingIndex > -1) {
      this.state.cart.items[existingIndex].qty += 1;
      this.state.cart.items[existingIndex].subtotal = this.state.cart.items[existingIndex].qty * linePrice;
    } else {
      this.state.cart.items.push({
        id: `cart-item-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
        productId: product.id,
        name: product.name,
        station: product.station,
        recipe: product.recipe,
        variationName: variation ? variation.name : null,
        modifiers: modifiers,
        unitPrice: linePrice,
        qty: 1,
        subtotal: linePrice
      });
    }

    this.save();
  }

  updateCartItemQty(itemId, delta) {
    const item = this.state.cart.items.find(i => i.id === itemId);
    if (!item) return;

    item.qty += delta;
    if (item.qty <= 0) {
      this.removeCartItem(itemId);
      return;
    }

    item.subtotal = item.qty * item.unitPrice;
    this.save();
  }

  removeCartItem(itemId) {
    this.state.cart.items = this.state.cart.items.filter(i => i.id !== itemId);
    this.save();
  }

  clearCart() {
    this.state.cart.token = this.generateToken();
    this.state.cart.items = [];
    this.state.cart.discountPercent = 0;
    this.state.cart.couponCode = '';
    this.save();
  }

  setOrderType(type) {
    this.state.cart.orderType = type;
    this.save();
  }

  applyDiscount(percent, coupon = '') {
    this.state.cart.discountPercent = percent;
    this.state.cart.couponCode = coupon;
    this.logAudit("DISCOUNT_APPLIED", `Applied ${percent}% discount (Coupon: ${coupon || 'Manual'})`);
    this.save();
  }

  // Hold / Resume Cart
  holdCurrentOrder() {
    if (this.state.cart.items.length === 0) return false;

    const heldOrder = {
      ...JSON.parse(JSON.stringify(this.state.cart)),
      heldAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    this.state.heldOrders.push(heldOrder);
    this.logAudit("HOLD_ORDER", `Held order ${heldOrder.token} with ${heldOrder.items.length} items`);
    this.clearCart();
    return true;
  }

  resumeHeldOrder(token) {
    const index = this.state.heldOrders.findIndex(o => o.token === token);
    if (index === -1) return false;

    const [restored] = this.state.heldOrders.splice(index, 1);
    this.state.cart = restored;
    this.logAudit("RESUME_ORDER", `Resumed held order ${token}`);
    this.save();
    return true;
  }

  // Audit Logging
  logAudit(action, details) {
    const now = new Date();
    const timestamp = now.toISOString().replace('T', ' ').substring(0, 19);
    this.state.auditLogs.unshift({
      id: `LOG-${Date.now()}`,
      timestamp,
      user: `${this.state.currentUser.name} (${this.state.currentUser.role})`,
      action,
      details
    });

    // Keep last 150 audit entries
    if (this.state.auditLogs.length > 150) {
      this.state.auditLogs.pop();
    }
  }

  // Database Order Sync
  async syncCompletedOrderToDB(orderData) {
    if (this.db.isConnected) {
      await this.db.saveOrder(orderData);
    }
  }

  // Database Cash Transaction Sync
  async syncCashTransactionToDB(tx) {
    if (this.db.isConnected) {
      await this.db.recordCashTransaction(tx);
    }
  }
}

export const store = new StateStore();
