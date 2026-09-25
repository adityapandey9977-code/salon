import { config } from '../../config';
import { PrismaClient } from './generated-client';

declare global {
  // eslint-disable-next-line no-var
  var __identityPrisma: PrismaClient | undefined;
}

// Build URL with connection limit and pool timeout if not already parameterized
function buildDatabaseUrl(): string {
  const rawUrl = config.IDENTITY_DATABASE_URL;
  try {
    const url = new URL(rawUrl);
    if (!url.searchParams.has('connection_limit')) {
      url.searchParams.set('connection_limit', String(config.DB_CONNECTION_LIMIT));
    }
    if (!url.searchParams.has('pool_timeout')) {
      url.searchParams.set('pool_timeout', String(config.DB_POOL_TIMEOUT));
    }
    return url.toString();
  } catch {
    return rawUrl;
  }
}

export const prisma =
  global.__identityPrisma ||
  new PrismaClient({
    datasources: {
      db: {
        url: buildDatabaseUrl(),
      },
    },
    log: config.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  });

if (config.NODE_ENV !== 'production') {
  global.__identityPrisma = prisma;
}

export async function disconnectPrisma(): Promise<void> {
  await prisma.$disconnect();
}
