import requests
import json
import sys

# Create admin account
data = {
    "phone": "admin123",
    "password": "admin888",
    "nickname": "Admin",
    "role": "admin"
}

r = requests.post('http://localhost:3000/api/v1/auth/register', json=data)
print("Status:", r.status_code)
if r.status_code in [200, 201]:
    print("SUCCESS: Admin account created!")
else:
    print("FAILED - Status:", r.status_code)
