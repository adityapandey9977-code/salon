import { TelephonyRepository } from '../../infrastructure/repositories/telephony.repository';
import { NotificationService } from './notification.service';
import { CallDisposition } from '../../infrastructure/prisma/generated-client';
export declare class TelephonyService {
    private telephonyRepo;
    private notifService;
    constructor(telephonyRepo?: TelephonyRepository, notifService?: NotificationService);
    listAgents(tenantId: string): Promise<{
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        identityUserId: string;
        employeeId: string | null;
        providerAgentId: string | null;
    }[]>;
    listCalls(tenantId: string, filter?: any): Promise<{
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        provider: string;
        customerId: string | null;
        providerCallId: string | null;
        direction: string;
        fromNumber: string;
        toNumber: string;
        leadId: string | null;
        appointmentId: string | null;
        agentIdentityUserId: string | null;
        startedAt: Date;
        answeredAt: Date | null;
        endedAt: Date | null;
        durationSeconds: number | null;
        disposition: import("../../infrastructure/prisma/generated-client").$Enums.CallDisposition | null;
        recordingObjectKey: string | null;
    }[]>;
    getCallById(tenantId: string, id: string): Promise<{
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        provider: string;
        customerId: string | null;
        providerCallId: string | null;
        direction: string;
        fromNumber: string;
        toNumber: string;
        leadId: string | null;
        appointmentId: string | null;
        agentIdentityUserId: string | null;
        startedAt: Date;
        answeredAt: Date | null;
        endedAt: Date | null;
        durationSeconds: number | null;
        disposition: import("../../infrastructure/prisma/generated-client").$Enums.CallDisposition | null;
        recordingObjectKey: string | null;
    }>;
    recordInboundCall(data: {
        tenantId: string;
        fromNumber: string;
        toNumber: string;
        agentIdentityUserId?: string;
    }): Promise<{
        callId: string;
        fromNumber: string;
        customerId: string | undefined;
        customerName: string;
        status: string;
    }>;
    recordDisposition(tenantId: string, callId: string, data: {
        disposition: CallDisposition;
        notes?: string;
        sendFollowupSms?: boolean;
        appointmentId?: string;
    }): Promise<{
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        provider: string;
        customerId: string | null;
        providerCallId: string | null;
        direction: string;
        fromNumber: string;
        toNumber: string;
        leadId: string | null;
        appointmentId: string | null;
        agentIdentityUserId: string | null;
        startedAt: Date;
        answeredAt: Date | null;
        endedAt: Date | null;
        durationSeconds: number | null;
        disposition: import("../../infrastructure/prisma/generated-client").$Enums.CallDisposition | null;
        recordingObjectKey: string | null;
    }>;
    getCustomerContext(tenantId: string, phone: string): Promise<{
        phone: string;
        tenantId: string;
        customerProfile: {
            phone: string;
            membershipTier: string;
            lifetimeVisits: number;
            preferredStylist: string;
            lastService: string;
        };
        upcomingAppointments: never[];
        recentCallHistory: {
            tenantId: string;
            status: string;
            id: string;
            createdAt: Date;
            provider: string;
            customerId: string | null;
            providerCallId: string | null;
            direction: string;
            fromNumber: string;
            toNumber: string;
            leadId: string | null;
            appointmentId: string | null;
            agentIdentityUserId: string | null;
            startedAt: Date;
            answeredAt: Date | null;
            endedAt: Date | null;
            durationSeconds: number | null;
            disposition: import("../../infrastructure/prisma/generated-client").$Enums.CallDisposition | null;
            recordingObjectKey: string | null;
        }[];
    }>;
}
//# sourceMappingURL=telephony.service.d.ts.map