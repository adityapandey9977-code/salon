export interface StaffProfileEntity {
    id: string;
    userId: string;
    tenantId: string;
    employeeCode: string;
    designation: string;
    status: 'ACTIVE' | 'ON_LEAVE' | 'TERMINATED' | 'RESIGNED';
    rating: number;
    totalReviews: number;
    createdAt: Date;
    updatedAt: Date;
}
//# sourceMappingURL=staff.entity.d.ts.map