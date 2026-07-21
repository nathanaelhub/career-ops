---
name: cops-liveness
description: Batch-check job-posting URLs for dead/closed BEFORE building packages — cheap HTTP status sweep that catches 410/404 and "no longer available" pages, with a Firecrawl content-verify step for JS-rendered ATS. Use before a build batch, or to recheck a repost, so effort isn't wasted on dead postings.
user_invocable: true
argument-hint: "<url> [<url> ...]   OR   'ready'  (sweep tracker rows queued to package)"
---

# cops-liveness — dead-posting sweep

Postings die fast (ComPsych, MLC, Acosta, AF Group, Cotiviti, Wiley, Ascension,
Vanderbilt DSA all closed within days — several *after* full packages were built).
Run this **before** investing in packages, or to recheck a repost.

## Inputs
- One or more posting URLs, **or** the word `ready` to sweep the URLs on tracker
  rows that are `Evaluated` and queued to package (pull URLs from the row notes).

## Steps
1. **HTTP sweep** — cheap, catches most deaths:
   `node scripts/cops-liveness-urls.mjs <url> [<url> ...]`
   (or `--file urls.txt`). Returns JSON `{ url, status, verdict, signal }`:
   - `DEAD`  — HTTP 404/410/451, or a "no longer available / not accepting /
     job not found / position filled / posting expired" string in the body.
   - `LIVE`  — HTTP 200 with no closed signal (non-ATS pages).
   - `CHECK` — HTTP 200 on a **JS-rendered ATS** (Workday / Oracle Cloud / Taleo /
     iCIMS / SuccessFactors / Phenom). A 200 here is NOT proof of live — the
     "no longer available" text renders client-side.
2. **Resolve every `CHECK`** with a Firecrawl content read (do NOT trust the 200):
   `firecrawl_scrape` the URL with `waitFor: 8000` and read the description/body —
   if it says the job is no longer available / not accepting applications, mark
   `DEAD`; otherwise `LIVE`.
3. **Report** a short table (URL → LIVE / DEAD / and the signal). For any `DEAD`
   row that maps to a tracked posting, offer to flip it to `Discarded` (posting
   closed) — but ask before editing the tracker.

## Output
| Posting | Verdict | Signal |
|---------|---------|--------|
| Company – Role | ✅ LIVE / 🔴 DEAD | HTTP 410 / "no longer available" / … |

End with: **build packages only for the LIVE ones.** Note any repost that came
back LIVE (its package may already exist — reuse it).

## Guardrails
- Read-only: this skill never mutates the tracker. Flipping a dead row to
  `Discarded` requires explicit confirmation.
- Always Firecrawl-verify `CHECK` rows before calling a JS-ATS posting live or
  dead — the HTTP status is not decisive there.
- Run from the career-ops repo root.
