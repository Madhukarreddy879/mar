import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Hash passwords
  const adminPassword = await bcrypt.hash('admin123', 10);
  const staffPassword = await bcrypt.hash('staff123', 10);

  // Delete existing users (optional - for clean seeding)
  await prisma.user.deleteMany();

  // Create admin user
  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@example.com',
      password: adminPassword,
      role: 'admin',
    },
  });

  console.log('✓ Admin created:', {
    email: admin.email,
    role: admin.role,
    password: 'admin123'
  });

  // Create staff user
  const staff = await prisma.user.create({
    data: {
      name: 'Staff Member',
      email: 'staff@example.com',
      password: staffPassword,
      role: 'staff',
    },
  });

  console.log('✓ Staff created:', {
    email: staff.email,
    role: staff.role,
    password: 'staff123'
  });

  console.log('\n✓ Seeding completed!');
  console.log('\nLogin credentials:');
  console.log('Admin  - Email: admin@example.com, Password: admin123');
  console.log('Staff  - Email: staff@example.com, Password: staff123');
}

main()
  .catch((e) => {
    console.error('Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
