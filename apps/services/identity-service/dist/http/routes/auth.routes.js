import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { authController } from '../controllers/auth.controller';
const router = Router();
// Public routes
router.post('/login', (req, res, next) => authController.login(req, res, next));
router.post('/refresh-token', (req, res, next) => authController.refreshToken(req, res, next));
router.post('/forgot-password', (req, res, next) => authController.forgotPassword(req, res, next));
router.post('/reset-password', (req, res, next) => authController.resetPassword(req, res, next));
router.post('/change-password', (req, res, next) => authController.changePassword(req, res, next));
router.post('/mfa/verify', (req, res, next) => authController.verifyMfa(req, res, next));
// Authenticated routes
router.get('/me', authMiddleware, (req, res, next) => authController.getMe(req, res, next));
router.post('/logout', authMiddleware, (req, res, next) => authController.logout(req, res, next));
router.get('/sessions', authMiddleware, (req, res, next) => authController.getSessions(req, res, next));
router.delete('/sessions/:id', authMiddleware, (req, res, next) => authController.revokeSession(req, res, next));
export { router as authRoutes };
