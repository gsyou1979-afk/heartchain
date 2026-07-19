import sqlite3
import hashlib
import sys
import io

sys.stdout = io.TextIOWrapper(sys.stdout.buffer, encoding='utf-8')

def hash_password(password):
    return hashlib.md5((password + 'heartchain_salt').encode()).hexdigest()

db_path = r'E:\WorkBuddy\heartchain\backend\heartchain.sqlite'

print('=== HeartChain DB Operation ===\n')

conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# 1. 查看所有用户
print('1. All Users:')
cursor.execute('SELECT id, phone, nickname, role, status FROM users')
users = cursor.fetchall()
for u in users:
    print(f'   {u[1]} | {u[2]} | {u[3]} | {u[4]}')
print('')

# 2. 重置管理员密码
print('2. Reset Admin Password...')
admin_hash = hash_password('Admin@2026')
print(f'   New Hash: {admin_hash}')

cursor.execute('UPDATE users SET password = ? WHERE phone = ?', (admin_hash, '+821022098999'))
conn.commit()
print(f'   Rows affected: {cursor.rowcount}')
print('')

# 3. 确认更新
print('3. Verify Update:')
cursor.execute('SELECT id, phone, nickname, role, password FROM users WHERE phone = ?', ('+821022098999',))
admin = cursor.fetchone()
if admin:
    print(f'   Phone: {admin[1]}')
    print(f'   Nickname: {admin[2]}')
    print(f'   Role: {admin[3]}')
    print(f'   Hash: {admin[4]}')
print('')

# 4. 测试密码验证
print('4. Password Verification:')
test_hash = hash_password('Admin@2026')
print(f'   Test Hash: {test_hash}')
print(f'   DB Hash: {admin[4] if admin else "N/A"}')
print(f'   Result: {"SUCCESS" if test_hash == admin[4] else "FAILED"}')

conn.close()

print('\n=== Done ===')
print('Admin: +821022098999')
print('Password: Admin@2026')
