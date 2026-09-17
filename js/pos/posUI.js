/* ==========================================================================
   ApexPOS - POS Terminal UI Controller
   ========================================================================== */

import { store } from '../state/store.js';
import { CartEngine } from './cartEngine.js';
import { KDSEngine } from '../kds/kdsEngine.js';
import { RecipeEngine } from '../inventory/recipeEngine.js';
import { CashDrawerEngine } from '../cash/cashDrawer.js';
import { modulesUI } from '../modules/modulesUI.js';

export class POSUI {
  constructor() {
    this.selectedCategory = 'all';
    this.searchQuery = '';
    this.pendingProduct = null; // Product undergoing modifier selection
    this.selectedVariation = null;
    this.selectedModifiers = [];
  }

  init() {
    this.renderCategories();
    this.renderProducts();
    this.renderCart();
    this.bindEvents();
  }

  bindEvents() {
    // Search input
    const searchInput = document.getElementById('pos-search');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.renderProducts();
      });
    }

    // Order Type Switcher
    const orderTypeBtns = document.querySelectorAll('.order-type-btn');
    orderTypeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        orderTypeBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        store.setOrderType(btn.dataset.type);
        this.renderCart();
      });
    });

    // Void / Clear Cart Button
    const voidBtn = document.getElementById('cart-void-btn');
    if (voidBtn) {
      voidBtn.addEventListener('click', () => {
        if (store.state.cart.items.length === 0) return;
        if (confirm("Clear this order?")) {
          store.logAudit("CLEAR_CART", `Cleared cart with ${store.state.cart.items.length} items`);
          store.clearCart();
          document.querySelector('.pos-cart-column')?.classList.remove('mobile-open');
          this.renderCart();
          window.showToast("Order cleared", "info");
        }
      });
    }

    // Mobile View Cart Drawer button
    const mobileViewCartBtn = document.getElementById('mobile-view-cart-btn');
    const posCartCol = document.querySelector('.pos-cart-column');
    if (mobileViewCartBtn && posCartCol) {
      mobileViewCartBtn.addEventListener('click', () => {
        posCartCol.classList.add('mobile-open');
      });
    }

    // Mobile Back to Menu button
    const cartMobileBackBtn = document.getElementById('cart-mobile-back-btn');
    if (cartMobileBackBtn && posCartCol) {
      cartMobileBackBtn.addEventListener('click', () => {
        posCartCol.classList.remove('mobile-open');
      });
    }

    // Hold Order Button
    const holdBtn = document.getElementById('cart-hold-btn');
    if (holdBtn) {
      holdBtn.addEventListener('click', () => {
        if (store.state.cart.items.length === 0) {
          window.showToast("Cart is empty", "error");
          return;
        }
        store.holdCurrentOrder();
        this.renderCart();
        window.showToast("Order put on hold", "success");
      });
    }

    // Pay / Checkout Button
    const payBtn = document.getElementById('cart-pay-btn');
    if (payBtn) {
      payBtn.addEventListener('click', () => {
        if (store.state.cart.items.length === 0) {
          window.showToast("Cart is empty", "error");
          return;
        }
        this.openPaymentModal();
      });
    }

    // Discount / Coupon Trigger
    const couponBtn = document.getElementById('apply-coupon-btn');
    if (couponBtn) {
      couponBtn.addEventListener('click', () => {
        const code = prompt("Enter coupon code (e.g. SAVE10, VIP20):");
        if (!code) return;
        const upper = code.trim().toUpperCase();
        if (upper === 'SAVE10') {
          store.applyDiscount(10, 'SAVE10');
          window.showToast("10% discount applied", "success");
        } else if (upper === 'VIP20') {
          store.applyDiscount(20, 'VIP20');
          window.showToast("20% discount applied", "success");
        } else {
          window.showToast("Invalid code", "error");
        }
        this.renderCart();
      });
    }
  }

  renderCategories() {
    const rail = document.getElementById('category-filter-rail');
    if (!rail) return;

    rail.innerHTML = store.state.categories.map(cat => `
      <button class="category-chip ${this.selectedCategory === cat.id ? 'active' : ''}" data-cat-id="${cat.id}">
        <span>${cat.name}</span>
      </button>
    `).join('');

    rail.querySelectorAll('.category-chip').forEach(btn => {
      btn.addEventListener('click', () => {
        this.selectedCategory = btn.dataset.catId;
        this.renderCategories();
        this.renderProducts();
      });
    });
  }

  renderProducts() {
    const grid = document.getElementById('pos-products-grid');
    if (!grid) return;

    const filtered = store.state.products.filter(p => {
      const matchesCategory = this.selectedCategory === 'all' || p.categoryId === this.selectedCategory;
      const matchesSearch = !this.searchQuery || 
        p.name.toLowerCase().includes(this.searchQuery) ||
        p.desc.toLowerCase().includes(this.searchQuery);
      return matchesCategory && matchesSearch;
    });

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1/-1; padding: 40px; text-align: center; color: var(--text-muted);">
          <p style="font-weight: 500; font-size: 0.95rem; color: var(--text-secondary); margin-bottom: 4px;">No products found</p>
          <p style="font-size: 0.8rem;">No items matching "<strong>${this.searchQuery}</strong>"</p>
        </div>
      `;
      return;
    }

    grid.innerHTML = filtered.map(p => {
      const isLowStock = p.stock <= 10;
      const isOut = p.stock <= 0;
      const stockClass = isOut ? 'out-of-stock' : (isLowStock ? 'low-stock' : 'in-stock');
      const stockText = isOut ? 'Out of Stock' : `${p.stock} left`;

      return `
        <div class="product-card" data-product-id="${p.id}">
          <div class="product-card-top">
            <span class="product-category-tag">${p.categoryId}</span>
            <span class="product-stock-pill ${stockClass}">${stockText}</span>
          </div>
          <div>
            <h4 class="product-name">${p.name}</h4>
            <p class="product-desc">${p.desc}</p>
          </div>
          <div class="product-card-bottom">
            <span class="product-price">${CartEngine.formatCurrency(p.price)}</span>
            <div class="product-add-badge">+</div>
          </div>
        </div>
      `;
    }).join('');

    grid.querySelectorAll('.product-card').forEach(card => {
      card.addEventListener('click', () => {
        const prod = store.state.products.find(p => p.id === card.dataset.productId);
        if (prod) {
          if ((prod.variations && prod.variations.length > 0) || (prod.modifiers && prod.modifiers.length > 0)) {
            this.openModifierModal(prod);
          } else {
            store.addToCart(prod);
            this.renderCart();
            window.showToast(`Added ${prod.name} to cart`, "success");
          }
        }
      });
    });
  }

  openModifierModal(product) {
    this.pendingProduct = product;
    this.selectedVariation = product.variations && product.variations.length > 0 ? product.variations[0] : null;
    this.selectedModifiers = [];

    const modal = document.getElementById('modifier-modal');
    const title = document.getElementById('modifier-modal-title');
    const body = document.getElementById('modifier-modal-body');
    if (!modal || !body) return;

    title.innerText = `Customize: ${product.name}`;

    let html = '';

    // Variations Section
    if (product.variations && product.variations.length > 0) {
      html += `
        <div class="form-group">
          <label class="form-label">Select Size / Variation:</label>
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(130px, 1fr)); gap: 8px;">
            ${product.variations.map((v, i) => `
              <button type="button" class="cash-chip mod-var-btn ${i === 0 ? 'active' : ''}" data-var-index="${i}">
                ${v.name} ${v.priceDelta !== 0 ? `(${v.priceDelta > 0 ? '+' : ''}${CartEngine.formatCurrency(v.priceDelta)})` : ''}
              </button>
            `).join('')}
          </div>
        </div>
      `;
    }

    // Addons / Modifiers Section
    if (product.modifiers && product.modifiers.length > 0) {
      html += `
        <div class="form-group" style="margin-top: 10px;">
          <label class="form-label">Add-ons & Extras:</label>
          <div style="display: flex; flex-direction: column; gap: 6px;">
            ${product.modifiers.map(m => `
              <label style="display: flex; align-items: center; justify-content: space-between; padding: 8px 12px; background: var(--bg-elevated); border: 1px solid var(--border-subtle); border-radius: var(--radius-md); cursor: pointer;">
                <div style="display: flex; align-items: center; gap: 8px;">
                  <input type="checkbox" class="mod-checkbox" data-mod-id="${m.id}" style="accent-color: var(--accent-amber); width: 16px; height: 16px;">
                  <span style="font-weight: 600; font-size: 0.88rem;">${m.name}</span>
                </div>
                <span style="font-family: var(--font-mono); color: var(--accent-amber); font-weight: 700;">
                  ${m.price > 0 ? '+' + CartEngine.formatCurrency(m.price) : 'Free'}
                </span>
              </label>
            `).join('')}
          </div>
        </div>
      `;
    }

    body.innerHTML = html;

    // Attach Variation Selection Events
    body.querySelectorAll('.mod-var-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        body.querySelectorAll('.mod-var-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedVariation = product.variations[Number(btn.dataset.varIndex)];
      });
    });

    // Attach Checkbox Modifiers
    body.querySelectorAll('.mod-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        const mod = product.modifiers.find(m => m.id === cb.dataset.modId);
        if (cb.checked) {
          this.selectedModifiers.push(mod);
        } else {
          this.selectedModifiers = this.selectedModifiers.filter(m => m.id !== mod.id);
        }
      });
    });

    // Confirm Button
    const confirmBtn = document.getElementById('modifier-confirm-btn');
    confirmBtn.onclick = () => {
      store.addToCart(this.pendingProduct, this.selectedVariation, this.selectedModifiers);
      this.renderCart();
      modal.classList.remove('active');
      window.showToast(`Added ${this.pendingProduct.name} to cart`, "success");
    };

    modal.classList.add('active');
  }

  renderCart() {
    const itemsContainer = document.getElementById('cart-items-container');
    const tokenBadge = document.getElementById('cart-token-badge');
    if (!itemsContainer) return;

    if (tokenBadge) {
      tokenBadge.innerText = store.state.cart.token;
    }

    const items = store.state.cart.items;

    if (items.length === 0) {
      itemsContainer.innerHTML = `
        <div class="cart-empty-state">
          <div style="font-weight: 500; font-size: 0.92rem; color: var(--text-secondary);">Cart is empty</div>
          <div style="font-size: 0.78rem; color: var(--text-muted);">Select items to start order</div>
        </div>
      `;
    } else {
      itemsContainer.innerHTML = items.map(item => `
        <div class="cart-item-row" data-cart-id="${item.id}">
          <div class="cart-item-main">
            <div>
              <div class="cart-item-title">${item.name}</div>
              ${item.variationName ? `<span style="font-size: 0.75rem; color: var(--accent-amber); font-weight: 600;">[${item.variationName}]</span>` : ''}
            </div>
            <div class="cart-item-price">${CartEngine.formatCurrency(item.subtotal)}</div>
          </div>
          ${item.modifiers && item.modifiers.length > 0 ? `
            <div class="cart-item-modifiers">
              ${item.modifiers.map(m => `<span class="modifier-pill">+ ${m.name}</span>`).join('')}
            </div>
          ` : ''}
          <div class="cart-item-footer">
            <div class="cart-qty-stepper">
              <button class="stepper-btn qty-minus">-</button>
              <span class="stepper-value">${item.qty}</span>
              <button class="stepper-btn qty-plus">+</button>
            </div>
            <button class="cart-item-remove-btn" title="Remove Item">✕</button>
          </div>
        </div>
      `).join('');

      // Attach stepper and remove events
      itemsContainer.querySelectorAll('.cart-item-row').forEach(row => {
        const id = row.dataset.cartId;
        row.querySelector('.qty-minus').addEventListener('click', () => {
          store.updateCartItemQty(id, -1);
          this.renderCart();
        });
        row.querySelector('.qty-plus').addEventListener('click', () => {
          store.updateCartItemQty(id, 1);
          this.renderCart();
        });
        row.querySelector('.cart-item-remove-btn').addEventListener('click', () => {
          store.removeCartItem(id);
          this.renderCart();
        });
      });
    }

    // Render Calculation Totals
    const totals = CartEngine.calculateTotals(store.state.cart);
    document.getElementById('calc-subtotal').innerText = CartEngine.formatCurrency(totals.subtotal);
    document.getElementById('calc-tax').innerText = `${CartEngine.formatCurrency(totals.taxAmount)} (${totals.taxPercent}%)`;
    document.getElementById('calc-delivery').innerText = totals.deliveryFee > 0 ? CartEngine.formatCurrency(totals.deliveryFee) : 'Rs. 0.00';
    
    const discountRow = document.getElementById('calc-discount-row');
    if (totals.discountAmount > 0) {
      discountRow.style.display = 'flex';
      document.getElementById('calc-discount').innerText = `-${CartEngine.formatCurrency(totals.discountAmount)} (${totals.discountPercent}%)`;
    } else {
      discountRow.style.display = 'none';
    }

    document.getElementById('calc-grand-total').innerText = CartEngine.formatCurrency(totals.grandTotal);

    // Update Mobile Cart Bar Counters
    const mobileCartBadge = document.getElementById('mobile-cart-badge');
    const mobileCartTotal = document.getElementById('mobile-cart-total');
    const totalItemCount = items.reduce((sum, item) => sum + (item.qty || 1), 0);
    if (mobileCartBadge) {
      mobileCartBadge.innerText = `${totalItemCount} item${totalItemCount === 1 ? '' : 's'}`;
    }
    if (mobileCartTotal) {
      mobileCartTotal.innerText = CartEngine.formatCurrency(totals.grandTotal);
    }
  }

  openPaymentModal() {
    const totals = CartEngine.calculateTotals(store.state.cart);
    const modal = document.getElementById('payment-modal');
    if (!modal) return;

    document.getElementById('tender-due-amount').innerText = CartEngine.formatCurrency(totals.grandTotal);
    const tenderInput = document.getElementById('tender-cash-input');
    tenderInput.value = totals.grandTotal;

    const changeDueEl = document.getElementById('tender-change-due');
    changeDueEl.innerText = CartEngine.formatCurrency(0);

    tenderInput.oninput = () => {
      const change = CartEngine.calculateChange(tenderInput.value, totals.grandTotal);
      changeDueEl.innerText = CartEngine.formatCurrency(change);
    };

    // Quick cash buttons
    const denominations = [500, 1000, 2000, 5000];
    const quickGrid = document.getElementById('quick-denominations-grid');
    if (quickGrid) {
      quickGrid.innerHTML = denominations.map(d => `
        <button type="button" class="cash-chip" data-amt="${d}">Rs. ${d}</button>
      `).join('') + `<button type="button" class="cash-chip" data-amt="${totals.grandTotal}">Exact</button>`;

      quickGrid.querySelectorAll('.cash-chip').forEach(btn => {
        btn.onclick = () => {
          tenderInput.value = btn.dataset.amt;
          const change = CartEngine.calculateChange(tenderInput.value, totals.grandTotal);
          changeDueEl.innerText = CartEngine.formatCurrency(change);
        };
      });
    }

    // Confirm Payment & Dispatch Checkout
    const confirmBtn = document.getElementById('confirm-payment-btn');
    confirmBtn.onclick = () => {
      const activeMethodBtn = document.querySelector('.tender-method-btn.active');
      const method = activeMethodBtn ? activeMethodBtn.dataset.method : 'Cash';
      const tenderAmt = Number(tenderInput.value);

      if (tenderAmt < totals.grandTotal && method === 'Cash') {
        window.showToast("Tender amount cannot be less than total due", "error");
        return;
      }

      this.processCheckout(method, tenderAmt, totals);
      modal.classList.remove('active');
    };

    modal.classList.add('active');
  }

  processCheckout(paymentMethod, tenderAmount, totals) {
    const orderData = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      token: store.state.cart.token,
      orderType: store.state.cart.orderType,
      items: JSON.parse(JSON.stringify(store.state.cart.items)),
      totals: totals,
      paymentMethod: paymentMethod,
      tenderAmount: tenderAmount,
      changeDue: CartEngine.calculateChange(tenderAmount, totals.grandTotal),
      cashier: store.state.currentUser.name,
      timestamp: new Date().toLocaleTimeString(),
      status: 'COMPLETED'
    };

    // 1. Deplete raw ingredients from inventory via RecipeEngine
    const depleted = RecipeEngine.depleteForOrder(orderData.items);

    // 2. Add to Cash Drawer if paid in Cash
    if (paymentMethod === 'Cash') {
      store.state.cashSession.cashSales = (store.state.cashSession.cashSales || 0) + totals.grandTotal;
    }

    // 3. Dispatch to Kitchen Display System (KDS)
    KDSEngine.dispatchOrderToKitchen(orderData);

    // 4. Save to completed orders list
    store.state.completedOrders.unshift({
      id: orderData.id,
      token: orderData.token,
      time: orderData.timestamp,
      orderType: orderData.orderType,
      total: totals.grandTotal,
      paymentMethod: paymentMethod,
      cashier: orderData.cashier,
      status: 'COMPLETED'
    });

    // 5. Log Audit Trail
    store.logAudit(
      'ORDER_COMPLETED',
      `Processed Order #${orderData.token} (${orderData.id}) for ${CartEngine.formatCurrency(totals.grandTotal)} via ${paymentMethod}`
    );

    store.save();

    // Sync to SQLite Database
    store.syncCompletedOrderToDB(orderData);

    // Show Thermal Receipt Dialog Preview
    this.showReceiptPreview(orderData);

    // Reset Cart
    store.clearCart();
    document.querySelector('.pos-cart-column')?.classList.remove('mobile-open');
    this.renderCart();
    this.renderProducts(); // update remaining stock badges
    modulesUI.renderKDSTickets(); // update kitchen tickets & badge
    modulesUI.renderDashboard(); // update dashboard metrics

    window.showToast(`Order #${orderData.token} paid & sent to kitchen`, "success");
  }

  showReceiptPreview(order) {
    const receiptModal = document.getElementById('receipt-modal');
    const container = document.getElementById('receipt-print-container');
    if (!receiptModal || !container) return;

    container.innerHTML = `
      <div class="thermal-receipt">
        <div class="receipt-center">
          <div class="receipt-logo-text">FastFood</div>
          <div>${store.state.currentBranch.name}</div>
          <div class="receipt-divider"></div>
          <div style="font-weight: 600; font-size: 1rem; margin: 4px 0;">Token: ${order.token}</div>
          <div>${order.orderType}</div>
          <div class="receipt-divider"></div>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.7rem; margin-bottom: 6px;">
          <span>Order: ${order.id}</span>
          <span>${order.timestamp}</span>
        </div>
        <div style="font-size: 0.7rem; margin-bottom: 6px;">
          Cashier: ${order.cashier}
        </div>

        <table class="receipt-table">
          <thead>
            <tr style="border-bottom: 1px dashed #000; font-weight: 700;">
              <td>Item</td>
              <td style="text-align: center;">Qty</td>
              <td style="text-align: right;">Total</td>
            </tr>
          </thead>
          <tbody>
            ${order.items.map(item => `
              <tr>
                <td>
                  <div>${item.name}</div>
                  ${item.variationName ? `<div style="font-size: 0.65rem;">(${item.variationName})</div>` : ''}
                  ${item.modifiers ? item.modifiers.map(m => `<div style="font-size: 0.65rem;">+ ${m.name || m}</div>`).join('') : ''}
                </td>
                <td style="text-align: center; vertical-align: top;">${item.qty}</td>
                <td style="text-align: right; vertical-align: top;">${CartEngine.formatCurrency(item.subtotal)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>

        <div class="receipt-divider"></div>

        <div style="display: flex; justify-content: space-between;">
          <span>Subtotal:</span>
          <span>${CartEngine.formatCurrency(order.totals.subtotal)}</span>
        </div>
        ${order.totals.discountAmount > 0 ? `
          <div style="display: flex; justify-content: space-between;">
            <span>Discount (${order.totals.discountPercent}%):</span>
            <span>-${CartEngine.formatCurrency(order.totals.discountAmount)}</span>
          </div>
        ` : ''}
        <div style="display: flex; justify-content: space-between;">
          <span>GST (16%):</span>
          <span>${CartEngine.formatCurrency(order.totals.taxAmount)}</span>
        </div>
        ${order.totals.deliveryFee > 0 ? `
          <div style="display: flex; justify-content: space-between;">
            <span>Delivery Fee:</span>
            <span>${CartEngine.formatCurrency(order.totals.deliveryFee)}</span>
          </div>
        ` : ''}

        <div class="receipt-divider"></div>

        <div style="display: flex; justify-content: space-between; font-weight: 800; font-size: 1rem;">
          <span>NET TOTAL:</span>
          <span>${CartEngine.formatCurrency(order.totals.grandTotal)}</span>
        </div>

        <div style="display: flex; justify-content: space-between; font-size: 0.75rem; margin-top: 4px;">
          <span>Paid via ${order.paymentMethod}:</span>
          <span>${CartEngine.formatCurrency(order.tenderAmount)}</span>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.75rem;">
          <span>Change Returned:</span>
          <span>${CartEngine.formatCurrency(order.changeDue)}</span>
        </div>

        <div class="receipt-divider"></div>

        <div class="receipt-center" style="font-size: 0.7rem;">
          <div>Thank you for visiting FastFood!</div>
          <div>FastFood POS</div>
        </div>
      </div>
    `;

    receiptModal.classList.add('active');
  }
}
