import { PrismaClient, AccountType, CalculationType, RoyaltyRevenueBasis } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Finance Service database...');

  const defaultTenantId = 'e4b3c2a1-0000-0000-0000-000000000001';

  // 1. Standard Chart of Accounts
  const accounts = [
    { code: '1000', name: 'Cash & Bank Clearing Account', type: AccountType.ASSET, isSystem: true },
    { code: '1100', name: 'Accounts Receivable (Customer Billing)', type: AccountType.ASSET, isSystem: true },
    { code: '1200', name: 'Inventory Asset', type: AccountType.ASSET, isSystem: true },
    { code: '2000', name: 'Accounts Payable (Suppliers)', type: AccountType.LIABILITY, isSystem: true },
    { code: '2100', name: 'Staff Commission & Tips Payable', type: AccountType.LIABILITY, isSystem: true },
    { code: '2200', name: 'GST / Tax Payable', type: AccountType.LIABILITY, isSystem: true },
    { code: '3000', name: 'Owner Equity & Retained Earnings', type: AccountType.EQUITY, isSystem: true },
    { code: '4000', name: 'Salon Service & Retail Revenue', type: AccountType.REVENUE, isSystem: true },
    { code: '4100', name: 'Franchise Royalty Revenue', type: AccountType.REVENUE, isSystem: true },
    { code: '5000', name: 'Staff Commission Expense', type: AccountType.EXPENSE, isSystem: true },
    { code: '5100', name: 'Staff Salaries & Payroll Expense', type: AccountType.EXPENSE, isSystem: true },
    { code: '5200', name: 'Salon Rent & Operational Expense', type: AccountType.EXPENSE, isSystem: true },
  ];

  for (const acc of accounts) {
    await prisma.chartOfAccount.upsert({
      where: {
        tenantId_code: {
          tenantId: defaultTenantId,
          code: acc.code,
        },
      },
      update: {
        name: acc.name,
        type: acc.type,
      },
      create: {
        tenantId: defaultTenantId,
        code: acc.code,
        name: acc.name,
        type: acc.type,
        isSystem: acc.isSystem,
      },
    });
  }

  // 2. Default Commission Rules
  await prisma.commissionRule.upsert({
    where: { id: 'c0000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'c0000000-0000-0000-0000-000000000001',
      tenantId: defaultTenantId,
      name: 'Default Stylist Service Commission (10%)',
      ruleType: 'SERVICE',
      calculationType: CalculationType.PERCENTAGE,
      percentage: 10.0,
      priority: 100,
    },
  });

  await prisma.commissionRule.upsert({
    where: { id: 'c0000000-0000-0000-0000-000000000002' },
    update: {},
    create: {
      id: 'c0000000-0000-0000-0000-000000000002',
      tenantId: defaultTenantId,
      name: 'Retail Product Sale Commission (5%)',
      ruleType: 'RETAIL',
      calculationType: CalculationType.PERCENTAGE,
      percentage: 5.0,
      priority: 90,
    },
  });

  // 3. Default Royalty Rule (5% of Gross Sales)
  await prisma.royaltyRule.upsert({
    where: { id: 'd0000000-0000-0000-0000-000000000001' },
    update: {},
    create: {
      id: 'd0000000-0000-0000-0000-000000000001',
      tenantId: defaultTenantId,
      name: 'Brand Standard Franchise Royalty (5% Gross)',
      calculationType: CalculationType.PERCENTAGE,
      percentage: 5.0,
      revenueBasis: RoyaltyRevenueBasis.GROSS_SALES,
      priority: 100,
    },
  });

  console.log('Finance Service database seeded successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
