# FastFood — Project Memory & Operational Knowledge Base (`memory.md`)

> **FastFood**: Modern Fast-Food Point-of-Sale (POS) & Kitchen Operations System.  
> **Target Device**: 15.6" Touch Terminal (1920x1080) & Cashier Desktops.  
> **Key Priorities**: Ultra-simple UI, zero password barriers, single-click order routing, no clutter, plain words, fast cashier touch workflow.

---

## 1. Project Philosophy & Core Standards

FastFood is engineered for high-throughput fast-food counters, cloud kitchens, and takeaway branches. It eliminates operational complexity and friction:

1. **Instant Direct Access (Password-Free)**: The system opens directly into the active dashboard and cashier terminal without login gates, passwords, or lockout barriers.
2. **Speed & Cashier Efficiency**: Large touch targets, instant category filtering, size/modifier selection modals, coupon discounts, split tender, and automated change calculation.
3. **Live Kitchen Order Tracking (KDS)**: Real-time ticket stopwatch timers, status aging alerts, instant station filtering (`burger`, `fryer`, `pizza`, `drinks`), and a global slide-out drawer accessible from any screen without navigating away.
4. **Simple Cash Management**: Single-line starting cash, sales, cash in/out tracking, and end-of-day shift closing with expected vs counted reconciliation.
5. **Automated Recipe Inventory (BOM)**: Real-time deduction of raw ingredients as orders are completed.

---

## 2. Menu Catalog (All 17 Configured Items)

The POS menu contains 17 fast-food products organized into 7 clean category tabs:  
`All` | `Burgers` | `Fryer` | `Sides` | `Pizza` | `Drinks` | `Desserts`

| # | Item Name | Category | Station | Base Price | Size Variations | Popular Add-on Modifiers |
|---|:---|:---|:---|:---|:---|:---|
| 1 | **🍔 Zinger Burger** | `burgers` | `burger` | Rs. 550 | Regular (0), Double Zinger (+220) | Extra Cheese (+60), Jalapenos (+40), Extra Sauce (+30) |
| 2 | **🍔 Chicken Burger** | `burgers` | `burger` | Rs. 480 | Single Patty (0), Double Patty (+180) | Extra Cheese (+60), Grilled Onions (+30) |
| 3 | **🍔 Beef Burger** | `burgers` | `burger` | Rs. 620 | Single Patty (0), Double Patty (+260) | Extra Cheese (+60), Beef Bacon Strip (+100) |
| 4 | **🍗 Fried Chicken** | `fryer` | `fryer` | Rs. 490 | 2 Pcs (0), 3 Pcs (+220), 5 Pcs Mega (+550) | Hot & Spicy Seasoning (+30), Garlic Mayo Dip (+50) |
| 5 | **🍟 French Fries** | `sides` | `fryer` | Rs. 220 | Regular (0), Large (+90) | Chili Garlic Dip (+40), Peri Peri Dust (+30) |
| 6 | **🌭 Hot Dog** | `burgers` | `burger` | Rs. 380 | Classic (0), Cheesy Jumbo (+120) | Extra Melted Cheese (+60), Jalapenos (+40) |
| 7 | **🌮 Chicken Tacos** | `sides` | `burger` | Rs. 460 | 2 Tacos (0), 3 Tacos Feast (+180) | Extra Sour Cream (+50), Spicy Salsa (+30) |
| 8 | **🍕 Pizza** | `pizza` | `pizza` | Rs. 950 | Small 8" (-250), Medium 10" (0), Large 13" (+450) | Cheese Stuffed Crust (+200), Extra Pepperoni (+150) |
| 9 | **🥪 Chicken Sandwich** | `burgers` | `burger` | Rs. 420 | Classic Club (0), Spicy Grilled (+40) | Cheese Slice (+60), Boiled Egg (+40) |
| 10 | **🌯 Chicken Wrap** | `burgers` | `burger` | Rs. 450 | Crispy Tenders (0), Grilled BBQ (+30) | Melted Cheese (+60), Fiery Dip (+40) |
| 11 | **🧀 Cheese Fries** | `sides` | `fryer` | Rs. 380 | Regular (0), Mega Loaded (+140) | Sliced Jalapenos (+40), Beef Bacon Bits (+80) |
| 12 | **🍗 Chicken Nuggets** | `fryer` | `fryer` | Rs. 390 | 6 Pcs (0), 9 Pcs (+150), 12 Pcs Party (+280) | BBQ Dip Cup (+40), Honey Mustard (+40) |
| 13 | **🧅 Onion Rings** | `sides` | `fryer` | Rs. 290 | Regular 8 Pcs (0), Large 12 Pcs (+90) | Garlic Mayo Dip (+40) |
| 14 | **🥤 Cold Drink** | `drinks` | `drinks` | Rs. 120 | Can 330ml (0), Bottle 500ml (+40), 1.5L (+130) | Classic Cola (0), Lemon-Lime (0), Zero Sugar (0) |
| 15 | **🥛 Milkshake** | `drinks` | `drinks` | Rs. 380 | Vanilla (0), Chocolate (+40), Strawberry (+40), Oreo (+70) | Whipped Cream (+50), Chocolate Drizzle (+40) |
| 16 | **🍦 Ice Cream** | `desserts` | `drinks` | Rs. 190 | Waffle Cone (0), Sundae Cup (+30) | Rainbow Sprinkles (+30), Caramel Drizzle (+40) |
| 17 | **🍫 Chocolate Browni** | `desserts` | `drinks` | Rs. 280 | Classic Warm (0), Sizzling with Ice Cream (+120) | Hot Chocolate Fudge (+50), Crushed Walnuts (+40) |

