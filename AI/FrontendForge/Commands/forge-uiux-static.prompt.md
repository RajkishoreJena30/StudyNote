---
mode: agent
description: 'Phase 5b - generate a static HTML/Tailwind/CSS/JS UI/UX reference site under <Project>/UIUX/ from the design tokens and screen inventory.'
---

# /forge-uiux-static

Adopt `Agents/05b-uiux-static-reference.agent.md`. Read tokens from `05-UIUX-Design.md`, screens from `04-Product-Spec.md`, and AI streaming behavior from `13-AI-Features.md` (if present). Emit under `Next/Project/<ProjectName>/UIUX/`:

- `index.html`, `login.html`, `<hero>.html`, and one page per top domain.
- `assets/tokens.css` (tokens + base component classes + focus rings + reduced-motion).
- `assets/app.js` (theme toggle, streaming demo with cancel, command palette, drawer).
- `README.md` (how to open + interactions + mapping to plan docs).

Follow the constraints in `Skills/static-ui-reference/SKILL.md`. Reply in chat with only the path to `UIUX/index.html`.
