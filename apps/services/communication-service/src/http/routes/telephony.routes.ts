import { Router } from 'express';
import { TelephonyController } from '../controllers/telephony.controller';

const router: Router = Router();

router.get('/agents', TelephonyController.listAgents);
router.get('/calls', TelephonyController.listCalls);
router.get('/calls/:id', TelephonyController.getCallById);
router.post('/calls/:id/disposition', TelephonyController.recordDisposition);
router.get('/customer-context', TelephonyController.getCustomerContext);

export { router as telephonyRoutes };
