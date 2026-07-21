# Senior Frontend Developer — Market Preparation Guide (India, 5–6 Years)

> Target role: **Senior Full-Stack (Frontend focus)** — HTML, CSS, JavaScript, TypeScript, React, Next.js
> Experience band: **5–6 years** | Market: **India (2025–2026)** | Expected CTC band: **₹22–45 LPA** (product cos. higher)
> This file covers **Frontend only**. Backend (Node, Express, Nest) will be a separate guide.

---

## 1. Market Research — What India Actually Hires For (5–6 YOE)

### 1.1 Company tiers and what they weigh
| Tier | Examples (type) | What they test most | CTC band (Sr, 5–6y) |
|------|-----------------|---------------------|---------------------|
| **Product (FAANG-adjacent / unicorns)** | Google, Microsoft, Atlassian, Uber, Flipkart, Swiggy, Razorpay, Zeta, PhonePe | DSA + JS internals + Frontend System Design + React perf | ₹35–60+ LPA |
| **Mid product / funded startups** | Postman, Groww, CRED, Meesho, Zerodha, Freshworks | JS deep-dive + React/Next + machine coding + system design | ₹28–45 LPA |
| **Service / consulting (premium)** | ThoughtWorks, Nagarro, GlobalLogic, Publicis Sapient | Practical coding + architecture + communication | ₹18–30 LPA |
| **Service (volume)** | TCS, Infosys, Wipro, Cognizant, Accenture | Fundamentals + project depth + framework basics | ₹12–22 LPA |
| **GCC / captive centers** | Walmart Global Tech, Target, Wells Fargo, Mastercard | DSA + system design + React internals | ₹30–50 LPA |

### 1.2 What "Senior" means to interviewers here
At 5–6 years they expect you to **own features end-to-end**, not just write components:
- Break ambiguous requirements into an architecture and a delivery plan.
- Make trade-off decisions (perf vs. dev-speed, SSR vs. CSR, state library choice) and **defend them**.
- Mentor juniors, review PRs, set frontend standards (linting, testing, accessibility).
- Handle performance, security, accessibility, and observability — not just "make it work".

### 1.3 Interview rounds you will face (typical senior loop)
1. **Online / DSA screen** — 1–2 medium problems (arrays, strings, hashmaps, recursion, trees). Product cos. and GCCs enforce this hard.
2. **JavaScript deep-dive** — output prediction, closures, `this`, event loop, promises, polyfills.
3. **Machine coding / live UI build** — build a working component in 60–90 min (autocomplete, infinite scroll, todo, star rating, carousel).
4. **Frontend System Design** — design a scalable frontend (news feed, chat, dashboard, image gallery). This is the **biggest differentiator at senior level**.
5. **React/Next deep-dive** — hooks internals, reconciliation, rendering strategies, perf.
6. **Behavioral / hiring manager** — ownership stories, conflict, mentoring, trade-offs.

### 1.4 The 2025–2026 skill demand signal (India job posts)
- **TypeScript is now non-negotiable** for senior FE roles — expected, not a bonus.
- **Next.js (App Router, RSC)** demand is rising sharply; many product cos. moved off CRA.
- **Testing** (Jest + React Testing Library) explicitly required in senior JDs.
- **Performance & Core Web Vitals** knowledge separates mid from senior.
- **Accessibility (a11y / WCAG)** increasingly asked, especially at GCCs and global product cos.
- **State management**: Redux Toolkit still dominant in enterprise; Zustand/Jotai/TanStack Query rising.
- **AI-assisted dev fluency** (Copilot, prompt-driven workflows) now a soft expectation.

---

## 2. Self-Assessment — Rate Yourself Before You Start

Score each 1–5 (1 = shaky, 5 = can teach it). Anything ≤ 3 goes to the top of your revision queue.

