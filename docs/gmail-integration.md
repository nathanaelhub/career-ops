# Gmail Inbox Integration

Sweeps your Gmail inbox(es) and folds the results into the career-ops pipeline:
recruiter emails and job alerts become pipeline leads, application confirmations and
recruiter replies update the tracker, and aging applications get follow-up drafts.

**Read + draft only.** Nothing is ever sent, deleted, or archived without you
approving it first. Follow-ups stop at a Gmail draft for your review.

## How it's wired

| Piece | Path | Layer |
|-------|------|-------|
| Mode logic | `modes/inbox.md` | custom (safe from updates) |
| Trigger + account/query config | `modes/_profile.md` → "Your Inbox Automation" | user (never auto-updated) |
| Router entry | `.agents/skills/career-ops/SKILL.md` (`inbox`) | symlinked from `.claude/skills/` |
| MCP servers | `.mcp.json` (`gmail-school`, `gmail-personal`) | project |
| Vendored server | `vendor/gmail-mcp-server/` | gitignored |
| OAuth helper | `gmail-auth.sh` | — |

Run it with `/career-ops inbox`, or just say "sweep my email for leads".

## Two Gmail tool paths

1. **Built-in `claude.ai` Gmail connector** (`mcp__claude_ai_Gmail__*`) — already
   live, single logged-in account, draft-only. Works **right now** with no setup.
   It is currently signed into the **personal** account (`nathanaeljdj@gmail.com`),
   so the inbox mode uses it as the `personal` source until the two-account
   ArtyMcLabin OAuth is finished. The **school** account
   (`njjohnson1@mail.lipscomb.edu`) is only reachable via the `gmail-school` server
   after OAuth — it is not connected through the built-in connector.
2. **ArtyMcLabin two-account servers** (`gmail-school`, `gmail-personal`) — the
   richer feature set (filters, attachments, threads, two accounts at once). Needs
   the one-time OAuth setup below.

---

## One-time setup for the two-account servers

The only part that can't be automated — it needs your Google login in a browser.

### 1. Create a Google Cloud OAuth client

1. Go to <https://console.cloud.google.com/> → create a project (e.g. "career-ops-gmail").
2. **APIs & Services → Library → Gmail API → Enable.**
3. **APIs & Services → OAuth consent screen:** External, fill the basics, and under
   **Test users** add BOTH Gmail addresses you'll connect (school + personal). (Leaving
   the app in "Testing" is fine — test users can authorize.)
4. **APIs & Services → Credentials → Create Credentials → OAuth client ID →
   Application type: Desktop app.** Create, then **Download JSON**.
5. Save that file as:
   ```
   ~/.gmail-mcp/gcp-oauth.keys.json
   ```
   (One OAuth client authorizes both accounts.)

> If you create a **Web** client instead of Desktop, also add
> `http://localhost:3000/oauth2callback` as an authorized redirect URI.

### 2. Authorize each account

From the repo root:

```bash
./gmail-auth.sh school      # sign in with njjohnson1@mail.lipscomb.edu
./gmail-auth.sh personal    # sign in with your personal Gmail
```

Each opens a browser. Tokens are written to
`~/.gmail-mcp/school/credentials.json` and `~/.gmail-mcp/personal/credentials.json`.

### 3. Load the MCP servers

Restart Claude Code so it picks up `.mcp.json`, and approve the `gmail-school` /
`gmail-personal` servers when prompted. Confirm with:

```bash
claude mcp list
```

You should see both servers connected.

### Rebuilding the vendored server (e.g. fresh clone)

```bash
git clone --depth 1 https://github.com/ArtyMcLabin/Gmail-MCP-Server.git vendor/gmail-mcp-server
cd vendor/gmail-mcp-server && npm install && npm run build
```

---

## Optional: read-only scopes

`gmail-auth.sh` requests full Gmail scope by default (needed to create drafts). To
lock an account to read-only, edit the helper to pass
`--scopes=gmail.readonly` to the `auth` command — but note draft-based follow-ups
will then be unavailable for that account.

## Recurring sweeps

To sweep automatically, set up a recurring run with the `/schedule` or `/loop`
skill, e.g. a `/career-ops inbox` every 2–3 days. Leads still flow through the
normal pipeline, so the ethical scoring gate always applies before anything is applied to.
