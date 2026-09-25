import { AssignUserRolesRequestSchema, CreateUserRequestSchema, CreateUserScopeRequestSchema, UpdateUserRequestSchema, } from '@salon-spa-saas/contracts';
import { roleService } from '../../application/services/role.service';
import { scopeService } from '../../application/services/scope.service';
import { userService } from '../../application/services/user.service';
export class UserController {
    async listUsers(req, res, next) {
        try {
            const page = req.query.page ? Number(req.query.page) : 1;
            const limit = req.query.limit ? Number(req.query.limit) : 20;
            const userType = req.query.userType;
            const status = req.query.status;
            const search = req.query.search;
            const result = await userService.listUsers({ page, limit, userType, status, search });
            res.status(200).json({
                success: true,
                data: result.items,
                pagination: {
                    page: result.page,
                    limit: result.limit,
                    total: result.total,
                    totalPages: Math.ceil(result.total / result.limit),
                },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getUserById(req, res, next) {
        try {
            const id = req.params.id;
            const tenantId = req.headers['x-tenant-id'] || null;
            const user = await userService.getUserById(id, tenantId);
            res.status(200).json({
                success: true,
                data: user,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createUser(req, res, next) {
        try {
            const body = CreateUserRequestSchema.parse(req.body);
            const user = await userService.createUser({
                email: body.email,
                password: body.password,
                fullName: body.fullName,
                mobilePhone: body.mobilePhone,
                userType: body.userType,
                roleIds: body.roles,
            });
            res.status(201).json({
                success: true,
                data: user,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async updateUser(req, res, next) {
        try {
            const id = req.params.id;
            const body = UpdateUserRequestSchema.parse(req.body);
            const user = await userService.updateUser(id, body);
            res.status(200).json({
                success: true,
                data: user,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async suspendUser(req, res, next) {
        try {
            const id = req.params.id;
            const user = await userService.suspendUser(id);
            res.status(200).json({
                success: true,
                data: user,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async activateUser(req, res, next) {
        try {
            const id = req.params.id;
            const user = await userService.activateUser(id);
            res.status(200).json({
                success: true,
                data: user,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async assignRoles(req, res, next) {
        try {
            const userId = req.params.id;
            const body = AssignUserRolesRequestSchema.parse(req.body);
            await roleService.assignUserRoles(userId, body.roleIds);
            res.status(200).json({
                success: true,
                data: { message: 'Roles assigned successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async removeRole(req, res, next) {
        try {
            const userId = req.params.id;
            const roleId = req.params.roleId;
            await roleService.removeUserRole(userId, roleId);
            res.status(200).json({
                success: true,
                data: { message: 'Role removed successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getEffectiveAccess(req, res, next) {
        try {
            const userId = req.params.id;
            const access = await roleService.getEffectiveAccess(userId);
            res.status(200).json({
                success: true,
                data: access,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async getScopes(req, res, next) {
        try {
            const userId = req.params.id;
            const scopes = await scopeService.listUserScopes(userId);
            res.status(200).json({
                success: true,
                data: scopes,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async createScope(req, res, next) {
        try {
            const userId = req.params.id;
            const body = CreateUserScopeRequestSchema.parse(req.body);
            const scope = await scopeService.createScope({
                userId,
                scopeType: body.scopeType,
                tenantId: body.tenantId,
                franchiseId: body.franchiseId,
                branchId: body.branchId,
            });
            res.status(201).json({
                success: true,
                data: scope,
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
    async deleteScope(req, res, next) {
        try {
            const userId = req.params.id;
            const scopeId = req.params.scopeId;
            await scopeService.deleteScope(scopeId, userId);
            res.status(200).json({
                success: true,
                data: { message: 'Scope deleted successfully' },
                timestamp: new Date().toISOString(),
            });
        }
        catch (err) {
            next(err);
        }
    }
}
export const userController = new UserController();
