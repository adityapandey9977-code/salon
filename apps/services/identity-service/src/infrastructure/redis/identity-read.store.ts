import { createLogger } from '@salon-spa-saas/logger';
import { config } from '../../config';
import type {
  CachedEffectiveAccess,
  CachedSessionMetadata,
  CachedTenantEffectiveAccess,
  CachedTenantProfile,
  CachedUserProfile,
  CachedUserScope,
  MfaChallengeData,
} from '../../domain/entities/auth.dto';
import { redisConnectionManager } from './redis-connection.manager';

const logger = createLogger('identity-read-store');

export class IdentityReadStore {
  private static instance: IdentityReadStore;

  private constructor() {}

  public static getInstance(): IdentityReadStore {
    if (!IdentityReadStore.instance) {
      IdentityReadStore.instance = new IdentityReadStore();
    }
    return IdentityReadStore.instance;
  }

  private get redis() {
    return redisConnectionManager.getClient();
  }

  // Safe JSON serialization & parse
  private safeParse<T>(data: string | null): T | null {
    if (!data) return null;
    try {
      return JSON.parse(data) as T;
    } catch (err) {
      logger.warn({ err }, 'Failed to parse cached JSON');
      return null;
    }
  }

  // Cache Key Builders - USER
  public getUserProfileKey(userId: string, tenantId?: string | null): string {
    return tenantId ? `tenant:${tenantId}:user:${userId}` : `platform:user:${userId}`;
  }

  public getUserByEmailKey(normalizedEmail: string): string {
    return `identity:user-email:${normalizedEmail.toLowerCase()}`;
  }

  public getPermissionsKey(userId: string): string {
    return `identity:user:${userId}:permissions`;
  }

  public getRolesKey(userId: string): string {
    return `identity:user:${userId}:roles`;
  }

  public getScopesKey(userId: string): string {
    return `identity:user:${userId}:scopes`;
  }

  public getEffectiveAccessKey(userId: string): string {
    return `identity:user:${userId}:effective-access`;
  }

  public getSessionKey(userId: string, sessionId: string): string {
    return `identity:user:${userId}:session:${sessionId}`;
  }

  // Cache Key Builders - TENANT
  public getTenantAuthProfileKey(tenantId: string): string {
    return `identity:tenant:${tenantId}:auth-profile`;
  }

  public getTenantByEmailKey(normalizedEmail: string): string {
    return `identity:tenant-email:${normalizedEmail.toLowerCase()}`;
  }

  public getTenantEffectiveAccessKey(tenantId: string): string {
    return `identity:tenant:${tenantId}:effective-access`;
  }

  public getTenantSessionKey(tenantCredentialId: string, sessionId: string): string {
    return `identity:tenant-credential:${tenantCredentialId}:session:${sessionId}`;
  }

  public getMfaChallengeKey(challengeId: string): string {
    return `identity:mfa-challenge:${challengeId}`;
  }

  // ==========================================
  // READ-THROUGH METHODS - USER (Redis-first)
  // ==========================================

  public async getUserProfile(
    userId: string,
    fallback: () => Promise<CachedUserProfile | null>,
    tenantId?: string | null,
  ): Promise<CachedUserProfile | null> {
    const key = this.getUserProfileKey(userId, tenantId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const parsed = this.safeParse<CachedUserProfile>(cached);
        if (parsed) {
          logger.debug({ userId, key }, 'Redis Cache HIT: User Profile');
          return parsed;
        }
      }
    } catch (err: any) {
      logger.warn({ error: err.message, userId }, 'Redis read error, falling back to PostgreSQL');
    }

