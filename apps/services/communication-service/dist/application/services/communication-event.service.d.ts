import { NotificationService } from './notification.service';
import { CommunicationReadStore } from '../../infrastructure/redis/communication-read.store';
export declare class CommunicationEventService {
    private notifService;
    private cache;
    constructor(notifService?: NotificationService, cache?: CommunicationReadStore);
    handleAppointmentCreated(event: {
        eventId: string;
        tenantId: string;
        payload: {
            appointmentId: string;
            customerPhone?: string;
            customerEmail?: string;
            clientName?: string;
            serviceName?: string;
            startTime?: string;
        };
    }): Promise<void>;
    handlePaymentCompleted(event: {
        eventId: string;
        tenantId: string;
        payload: {
            paymentId: string;
            customerPhone?: string;
            amount: number;
            invoiceId: string;
        };
    }): Promise<void>;
    handleStockLow(event: {
        eventId: string;
        tenantId: string;
        branchId?: string;
        payload: {
            skuId: string;
            skuCode: string;
            quantityOnHand: number;
            reorderLevel: number;
        };
    }): Promise<void>;
}
//# sourceMappingURL=communication-event.service.d.ts.map