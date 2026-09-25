const { PrismaClient } = require('./src/infrastructure/prisma/generated-client');
const prisma = new PrismaClient();
async function main() {
  const users = await prisma.user.findMany({
    include: { roles: true, scopes: true },
    where: { email: { in: ['ashishkhopde7089@gmail.com', 'sanjay.chawla@apexwellness.in'] } }
  });
  console.log('USERS IN IDENTITY DB:');
  for (const u of users) {
    console.log('USER:', u.id, u.email, u.fullName, 'SCOPES:', u.scopes.map(s => ({
      scopeType: s.scopeType,
      tenantId: s.tenantId,
      franchiseId: s.franchiseId,
      branchId: s.branchId
    })));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
