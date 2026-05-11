import sqlite3
import json
import sys

sys.stdout.reconfigure(encoding='utf-8')

conn = sqlite3.connect(r'E:\WorkBuddy\heartchain\backend\heartchain.sqlite')
conn.row_factory = sqlite3.Row
c = conn.cursor()

# Count users
c.execute('SELECT COUNT(*) FROM users')
print(f"Users: {c.fetchone()[0]}")

# Count tasks
c.execute('SELECT COUNT(*) FROM tasks')
print(f"Tasks: {c.fetchone()[0]}")

# Show all users
print("\n=== USERS ===")
c.execute('SELECT * FROM users')
for row in c.fetchall():
    d = dict(row)
    print(json.dumps(d, default=str, ensure_ascii=False))

# Show all tasks
print("\n=== TASKS ===")
c.execute('SELECT * FROM tasks')
for row in c.fetchall():
    d = dict(row)
    print(json.dumps(d, default=str, ensure_ascii=False))

# Show tables
print("\n=== TABLES ===")
c.execute("SELECT name FROM sqlite_master WHERE type='table'")
for row in c.fetchall():
    print(row['name'])

conn.close()
