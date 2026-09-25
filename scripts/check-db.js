const { PrismaClient } = require('./apps/services/organization-service/node_modules/@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const branches = await prisma.branch.findMany({
    include: { franchise: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log('TOTAL BRANCHES:', branches.length);
  console.log('BRANCHES:', JSON.stringify(branches.map(b => ({
    id: b.id,
    name: b.name,
    code: b.code,
    tenantId: b.tenantId,
    franchiseId: b.franchiseId,
    franchiseName: b.franchise?.companyName,
    status: b.status,
    createdAt: b.createdAt
  })), null, 2));

  const partners = await prisma.franchisePartner.findMany({
    include: { branches: true }
  });
  console.log('FRANCHISE PARTNERS:', JSON.stringify(partners.map(p => ({
    id: p.id,
    name: p.companyName,
    email: p.contactEmail,
    branchCount: p.branches.length,
    branchNames: p.branches.map(b => b.name)
  })), null, 2));
}

main().catch(console.error).finally(() => prisma.$disconnect());
