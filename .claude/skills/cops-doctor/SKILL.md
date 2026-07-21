---
name: cops-doctor
description: One-command health check for career-ops — runs the doctor, CV sync check, tracker dedup, application liveness, and pattern analysis, then summarizes what's healthy and what needs attention. Use to audit the system state before/after a batch of applications.
user_invocable: true
argument-hint: "[quick | full]  (default: quick)"
---

# cops-doctor — career-ops health check

Wraps the existing maintenance scripts into a single pass so you don't have to
remember each npm command. All scripts already exist in package.json.

## Mode: quick (default)
Run in order, capture output, keep going if one fails (report it, don't abort):

1. `npm run doctor`        — overall system/config check (doctor.mjs)
2. `npm run sync-check`    — CV ↔ generated artifacts consistency (cv-sync-check.mjs)
3. `npm run dedup`         — duplicate entries in the tracker (dedup-tracker.mjs)

## Mode: full
Everything in quick, plus:

4. `npm run liveness`      — are tracked job postings still live? (check-liveness.mjs)
5. `npm run patterns`      — application/outcome pattern analysis (analyze-patterns.mjs)
6. `npm run validate:portals` — portal config still valid (validate-portals.mjs)

## Report
Summarize as a short table:

| Check | Status | Notes |
|-------|--------|-------|
| doctor | ✅ / ⚠️ / ❌ | <one line> |
| sync-check | … | … |
| dedup | … | <N duplicates found / clean> |

Then list **action items** only (skip the all-clear ones). If `dedup` or
`sync-check` found fixable issues, offer to run the corresponding fix
(`npm run normalize` / `npm run merge`) — but ask before mutating tracker data.

## Guardrails
- These are read/diagnostic scripts; the fix scripts (`normalize`, `merge`,
  `update`) mutate data — never run those without explicit confirmation.
- Run from the career-ops repo root so the scripts find `data/`.
