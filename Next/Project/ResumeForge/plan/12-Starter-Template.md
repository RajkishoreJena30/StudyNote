# ResumeForge — Starter Template (step-by-step)

> Copy-pasteable commands to get a **working** Rspack Module-Federation monorepo (shell + editor remote) with TS, Tailwind, routing, tokens, auth stub, tests, CI, and observability. No Next.js.

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Scaffold the Monorepo](#2-scaffold-the-monorepo)
3. [Install Dependencies](#3-install-dependencies)
4. [Configure Tooling](#4-configure-ts-eslint-prettier-tailwind)
5. [Rspack + Module Federation](#5-rspack--module-federation)
6. [Folder Structure & Sample Slice](#6-folder-structure--sample-feature-slice)
7. [Routing + Tokens + Auth Stub](#7-routing--design-tokens--auth-stub)
8. [Test Harness + Coverage](#8-test-harness--coverage)
9. [CI (GitHub Actions)](#9-ci-github-actions)
10. [Deployment + Observability](#10-deployment--observability)
11. [Verify](#11-verify)
12. [Checklist](#12-checklist)

---

## 1. Prerequisites
```bash
node -v   # >= 20
corepack enable && corepack prepare pnpm@latest --activate
```

## 2. Scaffold the Monorepo
```bash
mkdir resumeforge && cd resumeforge
pnpm init
printf "packages:\n  - 'apps/*'\n  - 'packages/*'\n" > pnpm-workspace.yaml
mkdir -p apps/shell apps/editor packages/contracts packages/ui packages/config
echo '{ "pipeline": { "dev": { "cache": false, "persistent": true }, "build": {}, "test": {}, "lint": {} } }' > turbo.json
pnpm add -D -w turbo typescript @types/node
```

## 3. Install Dependencies
```bash
# Shared build tooling (root)
pnpm add -D -w @rspack/core @rspack/cli @module-federation/enhanced \
  eslint typescript-eslint prettier vitest @testing-library/react \
  @testing-library/user-event jsdom msw @playwright/test \
  @axe-core/playwright vitest-axe tailwindcss @tailwindcss/postcss size-limit

# Runtime (installed per app; shown for shell/editor)
pnpm --filter @resumeforge/shell add react react-dom react-router \
  @tanstack/react-query zustand i18next react-i18next i18next-icu \
  @sentry/react web-vitals oidc-client-ts
pnpm --filter @resumeforge/editor add react react-dom zustand \
  react-hook-form zod @react-pdf/renderer html-to-image
```

## 4. Configure TS, ESLint, Prettier, Tailwind
`packages/config/tsconfig.base.json`:
```jsonc
{
  "compilerOptions": {
    "target": "ES2022", "module": "ESNext", "moduleResolution": "Bundler",
    "jsx": "react-jsx", "strict": true, "noUncheckedIndexedAccess": true,
    "exactOptionalPropertyTypes": true, "skipLibCheck": true, "types": ["vitest/globals"]
  }
}
```
Add the flat `eslint.config.mjs` and Prettier config from [11-Coding-Standards.md](11-Coding-Standards.md#5-eslint--prettier). Tailwind 4 via `@tailwindcss/postcss`; import `packages/ui/tokens.css` (from [05-UIUX-Design.md](05-UIUX-Design.md#6-design-tokens-copy-pasteable-css)) in each app entry.

## 5. Rspack + Module Federation
`apps/shell/rspack.config.ts` (host) and `apps/editor/rspack.config.ts` (remote):
```ts
// apps/editor/rspack.config.ts (REMOTE)
import { defineConfig } from '@rspack/cli';
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';

export default defineConfig({
  entry: { main: './src/index.ts' },
  output: { uniqueName: 'editor', publicPath: 'auto' },
  plugins: [
    new ModuleFederationPlugin({
      name: 'editor',
      filename: 'remoteEntry.js',
      exposes: { './EditorApp': './src/EditorApp.tsx' },
      shared: {
        react: { singleton: true, requiredVersion: '^19' },
        'react-dom': { singleton: true, requiredVersion: '^19' },
        zustand: { singleton: true },
      },
    }),
  ],
  devServer: { port: 3001, headers: { 'Access-Control-Allow-Origin': '*' } },
});
```
Shell consumes it via the `remotes` block from [03-Architecture.md](03-Architecture.md#3-module-federation-wiring). Bootstrap the shell with the async-boundary pattern:
```ts
// apps/shell/src/index.ts
import('./bootstrap');
```

## 6. Folder Structure & Sample Feature Slice
Create the tree from [03-Architecture.md](03-Architecture.md#11-folder-structure-concrete-tree). Sample editor store slice:
```ts
// apps/editor/src/model/resumeStore.ts
import { create } from 'zustand';
import type { ResumeDoc, ResumePatch } from '@resumeforge/contracts';

interface EditorState {
  doc: ResumeDoc;
  past: ResumeDoc[]; future: ResumeDoc[];
  applyPatch: (p: ResumePatch) => void;
  undo: () => void; redo: () => void;
}
export const useResumeStore = create<EditorState>((set, get) => ({
  doc: /* seed */ {} as ResumeDoc, past: [], future: [],
  applyPatch: (p) => set((s) => ({ past: [...s.past, s.doc], future: [], doc: reduce(s.doc, p) })),
  undo: () => set((s) => s.past.length ? { doc: s.past.at(-1)!, past: s.past.slice(0, -1), future: [s.doc, ...s.future] } : s),
  redo: () => set((s) => s.future.length ? { doc: s.future[0]!, future: s.future.slice(1), past: [...s.past, s.doc] } : s),
}));
```

## 7. Routing + Design Tokens + Auth Stub
```tsx
// apps/shell/src/app/router.tsx
import { createBrowserRouter, RouterProvider } from 'react-router';
const EditorApp = React.lazy(() => import('editor/EditorApp'));
export const router = createBrowserRouter([
  { path: '/:locale?', element: <Layout />, children: [
    { path: 'dashboard', element: <Dashboard /> },
    { path: 'editor/:id', element: <Suspense fallback={<Skeleton/>}><EditorApp/></Suspense> },
  ]},
]);
```
Auth stub: `useSession()` hydrates from BFF `/me`; until the BFF exists, MSW returns a mock session (see [07-Security-Auth.md](07-Security-Auth.md)).

## 8. Test Harness + Coverage
Add the shared `vitest.config.ts` with 90% thresholds and `test/setup.ts` (MSW server + `expect.extend(matchers)` for axe) from [08-Testing-Strategy.md](08-Testing-Strategy.md#4-coverage-strategy--config-90).
```bash
pnpm exec playwright install --with-deps
pnpm test        # unit + coverage per remote
pnpm exec playwright test
```

## 9. CI (GitHub Actions)
```yaml
# .github/workflows/ci.yml
name: ci
on: [push, pull_request]
jobs:
  build-test:
    runs-on: ubuntu-latest
    strategy: { matrix: { app: [shell, editor, assistant, templates, account] } }
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: pnpm }
      - run: pnpm install --frozen-lockfile
      - run: pnpm --filter @resumeforge/${{ matrix.app }} lint
      - run: pnpm --filter @resumeforge/${{ matrix.app }} test  # fails < 90%
      - run: pnpm --filter @resumeforge/${{ matrix.app }} build
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npx size-limit
      - run: npx lhci autorun   # CWV gates
      - run: pnpm audit --audit-level=high
```

## 10. Deployment + Observability
- Build each remote → upload hashed static assets to CDN; shell references versioned `remoteEntry.js` (manifest for canary/rollback).
- BFF (Fastify) container on edge/region: OIDC + AI proxy + CSP headers.
- Init Sentry in each app entry; send `web-vitals` to an analytics endpoint:
```ts
import { onLCP, onINP, onCLS } from 'web-vitals';
[onLCP, onINP, onCLS].forEach((f) => f((m) => navigator.sendBeacon('/rum', JSON.stringify(m))));
```

## 11. Verify
```bash
pnpm dev            # shell :3000 + editor :3001 (turbo parallel)
# open http://localhost:3000 -> /editor/demo loads the remote
pnpm build          # all remotes + shell build
pnpm test           # green, >= 90% coverage
```

## 12. Checklist
- [x] Monorepo + Rspack MF host/remote scaffold
- [x] Finalized deps from Tech-Stack installed
- [x] TS/ESLint/Prettier/Tailwind configured
- [x] Folder structure + sample slice
- [x] Routing + tokens + auth stub
- [x] Test harness with 90% thresholds
- [x] CI (lint+test+build+size+LHCI) + deployment/observability

## Next deliverable
→ [13-AI-Features.md](13-AI-Features.md)

