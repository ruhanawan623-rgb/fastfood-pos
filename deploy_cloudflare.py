"""
FastFood POS - Automated Cloudflare Pages Deployer
Deploys the static assets (HTML, CSS, JS bundle) directly to Cloudflare Pages
using the Cloudflare Direct Upload REST API.
"""

import os
import sys
import json
import base64
import hashlib
import mimetypes
import urllib.request
import urllib.error

# Ensure stdout handles UTF-8 safely on Windows
if sys.platform == "win32":
    import io
    sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8', errors='replace')

PROJECT_DIR = os.path.dirname(os.path.abspath(__file__))

# Load from .env file if available
env_file = os.path.join(PROJECT_DIR, ".env")
if os.path.exists(env_file):
    with open(env_file, "r", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line and not line.startswith("#") and "=" in line:
                k, v = line.split("=", 1)
                os.environ.setdefault(k.strip(), v.strip())

API_TOKEN = os.environ.get("CLOUDFLARE_API_TOKEN", "")
ACCOUNT_ID = os.environ.get("CLOUDFLARE_ACCOUNT_ID", "3416b41cb65e87044027bd5303691a8d")
PROJECT_NAME = "fastfood-pos"

mimetypes.init()
mimetypes.add_type("text/css", ".css")
mimetypes.add_type("application/javascript", ".js")
mimetypes.add_type("text/html", ".html")

def collect_files():
    files_to_deploy = {}
    
    # 1. index.html
    index_path = os.path.join(PROJECT_DIR, "index.html")
    if os.path.exists(index_path):
        files_to_deploy["/index.html"] = index_path
    
    # 2. _worker.js (Cloudflare Pages Advanced Serverless Edge Backend)
    worker_path = os.path.join(PROJECT_DIR, "_worker.js")
    if os.path.exists(worker_path):
        files_to_deploy["/_worker.js"] = worker_path
    
    # 3. css directory
    css_dir = os.path.join(PROJECT_DIR, "css")
    if os.path.exists(css_dir):
        for root, _, files in os.walk(css_dir):
            for file in files:
                rel = os.path.relpath(os.path.join(root, file), PROJECT_DIR).replace("\\", "/")
                files_to_deploy["/" + rel] = os.path.join(root, file)
                
    # 4. js directory
    js_dir = os.path.join(PROJECT_DIR, "js")
    if os.path.exists(js_dir):
        for root, _, files in os.walk(js_dir):
            for file in files:
                rel = os.path.relpath(os.path.join(root, file), PROJECT_DIR).replace("\\", "/")
                files_to_deploy["/" + rel] = os.path.join(root, file)
                
    return files_to_deploy

def deploy():
    print("==================================================")
    print(f"Deploying {PROJECT_NAME} to Cloudflare Pages...")
    print("==================================================")
    
    # Ensure fresh bundle
    bundle_script = os.path.join(PROJECT_DIR, "build_bundle.py")
    if os.path.exists(bundle_script):
        print("Rebuilding js/bundle.js...")
        os.system(f'python "{bundle_script}"')

    files_map = collect_files()
    print(f"\nFound {len(files_map)} files to deploy.")

    assets = {}
    manifest = {}
    for web_path, local_path in files_map.items():
        with open(local_path, "rb") as f:
            content = f.read()
        
        content_hash = hashlib.md5(content).hexdigest()
        manifest[web_path] = content_hash
        
        mime_type, _ = mimetypes.guess_type(local_path)
        if not mime_type:
            mime_type = "application/octet-stream"
        if mime_type.startswith("text/") or mime_type == "application/javascript":
            mime_type += "; charset=utf-8"
            
        assets[content_hash] = {
            "key": content_hash,
            "value": base64.b64encode(content).decode("utf-8"),
            "metadata": {"contentType": mime_type},
            "base64": True
        }

    unique_hashes = list(assets.keys())

    # 1. Get upload JWT
    print("\n[1/4] Requesting upload JWT...")
    token_req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_NAME}/upload-token",
        headers={"Authorization": f"Bearer {API_TOKEN}"}
    )
    with urllib.request.urlopen(token_req) as resp:
        token_data = json.loads(resp.read().decode())
        jwt = token_data["result"]["jwt"]

    # 2. Check missing hashes
    print("[2/4] Checking missing assets on Cloudflare edge...")
    check_req = urllib.request.Request(
        "https://api.cloudflare.com/client/v4/pages/assets/check-missing",
        data=json.dumps({"hashes": unique_hashes}).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {jwt}",
            "Content-Type": "application/json"
        }
    )
    with urllib.request.urlopen(check_req) as resp:
        check_res = json.loads(resp.read().decode())
        missing_hashes = check_res.get("result", [])

    # 3. Upload missing assets
    if missing_hashes:
        print(f"[3/4] Uploading {len(missing_hashes)} missing assets...")
        payload = [assets[h] for h in missing_hashes]
        upload_req = urllib.request.Request(
            "https://api.cloudflare.com/client/v4/pages/assets/upload",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {jwt}",
                "Content-Type": "application/json"
            }
        )
        with urllib.request.urlopen(upload_req) as resp:
            pass
    else:
        print("[3/4] All assets already cached on Cloudflare edge.")

    # Upsert hashes
    upsert_req = urllib.request.Request(
        "https://api.cloudflare.com/client/v4/pages/assets/upsert-hashes",
        data=json.dumps({"hashes": unique_hashes}).encode("utf-8"),
        headers={
            "Authorization": f"Bearer {jwt}",
            "Content-Type": "application/json"
        }
    )
    with urllib.request.urlopen(upsert_req) as resp:
        pass

    # 4. Create deployment
    print("[4/4] Creating deployment with manifest...")
    boundary = "----WebKitFormBoundary7MA4YWxkTrZu0gW"
    body_parts = [
        f"--{boundary}\r\n".encode("utf-8"),
        b'Content-Disposition: form-data; name="manifest"\r\n\r\n',
        json.dumps(manifest).encode("utf-8"),
        b"\r\n",
        f"--{boundary}--\r\n".encode("utf-8")
    ]
    deploy_body = b"".join(body_parts)

    deploy_req = urllib.request.Request(
        f"https://api.cloudflare.com/client/v4/accounts/{ACCOUNT_ID}/pages/projects/{PROJECT_NAME}/deployments",
        data=deploy_body,
        headers={
            "Authorization": f"Bearer {API_TOKEN}",
            "Content-Type": f"multipart/form-data; boundary={boundary}"
        }
    )
    with urllib.request.urlopen(deploy_req) as resp:
        deploy_res = json.loads(resp.read().decode())
        deployment = deploy_res["result"]
        print("\n==================================================")
        print("🎉 Successfully pushed to Cloudflare Pages!")
        print(f"Production Link: https://{PROJECT_NAME}-dwl.pages.dev")
        print(f"Deployment URL:  {deployment['url']}")
        print("==================================================")

if __name__ == "__main__":
    deploy()
