import { Router } from 'express';
import { RoyaltyController } from '../controllers/royalty.controller';
const router = Router();
router.post('/', RoyaltyController.createRoyaltyRule);
router.get('/partner', RoyaltyController.getPartnerRoyalties);
router.get('/settlements', RoyaltyController.listSettlements);
router.post('/settlements', RoyaltyController.generateSettlement);
router.post('/:id/pay', RoyaltyController.paySettlement);
export { router as royaltyRoutes };
