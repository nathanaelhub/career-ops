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

---

# Addendum — concurrent session: portal coverage, email sweep, cap-exempt targeting

> Several sessions wrapped up at the same time and each wrote to this file, so the sections above
> may describe different work than this one. This addendum is self-contained. It made **no**
> submissions and **no** CV changes; every durable artifact it produced lives in **gitignored**
> files, so the machine-move warning at the top applies to it in full.

## A. What this session was about

Three threads: assess the 2026-10-14 LinkedIn data export, make HCA and Vanderbilt visible to the
scanner, and close an email-coverage gap. Then answer "what should I do next?" with evidence
instead of a task list.

## B. Finished

**Three new `portals.yml` entries** (gitignored — these will NOT transfer by cloning):

- **HCA Healthcare** — `scan_method: websearch`. The board is genuinely unscannable: postings are
  Jibe Apply but `careers.hcahealthcare.com` sits behind Cloudflare, bare HTTP returns 403 even with
  a browser UA, and Firecrawl's full stealth stack fails on both search and posting URLs (verified
  2026-10-16). The entry's note records this so a future session doesn't re-spend credits
  rediscovering it. **HCA liveness must be confirmed by a human in a real browser — never from a
  search snippet.**
- **Vanderbilt University Medical Center (VUMC)** — Workday provider,
  `vumc.wd1.myworkdayjobs.com/vumccareers`. Public CXS API verified live 2026-10-24: 900 postings,
  zero-auth, no Cloudflare.
- **Vanderbilt University** (campus) — `oraclecloud` provider,
  `ecsr.fa.us2.oraclecloud.com/.../sites/CX_1`. 133 postings, HTTP 200, zero-auth.
  **A different employer on a different ATS from VUMC — do not merge the two entries.**

The campus entry closed a silent gap: the disabled HigherEdJobs entry's note claimed university
coverage "continues via tracked_companies (Vanderbilt, Northwestern)", but no Vanderbilt entry had
ever existed — only Northwestern did. Vanderbilt was invisible to every scan that note was meant to
reassure about.

Validation after the edits: `audit-portals.mjs` ✅ on both Vanderbilt boards; `verify-pipeline.mjs`
**0 errors, 44 warnings** (the 44 are pre-existing soft `missing-jd-archive` notices on June/September
reports from the v1.36.0 update, unrelated to these edits).

**Scan run (recorded, not a dry run).** Both Vanderbilt boards: 1,033 postings → 7 past the
title/location/visa filters, now in `data/pipeline.md`. One genuine hit, already tracker **#447**.
The other six are five campus policy/research analyst roles (Policy Accelerator, Prenatal-to-3
Impact Center — weak archetype fit, not enterprise BI) plus a Real Estate Analyst, all unevaluated.

**Liveness, as of 2026-10-24 — NOT re-checked since, re-verify before acting:**
- #447 VUMC BI Developer TIPQC (R-68625) — **active** via the Workday API.
- #446 Optum Data Analyst Payment Integrity — **active** at the canonical URL from report 446.

**Email sweep.** Re-authorized all three Gmail accounts (`gmail-auth.sh`, port 3456) and swept
10/15 → 10/24. `school` and `personal2` both returned zero results, proving the nine-day quiet
period was genuine rather than a visibility artifact. `data/last-sweep.txt` → 2026/10/24.

**LinkedIn export.** The "zip" at `~/Downloads/Project Chronium/Basic_LinkedInDataExport_10-14-2026.zip`
is an already-extracted **directory**, not an archive. `Connections.csv` was copied to
`data/Connections.csv` (gitignored third-party PII; safe to delete after use). `linkedin-join.mjs`
joined 333 connections against 384 target companies: 30 companies have a connection, 58 people.
HCA is by far the strongest warm channel — 21 first-degree connections, 7 in analytics, 3 recruiters.

**HCA artifacts** in `~/Desktop/Apply'26/Applys/HCAHealthcare/`: two Peer-type outreach drafts
(no job ask, per `modes/contacto.md`), a triage of ~13 open Nashville reqs, and a self-contained
Claude Desktop prompt. The drafts are **unsent**.

## C. The strategic finding worth keeping

Of ~447 tracker rows, only ~13 (3%) went to cap-exempt-type employers — universities, academic
medical centers, nonprofits, where the H-1B lottery doesn't apply and sponsorship is routine. Yet
that 3% holds the two best scores in the entire tracker:

- **#275 VUMC Business Intelligence Analyst (R-57595) — 4.5/5**, the highest ever recorded.
  Nashville, <1yr experience. Its note reads: *"Workday account created but req closed before submit
  could complete."*
- **#447 VUMC BI Developer TIPQC — 4.3/5**, second highest. Packaged 2026-10-24, still unsent.

