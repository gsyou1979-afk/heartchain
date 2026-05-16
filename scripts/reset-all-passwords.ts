import * as bcrypt from 'bcryptjs';

async function main() {
  const newPassword = 'Admin@2026';
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  console.log('Bcrypt hash for Admin@2026:', hashedPassword);
  console.log('Length:', hashedPassword.length);
}

main().catch(console.error);
