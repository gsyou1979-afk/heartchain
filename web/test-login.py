import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')

# Test 3002 direct
print("=== Testing 3002 (direct backend) ===")
r = requests.post('http://localhost:3002/api/v1/auth/password-login',
    json={'phone': '13800138000', 'password': 'password123'}, timeout=10)
print(f"Status: {r.status_code}")
print(f"Response: {r.text[:500]}")

# Test 3001 via proxy
print("\n=== Testing 3001 (via devProxy) ===")
r2 = requests.post('http://localhost:3001/api/v1/auth/password-login',
    json={'phone': '13800138000', 'password': 'password123'}, timeout=10)
print(f"Status: {r2.status_code}")
print(f"Response: {r2.text[:500]}")
