import { ConflictError } from '@salon-spa-saas/common-types';
import { prisma } from '../prisma/client';
import { Prisma } from '../prisma/generated-client';
export class WalletRepository {
    async getOrCreateWallet(tenantId, customerId) {
        return prisma.customerWallet.upsert({
            where: { customerId },
            update: {},
            create: {
                tenantId,
                customerId,
                currentBalance: new Prisma.Decimal(0.0),
            },
        });
    }
    async getBalance(tenantId, customerId) {
        const wallet = await prisma.customerWallet.findFirst({
            where: { tenantId, customerId },
        });
        return wallet ? Number(wallet.currentBalance) : 0;
    }
    async postTransaction(data) {
        return prisma.$transaction(async (tx) => {
            const wallet = await tx.customerWallet.upsert({
                where: { customerId: data.customerId },
                update: {},
                create: {
                    tenantId: data.tenantId,
                    customerId: data.customerId,
                    currentBalance: new Prisma.Decimal(0.0),
                },
            });
            const current = Number(wallet.currentBalance);
            let newBalance = current;
            if (data.type === 'CREDIT' || data.type === 'TOPUP' || data.type === 'REFUND') {
                newBalance += data.amount;
            }
            else if (data.type === 'DEBIT') {
                if (current < data.amount) {
                    throw new ConflictError('Insufficient wallet balance');
                }
                newBalance -= data.amount;
            }
            else if (data.type === 'ADJUSTMENT') {
                newBalance = data.amount; // Direct absolute adjustment
            }
            const txRecord = await tx.walletTransaction.create({
                data: {
                    tenantId: data.tenantId,
                    walletId: wallet.id,
                    type: data.type,
                    amount: new Prisma.Decimal(data.amount),
                    balanceAfter: new Prisma.Decimal(newBalance),
                    referenceType: data.referenceType,
                    referenceId: data.referenceId,
                },
            });
            await tx.customerWallet.update({
                where: { id: wallet.id },
                data: { currentBalance: new Prisma.Decimal(newBalance) },
            });
            return { wallet, transaction: txRecord, balanceAfter: newBalance };
        });
    }
}
export const walletRepository = new WalletRepository();
