import { execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Load root .env or .env.local if present using Node's native env loader
const envFiles = ['.env', '.env.local'];
for (const file of envFiles) {
  const fullPath = path.join(process.cwd(), file);
  if (fs.existsSync(fullPath) && typeof process.loadEnvFile === 'function') {
    try {
      process.loadEnvFile(fullPath);
    } catch {
      // Ignore parse errors if any
    }
  }
}

const services = [
  { key: 'identity', name: 'identity-service', db: 'identity_db' },
  { key: 'organization', name: 'organization-service', db: 'organization_db' },
  { key: 'people', name: 'people-service', db: 'people_db' },
  { key: 'customer', name: 'customer-service', db: 'customer_db' },
  { key: 'booking', name: 'booking-service', db: 'booking_db' },
  { key: 'commerce', name: 'commerce-service', db: 'commerce_db' },
  { key: 'payment', name: 'payment-service', db: 'payment_db' },
  { key: 'inventory', name: 'inventory-service', db: 'inventory_db' },
  { key: 'finance', name: 'finance-service', db: 'finance_db' },
  { key: 'communication', name: 'communication-service', db: 'communication_db' },
  { key: 'platform', name: 'platform-service', db: 'platform_db' },
  { key: 'reporting', name: 'reporting-service', db: 'reporting_db' },
];

const target = (process.argv[2] || '').toLowerCase().trim();
const targetServices = target && target !== 'all'
  ? services.filter((s) => s.key === target || s.name === target)
  : services;

if (target && target !== 'all' && targetServices.length === 0) {
  console.log('❌ Unknown service:', target);
  console.log('Available services: all, ' + services.map((s) => s.key).join(', '));
  process.exit(1);
}

console.log('===============================================================');
console.log('       DIGIFLEX SALON & SPA — PRISMA DB PUSH (ALL DATABASES)   ');
console.log('===============================================================\n');

let failedCount = 0;

for (const svc of targetServices) {
  const schemaPath = path.join(process.cwd(), 'apps', 'services', svc.name, 'prisma', 'schema.prisma');
  if (!fs.existsSync(schemaPath)) {
    console.log(`⚠️  Schema not found for ${svc.name} (${schemaPath})`);
    continue;
  }

  process.stdout.write(`🔄 Pushing schema for \x1b[35m${svc.name.padEnd(23)}\x1b[0m... `);

  try {
    execSync(`npx prisma db push --schema="${schemaPath}" --skip-generate`, {
      stdio: 'pipe',
      encoding: 'utf8',
      env: process.env,
    });
    console.log('\x1b[32m[SUCCESS]\x1b[0m');
  } catch (err) {
    failedCount++;
    console.log('\x1b[31m[FAILED]\x1b[0m');
    const msg = (err.stderr || err.stdout || err.message || '').trim();
    if (msg) {
      console.log(`   └─ Error: ${msg.split('\n').pop()}`);
    }
  }
}

console.log('\n===============================================================');
if (failedCount === 0) {
  console.log('✨ All targeted database schemas pushed successfully!');
} else {
  console.log(`⚠️  Completed with ${failedCount} database failure(s).`);
}
console.log('===============================================================');

if (failedCount > 0) {
  process.exit(1);
}
