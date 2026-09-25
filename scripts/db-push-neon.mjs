import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const NEON_HOST = 'ep-divine-credit-b4w36u8o.c-6.us-east-2.aws.neon.tech';
const NEON_USER = 'neondb_owner';
const NEON_PASS = 'npg_PDHcMmRe64ht';

const services = [
  { key: 'identity', name: 'identity-service', db: 'identity_db', envVar: 'IDENTITY_DATABASE_URL' },
  { key: 'organization', name: 'organization-service', db: 'organization_db', envVar: 'ORGANIZATION_DATABASE_URL' },
  { key: 'people', name: 'people-service', db: 'people_db', envVar: 'PEOPLE_DATABASE_URL' },
  { key: 'customer', name: 'customer-service', db: 'customer_db', envVar: 'CUSTOMER_DATABASE_URL' },
  { key: 'booking', name: 'booking-service', db: 'booking_db', envVar: 'BOOKING_DATABASE_URL' },
  { key: 'commerce', name: 'commerce-service', db: 'commerce_db', envVar: 'COMMERCE_DATABASE_URL' },
  { key: 'payment', name: 'payment-service', db: 'payment_db', envVar: 'PAYMENT_DATABASE_URL' },
  { key: 'inventory', name: 'inventory-service', db: 'inventory_db', envVar: 'INVENTORY_DATABASE_URL' },
  { key: 'finance', name: 'finance-service', db: 'finance_db', envVar: 'FINANCE_DATABASE_URL' },
  { key: 'communication', name: 'communication-service', db: 'communication_db', envVar: 'COMMUNICATION_DATABASE_URL' },
  { key: 'platform', name: 'platform-service', db: 'platform_db', envVar: 'PLATFORM_DATABASE_URL' },
  { key: 'reporting', name: 'reporting-service', db: 'reporting_db', envVar: 'REPORTING_DATABASE_URL' },
];

console.log('===============================================================');
console.log('       DIGIFLEX SALON & SPA — PRISMA DB PUSH TO NEON CLOUD      ');
console.log('===============================================================\n');

const prismaBin = path.join(process.cwd(), 'apps', 'services', 'identity-service', 'node_modules', 'prisma', 'build', 'index.js');

let failedCount = 0;

for (const svc of services) {
  const schemaPath = path.join(process.cwd(), 'apps', 'services', svc.name, 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.log(`⚠️  Schema not found for ${svc.name} (${schemaPath})`);
    continue;
  }

  const neonDbUrl = `postgresql://${NEON_USER}:${NEON_PASS}@${NEON_HOST}/${svc.db}?sslmode=require`;

  process.stdout.write(`🔄 Pushing schema for ${svc.name.padEnd(23)} (${svc.db})... `);

  try {
    const env = {
      ...process.env,
      [svc.envVar]: neonDbUrl,
      DATABASE_URL: neonDbUrl,
    };

    execSync(`node "${prismaBin}" db push --schema="${schemaPath}" --skip-generate --accept-data-loss`, {
      stdio: 'pipe',
      encoding: 'utf8',
      env,
    });
    console.log('[SUCCESS]');
  } catch (err) {
    failedCount++;
    console.log('[FAILED]');
    const msg = (err.stderr || err.stdout || err.message || '').trim();
    if (msg) {
      console.log(`   └─ Error: ${msg.split('\n').pop()}`);
    }
  }
}

console.log('\n===============================================================');
if (failedCount === 0) {
  console.log('✨ All 12 Neon microservice schemas pushed successfully!');
} else {
  console.log(`⚠️  Completed with ${failedCount} database failure(s).`);
}
console.log('===============================================================');

if (failedCount > 0) {
  process.exit(1);
}
