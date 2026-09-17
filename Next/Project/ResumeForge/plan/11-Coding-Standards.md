# ResumeForge — Coding Standards

> Conventions for a TypeScript Module-Federation monorepo: naming, structure, TS strictness, lint/format, commits, error handling.

## Table of Contents
1. [Naming & File Conventions](#1-naming--file-conventions)
2. [Component Structure](#2-component-structure)
3. [Import Order](#3-import-order)
4. [TypeScript Rules](#4-typescript-rules)
5. [ESLint + Prettier](#5-eslint--prettier)
6. [Micro-Frontend Rules](#6-micro-frontend-rules)
7. [Commits & Branching](#7-commits--branching)
8. [Error Handling & Logging](#8-error-handling--logging)
9. [PR Checklist](#9-pr-checklist)
10. [Checklist](#10-checklist)

---

## 1. Naming & File Conventions
| Thing | Convention | Example |
|-------|-----------|---------|
| Component file | PascalCase.tsx | `AssistantPanel.tsx` |
| Hook | `useX.ts` camelCase | `useSSE.ts` |
| Util/module | camelCase.ts | `applyPatch.ts` |
| Type/interface | PascalCase | `ResumeDoc`, `SSEEvent` |
| Constant | UPPER_SNAKE | `MAX_AI_PER_DAY` |
| Test | `*.test.ts(x)` colocated | `useSSE.test.ts` |
| Remote package | `@resumeforge/<name>` | `@resumeforge/editor` |

Folders are feature-sliced (see [03-Architecture.md](03-Architecture.md#11-folder-structure-concrete-tree)); no barrel `index.ts` that hides cyclic deps across remotes.

## 2. Component Structure
Order inside a component: types/props → hooks → derived state → handlers → early returns (loading/error/empty) → JSX. One component per file; keep < ~150 lines, extract when larger.

## 3. Import Order
1. node/react, 2. third-party, 3. `@resumeforge/*` shared packages, 4. relative — enforced by `eslint-plugin-import` with blank lines between groups.

## 4. TypeScript Rules
- `strict: true`, `noUncheckedIndexedAccess`, `exactOptionalPropertyTypes`.
- **No `any`** (`@typescript-eslint/no-explicit-any: error`); use `unknown` + Zod parse at boundaries.
- Discriminated unions for `SSEEvent`, resume `Section`; **exhaustive `switch`** with `assertNever`.
- Types cross remotes only via `@resumeforge/contracts` — never import another remote's internal types.
- Prefer `type` for unions/props; `interface` for extendable public contracts.

## 5. ESLint + Prettier
```js
// eslint.config.mjs (flat)
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
export default tseslint.config(
  js.configs.recommended,
  ...tseslint.configs.recommendedTypeChecked,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/switch-exhaustiveness-check': 'error',
      'no-restricted-imports': ['error', { patterns: ['@resumeforge/*/src/*'] }], // no deep remote imports
    },
  },
);
```
Prettier: 2-space, single quotes, trailing commas, 100 print width. Format on save + `lint-staged` pre-commit.

## 6. Micro-Frontend Rules
- Shared deps (react, router, query, i18n, zustand) declared `singleton` in every `rspack.config.ts` with aligned ranges.
- Remotes expose only their public module(s) via MF `exposes`; internals stay private.
- Cross-remote communication only via shared store + typed event bus + `@resumeforge/contracts` — never direct DOM/global reach-in.
- Every lazy remote is wrapped in an error boundary + Suspense fallback.

## 7. Commits & Branching
- **Conventional Commits**: `feat(editor): stream suggestions`, `fix(assistant): stop preserves partial`.
- Trunk-based: short-lived `feat/*` branches → PR → squash-merge to `main`.
- `commitlint` + Husky enforce format; changesets for per-remote versioning.

## 8. Error Handling & Logging
- Parse all external data with Zod at the boundary; fail closed.
- User-facing errors via toasts/error boundaries; never leak stack traces.
- `Result`-style returns for expected failures; throw only for programmer errors.
- Sentry captures with correlation id; **never log PII or tokens**.

## 9. PR Checklist
- [ ] Types strict, no `any`, exhaustive switches
- [ ] Unit + E2E tests added; coverage ≥ 90% for touched files
- [ ] a11y (axe) clean; keyboard operable
- [ ] i18n keys added (no hardcoded strings)
- [ ] No deep cross-remote imports; contracts used
- [ ] Perf budget respected (size-limit)
- [ ] Conventional Commit + changeset

## 10. Checklist
- [x] Naming/file/import conventions
- [x] TS strictness + no-any + exhaustive unions
- [x] ESLint flat config + Prettier
- [x] MFE-specific rules
- [x] Commit + branch strategy
- [x] Error/logging conventions + PR checklist

## Next deliverable
→ [12-Starter-Template.md](12-Starter-Template.md)

