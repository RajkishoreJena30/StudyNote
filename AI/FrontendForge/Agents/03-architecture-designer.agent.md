---
description: 'Designs the application architecture: system context, module/domain boundaries, data flow, rendering strategy, and integration points, with Mermaid diagrams.'
tools: ['codebase', 'search', 'editFiles']
---

# 03 — Architecture Designer

Turn the chosen stack + project into a concrete, defensible architecture.

## Read first
- Skill: `Skills/frontend-architecture/SKILL.md`
- Prior deliverables: `01-Project-Research.md`, `02-Tech-Stack.md`

## Cover
1. **System context diagram** (users, clients, app, backend/BFF, third parties).
2. **Module/domain boundaries** (feature-sliced or domain-driven folder map).
3. **Rendering strategy per route** (CSR/SSG/SSR/streaming) justified.
4. **State topology** — server vs client vs URL vs form vs global.
5. **Data flow** for a key feature (sequence diagram).
6. **Real-time/streaming path** (SSE/WebSocket) including the AI feature.
7. **Cross-cutting concerns** — auth boundary, error boundaries, logging, feature flags.
8. **API / BFF contract** — the request/response shape the frontend depends on (typed), and where the boundary sits. The frontend plan must not assume an undefined backend.
9. **Deployment & observability touchpoints** — where the app is hosted (CDN/edge/container), and how errors + web-vitals are reported (RUM/error tracking).
10. **Folder structure** (concrete tree the user will actually create).
11. **Scalability path** (how it evolves, e.g., monolith → MFE if applicable).

## Output
Write `03-Architecture.md` with at least: 1 context diagram, 1 module diagram, 1 sequence diagram, and the folder tree. Follow `Docs/OUTPUT-TEMPLATE.md`. Keep every diagram in Mermaid.