- [ ] Core JS: closures, hoisting, scope, `this`, prototypes
- [ ] Async JS: event loop, microtasks/macrotasks, promises, async/await
- [ ] ES6+ features and when to use them
- [ ] TypeScript: generics, utility types, discriminated unions, narrowing
- [ ] CSS: flexbox, grid, specificity, responsive, positioning
- [ ] React: hooks, reconciliation, memoization, context, refs
- [ ] React performance: re-render control, code splitting, virtualization
- [ ] Next.js: SSR/SSG/ISR/RSC, routing, data fetching, caching
- [ ] State management: Redux Toolkit / Zustand / TanStack Query
- [ ] Testing: Jest + RTL, what to test and how
- [ ] Frontend System Design: component architecture, data flow, scaling
- [ ] Web fundamentals: HTTP, CORS, caching, browser rendering
- [ ] Performance: Core Web Vitals, bundle optimization, lazy loading
- [ ] Security: XSS, CSRF, CSP, auth token handling
- [ ] Accessibility: semantic HTML, ARIA, keyboard nav
- [ ] DSA: arrays, strings, hashmaps, recursion, trees, complexity

> Your workspace already has strong material for most of these — I map each phase to your existing notes below so revision is faster.

---

## 3. The Step-by-Step Revision Plan (8 Phases)

> Suggested cadence: **6–8 weeks** if job-hunting actively (2–3 hrs/day). Compress or expand per your timeline.
> Each phase = **Revise → Build → Drill (interview Qs)**.

### Phase 0 — Foundation Warm-up (2–3 days)
**Goal:** refresh HTML/CSS so it never costs you a machine-coding round.
- HTML: semantic elements, forms, accessibility basics, meta/SEO tags.
- CSS: box model, flexbox, grid, positioning, specificity, responsive units, `rem`/`em`/`vh`/`vw`.
- Practice: build a responsive card grid + a modal + a navbar **from scratch, no library**.

📁 Your notes: [HTML/HTML-Beginner-Guide.md](../HTML/HTML-Beginner-Guide.md), [HTML/HTML-Advanced-Guide.md](../HTML/HTML-Advanced-Guide.md), [CSS/CSS-Beginner-Guide.md](../CSS/CSS-Beginner-Guide.md), [CSS/CSS-Advanced-Guide.md](../CSS/CSS-Advanced-Guide.md)

**Interview checkpoints:** `display` values, flexbox vs grid, specificity calc, centering a div (5 ways), CSS `position` types, `z-index` stacking context.

---

### Phase 1 — JavaScript Mastery (6–8 days) ⭐ highest ROI
**Goal:** be unbreakable on JS internals — this round eliminates most candidates.
- Scope, hoisting, TDZ, closures, IIFE.
- `this` binding rules, `call`/`apply`/`bind`.
- Prototypes and prototypal inheritance.
- Event loop: call stack, microtask vs macrotask queue, `setTimeout` vs `Promise.then`.
- Promises, async/await, `Promise.all/race/allSettled/any`.
- `var`/`let`/`const`, temporal dead zone, block scope.
- Deep vs shallow copy, reference vs value.

**Build (polyfills — very commonly asked):** implement `map`, `filter`, `reduce`, `bind`, `debounce`, `throttle`, `curry`, `Promise.all`, `deepClone`, event emitter.

📁 Your notes: [JavaScript/JavaScript-Fundamentals-Part-1.md](../JavaScript/JavaScript-Fundamentals-Part-1.md), [JavaScript/JavaScript-Core-Concepts-Part-2.md](../JavaScript/JavaScript-Core-Concepts-Part-2.md), [JavaScript/JavaScript-Advanced-Concepts-Part-3.md](../JavaScript/JavaScript-Advanced-Concepts-Part-3.md), [JavaScript/JavaScript-ES6-Modern-Features.md](../JavaScript/JavaScript-ES6-Modern-Features.md)
📁 Practice utilities you already have: [Programing/Debounce.js](../Programing/Debounce.js), [Programing/Throttle.js](../Programing/Throttle.js), [Programing/Currying.js](../Programing/Currying.js), [Programing/prototype.js](../Programing/prototype.js), [Programing/oop.js](../Programing/oop.js)

**Interview checkpoints:** output-prediction snippets, "explain the event loop", closures in loops, `this` in arrow vs regular functions, debounce vs throttle difference.

