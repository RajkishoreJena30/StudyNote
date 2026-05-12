# ⚛️ Production-Grade Responsive Progressive Web App (PWA)
### Built with React — Beginner to Advanced Concepts Applied
#### Real-World Project: `TaskFlow` — A Collaborative Task Manager PWA
> **Scale**: 10k–100k users | **Stack**: React 18 + TypeScript + Redux Toolkit + React Router + PWA + Service Workers

---

## 📚 Table of Contents

1. [What is a PWA?](#1-what-is-a-pwa)
2. [Project Setup & Folder Structure](#2-project-setup--folder-structure)
3. [TypeScript + React Configuration](#3-typescript--react-configuration)
4. [Responsive Design System](#4-responsive-design-system)
5. [Component Architecture (Beginner Concepts Applied)](#5-component-architecture-beginner-concepts-applied)
6. [State Management with Redux Toolkit](#6-state-management-with-redux-toolkit)
7. [React Router — Navigation & Protected Routes](#7-react-router--navigation--protected-routes)
8. [Advanced Hooks in Action](#8-advanced-hooks-in-action)
9. [Context API — Theme & Auth](#9-context-api--theme--auth)
10. [Performance Optimization](#10-performance-optimization)
11. [PWA — Service Worker & Manifest](#11-pwa--service-worker--manifest)
12. [Offline Support & Background Sync](#12-offline-support--background-sync)
13. [Push Notifications](#13-push-notifications)
14. [Error Boundaries in Production](#14-error-boundaries-in-production)
15. [React Suspense & Code Splitting](#15-react-suspense--code-splitting)
16. [Forms — React Hook Form + Zod](#16-forms--react-hook-form--zod)
17. [Real-Time with WebSockets (Socket.io)](#17-real-time-with-websockets-socketio)
18. [Accessibility (a11y)](#18-accessibility-a11y)
19. [Testing — Unit, Integration & E2E](#19-testing--unit-integration--e2e)
20. [CI/CD & Deployment](#20-cicd--deployment)
21. [PWA Audit Checklist](#21-pwa-audit-checklist)
22. [Senior Interview Q&A](#22-senior-interview-qa)

---

## 1. What is a PWA?

A **Progressive Web App (PWA)** is a web application that uses modern browser APIs to deliver **app-like experiences** — installable, offline-capable, fast, and responsive — directly from the browser.

### PWA vs Native App vs Web App

| Feature | Web App | PWA | Native App |
|---|---|---|---|
| **Installable** | ❌ | ✅ Add to Home Screen | ✅ App Store |
| **Offline support** | ❌ | ✅ Service Worker | ✅ |
| **Push notifications** | ❌ | ✅ | ✅ |
| **App-like UI** | ❌ | ✅ Full-screen | ✅ |
| **No app store needed** | ✅ | ✅ | ❌ |
| **Automatic updates** | ✅ | ✅ | ❌ Manual |
| **Cross-platform** | ✅ | ✅ | ❌ Per platform |
| **Performance** | Moderate | High | Highest |
| **Device APIs** | Limited | Camera, GPS, Bluetooth | Full access |

### Core PWA Pillars

```
PWA
├── Reliable      → Works offline (Service Worker + Cache API)
├── Fast          → Instant load, smooth interactions (Precaching, lazy loading)
├── Engaging      → Push notifications, installable, full-screen
└── Responsive    → Works on all screen sizes
```

### PWA Architecture Diagram

```
Browser
│
├─── React App (SPA)
│       ├── Components (UI)
│       ├── Redux Store (State)
│       ├── React Router (Navigation)
│       └── Service Worker Registration
│
├─── Service Worker (Background Thread)
│       ├── Cache Strategy (Network First / Cache First / Stale-While-Revalidate)
│       ├── Background Sync (offline mutations)
│       └── Push Notification Handler
│
├─── Web App Manifest (manifest.json)
│       ├── App name, icons, theme color
│       └── display: standalone (removes browser chrome)
│
└─── HTTPS (Required for PWA features)
```

---

## 2. Project Setup & Folder Structure

### Create Project with Vite (Recommended for PWA)

```bash
npm create vite@latest taskflow -- --template react-ts
cd taskflow
npm install

# Core dependencies
npm install react-router-dom @reduxjs/toolkit react-redux axios socket.io-client

# Forms & Validation
npm install react-hook-form zod @hookform/resolvers

# UI & Styling
npm install tailwindcss @tailwindcss/vite

# PWA
npm install -D vite-plugin-pwa workbox-window

# Testing
npm install -D vitest @testing-library/react @testing-library/user-event @testing-library/jest-dom jsdom

# Dev tools
npm install -D eslint prettier typescript
```

### Production Folder Structure

```
taskflow/
├── public/
│   ├── icons/                    # PWA icons (72,96,128,144,152,192,384,512px)
│   ├── screenshots/              # PWA install screenshots
│   └── robots.txt
│
├── src/
│   ├── assets/                   # Images, fonts, static files
│   │
│   ├── components/               # Reusable UI components
│   │   ├── ui/                   # Base design system components
│   │   │   ├── Button/
│   │   │   │   ├── Button.tsx
│   │   │   │   ├── Button.test.tsx
│   │   │   │   └── index.ts
│   │   │   ├── Input/
│   │   │   ├── Modal/
│   │   │   ├── Toast/
│   │   │   └── Spinner/
│   │   │
│   │   ├── layout/               # Layout components
│   │   │   ├── AppShell.tsx      # Main layout wrapper
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── BottomNav.tsx     # Mobile bottom navigation
│   │   │
│   │   └── features/             # Feature-specific components
│   │       ├── tasks/
│   │       ├── auth/
│   │       └── dashboard/
│   │
│   ├── pages/                    # Route-level page components
│   │   ├── Dashboard.tsx
│   │   ├── Tasks.tsx
│   │   ├── TaskDetail.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   ├── Profile.tsx
│   │   ├── Settings.tsx
│   │   ├── Offline.tsx           # Shown when fully offline
│   │   └── NotFound.tsx
│   │
│   ├── hooks/                    # Custom hooks
│   │   ├── useAuth.ts
│   │   ├── useFetch.ts
│   │   ├── useDebounce.ts
│   │   ├── useOnline.ts          # Network status
│   │   ├── useInstallPrompt.ts   # PWA install prompt
│   │   ├── useLocalStorage.ts
│   │   ├── usePushNotification.ts
│   │   └── useWindowSize.ts
│   │
│   ├── store/                    # Redux Toolkit
│   │   ├── index.ts              # Configure store
│   │   ├── slices/
│   │   │   ├── authSlice.ts
│   │   │   ├── tasksSlice.ts
│   │   │   ├── uiSlice.ts
│   │   │   └── notificationSlice.ts
│   │   └── api/
│   │       └── taskApi.ts        # RTK Query
│   │
│   ├── context/                  # React Context API
│   │   ├── ThemeContext.tsx
│   │   └── SocketContext.tsx
│   │
│   ├── router/                   # React Router config
│   │   ├── index.tsx
│   │   ├── ProtectedRoute.tsx
│   │   └── routes.ts
│   │
│   ├── services/                 # API + external service calls
│   │   ├── api.ts                # Axios instance
│   │   ├── authService.ts
│   │   └── taskService.ts
│   │
│   ├── types/                    # TypeScript types
│   │   ├── task.types.ts
│   │   ├── user.types.ts
│   │   └── api.types.ts
│   │
│   ├── utils/                    # Pure utility functions
│   │   ├── formatDate.ts
│   │   ├── storage.ts
│   │   └── cn.ts                 # Tailwind classname utility
│   │
│   ├── sw/
│   │   └── service-worker.ts     # Custom service worker logic
│   │
│   ├── App.tsx                   # Root component
│   ├── main.tsx                  # Entry point
│   └── vite-env.d.ts
│
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── index.html
└── package.json
```

---

## 3. TypeScript + React Configuration

### vite.config.ts with PWA Plugin

```typescript
// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite';
import path from 'path';

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
      manifest: {
        name: 'TaskFlow — Collaborative Task Manager',
        short_name: 'TaskFlow',
        description: 'Manage tasks collaboratively, even offline',
        theme_color: '#6366f1',
        background_color: '#ffffff',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/',
        start_url: '/',
        icons: [
          { src: '/icons/icon-72x72.png',   sizes: '72x72',   type: 'image/png' },
          { src: '/icons/icon-96x96.png',   sizes: '96x96',   type: 'image/png' },
          { src: '/icons/icon-128x128.png', sizes: '128x128', type: 'image/png' },
          { src: '/icons/icon-144x144.png', sizes: '144x144', type: 'image/png' },
          { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png', purpose: 'any maskable' },
          { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any maskable' },
        ],
        screenshots: [
          { src: '/screenshots/desktop.png', sizes: '1280x720', type: 'image/png', form_factor: 'wide' },
          { src: '/screenshots/mobile.png',  sizes: '390x844',  type: 'image/png', form_factor: 'narrow' },
        ],
        shortcuts: [
          { name: 'New Task', url: '/tasks/new', icons: [{ src: '/icons/add-task.png', sizes: '192x192' }] },
          { name: 'Dashboard', url: '/dashboard' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.taskflow\.com\/tasks/,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'tasks-cache',
              expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 },
              networkTimeoutSeconds: 5,
            },
          },
          {
            urlPattern: /^https:\/\/api\.taskflow\.com\/users/,
            handler: 'StaleWhileRevalidate',
            options: { cacheName: 'users-cache' },
          },
          {
            urlPattern: /^https:\/\/res\.cloudinary\.com/,
            handler: 'CacheFirst',
            options: {
              cacheName: 'images-cache',
              expiration: { maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 },
            },
          },
        ],
      },
    }),
  ],
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
```

### TypeScript Types

```typescript
// src/types/task.types.ts
export enum TaskStatus {
  TODO       = 'todo',
  IN_PROGRESS = 'in_progress',
  REVIEW     = 'review',
  DONE       = 'done',
}

export enum TaskPriority {
  LOW    = 'low',
  MEDIUM = 'medium',
  HIGH   = 'high',
  URGENT = 'urgent',
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignee?: User;
  tags: string[];
  dueDate?: string;
  createdAt: string;
  updatedAt: string;
  projectId: string;
}

export interface CreateTaskDTO {
  title: string;
  description?: string;
  status?: TaskStatus;
  priority?: TaskPriority;
  assigneeId?: string;
  dueDate?: string;
  tags?: string[];
}

// src/types/user.types.ts
export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
}

export interface AuthState {
  user: User | null;
  accessToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}
```

---

## 4. Responsive Design System

### Tailwind Config + Design Tokens

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary:   { DEFAULT: '#6366f1', dark: '#4f46e5', light: '#818cf8' },
        secondary: { DEFAULT: '#ec4899', dark: '#db2777', light: '#f472b6' },
        success:   '#10b981',
        warning:   '#f59e0b',
        danger:    '#ef4444',
      },
      screens: {
        xs: '375px',
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1536px',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      spacing: { 18: '4.5rem', 88: '22rem' },
      animation: {
        'slide-in':  'slideIn 0.3s ease-out',
        'fade-in':   'fadeIn 0.2s ease-in',
        'bounce-in': 'bounceIn 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
};
export default config;
```

### Responsive App Shell Layout

```tsx
// src/components/layout/AppShell.tsx
import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import { useWindowSize } from '@/hooks/useWindowSize';
import { useOnline } from '@/hooks/useOnline';
import OfflineBanner from '../ui/OfflineBanner';

const AppShell: React.FC = () => {
  const { width } = useWindowSize();
  const isOnline = useOnline();
  const isMobile = width < 768;

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">

      {/* Sidebar — hidden on mobile */}
      {!isMobile && (
        <aside className="w-64 shrink-0 border-r border-gray-200 dark:border-gray-700
                          bg-white dark:bg-gray-800 flex flex-col">
          <Sidebar />
        </aside>
      )}

      {/* Main content area */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Top navbar */}
        <header className="h-16 border-b border-gray-200 dark:border-gray-700
                           bg-white dark:bg-gray-800 shrink-0 z-10">
          <Navbar />
        </header>

        {/* Offline banner */}
        {!isOnline && <OfflineBanner />}

        {/* Scrollable page content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>

        {/* Bottom nav — mobile only */}
        {isMobile && (
          <nav className="h-16 border-t border-gray-200 dark:border-gray-700
                         bg-white dark:bg-gray-800 shrink-0">
            <BottomNav />
          </nav>
        )}
      </div>
    </div>
  );
};

export default AppShell;
```

### Responsive Task Card Component

```tsx
// src/components/features/tasks/TaskCard.tsx
import React, { memo } from 'react';
import { Task, TaskPriority, TaskStatus } from '@/types/task.types';
import { formatDistanceToNow } from 'date-fns';

const priorityConfig: Record<TaskPriority, { label: string; classes: string }> = {
  [TaskPriority.LOW]:    { label: 'Low',    classes: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400' },
  [TaskPriority.MEDIUM]: { label: 'Medium', classes: 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300' },
  [TaskPriority.HIGH]:   { label: 'High',   classes: 'bg-orange-100 text-orange-700 dark:bg-orange-900 dark:text-orange-300' },
  [TaskPriority.URGENT]: { label: 'Urgent', classes: 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-300' },
};

interface TaskCardProps {
  task: Task;
  onStatusChange: (id: string, status: TaskStatus) => void;
  onDelete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = memo(({ task, onStatusChange, onDelete }) => {
  const priority = priorityConfig[task.priority];
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== TaskStatus.DONE;

  return (
    <article
      className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700
                 shadow-sm hover:shadow-md transition-shadow duration-200 p-4
                 cursor-pointer group"
      role="article"
      aria-label={`Task: ${task.title}`}
    >
      {/* Priority badge + actions */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${priority.classes}`}>
          {priority.label}
        </span>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
          className="opacity-0 group-hover:opacity-100 transition-opacity
                     text-gray-400 hover:text-red-500 p-1 rounded"
          aria-label="Delete task"
        >
          ✕
        </button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-gray-900 dark:text-white mb-2
                     line-clamp-2 leading-snug">
        {task.title}
      </h3>

      {/* Description — truncated */}
      {task.description && (
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-3 line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Tags */}
      {task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {task.tags.slice(0, 3).map((tag) => (
            <span key={tag}
              className="text-xs bg-indigo-50 dark:bg-indigo-900 text-indigo-600
                         dark:text-indigo-300 px-2 py-0.5 rounded-md">
              #{tag}
            </span>
          ))}
          {task.tags.length > 3 && (
            <span className="text-xs text-gray-400">+{task.tags.length - 3}</span>
          )}
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-3 border-t
                      border-gray-100 dark:border-gray-700">
        {/* Assignee avatar */}
        {task.assignee && (
          <div className="flex items-center gap-2">
            <img
              src={task.assignee.avatar ?? `https://ui-avatars.com/api/?name=${task.assignee.name}`}
              alt={task.assignee.name}
              className="w-6 h-6 rounded-full"
            />
            <span className="text-xs text-gray-500 dark:text-gray-400 hidden sm:block">
              {task.assignee.name}
            </span>
          </div>
        )}

        {/* Due date */}
        {task.dueDate && (
          <span className={`text-xs ml-auto ${isOverdue ? 'text-red-500 font-semibold' : 'text-gray-400'}`}>
            {isOverdue ? '⚠️ ' : '📅 '}
            {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
          </span>
        )}
      </div>
    </article>
  );
});

TaskCard.displayName = 'TaskCard';
export default TaskCard;
```

---

## 5. Component Architecture (Beginner Concepts Applied)

### JSX, Props, State — Login Page

```tsx
// src/pages/Login.tsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store';
import { loginThunk } from '@/store/slices/authSlice';

// Props interface (TypeScript props)
interface LoginFormProps {
  onSuccess?: () => void;
}

// Function component with state + props
const LoginPage: React.FC<LoginFormProps> = ({ onSuccess }) => {
  // useState hooks for local form state
  const [email,    setEmail]    = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);

  // Redux state
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  const navigate  = useNavigate();
  const location  = useLocation();
  const from      = (location.state as any)?.from?.pathname ?? '/dashboard';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await dispatch(loginThunk({ email, password }));
    if (loginThunk.fulfilled.match(result)) {
      onSuccess?.();
      navigate(from, { replace: true });
    }
  };

  return (
    // Responsive: centered on mobile, card on desktop
    <div className="min-h-screen flex items-center justify-center
                    bg-gradient-to-br from-indigo-50 to-purple-50
                    dark:from-gray-900 dark:to-gray-800 p-4">

      <div className="w-full max-w-md bg-white dark:bg-gray-800
                      rounded-2xl shadow-xl p-8 animate-fade-in">

        {/* Logo + Heading */}
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">✅</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">
            Sign in to TaskFlow
          </p>
        </div>

        {/* Error message */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200
                          dark:border-red-800 rounded-lg text-red-600 dark:text-red-400
                          text-sm flex items-center gap-2" role="alert">
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5" noValidate>
          {/* Email */}
          <div>
            <label htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                         transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                autoComplete="current-password"
                className="w-full px-4 py-2.5 pr-12 rounded-lg border border-gray-300
                           dark:border-gray-600 bg-white dark:bg-gray-700
                           text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500
                           focus:border-transparent transition-colors"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPass(!showPass)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400
                           hover:text-gray-600 dark:hover:text-gray-300"
                aria-label={showPass ? 'Hide password' : 'Show password'}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isLoading || !email || !password}
            className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-700
                       disabled:bg-indigo-300 text-white font-semibold rounded-lg
                       transition-colors focus:ring-2 focus:ring-indigo-500
                       focus:ring-offset-2 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white
                                 rounded-full animate-spin" />
                Signing in...
              </span>
            ) : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mt-6">
          Don't have an account?{' '}
          <Link to="/register" className="text-indigo-600 hover:underline font-medium">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
```

---

## 6. State Management with Redux Toolkit

### Store Configuration

```typescript
// src/store/index.ts
import { configureStore } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import authReducer     from './slices/authSlice';
import tasksReducer    from './slices/tasksSlice';
import uiReducer       from './slices/uiSlice';
import { taskApi }     from './api/taskApi';

export const store = configureStore({
  reducer: {
    auth:          authReducer,
    tasks:         tasksReducer,
    ui:            uiReducer,
    [taskApi.reducerPath]: taskApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(taskApi.middleware),
  devTools: process.env.NODE_ENV !== 'production',
});

export type RootState   = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
```

### Auth Slice with createAsyncThunk

```typescript
// src/store/slices/authSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthState, User }  from '@/types/user.types';
import { authService }      from '@/services/authService';

const initialState: AuthState = {
  user:            JSON.parse(localStorage.getItem('user') ?? 'null'),
  accessToken:     localStorage.getItem('accessToken'),
  isAuthenticated: !!localStorage.getItem('accessToken'),
  isLoading:       false,
  error:           null,
};

// Async thunks
export const loginThunk = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await authService.login(credentials);
      localStorage.setItem('accessToken', response.accessToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      return response;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error ?? 'Login failed');
    }
  }
);

export const logoutThunk = createAsyncThunk('auth/logout', async (_, { rejectWithValue }) => {
  try {
    await authService.logout();
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  } catch (err: any) {
    return rejectWithValue(err.message);
  }
});

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.isAuthenticated = true;
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending,   (state) => { state.isLoading = true;  state.error = null; })
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading      = false;
        state.user           = action.payload.user;
        state.accessToken    = action.payload.accessToken;
        state.isAuthenticated = true;
      })
      .addCase(loginThunk.rejected, (state, action) => {
        state.isLoading = false;
        state.error     = action.payload as string;
      })
      // Logout
      .addCase(logoutThunk.fulfilled, (state) => {
        state.user            = null;
        state.accessToken     = null;
        state.isAuthenticated = false;
      });
  },
});

export const { setUser, clearError } = authSlice.actions;
export default authSlice.reducer;
```

### RTK Query — Tasks API

```typescript
// src/store/api/taskApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState }       from '../index';
import type { Task, CreateTaskDTO } from '@/types/task.types';

export const taskApi = createApi({
  reducerPath: 'taskApi',
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL + '/api/v1',
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.accessToken;
      if (token) headers.set('Authorization', `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ['Task'],
  endpoints: (builder) => ({
    getTasks: builder.query<Task[], { projectId: string; status?: string }>({
      query: ({ projectId, status }) => ({
        url: '/tasks',
        params: { projectId, ...(status && { status }) },
      }),
      providesTags: (result) =>
        result
          ? [...result.map(({ id }) => ({ type: 'Task' as const, id })), 'Task']
          : ['Task'],
    }),

    getTask: builder.query<Task, string>({
      query: (id) => `/tasks/${id}`,
      providesTags: (_result, _err, id) => [{ type: 'Task', id }],
    }),

    createTask: builder.mutation<Task, CreateTaskDTO>({
      query: (body) => ({ url: '/tasks', method: 'POST', body }),
      invalidatesTags: ['Task'],
    }),

    updateTask: builder.mutation<Task, { id: string; data: Partial<CreateTaskDTO> }>({
      query: ({ id, data }) => ({ url: `/tasks/${id}`, method: 'PATCH', body: data }),
      invalidatesTags: (_result, _err, { id }) => [{ type: 'Task', id }],
    }),

    deleteTask: builder.mutation<void, string>({
      query: (id) => ({ url: `/tasks/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Task'],
    }),
  }),
});

export const {
  useGetTasksQuery,
  useGetTaskQuery,
  useCreateTaskMutation,
  useUpdateTaskMutation,
  useDeleteTaskMutation,
} = taskApi;
```

---

## 7. React Router — Navigation & Protected Routes

```tsx
// src/router/index.tsx
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AppShell       from '@/components/layout/AppShell';
import ProtectedRoute from './ProtectedRoute';
import Spinner        from '@/components/ui/Spinner';

// Lazy-loaded pages (code splitting)
const Dashboard  = lazy(() => import('@/pages/Dashboard'));
const Tasks      = lazy(() => import('@/pages/Tasks'));
const TaskDetail = lazy(() => import('@/pages/TaskDetail'));
const Profile    = lazy(() => import('@/pages/Profile'));
const Settings   = lazy(() => import('@/pages/Settings'));
const Login      = lazy(() => import('@/pages/Login'));
const Register   = lazy(() => import('@/pages/Register'));
const NotFound   = lazy(() => import('@/pages/NotFound'));

const PageLoader = () => (
  <div className="flex items-center justify-center h-64">
    <Spinner size="lg" />
  </div>
);

const AppRouter: React.FC = () => (
  <BrowserRouter>
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* Public routes */}
        <Route path="/login"    element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Protected routes — wrapped in AppShell */}
        <Route element={<ProtectedRoute />}>
          <Route element={<AppShell />}>
            <Route index element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard"     element={<Dashboard />} />
            <Route path="/tasks"         element={<Tasks />} />
            <Route path="/tasks/new"     element={<TaskDetail mode="create" />} />
            <Route path="/tasks/:id"     element={<TaskDetail mode="edit" />} />
            <Route path="/profile"       element={<Profile />} />
            <Route path="/settings"      element={<Settings />} />
          </Route>
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  </BrowserRouter>
);

export default AppRouter;
```

### Protected Route

```tsx
// src/router/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '@/store';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent
                        rounded-full animate-spin" />
      </div>
    );
  }

  return isAuthenticated
    ? <Outlet />
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default ProtectedRoute;
```

---

## 8. Advanced Hooks in Action

### Custom Hook — useFetch with Caching

```typescript
// src/hooks/useFetch.ts
import { useState, useEffect, useRef, useCallback } from 'react';

interface FetchState<T> {
  data:    T | null;
  loading: boolean;
  error:   string | null;
}

const cache = new Map<string, unknown>();

export function useFetch<T>(url: string | null) {
  const [state, setState] = useState<FetchState<T>>({
    data: null, loading: !!url, error: null,
  });
  const abortRef = useRef<AbortController | null>(null);

  const fetchData = useCallback(async (fetchUrl: string) => {
    // Return cached data immediately
    if (cache.has(fetchUrl)) {
      setState({ data: cache.get(fetchUrl) as T, loading: false, error: null });
      return;
    }

    abortRef.current?.abort();
    abortRef.current = new AbortController();
    setState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const res = await fetch(fetchUrl, { signal: abortRef.current.signal });
      if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
      const data: T = await res.json();
      cache.set(fetchUrl, data);
      setState({ data, loading: false, error: null });
    } catch (err: any) {
      if (err.name !== 'AbortError') {
        setState((prev) => ({ ...prev, loading: false, error: err.message }));
      }
    }
  }, []);

  useEffect(() => {
    if (url) fetchData(url);
    return () => abortRef.current?.abort();
  }, [url, fetchData]);

  const refetch = useCallback(() => { if (url) fetchData(url); }, [url, fetchData]);

  return { ...state, refetch };
}
```

### Custom Hook — useOnline (Network Status)

```typescript
// src/hooks/useOnline.ts
import { useState, useEffect } from 'react';

export function useOnline(): boolean {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);

    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
}
```

### Custom Hook — useInstallPrompt (PWA Install)

```typescript
// src/hooks/useInstallPrompt.ts
import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function useInstallPrompt() {
  const [prompt,       setPrompt]      = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstalled,  setIsInstalled] = useState(false);
  const [isInstallable, setInstallable] = useState(false);

  useEffect(() => {
    // Check if already installed (standalone mode)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setPrompt(e as BeforeInstallPromptEvent);
      setInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setInstallable(false);
      setPrompt(null);
    });

    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const install = async (): Promise<boolean> => {
    if (!prompt) return false;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    setPrompt(null);
    setInstallable(false);
    return outcome === 'accepted';
  };

  return { isInstallable, isInstalled, install };
}
```

### Custom Hook — useDebounce

```typescript
// src/hooks/useDebounce.ts
import { useState, useEffect } from 'react';

export function useDebounce<T>(value: T, delay: number = 300): T {
  const [debounced, setDebounced] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debounced;
}
```

---

## 9. Context API — Theme & Auth

### Theme Context (Dark Mode)

```tsx
// src/context/ThemeContext.tsx
import React, {
  createContext, useContext, useState, useEffect, useCallback, ReactNode
} from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextValue {
  theme:        Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme:     (theme: Theme) => void;
  toggleTheme:  () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export const ThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(
    () => (localStorage.getItem('theme') as Theme) ?? 'system'
  );

  const getSystemTheme = (): 'light' | 'dark' =>
    window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';

  const resolvedTheme: 'light' | 'dark' = theme === 'system' ? getSystemTheme() : theme;

  useEffect(() => {
    const root = document.documentElement;
    root.classList.toggle('dark', resolvedTheme === 'dark');
    root.style.colorScheme = resolvedTheme;
    localStorage.setItem('theme', theme);
  }, [theme, resolvedTheme]);

  // Listen for system preference changes
  useEffect(() => {
    if (theme !== 'system') return;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const handler = () => setThemeState('system'); // re-trigger resolved
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, [theme]);

  const setTheme = useCallback((newTheme: Theme) => setThemeState(newTheme), []);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => prev === 'dark' ? 'light' : 'dark');
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, resolvedTheme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = (): ThemeContextValue => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};
```

### Socket Context — Real-Time

```tsx
// src/context/SocketContext.tsx
import React, {
  createContext, useContext, useEffect, useRef, ReactNode
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppSelector, useAppDispatch } from '@/store';
import { taskApi } from '@/store/api/taskApi';

const SocketContext = createContext<Socket | null>(null);

export const SocketProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const socketRef   = useRef<Socket | null>(null);
  const { accessToken, isAuthenticated } = useAppSelector((s) => s.auth);
  const dispatch    = useAppDispatch();

  useEffect(() => {
    if (!isAuthenticated || !accessToken) return;

    socketRef.current = io(import.meta.env.VITE_WS_URL, {
      auth: { token: accessToken },
      transports: ['websocket'],
      reconnectionAttempts: 5,
    });

    const socket = socketRef.current;

    socket.on('connect', () => console.log('[Socket] Connected'));

    // When another user updates a task — invalidate RTK Query cache
    socket.on('task:updated', ({ taskId }: { taskId: string }) => {
      dispatch(taskApi.util.invalidateTags([{ type: 'Task', id: taskId }]));
    });

    socket.on('task:created', () => {
      dispatch(taskApi.util.invalidateTags(['Task']));
    });

    socket.on('disconnect', (reason) => console.log('[Socket] Disconnected:', reason));

    return () => { socket.disconnect(); };
  }, [isAuthenticated, accessToken, dispatch]);

  return (
    <SocketContext.Provider value={socketRef.current}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => useContext(SocketContext);
```

---

## 10. Performance Optimization

### React.memo + useCallback on Task Board

```tsx
// src/pages/Tasks.tsx
import React, { useState, useMemo, useCallback, useTransition, useDeferredValue } from 'react';
import TaskCard   from '@/components/features/tasks/TaskCard';
import { useGetTasksQuery, useUpdateTaskMutation, useDeleteTaskMutation } from '@/store/api/taskApi';
import { TaskStatus } from '@/types/task.types';
import { useDebounce } from '@/hooks/useDebounce';

const COLUMNS: { id: TaskStatus; label: string; color: string }[] = [
  { id: TaskStatus.TODO,        label: 'To Do',      color: 'bg-gray-100 dark:bg-gray-800' },
  { id: TaskStatus.IN_PROGRESS, label: 'In Progress', color: 'bg-blue-50 dark:bg-blue-900/20' },
  { id: TaskStatus.REVIEW,      label: 'Review',     color: 'bg-yellow-50 dark:bg-yellow-900/20' },
  { id: TaskStatus.DONE,        label: 'Done',       color: 'bg-green-50 dark:bg-green-900/20' },
];

const TasksPage: React.FC = () => {
  const [search,     setSearch]     = useState('');
  const [isPending,  startTransition] = useTransition();

  // Debounce search input — avoid filtering on every keystroke
  const debouncedSearch = useDebounce(search, 300);

  // useDeferredValue for non-urgent filtering
  const deferredSearch = useDeferredValue(debouncedSearch);

  const { data: tasks = [], isLoading } = useGetTasksQuery({ projectId: 'current' });
  const [updateTask]  = useUpdateTaskMutation();
  const [deleteTask]  = useDeleteTaskMutation();

  // useMemo — only recompute when tasks or search changes
  const filteredTasks = useMemo(() => {
    if (!deferredSearch) return tasks;
    const lower = deferredSearch.toLowerCase();
    return tasks.filter((t) =>
      t.title.toLowerCase().includes(lower) ||
      t.tags.some((tag) => tag.includes(lower))
    );
  }, [tasks, deferredSearch]);

  // Memoized tasks per column
  const tasksByStatus = useMemo(
    () => Object.fromEntries(
      COLUMNS.map((col) => [col.id, filteredTasks.filter((t) => t.status === col.id)])
    ),
    [filteredTasks]
  );

  // useCallback — stable references for memoized TaskCard children
  const handleStatusChange = useCallback(
    (id: string, status: TaskStatus) => {
      startTransition(() => { updateTask({ id, data: { status } }); });
    },
    [updateTask]
  );

  const handleDelete = useCallback(
    (id: string) => { deleteTask(id); },
    [deleteTask]
  );

  if (isLoading) return <KanbanSkeleton />;

  return (
    <div className="space-y-6">
      {/* Search */}
      <input
        type="search"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search tasks..."
        className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300
                   dark:border-gray-600 bg-white dark:bg-gray-800
                   focus:ring-2 focus:ring-indigo-500 outline-none"
      />

      {/* Kanban board — responsive grid */}
      <div className={`grid gap-4
        grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
        ${isPending ? 'opacity-70 pointer-events-none' : ''}`}>
        {COLUMNS.map((col) => (
          <div key={col.id} className={`rounded-xl p-4 ${col.color}`}>
            <h2 className="font-semibold text-gray-700 dark:text-gray-300 mb-3 flex
                           items-center justify-between">
              {col.label}
              <span className="text-xs bg-white dark:bg-gray-700 text-gray-500
                               px-2 py-0.5 rounded-full">
                {tasksByStatus[col.id]?.length ?? 0}
              </span>
            </h2>

            <div className="space-y-3 min-h-[200px]">
              {tasksByStatus[col.id]?.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={handleStatusChange}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Skeleton loader — prevents layout shift
const KanbanSkeleton: React.FC = () => (
  <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
    {[...Array(4)].map((_, i) => (
      <div key={i} className="rounded-xl p-4 bg-gray-100 dark:bg-gray-800 space-y-3">
        <div className="h-5 w-24 bg-gray-200 dark:bg-gray-700 rounded animate-pulse" />
        {[...Array(3)].map((_, j) => (
          <div key={j} className="h-28 bg-gray-200 dark:bg-gray-700 rounded-xl animate-pulse" />
        ))}
      </div>
    ))}
  </div>
);

export default TasksPage;
```

---

## 11. PWA — Service Worker & Manifest

### Workbox Caching Strategies

```
Strategy              | When to Use
────────────────────────────────────────────────────────
Cache First           | Static assets (JS, CSS, fonts, images) — never change
Network First         | API data — freshness matters, but fallback to cache
Stale-While-Revalidate| User profiles, config — show cached, update in bg
Network Only          | Payment, auth — must be live
Cache Only            | App shell — pre-cached at install
```

### Custom Service Worker

```typescript
// src/sw/service-worker.ts
import { precacheAndRoute, cleanupOutdatedCaches }  from 'workbox-precaching';
import { registerRoute }                            from 'workbox-routing';
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies';
import { BackgroundSyncPlugin }                     from 'workbox-background-sync';
import { ExpirationPlugin }                         from 'workbox-expiration';

declare let self: ServiceWorkerGlobalScope;

// Precache all files generated by Vite (injected at build time)
precacheAndRoute(self.__WB_MANIFEST);
cleanupOutdatedCaches();

// ── Runtime Caching ──────────────────────────────────────────

// API: Tasks — NetworkFirst (fresh data, cached fallback)
registerRoute(
  ({ url }) => url.pathname.startsWith('/api/v1/tasks'),
  new NetworkFirst({
    cacheName: 'tasks-api',
    plugins: [
      new ExpirationPlugin({ maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }),
    ],
    networkTimeoutSeconds: 5,
  })
);

// Images — CacheFirst
registerRoute(
  ({ request }) => request.destination === 'image',
  new CacheFirst({
    cacheName: 'images',
    plugins: [
      new ExpirationPlugin({ maxEntries: 200, maxAgeSeconds: 60 * 60 * 24 * 30 }),
    ],
  })
);

// Google Fonts — StaleWhileRevalidate
registerRoute(
  ({ url }) => url.origin === 'https://fonts.googleapis.com',
  new StaleWhileRevalidate({ cacheName: 'google-fonts-stylesheets' })
);

// ── Background Sync — queue failed mutations ─────────────────
const bgSyncPlugin = new BackgroundSyncPlugin('task-mutations', {
  maxRetentionTime: 24 * 60, // Retry for 24 hours
});

registerRoute(
  ({ url, request }) =>
    url.pathname.startsWith('/api/v1/tasks') &&
    ['POST', 'PATCH', 'DELETE'].includes(request.method),
  new NetworkFirst({ plugins: [bgSyncPlugin] }),
  'POST'
);

// ── Push Notifications ───────────────────────────────────────
self.addEventListener('push', (event: PushEvent) => {
  const data = event.data?.json() ?? {};
  event.waitUntil(
    self.registration.showNotification(data.title ?? 'TaskFlow', {
      body:    data.body ?? 'You have a new notification',
      icon:    '/icons/icon-192x192.png',
      badge:   '/icons/badge-72x72.png',
      data:    { url: data.url ?? '/dashboard' },
      actions: [
        { action: 'view',    title: '👁️ View' },
        { action: 'dismiss', title: '✕ Dismiss' },
      ],
      tag: data.tag ?? 'default',
      renotify: true,
    })
  );
});

// Handle notification click
self.addEventListener('notificationclick', (event: NotificationEvent) => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const url = event.notification.data?.url ?? '/';
  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windows) => {
      const existing = windows.find((w) => w.url === url);
      return existing ? existing.focus() : clients.openWindow(url);
    })
  );
});

// ── Skip waiting & claim clients on new SW ───────────────────
self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
```

### SW Registration & Update Banner

```tsx
// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { registerSW } from 'virtual:pwa-register';
import App         from './App';
import { store }   from './store';
import './index.css';

// Register SW with update handler
const updateSW = registerSW({
  onNeedRefresh() {
    // Show a UI prompt asking user to refresh
    window.dispatchEvent(new CustomEvent('sw:update-available'));
  },
  onOfflineReady() {
    window.dispatchEvent(new CustomEvent('sw:offline-ready'));
  },
});

window.addEventListener('sw:skip-waiting', () => updateSW(true));

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </React.StrictMode>
);
```

```tsx
// src/components/ui/UpdateBanner.tsx — notify user of new app version
import React, { useState, useEffect } from 'react';

const UpdateBanner: React.FC = () => {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handler = () => setShow(true);
    window.addEventListener('sw:update-available', handler);
    return () => window.removeEventListener('sw:update-available', handler);
  }, []);

  if (!show) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:w-96
                    bg-indigo-600 text-white rounded-xl shadow-2xl p-4 z-50
                    animate-slide-in flex items-center gap-3">
      <span className="text-2xl">🔄</span>
      <div className="flex-1">
        <p className="font-semibold text-sm">Update available!</p>
        <p className="text-xs text-indigo-200">Restart to get the latest version.</p>
      </div>
      <button
        onClick={() => window.dispatchEvent(new CustomEvent('sw:skip-waiting'))}
        className="bg-white text-indigo-600 text-sm font-semibold px-3 py-1.5
                   rounded-lg hover:bg-indigo-50 transition-colors"
      >
        Update
      </button>
      <button onClick={() => setShow(false)} className="text-indigo-200 hover:text-white">✕</button>
    </div>
  );
};

export default UpdateBanner;
```

---

## 12. Offline Support & Background Sync

### Offline Banner

```tsx
// src/components/ui/OfflineBanner.tsx
import React from 'react';
import { useOnline } from '@/hooks/useOnline';

const OfflineBanner: React.FC = () => {
  const isOnline = useOnline();
  if (isOnline) return null;

  return (
    <div className="bg-yellow-500 text-yellow-900 text-sm font-medium
                    py-2 px-4 flex items-center gap-2 justify-center"
         role="status" aria-live="polite">
      <span>📵</span>
      <span>You're offline. Changes will sync when you reconnect.</span>
    </div>
  );
};

export default OfflineBanner;
```

### Optimistic Updates (Offline-First Pattern)

```tsx
// Optimistic update — update UI instantly, sync later
const handleToggleTask = async (taskId: string, currentStatus: TaskStatus) => {
  const newStatus = currentStatus === TaskStatus.DONE ? TaskStatus.TODO : TaskStatus.DONE;

  // Optimistically update cache (instant UI feedback)
  dispatch(
    taskApi.util.updateQueryData('getTasks', { projectId: 'current' }, (draft) => {
      const task = draft.find((t) => t.id === taskId);
      if (task) task.status = newStatus;
    })
  );

  try {
    await updateTask({ id: taskId, data: { status: newStatus } }).unwrap();
  } catch {
    // Rollback on failure
    dispatch(taskApi.util.invalidateTags([{ type: 'Task', id: taskId }]));
    showToast('Failed to update task. Will retry when online.', 'error');
  }
};
```

---

## 13. Push Notifications

```typescript
// src/hooks/usePushNotification.ts
import { useState, useCallback } from 'react';
import { authService } from '@/services/authService';

const VAPID_PUBLIC_KEY = import.meta.env.VITE_VAPID_PUBLIC_KEY;

function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = window.atob(base64);
  return Uint8Array.from([...rawData].map((c) => c.charCodeAt(0)));
}

export function usePushNotification() {
  const [permission, setPermission] = useState<NotificationPermission>(
    'Notification' in window ? Notification.permission : 'denied'
  );

  const subscribe = useCallback(async (): Promise<boolean> => {
    if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false;

    const registration = await navigator.serviceWorker.ready;
    const perm = await Notification.requestPermission();
    setPermission(perm);
    if (perm !== 'granted') return false;

    const subscription = await registration.pushManager.subscribe({
      userVisibleOnly:      true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });

    // Send subscription to backend
    await authService.savePushSubscription(subscription);
    return true;
  }, []);

  const unsubscribe = useCallback(async (): Promise<void> => {
    const registration = await navigator.serviceWorker.ready;
    const sub = await registration.pushManager.getSubscription();
    if (sub) {
      await sub.unsubscribe();
      await authService.removePushSubscription();
    }
  }, []);

  return { permission, subscribe, unsubscribe };
}
```

---

## 14. Error Boundaries in Production

```tsx
// src/components/ui/ErrorBoundary.tsx
import React, { Component, ReactNode, ErrorInfo } from 'react';

interface Props {
  children:      ReactNode;
  fallback?:     ReactNode;
  onError?:      (error: Error, info: ErrorInfo) => void;
  resetKeys?:    unknown[];
}

interface State {
  hasError:   boolean;
  error:      Error | null;
  errorInfo:  ErrorInfo | null;
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null, errorInfo: null };

  static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.setState({ errorInfo: info });
    this.props.onError?.(error, info);

    // Send to error tracking (Sentry)
    if (import.meta.env.PROD) {
      console.error('[ErrorBoundary]', error, info);
      // Sentry.captureException(error, { extra: { componentStack: info.componentStack } });
    }
  }

  componentDidUpdate(prevProps: Props): void {
    if (
      this.state.hasError &&
      this.props.resetKeys &&
      this.props.resetKeys.some((key, i) => key !== prevProps.resetKeys?.[i])
    ) {
      this.setState({ hasError: false, error: null, errorInfo: null });
    }
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="min-h-[400px] flex flex-col items-center justify-center p-8 text-center">
          <div className="text-6xl mb-4">💥</div>
          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Something went wrong
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md">
            {this.state.error?.message ?? 'An unexpected error occurred.'}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700
                       transition-colors"
          >
            Try again
          </button>
          {import.meta.env.DEV && this.state.errorInfo && (
            <details className="mt-4 text-left text-xs text-gray-400 max-w-2xl">
              <summary className="cursor-pointer">Stack trace</summary>
              <pre className="mt-2 overflow-auto bg-gray-100 dark:bg-gray-800 p-3 rounded">
                {this.state.errorInfo.componentStack}
              </pre>
            </details>
          )}
        </div>
      );
    }
    return this.props.children;
  }
}

