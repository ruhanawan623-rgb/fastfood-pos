/* ==========================================================================
   ApexPOS - Initial Fast-Food Operational Data & BOM Recipes
   ========================================================================== */

export const INITIAL_CATEGORIES = [
  { id: "all", name: "All", icon: "" },
  { id: "burgers", name: "Burgers", icon: "" },
  { id: "fryer", name: "Fryer", icon: "" },
  { id: "sides", name: "Sides", icon: "" },
  { id: "pizza", name: "Pizza", icon: "" },
  { id: "drinks", name: "Drinks", icon: "" },
  { id: "desserts", name: "Desserts", icon: "" }
];

export const INITIAL_PRODUCTS = [
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

export const INITIAL_RAW_MATERIALS = [
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

export const INITIAL_CASH_SESSION = {
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

export const INITIAL_CASH_TRANSACTIONS = [];

export const INITIAL_KDS_ORDERS = [];

export const INITIAL_USERS = [
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