---

### Phase 2 — TypeScript (4–5 days) ⭐ now mandatory
**Goal:** write and reason about typed React/Next code confidently.
- Types vs interfaces, when to use which.
- Generics (functions, components, constraints).
- Utility types: `Partial`, `Pick`, `Omit`, `Record`, `Required`, `Readonly`, `ReturnType`.
- Union/intersection, discriminated unions, narrowing, type guards.
- `unknown` vs `any` vs `never`, assertion, `as const`.
- Typing React: props, hooks, events, generic components.

📁 Your notes: [TypeScript/TypeScript-Complete-Guide.md](../TypeScript/TypeScript-Complete-Guide.md)

**Interview checkpoints:** implement a generic `useFetch` hook typed, difference between `type` and `interface`, build a discriminated union for API state.

---

### Phase 3 — React Deep Dive (8–10 days) ⭐ core round
**Goal:** senior-level React — internals, hooks, and performance.
- Hooks: `useState`, `useEffect` (deps + cleanup), `useRef`, `useMemo`, `useCallback`, `useReducer`, `useContext`, `useLayoutEffect`, custom hooks.
- Reconciliation, virtual DOM, keys, why lists need stable keys.
- Re-render mechanics: what triggers re-renders, `React.memo`, referential equality.
- Controlled vs uncontrolled components, forms.
- Context API pitfalls (re-render fan-out) and when to reach for a state library.
- Error boundaries, portals, refs/forwarding.
- **React 19**: `use`, actions, `useOptimistic`, `useActionState`, server components basics.

**Build (machine-coding classics):** autocomplete/typeahead, infinite scroll, debounced search, star rating, accordion, tabs, modal, todo with filters, pagination, nested comments.

📁 Your notes: [React/React-Beginner-Guide.md](../React/React-Beginner-Guide.md), [React/React-Advanced-Guide.md](../React/React-Advanced-Guide.md), [React/React-19-New-Features.md](../React/React-19-New-Features.md), [React/React-Authentication-Guide.md](../React/React-Authentication-Guide.md), [React/React-Production-PWA-Guide.md](../React/React-Production-PWA-Guide.md)
📁 Practice repos: [ReactMachineCoding/react-jest-test-case-practice](../ReactMachineCoding/react-jest-test-case-practice/), [ReactMachineCoding/redux-toolkit-practice](../ReactMachineCoding/redux-toolkit-practice/)

**Interview checkpoints:** `useMemo` vs `useCallback`, when memoization hurts, why `useEffect` runs twice in StrictMode, custom hook design, prevent unnecessary re-renders.

---

### Phase 4 — State Management (4–5 days)
**Goal:** justify a state strategy and implement the dominant tools.
- Local vs global vs server state (this distinction is a senior signal).
- **Redux Toolkit**: slices, `createAsyncThunk`, RTK Query, normalization.
- **Zustand**: minimal global store, selectors, when to prefer it.
- **TanStack Query (React Query)**: caching, invalidation, mutations — the modern server-state answer.
- When Context is enough vs when you need a library.

📁 Your notes: [WebAppConcept/Zustand-vs-ReduxToolkit-NextJS.md](../WebAppConcept/Zustand-vs-ReduxToolkit-NextJS.md)
📁 Practice: [ReactMachineCoding/redux-toolkit-practice](../ReactMachineCoding/redux-toolkit-practice/)

**Interview checkpoints:** "server state vs client state", why RTK Query/React Query over manual `useEffect` fetching, Zustand vs Redux trade-offs.

---

### Phase 5 — Next.js (6–8 days) ⭐ rising demand
**Goal:** command rendering strategies and the App Router.
- Routing: App Router vs Pages Router, layouts, nested routes, dynamic routes.
- Rendering: CSR, SSR, SSG, ISR — and **when to choose each**.
- **React Server Components** and Server Actions.
- Data fetching + caching (App Router `fetch` caching, revalidation).
- Route handlers / API routes, middleware.
- Auth patterns, SEO, metadata, image optimization.
- Next 15/16 latest changes.

