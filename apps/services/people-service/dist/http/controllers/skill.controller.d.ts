import type { Request, Response } from 'express';
export declare class SkillController {
    getStaffSkills(req: Request, res: Response): Promise<void>;
    addSkill(req: Request, res: Response): Promise<void>;
    updateSkill(req: Request, res: Response): Promise<void>;
    removeSkill(req: Request, res: Response): Promise<void>;
}
export declare const skillController: SkillController;
//# sourceMappingURL=skill.controller.d.ts.map