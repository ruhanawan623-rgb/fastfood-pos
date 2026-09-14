"""
FastFood POS - SQLite Database Engine
Direct, zero-dependency persistent storage using Python's built-in sqlite3.
"""

import sqlite3
import json
import os
from datetime import datetime

DB_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "fastfood.db")


def get_connection():
    conn = sqlite3.connect(DB_FILE)
    conn.row_factory = sqlite3.Row
    # Enable foreign keys and WAL mode for high concurrency & speed
    conn.execute("PRAGMA foreign_keys = ON")
    conn.execute("PRAGMA journal_mode = WAL")
    return conn


def init_db(force_reset=False):
    """Initialize database tables and seed with initial catalog data if empty."""
    conn = get_connection()
    cursor = conn.cursor()

    if force_reset:
        cursor.execute("DROP TABLE IF EXISTS audit_logs")
        cursor.execute("DROP TABLE IF EXISTS cash_transactions")
        cursor.execute("DROP TABLE IF EXISTS cash_sessions")
        cursor.execute("DROP TABLE IF EXISTS kds_orders")
        cursor.execute("DROP TABLE IF EXISTS orders")
        cursor.execute("DROP TABLE IF EXISTS raw_materials")
        cursor.execute("DROP TABLE IF EXISTS products")
        cursor.execute("DROP TABLE IF EXISTS categories")

    # 1. Categories
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS categories (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        icon TEXT DEFAULT ''
    )
    """)

    # 2. Products
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS products (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        category_id TEXT NOT NULL,
        price REAL NOT NULL,
        desc TEXT DEFAULT '',
        stock INTEGER DEFAULT 50,
        station TEXT DEFAULT 'burger',
        recipe TEXT DEFAULT '[]',
        variations TEXT DEFAULT '[]',
        modifiers TEXT DEFAULT '[]',
        FOREIGN KEY (category_id) REFERENCES categories (id)
    )
    """)

    # 3. Raw Materials (BOM inventory)
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS raw_materials (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        current_stock REAL NOT NULL,
        unit TEXT NOT NULL,
        min_stock REAL NOT NULL,
        cost_per_unit REAL NOT NULL
    )
    """)

    # 4. Completed & Active Orders
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS orders (
        id TEXT PRIMARY KEY,
        token TEXT NOT NULL,
        order_time TEXT NOT NULL,
        order_type TEXT NOT NULL,
        total REAL NOT NULL,
        payment_method TEXT NOT NULL,
        cashier TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'COMPLETED',
        items TEXT NOT NULL,
        totals_json TEXT DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
    """)

    # 5. KDS Live Kitchen Tickets
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS kds_orders (
        id TEXT PRIMARY KEY,
        token TEXT NOT NULL,
        order_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'PENDING',
        elapsed_seconds INTEGER DEFAULT 0,
        station TEXT NOT NULL,
        created_at TEXT NOT NULL,
        items TEXT NOT NULL
    )
    """)

    # 6. Cash Sessions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cash_sessions (
        id TEXT PRIMARY KEY,
        branch_id TEXT NOT NULL,
        user_id TEXT NOT NULL,
        cashier_name TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'OPEN',
        opened_at TEXT NOT NULL,
        closed_at TEXT,
        opening_cash REAL DEFAULT 10000,
        cash_sales REAL DEFAULT 0,
        cash_in REAL DEFAULT 0,
        cash_out REAL DEFAULT 0,
        refunds REAL DEFAULT 0
    )
    """)

    # 7. Cash Ledger Transactions
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS cash_transactions (
        id TEXT PRIMARY KEY,
        time TEXT NOT NULL,
        type TEXT NOT NULL,
        reason TEXT NOT NULL,
        amount REAL NOT NULL,
        user TEXT NOT NULL,
        method TEXT DEFAULT 'Cash',
        reference TEXT DEFAULT ''
    )
    """)

    # 8. Activity & Audit Logs
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS audit_logs (
        id TEXT PRIMARY KEY,
        timestamp TEXT NOT NULL,
        user TEXT NOT NULL,
        action TEXT NOT NULL,
        details TEXT NOT NULL
    )
    """)

    conn.commit()

    # Seed data if categories are empty
    cursor.execute("SELECT COUNT(*) FROM categories")
    if cursor.fetchone()[0] == 0:
        seed_initial_data(conn)

    conn.close()


