# HANDOFF — career-ops session (2026-10-23 → 2026-10-26)

> This repo is a **public** fork (`nathanaelhub/career-ops`), so this file leaves out personal details on purpose. Most of the user data it refers to (CV, tracker, pipeline, reports) is gitignored. **It is not in git and will not transfer by cloning.** See section F.

## A. What this project and session were about

career-ops is an AI job-search pipeline: portal scanning, offer evaluation, tailored CVs, a tracker, and follow-ups. It's a fork of santifer/career-ops. This session:

1. Updated the system from v1.34.0 to v1.36.0 (`update-system.mjs`).
2. Built a custom **LinkedIn discovery scanner** (`/linkedin-scan`), adapted from MadsLorentzen/ai-job-search (MIT). LinkedIn's guest endpoints are used for discovery only. Every hit has to be confirmed on the employer's own ATS before it's evaluated.
3. Ran it and resolved about 53 LinkedIn hits to their employers. Most were cut for visa sponsorship (F-1 OPT; any posting with "no sponsorship now or future", a citizenship requirement or a clearance is a hard discard) or for experience level.
4. Evaluated and packaged 2 roles:
   - #446 Optum Data Analyst, Payment Integrity (req 2381793), score 4.0
   - #447 VUMC BI Developer, TIPQC (R-68625), score 4.3
5. Wrote a Claude Desktop apply prompt and tested how far Claude Code can drive Claude Desktop through GUI automation.

## B. Finished

