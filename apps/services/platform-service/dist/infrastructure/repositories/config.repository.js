import { prisma } from '../prisma/client';
export class ConfigRepository {
    async get(key) {
        const config = await prisma.platformConfig.findUnique({
            where: { key },
        });
        return config?.value ?? null;
    }
    async getAll() {
        return prisma.platformConfig.findMany({
            orderBy: { key: 'asc' },
        });
    }
    async set(key, value, description) {
        return prisma.platformConfig.upsert({
            where: { key },
            create: { key, value, description },
            update: { value, description },
        });
    }
    async setMany(settings) {
        const entries = Object.entries(settings);
        return prisma.$transaction(entries.map(([key, value]) => prisma.platformConfig.upsert({
            where: { key },
            create: { key, value },
            update: { value },
        })));
    }
}
