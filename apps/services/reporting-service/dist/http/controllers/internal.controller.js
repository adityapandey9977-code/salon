import { ReportingConsumerService } from '../../application/services/reporting-consumer.service';
export class InternalController {
    static async processEvent(req, res, next) {
        try {
            const event = req.body;
            await ReportingConsumerService.processEvent(event);
            res.json({ success: true, message: 'Event processed and projections updated successfully' });
        }
        catch (err) {
            next(err);
        }
    }
}