export default ErrorBoundary;
```

---

## 15. React Suspense & Code Splitting

```tsx
// src/App.tsx
import React, { Suspense } from 'react';
import AppRouter     from '@/router';
import { ThemeProvider } from '@/context/ThemeContext';
import { SocketProvider } from '@/context/SocketContext';
import ErrorBoundary from '@/components/ui/ErrorBoundary';
import UpdateBanner  from '@/components/ui/UpdateBanner';
import { Toaster }   from '@/components/ui/Toast';

const App: React.FC = () => (
  <ThemeProvider>
    <ErrorBoundary>
      <SocketProvider>
        {/* Suspense wraps the entire router for lazy-loaded pages */}
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center
                          bg-gray-50 dark:bg-gray-900">
            <div className="flex flex-col items-center gap-4">
              <div className="w-12 h-12 border-4 border-indigo-500 border-t-transparent
                              rounded-full animate-spin" />
              <p className="text-gray-500 dark:text-gray-400 text-sm">Loading TaskFlow...</p>
            </div>
          </div>
        }>
          <AppRouter />
        </Suspense>
        <UpdateBanner />
        <Toaster />
      </SocketProvider>
    </ErrorBoundary>
  </ThemeProvider>
);

export default App;
```

---

## 16. Forms — React Hook Form + Zod

```tsx
// src/components/features/tasks/CreateTaskForm.tsx
import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver }          from '@hookform/resolvers/zod';
import { z }                    from 'zod';
import { TaskPriority, TaskStatus } from '@/types/task.types';
import { useCreateTaskMutation } from '@/store/api/taskApi';

