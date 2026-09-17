---
name: static-ui-reference
description: 'Knowledge pack for building a framework-free static UI/UX reference site (plain HTML + Tailwind CDN + shared CSS tokens + shared JS) that turns a design system and screen inventory into a browsable prototype for developers. Use when generating <Project>/UIUX/ as a visual + interaction reference.'
---

# Skill: Static UI/UX Reference Site

## Purpose
Turn `05-UIUX-Design.md` (tokens, IA, component taxonomy) and `04-Product-Spec.md` (screens, flows, states) into a **browsable static prototype** developers reference during implementation. It is not shippable code and must not depend on any framework.

## Tech constraints
- Plain HTML per page + Tailwind via CDN + one shared `assets/tokens.css` + one shared `assets/app.js`.
- No build step, no `node_modules`, no bundler. Opens by double-clicking or via any static server.
- Google Fonts CDN for Inter + JetBrains Mono.

## File layout (mandatory)
```
<Project>/UIUX/
  index.html            # landing page linking every screen
  login.html            # auth screen
  <hero>.html           # the product hero screen (e.g., inbox.html)
  <domain>.html * 3-4   # one per top domain from the sitemap
  assets/
    tokens.css          # design tokens + base component classes
    app.js              # theme toggle, streaming demo, cmd palette, drawer
  README.md             # how to open + interactions + mapping to plan docs
```

## `tokens.css` must include
- Design tokens as CSS custom properties on `:root` (light) and `[data-theme="dark"]` (dark).
- Base component classes: `.btn`, `.btn-primary|secondary|ghost|danger`, `.input/.textarea/.select`, `.badge` + semantic variants, `.card`, `.nav-item`, `.tbl`, `.skeleton` (shimmer keyframes), `.stream-caret` (blinking caret keyframes), `.bubble-*` (chat).
- Visible focus rings via `:focus-visible` on all interactive elements.
- `@media (prefers-reduced-motion: reduce)` disabling animations.

## `app.js` must include
- Theme toggle (persist in `localStorage`, apply via `data-theme` on `<html>`).
- **Streaming demo:** a click handler that appends a preset draft token-by-token into a target element (~15-25ms/char), showing `.stream-caret`. A **Stop** button aborts and leaves the partial text (matches SSE cancel semantics).
- Command palette overlay (open on `Ctrl/Cmd+K`, close on `Escape`).
- Drawer open/close via `[data-action="open-drawer"]` + `[data-action="close-drawer"]`.

## Shell every screen (except `login.html`) reuses
- Top bar: brand, tenant switcher, global search/command trigger, locale switch, theme toggle, profile avatar.
- Left nav rail: icon + label per domain; active item uses the primary accent.
- Right contextual panel where relevant (details / AI copilot).

## Every data screen must show
Loading (skeleton), empty, error (retry), and populated. The AI surface additionally shows idle / streaming / cancelled / failed.

## Accessibility (WCAG 2.2 AA)
- One `<h1>` per page, semantic `<nav>/<main>/<aside>`, labels on every input.
- Focus trap in modals / command palette; `Escape` closes them.
- `aria-live="polite"` region announces streaming status.
- Target size >= 24px. Never signal by color alone.
- Include one screen showing RTL (`dir="rtl"` + logical CSS) for the multi-locale project.

## Deliverable checklist
- [ ] `index.html` links every screen.
- [ ] Each screen loads `tokens.css` + `app.js` and uses the shared shell.
- [ ] Tokens match `05-UIUX-Design.md` exactly (hex, type scale, spacing).
- [ ] Hero screen has a working streaming caret + Stop.
- [ ] One screen has an RTL preview.
- [ ] `README.md` explains how to open + maps back to plan docs.
