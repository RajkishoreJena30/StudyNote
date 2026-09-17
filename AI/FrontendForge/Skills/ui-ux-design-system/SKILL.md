---
name: ui-ux-design-system
description: 'Knowledge pack for building a design system: information architecture, color scales, typography, spacing, design tokens, component taxonomy, states, motion, and WCAG 2.2 AA accessibility. Use when defining UI/UX or design tokens.'
---

# Skill: UI/UX & Design System

## When to use
Defining information architecture, color/typography systems, tokens, component libraries, or accessibility rules.

## Color system
- Build **scales** (50–900) for primary, neutral, and semantic (success/warning/error/info).
- Provide **light + dark** themes as token aliases (`--color-bg`, `--color-fg`, `--color-primary`).
- Verify contrast: text ≥ 4.5:1, large text/UI ≥ 3:1 (WCAG 2.2 AA).

## Typography
- Choose 1 display + 1 body font with system fallbacks.
- Type scale (rem): 0.75 / 0.875 / 1 / 1.125 / 1.25 / 1.5 / 1.875 / 2.25 / 3.
- Set line-heights (1.2 headings, 1.5 body) and weights.

## Spacing & layout
- Base unit 4px; scale 4/8/12/16/24/32/48/64.
- Breakpoints: 640 / 768 / 1024 / 1280 / 1536.
- Radius, shadow, z-index scales as tokens.

## Design tokens (deliverable format)
Emit copy-pasteable CSS custom properties:

```css
:root {
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px;  --space-4: 16px;
  --radius-sm: 4px; --radius-md: 8px; --radius-lg: 16px;
  --color-primary-500: #4f46e5;
  --font-body: "Inter", system-ui, sans-serif;
}
```

## Component taxonomy (atomic)
- **Atoms:** button, input, badge, icon, text.
- **Molecules:** field (label+input+error), card, menu item.
- **Organisms:** form, table, nav bar, modal.
- Each component documents states: default / hover / focus-visible / active / disabled / loading / error / empty.

## Motion
- Durations 100/200/300ms; easing `cubic-bezier(0.4,0,0.2,1)`.
- Respect `prefers-reduced-motion`.

## Accessibility (WCAG 2.2 AA checklist)
- [ ] Semantic HTML first, ARIA only when needed.
- [ ] Visible focus states, logical tab order.
- [ ] Keyboard operable (all interactive elements).
- [ ] Labels + error messaging on every field.
- [ ] Color not the only signal.
- [ ] `prefers-reduced-motion` and `prefers-contrast` honored.
- [ ] Target sizes ≥ 24px (2.2 requirement).

## Design-to-Code & MCP
- **Token pipeline:** Figma variables → design tokens (Style Dictionary) → CSS vars / Tailwind theme in `packages/tokens`.
- **MCP servers:** Figma Dev Mode MCP + Storybook MCP let coding agents read frames, tokens, and component APIs to draft components.
- **Feedback loop:** Figma → MCP → agent → PR → visual regression (Chromatic/Playwright) → human review.
- **Tools:** v0 / Builder.io Visual Copilot for first-draft components; always refactor into design-system primitives — never ship raw generated markup.

## Deliverable must include
IA/sitemap diagram, color + type + spacing tables, full token block, component list with states.
