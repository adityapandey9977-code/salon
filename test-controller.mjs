import { roleService } from './apps/services/identity-service/src/application/services/role.service.js';

async function test() {
  const roles = await roleService.listRoles('TENANT', null, true, 'ADMIN');
  console.log('Roles length:', roles.length);
  console.log('Roles:', roles.map(r => r.code));
}
test().catch(console.error);
