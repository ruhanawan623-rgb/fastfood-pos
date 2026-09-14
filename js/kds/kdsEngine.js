/* ==========================================================================
   ApexPOS - Kitchen Display System (KDS) & KOT Engine
   ========================================================================== */

import { store } from '../state/store.js';

export class KDSEngine {
  static initKdsTimer(renderCallback) {
    // Tick every second to update stopwatch timers on all active kitchen tickets
    setInterval(() => {
      const activeTickets = store.state.kdsOrders.filter(t => t.status !== 'SERVED');
      if (activeTickets.length > 0) {
        activeTickets.forEach(ticket => {
          ticket.elapsedSeconds = (ticket.elapsedSeconds || 0) + 1;
        });
        if (renderCallback) renderCallback();
      }
    }, 1000);
  }

  static formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }

  static getTicketAgeClass(seconds) {
    if (seconds >= 600) return 'age-urgent';   // > 10 mins (Urgent warning alert)
    if (seconds >= 300) return 'age-warning';  // 5 - 10 mins
    return 'age-normal';                       // < 5 mins
  }

  /**
   * Dispatch a newly paid POS order directly into KDS
   */
  static dispatchOrderToKitchen(orderData) {
    const kdsTicket = {
      id: orderData.id || `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      token: orderData.token,
      orderType: orderData.orderType,
      status: 'PENDING',
      station: this.resolvePrimaryStation(orderData.items),
      elapsedSeconds: 0,
      createdAt: 'Just now',
      items: orderData.items.map(item => ({
        name: item.name,
        qty: item.qty,
        variation: item.variationName || '',
        modifiers: (item.modifiers || []).map(m => m.name),
        station: item.station || 'burger'
      }))
    };

    store.state.kdsOrders.unshift(kdsTicket);
    store.logAudit('KDS_DISPATCH', `New order ${kdsTicket.token} sent to kitchen (${kdsTicket.orderType})`);
    store.save();
    if (store.db && store.db.isConnected) {
      store.db.dispatchKdsTicket(kdsTicket);
    }
    return kdsTicket;
  }

  static resolvePrimaryStation(items) {
    const stations = items.map(i => i.station);
    if (stations.includes('burger')) return 'burger';
    if (stations.includes('pizza')) return 'pizza';
    if (stations.includes('fryer')) return 'fryer';
    return 'drinks';
  }

  static updateTicketStatus(ticketId, newStatus) {
    const ticket = store.state.kdsOrders.find(t => t.id === ticketId);
    if (!ticket) return;

    ticket.status = newStatus;
    store.logAudit('KDS_STATUS_CHANGE', `Ticket ${ticket.token} changed to ${newStatus}`);
    store.save();
    if (store.db && store.db.isConnected) {
      store.db.updateKdsTicketStatus(ticket.id || ticket.token, newStatus);
    }
  }

  /**
   * Generate Kitchen Order Ticket (KOT) Text Format
   */
  static generateKOT(order) {
    const lineBreak = "------------------------------------------\n";
    let kot = "";
    kot += "          ** KITCHEN ORDER TICKET **       \n";
    kot += `TOKEN: ${order.token}        TYPE: ${order.orderType.toUpperCase()}\n`;
    kot += `ORDER: ${order.id}      TIME: ${new Date().toLocaleTimeString()}\n`;
    kot += lineBreak;
    kot += "QTY  ITEM NAME & MODIFIERS\n";
    kot += lineBreak;

    order.items.forEach(item => {
      kot += `[${item.qty}x] ${item.name.toUpperCase()}\n`;
      if (item.variationName) {
        kot += `     > Size: ${item.variationName}\n`;
      }
      if (item.modifiers && item.modifiers.length > 0) {
        item.modifiers.forEach(m => {
          kot += `     * ${m.name || m}\n`;
        });
      }
    });

    kot += lineBreak;
    kot += "          ** EXPEDITE ORDER **            \n";
    return kot;
  }
}
