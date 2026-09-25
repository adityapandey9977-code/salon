import { PrismaClient } from './apps/services/identity-service/src/infrastructure/prisma/generated-client/index.js';
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.findMany({
      where: {
        AND: [
          {
            OR: [
              { isSystem: true },
              { tenantId: null }
            ]
          },
          { showOnFrontend: true },
          {
            OR: [
              { allowedPanels: { has: 'ADMIN' } },
              { allowedPanels: { equals: [] } }
            ]
          }
        ]
      }
    });
  for (const r of roles) {
    console.log(r.code);
  }
}
main().catch(console.error);
