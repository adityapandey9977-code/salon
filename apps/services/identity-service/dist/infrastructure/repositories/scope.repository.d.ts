import type { CachedUserScope } from '../../domain/entities/auth.dto';
import type { ScopeType } from '../prisma/generated-client';
export declare class ScopeRepository {
    private toSafeScope;
    listUserScopes(userId: string): Promise<CachedUserScope[]>;
    createScope(data: {
        userId: string;
        scopeType: ScopeType;
        tenantId?: string | null;
        franchiseId?: string | null;
        branchId?: string | null;
    }): Promise<CachedUserScope>;
    deleteScope(id: string, userId: string): Promise<boolean>;
    deleteAllUserScopes(userId: string): Promise<void>;
}
export declare const scopeRepository: ScopeRepository;
//# sourceMappingURL=scope.repository.d.ts.map