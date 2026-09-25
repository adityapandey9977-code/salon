import { PrismaClient } from './apps/services/identity-service/src/infrastructure/prisma/generated-client/index.js';
const prisma = new PrismaClient();
async function main() {
  const roles = await prisma.role.findMany({
      where: {
        isSystem: true
      },
      include: {
        permissions: {
          include: { permission: true }
        }
      }
    });
  for (const r of roles) {
    const hasPlatform = r.permissions.some(p => p.permission.module.toUpperCase() === 'PLATFORM' || p.permission.code.toLowerCase().startsWith('platform.'));
    console.log(r.code, 'hasPlatform:', hasPlatform);
  }
}
main().catch(console.error);
