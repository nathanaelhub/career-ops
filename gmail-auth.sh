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
GMAIL_OAUTH_PATH="$OAUTH_KEYS" GMAIL_CREDENTIALS_PATH="$CREDS" node "$SERVER" auth
echo "Done. Tokens saved to $CREDS"
