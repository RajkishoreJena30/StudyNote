'use client';

import clsx from 'clsx';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Button } from '@/components/ui';
import { useAuth } from '@/lib/auth-context';

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/tasks', label: 'Tasks' },
  { href: '/dashboard/goals', label: 'Goals & Focus' },
  { href: '/dashboard/billing', label: 'Billing' },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      router.replace('/login');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center text-slate-400">
        Loading…
      </div>
    );
  }

  return (
    <div className="flex min-h-screen">
      <aside className="hidden w-64 shrink-0 flex-col border-r border-slate-800 bg-slate-900/40 p-5 md:flex">
        <div className="mb-8 flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-500 font-bold text-white">
            T
          </div>
          <span className="text-lg font-semibold">TimeTracker</span>
        </div>

        <nav className="flex flex-1 flex-col gap-1">
          {NAV.map((item) => {
            const active =
              item.href === '/dashboard'
                ? pathname === item.href
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  'rounded-lg px-3 py-2 text-sm transition',
                  active
                    ? 'bg-indigo-500/15 text-indigo-300'
                    : 'text-slate-300 hover:bg-slate-800',
                )}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="mt-6 border-t border-slate-800 pt-4">
          <p className="text-sm font-medium text-slate-200">{user.name}</p>
          <p className="truncate text-xs text-slate-500">{user.email}</p>
          <Button
            variant="outline"
            className="mt-3 w-full"
            onClick={() => {
              void logout().then(() => router.replace('/login'));
            }}
          >
            Sign out
          </Button>
        </div>
      </aside>

      <main className="flex-1 overflow-y-auto p-6 lg:p-10">{children}</main>
    </div>
  );
}
