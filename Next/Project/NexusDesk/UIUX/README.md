# NexusDesk - UI/UX Static Reference

Plain HTML + Tailwind (CDN) + one shared CSS token file. This is a **visual/interaction reference** for the real React + TypeScript + Rspack Module Federation app. Match tokens, layouts, and interaction patterns against these files.

## Contents

| File | Purpose |
|------|---------|
| `index.html` | Landing page with links to every screen |
| `login.html` | Auth (OIDC SSO + email fallback) |
| `inbox.html` | Hero: 3-pane workspace + streaming AI copilot |
| `analytics.html` | KPI tiles, area + bar charts, agent table, SLA alert |
| `knowledge.html` | Article editor with locale variants + RTL preview |
| `admin.html` | Users/RBAC table, feature flags, plan cards, invite drawer |
| `assets/tokens.css` | Design tokens (light + dark), buttons, badges, table, skeleton, streaming caret |
| `assets/app.js` | Theme toggle, streaming demo, command palette, drawer |

## How to open
- Double-click `index.html` **or** run a tiny server so relative paths work everywhere:

```powershell
# from repo root
cd Next/Project/NexusDesk/UIUX
python -m http.server 5173
# open http://localhost:5173/
```

Or in VS Code, right-click `index.html` -> "Open with Live Server".

## Interactions to try
- Click any nav item; press `Ctrl/Cmd + K` for the command palette.
- On `inbox.html`, click **Suggest reply** to see the AI draft **stream token-by-token** into the composer; **Stop** cancels mid-stream (partial text kept - matches the spec).
- Click **Theme** in any top bar to toggle dark/light.
- On `admin.html`, click **+ Invite user** for the slide-over drawer.
- On `knowledge.html`, see the RTL preview panel.

## Mapping to plan docs
- Tokens/colors/type/spacing -> [../plan/05-UIUX-Design.md](../plan/05-UIUX-Design.md)
- Inbox + copilot behavior -> [../plan/04-Product-Spec.md](../plan/04-Product-Spec.md) + [../plan/13-AI-Features.md](../plan/13-AI-Features.md)
- Streaming pattern (SSE) -> [../plan/13-AI-Features.md](../plan/13-AI-Features.md)
- RBAC + plans -> [../plan/04-Product-Spec.md](../plan/04-Product-Spec.md) (Part A - L) + [../plan/07-Security-Auth.md](../plan/07-Security-Auth.md)
- i18n / RTL -> [../plan/10-Internationalization.md](../plan/10-Internationalization.md)

## Notes / limits
- Tailwind is loaded from the CDN for zero-setup viewing. In production, use Tailwind v4 `@theme` importing `packages/tokens` (see plan/12).
- Charts are hand-drawn SVGs for reference only - the real app uses visx/Recharts.
- Icons are Unicode glyphs; real app uses an icon set (Lucide/Radix).
- All content is placeholder; layouts, states, and tokens are the reference.
