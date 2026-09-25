import { createProxyMiddleware, fixRequestBody } from 'http-proxy-middleware';
import { gatewayConfig } from '../config';
function createGatewayProxy(targetUrl) {
    return createProxyMiddleware({
        target: targetUrl,
        changeOrigin: true,
        pathRewrite: (_path, req) => req.originalUrl,
        on: {
            proxyReq: (proxyReq, req) => {
                // Propagate correlation and tracing headers
                if (req.headers['x-correlation-id']) {
                    proxyReq.setHeader('x-correlation-id', req.headers['x-correlation-id']);
                }
                if (req.headers['x-request-id']) {
                    proxyReq.setHeader('x-request-id', req.headers['x-request-id']);
                }
                // Propagate resolved authority identity headers for both USER and TENANT principals
                if (req.user) {
                    proxyReq.setHeader('x-principal-type', req.user.principalType);
                    proxyReq.setHeader('x-session-id', req.user.sessionId);
                    proxyReq.setHeader('x-role', req.user.role);
                    proxyReq.setHeader('x-scope-type', req.user.scopeType);
                    if (req.user.userId) {
                        proxyReq.setHeader('x-user-id', req.user.userId);
                    }
                    if (req.user.tenantCredentialId) {
                        proxyReq.setHeader('x-tenant-credential-id', req.user.tenantCredentialId);
                    }
                    if (req.user.userType) {
                        proxyReq.setHeader('x-user-type', req.user.userType);
                    }
                    if (req.user.tenantId) {
                        proxyReq.setHeader('x-tenant-id', req.user.tenantId);
                    }
                    if (req.user.franchiseId) {
                        proxyReq.setHeader('x-franchise-id', req.user.franchiseId);
                    }
                    if (req.user.branchIds && req.user.branchIds.length > 0) {
                        proxyReq.setHeader('x-branch-ids', req.user.branchIds.join(','));
                    }
                }
                // Fix request body if express.json() already parsed it
                fixRequestBody(proxyReq, req);
            },
        },
    });
}
export const identityServiceProxy = createGatewayProxy(gatewayConfig.IDENTITY_SERVICE_URL);
export const organizationServiceProxy = createGatewayProxy(gatewayConfig.ORGANIZATION_SERVICE_URL);
export const peopleServiceProxy = createGatewayProxy(gatewayConfig.PEOPLE_SERVICE_URL);
export const customerServiceProxy = createGatewayProxy(gatewayConfig.CUSTOMER_SERVICE_URL);
export const bookingServiceProxy = createGatewayProxy(gatewayConfig.BOOKING_SERVICE_URL);
export const commerceServiceProxy = createGatewayProxy(gatewayConfig.COMMERCE_SERVICE_URL);
export const paymentServiceProxy = createGatewayProxy(gatewayConfig.PAYMENT_SERVICE_URL);
export const inventoryServiceProxy = createGatewayProxy(gatewayConfig.INVENTORY_SERVICE_URL);
export const financeServiceProxy = createGatewayProxy(gatewayConfig.FINANCE_SERVICE_URL);
export const communicationServiceProxy = createGatewayProxy(gatewayConfig.COMMUNICATION_SERVICE_URL);
export const platformServiceProxy = createGatewayProxy(gatewayConfig.PLATFORM_SERVICE_URL);
export const reportingServiceProxy = createGatewayProxy(gatewayConfig.REPORTING_SERVICE_URL);
export function handleUnimplementedService(serviceName) {
    return (_req, res) => {
        res.status(503).json({
            success: false,
            error: {
                code: 'SERVICE_NOT_AVAILABLE',
                message: `${serviceName} is not yet available in this deployment phase.`,
            },
            timestamp: new Date().toISOString(),
        });
    };
}
