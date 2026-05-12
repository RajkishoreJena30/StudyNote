# 🎨 ResumeForge — Frontend Product Backlog
### Epic → Feature → Story → Task Breakdown
> **Product**: ResumeForge — AI-Powered Resume Builder & Career Coach
> **Stack**: Next.js 14 (App Router) + TypeScript + Tailwind CSS + Zustand + React Hook Form + Zod + Monaco Editor + Socket.io-client
> **Team Size**: 3 devs (2 Frontend, 1 QA) | **Sprint Length**: 2 weeks
> **Total Estimated Effort**: ~28 weeks (14 sprints) | **Scale Target**: 50k–500k users

---

## 📦 Product Features Overview

| # | Feature Area | Description |
|---|---|---|
| 1 | **Authentication & Onboarding** | Register, Login, Google OAuth, onboarding wizard |
| 2 | **Resume Builder (Step-by-Step)** | Multi-step form with live preview — Personal, Experience, Education, Skills, Projects, Certifications |
| 3 | **Template Gallery & Download** | 10+ professional templates, PDF/DOCX/JSON export |
| 4 | **Resume Score & Analysis** | ATS score breakdown, section-level scoring, improvement tips |
| 5 | **LaTeX Editor** | Monaco-based LaTeX editor, live preview, PDF/Word export |
| 6 | **AI Resume Assistant** | AI chat helper, section rewrite suggestions, bullet point optimizer |
| 7 | **PDF Upload → LaTeX Converter** | Upload existing resume PDF, parse and generate LaTeX source |
| 8 | **Upskilling Dashboard** | Skill gap analysis, concept cards to read, curated interview Q&A, mock interview rounds |
| 9 | **Resume Management** | Dashboard to manage multiple resumes, rename, clone, archive |
| 10 | **Settings & Profile** | Account settings, API key for AI, notification preferences |

---

## 🗺️ Roadmap Overview

```
Q1 (Sprint 1–4)   → Core: Auth + Resume Builder + Template Gallery + Download
Q2 (Sprint 5–8)   → Intelligence: Resume Score + LaTeX Editor + AI Assistant
Q3 (Sprint 9–11)  → Upload & Parse: PDF→LaTeX + Resume Management
Q4 (Sprint 12–14) → Career: Upskilling Dashboard + Mock Interview + Polish
```

---

## 📚 Table of Contents

