async function testBranchManagerCompleteFlow() {
  const GATEWAY_URL = 'http://localhost:5000';
  const TENANT_ID = 'a0000000-0000-0000-0000-000000000001';
  const BRANCH_ID = 'b0000000-0000-0000-0000-000000000001';

  console.log('=== 1. Login as Tenant Owner to obtain Auth Token ===');
  const ownerLoginRes = await fetch(`${GATEWAY_URL}/api/v1/auth/tenant/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'owner@glamour-salon.com',
      password: 'SalonAdmin@123!',
    }),
  });
  const ownerLoginJson = await ownerLoginRes.json();
  const token = ownerLoginJson.data?.accessToken || ownerLoginJson.data?.tokens?.accessToken;
  console.log(`Tenant Owner login status: ${ownerLoginRes.status}, token ok: ${Boolean(token)}`);
  if (!token) throw new Error('Owner login failed');

  console.log('\n=== 2. Creating New Staff with Role = BRANCH_MANAGER and Primary Branch ===');
  const timestamp = Date.now();
  const newStaffEmail = `manager.e2e.${timestamp}@glamour-salon.com`;
  const newStaffPassword = 'ManagerPass@123!';
  const newStaffFullName = `Elena Gilbert ${timestamp.toString().slice(-4)}`;

  const staffPayload = {
    firstName: 'Elena',
    lastName: 'Gilbert',
    fullName: newStaffFullName,
    displayName: newStaffFullName,
    email: newStaffEmail,
    mobilePhone: `+91 98${Math.floor(10000000 + Math.random() * 90000000)}`,
    role: 'Branch Manager',
    roleCode: 'BRANCH_MANAGER',
    primaryBranchId: BRANCH_ID,
    loginEnabled: true,
    password: newStaffPassword,
    employmentStatus: 'ACTIVE',
    employmentType: 'FULL_TIME',
  };

  const createStaffRes = await fetch(`${GATEWAY_URL}/api/v1/staff`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      'x-tenant-id': TENANT_ID,
    },
    body: JSON.stringify(staffPayload),
  });

  const createStaffJson = await createStaffRes.json();
  console.log(`Create Staff status: ${createStaffRes.status}`);
  console.log('Created Employee:', {
    id: createStaffJson.data?.id,
    email: createStaffJson.data?.email,
    identityUserId: createStaffJson.data?.identityUserId,
    primaryBranchId: createStaffJson.data?.primaryBranchId,
  });

  const employeeId = createStaffJson.data?.id;
  const identityUserId = createStaffJson.data?.identityUserId;

  console.log('\n=== 3. Verifying Branch in Organization Service Has Manager Assigned ===');
  const branchRes = await fetch(`${GATEWAY_URL}/api/v1/branches/${BRANCH_ID}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      'x-tenant-id': TENANT_ID,
    },
  });
  const branchJson = await branchRes.json();
  console.log(`Branch Fetch status: ${branchRes.status}`);
  console.log('Branch details in Organization Service:', {
    id: branchJson.data?.id,
    name: branchJson.data?.name,
    primaryManagerEmployeeId: branchJson.data?.primaryManagerEmployeeId,
    managerEmail: branchJson.data?.email,
  });
  const isManagerLinked = branchJson.data?.primaryManagerEmployeeId === employeeId;
  console.log(`✅ Branch correctly points to Manager Employee (${employeeId}):`, isManagerLinked);

  console.log('\n=== 4. Testing Authentication for the New Branch Manager ===');
  const staffLoginRes = await fetch(`${GATEWAY_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: newStaffEmail,
      password: newStaffPassword,
    }),
  });

  const staffLoginJson = await staffLoginRes.json();
  console.log(`Staff Login status: ${staffLoginRes.status}`);
  console.log('Staff User Auth result:', {
    success: staffLoginJson.success,
    email: staffLoginJson.data?.user?.email,
    fullName: staffLoginJson.data?.user?.fullName,
    role: staffLoginJson.data?.user?.role,
    roles: staffLoginJson.data?.user?.roles,
    branchIds: staffLoginJson.data?.user?.branchIds,
    hasPanelBranchAccess: staffLoginJson.data?.user?.permissions?.includes('panel.branch.access'),
    hasAppointmentRead: staffLoginJson.data?.user?.permissions?.includes('appointment.read'),
    totalPermissions: staffLoginJson.data?.user?.permissions?.length,
  });

  console.log('\n=== 5. Testing Seeded Manager Quick-Login (manager@glamour-salon.com / SuperAdmin@123!) ===');
  const seedManagerRes = await fetch(`${GATEWAY_URL}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'manager@glamour-salon.com',
      password: 'SuperAdmin@123!',
    }),
  });
  const seedManagerJson = await seedManagerRes.json();
  console.log(`Seeded Manager login status: ${seedManagerRes.status}`);
  console.log('Seeded Manager role:', seedManagerJson.data?.user?.role);
  console.log('Seeded Manager branchIds:', seedManagerJson.data?.user?.branchIds);

  console.log('\n=== ALL BRANCH MANAGER E2E VERIFICATIONS COMPLETE ===');
}

testBranchManagerCompleteFlow().catch(console.error);
