import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Services to start
const services = [
  { name: 'identity-service', path: 'apps/services/identity-service', port: 6001 },
  { name: 'organization-service', path: 'apps/services/organization-service', port: 6002 },
  { name: 'people-service', path: 'apps/services/people-service', port: 6003 },
  { name: 'customer-service', path: 'apps/services/customer-service', port: 6004 },
  { name: 'booking-service', path: 'apps/services/booking-service', port: 6005 },
  { name: 'commerce-service', path: 'apps/services/commerce-service', port: 6006 },
  { name: 'payment-service', path: 'apps/services/payment-service', port: 6007 },
  { name: 'inventory-service', path: 'apps/services/inventory-service', port: 6008 },
  { name: 'finance-service', path: 'apps/services/finance-service', port: 6009 },
  { name: 'communication-service', path: 'apps/services/communication-service', port: 6010 },
  { name: 'platform-service', path: 'apps/services/platform-service', port: 6011 },
  { name: 'reporting-service', path: 'apps/services/reporting-service', port: 6012 },
];

console.log('===================================================================');
console.log('     🚀 STARTING DIGIFLEX SALON & SPA MICROSERVICES SUITE         ');
console.log('===================================================================\n');

const runningProcesses = [];

function startProcess(name, dir, scriptFile, envOverrides = {}) {
  const fullDir = path.resolve(process.cwd(), dir);
  const entryPoint = path.resolve(fullDir, scriptFile);

  const env = {
    ...process.env,
    ...envOverrides,
  };

  const isTs = entryPoint.endsWith('.ts');
  const runner = isTs ? 'npx' : 'node';
  const args = isTs ? ['tsx', entryPoint] : [entryPoint];

  console.log(`[START] Launching ${name.padEnd(24)} on port ${(envOverrides.PORT || 'default')}...`);

  const proc = spawn(runner, args, {
    cwd: fullDir,
    env,
    stdio: 'inherit',
    shell: true,
  });

  proc.on('error', (err) => {
    console.error(`[ERROR] ${name} process error:`, err);
  });

  proc.on('exit', (code, signal) => {
    console.warn(`[EXIT] ${name} exited with code ${code} (${signal})`);
  });

  runningProcesses.push({ name, proc });
  return proc;
}

// 1. Start all 12 Microservices
for (const svc of services) {
  const distFile = path.join(svc.path, 'dist', 'main.js');
  const srcFile = path.join(svc.path, 'src', 'main.ts');
  const entry = fs.existsSync(distFile) ? 'dist/main.js' : 'src/main.ts';

  startProcess(svc.name, svc.path, entry, {
    PORT: String(svc.port),
  });
}

// 2. Start API Gateway (with a 3-second delay to let downstream services initialize)
setTimeout(() => {
  const gwDist = 'apps/api-gateway/dist/main.js';
  const gwEntry = fs.existsSync(path.resolve(process.cwd(), gwDist)) ? 'dist/main.js' : 'src/main.ts';

  console.log('\n[GATEWAY] Launching Unified API Gateway...');
  startProcess('api-gateway', 'apps/api-gateway', gwEntry, {
    PORT: process.env.PORT || '3030',
  });
}, 3000);

// Graceful shutdown handling
function handleShutdown(signal) {
  console.log(`\nReceived ${signal}. Gracefully stopping all microservices...`);
  for (const { name, proc } of runningProcesses) {
    try {
      proc.kill();
    } catch {
      // Ignore
    }
  }
  process.exit(0);
}

process.on('SIGINT', () => handleShutdown('SIGINT'));
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
