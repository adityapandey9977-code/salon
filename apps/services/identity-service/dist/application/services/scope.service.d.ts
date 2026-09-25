import type { CachedUserScope } from '../../domain/entities/auth.dto';
import type { ScopeType } from '../../infrastructure/prisma/generated-client';
export declare class ScopeService {
    listUserScopes(userId: string): Promise<CachedUserScope[]>;
    createScope(data: {
        userId: string;
        scopeType: ScopeType;
        tenantId?: string | null;
        franchiseId?: string | null;
        branchId?: string | null;
    }): Promise<CachedUserScope>;
    deleteScope(id: string, userId: string): Promise<void>;
}
export declare const scopeService: ScopeService;
//# sourceMappingURL=scope.service.d.ts.map