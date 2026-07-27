# Tier 3 — Service / Consulting (Premium) — Full Mock Interview Question Set

> **Companies (type):** ThoughtWorks, Nagarro, GlobalLogic, Publicis Sapient
> **What they weigh most:** Practical coding + architecture + **communication**
> **CTC band (Sr, 5–6y):** ₹18–30 LPA
> **How to use:** Timer per round, answer out loud. This tier weighs **clean code, pairing, and articulation** heavily — think out loud, explain trade-offs, be a great communicator.

---

## Round 0 — Recruiter / Staffing Screen (20 min)

1. 3-minute career story — emphasize breadth across projects and clients.
2. What domains/industries have you worked in?
3. Are you comfortable with client-facing work and travel/onsite if needed?
4. How do you handle changing requirements from clients?
5. Current CTC + expectation; notice period.
6. Comfortable pairing and TDD?

**⭐ Self-grade:** Clear communication, client-readiness, adaptability, breadth of experience.

---

## Round 1 — Practical Coding / Pairing (60–90 min) ⭐ core at this tier

*Often a pairing session. They watch HOW you code and communicate, not just the result. TDD is common (esp. ThoughtWorks).*

### Problem styles
1. **Refactor legacy code** — improve readability, extract functions, remove duplication; explain each step.
2. **TDD kata** — build a feature test-first (e.g., string calculator, bowling scorer, FizzBuzz with rules, shopping cart pricing).
3. **Build a small feature** — parse & transform data, then render.
4. **Debug a broken function** — find and fix, explain root cause.
5. **Implement `debounce` / `throttle` / `groupBy`** while narrating.
6. **Design clean functions** — pure functions, single responsibility.

### What they evaluate
- Do you write tests first / alongside?
- Do you name things well and keep functions small?
- Do you talk through your reasoning and ask clarifying questions?
- Do you handle edge cases and refactor after green?

**⭐ Self-grade:** Test-first mindset, clean incremental commits, strong narration, asked clarifying questions, refactored.

---

## Round 2 — JavaScript / TypeScript Fundamentals (45 min)

1. Closures, scope, hoisting — with a practical example.
2. `this`, `call`/`apply`/`bind`.
3. Event loop basics — micro vs macro.
4. Promises, async/await, error handling patterns.
5. Array methods: `map`/`filter`/`reduce` — refactor a loop into these.
6. Immutability — why and how (spread, structuredClone).
7. TypeScript: `type` vs `interface`, generics, utility types (`Pick`, `Omit`, `Partial`).
8. Discriminated unions for API state (loading/success/error).
9. `unknown` vs `any` vs `never`.

**⭐ Self-grade:** Clean idiomatic JS/TS, immutability awareness, explains clearly with examples.

---

## Round 3 — Machine Coding / Component Build (60 min)

Pick one; emphasis on **clean architecture** and **testability**:
1. **Todo app with filters** — but structured with clear separation (UI / state / services).
2. **Autocomplete** — debounced, testable service layer.
3. **Form with validation** — controlled inputs, reusable validation.
4. **Data table** — sorting/filtering, extracted logic.
5. **Weather / user card fetcher** — API layer + presentational component + loading/error.

**Follow-ups:**
- How would you unit test the logic vs the UI?
- How would you structure this for a team of 5?
- Where's the seam for mocking the API?

**⭐ Self-grade:** Layered architecture, testable seams, presentational vs container split, clean naming.

---

## Round 4 — Architecture & Design (45–60 min)

*Architecture and communication over raw scale.*

1. How do you structure a large frontend codebase (folders, modules, boundaries)?
2. Component design: presentational vs container, composition over inheritance.
3. Design a reusable **design system / component library** — API design, theming, docs.
4. How do you handle cross-cutting concerns (auth, logging, error handling)?
5. SSR vs CSR vs SSG — when for a client project.
6. How do you approach a migration (jQuery/AngularJS → React) for a client?
7. Managing shared state across a large app.
8. How do you ensure code quality across a distributed team (lint, review, CI, standards)?

**⭐ Self-grade:** Clear architectural reasoning, reusability, team-scale thinking, migration strategy.

---

## Round 5 — React / Next.js (40 min)

1. Hooks: `useState`, `useEffect` (deps/cleanup), `useMemo`, `useCallback`, `useRef`.
2. Custom hooks for reuse across a codebase.
3. Controlled vs uncontrolled forms.
4. Preventing unnecessary re-renders.
5. Error boundaries & Suspense.
6. Next.js rendering strategies for client projects (SEO sites → SSG/SSR).
7. Testing React with Jest + RTL — what to test, query priorities, mocking.

**⭐ Self-grade:** Reuse-focused hooks, testing fluency, pragmatic rendering choices.

---

## Round 6 — Behavioral / Communication (45–60 min) ⭐ heavily weighted

*This tier promotes on communication and client handling.*

1. Tell me about working with a difficult client / changing requirements.
2. A time you disagreed with a client's technical decision — how did you handle it?
3. How do you explain a technical concept to a non-technical stakeholder?
4. A time you mentored or onboarded someone.
5. Handling a project under tight deadline with scope creep.
6. A production issue on a client project — how you communicated it.
7. How do you give and receive code review feedback?
8. Why consulting? Why this firm?
9. Describe pairing/mobbing experience.

**⭐ Self-grade:** Excellent communication, stakeholder empathy, conflict handling, mentoring, articulate trade-offs.

---

## Round 7 — Salary Negotiation / HR Closing (30 min)

1. Expected CTC? (band)
2. Current fixed + variable breakdown.
3. Are you open to a specific band/level based on the client project?
4. Notice period / join date.
5. Onsite/relocation flexibility?

**Playbook:**
- Premium service bands (₹18–30 LPA) are tighter than product — anchor realistically but firmly.
- Negotiate **fixed**, level, and role (senior/lead/architect track).
- Ask about **project quality, tech stack modernity, growth to architect/lead**.
- Clarify bench policy, client allocation, travel/onsite expectations.
- Get band + level in writing.

**⭐ Self-grade:** Realistic anchoring, negotiated level + role track, asked about project quality and growth.

---

## Post-Mock Scorecard

| Round | Time | Self-score (1–5) | Gaps to fix |
|-------|------|------------------|-------------|
| Recruiter screen | | | |
| Practical coding / pairing | | | |
| JS / TS fundamentals | | | |
| Machine coding | | | |
| Architecture & design | | | |
| React / Next | | | |
| Behavioral / communication | | | |
| Salary negotiation | | | |

> **Rule:** This tier rejects most on **communication** and **clean-code/pairing**. Practice narrating while you code, and drill any round ≤ 3.
