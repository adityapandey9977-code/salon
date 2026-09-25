import type { CachedStaffProfile } from '../../domain/entities/staff.dto';
import { type EmploymentStatus, type EmploymentType } from '../prisma/generated-client';
export declare class EmployeeRepository {
    private toSafeProfile;
    findById(tenantId: string, id: string): Promise<CachedStaffProfile | null>;
    findByIdentityUserId(tenantId: string, identityUserId: string): Promise<CachedStaffProfile | null>;
    findByIdentityUserIdGlobal(identityUserId: string): Promise<CachedStaffProfile | null>;
    findByEmployeeCode(tenantId: string, employeeCode: string): Promise<CachedStaffProfile | null>;
    generateNextEmployeeCode(tenantId: string): Promise<string>;
    listEmployees(params: {
        tenantId: string;
        branchId?: string;
        franchiseId?: string;
        hasFranchise?: boolean;
        status?: EmploymentStatus;
        employmentType?: EmploymentType;
        search?: string;
        sortBy?: string;
        sortOrder?: 'asc' | 'desc';
        page?: number;
        limit?: number;
    }): Promise<{
        items: CachedStaffProfile[];
        total: number;
        page: number;
        limit: number;
    }>;
    createEmployee(data: {
        tenantId: string;
        employeeCode: string;
        identityUserId?: string | null;
        firstName: string;
        lastName: string;
        displayName: string;
        email?: string | null;
        mobilePhone: string;
        dateOfBirth?: Date | null;
        gender?: string | null;
        employmentStatus?: EmploymentStatus;
        employmentType?: EmploymentType;
        joiningDate?: Date;
        primaryBranchId?: string | null;
        franchiseId?: string | null;
        jobTitle: string;
        department?: string | null;
        managerEmployeeId?: string | null;
        notes?: string | null;
        profile?: {
            bio?: string | null;
            yearsOfExperience?: number | null;
            specialization?: string | null;
            designation?: string | null;
            commissionEligible?: boolean;
            acceptsOnlineBooking?: boolean;
            isBookable?: boolean;
            serviceCapacity?: number;
            profileVisibility?: string;
        };
        emergencyContacts?: Array<{
            name: string;
            relationship: string;
            mobilePhone: string;
            alternatePhone?: string | null;
            address?: string | null;
        }>;
    }): Promise<CachedStaffProfile>;
    updateEmployee(tenantId: string, id: string, data: {
        firstName?: string;
        lastName?: string;
        displayName?: string;
        email?: string | null;
        mobilePhone?: string;
        dateOfBirth?: Date | null;
        gender?: string | null;
        employmentStatus?: EmploymentStatus;
        employmentType?: EmploymentType;
        exitDate?: Date | null;
        primaryBranchId?: string | null;
        franchiseId?: string | null;
        jobTitle?: string;
        department?: string | null;
        managerEmployeeId?: string | null;
        profilePhotoObjectKey?: string | null;
        notes?: string | null;
        identityUserId?: string | null;
        profile?: {
            bio?: string | null;
            yearsOfExperience?: number | null;
            specialization?: string | null;
            designation?: string | null;
            commissionEligible?: boolean;
            acceptsOnlineBooking?: boolean;
            isBookable?: boolean;
            serviceCapacity?: number;
            profileVisibility?: string;
        };
    }, changedByIdentityUserId?: string | null): Promise<CachedStaffProfile>;
    softDeleteEmployee(tenantId: string, id: string, deletedByIdentityUserId?: string | null, deleteReason?: string | null): Promise<CachedStaffProfile>;
}
export declare const employeeRepository: EmployeeRepository;
//# sourceMappingURL=employee.repository.d.ts.map