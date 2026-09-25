import { AssignRolePermissionsRequestSchema, CreateRoleRequestSchema, UpdateRoleRequestSchema, } from '@salon-spa-saas/contracts';
import { roleService } from '../../application/services/role.service';
export class RoleController {
    async listRoles(req, res, next) {
        try {
            const scope = req.query.scope || (req.user?.userType === 'TENANT' ? 'TENANT' : undefined);
            const tenantId = req.headers['x-tenant-id'] ||
                req.user?.tenantId ||
                req.query.tenantId ||
                null;
            const showOnFrontend = req.query.showOnFrontend === 'true' ? true : req.query.showOnFrontend === 'false' ? false : undefined;
            const panel = req.query.panel;
            const roles = await roleService.listRoles(scope, tenantId, showOnFrontend, panel);
            res.status(200).json({
                success: true,
                data: roles,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getRoleById(req, res, next) {
        try {
            const id = req.params.id;
            const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId || null;
            const role = await roleService.getRoleById(id, tenantId);
            res.status(200).json({
                success: true,
                data: role,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createRole(req, res, next) {
        try {
            const body = CreateRoleRequestSchema.parse(req.body);
            const tenantId = req.headers['x-tenant-id'] ||
                req.user?.tenantId ||
                req.body.tenantId ||
                null;
            const role = await roleService.createRole({
                name: body.name,
                code: body.code,
                description: body.description,
                permissionCodes: body.permissions,
                tenantId: tenantId || undefined,
            });
            res.status(201).json({
                success: true,
                data: role,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async updateRole(req, res, next) {
        try {
            const id = req.params.id;
            const body = UpdateRoleRequestSchema.parse(req.body);
            const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId || null;
            const role = await roleService.updateRole(id, body, tenantId);
            res.status(200).json({
                success: true,
                data: role,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteRole(req, res, next) {
        try {
            const id = req.params.id;
            const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId || null;
            await roleService.deleteRole(id, tenantId);
            res.status(200).json({
                success: true,
                data: { message: 'Role deleted successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async assignPermissions(req, res, next) {
        try {
            const id = req.params.id;
            const body = AssignRolePermissionsRequestSchema.parse(req.body);
            const tenantId = req.headers['x-tenant-id'] || req.user?.tenantId || null;
            await roleService.assignRolePermissions(id, body.permissions, tenantId);
            res.status(200).json({
                success: true,
                data: { message: 'Permissions assigned successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async listPermissions(req, res, next) {
        try {
            const permissions = await roleService.listPermissions();
            res.status(200).json({
                success: true,
                data: permissions,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
export const roleController = new RoleController();
