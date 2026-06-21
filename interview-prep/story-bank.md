# Story Bank — Master STAR+R Stories

This file accumulates your best interview stories over time. Each evaluation (Block F) adds new stories here. Instead of memorizing 100 answers, maintain 5-10 deep stories that you can bend to answer almost any behavioral question.

## How it works

1. Every time `/career-ops oferta` generates Block F (Interview Plan), new STAR+R stories get appended here
2. Before your next interview, review this file — your stories are already organized by theme
3. The "Big Three" questions can be answered with stories from this bank:
   - "Tell me about yourself" → combine 2-3 stories into a narrative
   - "Tell me about your most impactful project" → pick your highest-impact story
   - "Tell me about a conflict you resolved" → find a story with a Reflection

## Stories

<!-- Stories will be added here as you evaluate offers -->
<!-- Format:
### [Theme] Story Title
**Source:** Report #NNN — Company — Role
**S (Situation):** ...
**T (Task):** ...
**A (Action):** ...
**R (Result):** ...
**Reflection:** What I learned / what I'd do differently
**Best for questions about:** [list of question types this story answers]
-->

### [Data Quality] SQL Data-Integrity Routines on Healthcare Data
**Source:** Report #050 — Morningstar — Investment Data Research Analyst
**S (Situation):** ROX Analytics fed client BI from large, multi-source healthcare datasets where silent data errors would surface in client-facing KPIs.
**T (Task):** Keep models and dashboards trustworthy without slowing delivery.
**A (Action):** Built SQL-based data-integrity routines and model tests; troubleshot failing sources and triaged BI support requests end to end.
**R (Result):** Caught upstream data issues before they reached client reports; sustained 10 months of production support remotely.
**Reflection:** Automated checks beat manual spot-checks — on a new dataset I'd build the test suite first, not after the first incident.
**Best for questions about:** data quality, auditing, attention to detail, debugging, working with messy data

### [Stakeholder Impact] Multi-Site Nursing Data Consolidation
**Source:** Report #050 — Morningstar — Investment Data Research Analyst
**S (Situation):** At Amplion, nursing data was scattered across multiple hospital locations with inconsistent definitions, making analysis slow.
**T (Task):** Deliver one coherent reporting layer for non-technical stakeholders.
**A (Action):** Built four Power BI/Tableau reports streamlining multi-location data; standardized metric definitions across sites; presented insights directly to stakeholders.
**R (Result):** 75% reduction in analysis time; insights contributed to a 15% operational efficiency improvement.
**Reflection:** Standardizing definitions across sites was the real work — the visuals were the easy 20%.
**Best for questions about:** most impactful project, working with non-technical stakeholders, simplifying complexity

### [Driving Adoption] Use-Case Documentation That Lifted Tool Adoption 30%
**Source:** Report #050 — Morningstar — Investment Data Research Analyst
**S (Situation):** Amplion had analytics tools that stakeholders weren't using.
**T (Task):** Increase adoption of data-analysis tools across teams.
**A (Action):** Identified and documented key use cases written around stakeholders' actual workflows, then presented them directly to users.
**R (Result):** 30% increase in user adoption of the data-analysis tools.
**Reflection:** Documentation written for the reader's workflow — not the tool's features — is what moves adoption.
**Best for questions about:** influencing without authority, communication, change management, documentation

### [Business-Metric Thinking] Airline No-Show Predictor Optimized for Revenue, Not Accuracy
**Source:** Report #050 — Morningstar — Investment Data Research Analyst
**S (Situation):** Airlines lose revenue to passenger no-shows; standard classifiers optimize accuracy, which doesn't map to dollars.
**T (Task):** Build a predictor that maximizes revenue impact (independent project, Spring 2025).
**A (Action):** Engineered domain-specific features and applied cost-sensitive learning so the model optimized the revenue trade-off rather than raw accuracy.
**R (Result):** Projected $10M annual revenue impact.
**Reflection:** Optimizing the business metric, not the model metric, is the analyst's actual job.
**Best for questions about:** business impact, ML projects, trade-off decisions, self-directed work

### [Research Rigor] Multi-Axis LLM Evaluation for Mental-Health Telemedicine
**Source:** Report #050 — Morningstar — Investment Data Research Analyst
**S (Situation):** Healthcare orgs lacked a defensible way to compare cloud vs. local LLMs for telemedicine use (MS capstone, Summer 2025).
**T (Task):** Produce a comparable, decision-ready evaluation.
**A (Action):** Designed a framework scoring models on empathy, safety, and clarity; automated the statistical analysis and publication-ready visualizations.
**R (Result):** Actionable findings for healthcare deployment decisions.
**Reflection:** Defining the metrics before collecting data is 80% of research quality.
**Best for questions about:** methodology, ambiguity, evaluation design, AI experience

### [Remote Execution] Owning BI Delivery in a Fully Remote Internship
**Source:** Report #050 — Morningstar — Investment Data Research Analyst
**S (Situation):** ROX Analytics internship was fully remote with an async team.
**T (Task):** Deliver production dashboards and support without day-to-day supervision.
**A (Action):** Owned Power BI dashboards (Power Query, M, DAX) end to end; proactively communicated status and triaged support requests.
**R (Result):** Sustained 10 months of production BI delivery and support.
**Reflection:** Over-communicating status is cheap insurance when remote.
**Best for questions about:** self-direction, remote work, ownership, time management

### [Client Support] BI Support Triage and Root-Cause Resolution at ROX
**Source:** Report #062 — Morningstar — Data Solution Specialist
**S (Situation):** At ROX Analytics, clients reported KPI mismatches in production Power BI dashboards — each report was a trust incident, not just a bug.
**T (Task):** Find the root cause fast, fix it, and keep the client informed throughout.
**A (Action):** Traced data lineage through Power Query/M back to source systems, identified the failing source, communicated the fix and ETA to the client, and documented the lineage so the next investigation started from notes instead of zero.
**R (Result):** Restored trust in the dashboards and shortened the triage cycle across 10 months of production support.
**Reflection:** Writing the lineage down once saved every future investigation — a knowledge-base entry per incident beats individual heroics.
**Best for questions about:** client/customer support, ticket triage, root-cause analysis, handling complaints, communication under pressure

### [Iterative Delivery] Guiding AI Studio Teams Through Short Feedback Loops
**Source:** Report #047 — Fitch Ratings — Analyst, Enhanced Analytics
**S (Situation):** At Lipscomb's College of Computing, student project teams in AI Studio were stuck on applied AI problems, and faculty needed working examples for emerging-AI coursework.
**T (Task):** Unblock teams and support curriculum development without doing the work for them.
**A (Action):** Built reference implementations for AI assignments and guided teams through iterative problem-solving — small scoped increments, frequent check-ins, course-correcting early.
**R (Result):** Teams shipped applied AI projects; reference implementations folded into curriculum development.
**Reflection:** Short feedback loops beat big upfront designs — the Agile habit of shipping a thin working slice first transfers to any tooling or analytics work.
**Best for questions about:** Agile/iterative development, mentoring, collaboration with functional experts, teaching/communication
