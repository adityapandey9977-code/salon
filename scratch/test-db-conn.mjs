import pg from 'pg';

async function test(host) {
  const url = `postgresql://postgres:postgres@${host}:5432/identity_db`;
  const client = new pg.Client({ connectionString: url });
  try {
    await client.connect();
    console.log(`✅ Success connecting to ${host}`);
    await client.end();
  } catch (err) {
    console.error(`❌ Failed to connect to ${host}:`, err.message);
  }
}

async function main() {
  await test('127.0.0.1');
  await test('localhost');
}

main();
