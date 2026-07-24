# Employer-Side Screening Rubric (ported from interviewstreet/hiring-agent)

Source: HackerRank's open-sourced resume screener (MIT), `prompts/templates/resume_evaluation_criteria.jinja` @ 2026-07. This is the rubric a real employer uses to rank ~50-60k intern applications. It is **intern/early-career calibrated** — projects and open source dominate; for mid/senior JDs, mentally re-weight toward Production.

Score the candidate's CV exactly as the screener would. Base scores ONLY on technical skills, project complexity/impact, open source involvement, work experience, and technical communication. NEVER on name, school, GPA, or location.

## Categories (max 100 base)

### Open Source (0-35)
- **25-35:** contributions to popular projects (1000+ stars), GSoC, substantial community involvement
- **15-24:** contributions to smaller OSS projects, active GitHub with meaningful contributions to *other people's* repos
- **5-10:** only personal repos, minimal OSS activity
- **0-4:** no GitHub presence, or only tutorial-based repos
- HARD RULES: personal repos alone are NOT open source contribution. If all GitHub projects are single-contributor (`self_project` type), this score MUST be ≤10. Hacktoberfest alone caps at ~5.

### Self Projects (0-30)
- **20-30:** complex projects, real-world impact, advanced architecture, multiple technologies, user adoption
- **10-19:** some complexity, good documentation, multiple features
- **1-9:** tutorial projects (todo, calculator, basic CRUD, weather app, note app), classroom assignments
- **0:** basic CRUD apps score ZERO
- LINK RULES (this is what they enforce hardest):
  - No URL/GitHub/demo on a project → 30-50% lower score for it
  - Broken link → 20-30% lower
  - Working live demo → 10-20% higher

### Production (0-25)
- Real-world / internship / production experience from work + volunteer sections
- Extra points for founder/co-founder or early-stage (first 10-20 employees) roles

### Technical Skills (0-10)
- Breadth of skills/languages + problem-solving evidence in projects, work, competitions

## Complexity anchors
- **Low:** todo/calculator/CRUD, weather/note/recipe/exercise apps, portfolio sites, tutorial clones, basic sentiment analysis with stock libraries
- **High:** full-stack with auth + DB, ML/AI applications, real-time systems, microservices, native mobile features, advanced algorithms, real-world problem solving, adoption

## Bonus (max 20 total)
+5 GSoC · +3-5 founder/co-founder · +2-3 early-stage engineer · +2 portfolio website · +1 LinkedIn · +1-3 quality technical blog

## Deductions
- -2 to -5 if only simple tutorial projects; -1 to -3 per extra simple project; -1 per generic project name ("Calculator", "Todo App")
- -3 to -5 per project with NO link at all; -2 to -3 per project with GitHub link but no live demo; -1 to -2 per broken link
- -3 to -5 if GitHub shows only single-contributor projects (no true OSS)

## Total
`categories + bonus - deductions`, hard cap 120.

## Output structure (per evaluation)
```
scores: open_source X/35, self_projects X/30, production X/25, technical_skills X/10
bonus: X/20 (breakdown)
deductions: -X (reasons)
total: X/120
key_strengths (≤5) · areas_for_improvement (≤3)
```
Every score needs one line of evidence quoting the CV.

## Known limitations (report alongside the score)
1. **Variance:** identical resumes score ±10 across runs (documented publicly). Report the band (e.g. "high 70s-80s"), never a falsely precise number. Category-level signals are stabler than the total — technical_skills is stable, project-quality judgments are noisy.
2. **GitHub bias:** the rubric can't see private/enterprise work. If the user's best work is private, the score under-reads — say so.
3. **Intern calibration:** for non-intern JDs, Production evidence matters more than this rubric weights it.
4. **NEVER game it:** no invisible/white text, no keyword stuffing (the invisible-text exploit is public and detectable; it violates career-ops ethical use). The fix for a low score is a better CV, not a hacked PDF.
