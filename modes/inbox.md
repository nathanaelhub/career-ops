# Mode: inbox -- Email Sweep (Gmail) → Pipeline / Tracker / Follow-ups

## Purpose

Sweep one or both Gmail inboxes and fold the results into the existing career-ops
pipeline. One pass does three jobs:

1. **Leads** — recruiter outreach and job-alert emails → extract role URLs → append to `data/pipeline.md` (which `pipeline` mode then evaluates).
2. **Confirmations / status** — application receipts, recruiter replies, interview invites, rejections → update the matching row in `data/applications.md`.
3. **Follow-ups** — cross-reference aging applications and draft (never send) nudges.

This mode is **read + draft only**. It NEVER sends, deletes, or archives mail
without the user explicitly approving each action first. See "Ethical Use" in
`AGENTS.md` — the same review-before-send rule applies to every email here.

## Tooling — which Gmail tools to use

This mode is tool-agnostic. Use whichever Gmail MCP tools are available in the session:

- **Two-account ArtyMcLabin servers** (preferred — richer feature set): tools are namespaced per account, e.g. `gmail-school` and `gmail-personal`. Sweep BOTH unless the user names one. These also support filters, attachments, and direct send — but per the rule above, drafts only.
- **Built-in `claude.ai` Gmail connector** (`mcp__claude_ai_Gmail__*`): single logged-in account, draft-only by design. Use this when the ArtyMcLabin servers aren't connected yet (e.g. before OAuth setup is finished).

If no Gmail tools are present at all, tell the user to finish setup (`docs/gmail-integration.md`) and stop.

When sweeping two accounts, label every finding with its source account so the user knows which inbox it came from.

## Inputs

- Gmail (via MCP tools above)
- `data/pipeline.md` — pending-URL inbox (leads land here)
- `data/applications.md` — tracker (status updates land here)
- `config/profile.yml` + `modes/_profile.md` — search queries, account labels, targeting
- `cv.md` — proof points for follow-up drafts
- `followup-cadence.mjs` — cadence engine for the follow-up step

## Search queries

Defaults below. The user can override them under `## Inbox Automation` in `modes/_profile.md`.
Run each query with the search tool (`search_threads` / equivalent), newest first.

| Bucket | Default Gmail query |
|--------|---------------------|
| Leads (recruiter + alerts) | `newer_than:14d -in:spam -in:chats (from:(linkedin.com OR indeed.com OR ziprecruiter.com OR hi.wellfound.com OR otta.com OR builtin.com OR lever.co OR greenhouse.io OR ashbyhq.com) OR subject:(opportunity OR "we're hiring" OR "hiring" OR "role at" OR "job alert" OR "matches your"))` |
| Confirmations | `newer_than:45d subject:("application received" OR "thank you for applying" OR "we received your application" OR "application to")` |
| Status / replies | `newer_than:90d ("next steps" OR "schedule" OR "interview" OR "unfortunately" OR "not moving forward" OR "move forward with other" OR "your application status")` |

Keep queries tight — quality over volume. If a query returns a flood, narrow `newer_than` or add the user's target-company names.

## Step 1 — Determine scope

- Args may name an account (`inbox school`, `inbox personal`) or a bucket (`inbox leads`, `inbox confirmations`, `inbox followups`). Default = all accounts, all buckets.
- State what you're about to sweep before you start (which accounts, which buckets, the date windows).

## Step 2 — Leads → pipeline

1. Run the **Leads** query on each in-scope account.
2. For each promising thread, read it (`get_thread`) and extract any job-posting URL(s). Prefer canonical ATS links (greenhouse/ashby/lever/company careers) over tracking redirects — unwrap obvious redirect wrappers when the destination is visible.
3. De-dupe against URLs already in `data/pipeline.md` AND against `data/scan-history.tsv` and existing rows in `data/applications.md`. Skip anything already known.
4. Append new finds to `data/pipeline.md` under `## Pendientes` in the existing row format:
   `- [ ] {URL} | {Source} | {role/company note}`
   Use `Source` = `email:{account}` (e.g. `email:school`) so the origin is traceable.
5. Plain job-alert digests with many roles: list them for the user and ask which to add rather than dumping every link.

Do **not** auto-evaluate here. Leads flow through the normal `pipeline` mode so scoring, legitimacy checks, and the ethical gate all still apply.

## Step 3 — Confirmations / status → tracker

1. Run the **Confirmations** and **Status** queries on each in-scope account.
2. For each thread, identify company + role and match it to an existing row in `data/applications.md` (fuzzy match on company + role; if ambiguous, ask).
3. Propose status transitions using canonical states (`templates/states.yml`) — show the user the email evidence and the proposed change before editing:
   - Application receipt for a row still `Evaluated` → suggest `Applied` (only if the user actually applied; confirm).
   - Recruiter reply / "next steps" → `Responded`.
   - Interview invite / scheduling → `Interview`.
   - "Unfortunately…" / "not moving forward" → `Rejected`.
4. After the user confirms, update **only** the status/notes of the existing row (never add a new row here — that's the pipeline's job via `merge-tracker.mjs`). Put the date in the date column, evidence summary in notes.
5. If a confirmation references a role with no tracker row, flag it — it may be an application made outside career-ops; offer to add it via the pipeline.

## Step 4 — Follow-ups (draft only)

1. Run `node followup-cadence.mjs`, parse the JSON (see `modes/followup.md` for the schema).
2. Cross-reference with what the sweep found: if Step 3 shows the company already replied, do NOT draft a generic nudge — switch to the appropriate response (thank-you, scheduling reply).
3. For overdue/urgent entries with no reply found, draft follow-ups using the framework in `modes/followup.md` (lead with value, never "just checking in", under 150 words, use the candidate name from `config/profile.yml`).
4. Present every draft for review. On the ArtyMcLabin servers you may save these as Gmail drafts (`create_draft`) so they're ready in the right account — but **stop before send**. Record sent follow-ups only after the user confirms they actually sent them (per `modes/followup.md` Step 5).

## Step 5 — Summary

Report what changed and what needs the user:

```
Inbox Sweep — {date}   ({accounts swept})

Leads:         {N} new → data/pipeline.md   (run /career-ops pipeline to evaluate)
Confirmations: {N} status updates applied
Follow-ups:    {N} drafts ready for review (in {account} Drafts / shown above)
Flags:         {anything ambiguous needing a decision}
```

Then suggest the obvious next step (usually `/career-ops pipeline` to process the new leads).

## Guardrails

- Read + draft only. Never send, delete, archive, or mark-as-read without explicit per-item approval.
- Never invent a status change without email evidence shown to the user.
- Never add tracker rows directly (pipeline + `merge-tracker.mjs` own that path).
- Respect the quality-over-quantity ethic: surface genuine matches, don't manufacture activity.
