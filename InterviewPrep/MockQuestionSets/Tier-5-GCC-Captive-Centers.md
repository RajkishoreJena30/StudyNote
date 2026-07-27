# Tier 5 — GCC / Captive Centers — Full Mock Interview Question Set

> **Companies (type):** Walmart Global Tech, Target, Wells Fargo, Mastercard
> **What they weigh most:** DSA + system design + React internals
> **CTC band (Sr, 5–6y):** ₹30–50 LPA
> **How to use:** Timer per round, answer out loud, self-grade with ⭐ signals. GCCs run a **product-grade loop** with strong DSA + system design + deep React, plus emphasis on **quality, testing, and ownership**.

---

## Round 0 — Recruiter Screen (20 min)

1. 3-minute career summary — focus on scale, quality, and ownership.
2. Team/domain you're interested in (payments, retail, banking, etc.).
3. Reason for switch; interest in a global captive setup.
4. Current CTC (fixed + variable + RSU) and expectation.
5. Notice period — negotiable / buyout.
6. Comfortable with DSA + system design rounds?

**⭐ Self-grade:** Clear pitch, scale/quality framing, correct comp + notice details.

---

## Round 1 — DSA / Coding (60 min, 1–2 mediums) ⭐ enforced

*GCCs run near-product DSA bars. State approach, complexity, edge cases.*

