---
name: frontend-architecture
description: 'Knowledge pack for frontend architecture and senior system design: the full pattern ladder (Static Page, MVC, SPA, BFF, Modular Monolith, Micro-Frontend), rendering strategies (CSR/SSG/SSR/streaming/ISR/PPR), platform context (API Gateway, Load Balancing, Docker/K8s, CDN, Monorepo), cross-MFE concerns (shared singletons, event bus, independent deploy), state topology, and folder structure. Use when selecting an architecture or drawing system/module/data-flow diagrams.'
---

# Skill: Frontend Architecture

## When to use
Selecting an architecture, drawing system/module/data-flow diagrams, or justifying rendering and state decisions.

## Architecture patterns (decision guide)

| Pattern | Use when | Avoid when |
|---------|----------|-----------|
| **Static Page** | Marketing, docs, blogs; same for everyone | Personalized or interactive apps |
| **MVC (server-rendered)** | CRUD apps, SEO, simple mental model | App-like, highly interactive UX |
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
| ISR | Build + on-demand regen | Excellent | Fastest | Semi-dynamic (e-comm PDP) |
| PPR | Static shell + streamed holes | Excellent | Fastest | Static + dynamic mix |

> **Stack note (React + TS + Module Federation, no Next.js):** the app is **CSR SPA remotes**. SSR / RSC / ISR / PPR are framework-specific and **out of scope** here — adopt one only if you add a dedicated SEO-critical surface (then a separate SSR remote, using the framework you choose, not assumed).

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

## Senior system-design concepts (coverage map, tailored to React + TS + Micro-Frontend)

Know the full ladder **Static Page → MVC → SPA → BFF → Modular Monolith → Micro-Frontend**. For this stack the app is **CSR SPA remotes composed via Rspack Module Federation**.

### Platform context the frontend depends on
| Concept | What a senior FE must know | In this stack |
|---|---|---|
| **API Gateway** | central authN/z, rate limit, routing, TLS | browser talks only to the BFF; gateway fronts core services |
| **BFF (deep dive)** | product-aware backend per experience; shapes payloads, owns auth, caches (kills N+1) | one Web BFF; types shared via `packages/sdk` |
| **Load Balancing** | round-robin vs least-connections (WS/SSE), sticky, geo/latency | LB in front of BFF; least-conn for WebSocket presence |
| **Containers (Docker/K8s)** | image build, liveness/readiness probes, autoscaling | apps ship as static bundles; the BFF is containerized |
| **CDN** | edge-cache static + immutable assets | each remote's `remoteEntry.js` + chunks on CDN, `immutable` long-cache |
| **Monorepo** | shared tooling/types, task graph, remote cache | pnpm + Turborepo (`apps/*` + `packages/*`) |
| **Design System** | tokens + components package | `packages/ui` + `packages/tokens` (see `ui-ux-design-system`) |

### Cross-cutting concepts — where each lives
| Concept | Covered in |
|---|---|
| Critical Rendering Path, Critical CSS, HTTP caching, Content negotiation, Windowing, Bundle splitting, Rehydration/RSC | `web-performance-i18n` |
| Essential state model | State topology (above) |
| Discriminated-union (TT reducer) state | `coding-standards` rule |
| Polling / WebSocket / SSE data fetching, Generative UI, MCP UI | `ai-streaming-features` |
| Design-to-Code & MCP | `ui-ux-design-system` |
| MFE composition + shared singletons | this skill (below) |

### Cross-MFE concerns (MFE-specific senior knowledge)
- **Shared singletons:** `react`, `react-dom`, query client, i18n instance — `singleton: true, requiredVersion` to avoid duplicate React/context bugs.
- **Communication:** typed event bus / custom events; a remote **never** imports another remote.
- **Independent deploy:** versioned `remoteEntry.js` + a manifest the shell resolves; canary by swapping the manifest.
- **Isolation:** error boundary per remote mount; a failing remote degrades gracefully, never crashes the shell.

## Diagrams to always produce
1. System context. 2. Module/domain map. 3. Sequence diagram for one key flow. 4. Streaming/real-time path.

## Checklist
- [ ] Architecture matches team size, not hype.
- [ ] Rendering chosen per route with a reason.
- [ ] State kinds mapped to tools.
- [ ] Boundaries enforced by lint.
- [ ] Scalability path documented.
