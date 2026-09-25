export declare class SupplierRepository {
    listSuppliers(tenantId: string, filter?: {
        status?: string;
        branchId?: string;
    }): Promise<({
        branches: {
            tenantId: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            branchId: string;
            supplierId: string;
            isPreferred: boolean;
        }[];
    } & {
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierCode: string;
        legalName: string;
        displayName: string | null;
        gstin: string | null;
        pan: string | null;
        email: string | null;
        phone: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
    })[]>;
    findById(tenantId: string, id: string): Promise<({
        branches: {
            tenantId: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            branchId: string;
            supplierId: string;
            isPreferred: boolean;
        }[];
    } & {
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierCode: string;
        legalName: string;
        displayName: string | null;
        gstin: string | null;
        pan: string | null;
        email: string | null;
        phone: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
    }) | null>;
    findByCode(tenantId: string, supplierCode: string): Promise<{
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierCode: string;
        legalName: string;
        displayName: string | null;
        gstin: string | null;
        pan: string | null;
        email: string | null;
        phone: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
    } | null>;
    createSupplier(tenantId: string, data: {
        supplierCode: string;
        legalName: string;
        displayName?: string;
        gstin?: string;
        pan?: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        addressLine2?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        country?: string;
        branchIds?: string[];
    }): Promise<{
        branches: {
            tenantId: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            branchId: string;
            supplierId: string;
            isPreferred: boolean;
        }[];
    } & {
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierCode: string;
        legalName: string;
        displayName: string | null;
        gstin: string | null;
        pan: string | null;
        email: string | null;
        phone: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
    }>;
    updateSupplier(tenantId: string, id: string, data: {
        legalName?: string;
        displayName?: string;
        gstin?: string;
        pan?: string;
        email?: string;
        phone?: string;
        addressLine1?: string;
        city?: string;
        state?: string;
        postalCode?: string;
        status?: string;
    }): Promise<{
        branches: {
            tenantId: string;
            id: string;
            isActive: boolean;
            createdAt: Date;
            branchId: string;
            supplierId: string;
            isPreferred: boolean;
        }[];
    } & {
        tenantId: string;
        status: string;
        id: string;
        createdAt: Date;
        updatedAt: Date;
        supplierCode: string;
        legalName: string;
        displayName: string | null;
        gstin: string | null;
        pan: string | null;
        email: string | null;
        phone: string | null;
        addressLine1: string | null;
        addressLine2: string | null;
        city: string | null;
        state: string | null;
        postalCode: string | null;
        country: string | null;
    }>;
}
//# sourceMappingURL=supplier.repository.d.ts.map