import React, { Suspense } from 'react';
import type { ReactNode } from 'react';
import { createBrowserRouter, RouterProvider, Link, Outlet } from 'react-router';
import { QueryClientProvider } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';
import './lib/i18n';
import { queryClient } from './lib/queryClient';
import Home from './page/home';
import { ThemeToggle } from './components/ThemeToggle';
const EditorApp = React.lazy(() => import('editor/EditorApp'));
const TemplatesApp = React.lazy(() => import('templates/TemplatesApp'));
const AuthApp = React.lazy(() => import('auth/AuthApp'));

function Layout() {
  const { t } = useTranslation();
  return (
    <div>
      <header className="rf-header">
        <span className="rf-brand">Resumex</span>
        <nav className="rf-nav">
          <Link to="/">{t('nav.home')}</Link>
          <Link to="/editor/demo">{t('nav.editor')}</Link>
          <Link to="/templates">{t('nav.templates')}</Link>
        </nav>
        <div className="rf-nav-actions">
          <ThemeToggle />
          <Link className="rf-btn rf-btn--primary" to="/login">
            {t('nav.login')}
          </Link>
        </div>
      </header>
      <main style={{ padding: 24 }}>
        <Outlet />
      </main>
    </div>
  );
}

function RemoteFallback() {
  return <p>Loading editor remote…</p>;
}

function TemplatesRemoteFallback() {
  return <p>Loading templates remote…</p>;
}

interface BoundaryProps {
  children: ReactNode;
}
interface BoundaryState {
  hasError: boolean;
}

class RemoteErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };
  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <p>Could not load the editor remote. Make sure it is running on http://localhost:3001.</p>
      );
    }
    return this.props.children;
  }
}

class TemplatesRemoteErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };
  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return (
        <p>
          Could not load the templates remote. Make sure it is running on http://localhost:3002.
        </p>
      );
    }
    return this.props.children;
  }
}

class AuthRemoteErrorBoundary extends React.Component<BoundaryProps, BoundaryState> {
  state: BoundaryState = { hasError: false };
  static getDerivedStateFromError(): BoundaryState {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return <p>Could not load the auth remote. Make sure it is running on http://localhost:3003.</p>;
    }
    return this.props.children;
  }
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      {
        path: 'login',
        element: (
          <AuthRemoteErrorBoundary>
            <Suspense fallback={<p>Loading auth remote…</p>}>
              <AuthApp />
            </Suspense>
          </AuthRemoteErrorBoundary>
        ),
      },
      {
        path: 'editor/:id',
        element: (
          <RemoteErrorBoundary>
            <Suspense fallback={<RemoteFallback />}>
              <EditorApp />
            </Suspense>
          </RemoteErrorBoundary>
        ),
      },
      {
        path: 'templates',
        element: (
          <TemplatesRemoteErrorBoundary>
            <Suspense fallback={<TemplatesRemoteFallback />}>
              <TemplatesApp />
            </Suspense>
          </TemplatesRemoteErrorBoundary>
        ),
      },
    ],
  },
]);

export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  );
}