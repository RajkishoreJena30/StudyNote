# Tier 1 — Product (FAANG-adjacent / Unicorns) — Full Mock Interview Question Set

> **Companies (type):** Google, Microsoft, Atlassian, Uber, Flipkart, Swiggy, Razorpay, Zeta, PhonePe
> **What they weigh most:** DSA + JS internals + Frontend System Design + React performance
> **CTC band (Sr, 5–6y):** ₹35–60+ LPA
> **How to use:** Set a timer per round. Speak your answer out loud as if in a real interview, then self-grade using the ⭐ signals at the end of each round.

---

## Round 0 — Recruiter Screen (15–20 min)

*Goal: confirm fit, notice period, comp expectations. Low technical, high signal on communication.*

1. Walk me through your last 5–6 years in 3 minutes — focus on frontend ownership.
2. What are you working on right now, and what's your exact role on the team?
3. Why are you looking to switch? Why now?
4. What's your current CTC (fixed + variable + ESOP) and your expectation?
5. What's your notice period? Is it buyout-eligible / negotiable?
6. Are you interviewing elsewhere / do you have offers in the pipeline?
7. What team/domain interests you here and why?
8. Are you comfortable with a DSA round and a system design round?

**⭐ Self-grade:** Crisp 3-min pitch, clear comp band with fixed/variable split, honest notice framing, no rambling.

---

## Round 1 — DSA / Coding Screen (60 min, 1–2 mediums)

*Enforced hard at this tier. Solve, state complexity, handle edge cases, talk while coding.*

### Arrays & Strings
1. Two Sum / Two Sum II (sorted, two-pointer).
2. Longest substring without repeating characters (sliding window).
3. Group anagrams.
4. Product of array except self.
5. Merge intervals.
6. Trapping rain water.

### Hashmaps & Frequency
7. Top K frequent elements.
8. Subarray sum equals K.
9. First unique character in a string.

### Two-pointer / Sliding window
10. Minimum window substring.
11. Container with most water.
12. Longest repeating character replacement.

### Recursion / Backtracking
13. Generate all subsets / permutations.
14. Combination sum.
15. Word search on a grid.

### Trees & Graphs
16. Level-order traversal (BFS).
17. Lowest common ancestor.
18. Number of islands.
19. Validate a BST.
20. Clone graph.

### Stacks / Queues
21. Valid parentheses.
22. Min stack.
23. Daily temperatures (monotonic stack).

**⭐ Self-grade:** Stated approach before coding, correct Big-O time & space, covered empty/duplicate/overflow edge cases, clean naming.

---

## Round 2 — JavaScript Internals Deep-Dive (45–60 min)

*This tier probes fundamentals hard.*

### Output prediction
1. Predict the output — closures in a `for` loop with `var` vs `let`.
2. Predict order — `console.log` + `setTimeout(0)` + `Promise.resolve().then` interleaved.
3. What does `this` print in a regular function vs arrow function inside an object method?
4. Hoisting: `var`, `let`, function declaration vs expression order.
5. `[1,2,3].map(parseInt)` — explain the result.

### Concepts
6. Explain the event loop: call stack, microtask queue, macrotask queue.
7. Difference between microtask and macrotask — give examples of each.
8. Explain closures and one real-world use (memoization / private state).
9. Prototypal inheritance vs classical inheritance.
10. `call` vs `apply` vs `bind` — implement `bind`.
11. Deep clone vs shallow clone — pitfalls with `JSON.parse(JSON.stringify())`.
12. Explain `var` / `let` / `const`, TDZ, block scope.
13. How does `async/await` map to promises under the hood?

### Polyfills (implement live)
14. `Array.prototype.map`.
15. `debounce` (with leading/trailing option).
16. `throttle`.
17. `curry`.
18. `Promise.all` and `Promise.allSettled`.
19. `deepClone` (handle circular refs).
20. A simple `EventEmitter` (on/off/emit).

**⭐ Self-grade:** Correct output with reasoning (not memorized), polyfills handle edge cases, precise vocabulary (microtask, TDZ, referential equality).

---

## Round 3 — Machine Coding / Live UI Build (60–90 min)

*Build a working, clean component. Focus on state modeling, edge cases, a11y.*

Pick one and build end-to-end:
1. **Typeahead / autocomplete** — debounced API calls, keyboard nav, cancel stale requests (AbortController), loading/empty/error states.
2. **Infinite scroll feed** — IntersectionObserver, dedup, error retry.
3. **Nested comments** — recursive component, collapse/expand, reply.
4. **Star rating** — hover preview, keyboard accessible, half-stars.
5. **Multi-select with chips** — add/remove, filter, keyboard support.
6. **Kanban board** — drag & drop columns/cards, state persistence.
7. **Tabs + Accordion** — accessible (ARIA roles, focus management).

**Follow-ups they'll ask:**
- How do you cancel in-flight requests?
- How would you make this accessible (keyboard + screen reader)?
- How do you prevent unnecessary re-renders here?
- How would you test this component?

