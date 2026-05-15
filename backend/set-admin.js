const { DataSource } = require('typeorm');

async function setAdmin() {
  const ds = new DataSource({
    type: 'postgres',
    host: 'localhost',
    port: 5432,
    username: 'postgres',
    password: 'postgres',
    database: 'heartchain'
  });

  try {
    await ds.initialize();
    console.log('Connected to database');

    // Find user by phone
    const result = await ds.query(
      "UPDATE users SET role = 'admin' WHERE phone = '+821098765432' RETURNING id, phone, nickname, role"
    );
    
    if (result.length > 0) {
      console.log('SUCCESS: User updated to admin!');
      console.log(result[0]);
    } else {
      console.log('User not found. Creating admin user...');

      // Create admin user directly
      const bcrypt = require('bcrypt');
      const passwordHash = await bcrypt.hash('admin888', 10);

      const newUser = await ds.query(
        `INSERT INTO users (id, phone, password_hash, nickname, role, status, region, "createdAt", "updatedAt")
         VALUES (gen_random_uuid(), '+821098765432', $1, 'Admin', 'admin', 'active', 'kr', NOW(), NOW())
         RETURNING id, phone, nickname, role`,
        [passwordHash]
      );

      console.log('Admin user created!');
      console.log(newUser[0]);
    }

    await ds.destroy();
    console.log('Done');
  } catch (e) {
    console.error('Error:', e.message);
  }
}

setAdmin();