📁 Your notes: [Next/NextJS-Beginner-Guide.md](../Next/NextJS-Beginner-Guide.md), [Next/NextJS-Advanced-Guide.md](../Next/NextJS-Advanced-Guide.md), [Next/NextJS-15-16-Latest-Features-Guide.md](../Next/NextJS-15-16-Latest-Features-Guide.md), [Next/NextJS-Authentication-Guide.md](../Next/NextJS-Authentication-Guide.md)

**Interview checkpoints:** SSR vs SSG vs ISR trade-offs, what RSC solves, when NOT to use SSR, caching layers in App Router.

---

### Phase 6 — Frontend System Design (6–8 days) ⭐⭐ senior differentiator
**Goal:** design scalable frontends and defend trade-offs — this is where seniors win offers.
- Requirements → components → data flow → state → API contract.
- Component architecture, design systems, reusability.
- Rendering strategy selection, code splitting, lazy loading.
- Data fetching patterns, caching, optimistic updates, pagination/infinite scroll.
- Performance budget, Core Web Vitals, image/asset strategy.
- Accessibility, i18n, error/loading states, offline/PWA.
- Observability: error tracking, RUM, logging.

**Practice designs:** news feed (Twitter/FB), chat app, e-commerce listing, autocomplete at scale, image gallery, dashboard with live data, infinite scroll feed, file upload.

📁 Your notes: [SystemDesign/Frontend-System-Design-Round.md](../SystemDesign/Frontend-System-Design-Round.md), [SystemDesign/Frontend-Security-System-Design.md](../SystemDesign/Frontend-Security-System-Design.md), [SystemDesign/System-Design-Advanced-Concepts.md](../SystemDesign/System-Design-Advanced-Concepts.md), [SystemDesign/System-Design-Products.md](../SystemDesign/System-Design-Products.md)

**Interview checkpoints:** "Design Twitter feed frontend", how to render 10k rows (virtualization), optimistic UI, cache invalidation strategy.

---

### Phase 7 — Cross-Cutting Concerns (5–6 days)
**Goal:** the topics that separate mid from senior.

**Performance**
- Core Web Vitals (LCP, INP, CLS) and how to fix each.
- Bundle analysis, tree shaking, code splitting, dynamic imports.
- Lazy loading, image optimization, virtualization (react-window).
- Memoization strategy, avoiding waterfalls, prefetching.

**Security** (OWASP-aware)
- XSS (stored/reflected/DOM), sanitization, `dangerouslySetInnerHTML`.
- CSRF, CORS, CSP headers.
- Auth token storage (cookie vs localStorage), JWT handling, refresh flow.

📁 [SystemDesign/Frontend-Security-System-Design.md](../SystemDesign/Frontend-Security-System-Design.md)

**Testing**
- Jest + React Testing Library: query priorities, user-event, mocking.
- What to test (behavior, not implementation), coverage philosophy.
- 📁 Practice: [ReactMachineCoding/react-jest-test-case-practice](../ReactMachineCoding/react-jest-test-case-practice/)

**Accessibility**
- Semantic HTML, ARIA roles, keyboard navigation, focus management, WCAG basics.

**Web fundamentals**
- HTTP/HTTPS, status codes, REST, caching headers, CORS, cookies.
- Browser rendering: critical rendering path, repaint/reflow, debouncing scroll.

---

### Phase 8 — DSA + Machine Coding Drills (ongoing, parallel)
**Goal:** clear the screening + live-build rounds.
- **DSA (JS):** arrays, strings, hashmaps, two-pointers, sliding window, recursion, stacks/queues, trees, basic DP. Aim ~80–120 curated mediums.
- **Complexity:** be fluent in Big-O for your solutions.
- **Machine coding:** timed 60-min builds; focus on working UI + clean state + edge cases + a11y.

📁 Practice base: [Programing/](../Programing/)

**Interview checkpoints:** talk through approach before coding, state complexity, handle edge cases, write clean readable code under time.

---