**⭐ Self-grade:** Working UI, clean state shape, handled loading/empty/error, no race conditions, basic a11y, readable code under time.

---

## Round 4 — Frontend System Design (60 min) ⭐⭐ biggest differentiator

*Drive the conversation: requirements → architecture → data flow → trade-offs.*

Prompts (pick 2–3 to drill):
1. **Design a news feed (Twitter/Facebook)** — infinite scroll, real-time updates, optimistic likes.
2. **Design a chat application** — websockets, message ordering, offline queue, read receipts.
3. **Design an autocomplete at scale** — caching, debouncing, ranking, request cancellation.
4. **Design an image gallery / Pinterest** — virtualization, lazy loading, responsive images.
5. **Design a live dashboard** — polling vs websockets vs SSE, data freshness, error states.
6. **Design a file uploader** — chunked upload, resume, progress, retries.

**Framework to cover every time:**
- Clarify requirements & scope (functional + non-functional).
- Component architecture & folder structure.
- Data flow & state (local vs global vs server state).
- API contract & data fetching strategy (REST/GraphQL, pagination).
- Rendering strategy (CSR/SSR/SSG/RSC) and why.
- Performance: code splitting, virtualization, caching, prefetch.
- Optimistic updates & cache invalidation.
- Accessibility, i18n, error/loading/empty states.
- Observability: error tracking, RUM, logging.
- Trade-offs & alternatives (defend your choices).

**⭐ Self-grade:** Led the discussion, quantified trade-offs, addressed scale (10k+ items → virtualization), covered failure/edge states, defended decisions.

---

## Round 5 — React / Next.js Deep-Dive (45–60 min)

### React internals & performance
1. What triggers a re-render? How do you prevent unnecessary ones?
2. `useMemo` vs `useCallback` — when does memoization *hurt*?
3. `React.memo` and referential equality pitfalls.
4. Why does `useEffect` run twice in StrictMode (dev)?
5. Reconciliation and why keys must be stable & unique.
6. `useLayoutEffect` vs `useEffect`.
7. Context re-render fan-out — how do you avoid it?
8. Custom hook design — build a `useDebouncedValue` and a typed `useFetch`.
9. Error boundaries — what they catch and what they don't.
10. Concurrent features: `useTransition`, `useDeferredValue`, Suspense.
11. React 19: `use`, actions, `useOptimistic`, `useActionState`.

### Next.js
12. SSR vs SSG vs ISR vs RSC — choose one per scenario and defend.
13. What problem do React Server Components solve?
14. App Router caching layers and `revalidate`.
15. Server Actions — when and why.
16. When would you *not* use SSR?

**⭐ Self-grade:** Explained the "why" behind rendering choices, showed perf intuition, wrote a clean custom hook, precise on caching.

---

## Round 6 — Behavioral / Hiring Manager (45 min)

*STAR format. Show ownership, trade-offs, mentoring, impact with metrics.*

1. Tell me about a feature you owned end-to-end.
2. Describe a hard technical trade-off you made and how you defended it.
3. A time you improved performance — what metric, before/after numbers?
4. A conflict with a teammate or PM — how did you resolve it?
5. A production incident you handled — detection, fix, prevention.
6. How do you mentor juniors / review PRs / set standards?
7. A project that failed or slipped — what did you learn?
8. How do you decide between shipping fast vs building it right?
9. Why this company? What do you know about our product?
10. Where do you see yourself in 2–3 years?

**⭐ Self-grade:** 5 crisp STAR stories ready, quantified impact ("LCP 4.2s→1.8s, +12% conversion"), owned failures, senior signal (mentoring, standards).

---

## Round 7 — Salary Negotiation / HR Closing (30 min)

1. What's your expected CTC? (Give a band, anchor high but reasonable.)
2. Break down your current offer: fixed, variable, ESOP/RSU, joining bonus.
3. Do you have competing offers? What are the numbers?
4. What's your priority — fixed cash, equity, or growth?
5. What level do you see yourself joining at (SDE-2 / Senior / SDE-3)?
6. How soon can you join? (notice + buyout framing)

**Your negotiation playbook:**
- Anchor on **fixed comp**, not just CTC.
- Ask for the **full breakdown** in writing before accepting.
- Use competing offers as leverage — product cos. expect negotiation.
- Ask about level, growth path, on-call, team seniority, stack modernity.
- Never accept on the call — ask for time to review.
- Confirm **join date + buyout** in writing.

**⭐ Self-grade:** Anchored confidently, compared fixed not CTC, used leverage without bluffing, negotiated level + join date.

---

## Post-Mock Scorecard

| Round | Time | Self-score (1–5) | Gaps to fix |
|-------|------|------------------|-------------|
| Recruiter screen | | | |
| DSA | | | |
| JS internals | | | |
| Machine coding | | | |
| System design | | | |
| React/Next | | | |
| Behavioral / HM | | | |
| Salary negotiation | | | |

> **Rule:** Any round ≤ 3 → drill it before the next mock. This tier rejects on DSA and system design most often.
