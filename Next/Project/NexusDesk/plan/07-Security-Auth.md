# Security & Auth

> Production security posture for **NexusDesk**: OIDC/OAuth2 + PKCE via a BFF, httpOnly cookie sessions shared across micro-frontends, RBAC/ABAC, OWASP mitigations, and a concrete CSP.

## Table of Contents
1. [Auth model](#1-auth-model)
2. [Auth flows](#2-auth-flows)
3. [Token storage](#3-token-storage)
4. [Authorization (RBAC/ABAC)](#4-authorization-rbacabac)
5. [MFE-specific concerns](#5-micro-frontend-specific-concerns)
6. [OWASP Top 10 mitigations](#6-owasp-top-10--frontend-mitigations)
7. [Content Security Policy](#7-content-security-policy)
8. [Supply chain](#8-supply-chain)

---

## 1. Auth model
**OIDC/OAuth2 Authorization Code + PKCE**, brokered by a **BFF**. The SPA never holds long-lived tokens; the BFF exchanges the code and sets an **httpOnly, Secure, SameSite=Lax** session cookie. Rationale: SPA public clients are XSS-exposed — keeping tokens out of JS is the strongest default.

## 2. Auth flows

```mermaid
sequenceDiagram
    participant U as User
    participant S as shell (SPA)
    participant B as BFF
    participant I as IdP
    U->>S: visit /inbox (no session)
    S->>B: GET /me -> 401
    S->>I: redirect /authorize (PKCE code_challenge)
    U->>I: authenticate
    I-->>S: redirect /callback?code
    S->>B: POST /session {code, code_verifier}
    B->>I: exchange code -> tokens
    B-->>S: Set-Cookie httpOnly session; 200 {user, roles}
    S->>S: store session in shared Zustand -> /inbox
```

**Refresh:** BFF holds the refresh token; silent refresh via `POST /session/refresh` (cookie) before access expiry. **Logout:** `POST /session/logout` clears cookie + IdP end-session.

## 3. Token storage

| Option | Verdict |
|---|---|
| `localStorage` | ❌ Readable by XSS — never for tokens |
| In-memory | ⚠️ Lost on refresh; used only for the short-lived access token if needed |
| **httpOnly cookie (via BFF)** | ✅ Chosen — invisible to JS; pair with SameSite + CSRF token |

State-changing requests send an anti-CSRF token (double-submit) in addition to SameSite.

## 4. Authorization (RBAC/ABAC)
- **RBAC** for coarse roles (Agent/Supervisor/Admin/Owner).
- **ABAC** for fine rules (e.g., agent can edit a convo only if `assigneeId === user.id` or same team).
- Enforced at **three layers**: route guard (shell), component gating (`<Can action="convo.reassign">`), and **BFF/API** (authoritative — client checks are UX only).

```ts
// shared/authz.ts
export type Action = 'convo.read'|'convo.reply'|'convo.reassign'|'user.manage'|'billing.manage';
export function can(user: Session, action: Action, ctx?: { convo?: Conversation }): boolean;
```

## 5. Micro-frontend-specific concerns
- **Single source of session:** shell owns it; remotes read from the shared singleton store — no remote re-authenticates.
- **Remote integrity:** load `remoteEntry.js` from trusted origins only; pin remote URLs via a signed manifest; consider **SRI** for static remote chunks.
- **CSP must allow** each remote origin in `script-src`/`connect-src` — keep the allowlist explicit, never `*`.

## 6. OWASP Top 10 — frontend mitigations

| Risk | Mitigation in NexusDesk |
|---|---|
| XSS | React auto-escaping; sanitize KB rich-text with DOMPurify; strict CSP |
| CSRF | SameSite cookies + double-submit CSRF token |
| Broken access control | Authoritative checks at BFF; UI gating is cosmetic |
| Injection | Zod validation at SDK boundary; parameterized BFF queries |
| Sensitive data exposure | No tokens/secrets in bundle; HTTPS only; prod source maps disabled/uploaded to Sentry only |
| Vulnerable components | pnpm audit + Renovate; single MF major |
| Security misconfig | Strict CSP + security headers; error boundaries hide stack traces |
| SSRF/redirect | Validate `redirect_uri` allowlist in auth |

## 7. Content Security Policy

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' https://inbox.cdn.nexusdesk.app https://analytics.cdn.nexusdesk.app https://kb.cdn.nexusdesk.app https://admin.cdn.nexusdesk.app;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.nexusdesk.app https://api.nexusdesk.app/ai wss://rt.nexusdesk.app;
  font-src 'self';
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
```
Note `connect-src` includes the SSE AI endpoint and the WebSocket origin.

## 8. Supply chain
- Commit `pnpm-lock.yaml`; enable Renovate/Dependabot.
- Pin GitHub Actions by SHA; SRI for third-party scripts.
- Secrets only via CI/host env; `.env` never committed; validate env with Zod at startup.

## Checklist
- [x] Auth model + rationale
- [x] ≥1 auth sequence diagram
- [x] Token storage decision
- [x] RBAC/ABAC + OWASP table + concrete CSP

## Next deliverable
→ [08-Testing-Strategy.md](08-Testing-Strategy.md)