// Zod schema — single source of truth for validation
const createTaskSchema = z.object({
  title:       z.string().min(3, 'Title must be at least 3 characters').max(200),
  description: z.string().max(1000).optional(),
  priority:    z.nativeEnum(TaskPriority),
  status:      z.nativeEnum(TaskStatus),
  dueDate:     z.string().optional(),
  tags:        z.string()
                 .transform((s) => s.split(',').map((t) => t.trim()).filter(Boolean))
                 .optional(),
});

type CreateTaskFormData = z.infer<typeof createTaskSchema>;

const CreateTaskForm: React.FC<{ onSuccess?: () => void }> = ({ onSuccess }) => {
  const [createTask, { isLoading }] = useCreateTaskMutation();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<CreateTaskFormData>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      priority: TaskPriority.MEDIUM,
      status:   TaskStatus.TODO,
    },
    mode: 'onChange', // validate on change for instant feedback
  });

  const onSubmit = async (data: CreateTaskFormData) => {
    try {
      await createTask(data).unwrap();
      reset();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to create task:', err);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>

      {/* Title */}
      <div>
        <label htmlFor="title"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Title *
        </label>
        <input
          id="title"
          {...register('title')}
          className={`w-full px-3 py-2 rounded-lg border
            ${errors.title
              ? 'border-red-400 focus:ring-red-400'
              : 'border-gray-300 dark:border-gray-600 focus:ring-indigo-500'}
            bg-white dark:bg-gray-700 text-gray-900 dark:text-white
            focus:ring-2 focus:border-transparent outline-none transition-colors`}
          placeholder="e.g. Implement user authentication"
        />
        {errors.title && (
          <p className="mt-1 text-xs text-red-500" role="alert">
            {errors.title.message}
          </p>
        )}
      </div>

      {/* Description */}
      <div>
        <label htmlFor="description"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Description
        </label>
        <textarea
          id="description"
          {...register('description')}
          rows={3}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 focus:border-transparent
                     outline-none resize-none transition-colors"
          placeholder="Optional description..."
        />
      </div>

      {/* Priority + Status — side by side on md+ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Priority
          </label>
          <select {...register('priority')}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 outline-none">
            {Object.values(TaskPriority).map((p) => (
              <option key={p} value={p}>{p.charAt(0).toUpperCase() + p.slice(1)}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Status
          </label>
          <select {...register('status')}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                       bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                       focus:ring-2 focus:ring-indigo-500 outline-none">
            {Object.values(TaskStatus).map((s) => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Due Date */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Due Date
        </label>
        <input type="date" {...register('dueDate')}
          className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-indigo-500 outline-none" />
      </div>

      {/* Submit */}
      <button type="submit"
        disabled={!isDirty || !isValid || isLoading}
        className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300
                   text-white font-semibold rounded-lg transition-colors
                   disabled:cursor-not-allowed">
        {isLoading ? 'Creating...' : 'Create Task'}
      </button>
    </form>
  );
};

export default CreateTaskForm;
```

---

## 17. Real-Time with WebSockets (Socket.io)

```tsx
// src/hooks/useTaskSocket.ts
import { useEffect } from 'react';
import { useSocket }    from '@/context/SocketContext';
import { useAppDispatch } from '@/store';
import { taskApi }      from '@/store/api/taskApi';

interface TaskEvent {
  taskId:    string;
  projectId: string;
  userId:    string;
}

export function useTaskSocket(projectId: string) {
  const socket   = useSocket();
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !projectId) return;

    // Join project room
    socket.emit('join:project', projectId);

    // Listen for task changes from other users
    socket.on('task:created', ({ projectId: pid }: TaskEvent) => {
      if (pid === projectId)
        dispatch(taskApi.util.invalidateTags(['Task']));
    });

    socket.on('task:updated', ({ taskId, projectId: pid }: TaskEvent) => {
      if (pid === projectId)
        dispatch(taskApi.util.invalidateTags([{ type: 'Task', id: taskId }]));
    });

    socket.on('task:deleted', ({ taskId }: TaskEvent) => {
      dispatch(taskApi.util.invalidateTags([{ type: 'Task', id: taskId }]));
    });

    // Show typing/editing indicators
    socket.on('task:editing', ({ taskId, userId }: TaskEvent & { userId: string }) => {
      dispatch({ type: 'ui/setTaskEditing', payload: { taskId, userId } });
    });

    return () => {
      socket.emit('leave:project', projectId);
      socket.off('task:created');
      socket.off('task:updated');
      socket.off('task:deleted');
      socket.off('task:editing');
    };
  }, [socket, projectId, dispatch]);
}
```

---

## 18. Accessibility (a11y)

```tsx
// Key a11y practices applied throughout the app

