#!/usr/bin/env node

/**
 * Vercel Deployment Helper
 * This script helps prepare the environment for Vercel deployment
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Preparing for Vercel deployment...');

// Check if vercel CLI is installed
try {
  execSync('vercel --version', { stdio: 'ignore' });
  console.log('✅ Vercel CLI is installed');
} catch (error) {
  console.log('❌ Vercel CLI is not installed');
  console.log('   Installing Vercel CLI...');
  try {
    execSync('npm install -g vercel', { stdio: 'inherit' });
    console.log('✅ Vercel CLI installed successfully');
  } catch (installError) {
    console.error('❌ Failed to install Vercel CLI:', installError.message);
    process.exit(1);
  }
}

// Check if we have a vercel.json file
const vercelConfigPath = path.join(process.cwd(), 'vercel.json');
if (!fs.existsSync(vercelConfigPath)) {
  console.error('❌ vercel.json not found. Please create a vercel.json file first.');
  process.exit(1);
}

// Check for environment variables
console.log('🔍 Checking environment variables...');
try {
  const validateEnvModule = require('./validate-env.js');
  if (typeof validateEnvModule.validateVercelEnvironment === 'function') {
    validateEnvModule.validateVercelEnvironment();
  } else {
    console.log('⚠️ Environment validation function not found. Skipping environment checks.');
  }
} catch (error) {
  console.log('⚠️ Could not validate environment:', error.message);
}

// Check for project linking
console.log('🔗 Checking Vercel project linking...');
try {
  const vercelProjectOutput = execSync('vercel project ls --json', { encoding: 'utf8', stdio: ['pipe', 'pipe', 'ignore'] });
  const projects = JSON.parse(vercelProjectOutput);
  
  if (projects && projects.length > 0) {
    console.log('✅ Vercel project is linked');
  } else {
    console.log('⚠️ No linked Vercel projects found');
    console.log('   Run "vercel link" to link your project');
  }
} catch (error) {
  console.log('⚠️ Could not check project linking. You may need to run "vercel login" first.');
}

// Deployment commands
console.log('\n🚀 Deployment Commands:');
console.log('   - Preview: vercel');
console.log('   - Production: vercel --prod');

console.log('\n📘 For detailed instructions, see VERCEL_DEPLOYMENT.md');
