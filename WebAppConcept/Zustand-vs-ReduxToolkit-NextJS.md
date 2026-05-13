# Zustand vs Redux Toolkit in Next.js — State Management Guide

> When to use Zustand, when to use Redux Toolkit, and what to avoid in Next.js App Router applications.

---

## 📚 Table of Contents

1. [The Core Problem in Next.js](#1-the-core-problem-in-nextjs)
2. [Quick Decision Table](#2-quick-decision-table)
3. [Recommended Architecture](#3-recommended-architecture)
4. [Zustand in Next.js](#4-zustand-in-nextjs)
5. [Redux Toolkit in Next.js](#5-redux-toolkit-in-nextjs)
6. [RTK Query vs TanStack Query](#6-rtk-query-vs-tanstack-query)
7. [SSR Hydration Problem & Fix](#7-ssr-hydration-problem--fix)
8. [Real-World Patterns](#8-real-world-patterns)
9. [What NOT to Use](#9-what-not-to-use)
10. [Senior Interview Q&A](#10-senior-interview-qa)
11. [Complex State Management in Next.js](#11-complex-state-management-in-nextjs)
3. [Recommended Architecture](#3-recommended-architecture)
4. [Zustand in Next.js](#4-zustand-in-nextjs)
5. [Redux Toolkit in Next.js](#5-redux-toolkit-in-nextjs)
6. [RTK Query vs TanStack Query](#6-rtk-query-vs-tanstack-query)
7. [SSR Hydration Problem & Fix](#7-ssr-hydration-problem--fix)
8. [Real-World Patterns](#8-real-world-patterns)
9. [What NOT to Use](#9-what-not-to-use)
10. [Senior Interview Q&A](#10-senior-interview-qa)

---

## 1. The Core Problem in Next.js

Next.js App Router introduces **Server Components** — they run on the server and **cannot use any client-side state library**. Both Zustand and Redux Toolkit are **client-side only** (require `'use client'`).

```
Next.js App Router Architecture:

Server Components  →  fetch() / React.cache() / DB queries   (no Zustand/RTK)
Client Components  →  Zustand / RTK / useState / useContext   (browser only)
```

This means **most of your data doesn't need global state at all** in Next.js:

```tsx
// ✅ Server Component — no state library needed
// app/dashboard/page.tsx
export default async function DashboardPage() {
  // Fetch directly — no Redux, no Zustand, no useEffect
  const data = await db.resume.findMany({ where: { userId: session.userId } });
  return <ResumeList resumes={data} />;
}

// ✅ Only use Zustand/RTK for genuinely client-side state
// - UI state (modal open/close, sidebar collapsed)
// - User preferences (theme, locale)
// - Optimistic updates
// - Multi-step form wizard state
// - Shopping cart
```

**Rule of thumb**: If the data comes from the server, keep it on the server. Only reach for global client state when you truly need it.

---

## 2. Quick Decision Table

| Factor | Zustand | Redux Toolkit |
|---|---|---|
| **Bundle Size** | ~1KB ✅ | ~16KB |
| **Boilerplate** | Minimal ✅ | Moderate |
| **Server Components** | ❌ Client only | ❌ Client only |
| **DevTools** | ✅ (plugin) | ✅ Built-in |
| **RTK Query / API caching** | ❌ | ✅ Powerful |
| **TanStack Query compat** | ✅ Works great | ✅ Works great |
| **Learning Curve** | Low ✅ | Medium |
| **Next.js SSR Safe** | Needs care | Needs care |
| **Async Actions** | Simple | `createAsyncThunk` |
| **Large Team / Enterprise** | Okay | Better ✅ |
| **Middleware / Enhancers** | Basic | Advanced ✅ |
| **Immer (immutable updates)** | ✅ Built-in | ✅ Built-in |
| **Persist to localStorage** | ✅ `persist` middleware | ✅ `redux-persist` |
| **Time-travel debugging** | ❌ | ✅ Redux DevTools |

---

## 3. Recommended Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Data Source Guide                     │
├─────────────────┬───────────────────────────────────────┤
│ Server State    │ fetch() + Server Components            │
│ (DB data, APIs) │ React.cache() for deduplication        │
│                 │ Next.js fetch() cache + revalidation    │
├─────────────────┼───────────────────────────────────────┤
│ Async Client    │ TanStack Query  (recommended)          │
│ API Data        │ RTK Query       (if already using RTK) │
├─────────────────┼───────────────────────────────────────┤
│ Light UI State  │ Zustand                                │
│ (theme, modal,  │ useState / useReducer (if local)       │
│ cart, prefs)    │                                        │
├─────────────────┼───────────────────────────────────────┤
│ Complex App     │ Redux Toolkit                          │
│ Enterprise      │ (auth, notifications, large forms)     │
├─────────────────┼───────────────────────────────────────┤
│ Form State      │ React Hook Form (always — not RTK)     │
└─────────────────┴───────────────────────────────────────┘
```

### Recommendation by App Size

```
✅ Small / Medium App    →  Zustand + TanStack Query
✅ Data-Heavy App        →  Zustand + RTK Query
✅ Enterprise / MERN     →  Redux Toolkit + RTK Query
✅ Auth state globally   →  Either (+ httpOnly cookie session)
❌ Avoid                 →  Context API for frequently changing state
❌ Avoid                 →  RTK for simple UI state (overkill)
```

---

## 4. Zustand in Next.js

### Basic Store

```typescript
// src/store/useUIStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface UIState {
  isSidebarOpen: boolean;
  activeModal: string | null;
  theme: 'light' | 'dark' | 'system';
  toggleSidebar: () => void;
  openModal: (modalId: string) => void;
  closeModal: () => void;
  setTheme: (theme: UIState['theme']) => void;
}

export const useUIStore = create<UIState>()(
  devtools(
    (set) => ({
      isSidebarOpen: true,
      activeModal: null,
      theme: 'system',
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),
      openModal: (modalId) => set({ activeModal: modalId }),
      closeModal: () => set({ activeModal: null }),
      setTheme: (theme) => set({ theme }),
    }),
    { name: 'UIStore' }
  )
);
```

### Persisted Store (survives page reload)

```typescript
// src/store/useCartStore.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'quantity'>) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) =>
        set((state) => {
          const existing = state.items.find((i) => i.id === item.id);
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            };
          }
          return { items: [...state.items, { ...item, quantity: 1 }] };
        }),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    }),
    {
      name: 'cart-storage',          // localStorage key
      storage: createJSONStorage(() => localStorage),
    }
  )
);
```

### Zustand with Slices (large stores)

```typescript
// src/store/slices/authSlice.ts
import { StateCreator } from 'zustand';

export interface AuthSlice {
  user: User | null;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
  logout: () => set({ user: null, isAuthenticated: false }),
});

// src/store/useBoundStore.ts
// Combine multiple slices into one store
import { create } from 'zustand';
import { createAuthSlice, AuthSlice } from './slices/authSlice';
import { createUISlice, UISlice } from './slices/uiSlice';

type BoundStore = AuthSlice & UISlice;

export const useBoundStore = create<BoundStore>()((...args) => ({
  ...createAuthSlice(...args),
  ...createUISlice(...args),
}));
```

### Selector Pattern (prevent unnecessary re-renders)

```tsx
'use client';
// ❌ Bad — component re-renders on ANY store change
const { user, theme, isSidebarOpen } = useBoundStore();

// ✅ Good — only re-renders when 'user' changes
const user = useBoundStore((state) => state.user);
const theme = useBoundStore((state) => state.theme);

// ✅ Best for derived values — useShallow prevents re-render if values are same
import { useShallow } from 'zustand/react/shallow';
const { user, isAuthenticated } = useBoundStore(
  useShallow((state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }))
);
```

---

## 5. Redux Toolkit in Next.js

### Store Setup — SSR Safe

```typescript
// src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import { resumeApi } from './services/resumeApi';
import authSlice from './slices/authSlice';
import uiSlice from './slices/uiSlice';

// makeStore creates a new store per server request (avoids shared state across requests)
export const makeStore = () =>
  configureStore({
    reducer: {
      auth: authSlice,
      ui: uiSlice,
      [resumeApi.reducerPath]: resumeApi.reducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(resumeApi.middleware),
  });

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore['getState']>;
export type AppDispatch = AppStore['dispatch'];
```

### SSR-Safe Provider

```tsx
// src/providers/ReduxProvider.tsx
'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store/store';

export default function ReduxProvider({ children }: { children: React.ReactNode }) {
  // useRef ensures a new store is created once per component mount
  // (not on every render, and not shared between requests on the server)
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}

// app/layout.tsx
// <ReduxProvider>
//   <SessionProvider session={session}>
//     {children}
//   </SessionProvider>
// </ReduxProvider>
```

### Auth Slice

```typescript
// src/store/slices/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

const authSlice = createSlice({
  name: 'auth',
  initialState: { user: null, isAuthenticated: false, isLoading: false } as AuthState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    logout(state) {
      state.user = null;
      state.isAuthenticated = false;
    },
    setLoading(state, action: PayloadAction<boolean>) {
      state.isLoading = action.payload;
    },
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export const selectUser = (state: { auth: AuthState }) => state.auth.user;
export const selectIsAuthenticated = (state: { auth: AuthState }) => state.auth.isAuthenticated;
export default authSlice.reducer;
```

### Typed Hooks

```typescript
// src/store/hooks.ts
import { useDispatch, useSelector, useStore } from 'react-redux';
import type { AppDispatch, RootState, AppStore } from './store';

// Use these throughout the app instead of plain useDispatch/useSelector
export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
export const useAppStore = useStore.withTypes<AppStore>();
```

---

## 6. RTK Query vs TanStack Query

> Both solve client-side server-state caching. Pick one — they serve the same purpose.

### RTK Query

```typescript
// src/store/services/resumeApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

export const resumeApi = createApi({
  reducerPath: 'resumeApi',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api',
    prepareHeaders: (headers, { getState }) => {
      // Attach auth token from Redux state
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Resume', 'User'],
  endpoints: (builder) => ({
    getResumes: builder.query<Resume[], void>({
      query: () => '/resumes',
      providesTags: ['Resume'],
    }),
    createResume: builder.mutation<Resume, Partial<Resume>>({
      query: (body) => ({ url: '/resumes', method: 'POST', body }),
      invalidatesTags: ['Resume'], // Auto-refetches getResumes
    }),
    deleteResume: builder.mutation<void, string>({
      query: (id) => ({ url: `/resumes/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Resume'],
    }),
  }),
});

export const { useGetResumesQuery, useCreateResumeMutation, useDeleteResumeMutation } = resumeApi;
```

### TanStack Query (with Zustand)

```typescript
// src/hooks/useResumes.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { resumeService } from '@/services/resumeService';

export function useResumes() {
  return useQuery({
    queryKey: ['resumes'],
    queryFn: resumeService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

export function useDeleteResume() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: resumeService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] }); // Auto-refetch
    },
  });
}
```

### Comparison

| | RTK Query | TanStack Query |
|---|---|---|
| Bundle with RTK | Included | Separate (~13KB) |
| Setup | Part of RTK store | Separate `QueryClient` |
| Caching | ✅ Tag-based invalidation | ✅ Key-based invalidation |
| Optimistic updates | ✅ | ✅ |
| Infinite queries | ✅ | ✅ |
| Works with Zustand | ✅ | ✅ |
| Works with RTK | Native | ✅ |
| DevTools | RTK DevTools | Dedicated TanStack DevTools |
| **Recommendation** | If already using RTK | Otherwise prefer this |

---

## 7. SSR Hydration Problem & Fix

### The Problem

```
Server renders page with initial HTML (no store data)
Client hydrates — Zustand/RTK initializes with default state
Result: Flash of incorrect content (e.g., logged-out UI briefly shown)
```

### Fix 1 — Zustand: Initialize Store from Server Props

```tsx
// src/providers/ZustandHydrator.tsx
'use client';
import { useRef } from 'react';
import { useAuthStore } from '@/store/useAuthStore';

// Called once in layout with server-fetched data
export default function ZustandHydrator({
  user,
  children,
}: {
  user: User | null;
  children: React.ReactNode;
}) {
  const initialized = useRef(false);

  if (!initialized.current) {
    // Synchronously set store before first render
    useAuthStore.setState({ user, isAuthenticated: !!user });
    initialized.current = true;
  }

  return <>{children}</>;
}

// app/layout.tsx
// const session = await getSession(); // Server Component
// <ZustandHydrator user={session?.user ?? null}>
//   {children}
// </ZustandHydrator>
```

### Fix 2 — RTK: Preload State into Provider

```tsx
// src/providers/ReduxProvider.tsx
'use client';
import { useRef } from 'react';
import { Provider } from 'react-redux';
import { makeStore, AppStore } from '@/store/store';
import { setUser } from '@/store/slices/authSlice';

export default function ReduxProvider({
  children,
  preloadedUser,
}: {
  children: React.ReactNode;
  preloadedUser?: User | null;
}) {
  const storeRef = useRef<AppStore | null>(null);

  if (!storeRef.current) {
    storeRef.current = makeStore();
    // Hydrate with server-fetched data before first render
    if (preloadedUser) {
      storeRef.current.dispatch(setUser(preloadedUser));
    }
  }

  return <Provider store={storeRef.current}>{children}</Provider>;
}
```

### Fix 3 — Zustand: `skipHydration` for persisted stores

```typescript
// For stores that use localStorage persist — avoids mismatch
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({ /* ...state */ }),
    {
      name: 'cart-storage',
      skipHydration: true, // Don't auto-hydrate from localStorage on mount
    }
  )
);

// Manually hydrate in a client component after mount:
// useEffect(() => { useCartStore.persist.rehydrate(); }, []);
```

---

## 8. Real-World Patterns

### Pattern 1 — Zustand for UI + TanStack Query for Data

```
Best for: Most Next.js apps

Zustand stores:
  - useUIStore    → sidebar, modals, theme, toast queue
  - useAuthStore  → current user (hydrated from session cookie server side)
  - useCartStore  → shopping cart (persisted to localStorage)

TanStack Query:
  - useResumes()         → GET /api/resumes
  - useCreateResume()    → POST /api/resumes
  - useUserProfile()     → GET /api/users/me
```

### Pattern 2 — Redux Toolkit + RTK Query for Everything

```
Best for: Enterprise / MERN stack apps with complex state

RTK slices:
  - authSlice         → user, tokens, permissions
  - uiSlice           → notifications, modals, sidebar
  - notificationSlice → real-time notification queue

RTK Query services:
  - resumeApi         → CRUD with tag invalidation
  - userApi           → profile, settings
  - billingApi        → subscription, invoices
```

### Pattern 3 — Hybrid (most realistic)

```
Server Components  → Direct DB/fetch (no client state)
Server Actions     → Mutations (revalidatePath, redirect)
TanStack Query     → Client-side data fetching where needed
Zustand            → Purely UI/preference state
No Redux           → Unnecessary in this setup
```

---

## 9. What NOT to Use

### ❌ Context API for Frequently Changing State

```tsx
// ❌ Bad — every consumer re-renders on any context change
const AppContext = createContext({});

function AppProvider({ children }) {
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [theme, setTheme] = useState('light');
  // Every setState causes ALL consumers to re-render

  return (
    <AppContext.Provider value={{ user, setUser, cart, setCart, theme, setTheme }}>
      {children}
    </AppContext.Provider>
  );
}

// ✅ Good — use Context ONLY for truly static/rarely-changing values
// e.g., theme config, feature flags, localization strings
```

### ❌ localStorage/sessionStorage Directly

```tsx
// ❌ Bad — breaks SSR (window is undefined on server)
const token = localStorage.getItem('token'); // ReferenceError on server

// ✅ Use Zustand persist middleware — it handles SSR gracefully
// ✅ Or use httpOnly cookies for auth tokens (server-readable)
```

### ❌ Redux for Everything (including server data)

```tsx
// ❌ Bad — fetching in useEffect to store in Redux (old React pattern)
useEffect(() => {
  dispatch(fetchResumes()); // Network request → Redux → render
}, []);

// ✅ Good in Next.js — server fetch directly
// In Server Component: const resumes = await db.resume.findMany(...)
// Or client-side: useQuery(['resumes'], fetchResumes)
```

---

## 10. Senior Interview Q&A

---

**Q: Why can't you use Zustand or Redux in Server Components?**

> Server Components run exclusively on the server at request time — they have no access to browser APIs, React state, or any React hooks. Zustand and Redux both rely on React's `useState` and `useContext` under the hood, and they manage state in the browser's JavaScript runtime. Since Server Components are rendered to HTML on the server and sent to the browser without client-side JavaScript execution, there's no runtime to hold state in. You mark components with `'use client'` to opt into the browser runtime where these libraries work.

---

**Q: What's the SSR hydration mismatch problem with Zustand?**

> When Next.js server-renders a page, Server Components run and produce HTML. Client Components are also pre-rendered on the server to produce the initial HTML shell, but their JavaScript (including Zustand store initialization) runs later on the client during hydration. If the Zustand store's initial state on the client differs from what the server rendered — for example, the server knew the user was logged in but the Zustand store initializes with `user: null` — React sees a mismatch between server HTML and client HTML and either throws a hydration error or produces a flash of incorrect content. The fix is to synchronously hydrate the Zustand store from server-fetched data before the first render using a hydration provider component.

---

**Q: When would you choose RTK Query over TanStack Query in a Next.js app?**

> I'd choose RTK Query when the app is already using Redux Toolkit for global state — it integrates natively with the Redux store, meaning cached server data and client state live in the same DevTools timeline, and auth tokens in Redux are easily accessible in `prepareHeaders`. I'd choose TanStack Query when using Zustand or no global state library, because TanStack Query is framework-agnostic, has a dedicated DevTools panel, and has a more intuitive API for things like infinite queries, dependent queries, and optimistic updates. Both solve the same problem — avoiding duplicate network requests and keeping server state in sync — but TanStack Query is the better standalone choice for most Next.js apps.

---

**Q: Is Redux Toolkit overkill for most Next.js apps?**

> Yes, for most Next.js apps. The App Router shifts a lot of what Redux traditionally handled — data fetching, loading states, server data caching — to Server Components and `fetch()` caching. What's left for client state is usually UI state (modals, sidebar, theme), which Zustand handles with 1KB and near-zero boilerplate. Redux Toolkit becomes justified when you have complex state machines, need the full middleware system (e.g., logging, analytics), have a large team that benefits from enforced patterns, or are building something with the complexity of a code editor or admin platform. For a typical SaaS dashboard or content app in Next.js, Zustand + TanStack Query is the right default.

---

## Quick Revision Cheatsheet

```
Need global UI state (modal, theme, sidebar)?     → Zustand
Need client-side API caching?                     → TanStack Query
Already using RTK and need API caching?           → RTK Query
Building enterprise app with complex state?       → Redux Toolkit
Need auth state client-side?                      → Zustand (hydrate from server session)
Need form state?                                  → React Hook Form (never Redux/Zustand)
Data from DB for a page?                          → Server Component + direct fetch
Shared data between many client components?       → TanStack Query (not Redux)
SSR hydration mismatch with Zustand?              → Sync store before first render
Multiple tabs / cross-tab state sync?             → BroadcastChannel API + Zustand
```

---

*State management patterns for Next.js 14/15 App Router + TypeScript.*

---

## 11. Complex State Management in Next.js

> The key insight: **split your state by where it lives**, not by how complex it is.

### 🗂️ The 4-Layer Model

```
Layer 1 — Server State        →  Server Components + fetch() + DB
Layer 2 — Async Client State  →  TanStack Query (cache, sync, refetch)
Layer 3 — Global Client State →  Zustand (UI, preferences, cross-component)
Layer 4 — Local State         →  useState / useReducer / React Hook Form
```

Most "complex" state problems are solved by putting data in the **right layer**, not by choosing a bigger library.

---

### 🔴 Complex Scenario 1 — Multi-Step Form Wizard

```tsx
// store/useResumeWizardStore.ts
import { create } from 'zustand'

type Step = 'personal' | 'experience' | 'skills' | 'preview'

interface WizardState {
  currentStep: Step
  completedSteps: Step[]
  formData: {
    personal: PersonalInfo | null
    experience: Experience[]
    skills: Skill[]
  }
  goToStep: (step: Step) => void
  saveStep: <T extends keyof WizardState['formData']>(
    step: T,
    data: WizardState['formData'][T]
  ) => void
  reset: () => void
}

export const useResumeWizardStore = create<WizardState>()((set) => ({
  currentStep: 'personal',
  completedSteps: [],
  formData: { personal: null, experience: [], skills: [] },

  goToStep: (step) => set({ currentStep: step }),

  saveStep: (step, data) =>
    set((s) => ({
      formData: { ...s.formData, [step]: data },
      completedSteps: s.completedSteps.includes(step)
        ? s.completedSteps
        : [...s.completedSteps, step],
    })),

  reset: () =>
    set({ currentStep: 'personal', completedSteps: [], formData: { personal: null, experience: [], skills: [] } }),
}))
```

Each step uses **React Hook Form** locally — only the completed data goes into Zustand:

```tsx
// Step component — local form, global wizard state
'use client'
function PersonalInfoStep() {
  const { saveStep, goToStep } = useResumeWizardStore()
  const { register, handleSubmit } = useForm<PersonalInfo>()

  const onSubmit = (data: PersonalInfo) => {
    saveStep('personal', data)   // Save to wizard store
    goToStep('experience')       // Move to next step
  }

  return <form onSubmit={handleSubmit(onSubmit)}>...</form>
}
```

---

### 🔴 Complex Scenario 2 — Real-Time Notifications + Optimistic Updates

```tsx
// store/useNotificationStore.ts
import { create } from 'zustand'

interface Notification {
  id: string
  type: 'success' | 'error' | 'info'
  message: string
  duration?: number
}

interface NotificationState {
  queue: Notification[]
  push: (n: Omit<Notification, 'id'>) => void
  dismiss: (id: string) => void
}

export const useNotificationStore = create<NotificationState>()((set) => ({
  queue: [],
  push: (n) => {
    const id = crypto.randomUUID()
    set((s) => ({ queue: [...s.queue, { ...n, id }] }))
    if (n.duration !== 0) {
      setTimeout(
        () => set((s) => ({ queue: s.queue.filter((x) => x.id !== id) })),
        n.duration ?? 4000
      )
    }
  },
  dismiss: (id) => set((s) => ({ queue: s.queue.filter((x) => x.id !== id) })),
}))

// Optimistic delete with TanStack Query
function ResumeCard({ resume }: { resume: Resume }) {
  const push = useNotificationStore((s) => s.push)
  const queryClient = useQueryClient()

  const deleteMutation = useMutation({
    mutationFn: () => resumeService.delete(resume.id),

    // 1. Optimistically remove from UI before server responds
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['resumes'] })
      const previous = queryClient.getQueryData(['resumes'])
      queryClient.setQueryData(['resumes'], (old: Resume[]) =>
        old.filter((r) => r.id !== resume.id)
      )
      return { previous }
    },

    // 2. Roll back if server fails
    onError: (_err, _vars, context) => {
      queryClient.setQueryData(['resumes'], context?.previous)
      push({ type: 'error', message: 'Failed to delete resume' })
    },

    // 3. Sync with server on success
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['resumes'] })
      push({ type: 'success', message: 'Resume deleted' })
    },
  })
}
```

---

### 🔴 Complex Scenario 3 — Server Actions + Client State Sync

> The modern Next.js pattern — Server Actions mutate data, then Zustand/TanStack Query syncs the UI.

```tsx
// actions/resume.actions.ts
'use server'
import { revalidatePath } from 'next/cache'

export async function updateResumeAction(id: string, data: Partial<Resume>) {
  await db.resume.update({ where: { id }, data })
  revalidatePath('/dashboard') // Invalidates Server Component cache
  // Client state updates automatically because page re-renders with fresh data
}

// Client Component — combines Server Action + useOptimistic
'use client'
function ResumeEditor({ resume }: { resume: Resume }) {
  const [optimisticResume, updateOptimistic] = useOptimistic(
    resume,
    (state, newData: Partial<Resume>) => ({ ...state, ...newData })
  )

  async function handleSave(data: Partial<Resume>) {
    updateOptimistic(data)                         // Instant UI update
    await updateResumeAction(resume.id, data)      // Server mutation
    // revalidatePath re-renders Server Component with fresh DB data
  }
}
```

---

### 🔴 Complex Scenario 4 — Cross-Tab State Sync

```tsx
// store/useCollabStore.ts — syncs Zustand state across browser tabs
import { create } from 'zustand'

const channel = typeof window !== 'undefined'
  ? new BroadcastChannel('app-state')
  : null

interface CollabState {
  activeUsers: string[]
  setActiveUsers: (users: string[]) => void
}

export const useCollabStore = create<CollabState>()((set) => {
  // Listen for updates from other tabs
  channel?.addEventListener('message', (e) => {
    if (e.data.type === 'ACTIVE_USERS') {
      set({ activeUsers: e.data.payload })
    }
  })

  return {
    activeUsers: [],
    setActiveUsers: (users) => {
      set({ activeUsers: users })
      // Broadcast to other tabs
      channel?.postMessage({ type: 'ACTIVE_USERS', payload: users })
    },
  }
})
```

---

### 🔴 Complex Scenario 5 — Undo / Redo (History Stack)

```tsx
// store/useEditorStore.ts — temporal middleware for undo/redo
import { create } from 'zustand'
import { temporal } from 'zundo' // npm install zundo

interface EditorState {
  content: string
  fontSize: number
  setContent: (content: string) => void
  setFontSize: (size: number) => void
}

export const useEditorStore = create<EditorState>()(
  temporal(
    (set) => ({
      content: '',
      fontSize: 14,
      setContent: (content) => set({ content }),
      setFontSize: (fontSize) => set({ fontSize }),
    }),
    {
      // Only track content changes in history (not fontSize)
      partialize: (state) => ({ content: state.content }),
    }
  )
)

// In component:
// const { undo, redo, futureStates, pastStates } = useEditorStore.temporal.getState()
// <button onClick={undo} disabled={!pastStates.length}>Undo</button>
// <button onClick={redo} disabled={!futureStates.length}>Redo</button>
```

---

### 🏆 Decision Flow for Complex State

```
Is the data from the server/DB?
  → Yes → Server Component fetch() or TanStack Query
  → No  ↓

Is it form input state?
  → Yes → React Hook Form (never global store)
  → No  ↓

Is it needed across many components?
  → Yes → Zustand store
  → No  → useState / useReducer
         ↓

Is it async with loading/error states?
  → Yes → TanStack Query mutation / useTransition + useOptimistic
  → No  → Sync Zustand action

Does it need to survive page navigation?
  → Yes → Zustand persist middleware (localStorage)
  → No  → Regular Zustand (in-memory)

Does it need cross-tab sync?
  → Yes → BroadcastChannel + Zustand
  → No  → Regular Zustand

Does it need undo/redo?
  → Yes → zundo (temporal middleware for Zustand)
  → No  → Regular Zustand
```

---

### 📦 Recommended Stack for Complex Next.js App

| Concern | Solution |
|---|---|
| Server data | Server Components + `fetch()` |
| Client API cache | TanStack Query |
| UI / wizard state | Zustand |
| Form state | React Hook Form |
| Mutations with instant UI | `useOptimistic` + Server Actions |
| Notifications / toasts | Zustand queue |
| Cross-tab sync | BroadcastChannel + Zustand |
| Undo / Redo | `zundo` temporal middleware |
| Real-time (WebSocket) | Zustand + WebSocket event listener |

> 💡 **You almost never need Redux Toolkit in Next.js.** Zustand + TanStack Query handles 95% of production complexity with a fraction of the boilerplate.
