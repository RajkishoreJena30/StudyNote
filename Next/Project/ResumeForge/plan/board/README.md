# ResumeForge — Delivery Plan Tracker (Board)

> An interactive, browsable UI for [`../06-Delivery-Plan.md`](../06-Delivery-Plan.md) — track progress sprint by sprint, story by story, task by task, without editing Markdown by hand. Framework-free HTML + shared design tokens + vanilla JS (no build step).

## How to open

From this folder:
```bash
python -m http.server 5174
# then open http://localhost:5174
```
Or use the VS Code **Live Server** extension on `index.html`.

## What's in it

- **Overview tab** — a card per sprint (goal, capacity, progress bar) + the epics list.
- **Sprint tabs (S1–S8)** — sprint goal/capacity header, then every story as an expandable card: user story, Given/When/Then acceptance criteria, dependencies, and a **checkable task list** (hours + day).
- **Backlog tab** — the flat Jira/TFS-import table from `06-Delivery-Plan.md` §15, with search + sprint/priority filters, a live status column, and an **Export CSV** button.

## Tracking progress

- Check off tasks inside a story card — a story is "Done" once all its tasks are checked.
- Progress persists **per-browser** in `localStorage` (key `resumeforge-plan-progress-v1`); it does not sync across devices or edit the Markdown file.
- **Reset progress** (top-right) clears all checked tasks on this device.
- The header, sprint cards, story cards, and backlog status column all update live as you check tasks.

## Keeping it in sync with the plan

This board's content lives in [`assets/data.js`](assets/data.js), transcribed from `06-Delivery-Plan.md`. If the delivery plan changes (new story, re-estimated task, re-sequenced sprint), update `data.js` to match — it is the single source of truth for the board.

## Files
- `index.html` — shell: header, tabs, panels (all content is rendered by JS).
- `assets/data.js` — the full backlog (epics, sprints, stories, tasks) as a JS data object.
- `assets/board.js` — rendering, progress persistence, filters, CSV export.
- `assets/board.css` — layout on top of the shared tokens in `../../UIUX/assets/tokens.css` (same palette as the product UI/UX reference).
