import type { CreateCustomerNoteRequest } from '@salon-spa-saas/contracts';
import type { CustomerNoteDto } from '../../domain/entities/customer.dto';
export declare class NoteService {
    getNotes(tenantId: string, customerId: string): Promise<CustomerNoteDto[]>;
    addNote(tenantId: string, customerId: string, input: CreateCustomerNoteRequest, principalType?: string, userId?: string | null): Promise<CustomerNoteDto>;
}
export declare const noteService: NoteService;
//# sourceMappingURL=note.service.d.ts.map