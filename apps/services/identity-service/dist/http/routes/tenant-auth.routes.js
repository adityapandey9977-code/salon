import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { tenantAuthController } from '../controllers/tenant-auth.controller';
const router = Router();
// Public Tenant Auth Routes
router.post('/login', (req, res, next) => tenantAuthController.login(req, res, next));
router.post('/refresh-token', (req, res, next) => tenantAuthController.refreshToken(req, res, next));
router.post('/forgot-password', (req, res, next) => tenantAuthController.forgotPassword(req, res, next));
router.post('/reset-password', (req, res, next) => tenantAuthController.resetPassword(req, res, next));
// Authenticated Tenant Routes
router.get('/me', authMiddleware, (req, res, next) => tenantAuthController.getMe(req, res, next));
router.post('/logout', authMiddleware, (req, res, next) => tenantAuthController.logout(req, res, next));
router.get('/sessions', authMiddleware, (req, res, next) => tenantAuthController.getSessions(req, res, next));
export { router as tenantAuthRoutes };
