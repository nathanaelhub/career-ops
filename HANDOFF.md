# HANDOFF — career-ops session wrap-up (2026-10-26)

## ⚠️ Machine-move critical first
The live job-search data is **gitignored and will NOT arrive via git clone/pull**:
`data/applications.md` (tracker, ~419 rows), `data/pipeline.md` (inbox), `data/scan-history.tsv`,
`data/discard.log`, `data/follow-ups.md`, `data/scan-runs.tsv`, `output/` (generated CVs), `jds/`.
**Copy the entire `~/GitHub/career-ops` directory to the new computer** (or at minimum the `data/`,
`output/`, and `jds/` folders on top of a clone). Also verify `cv.md`, `config/profile.yml`,
`modes/_profile.md`, `modes/_custom.md`, `portals.yml` arrived (`git ls-files <file>` shows if tracked).

## a) What this project and session were about
career-ops: AI job-search pipeline (scanner → triage → evaluation reports → tailored CV/PDF →
tracker → follow-ups) for **Nathanael Johnson** — M.S. Applied AI (Lipscomb, Aug 2025), F-1 OPT,
**needs future H-1B sponsorship**, Nashville TN, targeting entry-level Data/BI/Product Analyst,
Junior DS/Applied AI, Analytics Engineer ($70–95K target; new-grad DS bands above that are fine).
Recent sessions (Oct 16–24): triaged the 135-row pending inbox, ran a parallel evaluation batch,
prepared the Pinterest application, and ranked the next apply candidates.

## b) Finished
- **Triage (10/16):** 135 pending → 116 deterministic drops (logged to `data/discard.log` with
  reasons) → 19 shortlist → 8 sent to parallel evaluators.
