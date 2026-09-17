---
name: product-management
description: 'Knowledge pack for acting as a Product Owner: writing a product brief with vision/mission, problem statement, market segments, value proposition, OKRs/KPIs (north-star + guardrails), detailed personas (goals/pains/JTBD), business rules, MoSCoW prioritization, release roadmap, risks, pricing/packaging, and a glossary. Use when producing the product spec (Part A).'
---

# Skill: Product Management (PO Brief)

## When to use
Producing the product specification — always emit the **PO brief (Part A)** before the functional spec (Part B), even if not explicitly asked.

## PO brief structure (13 required sections)

| # | Section | What good looks like |
|---|---------|----------------------|
| A1 | Vision & mission | Aspirational vision + concrete mission + one-line product statement |
| A2 | Problem statement | The top 3 customer pains, evidence-based |
| A3 | Target market & segments | Segments table + a **named beachhead** |
| A4 | Value proposition | Value per stakeholder + the single differentiator |
| A5 | Goals & metrics | One **north-star metric** + OKRs with targets + **guardrail** metrics |
| A6 | Detailed personas | Per persona: goals, pains, **jobs-to-be-done**, success criteria |
| A7 | Business rules | Numbered, testable policies (drive later AC + authz) |
| A8 | Prioritization | **MoSCoW**: Must / Should / Could / Won''t (now) |
| A9 | Roadmap & outcomes | Releases described as *customer outcomes*, mapped to sprints |
| A10 | Assumptions/deps/risks | Table with mitigations |
| A11 | Out of scope | Explicit deferrals to protect focus |
| A12 | Pricing & packaging | Plans/tiers that gate features -> feed RBAC + feature flags |
| A13 | Glossary | Domain terms = source of truth for all later docs |

## Metric guidance
- Pick exactly **one north-star** tied to customer value (e.g., time-to-first-response, activation rate).
- OKRs: 3-5 objectives, each with measurable key results (direction + target).
- Always add **guardrail metrics** so a KPI is not gamed (e.g., speed up replies *without* raising reopen rate).

## Persona template
```
<Name> - <role> (primary/secondary)
- Goals: ...
- Pains: ...
- JTBD: "When <situation>, help me <motivation> so I can <outcome>."
- Success: <observable signal>
```

## Prioritization (MoSCoW) rules
- **Must** = MVP is meaningless without it. Keep this list short.
- **Won''t (now)** is a feature, not an omission — it prevents scope creep.

## Business-rule -> downstream traceability
Each rule in A7 should surface later as: an **acceptance criterion** (Part B / sprints), an **authz check** (`07-Security-Auth.md`), and a **test** (`08-Testing-Strategy.md`).

## Checklist
- [ ] All 13 sections present
- [ ] One north-star + OKRs with targets + guardrails
- [ ] Personas include JTBD
- [ ] MoSCoW with an explicit Won''t-now
- [ ] Glossary defined and reused verbatim downstream
