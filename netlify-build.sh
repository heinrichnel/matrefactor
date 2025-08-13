#!/usr/bin/env bash
# Netlify build script (hardened)
# - Auto-detects npm/yarn/pnpm (and Yarn v1 vs Berry)
# - Fails fast with clear exit codes
# - Verifies publish dir and index.html
# - Prints actionable debug info

set -Eeuo pipefail
IFS=$'\n\t'
# set -x  # uncomment for verbose debug

ROOT_DIR="$(pwd -P)"

echo "=== Build Environment Debug ==="
echo "PWD: $(pwd)"
echo "Node: $(node --version 2>/dev/null || echo 'missing')"
echo "NPM:  $(npm --version 2>/dev/null || echo 'missing')"
command -v corepack >/dev/null 2>&1 && corepack enable || true
echo

echo "=== Directory contents ==="
ls -la
echo

echo "=== Checking for package.json ==="
APP_DIR="$ROOT_DIR"
if [[ ! -f "package.json" ]]; then
  echo "❌ package.json NOT found in $(pwd)"
  echo "Searching repo (excluding Netlify internal plugin dirs):"
  PKG_CANDIDATES=()
  mapfile -t PKG_CANDIDATES < <(find . -maxdepth 3 -name "package.json" -type f \
    -not -path "./.netlify/plugins/*" 2>/dev/null | sort)
  if ((${#PKG_CANDIDATES[@]} > 0)); then
    printf '  %s\n' "${PKG_CANDIDATES[@]}"
    PREFERRED=""
    for p in "./app/package.json" "./frontend/package.json" "./web/package.json"; do
      if printf '%s\n' "${PKG_CANDIDATES[@]}" | grep -Fxq "$p"; then
        PREFERRED="$p"; break
      fi
    done
    TARGET_PKG="${PREFERRED:-${PKG_CANDIDATES[0]}}"
    APP_DIR="$(cd "$(dirname "$TARGET_PKG")" && pwd -P)"
    echo "➡️  Using package.json at: $APP_DIR/package.json"
    cd "$APP_DIR"
  else
    echo "⚠️ No package.json found in repository. Skipping install/build and relying on prebuilt artifacts, if any."
  fi
fi

if [[ -f "package.json" ]]; then
  echo "✅ package.json found: $(node -p 'require("./package.json").name' 2>/dev/null || echo 'unknown')"
else
  echo "⚠️ Still no package.json in $(pwd)."
fi
echo

# ---- Choose package manager -------------------------------------------------
PKG_MGR="npm"
YARN_FLAVOR="" # v1 or berry
if [[ -f "pnpm-lock.yaml" ]]; then
  PKG_MGR="pnpm"
  command -v corepack >/dev/null 2>&1 && corepack prepare pnpm@latest --activate || true
  pnpm -v || true
elif [[ -f "yarn.lock" ]]; then
  PKG_MGR="yarn"
  # Detect Yarn lock flavor
  if grep -qE '^# yarn lockfile v1' yarn.lock; then
    YARN_FLAVOR="v1"
    # Yarn v1 usually preinstalled; avoid forcing Berry
    yarn -v || true
  else
    YARN_FLAVOR="berry"
    command -v corepack >/dev/null 2>&1 && corepack prepare yarn@stable --activate || true
    yarn -v || true
  fi
fi
echo "Using package manager: $PKG_MGR ${YARN_FLAVOR:+($YARN_FLAVOR)}"
echo

# ---- Log scripts for visibility --------------------------------------------
if [[ -f "package.json" ]]; then
  echo "=== package.json scripts ==="
  node -e 'console.log(JSON.stringify(require("./package.json").scripts, null, 2))' || true
  echo
fi

# ---- Install dependencies ---------------------------------------------------
if [[ -f "package.json" ]]; then
  echo "=== Installing dependencies ==="
  case "$PKG_MGR" in
    pnpm)
      pnpm install --frozen-lockfile
      ;;
    yarn)
      if [[ "$YARN_FLAVOR" == "berry" ]]; then
        yarn install --immutable
      else
        yarn install --frozen-lockfile
      fi
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
  echo
else
  echo "⏭️  Skipping dependency install (no package.json)."
fi

# ---- Optional: TypeScript typecheck (noEmit) -------------------------------
if [[ -f "tsconfig.json" ]]; then
  echo "=== TypeScript typecheck (noEmit) ==="
  if ! npx -y tsc --noEmit; then
    echo "⚠️ TypeScript typecheck failed; continuing with build (non-fatal)."
  fi
  echo
fi

# ---- Build -----------------------------------------------------------------
if [[ -f "package.json" ]]; then
  echo "=== Building application ==="
  case "$PKG_MGR" in
    pnpm) pnpm run build ;;
    yarn) yarn build ;;
    npm)  npm run build ;;
  esac
  echo
