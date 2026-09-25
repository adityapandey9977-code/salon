import type { CachedServiceMaster, ServiceCategoryDto } from '../../domain/entities/commerce.dto';
import { Prisma } from '../prisma/generated-client';
export declare class ServiceRepository {
    private toDto;
    private toCategoryDto;
    listCategories(tenantId: string): Promise<ServiceCategoryDto[]>;
    createCategory(data: {
        tenantId: string;
        name: string;
        code: string;
        description?: string | null;
        sortOrder?: number;
        imageUrl?: string | null;
        accentColor?: string | null;
        isActive?: boolean;
    }): Promise<ServiceCategoryDto>;
    updateCategory(tenantId: string, id: string, data: {
        name?: string;
        code?: string;
        description?: string | null;
        sortOrder?: number;
        imageUrl?: string | null;
        accentColor?: string | null;
        isActive?: boolean;
    }): Promise<ServiceCategoryDto>;
    deleteCategory(tenantId: string, id: string): Promise<void>;
    findById(tenantId: string, id: string): Promise<CachedServiceMaster | null>;
    findByBranch(tenantId: string, serviceId: string, branchId: string): Promise<{
        service: CachedServiceMaster;
        effectivePrice: number;
    }>;
    list(tenantId: string, filters: {
        categoryId?: string;
        branchId?: string;
        search?: string;
        isActive?: boolean;
        isBookableOnline?: boolean;
        page: number;
        limit: number;
    }): Promise<{
        items: CachedServiceMaster[];
        total: number;
        page: number;
        limit: number;
    }>;
    create(data: {
        tenantId: string;
        categoryId: string;
        code: string;
        name: string;
        description?: string | null;
        durationMinutes: number;
        bufferBeforeMinutes?: number;
        bufferAfterMinutes?: number;
        basePrice: number;
        gstRate?: number;
        taxCode?: string | null;
        sacCode?: string | null;
        requiresConsultation?: boolean;
        requiresPatchTest?: boolean;
        isActive?: boolean;
        isBookableOnline?: boolean;
        imageUrl?: string | null;
        requiredSkill?: string | null;
        requiredLevel?: string | null;
        requiredRoomOrChair?: string | null;
        requiredEquipment?: string | null;
        pricingMode?: string | null;
        discountEligible?: boolean;
        availableBranches?: string[];
        metadata?: any;
    }): Promise<CachedServiceMaster>;
    update(tenantId: string, id: string, data: Prisma.ServiceMasterUpdateInput): Promise<CachedServiceMaster>;
    delete(tenantId: string, id: string): Promise<void>;
    setBranchPrice(data: {
        tenantId: string;
        serviceId: string;
        branchId: string;
        price: number;
        effectiveFrom?: Date | null;
        effectiveTo?: Date | null;
        isActive?: boolean;
    }): Promise<void>;
    setRecipe(data: {
        tenantId: string;
        serviceId: string;
        name?: string;
        description?: string | null;
        version?: number;
        items: Array<{
            skuId: string;
            quantityRequired: number;
            unit?: string;
        }>;
    }): Promise<void>;
    private isSkillsTableReady;
    ensureSkillsTable(): Promise<void>;
    listSkills(tenantId: string): Promise<any[]>;
    seedStandardSkills(tenantId: string): Promise<any[]>;
    createSkill(tenantId: string, data: {
        code: string;
        name: string;
        categoryId?: string | null;
        categoryName?: string | null;
        description?: string | null;
        status?: string;
    }): Promise<any>;
    updateSkill(tenantId: string, id: string, data: {
        code?: string;
        name?: string;
        categoryId?: string | null;
        categoryName?: string | null;
        description?: string | null;
        status?: string;
    }): Promise<any>;
    deleteSkill(tenantId: string, id: string): Promise<void>;
}
export declare const serviceRepository: ServiceRepository;
//# sourceMappingURL=service.repository.d.ts.map