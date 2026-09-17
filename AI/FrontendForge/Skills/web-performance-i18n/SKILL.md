---
name: web-performance-i18n
description: 'Knowledge pack for Core Web Vitals performance budgets (LCP/INP/CLS), code splitting, image/font strategy, measurement, plus internationalization (i18next/FormatJS, ICU, locale routing, RTL, Intl formatting). Use when planning performance or multi-language support.'
---

# Skill: Web Performance & i18n

## Core Web Vitals targets (p75)
| Metric | Good | Measures |
|--------|------|----------|
| LCP | ≤ 2.5s | loading |
| INP | ≤ 200ms | interactivity |
| CLS | ≤ 0.1 | visual stability |

## Performance levers
- **LCP:** preload hero image/font, SSR/streaming, avoid render-blocking JS.
- **INP:** break long tasks (`scheduler.yield()`), reduce hydration, `useDeferredValue`/transitions.
- **CLS:** reserve space (width/height, `aspect-ratio`), no content injection above the fold.
- **Bundle:** route + component code splitting, lazy-load anything > ~30KB gz not above the fold.
- **Images:** modern formats (AVIF/WebP), responsive `srcset`, lazy below the fold.
- **Fonts:** `font-display: swap`, preload, subset.
- **Runtime:** virtualization for long lists, memoize hot paths.

## Performance budget (example, per route)
| Asset | Budget (gz) |
|-------|-------------|
| JS | ≤ 170 KB |
| CSS | ≤ 60 KB |
| Images (above fold) | ≤ 200 KB |

## Measurement
- `web-vitals` lib → RUM (Sentry / analytics).
- Lighthouse CI in the pipeline; `size-limit` for bundle gate.

## i18n patterns
- **Library:** i18next (React/Vue) or FormatJS/react-intl; Angular i18n for Angular.
- **Keys & namespaces:** feature-scoped namespaces, no hard-coded strings.
- **ICU MessageFormat:** plurals, gender, select, nested.
- **Locale routing:** subpath (`/en`, `/fr`) is the safest default for SEO.
- **RTL:** logical CSS properties (`margin-inline`), `dir` attribute.
- **Formatting:** always use `Intl.NumberFormat` / `Intl.DateTimeFormat` — never hand-format.
- **Workflow:** extract → TMS → import; fallback locale; missing-key reporter in CI.
- **Testing:** pseudo-localization to catch truncation and hard-coded strings.

## Deliverables
- `09-Performance.md`: targets, budget table, levers, measurement, CI gate, CRP diagram.
- `10-Internationalization.md`: library setup, key strategy, locale routing, RTL, formatting, workflow, testing, locale-resolution diagram.
