import { Router } from 'express';
import { ComplianceController } from '../controllers/compliance.controller';
const router = Router();
router.get('/requirements', ComplianceController.listRequirements);
router.post('/requirements', ComplianceController.createRequirement);
router.delete('/requirements/:id', ComplianceController.deleteRequirement);
export const complianceRouter = router;
export default router;
