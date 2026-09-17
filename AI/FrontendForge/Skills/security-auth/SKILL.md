---
name: security-auth
description: 'Knowledge pack for frontend security and authentication: OIDC/OAuth2 + PKCE, session vs token storage, RBAC/ABAC, OWASP Top 10 frontend mitigations, CSP, and supply-chain safety. Use when designing auth or security posture.'
---

# Skill: Security & Auth (Frontend)

## Auth model selection
| Model | Use when |
|-------|----------|
| **OIDC/OAuth2 + PKCE** | SPA/public client, third-party IdP, SSO |
| **Session cookie (httpOnly)** | Same-site app with own backend/BFF |
| **Token in memory + silent refresh** | SPA without cookie backend |

**Default for production SPA:** OIDC + PKCE, tokens in **httpOnly, Secure, SameSite** cookies via a BFF.

## Token storage tradeoffs
- `localStorage` → readable by XSS. Avoid for tokens.
- `httpOnly` cookie → safe from JS, needs CSRF protection (SameSite + CSRF token).
- In-memory → lost on refresh; pair with silent refresh.

## Authorization
- **RBAC** for coarse roles; **ABAC** for fine-grained rules.
- Guard at three layers: route guard, component gating, and API (never trust the client).

## OWASP Top 10 — frontend mitigations
| Risk | Mitigation |
|------|-----------|
| XSS | Escape by default, framework auto-escaping, sanitize HTML (DOMPurify), CSP |
| CSRF | SameSite cookies + anti-CSRF token on state-changing requests |
| Broken access control | Server-side authz, never rely on hidden UI |
| Injection | Parameterized APIs, validate with Zod at boundaries |
| Sensitive data exposure | No secrets in bundle, HTTPS only, minimal PII in client |
| Vulnerable components | `npm audit`, Renovate/Dependabot, lockfile |
| Security misconfig | Strict CSP, security headers, disable source maps in prod |

## Content Security Policy (starter)
```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  connect-src 'self' https://api.example.com;
  frame-ancestors 'none';
  base-uri 'self';
```

## Supply chain
- Commit a lockfile; enable Dependabot/Renovate.
- Use SRI for third-party scripts; pin CI actions by SHA.

## Deliverable must include
Chosen auth model + rationale, ≥1 auth sequence diagram, token storage decision, RBAC/ABAC map, OWASP mitigation table, concrete CSP.
