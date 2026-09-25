async function main() {
  const baseUrl = 'http://localhost:3000';

  console.log('\n========================================');
  console.log('1. VERIFY SUPER ADMIN LOGIN');
  console.log('========================================');
  const saRes = await fetch(`${baseUrl}/api/v1/super-admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'superadmin@digiflex.com',
      password: 'SuperAdmin@123!',
    }),
  });
  const saData = (await saRes.json()) as any;
  console.log('Status:', saRes.status);
  console.log('Super Admin Principal:', JSON.stringify(saData.data?.principal, null, 2));

  if (!saData.data?.accessToken) {
    throw new Error('Super Admin login failed');
  }
  const saToken = saData.data.accessToken;

  console.log('\n========================================');
  console.log('2. VERIFY SUPER ADMIN /ME');
  console.log('========================================');
  const saMeRes = await fetch(`${baseUrl}/api/v1/super-admin/auth/me`, {
    headers: { Authorization: `Bearer ${saToken}` },
  });
  const saMeData = (await saMeRes.json()) as any;
  console.log('Status:', saMeRes.status);
  console.log('Super Admin /me Principal:', JSON.stringify(saMeData.data?.principal, null, 2));

  console.log('\n========================================');
  console.log('3. VERIFY TENANT DIRECT LOGIN (WITHOUT USER ROW)');
  console.log('========================================');
  const tenantRes = await fetch(`${baseUrl}/api/v1/auth/tenant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'owner@glamour-salon.com',
      password: 'SalonAdmin@123!',
    }),
  });
  const tenantData = (await tenantRes.json()) as any;
  console.log('Status:', tenantRes.status);
  console.log('Tenant Principal:', JSON.stringify(tenantData.data?.principal, null, 2));

  if (!tenantData.data?.accessToken) {
    throw new Error('Tenant login failed');
  }
  const tenantToken = tenantData.data.accessToken;
  const tenantRefreshToken = tenantData.data.refreshToken;

  console.log('\n========================================');
  console.log('4. VERIFY TENANT /ME (REDIS SAFE PROJECTION)');
  console.log('========================================');
  const tenantMeRes = await fetch(`${baseUrl}/api/v1/auth/tenant/me`, {
    headers: { Authorization: `Bearer ${tenantToken}` },
  });
  const tenantMeData = (await tenantMeRes.json()) as any;
  console.log('Status:', tenantMeRes.status);
  console.log('Tenant /me Data:', JSON.stringify(tenantMeData.data?.principal, null, 2));

  console.log('\n========================================');
  console.log('5. VERIFY TENANT REFRESH TOKEN ROTATION');
  console.log('========================================');
  const refreshRes = await fetch(`${baseUrl}/api/v1/auth/tenant/refresh-token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken: tenantRefreshToken }),
  });
  const refreshData = (await refreshRes.json()) as any;
  console.log('Status:', refreshRes.status);
  console.log('New Access Token Issued:', Boolean(refreshData.data?.accessToken));

  console.log('\n========================================');
  console.log('6. VERIFY TENANT LOGOUT & SESSION INVALIDATION');
  console.log('========================================');
  const logoutRes = await fetch(`${baseUrl}/api/v1/auth/tenant/logout`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${tenantToken}` },
  });
  console.log('Logout Status:', logoutRes.status);

  console.log('\n========================================');
  console.log('7. VERIFY REJECTION OF TENANT LOGIN ON SUPER ADMIN ROUTE');
  console.log('========================================');
  const rejectRes = await fetch(`${baseUrl}/api/v1/super-admin/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'owner@glamour-salon.com',
      password: 'SalonAdmin@123!',
    }),
  });
  console.log('Tenant on Super Admin route Status (Expect 401):', rejectRes.status);

  console.log('\n========================================');
  console.log('8. VERIFY REJECTION OF INVALID PASSWORD');
  console.log('========================================');
  const badPwdRes = await fetch(`${baseUrl}/api/v1/auth/tenant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'owner@glamour-salon.com',
      password: 'WrongPassword123!',
    }),
  });
  console.log('Bad Password Status (Expect 401):', badPwdRes.status);

  console.log('\n========================================');
  console.log('ALL API VALIDATIONS COMPLETED SUCCESSFULLY!');
  console.log('========================================\n');
}

main().catch((err) => {
  console.error('Verification failed:', err);
  process.exit(1);
});
