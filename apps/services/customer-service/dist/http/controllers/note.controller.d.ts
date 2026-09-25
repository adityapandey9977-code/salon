import type { Request, Response } from 'express';
export declare class NoteController {
    getNotes(req: Request, res: Response): Promise<void>;
    addNote(req: Request, res: Response): Promise<void>;
}
export declare const noteController: NoteController;
//# sourceMappingURL=note.controller.d.ts.map