## 4. Weekly Schedule Template (8-week sprint)

| Week | Focus | Deliverable |
|------|-------|-------------|
| 1 | Phase 0 + Phase 1 (JS) | All polyfills implemented from memory |
| 2 | Phase 1 finish + Phase 2 (TS) | 20 output-prediction Qs + typed useFetch |
| 3 | Phase 3 (React) | 3 machine-coding builds |
| 4 | Phase 3 finish + Phase 4 (State) | RTK Query + Zustand mini apps |
| 5 | Phase 5 (Next.js) | SSR/ISR demo app |
| 6 | Phase 6 (System Design) | 4 written frontend designs |
| 7 | Phase 7 (Perf/Security/Testing/a11y) | Perf audit + test suite |
| 8 | Phase 8 mock loop | 3 full mock interviews |

> Run **Phase 8 (DSA + machine coding) in parallel** — 30–45 min daily throughout.

---

## 5. Interview-Ready Checklist (print this)

**JavaScript**
- [ ] Explain event loop with micro/macro tasks
- [ ] Implement debounce, throttle, curry, deepClone, Promise.all
- [ ] Closures, `this`, prototype output questions

**TypeScript**
- [ ] Generics + utility types on demand
- [ ] Type a real React hook/component live

**React**
- [ ] Control re-renders; explain memo/useMemo/useCallback
- [ ] Build autocomplete + infinite scroll in <60 min
- [ ] Custom hooks, error boundaries, refs

**Next.js**
- [ ] Choose and defend SSR/SSG/ISR/RSC per scenario
- [ ] Explain App Router caching + Server Actions

**System Design**
- [ ] Design news feed / chat / dashboard end-to-end
- [ ] Virtualization, caching, optimistic updates

**Cross-cutting**
- [ ] Fix each Core Web Vital
- [ ] Prevent XSS/CSRF; secure token storage
- [ ] Write RTL tests for a component
- [ ] Make a component accessible

**Behavioral**
- [ ] 5 STAR stories: ownership, conflict, mentoring, failure, trade-off

---

## 6. Salary & Negotiation Notes (India, Sr FE 5–6y)

- **Know your band before the HR call.** Product/GCC seniors: ₹30–50 LPA; premium service: ₹18–30 LPA; volume service: ₹12–22 LPA.
- Break down offers: **fixed + variable + ESOP/RSU + joining bonus** — compare fixed, not just CTC.
- Leverage **competing offers**; product cos. expect negotiation.
- Ask about **on-call, tech stack modernity, team seniority, growth path** — seniors are judged on this too.
- Levels: most map you to **SDE-2 / Senior SDE / SDE-3** depending on system-design and ownership signal.

---

## 7. Resume & Positioning (senior signal)

- Lead with **impact + metrics**: "Cut LCP from 4.2s → 1.8s, +12% conversion."
- Show **ownership**: led migrations, set up testing/CI, mentored N juniors.
- Highlight **modern stack**: TypeScript, Next App Router, RTK Query/React Query, testing.
- Keep DSA sharp but **sell system-design + delivery** — that's what 5–6y buys.
- You have a real portfolio project to reference: [developer-study-guide](../developer-study-guide/) (Next 16 App Router).

---

## 8. Your Existing Assets Map (use what you already wrote)

| Topic | Your notes |
|-------|-----------|
| HTML | [HTML/](../HTML/) |
| CSS | [CSS/](../CSS/) |
| JavaScript | [JavaScript/](../JavaScript/) |
| TypeScript | [TypeScript/](../TypeScript/) |
| React | [React/](../React/) |
| Next.js | [Next/](../Next/) |
| System Design | [SystemDesign/](../SystemDesign/) |
| State mgmt | [WebAppConcept/Zustand-vs-ReduxToolkit-NextJS.md](../WebAppConcept/Zustand-vs-ReduxToolkit-NextJS.md) |
| Machine coding / testing | [ReactMachineCoding/](../ReactMachineCoding/) |
| Core JS utilities | [Programing/](../Programing/) |
| Portfolio project | [developer-study-guide/](../developer-study-guide/) |

