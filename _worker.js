/**
 * Cloudflare Pages Advanced Edge Worker for FastFood POS
 * Intercepts /api/* requests on the Cloudflare global edge network,
 * providing live REST API endpoints and state persistence for the online deployment.
 * Static assets are passed through via env.ASSETS.fetch(request).
 */

// Initial Seed Data for Cloudflare Edge
const INITIAL_CATEGORIES = [
  { id: "all", name: "All", icon: "" },
  { id: "burgers", name: "Burgers", icon: "" },
  { id: "fryer", name: "Fryer", icon: "" },
  { id: "sides", name: "Sides", icon: "" },
  { id: "pizza", name: "Pizza", icon: "" },
  { id: "drinks", name: "Drinks", icon: "" },
  { id: "desserts", name: "Desserts", icon: "" }
];

const INITIAL_PRODUCTS = [
  {
    id: "p_zinger", name: "🍔 Zinger Burger", category_id: "burgers", price: 550,
    desc: "Crispy golden spiced chicken fillet, spicy mayo, crisp iceberg lettuce on toasted sesame bun.",
    stock: 45, station: "burger",
    recipe: [{ rawId: "raw_bun", qty: 1, unit: "pcs" }, { rawId: "raw_chicken", qty: 1, unit: "fillet" }, { rawId: "raw_cheese", qty: 1, unit: "slice" }, { rawId: "raw_mayo", qty: 25, unit: "ml" }],
    variations: [{ name: "Regular", priceDelta: 0 }, { name: "Double Zinger", priceDelta: 220 }],
    modifiers: [{ id: "m_cheese", name: "Extra Cheese", price: 60 }, { id: "m_jalapeno", name: "Spicy Jalapenos", price: 40 }, { id: "m_sauce", name: "Extra Sauce Dip", price: 30 }]
  },
  {
    id: "p_chicken_burger", name: "🍔 Chicken Burger", category_id: "burgers", price: 480,
    desc: "Tender seasoned minced chicken patty, fresh garlic mayo, lettuce, soft brioche bun.",
    stock: 50, station: "burger",
    recipe: [{ rawId: "raw_bun", qty: 1, unit: "pcs" }, { rawId: "raw_chicken", qty: 1, unit: "fillet" }, { rawId: "raw_mayo", qty: 20, unit: "ml" }],
    variations: [{ name: "Single Patty", priceDelta: 0 }, { name: "Double Patty", priceDelta: 180 }],
    modifiers: [{ id: "m_cheese", name: "Extra Cheese", price: 60 }, { id: "m_onions", name: "Grilled Onions", price: 30 }]
  },
  {
    id: "p_beef_burger", name: "🍔 Beef Burger", category_id: "burgers", price: 620,
    desc: "100% prime beef patty, caramelized onions, melted cheddar slice, signature smash sauce.",
    stock: 40, station: "burger",
    recipe: [{ rawId: "raw_bun", qty: 1, unit: "pcs" }, { rawId: "raw_beef", qty: 1, unit: "patty" }, { rawId: "raw_cheese", qty: 1, unit: "slice" }, { rawId: "raw_sauce", qty: 20, unit: "ml" }],
    variations: [{ name: "Single Patty", priceDelta: 0 }, { name: "Double Patty", priceDelta: 260 }],
    modifiers: [{ id: "m_cheese", name: "Extra Cheese", price: 60 }, { id: "m_bacon", name: "Beef Bacon Strip", price: 100 }, { id: "m_no_onions", name: "No Onions", price: 0 }]
  },
  {
    id: "p_fried_chicken", name: "🍗 Fried Chicken", category_id: "fryer", price: 490,
    desc: "Crispy spiced bone-in chicken with 12-spice secret golden coating and garlic dip.",
    stock: 35, station: "fryer",
    recipe: [{ rawId: "raw_chicken", qty: 2, unit: "fillet" }, { rawId: "raw_oil", qty: 50, unit: "ml" }],
    variations: [{ name: "2 Pieces", priceDelta: 0 }, { name: "3 Pieces", priceDelta: 220 }, { name: "5 Pieces Mega", priceDelta: 550 }],
    modifiers: [{ id: "m_spicy", name: "Hot & Spicy Seasoning", price: 30 }, { id: "m_garlic_dip", name: "Garlic Mayo Dip", price: 50 }]
  },
  {
    id: "p_french_fries", name: "🍟 French Fries", category_id: "sides", price: 220,
    desc: "Skinny golden salted potato fries, fried crisp on order.",
    stock: 60, station: "fryer",
    recipe: [{ rawId: "raw_fries", qty: 180, unit: "g" }, { rawId: "raw_oil", qty: 30, unit: "ml" }],
    variations: [{ name: "Regular", priceDelta: 0 }, { name: "Large", priceDelta: 90 }],
    modifiers: [{ id: "m_chili_garlic", name: "Chili Garlic Dip", price: 40 }, { id: "m_peri_peri", name: "Peri Peri Dust", price: 30 }]
  },
  {
    id: "p_hot_dog", name: "🌭 Hot Dog", category_id: "burgers", price: 380,
    desc: "Smoked beef sausage nestled in soft steamed roll, mustard, caramelized relish.",
    stock: 30, station: "burger",
    recipe: [{ rawId: "raw_hotdog_bun", qty: 1, unit: "pcs" }, { rawId: "raw_sausage", qty: 1, unit: "pcs" }, { rawId: "raw_sauce", qty: 15, unit: "ml" }],
    variations: [{ name: "Classic", priceDelta: 0 }, { name: "Cheesy Jumbo", priceDelta: 120 }],
    modifiers: [{ id: "m_cheese", name: "Extra Melted Cheese", price: 60 }, { id: "m_jalapenos", name: "Jalapenos", price: 40 }]
  },
  {
    id: "p_chicken_tacos", name: "🌮 Chicken Tacos", category_id: "sides", price: 460,
    desc: "Two crispy tortillas filled with spiced grilled chicken strips, shredded lettuce, salsa.",
    stock: 25, station: "burger",
    recipe: [{ rawId: "raw_tortilla", qty: 2, unit: "pcs" }, { rawId: "raw_chicken", qty: 1, unit: "fillet" }, { rawId: "raw_mayo", qty: 20, unit: "ml" }],
    variations: [{ name: "2 Tacos", priceDelta: 0 }, { name: "3 Tacos Feast", priceDelta: 180 }],
    modifiers: [{ id: "m_sour_cream", name: "Extra Sour Cream", price: 50 }, { id: "m_spicy_salsa", name: "Spicy Salsa", price: 30 }]
  },
  {
    id: "p_pizza", name: "🍕 Pizza", category_id: "pizza", price: 950,
    desc: "Stone-baked crust, rich marinara sauce, loaded melted mozzarella cheese, herbs.",
    stock: 20, station: "pizza",
    recipe: [{ rawId: "raw_dough", qty: 1, unit: "ball" }, { rawId: "raw_mozzarella", qty: 200, unit: "g" }, { rawId: "raw_sauce", qty: 60, unit: "ml" }],
    variations: [{ name: "Small 8-Inch", priceDelta: -250 }, { name: "Medium 10-Inch", priceDelta: 0 }, { name: "Large 13-Inch", priceDelta: 450 }],
    modifiers: [{ id: "m_stuffed_crust", name: "Cheese Stuffed Crust", price: 200 }, { id: "m_extra_cheese", name: "Extra Mozzarella", price: 140 }]
  },
  {
    id: "p_chicken_sandwich", name: "🥪 Chicken Sandwich", category_id: "burgers", price: 420,
    desc: "Triple decker toasted club sandwich with roasted chicken, boiled egg slice, mayo.",
    stock: 35, station: "burger",
    recipe: [{ rawId: "raw_bun", qty: 1, unit: "pcs" }, { rawId: "raw_chicken", qty: 1, unit: "fillet" }, { rawId: "raw_mayo", qty: 20, unit: "ml" }],
    variations: [{ name: "Classic Club", priceDelta: 0 }, { name: "Spicy Grilled", priceDelta: 40 }],
    modifiers: [{ id: "m_cheese", name: "Cheese Slice", price: 60 }]
  },
  {
    id: "p_chicken_wrap", name: "🌯 Chicken Wrap", category_id: "burgers", price: 450,
    desc: "Flour tortilla wrap stuffed with crispy chicken tenders, crunchy lettuce, fiery dip.",
    stock: 30, station: "burger",
    recipe: [{ rawId: "raw_tortilla", qty: 1, unit: "pcs" }, { rawId: "raw_chicken", qty: 1, unit: "fillet" }, { rawId: "raw_mayo", qty: 25, unit: "ml" }],
    variations: [{ name: "Crispy Tenders", priceDelta: 0 }, { name: "Grilled BBQ", priceDelta: 30 }],
    modifiers: [{ id: "m_melted_cheese", name: "Melted Cheese", price: 60 }]
  },
  {
    id: "p_cheese_fries", name: "🧀 Cheese Fries", category_id: "sides", price: 380,
    desc: "Hot crisp french fries topped with warm cheddar sauce and sprinkle of paprika.",
    stock: 40, station: "fryer",
    recipe: [{ rawId: "raw_fries", qty: 200, unit: "g" }, { rawId: "raw_cheese", qty: 2, unit: "slice" }, { rawId: "raw_oil", qty: 30, unit: "ml" }],
    variations: [{ name: "Regular", priceDelta: 0 }, { name: "Mega Loaded", priceDelta: 140 }],
    modifiers: [{ id: "m_jalapenos", name: "Sliced Jalapenos", price: 40 }]
  },
  {
    id: "p_chicken_nuggets", name: "🍗 Chicken Nuggets", category_id: "fryer", price: 390,
    desc: "Tender breaded all-white-meat chicken bites fried to crispy golden perfection.",
    stock: 50, station: "fryer",
    recipe: [{ rawId: "raw_nuggets", qty: 6, unit: "pcs" }, { rawId: "raw_oil", qty: 40, unit: "ml" }],
    variations: [{ name: "6 Pieces", priceDelta: 0 }, { name: "9 Pieces", priceDelta: 150 }, { name: "12 Pieces Party", priceDelta: 280 }],
    modifiers: [{ id: "m_bbq_dip", name: "BBQ Dip Cup", price: 40 }]
  },
  {
    id: "p_onion_rings", name: "🧅 Onion Rings", category_id: "sides", price: 290,
    desc: "Thick-cut fresh onion slices batter-dipped and fried crunchy golden.",
    stock: 35, station: "fryer",
    recipe: [{ rawId: "raw_onion_rings", qty: 8, unit: "pcs" }, { rawId: "raw_oil", qty: 30, unit: "ml" }],
    variations: [{ name: "Regular 8 Pcs", priceDelta: 0 }, { name: "Large 12 Pcs", priceDelta: 90 }],
    modifiers: [{ id: "m_garlic_dip", name: "Garlic Mayo Dip", price: 40 }]
  },
  {
    id: "p_cold_drink", name: "🥤 Cold Drink", category_id: "drinks", price: 120,
    desc: "Refreshing carbonated soda served ice cold.",
    stock: 150, station: "drinks",
    recipe: [{ rawId: "raw_drink_can", qty: 1, unit: "can" }],
    variations: [{ name: "Can 330ml", priceDelta: 0 }, { name: "Bottle 500ml", priceDelta: 40 }, { name: "1.5L Family", priceDelta: 130 }],
    modifiers: [{ id: "m_cola", name: "Classic Cola", price: 0 }, { id: "m_lemon", name: "Lemon-Lime", price: 0 }]
  },
  {
    id: "p_milkshake", name: "🥛 Milkshake", category_id: "drinks", price: 380,
    desc: "Thick, creamy dairy milkshake blended with premium gelato ice cream.",
    stock: 45, station: "drinks",
    recipe: [{ rawId: "raw_milk", qty: 250, unit: "ml" }, { rawId: "raw_ice_cream", qty: 100, unit: "ml" }],
    variations: [{ name: "Vanilla", priceDelta: 0 }, { name: "Chocolate", priceDelta: 40 }, { name: "Strawberry", priceDelta: 40 }, { name: "Oreo Crunch", priceDelta: 70 }],
    modifiers: [{ id: "m_whipped_cream", name: "Whipped Cream", price: 50 }]
  },
  {
    id: "p_ice_cream", name: "🍦 Ice Cream", category_id: "desserts", price: 190,
    desc: "Velvety smooth soft-serve dairy ice cream in a crisp waffle cone or sundae cup.",
    stock: 50, station: "drinks",
    recipe: [{ rawId: "raw_ice_cream", qty: 150, unit: "ml" }],
    variations: [{ name: "Waffle Cone", priceDelta: 0 }, { name: "Sundae Cup", priceDelta: 30 }],
    modifiers: [{ id: "m_sprinkles", name: "Rainbow Sprinkles", price: 30 }]
  },
  {
    id: "p_chocolate_brownie", name: "🍫 Chocolate Browni", category_id: "desserts", price: 280,
    desc: "Warm fudgy dark chocolate brownie packed with melted chocolate chips.",
    stock: 30, station: "drinks",
    recipe: [{ rawId: "raw_brownie", qty: 1, unit: "pcs" }],
    variations: [{ name: "Classic Warm", priceDelta: 0 }, { name: "Sizzling with Ice Cream", priceDelta: 120 }],
    modifiers: [{ id: "m_hot_fudge", name: "Hot Chocolate Fudge", price: 50 }]
  }
];