// 1. Skip navigation link (keyboard users)
const SkipLink = () => (
  <a href="#main-content"
     className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4
                bg-indigo-600 text-white px-4 py-2 rounded-lg z-50 font-semibold">
    Skip to main content
  </a>
);

// 2. Focus trap in Modal (using focus-trap-react or manual)
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: ReactNode }> = ({
  isOpen, onClose, title, children
}) => {
  const firstRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (isOpen) firstRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4
                 bg-black/50 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 id="modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h2>
          <button
            ref={firstRef}
            onClick={onClose}
            aria-label="Close modal"
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300
                       p-1 rounded focus:ring-2 focus:ring-indigo-500">
            ✕
          </button>
        </div>
        {children}
      </div>
    </div>,
    document.body
  );
};

// 3. Announce dynamic content to screen readers
const LiveRegion: React.FC<{ message: string }> = ({ message }) => (
  <div aria-live="polite" aria-atomic="true" className="sr-only">
    {message}
  </div>
);

// 4. Icon-only buttons always have aria-label
// ✅ Correct
<button aria-label="Delete task">🗑️</button>
// ❌ Wrong — no accessible name
<button>🗑️</button>

// 5. Color contrast — don't rely on color alone
// ✅ Use icon + color (colorblind safe)
<span className="text-red-500">⚠️ Urgent</span>
// ❌ Color alone
<span className="text-red-500">Urgent</span>
```

---

## 19. Testing — Unit, Integration & E2E

### Vitest + React Testing Library Setup

```typescript
// src/components/features/tasks/TaskCard.test.tsx
import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent }  from '@testing-library/react';
import userEvent                      from '@testing-library/user-event';
import TaskCard                       from './TaskCard';
import { TaskStatus, TaskPriority }   from '@/types/task.types';

