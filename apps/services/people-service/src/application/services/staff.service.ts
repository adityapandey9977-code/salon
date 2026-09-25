import { ConflictError, NotFoundError } from '@salon-spa-saas/common-types';
import type {
  CreateEmployeeRequest,
  ListStaffQuery,
  UpdateEmployeeRequest,
} from '@salon-spa-saas/contracts';
import { config } from '../../config';
import type { CachedStaffProfile } from '../../domain/entities/staff.dto';
import { eventPublisher } from '../../infrastructure/messaging/publisher';
import { peopleReadStore } from '../../infrastructure/redis/people-read.store';
import { employeeRepository } from '../../infrastructure/repositories/employee.repository';
import { staffBranchRepository } from '../../infrastructure/repositories/staff-branch.repository';

const isUuid = (str?: any): boolean =>
  typeof str === 'string' && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);

export class StaffService {
  public async listStaff(
    tenantId: string,
    query: ListStaffQuery,
  ): Promise<{ items: CachedStaffProfile[]; total: number; page: number; limit: number }> {
    const hasFranchise =
      query.hasFranchise === true ||
      query.hasFranchise === 'true' ||
      (query.franchiseId ? true : undefined);

    return employeeRepository.listEmployees({
      tenantId,
      branchId: query.branchId,
      franchiseId: query.franchiseId,
      hasFranchise: hasFranchise !== undefined ? hasFranchise : undefined,
      status: query.status,
      employmentType: query.employmentType,
      search: query.search,
      sortBy: query.sortBy,
      sortOrder: query.sortOrder,
      page: query.page,
      limit: query.limit,
    });
  }

  public async getStaffDetail(tenantId: string, id: string): Promise<CachedStaffProfile> {
    const employee = await peopleReadStore.getEmployeeDetail(tenantId, id, async () => {
      return employeeRepository.findById(tenantId, id);
    });

    if (!employee) {
      throw new NotFoundError('Employee not found');
    }

    return employee;
  }

  public async getStaffMe(identityUserId: string, tenantId?: string | null): Promise<CachedStaffProfile> {
    const employee = tenantId
      ? await employeeRepository.findByIdentityUserId(tenantId, identityUserId)
      : await employeeRepository.findByIdentityUserIdGlobal(identityUserId);

    if (!employee) {
      throw new NotFoundError('No linked employee profile found for the authenticated user');
    }

    return employee;
  }

