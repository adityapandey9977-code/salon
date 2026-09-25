export interface UserEntity {
    id: string;
    tenantId: string | null;
    franchiseId: string | null;
    email: string;
    firstName: string;
    lastName: string;
    phone: string | null;
    status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED' | 'INVITED';
    isMfaEnabled: boolean;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=user.entity.d.ts.map