const mockTask = {
  id: 'task-1',
  title: 'Test task',
  description: 'A test description',
  status: TaskStatus.TODO,
  priority: TaskPriority.HIGH,
  tags: ['react', 'testing'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  projectId: 'proj-1',
};

describe('TaskCard', () => {
  it('renders task title and priority', () => {
    render(
      <TaskCard
        task={mockTask}
        onStatusChange={vi.fn()}
        onDelete={vi.fn()}
      />
    );
    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
  });

  it('shows tags', () => {
    render(<TaskCard task={mockTask} onStatusChange={vi.fn()} onDelete={vi.fn()} />);
    expect(screen.getByText('#react')).toBeInTheDocument();
    expect(screen.getByText('#testing')).toBeInTheDocument();
  });

  it('calls onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn();
    const user = userEvent.setup();
    render(<TaskCard task={mockTask} onStatusChange={vi.fn()} onDelete={onDelete} />);

    // Hover to reveal delete button
    const card = screen.getByRole('article');
    await user.hover(card);

    const deleteBtn = screen.getByLabelText('Delete task');
    await user.click(deleteBtn);

    expect(onDelete).toHaveBeenCalledWith('task-1');
  });
});
```

### Testing Custom Hooks

```typescript
// src/hooks/useDebounce.test.ts
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from './useDebounce';

