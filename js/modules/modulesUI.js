/* ==========================================================================
   ApexPOS - Management Modules Controller (KDS, Cash, Inventory, Reports, Audit)
   ========================================================================== */

import { store } from '../state/store.js';
import { CartEngine } from '../pos/cartEngine.js';
import { KDSEngine } from '../kds/kdsEngine.js';
import { CashDrawerEngine } from '../cash/cashDrawer.js';
import { RecipeEngine } from '../inventory/recipeEngine.js';

export class ModulesUI {
  constructor() {
    this.currentKdsStation = 'all';
  }

  init() {
    this.initDashboard();
    this.initKDS();
    this.initCashDrawer();
    this.initInventory();
    this.initOrders();
    this.initReports();
    this.initAuditLogs();
    this.initSettings();
    this.initDatabaseView();
  }

  /* --------------------------------------------------------------------------
     1. KITCHEN DISPLAY SYSTEM (KDS) & LIVE ORDERS
     -------------------------------------------------------------------------- */
  initKDS() {
    KDSEngine.initKdsTimer(() => {
      this.renderKDSTickets();
      if (store.state.activeView === 'dashboard') {
        this.renderDashboard();
      }
    });

    const stationTabs = document.querySelectorAll('.kds-tab-btn');
    stationTabs.forEach(tab => {
      tab.addEventListener('click', () => {
        stationTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        this.currentKdsStation = tab.dataset.station;
        this.renderKDSTickets();
      });
    });

    // Kitchen slide-out drawer events
    const openTopBtn = document.getElementById('open-kitchen-drawer-btn');
    const openPosBtn = document.getElementById('pos-kitchen-view-btn');
    const closeDrawerBtn = document.getElementById('close-kitchen-drawer-btn');
    const drawerOverlay = document.getElementById('kitchen-drawer-overlay');
    const fullKdsBtn = document.getElementById('drawer-go-kitchen-view');

    const openDrawer = () => {
      if (drawerOverlay) {
        this.renderKDSTickets();
        drawerOverlay.classList.add('active');
      }
    };
    const closeDrawer = () => {
      if (drawerOverlay) drawerOverlay.classList.remove('active');
    };

    if (openTopBtn) openTopBtn.onclick = openDrawer;
    if (openPosBtn) openPosBtn.onclick = openDrawer;
    if (closeDrawerBtn) closeDrawerBtn.onclick = closeDrawer;
    if (drawerOverlay) {
      drawerOverlay.onclick = (e) => {
        if (e.target === drawerOverlay) closeDrawer();
      };
    }
    if (fullKdsBtn) {
      fullKdsBtn.onclick = () => {
        closeDrawer();
        const kdsNav = document.querySelector('.nav-item[data-view="kds"]');
        if (kdsNav) kdsNav.click();
      };
    }
  }

  generateTicketHTML(t) {
    const ageClass = t.elapsedSeconds > 600 ? 'age-urgent' : (t.elapsedSeconds > 300 ? 'age-warning' : 'age-normal');
    const formattedTime = KDSEngine.formatTime(t.elapsedSeconds);

    return `
      <div class="kds-ticket-card ${ageClass}" data-ticket-id="${t.id}">
        <div class="kds-ticket-header">
          <div class="kds-ticket-header-top">
            <span class="kds-token-text">${t.token}</span>
            <span class="kds-type-pill pill-${t.orderType}">${t.orderType}</span>
          </div>
          <div class="kds-ticket-header-sub">
            <span class="kds-order-num">Ticket: ${t.id || t.token}</span>
            <span class="kds-timer-text">${formattedTime}</span>
          </div>
        </div>
        <div class="kds-items-list">
          ${t.items.map(item => `
            <div class="kds-item-row">
              <div class="kds-item-main">
                <span class="kds-item-qty">${item.qty}</span>
                <span class="kds-item-name">${item.name}</span>
              </div>
              ${item.variation ? `<div class="kds-item-size">Size: ${item.variation}</div>` : ''}
              ${(item.modifiers && item.modifiers.length > 0) ? `
                <div class="kds-item-addons">
                  ${item.modifiers.map(m => `<div class="kds-addon-line">* ${m}</div>`).join('')}
                </div>
              ` : ''}
            </div>
          `).join('')}
        </div>
        <div class="kds-ticket-actions">
          ${t.status === 'PENDING' ? `
            <button class="kds-action-btn start btn-kds-prep">Start Prep</button>
          ` : `
            <button class="kds-action-btn ready btn-kds-ready">✓ Mark Ready</button>
          `}
        </div>
      </div>
    `;
  }

