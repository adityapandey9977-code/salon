import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import { redisConnectionManager } from './redis-connection.manager';
const logger = createLogger('people-read-store');
export class PeopleReadStore {
    static instance;
    constructor() { }
    static getInstance() {
        if (!PeopleReadStore.instance) {
            PeopleReadStore.instance = new PeopleReadStore();
        }
        return PeopleReadStore.instance;
    }
    get redis() {
        return redisConnectionManager.getClient();
    }
    safeParse(data) {
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch (err) {
            logger.warn({ err }, 'Failed to parse cached JSON in people-read-store');
            return null;
        }
    }
    // Cache Key Builders
    getEmployeeDetailKey(tenantId, employeeId) {
        return `tenant:${tenantId}:staff:${employeeId}`;
    }
    getBranchTeamKey(tenantId, branchId) {
        return `tenant:${tenantId}:branch:${branchId}:staff`;
    }
    getEmployeeBranchesKey(tenantId, employeeId) {
        return `tenant:${tenantId}:staff:${employeeId}:branches`;
    }
    getEmployeeSkillsKey(tenantId, employeeId) {
        return `tenant:${tenantId}:staff:${employeeId}:skills`;
    }
    getBranchShiftsKey(tenantId, branchId) {
        return `tenant:${tenantId}:branch:${branchId}:shifts`;
    }
    getEmployeeRosterKey(tenantId, employeeId, date) {
        return `tenant:${tenantId}:staff:${employeeId}:roster:${date}`;
    }
    // ==========================================
    // READ-THROUGH METHODS
    // ==========================================
    async getEmployeeDetail(tenantId, employeeId, fallback) {
        const key = this.getEmployeeDetailKey(tenantId, employeeId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                return this.safeParse(cached);
            }
        }
        catch (err) {
            logger.warn({ err, key }, 'Redis get error, executing DB fallback');
        }
        const data = await fallback();
        if (data) {
            try {
                await this.redis.set(key, JSON.stringify(data), 'EX', config.STAFF_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ err, key }, 'Redis set error in people-read-store');
            }
        }
        return data;
    }
    async getBranchTeam(tenantId, branchId, fallback) {
        const key = this.getBranchTeamKey(tenantId, branchId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const parsed = this.safeParse(cached);
                if (parsed)
                    return parsed;
            }
        }
        catch (err) {
            logger.warn({ err, key }, 'Redis get error for branch team, fallback to DB');
        }
        const data = await fallback();
        if (data && data.length > 0) {
            try {
                await this.redis.set(key, JSON.stringify(data), 'EX', config.STAFF_BRANCH_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ err, key }, 'Redis set error for branch team');
            }
        }
        return data;
    }
    async getEmployeeBranches(tenantId, employeeId, fallback) {
        const key = this.getEmployeeBranchesKey(tenantId, employeeId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const parsed = this.safeParse(cached);
                if (parsed)
                    return parsed;
            }
        }
        catch (err) {
            logger.warn({ err, key }, 'Redis get error for employee branches, fallback to DB');
        }
        const data = await fallback();
        if (data) {
            try {
                await this.redis.set(key, JSON.stringify(data), 'EX', config.STAFF_BRANCH_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ err, key }, 'Redis set error for employee branches');
            }
        }
        return data;
    }
    async getEmployeeSkills(tenantId, employeeId, fallback) {
        const key = this.getEmployeeSkillsKey(tenantId, employeeId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const parsed = this.safeParse(cached);
                if (parsed)
                    return parsed;
            }
        }
        catch (err) {
            logger.warn({ err, key }, 'Redis get error for employee skills, fallback to DB');
        }
        const data = await fallback();
        if (data) {
            try {
                await this.redis.set(key, JSON.stringify(data), 'EX', config.STAFF_SKILL_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ err, key }, 'Redis set error for employee skills');
            }
        }
        return data;
    }
    async getBranchShifts(tenantId, branchId, fallback) {
        const key = this.getBranchShiftsKey(tenantId, branchId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const parsed = this.safeParse(cached);
                if (parsed)
                    return parsed;
            }
        }
        catch (err) {
            logger.warn({ err, key }, 'Redis get error for branch shifts, fallback to DB');
        }
        const data = await fallback();
        if (data) {
            try {
                await this.redis.set(key, JSON.stringify(data), 'EX', config.SHIFT_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ err, key }, 'Redis set error for branch shifts');
            }
        }
        return data;
    }
    async getEmployeeRoster(tenantId, employeeId, date, fallback) {
        const key = this.getEmployeeRosterKey(tenantId, employeeId, date);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                return this.safeParse(cached);
            }
        }
        catch (err) {
            logger.warn({ err, key }, 'Redis get error for roster, fallback to DB');
        }
        const data = await fallback();
        if (data) {
            try {
                await this.redis.set(key, JSON.stringify(data), 'EX', config.ROSTER_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ err, key }, 'Redis set error for roster');
            }
        }
        return data;
    }
    // ==========================================
    // CACHE INVALIDATION METHODS
    // ==========================================
    async invalidateEmployee(tenantId, employeeId, primaryBranchId) {
        const keys = [this.getEmployeeDetailKey(tenantId, employeeId)];
        if (primaryBranchId) {
            keys.push(this.getBranchTeamKey(tenantId, primaryBranchId));
        }
        await this.delKeys(keys);
    }
    async invalidateBranchAssignments(tenantId, employeeId, branchId, oldBranchId) {
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
    async invalidateEmployeeSkills(tenantId, employeeId) {
        await this.delKeys([this.getEmployeeSkillsKey(tenantId, employeeId)]);
    }
    async invalidateBranchShifts(tenantId, branchId) {
        await this.delKeys([this.getBranchShiftsKey(tenantId, branchId)]);
    }
    async invalidateRoster(tenantId, employeeId, date) {
        await this.delKeys([this.getEmployeeRosterKey(tenantId, employeeId, date)]);
    }
    async delKeys(keys) {
        try {
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (err) {
            logger.warn({ err, keys }, 'Failed to delete Redis keys during cache invalidation');
        }
    }
}
export const peopleReadStore = PeopleReadStore.getInstance();