describe('useDebounce', () => {
  beforeEach(() => { vi.useFakeTimers(); });
  afterEach(() => { vi.useRealTimers(); });

  it('returns initial value immediately', () => {
    const { result } = renderHook(() => useDebounce('hello', 300));
    expect(result.current).toBe('hello');
  });

  it('debounces updates', () => {
    const { result, rerender } = renderHook(
      ({ value, delay }) => useDebounce(value, delay),
      { initialProps: { value: 'hello', delay: 300 } }
    );

    rerender({ value: 'world', delay: 300 });
    expect(result.current).toBe('hello'); // still old value

    act(() => { vi.advanceTimersByTime(300); });
    expect(result.current).toBe('world'); // updated
  });
});
```

### vitest.config.ts

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path  from 'path';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    globals:     true,
    setupFiles:  ['./src/test/setup.ts'],
    coverage: {
      provider:    'v8',
      reporter:    ['text', 'json', 'html'],
      thresholds:  { lines: 80, functions: 80, branches: 70 },
    },
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, 'src') },
  },
});
```

---

## 20. CI/CD & Deployment

### GitHub Actions

```yaml
# .github/workflows/ci-cd.yml
name: CI/CD

on:
  push:    { branches: [main, develop] }
  pull_request: { branches: [main] }

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --coverage
      - uses: codecov/codecov-action@v3

  build-deploy:
    needs: test
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20', cache: 'npm' }
      - run: npm ci
      - run: npm run build
        env:
          VITE_API_URL:        ${{ secrets.VITE_API_URL }}
          VITE_WS_URL:         ${{ secrets.VITE_WS_URL }}
          VITE_VAPID_PUBLIC_KEY: ${{ secrets.VAPID_PUBLIC_KEY }}

      # Deploy to Vercel (or Netlify / S3+CloudFront)
      - uses: amondnet/vercel-action@v25
        with:
          vercel-token:   ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id:  ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: ./dist
```

