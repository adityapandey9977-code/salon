import { spawn, execSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

// Microservices list with their internal loopback ports
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

// Ensure dist/ exists; if not, build services on the fly
const gwDist = path.resolve(process.cwd(), 'apps/api-gateway/dist/main.js');
if (!fs.existsSync(gwDist)) {
  console.log('[BUILD] dist/main.js not found. Compiling backend services on the fly...');
  try {
    execSync('pnpm build:services', { stdio: 'inherit' });
    console.log('[BUILD] Backend services compiled successfully.\n');
  } catch (err) {
    console.warn('[BUILD] Pre-compile failed, falling back to source runtime:', err.message);
  }
}

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
  // Use memory limit flag --max-old-space-size=48 on node to prevent Render 512MB OOM
  const args = isTs ? ['tsx', entryPoint] : ['--max-old-space-size=48', entryPoint];

  console.log(`[START] Launching ${name.padEnd(24)} on port ${(envOverrides.PORT || 'default')}...`);

  // On Linux POSIX, shell must be false when passing args array so execve is called directly
  const useShell = isTs && process.platform === 'win32';
  const proc = spawn(runner, args, {
    cwd: fullDir,
    env,
    stdio: 'inherit',
    shell: useShell,
  });

  proc.on('error', (err) => {
    console.error(`[ERROR] ${name} process error:`, err);
  });

  proc.on('exit', (code, signal) => {
    if (code !== 0 && code !== null) {
      console.warn(`[EXIT] ${name} exited with code ${code} (${signal})`);
    }
  });

  runningProcesses.push({ name, proc });
  return proc;
}

// 1. Start API Gateway FIRST so Render port scanner immediately detects open port
const gwEntry = fs.existsSync(gwDist) ? 'dist/main.js' : 'src/main.ts';
const gatewayPort = process.env.PORT || '3030';

console.log(`[GATEWAY] Launching Unified API Gateway immediately on port ${gatewayPort}...`);
startProcess('api-gateway', 'apps/api-gateway', gwEntry, {
  PORT: gatewayPort,
  API_GATEWAY_PORT: gatewayPort,
  GATEWAY_PORT: gatewayPort,
});

// 2. Launch the 12 Microservices staggered (100ms apart) to prevent CPU/memory spikes
async function startAllServices() {
  for (let i = 0; i < services.length; i++) {
    const svc = services[i];
    const distFile = path.join(svc.path, 'dist', 'main.js');
    const srcFile = path.join(svc.path, 'src', 'main.ts');
    const entry = fs.existsSync(distFile) ? 'dist/main.js' : 'src/main.ts';

    startProcess(svc.name, svc.path, entry, {
      PORT: String(svc.port),
    });

    // Small stagger delay between spawning services
    await new Promise((resolve) => setTimeout(resolve, 100));
  }
  console.log('\n[READY] All microservices and API Gateway launched successfully.\n');
}

startAllServices().catch((err) => {
  console.error('[ERROR] Failed starting services:', err);
});

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
