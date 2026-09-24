// ResumeForge Delivery Plan — data transcribed from ../../06-Delivery-Plan.md
// Single source of truth for the board UI. Edit here if the plan changes.
window.PLAN_DATA = {
  project: 'ResumeForge',
  epics: [
    { id: 'E1', name: 'Platform foundation', outcome: 'Monorepo, MF shell + remotes, CI, design tokens' },
    { id: 'E2', name: 'Resume editor', outcome: 'Document model, section editors, live preview, export' },
    { id: 'E3', name: 'AI assistant', outcome: 'Streaming suggest, tailor-to-JD, ATS analysis, tool-calls' },
    { id: 'E4', name: 'Accounts & billing', outcome: 'OIDC auth, RBAC tiers, billing, feature flags' },
    { id: 'E5', name: 'Templates', outcome: 'Gallery, theme engine, marketplace' },
    { id: 'E6', name: 'Quality & reach', outcome: 'Testing ≥90%, a11y, perf budgets, i18n' },
  ],
  sprints: [
    {
      id: 'S1', title: 'Foundation (E1)',
      goal: 'A working Rspack Module-Federation shell + one remote is running locally and in CI, with the shared design-token library wired in.',
      capacityPts: 10, dateRange: '2026-09-21 → 2026-10-04',
      stories: [
        {
          id: 'RF-101', title: 'Monorepo & tooling bootstrap', epic: 'E1', feature: 'F1', points: 3, priority: 'P0', dependsOn: [],
          userStory: 'As a developer, I want a working pnpm+Turborepo monorepo with lint/format/test wired, so that every subsequent story has a consistent, CI-checked foundation.',
          ac: [
            'Given a clean checkout, When I run `pnpm install && pnpm build`, Then all workspace packages build with zero errors.',
            'Given a PR is opened, When CI runs, Then lint + typecheck + unit tests execute and block merge on failure.',
          ],
          tasks: [
            { id: 'RF-101.T1', title: '`pnpm-workspace.yaml` + `turbo.json` + root `package.json` scripts', hours: 2, day: 'D1' },
            { id: 'RF-101.T2', title: 'Shared `tsconfig.base.json`, ESLint flat config, Prettier', hours: 3, day: 'D1' },
            { id: 'RF-101.T3', title: '`packages/contracts` + `packages/ui` + `packages/config` scaffolds', hours: 3, day: 'D2' },
            { id: 'RF-101.T4', title: 'GitHub Actions CI matrix (lint/typecheck/test per package)', hours: 3, day: 'D2' },
            { id: 'RF-101.T5', title: 'Husky + lint-staged + commitlint (Conventional Commits)', hours: 2, day: 'D3' },
            { id: 'RF-101.T6', title: 'Unit test harness smoke test (Vitest config + 1 passing test per package)', hours: 2, day: 'D3' },
          ],
        },
        {
          id: 'RF-102', title: 'Module Federation shell + remote skeleton', epic: 'E1', feature: 'F2', points: 5, priority: 'P0', dependsOn: ['RF-101'],
          userStory: 'As a developer, I want a shell host that dynamically loads a lazy-federated remote, so that future features can ship as independently deployable micro-frontends.',
          ac: [
            "Given the shell and `editor` remote are running, When I navigate to `/editor/demo`, Then the remote's placeholder component renders inside the shell layout.",
            'Given the `editor` remote fails to load, When the route is visited, Then an error-boundary fallback renders instead of a blank/crashed page.',
            'Given react/router/query are declared shared singletons, When both apps run together, Then only one copy of each loads (verified via bundle analyzer).',
          ],
          tasks: [
            { id: 'RF-102.T1', title: '`apps/shell` Rspack config + dev server + base layout/router', hours: 4, day: 'D4' },
            { id: 'RF-102.T2', title: '`apps/editor` Rspack config + `ModuleFederationPlugin` (`exposes`)', hours: 3, day: 'D4' },
            { id: 'RF-102.T3', title: 'Shell `remotes` config + shared singleton versions (react/router/query)', hours: 3, day: 'D5' },
            { id: 'RF-102.T4', title: '`React.lazy` + `Suspense` + per-remote error boundary in shell', hours: 3, day: 'D5' },
            { id: 'RF-102.T5', title: 'Bundle-analyzer check: no duplicate React/ReactDOM in output', hours: 2, day: 'D6' },
            { id: 'RF-102.T6', title: "Integration test: shell renders remote; error boundary test (remote import rejected)", hours: 4, day: 'D6' },
            { id: 'RF-102.T7', title: "Contract check script: remote `exposes` match shell's expected module map", hours: 3, day: 'D7' },
          ],
        },
        {
          id: 'RF-103', title: 'Shared design tokens & UI primitives', epic: 'E1', feature: 'F3', points: 2, priority: 'P1', dependsOn: ['RF-101'],
          userStory: 'As a developer, I want the design tokens and base primitives (button, input, card, badge) published as a shared package, so that every remote looks and behaves consistently from day one.',
          ac: [
            'Given `packages/ui` is installed in a remote, When a component imports `tokens.css`, Then dark theme renders by default and light theme via `data-theme="light"`.',
            'Given a `<Button variant="primary">`, When rendered, Then it meets WCAG AA contrast and shows a visible focus ring on keyboard focus.',
          ],
          tasks: [
            { id: 'RF-103.T1', title: 'Port token CSS vars from `05-UIUX-Design.md` into `packages/ui/tokens.css`', hours: 3, day: 'D8' },
            { id: 'RF-103.T2', title: '`Button`, `Input`, `Card`, `Badge` primitives (Radix + Tailwind)', hours: 4, day: 'D8–D9' },
            { id: 'RF-103.T3', title: 'Storybook (or a static preview page) for the primitives', hours: 2, day: 'D9' },
            { id: 'RF-103.T4', title: 'axe unit tests for each primitive (default/hover/focus/disabled)', hours: 3, day: 'D10' },
          ],
        },
      ],
    },
    {
      id: 'S2', title: 'Editor (E2)',
      goal: 'A user can create a resume, edit its sections, see a live preview, and export a PDF.',
      capacityPts: 10, dateRange: '2026-10-05 → 2026-10-18',
      stories: [
        {
          id: 'RF-201', title: 'Resume document model + Zustand store (undo/redo)', epic: 'E2', feature: 'F1', points: 3, priority: 'P0', dependsOn: ['RF-101', 'RF-103'],
          userStory: 'As a developer, I want a typed `ResumeDoc` model and an undoable Zustand store, so that all editor features share one consistent, patchable source of truth.',
          ac: [
            'Given a loaded `ResumeDoc`, When `applyPatch` is called with a valid `ResumePatch`, Then the store updates and the change is undoable via `undo()`.',
            'Given an invalid patch (fails Zod parse), When `applyPatch` is called, Then the store is unchanged and an error is surfaced.',
          ],
          tasks: [
            { id: 'RF-201.T1', title: '`ResumeDoc`/`ResumePatch` Zod schemas in `packages/contracts`', hours: 3, day: 'D1' },
            { id: 'RF-201.T2', title: '`resumeStore.ts` (Zustand) with `past`/`future` undo/redo stacks', hours: 4, day: 'D1–D2' },
            { id: 'RF-201.T3', title: '`applyPatch` reducer (JSON-pointer based replace/insert/remove)', hours: 3, day: 'D2' },
            { id: 'RF-201.T4', title: 'Unit tests: apply/undo/redo, invalid-patch rejection, redo-cleared-on-new-patch', hours: 3, day: 'D3' },
            { id: 'RF-201.T5', title: 'Seed/factory helper (`resumeFactory()`) for tests + storybook', hours: 2, day: 'D3' },
          ],
        },
        {
          id: 'RF-202', title: 'Section editors (summary/experience/skills) with RHF+Zod', epic: 'E2', feature: 'F2', points: 3, priority: 'P0', dependsOn: ['RF-201'],
          userStory: 'As a job seeker, I want to edit my summary, experience, and skills in structured forms, so that my resume data stays valid and well-formatted.',
          ac: [
            'Given the summary field is empty, When I try to save, Then a validation error shows inline and the field is marked `aria-invalid`.',
            'Given I add an experience entry, When I fill required fields and blur, Then the entry is patched into the store without a full-page save action.',
          ],
          tasks: [
            { id: 'RF-202.T1', title: '`SummaryEditor` (RHF + Zod, debounced patch on change)', hours: 3, day: 'D4' },
            { id: 'RF-202.T2', title: '`ExperienceEditor` (repeatable field array, add/remove/reorder)', hours: 4, day: 'D4–D5' },
            { id: 'RF-202.T3', title: '`SkillsEditor` (tag input)', hours: 2, day: 'D5' },
            { id: 'RF-202.T4', title: 'Wire all three editors to `applyPatch`; shared `rf-field` styling', hours: 2, day: 'D6' },
            { id: 'RF-202.T5', title: 'Component tests (RTL): validation errors, add/remove experience row', hours: 4, day: 'D6' },
          ],
        },
        {
          id: 'RF-203', title: 'Live preview pane synced to the store', epic: 'E2', feature: 'F3', points: 2, priority: 'P0', dependsOn: ['RF-201', 'RF-202'],
          userStory: 'As a job seeker, I want to see my resume rendered as I type, so that I always know what the exported document will look like.',
          ac: [
            'Given I edit the summary field, When the debounce window elapses (~120ms), Then the preview pane updates without noticeable jank (no dropped frames on a mid-tier laptop).',
            'Given the document is empty, When I open the editor, Then the preview shows friendly placeholder text, not a blank page.',
          ],
          tasks: [
            { id: 'RF-203.T1', title: '`LivePreview` component subscribed to `resumeStore` (memoized)', hours: 3, day: 'D7' },
            { id: 'RF-203.T2', title: 'Debounce store→preview updates (~120ms) to avoid layout thrash', hours: 2, day: 'D7' },
            { id: 'RF-203.T3', title: 'Empty/placeholder state + skeleton while doc loads', hours: 2, day: 'D8' },
            { id: 'RF-203.T4', title: 'Integration test: typing in summary reflects in preview within debounce window', hours: 3, day: 'D8' },
          ],
        },
        {
          id: 'RF-204', title: 'PDF export', epic: 'E2', feature: 'F4', points: 2, priority: 'P1', dependsOn: ['RF-203'],
          userStory: 'As a job seeker, I want to export my resume as a PDF, so that I can submit it to job applications.',
          ac: [
            'Given a completed resume, When I click "Export PDF", Then a vector PDF downloads matching the on-screen preview layout.',
            'Given the export is in progress, When it takes longer than 300ms, Then a loading state is shown on the export button.',
          ],
          tasks: [
            { id: 'RF-204.T1', title: '`@react-pdf/renderer` document template mapped from `ResumeDoc`', hours: 4, day: 'D9' },
            { id: 'RF-204.T2', title: 'Export button + loading/disabled state + error toast on failure', hours: 2, day: 'D9' },
            { id: 'RF-204.T3', title: 'E2E (Playwright): create resume → export → file downloaded', hours: 4, day: 'D10' },
          ],
        },
      ],
    },
    {
      id: 'S3', title: 'AI + Auth (E3, E4)',
      goal: 'A logged-in user can stream an AI suggestion and accept it into their resume.',
      capacityPts: 10, dateRange: '2026-10-19 → 2026-11-01',
      stories: [
        {
          id: 'RF-301', title: '`useSSE` streaming hook + BFF mock contract', epic: 'E3', feature: 'F1', points: 3, priority: 'P0', dependsOn: ['RF-201'],
          userStory: 'As a developer, I want a reusable SSE-streaming hook against the documented BFF contract, so that any AI feature can stream tokens with cancellation.',
          ac: [
            'Given a `/ai/suggest` MSW mock emits `delta`/`toolCall`/`done` events, When `start()` is called, Then `text` accumulates in order and `status` transitions idle→streaming→done.',
            'Given `stop()` is called mid-stream, When the fetch aborts, Then `text` retains the partial content and `status` becomes `done`.',
          ],
          tasks: [
            { id: 'RF-301.T1', title: '`SSEEvent` types + `parseSSE` frame parser (`event:`/`data:` parsing)', hours: 3, day: 'D1' },
            { id: 'RF-301.T2', title: '`useSSE` hook: `fetch` + `ReadableStream` + `AbortController` + rAF flush buffer', hours: 3, day: 'D1' },
            { id: 'RF-301.T3', title: 'MSW SSE handler factory (scripted token arrays) for tests/dev', hours: 3, day: 'D2' },
            { id: 'RF-301.T4', title: 'Unit tests: token order, stop-preserves-partial, error event handling', hours: 3, day: 'D2' },
          ],
        },
        {
          id: 'RF-302', title: 'AssistantPanel streaming UI + Accept flow', epic: 'E3', feature: 'F1', points: 3, priority: 'P0', dependsOn: ['RF-301', 'RF-201'],
          userStory: 'As a job seeker, I want to ask the AI to improve a section and accept the result, so that my resume improves with one click.',
          ac: [
            'Given I click "Improve with AI", When tokens stream in, Then they render with a live caret in an `aria-live="polite"` region and a Stop button is available.',
            'Given streaming finishes, When a valid `ResumePatch` tool-call was returned, Then an "Accept" button appears; accepting applies the patch (undoable) to the editor store.',
          ],
          tasks: [
            { id: 'RF-302.T1', title: '`AssistantPanel` UI: Improve/Stop/Accept buttons + streaming text region', hours: 3, day: 'D3' },
            { id: 'RF-302.T2', title: 'Accept handler: Zod-validate `ResumePatch` → `applyPatch` on store', hours: 2, day: 'D3' },
            { id: 'RF-302.T3', title: 'Caret + reduced-motion handling; keyboard-focusable Stop', hours: 2, day: 'D4' },
            { id: 'RF-302.T4', title: 'Component tests (RTL + MSW): full stream→stop→accept happy/edge paths', hours: 4, day: 'D4' },
            { id: 'RF-302.T5', title: 'E2E (Playwright): request → stream → stop → accept → preview updates', hours: 4, day: 'D5' },
          ],
        },
        {
          id: 'RF-303', title: 'OIDC/PKCE login via BFF + session guard', epic: 'E4', feature: 'F1', points: 3, priority: 'P0', dependsOn: ['RF-101'],
          userStory: 'As a user, I want to sign in securely, so that my resumes and plan are tied to my account.',
          ac: [
            'Given I click "Log in", When I complete the IdP flow, Then the BFF sets an httpOnly session cookie and I land on `/dashboard` authenticated.',
            'Given I am not authenticated, When I visit a protected route, Then I am redirected to `/login`.',
            "Given my session expires, When I make an API call, Then the BFF silently refreshes or I'm prompted to re-authenticate — never a silent data loss.",
          ],
          tasks: [
            { id: 'RF-303.T1', title: 'BFF `/auth/login`, `/auth/callback`, `/auth/logout` (PKCE, session cookie) [mocked for FE dev]', hours: 4, day: 'D6' },
            { id: 'RF-303.T2', title: '`useSession()` hook + `/me` fetch + `RequireAuth` route guard', hours: 3, day: 'D6' },
            { id: 'RF-303.T3', title: 'Login screen wiring (redirect flow) + logout action', hours: 2, day: 'D7' },
            { id: 'RF-303.T4', title: 'CSRF header wiring on state-changing requests', hours: 2, day: 'D7' },
            { id: 'RF-303.T5', title: 'Integration tests: guarded route redirects; authenticated session hydrates `/me`', hours: 4, day: 'D8' },
          ],
        },
        {
          id: 'RF-304', title: 'AI quota limit guard + upgrade modal', epic: 'E4', feature: 'F2', points: 1, priority: 'P1', dependsOn: ['RF-302', 'RF-303'],
          userStory: 'As a Free-tier user, I want to see an upgrade prompt when I hit my daily AI limit, so that I understand why the assistant stopped and how to unlock more.',
          ac: [
            'Given a Free user has used 10 AI actions today, When they click "Improve with AI", Then the request is blocked client-side (no stream starts) and an upgrade modal appears.',
            'Given the BFF also returns `429` for the same condition, When it happens without a client-side block (stale cache), Then the same upgrade modal renders from the error event.',
          ],
          tasks: [
            { id: 'RF-304.T1', title: '`RequirePlan`/quota check hook reading `/me` plan + usage', hours: 2, day: 'D9' },
            { id: 'RF-304.T2', title: 'Upgrade modal component + wiring on client-block and `429` paths', hours: 2, day: 'D9' },
            { id: 'RF-304.T3', title: 'Tests: over-limit blocks stream; `429` triggers same modal', hours: 1, day: 'D10' },
          ],
        },
      ],
    },
    {
      id: 'S4', title: 'ATS + Tailor (E3)',
      goal: 'A user gets a live ATS score with a gap report, and can tailor their resume to a pasted job description.',
      capacityPts: 10, dateRange: '2026-11-02 → 2026-11-15',
      stories: [
        {
          id: 'RF-401', title: 'ATS scoring engine (BFF endpoint + client contract)', epic: 'E3', feature: 'F2', points: 3, priority: 'P0', dependsOn: ['RF-201', 'RF-301'],
          userStory: 'As a job seeker, I want an ATS score computed for my resume, so that I know how likely it is to pass automated filters.',
          ac: [
            'Given a `ResumeDoc`, When `/ats/analyze` streams, Then it emits progressive `atsScore` events culminating in a final score (0–100) and a list of missing keywords.',
            'Given the score is advisory, When displayed, Then a "not a guarantee" disclaimer is always visible near the score.',
          ],
          tasks: [
            { id: 'RF-401.T1', title: '`AssistantResult`/`atsScore` event contract in `packages/contracts`', hours: 2, day: 'D1' },
            { id: 'RF-401.T2', title: 'MSW mock for `/ats/analyze` streaming score + keyword gaps', hours: 3, day: 'D1' },
            { id: 'RF-401.T3', title: '`useAtsScore` hook (wraps `useSSE`, exposes `score`, `missing[]`)', hours: 3, day: 'D2' },
            { id: 'RF-401.T4', title: 'Unit tests: progressive score updates, final value, disclaimer render', hours: 3, day: 'D2' },
            { id: 'RF-401.T5', title: 'Recompute trigger: score refreshes after any accepted patch', hours: 4, day: 'D3' },
          ],
        },
        {
          id: 'RF-402', title: 'ATS score gauge + keyword report UI', epic: 'E3', feature: 'F2', points: 2, priority: 'P0', dependsOn: ['RF-401'],
          userStory: 'As a job seeker, I want a visual score gauge and a keyword gap list, so that I can quickly see what to fix.',
          ac: [
            'Given a score of 82, When the gauge renders, Then it visually fills to 82% with the numeric value in the center and an accessible label (`aria-label="ATS score 82"`).',
            'Given missing keywords exist, When the report renders, Then each is listed with a one-click "ask AI to add" affordance.',
          ],
          tasks: [
            { id: 'RF-402.T1', title: '`ScoreGauge` component (conic-gradient, accessible label)', hours: 2, day: 'D4' },
            { id: 'RF-402.T2', title: '`KeywordReport` list + "ask AI to add" action → triggers RF-302 flow', hours: 3, day: 'D4' },
            { id: 'RF-402.T3', title: 'Recharts keyword-coverage bar chart', hours: 2, day: 'D5' },
            { id: 'RF-402.T4', title: 'Component + a11y tests (axe) for gauge and report', hours: 3, day: 'D5' },
          ],
        },
        {
          id: 'RF-403', title: 'Tailor-to-JD streaming flow', epic: 'E3', feature: 'F3', points: 3, priority: 'P0', dependsOn: ['RF-302', 'RF-401'],
          userStory: "As a job seeker, I want to paste a job description and have the AI tailor my resume to it, so that I don't manually keyword-match every application.",
          ac: [
            'Given I paste a job description and click "Tailor", When the AI streams, Then multiple patches arrive and are previewed before I accept them individually or all at once.',
            'Given the JD field is empty, When I click "Tailor", Then the action is disabled with inline guidance.',
          ],
          tasks: [
            { id: 'RF-403.T1', title: 'JD textarea + validation (non-empty, max length)', hours: 2, day: 'D6' },
            { id: 'RF-403.T2', title: '`/ai/tailor` streaming wiring (reuses `useSSE`) + multi-patch preview list', hours: 4, day: 'D6–D7' },
            { id: 'RF-403.T3', title: '"Accept all" / "accept individually" controls, each undoable', hours: 3, day: 'D7' },
            { id: 'RF-403.T4', title: 'Component tests: multi-patch stream, partial accept, accept-all', hours: 4, day: 'D8' },
            { id: 'RF-403.T5', title: 'E2E: paste JD → stream → accept → ATS score increases', hours: 2, day: 'D8' },
          ],
        },
        {
          id: 'RF-404', title: 'Cover letter generator', epic: 'E3', feature: 'F1', points: 2, priority: 'P2', dependsOn: ['RF-301', 'RF-403'],
          userStory: 'As a job seeker, I want a cover letter generated from my resume and the job description, so that I have a complete application package.',
          ac: [
            'Given a resume and JD are available, When I click "Generate cover letter", Then a streamed draft appears in an editable text area.',
            'Given the draft is generated, When I click "Copy" or "Export", Then the letter is copied to clipboard or exported alongside the resume.',
          ],
          tasks: [
            { id: 'RF-404.T1', title: '`/ai/cover-letter` streaming wiring + editable draft textarea', hours: 3, day: 'D9' },
            { id: 'RF-404.T2', title: 'Copy-to-clipboard + export-alongside-resume actions', hours: 2, day: 'D9' },
            { id: 'RF-404.T3', title: 'Tests: stream renders draft; copy/export actions fire', hours: 2, day: 'D10' },
          ],
        },
      ],
    },
    {
      id: 'S5', title: 'Import + Templates + Tiers (E5, E4)',
      goal: 'A user can import an existing resume, choose from a virtualized template gallery, and plan limits are enforced.',
      capacityPts: 10, dateRange: '2026-11-16 → 2026-11-29',
      stories: [
        {
          id: 'RF-501', title: 'PDF/DOCX import & parse', epic: 'E5', feature: 'F1', points: 3, priority: 'P1', dependsOn: ['RF-201'],
          userStory: "As a job seeker, I want to upload my existing resume, so that I don't have to retype everything from scratch.",
          ac: [
            'Given I drop a PDF/DOCX on the dashboard dropzone, When parsing completes, Then a best-effort `ResumeDoc` is created and opened in the editor.',
            'Given the file can\'t be parsed cleanly, When this happens, Then the user sees "Couldn\'t parse fully — please review" and lands in the editor with whatever was extracted (never a hard failure).',
          ],
          tasks: [
            { id: 'RF-501.T1', title: 'Dropzone UI + file-type/size validation', hours: 2, day: 'D1' },
            { id: 'RF-501.T2', title: '`pdfjs-dist` text extraction → heuristic section splitter', hours: 4, day: 'D1–D2' },
            { id: 'RF-501.T3', title: '`mammoth` DOCX extraction → same section splitter', hours: 3, day: 'D2' },
            { id: 'RF-501.T4', title: 'Run parsing in a Web Worker to keep the main thread responsive', hours: 3, day: 'D3' },
            { id: 'RF-501.T5', title: 'Tests: sample PDF/DOCX fixtures parse to expected sections; malformed file → graceful fallback', hours: 3, day: 'D3' },
          ],
        },
        {
          id: 'RF-502', title: 'Template gallery with virtualization', epic: 'E5', feature: 'F1', points: 3, priority: 'P0', dependsOn: ['RF-103'],
          userStory: "As a job seeker, I want to browse resume templates smoothly even with many options, so that choosing a look doesn't feel slow.",
          ac: [
            'Given 50+ templates, When I scroll the gallery, Then only visible rows are rendered (windowed) and scroll stays at 60fps.',
            'Given I select a template, When I confirm, Then the editor opens with that template applied to my current document.',
          ],
          tasks: [
            { id: 'RF-502.T1', title: '`TemplateGallery` with `@tanstack/react-virtual`', hours: 4, day: 'D4' },
            { id: 'RF-502.T2', title: 'Template thumbnail cards + selection → editor handoff', hours: 3, day: 'D4–D5' },
            { id: 'RF-502.T3', title: 'Keyboard navigation (arrow keys) across the virtualized grid', hours: 2, day: 'D5' },
            { id: 'RF-502.T4', title: 'Perf test: scroll profiling shows no dropped frames with 100 items', hours: 3, day: 'D6' },
          ],
        },
        {
          id: 'RF-503', title: 'Theme engine (template rendering variants)', epic: 'E5', feature: 'F2', points: 2, priority: 'P1', dependsOn: ['RF-502', 'RF-203'],
          userStory: 'As a job seeker, I want each template to render my same data differently, so that I can pick a look without re-entering content.',
          ac: [
            'Given the same `ResumeDoc`, When I switch templates, Then the preview and PDF export both reflect the new layout without data loss.',
            'Given a template defines a color/typography variant, When applied, Then it stays within the AA-contrast token set.',
          ],
          tasks: [
            { id: 'RF-503.T1', title: '`renderTemplate(doc, templateId)` registry + 3 initial template renderers', hours: 4, day: 'D7' },
            { id: 'RF-503.T2', title: 'Wire template switch into `LivePreview` and PDF export', hours: 3, day: 'D7–D8' },
            { id: 'RF-503.T3', title: 'Tests: switching templates preserves doc data; contrast check per template', hours: 3, day: 'D8' },
          ],
        },
        {
          id: 'RF-504', title: 'Plan gating (RBAC) + upgrade modal wiring', epic: 'E4', feature: 'F2', points: 2, priority: 'P0', dependsOn: ['RF-303', 'RF-304', 'RF-502'],
          userStory: 'As a business, I want Free/Pro/Teams limits enforced in the UI, so that upgrade paths are clear and revenue-driving features are protected.',
          ac: [
            'Given a Free user has 1 resume already, When they click "+ New resume", Then they see the upgrade modal instead of a new blank editor.',
            'Given a Pro-only template is selected by a Free user, When selected, Then an inline "Pro" badge and upgrade CTA show instead of applying it.',
          ],
          tasks: [
            { id: 'RF-504.T1', title: '`RequirePlan` gating on "new resume", exports, and Pro templates', hours: 3, day: 'D9' },
            { id: 'RF-504.T2', title: 'Server-side enforcement stub (BFF returns `403` for over-limit actions)', hours: 2, day: 'D9' },
            { id: 'RF-504.T3', title: 'Tests: gated actions show upgrade modal; server 403 handled gracefully', hours: 3, day: 'D10' },
          ],
        },
      ],
    },
    {
      id: 'S6', title: 'Reach: i18n, a11y, Performance (E6)',
      goal: 'The app ships in 5 locales (incl. Arabic RTL), passes an accessibility audit, and meets Core Web Vitals budgets in CI.',
      capacityPts: 10, dateRange: '2026-11-30 → 2026-12-13',
      stories: [
        {
          id: 'RF-601', title: 'i18next + ICU setup with 5 locale catalogs', epic: 'E6', feature: 'F1', points: 3, priority: 'P1', dependsOn: ['RF-102'],
          userStory: 'As a non-English-speaking user, I want the app in my language, so that I can use it comfortably.',
          ac: [
            'Given the shell initializes i18next as a shared singleton, When any remote lazy-loads its namespace, Then translated strings render with no flash of untranslated content.',
            'Given a key is missing in a non-English locale, When rendered, Then it falls back to English and is flagged in a CI report (not silently blank).',
          ],
          tasks: [
            { id: 'RF-601.T1', title: 'i18next+ICU init in shell (singleton) + `LanguageDetector`', hours: 3, day: 'D1' },
            { id: 'RF-601.T2', title: 'Per-remote namespace files (`common`, `editor`, `assistant`, `templates`, `account`)', hours: 4, day: 'D1–D2' },
            { id: 'RF-601.T3', title: '`i18next-parser` extraction script wired into CI', hours: 2, day: 'D2' },
            { id: 'RF-601.T4', title: 'Seed es/fr/de/ar catalogs (machine-translated placeholders, flagged for review)', hours: 3, day: 'D3' },
            { id: 'RF-601.T5', title: 'Missing-key CI check (fails build if shipped locale has gaps)', hours: 3, day: 'D3' },
          ],
        },
        {
          id: 'RF-602', title: 'RTL support + Arabic locale QA', epic: 'E6', feature: 'F1', points: 2, priority: 'P1', dependsOn: ['RF-601'],
          userStory: 'As an Arabic-speaking user, I want the layout mirrored correctly, so that the app feels native, not translated-and-broken.',
          ac: [
            'Given locale is `ar`, When any page renders, Then `dir="rtl"` is set and all spacing/icons use logical properties (no visually-reversed UI).',
            "Given the editor's 3-pane layout, When in RTL, Then pane order and text alignment are mirrored correctly.",
          ],
          tasks: [
            { id: 'RF-602.T1', title: 'Audit + convert remaining physical CSS properties to logical (`margin-inline-*` etc.)', hours: 4, day: 'D4' },
            { id: 'RF-602.T2', title: '`dir`/`lang` wiring on locale change + editor 3-pane RTL verification', hours: 3, day: 'D4–D5' },
            { id: 'RF-602.T3', title: 'Visual regression snapshot: editor + dashboard in `ar`', hours: 3, day: 'D5' },
          ],
        },
        {
          id: 'RF-603', title: 'Accessibility pass (axe fixes, keyboard map, focus management)', epic: 'E6', feature: 'F2', points: 3, priority: 'P0', dependsOn: ['RF-103', 'RF-302'],
          userStory: "As a keyboard/screen-reader user, I want every core flow operable without a mouse, so that I'm not excluded from using the product.",
          ac: [
            'Given any key screen (dashboard, editor, templates, account), When scanned with axe, Then there are zero critical/serious violations.',
            'Given the command palette or a modal is open, When I press Tab repeatedly, Then focus stays trapped inside until closed, and returns to the trigger on close.',
          ],
          tasks: [
            { id: 'RF-603.T1', title: 'axe scan sweep across all screens; triage + fix list', hours: 3, day: 'D6' },
            { id: 'RF-603.T2', title: 'Focus-trap utility applied to command palette + all modals', hours: 3, day: 'D6–D7' },
            { id: 'RF-603.T3', title: 'Full keyboard map verification (Ctrl/Cmd+K, Z/Shift+Z, Enter, Esc, S, E)', hours: 2, day: 'D7' },
            { id: 'RF-603.T4', title: '`aria-live` correctness pass on streaming regions', hours: 2, day: 'D8' },
            { id: 'RF-603.T5', title: 'CI gate: `@axe-core/playwright` scan fails build on new violations', hours: 3, day: 'D8' },
          ],
        },
        {
          id: 'RF-604', title: 'Performance hardening (budgets + Lighthouse CI gate)', epic: 'E6', feature: 'F3', points: 2, priority: 'P0', dependsOn: ['RF-102', 'RF-502'],
          userStory: "As a user on a mid-tier device, I want the app to load and respond fast, so that I don't abandon the task.",
          ac: [
            'Given the CI pipeline runs on a PR, When Lighthouse CI executes, Then it fails the build if p75 LCP/INP/CLS budgets from `09-Performance.md` are exceeded.',
            'Given the shell and editor remote bundles, When built, Then `size-limit` enforces the per-route byte budgets.',
          ],
          tasks: [
            { id: 'RF-604.T1', title: '`size-limit` config per remote wired into CI', hours: 2, day: 'D9' },
            { id: 'RF-604.T2', title: 'Lighthouse CI config + budget assertions (mobile profile)', hours: 3, day: 'D9' },
            { id: 'RF-604.T3', title: "Fix any regressions found (code-split heavy libs, `modulepreload` next remote)", hours: 3, day: 'D10' },
            { id: 'RF-604.T4', title: '`web-vitals` RUM wiring confirmed sending to analytics endpoint', hours: 2, day: 'D10' },
          ],
        },
      ],
    },
    {
      id: 'S7', title: 'Teams (E4, E2)',
      goal: 'Teams-tier customers can share resumes, see version history, and use brand templates.',
      capacityPts: 10, dateRange: '2026-12-14 → 2026-12-27',
      stories: [
        {
          id: 'RF-701', title: 'Sharing & seats (Teams plan)', epic: 'E4', feature: 'F4', points: 3, priority: 'P2', dependsOn: ['RF-303', 'RF-504'],
          userStory: 'As a Teams admin, I want to invite teammates and share resumes, so that our team can collaborate on candidate documents.',
          ac: [
            "Given I'm a Teams admin, When I invite a teammate by email, Then they receive access scoped to the team's shared resumes only.",
            'Given a shared resume, When a teammate opens it, Then they see the same document state (no divergent copies).',
          ],
          tasks: [
            { id: 'RF-701.T1', title: 'Seat invite UI + pending/accepted states', hours: 3, day: 'D1' },
            { id: 'RF-701.T2', title: 'Shared-resume access model wiring (BFF contract stub + client)', hours: 4, day: 'D1–D2' },
            { id: 'RF-701.T3', title: 'Role badges (admin/member) in team member list', hours: 2, day: 'D2' },
            { id: 'RF-701.T4', title: 'Tests: invite flow, shared resume visible to invited member only', hours: 3, day: 'D3' },
          ],
        },
        {
          id: 'RF-702', title: 'Resume versioning / history', epic: 'E2', feature: 'F1', points: 3, priority: 'P1', dependsOn: ['RF-201'],
          userStory: 'As a user, I want to see and restore previous versions of my resume, so that I can recover from an unwanted change.',
          ac: [
            'Given I\'ve made several accepted AI patches, When I open "Version history", Then I see a chronological list of snapshots with timestamps.',
            'Given I select an older version, When I click "Restore", Then the document reverts (itself undoable) without losing the history log.',
          ],
          tasks: [
            { id: 'RF-702.T1', title: 'Snapshot-on-significant-change logic (debounced, not every keystroke)', hours: 3, day: 'D4' },
            { id: 'RF-702.T2', title: '`VersionHistory` panel UI (timeline list + preview thumbnail)', hours: 4, day: 'D4–D5' },
            { id: 'RF-702.T3', title: 'Restore action (pushes current state to history, then applies snapshot)', hours: 2, day: 'D5' },
            { id: 'RF-702.T4', title: 'Tests: snapshot cadence, restore correctness, restore-is-itself-undoable', hours: 3, day: 'D6' },
          ],
        },
        {
          id: 'RF-703', title: 'Brand templates (Teams-only upload)', epic: 'E5', feature: 'F3', points: 2, priority: 'P2', dependsOn: ['RF-502', 'RF-701'],
          userStory: "As a Teams admin, I want to upload a branded template, so that all our team's resumes share a consistent look.",
          ac: [
            'Given I\'m a Teams admin, When I upload a template definition, Then it appears in the gallery for team members only, tagged "Brand".',
            'Given a non-admin team member, When browsing templates, Then they cannot upload but can use brand templates.',
          ],
          tasks: [
            { id: 'RF-703.T1', title: 'Template upload form (admin-only) + validation against template schema', hours: 3, day: 'D7' },
            { id: 'RF-703.T2', title: '"Brand" badge + team-scoped visibility in gallery', hours: 2, day: 'D7' },
            { id: 'RF-703.T3', title: 'Tests: admin can upload, member cannot; visibility scoping', hours: 2, day: 'D8' },
          ],
        },
        {
          id: 'RF-704', title: 'Billing portal integration', epic: 'E4', feature: 'F3', points: 2, priority: 'P1', dependsOn: ['RF-504'],
          userStory: 'As a user, I want to manage my subscription and payment method, so that I can upgrade, downgrade, or update billing details myself.',
          ac: [
            'Given I click "Manage billing" in Account, When I confirm, Then I\'m redirected to the billing portal (BFF-brokered) and back to `/account` afterward.',
            'Given my plan changes in the portal, When I return, Then the app reflects the new plan/RBAC within one refresh.',
          ],
          tasks: [
            { id: 'RF-704.T1', title: '"Manage billing" action + BFF redirect/return handling', hours: 3, day: 'D9' },
            { id: 'RF-704.T2', title: 'Plan-change webhook → `/me` cache invalidation', hours: 2, day: 'D9' },
            { id: 'RF-704.T3', title: 'Tests: redirect/return flow, plan refresh after change', hours: 2, day: 'D10' },
          ],
        },
      ],
    },
    {
      id: 'S8', title: 'Advanced AI (E3, E5)',
      goal: 'Batched generative-UI patches, a template marketplace, and offline draft support ship; the release is hardened for GA.',
      capacityPts: 10, dateRange: '2026-12-28 → 2027-01-10',
      stories: [
        {
          id: 'RF-801', title: 'Generative-UI: batched multi-patch tool-calls', epic: 'E3', feature: 'F4', points: 3, priority: 'P2', dependsOn: ['RF-302', 'RF-403'],
          userStory: "As a job seeker, I want the AI to propose several coordinated changes at once (e.g. rewrite summary + reorder skills), so that bigger improvements aren't one tedious patch at a time.",
          ac: [
            'Given the AI returns a batch of patches, When streamed, Then they\'re grouped as one reviewable set with "accept all / accept none / accept individually".',
            'Given any patch in a batch fails Zod validation, When applying, Then only the invalid one is rejected and logged — the rest still apply.',
          ],
          tasks: [
            { id: 'RF-801.T1', title: 'Extend `AssistantResult` schema to `patches: ResumePatch[]` batches', hours: 2, day: 'D1' },
            { id: 'RF-801.T2', title: 'Batch review UI (grouped diff-style list)', hours: 4, day: 'D1–D2' },
            { id: 'RF-801.T3', title: 'Partial-failure handling (per-patch validation + reporting)', hours: 3, day: 'D2' },
            { id: 'RF-801.T4', title: 'Tests: batch accept-all/none/individual, partial failure isolation', hours: 4, day: 'D3' },
          ],
        },
        {
          id: 'RF-802', title: 'Template marketplace (browse/install 3rd-party templates)', epic: 'E5', feature: 'F3', points: 3, priority: 'P2', dependsOn: ['RF-502', 'RF-503'],
          userStory: 'As a job seeker, I want to browse and install community/marketplace templates, so that I have more design choice beyond the built-ins.',
          ac: [
            'Given the marketplace tab, When I browse, Then templates load paginated/virtualized with preview thumbnails.',
            'Given I install a marketplace template, When applied, Then it behaves identically to a built-in template (same render contract).',
          ],
          tasks: [
            { id: 'RF-802.T1', title: 'Marketplace tab + paginated/virtualized listing', hours: 4, day: 'D4' },
            { id: 'RF-802.T2', title: "Install flow (adds to user's template registry, respects render contract)", hours: 3, day: 'D4–D5' },
            { id: 'RF-802.T3', title: 'Tests: browse, install, apply installed template', hours: 3, day: 'D5' },
          ],
        },
        {
          id: 'RF-803', title: 'Offline draft (local persistence + sync)', epic: 'E2', feature: 'F1', points: 2, priority: 'P2', dependsOn: ['RF-201'],
          userStory: "As a user with a flaky connection, I want my in-progress edits saved locally, so that I don't lose work if the network drops.",
          ac: [
            'Given the network is offline, When I keep editing, Then changes persist to local storage/IndexedDB and a "working offline" indicator shows.',
            'Given connectivity returns, When sync runs, Then local changes merge with the server without silently overwriting newer server data (conflict surfaced to the user if detected).',
          ],
          tasks: [
            { id: 'RF-803.T1', title: 'IndexedDB persistence layer for the editor store', hours: 3, day: 'D6' },
            { id: 'RF-803.T2', title: 'Online/offline detection + "working offline" banner', hours: 2, day: 'D6' },
            { id: 'RF-803.T3', title: 'Sync-on-reconnect + basic conflict detection (version mismatch prompt)', hours: 3, day: 'D7' },
            { id: 'RF-803.T4', title: 'Tests: offline edit persists, reconnect syncs, conflict prompt appears', hours: 2, day: 'D7' },
          ],
        },
        {
          id: 'RF-804', title: 'Release hardening: bug bash + docs', epic: '—', feature: '—', points: 2, priority: 'P0', dependsOn: ['all prior sprints'],
          userStory: 'As the team, we want a final hardening pass, so that the GA release is stable and well-documented.',
          ac: [
            'Given the full test suite, When run in CI, Then coverage is ≥90% across all remotes and there are zero known P1 bugs.',
            'Given a new developer clones the repo, When they follow `12-Starter-Template.md`, Then they reach a running app with no undocumented steps.',
          ],
          tasks: [
            { id: 'RF-804.T1', title: 'Full regression pass across all 5 screens + locales; log/triage bugs', hours: 4, day: 'D8' },
            { id: 'RF-804.T2', title: 'Fix P1/P2 bugs found during bash', hours: 4, day: 'D8–D9' },
            { id: 'RF-804.T3', title: 'Refresh README/starter-template steps against the final repo state', hours: 2, day: 'D9' },
            { id: 'RF-804.T4', title: 'Final coverage + Lighthouse + a11y CI gate check across all remotes', hours: 2, day: 'D10' },
          ],
        },
      ],
    },
  ],
};
