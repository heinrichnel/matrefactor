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
        echo ""
        echo "=== Dist tree (depth 2) ==="
        find dist -maxdepth 2 -type f | sed 's/^/ - /'
        echo ""
        if [ -f "dist/index.html" ]; then
            echo "✅ dist/index.html exists"
        else
            echo "❌ dist/index.html missing"
            exit 2
        fi
else
        echo "❌ dist directory not found"
        echo "Current directory is: $(pwd)"
        echo "Contents:"
        ls -la
        exit 3
fi

echo ""
echo "=== Netlify env snapshot (VITE_*) ==="
env | grep -E '^(VITE_|NODE_|GOOGLE_MAPS_API_KEY|FIREBASE_)' || true
echo "=== Build script completed ==="
