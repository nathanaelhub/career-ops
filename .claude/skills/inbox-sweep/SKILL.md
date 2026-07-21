---
name: inbox-sweep
description: Full Gmail sweep across all 3 accounts — scan new job leads, reconcile status/rejection emails (including Nathanael's hand-applied Rejected/Applied labels) into the tracker, mark alert emails read, and output a triaged lead list. Use for "check my email for leads", "run the sweep", or the recurring scan ritual.
user_invocable: true
argument-hint: "[since YYYY/MM/DD]  (default: auto from data/last-sweep.txt)"
---

# inbox-sweep — the weekly email pass

Runs the full established email ritual in one command. All tooling exists:
`scripts/gmail-scan.mjs`, `scripts/gmail-markread.mjs`, `scripts/gmail-read.mjs`
(direct Gmail API — do NOT depend on the gmail-* MCP servers, they cache stale tokens).

## Step 0 — Window + token check
- Window start: argument if given, else read `data/last-sweep.txt`, else 7 days ago.
- Probe with a tiny query (`newer_than:1d from:linkedin.com`). If `invalid_grant`:
  STOP and run the re-auth flow (see the `reauth-gmail` skill) before continuing.
  (Root cause: OAuth app in Testing mode → 7-day refresh-token expiry. Permanent fix
  is Publish App in Google Cloud console — remind the user if this recurs.)

## Step 1 — Leads scan
```
node scripts/gmail-scan.mjs 'after:{WINDOW} in:anywhere from:(linkedin.com OR indeed.com OR ziprecruiter.com OR builtin.com OR lensa.com OR glassdoor.com OR jobright.ai OR otta.com OR wellfound.com OR lever.co OR greenhouse.io OR ashbyhq.com OR jobleads.com OR joinhandshake.com OR ladders.com OR dice.com)'
```

## Step 2 — Status scan (two sources, both required)
a) Keyword scan, 14-day window:
```
node scripts/gmail-scan.mjs 'newer_than:14d in:anywhere (subject:("update on your application" OR "your application" OR "application status" OR "update from" OR interview OR "next steps") OR "move forward with other" OR "other candidates" OR "unfortunately" OR "not to move forward" OR "no longer under consideration") -from:(dailydev OR capitalone.com OR idnotify)'
```
b) **Label reconciliation** — list recent messages under the user's hand-applied labels
(IDs in `modes/_profile.md` → "Gmail labels" table). A message in a Rejected label is
user-confirmed evidence. Use `gmail.users.messages.list({labelIds:[...]})` via a small
node script modeled on scripts/gmail-scan.mjs.

## Step 3 — Tracker updates (evidence-based only)
- Read ambiguous email bodies with `scripts/gmail-read.mjs <acct> '<query>' 1` before deciding.
- UPDATE existing rows in `data/applications.md` for status changes (never add rows by edit).
- ADD rows only for untracked applications, via TSV in `batch/tracker-additions/` +
  `node merge-tracker.mjs` (canonical states from templates/states.yml; rejection date +
  quoted evidence phrase in notes).
- Ambiguous → flag to user, don't guess.

## Step 4 — Mark leads read
```
node scripts/gmail-markread.mjs '<same query as Step 1>'
```
Leaves LinkedIn News/editorial (`editors-noreply`) and human emails unread. NEVER mark
status/rejection/human emails read.

## Step 5 — Output + bookkeeping
- Write today's date to `data/last-sweep.txt`.
- Run `node verify-pipeline.mjs` (must be 0 errors).
- Report: (a) on-target lead list (company | role | source inbox), (b) noise summary with
  reasons, (c) tracker changes made, (d) flags needing the user.

## Noise filters (screen out, one-line mention only)
- Interns/co-ops (full-time search), staffing body-shops (TCS, Capgemini, PTI, Infinite,
  Washon, Redsun, Kforce...), defense/gov contractors (clearance/citizenship: Radiance,
  Leidos, Navarro, PSI, state gov), anything saying "no sponsorship", senior/staff/5+yr,
  aggregator digests (Lensa/Built In/Jobright), recurring reposts already tracked
  (check tracker before listing), obscure shell companies.
- Fit bar for "on-target": entry/junior Data/BI/Product Analyst, Analytics Engineer,
  Junior DS — per modes/_profile.md archetypes.