  renderKDSTickets() {
    const board = document.getElementById('kds-tickets-board');
    const drawerBoard = document.getElementById('drawer-kitchen-board');

    const activeOrders = store.state.kdsOrders.filter(t => t.status !== 'SERVED');
    const activeCount = activeOrders.length;

    // Update all badges across the website
    ['nav-kds-badge', 'top-kds-badge', 'pos-kds-count', 'drawer-kds-badge'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.innerText = activeCount;
    });

    const avgSecs = activeCount > 0 
      ? Math.round(activeOrders.reduce((a, b) => a + (b.elapsedSeconds || 0), 0) / activeCount) 
      : 0;

    const countEl = document.getElementById('kds-active-count');
    const avgEl = document.getElementById('kds-avg-prep');
    if (countEl) countEl.innerText = activeCount;
    if (avgEl) avgEl.innerText = KDSEngine.formatTime(avgSecs);

    const filtered = activeOrders.filter(t => {
      if (this.currentKdsStation === 'all') return true;
      return t.station === this.currentKdsStation;
    });

    const emptyHTML = `
      <div style="margin: auto; text-align: center; color: var(--text-muted); padding: 30px;">
        <h4 style="color: var(--text-secondary); margin-bottom: 4px; font-weight: 500;">Kitchen queue is clear</h4>
        <p style="font-size: 0.8rem;">New orders ring up here automatically</p>
      </div>
    `;

    const ticketsHTML = filtered.length === 0 ? emptyHTML : filtered.map(t => this.generateTicketHTML(t)).join('');
    const drawerTicketsHTML = activeOrders.length === 0 ? emptyHTML : activeOrders.map(t => this.generateTicketHTML(t)).join('');

    if (board) board.innerHTML = ticketsHTML;
    if (drawerBoard) drawerBoard.innerHTML = drawerTicketsHTML;

