#!/usr/bin/env node

// Simple frontend development server
import { spawn } from 'child_process';
import path from 'path';

console.log('🚀 Starting frontend development server...');

const viteProcess = spawn('npx', ['vite', '--host', '0.0.0.0', '--port', '5000'], {
  cwd: path.join(process.cwd(), 'client'),
  stdio: 'inherit'
});

viteProcess.on('close', (code) => {
  console.log(`Frontend server exited with code ${code}`);
});

process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down frontend server...');
  viteProcess.kill('SIGINT');
  process.exit(0);
});