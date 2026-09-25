export const peopleOpenApiSpec = {
    openapi: '3.0.3',
    info: {
        title: 'People Service API',
        description: 'Enterprise Employee Records, Staff Professional Profiles, Branch Assignments, Skills Catalogue, Shifts, Master Rostering, Geolocation Clock-In Attendance & Leave Management',
        version: '1.0.0',
        contact: {
            name: '  Engineering Team',
            email: 'engineering@digiflex.ai',
        },
    },
    servers: [
        {
            url: '/api/v1',
            description: 'API Gateway Ingress',
        },
        {
            url: 'http://localhost:5003/api/v1',
            description: 'Direct People Service Local',
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: 'http',
                scheme: 'bearer',
                bearerFormat: 'JWT',
                description: 'Pass JWT access token in the Authorization header.',
            },
        },
        schemas: {
            StandardSuccessResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'object' },
                    meta: {
                        type: 'object',
                        properties: {
                            correlationId: { type: 'string', example: 'd3b07384-d113-4a11-b0e6-a052b6d5f0e1' },
                        },
                    },
                },
            },
            StandardPaginatedResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: true },
                    data: { type: 'array', items: { type: 'object' } },
                    meta: {
                        type: 'object',
                        properties: {
                            page: { type: 'integer', example: 1 },
                            limit: { type: 'integer', example: 20 },
                            total: { type: 'integer', example: 45 },
                            totalPages: { type: 'integer', example: 3 },
                            correlationId: { type: 'string' },
                        },
                    },
                },
            },
            StandardErrorResponse: {
                type: 'object',
                properties: {
                    success: { type: 'boolean', example: false },
                    error: {
                        type: 'object',
                        properties: {
                            code: { type: 'string', example: 'NOT_FOUND' },
                            message: { type: 'string', example: 'Resource not found' },
                            details: { type: 'array', items: { type: 'object' } },
                            requestId: { type: 'string' },
                        },
                    },
                },
            },
            EmploymentStatus: {
                type: 'string',
                enum: ['INVITED', 'ACTIVE', 'ON_LEAVE', 'SUSPENDED', 'RESIGNED', 'TERMINATED', 'INACTIVE'],
            },
            EmploymentType: {
                type: 'string',
                enum: ['FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERN'],
            },
            SkillLevel: {
                type: 'string',
                enum: ['TRAINEE', 'JUNIOR', 'INTERMEDIATE', 'SENIOR', 'EXPERT', 'MASTER'],
            },
            RosterStatus: {
                type: 'string',
                enum: ['SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'ABSENT'],
            },
            AttendanceStatus: {
                type: 'string',
                enum: ['PRESENT', 'ABSENT', 'LATE', 'HALF_DAY', 'ON_LEAVE', 'HOLIDAY', 'WEEK_OFF'],
            },
            LeaveType: {
                type: 'string',
                enum: ['CASUAL', 'SICK', 'PAID', 'UNPAID', 'MATERNITY', 'PATERNITY', 'COMP_OFF', 'OTHER'],
            },
            LeaveStatus: {
                type: 'string',
                enum: ['PENDING', 'APPROVED', 'REJECTED', 'CANCELLED'],
            },
            StaffProfile: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    tenantId: { type: 'string', format: 'uuid' },
                    employeeCode: { type: 'string', example: 'EMP-001' },
                    identityUserId: { type: 'string', format: 'uuid', nullable: true },
                    firstName: { type: 'string', example: 'Priya' },
                    lastName: { type: 'string', example: 'Sharma' },
                    displayName: { type: 'string', example: 'Priya Sharma' },
                    email: { type: 'string', format: 'email', nullable: true },
                    mobilePhone: { type: 'string', example: '+919876543210' },
                    dateOfBirth: { type: 'string', format: 'date', nullable: true },
                    gender: { type: 'string', nullable: true },
                    employmentStatus: { $ref: '#/components/schemas/EmploymentStatus' },
                    employmentType: { $ref: '#/components/schemas/EmploymentType' },
                    joiningDate: { type: 'string', format: 'date' },
                    primaryBranchId: { type: 'string', format: 'uuid', nullable: true },
                    jobTitle: { type: 'string', example: 'Senior Hair Stylist' },
                    department: { type: 'string', example: 'Hair Styling', nullable: true },
                    createdAt: { type: 'string', format: 'date-time' },
                    updatedAt: { type: 'string', format: 'date-time' },
                },
            },
            AttendanceRecord: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    tenantId: { type: 'string', format: 'uuid' },
                    employeeId: { type: 'string', format: 'uuid' },
                    branchId: { type: 'string', format: 'uuid' },
                    attendanceDate: { type: 'string', format: 'date' },
                    clockInAt: { type: 'string', format: 'date-time', nullable: true },
                    clockOutAt: { type: 'string', format: 'date-time', nullable: true },
                    status: { $ref: '#/components/schemas/AttendanceStatus' },
                    lateMinutes: { type: 'integer', example: 12 },
                    earlyLeaveMinutes: { type: 'integer', example: 0 },
                    overtimeMinutes: { type: 'integer', example: 30 },
                    clockInMethod: { type: 'string', example: 'WEB' },
                },
            },
            LeaveRequest: {
                type: 'object',
                properties: {
                    id: { type: 'string', format: 'uuid' },
                    tenantId: { type: 'string', format: 'uuid' },
                    employeeId: { type: 'string', format: 'uuid' },
                    leaveType: { $ref: '#/components/schemas/LeaveType' },
                    startDate: { type: 'string', format: 'date' },
                    endDate: { type: 'string', format: 'date' },
                    reason: { type: 'string' },
                    status: { $ref: '#/components/schemas/LeaveStatus' },
                    requestedAt: { type: 'string', format: 'date-time' },
                    approvedAt: { type: 'string', format: 'date-time', nullable: true },
                    reviewNote: { type: 'string', nullable: true },
                },
            },
        },
    },
    security: [{ bearerAuth: [] }],
    paths: {
        '/staff': {
            get: {
                summary: 'List staff employees',
                description: 'Returns a paginated list of staff employees matching optional filter criteria.',
                tags: ['Staff'],
                parameters: [
                    { name: 'page', in: 'query', schema: { type: 'integer', default: 1 } },
                    { name: 'limit', in: 'query', schema: { type: 'integer', default: 20 } },
                    { name: 'branchId', in: 'query', schema: { type: 'string', format: 'uuid' } },
                    { name: 'status', in: 'query', schema: { $ref: '#/components/schemas/EmploymentStatus' } },
                    { name: 'search', in: 'query', schema: { type: 'string' } },
                ],
                responses: {
                    200: { description: 'Staff list retrieved successfully' },
                },
            },
            post: {
                summary: 'Create a new employee record',
                description: 'Creates an employee record, associated professional profile, and emergency contacts.',
                tags: ['Staff'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['employeeCode', 'firstName', 'lastName', 'displayName', 'mobilePhone', 'jobTitle'],
                                properties: {
                                    employeeCode: { type: 'string', example: 'EMP-101' },
                                    firstName: { type: 'string', example: 'Aarav' },
                                    lastName: { type: 'string', example: 'Patel' },
                                    displayName: { type: 'string', example: 'Aarav Patel' },
                                    email: { type: 'string', format: 'email' },
                                    mobilePhone: { type: 'string', example: '+919988776655' },
                                    jobTitle: { type: 'string', example: 'Master Colorist' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Employee created successfully' },
                    409: { description: 'Duplicate employeeCode' },
                },
            },
        },
        '/staff/me': {
            get: {
                summary: 'Get authenticated staff profile',
                description: 'Resolves the staff employee profile associated with the current identity user.',
                tags: ['Staff'],
                responses: {
                    200: { description: 'Staff profile resolved' },
                    404: { description: 'No linked employee profile' },
                },
            },
        },
        '/staff/{id}': {
            get: {
                summary: 'Get employee detail',
                tags: ['Staff'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: { description: 'Employee details' },
                    404: { description: 'Employee not found' },
                },
            },
            patch: {
                summary: 'Update employee fields',
                tags: ['Staff'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Updated successfully' } },
            },
            delete: {
                summary: 'Soft-delete employee',
                tags: ['Staff'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: { 200: { description: 'Soft-deleted successfully' } },
            },
        },
        '/staff/clock-in': {
            post: {
                summary: 'Clock in attendance',
                description: 'Records an authoritative server-timestamped clock-in for the staff member.',
                tags: ['Attendance'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['branchId'],
                                properties: {
                                    branchId: { type: 'string', format: 'uuid' },
                                    method: { type: 'string', enum: ['WEB', 'MOBILE', 'QR', 'BIOMETRIC'], default: 'WEB' },
                                    latitude: { type: 'number' },
                                    longitude: { type: 'number' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    201: { description: 'Clock-in recorded successfully' },
                    409: { description: 'Active clock-in session already exists for today' },
                },
            },
        },
        '/staff/clock-out': {
            post: {
                summary: 'Clock out attendance',
                description: 'Completes clock-out and computes worked duration, lateness, early leave, and overtime.',
                tags: ['Attendance'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['branchId'],
                                properties: {
                                    branchId: { type: 'string', format: 'uuid' },
                                    method: { type: 'string', default: 'WEB' },
                                },
                            },
                        },
                    },
                },
                responses: {
                    200: { description: 'Clock-out calculated and recorded' },
                    409: { description: 'No active clock-in session found' },
                },
            },
        },
        '/staff/leave': {
            get: {
                summary: 'Query leave applications',
                tags: ['Leave'],
                responses: { 200: { description: 'Leave requests list' } },
            },
            post: {
                summary: 'Apply for leave',
                tags: ['Leave'],
                requestBody: {
                    required: true,
                    content: {
                        'application/json': {
                            schema: {
                                type: 'object',
                                required: ['leaveType', 'startDate', 'endDate'],
                                properties: {
                                    leaveType: { $ref: '#/components/schemas/LeaveType' },
                                    startDate: { type: 'string', format: 'date' },
                                    endDate: { type: 'string', format: 'date' },
                                    reason: { type: 'string' },
                                },
                            },
                        },
                    },
                },
                responses: { 201: { description: 'Leave application submitted' } },
            },
        },
        '/staff/leave/{id}/approve': {
            post: {
                summary: 'Approve leave request',
                description: 'Approves pending leave and updates annual leave balance quotas in an atomic transaction.',
                tags: ['Leave'],
                parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string', format: 'uuid' } }],
                responses: {
                    200: { description: 'Leave approved and balance deducted' },
                    409: { description: 'Leave already decided' },
                },
            },
        },
    },
};
