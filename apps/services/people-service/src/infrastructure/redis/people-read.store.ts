import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import type {
  CachedBranchStaffAssignment,
  CachedRosterAssignment,
  CachedShift,
  CachedStaffProfile,
  CachedStaffSkill,
} from '../../domain/entities/staff.dto';
import { redisConnectionManager } from './redis-connection.manager';

const logger = createLogger('people-read-store');

export class PeopleReadStore {
  private static instance: PeopleReadStore;

  private constructor() {}

  public static getInstance(): PeopleReadStore {
    if (!PeopleReadStore.instance) {
      PeopleReadStore.instance = new PeopleReadStore();
    }
    return PeopleReadStore.instance;
  }

  private get redis() {
    return redisConnectionManager.getClient();
  }

  private safeParse<T>(data: string | null): T | null {
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (err) {
      logger.warn({ err }, 'Failed to parse cached JSON in people-read-store');
      return null;
    }
  }

  // Cache Key Builders
  public getEmployeeDetailKey(tenantId: string, employeeId: string): string {
    return `tenant:${tenantId}:staff:${employeeId}`;
  }

  public getBranchTeamKey(tenantId: string, branchId: string): string {
    return `tenant:${tenantId}:branch:${branchId}:staff`;
  }

  public getEmployeeBranchesKey(tenantId: string, employeeId: string): string {
    return `tenant:${tenantId}:staff:${employeeId}:branches`;
  }

  public getEmployeeSkillsKey(tenantId: string, employeeId: string): string {
    return `tenant:${tenantId}:staff:${employeeId}:skills`;
  }

  public getBranchShiftsKey(tenantId: string, branchId: string): string {
    return `tenant:${tenantId}:branch:${branchId}:shifts`;
  }

  public getEmployeeRosterKey(tenantId: string, employeeId: string, date: string): string {
    return `tenant:${tenantId}:staff:${employeeId}:roster:${date}`;
  }

  // ==========================================
  // READ-THROUGH METHODS
  // ==========================================

  public async getEmployeeDetail(
    tenantId: string,
    employeeId: string,
    fallback: () => Promise<CachedStaffProfile | null>,
  ): Promise<CachedStaffProfile | null> {
    const key = this.getEmployeeDetailKey(tenantId, employeeId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        return this.safeParse<CachedStaffProfile>(cached);
      }
    } catch (err) {
      logger.warn({ err, key }, 'Redis get error, executing DB fallback');
    }

