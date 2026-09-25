import { PrismaClient } from './apps/services/identity-service/src/infrastructure/prisma/generated-client/index.js';

const prisma = new PrismaClient();
async function main() {
  try {
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
    console.log('Roles length:', roles.length);
  } catch(e) {
    console.error('ERROR:', e.message);
  }
}
main();