const INITIAL_RAW_MATERIALS = [
  { id: "raw_bun", name: "Brioche Burger Buns", currentStock: 120, unit: "pcs", minStock: 30, costPerUnit: 45 },
  { id: "raw_beef", name: "Prime Angus Beef Patties", currentStock: 85, unit: "patty", minStock: 25, costPerUnit: 160 },
  { id: "raw_chicken", name: "Marinated Chicken Fillets", currentStock: 90, unit: "fillet", minStock: 20, costPerUnit: 130 },
  { id: "raw_cheese", name: "Cheddar Cheese Slices", currentStock: 140, unit: "slice", minStock: 40, costPerUnit: 35 },
  { id: "raw_fries", name: "Pre-cut Frozen Fries", currentStock: 25000, unit: "g", minStock: 5000, costPerUnit: 0.8 },
  { id: "raw_sauce", name: "Secret Smash Sauce", currentStock: 3500, unit: "ml", minStock: 800, costPerUnit: 1.2 },
  { id: "raw_mayo", name: "Spicy Garlic Mayo", currentStock: 4000, unit: "ml", minStock: 1000, costPerUnit: 1.1 },
  { id: "raw_oil", name: "Pure Frying Oil", currentStock: 18000, unit: "ml", minStock: 4000, costPerUnit: 0.6 },
  { id: "raw_dough", name: "Fermented Pizza Dough", currentStock: 40, unit: "ball", minStock: 15, costPerUnit: 80 },
  { id: "raw_mozzarella", name: "Grated Mozzarella", currentStock: 8500, unit: "g", minStock: 2000, costPerUnit: 2.2 },
  { id: "raw_drink_can", name: "Soda Cans 330ml", currentStock: 180, unit: "can", minStock: 50, costPerUnit: 85 },
  { id: "raw_nuggets", name: "Chicken Nuggets", currentStock: 300, unit: "pcs", minStock: 60, costPerUnit: 30 },
  { id: "raw_onion_rings", name: "Breaded Onion Rings", currentStock: 240, unit: "pcs", minStock: 50, costPerUnit: 20 },
  { id: "raw_hotdog_bun", name: "Hot Dog Buns", currentStock: 50, unit: "pcs", minStock: 15, costPerUnit: 40 },
  { id: "raw_sausage", name: "Smoked Beef Sausages", currentStock: 50, unit: "pcs", minStock: 15, costPerUnit: 90 },
  { id: "raw_tortilla", name: "Flour Tortillas", currentStock: 80, unit: "pcs", minStock: 20, costPerUnit: 30 },
  { id: "raw_milk", name: "Fresh Dairy Milk", currentStock: 12000, unit: "ml", minStock: 3000, costPerUnit: 0.2 },
  { id: "raw_ice_cream", name: "Ice Cream Mix", currentStock: 15000, unit: "ml", minStock: 3000, costPerUnit: 0.5 },
  { id: "raw_brownie", name: "Chocolate Brownie Slices", currentStock: 45, unit: "pcs", minStock: 10, costPerUnit: 110 }
];

