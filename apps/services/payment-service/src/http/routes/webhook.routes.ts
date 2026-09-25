import { Router } from 'express';
import { WebhookController } from '../controllers/webhook.controller';

const router: Router = Router();

router.post('/razorpay', WebhookController.handleRazorpay);
router.post('/stripe', WebhookController.handleStripe);
router.post('/mock', WebhookController.handleMock);

export const webhookRouter: Router = router;
