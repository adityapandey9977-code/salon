import { PrismaClient, BillingInterval } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Platform Service database...');

  // 1. Feature Definitions
  const features = [
    { key: 'BOOKING', name: 'Core Appointment Booking & Calendar', category: 'CORE' },
    { key: 'POS', name: 'Billing, POS & Invoicing', category: 'CORE' },
    { key: 'INVENTORY', name: 'Inventory & Procurement Engine', category: 'OPERATIONS' },
    { key: 'FINANCE', name: 'Financial Accounting & Payroll Runs', category: 'OPERATIONS' },
    { key: 'FRANCHISE', name: 'Franchise Royalty & Multi-partner Settlements', category: 'GROWTH' },
    { key: 'CALL_CENTER', name: 'Telephony, Call Logs & Tele-booking Queue', category: 'GROWTH' },
    { key: 'ADVANCED_REPORTING', name: 'Analytics Projections & Export Engine', category: 'GROWTH' },
    { key: 'CUSTOM_DOMAIN', name: 'White-label Custom Domain & SSL', category: 'ENTERPRISE' },
    { key: 'CUSTOMER_MOBILE', name: 'Branded Customer Mobile App Integration', category: 'ENTERPRISE' },
    { key: 'MULTI_BRANCH', name: 'Multi-branch Centralized Management', category: 'ENTERPRISE' },
  ];

  const createdFeatures: Record<string, any> = {};
  for (const feat of features) {
    createdFeatures[feat.key] = await prisma.featureDefinition.upsert({
      where: { key: feat.key },
      update: { name: feat.name, category: feat.category, isActive: true },
      create: { key: feat.key, name: feat.name, category: feat.category, isActive: true },
    });
  }

  // 2. Subscription Plans
  const plans = [
    {
      code: 'STARTER',
      name: 'Starter Solo/Single Salon',
      description: 'Ideal for single branch boutique salons and spas starting up.',
      billingInterval: BillingInterval.MONTHLY,
      basePrice: 1999.0,
      currency: 'INR',
      trialDays: 14,
      maxBranches: 1,
      maxStaff: 5,
      maxCustomers: 1000,
      features: ['BOOKING', 'POS', 'INVENTORY', 'ADVANCED_REPORTING'],
    },
    {
      code: 'GROWTH',
      name: 'Growth Multi-Branch Salon',
      description: 'For fast-growing salon chains with up to 5 locations and full operations.',
      billingInterval: BillingInterval.MONTHLY,
      basePrice: 5999.0,
      currency: 'INR',
      trialDays: 14,
      maxBranches: 5,
      maxStaff: 25,
      maxCustomers: 10000,
      features: ['BOOKING', 'POS', 'INVENTORY', 'FINANCE', 'CALL_CENTER', 'ADVANCED_REPORTING', 'MULTI_BRANCH'],
    },
    {
      code: 'ENTERPRISE',
      name: 'Enterprise & Franchise Empire',
      description: 'Complete multi-franchise platform with custom domains, dedicated call center and unlimited scale.',
      billingInterval: BillingInterval.MONTHLY,
      basePrice: 14999.0,
      currency: 'INR',
      trialDays: 30,
      maxBranches: 25,
      maxStaff: 150,
      maxCustomers: null,
      features: [
        'BOOKING',
        'POS',
        'INVENTORY',
        'FINANCE',
        'FRANCHISE',
        'CALL_CENTER',
        'ADVANCED_REPORTING',
        'CUSTOM_DOMAIN',
        'CUSTOMER_MOBILE',
        'MULTI_BRANCH',
      ],
    },
  ];

  for (const p of plans) {
    const plan = await prisma.subscriptionPlan.upsert({
      where: { code: p.code },
      update: {
        name: p.name,
        description: p.description,
        billingInterval: p.billingInterval,
        basePrice: p.basePrice,
        currency: p.currency,
        trialDays: p.trialDays,
        maxBranches: p.maxBranches,
        maxStaff: p.maxStaff,
        maxCustomers: p.maxCustomers,
        isActive: true,
        isPublic: true,
      },
      create: {
        code: p.code,
        name: p.name,
        description: p.description,
        billingInterval: p.billingInterval,
        basePrice: p.basePrice,
        currency: p.currency,
        trialDays: p.trialDays,
        maxBranches: p.maxBranches,
        maxStaff: p.maxStaff,
        maxCustomers: p.maxCustomers,
        isActive: true,
        isPublic: true,
      },
    });

    // Link Plan Features
    for (const featKey of p.features) {
      const feat = createdFeatures[featKey];
      if (feat) {
        await prisma.planFeature.upsert({
          where: {
            planId_featureId: {
              planId: plan.id,
              featureId: feat.id,
            },
          },
          update: { enabled: true },
          create: {
            planId: plan.id,
            featureId: feat.id,
            enabled: true,
          },
        });
      }
    }
  }

  // 3. Platform Configs
  const configs = [
    { key: 'PLATFORM_NAME', value: '  Salon & Spa SaaS' },
    { key: 'DEFAULT_CURRENCY', value: 'INR' },
    { key: 'SUPPORT_EMAIL', value: 'support@digiflexsalon.com' },
    { key: 'TRIAL_GRACE_PERIOD_DAYS', value: '3' },
  ];

  for (const c of configs) {
    await prisma.platformConfig.upsert({
      where: { key: c.key },
      update: { value: c.value },
      create: c,
    });
  }

  console.log('Platform Service database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