### Arrays & Strings
1. Two Sum / Two Sum II.
2. Longest substring without repeating characters.
3. Maximum subarray (Kadane's).
4. Product of array except self.
5. Merge intervals / insert interval.

### Hashmaps
6. Top K frequent elements.
7. Subarray sum equals K.
8. Group anagrams.

### Sliding window / Two-pointer
9. Minimum window substring.
10. Longest repeating character replacement.

### Trees & Graphs
11. Binary tree level-order / zigzag traversal.
12. Lowest common ancestor.
13. Number of islands / flood fill.
14. Course schedule (topological sort).
15. Validate BST.

### Stack / Queue / Heap
16. Valid parentheses / Min stack.
17. Kth largest element (heap).
18. Merge k sorted lists.

### Recursion / DP (basic)
19. Climbing stairs / coin change.
20. Subsets / permutations.

**⭐ Self-grade:** Optimal approach stated first, correct Big-O, edge cases, clean code.

---

## Round 2 — JavaScript + React Internals (45–60 min) ⭐

### JavaScript
1. Event loop — micro vs macro, predict mixed output.
2. Closures, `this`, `call`/`apply`/`bind`.
3. Prototypal inheritance.
4. Promises — `all`/`race`/`allSettled`/`any`.
5. Polyfills: `debounce`, `throttle`, `bind`, `Promise.all`, `deepClone`.
6. Deep vs shallow copy; immutability.

### React internals
7. What triggers a re-render; prevent unnecessary ones.
8. `useMemo` vs `useCallback` vs `React.memo`; referential equality.
9. Reconciliation, keys, virtual DOM.
10. `useEffect` deps/cleanup; why double-invoke in StrictMode.
11. Custom hooks — build `useFetch` (typed) and `useDebounce`.
12. Context re-render fan-out and mitigation.
13. Error boundaries; Suspense.
14. Concurrent: `useTransition`, `useDeferredValue`.

**⭐ Self-grade:** Deep, precise React internals; polyfills correct; strong perf intuition.

---

## Round 3 — System Design (60 min) ⭐⭐ heavily weighted

Prompts (drill 2–3):
1. **Design a retail product listing + search** (Walmart/Target style) — filters, pagination/infinite scroll, caching, faceted search, URL state.
2. **Design a payments/transaction dashboard** (banking) — security, data freshness, error handling, auditability.
3. **Design a notifications system**.
4. **Design an order-tracking UI** with live updates (polling vs websockets vs SSE).
5. **Design a large data table / grid** — virtualization for 10k+ rows, sorting/filtering server-side.

**Framework each time:**
- Functional + non-functional requirements (incl. security & compliance for banking/retail).
- Component architecture & module boundaries.
- State: local vs global vs server state.
- API contract, pagination, caching, invalidation.
- Rendering strategy (CSR/SSR/SSG/RSC) with reasoning.
- Performance: virtualization, code splitting, prefetch, image strategy.
- Accessibility (WCAG — big at global cos.), i18n, error/loading/empty states.
- Observability: error tracking, RUM, logging, feature flags.
- Security: XSS/CSRF, auth token handling, CSP.
- Trade-offs & alternatives.

**⭐ Self-grade:** Led discussion, addressed scale + security + a11y + observability, quantified trade-offs.

---

## Round 4 — Machine Coding / Live Build (60–90 min)

Pick one:
1. **Searchable, paginated data table** — sorting, filtering, server-side pagination.
2. **Autocomplete with request cancellation** (AbortController), keyboard nav.
3. **Infinite scroll feed** — IntersectionObserver, error retry.
4. **Multi-step transaction/checkout form** — validation, review, submit.
5. **Dashboard widget grid** — configurable, loading/error states.

**Follow-ups:** cancel stale requests, accessibility, prevent re-renders, unit test strategy.

**⭐ Self-grade:** Working, clean state, handled edge/error/empty, a11y, testable.

---

## Round 5 — Cross-Cutting: Testing, Performance, Security, A11y (45 min)

### Testing
1. Jest + RTL — query priorities, `user-event`, mocking APIs.
2. What to test (behavior not implementation); coverage philosophy.
3. Integration vs unit vs e2e (Cypress/Playwright).

### Performance
4. Core Web Vitals (LCP, INP, CLS) — how to fix each.
5. Bundle analysis, code splitting, tree shaking, lazy loading.
6. Virtualization for large lists.

### Security (OWASP-aware — critical for banking/retail)
7. XSS types & sanitization; `dangerouslySetInnerHTML`.
8. CSRF, CORS, CSP headers.
9. Auth token storage (cookie vs localStorage), JWT, refresh flow.

### Accessibility
10. Semantic HTML, ARIA roles, keyboard nav, focus management, WCAG.

**⭐ Self-grade:** Concrete fixes and practices, security-aware, testing discipline, a11y fluency.

---

## Round 6 — Behavioral / Hiring Manager (45 min)

*GCCs weigh ownership, quality culture, cross-timezone collaboration.*

1. A feature you owned end-to-end and its impact (metrics).
2. A hard technical trade-off and how you defended it.
3. A production incident — detection, mitigation, prevention.
4. Working with global/distributed teams across timezones.
5. How you enforce quality: testing, CI, reviews, standards.
6. Mentoring and raising the team's bar.
7. A conflict and its resolution.
8. Why this GCC / this domain (retail/banking/payments)?
9. How you handle compliance/security requirements.

**⭐ Self-grade:** 5 STAR stories with metrics, quality + ownership signal, cross-timezone maturity.

---

## Round 7 — Salary Negotiation / HR Closing (30 min)

1. Expected CTC? (band, anchor high-reasonable)
2. Current breakdown: fixed + variable + **RSU** (GCCs grant real RSUs).
3. Competing offers?
4. Level mapping (SDE-2 / Senior / SDE-3)?
5. Notice / join date + buyout?

**Playbook:**
- GCCs pay well (₹30–50 LPA) with **RSUs of the global parent** — understand vesting (usually 4y), refreshers, and current stock price.
- Compare **fixed + RSU value**; negotiate both fixed and grant.
- Level mapping drives comp — push for the right level using system-design signal.
- Ask about growth, global mobility, on-call, stack modernity.
- Confirm level, comp breakdown, and join date in writing.

**⭐ Self-grade:** Understood RSU mechanics, negotiated fixed + grant + level, used leverage well.

---

## Post-Mock Scorecard

| Round | Time | Self-score (1–5) | Gaps to fix |
|-------|------|------------------|-------------|
| Recruiter screen | | | |
| DSA | | | |
| JS + React internals | | | |
| System design | | | |
| Machine coding | | | |
| Testing / perf / security / a11y | | | |
| Behavioral / HM | | | |
| Salary negotiation | | | |

> **Rule:** GCCs reject most on **DSA** and **system design**, and probe **quality/testing/security** hard. Drill any round ≤ 3.
