import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateRosterRequestSchema, QueryRosterRequestSchema, UpdateRosterRequestSchema, } from '@salon-spa-saas/contracts';
import { rosterService } from '../../application/services/roster.service';
export class RosterController {
    async getRoster(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const query = QueryRosterRequestSchema.parse(req.query);
        const result = await rosterService.queryRoster(tenantId, query);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async createRoster(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CreateRosterRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const result = await rosterService.createRoster(tenantId, body, userId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async updateRoster(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = UpdateRosterRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const result = await rosterService.updateRoster(tenantId, req.params.id, body, userId);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async deleteRoster(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await rosterService.deleteRoster(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const rosterController = new RosterController();
