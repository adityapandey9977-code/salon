import { prisma } from './src/infrastructure/prisma/client';

async function main() {
  const role = await prisma.role.findUnique({
    where: { code: 'FRANCHISE_OWNER' },
    include: {
      permissions: {
        include: {
          permission: true
        }
      }
    }
  });
  console.log('FRANCHISE_OWNER permissions:', role?.permissions.map(rp => rp.permission.code));
}

main().finally(() => prisma.$disconnect());
