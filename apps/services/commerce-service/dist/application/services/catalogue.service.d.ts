import type { CreateServiceCategoryRequest, CreateServiceRecipeRequest, CreateServiceRequest, QueryServicesRequest, SetBranchPriceRequest, UpdateServiceCategoryRequest, UpdateServiceRequest } from '@salon-spa-saas/contracts';
import type { CachedServiceMaster, ServiceCategoryDto } from '../../domain/entities/commerce.dto';
export declare class CatalogueService {
    listCategories(tenantId: string): Promise<ServiceCategoryDto[]>;
    createCategory(tenantId: string, input: CreateServiceCategoryRequest): Promise<ServiceCategoryDto>;
    updateCategory(tenantId: string, id: string, input: UpdateServiceCategoryRequest): Promise<ServiceCategoryDto>;
    deleteCategory(tenantId: string, id: string): Promise<void>;
    getServiceDetail(tenantId: string, serviceId: string): Promise<CachedServiceMaster>;
    getBranchServicePrice(tenantId: string, serviceId: string, branchId: string): Promise<{
        service: CachedServiceMaster;
        effectivePrice: number;
    }>;
    listServices(tenantId: string, query: QueryServicesRequest): Promise<{
        items: CachedServiceMaster[];
        total: number;
        page: number;
        limit: number;
    }>;
    createService(tenantId: string, input: CreateServiceRequest, userId?: string | null, correlationId?: string): Promise<CachedServiceMaster>;
    updateService(tenantId: string, serviceId: string, input: UpdateServiceRequest, userId?: string | null, correlationId?: string): Promise<CachedServiceMaster>;
    deleteService(tenantId: string, serviceId: string, userId?: string | null, correlationId?: string): Promise<void>;
    setBranchPrice(tenantId: string, serviceId: string, input: SetBranchPriceRequest, userId?: string | null, correlationId?: string): Promise<void>;
    setRecipe(tenantId: string, serviceId: string, input: CreateServiceRecipeRequest, userId?: string | null, correlationId?: string): Promise<void>;
    listSkills(tenantId: string): Promise<any[]>;
    seedSkills(tenantId: string): Promise<any[]>;
    createSkill(tenantId: string, input: any): Promise<any>;
    updateSkill(tenantId: string, id: string, input: any): Promise<any>;
    deleteSkill(tenantId: string, id: string): Promise<void>;
}
export declare const catalogueService: CatalogueService;
//# sourceMappingURL=catalogue.service.d.ts.map