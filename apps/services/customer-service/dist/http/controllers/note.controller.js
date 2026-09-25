import { UnauthorizedError } from '@salon-spa-saas/common-types';
import { CreateCustomerNoteRequestSchema } from '@salon-spa-saas/contracts';
import { noteService } from '../../application/services/note.service';
export class NoteController {
    async getNotes(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const result = await noteService.getNotes(tenantId, req.params.id);
        res.json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
    async addNote(req, res) {
        const tenantId = req.auth?.tenantId || req.headers['x-tenant-id'];
        if (!tenantId)
            throw new UnauthorizedError('Tenant context required');
        const body = CreateCustomerNoteRequestSchema.parse(req.body);
        const userId = req.auth?.userId || null;
        const principalType = req.auth?.principalType || 'USER';
        const result = await noteService.addNote(tenantId, req.params.id, body, principalType, userId);
        res.status(201).json({
            success: true,
            data: result,
            meta: { correlationId: req.headers['x-correlation-id'] },
        });
    }
}
export const noteController = new NoteController();
