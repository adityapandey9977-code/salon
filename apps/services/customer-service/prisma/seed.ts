import { PrismaClient } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Customer Service database...');

  const tenantId = 'a0000000-0000-0000-0000-000000000001';

  // Seed Tags
  const vipTag = await prisma.customerTag.upsert({
    where: {
      tenantId_name: {
        tenantId,
        name: 'VIP Client',
      },
    },
    update: {},
    create: {
      tenantId,
      name: 'VIP Client',
      colorHex: '#8B5CF6',
    },
  });

  // Seed Customer
  const customer = await prisma.customer.upsert({
    where: {
      tenantId_phone: {
        tenantId,
        phone: '+919876543210',
      },
    },
    update: {},
    create: {
      tenantId,
      firstName: 'Ananya',
      lastName: 'Sharma',
      phone: '+919876543210',
      email: 'ananya.sharma@example.com',
      gender: 'FEMALE',
      totalVisits: 5,
      totalSpent: 12500.0,
      preferences: {
        create: {
          preferredBeverage: 'Green Tea',
          preferredContact: 'WHATSAPP',
          marketingOptIn: true,
        },
      },
      cautions: {
        create: {
          title: 'Skin Sensitivity',
          description: 'Mild allergy to ammonia-based hair bleach',
          severity: 'HIGH',
        },
      },
      tagMappings: {
        create: {
          tagId: vipTag.id,
        },
      },
    },
  });

  console.log(`Customer Service seeded customer: ${customer.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
