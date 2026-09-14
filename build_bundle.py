import re
import os

files = [
    ("js/state/mockData.js", "mockData"),
    ("js/state/dbAdapter.js", "dbAdapter"),
    ("js/state/store.js", "store"),
    ("js/pos/cartEngine.js", "cartEngine"),
    ("js/inventory/recipeEngine.js", "recipeEngine"),
    ("js/cash/cashDrawer.js", "cashDrawer"),
    ("js/kds/kdsEngine.js", "kdsEngine"),
    ("js/modules/modulesUI.js", "modulesUI"),
    ("js/pos/posUI.js", "posUI"),
    ("js/app.js", "app")
]

bundle_parts = []
bundle_parts.append("// FastFood Terminal Standalone Bundle\n(function() {\n'use strict';\n")

for filepath, name in files:
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # Remove import lines
    content = re.sub(r'^\s*import\s+[^;]+;\s*$', '', content, flags=re.MULTILINE)
    # Remove single line export default / export { ... }
    content = re.sub(r'^\s*export\s*\{[^}]+\};\s*$', '', content, flags=re.MULTILINE)
    # Replace export const / export let / export function / export class
    content = re.sub(r'^\s*export\s+(const|let|var|function|class)\s+', r'\1 ', content, flags=re.MULTILINE)

    bundle_parts.append(f"\n// --- FILE: {filepath} ---\n")
    bundle_parts.append(content)

# Expose to window for global access
bundle_parts.append("""
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
""")

bundle_code = "\n".join(bundle_parts)

with open("js/bundle.js", "w", encoding="utf-8") as f:
    f.write(bundle_code)

print(f"Bundle successfully created: js/bundle.js ({len(bundle_code)} bytes)")
