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
