import type { CachedUserProfile } from '../../domain/entities/auth.dto';
import type { User, UserStatus, UserType } from '../prisma/generated-client';
export declare class UserRepository {
    private toSafeProfile;
    findById(id: string): Promise<CachedUserProfile | null>;
    findRawById(id: string): Promise<User | null>;
    findByNormalizedEmail(email: string): Promise<CachedUserProfile | null>;
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
    createUser(data: {
        email: string;
        passwordHash: string;
        fullName: string;
        mobilePhone?: string | null;
        userType?: UserType;
        isMfaRequired?: boolean;
        isMfaEnabled?: boolean;
        roleIds?: string[];
    }): Promise<CachedUserProfile>;
    updateUser(id: string, data: {
        fullName?: string;
        email?: string;
        mobilePhone?: string | null;
        isMfaRequired?: boolean;
        isMfaEnabled?: boolean;
        status?: UserStatus;
        roles?: string[];
    }): Promise<CachedUserProfile>;
    setStatus(id: string, status: UserStatus): Promise<CachedUserProfile>;
    updatePassword(id: string, passwordHash: string): Promise<void>;
}
export declare const userRepository: UserRepository;
//# sourceMappingURL=user.repository.d.ts.map