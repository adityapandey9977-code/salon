import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { superAdminAuthController } from '../controllers/super-admin-auth.controller';
const router = Router();
// Public Super Admin Auth Routes
router.post('/login', (req, res, next) => superAdminAuthController.login(req, res, next));
router.post('/refresh-token', (req, res, next) => superAdminAuthController.refreshToken(req, res, next));
// Authenticated Super Admin Routes
router.get('/me', authMiddleware, (req, res, next) => superAdminAuthController.getMe(req, res, next));
router.post('/logout', authMiddleware, (req, res, next) => superAdminAuthController.logout(req, res, next));
export { router as superAdminAuthRoutes };
