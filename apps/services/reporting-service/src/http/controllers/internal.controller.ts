import type { Request, Response, NextFunction } from 'express';
import { ReportingConsumerService, type DomainEventEnvelope } from '../../application/services/reporting-consumer.service';

export class InternalController {
  public static async processEvent(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const event = req.body as DomainEventEnvelope;
      await ReportingConsumerService.processEvent(event);
      res.json({ success: true, message: 'Event processed and projections updated successfully' });
    } catch (err) {
      next(err);
    }
  }
}
