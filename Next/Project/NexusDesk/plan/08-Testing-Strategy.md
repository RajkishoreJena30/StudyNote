# Testing Strategy

> A **≥ 90% coverage** strategy for **NexusDesk** with meaningful tests: Vitest + Testing Library + MSW for unit/integration, Playwright for E2E, axe for a11y, and a deterministic approach to testing **SSE streaming**.

## Table of Contents
1. [Test pyramid](#1-test-pyramid)
2. [Tooling](#2-tooling)
3. [What to test where](#3-what-to-test-where)
4. [Coverage config](#4-coverage-config-90)
5. [Examples](#5-examples)
6. [Testing streaming / AI](#6-testing-streaming--ai)
7. [CI gates](#7-ci-gates)

---

## 1. Test pyramid
~65% unit · ~25% integration · ~10% E2E. In an MFE, also add **contract tests** that each remote still exposes its expected module + that shared singleton versions match.

## 2. Tooling

| Layer | Tool |
|---|---|
| Unit/integration | Vitest + Testing Library |
| Network mock | MSW |
| E2E | Playwright |
| A11y | @axe-core/playwright + jest-axe (unit) |
| Coverage | v8 provider |
| MF contract | custom Vitest suite asserting `remoteEntry` exposes + `requiredVersion` |

## 3. What to test where
- **Unit:** `useAiStream`, authz `can()`, Zod schemas, formatters, reducers, isolated components (Composer, Badge).
- **Integration:** ConvoList + MSW (fetch → virtualized render → filter), reply optimistic flow, KB editor save.
- **E2E:** login (OIDC mocked), suggest-reply stream + cancel + send, create KB article, RBAC denial path.
- **Contract:** shell can load each remote; shared React/i18next single instance.

## 4. Coverage config (≥ 90%)

```ts
// vitest.config.ts
export default {
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.ts'], // MSW server, jest-axe, fake timers
    coverage: {
      provider: 'v8',
      thresholds: { lines: 90, functions: 90, branches: 85, statements: 90 },
      exclude: ['**/*.stories.*', '**/*.d.ts', '**/mf-config.*', 'src/app/main.tsx'],
    },
  },
};
```
Cover **branches** (loading/empty/error), not just happy lines. Don’t test framework internals or generated MF glue.

## 5. Examples

**Component test**
```ts
it('Composer disables send when empty', async () => {
  render(<Composer onSend={vi.fn()} />);
  expect(screen.getByRole('button', { name: /send/i })).toBeDisabled();
  await userEvent.type(screen.getByRole('textbox'), 'hi');
  expect(screen.getByRole('button', { name: /send/i })).toBeEnabled();
});
```

**Hook test (authz)**
```ts
it('agent cannot reassign convos they do not own', () => {
  const user = { id: 'a1', roles: ['agent'] } as Session;
  expect(can(user, 'convo.reassign', { convo: { assigneeId: 'a2' } as Conversation })).toBe(false);
});
```

**E2E (Playwright)**
```ts
test('agent streams and sends an AI reply', async ({ page }) => {
  await login(page, 'agent');
  await page.goto('/inbox/conv_1');
  await page.getByRole('button', { name: 'Suggest reply' }).click();
  await expect(page.getByTestId('draft')).not.toBeEmpty();
  await page.getByRole('button', { name: 'Send' }).click();
  await expect(page.getByText('Delivered')).toBeVisible();
});
```

## 6. Testing streaming / AI
Mock SSE with a controllable `ReadableStream` so tests are deterministic:
```ts
function sseStream(chunks: string[]) {
  return new ReadableStream({
    start(c) {
      for (const t of chunks) c.enqueue(new TextEncoder().encode(`event: token\ndata: {"delta":"${t}"}\n\n`));
      c.enqueue(new TextEncoder().encode(`event: done\ndata: {}\n\n`));
      c.close();
    },
  });
}
// Assert: incremental text, abort() -> tag 'cancelled', injected error -> tag 'error' with retry.
```

## 7. CI gates
- PR: lint + typecheck + unit + integration + a11y unit; fail under coverage thresholds.
- Merge/nightly: Playwright E2E (sharded) + MF contract tests + **Chromatic** visual regression.
- Flaky tests quarantined (tagged), never deleted.

## 8. Visual regression & feature flags
- **Visual regression:** Storybook stories + **Chromatic** snapshot each component state; block PRs on unreviewed visual diffs.
- **Feature flags:** test **both** flag states for gated UI (**OpenFeature** test provider) — the OFF path must degrade gracefully and the ON path must be covered.

## Checklist
- [x] Pyramid + MF contract layer
- [x] Coverage config ≥ 90%
- [x] Component + hook + E2E examples
- [x] Deterministic streaming tests + CI gates
- [x] Visual regression + feature-flag tests

## Next deliverable
→ [09-Performance.md](09-Performance.md)

