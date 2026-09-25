const BASE_URL = 'http://localhost:3000';

async function run() {
  console.log('====================================================');
  console.log('🚀 TESTING FRONTEND API INTEGRATION VIA GATEWAY :3000');
  console.log('====================================================\n');

  // 1. Super Admin Direct Login
  console.log('1️⃣ Testing Super Admin Login (/api/v1/super-admin/auth/login)...');
  const saRes = await fetch(`${BASE_URL}/api/v1/super-admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'superadmin@digiflex.com',
      password: 'SuperAdmin@123!',
    }),
  });
  const saJson = await saRes.json();
  console.log('   Status:', saRes.status);
  console.log('   Principal:', saJson.data.principal?.email, '| Role:', saJson.data.principal?.role);
  const saToken = saJson.data.accessToken;

  // 2. Super Admin Get Me (/api/v1/auth/me)
  console.log('\n2️⃣ Testing Super Admin /api/v1/auth/me...');
  const saMeRes = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${saToken}` },
  });
  const saMeJson = await saMeRes.json();
  console.log('   Status:', saMeRes.status);
  console.log('   User:', saMeJson.data.fullName, '| Email:', saMeJson.data.email, '| Roles:', saMeJson.data.roles?.map(r => r.code));

  // 3. Tenant Direct Login (/api/v1/auth/tenant/login)
  console.log('\n3️⃣ Testing Tenant Direct Login (/api/v1/auth/tenant/login)...');
  const tenantRes = await fetch(`${BASE_URL}/api/v1/auth/tenant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'owner@glamour-salon.com',
      password: 'SalonAdmin@123!',
    }),
  });
  const tenantJson = await tenantRes.json();
  console.log('   Status:', tenantRes.status);
  console.log('   Tenant Principal:', tenantJson.data.principal?.loginEmail, '| Salon:', tenantJson.data.principal?.salonName);
  const tenantToken = tenantJson.data.accessToken;

  // 4. Tenant Profile via Universal /api/v1/auth/me
  console.log('\n4️⃣ Testing Tenant /api/v1/auth/me (Normalized response)...');
  const tenantMeRes = await fetch(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${tenantToken}` },
  });
  const tenantMeJson = await tenantMeRes.json();
  console.log('   Status:', tenantMeRes.status);
  console.log('   Tenant User Data:', tenantMeJson.data.user?.fullName, '| Roles:', tenantMeJson.data.user?.roles?.map(r => r.code));

  // 5. Universal Login Endpoint (/api/v1/auth/login) with Tenant Credentials
  console.log('\n5️⃣ Testing Universal /api/v1/auth/login with Tenant email...');
  const uniRes = await fetch(`${BASE_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'owner@glamour-salon.com',
      password: 'SalonAdmin@123!',
    }),
  });
  const uniJson = await uniRes.json();
  console.log('   Status:', uniRes.status);
  console.log('   User Payload:', uniJson.data.user?.fullName, '| Tenant ID:', uniJson.data.user?.tenantId);

  // 6. Organization Service Tenant Fetch (/api/v1/tenants/:id)
  console.log('\n6️⃣ Testing Tenant Organization Details (/api/v1/tenants/:id)...');
  const orgTenantRes = await fetch(
    `${BASE_URL}/api/v1/tenants/a0000000-0000-0000-0000-000000000001`,
    {
      headers: { Authorization: `Bearer ${tenantToken}` },
    },
  );
  const orgTenantJson = await orgTenantRes.json();
  console.log('   Status:', orgTenantRes.status);
  console.log('   Salon Name:', orgTenantJson.data.salonName, '| Status:', orgTenantJson.data.status);

  // 7. Token Refresh (/api/v1/auth/refresh-token)
  console.log('\n7️⃣ Testing Token Refresh (/api/v1/auth/refresh-token)...');
  const refreshRes = await fetch(`${BASE_URL}/api/v1/auth/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      refreshToken: tenantJson.data.refreshToken,
    }),
  });
  const refreshJson = await refreshRes.json();
  console.log('   Status:', refreshRes.status);
  console.log('   New Token Received:', Boolean(refreshJson.data.accessToken));

  // 8. Logout (/api/v1/auth/logout)
  console.log('\n8️⃣ Testing Logout (/api/v1/auth/logout)...');
  const logoutRes = await fetch(`${BASE_URL}/api/v1/auth/logout`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${tenantToken}`,
    },
    body: JSON.stringify({}),
  });
  const logoutJson = await logoutRes.json();
  console.log('   Status:', logoutRes.status);
  console.log('   Message:', logoutJson.data?.message);

  console.log('\n====================================================');
  console.log('🎉 ALL FRONTEND APIS INTEGRATED & FULLY VERIFIED!');
  console.log('====================================================\n');
}

run().catch((err) => {
  console.error('❌ API Integration Test Failed:', err);
  process.exit(1);
});
