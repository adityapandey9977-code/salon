import { createHash, randomBytes, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
import type { AuthPrincipalType, UserType } from '../../infrastructure/prisma/generated-client';

export interface JwtPayload {
  sub: string;
  sid: string;
  principalType: AuthPrincipalType;
  role: string;
  roles?: string[];
  permissions?: string[];
  scopeType: string;
  tenantId?: string | null;
  userType?: UserType;
  jti: string;
  iat?: number;
  exp?: number;
}

export class TokenService {
  public static createAccessToken(payloadOptions: {
    sub: string;
    sid: string;
    principalType: AuthPrincipalType;
    role: string;
    scopeType: string;
    tenantId?: string | null;
    userType?: UserType;
  }): string;
  public static createAccessToken(userId: string, sessionId: string, userType: UserType): string;
  public static createAccessToken(
    firstArg: any,
    sessionId?: string,
    userType?: UserType,
  ): string {
    let payload: JwtPayload;

    if (typeof firstArg === 'object') {
      payload = {
        sub: firstArg.sub,
        sid: firstArg.sid,
        principalType: firstArg.principalType,
        role: firstArg.role,
        scopeType: firstArg.scopeType,
        tenantId: firstArg.tenantId || null,
        userType: firstArg.userType,
        jti: randomUUID(),
      };
    } else {
      payload = {
        sub: firstArg,
        sid: sessionId!,
        principalType: 'USER',
        role: firstArg.role || 'USER',
        scopeType: 'PLATFORM',
        userType: userType || 'TENANT',
        jti: randomUUID(),
      };
    }

    return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_TTL as any,
    });
  }

  public static createTenantAccessToken(params: {
    tenantCredentialId: string;
    sessionId: string;
    tenantId: string;
  }): string {
    const payload: JwtPayload = {
      sub: params.tenantCredentialId,
      sid: params.sessionId,
      principalType: 'TENANT',
      tenantId: params.tenantId,
      role: 'TENANT_ADMIN',
      scopeType: 'TENANT',
      jti: randomUUID(),
    };

    return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_TTL as any,
    });
  }

  public static createUserAccessToken(params: {
    userId: string;
    sessionId: string;
    role: string;
    roles?: string[];
    permissions?: string[];
    scopeType: string;
    tenantId?: string | null;
    userType?: UserType;
  }): string {
    const payload: JwtPayload = {
      sub: params.userId,
      sid: params.sessionId,
      principalType: 'USER',
      role: params.role,
      roles: params.roles || [params.role],
      permissions: params.permissions || [],
      scopeType: params.scopeType,
      tenantId: params.tenantId || null,
      userType: params.userType,
      jti: randomUUID(),
    };

    return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_TTL as any,
    });
  }

  public static verifyAccessToken(token: string): JwtPayload {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as JwtPayload;
  }

  public static hashToken(rawToken: string): string {
    return createHash('sha256').update(rawToken).digest('hex');
  }

  public static generateRefreshToken(ttlDays = 7): {
    rawToken: string;
    tokenHash: string;
    expiresAt: Date;
  } {
    const rawToken = randomBytes(40).toString('hex');
    const tokenHash = TokenService.hashToken(rawToken);
    const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);

    return { rawToken, tokenHash, expiresAt };
  }

  public static generateResetToken(): { rawToken: string; tokenHash: string } {
    const rawToken = randomBytes(32).toString('hex');
    const tokenHash = TokenService.hashToken(rawToken);
    return { rawToken, tokenHash };
  }

  public static generateMfaChallengeId(): string {
    return randomUUID();
  }
}

