/* ==========================================================================
   ApexPOS - Unified Database Client Adapter
   Seamlessly synchronizes with the Python SQLite REST API backend
   (http://localhost:5501/api/*) and Cloudflare Pages Edge Worker (/api/*)
   with automated offline fallback.
   ========================================================================== */

export class DatabaseAdapter {
  constructor() {
    this.baseUrl = window.location.protocol === 'http:' || window.location.protocol === 'https:' 
      ? `${window.location.origin}/api` 
      : 'http://localhost:5501/api';
    this.isConnected = false;
    this.dbStatus = null;
    this.listeners = new Set();
  }

  async checkConnection() {
    try {
      const res = await fetch(`${this.baseUrl}/db/status`, { cache: 'no-store' });
      if (res.ok) {
        this.dbStatus = await res.json();
        this.isConnected = true;
      } else {
        this.isConnected = false;
        this.dbStatus = null;
      }
    } catch (e) {
      this.isConnected = false;
      this.dbStatus = null;
    }
    this.notify();
    return this.isConnected;
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  notify() {
    for (const listener of this.listeners) {
      try {
        listener(this.isConnected, this.dbStatus);
      } catch (err) {
        console.error("DB listener error:", err);
      }
    }
  }

  // =========================================================================
  // Categories & Products
  // =========================================================================
  async fetchCategories() {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/categories`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching categories from DB:", e);
    }
    return null;
  }

  async saveCategory(catData) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/categories`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(catData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error saving category to DB:", e);
    }
    return false;
  }

  async fetchProducts() {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/products`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching products from DB:", e);
    }
    return null;
  }

  async saveProduct(productData) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/products`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error saving product to DB:", e);
    }
    return false;
  }

  async updateProduct(id, productData) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/products/${encodeURIComponent(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error updating product in DB:", e);
    }
    return false;
  }

  async deleteProduct(id) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/products/${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error deleting product in DB:", e);
    }
    return false;
  }

  // =========================================================================
  // Inventory (BOM Raw Materials)
  // =========================================================================
  async fetchInventory() {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/inventory`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching inventory from DB:", e);
    }
    return null;
  }

  async updateStock(itemId, newStock) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/inventory/update`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: itemId, stock: newStock })
      });
      if (res.ok) {
        await this.checkConnection();
        return await res.json();
      }
    } catch (e) {
      console.warn("Error updating inventory in DB:", e);
    }
    return false;
  }

  async recordWastage(rawId, qty, reason, user = "Ali") {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/inventory/wastage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rawId, qty, reason, user })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error recording inventory wastage in DB:", e);
    }
    return false;
  }

  // =========================================================================
  // Orders
  // =========================================================================
  async fetchOrders(limit = 50) {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/orders?limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching orders from DB:", e);
    }
    return null;
  }

  async saveOrder(orderData) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      if (res.ok) {
        await this.checkConnection();
        return await res.json();
      }
    } catch (e) {
      console.warn("Error posting order to DB:", e);
    }
    return false;
  }

  // =========================================================================
  // Kitchen Display System (KDS)
  // =========================================================================
  async fetchKdsTickets() {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/kds`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching KDS tickets from DB:", e);
    }
    return null;
  }

  async dispatchKdsTicket(ticket) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/kds`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(ticket)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error dispatching KDS ticket to DB:", e);
    }
    return false;
  }

  async updateKdsTicketStatus(ticketId, status) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/kds/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, status })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error updating KDS ticket status in DB:", e);
    }
    return false;
  }

  async syncKdsTimer(ticketId, elapsedSeconds) {
    if (!this.isConnected) return false;
    try {
      await fetch(`${this.baseUrl}/kds/time`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: ticketId, elapsedSeconds })
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  // =========================================================================
  // Cash Drawer & Shift Sessions
  // =========================================================================
  async fetchCashSession() {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/cash/session`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching cash session from DB:", e);
    }
    return null;
  }

  async openCashSession(sessionData) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/cash/session/open`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(sessionData)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error opening cash session in DB:", e);
    }
    return false;
  }

  async closeCashSession(sessionId, closeData) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/cash/session/close`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: sessionId, ...closeData })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error closing cash session in DB:", e);
    }
    return false;
  }

  async fetchCashTransactions(limit = 50) {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/cash/transactions?limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching cash transactions from DB:", e);
    }
    return null;
  }

  async recordCashTransaction(tx) {
    if (!this.isConnected) return false;
    try {
      const res = await fetch(`${this.baseUrl}/cash/transaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(tx)
      });
      if (res.ok) {
        await this.checkConnection();
        return await res.json();
      }
    } catch (e) {
      console.warn("Error recording cash transaction to DB:", e);
    }
    return false;
  }

  // =========================================================================
  // Reports & Analytics Summary
  // =========================================================================
  async fetchReportsSummary() {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/reports/summary`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching reports summary from DB:", e);
    }
    return null;
  }

  // =========================================================================
  // Audit Trail
  // =========================================================================
  async fetchAuditLogs(limit = 100) {
    if (!this.isConnected) return null;
    try {
      const res = await fetch(`${this.baseUrl}/audit?limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn("Error fetching audit logs from DB:", e);
    }
    return null;
  }

  async logAudit(user, action, details) {
    if (!this.isConnected) return false;
    try {
      await fetch(`${this.baseUrl}/audit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user, action, details })
      });
      return true;
    } catch (e) {
      return false;
    }
  }

  // =========================================================================
  // Database Management
  // =========================================================================
  async getTableRows(tableName, limit = 50) {
    try {
      const res = await fetch(`${this.baseUrl}/db/table?name=${encodeURIComponent(tableName)}&limit=${limit}`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn(`Error fetching table ${tableName}:`, e);
    }
    return { table: tableName, count: 0, rows: [] };
  }

  async resetDatabase() {
    try {
      const res = await fetch(`${this.baseUrl}/db/reset`, { method: 'POST' });
      if (res.ok) {
        await this.checkConnection();
        return await res.json();
      }
    } catch (e) {
      console.warn("Error resetting database:", e);
    }
    return false;
  }

  async clearDummyData() {
    try {
      const res = await fetch(`${this.baseUrl}/db/clear`, { method: 'POST' });
      if (res.ok) {
        await this.checkConnection();
        return await res.json();
      }
    } catch (e) {
      console.warn("Error clearing dummy data:", e);
    }
    return false;
  }

  getExportUrl() {
    return `${this.baseUrl}/db/export`;
  }
}

export const dbAdapter = new DatabaseAdapter();
