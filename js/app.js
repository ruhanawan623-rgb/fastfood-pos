/* ==========================================================================
   ApexPOS - Application Shell & Navigation Router
   ========================================================================== */

import { store } from './state/store.js';
import { POSUI } from './pos/posUI.js';
import { modulesUI } from './modules/modulesUI.js';

// Global Toast System
window.showToast = function(message, type = 'info') {
  const shelf = document.getElementById('toast-shelf');
  if (!shelf) return;

  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  const icon = type === 'success' ? '✓' : (type === 'error' ? '✕' : 'ℹ');
  toast.innerHTML = `<span>${icon}</span><span>${message}</span>`;
  shelf.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 200ms ease';
    setTimeout(() => toast.remove(), 200);
  }, 3200);
};

document.addEventListener('DOMContentLoaded', () => {
  const posUI = new POSUI();

  // Initialize Sub-systems
  posUI.init();
  modulesUI.init();

  // Navigation Routing
  const navItems = document.querySelectorAll('.nav-item');
  const moduleViews = document.querySelectorAll('.module-view');
  const pageTitle = document.getElementById('top-bar-page-title');

  function switchView(viewName) {
    navItems.forEach(item => {
      if (item.dataset.view === viewName) {
        item.classList.add('active');
      } else {
        item.classList.remove('active');
      }
    });

    moduleViews.forEach(view => {
      if (view.id === `view-${viewName}`) {
        view.classList.add('active');
      } else {
        view.classList.remove('active');
      }
    });

    store.setView(viewName);

    // Update Header Title
    const titles = {
      'dashboard': 'Dashboard',
      'pos': 'Cashier',
      'kds': 'Kitchen',
      'cash': 'Cash Drawer',
      'inventory': 'Stock',
      'orders': 'Orders',
      'database': 'Database & Tables',
      'reports': 'Reports',
      'audit': 'Activity Log',
      'settings': 'Settings'
    };

    if (pageTitle) {
      pageTitle.innerText = titles[viewName] || 'Dashboard';
    }

    // Module-specific refresh triggers
    if (viewName === 'dashboard') modulesUI.renderDashboard();
    if (viewName === 'kds') modulesUI.renderKDSTickets();
    if (viewName === 'cash') modulesUI.renderCashDrawer();
    if (viewName === 'inventory') modulesUI.renderInventory();
    if (viewName === 'orders') modulesUI.renderOrders();
    if (viewName === 'database') modulesUI.renderDatabaseView();
    if (viewName === 'reports') modulesUI.renderReports();
    if (viewName === 'audit') modulesUI.renderAuditLogs();
  }

  window.switchView = switchView;

  // Sidebar Elements & Mobile Drawer Controls
  const sidebar = document.querySelector('.app-sidebar');
  const sidebarToggle = document.getElementById('sidebar-toggle-btn');
  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
  const sidebarBackdrop = document.getElementById('sidebar-backdrop');

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
  }

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
  }

  if (mobileMenuBtn) {
    mobileMenuBtn.addEventListener('click', () => {
      if (sidebar && sidebar.classList.contains('mobile-open')) {
        closeMobileSidebar();
      } else {
        openMobileSidebar();
      }
    });
  }

  if (sidebarCloseBtn) {
    sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  }

  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeMobileSidebar);
  }

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      const view = item.dataset.view;
      if (view) {
        switchView(view);
        closeMobileSidebar(); // Close off-canvas drawer upon view selection
      }
    });
  });

  // Desktop Sidebar Collapse Toggle
  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('collapsed');
    });
  }

  // Modal Close Events
  document.querySelectorAll('.modal-close-btn, .modal-cancel-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const modal = e.target.closest('.modal-overlay');
      if (modal) modal.classList.remove('active');
    });
  });

  // Modal Backdrop Click to close
  document.querySelectorAll('.modal-overlay').forEach(modal => {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.classList.remove('active');
      }
    });
  });

  // Tender Method Selection Switcher inside Payment Modal
  const tenderMethodBtns = document.querySelectorAll('.tender-method-btn');
  tenderMethodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tenderMethodBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cashSection = document.getElementById('tender-cash-section');
      if (cashSection) {
        cashSection.style.display = btn.dataset.method === 'Cash' ? 'block' : 'none';
      }
    });
  });

  // Light / Dark Theme Management (Taste-Skill)
  const themeToggleBtn = document.getElementById('theme-toggle-btn');
  const themeBtnLabel = document.getElementById('theme-btn-label');
  const settingsThemeSelect = document.getElementById('settings-theme-select');
  const savedTheme = localStorage.getItem('FASTFOOD_THEME') || 'dark';

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('FASTFOOD_THEME', theme);
    if (themeBtnLabel) {
      themeBtnLabel.innerText = theme === 'light' ? 'Dark mode' : 'Light mode';
    }
    if (settingsThemeSelect) {
      settingsThemeSelect.value = theme;
    }
  }

  applyTheme(savedTheme);

  if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      applyTheme(next);
      window.showToast(`Switched to ${next} mode`, "info");
    });
  }

  if (settingsThemeSelect) {
    settingsThemeSelect.addEventListener('change', (e) => {
      applyTheme(e.target.value);
      window.showToast(`Switched to ${e.target.value} mode`, "info");
    });
  }

  // ==========================================================================
  // Cashier Profile & Operator Switcher (Simple POS - No Passwords)
  // ==========================================================================
  const userAvatar = document.getElementById('sidebar-user-avatar');
  const userName = document.getElementById('sidebar-user-name');
  const userRole = document.getElementById('sidebar-user-role');
  const switchUserBtn = document.getElementById('sidebar-switch-user-btn');

  function updateUserProfileUI(user) {
    if (!user) return;
    if (userName) userName.innerText = user.name;
    if (userRole) userRole.innerText = user.role;
    if (userAvatar) {
      const initials = user.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
      userAvatar.innerText = initials || 'AL';
    }
  }

  // Set active operator profile immediately
  const activeUser = store.state.currentUser || { name: 'Ali', role: 'Cashier' };
  updateUserProfileUI(activeUser);

  // Single-click operator switcher (Ali / Tariq) without password barrier
  if (switchUserBtn) {
    switchUserBtn.addEventListener('click', () => {
      const newUser = store.switchUser();
      updateUserProfileUI(newUser);
      window.showToast(`Active operator: ${newUser.name} (${newUser.role})`, "info");
    });
  }

  // Load Initial View from Store (Default to Dashboard)
  switchView('dashboard');

  console.log("ApexPOS Initialized with gstack, taste-skill, and Stitch integration.");
});
