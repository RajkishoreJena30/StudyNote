---
name: ai-streaming-features
description: 'Knowledge pack for building AI features with streaming events: SSE vs WebSocket, fetch streaming, token-by-token UI, generative UI with typed tool calls, cancellation/retry, and guardrails. Use when designing the AI assistant / streaming surface.'
---

# Skill: AI Streaming Features

## Transport choice
| Transport | Direction | Best for |
|-----------|-----------|----------|
| **SSE** (`text/event-stream`) | server → client | LLM token streaming, notifications |
| **WebSocket** | bidirectional | collaboration, multiplayer, live cursors |
| **fetch + ReadableStream** | server → client | modern streaming without EventSource limits |

**Default for an AI chat/copilot:** SSE or `fetch` streaming — simpler, HTTP semantics, proxy-friendly.

## SSE server contract (example)
```
GET /api/ai/stream?threadId=...
Accept: text/event-stream

event: token
data: {"delta":"Hello"}

event: tool_call
data: {"name":"render_chart","args":{...}}

event: done
data: {"usage":{"tokens":123}}
```

## Client streaming (fetch, framework-agnostic)
```ts
const res = await fetch('/api/ai/stream', { signal: controller.signal });
const reader = res.body!.getReader();
const decoder = new TextDecoder();
while (true) {
  const { value, done } = await reader.read();
  if (done) break;
  appendToUI(decoder.decode(value, { stream: true }));
}
```

## Token-by-token UX
- Render deltas incrementally; keep a "typing" indicator.
- Debounce expensive re-renders; use a ref buffer + `requestAnimationFrame` flush.
- Support **cancellation** (`AbortController`) and **retry with backoff**.
- Show partial + final states distinctly; handle mid-stream errors.

## Generative UI
- Model emits **typed tool calls** validated with Zod/JSON Schema — never trust raw props.
- Map tool calls → whitelisted UI components (charts, tables, forms).
- Stream server components / progressive rendering where the stack supports it.

## MCP UI (hybrid LLM + component UIs)
Chat and the component UI are **peers**: the model can read/mutate UI state through an MCP-defined, **typed** tool surface, and the UI sends structured context back.
- **Deterministic tool schema** (Zod / JSON Schema) — the model never hallucinates props.
- **Whitelist** model-invokable components; validate args before render.
- **Reversibility:** every model action is undoable and audit-logged.
- **In this stack:** the copilot lives in `mfe-inbox`; `tool_call` events arrive on the SSE stream and map to whitelisted React components.

## Guardrails (production)
- Rate limit per user/IP; token/cost budget.
- PII redaction on input and output.
- Output moderation before render.
- Every agent action reversible (undo); log tool calls for audit.

## Deliverable must include
Transport choice + rationale, SSE contract, client streaming example, token UX (cancel/retry), generative-UI schema approach, guardrails, and a streaming sequence diagram.
