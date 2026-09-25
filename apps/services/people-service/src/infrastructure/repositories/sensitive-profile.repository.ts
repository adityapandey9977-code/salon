import { prisma } from '../prisma/client';
import { EncryptionService } from '../security/encryption.service';

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

export class SensitiveProfileRepository {
  public async findByEmployeeId(
    tenantId: string,
    employeeId: string,
  ): Promise<SensitiveProfileDecrypted | null> {
    const record = await prisma.employeeSensitiveProfile.findUnique({
      where: { employeeId },
    });

    if (!record || record.tenantId !== tenantId) return null;

    return {
      employeeId: record.employeeId,
      tenantId: record.tenantId,
      aadhaar: EncryptionService.decrypt(record.aadhaarEncrypted),
      pan: EncryptionService.decrypt(record.panEncrypted),
      bankAccount: EncryptionService.decrypt(record.bankAccountEncrypted),
      ifsc: EncryptionService.decrypt(record.ifscEncrypted),
      emergencyMedicalInfo: EncryptionService.decrypt(record.emergencyMedicalInfoEncrypted),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }

  public async upsertSensitiveProfile(
    tenantId: string,
    employeeId: string,
    data: {
      aadhaar?: string | null;
      pan?: string | null;
      bankAccount?: string | null;
      ifsc?: string | null;
      emergencyMedicalInfo?: string | null;
    },
  ): Promise<SensitiveProfileDecrypted> {
    const record = await prisma.employeeSensitiveProfile.upsert({
      where: { employeeId },
      create: {
        tenantId,
        employeeId,
        aadhaarEncrypted: EncryptionService.encrypt(data.aadhaar),
        panEncrypted: EncryptionService.encrypt(data.pan),
        bankAccountEncrypted: EncryptionService.encrypt(data.bankAccount),
        ifscEncrypted: EncryptionService.encrypt(data.ifsc),
        emergencyMedicalInfoEncrypted: EncryptionService.encrypt(data.emergencyMedicalInfo),
      },
      update: {
        ...(data.aadhaar !== undefined ? { aadhaarEncrypted: EncryptionService.encrypt(data.aadhaar) } : {}),
        ...(data.pan !== undefined ? { panEncrypted: EncryptionService.encrypt(data.pan) } : {}),
        ...(data.bankAccount !== undefined ? { bankAccountEncrypted: EncryptionService.encrypt(data.bankAccount) } : {}),
        ...(data.ifsc !== undefined ? { ifscEncrypted: EncryptionService.encrypt(data.ifsc) } : {}),
        ...(data.emergencyMedicalInfo !== undefined ? { emergencyMedicalInfoEncrypted: EncryptionService.encrypt(data.emergencyMedicalInfo) } : {}),
      },
    });

    return {
      employeeId: record.employeeId,
      tenantId: record.tenantId,
      aadhaar: EncryptionService.decrypt(record.aadhaarEncrypted),
      pan: EncryptionService.decrypt(record.panEncrypted),
      bankAccount: EncryptionService.decrypt(record.bankAccountEncrypted),
      ifsc: EncryptionService.decrypt(record.ifscEncrypted),
      emergencyMedicalInfo: EncryptionService.decrypt(record.emergencyMedicalInfoEncrypted),
      createdAt: record.createdAt.toISOString(),
      updatedAt: record.updatedAt.toISOString(),
    };
  }
}

export const sensitiveProfileRepository = new SensitiveProfileRepository();
