import axios from 'axios';

const BASE_URL = 'http://localhost:3000';

async function run() {
  console.log('====================================================');
  console.log('🚀 TESTING FRONTEND API INTEGRATION VIA GATEWAY :3000');
  console.log('====================================================\n');

  // 1. Super Admin Direct Login
  console.log('1️⃣ Testing Super Admin Login (/api/v1/super-admin/auth/login)...');
  const saRes = await axios.post(`${BASE_URL}/api/v1/super-admin/auth/login`, {
    email: 'superadmin@digiflex.com',
    password: 'SuperAdmin@123!',
  });
  console.log('   Status:', saRes.status);
  console.log('   Principal:', saRes.data.data.principal?.email, '| Role:', saRes.data.data.principal?.role);
  const saToken = saRes.data.data.accessToken;

  // 2. Super Admin Get Me (/api/v1/auth/me)
  console.log('\n2️⃣ Testing Super Admin /api/v1/auth/me...');
  const saMeRes = await axios.get(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${saToken}` },
  });
  console.log('   Status:', saMeRes.status);
  console.log('   User:', saMeRes.data.data.fullName, '| Email:', saMeRes.data.data.email);

  // 3. Tenant Direct Login (/api/v1/auth/tenant/login)
  console.log('\n3️⃣ Testing Tenant Direct Login (/api/v1/auth/tenant/login)...');
  const tenantRes = await axios.post(`${BASE_URL}/api/v1/auth/tenant/login`, {
    email: 'owner@glamour-salon.com',
    password: 'SalonAdmin@123!',
  });
  console.log('   Status:', tenantRes.status);
  console.log('   Tenant Principal:', tenantRes.data.data.principal?.loginEmail, '| Salon:', tenantRes.data.data.principal?.salonName);
  const tenantToken = tenantRes.data.data.accessToken;

  // 4. Tenant Profile via Universal /api/v1/auth/me
  console.log('\n4️⃣ Testing Tenant /api/v1/auth/me (Normalized response)...');
  const tenantMeRes = await axios.get(`${BASE_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${tenantToken}` },
  });
  console.log('   Status:', tenantMeRes.status);
  console.log('   Tenant User Data:', tenantMeRes.data.data.user?.fullName, '| Roles:', tenantMeRes.data.data.user?.roles);

  // 5. Universal Login Endpoint (/api/v1/auth/login) with Tenant Credentials
  console.log('\n5️⃣ Testing Universal /api/v1/auth/login with Tenant email...');
  const uniRes = await axios.post(`${BASE_URL}/api/v1/auth/login`, {
    email: 'owner@glamour-salon.com',
    password: 'SalonAdmin@123!',
  });
  console.log('   Status:', uniRes.status);
  console.log('   User Payload:', uniRes.data.data.user?.fullName, '| Tenant ID:', uniRes.data.data.user?.tenantId);

  // 6. Organization Service Tenant Fetch (/api/v1/tenants/:id)
  console.log('\n6️⃣ Testing Tenant Organization Details (/api/v1/tenants/:id)...');
  const orgTenantRes = await axios.get(
    `${BASE_URL}/api/v1/tenants/a0000000-0000-0000-0000-000000000001`,
    {
      headers: { Authorization: `Bearer ${tenantToken}` },
    },
  );
  console.log('   Status:', orgTenantRes.status);
  console.log('   Salon Name:', orgTenantRes.data.data.salonName, '| Status:', orgTenantRes.data.data.status);

  // 7. Token Refresh (/api/v1/auth/refresh-token)
  console.log('\n7️⃣ Testing Token Refresh (/api/v1/auth/refresh-token)...');
  const refreshRes = await axios.post(`${BASE_URL}/api/v1/auth/refresh-token`, {
    refreshToken: tenantRes.data.data.refreshToken,
  });
  console.log('   Status:', refreshRes.status);
  console.log('   New Token Received:', Boolean(refreshRes.data.data.accessToken));

  // 8. Logout (/api/v1/auth/logout)
  console.log('\n8️⃣ Testing Logout (/api/v1/auth/logout)...');
  const logoutRes = await axios.post(
    `${BASE_URL}/api/v1/auth/logout`,
    {},
    {
      headers: { Authorization: `Bearer ${tenantToken}` },
    },
  );
  console.log('   Status:', logoutRes.status);
  console.log('   Message:', logoutRes.data.data?.message);

  console.log('\n====================================================');
  console.log('✅ ALL FRONTEND API INTEGRATION ENDPOINTS VERIFIED!');
  console.log('====================================================\n');
}

run().catch((err) => {
  console.error('❌ API Integration Test Failed:', err.response?.data || err.message);
  process.exit(1);
});
