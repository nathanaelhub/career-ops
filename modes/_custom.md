# Custom House Rules — Nathanael

User-layer procedural rules. System updates never touch this file; modes and
skills load it alongside `modes/_profile.md`.

## Inbox / email triage (applies to `inbox` mode and the inbox-sweep skill)

**Mark processed lead emails as read** (triage — don't make me re-read alerts).
After surfacing the leads, batch-remove the `UNREAD` label from the job-alert /
recruiter-alert emails via `batch_modify_emails` (removeLabelIds: `["UNREAD"]`).
Search is sender-based so it spans Primary/Updates/Promotions automatically — no
need to special-case the Updates category.

- **Mark read:** automated job alerts and recruiter blasts (LinkedIn/Indeed/
  Lensa/Built In/ZipRecruiter/etc.).
- **Leave unread (never auto-mark):** LinkedIn News / editorial digests, account
  nudges ("complete your profile"), and anything that looks like a real person
  writing (named headhunter replies, recruiter outreach in a thread). Surface
  those for the user instead.
- Batch in groups of ~20 to avoid Gmail "too many concurrent requests"; retry
  any failures once.

## Application form filling (applies to `apply` mode and Desktop handoff prompts)

- **Never trust ATS resume-parse prefill.** After uploading the resume, always open the
  parsed Education and Experience pages and verify them field by field. (Taleo mangled 3
  fields on the 2026-09-05 Optum app: blank BS institution, employer garbled to
  "Lipscomb University, College" with title "Computing Assistant", current role not
  flagged current.)
- **Greenhouse blanks the contact fields when the resume attaches.** Confirmed 2026-09-05 on
  both NMI and Scopely: attaching the resume cleared First Name, Last Name, Email, Country and
  Phone back to empty. Values set programmatically (`form_input`) do not survive it either, and
  single fields can drop silently (Scopely's phone country code; a stray click cleared a race
  combobox on NMI). So: upload the resume FIRST, then fill every text field with real keystrokes
  (click, then type), then scroll the entire form top to bottom and verify field by field before
  Submit. Two failure shapes are now confirmed: Taleo mangles parsed values, Greenhouse blanks them.
- Street address lives in `config/profile.yml` (`street_address`) — use it; don't stall
  the form waiting for it.
- Work-authorization answers, always truthful: authorized to work in the US = **Yes**
  (F-1 OPT EAD); will require sponsorship now or in the future = **Yes**. A combined
  "citizen OR no-sponsorship-needed" question = **No**.

## Tracker row numbers in handoff prompts (hard rule)

Never quote the row numbers you wrote into a TSV. `merge-tracker.mjs` renumbers silently
when a parallel session has taken those numbers. On 2026-09-05 a Desktop batch was handed
#389–396; the merge had shifted them to #392–399 because another session inserted
Robinhood/Affirm/AppLovin at #389–391 in between.

**Always read the merged rows back out of `data/applications.md` and quote those numbers.**
Same for report numbers — use `node reserve-report-num.mjs --count N` before any parallel
fan-out.

## Liveness evidence (hard rule)

A `firecrawl_search` snippet is not proof a posting is live — it is an index entry that can
be weeks stale. Only a live fetch (`maxAge: 0`) of the **employer's own ATS req URL** counts.
Aggregators (LinkedIn, Indeed, Built In, ZipRecruiter, Lensa, BeBee, Teal, jobright) are for
discovery only. Record the canonical URL in the tracker note; a row without one is
`UNVERIFIED`, not packageable. Full rationale in the `cops-liveness` skill, Step 0.

Re-read **level and sponsorship** from the canonical JD before packaging too — Oracle #385
and Husch Blackwell #406 both scored well from aggregator reads and collapsed on the real JD.

## Re-posted reqs at a company you already applied to (hard rule)

When adding a lead at a company that already has a tracker row with a similar title,
**put the req/job/posting ID in the notes column of the new TSV** (e.g. `job id 100508890224`).
Without it `merge-tracker.mjs` fuzzy-matches on company+role and silently *updates* the
existing row instead of adding one — overwriting its date and score and appending the new
req's text onto an application that was already submitted.

Hit on 2026-09-15: Molina's new "Level 1 Analyst/SQL" req merged into #137 (applied
2026-06-28), rewriting that row's date to 2026-09-15 and its score 3.8→4.2. Repaired, then
re-added as #417 with the req ID, which merged cleanly as a new row.

**After every merge, read the rows back** and confirm `+N added` matches what you intended.
A `🔄 updated` count you didn't expect means a row was overwritten — check it before moving on.