def seed_initial_data(conn):
    """Seed initial records into SQLite from catalog defaults."""
    cursor = conn.cursor()

    # Categories
    categories = [
        ("all", "All", ""),
        ("burgers", "Burgers", ""),
        ("fryer", "Fryer", ""),
        ("sides", "Sides", ""),
        ("pizza", "Pizza", ""),
        ("drinks", "Drinks", ""),
        ("desserts", "Desserts", "")
    ]
    cursor.executemany("INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)", categories)

    # 17 FastFood Products
    products = [
        (
            "p_zinger", "🍔 Zinger Burger", "burgers", 550.0,
            "Crispy golden spiced chicken fillet, spicy mayo, crisp iceberg lettuce on toasted sesame bun.",
            45, "burger",
            json.dumps([{"rawId": "raw_bun", "qty": 1, "unit": "pcs"}, {"rawId": "raw_chicken", "qty": 1, "unit": "fillet"}, {"rawId": "raw_cheese", "qty": 1, "unit": "slice"}, {"rawId": "raw_mayo", "qty": 25, "unit": "ml"}]),
            json.dumps([{"name": "Regular", "priceDelta": 0}, {"name": "Double Zinger", "priceDelta": 220}]),
            json.dumps([{"id": "m_cheese", "name": "Extra Cheese", "price": 60}, {"id": "m_jalapeno", "name": "Spicy Jalapenos", "price": 40}, {"id": "m_sauce", "name": "Extra Sauce Dip", "price": 30}])
        ),
        (
            "p_chicken_burger", "🍔 Chicken Burger", "burgers", 480.0,
            "Tender seasoned minced chicken patty, fresh garlic mayo, lettuce, soft brioche bun.",
            50, "burger",
            json.dumps([{"rawId": "raw_bun", "qty": 1, "unit": "pcs"}, {"rawId": "raw_chicken", "qty": 1, "unit": "fillet"}, {"rawId": "raw_mayo", "qty": 20, "unit": "ml"}]),
            json.dumps([{"name": "Single Patty", "priceDelta": 0}, {"name": "Double Patty", "priceDelta": 180}]),
            json.dumps([{"id": "m_cheese", "name": "Extra Cheese", "price": 60}, {"id": "m_onions", "name": "Grilled Onions", "price": 30}])
        ),
        (
            "p_beef_burger", "🍔 Beef Burger", "burgers", 620.0,
            "100% prime beef patty, caramelized onions, melted cheddar slice, signature smash sauce.",
            40, "burger",
            json.dumps([{"rawId": "raw_bun", "qty": 1, "unit": "pcs"}, {"rawId": "raw_beef", "qty": 1, "unit": "patty"}, {"rawId": "raw_cheese", "qty": 1, "unit": "slice"}, {"rawId": "raw_sauce", "qty": 20, "unit": "ml"}]),
            json.dumps([{"name": "Single Patty", "priceDelta": 0}, {"name": "Double Patty", "priceDelta": 260}]),
            json.dumps([{"id": "m_cheese", "name": "Extra Cheese", "price": 60}, {"id": "m_bacon", "name": "Beef Bacon Strip", "price": 100}, {"id": "m_no_onions", "name": "No Onions", "price": 0}])
        ),
        (
            "p_fried_chicken", "🍗 Fried Chicken", "fryer", 490.0,
            "Crispy spiced bone-in chicken with 12-spice secret golden coating and garlic dip.",
            35, "fryer",
            json.dumps([{"rawId": "raw_chicken", "qty": 2, "unit": "fillet"}, {"rawId": "raw_oil", "qty": 50, "unit": "ml"}]),
            json.dumps([{"name": "2 Pieces", "priceDelta": 0}, {"name": "3 Pieces", "priceDelta": 220}, {"name": "5 Pieces Mega", "priceDelta": 550}]),
            json.dumps([{"id": "m_spicy", "name": "Hot & Spicy Seasoning", "price": 30}, {"id": "m_garlic_dip", "name": "Garlic Mayo Dip", "price": 50}])
        ),
        (
            "p_french_fries", "🍟 French Fries", "sides", 220.0,
            "Skinny golden salted potato fries, fried crisp on order.",
            60, "fryer",
            json.dumps([{"rawId": "raw_fries", "qty": 180, "unit": "g"}, {"rawId": "raw_oil", "qty": 30, "unit": "ml"}]),
            json.dumps([{"name": "Regular", "priceDelta": 0}, {"name": "Large", "priceDelta": 90}]),
            json.dumps([{"id": "m_chili_garlic", "name": "Chili Garlic Dip", "price": 40}, {"id": "m_peri_peri", "name": "Peri Peri Dust", "price": 30}])
        ),
        (
            "p_hot_dog", "🌭 Hot Dog", "burgers", 380.0,
            "Smoked beef sausage nestled in soft steamed roll, mustard, caramelized relish.",
            30, "burger",
            json.dumps([{"rawId": "raw_hotdog_bun", "qty": 1, "unit": "pcs"}, {"rawId": "raw_sausage", "qty": 1, "unit": "pcs"}, {"rawId": "raw_sauce", "qty": 15, "unit": "ml"}]),
            json.dumps([{"name": "Classic", "priceDelta": 0}, {"name": "Cheesy Jumbo", "priceDelta": 120}]),
            json.dumps([{"id": "m_cheese", "name": "Extra Melted Cheese", "price": 60}, {"id": "m_jalapenos", "name": "Jalapenos", "price": 40}])
        ),
        (
            "p_chicken_tacos", "🌮 Chicken Tacos", "sides", 460.0,
            "Two crispy tortillas filled with spiced grilled chicken strips, shredded lettuce, salsa.",
            25, "burger",
            json.dumps([{"rawId": "raw_tortilla", "qty": 2, "unit": "pcs"}, {"rawId": "raw_chicken", "qty": 1, "unit": "fillet"}, {"rawId": "raw_mayo", "qty": 20, "unit": "ml"}]),
            json.dumps([{"name": "2 Tacos", "priceDelta": 0}, {"name": "3 Tacos Feast", "priceDelta": 180}]),
            json.dumps([{"id": "m_sour_cream", "name": "Extra Sour Cream", "price": 50}, {"id": "m_spicy_salsa", "name": "Spicy Salsa", "price": 30}])
        ),
        (
            "p_pizza", "🍕 Pizza", "pizza", 950.0,
            "Stone-baked crust, rich marinara sauce, loaded melted mozzarella cheese, herbs.",
            20, "pizza",
            json.dumps([{"rawId": "raw_dough", "qty": 1, "unit": "ball"}, {"rawId": "raw_mozzarella", "qty": 200, "unit": "g"}, {"rawId": "raw_sauce", "qty": 60, "unit": "ml"}]),
            json.dumps([{"name": "Small 8-Inch", "priceDelta": -250}, {"name": "Medium 10-Inch", "priceDelta": 0}, {"name": "Large 13-Inch", "priceDelta": 450}]),
            json.dumps([{"id": "m_stuffed_crust", "name": "Cheese Stuffed Crust", "price": 200}, {"id": "m_extra_cheese", "name": "Extra Mozzarella", "price": 140}])
        ),
        (
            "p_chicken_sandwich", "🥪 Chicken Sandwich", "burgers", 420.0,
            "Triple decker toasted club sandwich with roasted chicken, boiled egg slice, mayo.",
            35, "burger",
            json.dumps([{"rawId": "raw_bun", "qty": 1, "unit": "pcs"}, {"rawId": "raw_chicken", "qty": 1, "unit": "fillet"}, {"rawId": "raw_mayo", "qty": 20, "unit": "ml"}]),
            json.dumps([{"name": "Classic Club", "priceDelta": 0}, {"name": "Spicy Grilled", "priceDelta": 40}]),
            json.dumps([{"id": "m_cheese", "name": "Cheese Slice", "price": 60}])
        ),
        (
            "p_chicken_wrap", "🌯 Chicken Wrap", "burgers", 450.0,
            "Flour tortilla wrap stuffed with crispy chicken tenders, crunchy lettuce, fiery dip.",
            30, "burger",
            json.dumps([{"rawId": "raw_tortilla", "qty": 1, "unit": "pcs"}, {"rawId": "raw_chicken", "qty": 1, "unit": "fillet"}, {"rawId": "raw_mayo", "qty": 25, "unit": "ml"}]),
            json.dumps([{"name": "Crispy Tenders", "priceDelta": 0}, {"name": "Grilled BBQ", "priceDelta": 30}]),
            json.dumps([{"id": "m_melted_cheese", "name": "Melted Cheese", "price": 60}])
        ),
        (
            "p_cheese_fries", "🧀 Cheese Fries", "sides", 380.0,
            "Hot crisp french fries topped with warm cheddar sauce and sprinkle of paprika.",
            40, "fryer",
            json.dumps([{"rawId": "raw_fries", "qty": 200, "unit": "g"}, {"rawId": "raw_cheese", "qty": 2, "unit": "slice"}, {"rawId": "raw_oil", "qty": 30, "unit": "ml"}]),
            json.dumps([{"name": "Regular", "priceDelta": 0}, {"name": "Mega Loaded", "priceDelta": 140}]),
            json.dumps([{"id": "m_jalapenos", "name": "Sliced Jalapenos", "price": 40}])
        ),
        (
            "p_chicken_nuggets", "🍗 Chicken Nuggets", "fryer", 390.0,
            "Tender breaded all-white-meat chicken bites fried to crispy golden perfection.",
            50, "fryer",
            json.dumps([{"rawId": "raw_nuggets", "qty": 6, "unit": "pcs"}, {"rawId": "raw_oil", "qty": 40, "unit": "ml"}]),
            json.dumps([{"name": "6 Pieces", "priceDelta": 0}, {"name": "9 Pieces", "priceDelta": 150}, {"name": "12 Pieces Party", "priceDelta": 280}]),
            json.dumps([{"id": "m_bbq_dip", "name": "BBQ Dip Cup", "price": 40}])
        ),
        (
            "p_onion_rings", "🧅 Onion Rings", "sides", 290.0,
            "Thick-cut fresh onion slices batter-dipped and fried crunchy golden.",
            35, "fryer",
            json.dumps([{"rawId": "raw_onion_rings", "qty": 8, "unit": "pcs"}, {"rawId": "raw_oil", "qty": 30, "unit": "ml"}]),
            json.dumps([{"name": "Regular 8 Pcs", "priceDelta": 0}, {"name": "Large 12 Pcs", "priceDelta": 90}]),
            json.dumps([{"id": "m_garlic_dip", "name": "Garlic Mayo Dip", "price": 40}])
        ),
        (
            "p_cold_drink", "🥤 Cold Drink", "drinks", 120.0,
            "Refreshing carbonated soda served ice cold.",
            150, "drinks",
            json.dumps([{"rawId": "raw_drink_can", "qty": 1, "unit": "can"}]),
            json.dumps([{"name": "Can 330ml", "priceDelta": 0}, {"name": "Bottle 500ml", "priceDelta": 40}, {"name": "1.5L Family", "priceDelta": 130}]),
            json.dumps([{"id": "m_cola", "name": "Classic Cola", "price": 0}, {"id": "m_lemon", "name": "Lemon-Lime", "price": 0}])
        ),
        (
            "p_milkshake", "🥛 Milkshake", "drinks", 380.0,
            "Thick, creamy dairy milkshake blended with premium gelato ice cream.",
            45, "drinks",
            json.dumps([{"rawId": "raw_milk", "qty": 250, "unit": "ml"}, {"rawId": "raw_ice_cream", "qty": 100, "unit": "ml"}]),
            json.dumps([{"name": "Vanilla", "priceDelta": 0}, {"name": "Chocolate", "priceDelta": 40}, {"name": "Strawberry", "priceDelta": 40}, {"name": "Oreo Crunch", "priceDelta": 70}]),
            json.dumps([{"id": "m_whipped_cream", "name": "Whipped Cream", "price": 50}])
        ),
        (
            "p_ice_cream", "🍦 Ice Cream", "desserts", 190.0,
            "Velvety smooth soft-serve dairy ice cream in a crisp waffle cone or sundae cup.",
            50, "drinks",
            json.dumps([{"rawId": "raw_ice_cream", "qty": 150, "unit": "ml"}]),
            json.dumps([{"name": "Waffle Cone", "priceDelta": 0}, {"name": "Sundae Cup", "priceDelta": 30}]),
            json.dumps([{"id": "m_sprinkles", "name": "Rainbow Sprinkles", "price": 30}])
        ),
        (
            "p_chocolate_brownie", "🍫 Chocolate Browni", "desserts", 280.0,
            "Warm fudgy dark chocolate brownie packed with melted chocolate chips.",
            30, "drinks",
            json.dumps([{"rawId": "raw_brownie", "qty": 1, "unit": "pcs"}]),
            json.dumps([{"name": "Classic Warm", "priceDelta": 0}, {"name": "Sizzling with Ice Cream", "priceDelta": 120}]),
            json.dumps([{"id": "m_hot_fudge", "name": "Hot Chocolate Fudge", "price": 50}])
        )
    ]
    cursor.executemany("""
    INSERT INTO products (id, name, category_id, price, desc, stock, station, recipe, variations, modifiers)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, products)

    # 19 BOM Raw Materials
    raw_materials = [
        ("raw_bun", "Brioche Burger Buns", 120.0, "pcs", 30.0, 45.0),
        ("raw_beef", "Prime Angus Beef Patties", 85.0, "patty", 25.0, 160.0),
        ("raw_chicken", "Marinated Chicken Fillets", 90.0, "fillet", 20.0, 130.0),
        ("raw_cheese", "Cheddar Cheese Slices", 140.0, "slice", 40.0, 35.0),
        ("raw_fries", "Pre-cut Frozen Fries", 25000.0, "g", 5000.0, 0.8),
        ("raw_sauce", "Secret Smash Sauce", 3500.0, "ml", 800.0, 1.2),
        ("raw_mayo", "Spicy Garlic Mayo", 4000.0, "ml", 1000.0, 1.1),
        ("raw_oil", "Pure Frying Oil", 18000.0, "ml", 4000.0, 0.6),
        ("raw_dough", "Fermented Pizza Dough", 40.0, "ball", 15.0, 80.0),
        ("raw_mozzarella", "Grated Mozzarella", 8500.0, "g", 2000.0, 2.2),
        ("raw_drink_can", "Soda Cans 330ml", 180.0, "can", 50.0, 85.0),
        ("raw_nuggets", "Chicken Nuggets", 300.0, "pcs", 60.0, 30.0),
        ("raw_onion_rings", "Breaded Onion Rings", 240.0, "pcs", 50.0, 20.0),
        ("raw_hotdog_bun", "Hot Dog Buns", 50.0, "pcs", 15.0, 40.0),
        ("raw_sausage", "Smoked Beef Sausages", 50.0, "pcs", 15.0, 90.0),
        ("raw_tortilla", "Flour Tortillas", 80.0, "pcs", 20.0, 30.0),
        ("raw_milk", "Fresh Dairy Milk", 12000.0, "ml", 3000.0, 0.2),
        ("raw_ice_cream", "Ice Cream Mix", 15000.0, "ml", 3000.0, 0.5),
        ("raw_brownie", "Chocolate Brownie Slices", 45.0, "pcs", 10.0, 110.0)
    ]
    cursor.executemany("""
    INSERT INTO raw_materials (id, name, current_stock, unit, min_stock, cost_per_unit)
    VALUES (?, ?, ?, ?, ?, ?)
    """, raw_materials)

    # Initial Clean Cash Session (Zeroed)
    cursor.execute("""
    INSERT INTO cash_sessions (id, branch_id, user_id, cashier_name, status, opened_at, opening_cash, cash_sales, cash_in, cash_out, refunds)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, ("CS-001", "branch-01", "u-ali", "Ali (Cashier)", "OPEN", datetime.now().isoformat(), 0.0, 0.0, 0.0, 0.0, 0.0))

    # Initial System Audit Log
    cursor.execute("""
    INSERT INTO audit_logs (id, timestamp, user, action, details)
    VALUES (?, ?, 'System', 'SYSTEM_READY', 'Clean operational database ready')
    """, (f"LOG-{int(datetime.now().timestamp())}", datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

    conn.commit()


def clear_dummy_data():
    """Purge all orders, KDS tickets, cash ledger entries, and reset sales/stock to clean zero."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM orders")
    cursor.execute("DELETE FROM kds_orders")
    cursor.execute("DELETE FROM cash_transactions")
    cursor.execute("DELETE FROM audit_logs")

    # Reset all cash sessions
    cursor.execute("""
    UPDATE cash_sessions 
    SET opening_cash = 0.0, cash_sales = 0.0, cash_in = 0.0, cash_out = 0.0, refunds = 0.0
    """)

    # Reset raw materials to standard stock
    stock_resets = [
        ("raw_bun", 120.0), ("raw_beef", 85.0), ("raw_chicken", 90.0),
        ("raw_cheese", 140.0), ("raw_fries", 25000.0), ("raw_sauce", 3500.0),
        ("raw_mayo", 4000.0), ("raw_oil", 18000.0), ("raw_dough", 40.0),
        ("raw_mozzarella", 8500.0), ("raw_drink_can", 180.0), ("raw_nuggets", 300.0),
        ("raw_onion_rings", 240.0), ("raw_hotdog_bun", 50.0), ("raw_sausage", 50.0),
        ("raw_tortilla", 80.0), ("raw_milk", 12000.0), ("raw_ice_cream", 15000.0),
        ("raw_brownie", 45.0)
    ]
    cursor.executemany("UPDATE raw_materials SET current_stock = ? WHERE id = ?", [(s, i) for i, s in stock_resets])

    # Single clean audit entry
    cursor.execute("""
    INSERT INTO audit_logs (id, timestamp, user, action, details)
    VALUES (?, ?, 'System', 'CLEAR_DATA', 'All dummy operational orders, tickets, and transactions purged')
    """, (f"LOG-{int(datetime.now().timestamp() * 1000)}", datetime.now().strftime("%Y-%m-%d %H:%M:%S")))

    conn.commit()
    conn.close()
    return {"success": True, "message": "All dummy data cleared successfully"}


# ==============================================================================
# Database Access Helpers & Transactional Operations
# ==============================================================================

def get_db_status():
    """Return database engine status, file size, table counts, and schema info."""
    conn = get_connection()
    cursor = conn.cursor()

    tables = ["categories", "products", "raw_materials", "orders", "kds_orders", "cash_sessions", "cash_transactions", "audit_logs"]
    counts = {}
    for table in tables:
        try:
            cursor.execute(f"SELECT COUNT(*) FROM {table}")
            counts[table] = cursor.fetchone()[0]
        except Exception:
            counts[table] = 0

    file_size_bytes = os.path.getsize(DB_FILE) if os.path.exists(DB_FILE) else 0

    cursor.execute("SELECT sqlite_version()")
    sqlite_ver = cursor.fetchone()[0]

    conn.close()
    return {
        "status": "connected",
        "engine": f"SQLite v{sqlite_ver}",
        "databaseFile": DB_FILE,
        "fileSizeBytes": file_size_bytes,
        "fileSizeFormatted": f"{file_size_bytes / 1024:.1f} KB",
        "tableCounts": counts,
        "totalRecords": sum(counts.values()),
        "lastChecked": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


def get_table_data(table_name, limit=50):
    """Retrieve raw rows from a specified table for UI inspection."""
    conn = get_connection()
    cursor = conn.cursor()
    valid_tables = ["categories", "products", "raw_materials", "orders", "kds_orders", "cash_sessions", "cash_transactions", "audit_logs"]
    if table_name not in valid_tables:
        conn.close()
        return []

    cursor.execute(f"SELECT * FROM {table_name} LIMIT ?", (limit,))
    rows = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return rows


def get_products():
    """Retrieve all products parsed with variations and recipes."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products")
    products = []
    for row in cursor.fetchall():
        p = dict(row)
        p["recipe"] = json.loads(p.get("recipe") or "[]")
        p["variations"] = json.loads(p.get("variations") or "[]")
        p["modifiers"] = json.loads(p.get("modifiers") or "[]")
        products.append(p)
    conn.close()
    return products


def get_raw_materials():
    """Retrieve all raw materials with current stock levels."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, current_stock as currentStock, unit, min_stock as minStock, cost_per_unit as costPerUnit FROM raw_materials")
    materials = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return materials


def get_orders(limit=50):
    """Retrieve completed orders history."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders ORDER BY created_at DESC LIMIT ?", (limit,))
    orders = []
    for r in cursor.fetchall():
        d = dict(r)
        try:
            d["items"] = json.loads(d.get("items") or "[]")
        except Exception:
            pass
        orders.append(d)
    conn.close()
    return orders


