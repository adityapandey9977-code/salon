import { prisma } from '../prisma/client';
export class NoteRepository {
    toDto(item) {
        return {
            id: item.id,
            tenantId: item.tenantId,
            customerId: item.customerId,
            noteType: item.noteType,
            content: item.content,
            isPinned: item.isPinned,
            createdByPrincipalType: item.createdByPrincipalType,
            createdByUserId: item.createdByUserId,
            createdAt: item.createdAt.toISOString(),
        };
    }
    async findByCustomerId(tenantId, customerId) {
        const records = await prisma.customerNote.findMany({
            where: { tenantId, customerId },
            orderBy: [{ isPinned: 'desc' }, { createdAt: 'desc' }],
        });
        return records.map((r) => this.toDto(r));
    }
    async create(data) {
        const record = await prisma.customerNote.create({
            data: {
                tenantId: data.tenantId,
                customerId: data.customerId,
                noteType: data.noteType,
                content: data.content,
                isPinned: data.isPinned || false,
                createdByPrincipalType: data.createdByPrincipalType || 'USER',
                createdByUserId: data.createdByUserId,
            },
        });
        return this.toDto(record);
    }
}
export const noteRepository = new NoteRepository();
