import { PrismaClient, Channel } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Communication Service database...');

  const templates = [
    {
      code: 'APPOINTMENT_CONFIRMED',
      channel: Channel.WHATSAPP,
      name: 'Appointment Confirmation WhatsApp',
      bodyTemplate: 'Hi {{clientName}}, your appointment for {{serviceName}} at   Salon is confirmed for {{time}}! See you soon.',
    },
    {
      code: 'APPOINTMENT_CONFIRMED',
      channel: Channel.SMS,
      name: 'Appointment Confirmation SMS',
      bodyTemplate: '  Salon: Your booking for {{serviceName}} is confirmed for {{time}}.',
    },
    {
      code: 'PAYMENT_RECEIPT',
      channel: Channel.SMS,
      name: 'Digital Payment Receipt SMS',
      bodyTemplate: '  Salon: Payment of INR {{amount}} received for Invoice #{{invoiceId}}. View digital receipt here: https://digiflexsalon.com/receipt/{{invoiceId}}',
    },
    {
      code: 'PAYMENT_RECEIPT',
      channel: Channel.EMAIL,
      name: 'Digital Payment Receipt Email',
      subjectTemplate: 'Your   Salon Receipt - Invoice #{{invoiceId}}',
      bodyTemplate: '<h2>Thank you for visiting   Salon!</h2><p>Payment of INR {{amount}} was successfully received for Invoice #{{invoiceId}}.</p>',
    },
    {
      code: 'WINBACK_OFFER',
      channel: Channel.WHATSAPP,
      name: 'VIP Winback Promotion WhatsApp',
      bodyTemplate: 'Hey {{clientName}}! We miss you at   Salon. Use promo code {{promoCode}} for {{discountPercent}}% off your next facial or hair spa this weekend!',
    },
  ];

  for (const t of templates) {
    await prisma.notificationTemplate.upsert({
      where: {
        code_channel_language: {
          code: t.code,
          channel: t.channel,
          language: 'en',
        },
      },
      update: {
        name: t.name,
        subjectTemplate: t.subjectTemplate,
        bodyTemplate: t.bodyTemplate,
      },
      create: {
        code: t.code,
        channel: t.channel,
        name: t.name,
        subjectTemplate: t.subjectTemplate,
        bodyTemplate: t.bodyTemplate,
        language: 'en',
      },
    });
  }

  // Seed Call Center Agent Profile
  await prisma.callCenterAgentProfile.upsert({
    where: { identityUserId: 'a0000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'a0000000-0000-0000-0000-000000000001',
      tenantId: 'e4b3c2a1-0000-0000-0000-000000000001',
      identityUserId: 'a0000000-0000-0000-0000-000000000001',
      providerAgentId: 'agent_priya_sharma',
      status: 'AVAILABLE',
    },
  });

  console.log('Communication Service database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
