# Tier 2 — Mid Product / Funded Startups — Full Mock Interview Question Set

> **Companies (type):** Postman, Groww, CRED, Meesho, Zerodha, Freshworks
> **What they weigh most:** JS deep-dive + React/Next + machine coding + system design
> **CTC band (Sr, 5–6y):** ₹28–45 LPA
> **How to use:** Timer per round, answer out loud, self-grade with the ⭐ signals. This tier leans **practical/product** — machine coding and React depth matter more than hard DSA.

---

## Round 0 — Recruiter / Founder-ish Screen (20 min)

1. Give me your 3-minute story with emphasis on product impact you shipped.
2. What features have you personally shipped that users touched?
3. Why leave your current role? Why a startup?
4. Are you comfortable with ambiguity and wearing multiple hats?
5. Current CTC (fixed + variable + ESOP) and expectation?
6. Notice period — negotiable / buyout?
7. What's your experience with our product? Have you used it?

**⭐ Self-grade:** Product-first framing, comfort with ambiguity, shows genuine interest in the product.

---

## Round 1 — Coding Screen (45–60 min, lighter DSA + practical)

*Usually 1 medium + 1 practical/JS-flavored problem.*

### Practical / JS-heavy
1. Flatten a deeply nested array (and object).
2. Implement `debounce` and `throttle` from scratch.
3. Group an array of objects by a key.
4. Implement a retry-with-backoff wrapper around a promise.
5. Parse query string into an object and back.
6. Implement `Promise.all` and a `promisePool` (concurrency limit).
7. LRU cache.
8. Deep equality check between two objects.

### DSA (medium, not exotic)
9. Two Sum / Longest substring without repeats.
10. Merge intervals.
11. Top K frequent elements.
12. Valid parentheses / Min stack.
13. Level-order traversal of a tree.

**⭐ Self-grade:** Practical fluency (async, arrays, objects), stated complexity, clean readable JS.

---

## Round 2 — JavaScript Deep-Dive (45 min)

1. Event loop — micro vs macro tasks, predict output of a mixed snippet.
2. Closures — real use (private state, memoization, currying).
3. `this` in regular vs arrow functions; `call`/`apply`/`bind`.
4. Prototypal inheritance.
5. `var`/`let`/`const`, hoisting, TDZ.
6. Deep vs shallow copy, reference vs value.
7. Debounce vs throttle — when to use which (real product examples).
8. `Promise.all` vs `allSettled` vs `race` vs `any`.
9. Polyfills: `map`, `reduce`, `bind`, `curry`, `deepClone`, `EventEmitter`.
10. `localStorage` vs `sessionStorage` vs cookies — when each.

**⭐ Self-grade:** Ties concepts to real product scenarios, polyfills correct, no hand-waving.

---

## Round 3 — Machine Coding / Live Build (60–90 min) ⭐ heavily weighted

*This tier loves practical builds. Ship working UI with clean state.*

Pick one:
1. **Debounced search with API** — loading/empty/error, cancel stale calls.
2. **Infinite scroll product list** — IntersectionObserver, skeleton loaders.
3. **Cart / checkout mini-app** — add/remove, quantity, price totals, persistence.
4. **Todo app with filters** — all/active/done, localStorage, edit inline.
5. **Multi-step form / wizard** — validation, back/next, review step.
6. **Data table** — sorting, filtering, pagination, column config.
7. **Toast / notification system** — queue, auto-dismiss, variants.
8. **Star rating + reviews widget**.

**Follow-ups:**
- How do you structure state for scale?
- How do you handle API errors and retries?
- How would you make it responsive and accessible?
- How would you unit test this?

**⭐ Self-grade:** Fully working, clean component split, handled edge/error states, responsive, some a11y, testable structure.

---

## Round 4 — React / Next.js Deep-Dive (45 min)

### React
1. What triggers re-renders; how to prevent unnecessary ones.
2. `useMemo` vs `useCallback` vs `React.memo` — practical examples.
3. `useEffect` deps, cleanup, and common bugs (stale closures, infinite loops).
4. Custom hooks — build `useLocalStorage` and `useDebounce`.
5. Controlled vs uncontrolled forms; form libraries (RHF) trade-offs.
6. Context vs a state library — when to switch.
7. Lists, keys, reconciliation.
8. Error boundaries and Suspense for data.

### Next.js
9. App Router vs Pages Router.
10. SSR vs SSG vs ISR — pick per scenario (product listing, blog, dashboard).
11. Data fetching + caching in App Router; `revalidate`.
12. API routes / route handlers, middleware.
13. SEO, metadata, image optimization.

**⭐ Self-grade:** Practical React intuition, correct rendering choices for product pages, clean hooks.

---

## Round 5 — State Management (30–40 min)

1. Local vs global vs **server state** — the distinction.
2. Redux Toolkit: slices, `createAsyncThunk`, RTK Query, normalization.
3. Zustand: when you'd prefer it over Redux.
4. TanStack Query / React Query: caching, invalidation, mutations, optimistic updates.
5. Why prefer RTK Query / React Query over manual `useEffect` fetching?
6. How would you cache and invalidate product/cart data?

**⭐ Self-grade:** Clearly separates server vs client state, justifies tool choice for the product.

---

## Round 6 — Lightweight System Design (45 min)

Prompts:
1. **Design a product listing + filters page** (e-commerce) — pagination/infinite scroll, filter state in URL, caching.
2. **Design a notifications system** (in-app).
3. **Design a dashboard with live data** — polling vs websockets.
4. **Design a cart + checkout flow** — optimistic updates, error recovery.

Cover: requirements → components → state (server vs client) → data fetching/caching → rendering strategy → performance → error/loading states → trade-offs.

**⭐ Self-grade:** Product-pragmatic design, URL-driven filter state, right caching, handled failures.

---

## Round 7 — Behavioral / Hiring Manager (45 min)

1. A feature you owned end-to-end and its impact (metrics).
2. Working in a fast-moving, ambiguous startup environment.
3. A time you shipped fast and paid down tech debt later.
4. Disagreement with a PM/designer — resolution.
5. How you improved performance / DX for the team.
6. Mentoring juniors / raising code quality.
7. Why this startup specifically?
8. How do you prioritize when everything is "urgent"?

**⭐ Self-grade:** Ownership + speed + pragmatism stories, metrics, genuine product interest.

---

## Round 8 — Salary Negotiation / HR Closing (30 min)

1. Expected CTC? (band, anchor high-reasonable)
2. Current breakdown: fixed + variable + **ESOP** (startups push equity).
3. How do you value equity vs cash?
4. Competing offers?
5. Notice / join date?

**Playbook:**
- Startups lean on **ESOP** — understand strike price, vesting, dilution, last valuation.
- Compare **fixed cash** first; treat equity as upside.
- Negotiate fixed + a meaningful ESOP grant + join date.
- Ask about runway, funding stage, growth path.
- Get everything in writing.

**⭐ Self-grade:** Understood equity mechanics, anchored on fixed, evaluated startup risk, negotiated confidently.

---

## Post-Mock Scorecard

| Round | Time | Self-score (1–5) | Gaps to fix |
|-------|------|------------------|-------------|
| Recruiter screen | | | |
| Coding screen | | | |
| JS deep-dive | | | |
| Machine coding | | | |
| React/Next | | | |
| State management | | | |
| System design | | | |
| Behavioral / HM | | | |
| Salary negotiation | | | |

> **Rule:** This tier rejects most on **machine coding** and **React depth**. Drill any round ≤ 3.
