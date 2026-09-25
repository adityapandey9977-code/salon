import fs from 'node:fs';
import path from 'node:path';

const files = [
  '.env',
  'apps/api-gateway/.env',
  'apps/services/booking-service/.env',
  'apps/services/commerce-service/.env',
  'apps/services/communication-service/.env',
  'apps/services/customer-service/.env',
  'apps/services/finance-service/.env',
  'apps/services/identity-service/.env',
  'apps/services/inventory-service/.env',
  'apps/services/organization-service/.env',
  'apps/services/payment-service/.env',
  'apps/services/people-service/.env',
  'apps/services/platform-service/.env',
  'apps/services/reporting-service/.env',
];

for (const relPath of files) {
  const filePath = path.resolve(process.cwd(), relPath);
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    // Replace localhost:5432 with 127.0.0.1:5432 to bypass Windows IPv6 resolution
    content = content.replace(/localhost:5432/g, '127.0.0.1:5432');
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('Updated to 127.0.0.1:5432:', relPath);
  }
}
