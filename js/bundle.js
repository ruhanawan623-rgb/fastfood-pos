// FastFood Terminal Standalone Bundle
(function() {
'use strict';


// --- FILE: js/state/mockData.js ---

/* ==========================================================================
   ApexPOS - Initial Fast-Food Operational Data & BOM Recipes
   ========================================================================== */
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
    id: "p_zinger",
    name: "🍔 Zinger Burger",
    categoryId: "burgers",
    price: 550,
    desc: "Crispy golden spiced chicken fillet, spicy mayo, crisp iceberg lettuce on toasted sesame bun.",
    stock: 45,
    station: "burger",
    recipe: [
      { rawId: "raw_bun", qty: 1, unit: "pcs" },
      { rawId: "raw_chicken", qty: 1, unit: "fillet" },
      { rawId: "raw_cheese", qty: 1, unit: "slice" },
      { rawId: "raw_mayo", qty: 25, unit: "ml" }
    ],
    variations: [
      { name: "Regular", priceDelta: 0 },
      { name: "Double Zinger", priceDelta: 220 }
    ],
    modifiers: [
      { id: "m_cheese", name: "Extra Cheese", price: 60 },
      { id: "m_jalapeno", name: "Spicy Jalapenos", price: 40 },
      { id: "m_sauce", name: "Extra Sauce Dip", price: 30 }
    ]
  },
  {
    id: "p_chicken_burger",
    name: "🍔 Chicken Burger",
    categoryId: "burgers",
    price: 480,
    desc: "Tender seasoned minced chicken patty, fresh garlic mayo, lettuce, soft brioche bun.",
    stock: 50,
    station: "burger",
    recipe: [
      { rawId: "raw_bun", qty: 1, unit: "pcs" },
      { rawId: "raw_chicken", qty: 1, unit: "fillet" },
      { rawId: "raw_mayo", qty: 20, unit: "ml" }
    ],
    variations: [
      { name: "Single Patty", priceDelta: 0 },
      { name: "Double Patty", priceDelta: 180 }
    ],
    modifiers: [
      { id: "m_cheese", name: "Extra Cheese", price: 60 },
      { id: "m_onions", name: "Grilled Onions", price: 30 }
    ]
  },
  {
    id: "p_beef_burger",
    name: "🍔 Beef Burger",
    categoryId: "burgers",
    price: 620,
    desc: "100% prime beef patty, caramelized onions, melted cheddar slice, signature smash sauce.",
    stock: 40,
    station: "burger",
    recipe: [
      { rawId: "raw_bun", qty: 1, unit: "pcs" },
      { rawId: "raw_beef", qty: 1, unit: "patty" },
      { rawId: "raw_cheese", qty: 1, unit: "slice" },
      { rawId: "raw_sauce", qty: 20, unit: "ml" }
    ],
    variations: [
      { name: "Single Patty", priceDelta: 0 },
      { name: "Double Patty", priceDelta: 260 }
    ],
    modifiers: [
      { id: "m_cheese", name: "Extra Cheese", price: 60 },
      { id: "m_bacon", name: "Beef Bacon Strip", price: 100 },
      { id: "m_no_onions", name: "No Onions", price: 0 }
    ]
  },
  {
    id: "p_fried_chicken",
    name: "🍗 Fried Chicken",
    categoryId: "fryer",
    price: 490,
    desc: "Crispy spiced bone-in chicken with 12-spice secret golden coating and garlic dip.",
    stock: 35,
    station: "fryer",
    recipe: [
      { rawId: "raw_chicken", qty: 2, unit: "fillet" },
      { rawId: "raw_oil", qty: 50, unit: "ml" }
    ],
    variations: [
      { name: "2 Pieces", priceDelta: 0 },
      { name: "3 Pieces", priceDelta: 220 },
      { name: "5 Pieces Mega", priceDelta: 550 }
    ],
    modifiers: [
      { id: "m_spicy", name: "Hot & Spicy Seasoning", price: 30 },
      { id: "m_garlic_dip", name: "Garlic Mayo Dip", price: 50 }
    ]
  },
  {
    id: "p_french_fries",
    name: "🍟 French Fries",
    categoryId: "sides",
    price: 220,
    desc: "Golden salted crispy skin-on potatoes, freshly fried to perfection.",
    stock: 70,
    station: "fryer",
    recipe: [
      { rawId: "raw_fries", qty: 180, unit: "g" },
      { rawId: "raw_oil", qty: 30, unit: "ml" }
    ],
    variations: [
      { name: "Regular", priceDelta: 0 },
      { name: "Large", priceDelta: 90 }
    ],
    modifiers: [
      { id: "m_mayo_dip", name: "Chili Garlic Dip", price: 40 },
      { id: "m_periperi", name: "Peri Peri Dust", price: 30 }
    ]
  },
  {
    id: "p_hot_dog",
    name: "🌭 Hot Dog",
    categoryId: "burgers",
    price: 380,
    desc: "Grilled smoked beef sausage in a soft bun with mustard, tomato ketchup, and pickle relish.",
    stock: 30,
    station: "burger",
    recipe: [
      { rawId: "raw_hotdog_bun", qty: 1, unit: "pcs" },
      { rawId: "raw_sausage", qty: 1, unit: "pcs" },
      { rawId: "raw_sauce", qty: 15, unit: "ml" }
    ],
    variations: [
      { name: "Classic", priceDelta: 0 },
      { name: "Cheesy Jumbo", priceDelta: 120 }
    ],
    modifiers: [
      { id: "m_cheese", name: "Extra Melted Cheese", price: 60 },
      { id: "m_jalapeno", name: "Jalapeno Slices", price: 40 }
    ]
  },
  {
    id: "p_chicken_tacos",
    name: "🌮 Chicken Tacos",
    categoryId: "sides",
    price: 460,
    desc: "2 warm flour tortillas filled with shredded chicken, pico de gallo, and zesty cream sauce.",
    stock: 25,
    station: "burger",
    recipe: [
      { rawId: "raw_tortilla", qty: 2, unit: "pcs" },
      { rawId: "raw_chicken", qty: 1, unit: "fillet" },
      { rawId: "raw_cheese", qty: 1, unit: "slice" }
    ],
    variations: [
      { name: "2 Tacos", priceDelta: 0 },
      { name: "3 Tacos Feast", priceDelta: 180 }
    ],
    modifiers: [
      { id: "m_sour_cream", name: "Extra Sour Cream", price: 50 },
      { id: "m_spicy_salsa", name: "Spicy Chipotle Salsa", price: 30 }
    ]
  },
  {
    id: "p_pizza",
    name: "🍕 Pizza",
    categoryId: "pizza",
    price: 950,
    desc: "Fresh oven-baked sourdough crust with herb tomato sauce, mozzarella cheese, and toppings.",
    stock: 20,
    station: "pizza",
    recipe: [
      { rawId: "raw_dough", qty: 1, unit: "ball" },
      { rawId: "raw_mozzarella", qty: 180, unit: "g" },
      { rawId: "raw_sauce", qty: 40, unit: "ml" }
    ],
    variations: [
      { name: "Small 8-Inch", priceDelta: -250 },
      { name: "Medium 10-Inch", priceDelta: 0 },
      { name: "Large 13-Inch", priceDelta: 450 }
    ],
    modifiers: [
      { id: "m_stuffed_crust", name: "Cheese Stuffed Crust", price: 200 },
      { id: "m_extra_pep", name: "Beef Pepperoni", price: 150 },
      { id: "m_mushrooms", name: "Fresh Mushrooms", price: 80 }
    ]
  },
  {
    id: "p_chicken_sandwich",
    name: "🥪 Chicken Sandwich",
    categoryId: "burgers",
    price: 420,
    desc: "Triple-layer toasted club bread with grilled chicken slices, egg, tomato, and garlic dressing.",
    stock: 30,
    station: "burger",
    recipe: [
      { rawId: "raw_bun", qty: 1, unit: "pcs" },
      { rawId: "raw_chicken", qty: 1, unit: "fillet" },
      { rawId: "raw_mayo", qty: 20, unit: "ml" }
    ],
    variations: [
      { name: "Classic Club", priceDelta: 0 },
      { name: "Spicy Grilled", priceDelta: 40 }
    ],
    modifiers: [
      { id: "m_cheese", name: "Cheese Slice", price: 60 },
      { id: "m_egg", name: "Boiled Egg", price: 40 }
    ]
  },
  {
    id: "p_chicken_wrap",
    name: "🌯 Chicken Wrap",
    categoryId: "burgers",
    price: 450,
    desc: "Crispy chicken tenders rolled in a soft grilled tortilla with garlic mayo & crisp lettuce.",
    stock: 35,
    station: "burger",
    recipe: [
      { rawId: "raw_tortilla", qty: 1, unit: "pcs" },
      { rawId: "raw_chicken", qty: 1, unit: "fillet" },
      { rawId: "raw_mayo", qty: 20, unit: "ml" }
    ],
    variations: [
      { name: "Crispy Tenders", priceDelta: 0 },
      { name: "Grilled BBQ", priceDelta: 30 }
    ],
    modifiers: [
      { id: "m_cheese", name: "Melted Cheese", price: 60 },
      { id: "m_fiery", name: "Fiery Dip", price: 40 }
    ]
  },
  {
    id: "p_cheese_fries",
    name: "🧀 Cheese Fries",
    categoryId: "sides",
    price: 380,
    desc: "Crispy golden fries smothered in creamy hot melted cheddar cheese sauce.",
    stock: 40,
    station: "fryer",
    recipe: [
      { rawId: "raw_fries", qty: 220, unit: "g" },
      { rawId: "raw_cheese", qty: 2, unit: "slice" },
      { rawId: "raw_oil", qty: 30, unit: "ml" }
    ],
    variations: [
      { name: "Regular", priceDelta: 0 },
      { name: "Mega Loaded", priceDelta: 140 }
    ],
    modifiers: [
      { id: "m_jalapeno", name: "Sliced Jalapenos", price: 40 },
      { id: "m_bacon", name: "Beef Bacon Bits", price: 80 }
    ]
  },
  {
    id: "p_chicken_nuggets",
    name: "🍗 Chicken Nuggets",
    categoryId: "fryer",
    price: 390,
    desc: "Crispy bite-sized golden chicken breast nuggets with your favorite dipping sauce.",
    stock: 45,
    station: "fryer",
    recipe: [
      { rawId: "raw_nuggets", qty: 6, unit: "pcs" },
      { rawId: "raw_oil", qty: 40, unit: "ml" }
    ],
    variations: [
      { name: "6 Pieces", priceDelta: 0 },
      { name: "9 Pieces", priceDelta: 150 },
      { name: "12 Pieces Party", priceDelta: 280 }
    ],
    modifiers: [
      { id: "m_bbq", name: "BBQ Dip Cup", price: 40 },
      { id: "m_mustard", name: "Honey Mustard Dip", price: 40 }
    ]
  },
  {
    id: "p_onion_rings",
    name: "🧅 Onion Rings",
    categoryId: "sides",
    price: 290,
    desc: "Thick-cut fresh sweet onion rings coated in crispy seasoned panko breadcrumbs.",
    stock: 35,
    station: "fryer",
    recipe: [
      { rawId: "raw_onion_rings", qty: 8, unit: "pcs" },
      { rawId: "raw_oil", qty: 40, unit: "ml" }
    ],
    variations: [
      { name: "Regular 8 Pcs", priceDelta: 0 },
      { name: "Large 12 Pcs", priceDelta: 90 }
    ],
    modifiers: [
      { id: "m_garlic_dip", name: "Garlic Mayo Dip", price: 40 }
    ]
  },
  {
    id: "p_cold_drink",
    name: "🥤 Cold Drink",
    categoryId: "drinks",
    price: 120,
    desc: "Chilled refreshing carbonated beverage (Cola, Lemon Lime, Diet, Orange).",
    stock: 100,
    station: "drinks",
    recipe: [
      { rawId: "raw_drink_can", qty: 1, unit: "can" }
    ],
    variations: [
      { name: "Can 330ml", priceDelta: 0 },
      { name: "500ml Bottle", priceDelta: 40 },
      { name: "1.5L Jumbo", priceDelta: 130 }
    ],
    modifiers: [
      { id: "m_cola", name: "Classic Cola", price: 0 },
      { id: "m_lemon", name: "Lemon-Lime", price: 0 },
      { id: "m_diet", name: "Zero Sugar", price: 0 }
    ]
  },
  {
    id: "p_milkshake",
    name: "🥛 Milkshake",
    categoryId: "drinks",
    price: 380,
    desc: "Thick hand-spun creamy milkshake blended with ice cream and chilled milk.",
    stock: 40,
    station: "drinks",
    recipe: [
      { rawId: "raw_milk", qty: 250, unit: "ml" },
      { rawId: "raw_ice_cream", qty: 100, unit: "ml" }
    ],
    variations: [
      { name: "Vanilla Cream", priceDelta: 0 },
      { name: "Rich Chocolate", priceDelta: 40 },
      { name: "Strawberry", priceDelta: 40 },
      { name: "Oreo Crunch", priceDelta: 70 }
    ],
    modifiers: [
      { id: "m_whip", name: "Whipped Cream Top", price: 50 },
      { id: "m_choc_sauce", name: "Extra Chocolate Drizzle", price: 40 }
    ]
  },
  {
    id: "p_ice_cream",
    name: "🍦 Ice Cream",
    categoryId: "desserts",
    price: 190,
    desc: "Velvety smooth soft-serve dairy ice cream in a crisp waffle cone or sundae cup.",
    stock: 50,
    station: "drinks",
    recipe: [
      { rawId: "raw_ice_cream", qty: 150, unit: "ml" }
    ],
    variations: [
      { name: "Waffle Cone", priceDelta: 0 },
      { name: "Sundae Cup", priceDelta: 30 }
    ],
    modifiers: [
      { id: "m_sprinkles", name: "Rainbow Sprinkles", price: 30 },
      { id: "m_caramel", name: "Caramel Drizzle", price: 40 }
    ]
  },
  {
    id: "p_chocolate_brownie",
    name: "🍫 Chocolate Browni",
    categoryId: "desserts",
    price: 280,
    desc: "Warm fudgy dark chocolate brownie packed with melted chocolate chips.",
    stock: 30,
    station: "drinks",
    recipe: [
      { rawId: "raw_brownie", qty: 1, unit: "pcs" }
    ],
    variations: [
      { name: "Classic Warm", priceDelta: 0 },
      { name: "Sizzling with Ice Cream", priceDelta: 120 }
    ],
    modifiers: [
      { id: "m_hot_fudge", name: "Hot Chocolate Fudge", price: 50 },
      { id: "m_walnuts", name: "Crushed Walnuts", price: 40 }
    ]
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
const INITIAL_CASH_SESSION = {
  id: "CS-001",
  branchId: "branch-01",
  userId: "u-ali",
  cashierName: "Ali (Cashier)",
  status: "OPEN",
  openedAt: new Date().toISOString(),
  closedAt: null,
  openingCash: 0,
  cashSales: 0,
  cashIn: 0,
  cashOut: 0,
  refunds: 0
};
const INITIAL_CASH_TRANSACTIONS = [];
const INITIAL_KDS_ORDERS = [];
const INITIAL_USERS = [
  {
    id: "u-ali",
    name: "Ali",
    email: "ali@fastfood.com",
    role: "Cashier"
  },
  {
    id: "u-tariq",
    name: "Tariq",
    email: "manager@fastfood.com",
    role: "Manager"
  }
];


// --- FILE: js/state/dbAdapter.js ---

/* ==========================================================================
   ApexPOS - Unified Database Client Adapter
   Seamlessly synchronizes with the Python SQLite REST API backend
   (http://localhost:5501/api/*) and Cloudflare Pages Edge Worker (/api/*)
   with automated offline fallback.
   ========================================================================== */
class DatabaseAdapter {
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
const dbAdapter = new DatabaseAdapter();


// --- FILE: js/state/store.js ---

/* ==========================================================================
   ApexPOS - Central Reactive State Store
   ========================================================================== */


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
const store = new StateStore();


// --- FILE: js/pos/cartEngine.js ---

/* ==========================================================================
   ApexPOS - Cart Calculation & Financial Tender Math Engine
   ========================================================================== */
class CartEngine {
  static formatCurrency(amount) {
    const formatted = Number(amount || 0).toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
    return `Rs.\u00A0${formatted}`;
  }

  static calculateTotals(cart) {
    const items = cart.items || [];
    const subtotal = items.reduce((sum, item) => sum + (item.subtotal || 0), 0);

    // Discounts
    const discountPercent = cart.discountPercent || 0;
    const discountAmount = (subtotal * discountPercent) / 100;
    const discountedSubtotal = Math.max(0, subtotal - discountAmount);

    // Tax (e.g. 16% GST on food service)
    const taxPercent = cart.taxPercent || 16;
    const taxAmount = (discountedSubtotal * taxPercent) / 100;

    // Delivery Surcharge
    const deliveryFee = cart.orderType === 'delivery' ? 150 : 0;

    // Grand Total
    const grandTotal = Math.round(discountedSubtotal + taxAmount + deliveryFee);

    return {
      subtotal,
      discountPercent,
      discountAmount,
      taxPercent,
      taxAmount,
      deliveryFee,
      grandTotal,
      itemCount: items.reduce((acc, item) => acc + item.qty, 0)
    };
  }

  static calculateChange(tenderAmount, totalAmount) {
    return Math.max(0, Number(tenderAmount || 0) - Number(totalAmount || 0));
  }
}


// --- FILE: js/inventory/recipeEngine.js ---

/* ==========================================================================
   ApexPOS - Inventory & Automated Recipe Depletion Engine
   ========================================================================== */
class RecipeEngine {
  /**
   * Automatically deducts raw ingredients from inventory when an order is finalized.
   * e.g. Burger -> Bun (1) + Beef Patty (1) + Cheese Slice (1) + Sauce (20ml)
   */
  static depleteForOrder(cartItems) {
    const rawMaterials = store.state.rawMaterials;
    const depletedList = [];

    cartItems.forEach(cartItem => {
      if (!cartItem.recipe || !Array.isArray(cartItem.recipe)) return;

      cartItem.recipe.forEach(ingredient => {
        const rawMat = rawMaterials.find(rm => rm.id === ingredient.rawId);
        if (rawMat) {
          const totalUsage = ingredient.qty * cartItem.qty;
          rawMat.currentStock = Math.max(0, rawMat.currentStock - totalUsage);

          depletedList.push({
            name: rawMat.name,
            deducted: totalUsage,
            unit: rawMat.unit,
            remaining: rawMat.currentStock,
            isLow: rawMat.currentStock <= rawMat.minStock
          });
        }
      });
    });

    // Check for low stock items and notify
    const lowStockItems = rawMaterials.filter(rm => rm.currentStock <= rm.minStock);
    if (lowStockItems.length > 0) {
      store.logAudit(
        "LOW_STOCK_ALERT",
        `${lowStockItems.length} raw ingredients below minimum threshold (${lowStockItems.map(i => i.name).slice(0, 3).join(', ')})`
      );
    }

    return depletedList;
  }

  /**
   * Log raw material wastage (damaged, expired, burned in kitchen)
   */
  static recordWastage(rawId, qty, reason) {
    const raw = store.state.rawMaterials.find(r => r.id === rawId);
    if (!raw) return false;

    raw.currentStock = Math.max(0, raw.currentStock - qty);
    store.logAudit(
      "INVENTORY_WASTAGE",
      `Discarded ${qty} ${raw.unit} of ${raw.name}. Reason: ${reason}`
    );
    store.save();
    return true;
  }

  /**
   * Manual Stock Adjustment / Restock In
   */
  static adjustStock(rawId, newQty, reason = "Manual Audit Adjustment") {
    const raw = store.state.rawMaterials.find(r => r.id === rawId);
    if (!raw) return false;

    const oldQty = raw.currentStock;
    raw.currentStock = Number(newQty);
    store.logAudit(
      "STOCK_ADJUSTMENT",
      `Adjusted ${raw.name} from ${oldQty} to ${newQty} ${raw.unit}. Reason: ${reason}`
    );
    store.save();
    return true;
  }
}


// --- FILE: js/cash/cashDrawer.js ---

/* ==========================================================================
   ApexPOS - Cash In / Cash Out & Shift Drawer Reconciliation Engine
   ========================================================================== */
class CashDrawerEngine {
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


// --- FILE: js/kds/kdsEngine.js ---

/* ==========================================================================
   ApexPOS - Kitchen Display System (KDS) & KOT Engine
   ========================================================================== */
class KDSEngine {
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


// --- FILE: js/modules/modulesUI.js ---

/* ==========================================================================
   ApexPOS - Management Modules Controller (KDS, Cash, Inventory, Reports, Audit)
   ========================================================================== */
class ModulesUI {
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
      pill.style.background = 'rgba(16, 185, 129, 0.12)';
      pill.style.borderColor = 'rgba(16, 185, 129, 0.35)';
      const dot = pill.querySelector('.status-dot');
      if (dot) dot.style.background = '#10b981';
      label.innerText = `SQLite: Online (${status?.totalRecords || 57} rows)`;
    } else {
      pill.style.background = 'rgba(239, 68, 68, 0.12)';
      pill.style.borderColor = 'rgba(239, 68, 68, 0.35)';
      const dot = pill.querySelector('.status-dot');
      if (dot) dot.style.background = '#ef4444';
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
      statusEl.style.color = isConnected ? '#10b981' : '#ef4444';
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
const modulesUI = new ModulesUI();


// --- FILE: js/pos/posUI.js ---

/* ==========================================================================
   ApexPOS - POS Terminal UI Controller
   ========================================================================== */
class POSUI {
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


// --- FILE: js/app.js ---

/* ==========================================================================
   ApexPOS - Application Shell & Navigation Router
   ========================================================================== */



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


// Global exposures
window.dbAdapter = dbAdapter;
window.store = store;
window.CartEngine = CartEngine;
window.RecipeEngine = RecipeEngine;
window.CashDrawerEngine = CashDrawerEngine;
window.KDSEngine = KDSEngine;
window.modulesUI = modulesUI;
window.POSUI = POSUI;

})();