- [EPIC 1 — Authentication & Onboarding](#epic-1--authentication--onboarding)
- [EPIC 2 — Resume Builder (Step-by-Step)](#epic-2--resume-builder-step-by-step)
- [EPIC 3 — Template Gallery & Download](#epic-3--template-gallery--download)
- [EPIC 4 — Resume Score & ATS Analysis](#epic-4--resume-score--ats-analysis)
- [EPIC 5 — LaTeX Editor with Live Preview](#epic-5--latex-editor-with-live-preview)
- [EPIC 6 — AI Resume Assistant](#epic-6--ai-resume-assistant)
- [EPIC 7 — PDF Upload → LaTeX Converter](#epic-7--pdf-upload--latex-converter)
- [EPIC 8 — Upskilling Dashboard](#epic-8--upskilling-dashboard)
- [EPIC 9 — Resume Management Dashboard](#epic-9--resume-management-dashboard)
- [EPIC 10 — Settings & Profile](#epic-10--settings--profile)
- [Sprint Plan Summary](#sprint-plan-summary)
- [Definition of Ready & Done](#definition-of-ready--done)

---

---

# EPIC 1 — Authentication & Onboarding

> **Goal**: Users can register, log in, and complete an onboarding flow that collects initial career context.
> **Priority**: 🔴 P0 — Must have (Sprint 1)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**
> **Next.js Concepts**: App Router layouts, Server Actions, middleware-based route protection, `next/navigation`

---

## Feature 1.1 — Auth (Register / Login / Google OAuth)

**Acceptance Criteria**:
- [ ] User can register with name, email, password
- [ ] User can log in and receive JWT (access in memory, refresh in httpOnly cookie)
- [ ] Google OAuth one-click sign-in
- [ ] Unauthenticated users redirected to `/login` via middleware
- [ ] Auth state persisted across page refreshes via `/auth/me` call on mount

---

### Story 1.1.1 — Register & Login Pages

> **As a** new user, **I want to** create an account, **so that** my resumes are saved and associated with my profile.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/(auth)/register/page.tsx` layout | FE Dev | 2h | Two-column: left = form, right = product feature highlight. Responsive |
| T2 | `app/(auth)/login/page.tsx` | FE Dev | 1h | Email + password, show/hide toggle, "Remember me", forgot password link |
| T3 | React Hook Form + Zod schemas | FE Dev | 2h | `registerSchema` (name, email, password regex, confirmPassword refine), `loginSchema` |
| T4 | Zustand `authStore` — user + token state | FE Dev | 2h | `useAuthStore` — `{ user, accessToken, setAuth, clearAuth }` |
| T5 | `POST /auth/register` + `POST /auth/login` API calls | FE Dev | 1h | Axios client with base URL, typed responses using shared DTOs |
| T6 | Redirect after login to `/dashboard` or return URL | FE Dev | 1h | `useSearchParams` → `returnUrl` param → `router.push` |
| T7 | Tests | QA | 2h | Form validation errors, successful login redirect, wrong password error |

---

### Story 1.1.2 — Google OAuth Button

> **As a** user, **I want to** sign in with Google in one click, **so that** I don't need to remember a password.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `@react-oauth/google` integration | FE Dev | 1h | `GoogleOAuthProvider` in root layout, `GoogleLogin` component in auth pages |
| T2 | Exchange Google `id_token` with backend | FE Dev | 1h | `POST /auth/google` → receive access + set refresh cookie |
| T3 | Error handling — popup blocked fallback | FE Dev | 0.5h | Redirect flow if popup blocked |
| T4 | Tests | QA | 1h | Mock Google token, verify auth state set |

---

### Story 1.1.3 — Middleware Route Protection

> **As a** system, **I want to** block unauthenticated access to protected routes, **so that** user data is secure.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `middleware.ts` — check auth cookie | FE Dev | 1.5h | Read `refreshToken` cookie → if missing and path is `/dashboard/*`, `/resume/*`, `/editor/*` → redirect `/login?returnUrl=...` |
| T2 | `config.matcher` for protected routes | FE Dev | 0.5h | Matcher array for all protected segments |
| T3 | Token refresh on app load | FE Dev | 1h | `app/layout.tsx` Server Component → call `GET /auth/me` → hydrate Zustand via client component |
| T4 | Tests | QA | 1h | Unauthenticated access to `/dashboard` → redirect to login |

---

## Feature 1.2 — Onboarding Wizard

**Description**: After first registration, collect career context — current role, target role, experience level, tech stack. Used to personalize template suggestions and upskilling recommendations.

**Acceptance Criteria**:
- [ ] 4-step onboarding modal shown on first login only
- [ ] Steps: (1) Current Role, (2) Target Role + Industry, (3) Experience Level, (4) Primary Tech Stack
- [ ] Skip option available at each step
- [ ] Data saved to user profile on completion
- [ ] `onboardingComplete` flag prevents showing again

---

### Story 1.2.1 — Onboarding Multi-Step Modal

> **As a** new user, **I want to** tell the app about my career goals, **so that** I get personalized resume templates and upskilling suggestions.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `OnboardingModal.tsx` — step controller | FE Dev | 2h | `useState currentStep`, progress bar (4 dots), animated step transitions with `framer-motion` |
| T2 | Step 1: Current Role input | FE Dev | 1h | Searchable combobox — "Software Engineer", "Designer", etc. Free-type allowed |
| T3 | Step 2: Target Role + Industry | FE Dev | 1h | Target role combobox + Industry dropdown (Tech, Finance, Healthcare...) |
| T4 | Step 3: Experience level | FE Dev | 0.5h | Radio group — Fresher / 1–3 years / 3–7 years / 7+ years |
| T5 | Step 4: Tech stack multi-select | FE Dev | 1h | Tag input with autocomplete — predefined tech list, free-type allowed, max 15 |
| T6 | `PATCH /users/onboarding` API call | FE Dev | 0.5h | Submit all collected data, set `onboardingComplete: true` |
| T7 | Check flag on dashboard mount | FE Dev | 0.5h | If `!user.onboardingComplete` → show modal |
| T8 | Tests | QA | 1h | Step navigation, skip, submit, flag check |

---

---

# EPIC 2 — Resume Builder (Step-by-Step)

> **Goal**: Users can build a complete resume through a guided multi-step form with a live-updating preview panel side-by-side.
> **Priority**: 🔴 P0 — Core product value (Sprint 2–4)
> **Total Estimate**: **34 Story Points** | ~**7 weeks**
> **Next.js Concepts**: App Router dynamic routes, Server Actions for auto-save, `useOptimistic`, `useFormState`, React Suspense for preview

---

## Feature 2.1 — Resume Builder Layout

**Description**: Split-pane layout — left = multi-step form, right = live PDF preview. Progress indicator. Sections: Personal Info, Summary, Work Experience, Education, Skills, Projects, Certifications, Languages, Custom.

**Acceptance Criteria**:
- [ ] Desktop: 50/50 split — form on left, live preview on right
- [ ] Mobile: Tab switcher — "Edit" tab / "Preview" tab
- [ ] Section sidebar showing all sections with completion % per section
- [ ] Auto-save every 30 seconds via Server Action
- [ ] Unsaved changes indicator in header

---

### Story 2.1.1 — Builder Shell Layout

> **As a** user, **I want to** see my resume update in real-time as I fill in details, **so that** I know how my resume looks while building.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/resume/[id]/builder/layout.tsx` | FE Dev | 2h | Server layout that loads resume data via `params.id`, passes to client children via `initialData` prop |
| T2 | `BuilderShell.tsx` — split pane | FE Dev | 3h | CSS Grid: `grid-cols-[400px_1fr]` (lg), single col (mobile). Left = `<FormPanel>`, Right = `<PreviewPanel>` |
| T3 | `SectionSidebar.tsx` — navigation + progress | FE Dev | 2h | Vertical list of sections with % completion badge. Click → scroll to section. Sticky on desktop |
| T4 | `useResumeStore` Zustand store | FE Dev | 3h | Global resume state — `{ personalInfo, summary, experiences[], education[], skills[], projects[], certifications[] }`. `setSection(key, data)` action |
| T5 | Auto-save Server Action | FE Dev | 2h | `'use server'` action `saveResume(id, data)` called via `useEffect` debounced 30s + on section change |
| T6 | Unsaved changes indicator | FE Dev | 1h | `isDirty` flag in store → show "● Unsaved" chip in header |
| T7 | Mobile tab switcher | FE Dev | 1h | `useState activeTab: 'edit' | 'preview'` — hide/show panels via CSS |
| T8 | Tests | QA | 2h | Layout render, store updates, auto-save trigger, mobile tab switch |

---

## Feature 2.2 — Section Forms

**Description**: Each resume section has a dedicated form with field-level validation. Work Experience and Projects support multiple entries with add/reorder/delete.

---

### Story 2.2.1 — Personal Info Section

> **As a** user, **I want to** enter my contact details, **so that** recruiters can reach me.

**Story Points**: 2 | **Estimate**: 1.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `PersonalInfoForm.tsx` | FE Dev | 2h | Fields: Full Name, Email, Phone, Location (City, Country), LinkedIn URL, GitHub URL, Portfolio URL, Profile Photo upload |
| T2 | Zod schema `personalInfoSchema` | FE Dev | 1h | Name required, email valid, phone E.164 optional, URLs optional but valid if provided |
| T3 | Profile photo upload | FE Dev | 2h | `<input type="file">` → FileReader preview (circular crop with `react-image-crop`) → upload to `/files/avatar` |
| T4 | Update `useResumeStore.personalInfo` on change | FE Dev | 0.5h | `watch` from React Hook Form → `useEffect` → `setSection('personalInfo', values)` |

---

### Story 2.2.2 — Professional Summary Section

> **As a** user, **I want to** write a professional summary, **so that** recruiters get a quick overview of my profile.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `SummaryForm.tsx` — rich textarea | FE Dev | 1h | `<textarea>` with char counter (max 600), auto-resize |
| T2 | AI "Generate Summary" button | FE Dev | 2h | Call `POST /ai/generate-summary` with context (role, experience, skills) → stream response into textarea with typewriter effect |
| T3 | Character/word count indicator | FE Dev | 0.5h | Live count with color: green (150–400), orange (<150 or >400), red (>600) |

---

### Story 2.2.3 — Work Experience Section (Multi-Entry)

> **As a** user, **I want to** add multiple work experiences, **so that** my career history is fully documented.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ExperienceForm.tsx` — entry list | FE Dev | 2h | `useFieldArray` (React Hook Form) — list of experience entries. "Add Experience" button at bottom |
| T2 | Single experience entry card | FE Dev | 3h | Fields: Company, Title, Start Date, End Date (or "Present" toggle), Location (optional), Description (rich bullet list) |
| T3 | Bullet point editor for description | FE Dev | 3h | Custom bullet list component — each bullet is a separate `<input>`, Tab to add, Backspace on empty to delete, drag to reorder |
| T4 | AI "Improve Bullet" per bullet | FE Dev | 2h | Small sparkle icon per bullet → calls `POST /ai/improve-bullet` → shows improved version inline with accept/reject |
| T5 | Drag-to-reorder experiences | FE Dev | 2h | `@dnd-kit/sortable` on experience cards — reorder list, persist order to store |
| T6 | Date validation | FE Dev | 1h | End date must be after start date (unless "Present"). Zod `refine()` |
| T7 | Tests | QA | 2h | Add entry, validate dates, reorder, bullet edit, AI improve mock |

---

### Story 2.2.4 — Education Section (Multi-Entry)

> **As a** user, **I want to** add my educational background, **so that** my qualifications are shown.

**Story Points**: 2 | **Estimate**: 1.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `EducationForm.tsx` | FE Dev | 2h | Fields: Institution, Degree (dropdown: BSc, MSc, PhD, Diploma, Bootcamp, Self-taught), Field of Study, Start Year, End Year (or expected), GPA (optional), Description (optional) |
| T2 | `useFieldArray` for multiple entries | FE Dev | 1h | Add/remove education entries, drag to reorder |
| T3 | Graduation Year validator | FE Dev | 0.5h | Year picker (1980–2030), end year ≥ start year |

---

### Story 2.2.5 — Skills Section

> **As a** user, **I want to** list my technical and soft skills, **so that** ATS can match me to job descriptions.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `SkillsForm.tsx` — categorized skill groups | FE Dev | 2h | Groups: Technical, Frameworks, Tools, Soft Skills, Languages. Each group = tag input with autocomplete |
| T2 | Skill tag input component | FE Dev | 2h | Type skill name + Enter → adds chip. Backspace removes last. Autocomplete from known tech list. Drag-to-reorder chips |
| T3 | Proficiency level per skill (optional) | FE Dev | 1h | Toggle to show/hide proficiency. Levels: Beginner / Intermediate / Advanced / Expert |
| T4 | AI skill suggestion | FE Dev | 1h | "Suggest Skills" button → POST experience to `/ai/suggest-skills` → returns recommended skills → user picks which to add |

---

### Story 2.2.6 — Projects Section (Multi-Entry)

> **As a** user, **I want to** showcase my personal and professional projects, **so that** I demonstrate hands-on experience.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ProjectsForm.tsx` | FE Dev | 2h | Fields: Project Name, Tech Stack (tag input), Description (bullet list), Live URL, GitHub URL, Start/End Date |
| T2 | `useFieldArray` + drag reorder | FE Dev | 1h | Same pattern as Experience |
| T3 | Tech stack autocomplete | FE Dev | 1h | Autocomplete tag input from shared tech list |
| T4 | Featured project toggle | FE Dev | 0.5h | ⭐ toggle to mark project as featured (pinned to top) |

---

### Story 2.2.7 — Certifications & Custom Sections

> **As a** user, **I want to** add certifications and custom sections, **so that** my resume stands out with unique achievements.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `CertificationsForm.tsx` | FE Dev | 1h | Fields: Name, Issuer, Issue Date, Expiry (optional), Credential URL. `useFieldArray` |
| T2 | Custom section builder | FE Dev | 2h | User names the section (e.g., "Publications", "Volunteer Work"), adds key-value or bullet list entries |
| T3 | Section reorder in sidebar | FE Dev | 1h | Drag section names in `SectionSidebar` to change order in resume output |

---

## Feature 2.3 — Live Preview Panel

**Description**: Right-side panel renders a pixel-perfect HTML/CSS preview of the resume in real-time, matching the selected template. Updates as user types with `useDeferredValue` for performance.

---

### Story 2.3.1 — Real-Time Preview Renderer

> **As a** user, **I want to** see my resume update instantly as I type, **so that** I know exactly how it will look.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `PreviewPanel.tsx` — iframe sandbox | FE Dev | 3h | Render resume HTML inside `<iframe srcDoc={...}>` for style isolation. Post-message to update content |
| T2 | `useDeferredValue` for preview updates | FE Dev | 1h | Wrap `resumeData` in `useDeferredValue` — form stays responsive, preview catches up |
| T3 | `ResumeRenderer.tsx` — template engine | FE Dev | 4h | Takes `{ resumeData, templateId }` → renders full HTML/CSS. Template components per layout (see EPIC 3) |
| T4 | A4 page boundary indicator | FE Dev | 1h | Show dashed line at 297mm mark — "Content below this line may be on page 2" |
| T5 | Zoom controls for preview | FE Dev | 1h | 50% / 75% / 100% / Fit buttons — CSS `transform: scale()` on preview container |
| T6 | Preview loading skeleton | FE Dev | 0.5h | Pulse skeleton while `useDeferredValue` is updating |
| T7 | Tests | QA | 2h | Preview updates on store change, A4 boundary, zoom controls |

---

---

# EPIC 3 — Template Gallery & Download

> **Goal**: Users can browse 10+ professional resume templates, switch between them, and download in PDF, DOCX, or JSON format.
> **Priority**: 🔴 P0 (Sprint 4–5)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**
> **Next.js Concepts**: Dynamic imports for template components, Route Handler for PDF generation, `next/image` for template thumbnails

---

## Feature 3.1 — Template Gallery

**Acceptance Criteria**:
- [ ] 10+ templates available in 3 categories: Classic, Modern, Creative
- [ ] Thumbnail previews generated from actual resume data
- [ ] One-click template switch — preview updates instantly
- [ ] Active template shown with checkmark badge
- [ ] Free (3) vs Premium templates (locked with upgrade CTA)

---

### Story 3.1.1 — Template Gallery Page & Switcher

> **As a** user, **I want to** browse and switch resume templates, **so that** I can find one that suits my industry and style.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/resume/[id]/templates/page.tsx` | FE Dev | 2h | Grid of template cards (3 cols lg, 2 md, 1 sm). Filter tabs: All / Classic / Modern / Creative |
| T2 | Template card component | FE Dev | 2h | Shows thumbnail (next/image), name, category badge, "Free" / "Pro" chip, hover scale animation |
| T3 | Template thumbnail preview | FE Dev | 3h | Render miniature version of actual resume in template using CSS transform scale-down (`scale(0.3)`) inside fixed-size container |
| T4 | Live preview on template hover | FE Dev | 2h | Hover over template → right panel updates to show user's resume in that template. `useOptimistic` for instant feel |
| T5 | Template selection persisted | FE Dev | 1h | PATCH `/resumes/:id` with `templateId` on click. `useResumeStore.templateId` updated |
| T6 | Pro template lock + upgrade modal | FE Dev | 1h | `ProLockOverlay.tsx` on premium templates — shows "Upgrade to Pro" modal |
| T7 | Tests | QA | 2h | Template grid render, hover preview, selection persistence, pro lock |

---

### Story 3.1.2 — Template Implementations (10 Templates)

> **As a** user, **I want to** have a variety of template styles, **so that** my resume fits the job I'm applying to.

**Story Points**: 8 | **Estimate**: 1 week

| # | Template Name | Category | Description |
|---|---|---|---|
| T1 | `ClassicPro` | Classic | Clean single-column, serif font, black/white |
| T2 | `ModernBlue` | Modern | Two-column with blue accent bar, sans-serif |
| T3 | `MinimalWhite` | Modern | Ultra-clean whitespace-first design |
| T4 | `CreativeGrid` | Creative | Grid layout with color blocks, icon labels |
| T5 | `TechStack` | Modern | Skills prominently featured, monospace accents |
| T6 | `ElegantSide` | Classic | Sidebar with contact + skills, main with experience |
| T7 | `BoldHeader` | Creative | Large name header with gradient, card-style sections |
| T8 | `AcademicCV` | Classic | Long-form CV style for academic/research roles |
| T9 | `StartupVibe` | Modern | Minimal with emoji section icons, startup aesthetic |
| T10 | `ExecutiveSuite` | Classic | Premium look for senior roles, dense information layout |

Each template is a React component accepting `ResumeData` typed props. Dynamically imported per selection.

---

## Feature 3.2 — Export & Download

---

### Story 3.2.1 — PDF Download

> **As a** user, **I want to** download my resume as a PDF, **so that** I can submit it to job applications.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Download button in builder header | FE Dev | 0.5h | Dropdown: "Download PDF", "Download DOCX", "Download JSON", "Copy LaTeX" |
| T2 | `GET /resumes/:id/export?format=pdf` API call | FE Dev | 1h | Triggers backend Puppeteer render → returns PDF `Blob` |
| T3 | Blob download in browser | FE Dev | 1h | `URL.createObjectURL(blob)` → `<a download="resume.pdf">` → click → revoke URL |
| T4 | Loading state during PDF gen | FE Dev | 0.5h | Replace download button with spinner + "Generating PDF..." during request |
| T5 | `GET /resumes/:id/export?format=docx` | FE Dev | 1h | Same pattern — backend returns DOCX file |
| T6 | Share link generation | FE Dev | 1h | "Share" button → generate public read-only link `/r/[shareToken]` → copy to clipboard |
| T7 | Tests | QA | 1h | Blob download mock, loading state, share link copy |

---

### Story 3.2.2 — Public Share Page

> **As a** user, **I want to** share a public link to my resume, **so that** I can send it to recruiters without a file attachment.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/r/[shareToken]/page.tsx` — Server Component | FE Dev | 2h | `fetch` resume by token server-side → render `ResumeRenderer` with selected template. No auth required |
| T2 | SEO metadata for share page | FE Dev | 1h | `generateMetadata({ params })` → `{ title: "John Doe's Resume", description: summary }` |
| T3 | Download CTA on share page | FE Dev | 0.5h | "Download PDF" button → same export endpoint (public) |
| T4 | View count tracker | FE Dev | 0.5h | On page load → `POST /resumes/[shareToken]/view` (analytics) |

---

---

# EPIC 4 — Resume Score & ATS Analysis

> **Goal**: Users can check how well their resume will perform in ATS systems, see section-level scores, and get actionable improvement tips.
> **Priority**: 🔴 P0 (Sprint 5–6)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**
> **Next.js Concepts**: Streaming Server Components for score computation, `useTransition` for non-blocking UI

---

## Feature 4.1 — Resume Score Dashboard

**Acceptance Criteria**:
- [ ] Overall ATS score shown (0–100) with letter grade (A/B/C/D/F)
- [ ] Section-level scores: Contact (15%), Summary (20%), Experience (30%), Skills (20%), Education (10%), Other (5%)
- [ ] Issues list with severity: 🔴 Critical / 🟡 Warning / 🟢 Suggestion
- [ ] Score updates live as user edits resume
- [ ] Industry-specific scoring mode (Tech / Finance / Design / etc.)

---

### Story 4.1.1 — Score Overview Panel

> **As a** user, **I want to** see my resume's ATS score with a breakdown, **so that** I understand which areas need improvement.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/resume/[id]/score/page.tsx` | FE Dev | 2h | Split view: left = score panel, right = resume preview with highlights |
| T2 | `ScoreGauge.tsx` — circular score meter | FE Dev | 3h | SVG-based circular progress. Animated fill on load. Color: red (<50), amber (50–75), green (>75) |
| T3 | Section score bars | FE Dev | 2h | Per-section horizontal bar with score label and weight. Clicking a section scrolls to its issues |
| T4 | Issues list with filter | FE Dev | 2h | Grouped by severity. Filter tabs: All / Critical / Warning / Suggestions. Each item has section link |
| T5 | `POST /score/analyze` integration | FE Dev | 1h | Send resume JSON to backend → receive `{ overallScore, sections{}, issues[] }` — stream with `ReadableStream` |
| T6 | "Analyze" button + auto-analyze debounce | FE Dev | 1h | Manual "Run Analysis" button + auto-re-analyze 3s after resume change (debounced) |
| T7 | Industry mode selector | FE Dev | 1h | Dropdown — Tech / Finance / Design / Marketing / Healthcare → sends `industry` param to scoring endpoint |
| T8 | Tests | QA | 2h | Score render, issue click navigation, industry mode switch |

---

### Story 4.1.2 — Score History & Progress Tracking

> **As a** user, **I want to** track how my score improves over time, **so that** I stay motivated to keep improving.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Score history chart | FE Dev | 2h | `recharts` `LineChart` — X axis: dates, Y axis: score (0–100). Shows last 10 score snapshots |
| T2 | Score snapshot on each analysis | FE Dev | 0.5h | Backend saves `{ resumeId, score, timestamp }` — frontend fetches `GET /score/history/:resumeId` |
| T3 | "Best score" badge | FE Dev | 0.5h | Shows highest score ever achieved with date |

---

## Feature 4.2 — Issue Detail & Jump-to-Edit

---

### Story 4.2.1 — Highlighted Issue Navigation

> **As a** user, **I want to** click on an issue and jump directly to the section to fix it, **so that** improving my resume is fast and clear.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Issue card component | FE Dev | 2h | Shows: severity icon, issue title, description, affected section, "Fix Now" button |
| T2 | "Fix Now" → navigate to builder section | FE Dev | 1h | `router.push('/resume/:id/builder?section=experience')` → `SectionSidebar` scrolls to section, field highlighted |
| T3 | Preview highlight overlay | FE Dev | 2h | Right panel shows resume preview with problematic sections highlighted in red/amber |
| T4 | Auto-fix suggestions | FE Dev | 2h | For common issues (no action verbs, missing email, short summary) → show suggested text inline with "Apply Fix" button |

---

### Story 4.2.2 — Job Description Match Scoring

> **As a** user, **I want to** paste a job description and see how well my resume matches, **so that** I can tailor my resume per application.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Job description input panel | FE Dev | 2h | `<textarea>` — paste JD. "Analyze Match" button. `POST /score/jd-match` |
| T2 | Keyword match visualization | FE Dev | 3h | Two columns: "Keywords in JD" vs "Keywords in your resume" — matched (green) / missing (red) |
| T3 | Missing keyword suggestions | FE Dev | 2h | For each missing keyword → "Add to Skills" / "Add to Experience bullet" quick action buttons |
| T4 | Match score overlay on resume preview | FE Dev | 1h | Highlight sentences in preview that contain matched keywords |
| T5 | Tests | QA | 1h | JD paste, match analysis mock, keyword highlight |

---

---

# EPIC 5 — LaTeX Editor with Live Preview

> **Goal**: Users can view, edit, and download their resume in LaTeX format with a professional Monaco-based editor and live-compiled preview.
> **Priority**: 🟡 P1 (Sprint 6–7)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**
> **Next.js Concepts**: Dynamic import for Monaco, Route Handler for LaTeX→PDF compilation, WebSocket for live preview

---

## Feature 5.1 — Monaco LaTeX Editor

**Acceptance Criteria**:
- [ ] Monaco Editor loaded with LaTeX syntax highlighting and autocomplete
- [ ] User's resume auto-converted to LaTeX on first open
- [ ] Live preview panel shows compiled PDF as user edits (debounced 1.5s)
- [ ] Error panel shows LaTeX compilation errors with line numbers
- [ ] Editor state auto-saved every 30s

---

### Story 5.1.1 — Monaco Editor Setup

> **As a** user, **I want to** edit my resume in LaTeX with syntax highlighting, **so that** I have full control over the formatting.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Dynamic import `@monaco-editor/react` | FE Dev | 1h | `dynamic(() => import('@monaco-editor/react'), { ssr: false })` — Next.js dynamic import, no SSR |
| T2 | `app/resume/[id]/editor/page.tsx` layout | FE Dev | 2h | Split pane: left = Monaco editor (50%), right = PDF preview (50%). Header: Save / Download PDF / Download DOCX / Copy LaTeX |
| T3 | LaTeX language config for Monaco | FE Dev | 2h | Register `latex` language with token rules: commands (`\textbf`, `\section`), math (`$`), comments (`%`), environments (`\begin{..}`) |
| T4 | Monaco autocomplete for LaTeX commands | FE Dev | 3h | `monaco.languages.registerCompletionItemProvider` — suggest `\textbf{}`, `\section{}`, common resume commands |
| T5 | Initial LaTeX load from API | FE Dev | 1h | On page mount: `GET /resumes/:id/latex` → set as Monaco editor value |
| T6 | Editor theme — VS Code Dark | FE Dev | 0.5h | `theme="vs-dark"` — option to switch to `vs` (light) |
| T7 | Tests | QA | 2h | Editor loads, syntax tokens applied, autocomplete trigger |

---

### Story 5.1.2 — Live LaTeX Preview

> **As a** user, **I want to** see a live PDF preview update as I edit LaTeX, **so that** I can fix formatting errors instantly.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Debounced compile trigger | FE Dev | 1h | `useEffect` on Monaco `onChange` → debounce 1500ms → call `POST /latex/compile` |
| T2 | `POST /latex/compile` integration | FE Dev | 1h | Send LaTeX string → backend compiles with `pdflatex` → returns PDF `Blob` or error JSON |
| T3 | PDF preview with `react-pdf` | FE Dev | 3h | `Document` + `Page` from `react-pdf` — render compiled PDF Blob. Show page navigation if multi-page |
| T4 | Compilation error panel | FE Dev | 2h | If error response → show red panel below editor: `Line X: undefined control sequence \sectoin` |
| T5 | Monaco error gutter markers | FE Dev | 2h | `monaco.editor.setModelMarkers()` — red squiggle on error lines |
| T6 | "Compiling..." spinner overlay | FE Dev | 0.5h | Semi-transparent overlay on preview with spinner while compiling |
| T7 | Tests | QA | 2h | Debounce test, error panel display, PDF render |

---

### Story 5.1.3 — LaTeX Download Options

> **As a** user, **I want to** download my LaTeX resume as PDF or Word, **so that** I can submit in the required format.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | "Download PDF" — compiled PDF blob | FE Dev | 1h | Trigger fresh compile → download |
| T2 | "Download DOCX" — `GET /latex/export/docx` | FE Dev | 1h | Backend converts LaTeX → DOCX using `pandoc` → download blob |
| T3 | "Download .tex" — raw LaTeX file | FE Dev | 0.5h | Create Blob from editor content string → download as `resume.tex` |
| T4 | "Copy LaTeX" button | FE Dev | 0.5h | `navigator.clipboard.writeText(editorContent)` → "Copied!" toast 2s |

---

### Story 5.1.4 — LaTeX Templates

> **As a** user, **I want to** switch between LaTeX templates, **so that** I can choose a style that suits my target industry.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | LaTeX template switcher UI | FE Dev | 1h | Dropdown in editor header: Modern / Academic / Minimal / AltaCV / Jake's Resume |
| T2 | Template-specific LaTeX generation | FE Dev | 2h | `GET /resumes/:id/latex?template=altacv` → backend returns resume data rendered in selected LaTeX template |
| T3 | "Reset to generated LaTeX" button | FE Dev | 0.5h | Resets editor content to latest auto-generated version (with confirm dialog) |

---

### Story 5.1.5 — Editor Keyboard Shortcuts & Toolbar

> **As a** user, **I want to** have a formatting toolbar in the LaTeX editor, **so that** I can apply common LaTeX formatting without remembering commands.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Toolbar component above Monaco | FE Dev | 2h | Icon buttons: **B** (bold `\textbf{}`), *I* (italic `\textit{}`), Section, Subsection, Item, Math, Hyperlink |
| T2 | Toolbar action → Monaco insert | FE Dev | 2h | Each button uses `editor.executeEdits()` to insert/wrap selected text with command |
| T3 | Keyboard shortcuts | FE Dev | 1h | `Ctrl+B` = bold, `Ctrl+I` = italic, `Ctrl+S` = save, `Ctrl+Shift+P` = compile |
| T4 | Find & Replace panel | FE Dev | 1h | Monaco built-in `Ctrl+H` — ensure enabled |

---

---

# EPIC 6 — AI Resume Assistant

> **Goal**: AI-powered assistant helps users write better bullets, improve sections, optimize for ATS, and chat about their resume.
> **Priority**: 🟡 P1 (Sprint 7–8)
> **Total Estimate**: **21 Story Points** | ~**4 weeks**
> **Next.js Concepts**: Streaming Route Handler (`ReadableStream`), `useChat` from Vercel AI SDK, Server Actions for AI mutations

---

## Feature 6.1 — AI Chat Panel

**Acceptance Criteria**:
- [ ] Floating AI chat panel accessible from any page
- [ ] Chat aware of current resume context (passes resume JSON as system prompt context)
- [ ] Streaming responses with typewriter effect
- [ ] Suggested actions as quick-reply chips
- [ ] Chat history persisted in session

---

### Story 6.1.1 — AI Chat Interface

> **As a** user, **I want to** chat with an AI assistant about my resume, **so that** I can get instant feedback and writing help.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Floating `AIChatButton.tsx` | FE Dev | 1h | Fixed bottom-right FAB with sparkle icon. Click → opens side panel |
| T2 | `AIChatPanel.tsx` — slide-over | FE Dev | 2h | Right-side panel (400px), header with "AI Assistant" + close. Message list + input box |
| T3 | `useChat` from `ai` SDK (Vercel AI SDK) | FE Dev | 2h | `useChat({ api: '/api/ai/chat' })` — handles messages, streaming, isLoading |
| T4 | Streaming response display | FE Dev | 1h | Typewriter word-by-word streaming from `ReadableStream`. Scroll-to-bottom on new token |
| T5 | Resume context injection | FE Dev | 1h | Send `resumeData` JSON as part of system context to `/api/ai/chat` — AI knows current resume state |
| T6 | Suggested quick-reply chips | FE Dev | 1h | After AI response → show chips: "Improve my summary", "Suggest keywords", "Make it shorter", "Translate to formal tone" |
| T7 | Chat history in `localStorage` | FE Dev | 1h | Persist last 20 messages per `resumeId` — restore on panel open |
| T8 | Tests | QA | 2h | Message send, streaming mock, quick-reply action, context injection |

---

## Feature 6.2 — Section-Level AI Improvements

---

### Story 6.2.1 — AI Bullet Point Optimizer

> **As a** user, **I want to** improve individual bullet points with AI, **so that** my experience descriptions are strong and impactful.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | ✨ sparkle icon per bullet | FE Dev | 1h | Appears on hover per bullet point in ExperienceForm |
| T2 | AI improvement panel — inline | FE Dev | 2h | Click sparkle → shows 3 AI-improved versions below bullet. Options: "More quantified", "More concise", "Higher impact" |
| T3 | Accept / Regenerate / Dismiss | FE Dev | 1h | "Accept" replaces bullet, "Regenerate" calls API again, "Dismiss" closes panel |
| T4 | `POST /ai/improve-bullet` integration | FE Dev | 1h | Stream response — 3 variants shown progressively |
| T5 | Action verb checker | FE Dev | 2h | Frontend: check if bullet starts with action verb (regex against 200-verb list). If not → show warning chip "Start with an action verb" |

---

### Story 6.2.2 — AI Section Rewriter

> **As a** user, **I want to** rewrite entire sections with AI, **so that** my resume is polished and professional.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | "Rewrite with AI" button per section | FE Dev | 1h | Button in section header (Summary, Experience, Skills) |
| T2 | Rewrite modal — side-by-side | FE Dev | 3h | Left: original content, Right: AI-rewritten version. "Apply" replaces left with right content |
| T3 | Tone selector | FE Dev | 1h | Radio: Professional / Concise / Creative / Technical → sent as param |
| T4 | `POST /ai/rewrite-section` streaming | FE Dev | 1h | Stream the rewritten section content into the right panel word by word |
| T5 | Undo AI rewrite | FE Dev | 1h | "Undo" button restores previous content from store snapshot |

---

### Story 6.2.3 — ATS Score Auto-Improvement

> **As a** user, **I want to** automatically improve sections that have low ATS scores, **so that** my resume passes ATS filters.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | "Auto-improve" button on score dashboard | FE Dev | 1h | Appears when score < 70. Click → `POST /ai/auto-improve` with resume + issues list |
| T2 | Step-by-step improvement flow | FE Dev | 2h | Modal shows each critical issue one by one with AI suggestion. "Apply & Next" button |
| T3 | Score delta preview | FE Dev | 1h | After all improvements applied → show "Estimated new score: 82" before confirming |

---

### Story 6.2.4 — LinkedIn Profile Import via AI

> **As a** user, **I want to** paste my LinkedIn profile URL and have AI extract my resume data, **so that** I don't have to type everything manually.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | LinkedIn URL input in onboarding / builder | FE Dev | 1h | Input field with LinkedIn icon. Validate URL format |
| T2 | `POST /ai/import-linkedin` call | FE Dev | 1h | Send URL → backend scrapes (or user pastes exported JSON) → AI parses → returns structured resume JSON |
| T3 | Import review modal | FE Dev | 2h | Show extracted data per section with checkboxes → user confirms what to import |
| T4 | Merge with existing resume | FE Dev | 1h | Merge imported data into current resume store — overwrite or append per section |

---

---

# EPIC 7 — PDF Upload → LaTeX Converter

> **Goal**: Users can upload an existing resume PDF, which is parsed and converted to editable LaTeX and structured resume data.
> **Priority**: 🟡 P1 (Sprint 8–9)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**
> **Next.js Concepts**: Route Handler for multipart upload, `useFormState` for upload progress, streaming AI parse

---

## Feature 7.1 — PDF Upload & Parse Flow

**Acceptance Criteria**:
- [ ] Users can upload a PDF (max 5MB, PDF only)
- [ ] Upload progress bar shown
- [ ] Extracted data shown in review step before applying
- [ ] Generated LaTeX available in editor immediately after
- [ ] Structured data populates the resume builder form

---

### Story 7.1.1 — PDF Upload UI

> **As a** user, **I want to** upload my existing resume PDF, **so that** I don't have to rebuild it from scratch.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Upload entry points | FE Dev | 1h | (1) Dashboard "Import Resume" card, (2) Builder header "Import from PDF" option |
| T2 | `UploadDropzone.tsx` | FE Dev | 2h | Drag-and-drop zone using `react-dropzone`. Accept `.pdf` only. Max 5MB validation client-side. File name preview on drop |
| T3 | Upload progress bar | FE Dev | 1h | `axios.post` with `onUploadProgress` → `{ loaded, total }` → `useState progress` |
| T4 | `POST /resumes/import/pdf` API call | FE Dev | 1h | `multipart/form-data` upload. Returns `jobId` for async processing |
| T5 | Polling for parse completion | FE Dev | 2h | `setInterval` polling `GET /jobs/:jobId/status` every 2s → when `status: 'done'` → fetch result |
| T6 | Error handling | FE Dev | 1h | File too large, not PDF, parsing failed — all shown in upload area with retry |

---

### Story 7.1.2 — Parsed Data Review & Import

> **As a** user, **I want to** review the extracted data before importing, **so that** I can correct any parsing errors.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ParsedResumeReview.tsx` page | FE Dev | 3h | Multi-section accordion: PersonalInfo / Experience / Education / Skills / Projects. Each shows parsed data |
| T2 | Editable parsed fields | FE Dev | 3h | Inline edit for each parsed field before applying. Click to edit, Tab to next |
| T3 | "Apply to Builder" button | FE Dev | 1h | Merges reviewed data into `useResumeStore` — closes review modal, opens builder |
| T4 | "Open in LaTeX Editor" button | FE Dev | 1h | Navigates to `/resume/:id/editor` with LaTeX pre-loaded from parse result |
| T5 | Confidence score per field | FE Dev | 1h | Backend returns `confidence: 0–1` per field — low confidence shown with yellow warning icon |

---

### Story 7.1.3 — LaTeX Generation from Parsed PDF

> **As a** user, **I want to** get my resume in LaTeX format from my uploaded PDF, **so that** I can use the LaTeX editor for fine-tuning.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | LaTeX preview in review step | FE Dev | 1h | Tab in review: "LaTeX Source" — shows generated `.tex` with syntax highlighting |
| T2 | Copy LaTeX + Open in Editor buttons | FE Dev | 0.5h | Quick actions in LaTeX tab |
| T3 | Template selection for PDF→LaTeX | FE Dev | 1h | Before import — choose LaTeX template: Jake's / AltaCV / Awesome-CV |

---

---

# EPIC 8 — Upskilling Dashboard

> **Goal**: Based on the user's resume, suggest skills to learn, provide curated resources, interview Q&A, and mock interview rounds.
> **Priority**: 🟡 P1 (Sprint 9–11)
> **Total Estimate**: **21 Story Points** | ~**5 weeks**
> **Next.js Concepts**: Parallel Routes for dashboard panels, Streaming for AI content generation, ISR for cached concept cards

---

## Feature 8.1 — Skill Gap Analysis & Learning Path

**Acceptance Criteria**:
- [ ] Dashboard shows skill gap based on current resume vs target role
- [ ] Suggested skills ranked by demand (based on job market data)
- [ ] Each skill links to curated learning resources (free + paid)
- [ ] Learning progress tracked (user marks concepts as "Read")

---

### Story 8.1.1 — Skill Gap Dashboard

> **As a** user, **I want to** see which skills I'm missing for my target role, **so that** I know what to learn next.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/upskill/page.tsx` — upskilling home | FE Dev | 2h | Header: current role → target role gap visual. Sections: Skill Gaps / Learning Path / Interview Prep / Mock Round |
| T2 | Skill gap visualization | FE Dev | 3h | Two radar charts (recharts `RadarChart`): "Your Skills" vs "Target Role Required Skills". Side-by-side comparison |
| T3 | Missing skills list with priority | FE Dev | 2h | Ranked list: skill name, demand score (% jobs requiring it), difficulty (Easy/Medium/Hard), estimated time to learn |
| T4 | "Add to Learning Path" button | FE Dev | 1h | Click → adds skill to user's personal learning path. Persisted to `PATCH /users/learning-path` |
| T5 | Target role change | FE Dev | 1h | Dropdown to change target role → re-fetches gap analysis |
| T6 | Tests | QA | 2h | Gap calculation mock, radar chart render, add to path |

---

### Story 8.1.2 — Concept Cards (Learning Resources)

> **As a** user, **I want to** see bite-sized concept explanations for skills I need to learn, **so that** I can study directly in the app.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `ConceptCard.tsx` component | FE Dev | 2h | Card shows: concept name, 5-min read badge, difficulty, tags. Click → expands to full explanation |
| T2 | Concept detail drawer | FE Dev | 3h | Slide-over drawer: full explanation (markdown rendered), code examples (syntax highlighted), "Further Reading" links, "Mark as Read" |
| T3 | Concept cards grid per skill | FE Dev | 1h | `/upskill/[skill]` page — cards for that skill's sub-concepts |
| T4 | ISR for concept cards | FE Dev | 1h | `export const revalidate = 86400` — concept cards are server-side rendered and cached 24h. Fast load |
| T5 | Read progress tracking | FE Dev | 1h | `localStorage` tracks read concept IDs → green checkmark on read cards → `% complete` badge per skill |

---

## Feature 8.2 — Interview Q&A

**Acceptance Criteria**:
- [ ] 50+ interview questions per skill category (fetched from backend)
- [ ] Questions categorized: Conceptual / Coding / Behavioral / System Design
- [ ] User can mark questions as "Practiced" / "Need Review" / "Confident"
- [ ] AI-generated hints for each question (spoiler reveal)

---

### Story 8.2.1 — Interview Questions Bank

> **As a** user, **I want to** practice interview questions relevant to my target role, **so that** I'm prepared for technical interviews.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/upskill/interview/page.tsx` | FE Dev | 2h | Tabs: Conceptual / Coding / Behavioral / System Design. Skill filter sidebar |
| T2 | `QuestionCard.tsx` | FE Dev | 2h | Shows question. "Show Hint" button (AI-generated, spoiler reveal). Status selector: Not tried / Practicing / Confident |
| T3 | Answer input with AI feedback | FE Dev | 3h | Expandable textarea to type answer → "Get AI Feedback" → AI evaluates answer quality → shows score + improvement tip |
| T4 | Question status persistence | FE Dev | 1h | `PATCH /upskill/question-status` — saved per user. Status badge shown on card |
| T5 | Question filter by status | FE Dev | 1h | Filter: Show All / Not tried / Need Review / Confident |
| T6 | Tests | QA | 1h | Question render, status change, AI feedback mock |

---

## Feature 8.3 — Mock Interview Rounds

**Acceptance Criteria**:
- [ ] User can start a timed mock interview session (30 / 45 / 60 min)
- [ ] AI asks questions one by one, evaluates spoken/typed answers
- [ ] Session report with per-question scores and overall assessment
- [ ] Session recordings (typed) saved to history

---

### Story 8.3.1 — Mock Interview Session Flow

> **As a** user, **I want to** do a timed mock interview with AI, **so that** I can simulate the real interview experience.

**Story Points**: 5 | **Estimate**: 4 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Mock interview setup page | FE Dev | 1h | Choose: duration (30/45/60 min), category (Frontend/Backend/Full-Stack/System Design/Behavioral), difficulty |
| T2 | `MockInterviewSession.tsx` | FE Dev | 3h | Full-screen focus mode. Timer countdown. AI question on left. Answer textarea on right. "Submit Answer" → "Next Question" |
| T3 | AI question stream | FE Dev | 2h | Questions pulled from curated bank + AI-generated follow-ups based on previous answers |
| T4 | Per-answer AI evaluation | FE Dev | 2h | After submitting answer → stream AI evaluation: score (1-10), what was good, what was missing |
| T5 | Session summary report | FE Dev | 2h | After session ends: overall score, per-question breakdown table, key strengths, areas to improve |
| T6 | Session history | FE Dev | 1h | `GET /mock-sessions` — list of past sessions with date, score, category. Click → view report |
| T7 | Tests | QA | 2h | Timer, question flow, answer submit, session report |

---

### Story 8.3.2 — Mock Interview Feedback & Next Steps

> **As a** user, **I want to** receive actionable next steps after a mock interview, **so that** I know exactly what to practice next.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Weak area detection from session | FE Dev | 1h | Parse AI evaluations → identify consistently low-scoring topic areas |
| T2 | Auto-generate learning plan from weak areas | FE Dev | 2h | "Practice Plan" section in report → links to concept cards + questions for identified weak areas |
| T3 | "Retry with same questions" | FE Dev | 0.5h | Load same question set, clear answers, restart timer |

---

---

# EPIC 9 — Resume Management Dashboard

> **Goal**: Central dashboard where users manage all their resumes — create, rename, clone, delete, and track application status.
> **Priority**: 🟡 P1 (Sprint 3 + ongoing)
> **Total Estimate**: **13 Story Points** | ~**3 weeks**

---

### Story 9.1.1 — Resume Dashboard Page

> **As a** user, **I want to** see all my resumes in one place, **so that** I can easily manage versions tailored to different roles.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/dashboard/page.tsx` — resume grid | FE Dev | 2h | Resume cards grid (3 cols lg). Server Component: fetch via `GET /resumes` → pass to client |
| T2 | `ResumeCard.tsx` component | FE Dev | 2h | Shows: thumbnail preview, resume name, last updated, template name, ATS score badge, action menu (3-dot) |
| T3 | Action menu: Rename / Clone / Delete / Set as Default | FE Dev | 2h | Dropdown menu. Rename → inline input. Clone → `POST /resumes/:id/clone`. Delete → confirm modal |
| T4 | "Create New Resume" card | FE Dev | 0.5h | "+" card at start of grid → opens "New Resume" modal with name input + template picker |
| T5 | Resume status tag | FE Dev | 1h | User can tag resumes: "Active", "Archived", "Template" — shown as colored badge |
| T6 | Sort and filter | FE Dev | 1h | Sort by: Last updated / ATS Score / Name. Filter by status tag |
| T7 | Tests | QA | 1h | Grid render, clone, delete confirm, status filter |

---

### Story 9.1.2 — Application Tracker (Basic)

> **As a** user, **I want to** track which resume I used for which job application, **so that** I can follow up effectively.

**Story Points**: 5 | **Estimate**: 3 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | "Track Application" per resume | FE Dev | 1h | Button in resume card → opens "Add Application" modal |
| T2 | `AddApplicationModal.tsx` | FE Dev | 2h | Fields: Company Name, Role, Application Date, Status (Applied/Phone Screen/Interview/Offer/Rejected), Job URL |
| T3 | Applications Kanban view | FE Dev | 3h | `/dashboard/applications` — Kanban board: Applied → Phone Screen → Interview → Offer/Rejected. Drag-drop to move status |
| T4 | Application timeline | FE Dev | 2h | Per-application timeline of status changes |
| T5 | Tests | QA | 1h | Add application, drag to status, timeline render |

---

### Story 9.1.3 — Resume Analytics

> **As a** user, **I want to** see how many times my shared resume was viewed, **so that** I can gauge recruiter interest.

**Story Points**: 3 | **Estimate**: 1.5 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | View count on resume card | FE Dev | 0.5h | "👁 12 views" chip on card |
| T2 | Analytics drawer per resume | FE Dev | 2h | Click views → drawer: bar chart (views by day), geographic distribution (if available), device breakdown (mobile/desktop) |
| T3 | Notification on view spike | FE Dev | 1h | If >3 views in 24h → toast notification "Your resume got 5 views today!" |

---

---

# EPIC 10 — Settings & Profile

> **Goal**: Users can manage account settings, subscription, API key for AI features, and notification preferences.
> **Priority**: 🟢 P2 (Sprint 12–13)
> **Total Estimate**: **8 Story Points** | ~**2 weeks**

---

### Story 10.1.1 — Account Settings Page

> **As a** user, **I want to** manage my profile and account settings, **so that** my information is accurate and secure.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | `app/settings/page.tsx` — tabbed layout | FE Dev | 1h | Tabs: Profile / Security / Notifications / Billing / AI Settings |
| T2 | Profile tab — edit name, email, avatar, timezone | FE Dev | 2h | Same as onboarding data, editable. Avatar upload with crop |
| T3 | Security tab — change password, active sessions | FE Dev | 2h | Change password form. Table of active sessions with "Revoke" per session |
| T4 | Notification preferences | FE Dev | 1h | Toggles: Resume viewed, Score drop alert, Upskilling reminder (weekly), Email digest |

---

### Story 10.1.2 — AI Settings & Billing

> **As a** user, **I want to** manage my AI credits and subscription, **so that** I can control my usage.

**Story Points**: 3 | **Estimate**: 2 days

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | AI credits usage bar | FE Dev | 1h | Shows: X / 100 AI credits used this month. Progress bar |
| T2 | Bring Your Own Key (BYOK) | FE Dev | 2h | Input for custom OpenAI API key → encrypted and stored. Bypasses credit limit |
| T3 | Billing / Subscription page | FE Dev | 2h | Current plan (Free/Pro). Upgrade button → Stripe Checkout. Billing history table |

---

### Story 10.1.3 — Keyboard Shortcuts & Accessibility

> **As a** user, **I want to** use keyboard shortcuts and have screen reader support, **so that** the app is fast and accessible.

**Story Points**: 2 | **Estimate**: 1 day

| # | Task | Owner | Est. | Details |
|---|---|---|---|---|
| T1 | Keyboard shortcut map | FE Dev | 1h | `?` → show shortcuts modal. `Ctrl+S` = save, `Ctrl+P` = preview, `Ctrl+E` = export, `Ctrl+K` = command palette |
| T2 | Command palette | FE Dev | 2h | `Ctrl+K` → `cmdk` component — search actions: "New Resume", "Open Score", "Open LaTeX Editor", "Export PDF" |
| T3 | ARIA labels + focus management | FE Dev | 1h | All interactive elements have `aria-label`. Focus trap in modals. Skip-to-content link |

---

---

# 🗓️ Sprint Plan Summary

| Sprint | Focus | Key Deliverables | Story Points |
|---|---|---|---|
| **Sprint 1** | Auth + Foundation | Register, Login, Google OAuth, Middleware, Route protection | 13 SP |
| **Sprint 2** | Onboarding + Builder Shell | Onboarding wizard, BuilderShell layout, Zustand store, auto-save | 13 SP |
| **Sprint 3** | Builder Sections (Part 1) | Personal Info, Summary, Work Experience forms + Live Preview | 18 SP |
| **Sprint 4** | Builder Sections (Part 2) + Template Gallery | Education, Skills, Projects, Certifications, 10 templates | 21 SP |
| **Sprint 5** | Download + Resume Dashboard | PDF/DOCX export, Share page, Resume management dashboard | 18 SP |
| **Sprint 6** | Resume Score (Part 1) | Score gauge, section scores, issues list, industry mode | 13 SP |
| **Sprint 7** | Resume Score (Part 2) + LaTeX Editor (Part 1) | JD match scoring, Monaco editor setup, LaTeX load | 18 SP |
| **Sprint 8** | LaTeX Editor (Part 2) + AI Chat | Live preview, error panel, AI chat panel | 16 SP |
| **Sprint 9** | AI Sections + PDF Upload | Bullet optimizer, section rewriter, PDF upload flow | 18 SP |
| **Sprint 10** | PDF Import Review + Upskilling (Part 1) | Parse review UI, skill gap dashboard, concept cards | 18 SP |
| **Sprint 11** | Upskilling (Part 2) | Interview Q&A bank, mock interview session | 16 SP |
| **Sprint 12** | Mock Interview Reports + App Tracker | Session report, application Kanban, analytics | 13 SP |
| **Sprint 13** | Settings + Polish | Account settings, billing, keyboard shortcuts, a11y | 13 SP |
| **Sprint 14** | QA + Performance + Launch | Lighthouse audit ≥90, E2E Playwright tests, production deploy | 8 SP |

---

# ✅ Definition of Ready (DoR)

A story is ready to be worked on when:
- [ ] User story written in "As a / I want to / So that" format
- [ ] Acceptance criteria clearly defined with testable conditions
- [ ] Designs / wireframes available for all UI stories
- [ ] All task estimates completed by the team
- [ ] API contract agreed with backend (request/response types shared)
- [ ] Dependencies identified and resolved
- [ ] Story fits within a single sprint (if not, break it down)
- [ ] Story points assigned via planning poker

---

# ✅ Definition of Done (DoD)

A story is done when:
- [ ] All acceptance criteria pass
- [ ] Code reviewed and approved by at least 1 teammate
- [ ] Unit + integration tests written with ≥80% coverage for critical paths
- [ ] No TypeScript errors (`tsc --noEmit` passes)
- [ ] ESLint passes with no errors or warnings
- [ ] Tested on Chrome, Firefox, Safari, iOS Safari, Android Chrome
- [ ] Responsive on 320px (mobile) to 1440px (desktop)
- [ ] Accessibility: keyboard navigable, ARIA labels, color contrast ≥4.5:1
- [ ] Lighthouse score ≥90 (Performance, Accessibility, Best Practices, SEO)
- [ ] Feature merged to `main` via reviewed PR, deployed to staging

---

# 📋 Grooming Agenda Template (Per Sprint)

```
Sprint N Grooming — 90 min

1. Review Backlog (10 min)
   - Walk through upcoming stories in priority order
   - Check DoR for each story

2. Breakdown & Estimation (45 min)
   - Break down any stories >8 SP into smaller pieces
   - Planning poker for story points (Fibonacci: 1,2,3,5,8,13)
   - Flag technical unknowns / spikes needed

3. API Contract Review (15 min)
   - Agree request/response shapes for new endpoints
   - Update shared TypeScript DTO types

4. Design Review (10 min)
   - Confirm Figma designs match story requirements
   - Flag any missing states (empty, loading, error)

5. Risk Discussion (10 min)
   - Identify blockers (third-party APIs, AI rate limits, etc.)
   - Assign risk owner
```

---

# ⚠️ Risk Register

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| AI API cost overrun | High | High | Credit limits per user, BYOK option, response caching |
| PDF parsing accuracy | High | Medium | Human review step before applying parsed data |
| LaTeX compilation latency | Medium | Medium | Queue-based compilation, show spinner, cache compiled PDFs |
| Monaco Editor bundle size | Medium | Low | Dynamic import, chunk splitting, lazy load |
| Stripe webhook reliability | Low | High | Idempotency keys, webhook retry handling |
| Template rendering inconsistency | Medium | High | Pixel-perfect template tests with Playwright visual regression |
| Mock interview AI cost | High | High | Session-level credit limits, max question count cap |

---

*ResumeForge Frontend Backlog — Next.js 14 + TypeScript + Tailwind CSS + Zustand + Monaco Editor*
*Scale Target: 50k–500k users | 14 Sprints | ~28 weeks*
