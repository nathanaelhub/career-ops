# TODO

## CloakBrowser fallback for offer verification

**Context:** Career-ops's offer verification mandate (`AGENTS.md`) requires Playwright (`browser_navigate` + `browser_snapshot`) to confirm a posting is real before evaluation. When Playwright runs into Cloudflare Turnstile, FingerprintJS, or other anti-bot walls, the verification step degrades to "unconfirmed" and we lose signal on whether the Apply button is actually active.

**Proposed fix:** Add a fallback path that retries failed verifications with [CloakBrowser](https://github.com/CloakHQ/CloakBrowser) — a drop-in Playwright replacement with C++-level fingerprint patches. One-line import change (`from cloakbrowser import launch` instead of `playwright`). Auto-downloads a stealth Chromium binary on first use (~200MB).

**Scope (when implemented):**
- Detect when a Playwright verification fails specifically due to anti-bot signals (Cloudflare challenge page, etc.) vs. a genuinely closed posting
- On detection, retry with CloakBrowser
- If CloakBrowser also returns no JD content, mark as `Verification: unconfirmed (anti-bot wall)` instead of `closed`
- Add `cloakbrowser` to optional deps; don't make it a hard dep

**Boundaries:**
- This is for *verification* only (reading public job pages). NOT for submitting applications — `AGENTS.md` already forbids autonomous submit.
- Don't replace `scan.mjs`: scanner already uses direct JSON APIs which don't hit anti-bot walls.

**Filed:** 2026-05-26 — observation while doing first Pinterest application.
