import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.resolve(__dirname, '../../../.env') });
dotenv.config();
import { PrismaClient } from '../src/infrastructure/prisma/generated-client';

const prisma = new PrismaClient();

const DEV_TENANT_ID = '11111111-1111-1111-1111-111111111111';
const DEV_BRANCH_ID = '22222222-2222-2222-2222-222222222222';

async function main() {
  console.log('Seeding reference shifts and development employees...');

  // Standard Shift Reference Definitions
  const morningShift = await prisma.shift.upsert({
    where: { id: '33333333-3333-3333-3333-333333333301' },
    update: {},
    create: {
      id: '33333333-3333-3333-3333-333333333301',
      tenantId: DEV_TENANT_ID,
      branchId: DEV_BRANCH_ID,
      name: 'Morning Shift',
      startTime: '09:00',
      endTime: '17:00',
      breakMinutes: 45,
      graceMinutes: 15,
      isActive: true,
    },
  });

  const eveningShift = await prisma.shift.upsert({
    where: { id: '33333333-3333-3333-3333-333333333302' },
    update: {},
    create: {
      id: '33333333-3333-3333-3333-333333333302',
      tenantId: DEV_TENANT_ID,
      branchId: DEV_BRANCH_ID,
      name: 'Evening Shift',
      startTime: '13:00',
      endTime: '21:00',
      breakMinutes: 45,
      graceMinutes: 15,
      isActive: true,
    },
  });

  console.log(`Seeded shifts: ${morningShift.name}, ${eveningShift.name}`);

  // Reference Development Employees
  const staffToSeed = [
    {
      id: '10820000-0000-0000-0000-000000001082',
      employeeCode: 'EMP-1082',
      firstName: 'Ananya',
      lastName: 'Deshmukh',
      displayName: 'Ananya Deshmukh',
      email: 'ananya.deshmukh@atelierluxury.in',
      mobilePhone: '+91 98260 12345',
      dateOfBirth: new Date('1994-05-14'),
      gender: 'Female',
      employmentStatus: 'ACTIVE' as const,
      employmentType: 'FULL_TIME' as const,
      jobTitle: 'Senior Master Aesthetician',
      department: 'Skin & Aesthetics',
      bio: 'CIDESCO-certified Senior Aesthetician with over 10 years experience.',
      yearsOfExperience: 10,
      specialization: 'Medical Aesthetics & Laser Treatments',
      emergencyName: 'Suresh Deshmukh',
      emergencyRel: 'Father',
      emergencyPhone: '+91 98260 99881',
    },
    {
      id: '10830000-0000-0000-0000-000000001083',
      employeeCode: 'EMP-1083',
      firstName: 'Rohit',
      lastName: 'Verma',
      displayName: 'Rohit Verma',
      email: 'rohit.verma@atelierluxury.in',
      mobilePhone: '+91 98260 23456',
      dateOfBirth: new Date('1991-08-22'),
      gender: 'Male',
      employmentStatus: 'ACTIVE' as const,
      employmentType: 'FULL_TIME' as const,
      jobTitle: 'Creative Hair Art Director',
      department: 'Hair Artistry & Styling',
      bio: 'Toni&Guy certified creative director specialized in Balayage formulation.',
      yearsOfExperience: 12,
      specialization: 'Balayage, Creative Coloring & Styling',
      emergencyName: 'Meena Verma',
      emergencyRel: 'Spouse',
      emergencyPhone: '+91 98260 88772',
    },
    {
      id: '10840000-0000-0000-0000-000000001084',
      employeeCode: 'EMP-1084',
      firstName: 'Sameer',
      lastName: 'Sheikh',
      displayName: 'Sameer Sheikh',
      email: 'sameer.sheikh@atelierluxury.in',
      mobilePhone: '+91 98260 34567',
      dateOfBirth: new Date('1993-11-05'),
      gender: 'Male',
      employmentStatus: 'ACTIVE' as const,
      employmentType: 'FULL_TIME' as const,
      jobTitle: 'Lead Master Barber & Stylist',
      department: 'Men Grooming & Barbering',
      bio: 'Master barber specialized in precision fades and executive beard sculpts.',
      yearsOfExperience: 8,
      specialization: 'Executive Beard Sculpt & Precision Fade',
      emergencyName: 'Zainab Sheikh',
      emergencyRel: 'Sister',
      emergencyPhone: '+91 98260 77663',
    },
    {
      id: '10850000-0000-0000-0000-000000001085',
      employeeCode: 'EMP-1085',
      firstName: 'Kavita',
      lastName: 'Iyer',
      displayName: 'Kavita Iyer',
      email: 'kavita.iyer@atelierluxury.in',
      mobilePhone: '+91 98260 45678',
      dateOfBirth: new Date('1996-03-30'),
      gender: 'Female',
      employmentStatus: 'ACTIVE' as const,
      employmentType: 'FULL_TIME' as const,
      jobTitle: 'Senior Nail Artist & Extensionist',
      department: 'Nail Lounge',
      bio: 'Renowned nail technician specialized in Russian e-file and Gel Extensions.',
      yearsOfExperience: 6,
      specialization: 'Russian Dry Manicure & Gel Extensions',
      emergencyName: 'Raman Iyer',
      emergencyRel: 'Brother',
      emergencyPhone: '+91 98260 66554',
    },
    {
      id: '10860000-0000-0000-0000-000000001086',
      employeeCode: 'EMP-1086',
      firstName: 'Manish',
      lastName: 'Rawat',
      displayName: 'Manish Rawat',
      email: 'manish.rawat@atelierluxury.in',
      mobilePhone: '+91 98260 56789',
      dateOfBirth: new Date('1989-12-18'),
      gender: 'Male',
      employmentStatus: 'ACTIVE' as const,
      employmentType: 'FULL_TIME' as const,
      jobTitle: 'Senior Spa & Holistic Therapist',
      department: 'Spa & Wellness',
      bio: 'Holistic Ayurvedic and Swedish aromatherapy spa therapist.',
      yearsOfExperience: 14,
      specialization: 'Ayurvedic Abhyanga & Deep Tissue Recovery',
      emergencyName: 'Geeta Rawat',
      emergencyRel: 'Mother',
      emergencyPhone: '+91 98260 55443',
    },
  ];

  for (const s of staffToSeed) {
    const emp = await prisma.employee.upsert({
      where: {
        tenantId_employeeCode: {
          tenantId: DEV_TENANT_ID,
          employeeCode: s.employeeCode,
        },
      },
      update: {
        firstName: s.firstName,
        lastName: s.lastName,
        displayName: s.displayName,
        email: s.email,
        mobilePhone: s.mobilePhone,
        jobTitle: s.jobTitle,
        department: s.department,
      },
      create: {
        id: s.id,
        tenantId: DEV_TENANT_ID,
        employeeCode: s.employeeCode,
        firstName: s.firstName,
        lastName: s.lastName,
        displayName: s.displayName,
        email: s.email,
        mobilePhone: s.mobilePhone,
        dateOfBirth: s.dateOfBirth,
        gender: s.gender,
        employmentStatus: s.employmentStatus,
        employmentType: s.employmentType,
        jobTitle: s.jobTitle,
        department: s.department,
        primaryBranchId: DEV_BRANCH_ID,
        notes: s.bio,
        profile: {
          create: {
            tenantId: DEV_TENANT_ID,
            bio: s.bio,
            yearsOfExperience: s.yearsOfExperience,
            designation: s.jobTitle,
            specialization: s.specialization,
            commissionEligible: true,
            acceptsOnlineBooking: true,
            isBookable: true,
            serviceCapacity: 1,
            profileVisibility: 'PUBLIC',
          },
        },
        branchAssignments: {
          create: {
            tenantId: DEV_TENANT_ID,
            branchId: DEV_BRANCH_ID,
            isPrimary: true,
            status: 'ACTIVE',
          },
        },
        emergencyContacts: {
          create: {
            tenantId: DEV_TENANT_ID,
            name: s.emergencyName,
            relationship: s.emergencyRel,
            mobilePhone: s.emergencyPhone,
          },
        },
      },
    });

    console.log(`Seeded master staff: ${emp.displayName} (${emp.employeeCode})`);
  }
}

main()
  .catch((e) => {
    console.error('Error seeding people_db:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
