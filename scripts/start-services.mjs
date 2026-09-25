import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);
const tsxCli = require.resolve('tsx/cli');
const tsScript = path.resolve(process.cwd(), 'scripts/start-services.ts');

const proc = spawn(process.execPath, [tsxCli, tsScript], {
  stdio: 'inherit',
  env: process.env,
});

proc.on('exit', (code) => {
  process.exit(code || 0);
});
