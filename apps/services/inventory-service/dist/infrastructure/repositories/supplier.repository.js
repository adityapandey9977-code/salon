import { prisma } from '../prisma/client';
export class SupplierRepository {
    async listSuppliers(tenantId, filter) {
        const where = { tenantId };
        if (filter?.status)
            where.status = filter.status;
        if (filter?.branchId) {
            where.branches = {
                some: { branchId: filter.branchId, isActive: true },
            };
        }
        return prisma.supplier.findMany({
            where,
            include: {
                branches: true,
            },
            orderBy: { legalName: 'asc' },
        });
    }
    async findById(tenantId, id) {
        return prisma.supplier.findFirst({
            where: { id, tenantId },
            include: {
                branches: true,
            },
        });
    }
    async findByCode(tenantId, supplierCode) {
        return prisma.supplier.findUnique({
            where: {
                tenantId_supplierCode: {
                    tenantId,
                    supplierCode: supplierCode.toUpperCase().trim(),
                },
            },
        });
    }
    async createSupplier(tenantId, data) {
        return prisma.supplier.create({
            data: {
                tenantId,
                supplierCode: data.supplierCode.toUpperCase().trim(),
                legalName: data.legalName,
                displayName: data.displayName,
                gstin: data.gstin,
                pan: data.pan,
                email: data.email,
                phone: data.phone,
                addressLine1: data.addressLine1,
                addressLine2: data.addressLine2,
                city: data.city,
                state: data.state,
                postalCode: data.postalCode,
                country: data.country || 'India',
                status: 'ACTIVE',
                branches: data.branchIds?.length
                    ? {
                        create: data.branchIds.map((branchId) => ({
                            tenantId,
                            branchId,
                            isPreferred: true,
                            isActive: true,
                        })),
                    }
                    : undefined,
            },
            include: {
                branches: true,
            },
        });
    }
    async updateSupplier(tenantId, id, data) {
        return prisma.supplier.update({
            where: { id },
            data,
            include: {
                branches: true,
            },
        });
    }
}
