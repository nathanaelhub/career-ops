#!/usr/bin/env bash
# gmail-auth.sh — one-time OAuth for each Gmail account used by the inbox feature.
#
# Prereq: ~/.gmail-mcp/gcp-oauth.keys.json must exist (Google Cloud OAuth
# Desktop-app client). See docs/gmail-integration.md for how to create it.
#
# Usage:
#   ./gmail-auth.sh <label>    # e.g. school, personal, personal2, work
#
# <label> is any short slug; tokens are written to ~/.gmail-mcp/<label>/credentials.json
# and the matching MCP server in .mcp.json should be named gmail-<label>.
# A browser window opens for Google login. Sign in with the matching account.

set -euo pipefail

ACCOUNT="${1:-}"
if [[ ! "$ACCOUNT" =~ ^[a-z0-9_-]+$ ]]; then
  echo "Usage: $0 <label>   (lowercase letters/digits/-/_ ; e.g. school, personal, personal2, work)" >&2
  exit 1
fi

SERVER="$(cd "$(dirname "$0")" && pwd)/vendor/gmail-mcp-server/dist/index.js"
OAUTH_KEYS="$HOME/.gmail-mcp/gcp-oauth.keys.json"
CREDS="$HOME/.gmail-mcp/$ACCOUNT/credentials.json"

if [[ ! -f "$OAUTH_KEYS" ]]; then
  echo "Missing $OAUTH_KEYS — create your Google Cloud OAuth client first (see docs/gmail-integration.md)." >&2
  exit 1
fi

mkdir -p "$HOME/.gmail-mcp/$ACCOUNT"
echo "Authorizing '$ACCOUNT' account → $CREDS"
# Use the 127.0.0.1 loopback callback (not localhost): the auth server binds
# 127.0.0.1 on purpose: "localhost" can resolve to IPv6 ::1 first and hit another
# process, breaking the OAuth redirect.
#
# Port: NOT 3000. Next.js 16 dev servers bind IPv4 127.0.0.1:3000 directly, which
# collides head-on (EADDRINUSE) — the old 127.0.0.1 trick only dodged the IPv6
# binding used by older Next versions. 3000 is the user's dev-server port and is
# never taken from them. GMAIL_AUTH_PORT overrides if 3456 is ever busy too.
# The vendored auth server derives its listen port from this URL (local patch).
# Desktop OAuth clients accept any loopback port, so no Google console change is needed.
AUTH_PORT="${GMAIL_AUTH_PORT:-3456}"
if command -v lsof >/dev/null 2>&1 && lsof -nP -iTCP:"$AUTH_PORT" -sTCP:LISTEN >/dev/null 2>&1; then
  echo "ERROR: port $AUTH_PORT is already in use. Re-run with GMAIL_AUTH_PORT=<free port>." >&2
  exit 1
fi
GMAIL_OAUTH_PATH="$OAUTH_KEYS" GMAIL_CREDENTIALS_PATH="$CREDS" node "$SERVER" auth "http://127.0.0.1:${AUTH_PORT}/oauth2callback"
echo "Done. Tokens saved to $CREDS"
