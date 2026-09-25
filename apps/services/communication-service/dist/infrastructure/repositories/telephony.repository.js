import { prisma } from '../prisma/client';
export class TelephonyRepository {
    // Agents
    async listAgents(tenantId) {
        return prisma.callCenterAgentProfile.findMany({
            where: { tenantId },
            orderBy: { createdAt: 'asc' },
        });
    }
    async upsertAgent(data) {
        return prisma.callCenterAgentProfile.upsert({
            where: { identityUserId: data.identityUserId },
            create: {
                tenantId: data.tenantId,
                identityUserId: data.identityUserId,
                employeeId: data.employeeId,
                providerAgentId: data.providerAgentId,
                status: data.status || 'AVAILABLE',
            },
            update: {
                employeeId: data.employeeId,
                providerAgentId: data.providerAgentId,
                status: data.status,
            },
        });
    }
    // Call Logs
    async listCallLogs(tenantId, filter) {
        const where = { tenantId };
        if (filter?.agentUserId)
            where.agentIdentityUserId = filter.agentUserId;
        if (filter?.customerId)
            where.customerId = filter.customerId;
        return prisma.telephonyCallLog.findMany({
            where,
            orderBy: { startedAt: 'desc' },
            take: 50,
        });
    }
    async findCallById(tenantId, id) {
        return prisma.telephonyCallLog.findFirst({
            where: { id, tenantId },
        });
    }
    async createCallLog(data) {
        return prisma.telephonyCallLog.create({
            data: {
                tenantId: data.tenantId,
                provider: data.provider || 'TWILIO',
                providerCallId: data.providerCallId,
                direction: data.direction || 'INBOUND',
                fromNumber: data.fromNumber,
                toNumber: data.toNumber,
                customerId: data.customerId,
                leadId: data.leadId,
                appointmentId: data.appointmentId,
                agentIdentityUserId: data.agentIdentityUserId,
                startedAt: data.startedAt || new Date(),
                durationSeconds: data.durationSeconds ?? 0,
                disposition: data.disposition,
                recordingObjectKey: data.recordingObjectKey,
            },
        });
    }
    async updateDisposition(tenantId, id, disposition, notes) {
        return prisma.telephonyCallLog.update({
            where: { id },
            data: {
                disposition,
                endedAt: new Date(),
            },
        });
    }
}
