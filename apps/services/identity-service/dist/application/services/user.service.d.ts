import type { CachedUserProfile } from '../../domain/entities/auth.dto';
import type { UserStatus, UserType } from '../../infrastructure/prisma/generated-client';
export declare class UserService {
    listUsers(params: {
        page?: number;
        limit?: number;
        userType?: UserType;
        status?: UserStatus;
        search?: string;
    }): Promise<{
        items: CachedUserProfile[];
        total: number;
        page: number;
        limit: number;
    }>;
    getUserById(userId: string, tenantId?: string | null): Promise<CachedUserProfile>;
    createUser(data: {
        email: string;
        password: string;
        fullName: string;
        mobilePhone?: string | null;
        userType?: UserType;
        isMfaRequired?: boolean;
        roleIds?: string[];
        roleName?: string;
    }): Promise<CachedUserProfile>;
    updateUser(userId: string, data: {
        fullName?: string;
        email?: string;
        mobilePhone?: string | null;
        isMfaRequired?: boolean;
        isMfaEnabled?: boolean;
        status?: UserStatus;
        roles?: string[];
        role?: string;
    }): Promise<CachedUserProfile>;
    suspendUser(userId: string): Promise<CachedUserProfile>;
    activateUser(userId: string): Promise<CachedUserProfile>;
}
export declare const userService: UserService;
//# sourceMappingURL=user.service.d.ts.map