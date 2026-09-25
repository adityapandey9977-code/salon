import { execSync } from 'node:child_process';

const databases = [
  'identity_db',
  'organization_db',
  'people_db',
  'customer_db',
  'booking_db',
  'commerce_db',
  'payment_db',
  'inventory_db',
  'finance_db',
  'communication_db',
  'platform_db',
  'reporting_db',
];

console.log('===============================================================');
console.log('       DIGIFLEX SALON & SPA — 12 MICROSERVICE DATABASES        ');
console.log('===============================================================\n');

for (const db of databases) {
  try {
    const tablesOutput = execSync(
      `docker exec salon-postgres psql -U postgres -d ${db} -t -A -c "SELECT table_name FROM information_schema.tables WHERE table_schema = 'public' AND table_type = 'BASE TABLE' ORDER BY table_name;"`,
      { encoding: 'utf8' }
    ).trim();

    const tables = tablesOutput ? tablesOutput.split('\n').filter(Boolean) : [];

    console.log(`📦 Database: \x1b[35m${db}\x1b[0m (${tables.length} tables)`);

    if (tables.length === 0) {
      console.log('   (No tables yet / pending migrations)\n');
      continue;
    }

    for (const table of tables) {
      try {
        const count = execSync(
          `docker exec salon-postgres psql -U postgres -d ${db} -t -A -c "SELECT COUNT(*) FROM \\"${table}\\";"`,
          { encoding: 'utf8' }
        ).trim();
        console.log(`   ├─ 📄 ${table.padEnd(30)} : ${count.padStart(5)} rows`);
      } catch {
        console.log(`   ├─ 📄 ${table.padEnd(30)} :   ERR`);
      }
    }
    console.log('');
  } catch (err) {
    console.log(`❌ Failed to read ${db}:`, err.message);
  }
}

console.log('===============================================================');