def create_order(order_data):
    """
    Atomically:
    1. Insert into orders table.
    2. Deduct BOM raw_materials inventory.
    3. If cash, record cash transaction in ledger and update cash_sessions.
    4. Log audit entry.
    """
    conn = get_connection()
    cursor = conn.cursor()

    order_id = order_data.get("id") or f"ORD-{int(datetime.now().timestamp())}"
    token = order_data.get("token") or "T-999"
    order_time = order_data.get("time") or datetime.now().strftime("%I:%M %p")
    order_type = order_data.get("orderType") or "dine-in"
    total = float(order_data.get("total") or order_data.get("totals", {}).get("grandTotal", 0.0))
    payment_method = order_data.get("paymentMethod") or "Cash"
    cashier = order_data.get("cashier") or "Ali"
    items = order_data.get("items") or []

    try:
        cursor.execute("BEGIN TRANSACTION")

        # 1. Insert order
        cursor.execute("""
        INSERT INTO orders (id, token, order_time, order_type, total, payment_method, cashier, status, items, totals_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, 'COMPLETED', ?, ?)
        """, (order_id, token, order_time, order_type, total, payment_method, cashier, json.dumps(items), json.dumps(order_data.get("totals", {}))))

        # 2. Deduct BOM stock for each item in order
        for item in items:
            qty = item.get("qty", 1)
            recipe = item.get("recipe") or []
            for ingredient in recipe:
                raw_id = ingredient.get("rawId")
                deduct_amt = ingredient.get("qty", 0) * qty
                if raw_id and deduct_amt > 0:
                    cursor.execute("""
                    UPDATE raw_materials 
                    SET current_stock = MAX(0, current_stock - ?)
                    WHERE id = ?
                    """, (deduct_amt, raw_id))

        # 3. If Cash payment, record in cash transactions & update cash_session
        if payment_method.lower() == "cash":
            tx_id = f"CT-{int(datetime.now().timestamp() * 1000) % 1000000}"
            cursor.execute("""
            INSERT INTO cash_transactions (id, time, type, reason, amount, user, method, reference)
            VALUES (?, ?, 'SALE', ?, ?, ?, 'Cash', ?)
            """, (tx_id, order_time, f"Order #{token}", total, cashier, order_id))

            cursor.execute("""
            UPDATE cash_sessions
            SET cash_sales = cash_sales + ?
            WHERE status = 'OPEN'
            """, (total,))

        # 4. Audit log
        log_id = f"LOG-{int(datetime.now().timestamp() * 1000)}"
        cursor.execute("""
        INSERT INTO audit_logs (id, timestamp, user, action, details)
        VALUES (?, ?, ?, 'ORDER_COMPLETED', ?)
        """, (log_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), cashier, f"Order #{token} ({order_id}) total Rs. {total:.2f} via {payment_method}"))

        conn.commit()
        return {"success": True, "orderId": order_id, "token": token}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def add_cash_transaction(tx):
    """Add a cash IN / OUT transaction and update session balance."""
    conn = get_connection()
    cursor = conn.cursor()
    tx_id = tx.get("id") or f"CT-{int(datetime.now().timestamp() * 1000) % 1000000}"
    tx_time = tx.get("time") or datetime.now().strftime("%I:%M %p")
    tx_type = tx.get("type", "IN").upper()
    reason = tx.get("reason", "")
    amount = float(tx.get("amount", 0.0))
    user = tx.get("user", "Ali")
    ref = tx.get("reference", "")

    try:
        cursor.execute("""
        INSERT INTO cash_transactions (id, time, type, reason, amount, user, method, reference)
        VALUES (?, ?, ?, ?, ?, ?, 'Cash', ?)
        """, (tx_id, tx_time, tx_type, reason, amount, user, ref))

        if tx_type == "IN":
            cursor.execute("UPDATE cash_sessions SET cash_in = cash_in + ? WHERE status = 'OPEN'", (amount,))
        elif tx_type == "OUT":
            cursor.execute("UPDATE cash_sessions SET cash_out = cash_out + ? WHERE status = 'OPEN'", (amount,))

        # Log audit
        log_id = f"LOG-{int(datetime.now().timestamp() * 1000)}"
        cursor.execute("""
        INSERT INTO audit_logs (id, timestamp, user, action, details)
        VALUES (?, ?, ?, ?, ?)
        """, (log_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), user, f"CASH_{tx_type}", f"Rs. {amount:.2f} — {reason}"))

        conn.commit()
        return {"success": True, "transactionId": tx_id}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def update_inventory_stock(item_id, new_stock):
    """Manually adjust raw material stock."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE raw_materials SET current_stock = ? WHERE id = ?", (float(new_stock), item_id))
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def get_categories():
    """Retrieve all menu categories."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT id, name, icon FROM categories ORDER BY rowid ASC")
    categories = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return categories


