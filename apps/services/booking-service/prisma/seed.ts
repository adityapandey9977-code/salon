import { PrismaClient } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Booking Service database...');

  const tenantId = 'a0000000-0000-0000-0000-000000000001';
  const branchId = 'b0000000-0000-0000-0000-000000000001';
  const clientId = 'c0000000-0000-0000-0000-000000000001';
  const staffId = 's0000000-0000-0000-0000-000000000001';
  const serviceId = 'sv000000-0000-0000-0000-000000000001';

  const startTime = new Date();
  startTime.setHours(11, 0, 0, 0);
  const endTime = new Date(startTime.getTime() + 60 * 60 * 1000);

  const appointment = await prisma.appointment.create({
    data: {
      tenantId,
      branchId,
      clientId,
      status: 'CONFIRMED',
      startTime,
      endTime,
      totalPrice: 1500.0,
      lineItems: {
        create: {
          serviceId,
          staffId,
          startTime,
          endTime,
          price: 1500.0,
          status: 'CONFIRMED',
        },
      },
      statusHistory: {
        create: {
          previousStatus: 'PENDING',
          newStatus: 'CONFIRMED',
          reason: 'Initial confirmed booking',
        },
      },
    },
  });

  console.log(`Booking Service seeded appointment: ${appointment.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
