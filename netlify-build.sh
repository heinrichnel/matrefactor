#!/usr/bin/env bash
# Netlify build script (hardened)
# - Auto-detects npm/yarn/pnpm
# - Fails fast with clear exit codes
# - Verifies publish dir and index.html
# - Prints actionable debug info

set -Eeuo pipefail
IFS=$'\n\t'
set -x

echo "=== Build Environment Debug ==="
echo "PWD: $(pwd)"
echo "Node: $(node --version)"
echo "NPM:  $(npm --version || true)"
corepack enable || true
echo ""

echo "=== Directory contents ==="
ls -la
echo ""

echo "=== Checking for package.json ==="
if [[ ! -f "package.json" ]]; then
  echo "❌ package.json NOT found in $(pwd)"
  echo "Searching repo:"
  find . -maxdepth 3 -name "package.json" -type f 2>/dev/null || true
  exit 1
fi
echo "✅ package.json found: $(node -p 'require("./package.json").name')"
echo ""

# ---- Choose package manager -------------------------------------------------
PKG_MGR="npm"
if [[ -f "pnpm-lock.yaml" ]]; then
  PKG_MGR="pnpm"
  corepack prepare pnpm@latest --activate || true
  pnpm -v
elif [[ -f "yarn.lock" ]]; then
  PKG_MGR="yarn"
  corepack prepare yarn@stable --activate || true
  yarn -v
fi
echo "Using package manager: $PKG_MGR"
echo ""

# ---- Log scripts for visibility --------------------------------------------
echo "=== package.json scripts ==="
node -e 'console.log(JSON.stringify(require("./package.json").scripts, null, 2))'
echo ""

# ---- Install dependencies ---------------------------------------------------
echo "=== Installing dependencies ==="
case "$PKG_MGR" in
  pnpm)
    pnpm install --frozen-lockfile
    ;;
  yarn)
    yarn install --frozen-lockfile
    ;;
  npm)
    if [[ -f package-lock.json ]]; then
      npm ci
    else
      echo "No package-lock.json found; running npm install"
      npm install
    fi
    ;;
esac
echo ""

# ---- Optional: TypeScript typecheck (fast fail) -----------------------------
if [[ -f "tsconfig.json" ]]; then
  echo "=== TypeScript typecheck (noEmit) ==="
  npx tsc --noEmit
  echo ""
fi

# ---- Build ------------------------------------------------------------------
echo "=== Building application ==="
case "$PKG_MGR" in
  pnpm) pnpm run build ;;
  yarn) yarn build ;;
  npm)  npm run build ;;
esac
echo ""

# ---- Detect publish dir -----------------------------------------------------
# Default to Vite's dist/, but allow override via env or framework
PUBLISH_DIR="${NETLIFY_PUBLISH_DIR:-dist}"

# If dist doesn't exist, try common alternatives (Next.js / CRA)
if [[ ! -d "$PUBLISH_DIR" ]]; then
  for candidate in "out" "build" ".next"; do
    if [[ -d "$candidate" ]]; then
      PUBLISH_DIR="$candidate"
      break
    fi
  done
fi

echo "=== Build output check ==="
if [[ -d "$PUBLISH_DIR" ]]; then
  echo "✅ Publish directory: $PUBLISH_DIR"
  ls -la "$PUBLISH_DIR" | sed 's/^/  /'
  echo ""
  echo "=== Tree (depth 2) ==="
  find "$PUBLISH_DIR" -maxdepth 2 -type f | sed 's/^/ - /' || true
  echo ""

  # Heuristic: if it's a static SPA, we expect an index.html in top-level
  if [[ -f "$PUBLISH_DIR/index.html" ]]; then
    echo "✅ $PUBLISH_DIR/index.html exists"
  else
    # Not all frameworks produce top-level index.html (e.g., Next.js)
    # Only fail if we *expected* Vite/CRA output.
    if [[ "$PUBLISH_DIR" == "dist" || "$PUBLISH_DIR" == "build" ]]; then
      echo "❌ $PUBLISH_DIR/index.html missing — likely build did not produce a static SPA."
      echo "   Check framework and vite.config.ts 'build.outDir'."
      exit 2
    else
      echo "ℹ️ No index.html found, but publish dir is '$PUBLISH_DIR' (framework likely handles serving)."
    fi
  fi
else
  echo "❌ Publish directory not found."
  echo "PWD: $(pwd)"
  echo "Contents:"
  ls -la
  echo "Consider setting NETLIFY_PUBLISH_DIR or verifying your build output directory."
  exit 3
fi
echo ""

echo "=== Netlify env snapshot (VITE_*, FIREBASE_*, WIALON_*, GOOGLE_MAPS*) ==="
env | grep -E '^(VITE_|FIREBASE_|WIALON_|GOOGLE_MAPS_|NODE_)' || true
echo "=== Build script completed ==="