    logger.debug({ userId, key }, 'Redis Cache MISS: User Profile, fetching from DB');
    const dbData = await fallback();
    if (dbData) {
      try {
        await this.redis.set(key, JSON.stringify(dbData), 'EX', config.USER_PROFILE_CACHE_TTL);
        await this.redis.set(
          this.getUserByEmailKey(dbData.email),
          dbData.id,
          'EX',
          config.USER_PROFILE_CACHE_TTL,
        );
      } catch (err: any) {
        logger.warn({ error: err.message }, 'Redis write error while caching user profile');
      }
    }
    return dbData;
  }

  public async getUserIdByEmail(
    email: string,
    fallback: () => Promise<string | null>,
  ): Promise<string | null> {
    const key = this.getUserByEmailKey(email);
    try {
      const cachedId = await this.redis.get(key);
      if (cachedId) {
        logger.debug({ email, key }, 'Redis Cache HIT: User by email');
        return cachedId;
      }
    } catch (err: any) {
      logger.warn({ error: err.message, email }, 'Redis read error, falling back to DB');
    }

    const userId = await fallback();
    if (userId) {
      try {
        await this.redis.set(key, userId, 'EX', config.USER_PROFILE_CACHE_TTL);
      } catch (err: any) {
        logger.warn({ error: err.message }, 'Redis write error');
      }
    }
    return userId;
  }

  public async getEffectivePermissions(
    userId: string,
    fallback: () => Promise<string[]>,
  ): Promise<string[]> {
    const key = this.getPermissionsKey(userId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const permissions = this.safeParse<string[]>(cached);
        if (permissions) {
          return permissions;
        }
      }
    } catch (err: any) {
      logger.warn({ error: err.message, userId }, 'Redis read error, falling back to DB');
    }

    const permissions = await fallback();
    try {
      await this.redis.set(
        key,
        JSON.stringify(permissions),
        'EX',
        config.USER_PERMISSION_CACHE_TTL,
      );
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Redis write error');
    }
    return permissions;
  }

  public async getEffectiveRoles(
    userId: string,
    fallback: () => Promise<string[]>,
  ): Promise<string[]> {
    const key = this.getRolesKey(userId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const roles = this.safeParse<string[]>(cached);
        if (roles) {
          return roles;
        }
      }
    } catch (err: any) {
      logger.warn({ error: err.message, userId }, 'Redis read error, falling back to DB');
    }

    const roles = await fallback();
    try {
      await this.redis.set(key, JSON.stringify(roles), 'EX', config.USER_ROLE_CACHE_TTL);
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Redis write error');
    }
    return roles;
  }

  public async getUserScopes(
    userId: string,
    fallback: () => Promise<CachedUserScope[]>,
  ): Promise<CachedUserScope[]> {
    const key = this.getScopesKey(userId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const scopes = this.safeParse<CachedUserScope[]>(cached);
        if (scopes) {
          return scopes;
        }
      }
    } catch (err: any) {
      logger.warn({ error: err.message, userId }, 'Redis read error, falling back to DB');
    }

    const scopes = await fallback();
    try {
      await this.redis.set(key, JSON.stringify(scopes), 'EX', config.USER_SCOPE_CACHE_TTL);
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Redis write error');
    }
    return scopes;
  }

  public async getEffectiveAccess(
    userId: string,
    fallback: () => Promise<CachedEffectiveAccess>,
  ): Promise<CachedEffectiveAccess> {
    const key = this.getEffectiveAccessKey(userId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const access = this.safeParse<CachedEffectiveAccess>(cached);
        if (access) {
          return access;
        }
      }
    } catch (err: any) {
      logger.warn({ error: err.message, userId }, 'Redis read error, falling back to DB');
    }

    const access = await fallback();
    try {
      await this.redis.set(key, JSON.stringify(access), 'EX', config.USER_PERMISSION_CACHE_TTL);
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Redis write error');
    }
    return access;
  }

  // ==========================================
  // READ-THROUGH METHODS - TENANT (Redis-first)
  // ==========================================

  public async getTenantAuthProfile(
    tenantId: string,
    fallback: () => Promise<CachedTenantProfile | null>,
  ): Promise<CachedTenantProfile | null> {
    const key = this.getTenantAuthProfileKey(tenantId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const parsed = this.safeParse<CachedTenantProfile>(cached);
        if (parsed) {
          logger.debug({ tenantId, key }, 'Redis Cache HIT: Tenant Auth Profile');
          return parsed;
        }
      }
    } catch (err: any) {
      logger.warn({ error: err.message, tenantId }, 'Redis read error, falling back to DB');
    }

    logger.debug({ tenantId, key }, 'Redis Cache MISS: Tenant Auth Profile, fetching from DB');
    const dbData = await fallback();
    if (dbData) {
      try {
        await this.redis.set(key, JSON.stringify(dbData), 'EX', config.USER_PROFILE_CACHE_TTL);
        await this.redis.set(
          this.getTenantByEmailKey(dbData.loginEmail),
          dbData.tenantId,
          'EX',
          config.USER_PROFILE_CACHE_TTL,
        );
      } catch (err: any) {
        logger.warn({ error: err.message }, 'Redis write error while caching tenant profile');
      }
    }
    return dbData;
  }

  public async getTenantEffectiveAccess(
    tenantId: string,
    fallback: () => Promise<CachedTenantEffectiveAccess>,
  ): Promise<CachedTenantEffectiveAccess> {
    const key = this.getTenantEffectiveAccessKey(tenantId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const access = this.safeParse<CachedTenantEffectiveAccess>(cached);
        if (access) {
          return access;
        }
      }
    } catch (err: any) {
      logger.warn({ error: err.message, tenantId }, 'Redis read error, falling back to DB');
    }

    const access = await fallback();
    try {
      await this.redis.set(key, JSON.stringify(access), 'EX', config.USER_PERMISSION_CACHE_TTL);
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Redis write error');
    }
    return access;
  }

  public async getTenantSession(
    tenantCredentialId: string,
    sessionId: string,
    fallback: () => Promise<CachedSessionMetadata | null>,
  ): Promise<CachedSessionMetadata | null> {
    const key = this.getTenantSessionKey(tenantCredentialId, sessionId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const session = this.safeParse<CachedSessionMetadata>(cached);
        if (session) {
          return session;
        }
      }
    } catch (err: any) {
      logger.warn(
        { error: err.message, tenantCredentialId, sessionId },
        'Redis read error, falling back to DB',
      );
    }

    const session = await fallback();
    if (session) {
      try {
        await this.redis.set(key, JSON.stringify(session), 'EX', config.SESSION_CACHE_TTL);
      } catch (err: any) {
        logger.warn({ error: err.message }, 'Redis write error');
      }
    }
    return session;
  }

  public async getSession(
    userId: string,
    sessionId: string,
    fallback: () => Promise<CachedSessionMetadata | null>,
  ): Promise<CachedSessionMetadata | null> {
    const key = this.getSessionKey(userId, sessionId);
    try {
      const cached = await this.redis.get(key);
      if (cached) {
        const session = this.safeParse<CachedSessionMetadata>(cached);
        if (session) {
          return session;
        }
      }
    } catch (err: any) {
      logger.warn(
        { error: err.message, userId, sessionId },
        'Redis read error, falling back to DB',
      );
    }

    const session = await fallback();
    if (session) {
      try {
        await this.redis.set(key, JSON.stringify(session), 'EX', config.SESSION_CACHE_TTL);
      } catch (err: any) {
        logger.warn({ error: err.message }, 'Redis write error');
      }
    }
    return session;
  }

  // ==========================================
  // MFA CHALLENGE TEMPORARY STORAGE
  // ==========================================

  public async setMfaChallenge(data: MfaChallengeData): Promise<void> {
    const key = this.getMfaChallengeKey(data.challengeId);
    try {
      await this.redis.set(key, JSON.stringify(data), 'EX', config.MFA_CHALLENGE_CACHE_TTL);
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Failed to save MFA challenge to Redis');
    }
  }

  public async getMfaChallenge(challengeId: string): Promise<MfaChallengeData | null> {
    const key = this.getMfaChallengeKey(challengeId);
    try {
      const raw = await this.redis.get(key);
      return this.safeParse<MfaChallengeData>(raw);
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Failed to get MFA challenge from Redis');
      return null;
    }
  }

  public async deleteMfaChallenge(challengeId: string): Promise<void> {
    const key = this.getMfaChallengeKey(challengeId);
    try {
      await this.redis.del(key);
    } catch (err: any) {
      logger.warn({ error: err.message }, 'Failed to delete MFA challenge from Redis');
    }
  }

  // ==========================================
  // CACHE INVALIDATION METHODS (After DB Commit)
  // ==========================================

  public async invalidateUser(
    userId: string,
    options?: { oldEmail?: string; newEmail?: string; tenantId?: string | null },
  ): Promise<void> {
    const keys: string[] = [
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
    } catch (err: any) {
      logger.warn({ error: err.message, userId }, 'Error invalidating user cache');
    }
  }

  public async invalidateTenant(
    tenantId: string,
    options?: { credentialId?: string; oldEmail?: string; newEmail?: string },
  ): Promise<void> {
    const keys: string[] = [
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
    } catch (err: any) {
      logger.warn({ error: err.message, tenantId }, 'Error invalidating tenant cache');
    }
  }

  public async invalidateTenantSession(
    tenantCredentialId: string,
    sessionId: string,
  ): Promise<void> {
    const key = this.getTenantSessionKey(tenantCredentialId, sessionId);
    try {
      await this.redis.del(key);
    } catch (err: any) {
      logger.warn(
        { error: err.message, tenantCredentialId, sessionId },
        'Error invalidating tenant session cache',
      );
    }
  }

  public async invalidateAllTenantSessions(tenantCredentialId: string): Promise<void> {
    try {
      const pattern = `identity:tenant-credential:${tenantCredentialId}:session:*`;
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (err: any) {
      logger.warn(
        { error: err.message, tenantCredentialId },
        'Error invalidating all tenant sessions',
      );
    }
  }

  public async invalidateUserAccess(userId: string): Promise<void> {
    const keys = [
      this.getRolesKey(userId),
      this.getPermissionsKey(userId),
      this.getScopesKey(userId),
      this.getEffectiveAccessKey(userId),
    ];
    try {
      await this.redis.del(...keys);
      logger.debug({ userId, keys }, 'Invalidated User Access cache projections');
    } catch (err: any) {
      logger.warn({ error: err.message, userId }, 'Error invalidating user access cache');
    }
  }

  public async invalidateSession(userId: string, sessionId: string): Promise<void> {
    const key = this.getSessionKey(userId, sessionId);
    try {
      await this.redis.del(key);
    } catch (err: any) {
      logger.warn({ error: err.message, userId, sessionId }, 'Error invalidating session cache');
    }
  }

  public async invalidateAllUserSessions(userId: string): Promise<void> {
    try {
      const pattern = `identity:user:${userId}:session:*`;
      const keys = await this.redis.keys(pattern);
      if (keys.length > 0) {
        await this.redis.del(...keys);
      }
    } catch (err: any) {
      logger.warn({ error: err.message, userId }, 'Error invalidating all user sessions');
    }
  }
}

export const identityReadStore = IdentityReadStore.getInstance();

