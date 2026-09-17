---
name: web-performance-i18n
description: 'Knowledge pack for Core Web Vitals budgets (LCP/INP/CLS), critical rendering path, critical CSS, code splitting, HTTP caching, content negotiation, hydration/rehydration, windowing/virtualization, image/font strategy, measurement, plus internationalization (i18next/FormatJS, ICU, locale routing, RTL, Intl). Use when planning performance or multi-language support.'
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

## Critical Rendering Path
HTML→DOM, CSS→CSSOM, JS exec, Render Tree, Layout, Paint, Composite. Blocking any step delays first paint: inline critical CSS, defer non-critical JS, skeleton/stream the rest.

## Critical CSS
Inline above-the-fold CSS in `<head>`; lazy-load the rest (`critters`/`beasties`). One of the biggest LCP levers.

## HTTP caching & delivery
- Immutable hashed assets: `Cache-Control: public, max-age=31536000, immutable`.
- HTML + **remote manifest**: `no-cache` (revalidate) so new remote versions are picked up.
- Revalidation: `ETag` / `If-None-Match` → 304; `stale-while-revalidate` for cacheable JSON.
- **MFE:** cache each remote's chunks hard, but keep the manifest the shell reads revalidated.

## Content negotiation
Server varies on `Accept` (AVIF→WebP→JPEG), `Accept-Encoding` (br/gzip), `Accept-Language`, `Sec-CH-*` client hints — powers image format, compression, and i18n without client code. Add `Vary` accordingly.

## Rendering & hydration (this stack = CSR)
- **Rehydration** (attaching listeners to server HTML) only matters if you add SSR. CSR SPA remotes skip it — cost shifts to bundle parse/exec, so keep bundles small and code-split.
- **RSC / SSR / PPR** are framework-specific; out of scope for CSR MFE. Adopt only for a dedicated SEO surface.

## Windowing (virtualization)
Render only visible rows and recycle DOM nodes. **TanStack Virtual** for large inbox/report tables (100k rows at 60fps) — directly protects INP.

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
