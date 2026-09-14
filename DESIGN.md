# Google Stitch Semantic Design Specification: ApexPOS — Enterprise Restaurant Operations

> **Single Source of Truth for Google Stitch Screen Generation**  
> Calibrated using `stitch-design-taste` and `taste-skill` standards.  
> **Dials**: Visual Density: 8/10 (High-Speed Cockpit) | Design Variance: 6/10 (Offset Asymmetric) | Motion Intensity: 5/10 (Snappy Tactical Fluidity).

---

## 1. Visual Atmosphere & Philosophy
- **Identity**: Tactical High-End Culinary Cockpit. Designed for high-volume fast-food environments where cashier speed, error-free order entry, and kitchen urgency are mission critical.
- **Surface Depth**: Layered dark charcoal and zinc surfaces with subtle micro-borders (`1px solid #27272a`). Never flat, never noisy. No pure black `#000000` (causes eye fatigue) and strictly **zero** purple/magenta neon glows or blurry dropshadows.
- **Ergonomics**: Primary touch targets $\ge 48\text{px} \times 48\text{px}$ for tablet/touchscreen durability. High tactile response with active scale down (`transform: scale(0.97)` on click) and crisp haptic feedback cues.

---

## 2. Color Calibration & Roles

| Token | Hex Value | Role & Usage |
| :--- | :--- | :--- |
| `--bg-canvas` | `#09090b` | Main deep background (Zinc-950) |
| `--bg-surface` | `#121215` | Panel containers, sidebar, POS item grid base |
| `--bg-elevated` | `#18181b` | Modals, active cart drawer, elevated cards |
| `--bg-hover` | `#27272a` | Hover states, secondary action buttons |
| `--border-subtle`| `#27272a` | Card boundaries, dividers, table borders |
| `--border-focus` | `#3f3f46` | Active input outlines, selected item highlight |
| `--text-primary` | `#f4f4f5` | Main titles, item names, numeric totals |
| `--text-secondary`| `#a1a1aa` | Item descriptions, category subtitles, metadata |
| `--text-muted` | `#71717a` | Order timestamps, inactive tabs, disabled hints |
| `--accent-amber` | `#f59e0b` | Primary branding, tender actions, pending order alert |
| `--accent-emerald`| `#10b981` | Paid status, KDS Ready state, cash in balance |
| `--accent-crimson`| `#ef4444` | Voids, refunds, low stock alerts, KDS delayed orders (>10m) |
| `--accent-sky` | `#0ea5e9` | Delivery orders, rider status badges, info notes |

---

## 3. Typographic Architecture
- **Font Stack**:
  - **Display / Brand / Labels**: `Outfit`, system-ui, -apple-system, sans-serif. Letter-spacing `-0.02em`.
  - **Data, Pricing & Counters**: `Geist Mono`, 'JetBrains Mono', monospace. Tabular numbers enabled (`font-variant-numeric: tabular-nums`) so decimal points align vertically in carts and cash drawers.
- **Scale Hierarchy**:
  - `Display Large`: `1.75rem (28px)` / `700` (Grand total, daily sales readout).
  - `Heading`: `1.25rem (20px)` / `600` (Modal headers, KDS ticket numbers).
  - `Subheading`: `0.95rem (15px)` / `600` (Product names, table headers).
  - `Body`: `0.875rem (14px)` / `400` (Modifiers, customer address, cashier notes).
  - `Caption/Mono`: `0.75rem (12px)` / `500` (Timestamps, SKU, tax codes, token IDs).

---

## 4. Component Layout Guidelines for Stitch Screen Generation

### A. POS Terminal Viewport
- **Split Ratio**: Asymmetric 65/35 grid:
  - **Left Area (65%)**: Top category filter rail (horizontal swipeable pills), search bar with barcode scan indicator, 3-to-4 column responsive product cards showing price, size variations badge, and stock count pill.
  - **Right Area (35%)**: Sticky Cart & Order Summary panel. Shows customer type selector (Dine-in / Takeaway / Delivery), order token `#`, scrollable line items with modifier breakdown, discount/coupon chips, tax line items, and an oversized action bar (`Pay / Hold / Cancel`).

### B. Kitchen Display System (KDS) Viewport
- Fullscreen high-visibility dark matrix.
- Ticket cards ordered chronologically with real-time prep timers.
- Dynamic color badges:
  - `< 5 mins`: Emerald border (`#10b981`)
  - `5 - 10 mins`: Amber border (`#f59e0b`)
  - `> 10 mins`: Crimson flashing border (`#ef4444`) with urgent audio ping.
- Station selector tabs: `ALL`, `BURGER STATION`, `FRYER & SIDES`, `BEVERAGES`.

### C. Cash Management & Shift Drawer
- Tabular ledger with colored badge badges (`CASH IN`, `CASH OUT`, `OPENING`, `REFUND`).
- Shift Summary Card with mathematical breakdown:
  `Opening Cash + Cash Sales + Cash In - Cash Out - Refunds = Expected Cash`
  Dynamic difference pill (`Balanced`, `Over`, `Short`) with mandatory remark input for discrepancies.

---

## 5. Explicit Anti-Patterns (Banned AI Slop)
- ❌ **No Centered Hero Grids**: Functional enterprise tools prioritize density and workflow speed over decorative center alignments.
- ❌ **No Purple Glows or Gradients**: Strict prohibition against AI-default violet gradients and button drop-glows.
- ❌ **No Generic Icons without Labels**: Every critical operational button (Void, Refund, Hold) must carry descriptive text alongside its icon.
- ❌ **No Missing Decimal Alignments**: All currency representations must be formatted with commas and decimals (e.g. `Rs. 1,450.00`).
