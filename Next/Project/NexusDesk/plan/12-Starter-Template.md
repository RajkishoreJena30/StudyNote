# Starter Template

> Copy-pasteable steps to a **working** NexusDesk skeleton: pnpm + Turborepo monorepo, Rspack **Module Federation** host + one remote, TypeScript, Tailwind tokens, testing, i18n, and CI. **No Next.js.**

## Table of Contents
1. [Prerequisites](#1-prerequisites)
2. [Scaffold the monorepo](#2-scaffold-the-monorepo)
3. [Shared packages](#3-shared-packages)
4. [Host + remote with Module Federation](#4-host--remote-with-module-federation)
5. [Tooling config](#5-tooling-config)
6. [Run & verify](#6-run--verify)
7. [CI](#7-ci)

---

## 1. Prerequisites
```bash
node -v   # >= 20
npm i -g pnpm
```

## 2. Scaffold the monorepo
```bash
mkdir nexusdesk && cd nexusdesk
pnpm init
pnpm add -D turbo typescript -w
printf 'packages:\n  - "apps/*"\n  - "packages/*"\n' > pnpm-workspace.yaml
mkdir -p apps packages
```
`turbo.json`:
```json
{ "$schema": "https://turbo.build/schema.json",
  "tasks": { "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] },
             "dev": { "cache": false, "persistent": true },
             "test": {}, "lint": {} } }
```
`tsconfig.base.json`: `strict`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`, path aliases `@nexusdesk/*`.

## 3. Shared packages
```bash
pnpm --filter . exec mkdir -p packages/ui/src packages/tokens/src packages/sdk/src packages/i18n/src packages/event-bus/src packages/config
```
- `packages/tokens` → exports the CSS vars from `05-UIUX-Design.md` + a Tailwind v4 preset.
- `packages/sdk` → typed API client + Zod contracts from `03-Architecture.md`.
- `packages/i18n` → the shared i18next instance from `10-Internationalization.md`.
- `packages/event-bus` → typed cross-MFE events. `packages/config` → eslint/ts/tailwind/vitest presets.

## 4. Host + remote with Module Federation
Install build tooling in `apps/shell` and `apps/mfe-inbox`:
```bash
pnpm --filter shell add react react-dom react-router @tanstack/react-query zustand
pnpm --filter shell add -D @rspack/core @rspack/cli @module-federation/enhanced
```
`apps/shell/rspack.config.ts` (host):
```ts
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
export default {
  plugins: [new ModuleFederationPlugin({
    name: 'shell',
    remotes: { inbox: 'inbox@http://localhost:3001/remoteEntry.js' },
    shared: {
      react: { singleton: true, requiredVersion: '^19' },
      'react-dom': { singleton: true, requiredVersion: '^19' },
      '@tanstack/react-query': { singleton: true },
      i18next: { singleton: true },
    },
  })],
};
```
`apps/mfe-inbox/rspack.config.ts` (remote):
```ts
import { ModuleFederationPlugin } from '@module-federation/enhanced/rspack';
export default {
  plugins: [new ModuleFederationPlugin({
    name: 'inbox', filename: 'remoteEntry.js',
    exposes: { './InboxApp': './src/InboxApp.tsx' },
    shared: { react: { singleton: true, requiredVersion: '^19' },
              'react-dom': { singleton: true, requiredVersion: '^19' } },
  })],
};
```
Host mounts the remote lazily:
```tsx
const InboxApp = React.lazy(() => import('inbox/InboxApp'));
// <Suspense fallback={<Skeleton/>}><ErrorBoundary><InboxApp/></ErrorBoundary></Suspense>
```

## 5. Tooling config
```bash
pnpm add -D -w eslint typescript-eslint prettier eslint-plugin-boundaries \
  vitest @testing-library/react jsdom msw @playwright/test @axe-core/playwright \
  tailwindcss @size-limit/preset-app size-limit i18next react-i18next i18next-icu zod \
  storybook chromatic style-dictionary @openfeature/web-sdk
```
- ESLint flat config extends `packages/config`; enable boundaries + i18n no-literal rules.
- `vitest.config.ts` with the ≥ 90% thresholds from `08-Testing-Strategy.md`.
- Tailwind v4 `@theme` importing `packages/tokens`.
- **Style Dictionary** builds `packages/tokens`; **Storybook** hosts the design system; **OpenFeature** provider wired in the shell.

## 6. Run & verify
```bash
pnpm --filter mfe-inbox dev   # serves remoteEntry.js on :3001
pnpm --filter shell dev       # host on :3000, loads the remote
pnpm test                     # vitest, coverage gate
pnpm exec playwright test      # E2E
pnpm build                     # turbo build all apps
```
**Definition of working:** shell on :3000 renders and lazy-loads the inbox remote; tests pass; `pnpm build` succeeds.

## 7. CI
`.github/workflows/ci.yml` runs on PR: `pnpm install --frozen-lockfile` → lint → typecheck → `pnpm test` (coverage gate) → `pnpm size-limit` → Playwright (sharded) → Lighthouse CI. Deploy each app to its own CDN path with a versioned `remoteEntry.js` and update the remote manifest the shell reads.

## Checklist
- [x] Monorepo + Turborepo
- [x] Rspack MF host + remote with shared singletons
- [x] Tooling (TS/ESLint/Tailwind/tests/i18n)
- [x] Run/verify steps + CI

## Next deliverable
→ [13-AI-Features.md](13-AI-Features.md)

