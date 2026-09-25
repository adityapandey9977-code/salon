const { PrismaClient } = require('./src/infrastructure/prisma/generated-client');
const prisma = new PrismaClient();
async function main() {
  const branches = await prisma.branch.findMany({
    include: { franchise: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log('TOTAL_BRANCHES_COUNT:', branches.length);
  for (const b of branches) {
    console.log('BRANCH:', b.id, b.name, b.code, 'tenantId:', b.tenantId, 'franchiseId:', b.franchiseId, 'franchiseName:', b.franchise?.companyName);
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
