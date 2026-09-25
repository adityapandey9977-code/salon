import type { Request, Response } from 'express';
export declare class WalletController {
    getBalance(req: Request, res: Response): Promise<void>;
    topup(req: Request, res: Response): Promise<void>;
}
export declare const walletController: WalletController;
//# sourceMappingURL=wallet.controller.d.ts.map