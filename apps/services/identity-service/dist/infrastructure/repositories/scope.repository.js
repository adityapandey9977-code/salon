import { prisma } from '../prisma/client';
export class ScopeRepository {
    toSafeScope(s) {
        return {
            id: s.id,
            scopeType: s.scopeType,
            tenantId: s.tenantId,
            franchiseId: s.franchiseId,
            branchId: s.branchId,
        };
    }
    async listUserScopes(userId) {
        const scopes = await prisma.userScopeAssignment.findMany({
            where: { userId },
            orderBy: { createdAt: 'desc' },
        });
        return scopes.map((s) => this.toSafeScope(s));
    }
    async createScope(data) {
        const scope = await prisma.userScopeAssignment.create({
            data: {
                userId: data.userId,
                scopeType: data.scopeType,
                tenantId: data.tenantId || null,
                franchiseId: data.franchiseId || null,
                branchId: data.branchId || null,
            },
        });
        return this.toSafeScope(scope);
    }
    async deleteScope(id, userId) {
        const result = await prisma.userScopeAssignment.deleteMany({
            where: { id, userId },
        });
        return result.count > 0;
    }
    async deleteAllUserScopes(userId) {
        await prisma.userScopeAssignment.deleteMany({
            where: { userId },
        });
    }
}
export const scopeRepository = new ScopeRepository();
