import { prisma } from '../src/infrastructure/prisma/client';
import { Prisma } from '../src/infrastructure/prisma/generated-client';

async function seed() {
  console.log('Seeding reporting_db baseline data...');

  const tenantId = '11111111-1111-1111-1111-111111111111';
  const branchId = '22222222-2222-2222-2222-222222222222';
  const staffId = '33333333-3333-3333-3333-333333333333';
  const franchiseId = '44444444-4444-4444-4444-444444444444';
  const today = new Date(new Date().toISOString().split('T')[0]);

  // 1. Seed Tenant Daily Metrics
  await prisma.tenantDailyMetrics.upsert({
    where: { tenantId_metricDate: { tenantId, metricDate: today } },
    create: {
      tenantId,
      metricDate: today,
      branchCount: 3,
      activeStaffCount: 15,
      bookings: 25,
      completedServices: 20,
      grossRevenue: new Prisma.Decimal(2450.0),
      netRevenue: new Prisma.Decimal(2150.0),
      newCustomers: 5,
      inventoryAlerts: 1,
    },
    update: {},
  });

  // 2. Seed Daily Branch Metrics
  await prisma.dailyBranchMetrics.upsert({
    where: { branchId_metricDate: { branchId, metricDate: today } },
    create: {
      tenantId,
      branchId,
      metricDate: today,
      appointmentsBooked: 15,
      appointmentsCompleted: 12,
      appointmentsCancelled: 2,
      noShows: 1,
      grossSales: new Prisma.Decimal(1500.0),
      netSales: new Prisma.Decimal(1320.0),
      taxCollected: new Prisma.Decimal(180.0),
      serviceRevenue: new Prisma.Decimal(1200.0),
      retailRevenue: new Prisma.Decimal(300.0),
      customerCount: 12,
      newCustomers: 3,
      averageTicketValue: new Prisma.Decimal(125.0),
    },
    update: {},
  });

  // 3. Seed Staff Performance Daily
  await prisma.staffPerformanceDaily.upsert({
    where: { employeeId_metricDate: { employeeId: staffId, metricDate: today } },
    create: {
      tenantId,
      branchId,
      employeeId: staffId,
      metricDate: today,
      appointments: 8,
      completedServices: 7,
      serviceRevenue: new Prisma.Decimal(850.0),
      retailRevenue: new Prisma.Decimal(120.0),
      commissionEarned: new Prisma.Decimal(135.0),
      utilizationPercentage: new Prisma.Decimal(87.5),
    },
    update: {},
  });

  // 4. Seed Franchise Daily Metrics
  await prisma.franchiseDailyMetrics.upsert({
    where: { franchiseId_metricDate: { franchiseId, metricDate: today } },
    create: {
      tenantId,
      franchiseId,
      metricDate: today,
      branchCount: 2,
      grossSales: new Prisma.Decimal(3200.0),
      netSales: new Prisma.Decimal(2800.0),
      royaltyAccrued: new Prisma.Decimal(280.0),
      royaltyPaid: new Prisma.Decimal(0.0),
    },
    update: {},
  });

  // 5. Seed Inventory Daily Metrics
  await prisma.inventoryDailyMetrics.upsert({
    where: { branchId_metricDate: { branchId, metricDate: today } },
    create: {
      tenantId,
      branchId,
      metricDate: today,
      inventoryValue: new Prisma.Decimal(18500.0),
      lowStockCount: 2,
      outOfStockCount: 0,
      purchaseValue: new Prisma.Decimal(1200.0),
      consumptionValue: new Prisma.Decimal(450.0),
    },
    update: {},
  });

  // 6. Seed Call Center Daily Metrics
  await prisma.callCenterDailyMetrics.upsert({
    where: {
      tenantId_agentUserId_metricDate: {
        tenantId,
        agentUserId: '00000000-0000-0000-0000-000000000000',
        metricDate: today,
      },
    },
    create: {
      tenantId,
      agentUserId: '00000000-0000-0000-0000-000000000000',
      metricDate: today,
      calls: 35,
      answered: 32,
      missed: 3,
      appointmentsBooked: 14,
      leadsCreated: 6,
      conversionRate: new Prisma.Decimal(40.0),
    },
    update: {},
  });

  console.log('Reporting baseline metrics seeded successfully.');
}

seed()
  .catch((err) => {
    console.error('Seed error:', err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