---

## 21. PWA Audit Checklist

Run **Lighthouse** (`Chrome DevTools → Lighthouse → Progressive Web App`) to audit your PWA score.

```
✅ HTTPS                            — Required for Service Workers
✅ Web App Manifest                  — name, icons, start_url, display: standalone
✅ Service Worker registered         — handles fetch events
✅ Offline page                      — returns 200 when offline
✅ Precached app shell               — instant repeat visits
✅ Responsive design                 — works on all viewport sizes
✅ Icons (192px + 512px)             — required for install prompt
✅ Maskable icon                     — for Android adaptive icons
✅ Theme color                       — meta tag + manifest
✅ Viewport meta tag                 — <meta name="viewport">
✅ Page fast on slow 3G              — < 10s interactive
✅ No mixed content                  — all assets over HTTPS
✅ Push notifications                — VAPID keys configured
✅ Background sync                   — failed mutations retry
✅ Install prompt captured           — beforeinstallprompt handled
✅ Splash screen                     — background_color + icons
✅ apple-touch-icon                  — for iOS home screen
✅ Shortcuts                         — quick actions in manifest
✅ Screenshots in manifest           — for Play Store / App Store
```

### Lighthouse Score Targets

| Category | Target |
|---|---|
| **Performance** | ≥ 90 |
| **Accessibility** | ≥ 90 |
| **Best Practices** | ≥ 90 |
| **SEO** | ≥ 90 |
| **PWA** | All checks pass |