---

## 3. Inventory & Raw Materials (BOM Engine)

Every order automatically deducts from the real-time stock of 19 tracked raw materials:
- `raw_bun`: Brioche Burger Buns (pcs)
- `raw_beef`: Prime Angus Beef Patties (patty)
- `raw_chicken`: Marinated Chicken Fillets (fillet)
- `raw_cheese`: Cheddar Cheese Slices (slice)
- `raw_fries`: Pre-cut Frozen Fries (g)
- `raw_sauce`: Secret Smash Sauce (ml)
- `raw_mayo`: Spicy Garlic Mayo (ml)
- `raw_oil`: Pure Frying Oil (ml)
- `raw_dough`: Fermented Pizza Dough (ball)
- `raw_mozzarella`: Grated Mozzarella (g)
- `raw_drink_can`: Soda Cans 330ml (can)
- `raw_nuggets`: Chicken Nuggets (pcs)
- `raw_onion_rings`: Breaded Onion Rings (pcs)
- `raw_hotdog_bun`: Hot Dog Buns (pcs)
- `raw_sausage`: Smoked Beef Sausages (pcs)
- `raw_tortilla`: Flour Tortillas (pcs)
- `raw_milk`: Fresh Dairy Milk (ml)
- `raw_ice_cream`: Ice Cream Mix (ml)
- `raw_brownie`: Chocolate Brownie Slices (pcs)

---

## 4. Key Workflows & Subsystems

### A. Point of Sale (Cashier)
- Menu search bar & horizontal category rail.
- Customization modal for sizes/variations & paid/free add-ons.
- Order types: Dine-in, Takeaway, Delivery.
- Order Hold & Resume capabilities.
- Discount code support: `SAVE10` (10% off), `VIP20` (20% off).
- Payment Tender modal: Cash with quick denomination buttons (+100, +500, +1000, +5000), Card payment, and Split tender.
- Printable thermal receipt modal.

### B. Kitchen Order System (KDS & Live Drawer)
- Real-time stopwatch timer on all tickets.
- Status aging classes:
  - `< 5 mins`: Green (on track)
  - `5 - 10 mins`: Orange (waiting)
  - `> 10 mins`: Red (urgent alert)
