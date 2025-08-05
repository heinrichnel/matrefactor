#!/bin/bash

# 🚀 Netlify Simple Deployment Script
# This script deploys the sidebar test to Netlify

echo "🚀 Matanuska Fleet Management - Netlify Simple Deployment"
echo "========================================================"

# Make sure the deployment preview exists
if [ ! -d "deploy-preview" ]; then
    echo "❌ Error: deploy-preview directory not found"
    echo "Please run ./create-deployment-preview.sh first"
    exit 1
fi

# Create deployment package
echo "📦 Creating deployment package..."
mkdir -p netlify-deploy
cp -r deploy-preview/* netlify-deploy/

# Check if netlify-cli is installed
if ! command -v netlify &> /dev/null; then
    echo "⚙️ Installing Netlify CLI..."
    npm install -g netlify-cli
fi

# Deploy to Netlify
echo "🌐 Deploying to Netlify..."
cd netlify-deploy
netlify deploy --dir=. --prod

echo ""
echo "🎉 Deployment script completed!"
echo "Visit the URL above to see your deployed sidebar test"
