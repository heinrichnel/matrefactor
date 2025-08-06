#!/bin/bash

# Netlify build debug script
echo "=== Build Environment Debug ==="
echo "Current directory: $(pwd)"
echo "Node version: $(node --version)"
echo "NPM version: $(npm --version)"
echo ""

echo "=== Directory contents ==="
ls -la
echo ""

echo "=== Checking for package.json ==="
if [ -f "package.json" ]; then
    echo "✅ package.json found"
    echo "Package name: $(node -p 'require("./package.json").name')"
else
    echo "❌ package.json NOT found"
    echo "Current working directory contents:"
    find . -name "package.json" -type f 2>/dev/null || echo "No package.json found anywhere"
    exit 1
fi
echo ""

echo "=== Installing dependencies ==="
npm ci
echo ""

echo "=== Building application ==="
npm run build
echo ""

echo "=== Build output ==="
if [ -d "dist" ]; then
    echo "✅ dist directory created"
    ls -la dist/
else
    echo "❌ dist directory not found"
    exit 1
fi