---

## 9. When to Start Applying (Timing & Channels)

### 9.1 When in your prep — don't wait for "100% ready"
Start at **~60–70% readiness**, not 100%. Your first 3–4 interviews are practice — **don't burn a top-choice company as your first attempt.**

| Milestone | Action |
|-----------|--------|
| **After Phase 3 (React done)** | Apply to tier-3 / tier-2 companies as *live mocks* — real pressure exposes gaps faster than solo study |
| **After Phase 6 (System Design done)** | Open up to dream / product / GCC targets — this round is the senior differentiator |
| **During Phase 7–8** | Final loops land while you're peaking; pipelines take **3–6 weeks** (screen → loops → offer → negotiation) |

### 9.2 When in the calendar year — India hiring cycles
| Period | Hiring activity | Verdict |
|--------|----------------|---------|
| **Jan–Mar** | 🔥 Highest — new fiscal budgets (Apr–Mar), fresh headcount | **Best window** |
| **Apr–Jun** | Strong — budgets active, post-appraisal backfills | **Very good** |
| **Jul–Sep** | Moderate — steady product/GCC hiring | Good |
| **Oct–Nov** | Slower — festive season (Diwali), freezes | Weak |
| **Dec** | Lowest — year-end, holidays, HMs out | Avoid starting |

### 9.3 Recommended timeline (from a ~6–8 week sprint)
1. **Now → 2 weeks:** finish Phase 1–2, polish resume + LinkedIn, quietly turn on "Open to work".
2. **~Phase 3 done (~4 weeks):** start warm-up applications (2–3/week).
3. **~Phase 6 done (~6–7 weeks):** open the floodgates to product/GCC targets.
4. **Align final loops with the Jan–Mar peak** for the best offers and leverage.

### 9.4 Channels (in order of effectiveness)
- **Referrals** (ping ex-colleagues before applying cold) — beats portals in India by a wide margin.
- **Instahyre, Cutshort, Wellfound (AngelList)** — strong for product/startup senior roles.
- **LinkedIn** — "Open to work" + recruiter InMails + direct HM outreach.
- **Company career pages / GCC portals** — for specific targets (Walmart, Target, etc.).
- **Naukri** — high volume, better for service-tier roles.

---

## 10. Remote Job Strategy

### 10.1 Remote job types (know which you're targeting)
| Type | Pay | Reality |
|------|-----|---------|
| **Indian company, remote** | ₹ (same as onsite band) | Easiest; normal interview loop |
| **Global company with India entity / GCC remote** | ₹ high-end + benefits | Payroll in India, global work |
| **International remote (contractor)** | $30–80/hr or $50–120k+/yr | You invoice; handle your own tax |
| **International remote (EOR full-time)** | USD salary via Deel/Remote.com | Company hires you legally via Employer-of-Record |

