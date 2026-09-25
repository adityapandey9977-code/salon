import { spawn } from 'node:child_process';
import path from 'node:path';

const services = {
  identity: { name: 'identity-service', port: 5551 },
  organization: { name: 'organization-service', port: 5552 },
  people: { name: 'people-service', port: 5553 },
  customer: { name: 'customer-service', port: 5554 },
  booking: { name: 'booking-service', port: 5555 },
  commerce: { name: 'commerce-service', port: 5556 },
  payment: { name: 'payment-service', port: 5557 },
  inventory: { name: 'inventory-service', port: 5558 },
  finance: { name: 'finance-service', port: 5559 },
  communication: { name: 'communication-service', port: 5560 },
  platform: { name: 'platform-service', port: 5561 },
  reporting: { name: 'reporting-service', port: 5562 },
};

const target = (process.argv[2] || '').toLowerCase().trim();

if (!target || !services[target]) {
  console.log('===============================================================');
  console.log('            DIGIFLEX SALON — PRISMA STUDIO LAUNCHER            ');
  console.log('===============================================================');
  console.log('Usage: node scripts/db-studio.mjs <service-name>\n');
  console.log('Available services:');
  for (const [key, val] of Object.entries(services)) {
    console.log(`  • node scripts/db-studio.mjs ${key.padEnd(14)} (Port: ${val.port})`);
  }
  console.log('===============================================================');
  process.exit(0);
}

const service = services[target];
const schemaPath = path.join(process.cwd(), 'apps', 'services', service.name, 'prisma', 'schema.prisma');

console.log(`🚀 Launching Prisma Studio for ${service.name}...`);
console.log(`📂 Schema: ${schemaPath}`);
console.log(`🌐 Studio URL: http://localhost:${service.port}\n`);

const child = spawn('npx', ['prisma', 'studio', `--schema=${schemaPath}`, `--port=${service.port}`], {
  stdio: 'inherit',
  shell: true,
});

child.on('error', (err) => {
  console.error('Failed to start Prisma Studio:', err);
});
