import { Router } from 'express';
import { BranchController } from '../controllers/branch.controller';

const router: Router = Router();

// Franchise partners
router.get('/franchises', BranchController.getFranchises);
router.post('/franchises', BranchController.createFranchise);
router.get('/franchises/:franchiseId/branches', BranchController.getFranchiseBranches);

// Global / tenant holidays
router.get('/holidays', BranchController.getHolidays);

// Branch Resources
router.get('/resources', BranchController.listResources);
router.post('/resources', BranchController.createResource);
router.patch('/resources/:resourceId', BranchController.updateResource);
router.delete('/resources/:resourceId', BranchController.deleteResource);

// Branches
router.get('/', BranchController.listBranches);
router.post('/', BranchController.createBranch);
router.get('/:branchId', BranchController.getBranchById);
router.patch('/:branchId', BranchController.updateBranch);
router.delete('/:branchId', BranchController.deleteBranch);

// Branch-specific operating hours
router.get('/:branchId/operating-hours', BranchController.getOperatingHours);
router.put('/:branchId/operating-hours', BranchController.updateOperatingHours);

// Branch-specific holidays
router.get('/:branchId/holidays', BranchController.getHolidays);
router.post('/:branchId/holidays', BranchController.createHoliday);
router.delete('/:branchId/holidays/:holidayId', BranchController.deleteHoliday);

export const branchRouter: Router = router;

