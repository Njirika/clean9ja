import 'dotenv/config';

if (process.env.DIRECT_URL) {
  process.env.DATABASE_URL = process.env.DIRECT_URL;
}

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Create default services
  const services = [
    {
      name: 'Standard Home Shine',
      slug: 'standard-home-shine',
      category: 'home' as any,
      description: 'A comprehensive cleaning for your entire home, covering all living areas, kitchen, and bathrooms.',
      shortDescription: 'Comprehensive home cleaning.',
      imageUrl: 'https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&q=80&w=600',
      basePrice: 15000,
      priceUnit: 'flat' as any,
      estimatedDurationMinutes: 180,
    },
    {
      name: 'Office Deep Clean',
      slug: 'office-deep-clean',
      category: 'office' as any,
      description: 'Professional cleaning tailored for office spaces, ensuring a sanitary and productive environment.',
      shortDescription: 'Professional office cleaning.',
      imageUrl: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=600',
      basePrice: 25000,
      priceUnit: 'per_sqm' as any,
      estimatedDurationMinutes: 240,
    },
  ];

  for (const service of services) {
    await prisma.service.upsert({
      where: { slug: service.slug },
      update: {},
      create: service,
    });
  }

  console.log('Services seeded.');

  // Create or force update admin user to prevent 401 login errors
  const adminEmail = 'admin@cleannaija.com';
  const adminPasswordHash = await bcrypt.hash('password123', 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash: adminPasswordHash,
      role: 'admin',
      isVerified: true,
    },
    create: {
      firstName: 'System',
      lastName: 'Admin',
      email: adminEmail,
      phone: '+2348000000000',
      passwordHash: adminPasswordHash,
      role: 'admin',
      isVerified: true,
    },
  });

  console.log('Admin user seeded & validated (admin@cleannaija.com / password123)');
  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