def create_category(cat_data):
    """Create a new menu category."""
    conn = get_connection()
    cursor = conn.cursor()
    cat_id = cat_data.get("id") or cat_data.get("name", "").lower().replace(" ", "_")
    name = cat_data.get("name", "")
    icon = cat_data.get("icon", "")
    try:
        cursor.execute("INSERT INTO categories (id, name, icon) VALUES (?, ?, ?)", (cat_id, name, icon))
        conn.commit()
        return {"success": True, "category": {"id": cat_id, "name": name, "icon": icon}}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def update_category(cat_id, cat_data):
    """Update category details."""
    conn = get_connection()
    cursor = conn.cursor()
    name = cat_data.get("name")
    icon = cat_data.get("icon")
    try:
        cursor.execute("UPDATE categories SET name = COALESCE(?, name), icon = COALESCE(?, icon) WHERE id = ?", (name, icon, cat_id))
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def delete_category(cat_id):
    """Delete a category."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM categories WHERE id = ?", (cat_id,))
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def get_product(product_id):
    """Get single product details with parsed variations, recipe, and modifiers."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM products WHERE id = ?", (product_id,))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    p = dict(row)
    p["recipe"] = json.loads(p.get("recipe") or "[]")
    p["variations"] = json.loads(p.get("variations") or "[]")
    p["modifiers"] = json.loads(p.get("modifiers") or "[]")
    return p


