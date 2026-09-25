import type { Request, Response } from 'express';
export declare class SegmentController {
    listSegments(req: Request, res: Response): Promise<void>;
    getSegmentById(req: Request, res: Response): Promise<void>;
    createSegment(req: Request, res: Response): Promise<void>;
    addMember(req: Request, res: Response): Promise<void>;
    removeMember(req: Request, res: Response): Promise<void>;
}
export declare const segmentController: SegmentController;
//# sourceMappingURL=segment.controller.d.ts.map