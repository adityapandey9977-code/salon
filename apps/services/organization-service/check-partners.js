const { PrismaClient } = require('./src/infrastructure/prisma/generated-client');
const prisma = new PrismaClient();
async function main() {
  const partners = await prisma.franchisePartner.findMany({
    include: { branches: true },
    orderBy: { createdAt: 'desc' }
  });
  console.log('TOTAL_PARTNERS:', partners.length);
  for (const p of partners) {
    console.log('PARTNER:', p.id, p.companyName, p.contactPerson, p.contactEmail, 'BRANCHES:', p.branches.map(b => `${b.id} (${b.name})`));
  }
}
main().catch(console.error).finally(() => prisma.$disconnect());
