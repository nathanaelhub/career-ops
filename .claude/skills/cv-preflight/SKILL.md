---
name: cv-preflight
description: Score a CV the way an employer-side AI screener would, BEFORE applying — deterministic link/liveness checks, GitHub signal fetch, then the ported HackerRank hiring-agent rubric (4 categories + bonus/deductions). Outputs a scorecard and a prioritized fix list. Use after package-cv or on cv.md directly.
user_invocable: true
argument-hint: "[cv.md | output/*.pdf | Company]"
---

# cv-preflight — recruiter-side scoring before you apply

Simulates the screener from interviewstreet/hiring-agent (HackerRank's real intern-ranking pipeline) against Nathanael's CV. Rubric lives in `rubric.md` in this skill folder — read it before scoring.

## Input resolution
- No arg → score canonical `cv.md`
- A Company name → score the packaged PDF for that company (`output/cv-nathanael-johnson-{slug}-*.pdf`, newest)
- A path → score that file (Read handles PDFs directly)

## Steps

### 1. Deterministic checks (do these FIRST — they're the stable signal)
- Extract every URL from the CV. For each: `curl -sI -o /dev/null -w "%{http_code}" --max-time 10 {url}` — flag anything not 2xx/3xx as a broken link (the rubric penalizes these hard).
- Presence checklist: GitHub profile URL · LinkedIn URL · portfolio site · per-project GitHub links · per-project live-demo links. Each missing item maps to a specific rubric deduction.
- Contact email must be nathanaeljdj@gmail.com (memory `cv-contact-email`).

### 2. GitHub enrichment (emulates the screener's pipeline)
Using the GitHub username from the CV (nathanaelhub):
- `gh api users/{user}` and `gh api users/{user}/repos --paginate --jq '...'` — for the top repos by stars/recency: name, description, stars, fork status, last push.
- Classify each as `open_source` (multiple contributors / contributions to others' projects — check via `gh api repos/{user}/{repo}/contributors`) vs `self_project` (single contributor). This classification gates the Open Source category cap (≤10 if all self_project).
- Note repos with no description, no README activity, or stale pushes — screeners fetch and read these.

### 3. Score against the rubric
Read `rubric.md` and score strictly by its bands, citing CV evidence per category. Report the total as a **band, not a point** (variance is documented). If the target role is mid-level rather than intern, add a one-line re-weighted read (Production counts more).

### 4. Output
1. **Scorecard** — 4 categories + bonus + deductions + total band
2. **Fix list, prioritized by points recovered** — e.g. "add live demo link to clinic no-show project: rubric gives +10-20% on the project AND removes a -2 deduction". Only fixes that reword or surface REAL work — never invented claims (source-of-truth boundary applies).
3. **Verdict** — would this CV clear a low-cutoff AI screen for the target role: yes / probably / at risk.

### 5. If fixes are applied
Re-run steps 1 + 3 on the edited CV to confirm the delta, then hand off to `package-cv` for regeneration if a packaged PDF was the input.

## Guardrails
- NEVER suggest invisible text, keyword stuffing, or fabricated links/claims. The public exploit for this rubric is off-limits (ethical-use rule).
- This is ONE employer's lens, now public and decaying in signal value. Treat it as a proxy for "AI screener + first human skim", not universal ATS truth. Most ATSes are keyword matchers — JD keyword tailoring in package-cv still matters separately.
- Don't edit `cv.md` from findings without confirming each change with the user.
