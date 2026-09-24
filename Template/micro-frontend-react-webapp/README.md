# ResumeForge — Frontend Web App (Starter)

> A working Rspack Module-Federation monorepo: a **shell** host (`:3000`) that loads an **editor** micro-frontend (`:3001`) at runtime. This is the MVP slice generated from [`../plan/12-Starter-Template.md`](../plan/12-Starter-Template.md) — see that doc for the full step-by-step rationale, and [`../plan/06-Delivery-Plan.md`](../plan/06-Delivery-Plan.md) for what gets built next (Sprints 2+).

## Prerequisites

| Tool | Version | Check |
|------|---------|-------|
| Node.js | >= 20 | `node -v` |
| pnpm | via Corepack (no separate install) | `corepack enable` |

Works identically on Windows, macOS, and Linux — every command below is plain `node`/`pnpm`, no OS-specific shell syntax.

```bash
node -v
corepack enable
corepack prepare pnpm@9.12.0 --activate
```

## Setup

From this folder (`frontend-webapp/`):

```bash
pnpm install
```

This installs everything for all 4 workspace packages (`shell`, `editor`, `contracts`, `ui`) in one step — every `package.json` already declares its own dependencies.

## Run it

```bash
pnpm dev
```

- Shell (host): **http://localhost:3000**
- Editor (remote, standalone preview): **http://localhost:3001**

Open the shell, click **Editor** in the nav — it loads the `EditorApp` component live from the editor's dev server via Module Federation. Type in the **Summary** field and watch the **Live preview** update below it (backed by a shared Zustand store).

> If the shell shows "Could not load the editor remote", the editor dev server isn't running — `pnpm dev` starts both via Turborepo; if you started only the shell, also run `pnpm --filter @resumeforge/editor dev` in a second terminal.

## Other commands

```bash
pnpm build       # production build of both apps -> apps/*/dist
pnpm test        # vitest unit tests for both apps
pnpm typecheck   # tsc --noEmit for both apps
pnpm lint        # eslint for both apps
```

Run everything at once (what CI does):

```bash
pnpm exec turbo run build test typecheck lint
```

## Project structure

```text
frontend-webapp/
├─ packages/
│  ├─ contracts/   # @resumeforge/contracts — Zod schemas (ResumeDoc, ResumePatch)
│  └─ ui/          # @resumeforge/ui — shared design tokens + <Button>
└─ apps/
   ├─ shell/        # HOST — http://localhost:3000
   └─ editor/       # REMOTE — http://localhost:3001
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| Port 3000 or 3001 already in use | Stop the other process, or change `devServer.port` in the relevant `apps/*/rspack.config.mjs`. |
| CORS error fetching `remoteEntry.js` | Confirm `devServer.headers['Access-Control-Allow-Origin']` is present in `apps/editor/rspack.config.mjs`. |
| `RuntimeError: factory is undefined (webpack/sharing/consume/...)` | Don't add `eager: true` to shared `react`/`react-dom` — the async `index.ts → bootstrap.tsx` entry boundary already handles initialization order; combining both crashes the app (confirmed by testing). |
| Long path / `ENAMETOOLONG` errors on Windows | Keep the repo closer to the drive root (e.g. `C:\dev\...`) — deep `node_modules` nesting can exceed Windows' path-length limit. |

More detail (including *why* each config choice was made) is in [`../plan/12-Starter-Template.md`](../plan/12-Starter-Template.md).
