import {
  RefreshTokenRequestSchema,
  TenantForgotPasswordRequestSchema,
  TenantLoginRequestSchema,
  TenantResetPasswordRequestSchema,
} from '@salon-spa-saas/contracts';
import type { NextFunction, Request, Response } from 'express';
import { tenantAuthService } from '../../application/services/tenant-auth.service';
import { sessionRepository } from '../../infrastructure/repositories/session.repository';

export class TenantAuthController {
  public async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = TenantLoginRequestSchema.parse(req.body);
      const result = await tenantAuthService.login({
        email: body.email.toLowerCase().trim(),
        password: body.password.trim(),
        tenantCode: body.tenantCode ? body.tenantCode.trim() : undefined,
        ipAddress: req.ip || (req.headers['x-forwarded-for'] as string),
        userAgent: req.headers['user-agent'],
      });

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async refreshToken(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = RefreshTokenRequestSchema.parse(req.body);
      const result = await tenantAuthService.refreshToken(body.refreshToken);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async logout(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      if (req.user?.tenantCredentialId) {
        await tenantAuthService.logout(req.user.tenantCredentialId, req.user.sessionId);
      }

      res.status(200).json({
        success: true,
        data: { message: 'Logged out successfully' },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async getMe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const tenantId = req.user?.tenantId || (req.headers['x-tenant-id'] as string);
      const tenantCredentialId = req.user?.tenantCredentialId || null;

      if (!tenantId) {
        res.status(400).json({
          success: false,
          error: { code: 'VALIDATION_ERROR', message: 'Tenant ID is required' },
          timestamp: new Date().toISOString(),
        });
        return;
      }

      const result = await tenantAuthService.getMe(tenantId, tenantCredentialId);

      res.status(200).json({
        success: true,
        data: {
          principal: {
            type: 'TENANT',
            tenantId: result.profile.tenantId,
            credentialId: result.profile.credentialId,
            loginEmail: result.profile.loginEmail,
            salonName: result.profile.salonName,
            tenantCode: result.profile.tenantCode,
            status: result.profile.status,
            role: result.effectiveAccess.role,
            scopeType: result.effectiveAccess.scopeType,
            permissions: result.effectiveAccess.permissions,
          },
          profile: result.profile,
          effectiveAccess: result.effectiveAccess,
        },
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async forgotPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = TenantForgotPasswordRequestSchema.parse(req.body);
      const result = await tenantAuthService.forgotPassword(body.email);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async resetPassword(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const body = TenantResetPasswordRequestSchema.parse(req.body);
      const result = await tenantAuthService.resetPassword(body.token, body.newPassword);

      res.status(200).json({
        success: true,
        data: result,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }

  public async getSessions(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const credentialId = req.user?.tenantCredentialId;
      if (!credentialId) {
        res.status(401).json({ success: false, message: 'Unauthorized' });
        return;
      }
      const sessions = await sessionRepository.listTenantSessions(credentialId);

      res.status(200).json({
        success: true,
        data: sessions,
        timestamp: new Date().toISOString(),
      });
    } catch (err) {
      next(err);
    }
  }
}

export const tenantAuthController = new TenantAuthController();