- v1.36.0 update applied and committed.
- `/linkedin-scan` skill, its script and its config are built and working (see F, these are untracked).
- `portals.yml` title exclusions now include `"Sr "` and `"Sr."`.
- Reports `reports/446-optum-2026-10-23.md` and `reports/447-vanderbilt-university-medical-center-2026-10-23.md`, each with its job description archived verbatim.
- Tracker rows #446 and #447 merged as `Evaluated`.
- Resume and cover letter packages in `~/Desktop/Apply'26/Applys/Optum-2381793/` and `~/Desktop/Apply'26/Applys/VUMC/`.
- HCA Product Analyst II (Job ID 5070275) and HCA BI Analyst II (CAMS, Job ID 4910999) were both confirmed live by Desktop. Both need 3+ years, so both are **skipped** in `data/pipeline.md`. Their job descriptions are saved in `Applys/HCAHealthcare/`.
- Follow-up drafts (Medpace #408, AppLovin #430, Block #431, BMI #426, the second and final one) were written by Desktop to the follow-ups file in `output/`.
- Block duplicate: #434 set to `Discarded` (duplicate of #431). Its follow-up reminder is cleared in `data/follow-ups.md`.
- `cv.md` summary changed from "two years" to "nearly two years" of BI work.
- This commit includes the data drift in `data/last-sweep.txt` and `data/pdf-index.tsv`.

## C. In progress / unfinished

- **Applications #446 (Optum, Taleo) and #447 (VUMC, Workday) are NOT submitted.** Both are stopped at sign-in in the Claude Desktop chat "Job application autofill". Claude won't type passwords or create accounts, and Desktop's built-in browser has no Google session.
- **Knockout answers:** paid corporate analytics experience comes to about 20 months by cv.md dates. Every "2+ years" knockout question gets a truthful No or "1–2 years", which may screen out Optum and possibly VUMC.
- **Possible CV accuracy fix:** BI internships alone add up to about 16 months. "Over a year" may be more accurate than "nearly two years" in the cv.md summary. Waiting on Nathanael's decision.
- **Follow-up drafts:** still contain `[Name]` placeholders, and none has been sent.
- **Also offered, not done:**
  - Fix the cv template's contact line, which wraps "Nashville,/TN".
  - Fix unreachable portals (dbt Labs, Agentic Engineering Jobs), using `verify-portals.mjs`.
  - Delete about 32 `.bak` files left by the updater.
  - Fill in `modes/_brief.md`.
  - Create a private backup repo for the custom skills.
  - Consider the v1.38.0 update, which another session reported as available.
- In the last GUI test, Desktop's message box held an unrelated unsent draft (about Saban Realty) from another session. It was left untouched.

## D. Exact next steps

1. Sign in to UHG Taleo and VUMC Workday yourself, or let Desktop use Claude in Chrome with your existing Google session and click "Sign in with Google" without entering a password. Then tell the Desktop chat "signed in, continue". It fills each form and stops before Submit.
2. Review each form and click Submit yourself. Then run:
   ```bash
   node set-status.mjs 447 Applied --note "Submitted YYYY-MM-DD via Workday; receipt yes/no"
   node set-status.mjs 446 Applied --note "Submitted YYYY-MM-DD via Taleo; receipt yes/no"
   ```
3. Fill in the `[Name]` placeholders in the follow-up drafts and send them yourself. Log each one in `data/follow-ups.md` and add a note with `set-status.mjs`.
4. Decide on the cv.md summary wording.
5. On the new machine, copy over everything in section F **before** running the updater. Otherwise the custom skills are lost.

## E. Commands

```bash
node update-system.mjs check            # update check (first thing each session)
node doctor.mjs --json                  # setup / onboarding check
node scan.mjs                           # ATS portal scan
node scripts/linkedin-scan.mjs --dry-run   # LinkedIn discovery preview (custom, untracked)
node scripts/linkedin-scan.mjs          # write hits to data/pipeline.md
node scripts/linkedin-scan.mjs detail <linkedin url|id>
node check-liveness.mjs <url>           # posting liveness
node fetch-jd.mjs <url>                 # JD text from a known ATS API
node reserve-report-num.mjs --count N   # reserve report numbers before parallel work
node merge-tracker.mjs                  # merge batch/tracker-additions/*.tsv
node set-status.mjs <#> <State> --note "..."   # the only way to change tracker rows
node scripts/cops-render.mjs <spec.json>       # one-page resume + cover PDF (custom, untracked)
node check-jd-archive.mjs --summary
node verify-pipeline.mjs                # health check
node test-all.mjs                       # full test suite
npm install && npx playwright install chromium  # fresh-machine setup
```

## F. Outside the repo / not in git (copy these to the new machine)

**Gitignored user data (repo root):** `cv.md`, `config/profile.yml`, `modes/_profile.md`, `modes/_custom.md`, `portals.yml`, `data/*` (tracker, pipeline, follow-ups, scan history, `linkedin-scan.yml`), `reports/`, `output/`, `jds/`, `interview-prep/`, `batch/tracker-additions/`.

**Untracked custom code** (listed in `.git/info/exclude`, so it isn't pushed and has no backup):
- `.claude/skills/{cops-doctor, cops-liveness, desktop-handoff, inbox-sweep, reauth-gmail, cv-preflight, package-cv, linkedin-scan}/`
- `scripts/cops-render.mjs`, `scripts/cops-liveness-urls.mjs`, `scripts/linkedin-scan.mjs`
- `.git/info/exclude` itself, which has to be recreated or the updater prunes these.

**Outside the repo:**
- `~/Desktop/Apply'26/Applys/` holds the application packages and saved form answers and JDs.
- `~/.claude/projects/-Users-nathanaeljohnson-GitHub-career-ops/memory/` holds Claude Code's auto-memory.
- The Claude Desktop chat "Job application autofill" is in the Claude account, so it's available on any machine.

**Services and credentials (names only):**
- Claude Code with MCP connectors: Firecrawl, Gmail, Google Calendar, Google Drive.
- Playwright MCP was registered at user scope (`claude mcp add playwright -s user -- npx -y @playwright/mcp@latest`) and needs re-adding on the new machine.
- GitHub `gh` CLI auth.
- Optional env vars: `CAREER_OPS_ROOT` / `CAREER_OPS_DATA_DIR` and `CAREER_OPS_TRACKER` (not set in this setup).
- No API keys are stored in the repo. Taleo, Workday and Google sign-ins are personal and never automated.
- macOS Accessibility permission is needed for any Code→Desktop GUI automation (osascript and CGEvent).
