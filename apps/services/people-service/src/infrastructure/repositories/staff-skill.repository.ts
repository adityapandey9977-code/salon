import type { CachedStaffSkill } from '../../domain/entities/staff.dto';
import { prisma } from '../prisma/client';
import { Prisma, type SkillLevel, type StaffSkill } from '../prisma/generated-client';

export class StaffSkillRepository {
  private toDto(item: StaffSkill): CachedStaffSkill {
    return {
      id: item.id,
      employeeId: item.employeeId,
      tenantId: item.tenantId,
      serviceId: item.serviceId,
      skillLevel: item.skillLevel,
      yearsExperience: item.yearsExperience ? Number(item.yearsExperience) : null,
      isPrimary: item.isPrimary,
      isActive: item.isActive,
    };
  }

  public async findSkillsByEmployee(
    tenantId: string,
    employeeId: string,
  ): Promise<CachedStaffSkill[]> {
    const records = await prisma.staffSkill.findMany({
      where: {
        tenantId,
        employeeId,
      },
      orderBy: { createdAt: 'desc' },
    });
    return records.map((r) => this.toDto(r));
  }

  public async findSkill(
    tenantId: string,
    employeeId: string,
    serviceId: string,
  ): Promise<CachedStaffSkill | null> {
    const record = await prisma.staffSkill.findUnique({
      where: {
        tenantId_employeeId_serviceId: {
          tenantId,
          employeeId,
          serviceId,
        },
      },
    });
    return record ? this.toDto(record) : null;
  }

  public async findSkillById(tenantId: string, id: string): Promise<CachedStaffSkill | null> {
    const record = await prisma.staffSkill.findFirst({
      where: { id, tenantId },
    });
    return record ? this.toDto(record) : null;
  }

  public async addSkill(data: {
    tenantId: string;
    employeeId: string;
    serviceId: string;
    skillLevel?: SkillLevel;
    yearsExperience?: number | null;
    isPrimary?: boolean;
    isActive?: boolean;
  }): Promise<CachedStaffSkill> {
    const record = await prisma.staffSkill.upsert({
      where: {
        tenantId_employeeId_serviceId: {
          tenantId: data.tenantId,
          employeeId: data.employeeId,
          serviceId: data.serviceId,
        },
      },
      create: {
        tenantId: data.tenantId,
        employeeId: data.employeeId,
        serviceId: data.serviceId,
        skillLevel: data.skillLevel || 'INTERMEDIATE',
        yearsExperience: data.yearsExperience !== undefined && data.yearsExperience !== null ? new Prisma.Decimal(data.yearsExperience) : null,
        isPrimary: data.isPrimary ?? false,
        isActive: data.isActive ?? true,
      },
      update: {
        skillLevel: data.skillLevel || 'INTERMEDIATE',
        yearsExperience: data.yearsExperience !== undefined && data.yearsExperience !== null ? new Prisma.Decimal(data.yearsExperience) : null,
        isPrimary: data.isPrimary ?? false,
        isActive: data.isActive ?? true,
      },
    });

    return this.toDto(record);
  }

  public async updateSkill(
    tenantId: string,
    id: string,
    data: {
      skillLevel?: SkillLevel;
      yearsExperience?: number | null;
      isPrimary?: boolean;
      isActive?: boolean;
    },
  ): Promise<CachedStaffSkill> {
    const record = await prisma.staffSkill.update({
      where: { id, tenantId },
      data: {
        ...(data.skillLevel !== undefined ? { skillLevel: data.skillLevel } : {}),
        ...(data.yearsExperience !== undefined ? { yearsExperience: data.yearsExperience !== null ? new Prisma.Decimal(data.yearsExperience) : null } : {}),
        ...(data.isPrimary !== undefined ? { isPrimary: data.isPrimary } : {}),
        ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
      },
    });

    return this.toDto(record);
  }

  public async removeSkill(tenantId: string, id: string): Promise<CachedStaffSkill> {
    const deleted = await prisma.staffSkill.delete({
      where: { id, tenantId },
    });
    return this.toDto(deleted);
  }
}

export const staffSkillRepository = new StaffSkillRepository();
