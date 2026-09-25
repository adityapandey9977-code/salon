import { PrismaClient } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Payment Service database...');

  const tenantId = 'a0000000-0000-0000-0000-000000000001';
  const branchId = 'b0000000-0000-0000-0000-000000000001';

  const intent = await prisma.paymentIntent.create({
    data: {
      tenantId,
      branchId,
      amount: 1500.0,
      currency: 'INR',
      status: 'SUCCEEDED',
      provider: 'UPI',
      idempotencyKey: 'seed-idempotency-key-001',
      providerOrderId: 'order_test_12345',
      payments: {
        create: {
          amount: 1500.0,
          method: 'UPI',
          transactionReference: 'UPI_REF_987654321',
          status: 'SUCCESS',
        },
      },
    },
  });

  console.log(`Payment Service seeded payment intent: ${intent.id}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
