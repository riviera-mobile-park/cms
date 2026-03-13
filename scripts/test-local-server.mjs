import { spawn } from 'node:child_process';
import { setTimeout as delay } from 'node:timers/promises';

const host = process.env.LOCAL_TEST_HOST ?? '127.0.0.1';
const port = Number(process.env.LOCAL_TEST_PORT ?? '3000');
const url = `http://${host}:${port}`;

const child = spawn('npm', ['run', 'dev:local'], {
  stdio: 'inherit',
  shell: process.platform === 'win32',
});

let passed = false;
let lastError;

for (let attempt = 1; attempt <= 30; attempt += 1) {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 3000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timer);

    if (response.status < 500) {
      console.log(`Server responded with HTTP ${response.status} at ${url}`);
      passed = true;
      break;
    }

    lastError = new Error(`Unexpected HTTP status: ${response.status}`);
  } catch (error) {
    lastError = error;
  }

  await delay(1000);
}

child.kill('SIGTERM');
await new Promise((resolve) => {
  const timeout = setTimeout(() => {
    child.kill('SIGKILL');
    resolve();
  }, 5000);

  child.once('exit', () => {
    clearTimeout(timeout);
    resolve();
  });
});

if (!passed) {
  console.error(`Local server test failed for ${url}`);
  if (lastError instanceof Error) {
    console.error(lastError.message);
  }
  process.exit(1);
}

console.log('Local server smoke test passed.');
