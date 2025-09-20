#!/usr/bin/env node

// 🚀 PURE FRONTEND METRO YUKTHI - NO BACKEND NEEDED! 🚀
console.log('🎨 Starting Metro Yukthi - Pure Frontend Mode!');
console.log('✨ Beautiful dark theme with stunning teal & lime colors!');
console.log('🔥 No backend, no database, just pure frontend magic!');

import { exec } from 'child_process';
import path from 'path';

// Change to client directory and run pure Vite
const clientDir = path.resolve(process.cwd(), 'client');
process.chdir(clientDir);

console.log(`📍 Working directory: ${process.cwd()}`);
console.log('🌟 Launching Vite development server...');

const viteProcess = exec('npx vite --host 0.0.0.0 --port 5000', (error, stdout, stderr) => {
  if (error) {
    console.error(`❌ Error: ${error}`);
    return;
  }
  console.log(stdout);
  if (stderr) console.error(stderr);
});

viteProcess.stdout.on('data', (data) => {
  console.log(data);
});

viteProcess.stderr.on('data', (data) => {
  console.error(data);
});

console.log('🎯 Metro Yukthi will be available at http://localhost:5000');
console.log('🌙 Switch to dark mode to see those gorgeous colors!');