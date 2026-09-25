import { Router } from 'express';
import { authMiddleware } from '../../middleware/auth.middleware';
import { requirePermission } from '../../middleware/permission.middleware';
import { cautionController } from '../controllers/caution.controller';
import { customerController } from '../controllers/customer.controller';
import { noteController } from '../controllers/note.controller';
const router = Router();
router.use(authMiddleware);
// Dormant customers
router.get('/dormant', requirePermission('customer.read'), customerController.getDormant.bind(customerController));
// Customer Profile
router.get('/profile', customerController.getCustomerById.bind(customerController));
router.patch('/profile', customerController.updateCustomer.bind(customerController));
// Customer CRUD
router.get('/', requirePermission('customer.read'), customerController.listCustomers.bind(customerController));
router.post('/', requirePermission('customer.create'), customerController.createCustomer.bind(customerController));
router.get('/:id', requirePermission('customer.read'), customerController.getCustomerById.bind(customerController));
router.patch('/:id', requirePermission('customer.update'), customerController.updateCustomer.bind(customerController));
router.post('/:id/record-visit', requirePermission('customer.update'), customerController.recordVisit.bind(customerController));
router.delete('/:id', requirePermission('customer.delete'), customerController.deleteCustomer.bind(customerController));
// Notes
router.get('/:id/notes', requirePermission('customer.note.read'), noteController.getNotes.bind(noteController));
router.post('/:id/notes', requirePermission('customer.note.create'), noteController.addNote.bind(noteController));
// Cautions
router.get('/:id/cautions', requirePermission('customer.caution.read'), cautionController.getCautions.bind(cautionController));
router.post('/:id/cautions', requirePermission('customer.caution.manage'), cautionController.addCaution.bind(cautionController));
router.patch('/:id/cautions/:cautionId', requirePermission('customer.caution.manage'), cautionController.updateCaution.bind(cautionController));
export const customerRoutes = router;
