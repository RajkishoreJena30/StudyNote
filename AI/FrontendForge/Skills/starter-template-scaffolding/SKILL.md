---
name: starter-template-scaffolding
description: 'Knowledge pack for producing a starter-template deliverable that a beginner can actually run. Covers the cross-platform Node.js scaffold-script pattern, complete Module Federation config, the index.ts→bootstrap.tsx entry-point convention, Turborepo v2 config, and the "verify by actually running" discipline. Use when building 12-Starter-Template.md or any hand-off starter scaffold.'
---

# Skill: Starter-Template Scaffolding (verified, OS-independent)

> **Non-negotiable rule:** a starter-template deliverable is not done when it "looks right" — it is done when it has been **actually scaffolded and run** (install → build → test → typecheck → lint → dev server → clicked through in a browser if there's a UI) in this session, and every bug that surfaced was fixed in the doc. A template that was only reviewed on paper fails this skill's bar.

## Delivery mechanism: one cross-platform Node.js script
- Ship the starter as a **single `create-<project>.mjs` script** using only `node:fs`/`node:path` — no `mkdir -p`, `printf`, `&&`-chains, or other POSIX-only shell syntax anywhere in the guide.
- The script writes **every** file needed to run: root + per-app/package `package.json`s (never leave these as a manual `pnpm add` afterthought), build configs, TS configs, source files, and at least one test per app.
- After scaffolding, the only commands a reader runs are `pnpm install` then `pnpm dev` / `pnpm build` / `pnpm test`.

## Module Federation config checklist (both host and remote)
- Remote: `output.uniqueName`, `ModuleFederationPlugin.filename: 'remoteEntry.js'` (omitting this is the most common "incomplete MF config" bug), `exposes`, and `devServer.headers['Access-Control-Allow-Origin']` for dev CORS.
- Host: `remotes.<name>` pointing at the remote's dev URL (env-var override for prod), `shared` singletons for every cross-app library, and an `HtmlRspackPlugin`/equivalent — without it nothing mounts.
- **Do not combine `eager: true` on shared singletons with an async-boundary entry** (`index.ts` that does `import('./bootstrap')`). Verified: this combination throws `RuntimeError: factory is undefined (webpack/sharing/consume/default/...)` at runtime in the browser. Pick the async boundary; don't also mark shared deps eager.
- Config file extension: if the package sets `"type": "module"`, name the bundler config `*.config.mjs`, not `.ts` — Node's own ESM loader tries to `import()` a `.ts` config directly and throws `ERR_UNKNOWN_FILE_EXTENSION` before the bundler's own TS loader runs.

## Entry-point convention (use for every app, host and remote)
1. `src/index.ts` — no JSX, only `import('./bootstrap');`. The async boundary lets MF negotiate shared singletons before component code runs.
2. `src/bootstrap.tsx` — has JSX, mounts the app for standalone/dev preview.
3. Remote only: the exposed component lives in its **own file** (e.g. `EditorApp.tsx`), never in `bootstrap.tsx` — that file is the one and only thing listed in `exposes`.

## Turborepo config
- Use the **v2 `"tasks"` key**, not the deprecated v1 `"pipeline"` key.
- `dev` needs `{ "cache": false, "persistent": true }` or `turbo run dev --parallel` exits immediately.
- `build` needs `dependsOn: ["^build"]` so workspace-package dependents build first.
- `test`/`lint`/`typecheck` declare `"outputs": []` so results can still be cached without build artifacts.

## Testing a Module-Federation host in isolation
- Vitest/Vite cannot statically resolve a runtime-only MF module id (e.g. `editor/EditorApp`) — `vi.mock()` is too late because the import-analysis/transform step fails first. Fix with a `resolve.alias` in `vitest.config.ts` pointing the MF module id at a local stub component.
- Add ambient `@testing-library/jest-dom` matcher types to each app's `tsconfig.json` `"types"` array, or `tsc --noEmit` fails on `toBeInTheDocument`/`toHaveTextContent` even though the tests themselves pass at runtime.
- A shared UI package consumed by an app needs its own `@types/react` devDependency, or `tsc` fails to resolve JSX/react types when it follows the package's source-mapped `"types"` field into another workspace package.
- Prefer `data-testid` over `getByText` when a value could plausibly render in more than one place (e.g. an input's value and a live-preview echo of that same value) — ambiguous text queries throw at runtime, not just in theory.
- ESLint flat config needs an explicit `languageOptions.globals` override (e.g. `{ process: 'readonly' }`) for Node-executed config files like `*.config.mjs` — the default `js.configs.recommended` assumes browser/ES globals only.

## Verification loop (always run before shipping the doc)
1. Extract/scaffold into a scratch or real target folder.
2. `pnpm install` → must complete without manual intervention.
3. `pnpm build`, `pnpm test`, `pnpm typecheck`, `pnpm lint` → all green.
4. If there's a dev server / UI, `pnpm dev` and open it in a browser; click through the primary flow (e.g. host → federated remote) and confirm no runtime error overlay.
5. Any failure found during 2–4 is a bug in the **doc**, not just the test environment — fix the source-of-truth script/config in the deliverable, then re-run the whole loop from step 1 on a clean extraction to confirm the fix actually took.

## Deliverable must include
The scaffold script (or equivalent numbered copy-paste steps), a Module Federation section covering the checklist above, the entry-point convention explained, the Turborepo config explained, a folder tree, CI matching the apps actually scaffolded (not aspirational future apps), a Verify section with concrete pass/fail criteria, and an OS-specific troubleshooting table.
