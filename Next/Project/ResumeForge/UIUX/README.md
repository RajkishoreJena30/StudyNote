# ResumeForge — UI/UX Static Reference

> A framework-free, browsable prototype of ResumeForge for developers. It mirrors the tokens, IA, and top screens from [`../plan/05-UIUX-Design.md`](../plan/05-UIUX-Design.md). **Reference only — not shippable code.**

## How to open
From this folder:
```bash
python -m http.server 5173
# then open http://localhost:5173
```
Or use the VS Code **Live Server** extension on `index.html`.

## Screens
| File | Screen |
|------|--------|
| `index.html` | Landing + screen directory |
| `login.html` | Auth (OIDC/PKCE via BFF) |
| `dashboard.html` | Resume list + import dropzone |
| `editor.html` | **Hero** — 3-pane editor with AI streaming demo |
| `templates.html` | Template gallery (virtualized look) |
| `account.html` | Plans, billing, i18n, usage |

## Interactions to try
- **AI streaming (hero):** on `editor.html`, click **Improve with AI** → tokens stream in with a blinking caret; **Stop** preserves the partial text; **Accept** shows the applied note. Mirrors the SSE contract in [`../plan/13-AI-Features.md`](../plan/13-AI-Features.md).
- **Theme toggle:** dark is default; toggle persists to `localStorage`.
- **Command palette:** press `Ctrl/Cmd + K` (focus trap + Esc to close, focus restored).
- **RTL preview:** “RTL preview” button on `editor.html` / `account.html` flips `dir`/`lang` (Arabic).
- **Reduced motion:** with OS “reduce motion” on, the caret doesn’t blink and text reveals instantly.

## Files
- `assets/tokens.css` — design tokens (CSS vars) + base component classes, light/dark via `data-theme`.
- `assets/app.js` — theme toggle, rAF streaming demo, command palette, RTL toggle.

## Maps back to the plan
- Tokens → [`../plan/05-UIUX-Design.md`](../plan/05-UIUX-Design.md)
- Screens/flows → [`../plan/04-Product-Spec.md`](../plan/04-Product-Spec.md)
- Streaming behaviour → [`../plan/13-AI-Features.md`](../plan/13-AI-Features.md)
- Accessibility → WCAG 2.2 AA checklist in `05-UIUX-Design.md`

