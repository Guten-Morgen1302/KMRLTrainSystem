#!/usr/bin/env node

// Simple build script for Vercel deployment - Frontend Only
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building frontend for Vercel deployment...');

try {
  // Build the client from the client directory
  console.log('📦 Building React app...');
  execSync('vite build', { 
    stdio: 'inherit',
    cwd: path.join(process.cwd(), 'client')
  });
  
  // Move dist from client/dist to root/dist for Vercel
  const clientDistPath = path.join(process.cwd(), 'client', 'dist');
  const rootDistPath = path.join(process.cwd(), 'dist');
  
  if (fs.existsSync(clientDistPath)) {
    // Remove existing dist if it exists
    if (fs.existsSync(rootDistPath)) {
      fs.rmSync(rootDistPath, { recursive: true, force: true });
    }
    
    // Move client/dist to root/dist
    fs.renameSync(clientDistPath, rootDistPath);
    
    console.log('✅ Frontend build completed successfully!');
    console.log(`📁 Output directory: ${rootDistPath}`);
  } else {
    console.log('❌ Build failed - no dist directory found');
    process.exit(1);
  }
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}