// In-Memory Edge State (persists per worker instance)
let edgeCategories = [...INITIAL_CATEGORIES];
let edgeProducts = [...INITIAL_PRODUCTS];
let edgeInventory = [...INITIAL_RAW_MATERIALS];
let edgeOrders = [];
let edgeKdsOrders = [];
let edgeCashSession = {
  id: "CS-001",
  branch_id: "branch-01",
  user_id: "u-ali",
  cashier_name: "Ali (Cashier)",
  status: "OPEN",
  opened_at: new Date().toISOString(),
  opening_cash: 10000,
  cash_sales: 0,
  cash_in: 0,
  cash_out: 0,
  refunds: 0
};
let edgeCashTransactions = [];
let edgeAuditLogs = [
  {
    id: `LOG-${Date.now()}`,
    timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
    user: "System",
    action: "EDGE_READY",
    details: "Cloudflare Edge serverless backend online"
  }
];

function jsonResponse(data, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      "Content-Type": "application/json; charset=utf-8",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
      "Cache-Control": "no-cache, no-store, must-revalidate"
    }
  });
}

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname.replace(/\/$/, "");
    const method = request.method;

    // Handle OPTIONS Preflight
    if (method === "OPTIONS") {
      return new Response(null, {
        status: 200,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type, Authorization",
          "Content-Length": "0"
        }
      });
    }

    // Intercept only /api/* routes
    if (path.startsWith("/api")) {
      try {
        let body = {};
        if (["POST", "PUT", "PATCH"].includes(method)) {
          try {
            body = await request.json();
          } catch (e) {
            body = {};
          }
        }

        // 1. Health Status
        if (path === "/api/db/status" && method === "GET") {
          return jsonResponse({
            status: "connected",
            engine: "Cloudflare Edge v4",
            databaseFile: "Cloudflare Edge Memory / D1",
            fileSizeBytes: 81920,
            fileSizeFormatted: "80.0 KB",
            tableCounts: {
              categories: edgeCategories.length,
              products: edgeProducts.length,
              raw_materials: edgeInventory.length,
              orders: edgeOrders.length,
              kds_orders: edgeKdsOrders.length,
              cash_sessions: 1,
              cash_transactions: edgeCashTransactions.length,
              audit_logs: edgeAuditLogs.length
            },
            totalRecords: edgeCategories.length + edgeProducts.length + edgeInventory.length + edgeOrders.length + edgeKdsOrders.length + edgeCashTransactions.length + edgeAuditLogs.length + 1,
            lastChecked: new Date().toISOString().replace('T', ' ').substring(0, 19)
          });
        }

        // 2. Table Data Inspector
        if (path === "/api/db/table" && method === "GET") {
          const tableName = url.searchParams.get("name") || "products";
          let rows = [];
          if (tableName === "products") rows = edgeProducts;
          else if (tableName === "categories") rows = edgeCategories;
          else if (tableName === "raw_materials") rows = edgeInventory;
          else if (tableName === "orders") rows = edgeOrders;
          else if (tableName === "kds_orders") rows = edgeKdsOrders;
          else if (tableName === "cash_sessions") rows = [edgeCashSession];
          else if (tableName === "cash_transactions") rows = edgeCashTransactions;
          else if (tableName === "audit_logs") rows = edgeAuditLogs;
          return jsonResponse({ table: tableName, count: rows.length, rows: rows });
        }

        // 3. Products
        if (path === "/api/products" && method === "GET") {
          return jsonResponse(edgeProducts);
        }

        if (path === "/api/products" && method === "POST") {
          const newProd = {
            id: body.id || `p_${Date.now()}`,
            name: body.name || "Untitled",
            category_id: body.categoryId || "burgers",
            price: Number(body.price || 0),
            desc: body.desc || "",
            stock: Number(body.stock || 50),
            station: body.station || "burger",
            recipe: body.recipe || [],
            variations: body.variations || [],
            modifiers: body.modifiers || []
          };
          edgeProducts.push(newProd);
          return jsonResponse({ success: true, id: newProd.id }, 201);
        }

        // 4. Categories
        if (path === "/api/categories" && method === "GET") {
          return jsonResponse(edgeCategories);
        }

        // 5. Inventory (Raw materials)
        if (path === "/api/inventory" && method === "GET") {
          return jsonResponse(edgeInventory);
        }

        if (path === "/api/inventory/update" && method === "POST") {
          const item = edgeInventory.find(r => r.id === body.id);
          if (item) {
            item.currentStock = Number(body.stock);
            return jsonResponse({ success: true });
          }
          return jsonResponse({ success: false, error: "Item not found" }, 404);
        }

        // 6. Orders
        if (path === "/api/orders" && method === "GET") {
          return jsonResponse(edgeOrders);
        }

        if (path === "/api/orders" && method === "POST") {
          const orderId = body.id || `ORD-${Date.now()}`;
          const token = body.token || "T-999";
          const total = Number(body.total || body.totals?.grandTotal || 0);
          const paymentMethod = body.paymentMethod || "Cash";
          const cashier = body.cashier || "Ali";
          const items = body.items || [];

          // Save order
          const newOrder = {
            id: orderId,
            token,
            order_time: body.time || new Date().toLocaleTimeString(),
            order_type: body.orderType || "dine-in",
            total,
            payment_method: paymentMethod,
            cashier,
            status: "COMPLETED",
            items,
            created_at: new Date().toISOString()
          };
          edgeOrders.unshift(newOrder);

          // Deduct BOM stock
          items.forEach(cartItem => {
            const qty = cartItem.qty || 1;
            (cartItem.recipe || []).forEach(ing => {
              const raw = edgeInventory.find(r => r.id === ing.rawId);
              if (raw) {
                raw.currentStock = Math.max(0, raw.currentStock - (ing.qty * qty));
              }
            });
          });

          // If Cash, update cash drawer & record transaction
          if (paymentMethod.toLowerCase() === "cash" && edgeCashSession.status === "OPEN") {
            edgeCashSession.cash_sales = (edgeCashSession.cash_sales || 0) + total;
            edgeCashTransactions.unshift({
              id: `CT-${Date.now().toString().slice(-6)}`,
              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
              type: "SALE",
              reason: `Order #${token}`,
              amount: total,
              user: cashier,
              method: "Cash",
              reference: orderId
            });
          }

          // Auto-dispatch to KDS
          edgeKdsOrders.unshift({
            id: orderId,
            token,
            order_type: body.orderType || "dine-in",
            status: "PENDING",
            elapsed_seconds: 0,
            station: body.station || "burger",
            created_at: "Just now",
            items
          });

          return jsonResponse({ success: true, orderId, token }, 201);
        }

        // 7. Kitchen Display System (KDS)
        if (path === "/api/kds" && method === "GET") {
          return jsonResponse(edgeKdsOrders.filter(t => t.status !== "SERVED"));
        }

        if (path === "/api/kds/status" && method === "POST") {
          const ticketId = body.id || body.ticketId || body.token;
          const ticket = edgeKdsOrders.find(t => t.id === ticketId || t.token === ticketId);
          if (ticket) {
            ticket.status = (body.status || "PREPARING").toUpperCase();
            return jsonResponse({ success: true, status: ticket.status });
          }
          return jsonResponse({ success: false, error: "Ticket not found" }, 404);
        }

        // 8. Cash Drawer Shift Session
        if (path === "/api/cash/session" && method === "GET") {
          return jsonResponse(edgeCashSession);
        }

        if (path === "/api/cash/transactions" && method === "GET") {
          return jsonResponse(edgeCashTransactions);
        }

        if (path === "/api/cash/transaction" && method === "POST") {
          const txType = (body.type || "IN").toUpperCase();
          const amt = Number(body.amount || 0);
          if (txType === "IN") edgeCashSession.cash_in = (edgeCashSession.cash_in || 0) + amt;
          if (txType === "OUT") edgeCashSession.cash_out = (edgeCashSession.cash_out || 0) + amt;

          const tx = {
            id: body.id || `CT-${Date.now().toString().slice(-6)}`,
            time: body.time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            type: txType,
            reason: body.reason || "",
            amount: amt,
            user: body.user || "Ali",
            method: "Cash",
            reference: body.reference || ""
          };
          edgeCashTransactions.unshift(tx);
          return jsonResponse({ success: true, transactionId: tx.id }, 201);
        }

        // 9. Reports Summary
        if (path === "/api/reports/summary" && method === "GET") {
          const totalSales = edgeOrders.reduce((acc, o) => acc + (o.total || 0), 0);
          const orderCount = edgeOrders.length;
          return jsonResponse({
            totalSales,
            orderCount,
            averageOrderValue: orderCount > 0 ? totalSales / orderCount : 0,
            paymentStats: [{ method: "Cash", count: orderCount, total: totalSales }],
            typeStats: [{ type: "dine-in", count: orderCount, total: totalSales }],
            hourlyStats: [],
            lowStockItems: edgeInventory.filter(r => r.currentStock <= r.minStock),
            cashDrawer: {
              opening: edgeCashSession.opening_cash,
              sales: edgeCashSession.cash_sales,
              in: edgeCashSession.cash_in,
              out: edgeCashSession.cash_out,
              expectedCash: (edgeCashSession.opening_cash || 0) + (edgeCashSession.cash_sales || 0) + (edgeCashSession.cash_in || 0) - (edgeCashSession.cash_out || 0)
            },
            generatedAt: new Date().toISOString()
          });
        }

        // 10. Audit Trail
        if (path === "/api/audit" && method === "GET") {
          return jsonResponse(edgeAuditLogs);
        }

        // 11. Database Reset / Clear
        if (path === "/api/db/clear" && method === "POST") {
          edgeOrders = [];
          edgeKdsOrders = [];
          edgeCashTransactions = [];
          edgeCashSession.cash_sales = 0;
          edgeCashSession.cash_in = 0;
          edgeCashSession.cash_out = 0;
          edgeInventory = JSON.parse(JSON.stringify(INITIAL_RAW_MATERIALS));
          return jsonResponse({ success: true, message: "Edge data cleared" });
        }

        if (path === "/api/db/reset" && method === "POST") {
          edgeCategories = [...INITIAL_CATEGORIES];
          edgeProducts = JSON.parse(JSON.stringify(INITIAL_PRODUCTS));
          edgeInventory = JSON.parse(JSON.stringify(INITIAL_RAW_MATERIALS));
          edgeOrders = [];
          edgeKdsOrders = [];
          edgeCashTransactions = [];
          return jsonResponse({ success: true, message: "Edge data reset to factory defaults" });
        }

        return jsonResponse({ error: `Route ${method} ${path} not found` }, 404);
      } catch (err) {
        return jsonResponse({ error: err.message }, 500);
      }
    }

    // Default: Fallback to Cloudflare Pages static asset handler
    return env.ASSETS.fetch(request);
  }
};
