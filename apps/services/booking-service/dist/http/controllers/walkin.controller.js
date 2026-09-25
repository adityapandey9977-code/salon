import { bookingService } from '../../application/services/booking.service';
export class WalkinController {
    static async list(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const branchId = req.query.branchId;
            const walkins = await bookingService.getWalkins(tenantId, branchId);
            res.status(200).json({ success: true, data: walkins });
        }
        catch (err) {
            next(err);
        }
    }
    static async create(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const { branchId, customerId, items, notes } = req.body;
            const walkin = await bookingService.createWalkin(tenantId, { branchId, customerId, items, notes }, {
                principalType: req.principal.principalType,
                userId: req.principal.userId,
            });
            res.status(201).json({ success: true, data: walkin });
        }
        catch (err) {
            next(err);
        }
    }
    static async seat(req, res, next) {
        try {
            const tenantId = req.principal.tenantId;
            const id = req.params.id;
            const { staffId } = req.body;
            const seated = await bookingService.seatWalkin(tenantId, id, staffId, {
                principalType: req.principal.principalType,
                userId: req.principal.userId,
            });
            res.status(200).json({ success: true, data: seated });
        }
        catch (err) {
            next(err);
        }
    }
}
