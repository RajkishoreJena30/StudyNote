# Frontend System Design Round — Senior Developer Guide

> How to tackle Round 3: System Design + Frontend Architecture interviews.
> Covers HLD/LLD thinking, performance, component design, and a full walkthrough of designing a **Toast Notification System as an NPM Package**.

---

## 📚 Table of Contents

1. [How to Think in This Round](#1-how-to-think-in-this-round)
2. [HLD vs LLD — What Interviewers Expect](#2-hld-vs-lld--what-interviewers-expect)
3. [The Framework — Answer Any Frontend Design Question](#3-the-framework--answer-any-frontend-design-question)
4. [Case Study: Toast Component as an NPM Package](#4-case-study-toast-component-as-an-npm-package)
   - [Step 1 — Clarify Requirements](#step-1--clarify-requirements)
   - [Step 2 — HLD (High Level Design)](#step-2--hld-high-level-design)
   - [Step 3 — Folder Structure](#step-3--folder-structure)
   - [Step 4 — TypeScript API Design](#step-4--typescript-api-design)
   - [Step 5 — Core Implementation](#step-5--core-implementation)
   - [Step 6 — Package Consumption by External Apps](#step-6--package-consumption-by-external-apps)
   - [Step 7 — Performance Considerations](#step-7--performance-considerations)
   - [Step 8 — Unit Testing Strategy](#step-8--unit-testing-strategy)
   - [Step 9 — LLD Deep Dive](#step-9--lld-deep-dive)
   - [Step 10 — Package Config (tsconfig, rollup, package.json)](#step-10--package-config)
5. [Performance Optimization — Frontend System Design](#5-performance-optimization--frontend-system-design)
6. [Component Design Principles](#6-component-design-principles)
7. [Other Common Frontend Design Questions](#7-other-common-frontend-design-questions)
8. [Senior Interview Q&A](#8-senior-interview-qa)

---

## 1. How to Think in This Round

### The Mindset Shift

```
Junior:  "I'll use useState and map over an array"
Senior:  "Let me clarify the requirements, define the API surface,
          think about consumers, then talk about tradeoffs"
```

### What Interviewers Are Evaluating

| Signal | What They Watch For |
|---|---|
| **Requirements gathering** | Do you ask clarifying questions before coding? |
| **API design** | Is the public interface clean, typed, and extensible? |
| **Separation of concerns** | Logic vs UI vs state vs events clearly separated? |
| **Consumer empathy** | Do you think about how external teams will use this? |
| **Performance awareness** | Do you proactively mention re-renders, bundle size, accessibility? |
| **Testability** | Is the code designed to be testable from the start? |
| **Tradeoffs** | Do you acknowledge what you're NOT doing and why? |

### Opening Move — Always Do This First

```
"Before I start designing, let me ask a few clarifying questions..."

1. Who consumes this? (Internal teams only? Or public NPM package?)
2. What frameworks should it support? (React only? Framework-agnostic?)
3. What are the must-have features vs nice-to-haves?
4. Are there existing design system tokens/themes to follow?
5. What's the bundle size budget?
6. Does it need SSR support?
7. Accessibility requirements (WCAG AA/AAA)?
```

This alone signals seniority. Most candidates skip straight to coding.

---

## 2. HLD vs LLD — What Interviewers Expect

### High Level Design (HLD) — The "What & Why"

```
Draw boxes and arrows. Talk about:
  - Major components/modules and their responsibilities
  - Data flow (how does data move between components?)
  - External interfaces (what does the consumer see?)
  - Key decisions and their tradeoffs
  - What you deliberately leave out and why

Time: First 15-20 minutes of the round
```

### Low Level Design (LLD) — The "How"

```
Write actual code. Cover:
  - TypeScript interfaces and types (the API contract)
  - Core algorithm / state machine
  - Key implementation details
  - Edge cases
  - Error handling

Time: Remaining 40-60 minutes
```

### HLD Diagram Template

```
┌─────────────────────────────────────────────────────┐
│                  Consumer App                        │
│                                                     │
│  import { toast, Toaster } from '@mylib/toast'      │
│                                                     │
│  toast.success('Saved!')  ──────────────────────┐   │
│  <Toaster position="top-right" />               │   │
└─────────────────────────────────────────────────┼───┘
                                                  │
                        ┌─────────────────────────▼───┐
                        │      Toast Store (Zustand)   │
                        │  - queue: Toast[]            │
                        │  - add / dismiss / clear     │
                        └──────────────┬──────────────┘
                                       │
              ┌────────────────────────▼───────────────────────┐
              │                 Toaster Component               │
              │  - Reads from store                            │
              │  - Renders ToastItem[] in a portal             │
              │  - Manages position, stacking, animations      │
              └────────────────────────┬───────────────────────┘
                                       │
                        ┌──────────────▼──────────────┐
                        │       ToastItem Component    │
                        │  - Single toast UI           │
                        │  - Progress bar timer        │
                        │  - Close button              │
                        │  - Icon by type              │
                        └─────────────────────────────┘
```

---

## 3. The Framework — Answer Any Frontend Design Question

Use this structure for **any** frontend system design question:

```
1. CLARIFY      → Ask requirements questions (2-3 min)
2. HLD          → Draw boxes, define boundaries (10 min)
3. API DESIGN   → Define the public TypeScript interface (10 min)
4. FOLDER       → Show package/project structure (5 min)
5. CORE IMPL    → Write the key logic (20-30 min)
6. PERFORMANCE  → Proactively mention optimizations (5 min)
7. TESTING      → Describe unit/integration test strategy (5 min)
8. TRADEOFFS    → What you'd do differently with more time (2 min)
```

---

## 4. Case Study: Toast Component as an NPM Package

> Full walkthrough of designing `@myorg/toast` — a production-grade, strictly typed, framework-aware toast notification package.

---

### Step 1 — Clarify Requirements

**Ask these before touching the keyboard:**

```
Functional:
  ✅ Toast types: success, error, warning, info
  ✅ Auto-dismiss with configurable duration
  ✅ Manual dismiss (close button)
  ✅ Position: top-right, top-left, bottom-right, bottom-center, etc.
  ✅ Max visible toasts (queue management)
  ✅ Pause on hover
  ✅ Custom content / JSX support
  ✅ Action button in toast (e.g., "Undo")
  ✅ Promise-based toast (loading → success/error)

Non-Functional:
  ✅ SSR compatible (Next.js)
  ✅ Zero external dependencies (except React peer dep)
  ✅ Tree-shakeable
  ✅ WCAG AA accessible (role="alert", aria-live)
  ✅ Animatable (CSS animations, no runtime dep)
  ✅ TypeScript strict mode
  ✅ < 5KB gzipped bundle

Out of Scope (explicitly state):
  ❌ Multi-framework (Vue/Svelte) — React only for v1
  ❌ Custom animation library integration
  ❌ Persistent toasts (survive page refresh)
```

---

### Step 2 — HLD (High Level Design)

#### Module Boundaries

```
@myorg/toast
├── Store Layer       → Single source of truth for all toasts (Zustand-like, but internal)
├── Imperative API    → toast.success(), toast.error(), toast.promise()
├── Declarative UI    → <Toaster /> component (consumer renders once)
├── ToastItem         → Individual toast rendering + timer
└── Types             → All exported TypeScript types
```

#### Data Flow

```
Consumer calls toast.success('Saved!')
       │
       ▼
Internal store.add({ id, type, message, duration, ... })
       │
       ▼
Toaster component (subscribed to store) re-renders
       │
       ▼
ToastItem mounts with enter animation
       │
  Duration timer starts
       │
  [hover] → timer pauses
  [blur]  → timer resumes
       │
  Timer expires OR user clicks X
       │
       ▼
store.dismiss(id) → exit animation → unmount
```

#### Key Design Decisions

| Decision | Choice | Reason |
|---|---|---|
| State management | Internal event emitter + `useSyncExternalStore` | No external dep, React 18 concurrent-mode safe |
| Rendering | `ReactDOM.createPortal` | Toasts always render above app content, no z-index battles |
| Animation | CSS classes + data attributes | No runtime animation library dep, consumer can override |
| API style | Imperative (`toast.success()`) + declarative (`<Toaster />`) | Most ergonomic — matches industry standard (react-hot-toast) |
| Bundle | ESM + CJS dual output | Works in Next.js (ESM), CRA (CJS), Vite |

---

### Step 3 — Folder Structure

```
@myorg/toast/
├── src/
│   ├── core/
│   │   ├── store.ts           # Internal state — event emitter + subscriber pattern
│   │   ├── types.ts           # All TypeScript interfaces (exported)
│   │   └── utils.ts           # generateId, mergeOptions, calcPosition
│   ├── components/
│   │   ├── Toaster.tsx        # Container — portal, positions, renders list
│   │   ├── ToastItem.tsx      # Single toast — timer, animation, icon, action
│   │   └── ProgressBar.tsx    # Optional auto-dismiss progress indicator
│   ├── hooks/
│   │   ├── useToastStore.ts   # useSyncExternalStore wrapper
│   │   └── useTimer.ts        # Pause/resume timer logic
│   ├── styles/
│   │   └── toast.css          # Default styles — consumer can override
│   ├── toast.ts               # Imperative API: toast.success(), toast.promise()
│   └── index.ts               # Public exports
├── tests/
│   ├── store.test.ts
│   ├── Toaster.test.tsx
│   ├── ToastItem.test.tsx
│   └── toast.api.test.ts
├── package.json
├── tsconfig.json
├── rollup.config.js           # or tsup.config.ts
├── .eslintrc.js
└── README.md
```

---

### Step 4 — TypeScript API Design

> **Start here in the interview** — the types ARE the design. If your types are right, the implementation follows.

```typescript
// src/core/types.ts

export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export type ToastPosition =
  | 'top-left'
  | 'top-center'
  | 'top-right'
  | 'bottom-left'
  | 'bottom-center'
  | 'bottom-right';

export interface ToastAction {
  label: string;
  onClick: () => void;
}

export interface Toast {
  id: string;
  type: ToastType;
  message: string | React.ReactNode;
  duration: number;           // ms — 0 = persistent
  position: ToastPosition;
  action?: ToastAction;
  pauseOnHover: boolean;
  createdAt: number;          // Date.now() — for sorting
  isVisible: boolean;         // Controls exit animation
}

// Options the consumer passes in
export type ToastOptions = Partial<Omit<Toast, 'id' | 'type' | 'message' | 'createdAt' | 'isVisible'>>;

// Toaster component props
export interface ToasterProps {
  position?: ToastPosition;
  maxVisible?: number;        // Default 5
  defaultDuration?: number;   // Default 4000ms
  containerClassName?: string;
  toastClassName?: string;
  gap?: number;               // px between toasts
  richColors?: boolean;       // Use semantic colors per type
  closeButton?: boolean;      // Show X button
  expand?: boolean;           // Stack vs expand on hover
}

// Imperative API return type — useful for promise toasts
export interface ToastHandle {
  id: string;
  dismiss: () => void;
  update: (options: Partial<Toast>) => void;
}

// Promise toast options
export interface ToastPromiseOptions<T> {
  loading: string;
  success: string | ((data: T) => string);
  error: string | ((err: unknown) => string);
}
```

---

### Step 5 — Core Implementation

#### Internal Store — `useSyncExternalStore` Pattern

```typescript
// src/core/store.ts
import { Toast, ToastOptions, ToastType } from './types';

// ─── Internal Store ───────────────────────────────────────────────────────────
// Using a module-level store with event emitter pattern
// This means toast.success() works from ANYWHERE — outside React tree too

type Listener = () => void;

class ToastStore {
  private toasts: Toast[] = [];
  private listeners = new Set<Listener>();

  // Subscribe for useSyncExternalStore
  subscribe = (listener: Listener) => {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // cleanup
  };

  getSnapshot = () => this.toasts;

  private notify() {
    this.listeners.forEach((l) => l());
  }

  add(toast: Omit<Toast, 'id' | 'createdAt' | 'isVisible'>): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    const newToast: Toast = {
      ...toast,
      id,
      createdAt: Date.now(),
      isVisible: true,
    };
    this.toasts = [newToast, ...this.toasts]; // Newest first
    this.notify();
    return id;
  }

  dismiss(id: string) {
    // Mark invisible first — triggers exit animation
    this.toasts = this.toasts.map((t) =>
      t.id === id ? { ...t, isVisible: false } : t
    );
    this.notify();

    // Remove from DOM after animation completes
    setTimeout(() => {
      this.toasts = this.toasts.filter((t) => t.id !== id);
      this.notify();
    }, 300); // Match CSS animation duration
  }

  update(id: string, options: Partial<Toast>) {
    this.toasts = this.toasts.map((t) =>
      t.id === id ? { ...t, ...options } : t
    );
    this.notify();
  }

  clear() {
    this.toasts = [];
    this.notify();
  }
}

export const toastStore = new ToastStore();
```

#### Imperative API

```typescript
// src/toast.ts
import { toastStore } from './core/store';
import { ToastHandle, ToastOptions, ToastPromiseOptions, ToastType } from './core/types';

const DEFAULT_DURATION = 4000;
const DEFAULT_POSITION = 'top-right' as const;

function createToast(
  type: ToastType,
  message: string,
  options?: ToastOptions
): ToastHandle {
  const id = toastStore.add({
    type,
    message,
    duration: options?.duration ?? DEFAULT_DURATION,
    position: options?.position ?? DEFAULT_POSITION,
    pauseOnHover: options?.pauseOnHover ?? true,
    action: options?.action,
  });

  return {
    id,
    dismiss: () => toastStore.dismiss(id),
    update: (opts) => toastStore.update(id, opts),
  };
}

// ─── Public Imperative API ────────────────────────────────────────────────────
export const toast = {
  success: (message: string, options?: ToastOptions) =>
    createToast('success', message, options),

  error: (message: string, options?: ToastOptions) =>
    createToast('error', message, { duration: 6000, ...options }),

  warning: (message: string, options?: ToastOptions) =>
    createToast('warning', message, options),

  info: (message: string, options?: ToastOptions) =>
    createToast('info', message, options),

  loading: (message: string, options?: ToastOptions) =>
    createToast('loading', message, { duration: 0, ...options }), // persistent

  // Promise-based toast — shows loading → success/error
  promise: async <T>(
    promise: Promise<T>,
    options: ToastPromiseOptions<T>,
    toastOptions?: ToastOptions
  ): Promise<T> => {
    const handle = createToast('loading', options.loading, {
      duration: 0,
      ...toastOptions,
    });

    try {
      const data = await promise;
      const successMsg =
        typeof options.success === 'function'
          ? options.success(data)
          : options.success;
      toastStore.update(handle.id, {
        type: 'success',
        message: successMsg,
        duration: 4000,
      });
      // Auto-dismiss after duration
      setTimeout(() => toastStore.dismiss(handle.id), 4000);
      return data;
    } catch (error) {
      const errorMsg =
        typeof options.error === 'function'
          ? options.error(error)
          : options.error;
      toastStore.update(handle.id, {
        type: 'error',
        message: errorMsg,
        duration: 6000,
      });
      setTimeout(() => toastStore.dismiss(handle.id), 6000);
      throw error;
    }
  },

  dismiss: (id: string) => toastStore.dismiss(id),
  clear: () => toastStore.clear(),
};
```

#### `useToastStore` Hook

```typescript
// src/hooks/useToastStore.ts
import { useSyncExternalStore } from 'react';
import { toastStore } from '../core/store';
import { Toast } from '../core/types';

export function useToastStore(): Toast[] {
  return useSyncExternalStore(
    toastStore.subscribe,
    toastStore.getSnapshot,
    () => [] // Server snapshot — empty on SSR
  );
}
```

#### `useTimer` Hook

```typescript
// src/hooks/useTimer.ts
import { useEffect, useRef, useCallback } from 'react';

interface UseTimerOptions {
  duration: number;       // 0 = no auto-dismiss
  onExpire: () => void;
  pauseOnHover: boolean;
}

export function useTimer({ duration, onExpire, pauseOnHover }: UseTimerOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const startTimeRef = useRef<number>(0);
  const remainingRef = useRef<number>(duration);

  const start = useCallback(() => {
    if (duration === 0) return; // Persistent toast
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(onExpire, remainingRef.current);
  }, [duration, onExpire]);

  const pause = useCallback(() => {
    if (!timerRef.current) return;
    clearTimeout(timerRef.current);
    remainingRef.current -= Date.now() - startTimeRef.current;
  }, []);

  const resume = useCallback(() => {
    if (duration === 0) return;
    startTimeRef.current = Date.now();
    timerRef.current = setTimeout(onExpire, remainingRef.current);
  }, [duration, onExpire]);

  useEffect(() => {
    start();
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [start]);

  return pauseOnHover ? { onMouseEnter: pause, onMouseLeave: resume } : {};
}
```

#### Toaster Component

```tsx
// src/components/Toaster.tsx
import React from 'react';
import { createPortal } from 'react-dom';
import { useToastStore } from '../hooks/useToastStore';
import { ToastItem } from './ToastItem';
import { ToasterProps, ToastPosition } from '../core/types';

const POSITION_STYLES: Record<ToastPosition, React.CSSProperties> = {
  'top-left':      { top: 16, left: 16 },
  'top-center':    { top: 16, left: '50%', transform: 'translateX(-50%)' },
  'top-right':     { top: 16, right: 16 },
  'bottom-left':   { bottom: 16, left: 16 },
  'bottom-center': { bottom: 16, left: '50%', transform: 'translateX(-50%)' },
  'bottom-right':  { bottom: 16, right: 16 },
};

export function Toaster({
  position = 'top-right',
  maxVisible = 5,
  defaultDuration = 4000,
  containerClassName,
  toastClassName,
  gap = 8,
  richColors = true,
  closeButton = true,
  expand = false,
}: ToasterProps) {
  const toasts = useToastStore();

  // Filter by position + limit visible count
  const visibleToasts = toasts
    .filter((t) => t.position === position)
    .slice(0, maxVisible);

  if (typeof document === 'undefined') return null; // SSR guard

  const isBottom = position.startsWith('bottom');

  return createPortal(
    <div
      role="region"
      aria-label="Notifications"
      aria-live="polite"
      className={containerClassName}
      style={{
        position: 'fixed',
        zIndex: 9999,
        display: 'flex',
        flexDirection: isBottom ? 'column-reverse' : 'column',
        gap,
        pointerEvents: 'none', // Container doesn't block clicks
        ...POSITION_STYLES[position],
      }}
    >
      {visibleToasts.map((toast, index) => (
        <ToastItem
          key={toast.id}
          toast={toast}
          index={index}
          expand={expand}
          richColors={richColors}
          closeButton={closeButton}
          className={toastClassName}
          defaultDuration={defaultDuration}
        />
      ))}
    </div>,
    document.body
  );
}
```

#### ToastItem Component

```tsx
// src/components/ToastItem.tsx
import React from 'react';
import { toastStore } from '../core/store';
import { useTimer } from '../hooks/useTimer';
import { Toast, ToastType } from '../core/types';

const ICONS: Record<ToastType, string> = {
  success: '✅',
  error: '❌',
  warning: '⚠️',
  info: 'ℹ️',
  loading: '⏳',
};

interface ToastItemProps {
  toast: Toast;
  index: number;
  expand: boolean;
  richColors: boolean;
  closeButton: boolean;
  className?: string;
  defaultDuration: number;
}

export function ToastItem({
  toast,
  index,
  richColors,
  closeButton,
  className,
  defaultDuration,
}: ToastItemProps) {
  const dismiss = () => toastStore.dismiss(toast.id);

  const timerHandlers = useTimer({
    duration: toast.duration ?? defaultDuration,
    onExpire: dismiss,
    pauseOnHover: toast.pauseOnHover,
  });

  return (
    <div
      role="alert"
      aria-atomic="true"
      data-type={toast.type}
      data-visible={toast.isVisible}
      className={`toast-item ${className ?? ''}`}
      style={{ pointerEvents: 'all' }} // Individual toasts intercept clicks
      {...timerHandlers}
    >
      <span className="toast-icon" aria-hidden="true">
        {ICONS[toast.type]}
      </span>

      <div className="toast-content">
        <span className="toast-message">{toast.message}</span>

        {toast.action && (
          <button
            className="toast-action"
            onClick={() => {
              toast.action!.onClick();
              dismiss();
            }}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {closeButton && (
        <button
          className="toast-close"
          onClick={dismiss}
          aria-label="Dismiss notification"
        >
          ✕
        </button>
      )}
    </div>
  );
}
```

---

### Step 6 — Package Consumption by External Apps

> Talk through how a consumer installs and uses the package — this shows you've thought beyond your own codebase.

#### Installation

```bash
npm install @myorg/toast
```

#### Peer Dependencies (important!)

```json
// package.json of the package
{
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "peerDependenciesMeta": {
    "react-dom": { "optional": false }
  }
}
```

#### React App Usage

```tsx
// 1. Place <Toaster /> once in your app root
import { Toaster } from '@myorg/toast';

export default function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes />
    </>
  );
}

// 2. Call toast() anywhere — in components, event handlers, service files
import { toast } from '@myorg/toast';

// In a component
function SaveButton() {
  const handleSave = async () => {
    toast.promise(saveResume(), {
      loading: 'Saving...',
      success: 'Resume saved!',
      error: (err) => `Failed: ${err.message}`,
    });
  };
  return <button onClick={handleSave}>Save</button>;
}

// In a service file (outside React tree — works because store is module-level)
export async function authService.login(credentials) {
  try {
    const user = await api.post('/auth/login', credentials);
    toast.success(`Welcome back, ${user.name}!`);
    return user;
  } catch {
    toast.error('Invalid credentials');
    throw error;
  }
}
```

#### Next.js App Router Usage

```tsx
// app/layout.tsx — server component wrapping client Toaster
import { Toaster } from '@myorg/toast';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster /> {/* Client component — handles SSR gracefully via portal guard */}
      </body>
    </html>
  );
}

// Server Action + toast in client
'use client';
import { toast } from '@myorg/toast';
import { saveResumeAction } from '@/actions/resume.actions';

function SaveButton({ resumeId }) {
  const handleSave = () => {
    toast.promise(saveResumeAction(resumeId), {
      loading: 'Saving...',
      success: 'Resume saved!',
      error: 'Failed to save',
    });
  };
  return <button onClick={handleSave}>Save</button>;
}
```

#### TypeScript — Custom Theme Extension

```typescript
// Consumer can extend the theme via CSS custom properties
// No TypeScript changes needed — just override CSS variables:

/* consumer's global.css */
:root {
  --toast-bg-success: #ecfdf5;
  --toast-border-success: #10b981;
  --toast-text-success: #065f46;
  --toast-radius: 12px;
  --toast-shadow: 0 4px 12px rgba(0,0,0,0.15);
  --toast-font: 'Inter', sans-serif;
}
```

---

### Step 7 — Performance Considerations

> Proactively raise these — don't wait to be asked.

#### 1. Render Isolation — Only Toaster Re-renders

```
Problem: toast.success() triggers a store update.
         If the store is a React Context, EVERY consumer re-renders.

Solution: useSyncExternalStore — only the <Toaster /> component
          subscribes. toast.success() in a button does NOT cause
          the button or its parent to re-render. ✅
```

#### 2. Bundle Size

```
Target: < 5KB gzipped
Strategy:
  - No runtime animation library (use CSS)
  - No icon library (use Unicode / SVG inline)
  - Zero dependencies (React is a peer dep)
  - Tree-shakeable ESM output
  - Rollup with terser minification

Measure: npx bundlephobia @myorg/toast
```

#### 3. Portal = No Z-Index Wars

```
Toasts render in document.body via createPortal()
They are ALWAYS above everything — no z-index configuration needed
Consumer doesn't need to worry about stacking contexts
```

#### 4. Animation — GPU-Accelerated

```css
/* Use transform + opacity — GPU composited, no layout reflow */
.toast-item {
  transition: transform 300ms cubic-bezier(0.21, 1.02, 0.73, 1),
              opacity 300ms ease;
}

.toast-item[data-visible="false"] {
  transform: translateX(110%);  /* Slide out — GPU layer */
  opacity: 0;
  pointer-events: none;
}

/* ❌ Avoid animating: width, height, margin, padding — triggers layout */
```

#### 5. Max Queue + Deduplication

```typescript
// Prevent toast spam — deduplicate by message
add(toast: ...) {
  // Don't add if identical message already visible
  const isDuplicate = this.toasts.some(
    (t) => t.message === toast.message && t.type === toast.type && t.isVisible
  );
  if (isDuplicate) return this.toasts.find(...)!.id;

  // Enforce max queue — remove oldest if exceeded
  if (this.toasts.length >= MAX_QUEUE) {
    this.toasts = this.toasts.slice(0, MAX_QUEUE - 1);
  }
  // ...add new toast
}
```

#### 6. Accessibility — Screen Readers

```tsx
// aria-live regions ensure screen readers announce toasts
<div aria-live="polite" aria-atomic="true">  {/* success, info, warning */}
<div aria-live="assertive" aria-atomic="true"> {/* error only — interrupts */}

// role="alert" on each ToastItem
// pauseOnHover also handles focus: pauseOnFocus for keyboard users
```

---

### Step 8 — Unit Testing Strategy

> Explain the STRATEGY first, then show code. Interviewers want to know you think in layers.

#### Testing Layers

```
Unit Tests:
  ├── store.test.ts          → add/dismiss/update/clear logic
  ├── useTimer.test.ts       → pause/resume/expire behavior
  └── toast.api.test.ts      → toast.success/error/promise return values

Integration Tests:
  ├── Toaster.test.tsx       → renders toasts, respects maxVisible, position
  └── ToastItem.test.tsx     → timer fires, hover pauses, close button works

Accessibility Tests:
  └── a11y.test.tsx          → axe-core, aria-live, role="alert"
```

#### Store Tests

```typescript
// tests/store.test.ts
import { toastStore } from '../src/core/store';

describe('ToastStore', () => {
  beforeEach(() => toastStore.clear());

  it('adds a toast and returns an id', () => {
    const id = toastStore.add({
      type: 'success',
      message: 'Hello',
      duration: 4000,
      position: 'top-right',
      pauseOnHover: true,
    });
    expect(id).toBeTruthy();
    expect(toastStore.getSnapshot()).toHaveLength(1);
    expect(toastStore.getSnapshot()[0].message).toBe('Hello');
  });

  it('dismiss marks toast invisible then removes it', () => {
    jest.useFakeTimers();
    const id = toastStore.add({ type: 'info', message: 'Test', duration: 4000, position: 'top-right', pauseOnHover: true });

    toastStore.dismiss(id);
    expect(toastStore.getSnapshot()[0].isVisible).toBe(false);

    jest.advanceTimersByTime(300); // Animation duration
    expect(toastStore.getSnapshot()).toHaveLength(0);

    jest.useRealTimers();
  });

  it('notifies subscribers on state change', () => {
    const listener = jest.fn();
    const unsubscribe = toastStore.subscribe(listener);

    toastStore.add({ type: 'success', message: 'Hi', duration: 4000, position: 'top-right', pauseOnHover: true });
    expect(listener).toHaveBeenCalledTimes(1);

    unsubscribe();
    toastStore.add({ type: 'info', message: 'Hi2', duration: 4000, position: 'top-right', pauseOnHover: true });
    expect(listener).toHaveBeenCalledTimes(1); // Not called after unsub
  });

  it('deduplicates toasts with same message and type', () => {
    toastStore.add({ type: 'error', message: 'Network error', duration: 4000, position: 'top-right', pauseOnHover: true });
    toastStore.add({ type: 'error', message: 'Network error', duration: 4000, position: 'top-right', pauseOnHover: true });
    expect(toastStore.getSnapshot()).toHaveLength(1);
  });
});
```

#### Component Tests

```tsx
// tests/Toaster.test.tsx
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Toaster } from '../src/components/Toaster';
import { toast } from '../src/toast';
import { toastStore } from '../src/core/store';

beforeEach(() => toastStore.clear());

describe('Toaster', () => {
  it('renders a toast when toast.success() is called', () => {
    render(<Toaster />);

    act(() => { toast.success('File saved!'); });

    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText('File saved!')).toBeInTheDocument();
  });

  it('dismisses toast when close button clicked', async () => {
    render(<Toaster closeButton />);
    act(() => { toast.success('Click to close'); });

    await userEvent.click(screen.getByRole('button', { name: /dismiss/i }));

    // After animation
    await act(async () => {
      await new Promise((r) => setTimeout(r, 350));
    });

    expect(screen.queryByText('Click to close')).not.toBeInTheDocument();
  });

  it('respects maxVisible limit', () => {
    render(<Toaster maxVisible={2} />);
    act(() => {
      toast.success('Toast 1');
      toast.success('Toast 2');
      toast.success('Toast 3');
    });
    expect(screen.getAllByRole('alert')).toHaveLength(2);
  });

  it('renders in correct portal (document.body)', () => {
    const { baseElement } = render(<Toaster />);
    act(() => { toast.info('Portal test'); });
    // Toast is in body, not in the render container
    expect(baseElement.querySelector('[role="alert"]')).toBeInTheDocument();
  });
});
```

#### Toast Promise Tests

```typescript
// tests/toast.api.test.ts
import { toast } from '../src/toast';
import { toastStore } from '../src/core/store';

beforeEach(() => toastStore.clear());

describe('toast.promise()', () => {
  it('shows loading then success', async () => {
    const promise = Promise.resolve({ name: 'Alice' });

    toast.promise(promise, {
      loading: 'Saving...',
      success: (data) => `Welcome ${data.name}!`,
      error: 'Failed',
    });

    // Initially loading
    expect(toastStore.getSnapshot()[0].type).toBe('loading');
    expect(toastStore.getSnapshot()[0].message).toBe('Saving...');

    await promise.catch(() => {});
    await Promise.resolve(); // Flush microtasks

    expect(toastStore.getSnapshot()[0].type).toBe('success');
    expect(toastStore.getSnapshot()[0].message).toBe('Welcome Alice!');
  });

  it('shows error on rejection', async () => {
    const promise = Promise.reject(new Error('Network failure'));

    toast.promise(promise, {
      loading: 'Loading...',
      success: 'Done',
      error: (err: Error) => `Error: ${err.message}`,
    });

    await promise.catch(() => {});
    await Promise.resolve();

    expect(toastStore.getSnapshot()[0].type).toBe('error');
    expect(toastStore.getSnapshot()[0].message).toBe('Error: Network failure');
  });
});
```

---

### Step 9 — LLD Deep Dive

#### State Machine for a Single Toast

```
States:
  PENDING → (add called) → VISIBLE → (timer expires / click) → EXITING → (300ms) → REMOVED

Transitions:
  PENDING  →[store.add()]→         VISIBLE
  VISIBLE  →[hover]→               PAUSED
  PAUSED   →[blur]→                VISIBLE
  VISIBLE  →[timer/click]→         EXITING   (isVisible: false)
  EXITING  →[300ms timeout]→       REMOVED   (filtered from array)
```

#### Edge Cases to Mention

```
1. SSR — document is undefined: portal returns null server-side ✅
2. Multiple <Toaster /> instances: each renders from same store — duplicates!
   → Solution: warn in dev if more than one Toaster detected
3. toast() called before <Toaster /> mounts: toasts queue up, render when mounted ✅
4. Rapid calls (100 toasts/sec): max queue enforced, deduplication ✅
5. Tab visibility: pause timer when tab is hidden (visibilitychange event) ✅
6. Reduced motion: respect prefers-reduced-motion media query in CSS ✅
```

#### Reduced Motion Support

```css
@media (prefers-reduced-motion: reduce) {
  .toast-item {
    transition: opacity 150ms ease;
    /* Remove transform animation — users with vestibular disorders */
  }
}
```

---

### Step 10 — Package Config

#### `package.json`

```json
{
  "name": "@myorg/toast",
  "version": "1.0.0",
  "description": "Accessible, typed toast notifications for React",
  "main": "./dist/index.cjs.js",
  "module": "./dist/index.esm.js",
  "types": "./dist/index.d.ts",
  "exports": {
    ".": {
      "import": "./dist/index.esm.js",
      "require": "./dist/index.cjs.js",
      "types": "./dist/index.d.ts"
    },
    "./styles": "./dist/toast.css"
  },
  "files": ["dist"],
  "sideEffects": ["**/*.css"],
  "scripts": {
    "build": "tsup src/index.ts --format esm,cjs --dts --clean",
    "test": "vitest",
    "lint": "eslint src --ext .ts,.tsx",
    "typecheck": "tsc --noEmit"
  },
  "peerDependencies": {
    "react": ">=18.0.0",
    "react-dom": ">=18.0.0"
  },
  "devDependencies": {
    "typescript": "^5.0.0",
    "tsup": "^8.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/user-event": "^14.0.0",
    "jsdom": "^24.0.0"
  }
}
```

#### `tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "jsx": "react-jsx",
    "strict": true,
    "exactOptionalPropertyTypes": true,
    "noUncheckedIndexedAccess": true,
    "declaration": true,
    "declarationDir": "./dist",
    "outDir": "./dist",
    "skipLibCheck": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

#### `tsup.config.ts` (build tool)

```typescript
import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,                    // Generate .d.ts files
  clean: true,
  minify: true,
  sourcemap: true,
  treeshake: true,
  external: ['react', 'react-dom'], // Don't bundle peer deps
});
```

#### `src/index.ts` — Public Exports

```typescript
// src/index.ts
// Only export what consumers need — implementation details stay internal

export { toast } from './toast';
export { Toaster } from './components/Toaster';
export type {
  Toast,
  ToastType,
  ToastPosition,
  ToastOptions,
  ToasterProps,
  ToastHandle,
  ToastPromiseOptions,
  ToastAction,
} from './core/types';
```

---

## 5. Performance Optimization — Frontend System Design

> Proactively cover these in any frontend system design round.

### Core Web Vitals Targets

| Metric | Target | What Affects It |
|---|---|---|
| **LCP** (Largest Contentful Paint) | < 2.5s | Image loading, SSR, fonts |
| **FID/INP** (Interaction to Next Paint) | < 200ms | JS execution, event handlers |
| **CLS** (Cumulative Layout Shift) | < 0.1 | Image dimensions, font loading, dynamic content |
| **TTFB** (Time to First Byte) | < 800ms | Server response, CDN, caching |

### Bundle Optimization

```
Code Splitting:
  - Route-level: Next.js does this automatically
  - Component-level: dynamic(() => import('./HeavyComponent'))
  - Library-level: import { specific } from 'lodash-es' (not import _)

Tree Shaking:
  - Use ESM (import/export) — CJS (require) is not tree-shakeable
  - Mark side-effect-free: "sideEffects": false in package.json
  - Avoid barrel files that re-export everything (import cost)

Analyze:
  - Next.js: @next/bundle-analyzer
  - Vite: rollup-plugin-visualizer
  - Generic: bundlephobia.com for npm packages
```

### Rendering Performance

```
Virtualization: Large lists → react-virtual / @tanstack/virtual
Memoization:    React.memo for pure components, useMemo/useCallback carefully
Transitions:    useTransition for non-urgent updates (search, filters)
Deferred:       useDeferredValue for expensive derived state
Concurrency:    startTransition for state updates that can be interrupted
```

### Network Performance

```
Prefetching:    <Link prefetch> in Next.js, queryClient.prefetchQuery
Caching:        TanStack Query staleTime, Next.js fetch() cache
Optimistic UI:  Show result before server confirms (useMutation onMutate)
Debouncing:     Search inputs — wait 300ms before firing request
Image:          next/image — lazy load, WebP, responsive srcset
Fonts:          next/font — self-hosted, no FOUT, preload
```

---

## 6. Component Design Principles

> How to design any React component at a senior level.

### The Compound Component Pattern

```tsx
// ✅ Flexible — consumer controls structure
<Toast.Root>
  <Toast.Icon />
  <Toast.Content>
    <Toast.Title>Success</Toast.Title>
    <Toast.Description>File saved</Toast.Description>
  </Toast.Content>
  <Toast.Action>Undo</Toast.Action>
  <Toast.Close />
</Toast.Root>

// vs. ❌ Rigid — all-in-one prop drilling
<Toast title="Success" description="File saved" action="Undo" />
```

### The Headless Component Pattern

```tsx
// Headless = logic only, no UI — consumer brings their own styles
// Example: @radix-ui, headlessui

// Package exports logic + accessibility, no styles:
export function ToastProvider({ children }) { /* state + aria */ }
export function useToast() { /* imperative API */ }
export function ToastViewport() { /* portal + positioning */ }

// Consumer styles everything themselves — maximum flexibility
```

### Component API Design Checklist

```
✅ Props named clearly (not abbreviated: `dur` → `duration`)
✅ Sensible defaults for all optional props
✅ Ref forwarding (forwardRef) for DOM access
✅ className prop for style overrides
✅ Children composition over required JSX props
✅ Event handlers named onXxx (onClick, onDismiss)
✅ Controlled + uncontrolled modes where applicable
✅ No internal state that can't be controlled externally
✅ Accessibility: aria props, keyboard nav, focus management
✅ SSR compatible: no window/document at module level
```

---

## 7. Other Common Frontend Design Questions

### Design an Autocomplete / Search Component

```
Clarify: debounce time, min chars, max results, keyboard nav, async?
HLD: Input → debounce → API → result list → keyboard selection
Key concerns: ARIA (combobox pattern), virtual list for 1000+ results,
              cache previous searches, handle loading/error/empty states
```

### Design a File Upload Component

```
Clarify: single/multi, size limit, types, drag-drop, progress, retry?
HLD: Dropzone → validation → preview → chunked upload → progress → success
Key concerns: chunking large files (resumable), S3 presigned URLs,
              progress via XMLHttpRequest, cancel upload, virus scan hook
```

### Design a Data Table Component

```
Clarify: pagination vs infinite scroll, sort, filter, column resize, row select?
HLD: DataTable → column defs → row rendering → virtualization → controls
Key concerns: @tanstack/table (headless), virtual rows for 10k+ rows,
              column pinning, controlled/uncontrolled state
```

### Design a Rich Text Editor

```
Clarify: markdown? HTML? collaboration? image upload? mention (@user)?
HLD: Toolbar → Editor canvas → Plugin system → Serializer
Key concerns: Tiptap (ProseMirror) vs Slate.js, collaborative (Yjs/CRDT),
              custom extensions, performance with large docs, accessibility
```

---

## 8. Senior Interview Q&A

---

**Q: Why use `useSyncExternalStore` instead of a Context + useState for the toast store?**

> `useSyncExternalStore` is React 18's official API for subscribing to external stores. If we used Context + useState, every component inside the Context provider would re-render whenever any toast is added or dismissed — even components completely unrelated to toasts. With `useSyncExternalStore`, only the `<Toaster />` component subscribes to the store and re-renders. Components calling `toast.success()` don't re-render at all because the store is a module-level class instance, not React state. It also handles concurrent mode tearing correctly — React guarantees a consistent snapshot across the render.

---

**Q: Why `createPortal` for the Toaster component?**

> Toasts need to appear above all other content — modals, overlays, sticky headers. If the Toaster is rendered inside the normal component tree, it inherits its parent's stacking context, and z-index becomes a complex configuration problem for consumers. `createPortal` renders the Toaster's DOM output directly into `document.body`, completely outside any stacking contexts. This means toasts always have the highest z-index without any consumer configuration. It also means consumers can place `<Toaster />` anywhere in their JSX — the actual DOM placement is always at the body level.

---

**Q: How would you version and publish this package to NPM?**

> I'd use semantic versioning strictly: patch for bug fixes, minor for backward-compatible features, major for breaking API changes. The publishing workflow: lint → typecheck → test (100% pass) → build (tsup generates ESM + CJS + types) → `npm publish --access public`. I'd set up a GitHub Actions CI pipeline that runs all checks on PR and auto-publishes on main merge using `semantic-release` or `changesets`. The `package.json` `exports` field defines the public API — any change to it is a major version. I'd also publish a CHANGELOG.md and keep a migration guide for major versions.

---

**Q: How do you handle the case where `toast()` is called before `<Toaster />` mounts?**

> The store is a module-level singleton initialized when the package is first imported — it exists independently of any React component lifecycle. Calls to `toast.success()` before `<Toaster />` mounts simply add toasts to the in-memory queue. When `<Toaster />` mounts, it calls `useSyncExternalStore` which immediately reads the current store snapshot — so any queued toasts render on the first paint of the Toaster. This is actually useful for cases where an API call resolves during the initial render cycle before the Toaster has fully mounted.

---

**Q: What would you do differently in v2 of this package?**

> Several things: (1) Framework-agnostic core — extract the store and imperative API into a vanilla JS package `@myorg/toast-core`, then build thin adapters: `@myorg/toast-react`, `@myorg/toast-vue`. (2) Animation library integration — expose an `AnimationProvider` that consumers can plug in `framer-motion` or `@react-spring/web` for physics-based animations. (3) Server-side toast — in Next.js, you sometimes want to trigger a toast from a Server Action result; I'd add a `getFlashMessages()` helper that reads messages from a cookie set by the server action, then displays them on mount. (4) Better theming — a CSS-in-JS option for design system token integration without global CSS.

---

## Quick Revision Checklist

| Topic | Key Point |
|---|---|
| Opening move | Always clarify requirements before designing |
| HLD | Draw boxes → data flow → decisions + tradeoffs |
| LLD | Types first → store → imperative API → components |
| State store | Module-level class + `useSyncExternalStore` (not Context) |
| Rendering | `createPortal` to `document.body` — no z-index issues |
| Animation | CSS transform + opacity — GPU composited, no layout reflow |
| SSR | Guard `document` access — return null server-side |
| Accessibility | `aria-live="polite"`, `role="alert"`, keyboard dismiss |
| Bundle | Zero deps, ESM output, `sideEffects: false`, tsup |
| Testing | Store unit → hook unit → component integration → a11y |
| Performance | `useSyncExternalStore` isolation, deduplication, max queue |
| Package API | `peerDependencies` for React, dual ESM/CJS, `exports` field |
| Versioning | semver + changesets/semantic-release + CI publish |

---

*Frontend system design patterns for senior developer interviews — React + TypeScript production packages.*
