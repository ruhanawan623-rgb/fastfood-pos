"""
FastFood POS - Comprehensive Unified Web & REST API Server
Full-featured, production-ready backend engine with persistent SQLite database.
Zero external dependencies (uses standard library http.server & sqlite3).
Supports both IPv4 and IPv6 dual-stack (localhost & 127.0.0.1).
"""

import sys
import os
import json
import traceback
import urllib.parse
from functools import partial
import http.server
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
import database

PORT = 5501
if len(sys.argv) > 1:
    try:
        PORT = int(sys.argv[1])
    except ValueError:
        pass

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))


class FastFoodAPIHandler(SimpleHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def _send_json(self, data, status=200):
        body = json.dumps(data).encode("utf-8")
        self.send_response(status)
        self.send_header("Content-Type", "application/json; charset=utf-8")
        self.send_header("Content-Length", str(len(body)))
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.send_header("Cache-Control", "no-cache, no-store, must-revalidate")
        self.end_headers()
        self.wfile.write(body)

    def _read_json(self):
        try:
            content_length = int(self.headers.get("Content-Length", 0))
            if content_length > 0:
                raw = self.rfile.read(content_length).decode("utf-8")
                return json.loads(raw) if raw else {}
        except Exception:
            pass
        return {}

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
        self.send_header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With")
        self.send_header("Content-Length", "0")
        self.end_headers()

    # =========================================================================
    # GET Endpoints
    # =========================================================================
    def do_GET(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path.rstrip("/")
            query = urllib.parse.parse_qs(parsed.query)

            # 1. Database Health & Engine Status
            if path == "/api/db/status":
                return self._send_json(database.get_db_status(), 200)

            # 2. Database Raw Table Inspector
            if path == "/api/db/table":
                table_name = query.get("name", ["products"])[0]
                limit = int(query.get("limit", [50])[0])
                rows = database.get_table_data(table_name, limit)
                return self._send_json({"table": table_name, "count": len(rows), "rows": rows}, 200)

            # 3. SQL Dump Backup Download
            if path == "/api/db/export":
                sql_dump = database.export_sql_dump().encode("utf-8")
                self.send_response(200)
                self.send_header("Content-Type", "text/plain; charset=utf-8")
                self.send_header("Content-Length", str(len(sql_dump)))
                self.send_header("Content-Disposition", 'attachment; filename="fastfood_backup.sql"')
                self.send_header("Access-Control-Allow-Origin", "*")
                self.end_headers()
                self.wfile.write(sql_dump)
                return

            # 4. Categories Catalog
            if path == "/api/categories":
                return self._send_json(database.get_categories(), 200)

            # 5. Products Catalog
            if path == "/api/products":
                return self._send_json(database.get_products(), 200)

            if path.startswith("/api/products/"):
                prod_id = path.split("/api/products/")[1]
                prod = database.get_product(prod_id)
                if prod:
                    return self._send_json(prod, 200)
                return self._send_json({"error": "Product not found"}, 404)

            # 6. Inventory / Raw Materials BOM
            if path == "/api/inventory":
                return self._send_json(database.get_raw_materials(), 200)

            # 7. Orders History
            if path == "/api/orders":
                limit = int(query.get("limit", [50])[0])
                return self._send_json(database.get_orders(limit), 200)

            if path.startswith("/api/orders/"):
                order_id = path.split("/api/orders/")[1]
                order = database.get_order(order_id)
                if order:
                    return self._send_json(order, 200)
                return self._send_json({"error": "Order not found"}, 404)

            # 8. Kitchen Display System (KDS) Active Tickets
            if path == "/api/kds":
                return self._send_json(database.get_kds_orders(), 200)

            # 9. Cash Drawer Shift Session & Ledger
            if path == "/api/cash/session":
                session = database.get_active_cash_session()
                return self._send_json(session or {"status": "NONE"}, 200)

            if path == "/api/cash/transactions":
                limit = int(query.get("limit", [50])[0])
                return self._send_json(database.get_cash_transactions(limit), 200)

            # 10. Reports & Analytics Summary
            if path == "/api/reports/summary":
                return self._send_json(database.get_reports_summary(), 200)

            # 11. Audit Trail
            if path == "/api/audit":
                limit = int(query.get("limit", [100])[0])
                return self._send_json(database.get_audit_logs(limit), 200)

            # Fallback to standard static file serving (HTML, CSS, JS, etc.)
            super().do_GET()
        except Exception as e:
            traceback.print_exc()
            self._send_json({"error": str(e)}, 500)

    # =========================================================================
    # POST Endpoints
    # =========================================================================
    def do_POST(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path.rstrip("/")
            body = self._read_json()

            # 1. Place / Complete Order
            if path == "/api/orders":
                result = database.create_order(body)
                # Also automatically create a KDS ticket so kitchen receives it
                if result.get("success"):
                    try:
                        kds_payload = {
                            "id": result.get("orderId"),
                            "token": result.get("token"),
                            "orderType": body.get("orderType", "dine-in"),
                            "status": "PENDING",
                            "elapsedSeconds": 0,
                            "station": body.get("station", "burger"),
                            "createdAt": body.get("time") or "Just now",
                            "items": body.get("items", [])
                        }
                        database.create_kds_order(kds_payload)
                    except Exception:
                        pass
                return self._send_json(result, 201 if result.get("success") else 400)

            # 2. Categories
            if path == "/api/categories":
                result = database.create_category(body)
                return self._send_json(result, 201 if result.get("success") else 400)

            # 3. Products
            if path == "/api/products":
                result = database.create_product(body)
                return self._send_json(result, 201 if result.get("success") else 400)

            # 4. Inventory Stock Update & Wastage
            if path == "/api/inventory/update":
                item_id = body.get("id")
                new_stock = body.get("stock")
                result = database.update_inventory_stock(item_id, new_stock)
                return self._send_json(result, 200 if result.get("success") else 400)

            if path == "/api/inventory/wastage":
                raw_id = body.get("rawId") or body.get("id")
                qty = body.get("qty", 1)
                reason = body.get("reason", "Wastage")
                user = body.get("user", "Ali")
                result = database.record_wastage(raw_id, qty, reason, user)
                return self._send_json(result, 200 if result.get("success") else 400)

            # 5. Kitchen Display Tickets (Dispatch, Status, Timer)
            if path == "/api/kds":
                result = database.create_kds_order(body)
                return self._send_json(result, 201 if result.get("success") else 400)

            if path == "/api/kds/status":
                ticket_id = body.get("id") or body.get("ticketId") or body.get("token")
                new_status = body.get("status", "PREPARING")
                result = database.update_kds_order_status(ticket_id, new_status)
                return self._send_json(result, 200 if result.get("success") else 400)

            if path == "/api/kds/time":
                ticket_id = body.get("id") or body.get("ticketId")
                elapsed = body.get("elapsedSeconds", 0)
                result = database.sync_kds_elapsed_time(ticket_id, elapsed)
                return self._send_json(result, 200 if result.get("success") else 400)

            # 6. Cash Sessions & Ledger Transactions
            if path == "/api/cash/session/open":
                result = database.open_cash_session(body)
                return self._send_json(result, 201 if result.get("success") else 400)

            if path == "/api/cash/session/close":
                session_id = body.get("id") or body.get("sessionId")
                result = database.close_cash_session(session_id, body)
                return self._send_json(result, 200 if result.get("success") else 400)

            if path == "/api/cash/transaction":
                result = database.add_cash_transaction(body)
                return self._send_json(result, 201 if result.get("success") else 400)

            # 7. Audit Logging
            if path == "/api/audit":
                user = body.get("user", "Ali")
                action = body.get("action", "SYSTEM_EVENT")
                details = body.get("details", "")
                result = database.log_audit(user, action, details)
                return self._send_json(result, 201 if result.get("success") else 400)

            # 8. Database Administration: Clear Dummy Data & Factory Reset
            if path == "/api/db/clear":
                result = database.clear_dummy_data()
                status = database.get_db_status()
                return self._send_json({"success": True, "message": "All operational dummy records cleared", "status": status}, 200)

            if path == "/api/db/reset":
                database.init_db(force_reset=True)
                status = database.get_db_status()
                return self._send_json({"success": True, "message": "Database reset to factory default catalog", "status": status}, 200)

            return self._send_json({"error": f"POST endpoint '{path}' not found"}, 404)
        except Exception as e:
            traceback.print_exc()
            self._send_json({"error": str(e)}, 500)

    # =========================================================================
    # PUT Endpoints
    # =========================================================================
    def do_PUT(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path.rstrip("/")
            body = self._read_json()

            # Update category
            if path.startswith("/api/categories/"):
                cat_id = path.split("/api/categories/")[1]
                result = database.update_category(cat_id, body)
                return self._send_json(result, 200 if result.get("success") else 400)

            # Update product
            if path.startswith("/api/products/"):
                prod_id = path.split("/api/products/")[1]
                result = database.update_product(prod_id, body)
                return self._send_json(result, 200 if result.get("success") else 400)

            # Update KDS ticket status
            if "/api/kds/" in path and path.endswith("/status"):
                parts = path.split("/")
                ticket_id = parts[3]
                new_status = body.get("status", "PREPARING")
                result = database.update_kds_order_status(ticket_id, new_status)
                return self._send_json(result, 200 if result.get("success") else 400)

            # Update KDS timer
            if "/api/kds/" in path and path.endswith("/time"):
                parts = path.split("/")
                ticket_id = parts[3]
                elapsed = body.get("elapsedSeconds", 0)
                result = database.sync_kds_elapsed_time(ticket_id, elapsed)
                return self._send_json(result, 200 if result.get("success") else 400)

            return self._send_json({"error": f"PUT endpoint '{path}' not found"}, 404)
        except Exception as e:
            traceback.print_exc()
            self._send_json({"error": str(e)}, 500)

    # =========================================================================
    # DELETE Endpoints
    # =========================================================================
    def do_DELETE(self):
        try:
            parsed = urllib.parse.urlparse(self.path)
            path = parsed.path.rstrip("/")

            if path.startswith("/api/categories/"):
                cat_id = path.split("/api/categories/")[1]
                result = database.delete_category(cat_id)
                return self._send_json(result, 200 if result.get("success") else 400)

            if path.startswith("/api/products/"):
                prod_id = path.split("/api/products/")[1]
                result = database.delete_product(prod_id)
                return self._send_json(result, 200 if result.get("success") else 400)

            return self._send_json({"error": f"DELETE endpoint '{path}' not found"}, 404)
        except Exception as e:
            traceback.print_exc()
            self._send_json({"error": str(e)}, 500)


def run_server():
    database.init_db()
    family, addr = http.server._get_best_family(None, PORT)
    ThreadingHTTPServer.address_family = family
    handler = partial(FastFoodAPIHandler, directory=PROJECT_DIR)
    httpd = ThreadingHTTPServer(addr, handler)

    print(f"==================================================")
    print(f" FastFood Unified Web & SQLite Server Running")
    print(f" Live Web App:  http://localhost:{PORT}")
    print(f" REST API:      http://localhost:{PORT}/api/db/status")
    print(f" Database File: {database.DB_FILE}")
    print(f"==================================================")
    sys.stdout.flush()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        httpd.server_close()


if __name__ == "__main__":
    run_server()
