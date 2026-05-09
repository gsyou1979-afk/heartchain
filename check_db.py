import sqlite3
import hashlib
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

db_path = r'E:\WorkBuddy\heartchain\backend\heartchain.sqlite'

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# List tables
cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = cursor.fetchall()
print('Tables:', tables)

conn.close()
