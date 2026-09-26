#!/bin/bash
# cPanel deploy step (see .cpanel.yml). Builds the client inside the cloned
# repo, then copies only code into the live app folder. The live
# server/data, server/uploads and server/.env are never touched, so
# deploying can't wipe content, images or secrets.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/.." && pwd)"
DEST="${DEPLOY_PATH:-$HOME/portfolio}"

# The deploy task runs without the Node.js App's environment, so find the
# newest Node that cPanel/CloudLinux has installed.
if ! command -v npm >/dev/null 2>&1; then
  for dir in $(ls -d /opt/alt/alt-nodejs*/root/usr/bin /opt/cpanel/ea-nodejs*/bin 2>/dev/null | sort -V -r); do
    if [ -x "$dir/npm" ]; then
      export PATH="$dir:$PATH"
      break
    fi
  done
fi
if ! command -v npm >/dev/null 2>&1; then
  echo "ERROR: npm not found — cannot build the client." >&2
  exit 1
fi
echo "Using node $(node --version) from $(command -v node)"

echo "Building client..."
cd "$REPO/client"
npm ci --no-audit --no-fund
npm run build

echo "Copying to $DEST..."
mkdir -p "$DEST/server" "$DEST/client"
rm -rf "$DEST/server/src" "$DEST/client/dist"
cp -R "$REPO/server/src" "$DEST/server/src"
cp "$REPO/server/package.json" "$REPO/server/package-lock.json" "$REPO/server/app.cjs" "$DEST/server/"
cp -R "$REPO/client/dist" "$DEST/client/dist"

# Server dependencies are installed with "Run NPM Install" in Setup Node.js
# App (CloudLinux keeps node_modules in its own virtualenv), so don't run
# npm install in $DEST here.

# Tell Passenger to restart the app on its next request.
mkdir -p "$DEST/server/tmp"
touch "$DEST/server/tmp/restart.txt"

echo "Deploy complete."
