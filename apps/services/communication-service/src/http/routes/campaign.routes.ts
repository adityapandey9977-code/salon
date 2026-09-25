import { Router } from 'express';
import { CampaignController } from '../controllers/campaign.controller';

const router: Router = Router();

router.get('/campaigns', CampaignController.listCampaigns);
router.post('/campaigns', CampaignController.createCampaign);
router.post('/winback-offer', CampaignController.sendWinbackOffer);

export { router as campaignRoutes };
