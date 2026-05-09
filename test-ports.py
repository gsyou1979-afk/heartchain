import requests

# Test backend 3000
print("=== Testing Backend 3000 ===")
try:
    r = requests.post('http://localhost:3000/api/v1/auth/password-login',
        json={'phone': '13800138000', 'password': 'password123'}, timeout=5)
    print(f"Status: {r.status_code}")
    print(f"Response: {r.text[:200]}")
except Exception as e:
    print(f"Error: {e}")

# Test frontend 3001
print("\n=== Testing Frontend 3001 ===")
try:
    r = requests.get('http://localhost:3001', timeout=5)
    print(f"Status: {r.status_code}")
except Exception as e:
    print(f"Error: {e}")

# Test frontend 3002
print("\n=== Testing Frontend 3002 ===")
try:
    r = requests.get('http://localhost:3002', timeout=5)
    print(f"Status: {r.status_code}")
except Exception as e:
    print(f"Error: {e}")
