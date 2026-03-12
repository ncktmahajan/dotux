#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  setup-ssl.sh
#  Generates local SSL certificates for nchikt.ux via mkcert
#  Usage: bash scripts/setup-ssl.sh
# ─────────────────────────────────────────────────────────────

SSL_DIR="$(dirname "$0")/../ssl"
mkdir -p "$SSL_DIR"

echo ""
echo "  🔒 nchikt.ux — HTTPS Setup with mkcert"
echo "─────────────────────────────────────────────"

# Check mkcert installed
if ! command -v mkcert &> /dev/null; then
  echo ""
  echo "  ❌ mkcert not found. Install it first:"
  echo ""
  echo "  macOS:   brew install mkcert"
  echo "  Linux:   apt install mkcert  OR  brew install mkcert"
  echo "  Windows: choco install mkcert  OR  scoop install mkcert"
  echo ""
  echo "  After install, run this script again."
  echo ""
  exit 1
fi

# Install local CA (one-time)
echo "  📋 Installing local CA..."
mkcert -install

# Generate certs for nchikt.ux
echo "  🔑 Generating certificate for nchikt.ux..."
cd "$SSL_DIR"
mkcert nchikt.ux

echo ""
echo "  ✅ Certificates created in /ssl:"
ls -la "$SSL_DIR"
echo ""
echo "  🚀 Now restart the server:"
echo "     sudo node server.js"
echo ""
echo "  Then open:  https://nchikt.ux"
echo ""
