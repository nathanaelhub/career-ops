---
name: reauth-gmail
description: Recover from Gmail OAuth token expiry (invalid_grant) — re-authorize all three accounts (school, personal, personal2) sequentially with browser sign-in URLs. Use when Gmail scans fail with invalid_grant.
user_invocable: true
argument-hint: "[school | personal | personal2]  (default: all three)"
---

# reauth-gmail — 3-account OAuth recovery

**Root cause**: the OAuth consent screen is in Testing mode → Google expires refresh
tokens after 7 days. **Always remind the user of the permanent fix**: Google Cloud
console → APIs & Services → OAuth consent screen → **Publish App** (30 seconds, ends
this ritual forever). Until then, this flow re-auths in ~2 minutes.

## Flow (sequential — the callback server binds one port)
For each account in [school → personal → personal2] (or just the one given as argument):

1. Launch in background: `./gmail-auth.sh {account}` (uses the 127.0.0.1:3000 callback —
   IPv4 on purpose; `localhost` can resolve to ::1 and hit a dev server on *:3000).
2. Grep the task output for "visit this URL" and show it to the user with WHICH email
   to sign in with:
   - school → njjohnson1@mail.lipscomb.edu
   - personal → nathanaeljdj@gmail.com
   - personal2 → nathanaeljdjohnson@gmail.com
3. Wait for the background task to complete (token saved to
   `~/.gmail-mcp/{account}/credentials.json`), then launch the next account.

## Verify
After all accounts: probe each with a tiny query via `scripts/gmail-scan.mjs`
(`newer_than:1d from:linkedin.com`) — all three sections must not show `invalid_grant`.

## Gotchas learned the hard way
- Port 3000 conflict: if the callback lands on a Next.js dev server, the token never
  saves — the 127.0.0.1 redirect in gmail-auth.sh already fixes this; don't kill the
  user's dev server.
- The gmail-* MCP servers cache tokens at startup: after re-auth they still fail until
  Claude Code restarts. Use the direct-API scripts (scripts/gmail-*.mjs) instead.
- "access_denied" at Google = the email isn't listed as a Test user on the consent
  screen — have the user add it there.
