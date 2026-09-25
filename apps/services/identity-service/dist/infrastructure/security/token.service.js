import { createHash, randomBytes, randomUUID } from 'node:crypto';
import jwt from 'jsonwebtoken';
import { config } from '../../config';
export class TokenService {
    static createAccessToken(firstArg, sessionId, userType) {
        let payload;
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
        }
        else {
            payload = {
                sub: firstArg,
                sid: sessionId,
                principalType: 'USER',
                role: firstArg.role || 'USER',
                scopeType: 'PLATFORM',
                userType: userType || 'TENANT',
                jti: randomUUID(),
            };
        }
        return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: config.JWT_ACCESS_TTL,
        });
    }
    static createTenantAccessToken(params) {
        const payload = {
            sub: params.tenantCredentialId,
            sid: params.sessionId,
            principalType: 'TENANT',
            tenantId: params.tenantId,
            role: 'TENANT_ADMIN',
            scopeType: 'TENANT',
            jti: randomUUID(),
        };
        return jwt.sign(payload, config.JWT_ACCESS_SECRET, {
            expiresIn: config.JWT_ACCESS_TTL,
        });
    }
    static createUserAccessToken(params) {
        const payload = {
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
            expiresIn: config.JWT_ACCESS_TTL,
        });
    }
    static verifyAccessToken(token) {
        return jwt.verify(token, config.JWT_ACCESS_SECRET);
    }
    static hashToken(rawToken) {
        return createHash('sha256').update(rawToken).digest('hex');
    }
    static generateRefreshToken(ttlDays = 7) {
        const rawToken = randomBytes(40).toString('hex');
        const tokenHash = TokenService.hashToken(rawToken);
        const expiresAt = new Date(Date.now() + ttlDays * 24 * 60 * 60 * 1000);
        return { rawToken, tokenHash, expiresAt };
    }
    static generateResetToken() {
        const rawToken = randomBytes(32).toString('hex');
        const tokenHash = TokenService.hashToken(rawToken);
        return { rawToken, tokenHash };
    }
    static generateMfaChallengeId() {
        return randomUUID();
    }
}