---

## 22. Senior Interview Q&A

| Question | Key Answer |
|---|---|
| **What makes a web app a PWA?** | HTTPS + Web App Manifest + Service Worker with fetch event handler = installable + offline |
| **Explain Service Worker lifecycle** | Install → Activate → Fetch intercept. New SW waits until old tabs are closed (or `skipWaiting()`) |
| **Cache First vs Network First?** | Cache First = fastest (static assets). Network First = freshest data (API), falls back to cache |
| **How does Background Sync work?** | SW queues failed requests in IndexedDB. When connection restores, `sync` event fires and replays them |
| **How to prevent unnecessary re-renders?** | `React.memo` + `useCallback` + `useMemo` + RTK Query's `providesTags` for selective cache invalidation |
| **What is code splitting and why?** | Lazy load route chunks so users only download JS they need — improves initial load time |
| **How do you handle offline state?** | `navigator.onLine` + `online`/`offline` events + optimistic updates + service worker cache fallback |
| **useTransition vs useDeferredValue?** | `useTransition` — you control the state update. `useDeferredValue` — for values from props you don't own |
| **Why Redux Toolkit over plain Redux?** | RTK includes Immer (mutable syntax), createSlice, createAsyncThunk, RTK Query — less boilerplate |
| **How to test a custom hook?** | `renderHook()` from `@testing-library/react` — renders hook in isolation, inspect `result.current` |
| **How does PWA install prompt work?** | Browser fires `beforeinstallprompt` → you store it → call `prompt()` on user gesture |
| **How do you scale a React app?** | Code splitting, memoization, virtualized lists, CDN, server components (Next.js), edge caching |
| **What is Workbox?** | Google's SW library — precaching, runtime caching strategies, background sync, expiration plugins |
| **Context vs Redux?** | Context for low-frequency global data (theme, user). Redux for high-frequency updates, complex derived state |
| **How does RTK Query help PWA?** | Automatic caching, background refetching, optimistic updates, tag-based invalidation — all offline-friendly |

---

> 💡 **Senior Interview Tip**: When discussing PWA, always mention the **trade-offs**:
> - Service workers add complexity (debugging, update lifecycle)
> - Offline-first requires careful conflict resolution strategies
> - Push notifications require user permission — use contextual prompting
> - Cache invalidation is hard — use cache versioning + workbox expiration
