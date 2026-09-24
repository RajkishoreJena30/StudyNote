---
mode: agent
description: 'Phase 6 — break the product into a Jira/TFS-grade backlog: every sprint fully carded into Epic/Feature/Story/Task sized for 5 hours per day, with LLD per epic and a backlog export table.'
---

# /forge-sprints

Adopt `Agents/06-agile-sprint-planner.agent.md`. Produce `06-Delivery-Plan.md` at full depth, every run, without being asked twice:
- "How to use this plan" — ID scheme (`E<n>` / `E<n>.F<n>` / `<PREFIX>-<3-digit>` / `<Story>.T<n>`) mapped to Jira + Azure DevOps (TFS).
- Release plan + sprints (5 hrs/day, ~50 hrs / 10 points per sprint) as a Gantt.
- Epics → Features, then **every sprint** broken into fully carded Stories (INVEST + Given/When/Then incl. an edge case, points, `Depends on:`) → Tasks (≤ 5h each incl. test tasks, mapped to a day).
- One LLD per epic (component/hook contracts, state, API, test list).
- DoR/DoD, Gantt + epic-level dependency graph.
- A flat backlog export table (`ID, Epic, Feature, Title, Points, Sprint, Priority, Depends On`) with totals, ready for Jira/TFS import.

A plan with only one worked example story and one-line bullets for the rest of each sprint is incomplete — expand it before writing the file. Follow `Docs/OUTPUT-TEMPLATE.md`.