    // Bind action buttons on both boards
    [board, drawerBoard].forEach(target => {
      if (!target) return;
      target.querySelectorAll('.btn-kds-prep').forEach(btn => {
        btn.onclick = (e) => {
          const id = e.target.closest('.kds-ticket-card').dataset.ticketId;
          KDSEngine.updateTicketStatus(id, 'PREPARING');
          this.renderKDSTickets();
        };
      });

      target.querySelectorAll('.btn-kds-ready').forEach(btn => {
        btn.onclick = (e) => {
          const id = e.target.closest('.kds-ticket-card').dataset.ticketId;
          KDSEngine.updateTicketStatus(id, 'SERVED');
          this.renderKDSTickets();
          window.showToast("Order marked ready", "success");
        };
      });
    });
  }

  /* --------------------------------------------------------------------------
     2. CASH MANAGEMENT & SHIFT RECONCILIATION
     -------------------------------------------------------------------------- */
  initCashDrawer() {
    this.renderCashDrawer();

    const cashInBtn = document.getElementById('drawer-cash-in-btn');
    const cashOutBtn = document.getElementById('drawer-cash-out-btn');
    const closeShiftBtn = document.getElementById('drawer-close-shift-btn');

    if (cashInBtn) {
      cashInBtn.onclick = () => this.openCashTxModal('IN');
    }
    if (cashOutBtn) {
      cashOutBtn.onclick = () => this.openCashTxModal('OUT');
    }
    if (closeShiftBtn) {
      closeShiftBtn.onclick = () => this.openShiftClosingModal();
    }
  }

  renderCashDrawer() {
    const metrics = CashDrawerEngine.getDrawerMetrics();
    const session = store.state.cashSession;

    const elOpening = document.getElementById('drawer-metric-opening');
    const elSales = document.getElementById('drawer-metric-sales');
    const elIn = document.getElementById('drawer-metric-in');
    const elOut = document.getElementById('drawer-metric-out');
    const elRefunds = document.getElementById('drawer-metric-refunds');
    const elExpected = document.getElementById('drawer-metric-expected');

    if (elOpening) elOpening.innerText = CartEngine.formatCurrency(metrics.opening);
    if (elSales) elSales.innerText = CartEngine.formatCurrency(metrics.cashSales);
    if (elIn) elIn.innerText = CartEngine.formatCurrency(metrics.cashIn);
    if (elOut) elOut.innerText = CartEngine.formatCurrency(metrics.cashOut);
    if (elRefunds) elRefunds.innerText = CartEngine.formatCurrency(metrics.refunds);
    if (elExpected) elExpected.innerText = CartEngine.formatCurrency(metrics.expectedCash);

    // Render Table
    const tbody = document.getElementById('cash-transactions-tbody');
    if (tbody) {
      if (store.state.cashTransactions.length === 0) {
        tbody.innerHTML = `<tr><td colspan="7" style="text-align: center; color: var(--text-muted); padding: 24px;">No cash transactions recorded</td></tr>`;
      } else {
        tbody.innerHTML = store.state.cashTransactions.map(tx => {
          const isPos = tx.type === 'IN' || tx.type === 'OPENING';
          return `
            <tr>
              <td style="font-family: var(--font-mono); font-weight: 700;">${tx.id}</td>
              <td>${tx.time}</td>
              <td><span class="type-pill ${tx.type.toLowerCase()}">${tx.type}</span></td>
              <td style="font-weight: 600; color: var(--text-primary);">${tx.reason}</td>
              <td class="amount-text ${isPos ? 'positive' : 'negative'}">
                ${isPos ? '+' : '-'}${CartEngine.formatCurrency(tx.amount)}
              </td>
              <td>${tx.user}</td>
              <td style="font-family: var(--font-mono); font-size: 0.75rem;">${tx.reference}</td>
            </tr>
          `;
        }).join('');
      }
    }
  }

  openCashTxModal(type) {
    const modal = document.getElementById('cash-tx-modal');
    const title = document.getElementById('cash-tx-title');
    const reasonSelect = document.getElementById('cash-tx-reason');
    const amountInput = document.getElementById('cash-tx-amount');
    const refInput = document.getElementById('cash-tx-ref');
    if (!modal) return;

    title.innerText = type === 'IN' ? 'Add Cash to Drawer' : 'Take Cash from Drawer';
    amountInput.value = '';
    refInput.value = '';

    const reasons = type === 'IN' 
      ? ['Added cash', 'Starting float', 'Customer advance', 'Other deposit']
      : ['Food / ingredients', 'Cleaning supplies', 'Staff payout', 'Delivery fuel', 'Customer refund', 'Other expense'];

    reasonSelect.innerHTML = reasons.map(r => `<option value="${r}">${r}</option>`).join('');

    const confirmBtn = document.getElementById('cash-tx-confirm-btn');
    confirmBtn.onclick = () => {
      const amt = Number(amountInput.value);
      if (!amt || amt <= 0) {
        window.showToast("Please enter a valid amount", "error");
        return;
      }

      if (type === 'IN') {
        CashDrawerEngine.recordCashIn(amt, reasonSelect.value, refInput.value);
        window.showToast(`Logged Cash In: ${CartEngine.formatCurrency(amt)}`, "success");
      } else {
        CashDrawerEngine.recordCashOut(amt, reasonSelect.value, refInput.value);
        window.showToast(`Logged Cash Out: ${CartEngine.formatCurrency(amt)}`, "info");
      }

      this.renderCashDrawer();
      modal.classList.remove('active');
    };

    modal.classList.add('active');
  }

  openShiftClosingModal() {
    const modal = document.getElementById('shift-closing-modal');
    if (!modal) return;

    const metrics = CashDrawerEngine.getDrawerMetrics();
    document.getElementById('closing-expected-cash').innerText = CartEngine.formatCurrency(metrics.expectedCash);

    const actualInput = document.getElementById('closing-actual-input');
    actualInput.value = metrics.expectedCash;

    const diffDisplay = document.getElementById('closing-difference-display');
    diffDisplay.innerText = CartEngine.formatCurrency(0);
    diffDisplay.style.color = 'var(--accent-emerald)';

    actualInput.oninput = () => {
      const diff = Number(actualInput.value || 0) - metrics.expectedCash;
      diffDisplay.innerText = `${diff >= 0 ? '+' : ''}${CartEngine.formatCurrency(diff)}`;
      diffDisplay.style.color = diff === 0 ? 'var(--accent-emerald)' : (diff > 0 ? 'var(--accent-sky)' : 'var(--accent-crimson)');
    };

    const confirmBtn = document.getElementById('confirm-close-shift-btn');
    confirmBtn.onclick = () => {
      const notes = document.getElementById('closing-notes-input').value;
      const result = CashDrawerEngine.closeShift(actualInput.value, notes);
      modal.classList.remove('active');
      this.renderCashDrawer();

      alert(`
Shift closed
------------------
Cashier: ${result.session.cashierName}
Expected: ${CartEngine.formatCurrency(result.metrics.expectedCash)}
Counted:  ${CartEngine.formatCurrency(result.actual)}
Difference: ${CartEngine.formatCurrency(result.difference)}
      `);

      // Prompt to open next shift
      setTimeout(() => {
        const nextFloat = prompt("Enter starting cash for next shift (Rs.):", "10000");
        if (nextFloat) {
          CashDrawerEngine.openNewShift(nextFloat);
          this.renderCashDrawer();
          window.showToast("New shift opened", "success");
        }
      }, 500);
    };

    modal.classList.add('active');
  }

  /* --------------------------------------------------------------------------
     3. INVENTORY & RECIPE RAW MATERIALS
     -------------------------------------------------------------------------- */
  initInventory() {
    this.renderInventory();

    const restockBtn = document.getElementById('inventory-restock-btn');
    if (restockBtn) {
      restockBtn.onclick = () => {
        const rawId = prompt("Enter Raw Material ID to adjust (e.g. raw_bun, raw_beef, raw_cheese):", "raw_bun");
        if (!rawId) return;
        const newQty = prompt("Enter new current stock count:");
        if (newQty !== null) {
          RecipeEngine.adjustStock(rawId, Number(newQty), "Manager Inventory Restock");
          this.renderInventory();
          window.showToast("Stock updated successfully!", "success");
        }
      };
    }
  }

  renderInventory() {
    const tbody = document.getElementById('inventory-table-tbody');
    if (!tbody) return;

    tbody.innerHTML = store.state.rawMaterials.map(rm => {
      const isLow = rm.currentStock <= rm.minStock;
      const stockVal = rm.currentStock * rm.costPerUnit;

      return `
        <tr>
          <td style="font-family: var(--font-mono); font-weight: 700;">${rm.id}</td>
          <td style="font-weight: 600; color: var(--text-primary);">${rm.name}</td>
          <td style="font-family: var(--font-mono); font-weight: 800; font-size: 1rem; color: ${isLow ? 'var(--accent-crimson)' : 'var(--text-primary)'};">
            ${rm.currentStock.toLocaleString()} ${rm.unit}
          </td>
          <td style="font-family: var(--font-mono); color: var(--text-muted);">${rm.minStock} ${rm.unit}</td>
          <td>
            <span class="product-stock-pill ${isLow ? 'low-stock' : 'in-stock'}">
              ${isLow ? 'Low stock' : 'In stock'}
            </span>
          </td>
          <td style="font-family: var(--font-mono);">${CartEngine.formatCurrency(rm.costPerUnit)}</td>
          <td style="font-family: var(--font-mono); font-weight: 700;">${CartEngine.formatCurrency(stockVal)}</td>
        </tr>
      `;
    }).join('');
  }

  /* --------------------------------------------------------------------------
     4. COMPLETED ORDERS HISTORY
     -------------------------------------------------------------------------- */
  initOrders() {
    this.renderOrders();
  }

  renderOrders() {
    const tbody = document.getElementById('orders-table-tbody');
    if (!tbody) return;

    if (store.state.completedOrders.length === 0) {
      tbody.innerHTML = `<tr><td colspan="8" style="text-align: center; color: var(--text-muted); padding: 24px;">No past orders found</td></tr>`;
      return;
    }

    tbody.innerHTML = store.state.completedOrders.map(ord => `
      <tr>
        <td style="font-family: var(--font-mono); font-weight: 800; color: var(--accent-amber);">${ord.token}</td>
        <td style="font-family: var(--font-mono);">${ord.id}</td>
        <td>${ord.time}</td>
        <td><span class="kds-order-type-chip ${ord.orderType}">${ord.orderType}</span></td>
        <td style="font-family: var(--font-mono); font-weight: 700; color: var(--text-primary);">${CartEngine.formatCurrency(ord.total)}</td>
        <td>${ord.paymentMethod}</td>
        <td>${ord.cashier}</td>
        <td><span class="type-pill in">PAID</span></td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     5. REPORTS & ANALYTICS DASHBOARD
     -------------------------------------------------------------------------- */
  initReports() {
    this.renderReports();
  }

  renderReports() {
    const orders = store.state.completedOrders;
    const totalRevenue = orders.reduce((sum, o) => sum + (o.totals?.grandTotal || o.total || 0), 0);
    const totalOrdersCount = orders.length;

    const elRev = document.getElementById('rep-total-revenue');
    const elOrders = document.getElementById('rep-total-orders');
    const elAvg = document.getElementById('rep-avg-check');
    const elProfit = document.getElementById('rep-est-profit');

    if (elRev) elRev.innerText = CartEngine.formatCurrency(totalRevenue);
    if (elOrders) elOrders.innerText = totalOrdersCount;
    if (elAvg) elAvg.innerText = totalOrdersCount > 0 ? CartEngine.formatCurrency(totalRevenue / totalOrdersCount) : 'Rs. 0.00';
    if (elProfit) elProfit.innerText = CartEngine.formatCurrency(totalRevenue * 0.42); // Estimated 42% food gross margin
  }

  /* --------------------------------------------------------------------------
     6. IMMUTABLE AUDIT LOGS
     -------------------------------------------------------------------------- */
  initAuditLogs() {
    this.renderAuditLogs();
  }

  renderAuditLogs() {
    const tbody = document.getElementById('audit-table-tbody');
    if (!tbody) return;

    if (store.state.auditLogs.length === 0) {
      tbody.innerHTML = `<tr><td colspan="4" style="text-align: center; color: var(--text-muted); padding: 24px;">No activity logs recorded</td></tr>`;
      return;
    }

    tbody.innerHTML = store.state.auditLogs.map(log => `
      <tr>
        <td style="font-family: var(--font-mono); font-size: 0.8rem;">${log.timestamp}</td>
        <td style="font-weight: 600;">${log.user}</td>
        <td><span class="type-pill sale">${log.action}</span></td>
        <td style="color: var(--text-primary); font-size: 0.85rem;">${log.details}</td>
      </tr>
    `).join('');
  }

  /* --------------------------------------------------------------------------
     7. SETTINGS & MULTI-BRANCH
     -------------------------------------------------------------------------- */
  initSettings() {
    const branchSelect = document.getElementById('settings-branch-select');
    if (branchSelect) {
      branchSelect.value = store.state.currentBranch.id;
      branchSelect.addEventListener('change', (e) => {
        const name = e.target.options[e.target.selectedIndex].text;
        store.setBranch({ id: e.target.value, name });
        const pill = document.getElementById('top-bar-branch-name');
        if (pill) pill.innerText = name;
        window.showToast(`Switched active branch to ${name}`, "info");
      });
    }

    const clearStateBtn = document.getElementById('btn-reset-demo-data');
    if (clearStateBtn) {
      clearStateBtn.onclick = () => {
        if (confirm("Reset POS data to initial factory demo state?")) {
          localStorage.removeItem(store.storageKey);
          location.reload();
        }
      };
    }
  }

  /* --------------------------------------------------------------------------
     0. EXECUTIVE DASHBOARD OVERVIEW
     -------------------------------------------------------------------------- */
  initDashboard() {
    const newOrderBtn = document.getElementById('dash-btn-new-order');
    const viewKitchenBtn = document.getElementById('dash-btn-view-kitchen');
    const addCashBtn = document.getElementById('dash-btn-add-cash');
    const gotoKitchenBtn = document.getElementById('dash-goto-kitchen');
    const gotoOrdersBtn = document.getElementById('dash-goto-orders');
    const gotoStockBtn = document.getElementById('dash-goto-stock');

    if (newOrderBtn) {
      newOrderBtn.onclick = () => window.switchView?.('pos');
    }
    if (viewKitchenBtn) {
      viewKitchenBtn.onclick = () => window.switchView?.('kds');
    }
    if (gotoKitchenBtn) {
      gotoKitchenBtn.onclick = () => window.switchView?.('kds');
    }
    if (addCashBtn) {
      addCashBtn.onclick = () => this.openCashTxModal('IN');
    }
    if (gotoOrdersBtn) {
      gotoOrdersBtn.onclick = () => window.switchView?.('orders');
    }
    if (gotoStockBtn) {
      gotoStockBtn.onclick = () => window.switchView?.('inventory');
    }

    this.renderDashboard();
  }

  renderDashboard() {
    const session = store.state.cashSession || {};
    const orders = store.state.completedOrders || [];
    const activeKds = (store.state.kdsOrders || []).filter(t => t.status !== 'SERVED');

    // Revenue calculation
    const drawerMetrics = CashDrawerEngine.getDrawerMetrics();
    const ordersTotal = orders.reduce((sum, o) => sum + (o.totals?.grandTotal || o.total || 0), 0);
    const totalSales = session.cashSales || ordersTotal || 0;
    const orderCount = orders.length;
    const inDrawer = drawerMetrics ? drawerMetrics.expectedCash : 0;
    const avgOrder = orderCount > 0 ? Math.round(totalSales / orderCount) : 0;

    const salesEl = document.getElementById('dash-total-sales');
    const countEl = document.getElementById('dash-orders-count');
    const drawerEl = document.getElementById('dash-cash-drawer');
    const kdsCountEl = document.getElementById('dash-kitchen-count');
    const kdsBadgeEl = document.getElementById('dash-kds-badge');
    const avgEl = document.getElementById('dash-avg-order');
    const startCashEl = document.getElementById('dash-starting-cash');

    if (salesEl) salesEl.innerText = CartEngine.formatCurrency(totalSales);
    if (countEl) countEl.innerText = `${orderCount} orders today`;
    if (drawerEl) drawerEl.innerText = CartEngine.formatCurrency(inDrawer);
    if (kdsCountEl) kdsCountEl.innerText = activeKds.length;
    if (kdsBadgeEl) kdsBadgeEl.innerText = activeKds.length;
    if (avgEl) avgEl.innerText = CartEngine.formatCurrency(avgOrder);
    if (startCashEl) startCashEl.innerText = CartEngine.formatCurrency(session.openingCash || 0);

    // Render Kitchen queue strip
    const strip = document.getElementById('dash-kitchen-strip');
    if (strip) {
      if (activeKds.length === 0) {
        strip.innerHTML = `<div style="color: var(--text-muted); font-size: 0.82rem; padding: 12px 0;">Kitchen queue is currently clear</div>`;
      } else {
        strip.innerHTML = activeKds.map(t => {
          const isWarning = t.elapsedSeconds > 300;
          const time = KDSEngine.formatTime(t.elapsedSeconds);
          const itemsSummary = t.items.map(i => `${i.qty}x ${i.name}`).join('<br>');
          return `
            <div class="dash-mini-ticket ${isWarning ? 'warning' : ''}">
              <div class="dash-mini-header">
                <span class="dash-mini-token">${t.token}</span>
                <span class="kds-type-pill pill-${t.orderType}">${t.orderType}</span>
              </div>
              <div class="dash-mini-items">${itemsSummary}</div>
              <div class="dash-mini-footer">
                <span>⏱ ${time}</span>
                ${t.status === 'PENDING' ? `
                  <button class="dash-mini-btn start btn-dash-prep" data-ticket-id="${t.id}">Start Prep</button>
                ` : `
                  <button class="dash-mini-btn ready btn-dash-ready" data-ticket-id="${t.id}">✓ Ready</button>
                `}
              </div>
            </div>
          `;
        }).join('');

        strip.querySelectorAll('.btn-dash-prep').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            const id = btn.dataset.ticketId;
            KDSEngine.updateTicketStatus(id, 'PREPARING');
            this.renderKDSTickets();
            this.renderDashboard();
          };
        });

        strip.querySelectorAll('.btn-dash-ready').forEach(btn => {
          btn.onclick = (e) => {
            e.stopPropagation();
            const id = btn.dataset.ticketId;
            KDSEngine.updateTicketStatus(id, 'SERVED');
            this.renderKDSTickets();
            this.renderDashboard();
            window.showToast("Order completed", "success");
          };
        });
      }
    }

    // Render Recent Orders table
    const ordersTbody = document.getElementById('dash-recent-orders-body');
    if (ordersTbody) {
      if (orders.length === 0) {
        ordersTbody.innerHTML = `<tr><td colspan="6" style="text-align: center; color: var(--text-muted); padding: 24px;">No orders placed yet</td></tr>`;
      } else {
        const displayOrders = orders.slice(0, 5);
        ordersTbody.innerHTML = displayOrders.map(o => {
          const summary = (o.items && Array.isArray(o.items))
            ? o.items.map(i => `${i.qty}x ${i.name}`).join(', ')
            : (o.summary || 'Items');
          const totalVal = o.totals?.grandTotal ?? o.total ?? 0;
          const timeVal = o.time || o.timestamp || 'Just now';
          return `
            <tr>
              <td><span class="dash-token-badge">${o.token || 'T-00'}</span></td>
              <td style="text-transform: capitalize;">${o.orderType || 'dine-in'}</td>
              <td style="color: var(--text-muted);">${timeVal}</td>
              <td style="max-width: 180px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${summary}</td>
              <td style="font-weight: 600; color: var(--text-primary); white-space: nowrap;">${CartEngine.formatCurrency(totalVal)}</td>
              <td><span class="dash-status-pill">Paid</span></td>
            </tr>
          `;
        }).join('');
      }
    }

    // Render Top Products
    const topList = document.getElementById('dash-top-products-list');
    if (topList) {
      if (orders.length === 0) {
        topList.innerHTML = `<div style="color: var(--text-muted); font-size: 0.82rem; padding: 20px 0; text-align: center;">No product sales recorded yet</div>`;
      } else {
        const counts = {};
        orders.forEach(o => {
          (o.items || []).forEach(item => {
            counts[item.name] = (counts[item.name] || 0) + (item.qty || 1);
          });
        });
        const topItems = Object.entries(counts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, sold]) => ({ name, sold }));
        topList.innerHTML = topItems.map((item, idx) => `
          <div class="dash-product-row">
            <div class="dash-product-info">
              <span class="dash-product-rank">${idx + 1}</span>
              <span class="dash-product-name">${item.name}</span>
            </div>
            <span class="dash-product-sold">${item.sold} sold</span>
          </div>
        `).join('');
      }
    }
  }

  /* --------------------------------------------------------------------------
     8. DATABASE MANAGEMENT & TABLE INSPECTION
     -------------------------------------------------------------------------- */
  initDatabaseView() {
    this.currentDbTable = 'products';

    const tabContainer = document.getElementById('db-table-tabs');
    if (tabContainer) {
      tabContainer.addEventListener('click', (e) => {
        const btn = e.target.closest('button[data-table]');
        if (!btn) return;
        tabContainer.querySelectorAll('button').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentDbTable = btn.dataset.table;
        this.renderDatabaseView(this.currentDbTable);
      });
    }

    const refreshBtn = document.getElementById('db-refresh-btn');
    if (refreshBtn) {
      refreshBtn.addEventListener('click', () => {
        this.renderDatabaseView(this.currentDbTable);
        window.showToast("Database refreshed from SQLite", "info");
      });
    }

    const resetBtn = document.getElementById('db-reset-btn');
    if (resetBtn) {
      resetBtn.addEventListener('click', async () => {
        if (confirm("Reset SQLite database to factory defaults? All custom orders and adjustments will be re-seeded.")) {
          const res = await store.db.resetDatabase();
          if (res && res.success) {
            await store.initDatabaseSync();
            this.renderDatabaseView(this.currentDbTable);
            window.showToast("SQLite Database reset to factory seed", "success");
          } else {
            window.showToast("Failed to reset database", "error");
          }
        }
      });
    }

    // Subscribe to DB connection status changes
    store.db.subscribe((connected, status) => {
      this.updateDbStatusPill(connected, status);
    });

    // Check on startup
    setTimeout(() => {
      store.db.checkConnection();
    }, 200);
  }

  updateDbStatusPill(connected, status) {
    const pill = document.getElementById('top-db-status-pill');
    const label = document.getElementById('top-db-status-label');
    if (!pill || !label) return;

    if (connected) {
      pill.style.background = 'rgba(245, 158, 11, 0.12)';
      pill.style.borderColor = 'rgba(245, 158, 11, 0.35)';
      const dot = pill.querySelector('.status-dot');
      if (dot) dot.style.background = '#f59e0b';
      label.innerText = `SQLite: Online (${status?.totalRecords || 57} rows)`;
    } else {
      pill.style.background = 'rgba(255, 255, 255, 0.05)';
      pill.style.borderColor = 'rgba(255, 255, 255, 0.15)';
      const dot = pill.querySelector('.status-dot');
      if (dot) dot.style.background = '#71717a';
      label.innerText = 'SQLite: Offline (Fallback)';
    }
  }

  async renderDatabaseView(selectedTable = null) {
    if (selectedTable) this.currentDbTable = selectedTable;
    const tableName = this.currentDbTable || 'products';

    // 1. Fetch DB Status
    await store.db.checkConnection();
    const status = store.db.dbStatus;
    const isConnected = store.db.isConnected;

    this.updateDbStatusPill(isConnected, status);

    const engineEl = document.getElementById('db-metric-engine');
    const recordsEl = document.getElementById('db-metric-records');
    const sizeEl = document.getElementById('db-metric-size');
    const statusEl = document.getElementById('db-metric-status');
    const titleEl = document.getElementById('db-table-title');

    if (engineEl) engineEl.innerText = status ? status.engine : 'SQLite v3';
    if (recordsEl) recordsEl.innerText = status ? status.totalRecords : '57';
    if (sizeEl) sizeEl.innerText = status ? status.fileSizeFormatted : '80.0 KB';
    if (statusEl) {
      statusEl.innerText = isConnected ? 'Connected' : 'Offline';
      statusEl.style.color = isConnected ? '#f59e0b' : '#71717a';
    }

    // 2. Fetch Table rows
    const tableData = await store.db.getTableRows(tableName, 50);
    const rows = tableData.rows || [];

    if (titleEl) {
      titleEl.innerText = `${tableName} (${rows.length} records loaded)`;
    }

    const thead = document.getElementById('db-inspector-thead');
    const tbody = document.getElementById('db-inspector-tbody');
    if (!thead || !tbody) return;

    if (rows.length === 0) {
      thead.innerHTML = `<tr><th>Status</th></tr>`;
      tbody.innerHTML = `<tr><td style="text-align: center; color: var(--text-muted); padding: 30px;">No records found in table '${tableName}'.</td></tr>`;
      return;
    }

    // Generate columns dynamically
    const columns = Object.keys(rows[0]);
    thead.innerHTML = `<tr>${columns.map(col => `<th style="text-transform: capitalize;">${col.replace(/_/g, ' ')}</th>`).join('')}</tr>`;

    tbody.innerHTML = rows.map(row => `
      <tr>
        ${columns.map(col => {
          let val = row[col];
          if (val === null || val === undefined) {
            return `<td style="color: var(--text-muted); font-style: italic;">null</td>`;
          }
          if (typeof val === 'string' && (val.startsWith('[') || val.startsWith('{'))) {
            try {
              const parsed = JSON.parse(val);
              if (Array.isArray(parsed)) {
                return `<td style="max-width: 240px; font-size: 0.76rem; font-family: var(--font-mono); color: var(--text-secondary); white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${val.replace(/"/g, '&quot;')}">${parsed.length} items: [${parsed.map(p => p.name || p.id || p.rawId || JSON.stringify(p)).join(', ')}]</td>`;
              }
            } catch (e) {}
          }
          if (col === 'price' || col === 'total' || col === 'cost_per_unit' || col === 'opening_cash' || col === 'amount') {
            return `<td style="font-family: var(--font-mono); font-weight: 600; color: #ffffff;">Rs. ${Number(val).toFixed(2)}</td>`;
          }
          if (col === 'id' || col === 'token') {
            return `<td><span class="dash-token-badge" style="font-size: 0.72rem;">${val}</span></td>`;
          }
          return `<td style="max-width: 220px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${String(val)}</td>`;
        }).join('')}
      </tr>
    `).join('');
  }
}

export const modulesUI = new ModulesUI();
