import { PrismaClient } from '@prisma/client';

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
      imageUrl: 'https://via.placeholder.com/400',
      basePrice: 15000,
      priceUnit: 'flat' as any,
      estimatedDurationMinutes: 180,
    },
    {
      name: 'Office Deep Clean',
      slug: 'office-deep-clean',
      category: 'office' as any,
      description: 'Professional cleaning tailored for office spaces, ensuring a productive and sanitary environment.',
      shortDescription: 'Professional office cleaning.',
      imageUrl: 'https://via.placeholder.com/400',
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

  // Create an admin user for testing if none exists
  // Password is 'password123'
  const adminEmail = 'admin@cleannaija.com';
  const existingAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!existingAdmin) {
    await prisma.user.create({
      data: {
        firstName: 'System',
        lastName: 'Admin',
        email: adminEmail,
        phone: '+2348000000000',
        passwordHash: '$2a$10$tZ92Oa/5y3G7N1D4pZ8E/u7Tq6C8zD.Wv.wW4L.9A9n7wN1/kE.8y', // bcrypt hash for 'password123'
        role: 'admin',
        isVerified: true,
      },
    });
    console.log('Admin user created (admin@cleannaija.com / password123)');
  }

  console.log('Database seeding completed.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
