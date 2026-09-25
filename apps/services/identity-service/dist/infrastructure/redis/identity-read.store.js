import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import { redisConnectionManager } from './redis-connection.manager';
const logger = createLogger('identity-read-store');
export class IdentityReadStore {
    static instance;
    constructor() { }
    static getInstance() {
        if (!IdentityReadStore.instance) {
            IdentityReadStore.instance = new IdentityReadStore();
        }
        return IdentityReadStore.instance;
    }
    get redis() {
        return redisConnectionManager.getClient();
    }
    // Safe JSON serialization & parse
    safeParse(data) {
        if (!data)
            return null;
        try {
            return JSON.parse(data);
        }
        catch (err) {
            logger.warn({ err }, 'Failed to parse cached JSON');
            return null;
        }
    }
    // Cache Key Builders - USER
    getUserProfileKey(userId, tenantId) {
        return tenantId ? `tenant:${tenantId}:user:${userId}` : `platform:user:${userId}`;
    }
    getUserByEmailKey(normalizedEmail) {
        return `identity:user-email:${normalizedEmail.toLowerCase()}`;
    }
    getPermissionsKey(userId) {
        return `identity:user:${userId}:permissions`;
    }
    getRolesKey(userId) {
        return `identity:user:${userId}:roles`;
    }
    getScopesKey(userId) {
        return `identity:user:${userId}:scopes`;
    }
    getEffectiveAccessKey(userId) {
        return `identity:user:${userId}:effective-access`;
    }
    getSessionKey(userId, sessionId) {
        return `identity:user:${userId}:session:${sessionId}`;
    }
    // Cache Key Builders - TENANT
    getTenantAuthProfileKey(tenantId) {
        return `identity:tenant:${tenantId}:auth-profile`;
    }
    getTenantByEmailKey(normalizedEmail) {
        return `identity:tenant-email:${normalizedEmail.toLowerCase()}`;
    }
    getTenantEffectiveAccessKey(tenantId) {
        return `identity:tenant:${tenantId}:effective-access`;
    }
    getTenantSessionKey(tenantCredentialId, sessionId) {
        return `identity:tenant-credential:${tenantCredentialId}:session:${sessionId}`;
    }
    getMfaChallengeKey(challengeId) {
        return `identity:mfa-challenge:${challengeId}`;
    }
    // ==========================================
    // READ-THROUGH METHODS - USER (Redis-first)
    // ==========================================
    async getUserProfile(userId, fallback, tenantId) {
        const key = this.getUserProfileKey(userId, tenantId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const parsed = this.safeParse(cached);
                if (parsed) {
                    logger.debug({ userId, key }, 'Redis Cache HIT: User Profile');
                    return parsed;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, userId }, 'Redis read error, falling back to PostgreSQL');
        }
        logger.debug({ userId, key }, 'Redis Cache MISS: User Profile, fetching from DB');
        const dbData = await fallback();
        if (dbData) {
            try {
                await this.redis.set(key, JSON.stringify(dbData), 'EX', config.USER_PROFILE_CACHE_TTL);
                await this.redis.set(this.getUserByEmailKey(dbData.email), dbData.id, 'EX', config.USER_PROFILE_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ error: err.message }, 'Redis write error while caching user profile');
            }
        }
        return dbData;
    }
    async getUserIdByEmail(email, fallback) {
        const key = this.getUserByEmailKey(email);
        try {
            const cachedId = await this.redis.get(key);
            if (cachedId) {
                logger.debug({ email, key }, 'Redis Cache HIT: User by email');
                return cachedId;
            }
        }
        catch (err) {
            logger.warn({ error: err.message, email }, 'Redis read error, falling back to DB');
        }
        const userId = await fallback();
        if (userId) {
            try {
                await this.redis.set(key, userId, 'EX', config.USER_PROFILE_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ error: err.message }, 'Redis write error');
            }
        }
        return userId;
    }
    async getEffectivePermissions(userId, fallback) {
        const key = this.getPermissionsKey(userId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const permissions = this.safeParse(cached);
                if (permissions) {
                    return permissions;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, userId }, 'Redis read error, falling back to DB');
        }
        const permissions = await fallback();
        try {
            await this.redis.set(key, JSON.stringify(permissions), 'EX', config.USER_PERMISSION_CACHE_TTL);
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Redis write error');
        }
        return permissions;
    }
    async getEffectiveRoles(userId, fallback) {
        const key = this.getRolesKey(userId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const roles = this.safeParse(cached);
                if (roles) {
                    return roles;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, userId }, 'Redis read error, falling back to DB');
        }
        const roles = await fallback();
        try {
            await this.redis.set(key, JSON.stringify(roles), 'EX', config.USER_ROLE_CACHE_TTL);
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Redis write error');
        }
        return roles;
    }
    async getUserScopes(userId, fallback) {
        const key = this.getScopesKey(userId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const scopes = this.safeParse(cached);
                if (scopes) {
                    return scopes;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, userId }, 'Redis read error, falling back to DB');
        }
        const scopes = await fallback();
        try {
            await this.redis.set(key, JSON.stringify(scopes), 'EX', config.USER_SCOPE_CACHE_TTL);
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Redis write error');
        }
        return scopes;
    }
    async getEffectiveAccess(userId, fallback) {
        const key = this.getEffectiveAccessKey(userId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const access = this.safeParse(cached);
                if (access) {
                    return access;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, userId }, 'Redis read error, falling back to DB');
        }
        const access = await fallback();
        try {
            await this.redis.set(key, JSON.stringify(access), 'EX', config.USER_PERMISSION_CACHE_TTL);
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Redis write error');
        }
        return access;
    }
    // ==========================================
    // READ-THROUGH METHODS - TENANT (Redis-first)
    // ==========================================
    async getTenantAuthProfile(tenantId, fallback) {
        const key = this.getTenantAuthProfileKey(tenantId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const parsed = this.safeParse(cached);
                if (parsed) {
                    logger.debug({ tenantId, key }, 'Redis Cache HIT: Tenant Auth Profile');
                    return parsed;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, tenantId }, 'Redis read error, falling back to DB');
        }
        logger.debug({ tenantId, key }, 'Redis Cache MISS: Tenant Auth Profile, fetching from DB');
        const dbData = await fallback();
        if (dbData) {
            try {
                await this.redis.set(key, JSON.stringify(dbData), 'EX', config.USER_PROFILE_CACHE_TTL);
                await this.redis.set(this.getTenantByEmailKey(dbData.loginEmail), dbData.tenantId, 'EX', config.USER_PROFILE_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ error: err.message }, 'Redis write error while caching tenant profile');
            }
        }
        return dbData;
    }
    async getTenantEffectiveAccess(tenantId, fallback) {
        const key = this.getTenantEffectiveAccessKey(tenantId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const access = this.safeParse(cached);
                if (access) {
                    return access;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, tenantId }, 'Redis read error, falling back to DB');
        }
        const access = await fallback();
        try {
            await this.redis.set(key, JSON.stringify(access), 'EX', config.USER_PERMISSION_CACHE_TTL);
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Redis write error');
        }
        return access;
    }
    async getTenantSession(tenantCredentialId, sessionId, fallback) {
        const key = this.getTenantSessionKey(tenantCredentialId, sessionId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const session = this.safeParse(cached);
                if (session) {
                    return session;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, tenantCredentialId, sessionId }, 'Redis read error, falling back to DB');
        }
        const session = await fallback();
        if (session) {
            try {
                await this.redis.set(key, JSON.stringify(session), 'EX', config.SESSION_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ error: err.message }, 'Redis write error');
            }
        }
        return session;
    }
    async getSession(userId, sessionId, fallback) {
        const key = this.getSessionKey(userId, sessionId);
        try {
            const cached = await this.redis.get(key);
            if (cached) {
                const session = this.safeParse(cached);
                if (session) {
                    return session;
                }
            }
        }
        catch (err) {
            logger.warn({ error: err.message, userId, sessionId }, 'Redis read error, falling back to DB');
        }
        const session = await fallback();
        if (session) {
            try {
                await this.redis.set(key, JSON.stringify(session), 'EX', config.SESSION_CACHE_TTL);
            }
            catch (err) {
                logger.warn({ error: err.message }, 'Redis write error');
            }
        }
        return session;
    }
    // ==========================================
    // MFA CHALLENGE TEMPORARY STORAGE
    // ==========================================
    async setMfaChallenge(data) {
        const key = this.getMfaChallengeKey(data.challengeId);
        try {
            await this.redis.set(key, JSON.stringify(data), 'EX', config.MFA_CHALLENGE_CACHE_TTL);
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Failed to save MFA challenge to Redis');
        }
    }
    async getMfaChallenge(challengeId) {
        const key = this.getMfaChallengeKey(challengeId);
        try {
            const raw = await this.redis.get(key);
            return this.safeParse(raw);
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Failed to get MFA challenge from Redis');
            return null;
        }
    }
    async deleteMfaChallenge(challengeId) {
        const key = this.getMfaChallengeKey(challengeId);
        try {
            await this.redis.del(key);
        }
        catch (err) {
            logger.warn({ error: err.message }, 'Failed to delete MFA challenge from Redis');
        }
    }
    // ==========================================
    // CACHE INVALIDATION METHODS (After DB Commit)
    // ==========================================
    async invalidateUser(userId, options) {
        const keys = [
            this.getUserProfileKey(userId, options?.tenantId),
            this.getUserProfileKey(userId),
            this.getEffectiveAccessKey(userId),
        ];
        if (options?.oldEmail) {
            keys.push(this.getUserByEmailKey(options.oldEmail));
        }
        if (options?.newEmail) {
            keys.push(this.getUserByEmailKey(options.newEmail));
        }
        try {
            await this.redis.del(...keys);
            logger.debug({ userId, keys }, 'Invalidated User cache projections');
        }
        catch (err) {
            logger.warn({ error: err.message, userId }, 'Error invalidating user cache');
        }
    }
    async invalidateTenant(tenantId, options) {
        const keys = [
            this.getTenantAuthProfileKey(tenantId),
            this.getTenantEffectiveAccessKey(tenantId),
        ];
        if (options?.oldEmail) {
            keys.push(this.getTenantByEmailKey(options.oldEmail));
        }
        if (options?.newEmail) {
            keys.push(this.getTenantByEmailKey(options.newEmail));
        }
        try {
            await this.redis.del(...keys);
            logger.debug({ tenantId, keys }, 'Invalidated Tenant cache projections');
        }
        catch (err) {
            logger.warn({ error: err.message, tenantId }, 'Error invalidating tenant cache');
        }
    }
    async invalidateTenantSession(tenantCredentialId, sessionId) {
        const key = this.getTenantSessionKey(tenantCredentialId, sessionId);
        try {
            await this.redis.del(key);
        }
        catch (err) {
            logger.warn({ error: err.message, tenantCredentialId, sessionId }, 'Error invalidating tenant session cache');
        }
    }
    async invalidateAllTenantSessions(tenantCredentialId) {
        try {
            const pattern = `identity:tenant-credential:${tenantCredentialId}:session:*`;
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (err) {
            logger.warn({ error: err.message, tenantCredentialId }, 'Error invalidating all tenant sessions');
        }
    }
    async invalidateUserAccess(userId) {
        const keys = [
            this.getRolesKey(userId),
            this.getPermissionsKey(userId),
            this.getScopesKey(userId),
            this.getEffectiveAccessKey(userId),
        ];
        try {
            await this.redis.del(...keys);
            logger.debug({ userId, keys }, 'Invalidated User Access cache projections');
        }
        catch (err) {
            logger.warn({ error: err.message, userId }, 'Error invalidating user access cache');
        }
    }
    async invalidateSession(userId, sessionId) {
        const key = this.getSessionKey(userId, sessionId);
        try {
            await this.redis.del(key);
        }
        catch (err) {
            logger.warn({ error: err.message, userId, sessionId }, 'Error invalidating session cache');
        }
    }
    async invalidateAllUserSessions(userId) {
        try {
            const pattern = `identity:user:${userId}:session:*`;
            const keys = await this.redis.keys(pattern);
            if (keys.length > 0) {
                await this.redis.del(...keys);
            }
        }
        catch (err) {
            logger.warn({ error: err.message, userId }, 'Error invalidating all user sessions');
        }
    }
}
export const identityReadStore = IdentityReadStore.getInstance();
