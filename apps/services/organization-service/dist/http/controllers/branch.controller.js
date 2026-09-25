import { createSuccessResponse } from '@salon-spa-saas/common-types';
import { CreateBranchRequestSchema, CreateResourceRequestSchema, UpdateResourceRequestSchema, } from '@salon-spa-saas/contracts';
import { OrganizationService } from '../../application/services/organization.service';
const orgService = new OrganizationService();
export class BranchController {
    static async listBranches(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || null;
            const franchiseId = req.headers['x-franchise-id'] || req.query.franchiseId || null;
            const branches = await orgService.getBranches(tenantId, franchiseId);
            res.status(200).json(createSuccessResponse(branches));
        }
        catch (err) {
            next(err);
        }
    }
    static async getFranchiseBranches(req, res, next) {
        try {
            const { franchiseId } = req.params;
            const branches = await orgService.getBranches(null, franchiseId);
            res.status(200).json(createSuccessResponse(branches));
        }
        catch (err) {
            next(err);
        }
    }
    static async getBranchById(req, res, next) {
        try {
            const { branchId } = req.params;
            const branch = await orgService.getBranchById(branchId);
            res.status(200).json(createSuccessResponse(branch));
        }
        catch (err) {
            next(err);
        }
    }
    static async createBranch(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] ||
                req.body?.tenantId ||
                req.query?.tenantId ||
                '';
            const body = CreateBranchRequestSchema.parse(req.body);
            const branch = await orgService.createBranch(tenantId, {
                ...body,
                franchiseId: req.body?.franchiseId || req.body?.franchisePartnerId,
                franchisePartnerId: req.body?.franchisePartnerId || req.body?.franchiseId,
                franchisePartnerName: req.body?.franchisePartnerName,
            });
            res.status(201).json(createSuccessResponse(branch, 'Branch created successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async updateBranch(req, res, next) {
        try {
            const { branchId } = req.params;
            const branch = await orgService.updateBranch(branchId, req.body);
            res.status(200).json(createSuccessResponse(branch, 'Branch updated successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteBranch(req, res, next) {
        try {
            const { branchId } = req.params;
            await orgService.deleteBranch(branchId);
            res.status(200).json(createSuccessResponse({ success: true }, 'Branch deleted successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async getOperatingHours(req, res, next) {
        try {
            const { branchId } = req.params;
            const hours = await orgService.getOperatingHours(branchId);
            res.status(200).json(createSuccessResponse(hours));
        }
        catch (err) {
            next(err);
        }
    }
    static async updateOperatingHours(req, res, next) {
        try {
            const { branchId } = req.params;
            const schedules = req.body.schedules || req.body;
            const hours = await orgService.updateOperatingHours(branchId, schedules);
            res.status(200).json(createSuccessResponse(hours, 'Operating hours updated successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async getHolidays(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || null;
            const branchId = req.query.branchId || null;
            const holidays = await orgService.getHolidays(tenantId, branchId);
            res.status(200).json(createSuccessResponse(holidays));
        }
        catch (err) {
            next(err);
        }
    }
    static async createHoliday(req, res, next) {
        try {
            const { branchId } = req.params;
            const holiday = await orgService.createHoliday(branchId, req.body);
            res.status(201).json(createSuccessResponse(holiday, 'Holiday created successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteHoliday(req, res, next) {
        try {
            const { holidayId } = req.params;
            await orgService.deleteHoliday(holidayId);
            res.status(200).json(createSuccessResponse({ success: true }, 'Holiday deleted successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async getFranchises(req, res, next) {
        try {
            const isAll = req.query.all === 'true' || req.query.all === '1';
            const tenantId = isAll
                ? null
                : (req.query.tenantId || req.headers['x-tenant-id'] || null);
            if (!isAll && !tenantId) {
                res.status(200).json(createSuccessResponse([]));
                return;
            }
            const franchises = await orgService.getFranchisePartners(tenantId);
            res.status(200).json(createSuccessResponse(franchises));
        }
        catch (err) {
            next(err);
        }
    }
    static async getFranchiseById(req, res, next) {
        try {
            const { franchiseId } = req.params;
            const franchise = await orgService.getFranchisePartnerById(franchiseId);
            res.status(200).json(createSuccessResponse(franchise));
        }
        catch (err) {
            next(err);
        }
    }
    static async createFranchise(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] ||
                req.body.tenantId ||
                'f77a407a-45c1-4b8a-a08d-703bf7eeaea5';
            const franchise = await orgService.createFranchisePartner(tenantId, req.body);
            res.status(201).json(createSuccessResponse(franchise, 'Franchise partner created successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async updateFranchise(req, res, next) {
        try {
            const { franchiseId } = req.params;
            const updated = await orgService.updateFranchisePartner(franchiseId, req.body);
            res.status(200).json(createSuccessResponse(updated, 'Franchise partner updated successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async listResources(req, res, next) {
        try {
            const tenantId = req.headers['x-tenant-id'] || req.query.tenantId || null;
            const branchId = req.query.branchId || null;
            const resources = await orgService.getResources(tenantId, branchId);
            res.status(200).json(createSuccessResponse(resources));
        }
        catch (err) {
            next(err);
        }
    }
    static async createResource(req, res, next) {
        try {
            const body = CreateResourceRequestSchema.parse(req.body);
            const resource = await orgService.createResource(body);
            res.status(201).json(createSuccessResponse(resource, 'Resource created successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async updateResource(req, res, next) {
        try {
            const { resourceId } = req.params;
            const body = UpdateResourceRequestSchema.parse(req.body);
            const resource = await orgService.updateResource(resourceId, body);
            res.status(200).json(createSuccessResponse(resource, 'Resource updated successfully'));
        }
        catch (err) {
            next(err);
        }
    }
    static async deleteResource(req, res, next) {
        try {
            const { resourceId } = req.params;
            await orgService.deleteResource(resourceId);
            res.status(200).json(createSuccessResponse({ success: true }, 'Resource deleted successfully'));
        }
        catch (err) {
            next(err);
        }
    }
}
