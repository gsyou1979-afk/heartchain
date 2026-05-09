import urllib.request
import json

url = 'http://localhost:3005/api/v1/ad/placements'
req = urllib.request.Request(url, headers={'Authorization': 'Bearer test'})

try:
    r = urllib.request.urlopen(req, timeout=10)
    print('Status:', r.status)
    data = r.read().decode('utf-8')
    print('Response:', data[:300])
except Exception as e:
    print('Error:', e)
