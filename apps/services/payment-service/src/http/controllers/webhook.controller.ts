import type { NextFunction, Request, Response } from 'express';
import { webhookService } from '../../application/services/webhook.service';

export class WebhookController {
  public static async handleRazorpay(
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const signature = req.headers['x-razorpay-signature'] as string;
      const result = await webhookService.handleWebhook('RAZORPAY', JSON.stringify(req.body), signature);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async handleStripe(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = req.headers['stripe-signature'] as string;
      const result = await webhookService.handleWebhook('STRIPE', JSON.stringify(req.body), signature);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }

  public static async handleMock(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const signature = (req.headers['x-mock-signature'] as string) || 'valid_signature';
      const result = await webhookService.handleWebhook('MOCK', JSON.stringify(req.body), signature);
      res.status(200).json({ success: true, data: result });
    } catch (err) {
      next(err);
    }
  }
}