else
  echo "⏭️  Skipping build (no package.json)."
fi

# If we built from a subdirectory, copy common output dirs back to repo root/dist
if [[ "$APP_DIR" != "$ROOT_DIR" ]]; then
  echo "=== Syncing build output to repo root ==="
  CANDIDATES=("dist" "out" "build")
  SYNCED=0
  for candidate in "${CANDIDATES[@]}"; do
    if [[ -d "$candidate" ]]; then
      echo "Found $candidate in $PWD; syncing to $ROOT_DIR/dist"
      mkdir -p "$ROOT_DIR/dist"
      if command -v rsync >/dev/null 2>&1; then
        rsync -a --delete "$candidate/" "$ROOT_DIR/dist/"
      else
        rm -rf "$ROOT_DIR/dist"
        mkdir -p "$ROOT_DIR/dist"
        cp -R "$candidate/." "$ROOT_DIR/dist/"
      fi
      SYNCED=1
      break
    fi
  done
  if [[ "$SYNCED" -eq 0 ]]; then
    echo "⚠️ No known output directory (dist/out/build) found in $APP_DIR; nothing to sync."
  fi
  cd "$ROOT_DIR"
fi

# ---- Detect publish dir -----------------------------------------------------
PUBLISH_DIR="${NETLIFY_PUBLISH_DIR:-$ROOT_DIR/dist}"

if [[ ! -d "$PUBLISH_DIR" ]]; then
  for candidate in "$ROOT_DIR/out" "$ROOT_DIR/build" "$ROOT_DIR/.next"; do
    if [[ -d "$candidate" ]]; then
      PUBLISH_DIR="$candidate"; break
    fi
  done
fi

echo "=== Build output check ==="
if [[ -d "$PUBLISH_DIR" ]]; then
  echo "✅ Will publish from: $PUBLISH_DIR   (Netlify publish = 'dist' in netlify.toml)"
  ls -la "$PUBLISH_DIR" | sed 's/^/  /'
  echo
  echo "=== Tree (depth 2) ==="
  find "$PUBLISH_DIR" -maxdepth 2 -type f | sed 's/^/ - /' || true
  echo

  if [[ -f "$PUBLISH_DIR/index.html" ]]; then
    echo "✅ $PUBLISH_DIR/index.html exists"
  else
    echo "⚠️ $PUBLISH_DIR/index.html missing — if this is a Vite/CRA SPA, verify build.outDir and success."
  fi
else
  echo "❌ Publish directory not found."
  echo "PWD: $(pwd)"
  echo "Contents:"; ls -la
  echo "Attempting fallback: synthesize $ROOT_DIR/dist from root assets if available."
  if [[ -f "$ROOT_DIR/index.html" ]] || [[ -d "$ROOT_DIR/public" ]]; then
    rm -rf "$ROOT_DIR/dist" && mkdir -p "$ROOT_DIR/dist"
    [[ -f "$ROOT_DIR/index.html" ]] && cp "$ROOT_DIR/index.html" "$ROOT_DIR/dist/index.html"
    [[ -d "$ROOT_DIR/public" ]] && cp -R "$ROOT_DIR/public" "$ROOT_DIR/dist/" || true
    if [[ -d "$ROOT_DIR/dist" ]]; then
      echo "✅ Fallback dist created."; PUBLISH_DIR="$ROOT_DIR/dist"
    fi
  else
    echo "Consider setting NETLIFY_PUBLISH_DIR or verifying your build output directory."
    echo "⚠️ Continuing without a publish directory; deploy may fail if no output is produced."
  fi
fi
echo

echo "=== Netlify env snapshot (VITE_*, FIREBASE_*, WIALON_*, GOOGLE_MAPS*, NODE_) ==="
env | grep -E '^(VITE_|FIREBASE_|WIALON_|GOOGLE_MAPS_|NODE_)' || true
echo "=== Build script completed ==="
