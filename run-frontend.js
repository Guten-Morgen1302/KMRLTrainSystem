#!/usr/bin/env node

// Pure frontend runner - no backend needed!
import { spawn } from 'child_process';

const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: 'client',
  stdio: 'inherit',
  env: { ...process.env, NODE_ENV: 'development' }
});

viteProcess.on('error', (error) => {
  console.error('Error starting Vite:', error);
  process.exit(1);
});

viteProcess.on('exit', (code) => {
  console.log(`Vite process exited with code ${code}`);
  process.exit(code);
});

console.log('🚀 Starting pure frontend Vite server on port 5000...');
console.log('🎨 Metro Yukthi website will be available at http://localhost:5000');
console.log('✨ No backend required - pure frontend magic!');