const { PrismaClient } = require('./src/infrastructure/prisma/generated-client/index.js');
const pc = new PrismaClient();
pc.role.update({ where: { code: 'FRANCHISE_OWNER' }, data: { showOnFrontend: false, allowedPanels: ['FRANCHISE'] } })
  .then(console.log)
  .catch(console.error)
  .finally(() => pc.$disconnect());