- **Evaluations merged into tracker** (reports in `reports/`, all with archived JDs):
  - #435 Pinterest Master's Univ Grad DS — **4.1/5 APPLY** (evaluated by parallel Desktop session;
    package in `~/Desktop/Apply'26/Applys/Pinterest-DataScientist/`)
  - #438 Pinterest Grad MLE 3.0 (JD says apply once — spend it on #435)
  - #441 Brex DS II 2.8 · #440 Cohere Health DS II 2.6 · #439 Block BI Analyst 2.3 (hidden senior
    recon role) · #442 Datalab USA 1.8 **SKIP** (JD refuses F-1 OPT/H-1B by name) ·
    #437 UIC AI.Health4All 1.6 (PhD minimum) · #443 Stripe DA NYC 1.6 (6+ yrs; folded into row #178)
  - Slot 436 released (duplicate of #435).
- **Applications recorded Applied 10/16:** Medpace #408, Block DS Payments #434, AppLovin #430
  (follow-ups seeded: #434 due 10/23, #430 due 10/22, #408 seeded).
- **Claude Desktop apply prompt** for Pinterest written:
  `~/Downloads/claude-desktop-apply-prompt-2026-10-16-pinterest.md` (user ran it 10/16).
- Pipeline health: `verify-pipeline.mjs` 0 errors (44 pre-existing warnings).

## c) In progress / unfinished
1. **Pinterest #435 status unconfirmed.** Tracker still says `Evaluated`. User ran the Desktop
   apply flow 10/16 but never confirmed clicking Submit. Ask; if submitted:
   `node set-status.mjs 435 Applied --note "submitted {date}"` then `node followup-seed.mjs 435`.
2. **career-ops update v1.36.0 → v1.38.0 available, not applied** (user hadn't answered the prompt).
   `node update-system.mjs apply --confirm` when approved. After updates, Playwright may need
   `npx playwright install chromium`.
3. **Pending inbox refilled to 58 rows** (a Nashville-local wave arrived between sessions).
   Ranked add-list proposed 10/24, awaiting go-ahead to evaluate:
   Trilliant Health Healthcare Strategy Analyst, HCA BI Analyst II / DS II / Product Analyst II,
   Premise Health Analytics Engineering Analyst, EnableComp Data Analyst (Databricks, remote),
   Pillsbury Analyst–AI Applications, BMI Business Analyst Revenue Intelligence,
   Affirm Analyst Early Career, Roblox Ops & Analytics Associate, Lyft Data Analyst NYC.
   Deprioritized: Stripe FDE (6-yr pattern), Thatch (stale), Cohere Pricing (prior reject),
   intern wave (user has graduated), Amazon/BofA ops rows (off-domain).
4. **Medpace R/Python programming assessment prep** — gates their interview stage (applied 10/16);
   prep doc never built (describe/classify/predict tasks, R + pandas idioms).
5. **URL dedup inactive** — tracker has no URL column. Run `node merge-tracker.mjs --backfill-urls`
   (idempotent, supports `--dry-run`) to enable the deterministic dedup tier.
6. **Follow-up debt:** Affirm #390 silent since early Sep; BMI #426 (applied 10/6); others cold.
   User previously said skip drafting — check `node followup-cadence.mjs --summary` before raising.
7. **Observation log:** 20+ open entries at `~/.claude/skill-observations/observation-log/`,
   never reviewed (`last-review-date.txt` = never).

## d) Exact next steps (in order)
1. Confirm Pinterest #435 submission → set Applied + seed follow-up (commands above).
2. Ask about applying the v1.38.0 update.
3. On go-ahead: reserve report numbers (`node reserve-report-num.mjs --count N`) and run parallel
   evaluators on the ranked Nashville + Affirm list (same worker brief as reports 437–443: canonical
   ATS liveness check, verbatim sponsorship language, header-row TSV to `batch/tracker-additions/`,
   STOP before any submission). Then `node merge-tracker.mjs` and close pipeline rows.
4. Build Medpace assessment prep doc.
5. Triage the remaining ~47 un-shortlisted pending rows with the two-pass playbook (deterministic
   drops logged to `data/discard.log`, then judgment shortlist).

## e) Commands to run / test
- Health: `node verify-pipeline.mjs` · `node doctor.mjs --json` · `node stats.mjs --summary`
- Update check: `node update-system.mjs check`
- Scan: `/career-ops scan` (or `node scan.mjs`); LinkedIn complement: `/linkedin-scan` skill
- Liveness: `node check-liveness.mjs --file <urls-file>` (write output to a file, never pipe to tail)
- JD fetch: `node fetch-jd.mjs <url>` (Greenhouse/Lever/Ashby/Workday)
- Tracker writes: `node set-status.mjs <#|company> <State> [--note] [--force]`; adds via header-row
  TSV in `batch/tracker-additions/` + `node merge-tracker.mjs` — never hand-edit the table
- CV render: durable template `scripts/cv-template-nathanael.html` ({{SUMMARY}}/{{COMPETENCIES}}
  placeholders) → `node generate-pdf.mjs output/<slug>.html output/<slug>-DATE.pdf --format=letter
  --max-pages=1 --strict-pages` (HTML must live inside the repo)
- Parallel evals: `node reserve-report-num.mjs --count N` / `--release A-B`

## f) Outside the repo (names only, no values)
- **Apply packages:** `~/Desktop/Apply'26/Applys/{Company}/` — CamelCase folders,
  "Nathanael Johnson - Resume - {Company}.pdf"; essays/form answers saved there too.
- **Desktop prompt:** `~/Downloads/claude-desktop-apply-prompt-2026-10-16-pinterest.md`.
- **Auto-memory:** `~/.claude/projects/-Users-nathanaeljohnson-GitHub-career-ops/memory/`
  (MEMORY.md index + memory files — copy to keep assistant context).
- **Observation workspace:** `~/.claude/skill-observations/`.
- **Gmail OAuth:** `gmail-auth.sh` (custom port fix, committed); env `GMAIL_AUTH_PORT` (default 3456
  to avoid Next.js :3000 collision); Google OAuth client credential/token files it manages
  (regenerate on the new machine — draft-only policy, never send).
- **Env overrides (currently unset, defaults in use):** `CAREER_OPS_ROOT`, `CAREER_OPS_DATA_DIR`,
  `CAREER_OPS_TRACKER`.
- **Playwright chromium** (`npx playwright install chromium` on the new machine).
- **Git remotes:** origin `nathanaelhub/career-ops` (fork), upstream `career-ops-hq/career-ops`.
- **House rules live in** `modes/_custom.md` + auto-memory: CV email always nathanaeljdj@gmail.com
  (never school email); never submit applications (user clicks); work-auth answers always truthful
  (authorized Yes via EAD / sponsorship Yes / citizen-combined No); aggregator listings UNCONFIRMED
  until found at employer ATS; req IDs in tracker notes for same-title reqs.