  public async createStaff(
    tenantId: string,
    data: CreateEmployeeRequest,
    createdByUserId?: string | null,
  ): Promise<CachedStaffProfile> {
    let employeeCode = data.employeeCode?.trim();
    if (!employeeCode || isUuid(employeeCode)) {
      employeeCode = await employeeRepository.generateNextEmployeeCode(tenantId);
    }

    const existing = await employeeRepository.findByEmployeeCode(tenantId, employeeCode);
    if (existing) {
      throw new ConflictError(`Employee with code '${employeeCode}' already exists in this tenant`);
    }

    const safeBranchId = data.primaryBranchId && isUuid(data.primaryBranchId) ? data.primaryBranchId : null;
    const safeFranchiseId = data.franchiseId && isUuid(data.franchiseId) ? data.franchiseId : null;

    const employee = await employeeRepository.createEmployee({
      tenantId,
      employeeCode,
      identityUserId: data.identityUserId && isUuid(data.identityUserId) ? data.identityUserId : null,
      firstName: data.firstName,
      lastName: data.lastName,
      displayName: data.displayName,
      email: data.email || null,
      mobilePhone: data.mobilePhone,
      dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : null,
      gender: data.gender || null,
      employmentStatus: data.employmentStatus,
      employmentType: data.employmentType,
      joiningDate: data.joiningDate ? new Date(data.joiningDate) : new Date(),
      primaryBranchId: safeBranchId,
      franchiseId: safeFranchiseId,
      jobTitle: data.jobTitle,
      department: data.department || null,
      managerEmployeeId: data.managerEmployeeId && isUuid(data.managerEmployeeId) ? data.managerEmployeeId : null,
      notes: data.notes || null,
      profile: {
        ...data.profile,
        specialization:
          data.profile?.specialization ||
          (Array.isArray((data as any).skills) && (data as any).skills.length > 0
            ? (data as any).skills.join(', ')
            : null) ||
          null,
      },
      emergencyContacts: data.emergencyContacts,
    });

    // Create initial branch assignment if primary branch is specified
    if (employee.primaryBranchId && isUuid(employee.primaryBranchId)) {
      try {
        await staffBranchRepository.assignBranch({
          tenantId,
          employeeId: employee.id,
          branchId: employee.primaryBranchId,
          isPrimary: true,
        });
      } catch (branchErr) {
        console.warn('[StaffService] Notice creating initial branch assignment:', branchErr);
      }
      await peopleReadStore.invalidateEmployee(tenantId, employee.id, employee.primaryBranchId);
    }

    // Auto-provision Identity User login if enabled
    const anyData = data as any;
    const rawRole = anyData.roleCode || anyData.roleId || anyData.role || anyData.jobTitle || '';
    const isBranchManagerRole =
      String(rawRole).toUpperCase().includes('BRANCH_MANAGER') ||
      String(employee.jobTitle || '').toLowerCase().includes('branch manager') ||
      String(anyData.role || '').toLowerCase().includes('branch manager');
    const normalizedRoleCode = isBranchManagerRole ? 'BRANCH_MANAGER' : (anyData.roleCode || anyData.role || 'STYLIST');

    const shouldEnableLogin =
      anyData.loginEnabled ??
      (isBranchManagerRole || Boolean(anyData.password) || Boolean(anyData.roleId) || Boolean(anyData.role));

    if (shouldEnableLogin && employee.email) {
      try {
        const identityRes = await fetch(`${config.IDENTITY_SERVICE_URL}/internal/v1/staff-users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-service-secret': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            tenantId,
            fullName: employee.displayName || `${employee.firstName} ${employee.lastName}`.trim(),
            email: employee.email,
            mobilePhone: employee.mobilePhone,
            password: anyData.password || ' @123!',
            roleId: anyData.roleId,
            roleCode: normalizedRoleCode,
            branchId: employee.primaryBranchId,
          }),
        });

        if (identityRes.ok) {
          const json = (await identityRes.json()) as any;
          if (json?.data?.userId) {
            await employeeRepository.updateEmployee(tenantId, employee.id, {
              identityUserId: json.data.userId,
            });
            employee.identityUserId = json.data.userId;
          }
        } else {
          console.warn(
            '[StaffService] Identity Service response not ok:',
            await identityRes.text(),
          );
        }
      } catch (identityErr) {
        console.warn(
          '[StaffService] Could not reach Identity Service to provision staff login:',
          identityErr,
        );
      }
    }

    // If staff member is assigned as Branch Manager, link to organization branch
    if (isBranchManagerRole && employee.primaryBranchId) {
      try {
        await fetch(`${config.ORGANIZATION_SERVICE_URL}/api/v1/branches/${employee.primaryBranchId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
            'x-service-secret': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            primaryManagerEmployeeId: employee.id,
            email: employee.email,
            phone: employee.mobilePhone,
          }),
        });
        console.log(`[StaffService] Synced primary branch manager ${employee.id} to branch ${employee.primaryBranchId}`);
      } catch (orgErr) {
        console.warn('[StaffService] Could not sync branch manager to organization service:', orgErr);
      }
    }

    // Publish event
    await eventPublisher.publishEvent({
      eventType: 'EmployeeCreated',
      aggregateType: 'Employee',
      aggregateId: employee.id,
      tenantId,
      userId: createdByUserId,
      payload: {
        tenantId,
        employeeId: employee.id,
        employeeCode: employee.employeeCode,
        identityUserId: employee.identityUserId,
        displayName: employee.displayName,
        jobTitle: employee.jobTitle,
        primaryBranchId: employee.primaryBranchId,
        createdAt: employee.createdAt,
      },
    });

    return employee;
  }

  public async updateStaff(
    tenantId: string,
    id: string,
    data: UpdateEmployeeRequest,
    updatedByUserId?: string | null,
  ): Promise<CachedStaffProfile> {
    const existing = await employeeRepository.findById(tenantId, id);
    if (!existing) {
      throw new NotFoundError('Employee not found');
    }

    const updated = await employeeRepository.updateEmployee(
      tenantId,
      id,
      {
        firstName: data.firstName,
        lastName: data.lastName,
        displayName: data.displayName,
        email: data.email,
        mobilePhone: data.mobilePhone,
        dateOfBirth: data.dateOfBirth ? new Date(data.dateOfBirth) : undefined,
        gender: data.gender,
        employmentStatus: data.employmentStatus,
        employmentType: data.employmentType,
        exitDate: data.exitDate ? new Date(data.exitDate) : undefined,
        primaryBranchId:
          data.primaryBranchId && isUuid(data.primaryBranchId)
            ? data.primaryBranchId
            : data.primaryBranchId === null
              ? null
              : undefined,
        franchiseId:
          data.franchiseId && isUuid(data.franchiseId)
            ? data.franchiseId
            : data.franchiseId === null
              ? null
              : undefined,
        jobTitle: data.jobTitle,
        department: data.department,
        managerEmployeeId:
          data.managerEmployeeId && isUuid(data.managerEmployeeId)
            ? data.managerEmployeeId
            : data.managerEmployeeId === null
              ? null
              : undefined,
        profilePhotoObjectKey: data.profilePhotoObjectKey,
        notes: data.notes,
        profile:
          data.profile || (data as any).skills
            ? {
              ...data.profile,
              specialization:
                data.profile?.specialization !== undefined
                  ? data.profile.specialization
                  : Array.isArray((data as any).skills) && (data as any).skills.length > 0
                    ? (data as any).skills.join(', ')
                    : undefined,
            }
            : undefined,
      },
      updatedByUserId,
    );

    // Invalidate cache
    await peopleReadStore.invalidateEmployee(tenantId, id, existing.primaryBranchId);
    if (updated.primaryBranchId && updated.primaryBranchId !== existing.primaryBranchId) {
      await peopleReadStore.invalidateEmployee(tenantId, id, updated.primaryBranchId);
    }

    // Publish event
    await eventPublisher.publishEvent({
      eventType: 'EmployeeUpdated',
      aggregateType: 'Employee',
      aggregateId: id,
      tenantId,
      userId: updatedByUserId,
      payload: {
        tenantId,
        employeeId: id,
        updatedFields: Object.keys(data),
        updatedAt: updated.updatedAt,
      },
    });

    // Sync branch assignment if primary branch changed
    if (updated.primaryBranchId && updated.primaryBranchId !== existing.primaryBranchId) {
      try {
        await staffBranchRepository.assignBranch({
          tenantId,
          employeeId: updated.id,
          branchId: updated.primaryBranchId,
          isPrimary: true,
        });
      } catch (assignErr) {
        console.warn('[StaffService] Branch assignment note on update:', assignErr);
      }
    }

    // Auto-update Identity User login if login enabled or credentials updated
    const anyData = data as any;
    const rawRole = anyData.roleCode || anyData.roleId || anyData.role || anyData.jobTitle || updated.jobTitle || '';
    const isBranchManagerRole =
      String(rawRole).toUpperCase().includes('BRANCH_MANAGER') ||
      String(updated.jobTitle || '').toLowerCase().includes('branch manager') ||
      String(anyData.role || '').toLowerCase().includes('branch manager');
    const normalizedRoleCode = isBranchManagerRole ? 'BRANCH_MANAGER' : (anyData.roleCode || anyData.role || 'STYLIST');

    const shouldUpdateLogin =
      anyData.loginEnabled ??
      (isBranchManagerRole || Boolean(anyData.password) || Boolean(anyData.roleId) || Boolean(anyData.role) || Boolean(updated.identityUserId));

    if (shouldUpdateLogin && updated.email) {
      try {
        const identityRes = await fetch(`${config.IDENTITY_SERVICE_URL}/internal/v1/staff-users`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-service-secret': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            tenantId,
            fullName: updated.displayName || `${updated.firstName} ${updated.lastName}`.trim(),
            email: updated.email,
            mobilePhone: updated.mobilePhone,
            password: anyData.password, // optional, only updates if provided
            roleId: anyData.roleId,
            roleCode: normalizedRoleCode,
            branchId: updated.primaryBranchId,
          }),
        });

        if (identityRes.ok) {
          const json = (await identityRes.json()) as any;
          if (json?.data?.userId && !updated.identityUserId) {
            await employeeRepository.updateEmployee(tenantId, updated.id, {
              identityUserId: json.data.userId,
            });
            updated.identityUserId = json.data.userId;
          }
        }
      } catch (idErr) {
        console.warn('[StaffService] Identity service note during updateStaff:', idErr);
      }
    }

    // If staff member is assigned as Branch Manager, link to organization branch
    if (isBranchManagerRole && updated.primaryBranchId) {
      try {
        await fetch(`${config.ORGANIZATION_SERVICE_URL}/api/v1/branches/${updated.primaryBranchId}`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            'x-tenant-id': tenantId,
            'x-service-secret': config.SERVICE_INTERNAL_SECRET,
          },
          body: JSON.stringify({
            primaryManagerEmployeeId: updated.id,
            email: updated.email,
            phone: updated.mobilePhone,
          }),
        });
        console.log(`[StaffService] Synced primary branch manager ${updated.id} to branch ${updated.primaryBranchId} on update`);
      } catch (orgErr) {
        console.warn('[StaffService] Could not sync branch manager to organization service on update:', orgErr);
      }
    }

    return updated;
  }

  public async softDeleteStaff(
    tenantId: string,
    id: string,
    deletedByUserId?: string | null,
    deleteReason?: string | null,
  ): Promise<CachedStaffProfile> {
    const existing = await employeeRepository.findById(tenantId, id);
    if (!existing) {
      throw new NotFoundError('Employee not found');
    }

    const deleted = await employeeRepository.softDeleteEmployee(
      tenantId,
      id,
      deletedByUserId,
      deleteReason,
    );

    await peopleReadStore.invalidateEmployee(tenantId, id, existing.primaryBranchId);

    await eventPublisher.publishEvent({
      eventType: 'EmployeeDeactivated',
      aggregateType: 'Employee',
      aggregateId: id,
      tenantId,
      userId: deletedByUserId,
      payload: {
        tenantId,
        employeeId: id,
        previousStatus: existing.employmentStatus,
        newStatus: 'TERMINATED',
        reason: deleteReason || 'Employee soft-deleted',
        changedAt: new Date().toISOString(),
      },
    });

    return deleted;
  }

  public async getBranchTeam(tenantId: string, branchId: string): Promise<CachedStaffProfile[]> {
    return peopleReadStore.getBranchTeam(tenantId, branchId, async () => {
      const employeeIds = await staffBranchRepository.findEmployeesByBranch(tenantId, branchId);
      if (employeeIds.length === 0) return [];

      const result: CachedStaffProfile[] = [];
      for (const id of employeeIds) {
        const emp = await employeeRepository.findById(tenantId, id);
        if (emp && emp.employmentStatus === 'ACTIVE') {
          result.push(emp);
        }
      }
      return result;
    });
  }
}

export const staffService = new StaffService();
