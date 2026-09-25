import { noteRepository } from '../../infrastructure/repositories/note.repository';
export class NoteService {
    async getNotes(tenantId, customerId) {
        return noteRepository.findByCustomerId(tenantId, customerId);
    }
    async addNote(tenantId, customerId, input, principalType = 'USER', userId = null) {
        return noteRepository.create({
            tenantId,
            customerId,
            noteType: input.noteType,
            content: input.content,
            isPinned: input.isPinned,
            createdByPrincipalType: principalType,
            createdByUserId: userId,
        });
    }
}
export const noteService = new NoteService();
