const sqlite3 = require('sqlite3');
const db = new sqlite3.Database('./heartchain.sqlite');

db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
  if (err) {
    console.error('Error:', err.message);
  } else {
    console.log('Tables:', JSON.stringify(rows, null, 2));
  }
  
  // 테이블 있으면 user 테이블 조회
  if (rows && rows.length > 0) {
    const tableNames = rows.map(r => r.name);
    const userTable = tableNames.find(n => n.toLowerCase().includes('user'));
    if (userTable) {
      db.all(`SELECT id, phone, nickname, role FROM "${userTable}" LIMIT 10`, (err2, users) => {
        if (err2) console.error('User query error:', err2.message);
        else console.log('Users:', JSON.stringify(users, null, 2));
        db.close();
      });
    } else {
      console.log('No user table found. Tables are:', tableNames);
      db.close();
    }
  } else {
    console.log('No tables found - DB might be empty');
    db.close();
  }
});
