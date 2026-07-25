---
name: package-cv
description: Package a tailored 1-page ATS CV for a role — generate from the durable template, verify layout and contact email, copy to the Desktop Applys folder with Nathanael's naming convention, and flip the tracker PDF flag. Use when a scored lead needs application materials.
user_invocable: true
argument-hint: "<Company> <Role> [tracker #]"
---

# package-cv — one-command CV packaging

## Inputs
- Master template: `scripts/cv-template-nathanael.html` (placeholders `{{SUMMARY}}`,
  `{{COMPETENCIES}}`; everything else — experience, projects, education, skills — is
  factual and fixed). If the template is missing, STOP and tell the user (do not
  reconstruct from memory without confirming content against `cv.md`).
- Role context: the JD / tracker note for the target role.

## Steps
1. **Write the role-tuned pieces** (the only parts that change):
   - `{{SUMMARY}}`: 3–4 sentences reusing ONLY facts from `cv.md` / `modes/_profile.md`,
     reworded with the JD's vocabulary (never invent skills). Anchor with the most relevant
     proof point (healthcare BI metrics, $10M airline ML project, LLM capstone).
   - `{{COMPETENCIES}}`: 8 `<span class="competency-tag">` tags matching JD keywords.
2. **Generate** to scratchpad HTML (generate-pdf refuses to WRITE the PDF outside the
   project, so the PDF goes to `output/`), then:
   `node generate-pdf.mjs {scratchpad}/cv-nathanael-johnson-{slug}.html output/cv-nathanael-johnson-{slug}-{YYYY-MM-DD}.pdf --format=letter --max-pages=1 --strict-pages`
   `--strict-pages` makes a 2-page render a hard failure — tighten `{{SUMMARY}}` and
   regenerate until it passes.
3. **Verify**: contact email must be **nathanaeljdj@gmail.com** (never the school
   address — see memory `cv-contact-email`); page count is enforced by --strict-pages.
4. **Copy to the Desktop archive** (memory `applys-folder-convention`):
   `Apply'26/Applys/{Company}/Nathanael Johnson - Resume - {Company}.pdf` (mkdir if missing).
5. **Tracker**: flip the row's PDF cell to ✅ and append `CV ready: output/...pdf` to notes
   (edit existing row; if the role isn't tracked yet, add via TSV + `node merge-tracker.mjs`).
6. Report: PDF path, page count, Applys path, tracker row touched.
7. **Offer pre-flight**: suggest running `/cv-preflight {Company}` to score the packaged
   CV against the employer-side screening rubric before it goes out (skip if the user
   already pre-flighted this CV in the session).

## Guardrails
- Never fabricate experience/metrics — reword real ones with JD vocabulary only.
- If generate-pdf fails with missing Chromium: `npx playwright install chromium` once.
- Cover letters are NOT generated here (interactive flow via `/career-ops cover` or Desktop).
