---
name: frontend-architecture
description: 'Knowledge pack for choosing and designing frontend architecture: SPA, Modular Monolith, Micro-Frontend, BFF, rendering strategies (CSR/SSG/SSR/streaming/PPR), state topology, and folder structure. Use when selecting an architecture or drawing system/module/data-flow diagrams.'
---

# Skill: Frontend Architecture

## When to use
Selecting an architecture, drawing system/module/data-flow diagrams, or justifying rendering and state decisions.

## Architecture patterns (decision guide)

| Pattern | Use when | Avoid when |
|---------|----------|-----------|
| **SPA** | App-like UX, single team, internal tools | SEO-critical, huge teams |
| **SPA + BFF** | Multiple clients, need payload shaping | Tiny app, no backend team |
| **Modular Monolith** | 1–4 teams, want MFE discipline without ops cost | 50+ engineers needing independent deploys |
| **Micro-Frontend** | 4+ autonomous teams, independent deploys | < 20 devs (coordination cost > benefit) |

> Default recommendation for a solo senior dev: **Modular Monolith** with strict feature-sliced boundaries — it can be split into MFEs later.

## Rendering strategies

| Strategy | HTML built | SEO | TTFB | Use for |
|----------|-----------|-----|------|---------|
| CSR | Browser | Poor | Fast shell | Dashboards, internal apps |
| SSG | Build time | Excellent | Fastest | Marketing, docs |
| SSR | Per request | Excellent | Slower | Personalized public pages |
| Streaming SSR | Per request, streamed | Excellent | Fast | Content + dynamic mix |

## State topology (classify before choosing a library)

| Kind | Example | Tool |
|------|---------|------|
| Server | user, products | TanStack Query / SWR / RTK Query |
| URL | filters, page | router search params |
| Form | draft input | React Hook Form / stack-native |
| UI | modal open | local component state |
| Global | theme, auth | Zustand / Redux Toolkit / signals |

**Rule:** never put server state in a global client store.

## Folder structure (feature-sliced default)

```
src/
  app/            # composition root, providers, router
  features/       # vertical slices: ui + model + api + tests
    <feature>/
      ui/
      model/      # state, hooks
      api/        # data access
      index.ts    # public API of the slice
  entities/       # shared business objects
  shared/         # ui-kit, lib, config, types
```

Enforce boundaries with `eslint-plugin-boundaries` — slices import only via `index.ts`.

## Diagrams to always produce
1. System context. 2. Module/domain map. 3. Sequence diagram for one key flow. 4. Streaming/real-time path.

## Checklist
- [ ] Architecture matches team size, not hype.
- [ ] Rendering chosen per route with a reason.
- [ ] State kinds mapped to tools.
- [ ] Boundaries enforced by lint.
- [ ] Scalability path documented.
