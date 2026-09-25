import { DOMAIN_EVENTS } from '@salon-spa-saas/events';
import { commerceEventPublisher } from '../../infrastructure/messaging/publisher';
import { walletRepository } from '../../infrastructure/repositories/wallet.repository';
export class WalletService {
    async getBalance(tenantId, customerId) {
        return walletRepository.getBalance(tenantId, customerId);
    }
    async topup(tenantId, input, userId = null, correlationId) {
        const result = await walletRepository.postTransaction({
            tenantId,
            customerId: input.customerId,
            type: 'TOPUP',
            amount: input.amount,
            referenceType: 'TOPUP',
            referenceId: null,
        });
        await commerceEventPublisher.publish({
            eventType: DOMAIN_EVENTS.WALLET_TRANSACTION_POSTED,
            aggregateType: 'Wallet',
            aggregateId: result.wallet.id,
            tenantId,
            userId,
            correlationId,
            payload: {
                tenantId,
                customerId: input.customerId,
                type: 'TOPUP',
                amount: input.amount,
                balanceAfter: result.balanceAfter,
            },
        });
        return result;
    }
}
export const walletService = new WalletService();
