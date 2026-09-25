import { buildGatewayApp } from '../apps/api-gateway/src/app';
import { buildIdentityApp } from '../apps/services/identity-service/src/app';
import { createApp as createOrganizationApp } from '../apps/services/organization-service/src/app';
import { buildPeopleApp } from '../apps/services/people-service/src/app';
import { createApp as createCustomerApp } from '../apps/services/customer-service/src/app';
import { createApp as createBookingApp } from '../apps/services/booking-service/src/app';
import { createApp as createCommerceApp } from '../apps/services/commerce-service/src/app';
import { createApp as createPaymentApp } from '../apps/services/payment-service/src/app';
import { createApp as createInventoryApp } from '../apps/services/inventory-service/src/app';
import { createApp as createFinanceApp } from '../apps/services/finance-service/src/app';
import { createApp as createCommunicationApp } from '../apps/services/communication-service/src/app';
import { createApp as createPlatformApp } from '../apps/services/platform-service/src/app';
import { createApp as createReportingApp } from '../apps/services/reporting-service/src/app';

process.setMaxListeners(50);

console.log('===================================================================');
console.log('     🚀 STARTING DIGIFLEX SALON & SPA UNIFIED RUNTIME SUITE        ');
console.log('===================================================================\n');

const gatewayPort = Number(process.env.PORT || 3030);

// 1. Launch API Gateway FIRST on 0.0.0.0 so Render detects the port immediately
const gatewayApp = buildGatewayApp();
const gatewayServer = gatewayApp.listen(gatewayPort, '0.0.0.0', () => {
  console.log(`[GATEWAY] Unified API Gateway active on http://0.0.0.0:${gatewayPort}`);
  console.log(`[GATEWAY] Swagger Documentation: http://0.0.0.0:${gatewayPort}/docs\n`);
});

// 2. Launch all 12 Microservices on their respective internal loopback ports
const services = [
  { name: 'identity-service', port: 6001, create: buildIdentityApp },
  { name: 'organization-service', port: 6002, create: createOrganizationApp },
  { name: 'people-service', port: 6003, create: buildPeopleApp },
  { name: 'customer-service', port: 6004, create: createCustomerApp },
  { name: 'booking-service', port: 6005, create: createBookingApp },
  { name: 'commerce-service', port: 6006, create: createCommerceApp },
  { name: 'payment-service', port: 6007, create: createPaymentApp },
  { name: 'inventory-service', port: 6008, create: createInventoryApp },
  { name: 'finance-service', port: 6009, create: createFinanceApp },
  { name: 'communication-service', port: 6010, create: createCommunicationApp },
  { name: 'platform-service', port: 6011, create: createPlatformApp },
  { name: 'reporting-service', port: 6012, create: createReportingApp },
];

const servers = [gatewayServer];

for (const svc of services) {
  try {
    const app = svc.create();
    const server = app.listen(svc.port, '0.0.0.0', () => {
      console.log(`[SERVICE] ${svc.name.padEnd(24)} listening on http://localhost:${svc.port}`);
    });
    servers.push(server);
  } catch (err: any) {
    console.error(`[ERROR] Failed to start ${svc.name}:`, err.message);
  }
}

console.log('\n[READY] All microservices and API Gateway are live and healthy.\n');

// Graceful shutdown handling
function shutdown(signal: string) {
  console.log(`\nReceived ${signal}, gracefully shutting down all servers...`);
  for (const s of servers) {
    try {
      s.close();
    } catch {
      // Ignore
    }
  }
  process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
