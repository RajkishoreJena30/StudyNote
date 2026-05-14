# @myorg/toast

Accessible, strictly typed toast notifications for React.

- ⚡ **< 10KB** — zero runtime dependencies
- 🎯 **Strictly typed** — TypeScript strict mode with `exactOptionalPropertyTypes`
- ♿ **Accessible** — `aria-live`, `role="alert"`, keyboard dismiss, reduced motion
- 🎨 **Themeable** — CSS custom properties, no CSS-in-JS
- 🔁 **Promise API** — loading → success/error in one call
- 🖥️ **SSR safe** — Next.js App Router compatible
- 🧩 **Dual output** — ESM + CJS, works in Vite, Next.js, CRA

---

## Installation

```bash
npm install @myorg/toast
```

> **Peer dependencies** — React 18+ and ReactDOM 18+ must already be installed in your project.

---

## Quick Start

### 1. Add `<Toaster />` once in your app root

```tsx
// app/layout.tsx (Next.js) or main.tsx (Vite)
import { Toaster } from '@myorg/toast';
import '@myorg/toast/styles';

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Toaster position="top-right" />
      </body>
    </html>
  );
}
```

### 2. Call `toast()` anywhere

```ts
import { toast } from '@myorg/toast';

// Basic types
toast.success('Resume saved!');
toast.error('Something went wrong.');
toast.warning('Session expires in 5 minutes.');
toast.info('New version available.');

// Persistent (no auto-dismiss)
toast.loading('Uploading file...');

// With options
toast.success('File deleted.', {
  duration: 3000,
  actions: { label: 'Undo', onClick: () => undoDelete() },
});

// Dismiss programmatically
const { dismiss } = toast.success('Done!');
setTimeout(dismiss, 1000);
```

---

## Promise API

Shows a loading toast, then automatically transitions to success or error:

```ts
import { toast } from '@myorg/toast';

// Static messages
await toast.promise(saveResume(data), {
  loading: 'Saving...',
  success: 'Resume saved!',
  error: 'Failed to save resume.',
});

// Dynamic messages from the resolved/rejected value
await toast.promise(fetchUser(id), {
  loading: 'Loading user...',
  success: (user) => `Welcome, ${user.name}!`,
  error: (err) => `Error: ${err.message}`,
});
```

---

## `<Toaster />` Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `position` | `ToastPosition` | `'top-right'` | Where toasts appear |
| `maxVisible` | `number` | `5` | Max toasts shown at once |
| `defaultDuration` | `number` | `4000` | Auto-dismiss delay (ms) |
| `gap` | `number` | `8` | Gap between toasts (px) |
| `richColors` | `boolean` | `true` | Semantic colors per toast type |
| `closeButton` | `boolean` | `true` | Show × dismiss button |
| `expand` | `boolean` | `false` | Expand stacked toasts on hover |
| `containerClassName` | `string` | — | Class for the outer container |
| `toastClassName` | `string` | — | Class applied to every toast |

### `ToastPosition` values

```
'top-left' | 'top-center' | 'top-right'
'bottom-left' | 'bottom-center' | 'bottom-right'
```

---

## `toast()` Options

All methods accept an optional `ToastOptions` object:

```ts
interface ToastOptions {
  duration?: number;      // ms — 0 = persistent
  position?: ToastPosition;
  pauseOnHover?: boolean; // default: true
  actions?: {
    label: string;
    onClick: () => void;
  };
}
```

---

## Theming

Override CSS custom properties in your global stylesheet:

```css
:root {
  --toast-bg:              #ffffff;
  --toast-border:          #e5e7eb;
  --toast-text:            #111827;
  --toast-radius:          12px;
  --toast-shadow:          0 8px 24px rgba(0, 0, 0, 0.12);
  --toast-min-width:       320px;
  --toast-max-width:       480px;

  /* Per-type rich colors */
  --toast-success-bg:      #f0fdf4;
  --toast-success-border:  #86efac;
  --toast-success-text:    #166534;

  --toast-error-bg:        #fef2f2;
  --toast-error-border:    #fca5a5;
  --toast-error-text:      #991b1b;

  --toast-warning-bg:      #fffbeb;
  --toast-warning-border:  #fcd34d;
  --toast-warning-text:    #92400e;

  --toast-info-bg:         #eff6ff;
  --toast-info-border:     #93c5fd;
  --toast-info-text:       #1e40af;
}
```

---

## Accessibility

- Container uses `aria-live="polite"` — screen readers announce toasts without interrupting
- Error toasts should use `aria-live="assertive"` if they require immediate attention (configurable)
- Each toast has `role="alert"` and `aria-atomic="true"`
- Close button has `aria-label="Dismiss notification"`
- Timer pauses on both **hover** and **focus** (keyboard users)
- Respects `prefers-reduced-motion` — disables slide animation, hides progress bar

---

## Next.js App Router

```tsx
// app/layout.tsx
import { Toaster } from '@myorg/toast';
import '@myorg/toast/styles';

export default async function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <SessionProvider>{children}</SessionProvider>
        {/* Toaster renders in a portal — always above everything */}
        <Toaster />
      </body>
    </html>
  );
}

// Server Action + toast in a Client Component
'use client';
import { toast } from '@myorg/toast';
import { saveResumeAction } from '@/actions/resume.actions';

export function SaveButton({ id }: { id: string }) {
  return (
    <button
      onClick={() =>
        toast.promise(saveResumeAction(id), {
          loading: 'Saving...',
          success: 'Saved!',
          error: 'Failed to save.',
        })
      }
    >
      Save
    </button>
  );
}
```

---

## TypeScript

All types are exported from the package root:

```ts
import type {
  Toast,
  ToastType,
  ToastPosition,
  ToastAction,
  ToastOptions,
  ToasterProps,
  ToastHandle,
  ToastPromiseOptions,
} from '@myorg/toast';
```

---

## Development

```bash
# Install dependencies
npm install

# Build ESM + CJS + types
npm run build

# Watch mode
npm run dev

# Type check
npm run typecheck

# Lint
npm run lint

# Run tests
npm test

# Tests with coverage
npm run test:coverage
```

### Project Structure

```
src/
├── core/
│   ├── store.ts          # Module-level store — useSyncExternalStore compatible
│   ├── types.ts          # All TypeScript interfaces (exported)
│   └── utils.ts          # generateId, mergeOptions, position helpers
├── components/
│   ├── Toaster.tsx        # Portal container — renders toast list
│   ├── ToastItem.tsx      # Single toast — icon, message, action, timer
│   └── ProgressBar.tsx    # Auto-dismiss progress indicator
├── hooks/
│   ├── useToastStore.ts   # useSyncExternalStore wrapper
│   └── useTimer.ts        # Pause/resume timer with hover + focus support
├── styles/
│   └── toast.css          # CSS variables + animations (no runtime dep)
├── toast.ts               # Imperative API: toast.success/error/promise...
└── index.ts               # Public exports only
```

---

## License

MIT