def create_product(prod_data):
    """Create a new product in the catalog."""
    conn = get_connection()
    cursor = conn.cursor()
    prod_id = prod_data.get("id") or f"p_{int(datetime.now().timestamp() * 1000)}"
    name = prod_data.get("name", "")
    category_id = prod_data.get("categoryId") or prod_data.get("category_id", "burgers")
    price = float(prod_data.get("price", 0.0))
    desc = prod_data.get("desc", "")
    stock = int(prod_data.get("stock", 50))
    station = prod_data.get("station", "burger")
    recipe = json.dumps(prod_data.get("recipe", []))
    variations = json.dumps(prod_data.get("variations", []))
    modifiers = json.dumps(prod_data.get("modifiers", []))

    try:
        cursor.execute("""
        INSERT INTO products (id, name, category_id, price, desc, stock, station, recipe, variations, modifiers)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (prod_id, name, category_id, price, desc, stock, station, recipe, variations, modifiers))
        conn.commit()
        return {"success": True, "id": prod_id}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def update_product(prod_id, prod_data):
    """Update existing product."""
    conn = get_connection()
    cursor = conn.cursor()
    fields = []
    values = []

    for key, col in [("name", "name"), ("categoryId", "category_id"), ("category_id", "category_id"),
                     ("price", "price"), ("desc", "desc"), ("stock", "stock"), ("station", "station")]:
        if key in prod_data:
            fields.append(f"{col} = ?")
            values.append(prod_data[key])

    for json_key in ["recipe", "variations", "modifiers"]:
        if json_key in prod_data:
            fields.append(f"{json_key} = ?")
            values.append(json.dumps(prod_data[json_key]))

    if not fields:
        conn.close()
        return {"success": True}

    values.append(prod_id)
    query = f"UPDATE products SET {', '.join(fields)} WHERE id = ?"
    try:
        cursor.execute(query, values)
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def delete_product(prod_id):
    """Delete product from catalog."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM products WHERE id = ?", (prod_id,))
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def record_wastage(raw_id, qty, reason, user="Ali"):
    """Record inventory wastage and deduct from stock."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE raw_materials SET current_stock = MAX(0, current_stock - ?) WHERE id = ?", (float(qty), raw_id))
        log_id = f"LOG-{int(datetime.now().timestamp() * 1000)}"
        cursor.execute("""
        INSERT INTO audit_logs (id, timestamp, user, action, details)
        VALUES (?, ?, ?, 'INVENTORY_WASTAGE', ?)
        """, (log_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), user, f"Wasted {qty} units of {raw_id}. Reason: {reason}"))
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def get_order(order_id):
    """Get detailed order by ID or Token."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM orders WHERE id = ? OR token = ?", (order_id, order_id))
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    d = dict(row)
    try:
        d["items"] = json.loads(d.get("items") or "[]")
        d["totals"] = json.loads(d.get("totals_json") or "{}")
    except Exception:
        pass
    return d


