import type { CustomerNoteDto } from '../../domain/entities/customer.dto';
export declare class NoteRepository {
    private toDto;
    findByCustomerId(tenantId: string, customerId: string): Promise<CustomerNoteDto[]>;
    create(data: {
        tenantId: string;
        customerId: string;
        noteType: string;
        content: string;
        isPinned?: boolean;
        createdByPrincipalType?: string;
        createdByUserId?: string | null;
    }): Promise<CustomerNoteDto>;
}
export declare const noteRepository: NoteRepository;
//# sourceMappingURL=note.repository.d.ts.map