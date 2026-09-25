export declare const roleSchemas: {
    Role: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            name: {
                type: string;
            };
            code: {
                type: string;
            };
            description: {
                type: string;
                nullable: boolean;
            };
            isSystem: {
                type: string;
            };
            createdAt: {
                type: string;
                format: string;
            };
        };
    };
    Permission: {
        type: string;
        properties: {
            id: {
                type: string;
                format: string;
            };
            name: {
                type: string;
            };
            code: {
                type: string;
            };
            module: {
                type: string;
            };
            description: {
                type: string;
                nullable: boolean;
            };
        };
    };
    CreateRoleRequest: {
        type: string;
        required: string[];
        properties: {
            name: {
                type: string;
                minLength: number;
            };
            code: {
                type: string;
                minLength: number;
            };
            description: {
                type: string;
                nullable: boolean;
            };
            permissions: {
                type: string;
                items: {
                    type: string;
                };
            };
        };
    };
    AssignRolePermissionsRequest: {
        type: string;
        required: string[];
        properties: {
            permissions: {
                type: string;
                items: {
                    type: string;
                };
            };
        };
    };
    AssignUserRolesRequest: {
        type: string;
        required: string[];
        properties: {
            roleIds: {
                type: string;
                items: {
                    type: string;
                    format: string;
                };
            };
        };
    };
};
//# sourceMappingURL=role.schemas.d.ts.map