# ==============================================================================
# Kitchen Display System (KDS) Operations
# ==============================================================================

def get_kds_orders():
    """Retrieve all active / recent kitchen display tickets."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM kds_orders WHERE status != 'SERVED' ORDER BY rowid DESC")
    tickets = []
    for r in cursor.fetchall():
        d = dict(r)
        try:
            d["items"] = json.loads(d.get("items") or "[]")
        except Exception:
            pass
        tickets.append(d)
    conn.close()
    return tickets


def create_kds_order(ticket_data):
    """Insert or update ticket into KDS queue."""
    conn = get_connection()
    cursor = conn.cursor()
    ticket_id = ticket_data.get("id") or f"ORD-{int(datetime.now().timestamp() * 1000) % 100000}"
    token = ticket_data.get("token", "T-000")
    order_type = ticket_data.get("orderType", "dine-in")
    status = ticket_data.get("status", "PENDING")
    elapsed_seconds = int(ticket_data.get("elapsedSeconds", 0))
    station = ticket_data.get("station", "burger")
    created_at = ticket_data.get("createdAt") or datetime.now().strftime("%I:%M %p")
    items = json.dumps(ticket_data.get("items", []))

    try:
        cursor.execute("""
        INSERT OR REPLACE INTO kds_orders (id, token, order_type, status, elapsed_seconds, station, created_at, items)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        """, (ticket_id, token, order_type, status, elapsed_seconds, station, created_at, items))
        conn.commit()
        return {"success": True, "ticketId": ticket_id}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def update_kds_order_status(ticket_id, new_status):
    """Update KDS ticket status (PENDING, PREPARING, READY, SERVED)."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE kds_orders SET status = ? WHERE id = ? OR token = ?", (new_status.upper(), ticket_id, ticket_id))
        conn.commit()
        return {"success": True, "status": new_status.upper()}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def sync_kds_elapsed_time(ticket_id, elapsed_seconds):
    """Update ticket timer."""
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("UPDATE kds_orders SET elapsed_seconds = ? WHERE id = ?", (int(elapsed_seconds), ticket_id))
        conn.commit()
        return {"success": True}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


