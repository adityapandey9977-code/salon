import { PrismaClient } from '../src/infrastructure/prisma/generated-client';
import { config } from '../src/config';
import crypto from 'crypto';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Franchise Owner Identity Sync...');
  
  // 1. Fetch all franchises
  const franchises = await prisma.franchisePartner.findMany({
    where: {
      status: 'ACTIVE', // Or whatever statuses make sense
    },
    select: {
      id: true,
      tenantId: true,
      contactEmail: true,
      companyName: true,
      contactPhone: true,
    }
  });
  
  console.log(`Found ${franchises.length} active franchise partners.`);
  
  let synced = 0;
  let skipped = 0;
  let errors = 0;
  
  for (const franchise of franchises) {
    if (!franchise.contactEmail) {
      console.log(`Skipping franchise ${franchise.id} - No contact email`);
      skipped++;
      continue;
    }
    
    // Check if the user already exists in the identity service
    // We try to create the user, and if it fails with a 409 Conflict (or similar duplicate email error), we skip.
    
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    const generatedPassword = `Franchise@2026!${randomSuffix}`;
    
    try {
      console.log(`Attempting to provision identity for ${franchise.contactEmail} (Franchise: ${franchise.companyName})...`);
      
      const res = await fetch(`${config.IDENTITY_SERVICE_URL}/internal/v1/staff-users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-service-secret': config.SERVICE_INTERNAL_SECRET,
        },
        body: JSON.stringify({
          tenantId: franchise.tenantId,
          franchiseId: franchise.id,
          fullName: franchise.companyName,
          email: franchise.contactEmail,
          mobilePhone: franchise.contactPhone || '+91 98000 00000',
          password: generatedPassword,
          roleCode: 'FRANCHISE_OWNER',
        }),
      });
      
      if (!res.ok) {
        const errText = await res.text();
        // Check if it's a conflict
        if (res.status === 409 || errText.toLowerCase().includes('already exists') || errText.toLowerCase().includes('duplicate') || errText.toLowerCase().includes('already registered')) {
          console.log(`[SKIP] Identity already exists for ${franchise.contactEmail} - ${errText}`);
          skipped++;
        } else {
          console.error(`[ERROR] Failed to provision identity for ${franchise.contactEmail}: ${res.status} ${errText}`);
          errors++;
        }
      } else {
        console.log(`[SUCCESS] Provisioned identity for ${franchise.contactEmail}`);
        synced++;
      }
    } catch (err: any) {
      console.error(`[ERROR] Network/Unexpected error for ${franchise.contactEmail}: ${err.message}`);
      errors++;
    }
  }
  
  console.log('\n--- Sync Summary ---');
  console.log(`Total Franchises: ${franchises.length}`);
  console.log(`Synced: ${synced}`);
  console.log(`Skipped (Exists/No Email): ${skipped}`);
  console.log(`Errors: ${errors}`);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
