import path from 'path';
import dotenv from 'dotenv';
import { PrismaClient } from '../src/infrastructure/prisma/generated-client';

dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding Organization Service database...');

  const defaultTenantId = 'a0000000-0000-0000-0000-000000000001';
  const defaultBranchId = 'b0000000-0000-0000-0000-000000000001';

  const tenant = await prisma.organizationTenant.upsert({
    where: { id: defaultTenantId },
    update: {
      salonName: 'Glamour Salon & Spa',
      code: 'SALON001',
      slug: 'glamour-salon',
      businessEmail: 'owner@glamour-salon.com',
      status: 'ACTIVE',
    },
    create: {
      id: defaultTenantId,
      code: 'SALON001',
      slug: 'glamour-salon',
      salonName: 'Glamour Salon & Spa',
      legalName: 'Glamour Luxury Wellness Pvt Ltd',
      tradeName: 'Glamour Salon & Spa',
      businessEmail: 'owner@glamour-salon.com',
      businessPhone: '+91 9888800000',
      addressLine1: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      country: 'IN',
      currency: 'INR',
      timezone: 'Asia/Kolkata',
      status: 'ACTIVE',
    },
  });

  const branch = await prisma.branch.upsert({
    where: { code: 'IND-01' },
    update: {},
    create: {
      id: defaultBranchId,
      tenantId: tenant.id,
      name: 'Indiranagar Flagship',
      code: 'IND-01',
      addressLine1: '100 Feet Road, Indiranagar',
      city: 'Bengaluru',
      state: 'Karnataka',
      postalCode: '560038',
      phone: '+91 9876543210',
      email: 'indiranagar@glamoursalon.com',
      status: 'ACTIVE',
      config: {
        create: {
          allowOnlineBooking: true,
          autoConfirmBooking: true,
          slotIntervalMin: 15,
          bufferTimeMin: 10,
          cancellationCutoff: 120,
        },
      },
    },
  });

  // Create Resources (Chairs, Rooms)
  await prisma.branchResource.createMany({
    data: [
      { branchId: branch.id, name: 'Styling Chair 1', type: 'CHAIR', capacity: 1 },
      { branchId: branch.id, name: 'Styling Chair 2', type: 'CHAIR', capacity: 1 },
      { branchId: branch.id, name: 'Spa Therapy Room 1', type: 'ROOM', capacity: 1 },
    ],
  });

  // Operating Hours Monday-Sunday
  const days = [0, 1, 2, 3, 4, 5, 6];
  for (const day of days) {
    await prisma.operatingHours.upsert({
      where: {
        branchId_dayOfWeek: {
          branchId: branch.id,
          dayOfWeek: day,
        },
      },
      update: {
        openTime: '09:00',
        closeTime: '21:00',
        isOpen: true,
      },
      create: {
        branchId: branch.id,
        dayOfWeek: day,
        openTime: '09:00',
        closeTime: '21:00',
        isOpen: true,
      },
    });
  }

  // Seed Sample Franchise Partner & Assigned Franchise Branch
  const defaultFranchiseId = 'f0000000-0000-0000-0000-000000000001';
  const defaultFranchiseBranchId = 'b0000000-0000-0000-0000-000000000002';

  await prisma.franchisePartner.upsert({
    where: { id: defaultFranchiseId },
    update: {
      companyName: 'Ashish Khopde Outlets LLP',
      contactPerson: 'Ashish Khopde',
      contactEmail: 'sanjay.chawla@apexwellness.in',
      contactPhone: '+91 98260 11450',
      gstin: '23AAACA0000A1Z5',
    },
    create: {
      id: defaultFranchiseId,
      tenantId: defaultTenantId,
      companyName: 'Ashish Khopde Outlets LLP',
      contactPerson: 'Ashish Khopde',
      contactEmail: 'sanjay.chawla@apexwellness.in',
      contactPhone: '+91 98260 11450',
      gstin: '23AAACA0000A1Z5',
    },
  });

  await prisma.branch.upsert({
    where: { code: 'APX-IND-01' },
    update: {
      franchiseId: defaultFranchiseId,
      status: 'ACTIVE',
    },
    create: {
      id: defaultFranchiseBranchId,
      tenantId: defaultTenantId,
      franchiseId: defaultFranchiseId,
      name: 'Apex Indrapuri Flagship',
      code: 'APX-IND-01',
      addressLine1: 'Indrapuri Sector C, Raisen Road',
      city: 'Bhopal',
      state: 'Madhya Pradesh',
      postalCode: '462022',
      phone: '+91 98260 11450',
      email: 'indrapuri@apexwellness.in',
      status: 'ACTIVE',
      config: {
        create: {
          allowOnlineBooking: true,
          autoConfirmBooking: true,
          slotIntervalMin: 15,
          bufferTimeMin: 10,
          cancellationCutoff: 120,
        },
      },
    },
  });

  console.log('Organization Service seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
