# SVMIC Data Analyst Interview — SQL Prep

**Interview:** SVMIC (medical malpractice insurer, Brentwood TN) | Data Analyst role
**Likely stack:** SQL Server / T-SQL (Microsoft shop, common for insurers)
**Report:** `reports/035-svmic-2026-04-08.md`

---

## Questions you'll almost certainly get

### What is SQL? What dialects have you used?

Standard query language for relational databases. The major dialects:

- **SQL Server / T-SQL** (Microsoft) — dominant in insurance and healthcare; SVMIC almost certainly runs this. Native partner of Power BI.
- **PostgreSQL** — open-source, feature-rich, strong window functions and JSON.
- **MySQL** — open-source, simpler, web-focused historically.
- **Oracle / PL/SQL** — enterprise heavyweight, common at older insurers.

What to say: "I've worked with standard SQL through Power BI's connections to a healthcare data warehouse. The dialects are 90% the same; I'd ramp quickly on T-SQL specifics."

### WHERE vs HAVING?

WHERE filters rows before aggregation. HAVING filters groups after.

```sql
SELECT specialty, COUNT(*) AS claim_count
FROM claims
WHERE claim_date >= '2024-01-01'
GROUP BY specialty
HAVING COUNT(*) > 10;
```

### INNER vs LEFT vs RIGHT vs FULL OUTER JOIN?

- INNER: only rows where keys match in both tables.
- LEFT: all rows from left, matched from right (NULLs where no match).
- RIGHT: opposite of LEFT.
- FULL OUTER: everything from both sides.

When LEFT beats INNER: "I want all policies, including ones with zero claims." INNER would drop those.

### Primary key vs foreign key? What's an index?

- PK: unique identifier per row, no NULLs.
- FK: column referencing another table's PK. Enforces referential integrity.
- Index: data structure (usually B-tree) that speeds up lookups. Faster reads, slightly slower writes. Add one when a JOIN or WHERE column makes queries slow.

---

## "What's the biggest table you've joined? How?"

Your ROX answer:

> At ROX Analytics I built Power BI dashboards over a healthcare data warehouse. The fact tables (patient encounters, billing transactions) ran into the millions of rows. A typical dashboard query joined 4 to 6 tables: the fact joined to provider, location, service line, and date dimensions on surrogate keys.
>
> The pattern was: start from the fact, LEFT JOIN dimensions, filter by date range early to keep the working set small, then aggregate at the end. Performance lessons were filter as early as possible, only select columns you actually need, and watch for accidental many-to-many joins that explode row counts.

If they push for exact numbers: "The largest were in the multi-million-row range. I'd have to check the exact figures."

---

## "Most complicated SQL you've written?"

> The most complex SQL I worked on at ROX was data integrity validation. Data flowed from source extracts through staging into the dimensional model, and at each step records could drop or duplicate if something broke. I wrote queries to compare row counts and key fields across stages, typically with CTEs to break each stage into a named block, LEFT JOINs with `WHERE x IS NULL` to find missing records, and GROUP BY with HAVING COUNT(*) > 1 to find duplicates.
>
> The complexity wasn't algorithmic. It was knowing what 'correct' looked like at each stage and translating that into checks. The query was 50 to 80 lines with 4 to 6 CTEs.

This is exactly what an interviewer expects from a BI intern. Don't inflate it.

---

## Patterns to know cold (drill these)

### Top N per group

```sql
WITH ranked AS (
  SELECT physician_id, claim_id, claim_amount,
    ROW_NUMBER() OVER (PARTITION BY physician_id ORDER BY claim_amount DESC) AS rn
  FROM claims
)
SELECT * FROM ranked WHERE rn <= 3;
```

### Find duplicates

```sql
SELECT email, COUNT(*) FROM applicants GROUP BY email HAVING COUNT(*) > 1;
```

### Find missing rows across a JOIN

```sql
SELECT p.policy_id FROM policies p
LEFT JOIN claims c ON p.policy_id = c.policy_id
WHERE c.policy_id IS NULL;
```

### Running total and year-over-year

```sql
SELECT year, claims,
  SUM(claims) OVER (ORDER BY year) AS running_total,
  LAG(claims, 1) OVER (ORDER BY year) AS prior_year
FROM yearly_claims;
```

### ROW_NUMBER vs RANK vs DENSE_RANK

- ROW_NUMBER: 1, 2, 3, 4 (always unique)
- RANK: 1, 2, 2, 4 (ties skip)
- DENSE_RANK: 1, 2, 2, 3 (ties don't skip)

---

## Other BI-role questions

- **Second-highest salary** → window function with ROW_NUMBER `WHERE rn = 2`, or DENSE_RANK if ties matter.
- **Star schema** → fact at the center, dimensions around it. For SVMIC: claims fact joined to physician, policy, date, coverage-type dimensions.
- **OLTP vs OLAP** → OLTP is the live transactional system (writing a policy). OLAP is the analytical warehouse (reporting on claims). Different schemas, different optimization.
- **Slowly changing dimensions** → dimension attributes that change over time (a physician changes specialty). Type 1 overwrites. Type 2 keeps history with effective-from / effective-to dates.
- **NULL handling** → `IS NULL` / `IS NOT NULL`, `COALESCE(col, default)`. Aggregations like SUM and AVG skip NULLs; COUNT(*) does not.
- **Slow query, how to fix?** → check the execution plan first (EXPLAIN in Postgres, "Display Estimated Execution Plan" in SSMS). Look for table scans on large tables (need an index), missing filters, SELECT * pulling too many columns, or functions on indexed columns in WHERE killing the index.

---

## How to sound credible (the meta)

1. **Anchor in ROX.** "At ROX we..." beats abstract textbook answers.
2. **Don't overclaim.** "I've worked with..." not "I'm an expert in..."
3. **When stuck, say what you'd try.** "I haven't used recursive CTEs in production, but I'd start by..."
4. **Use the right vocab naturally.** Fact, dimension, surrogate key, star schema, ETL, OLTP, OLAP, primary key, foreign key, index, execution plan, CTE, window function.
5. **Turn it into a conversation.** "What's SVMIC's stack? T-SQL? On-prem or moving to cloud?"

---

## What to drill before the interview

- 5–10 HackerRank problems in "Advanced Select" and "Advanced Join" (Easy/Medium). The patterns above will all appear.
- Rehearse the ROX "data integrity validation" story out loud until you can deliver it cleanly without reading.
- Be ready for a live SQL question on a shared screen. Most common: top N per group, or find duplicates.

Genuine 80% understanding of the patterns above beats 20% understanding spread thin. If they go deep on something you don't know, "I haven't worked with that, here's how I'd approach it" is a credible answer. Pretending falls apart on the first follow-up.