# ==============================================================================
# Cash Drawer Sessions & Shift Management
# ==============================================================================

def get_active_cash_session():
    """Get the currently open cash drawer shift session."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cash_sessions WHERE status = 'OPEN' ORDER BY rowid DESC LIMIT 1")
    row = cursor.fetchone()
    conn.close()
    if not row:
        return None
    return dict(row)


def open_cash_session(session_data):
    """Open a new cashier drawer shift session."""
    conn = get_connection()
    cursor = conn.cursor()
    session_id = session_data.get("id") or f"CS-{int(datetime.now().timestamp() * 1000) % 100000}"
    branch_id = session_data.get("branchId", "branch-01")
    user_id = session_data.get("userId", "u-ali")
    cashier_name = session_data.get("cashierName", "Ali (Cashier)")
    opening_cash = float(session_data.get("openingCash", 10000.0))
    opened_at = datetime.now().isoformat()

    try:
        # Close any previous open session
        cursor.execute("UPDATE cash_sessions SET status = 'CLOSED', closed_at = ? WHERE status = 'OPEN'", (opened_at,))
        cursor.execute("""
        INSERT INTO cash_sessions (id, branch_id, user_id, cashier_name, status, opened_at, opening_cash, cash_sales, cash_in, cash_out, refunds)
        VALUES (?, ?, ?, ?, 'OPEN', ?, ?, 0.0, 0.0, 0.0, 0.0)
        """, (session_id, branch_id, user_id, cashier_name, opened_at, opening_cash))

        log_id = f"LOG-{int(datetime.now().timestamp() * 1000)}"
        cursor.execute("""
        INSERT INTO audit_logs (id, timestamp, user, action, details)
        VALUES (?, ?, ?, 'SHIFT_OPENED', ?)
        """, (log_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), cashier_name, f"Shift opened with starting float Rs. {opening_cash:.2f}"))

        conn.commit()
        return {"success": True, "sessionId": session_id}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def close_cash_session(session_id, close_data):
    """Close the shift register with counted cash, variance, and notes."""
    conn = get_connection()
    cursor = conn.cursor()
    actual_cash = float(close_data.get("actualCash", 0.0))
    cashier = close_data.get("user", "Ali")
    notes = close_data.get("notes", "")

    try:
        cursor.execute("SELECT * FROM cash_sessions WHERE id = ?", (session_id,))
        row = cursor.fetchone()
        if not row:
            conn.close()
            return {"success": False, "error": "Session not found"}

        session = dict(row)
        expected = float(session.get("opening_cash", 0)) + float(session.get("cash_sales", 0)) + float(session.get("cash_in", 0)) - float(session.get("cash_out", 0)) - float(session.get("refunds", 0))
        diff = actual_cash - expected

        now_str = datetime.now().isoformat()
        cursor.execute("""
        UPDATE cash_sessions 
        SET status = 'CLOSED', closed_at = ?
        WHERE id = ?
        """, (now_str, session_id))

        log_id = f"LOG-{int(datetime.now().timestamp() * 1000)}"
        cursor.execute("""
        INSERT INTO audit_logs (id, timestamp, user, action, details)
        VALUES (?, ?, ?, 'SHIFT_CLOSED', ?)
        """, (log_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), cashier, f"Shift {session_id} closed. Counted: Rs. {actual_cash:.2f}, Expected: Rs. {expected:.2f}, Diff: Rs. {diff:.2f}. Notes: {notes}"))

        conn.commit()
        return {"success": True, "expected": expected, "actual": actual_cash, "difference": diff}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def get_cash_transactions(limit=50):
    """Get cash ledger transactions list."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM cash_transactions ORDER BY rowid DESC LIMIT ?", (limit,))
    txs = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return txs


