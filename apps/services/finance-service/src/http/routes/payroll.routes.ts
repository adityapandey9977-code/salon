import { Router } from 'express';
import { PayrollController } from '../controllers/payroll.controller';

const router: Router = Router();

router.get('/run', PayrollController.listRuns);
router.post('/execute', PayrollController.executePayroll);
router.post('/:id/approve', PayrollController.approvePayroll);
router.post('/export-bank', PayrollController.exportBank);

export { router as payrollRoutes };
