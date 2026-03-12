#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────
#  setup-hosts.sh
#  Adds nachiket.ux → 127.0.0.1 to /etc/hosts
#  Usage: sudo bash scripts/setup-hosts.sh
# ─────────────────────────────────────────────────────────────

HOSTS_FILE="/etc/hosts"
ENTRY="127.0.0.1    nachiket.ux"
MARKER="# nachiket.ux local domain"

echo ""
echo "  🌐 nachiket.ux — Hosts File Setup"
echo "─────────────────────────────────────"

# Check if already added
if grep -q "nachiket.ux" "$HOSTS_FILE"; then
  echo "  ✅ nachiket.ux is already in $HOSTS_FILE"
  echo ""
  grep "nachiket.ux" "$HOSTS_FILE"
  echo ""
  exit 0
fi

# Check for root
if [ "$EUID" -ne 0 ]; then
  echo "  ❌ Please run with sudo:"
  echo "     sudo bash scripts/setup-hosts.sh"
  echo ""
  exit 1
fi

# Add entry
echo "" >> "$HOSTS_FILE"
echo "$MARKER" >> "$HOSTS_FILE"
echo "$ENTRY" >> "$HOSTS_FILE"

echo "  ✅ Added to $HOSTS_FILE:"
echo "     $ENTRY"
echo ""
echo "  Now run: sudo node server.js"
echo "  Then open: http://nachiket.ux"
echo ""
