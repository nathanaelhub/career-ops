# HANDOFF — career-ops session (2026-10-23 → 2026-10-26)

## a. What this is
`career-ops` is Nathanael Johnson's AI job-search pipeline (Node `.mjs` scripts plus Markdown data). It evaluates postings, writes reports, generates tailored CV PDFs, and tracks applications. The rules are in `AGENTS.md` (loaded via `CLAUDE.md`).

This session picked up from `~/Downloads/handoff-2026-10-16.md` and did four things:
- Evaluated two Nashville-area roles.
- Packaged a CV for the HCA role, which comes with a referral.
- Wrote a Claude Desktop prompt to apply to it.
- Set up the Playwright MCP server so future Claude Code sessions can fill forms themselves.

## b. Finished
- **#444 HCA Healthcare — Performance Improvement OR Business Analyst** (Job ID 4991009)
  - Score 3.4/5; report `reports/444-hca-healthcare-2026-10-23.md`, with the JD archived inside.
  - The user has a referral from a Senior Applications Engineer at HCA.
  - CV: `output/cv-nathanael-johnson-hca-or-business-analyst-2026-10-23.pdf` (1 page). A copy is at `~/Desktop/Apply'26/Applys/HCAHealthcare/Nathanael Johnson - Resume - HCA Healthcare.pdf`.
  - Tracker: status Evaluated, PDF ✅.
- **#445 OMNIA Partners — Business Analyst, Pricing & Analytics**
  - Score 3.0/5. Set to Discarded: sponsorship is unlikely, and DOL LCA data shows only 1 H-1B filing ever.
- **Claude Desktop prompt:** `~/Desktop/Apply'26/Applys/HCAHealthcare/desktop-prompt-2026-10-23.md`
  - Covers the HCA application, follow-ups for AppLovin #430, Block #431 and Medpace #408, and checks for Pinterest #435 and the HCA Digital Product Analyst repost.
  - The user said it was running in Claude Desktop.
- **Playwright MCP:** added at user scope in `~/.claude.json`.
  - Command: `npx -y @playwright/mcp@0.0.83 --browser chromium`.
  - Playwright Chromium is installed (Google Chrome is not).
  - The stdio handshake was tested and works. It loads in the next Claude Code session.

## c. In progress / unfinished
- **The HCA #444 application is in Claude Desktop.** This session couldn't see whether it was submitted, and the tracker still says Evaluated.
- **Follow-ups due** (being drafted in Desktop; sending is unconfirmed): AppLovin #430, Block #431, Medpace #408.
- **Open checks:**
  - Was Pinterest #435 submitted?
  - Is the HCA Digital Product Analyst repost (LinkedIn 4480303904) live on careers.hcahealthcare.com?
- **Pending update:** career-ops v1.36.0 → v1.38.0 is available. The user hasn't answered yet.
- **Left over from the 10-16 handoff:**
  - Fold duplicate row #434 into #431.
  - Re-authorize the school Gmail.
  - Fix the dbt Labs and Agentic Engineering portal slugs.
  - Send the Affirm DM once Emerson accepts.
- **Pipeline leads not yet evaluated** (LinkedIn finds; confirm each on the employer's site first):
  - HCA BI Analyst II and HCA Product Analyst II.
  - VUMC BI Developer TIPQC and Optum Data Analyst Payment Integrity. Peer session `career-ops-a7` already built CV and cover-letter PDFs for both under `output/_cops/`.
  - Elmington AI Data Analyst and EviCore Business Analytics Advisor.

## d. Exact next steps
1. Ask the user whether HCA #444 was submitted and who the referrer is. If it was submitted:
   `node set-status.mjs 444 Applied --note "Applied 2026-10-DD via HCA careers (Job ID 4991009); referral: {name}, Senior Applications Engineer"`
   `node followup-seed.mjs 444 --date 2026-10-DD`
2. Do the same for any follow-ups sent and for Pinterest #435. The exact commands are in the Desktop prompt file.
3. Run `node update-system.mjs check`, then ask about v1.38.0.
4. On the new machine, restart Claude Code and confirm `claude mcp list` shows `playwright` connected.

## e. Commands
```bash
npm install                     # deps (Playwright, etc.)
npx playwright install chromium # PDF rendering + scraping
node doctor.mjs --json          # setup check
node verify-pipeline.mjs        # tracker health
node test-all.mjs               # full test suite
node check-liveness.mjs <url>   # is a posting live (HCA is Cloudflare-gated; use this, not curl)
node browser-extract.mjs <url>  # JD text via browser
node generate-pdf.mjs output/<in>.html output/<out>.pdf --format=letter --max-pages=1 --strict-pages --report=NNN
node merge-tracker.mjs          # after writing batch/tracker-additions/*.tsv
node set-status.mjs <#> <State> --note "..."
node followup-cadence.mjs       # follow-ups due
```

## f. Outside the repo / not in git (copy these to the new computer)
- **Gitignored user data that git will NOT carry over.** Copy the whole folder, or at least these:
  - `data/applications.md` (the tracker)
  - `reports/*.md`
  - `output/` (CV PDFs and HTML)
  - `cv.md`, `config/profile.yml`, `modes/_profile.md`, `modes/_custom.md`, `article-digest.md`, `portals.yml`
  - `data/follow-ups.md`, `data/pipeline.md`, `data/scan-history.tsv`, `data/contacts.tsv`
  - `scripts/cv-template-nathanael.html` and the custom skills in `.claude/skills/`, which are deliberately left untracked.
- **Desktop archive:** `~/Desktop/Apply'26/Applys/` holds per-company CVs, cover letters and the Desktop prompts.
- **Earlier handoff:** `~/Downloads/handoff-2026-10-16.md`.
- **Claude config:**
  - `~/.claude.json`, which holds the Playwright MCP entry. Re-run: `claude mcp add playwright -s user -- npx -y @playwright/mcp@0.0.83 --browser chromium`.
  - Auto-memory in `~/.claude/projects/-Users-nathanaeljohnson-GitHub-career-ops/memory/`.
- **Env vars:**
  - `ANTHROPIC_API_KEY` is set. It disables the claude.ai connectors (Gmail, Calendar, Drive) in the CLI.
  - Optional overrides: `CAREER_OPS_ROOT`, `CAREER_OPS_DATA_DIR`, `CAREER_OPS_TRACKER`.
- **Accounts:**
  - Gmail is read and draft only, never send. CV email is always nathanaeljdj@gmail.com.
  - Firecrawl is used through the claude.ai connector. Note that HCA blocks it.
- **Hard rules:**
  - Never submit or send on the user's behalf.
  - Answer work authorization truthfully: authorized YES; sponsorship now/future YES; citizen/PR NO.
  - Write to the tracker only through `set-status.mjs`, or through TSVs plus `merge-tracker.mjs`.