### 10.2 Step-by-step to land remote (esp. international)
1. **Fix fundamentals first** — remote bars are *higher*; async communication + self-management are tested.
2. **Rebuild resume for remote/global:** impact + metrics; add "Remote (IST, overlap with EU/US till X)" — overlap hours are a top filter; 1 page, ATS-friendly.
3. **Strengthen online presence** (they can't meet you):
   - **GitHub** with 2–3 polished projects + good READMEs (your [developer-study-guide](../developer-study-guide/) counts).
   - **LinkedIn** headline + "Open to work: Remote".
   - A simple **portfolio site** (deploy on Vercel).
4. **Sharpen communication** — clear written English, good webcam/mic, quiet setup. Remote interviews weight this heavily.
5. **Apply where remote roles live** (below), prioritizing **referrals**.
6. **Handle legal/payment layer** — international uses **Deel / Remote.com / Papaya** (EOR) or contractor invoicing. Understand Indian tax on foreign income (consult a CA).

### 10.3 Where to apply — platforms
**International remote (best pay)**
- **Wellfound** (AngelList Talent) — startup remote, salary shown.
- **RemoteOK** — 100% remote board.
- **We Work Remotely** — large, established remote board.
- **Remotive** — curated remote + community.
- **Toptal / Turing / Arc.dev / Braintrust** — vetted talent networks (pass a test, get matched).
- **Deel Talent / Remote.com jobs** — EOR-backed global full-time.
- **Himalayas** — remote jobs with timezone filters.
- **Otta** — quality product/startup roles (many remote).

**India-based & global (mixed remote)**
- **Instahyre**, **Cutshort** — senior product roles, remote filter.
- **LinkedIn** — filter `Remote`; direct recruiter/HM outreach works best.
- **Naukri** — volume, filter remote.
- **Y Combinator "Work at a Startup"** — YC-backed, many remote-friendly.

**Contract/freelance ramp (fast income + global clients)**
- **Toptal**, **Gun.io**, **Contra**, **Upwork** (senior rates only).

### 10.4 What makes remote candidates get picked
- **Timezone overlap** clearly stated (huge filter for US/EU teams).
- **Async communication** proof — clear writing, documentation habit.
- **Proven autonomy** — "owned X end-to-end, remote team of Y".
- **Strong CI/testing/code-review discipline** — remote teams trust process.

### 10.5 Honest expectations
- International remote is **more competitive**; interviews are tougher (DSA + system design + strong communication).
- Start with **Indian remote + warm-up** roles while building the profile, then push global once Phases 3–6 are done.
- **Referrals still win** — engage in communities (Reddit r/remotejs, dev Discords/Slacks, tech Twitter).

---

## 11. Handling a 90-Day Notice Period

The 90-day notice is the biggest friction point in the Indian market — many companies want joiners in 30–45 days. Here's how to still get calls.

### 11.1 Why it hurts
Recruiters filter on "availability to join." A 90-day notice makes you look **3 months out**, so they deprioritize you. Your job is to **remove or reframe that objection early.**

### 11.2 What to do
1. **Apply immediately — never resign first.** Pipelines take 3–6 weeks; start ~60 days before your target join date so the process eats into the notice naturally. Always apply while employed.
2. **Reframe notice everywhere it's asked:**
   - On portals/ATS, enter **"90 days (negotiable to 30–45 with buyout)"** rather than a flat "90".
   - Say it proactively in the recruiter screen (script below).
3. **Use the levers that shorten notice:**
   - **Buyout** — offer to buy out remaining notice; many new employers reimburse it (ask). Strongest lever.
   - **Leave adjustment** — unused earned leave reduces effective last working day.
   - **Early release request** — managers often approve after a clean handover.
   - **Negotiate at offer stage** — companies serious about you will wait or push for early release.
4. **Target employers who don't care about 90 days:** product cos. / GCCs (Walmart, Google, etc.) plan ahead; international remote / EOR roles are flexible on start dates. Avoid urgent-backfill service roles demanding "immediate joiners".
5. **Lead with referrals** — a human champion makes the recruiter look past the 90 days and bypasses auto-filters.
6. **Keep the pipeline warm** — being 3 months out means you can afford long loops; collect **multiple offers** and use them to negotiate both **CTC and early release**.

### 11.3 Recruiter-screen script
> "Just to set expectations upfront — my notice is 90 days but **buyout-eligible**, and I'm actively pursuing early release, so realistically I can join in **~45–60 days**. Does that work for your timeline?"

### 11.4 What NOT to do
- Don't **resign before** you have a signed offer.
- Don't **hide** the 90 days — it surfaces at offer stage and burns trust.
- Don't accept an offer that **forces** an impossible join date without early-release/buyout agreed **in writing**.

---

## 12. Next Step

You already have strong written material for almost every phase. **Start with Phase 1 (JavaScript)** — it's the highest-ROI and the round that eliminates most candidates.

> When you're ready, ask for the **Backend guide (Node, Express, Nest, DB, System Design)** and I'll create the matching companion file.

---

*Last reviewed: for the 2025–2026 India hiring cycle. Re-verify salary bands and stack demand against live JDs (LinkedIn, Instahyre, Wellfound, Cutshort) before each application wave.*