- Slide-out quick kitchen drawer opened via top bar button without losing active cart state.
- Station routing: Orders are filtered by `burger`, `fryer`, `pizza`, or `drinks`.

### C. Cash Management (Cash Drawer)
- Opening Float, Cash Sales, Cash In, Cash Out, Refunds, and In Drawer metric cards.
- Quick modals for recording cash in / cash out with note and reference.
- End-of-shift Z-report modal with difference calculation and prompt to open the next shift.

### D. Direct Operator Switching (No Passwords)
- Password barrier is completely removed for frictionless terminal operations.
- Default operator: `Ali (Cashier)`.
- Sidebar footer contains a clean `Switch` button that instantly toggles between `Ali (Cashier)` and `Tariq (Manager)` with a confirmation toast.

---

## 5. Codebase Architecture

```
c:\Users\PDC&S-STUDENT\Desktop\project 1\
├── index.html                 # App shell, navigation, views, modals, and bundle link
├── DESIGN.md                  # Semantic design system & UI tokens reference
├── memory.md                  # Persistent project memory & architecture reference
├── build_bundle.py            # Automated script to build js/bundle.js from modular sources
├── css/
│   ├── tokens.css             # Colors, typography, spacing, radius tokens
│   ├── layout.css             # App sidebar, top bar, main viewport
│   ├── dashboard.css          # Executive metrics, hourly chart, recent orders
│   ├── pos.css                # Product grid, search rail, cart, and payment summary
│   ├── kds.css                # Kitchen ticket cards, station tabs, slide-out drawer
│   ├── cash-drawer.css        # Cash metrics cards, ledger table, shift closing
│   └── components.css         # Modals (customizer, payment, receipt, cash in/out)
└── js/
    ├── bundle.js              # Standalone bundled script (works offline & over localhost)
    ├── app.js                 # Router, global navigation, toast alerts, operator switcher
    ├── state/
    │   ├── store.js           # Central reactive state store with localStorage persistence
    │   └── mockData.js        # 17 menu products, recipes, BOM, cash sessions, and users
    ├── pos/
    │   ├── cartEngine.js      # Pricing calculations, taxes, non-breaking currency formatting
    │   └── posUI.js           # Cashier terminal UI controller, search, checkout flow
    ├── kds/
    │   └── kdsEngine.js       # Prep timers, ticket dispatch, station routing, aging status
    ├── cash/
    │   └── cashDrawer.js      # Cash ledger, shift balance, expected drawer reconciliation
    ├── inventory/
    │   └── recipeEngine.js    # Automated ingredient depletion on sale, manual adjustments
    └── modules/
        └── modulesUI.js       # Dashboard, KDS board, drawer, cash drawer, reports, audit
```

---

## 6. Database & Persistence Layer (SQLite + REST API + Cloudflare Edge)

### A. SQLite Database (`fastfood.db`)
- **Engine**: Python native `sqlite3` (zero external dependencies).
- **Location**: `fastfood.db` in project root.
- **Relational Tables**:
  1. `categories` (Menu categories)
  2. `products` (Catalog with recipes, variations, and modifiers)
  3. `raw_materials` (Real-time BOM stock tracking)
  4. `orders` (Completed tickets, tokens, totals, payment methods)
  5. `kds_orders` (Live kitchen ticket states)
  6. `cash_sessions` (Register shifts and floats)
  7. `cash_transactions` (Audit-tracked Cash In, Cash Out, and Sales ledger)
  8. `audit_logs` (System activity and security trail)

### B. Unified Web & REST API Server (`server.py`)
- **Server**: `server.py` running on port `5501` (dual-stack IPv4 & IPv6).
- **URL**: `http://localhost:5501`
- **Command to launch**:
  ```powershell
  python -u server.py 5501
  ```
