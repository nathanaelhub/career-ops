---
name: desktop-handoff
description: Generate the self-contained Claude Desktop prompt from current tracker state — apply-ready roles with CV paths and URLs, follow-ups due, and open verification tasks. Use when Nathanael says "give me the Desktop prompt" or wants to push the queue to Claude Desktop.
user_invocable: true
argument-hint: "[apply | followups | both]  (default: both)"
---

# desktop-handoff — build the Claude Desktop prompt

Desktop cannot see this chat: the prompt must be **fully self-contained** (URLs, CV paths,
tracker #s, angles). Never include "skip" lists for things Desktop has never seen.

## Gather (from files, not memory)
1. **Apply queue**: `data/applications.md` rows with status `Evaluated`, PDF ✅, score ≥3.5.
   Sort by score desc; pull URL + CV path + caveats from the notes column. Flag any posting
   deadline (e.g. "closes MM/DD") and order those first.
2. **Follow-ups due**: `node followup-cadence.mjs` → entries overdue/urgent with
   followupCount < 2 and ≤30 days old; EXCLUDE any row whose tracker status is
   Rejected/Discarded (cross-check — never draft a follow-up for a rejected row).
   For each: company, role, tracker #, applied date, and a one-line value angle drawn from
   the tracker note / report (never "just checking in").
3. **Open verification tasks**: unresolved flags in recent tracker notes (ambiguous
   rejections, "verify sponsorship", unverifiable employers).

## Prompt template (fill and emit as a fenced block)
```
{If apply queue} For each role: verify posting live, check H-1B sponsorship language,
draft cover letter (save "Nathanael Johnson - Cover Letter - {Company}.pdf" to the
Apply'26/Applys/{Company}/ folder), help me fill the form — I submit manually.
STOP before Submit. After I confirm, flip Evaluated → Applied in data/applications.md
with date + receipt note.
  {numbered roles: name — role — score [tracker #] / URL / CV path / caveat}

{If follow-ups} LinkedIn-first (contact via the contacto approach) + email version from
nathanaeljdj@gmail.com. LinkedIn ≤300 chars, email ≤150 words with subject; lead with a
specific value-add. Draft only — I send. After I confirm sent: append data/follow-ups.md
row + "Follow-up N sent {date}" in the tracker note.
  {numbered targets with angles}

{Verification tasks, if any}
```

## Rules baked into every prompt
- Ethical gate: prepare everything, STOP before Submit/Send.
- Email on materials: nathanaeljdj@gmail.com, never the school address.
- F-1 OPT: sponsorship must be verified per posting.
- Follow-up caps: max 2 per application, then cold.
