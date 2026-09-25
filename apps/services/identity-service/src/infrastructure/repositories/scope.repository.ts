import type { CachedUserScope } from '../../domain/entities/auth.dto';
import { prisma } from '../prisma/client';
import type { ScopeType, UserScopeAssignment } from '../prisma/generated-client';

export class ScopeRepository {
  private toSafeScope(s: UserScopeAssignment): CachedUserScope {
    return {
      id: s.id,
      scopeType: s.scopeType,
      tenantId: s.tenantId,
      franchiseId: s.franchiseId,
      branchId: s.branchId,
    };
  }

  public async listUserScopes(userId: string): Promise<CachedUserScope[]> {
    const scopes = await prisma.userScopeAssignment.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return scopes.map((s) => this.toSafeScope(s));
  }

  public async createScope(data: {
    userId: string;
    scopeType: ScopeType;
    tenantId?: string | null;
    franchiseId?: string | null;
    branchId?: string | null;
  }): Promise<CachedUserScope> {
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

  public async deleteScope(id: string, userId: string): Promise<boolean> {
    const result = await prisma.userScopeAssignment.deleteMany({
      where: { id, userId },
    });
    return result.count > 0;
  }

  public async deleteAllUserScopes(userId: string): Promise<void> {
    await prisma.userScopeAssignment.deleteMany({
      where: { userId },
    });
  }
}

export const scopeRepository = new ScopeRepository();
