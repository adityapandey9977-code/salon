export interface SensitiveProfileDecrypted {
    employeeId: string;
    tenantId: string;
    aadhaar: string | null;
    pan: string | null;
    bankAccount: string | null;
    ifsc: string | null;
    emergencyMedicalInfo: string | null;
    createdAt: string;
    updatedAt: string;
}
export declare class SensitiveProfileRepository {
    findByEmployeeId(tenantId: string, employeeId: string): Promise<SensitiveProfileDecrypted | null>;
    upsertSensitiveProfile(tenantId: string, employeeId: string, data: {
        aadhaar?: string | null;
        pan?: string | null;
        bankAccount?: string | null;
        ifsc?: string | null;
        emergencyMedicalInfo?: string | null;
    }): Promise<SensitiveProfileDecrypted>;
}
export declare const sensitiveProfileRepository: SensitiveProfileRepository;
//# sourceMappingURL=sensitive-profile.repository.d.ts.map