# ==============================================================================
# Reports & Real-Time Analytics
# ==============================================================================

def get_reports_summary():
    """Calculate aggregated operational metrics directly from SQLite."""
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Total sales & order count
    cursor.execute("SELECT COUNT(*), COALESCE(SUM(total), 0) FROM orders")
    order_count, total_sales = cursor.fetchone()

    # 2. Payment breakdown
    cursor.execute("SELECT payment_method, COUNT(*), COALESCE(SUM(total), 0) FROM orders GROUP BY payment_method")
    payment_stats = [{"method": r[0], "count": r[1], "total": r[2]} for r in cursor.fetchall()]

    # 3. Order type breakdown
    cursor.execute("SELECT order_type, COUNT(*), COALESCE(SUM(total), 0) FROM orders GROUP BY order_type")
    type_stats = [{"type": r[0], "count": r[1], "total": r[2]} for r in cursor.fetchall()]

    # 4. Hourly sales breakdown (last 24 hours)
    cursor.execute("""
    SELECT strftime('%H:00', created_at) as hr, COUNT(*), COALESCE(SUM(total), 0)
    FROM orders
    GROUP BY hr
    ORDER BY hr ASC
    """)
    hourly_stats = [{"hour": r[0], "orders": r[1], "sales": r[2]} for r in cursor.fetchall()]

    # 5. Low stock alerts
    cursor.execute("SELECT id, name, current_stock, min_stock, unit FROM raw_materials WHERE current_stock <= min_stock")
    low_stock = [dict(r) for r in cursor.fetchall()]

    # 6. Active Cash drawer metrics
    cursor.execute("SELECT * FROM cash_sessions WHERE status = 'OPEN' ORDER BY rowid DESC LIMIT 1")
    session_row = cursor.fetchone()
    cash_drawer = None
    if session_row:
        s = dict(session_row)
        expected = float(s.get("opening_cash", 0)) + float(s.get("cash_sales", 0)) + float(s.get("cash_in", 0)) - float(s.get("cash_out", 0)) - float(s.get("refunds", 0))
        cash_drawer = {
            "opening": s.get("opening_cash", 0),
            "sales": s.get("cash_sales", 0),
            "in": s.get("cash_in", 0),
            "out": s.get("cash_out", 0),
            "expectedCash": expected
        }

    conn.close()
    return {
        "totalSales": total_sales,
        "orderCount": order_count,
        "averageOrderValue": (total_sales / order_count) if order_count > 0 else 0.0,
        "paymentStats": payment_stats,
        "typeStats": type_stats,
        "hourlyStats": hourly_stats,
        "lowStockItems": low_stock,
        "cashDrawer": cash_drawer,
        "generatedAt": datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    }


# ==============================================================================
# Audit Trail
# ==============================================================================

def log_audit(user, action, details):
    """Insert audit trail record."""
    conn = get_connection()
    cursor = conn.cursor()
    log_id = f"LOG-{int(datetime.now().timestamp() * 1000)}"
    try:
        cursor.execute("""
        INSERT INTO audit_logs (id, timestamp, user, action, details)
        VALUES (?, ?, ?, ?, ?)
        """, (log_id, datetime.now().strftime("%Y-%m-%d %H:%M:%S"), user, action, details))
        conn.commit()
        return {"success": True, "logId": log_id}
    except Exception as e:
        conn.rollback()
        return {"success": False, "error": str(e)}
    finally:
        conn.close()


def get_audit_logs(limit=100):
    """Retrieve recent audit logs."""
    conn = get_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM audit_logs ORDER BY timestamp DESC, rowid DESC LIMIT ?", (limit,))
    logs = [dict(r) for r in cursor.fetchall()]
    conn.close()
    return logs


def export_sql_dump():
    """Dump database schema and data as an executable SQL script."""
    conn = get_connection()
    sql_lines = []
    for line in conn.iterdump():
        sql_lines.append(line)
    conn.close()
    return "\n".join(sql_lines)


if __name__ == "__main__":
    print(f"Initializing FastFood SQLite Database at: {DB_FILE}")
    init_db()
    status = get_db_status()
    print("Database Initialized Successfully!")
    print(json.dumps(status, indent=2))