Add HCA **#360 Digital Product Analyst, 4.2/5**, which also closed before it was applied to. The
pattern: **the best-fitting roles this pipeline has ever found were lost to submission latency, not
rejection**, while 400+ applications went to cap-subject for-profits that mostly reject, ignore, or
exclude sponsorship outright. Lead generation is not the bottleneck — a full scan on 10/24 correctly
yielded zero new applications worth making. The bottleneck is the gap between *packaged* and *sent*,
and #447 is sitting in it at 4.3/5.

Carried forward: weight the search toward Nashville health systems and academic institutions as the
primary lane, not a side bet.

## D. Unfinished from this session

- **HCA outreach drafts written but unsent.** They link `github.com/nathanaelhub/clinic-no-show-recovery`
  deliberately — **not** the Streamlit demo, which is in an auth redirect loop.
- **HCA Digital Product Analyst repost** (LinkedIn `4480303904`, ~10/15) revives #360's 4.2/5 role
  and a CV already built at `output/cv-nathanael-johnson-hca-2026-07-21.pdf`. The Desktop prompt to
  resolve its canonical URL and HCA job ID was never run. If it is run, the result is a **new**
  tracker row referencing #360, not a revival — via TSV + `merge-tracker.mjs`, never a hand edit.
- **Six unevaluated scan rows** in `data/pipeline.md`. Low priority; not ahead of #447 and #446.
- **`dedup-tracker.mjs` can't see the Block #431/#434 duplicate** despite both carrying Greenhouse
  job id 5214784008 — the fuzzy matcher keys on company name and "Block" vs "Block (Square)" differ.
  Another session has since set #434 to `Discarded`, so this is now only a note on that blind spot.
- **An Indeed "Data Analyst" application submitted 2026-10-23 is untracked** — the receipt doesn't
  name the employer. Needs identification before it can get a row.
- **Google OAuth app is still unpublished**, so Gmail tokens lapse again around **2026-10-31** on the
  7-day Testing-mode refresh expiry. Publishing it is the permanent fix and is user-only.
- **`dbt Labs` and `Agentic Engineering Jobs`** boards unreachable for 3+ scan runs; need re-resolving.
- Still user-only and still gating conversion: redeploy the Streamlit demo publicly, and supply
  wording for the `medicare-cost-quality` CV swap.

## E. Exact next steps

1. **Submit #447 (VUMC, 4.3/5) first.** Cap-exempt, Nashville, PDFs ready in `Applys/VUMC/`.
   Re-verify liveness before filling anything:
   ```bash
   node check-liveness.mjs "https://vumc.wd1.myworkdayjobs.com/vumccareers/job/Nashville-TN/Business-Intelligence-Developer--TIPQC_R-68625-2"
   ```
   Two VUMC-caliber reqs have already died in this exact gap.
2. **Then #446 (Optum, 4.0/5)**, same pattern. After each submission:
   ```bash
   node set-status.mjs 447 Applied --note "Submitted YYYY-MM-DD via Workday; receipt yes/no"
   node set-status.mjs 446 Applied --note "Submitted YYYY-MM-DD via Taleo; receipt yes/no"
   ```
3. Send the two HCA outreach messages, then save the contacts when `contacto` offers.
4. Publish the Google OAuth app before 2026-10-31.
5. Re-point or disable the two dead boards: `node verify-portals.mjs` then `node audit-portals.mjs --summary`.

## F. Commands specific to this session

```bash
node audit-portals.mjs --company "Vanderbilt University" --summary   # content audit, per board
node audit-portals.mjs --json > /tmp/portals-baseline.json           # keep as --baseline next time
node scan.mjs --company "Vanderbilt University" --dry-run --quiet    # preview one board, writes nothing
node linkedin-join.mjs --summary                                     # warm intros (needs data/Connections.csv)
node linkedin-join.mjs --company "HCA Healthcare"
./gmail-auth.sh                                                      # re-auth; GMAIL_AUTH_PORT defaults to 3456
node scripts/gmail-scan.mjs                                          # sweeps personal, school, personal2
```

## G. Outside the repo — additions to the machine-move list

- **`portals.yml` is gitignored, and this session's only durable artifacts are in it.** The HCA,
  VUMC and Vanderbilt University entries — including the Cloudflare finding that cost real Firecrawl
  credits to establish — exist on the old machine only. Copy `portals.yml` across or that work is
  simply gone. The pre-edit backup is in this session's scratchpad, which is also machine-local and
  will not survive the move.
- `data/Connections.csv` is gitignored third-party PII. Copy it or re-export from LinkedIn; safe to
  delete once the joins are done.
- **Firecrawl** is the MCP connector that established the HCA Cloudflare finding and resolved the
  VUMC Workday hostname. **Gmail** connector + `~/.gmail-mcp/` (`gcp-oauth.keys.json` and the
  per-account `credentials.json`) are needed for sweeps. Names only — no values recorded anywhere.
- No background processes, servers or watchers were started by this session. Nothing to stop.