- **Complete REST API Endpoints**:
  - `GET /api/db/status`: Health check, table counts, database file size.
  - `GET /api/db/table?name=...&limit=...`: Table inspection for in-app Database viewer.
  - `GET /api/db/export`: Complete SQL dump backup download.
  - `POST /api/db/reset`: Re-seed database with factory default catalog.
  - `POST /api/db/clear`: Purge all dummy operational records (orders, tickets, ledger entries).
  - `GET /api/categories`: Read menu categories.
  - `POST /api/categories`: Create new category.
  - `PUT /api/categories/:id`: Update category.
  - `DELETE /api/categories/:id`: Delete category.
  - `GET /api/products`: Read products catalog (17 items).
  - `GET /api/products/:id`: Get single product details with variations & BOM recipe.
  - `POST /api/products`: Create new product.
  - `PUT /api/products/:id`: Update existing product.
  - `DELETE /api/products/:id`: Delete product.
  - `GET /api/inventory`: Read raw materials stock (19 items).
  - `POST /api/inventory/update`: Adjust raw stock.
  - `POST /api/inventory/wastage`: Record ingredient wastage.
  - `GET /api/orders`: Order history.
  - `GET /api/orders/:id`: Detailed ticket by ID or token.
  - `POST /api/orders`: Atomically insert order, deduct BOM raw inventory, dispatch to KDS, and record cash sale.
  - `GET /api/kds`: Active kitchen ticket queue.
  - `POST /api/kds`: Dispatch ticket to kitchen.
  - `POST /api/kds/status` & `PUT /api/kds/:id/status`: Update ticket status (`PENDING` -> `PREPARING` -> `READY` -> `SERVED`).
  - `POST /api/kds/time` & `PUT /api/kds/:id/time`: Synchronize ticket stopwatch elapsed timer.
  - `GET /api/cash/session`: Active shift register session and expected drawer reconciliation.
  - `POST /api/cash/session/open`: Open new shift with starting float.
  - `POST /api/cash/session/close`: Close shift with counted cash, variance, and notes.
  - `GET /api/cash/transactions`: Read cash ledger transactions.
  - `POST /api/cash/transaction`: Record Cash In / Cash Out.
  - `GET /api/reports/summary`: Fast aggregated sales, payment distribution, order types, and hourly breakdown.
  - `GET /api/audit`: System audit trail.
  - `POST /api/audit`: Record audit log.

### C. Cloudflare Pages Advanced Edge Worker (`_worker.js`)
- Runs directly on the Cloudflare Global Edge network.
- Intercepts all `/api/*` requests on `https://fastfood-pos-dwl.pages.dev`, providing live REST responses in the cloud.
- Automatically uploaded and deployed via `deploy_cloudflare.py`.

### D. Frontend Synchronization & In-App Viewer
- **Adapter**: `js/state/dbAdapter.js` connects store to `/api/*` with transparent offline fallback.
- **In-App Database Manager**: Accessible via sidebar nav (`Database` tab). Features live statistics cards, tabbed table inspector for all 8 tables, SQL dump export button, and database reset.

---

## 7. Build & Operational Commands

### Rebuilding Standalone Bundle
Whenever changes are made to modular files in `js/`:
```powershell
python build_bundle.py
```
This automatically updates `js/bundle.js`.

### Running the Live System
```powershell
python -u server.py 5501
```
Open in browser at: `http://localhost:5501`

---

## 8. Cloudflare Pages Deployment

- **Project Name**: `fastfood-pos`
- **Live Production URL**: [https://fastfood-pos-dwl.pages.dev](https://fastfood-pos-dwl.pages.dev)
- **Account ID**: `3416b41cb65e87044027bd5303691a8d`
- **Deploy Script**: `deploy_cloudflare.py`
  - Automatically compiles the latest JS bundle (`build_bundle.py`).
  - Directly uploads missing assets via Cloudflare Direct Upload REST API.
  - Generates atomic manifest deployment.
- **Re-deploy Command**:
  ```powershell
  python deploy_cloudflare.py
  ```

