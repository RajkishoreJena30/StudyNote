---
description: 'Auto-generates a static HTML/Tailwind/CSS/JS UI/UX reference site under <Project>/UIUX/. Runs right after UI/UX Design (Phase 5b) so tokens, IA, component taxonomy, and top screens are turned into a browsable static prototype developers can use as a visual/interaction reference before implementation.'
tools: ['codebase', 'search', 'editFiles', 'runCommands']
---

# 05b - UI/UX Static Reference Generator

Produce a **working, browsable static prototype** of the chosen project under `<Project>/UIUX/` that mirrors the tokens and screens defined in `05-UIUX-Design.md` and `04-Product-Spec.md`. This is a **reference for developers**, not shippable code.

## Read first
- Skill: `Skills/static-ui-reference/SKILL.md`
- Prior deliverables: `04-Product-Spec.md`, `05-UIUX-Design.md`, `13-AI-Features.md` (if the project has an AI streaming surface).

## Always emit (no need to be asked)
1. `<Project>/UIUX/index.html` - landing page linking every screen.
2. `<Project>/UIUX/<screen>.html` - one file per top screen from the sitemap in `04-Product-Spec.md` (Login + at least the top 3-4 domains, e.g. Inbox/Analytics/Knowledge/Admin, plus the hero screen).
3. `<Project>/UIUX/assets/tokens.css` - the tokens from `05-UIUX-Design.md` as CSS custom properties + light/dark via `data-theme`, plus base component classes (buttons, badges, table, skeleton, streaming caret).
4. `<Project>/UIUX/assets/app.js` - theme toggle, streaming-demo (token-by-token append with rAF, cancel), command palette (Ctrl/Cmd+K), drawer helpers.
5. `<Project>/UIUX/README.md` - how to open (`python -m http.server` / Live Server), interactions to try, mapping back to plan docs.

## Constraints
- **Tech:** plain HTML + Tailwind (CDN) + one shared CSS token file + one shared JS file. No build step, no framework, no `node_modules`.
- **Fidelity:** tokens must match `05-UIUX-Design.md` exactly (colors, type scale, spacing, radius, shadows). Dark theme is default.
- **Accessibility (WCAG 2.2 AA):** visible focus rings, semantic landmarks, `aria-live="polite"` for the streaming AI area, keyboard-operable everything, respect `prefers-reduced-motion`.
- **RTL:** include one RTL preview (an Arabic locale variant) on a locale-aware screen (e.g., the KB editor).
- **AI streaming demo:** if the project has an AI feature (per `13-AI-Features.md`), the hero screen must include a working token-by-token streaming demo with a **Stop** button that preserves the partial text - same behavior spec'd for SSE.
- **Do not** import React/Vue/Angular here; the whole point is a framework-free reference.
- **Do not** overwrite an existing `<Project>/UIUX/` without confirming.

## Output location
`Next/Project/<ProjectName>/UIUX/`

## Success gate (post-phase)
- `index.html`, at least 4 screen pages, `assets/tokens.css`, `assets/app.js`, and `README.md` all exist and are non-empty.
- Every screen page references `assets/tokens.css` + `assets/app.js`.
- The hero screen includes the streaming caret + Stop control.

## Chat output
One line: path to `UIUX/index.html`.
