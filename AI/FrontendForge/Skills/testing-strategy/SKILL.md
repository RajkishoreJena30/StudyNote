---
name: testing-strategy
description: 'Knowledge pack for a 90%+ coverage testing strategy: test pyramid, Vitest/Jest + Testing Library + Playwright + MSW, what to unit/integration/E2E test, coverage gates, a11y tests, and testing streaming/AI UIs. Use when designing the test plan.'
---

# Skill: Testing Strategy (≥90% coverage)

## Test pyramid (target mix)
- **~65% Unit** — pure logic, hooks, reducers, utils, isolated components.
- **~25% Integration** — feature slices with UI + data via MSW.
- **~10% E2E** — critical journeys in a real browser (Playwright).

## Tooling
| Layer | Tool |
|-------|------|
| Unit/integration runner | Vitest (or Jest) |
| Component | Testing Library |
| Network mocking | MSW (Mock Service Worker) |
| E2E | Playwright |
| A11y | axe-core / @axe-core/playwright |
| Coverage | v8 / istanbul via runner |

## What to test where
- **Unit:** business rules, formatting, validation schemas (Zod), custom hooks, state reducers, discriminated-union transitions.
- **Integration:** a feature slice end-to-end within the app (render → interact → assert), network mocked with MSW.
- **E2E:** login, core happy path, a destructive/edge path, and the AI streaming flow.

## Reaching 90% meaningfully
- Cover branches, not just lines — test error/empty/loading states.
- Don't test framework internals or generated code.
- Set thresholds in config so CI fails below target:

```ts
// vitest.config.ts
export default {
  test: {
    coverage: {
      provider: 'v8',
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
      exclude: ['**/*.stories.*', '**/*.d.ts', 'src/app/**'],
    },
  },
};
```

## Test data
- Factories for entities; deterministic seeds; freeze time (`vi.setSystemTime`).

## Testing streaming / AI UIs
- Mock SSE with a controllable ReadableStream; assert token-by-token render, cancellation, and error/retry states.
- Keep streams deterministic (fixed chunks) so tests aren't flaky.

## CI gates
- Run unit+integration on every PR; E2E on merge / nightly.
- Fail under coverage threshold; quarantine flaky tests, don't delete.

## Deliverable must include
Pyramid mix, tooling table, coverage config snippet, one example each of a component test, a hook test, and an E2E test, plus the streaming-test approach.