    const data = await fallback();
    if (data) {
      try {
        await this.redis.set(key, JSON.stringify(data), 'EX', config.STAFF_CACHE_TTL);
      } catch (err) {
        logger.warn({ err, key }, 'Redis set error in people-read-store');
      }
    }
    return data;
  }

  public async getBranchTeam(
    tenantId: string,
    branchId: string,
    fallback: () => Promise<CachedStaffProfile[]>,
  ): Promise<CachedStaffProfile[]> {
    const key = this.getBranchTeamKey(tenantId, branchId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const parsed = this.safeParse<CachedStaffProfile[]>(cached);
        if (parsed) return parsed;
      }
    } catch (err) {
      logger.warn({ err, key }, 'Redis get error for branch team, fallback to DB');
    }

    const data = await fallback();
    if (data && data.length > 0) {
      try {
        await this.redis.set(key, JSON.stringify(data), 'EX', config.STAFF_BRANCH_CACHE_TTL);
      } catch (err) {
        logger.warn({ err, key }, 'Redis set error for branch team');
      }
    }
    return data;
  }

  public async getEmployeeBranches(
    tenantId: string,
    employeeId: string,
    fallback: () => Promise<CachedBranchStaffAssignment[]>,
  ): Promise<CachedBranchStaffAssignment[]> {
    const key = this.getEmployeeBranchesKey(tenantId, employeeId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const parsed = this.safeParse<CachedBranchStaffAssignment[]>(cached);
        if (parsed) return parsed;
      }
    } catch (err) {
      logger.warn({ err, key }, 'Redis get error for employee branches, fallback to DB');
    }

    const data = await fallback();
    if (data) {
      try {
        await this.redis.set(key, JSON.stringify(data), 'EX', config.STAFF_BRANCH_CACHE_TTL);
      } catch (err) {
        logger.warn({ err, key }, 'Redis set error for employee branches');
      }
    }
    return data;
  }

  public async getEmployeeSkills(
    tenantId: string,
    employeeId: string,
    fallback: () => Promise<CachedStaffSkill[]>,
  ): Promise<CachedStaffSkill[]> {
    const key = this.getEmployeeSkillsKey(tenantId, employeeId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const parsed = this.safeParse<CachedStaffSkill[]>(cached);
        if (parsed) return parsed;
      }
    } catch (err) {
      logger.warn({ err, key }, 'Redis get error for employee skills, fallback to DB');
    }

    const data = await fallback();
    if (data) {
      try {
        await this.redis.set(key, JSON.stringify(data), 'EX', config.STAFF_SKILL_CACHE_TTL);
      } catch (err) {
        logger.warn({ err, key }, 'Redis set error for employee skills');
      }
    }
    return data;
  }

  public async getBranchShifts(
    tenantId: string,
    branchId: string,
    fallback: () => Promise<CachedShift[]>,
  ): Promise<CachedShift[]> {
    const key = this.getBranchShiftsKey(tenantId, branchId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const parsed = this.safeParse<CachedShift[]>(cached);
        if (parsed) return parsed;
      }
    } catch (err) {
      logger.warn({ err, key }, 'Redis get error for branch shifts, fallback to DB');
    }

    const data = await fallback();
    if (data) {
      try {
        await this.redis.set(key, JSON.stringify(data), 'EX', config.SHIFT_CACHE_TTL);
      } catch (err) {
        logger.warn({ err, key }, 'Redis set error for branch shifts');
      }
    }
    return data;
  }

  public async getEmployeeRoster(
    tenantId: string,
    employeeId: string,
    date: string,
    fallback: () => Promise<CachedRosterAssignment | null>,
  ): Promise<CachedRosterAssignment | null> {
    const key = this.getEmployeeRosterKey(tenantId, employeeId, date);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        return this.safeParse<CachedRosterAssignment>(cached);
      }
    } catch (err) {
      logger.warn({ err, key }, 'Redis get error for roster, fallback to DB');
    }

    const data = await fallback();
    if (data) {
      try {
        await this.redis.set(key, JSON.stringify(data), 'EX', config.ROSTER_CACHE_TTL);
      } catch (err) {
        logger.warn({ err, key }, 'Redis set error for roster');
      }
    }
    return data;
  }

  // ==========================================
  // CACHE INVALIDATION METHODS
  // ==========================================

  public async invalidateEmployee(tenantId: string, employeeId: string, primaryBranchId?: string | null): Promise<void> {
    const keys = [this.getEmployeeDetailKey(tenantId, employeeId)];
    if (primaryBranchId) {
      keys.push(this.getBranchTeamKey(tenantId, primaryBranchId));
    }
    await this.delKeys(keys);
  }

  public async invalidateBranchAssignments(
    tenantId: string,
    employeeId: string,
    branchId: string,
    oldBranchId?: string,
  ): Promise<void> {
    const keys = [
      this.getEmployeeBranchesKey(tenantId, employeeId),
      this.getEmployeeDetailKey(tenantId, employeeId),
      this.getBranchTeamKey(tenantId, branchId),
    ];
    if (oldBranchId && oldBranchId !== branchId) {
      keys.push(this.getBranchTeamKey(tenantId, oldBranchId));
    }
    await this.delKeys(keys);
  }

  public async invalidateEmployeeSkills(tenantId: string, employeeId: string): Promise<void> {
    await this.delKeys([this.getEmployeeSkillsKey(tenantId, employeeId)]);
  }

  public async invalidateBranchShifts(tenantId: string, branchId: string): Promise<void> {
    await this.delKeys([this.getBranchShiftsKey(tenantId, branchId)]);
  }

  public async invalidateRoster(tenantId: string, employeeId: string, date: string): Promise<void> {
    await this.delKeys([this.getEmployeeRosterKey(tenantId, employeeId, date)]);
  }

  private async delKeys(keys: string[]): Promise<void> {
    try {
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (err) {
      logger.warn({ err, keys }, 'Failed to delete Redis keys during cache invalidation');
    }
  }
}

export const peopleReadStore = PeopleReadStore.getInstance();
